import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
interface chargesTypes{
  isEdit:boolean,
  sales:boolean,
  purchase:boolean,
  vehicleCategory:boolean
  data:any,
  charge_name:string
  isDisableSeletAll:boolean,
  popupName:string
}
@Component({
  selector: 'app-add-additional-charge-popup',
  templateUrl: './add-additional-charge-popup.component.html',
  styleUrls: ['./add-additional-charge-popup.component.scss']
})
export class AddAdditionalChargePopupComponent implements OnInit {

  staticOptions: any = {};
  initialValues = {
    units: getBlankOption(),
    tax: getNonTaxableOption(),
    account: getBlankOption(),

  };
  accountList = []
  showAddCoaPopup = {}
  coaParams = { name: '' }
  additionalCharges: FormGroup;
  charge_error_msg: string = '';
  isEdit: boolean;
  sku_msg_error = '';
  isDisableSelectAll = false;
  disableType = -1;
  taxOptions = []
  defaultTax = new ValidationConstants().defaultTax;
  isTax = false;
  isValidForm = true;
  apiError=''
  isSalesDisabled=false;
  isPurchaseDisabled=false;
  isVehicleCategory=false;
  chargesData:chargesTypes
  display_msg_error=''
  vehicleCategories=[]
  currency_type:any;

  constructor(private _fb: FormBuilder, private dialogRef: DialogRef<any>, private _taxService: TaxModuleServiceService, private _tax: TaxService,
    @Inject(DIALOG_DATA) private dialogData: chargesTypes, private _commonService: CommonService, private _rateCard: RateCardService, private _revenueService: RevenueService,
    private currency: CurrencyService) { }

