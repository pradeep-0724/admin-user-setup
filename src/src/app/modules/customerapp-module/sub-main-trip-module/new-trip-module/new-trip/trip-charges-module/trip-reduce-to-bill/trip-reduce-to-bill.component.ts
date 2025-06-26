import { BehaviorSubject, forkJoin } from 'rxjs';
import { NewTripDataService } from '../../new-trip-data.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { getBlankOption, getNonTaxableOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl, FormGroup } from '@angular/forms';

import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CompanyTripGetApiService } from '../../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { debounceTime } from 'rxjs/operators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { TripService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/trip-services/trip.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-trip-reduce-to-bill', 
  templateUrl: './trip-reduce-to-bill.component.html',
  styleUrls: ['./trip-reduce-to-bill.component.scss'],
})
export class TripReduceToBillComponent implements OnInit {
  reduceBillForm  :UntypedFormGroup;
  defaultTax = new ValidationConstants().defaultTax;
  taxOption = getNonTaxableOption();
  reduceChargeData =[];
  initialDetails = {
    chargeType:[],
    expenseAccount:[],
    vendor:[],
    paymentStatus:[],
    expenseType:[],
    advanceClientAccount:[],
    employee:[],
    tax:[],
    expenseTax : []
  }
  addExpenseType={};
  coaDropdownIndex: number = -1;
  showAddCoaPopup: any = {name: '', status: false};
  coaParams: any = {
	name: '',
  };
  showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
  isPaymentStatusTrue=[];
  vendorList =[];
  unpaidStatus={label:'Unpaid',Value:''};
  vendorIndex=-1;
  @Input() isAddExpense=false;
  paymentStatusList =[{
    label:'Unpaid',
    id:'1'
  },{
    label:'Paid',
    id:'3'
  }];
  pattern = new ValidationConstants().VALIDATION_PATTERN
  expenseApi =TSAPIRoutes.static_options;
  policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
  @Input() isZeroAmountAccepted:boolean=true
  expenseTypeList :[];
  @Input() typeOfScreen:any
  @Input() isTripCode = false;
  monthsDropdownValues: any =[];
  expenseAccountList =[];
  advanceClientAccountList=[];
  @Input() singleEntry: boolean = false;
  @Input () isFormValid = new BehaviorSubject(true);
  @Output () dataFromReduceBill =new EventEmitter<any>();
  @Input () editTripData:any
  @Input() customerId = '';
  isDisableExpenses = false;
  driverList=[];
  isTax=true;
  taxOptions=[]
  constructor(private _fb:UntypedFormBuilder,private _newTripFuelService:NewTripDataService, private _companyTripGetApiService:CompanyTripGetApiService,private _tripService:TripService,private dialog : Dialog,
    private _partyService: PartyService,private _rateCardService : RateCardService,private _employeeService:EmployeeService,private commonloaderservice:CommonLoaderService,private _taxModuleService:TaxModuleServiceService,private _taxService:TaxService) { }
  ngOnInit() {
    this.buildForm();
    this.prepareRequest();
    this.isTax = this._taxService.getTax();
    this.commonloaderservice.getShow()

    let params = {
      vehicle_category : 0
    }
    const obs1 = this._rateCardService.getCustomerAdditionalCharge(this.customerId,params);;
    const obs2 = this._employeeService.getEmployeesListV2();
    const obs3 = this._taxModuleService.getTaxDetails()
    const obs4 =this._tripService.getAccounts(new ValidationConstants().expense)
    const obs5=this._tripService.getClientExpenseAccounts()
    const obs6=this._partyService.getPartyList('0', '1')
    if(this.typeOfScreen == 'partyReduceBill'){
      this.reduceChargeData = this._newTripFuelService.reduceChargeData;
    }else{
      this.reduceChargeData = this._newTripFuelService.transporterreduceChargeData;
    }
    const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
    forkJoin([obs1,obs2,obs3,obs4,obs5,obs6]).subscribe((response:any)=>{        
      this.expenseTypeList = response[0].result;
      this.driverList = response[1].result
      this.taxOptions = response[2].result['tax'];
      this.expenseAccountList = response[3].result;
      this.advanceClientAccountList = response[4]['result'].bank_accounts
      this.vendorList = response[5].result;
      if( this.reduceChargeData.length>0){
        if(this.editTripData.data.hasOwnProperty('party_reduce_bill_charges')){
          this.initialDetails.chargeType[0] = {label:this.editTripData.data?.party_reduce_bill_charges[this.editTripData.index]?.type['label']} 
        }
        if(this.editTripData.data.hasOwnProperty('vp_reduce_bill_charges')){
          this.initialDetails.chargeType[0] = {label:this.editTripData.data?.vp_reduce_bill_charges[this.editTripData.index]?.type['label']} 
        }
       this.addItem(this.reduceChargeData);
       setTimeout(() => {
        itemarray.controls.forEach((item,index) => {
          this.patchFormData(item,index);
          })
       }, 100);
        this.enableDisableChargesAndExpenses();
      }else{
        this.addItem([{}]);
      }
      this.commonloaderservice.getHide();
    },
    (error) => {
      console.error('Error:', error);
    }
    )
   this.reduceBillForm.valueChanges.subscribe(data=>{
    if(this.typeOfScreen == 'partyReduceBill'){
      this._newTripFuelService.reduceChargeData = data['reduce_array'];
    }else{
      this._newTripFuelService.transporterreduceChargeData = data['reduce_array'];
    }
   })
   this.isFormValid.subscribe(valid=>{if(!valid){this.setAsTouched(this.reduceBillForm)}});
  }

