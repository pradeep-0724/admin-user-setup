import { PurchaseOrderService } from '../../../api-services/inventory-purchase-order-service/purchase-order.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl} from '@angular/forms';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { Router, ActivatedRoute } from '@angular/router';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ErrorList } from 'src/app/core/constants/error-list';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { getBlankOption, getObjectFromList,isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { OperationsActivityService } from '../../../api-services/operation-module-service/operations-activity.service';
import { CommonService } from 'src/app/core/services/common.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { BehaviorSubject } from 'rxjs';
import { EmployeeService } from '../../../api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  host: {
		"(window:click)": "clickOutToHide($event)"
	  },

 
})
export class PurchaseOrderComponent implements OnInit, OnDestroy {

  apiError: string = "";
  purchaseOrderForm: UntypedFormGroup;
  employeeList: any = [];
  vehicleList: any = [];
  accountList: any = [];
  staticOptions: any = {};
  initialValues = {
    vendor: {},
    units:[],
    item:[],
    manufacturer:[],
    model:[],
    threadType:[],
    approval:{},
    payementTerm:{},
    employee:{},
    approvalstatus:{}

  }
  i;
  showCustomFieldsByDefault: boolean = false;
  errorHeaderMessage = new ErrorList().headerMessage;
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  vendorList=[];
  showAddPartyPopup: any = {name: '', status: false};
  manufacturerParams: any = {};
  partyNamePopup: string = '';
  labourchargeRequired=false;
  saveButton=false;
  paymentStatusSelected={
    value:1,
    label:'Unpaid'
  }
  currency_type;
  paymentTermList=[];
  materialList=[];
  approvalStatus=[
    {
      label:'Approved',
      id:2
    },
    {
      label:'Approval Pending',
      id:1
    }
  ]
  unit={
    label:'UNIT',
    value:''
  }
  expenseItemDropdownIndex: number = -1;
  showAddExpenseItemPopup: any = {name: '', status: false};
  newSparesItemParams: any = {
		name: '',
    };
  modelApi = '';
  tyreModel = [];
  modelParams = {
    name: ''
  };
  manufacturerApi = TSAPIRoutes.static_options;
  editId='null';
  patchFileUrls=new BehaviorSubject([]);
  prefixUrl: any;
  gstin='';
  isTdsDecleration = false;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;

    constructor(
    private _fb: UntypedFormBuilder,
    private _employeeService: EmployeeService,
    private _vehicleService: VehicleService,
    private _operationsActivityService: OperationsActivityService,
    private _revenueService: RevenueService,
    private _route: Router,
    private _partyService: PartyService,
    private currency:CurrencyService,
    private _commonService:CommonService,
    private _purchaseOrder:PurchaseOrderService,
    private _activateDroute:ActivatedRoute,
    private _prefixUrl:PrefixUrlService,
    private _analytics:AnalyticsService
  ) { }

  ngOnInit() {
    this.buildForm();
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 2000);
    this._employeeService.getEmployeeList().subscribe((employeeList) => {
      this.employeeList = employeeList;
    });
    this._vehicleService.getVehicleListForTyreRotaion().subscribe((vehicleList) => {
      this.vehicleList = vehicleList;
    });
    this._revenueService.getAccounts().subscribe((response) => {
      if (response !== undefined) {
        this.accountList = response.result;
      }
    });
    this._commonService
    .getStaticOptions('gst-treatment,tax,item-unit,payment-term,tyre-thread-type,tyre-manufacturer')
    .subscribe((response) => {
      this.paymentTermList = response.result['payment-term'];
      this.staticOptions.itemUnits = response.result['item-unit'];
      this.staticOptions.threadType = response.result['tyre-thread-type'];
      this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
    });

