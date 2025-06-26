import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { isValidValue, getObjectFromList, getMinOrMaxDate, getBlankOption, getNonTaxableOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { changeDateToServerFormat, PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { BehaviorSubject } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { ActivatedRoute, Router } from '@angular/router';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { InventoryServiceClass } from './inventoryServiceClass';
import { InventoryService } from '../../../api-services/inventory-service/inventory.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { OperationsActivityService } from '../../../api-services/operation-module-service/operations-activity.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { Inventory } from './inventory.class';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { InventoryClass } from './inventory-class/inventory.class';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';



@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.scss'],
  host: {
		"(window:click)": "clickOutToHide($event)"
	  }
})
export class EditInventoryComponent extends InventoryClass implements OnInit {
  editInventoryForm: UntypedFormGroup;
  inventoryClass= new Inventory();
  saveButton:boolean;
  inventoryVariables;
  inventoryData = new BehaviorSubject({});
  isFormValid=new BehaviorSubject({});
  inputData ={};
  newSpareAndTyreDataForm:any
  globalFormErrorList: any = [];
  errorHeaderMessage = new ErrorList().headerMessage;
  possibleErrors = new ErrorList().possibleErrors;
  isAmountUsed:boolean;
  inventoryDetails:any;
  radioOptions=[{
    name:"New Spares",
    value:'new_spares'
  },
  {
    name:"New Tyres",
    value:'new_tyres'
  }];
  inventaryId:''
  apiError: string = "";
  currency_type;
  documentPatchData: any=[];
  patchFileUrls=new BehaviorSubject([]);
  vendorDetails;
  isDueDateRequired= false;
  staticOptions: any = {};
  initialValues: any = {
    units: [],
    expenseAccount: [],
    item: [],
    adjustmentAccount: getBlankOption(),
    manufacturer:[],
    threadType:[],
    model:[],
    taxPercent:[getNonTaxableOption()],
    tax:getNonTaxableOption()
  };
  materialList: any = [];
  afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
  alphaNumericPattern= new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  expenseAccountList: any = [];
  unit={
    label:'UNIT',
    value:''
  };
  showCustomFieldsByDefault: boolean = false;


  showAddExpenseItemPopup: any = {name: '', status: false};
  expenseItemDropdownIndex: number = -1;
  newSparesItemParams: any = {
		name: '',
    };
    isUniqueNumber:boolean=true;
    makePlaceholderOption: any = { label: 'MAKE', value: null }
    modelPlaceholderOption: any = { label: 'MODEL', value: null }
    typePlaceholderOption: any = { label: 'TYPE', value: null }

    inventoryNewTotal: any = {
      subtotal: 0,
      subtotalspare:0.0,
      subtotaltyre:0.0,
     subtotal_challan: 0.0,
     subtotal_others: 0.0,
     discountTotal: 0,
     taxes: [],
     discountAfterTaxTotal: 0,
     tdsAmount: 0,
     adjustmentAmount: 0,
       total: 0,
       totalspare: 0,
       totaltyre: 0,
     balance: 0.0
     };

     manufacturerParams: any = {};
     threadTypeParams: any = {};
     tyreModel = [];
     modelApi = '';
     newTyreItemPerms: any = {
       name: '',
       };
       modelParams = {
         name: ''
       };
       manufacturerApi = TSAPIRoutes.static_options;
       itemsDisable: any=[];
       approvedPurchasedOrderData = [];
       AreSparesPresent = true;
       AreTyrePresent = true;
       isQuantityEditable = false;
       isUniqueNumberEditable = false;
       isPoNumberSelected= false;

  purchaseOrderData: any =[];
  poId: any = '';
  partyDetailsData={
    isPartyRegistered:true,
    taxDeatils:{},
    placeOfSupply:[],
    companyRegistered:true
  };
  isTransactionIncludesTax=false;
  isTransactionUnderReverse= false;
 lastSectiondata={
   data:[]
 }
  partyTaxDetails = new BehaviorSubject<any>(this.partyDetailsData);
  lastSectionTaxDetails = new BehaviorSubject<any>(this.lastSectiondata);
  isTax = false;
  placeOfSupply=[];
  taxOptions=[];
  tdsOptions=[];
  editData = new BehaviorSubject<any>({});
  lastSectionEditData = new BehaviorSubject<any>({});
  isTaxFormValid :boolean=true;
  taxFormValid =new BehaviorSubject<any>(true);
  disableTax: boolean = false;
  defaultTax = new ValidationConstants().defaultTax;
  companyRegistered=true;
  gstin='';
  prefixUrl: any;
  isTdsDecleration = false;
  isTds=false;
  terminology :any;
  policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  isPaymentstatusValid=true;
  $paymentStatusValid = new BehaviorSubject(true)



  constructor(
    private _fb: UntypedFormBuilder,
    private _inventoryServiceClass:InventoryServiceClass,
    private _partyService: PartyService,
    private _saveInventory: InventoryService,
    private _route:Router,
    private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private currency:CurrencyService,
    private _operationsActivityService: OperationsActivityService,
    private _revenueService: RevenueService,
    private _vehicleService: VehicleService,
    private _taxService : TaxModuleServiceService,
    private _tax:TaxService,
    private _prefixUrl:PrefixUrlService,
    private _analytics:AnalyticsService,
    private _terminologiesService:TerminologiesService,
  ) {
    super();
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
    this.getTaxDetails();
    this.terminology = this._terminologiesService.terminologie;
   }