  buildForm(){
    this.reduceBillForm = this._fb.group({
      reduce_array:this._fb.array([])
    })
  }


  addMoreItem(){
    const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.initialDetails.chargeType.push(getBlankOption());
    this.initialDetails.expenseAccount.push(getBlankOption());
    this.initialDetails.vendor.push(getBlankOption());
    this.initialDetails.expenseType.push(getBlankOption());
    this.initialDetails.advanceClientAccount.push(getBlankOption());
    this.initialDetails.paymentStatus.push(this.unpaidStatus);
    this.initialDetails.tax.push(this.taxOption)
    this.initialDetails.expenseTax.push(this.taxOption);

  }

  removeItem(i){
    const itemarray =this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.initialDetails.chargeType.splice(i,1);
    this.initialDetails.expenseAccount.splice(i,1);
    this.initialDetails.vendor.splice(i,1);
    this.initialDetails.expenseType.splice(i,1);
    this.initialDetails.paymentStatus.splice(i,1);
    this.initialDetails.advanceClientAccount.splice(i,1);
    this.initialDetails.tax.splice(i,1);
    this.initialDetails.expenseTax.splice(i,1);

  }


  clearAllClient(){
    const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
    itemarray.controls =[];
    itemarray.reset();
    this.initialDetails.chargeType =[];
    this.initialDetails.expenseAccount =[];
    this.initialDetails.vendor =[];
    this.initialDetails.expenseType =[];
    this.initialDetails.paymentStatus =[];
    this.initialDetails.advanceClientAccount =[];
    this.initialDetails.tax=[]
    this.initialDetails.expenseTax = [];
    this.addItem([{}]);
  }