  ngOnInit(): void {
    this._commonService.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategories = resp['result']['categories']
    })
    this.isTax = this._tax.getTax();
    this.getTaxDetails();
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this._revenueService.getAccounts('Expense').subscribe((response) => {
      this.accountList = response.result;
    });
    this.chargesData=this.dialogData
    this.chargesData.popupName='Additional Charge'
    this.additionalCharges.get('name').setValue( this.chargesData.charge_name)
    this.isSalesDisabled=this.chargesData.sales;
    this.isPurchaseDisabled=this.chargesData.purchase;
    this.isVehicleCategory=this.chargesData.vehicleCategory
    if(this.isSalesDisabled){
      this.additionalCharges.get('sales').setValue(this.isSalesDisabled)
      this.salesChange();
      let vehicleCategory=this.chargesData.data
      if(typeof vehicleCategory=='number'){
        vehicleCategory=vehicleCategory.toString()
      }
      this.additionalCharges.patchValue({
        crane:vehicleCategory.includes(1),
        awp: vehicleCategory.includes(2),
        others: vehicleCategory.includes(0),
        container:vehicleCategory.includes(4),
      })
      this.disableType=this.chargesData.data
      this.isDisableSelectAll=this.chargesData.isDisableSeletAll
    }
    if(this.isPurchaseDisabled){
      this.chargesData.popupName='Expense'
      this.additionalCharges.get('purchase').setValue(this.isPurchaseDisabled);
      this.purchaseChange();
    }

    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
        this.staticOptions.itemUnits = response.result['item-unit'];
      });
    this.isEdit =this.chargesData.isEdit;
    if (this.isEdit) {
      this.initialValues.units.label = this.dialogData.data.selectedOption
      this.initialValues.tax = this.dialogData.data['tax'] ? { label: this.dialogData.data['tax'].label, value: '' } : getNonTaxableOption();
      this.additionalCharges.patchValue({
        unit_of_measurement: this.dialogData.data.unit_of_measurement,
        vehicle_category: this.dialogData.data.vehicle_category,
        name: this.dialogData.data.name,
        sku: this.dialogData.data.sku,
        tax: this.dialogData.data['tax'] ? this.dialogData.data['tax']['id'] : this.defaultTax
      })
      let categories: any[] = this.dialogData.data.vehicle_category;
      if (categories.includes(1)) {
        this.additionalCharges.get('crane').setValue(true);
      }
      if (categories.includes(2)) {
        this.additionalCharges.get('awp').setValue(true);
      }
      if (categories.includes(0) || categories.includes(3)) {
        this.additionalCharges.get('others').setValue(true);
      }
      if (categories.length == 3) {
        this.additionalCharges.get('allSelect').setValue(true);
      }

    }

  }

  buildForm() {
    this.additionalCharges = this._fb.group({
      name: ['', [Validators.required]],
      sku: [''],
      unit_of_measurement: [null, [Validators.required]],
      tax: this.defaultTax,
      type: 1,
      rate: 0.00,
      purchase_unit_cost: 0.00,
      hsn_code: '',
      sales: false,
      account: null,
      purchase: false,
      vehicle_category: [[]],
      crane:false,
      container:false,
      awp: false,
      others:false,
      allSelect:false

    })
  }

  checkAll() {
    let form = this.additionalCharges as FormGroup;
    form.patchValue({
      crane: form.get('allSelect').value,
      awp: form.get('allSelect').value,
      others: form.get('allSelect').value,
      container: form.get('allSelect').value,
    })
  }

  selectCategory() {
    let form = this.additionalCharges as FormGroup;
    this.display_msg_error=''
    if (form.get('crane').value && form.get('awp').value && form.get('others').value&& form.get('container').value ) {
      form.get('allSelect').setValue(true)
    } else {
      form.get('allSelect').setValue(false)
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  close() {
    this.dialogRef.close()
  }

  saveForm(form: FormGroup) {
    if(form.value['crane']){
        form.value['vehicle_category'].push(1)
    }
    if(form.value['awp']){
     form.value['vehicle_category'].push(2)
    }
    if(form.value['others']){
     form.value['vehicle_category'].push(0)
    }
     if(form.value['container']){
      form.value['vehicle_category'].push(4)
     }
    let isVehicleValid=true
    if(this.isVehicleCategory){
      if(form.value['vehicle_category'].length==0){
        isVehicleValid=false;
        this.display_msg_error='Please Select at least one vehicle Category'
      }
    }
    this.isValidForm= form.get('sales').value||form.get('purchase').value
    if(form.valid && this.isValidForm && isVehicleValid){ 
      if(this.isEdit){
        this._rateCard.upDateAdditionalChargePopUpDate(this.dialogData.data.id,form.value).subscribe(resp=>{
          this.dialogRef.close(resp.result)
        }, (err) => {
            this.charge_error_msg = '';
            this.sku_msg_error=''
            if (err.error.message.includes('Item name already exists.')) {
              this.charge_error_msg = 'Item name already exists.';
            } else if (err.error.message.includes('Item SKU already exists.'))  {
              this.sku_msg_error='Item SKU already exists.'
            }else{
              this.apiError = err.error.message;
            }
          });
      }else{
        this._rateCard.postAdditionalChargePopUpDate(form.value).subscribe(resp=>{
          this.dialogRef.close(resp.result)
          }, (err) => {
            this.charge_error_msg = '';
            this.sku_msg_error=''
            if (err.error.message.includes('Item name already exists.')) {
              this.charge_error_msg = 'Item name already exists.';
            } else if (err.error.message.includes('Item SKU already exists.'))  {
              this.sku_msg_error='Item SKU already exists.'
            }else{
              this.apiError = err.error.message;
            }
          });
      }
    
    }
    else {
      setAsTouched(form)
    }

  }

  getTaxDetails() {
    this._taxService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }

  salesChange() {
    let form = this.additionalCharges as FormGroup;
    this.isValidForm = true
    if (!form.get('sales').value) {
      form.patchValue({
        crane: false,
        awp: false,
        others: false,
        container:false,
        rate: 0.00,
        allSelect: false,
      })
      setUnsetValidators(form, 'rate', [Validators.nullValidator])
    } else {
      setUnsetValidators(form, 'rate', [Validators.min(0.01)])
    }
  }

  purchaseChange() {
    this.isValidForm = true
    let form = this.additionalCharges as FormGroup;
    if (!form.get('purchase').value) {
      form.patchValue({
        purchase_unit_cost: 0.00,
        account: null
      })
      this.initialValues.account = getBlankOption();
      setUnsetValidators(form, 'purchase_unit_cost', [Validators.nullValidator])
      setUnsetValidators(form, 'account', [Validators.nullValidator])
    } else {
      setUnsetValidators(form, 'purchase_unit_cost', [Validators.min(0.01)])
      setUnsetValidators(form, 'account', [Validators.required])
    }
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
      let purchaseForm = this.additionalCharges as FormGroup;
      purchaseForm.patchValue({
        account:e['id']
      })
      this.initialValues.account={label:e['label'],value:e['id']}
      this._revenueService.getAccounts('Expense').subscribe((response) => {
        this.accountList = response.result;
      });
    }
  }


}