  ngOnInit() {
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this._activatedRoute.params.subscribe((response: any) => {
      this.inventaryId =response.id;
      this.getVendorDetails();
      this.getStaticOptions();
      this.inventoryVariables = this.inventoryClass.getVariables();
      this.buildForm();
      this.getInventoryDetails();
      this.getExpenseAccountsAndSetAccount();
      this.getMaterials();
      this._commonService
      .getStaticOptions(
        'billing-payment-method,gst-treatment,payment-term,tax,tds,item-unit,tyre-manufacturer,tyre-thread-type'
      )
      .subscribe((response) => {
        this.staticOptions.paymentMethods = response.result['billing-payment-method'];
        this.staticOptions.itemUnits = response.result['item-unit'];
        this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
        this.staticOptions.threadType = response.result['tyre-thread-type'];
      });

      if(!this.inventaryId){
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVENTORYNEWBILL,this.screenType.EDIT,"Navigated");
        this.editInventoryForm.controls['bill_date'].setValue(new Date(dateWithTimeZone()));
        this.editInventoryForm.controls['reminder'].setValue(new Date(dateWithTimeZone()));
        this.addMoreOtherItem();
        this.addMoreTyreItem();
        this._activatedRoute.queryParams.subscribe((params)=>{
          this.poId=params.poNumber;
        })
        if(this.poId){
          this.onPurchaseOrderNumberSelected(this.poId);
      }
      }else{
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVENTORYNEWBILL,this.screenType.ADD,"Navigated");

      }
    });
  }
  clickOutToHide(e){
    this.saveButton = false;
}
  onPurchaseOrderNumberSelected(id){
    if(id){
     this._saveInventory.getPurchaseOrderData(id).subscribe((res)=>{
       this.purchaseOrderData = res['result'];
       if(this.purchaseOrderData.payment_term){
         this.patchingInitailDropdown(this.purchaseOrderData,'label','paymentTerm','payment_term','payment_term');
         this.onpaymentTermSelected(this.purchaseOrderData.payment_term.id);
       }
       if(this.poId){
         this.getApprovedPurchaseOrderList(this.purchaseOrderData.vendor.id);
         this.patchingInitailDropdown(this.purchaseOrderData,'display_name','vendor','vendor','vendor')
         this.patchPurchaseOrder(this.purchaseOrderData);
         this._partyService.getPartyAdressDetails(this.purchaseOrderData.vendor.id).subscribe(res => {
          this.inventoryVariables.vendorSelected = res.result;
          this.gstin =  this.inventoryVariables.vendorSelected.tax_details.gstin;
          this.isTdsDecleration = this.inventoryVariables.vendorSelected.tax_details.tds_declaration;
          if(this.gstin =='Unregistered'){
             this.partyDetailsData={
              isPartyRegistered:false,
              taxDeatils:  this.inventoryVariables.vendorSelected.tax_details,
              placeOfSupply: this.placeOfSupply,
              companyRegistered: this.companyRegistered
            }
            this.partyTaxDetails.next( this.partyDetailsData)
          }else{
            this.partyDetailsData={
              isPartyRegistered:true,
              taxDeatils:  this.inventoryVariables.vendorSelected .tax_details,
              placeOfSupply: this.placeOfSupply,
              companyRegistered: this.companyRegistered
            }
            this.partyTaxDetails.next(this.partyDetailsData)
          }
        });
       }
       this.editInventoryForm.get('po_date').setValue(this.purchaseOrderData.po_date);
       this.AreSparesPresent = false;
       this.AreTyrePresent = false;
       this.isPoNumberSelected = true;
       this.editInventoryForm.get('po').setValidators([Validators.required]);
       this.editInventoryForm.get('po').updateValueAndValidity();
       this.patchPoSparesAndTyresData(this.purchaseOrderData);
     })
   }
   else{
     this.editInventoryForm.get('po_date').setValue(null);
     this.clearAllOtherItems();
     this.clearAllOtherTyreItems();
     this.AreSparesPresent = true;
     this.AreTyrePresent = true;
     this.isPoNumberSelected = false;
     this.editInventoryForm.get('po').setValidators(null);
     this.editInventoryForm.get('po').updateValueAndValidity();
   }
   }

   patchPurchaseOrder(data){
    this.inventoryVariables.initialValues.po['label'] = data.po_number;
    this.inventoryVariables.initialValues.po['value'] = data.id;
    this.editInventoryForm.get('po').setValue(data.id);
  }

  patchPoSparesAndTyresData(data){
    let otherSpareItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
    let otherTyreItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
     if(data.spares.length > 0){
      this.deleteAllOtherItems();
      this.isQuantityEditable = false ;
      data.spares.forEach((ele,index)=>{
        otherSpareItems.push(this.buildNewSpares(ele));
        if (ele.item){
          this.initialValues.item.push({value: ele.item.id, label: ele.item.name})
          otherSpareItems.at(index).get('item').setValue(ele.item.id);
        }
        else {
          this.initialValues.item.push(getBlankOption());
        }

        if (ele.unit){
          this.initialValues.units.push({value: ele.unit.id, label: ele.unit.label})
          otherSpareItems.at(index).get('unit').setValue(ele.unit.id);
        }
        else {
          this.initialValues.units.push(getBlankOption());
        }
        this.calculateItemAmount(index);
        this.calculateItemAmount(index);
      })
     }
     else{
       this.clearAllOtherItems();
       this.isQuantityEditable = true ;
     }
     if(data.tyres.length >0){
      this.deleteAllTyreItems();
      this.isUniqueNumberEditable = false
      let quantityOfTyres = [];
      data.tyres.forEach((ele)=>{
        quantityOfTyres.push(ele.quantity);
      })

  for(let i=0; i < quantityOfTyres.length ; i++ ){
    let temp = quantityOfTyres[i];
    for(let j =0 ; j < temp ; j ++){
      data.tyres.forEach((ele)=>{
        otherTyreItems.push(this.buildNewTyres(ele));
        this.itemsDisable[j]=true;
        if (ele.manufacturer){
          this.initialValues.manufacturer.push({value: ele.manufacturer.id, label: ele.manufacturer.label})
          otherTyreItems.at(j).get('manufacturer').setValue(ele.manufacturer.id);
        }
        else {
          this.initialValues.manufacturer.push(getBlankOption());
        }
        if (ele.tyre_model){
          this.initialValues.model.push({value: ele.tyre_model.id, label: ele.tyre_model.name})
          otherTyreItems.at(j).get('tyre_model').setValue(ele.tyre_model.id);
        }
        else {
          this.initialValues.model.push(getBlankOption());
        }
        if (ele.thread_type){
          this.initialValues.threadType.push({value: ele.thread_type.id, label: ele.thread_type.label})
          otherTyreItems.at(j).get('thread_type').setValue(ele.thread_type.id);
        }
        else {
          this.initialValues.threadType.push(getBlankOption());
        }
        this.patchModels(ele);
      })
      this.onCalcuationsChanged();
    }
  }
     }
     else{
      this.clearAllTyreItems();
      this.isUniqueNumberEditable = true;
     }
   }

  getExpenseAccountsAndSetAccount() {
    this._revenueService.getAccounts('Expense,Other Expense,Cost of Services / COGS').subscribe((response) => {
      if (response !== undefined) {
        this.expenseAccountList = response.result;
        if(!this.inventaryId){
          this.inventoryVariables.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
          this.editInventoryForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
        }
      }
    });
  }

  getMaterials(){
    this._operationsActivityService.getSpareItems().subscribe((response) => {
			if (response !== undefined) {
				this.materialList = response.result;
			}
		});
  }

  openAddExpenseItemModal($event, index) {
		if ($event)
		  this.expenseItemDropdownIndex = index;
		  this.showAddExpenseItemPopup = {name: this.newSparesItemParams.name, status: true};
		}

    closeNewSparesItemPopup(){
      this.showAddExpenseItemPopup = {name: '', status: false};
    }

    addDropDownNewSapre($event) {
      if ($event) {
        this._operationsActivityService.getSpareItems().subscribe((response) => {
        if (response && response.result && response.result.length > 0) {
          this.materialList = response.result;
          if (this.expenseItemDropdownIndex != -1){
          this.initialValues.item[this.expenseItemDropdownIndex] = {value: $event.id, label: $event.label};
          let other_expense = this.editInventoryForm.controls['spares'] as UntypedFormArray;
            other_expense.at(this.expenseItemDropdownIndex).get('item').setValue($event.id);
            let itemExpenseControl = other_expense.at(this.expenseItemDropdownIndex) as UntypedFormGroup;
            this.resetOtherExpenseExceptItem(itemExpenseControl, this.expenseItemDropdownIndex);
            this.onChangeOtherExpenseItem(this.expenseItemDropdownIndex);
            this.expenseItemDropdownIndex = -1;
          }
        }
        });
      }
    }

    resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index){
      formGroup.patchValue({unit: null, unit_cost: 0,  total: 0, quantity: 0, total_before_tax: 0,  expense_account: null});
      this.initialValues.units[index] =this.unit;
      this.initialValues.expenseAccount[index] = getBlankOption();
    }

    onChangeOtherExpenseItem(index) {
      const newSpares = this.editInventoryForm.controls['spares'] as UntypedFormArray;
      const newSpareExpanse = newSpares.at(index);
      const itemId = newSpareExpanse.get('item').value;
      if (itemId) {
        const expenseItem = getObjectFromList(itemId,this.materialList);
        if (expenseItem) {
          if (expenseItem.unit){
          newSpareExpanse.get('unit').setValue(expenseItem.unit.id);
          this.initialValues.units[index] = {label: expenseItem.unit.label, value: expenseItem.unit.id}
          }
          else {
            newSpareExpanse.get('unit').setValue(null);
          this.initialValues.units[index] =this.unit;
          }
          newSpareExpanse.get('unit_cost').setValue(expenseItem.rate_per_unit);
          newSpareExpanse.get('hsn_code').setValue(expenseItem.hsn_code);

        }
      }
      this.onCalcuationsChanged();
      }

      addParamsToNewSpareItem($event) {
        this.newSparesItemParams = {
          name: $event
        };
      }

      addParamsToNewTyreItem($event) {
        this.newTyreItemPerms = {
          name: $event
        };
      }

      onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
        const newSpares = this.editInventoryForm.controls['spares'] as UntypedFormArray;
        const newSpareExpanse = newSpares.at(index);
        const itemId = newSpareExpanse.get('item').value;
        let itemvalue=this.materialList.filter(item => item.id==itemId)
        newSpareExpanse.get('hsn_code').setValue(itemvalue[0].hsn_code)
        this.resetOtherExpenseExceptItem(itemExpenseControl, index);
        this.onChangeOtherExpenseItem(index);
        }


  getStaticOptions(){
    this._inventoryServiceClass.getStaticOptions(data=>{
          this.inventoryVariables.staticOptions['paymentTermList']=data['payment-term'];
          this.inventoryVariables.staticOptions['treatmentList']=data['gst-treatment'];
      });
    this._inventoryServiceClass.getDestinationOfSupply(data=>{
         this.inventoryVariables.staticOptions['placeOfDestinationStateList'] =data;
     });
    this._inventoryServiceClass.getEmployeeList(data=>{
         this.inventoryVariables.staticOptions['employeeList'] =data;
   });
   this._inventoryServiceClass.getAccounts(data=>{
     this.inventoryVariables.paymentAccountList=data
   });
   }

   getVendorDetails(){
    this._inventoryServiceClass.getVendorDetails(data=>{
      this.inventoryVariables.vendorList=data
    });
  }

   getInventoryDetails(){
     if(this.inventaryId){
     this._saveInventory.getInventoryDetails(this.inventaryId).subscribe(data=>{
       this.inventoryDetails=data.result;
       this.patchForm(this.inventoryDetails);
       if(this.isTax){
         this.onVendorId(this.inventoryDetails['vendor'].id);
       }
       this.patchDocuments(this.inventoryDetails);
     })
    }
   }

   fileUploader(filesUploaded) {
		let documents = this.editInventoryForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	 }

	  fileDeleted(deletedFileIndex) {
		let documents = this.editInventoryForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	  }

    patchDocuments(data){
      if(data.documents.length>0){
      let documentsArray = this.editInventoryForm.get('documents') as UntypedFormControl;
      documentsArray.setValue([]);
      const documents = data.documents;
      let pathUrl=[];
      documents.forEach(element => {
        documentsArray.value.push(element.id);
        pathUrl.push(element);
      });
      this.patchFileUrls.next(pathUrl);
      }
      }

      openAddPartyModal($event){
        if ($event){
          this.inventoryVariables.showAddPartyPopup = {name: this.inventoryVariables.partyNamePopup, status: true};
        }
      }

      addPartyToOption($event) {
        if ($event.status) {
          this.getVendorDetails();
          this.inventoryVariables.initialValues.vendor = {value: $event.id, label: $event.label};
          this.editInventoryForm.get('vendor').setValue($event.id);
        }
      }

      closePartyPopup(){
        this.inventoryVariables.showAddPartyPopup = {name: '', status: false};
      }

   patchForm(data){
    this.isAmountUsed = data.is_amount_used;
    this.editInventoryForm.patchValue(data);
    this.editInventoryForm.get('discount_after_tax_type').setValue(data.discount_after_tax_type.index)
    this.patchingInitailDropdown(data,'display_name','vendor','vendor','vendor');
    this.patchingInitailDropdown(data,'name','employee','employee','employee');
    this.patchingInitailDropdown(data,'label','paymentTerm','payment_term','payment_term');
    if(data.transaction_date){
      this.editInventoryForm.controls['transaction_date'].setValue(data.transaction_date);
    }
    this.patchingInitailDropdown(data,'name','adjustmentAccount','adjustment_account','adjustment_account');
    this.patchingInitailDropdown(data,'po_number','po','po','po');
    this.getApprovedPurchaseOrderList(data.vendor.id);
    if(data.po){
      this.AreTyrePresent = false ;
      this.AreSparesPresent = false;
    }
    if(!this.isTax){
      this.patchSparesAndTyresData(data);
    }
    this.editInventoryForm.get('discount_type').setValue(data.discount_type.index);
    this.editInventoryForm.get('adjustment_choice').setValue(data.adjustment_choice.index);
    this.editInventoryForm.get('tax').setValue(this.inventoryDetails.tax.id);
    this.onCalcuationsChanged();
   }

   patchSparesAndTyresData(data){
    this.initialValues.taxPercent=[]
    let otherSpareItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
    let otherTyreItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
     if(data.spares.length > 0){
      this.isQuantityEditable = false ;
      data.spares.forEach((ele,index)=>{
        otherSpareItems.push(this.buildNewSpares(ele));
        if (ele.item){
          this.initialValues.item.push({value: ele.item.id, label: ele.item.name})
          otherSpareItems.at(index).get('item').setValue(ele.item.id);
        }
        else {
          this.initialValues.item.push(getBlankOption());
        }
        if (ele.unit){
          this.initialValues.units.push({value: ele.unit.id, label: ele.unit.label})
          otherSpareItems.at(index).get('unit').setValue(ele.unit.id);
        }
        else {
          this.initialValues.units.push(getBlankOption());
        }
        if (ele.tax){
          this.initialValues.taxPercent.push({value: ele.tax.id, label: ele.tax.label})
          otherSpareItems.at(index).get('tax').setValue(ele.tax.id);
        }
        else {
          this.initialValues.taxPercent.push(getNonTaxableOption());
        }
      })
     }

     else{
       this.addMoreOtherItem();
       this.isQuantityEditable = true ;
     }
     if(data.tyres.length >0){
    this.isUniqueNumberEditable = false;
      data.tyres.forEach((ele,index)=>{
        otherTyreItems.push(this.buildNewTyres(ele));
        this.itemsDisable.push(ele.disabled);
        if (ele.manufacturer){
          this.initialValues.manufacturer.push({value: ele.manufacturer.id, label: ele.manufacturer.label})
          otherTyreItems.at(index).get('manufacturer').setValue(ele.manufacturer.id);
        }
        else {
          this.initialValues.manufacturer.push(getBlankOption());
        }
        if (ele.tyre_model){
          this.initialValues.model.push({value: ele.tyre_model.id, label: ele.tyre_model.name})
          otherTyreItems.at(index).get('tyre_model').setValue(ele.tyre_model.id);
        }
        else {
          this.initialValues.model.push(getBlankOption());
        }
        if (ele.thread_type){
          this.initialValues.threadType.push({value: ele.thread_type.id, label: ele.thread_type.label})
          otherTyreItems.at(index).get('thread_type').setValue(ele.thread_type.id);
        }
        else {
          this.initialValues.threadType.push(getBlankOption());
        }
        this.patchModels(ele);
      })

     }
     else{
      this.addMoreTyreItem();
      this.isUniqueNumberEditable = true;
     }
   }

   patchModels(item){
    this.tyreModel = [];
    if(item.manufacturer){
      const makeId = item.manufacturer.id;
      this._vehicleService.getModel(makeId).subscribe(data => {
        this.tyreModel.push(data.result);
      })
    }
  }

  getApprovedPurchaseOrderList(id){
    this._saveInventory.getApprovedPurchaseOrderData(id).subscribe((res)=>{
      this.approvedPurchasedOrderData = res['result'];
    })
    }

     deleteAllOtherItems(){
      const otherItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
      this.emptyOtherItems();
      otherItems.reset();
      otherItems.controls = [];
      this.onCalcuationsChanged();
    }

    deleteAllTyreItems(){
      const otherItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
      this.emptyTyreItems();
      otherItems.reset();
      otherItems.controls = [];
      this.onCalcuationsChanged();
    }

   patchingInitailDropdown(data,displayType,itemFor,itemName,formcontrolName){
    const form = this.editInventoryForm as UntypedFormGroup;
      if(isValidValue(data[itemName])){
        form.get(formcontrolName).setValue(data[itemName].id ?data[itemName].id :data[itemName].index);
        this.inventoryVariables.initialValues[itemFor]={
          label:data[itemName][displayType],
          value:data[itemName].id
        }
      }else{
        this.inventoryVariables.initialValues[itemFor]=getBlankOption();
      }
    }

  buildForm() {
		this.editInventoryForm = this._fb.group({
      bill_date: [
        null, Validators.required
			],
			bill_number: [
        '', [Validators.required, Validators.pattern(this.policyNumber)]
			],
      po_date: [
        null,
			],
      po: [
        null
			],
			vendor: [
        null, Validators.required
			],
			employee: [
				null
			],
			payment_term: [
        null
			],
			due_date: [
        null
			],
			payment_status: [
        1
			],
			amount_paid: [
        0
			],
			payment_mode: [
        null
			],
			transaction_date: [
        null
			],
			bank_charges: [
				0
			],
			reminder: [
        null
			],
			comments: [
        ''
			],
			documents: [
        []
      ],
      is_transaction_includes_tax: [
				false
			],
			is_transaction_under_reverse: [
				false
			],
      place_of_supply: [''],
      spares: this._fb.array([]),
      tyres: this._fb.array([]),
      selectedOptionType:['new_spares'],
      discount_type: [
        0
      ],
      discount: [
        0
      ],
      adjustment_account: [
        null
      ],
      adjustment_choice: [
        0
      ],
      sub_total_without_tax: [0],
      adjustment: [
        0
      ],
      hsn_code:['',[Validators.pattern(this.alphaNumericPattern)]],
      tax:[this.defaultTax],
      discount_after_tax_type: [
        0
      ],
      discount_after_tax: [
        0
      ],
      tds_type: [
        null
      ],
      tds: [
        0.0, [Validators.min(0), Validators.max(100)]
      ],
      tds_amount: [
        0
      ],

    });
    return this.editInventoryForm;
  }

  addMoreTyreItem(){
    this.itemsDisable.push(false);
    this.buildNewTyre(['']);
    this.initialValues.manufacturer.push(this.makePlaceholderOption);
    this.initialValues.model.push(this.modelPlaceholderOption);
    this.initialValues.threadType.push(this.typePlaceholderOption);
  }

  buildNewTyre(items: any = []) {
    const newTyre = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
    items.forEach((item) => {
      newTyre.push(this.buildNewTyres(item));
      });
  }

  buildNewTyres(item: any) {
		return this._fb.group({
      id : [item.id || null],
			amount:  [
        item.rate || item.amount || 0
			],
      total: [  item.rate || item.total || 0],
      manufacturer: [
				item.manufacturer || null,
      ],
      thread_type: [
				item.thread_type || null,
      ],
      tyre_model: [
        item.tyre_model || null,
      ],
      unique_no:[
        item.unique_no || '',

      ],
      unique_number_status:[true],
      additionalDetails: [
				this.showCustomFieldsByDefault
      ],
      note:[item.note || ''],
      tyre: [
        item.tyre || null
      ],
		});
	}

  clearAllOtherTyreItems(){
    const otherItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
		this.emptyOtherTyreItems();
		otherItems.reset();
		otherItems.controls = [];
		this.addMoreTyreItem();
		this.onCalcuationsChanged();
  }

  emptyOtherTyreItems(){
		this.initialValues.manufacturer = [];
    this.initialValues.model= [];
    this.initialValues.threadType= [];
  }

  addNewManufacturer(event) {
		this.manufacturerParams = {
			key: 'tyre-manufacturer',
			label: event,
			value: 0
		};
  }

  getNewManufacturer(event, index) {
		if (event) {
			this.staticOptions.tyreManufacturer = [];
			this.initialValues.manufacturer[index] = {};
			this._commonService
			.getStaticOptions('tyre-manufacturer')
			.subscribe((response) => {
				this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
				this.initialValues.manufacturer[index] = {value: event.id, label: event.label};
				this.editInventoryForm.controls['tyres']['controls'][index].controls.manufacturer.setValue(event.id);
			});
		}
	}

  addNewThreadTYpe(event) {
		if (event) {
			const val = trimExtraSpaceBtwWords(event);
			this.threadTypeParams = {
				key: 'tyre-thread-type',
				label: val,
				value: 0
			};
		}
  }

  getThreadTYpe(event, index) {
		if (event) {
			this.staticOptions.threadType = [];
			this.initialValues.threadType[index] = {}
			this._commonService
				.getStaticOptions('tyre-thread-type')
				.subscribe((response) => {
					this.staticOptions.threadType = response.result['tyre-thread-type'];
					this.initialValues.threadType[index] = {value: event.id, label: event.label};
					this.editInventoryForm.controls['tyres']['controls'][index].controls.thread_type.setValue(event.id);
				});
		}
  }

  updateModelForAllVehicles(index){
    const newTyre = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
    let makeId = newTyre.at(index).get('manufacturer').value
    this._vehicleService.getModel(makeId).subscribe(data => {

      newTyre.controls.forEach((element, index) => {
        if(element.get('manufacturer').value == makeId) {
          this.tyreModel[index] = data.result;
        }
      });
    })
  }

  getNewModel(data, index) {
    if (isValidValue(data)) {
      this.updateModelForAllVehicles(index);
    }
  }

  addNewModel($event) {
    this.modelParams = { name: $event };
  }

  onMakeChange(form, index) {
    this._vehicleService.getModel(form.get("manufacturer").value).subscribe(data => {
      this.modelApi = 'vehicle/tyre/manufacturer/' + form.get("manufacturer").value + '/model/'
      this.tyreModel[index] = data.result
    })
  }

  checkUnqueNumberUnique() {
    let uniqueNumberArray = [];
    let unique = true;
    const newTyre = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
    for (const items of newTyre['controls']) {
      if (items['controls'].unique_no.value != '' && items['controls'].unique_no.value != null) {
        uniqueNumberArray.push(items['controls'].unique_no.value)
      }
    }
    let valuesAlreadySeen = [];
    for (let i = 0; i < uniqueNumberArray.length; i++) {
      let value = uniqueNumberArray[i]
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        unique = false
      }
      valuesAlreadySeen.push(value)
    }

    if (unique) {
      return true
    } else {
      return false
    }
  }

  checkUnique(otherItem){
    let uniqueNumber = otherItem.get('unique_no').value;
    let tyreId = otherItem.get('tyre').value;

    if (uniqueNumber != '') {
      if(!this.checkUnqueNumberUnique()){
        otherItem.get('unique_number_status').setValue(false);
        this.setNotUniqueError();
      }else{
       this._operationsActivityService.getUniqueNumber(uniqueNumber,tyreId).subscribe(data => {
         if (data.result.exists) {
           otherItem.get('unique_number_status').setValue(false);
         } else {
           otherItem.get('unique_number_status').setValue(true);
         }
         this.setNotUniqueError();
       })
      }
    } else {
      otherItem.get('unique_number_status').setValue(true);
      this.setNotUniqueError();
    }
  }

  setNotUniqueError(){
    let otherItems = this.editInventoryForm.get('tyres') as UntypedFormArray;
    let flag = true;
    otherItems.controls.forEach((element) => {
      if(element.get('unique_number_status').value == false) {
        flag = false;
      }
    })
    this.isUniqueNumber = flag;
  }

  cloneTyreItem(form :UntypedFormGroup){

    const tyreItems =  this.editInventoryForm.controls['tyres']as UntypedFormArray;
    let itemsValue=form.value;
    itemsValue['unique_no']='';
    tyreItems.push(this.buildNewTyres(itemsValue))
    const itemId = form.get('manufacturer').value;
    if(itemId){
      let itemvalue=this.staticOptions.tyreManufacturer.filter(item => item.id==itemId);
      this.initialValues.manufacturer.push({label:itemvalue[0].label,value:itemvalue[0].id});
    }else{
      this.initialValues.manufacturer.push(this.makePlaceholderOption);
    }
    const  model =form.get('tyre_model').value;
    if(model){
      let modelValue=this.tyreModel[this.tyreModel.length-1].filter(item => item.id==model);
     this.initialValues.model.push({label:modelValue[0].name,value:modelValue[0].id});
    }else{
      this.initialValues.model.push(this.modelPlaceholderOption);
    }
    this.tyreModel.push(this.tyreModel[this.tyreModel.length-1]);
    const  thread_type = form.get('thread_type').value;
    if(thread_type){
      let thread_typeValue=this.staticOptions.threadType.filter(item => item.id==thread_type);
      this.initialValues.threadType.push({label:thread_typeValue[0].label,value:thread_typeValue[0].id})
    }else{
      this.initialValues.threadType.push(this.typePlaceholderOption);
    }
    this.onCalcuationsChanged();
  }

  clearTyreData(i){
    this.editInventoryForm.controls['tyres']['controls'][i].get('note').setValue('')
  }

  removeTyreItem(index){
    const otherItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
		this.initialValues.model.splice(index, 1);
		this.initialValues.manufacturer.splice(index, 1);
		this.initialValues.threadType.splice(index, 1);
    this.itemsDisable.splice(index, 1);
		otherItems.removeAt(index);
		this.onCalcuationsChanged();
  }

  addMoreOtherItem(){
    this.buildSpares(['']);
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(this.unit);
    this.initialValues.taxPercent.push(getNonTaxableOption());
  }

  removeOtherItem(index){
    const otherItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
		this.initialValues.expenseAccount.splice(index, 1);
		this.initialValues.item.splice(index, 1);
		this.initialValues.units.splice(index, 1);
    this.initialValues.taxPercent.splice(index, 1);
		otherItems.removeAt(index);
		this.onCalcuationsChanged();
  }

  clearAllOtherItems(){
    const otherItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
		this.emptyOtherItems();
		otherItems.reset();
		otherItems.controls = [];
		this.addMoreOtherItem();
		this.onCalcuationsChanged();
  }

  clearAllTyreItems(){
    const otherItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
		this.emptyTyreItems();
		otherItems.reset();
		otherItems.controls = [];
		this.addMoreTyreItem();
		this.onCalcuationsChanged();
    this.itemsDisable=[];
  }

  emptyTyreItems(){
		this.initialValues.manufacturer = [];
    this.initialValues.model= [];
    this.initialValues.threadType= [];
  }
  emptyOtherItems(){
		this.initialValues.units = [];
		this.initialValues.item = [];
    this.initialValues.taxPercent=[];
  }



  cloneSpareItem(form: UntypedFormGroup){

    const spareItems =  this.editInventoryForm.controls['spares']as UntypedFormArray;
        spareItems.push(this.buildNewSpares(form.value))
        const itemId = form.get('item').value;

        if(itemId){
          let itemvalue=this.materialList.filter(item => item.id==itemId);
          this.initialValues.item.push({label:itemvalue[0].name,value:itemvalue[0].id});
        }else{
          this.initialValues.item.push(getBlankOption())
        }
        const taxId = form.get('tax').value;
        if(taxId){
          let taxItem=this.taxOptions.filter(item => item.id==taxId);
          this.initialValues.taxPercent.push({label:taxItem[0].label,value:taxItem[0].id});
        }else{
          this.initialValues.taxPercent.push(getNonTaxableOption())
        }
        const  quantity_type =form.get('unit').value;
        if(quantity_type){
          let itemvquantity_typeValue=this.staticOptions.itemUnits.filter(item => item.id==quantity_type);
          this.initialValues.units.push({label:itemvquantity_typeValue[0].label,value:itemvquantity_typeValue[0].id});
        }else{
          this.initialValues.units.push(this.unit);
        }
    this.onCalcuationsChanged();
  }

  buildSpares(items: any = []) {
    const newSpares = this.editInventoryForm.controls['spares'] as UntypedFormArray;
    items.forEach((item) => {
      newSpares.push(this.buildNewSpares(item));
      });
  }

  buildNewSpares(item: any) {
		return this._fb.group({
			item: [
        item.item || null,
			],
			quantity: [
        item.quantity || 0,
      ],
      unit: [
        item.unit || null,
			],
			unit_cost:  [
        item.unit_cost || item.rate || 0,
			],
      total_before_tax: [
        item.total_before_tax || 0,
			],
      tax:[item.tax||this.defaultTax],
      total: [0||item.total],
      additionalDetails: [
				this.showCustomFieldsByDefault
      ],
      note:[item.note || ''],
      hsn_code:[item.hsn_code || '',[Validators.pattern(this.alphaNumericPattern)]],
      isChangeHsn:[false],
		});
	}

  addValueToPartyPopup($event){
    if ($event) {
			const val = trimExtraSpaceBtwWords($event);
			const arrStr = val.toLowerCase().split(' ');
			const titleCaseArr:string[] = [];
			for (const str of arrStr) {
				titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
			}
			const word_joined = titleCaseArr.join(' ');
      this.inventoryVariables.partyNamePopup = word_joined;
			}
  }

  onVendorSelected(e){
    if (e.target.value === '') {
      this.inventoryVariables.vendorSelected = null;
			this.inventoryVariables.vendorId = null;
      return;
    }
    if (isValidValue(e.target.value)) {
      this.inventoryVariables.vendorId = e.target.value;
			this._partyService.getPartyAdressDetails(e.target.value).subscribe(res => {
        this.inventoryVariables.vendorSelected = res.result;
        this.gstin =  this.inventoryVariables.vendorSelected.tax_details.gstin;

         this.isTdsDecleration = this.inventoryVariables.vendorSelected.tax_details.tds_declaration;
        if(this.gstin =='Unregistered'){
           this.partyDetailsData={
            isPartyRegistered:false,
            taxDeatils:  this.inventoryVariables.vendorSelected .tax_details,
            placeOfSupply: this.placeOfSupply,
            companyRegistered: this.companyRegistered
          }
          this.partyTaxDetails.next( this.partyDetailsData)
        }else{
          this.partyDetailsData={
            isPartyRegistered:true,
            taxDeatils:  this.inventoryVariables.vendorSelected .tax_details,
            placeOfSupply: this.placeOfSupply,
            companyRegistered: this.companyRegistered
          }
          this.partyTaxDetails.next(this.partyDetailsData)
        }

      this.inventoryVariables.initialValues.paymentTerm = getBlankOption();
			this.editInventoryForm.controls['payment_term'].setValue('');
			this.editInventoryForm.controls['due_date'].setValue(null);

			if ( this.inventoryVariables.vendorSelected ?  this.inventoryVariables.vendorSelected.terms : null) {
				this.onpaymentTermSelected( this.inventoryVariables.vendorSelected.terms ?  this.inventoryVariables.vendorSelected.terms.id : null);
        this.inventoryVariables.initialValues.paymentTerm = {
          label:  this.inventoryVariables.vendorSelected.terms &&  this.inventoryVariables.vendorSelected.terms.label ?  this.inventoryVariables.vendorSelected.terms.label : '',
					value:  this.inventoryVariables.vendorSelected.terms ?  this.inventoryVariables.vendorSelected.terms.id : null
				}
				this.editInventoryForm.controls['payment_term'].setValue(
          this.inventoryVariables.vendorSelected.terms ?  this.inventoryVariables.vendorSelected.terms.id : '');
        }
			});

      this.getApprovedPurchaseOrderList(e.target.value);
		}
		else {
      this.inventoryVariables.vendorSelected = null;
		}

  }

  onpaymentTermSelected(termId) {
		if (termId) {
      this.inventoryVariables.selectedPaymentTerm = getObjectFromList(termId,  this.inventoryVariables.staticOptions.paymentTermList);
			this.inventoryVariables.BillDate = this.editInventoryForm.controls['bill_date'].value;
			this.editInventoryForm.controls['due_date'].setValue(
				PaymentDueDateCalculator(this.inventoryVariables.BillDate, this.inventoryVariables.selectedPaymentTerm ? this.inventoryVariables.selectedPaymentTerm.value : null));
		}


    if(termId){
      this.editInventoryForm.controls['due_date'].setValidators([Validators.required]);
      this.editInventoryForm.controls['due_date'].updateValueAndValidity();
      this.isDueDateRequired= true;
    }else{
      this.isDueDateRequired= false;
      this.editInventoryForm.controls['due_date'].setValidators(null);
      this.editInventoryForm.controls['due_date'].updateValueAndValidity();
    }
	}





  onCalendarChangePTerm(event) {
		if (event && event.target.value) {
			if (this.editInventoryForm.controls['payment_status'].value != 1) {
				this.editInventoryForm.controls['transaction_date'].patchValue(event.target.value);
			}
			this.editInventoryForm.controls['due_date'].patchValue(null);
			this.inventoryVariables.minDate = getMinOrMaxDate(event.target.value);
		}
		let existingTerm = this.editInventoryForm.controls['payment_term'].value;
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}



  newSpareAndTyreData(Formdata){
    let form= this.editInventoryForm;
    this.newSpareAndTyreDataForm =Formdata
    if(form.value['selectedOptionType']=='new_spares'){
      this.inventoryVariables.addInventoryTotals.balance= Number(this.newSpareAndTyreDataForm.inventoryNewTotal.balance)
    }else{
      this.inventoryVariables.addInventoryTotals.balance=Number(this.newSpareAndTyreDataForm.inventoryNewTotal.balance)
    }
  }


    setFormGlobalErrors() {
      this.globalFormErrorList = [];
      let errorIds = Object.keys(this.possibleErrors);
      for (let prop of errorIds) {
        const error = this.possibleErrors[prop];
        if (error.status == true) {
          this.globalFormErrorList.push(error.message);
        }
      }
      }

      addErrorClass(controlName: AbstractControl) {
        return TransportValidator.addErrorClass(controlName);
      }
      setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
        group.markAsTouched();
        for (let i in group.controls) {
          if (group.controls[i] instanceof UntypedFormControl) {
            group.controls[i].markAsTouched();
          } else {
            this.setAsTouched(group.controls[i]);
          }
        }
      }

    saveExpense(is_draft){
      let form= this.editInventoryForm;
      form.patchValue({
        reminder:changeDateToServerFormat(form.controls.reminder.value),
        bill_date: changeDateToServerFormat(form.controls.bill_date.value),
        due_date: changeDateToServerFormat(form.controls.due_date.value),
        po_date: changeDateToServerFormat(form.controls.po_date.value),
        transaction_date: changeDateToServerFormat(form.controls.transaction_date.value),
        is_draft: is_draft
      })
      this.setSpareandTyreItemsValidators(false);
      this.$paymentStatusValid.next(this.isPaymentstatusValid);
     if(form.valid && this.isTaxFormValid &&this.isPaymentstatusValid) {
      this.setSpareandTyreItemsValidators(true);
      if(this.inventaryId){
      this._saveInventory.putInventory(form.value,this.inventaryId).subscribe(response=>{
        this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.INVENTORYNEWBILL)
        this._route.navigateByUrl(this.prefixUrl+'/inventory/list/inventory-new');
      }, err => {
        if(err.error.message) {
          this.apiError = err.error.message;
        }
      })
      }
      else{
        this._saveInventory.saveInventory(form.value).subscribe(response=>{
          this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.INVENTORYNEWBILL)
          this._route.navigateByUrl(this.prefixUrl+'/inventory/list/inventory-new');
         })
      }
     }else{
      this.setAsTouched(form);
      this.taxFormValid.next(false);
     }
}

