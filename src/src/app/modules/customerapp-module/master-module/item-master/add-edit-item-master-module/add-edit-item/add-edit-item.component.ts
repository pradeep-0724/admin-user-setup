import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { ItemMasterService } from 'src/app/modules/customerapp-module/api-services/master-module-services/item-service/item.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';

@Component({
  selector: 'app-add-edit-item',
  templateUrl: './add-edit-item.component.html',
  styleUrls: ['./add-edit-item.component.scss']
})
export class AddEditItemComponent implements OnInit {

  itemMasterForm: FormGroup;
  apiError = ''
  prefixUrl = getPrefix();
  taxOptions = [];
  unitOptions = []
  accountList = []
  showAddCoaPopup = {}
  coaParams = { name: '' }
  initialValues={
    tax:getNonTaxableOption(),
    unit:getBlankOption(),
    account:getBlankOption(),
  }
  defaultTax = new ValidationConstants().defaultTax;
  nameError=''
  skuError=''
  itemId=''
  isValidForm=true;
  vehicleCategories=[]
  currency_type:any;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;

  constructor(private _fb: FormBuilder, private _commonService: CommonService, private _revenueService: RevenueService,private _activateRoute:ActivatedRoute,
     private _taxService: TaxModuleServiceService,private _itemService:ItemMasterService,private _router:Router, private _scrollToTop:ScrollToTop,
     private currency: CurrencyService,private apiHandler: ApiHandlerService, private _analytics: AnalyticsService,) {

  }