  addItem(items: any){
    const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.initialDetails.chargeType.push(getBlankOption());
      this.initialDetails.expenseAccount.push(getBlankOption());
      this.initialDetails.vendor.push(getBlankOption());
      this.initialDetails.expenseType.push(getBlankOption());
      this.initialDetails.advanceClientAccount.push(getBlankOption());
      this.initialDetails.employee.push(getBlankOption());
      this.initialDetails.paymentStatus.push(this.unpaidStatus);
      this.initialDetails.tax.push(this.taxOption);
      this.initialDetails.expenseTax.push(this.taxOption);
    });
  }

  buildItem(item){
    return this._fb.group({
      id: [item.id || null],
      type: [item.type||null,[Validators.required]],
      amount: [item.amount ||0.00,[Validators.required,Validators.min(0.01)]],
      amount_before_tax:[item.amount_before_tax,[Validators.required,Validators.min(0.01)]],
      tax:[item.tax||this.defaultTax],
      date: [item.date || new Date(dateWithTimeZone())],
      expense_type: [item.expense_type||1],
      expense_amount_before_tax: [item.expense_amount_before_tax||0.000],
      expense_tax : [item.expense_tax || this.defaultTax],
      expense_account: [item.expense_account||null],
      expense_amount: [item.expense_amount||0.00],
      expense_payment_amount: [item.expense_payment_amount||0.00],
      expense_payment_mode: [item.expense_payment_mode||null],
      expense_bill_no: [item.expense_bill_no||'',[Validators.pattern(this.policyNumber)]],
      expense_bill_date: [item.expense_bill_date||null],
      expense_party: [item.expense_party||null],
      expense_status: [item.expense_status||'1'],
      is_expense:[item.is_expense||false],
      employee:[item.employee||null],
      is_driver_paid:[item.is_driver_paid||false],
      bill_created: [item.bill_created != undefined ? item.bill_created : false]
    });
  }




 

 

  getExpenseAccountList(){
    this._companyTripGetApiService.getexpenseAccountList(expenseAccountList=>{ this.expenseAccountList=expenseAccountList});
  }


  patchFormData(form,index){ 
  if(form.value['expense_account']){
    const expenseLabel =this.expenseAccountList.filter(item =>item['id']==form.value['expense_account']);
    this.initialDetails.expenseAccount[index] = {label:expenseLabel[0]['name']}
  }
  if(form.value['expense_status']){
      const expenseLabel =this.paymentStatusList.filter(item =>item['id']==form.value['expense_status']);
      this.initialDetails.paymentStatus[index] =expenseLabel[0];
  }else{
    this.initialDetails.paymentStatus[index] =this.unpaidStatus;
  }

  if(form.value['expense_payment_mode']){
   const expenseLabel =this.advanceClientAccountList.filter(item =>item['id']==form.value['expense_payment_mode']);
   this.initialDetails.advanceClientAccount[index] = {label:expenseLabel[0]['name']}
  }

  if(!form.value['expense_payment_mode']){
    if(form.value['is_driver_paid']){
      form.get('expense_payment_mode').setValue('paid_By_Driver')
      this.initialDetails.advanceClientAccount[index] = {label:'Paid By Employee'}
    }
  }

  if(form.value['expense_party']){
    const expenseLabel =this.vendorList.filter(item =>item['id']==form.value['expense_party']);
    this.initialDetails.vendor[index] = {label:expenseLabel[0]['party_display_name']}
   }

   if(form.value['tax']){
    const taxLabel =this.taxOptions.find(item =>item['id']==form.value['tax']);
    this.initialDetails.tax[index] = {label:taxLabel['label']}
   }
   if(form.value['expense_tax']){
    const taxLabel =this.taxOptions.find(item =>item['id']==form.value['expense_tax']);
    this.initialDetails.expenseTax[index] = {label:taxLabel['label']}
   }

   if(form.value['employee']){
    const employee =this.driverList.find(item =>item['id']==form.value['employee']);
    this.initialDetails.employee[index] = {label:employee['first_name']}
   }

  }

  onCalculationChange(){
    const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
    this.taxOptions.forEach(tax=>{
      itemarray.controls.forEach(form => {
        if(form.get('tax').value==tax.id){
          let amountWithoutTax = Number(form.get('amount_before_tax').value);
          let  amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +Number(amountWithoutTax)).toFixed(3);
          form.get('amount').setValue(amountWithTax)
        }
      });
   
    })
  }

  prepareRequest(){
    this.reduceBillForm.valueChanges.pipe(
      debounceTime(100),
    ).subscribe(data=>{
    let outPutData={
      isFormValid:this.reduceBillForm.valid,
      allData :[]
    }
     if(this.reduceBillForm.valid){
      outPutData={
        isFormValid:this.reduceBillForm.valid,
        allData :this.getAllValues(data['reduce_array'])
      }
     }else{
      outPutData={
        isFormValid:this.reduceBillForm.valid,
        allData :[]
      }
     }
    this.dataFromReduceBill.emit(outPutData)
    })
  }
  getAllValues(data){
   let dataWithValid =[];
   data.forEach(element => {
    element['date']=changeDateToServerFormat(element['date']);
    if(element['expense_bill_date']){
      element['expense_bill_date']=changeDateToServerFormat(element['expense_bill_date'])
    }
    dataWithValid.push(element)
   });
   return dataWithValid
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

  addParamsCoaItem($event) {
    this.coaParams = {
      name: $event
    };
  }

  openAddCoaModal($event, index) {
    if ($event)
      this.coaDropdownIndex = index;
      this.showAddCoaPopup = {name: this.coaParams.name, status: true};
    }

    closeCoaPopup(){
      this.showAddCoaPopup = {name: '', status: false};
    }

    addExpenseToOption($event){
      if ($event) {
        this.getExpenseAccountList();
        if (this.coaDropdownIndex != -1){
        this.initialDetails.expenseAccount[this.coaDropdownIndex] = {value: $event.id, label: $event.label};
        let form = ( this.reduceBillForm.controls.reduce_array as UntypedFormArray).at(this.coaDropdownIndex)
         form.get('expense_account').setValue($event.id);
        this.coaDropdownIndex = -1;
        }
      }
    }

	openAddPartyModal($event,index) {
		if ($event)
			this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
      this.vendorIndex = index
	}

	addValueToPartyPopup(event) {
		if (event) {
			const val = trimExtraSpaceBtwWords(event);
			const arrStr = val.toLowerCase().split(' ');
			const titleCaseArr: string[] = [];
			for (const str of arrStr) {
				titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
			}
			const word_joined = titleCaseArr.join(' ');
			this.partyNamePopup = word_joined;
		}
	}

	addPartyToOption($event) {
		if ($event.status) {
			this.getVendorDetails();
      if (this.vendorIndex != -1){
        this.initialDetails.vendor[this.vendorIndex] = {value: $event.id, label: $event.label};
        let form = ( this.reduceBillForm.controls.reduce_array as UntypedFormArray).at(this.vendorIndex)
         form.get('expense_party').setValue($event.id);
        this.vendorIndex = -1;
        }
		}
	}

  getVendorDetails() {
		this._partyService.getPartyList('0', '1').subscribe((response) => {
			this.vendorList = response.result;
		});

	}



  changePaymentAmount(item,i){
    const paymentType = item.get('expense_status').value;
    if(paymentType=='3'){
      setUnsetValidators(item,'expense_payment_mode',[Validators.required]);
      setUnsetValidators(item,'expense_bill_no',[Validators.required,Validators.pattern(this.policyNumber)]);
      item.get('expense_bill_date').setValue(item.get('date').value);
    }
    if(paymentType=='1'){
      setUnsetValidators(item,'expense_payment_mode',[Validators.nullValidator]);
      setUnsetValidators(item,'expense_bill_no',[Validators.nullValidator]);
      item.get('expense_payment_mode').setValue(null);
      item.get('expense_bill_no').setValue('');
      item.get('expense_bill_date').setValue(null);
      this.initialDetails.advanceClientAccount[i]= getBlankOption();
    }
    this.paymentmodeChanged(item)
  }

  addExpense(form:UntypedFormGroup,i:number){
    this.initialDetails.employee[i] =getBlankOption();
    const expenseType = form.get('expense_type').value;
    this.initialDetails.paymentStatus[i] =this.unpaidStatus;
    this.initialDetails.expenseTax[i] = this.taxOption;
    form.get('expense_status').setValue('1');
    if(expenseType==2 &&this.isAddExpense){
      setUnsetValidators(form,'employee',[Validators.nullValidator]);
      form.get('expense_payment_mode').setValue(null);
      form.get('expense_amount_before_tax').setValue(0.000);
      form.get('expense_amount').setValue(0.000);
      form.get('expense_tax').setValue(this.defaultTax);
      setUnsetValidators(form,'type',[Validators.required]);
      setUnsetValidators(form,'expense_party',[Validators.required]);
      setUnsetValidators(form,'expense_amount_before_tax',[Validators.required,Validators.min(0.01)]);
    }else if(expenseType==3 &&this.isAddExpense){
      form.get('expense_payment_mode').setValue(null);
      setUnsetValidators(form,'employee',[Validators.nullValidator]);
      form.get('expense_bill_no').setValue('');
      form.get('expense_party').setValue(null);
      form.get('expense_amount_before_tax').setValue(0.000);
      form.get('expense_amount').setValue(0.000);
      form.get('expense_tax').setValue(this.defaultTax);
      setUnsetValidators(form,'expense_party',[Validators.nullValidator]);
      setUnsetValidators(form,'expense_payment_mode',[Validators.required]);
      setUnsetValidators(form,'expense_amount_before_tax',[Validators.required,Validators.min(0.01)]);
      form.get('expense_bill_date').setValue(form.get('date').value);
    }else
    {
      this.initialDetails.expenseType[i] =getBlankOption();
      this.initialDetails.expenseAccount[i] =getBlankOption();
      this.initialDetails.vendor[i] =getBlankOption();
      this.initialDetails.employee[i] =getBlankOption();
      this.initialDetails.advanceClientAccount[i] =getBlankOption();
      form.get('expense_payment_mode').setValue(null);
      form.get('expense_party').setValue(null);
      form.get('expense_amount_before_tax').setValue(0.000);
      form.get('expense_amount').setValue(0.000);
      form.get('expense_tax').setValue(this.defaultTax);
      form.get('expense_bill_no').setValue('');
      form.get('expense_bill_date').setValue(null);
      setUnsetValidators(form,'expense_payment_mode',[Validators.nullValidator]);
      setUnsetValidators(form,'expense_party',[Validators.nullValidator]);
      setUnsetValidators(form,'expense_account',[Validators.nullValidator]);
      setUnsetValidators(form,'expense_amount',[Validators.nullValidator]);
      setUnsetValidators(form,'expense_bill_no',[Validators.nullValidator]);
      setUnsetValidators(form,'expense_amount_before_tax',[Validators.nullValidator]);
    }
   this.paymentmodeChanged(form)
  }

  enableDisableChargesAndExpenses(){
    this.isDisableExpenses = false;

    if(this.isAddExpense){
      const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
      this.isDisableExpenses =  itemarray.controls[0].get('bill_created').value;
    }

  }

  closePartyPopup(){
    this.showAddPartyPopup = {name: '', status: false};
  }

  paymentmodeChanged(form:FormGroup){
    let value=form.get('expense_payment_mode').value;
    if(value==='paid_By_Driver'){ 
      form.get('employee').setValidators(Validators.required)
      form.get('is_driver_paid').setValue(true)
    }else{
      form.get('employee').setValue('')
      form.get('employee').setValidators(Validators.nullValidator)
      form.get('is_driver_paid').setValue(false)
    }
    form.get('employee').updateValueAndValidity()
  }

  onExpenseCalculationChange(){
    const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
    this.taxOptions.forEach(tax=>{
      itemarray.controls.forEach(form => {
        if(form.get('expense_tax').value==tax.id){
          let amountWithoutTax = Number(form.get('expense_amount_before_tax').value);
          let  amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +Number(amountWithoutTax)).toFixed(3);
          form.get('expense_amount').setValue(amountWithTax)
        }
      });
   
    })
  }

  addNewAdditionalCharge(event,i) {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data : {
        data:'0',
        charge_name: event,
				isEdit: false,
				sales: true,
				purchase: false,
				vehicleCategory:true,
				isDisableSeletAll: true
      },
      width: '1000px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if(item){
        const itemarray = this.reduceBillForm.controls['reduce_array'] as UntypedFormArray;
        this.getAdditionalCharges();
        itemarray.controls[i].get('type').setValue(item?.name?.id);
        this.initialDetails.chargeType[i] = {label :item?.name?.name};
      }
     
      dialogRefSub.unsubscribe();
    })
  }

  getAdditionalCharges() {
    let params = {
      vehicle_category : 0
    }
    this._rateCardService.getCustomerAdditionalCharge(this.customerId,params).subscribe((response: any) => {
      this.expenseTypeList = response.result;
    });
  }

}