setSpareandTyreItemsValidators(CanRowsBeDeleted){
  let form= this.editInventoryForm;
  let otherSpareItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
  let otherTyreItems = this.editInventoryForm.controls['tyres'] as UntypedFormArray;
  let item = '';
  let quantity = 0;
  let total = 0;
  let amount =0 ;
  let unique_no = '';

  if(Number(this.inventoryNewTotal.balance) > 0){

  otherSpareItems.controls.forEach((others,index) => {
     item = others.get('item').value;
     quantity = Number(others.get('quantity').value);
     total = Number(others.get('total').value);

     if(item || quantity || total){
      others.get('item').setValidators([Validators.required]);
      others.get('item').updateValueAndValidity()
      others.get('quantity').setValidators([Validators.required]);
      others.get('quantity').updateValueAndValidity()
      others.get('total').setValidators([Validators.required]);
      others.get('total').updateValueAndValidity()
    }
    else{
      others.get('item').setValidators(null);
      others.get('item').updateValueAndValidity()
      others.get('quantity').setValidators(null);
      others.get('quantity').updateValueAndValidity()
      others.get('total').setValidators(null);
      others.get('total').setValue(0);
      others.get('total').updateValueAndValidity();
      if(CanRowsBeDeleted){
      otherSpareItems.removeAt(index);
      }
    }


 });

 otherTyreItems.controls.forEach((others,index) => {
  amount = Number(others.get('amount').value);
  unique_no = others.get('unique_no').value;

  if(amount || unique_no ){
   others.get('amount').setValidators([Validators.required]);
   others.get('amount').updateValueAndValidity()
   others.get('unique_no').setValidators([Validators.required]);
   others.get('unique_no').updateValueAndValidity()
 }
 else{
   others.get('amount').setValidators(null);
   others.get('amount').updateValueAndValidity()
   others.get('unique_no').setValidators(null);
   others.get('unique_no').updateValueAndValidity()
   others.get('total').setValue(0);
   if(CanRowsBeDeleted){
   otherTyreItems.removeAt(index);
   }
  }

});

}
else{
this.apiError = 'Please check detail, Total amount should be greater than zero'
form.setErrors({ 'invalid': true });
window.scrollTo(0, 0);

}

}
  onRadioButtonChange(){
    this.isFormValid.next(true);
  }

  headerTaxDetails(data){
    if(this.isTax){
      this.isTaxFormValid = data.isFormValid;
      this.editInventoryForm.get('place_of_supply').setValue(data['headerTaxDetails'].place_of_supply);
      this.isTransactionIncludesTax= data['headerTaxDetails'].is_transaction_includes_tax;
      this.isTransactionUnderReverse=data['headerTaxDetails'].is_transaction_under_reverse;
      this.editInventoryForm.get('is_transaction_under_reverse').setValue(this.isTransactionUnderReverse);
      this.editInventoryForm.get('is_transaction_includes_tax').setValue(this.isTransactionIncludesTax);
      if(this.companyRegistered || this.isTransactionUnderReverse){
        this.disableTax = false;
      }
      if(!this.partyDetailsData.isPartyRegistered && !this.isTransactionUnderReverse ){
        this.setAllTaxAsNonTaxable();
        this.disableTax = true;
      }
     this.onCalcuationsChanged();
    }
 }

  getTaxDetails(){
    this._taxService.getTaxDetails().subscribe(result=>{
      this.placeOfSupply=result.result['pos'];
      this.taxOptions=result.result['tax'];
      this.inventoryNewTotal.taxes = result.result['tax'];
      this.tdsOptions=result.result['tds'];
      this.lastSectiondata.data=this.tdsOptions;
      this.lastSectionTaxDetails.next(this.lastSectiondata)
      this.companyRegistered = result.result['registration_status'];
    })
   }

   setAllTaxAsNonTaxable(){
    this.initialValues.tax =getNonTaxableOption();
    this.editInventoryForm.get('tax').setValue(this.defaultTax);
    this.initialValues.taxPercent.fill(getNonTaxableOption());
    const newSpareItems = this.editInventoryForm.controls['spares'] as UntypedFormArray;
    newSpareItems.controls.forEach((controls) => {
      controls.get('tax').setValue(this.defaultTax);
    });
    this.editInventoryForm.get('discount_after_tax').setValue(0);
  }

  onVendorId(id) {
		this._partyService.getPartyAdressDetails(id).subscribe(
			res => {
				let vendorSelected = res.result;
		if(vendorSelected.tax_details['gstin']=='Unregistered'){
		   this.partyDetailsData={
			isPartyRegistered:false,
			taxDeatils:vendorSelected.tax_details,
			placeOfSupply: this.placeOfSupply,
			companyRegistered: this.companyRegistered
		  }
		  this.partyTaxDetails.next( this.partyDetailsData)
		}else{
		  this.partyDetailsData={
			isPartyRegistered:true,
			taxDeatils:vendorSelected.tax_details,
			placeOfSupply: this.placeOfSupply,
			companyRegistered: this.companyRegistered
		  }
		  this.partyTaxDetails.next(this.partyDetailsData)
		}
    this.gstin = vendorSelected.tax_details['gstin'];
    this.isTdsDecleration = vendorSelected.tax_details['tds_declaration'];;
    this.editData.next(
      {
        patchData:this.inventoryDetails
      });
      this.lastSectionEditData.next({
        patchData:this.inventoryDetails,
        lastSectionData:this.lastSectiondata.data
      });
      setTimeout(() => {
        this.patchSparesAndTyresData(this.inventoryDetails);
        this.editInventoryForm.get('discount_after_tax').setValue(this.inventoryDetails.discount_after_tax);
       this.editInventoryForm.get('tax').setValue(this.inventoryDetails.tax.id);
       this.initialValues.tax = {label:this.inventoryDetails.tax.label};
        this.onCalcuationsChanged();
      },2000 );

		});
 }

 paymentStatusData(data:{data:any,valid:boolean}){
  this.editInventoryForm.patchValue({
    amount_paid:data.data.amount_paid,
    bank_charges:data.data.bank_charges,
    payment_mode : data.data.payment_mode,
    payment_status:data.data.payment_status,
    transaction_date:changeDateToServerFormat(data.data.transaction_date)
  })
  this.isPaymentstatusValid=data.valid;
}

}