    this.getVendorDetails();
    this.purchaseOrderForm.controls['po_date'].setValue(new Date(dateWithTimeZone()));
    this.purchaseOrderForm.controls['expected_delivery_date'].setValue(new Date(dateWithTimeZone()));
    this.getMaterials();
    this.initialValues.approval ={label:this.approvalStatus[1].label,value:this.approvalStatus[1].id}
    this.purchaseOrderForm.controls['approval_status'].setValue(this.approvalStatus[1].id);
    this._activateDroute.params.subscribe(data=>{
      if(data['editid']){
        this.editId=data['editid'];
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.PURHCASEORDER,this.screenType.EDIT,"Navigated");
        this.getPurchaseOrderDetails();
      }else{
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.PURHCASEORDER,this.screenType.ADD,"Navigated");
        this.getPurchaseOrderPrefix();
      }
    })

  }
  clickOutToHide(e){
    this.saveButton = false;
}
  ngOnDestroy(){
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('removeLoader');
  }
  buildForm() {
    this.purchaseOrderForm = this._fb.group({
      employee: [null],
      spares: this._fb.array([]),
      tyres: this._fb.array([]),
      comments: [
        ''
      ],
      documents: [
        []
      ],
      vendor:[null, Validators.required],
      po_number:['', Validators.required],
      po_date:[null, Validators.required],
      expected_delivery_date:[null],
      payment_term:[null],
      approval_status:[null],
      approval_user:[null],
      total:[0],
      is_draft:[false]

    });

    this.buildSpares([
      ''
    ]);

    this.buildTyres([
      ''
    ]);
  }

  fileUploader(filesUploaded) {
		let documents = this.purchaseOrderForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}

  fileDeleted(deletedFileIndex) {
  let documents = this.purchaseOrderForm.get('documents').value;
  documents.splice(deletedFileIndex, 1);
  }

  buildSpares(items) {
    let newSpares = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
    items.forEach((item) => {
      newSpares.push(this.addNewSpare(item));
      this.initialValues.item.push(getBlankOption());
      this.initialValues.units.push(this.unit);
    });
  }

  buildTyres(items) {
    let newTyres = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
    items.forEach((item) => {
      newTyres.push(this.addNewTyre(item));
      this.initialValues.manufacturer.push(getBlankOption());
      this.initialValues.model.push(getBlankOption());
      this.initialValues.threadType.push(getBlankOption());
    });
  }

  addNewSpare(item) {
    return this._fb.group({
      item:[item.item||null],
      quantity:[item.quantity||0],
      unit:[item.unit||null],
      rate:[item.rate||0],
      total:[item.total||0],
      hsn_code:[item.hsn_code||''],
      note:[item.note||''],
      additionalDetails:[false],
      isChangeHsn:[false],
      id:[item.id||null]
    });
  }

  addNewTyre(item) {
    return this._fb.group({
      manufacturer:[item.manufacturer||null],
      tyre_model:[item.tyre_model||null],
      thread_type:[item.thread_type||null],
      quantity:[item.quantity||0],
      rate:[item.rate||0],
      total:[item.total||0],
      additionalDetails:[false],
      note:[item.note||''],
      id:[item.id||null]
    });
  }