  ngOnInit(): void {
    this.buildForm();
    this._commonService.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategories = resp['result']['categories']
    })
    this.currency_type = this.currency.getCurrency();
    this._commonService.getStaticOptions('tax,item-unit').subscribe((response) => {
      this.unitOptions = response.result['item-unit'];
    })
    this._taxService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
    this._revenueService.getAccounts('Expense').subscribe((response) => {
      this.accountList = response.result;
    });

    this._activateRoute.params.subscribe(prams => {
     if(prams['edit-id']){
      this.itemId=prams['edit-id']
      this._itemService.getItemDetails(this.itemId).subscribe(resp=>{
        this.patchItemMaster(resp['result'])
       })
     }
    })
  }

  buildForm() {
    this.itemMasterForm = this._fb.group({
      type: 1,
      sku: '',
      name: ['',[Validators.required]],
      unit_of_measurement: null,
      hsn_code: '',
      tax:this.defaultTax,
      sales: this._fb.group({
        sales: true,
        rate:[0.00,[Validators.min(0.01)]],
        select_all: false,
        crane: false,
        awp: false,
        others: false,
        container:false
      }),
      purchase: this._fb.group({
        purchase: false,
        purchase_unit_cost: 0.00,
        account: null
      })
    })
  }

  saveItems() {
    let form = this.itemMasterForm
    this.isValidForm= this.itemMasterForm.get('sales.sales').value||this.itemMasterForm.get('purchase.purchase').value
    if(form.valid && this.isValidForm){
      if(this.itemId){
        this.apiHandler.handleRequest(this._itemService.putItemDetails(this.itemId, this.prepareRequest(form.value)), 'Item master updated successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.ITEM)
              this._router.navigate([this.prefixUrl + '/onboarding/item/list'])
            },
            error: (err) => {
              this._scrollToTop.scrollToTop();
              this.nameError = '';
              this.skuError = ''
              if (err.error.message.includes('Item name already exists.')) {
                this.nameError = 'Item name already exists.';
              } else if (err.error.message.includes('Item SKU already exists.')) {
                this.skuError = 'Item SKU already exists.'
              } else {
                this.apiError = err.error.message;
              }
            }
          }
        );
      }else{
        this.apiHandler.handleRequest(this._itemService.postItemDetails(this.prepareRequest(form.value)), 'Item master added successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.ITEM)
              this._router.navigate([this.prefixUrl + '/onboarding/item/list'])
            },
            error: (err) => {
              this._scrollToTop.scrollToTop();
              this.nameError = '';
              this.skuError = ''
              if (err.error.message.includes('Item name already exists.')) {
                this.nameError = 'Item name already exists.';
              } else if (err.error.message.includes('Item SKU already exists.')) {
                this.skuError = 'Item SKU already exists.'
              } else {
                this.apiError = err.error.message;
              }
            }
          }
        );
      }
    
    }else{
      setAsTouched(form)
      this._scrollToTop.scrollToTop();
    }
    
  }

  prepareRequest(value) {
     let vehiclecategory=[];
     if(value['sales']['crane']){
      vehiclecategory.push(1)
     }
     if(value['sales']['awp']){
      vehiclecategory.push(2)
     }
     if(value['sales']['others']){
      vehiclecategory.push(0)
     }
     if(value['sales']['container']){
      vehiclecategory.push(4)
     }
    let payLoad={
      name:value['name'],
      rate: value['sales']['rate'],
      vehicle_category:vehiclecategory,
      unit_of_measurement:value['unit_of_measurement']?value['unit_of_measurement']:null,
      tax:value['tax'],
      sku:value['sku'],
      hsn_code:value['hsn_code'],
      sales:value['sales']['sales'],
      purchase:value['purchase']['purchase'],
      purchase_unit_cost:value['purchase']['purchase_unit_cost'],
      type:value['type'],
      account:value['purchase']['account']?value['purchase']['account']:null
  }

    return payLoad
  }

  openAddCoaModal($event) {
    if ($event)
      this.showAddCoaPopup = { name: this.coaParams.name, status: true };
  }

  closeCoaPopup() {
    this.showAddCoaPopup = { name: '', status: false };
  }

  addParamsCoaItem($event) {
    this.coaParams = {
      name: $event
    };
  }

  addExpenseToOption(e) {
    if(e['id']){
      let purchaseForm = this.itemMasterForm.get('purchase') as FormGroup;
      purchaseForm.patchValue({
        account:e['id']
      })
      this.initialValues.account={label:e['label'],value:e['id']}
      this._revenueService.getAccounts('Expense').subscribe((response) => {
        this.accountList = response.result;
      });
    }
 
  }


  checkAll() {
    let form = this.itemMasterForm.get('sales') as FormGroup;
    form.patchValue({
      crane: form.get('select_all').value,
      awp: form.get('select_all').value,
      others: form.get('select_all').value,
      container: form.get('select_all').value,
    })


  }

  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
  }

  selectCategory() {
    let form = this.itemMasterForm.get('sales') as FormGroup;
    if (form.get('crane').value && form.get('awp').value && form.get('others').value && form.get('container').value) {
      form.get('select_all').setValue(true)
    } else {
      form.get('select_all').setValue(false)
    }
  }

  salesChange(){
    let form = this.itemMasterForm.get('sales') as FormGroup;
    this.isValidForm=true
    if (!form.get('sales').value) {
      form.patchValue({
        crane: false,
        awp: false,
        container: false,
        others: false,
        rate: 0.00,
        select_all: false,
      })
      setUnsetValidators(form,'rate',[Validators.nullValidator])
    }else{
      setUnsetValidators(form,'rate',[Validators.min(0.01)])
    }
  }

  purchaseChange(){
    this.isValidForm=true
    let form = this.itemMasterForm.get('purchase') as FormGroup;
    if (!form.get('purchase').value) {
      form.patchValue({
        purchase_unit_cost: 0.00,
        account: null
      })
      this.initialValues.account=getBlankOption();
      setUnsetValidators(form,'purchase_unit_cost',[Validators.nullValidator])
      setUnsetValidators(form,'account',[Validators.nullValidator])
    }else{
      setUnsetValidators(form,'purchase_unit_cost',[Validators.min(0.01)])
      setUnsetValidators(form,'account',[Validators.required])
    }
  }

  patchItemMaster(data){
    let salseForm = this.itemMasterForm.get('sales') as FormGroup;
    let purchaseForm = this.itemMasterForm.get('purchase') as FormGroup;
    if(data['unit_of_measurement']){
      this.initialValues.unit={label:data['unit_of_measurement']['label'],value:data['unit_of_measurement']['id']}
      data['unit_of_measurement']=data['unit_of_measurement']['id']
    }
    if(data['tax']){
      this.initialValues.tax={label:data['tax']['label'],value:data['tax']['id']}
      data['tax']=data['tax']['id']
    }

    if(data['account']){
      this.initialValues.account={label:data['account']['name'],value:data['account']['id']}
    }

    salseForm.patchValue({
      rate: data['rate'],
      sales:data['sales'],
      crane: data['vehicle_category'].includes(1),
      awp: data['vehicle_category'].includes(2),
      others: data['vehicle_category'].includes(0),
      container: data['vehicle_category'].includes(4)
    });
    if(!data['sales']){
      setUnsetValidators(salseForm,'rate',[Validators.nullValidator])
    }
    this.selectCategory()
    this.itemMasterForm.patchValue(data)
    purchaseForm.patchValue({
      purchase: data['purchase'],
      purchase_unit_cost:data['purchase_unit_cost'],
      account:data['account']?data['account']['id']:null
    })
  }




}