onvendorSelected(e?){
      if(this.purchaseOrderForm.get('vendor').value)
      this._partyService.getPartyAdressDetails(this.purchaseOrderForm.get('vendor').value).subscribe(
        res => {

          this.gstin =res.result.tax_details.gstin;
          this.isTdsDecleration =res.result.tax_details.tds_declaration;
        });

  }


  saveExpense(is_draft) {
    let form = this.purchaseOrderForm
    this.validateTyreAndSpare();
    let spareItems =[],
        tyresItem =[];
       spareItems = this.checkSpareItems();
       tyresItem =this.checkTyreItems();
    if (form.valid && (spareItems.length>0||tyresItem.length>0) ) {
      this.prepareRequest(form,is_draft);
      let payload = form.value;
          payload['spares']=spareItems;
          payload['tyres']=tyresItem;
       if(this.editId=='null'){
         this._purchaseOrder.postPurchaseOrder(form.value).subscribe(result=>{
          this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.PURHCASEORDER)
           this._route.navigate([this.prefixUrl+'/inventory/purchase-order/list'])
         },error=>{
           this.apiError = error.error.message
         })
       }else{
        this._purchaseOrder.putPurchaseOrder(form.value,this.editId).subscribe(result=>{
          this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.PURHCASEORDER)
          this._route.navigate([this.prefixUrl+'/inventory/purchase-order/list'])
        },error=>{
          this.apiError = error.error.message
        })
       }
    } else {
      this.setAsTouched(form);
      this.setFormGlobalErrors();
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

  onMakeChange(form, index) {
    this._vehicleService.getModel(form.get("manufacturer").value).subscribe(data => {
      this.modelApi = 'vehicle/tyre/manufacturer/' + form.get("manufacturer").value + '/model/'
      this.tyreModel[index] = data.result;
      this.initialValues.model[index] =getBlankOption();
      const newTyre = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
       let tyre_model = newTyre.at(index).get('tyre_model').value;
       if(tyre_model){
        newTyre.at(index).get('tyre_model').setValue(null);
       }
    })
    this.onCalcuationsChanged();
  }

  getNewModel(data, index) {
    if (isValidValue(data)) {
      const newTyre = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
       newTyre.at(index).get('tyre_model').setValue(data.id)
      this.updateModelForAllVehicles(index);
    }
  }

  updateModelForAllVehicles(index){
    const newTyre = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
    let makeId = newTyre.at(index).get('manufacturer').value
    this._vehicleService.getModel(makeId).subscribe(data => {
      newTyre.controls.forEach((element, index) => {
        if(element.get('manufacturer').value == makeId) {
          this.tyreModel[index] = data.result;
        }
      });
    })
  }
  addNewModel($event,form) {
    this.modelApi = 'vehicle/tyre/manufacturer/' + form.get("manufacturer").value + '/model/'
    this.modelParams = { name: $event };
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
				this.purchaseOrderForm.controls['tyres']['controls'][index].controls.manufacturer.setValue(event.id);
        this.modelApi = 'vehicle/tyre/manufacturer/' +this.purchaseOrderForm.controls['tyres']['controls'][index].controls.manufacturer.value+ '/model/'
			});
		}
	}

  addNewManufacturer(event) {
		this.manufacturerParams = {
			key: 'tyre-manufacturer',
			label: event,
			value: 0
		};
  }


  /* For  Opening the Party Modal */
	openAddPartyModal($event ) {
		if ($event)
			this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
  }

  	/* Adding the entered value to the list */
	addValueToPartyPopup(event){
    if (event) {
        const val = trimExtraSpaceBtwWords(event);
        const arrStr = val.toLowerCase().split(' ');
        const titleCaseArr:string[] = [];
        for (const str of arrStr) {
          titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
        }
        const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
        }
    }

    	/* After closing the party modal to clear all the values */
	closePartyPopup(){
		this.showAddPartyPopup = {name: '', status: false};
  }

  	/* For Displaying the party name in the subfield  */
	addPartyToOption($event) {
    if ($event.status) {
      this.getVendorDetails();
      this.initialValues.vendor = {value: $event.id, label: $event.label};
      this.purchaseOrderForm.get('vendor').setValue($event.id);

    }
  }

  getVendorDetails(){
    this._partyService.getPartyList('0','1').subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  getMaterials(){
    this._operationsActivityService.getSpareItems().subscribe((response) => {
			if (response !== undefined) {
				this.materialList = response.result;
			}
		});
  }



  calculateItemAmount(index:number){
    const newSpares = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
    const itemExpenseControl = newSpares.at(index);
    let quantity = itemExpenseControl.get('quantity').value;
    let rate = itemExpenseControl.get('rate').value;
    let total = (Number(quantity) * Number(rate)).toFixed(3);
    itemExpenseControl.get('total').setValue(total);
    this.onCalcuationsChanged();
  }

  calculateItemAmountTyre(index:number){
    const tyres = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
    const itemExpenseControl = tyres.at(index);
    let quantity = itemExpenseControl.get('quantity').value;
    let rate = itemExpenseControl.get('rate').value;
    let total = (Number(quantity) * Number(rate)).toFixed(3);
    itemExpenseControl.get('total').setValue(total);
    this.onCalcuationsChanged();
  }

  openAddExpenseItemModal($event, index) {
		if ($event){
		  this.expenseItemDropdownIndex = index;
		  this.showAddExpenseItemPopup = {name: this.newSparesItemParams.name, status: true};
    }

  }

  addParamsToNewSpareItem($event) {
		this.newSparesItemParams = {
			name: $event
		};
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
				let other_expense = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
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

  onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
    const newSpares = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
    const newSpareExpanse = newSpares.at(index);
    const itemId = newSpareExpanse.get('item').value;
    let itemvalue=this.materialList.filter(item => item.id==itemId)
    newSpareExpanse.get('hsn_code').setValue(itemvalue[0].hsn_code)
    this.resetOtherExpenseExceptItem(itemExpenseControl, index);
    this.onChangeOtherExpenseItem(index);
  }

  onChangeOtherExpenseItem(index) {
    const newSpares = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
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
        newSpareExpanse.get('rate').setValue(expenseItem.rate_per_unit);
      }
    }
    this.onCalcuationsChanged();
  }

  resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index){
    formGroup.patchValue({unit: null, rate: 0,  total: 0, quantity: 0, total_before_tax: 0,  expense_account: null});
    this.initialValues.units[index] =this.unit;
  }

  removeSpareItem(index){
    const spareItem = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
		this.initialValues.item.splice(index, 1);
		this.initialValues.units.splice(index, 1);
		spareItem.removeAt(index);
    this.onCalcuationsChanged();
  }

  addMoreSpareItem(){
    this.buildSpares(['']);
  }

  clearData(i){
    this.purchaseOrderForm.controls['spares']['controls'][i].get('note').setValue('')
  }
  removeSpareAll(){
    const spareItem = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
    this.initialValues.units = [];
		this.initialValues.item = [];
		spareItem.reset();
		spareItem.controls = [];
    this.addMoreSpareItem();
    this.onCalcuationsChanged();
  }

  onCalcuationsChanged(){

    let newSpares = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
    let tyre = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
    let spareTotal = '0';
    let tyreTotal='0';

    newSpares.controls.forEach(items=>{
        if (items.value.item){
          spareTotal = (Number(spareTotal) + Number(items.value.total)).toFixed(3)
      }
    })

      tyre.controls.forEach(items=>{
            if (items.value.manufacturer){
              tyreTotal = (Number(tyreTotal) + Number(items.value.total)).toFixed(3)
          }
    })
    this.purchaseOrderForm.controls['total'].patchValue((Number(spareTotal)+Number(tyreTotal)).toFixed(3))
  }

  addMoreTyreItem(){
    this.buildTyres(['']);
  }
  removeTyresItem(index){
    const tyreItem = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
		this.initialValues.manufacturer.splice(index, 1);
		this.initialValues.model.splice(index, 1);
    this.initialValues.threadType.splice(index, 1);
		tyreItem.removeAt(index);
    this.onCalcuationsChanged();
  }

  removeTyreeAll(){
    const tyreItem = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
    this.initialValues.manufacturer = [];
		this.initialValues.model = [];
    this.initialValues.threadType= [];
		tyreItem.reset();
		tyreItem.controls = [];
    this.addMoreTyreItem();
    this.onCalcuationsChanged();
  }



  checkSpareItems(){
    let spareItems=[];
    let newSpares = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
        newSpares.controls.forEach(items=>{
            if (items.value.item){
              spareItems.push(items.value)
          }
        })

    return spareItems;
  }

  checkTyreItems(){
    let tyreItems=[];
    let tyre = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
      tyre.controls.forEach(items=>{
            if (items.value.manufacturer){
              tyreItems.push(items.value)

          }
        })
  return   tyreItems;
  }


 validateTyreAndSpare(){
  let tyre = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
  tyre.controls.forEach(items=>{
        if (items.value.manufacturer ||items.value.tyre_model ||items.value.thread_type|| Number(items.value.quantity)>0 || Number(items.value.rate)>0 ){
          this.setValidators(items,'manufacturer',[Validators.required])
          this.setValidators(items,'tyre_model',[Validators.required])
          this.setValidators(items,'thread_type',[Validators.required])
          this.setValidators(items,'quantity',[Validators.min(0.01)])
          this.setValidators(items,'rate',[Validators.min(0.01)])
      }else{
        this.setValidators(items,'manufacturer',[Validators.nullValidator])
        this.setValidators(items,'tyre_model',[Validators.nullValidator])
        this.setValidators(items,'thread_type',[Validators.nullValidator])
        this.setValidators(items,'quantity',[Validators.nullValidator])
        this.setValidators(items,'rate',[Validators.nullValidator])
      }
    })

    let newSpares = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
    newSpares.controls.forEach(items=>{
      if (items.value.item ||items.value.unit || Number(items.value.quantity)>0 || Number(items.value.rate)>0 ){
        this.setValidators(items,'item',[Validators.required])
        this.setValidators(items,'unit',[Validators.required])
        this.setValidators(items,'quantity',[Validators.min(0.01)])
        this.setValidators(items,'rate',[Validators.min(0.01)])
    }else{
      this.setValidators(items,'item',[Validators.nullValidator])
      this.setValidators(items,'unit',[Validators.nullValidator])
      this.setValidators(items,'quantity',[Validators.nullValidator])
      this.setValidators(items,'rate',[Validators.nullValidator])
    }
    })

 }

 setValidators(form:any,formControlName:string,validator:any){
   form.get(formControlName).setValidators(validator);
   form.get(formControlName).updateValueAndValidity();
 }

  prepareRequest(form,is_draft){
    form.patchValue({
      is_draft:is_draft,
      po_date:changeDateToServerFormat(form.get('po_date').value),
      expected_delivery_date:changeDateToServerFormat(form.get('expected_delivery_date').value)
    })
  }

  getPurchaseOrderDetails(){
    this._purchaseOrder.getPurchaseOrderDetail(this.editId).subscribe(result=>{
      this.patchPurchaseForm(result['result']);
    })
  }

  stopLoaderClasstoBody(){
		let body = document.getElementsByTagName('body')[0];
        body.classList.add('removeLoader');
	}

  patchPurchaseForm(data){
    let form = this.purchaseOrderForm;
        form.patchValue(data);
    this.initialValues.vendor = {label:data.vendor.display_name,value:data.vendor.id};
    form.get('vendor').setValue(data.vendor.id);
    if(isValidValue(data.payment_term)){
      this.initialValues.payementTerm = {label:data.payment_term.label,value:data.payment_term.id};
      form.get('payment_term').setValue(data.payment_term.id);
    }
    if(isValidValue(data.employee)){
      this.initialValues.employee = {label:data.employee.display_name,value:data.employee.id};
      form.get('employee').setValue(data.employee.id);
    }
    if(isValidValue(data.approval_user)){
      this.initialValues.approvalstatus = {label:data.approval_user.display_name,value:data.approval_user.id};
      form.get('approval_user').setValue(data.approval_user.id);
    }
    if(isValidValue(data.approval_status)){
      this.initialValues.approval = {label:data.approval_status.label,value:data.approval_status.index};
      form.get('approval_status').setValue(data.approval_status.index);
    }
    this.patchSpare(data['spares']);
    this.patchTyre(data['tyres']);
    this.patchDocuments(data);
    this.onvendorSelected();

  }

  patchSpare(spareData){
    let spareItems=[];
    spareItems=spareData;
    let spareItem = this.purchaseOrderForm.controls['spares'] as UntypedFormArray;
    this.initialValues.units = [];
		this.initialValues.item = [];
		spareItem.reset();
		spareItem.controls = [];
   if(spareItems.length>0){
   spareItems.forEach((item,index) => {
    spareItem.push(this.addNewSpare({}));
    spareItem.controls[index].patchValue({
      quantity:item.quantity,
      rate:item.rate,
      total:item.total,
      id:item.id
    })
    spareItem.controls[index].get('item').setValue(item.item.id)
    this.initialValues.item.push({label:item.item.name,value:item.item.id});
    if(isValidValue(item.unit)){
      this.initialValues.units.push({label:item.unit.label,value:item.unit.id});
      spareItem.controls[index].get('unit').setValue(item.unit.id)
    }else{
      this.initialValues.model.push(getBlankOption());
    }
  });
   }else{
    this.addMoreSpareItem();
   }
  }

  patchTyre(tyreData){
    let tyreItems =[];
    tyreItems= tyreData
    let  tyreItem = this.purchaseOrderForm.controls['tyres'] as UntypedFormArray;
    this.initialValues.manufacturer = [];
		this.initialValues.model = [];
    this.initialValues.threadType= [];
		tyreItem.reset();
		tyreItem.controls = [];
    if(tyreItems.length>0){
      tyreItems.forEach((item,index) => {
        tyreItem.push(this.addNewTyre({}));
        tyreItem.controls[index].patchValue({
          quantity:item.quantity,
          rate:item.rate,
          total:item.total,
          id:item.id
        })
        tyreItem.controls[index].get('manufacturer').setValue(item.manufacturer.id)
        this.initialValues.manufacturer.push({label:item.manufacturer.label,value:item.manufacturer.id});
        if(isValidValue(item.tyre_model)){
          this.initialValues.model.push({label:item.tyre_model.name,value:item.tyre_model.id});
          tyreItem.controls[index].get('tyre_model').setValue(item.tyre_model.id)
        }else{
          this.initialValues.model.push(getBlankOption());
        }
        if(isValidValue(item.thread_type)){
          tyreItem.controls[index].get('thread_type').setValue(item.thread_type.id)
          this.initialValues.threadType.push({label:item.thread_type.label,value:item.thread_type.id});
        }else{
          this.initialValues.threadType.push(getBlankOption());
        }
        this.updateModelForAllVehicles(index)
      });
    }else{
      this.addMoreTyreItem();
    }
  }

  patchDocuments(data){
    if(data.documents.length>0){
    let documentsArray = this.purchaseOrderForm.get('documents') as UntypedFormControl;
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

    getPurchaseOrderPrefix(){
     this._purchaseOrder.getPrefixPurchaseOrder().subscribe(result=>{
       this.purchaseOrderForm.get('po_number').setValue(result['result'].purchase_order)
     })
    }
}
