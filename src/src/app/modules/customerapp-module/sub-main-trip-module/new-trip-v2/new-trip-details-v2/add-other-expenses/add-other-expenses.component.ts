import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TripsAddEditPopUp } from '../trip-details-v2.interface';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-other-expenses',
  templateUrl: './add-other-expenses.component.html',
  styleUrls: ['./add-other-expenses.component.scss']
})
export class AddOtherExpensesComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: TripsAddEditPopUp,private formBuilder:FormBuilder,
  private _companyTripGetApiService :CompanyTripGetApiService,private commonloaderservice:CommonLoaderService,private newTripv2service:NewTripV2Service
  ,private _employeeService: EmployeeService, private _tokenExpireService:TokenExpireService,private _revenueService:RevenueService,
  private _taxService:TaxService,private _taxModuleService:TaxModuleServiceService,private dialog : Dialog,
  private currency: CurrencyService,private apiHandler: ApiHandlerService
) { }
  addOtherExpensesPopUpForm:FormGroup;
  expenseTypeList:[];
  taxOption = getNonTaxableOption();
  initialDetails = {
    expenseType:getBlankOption(),
    paymentModeOp:getBlankOption(),
    employee: getBlankOption(),
    tax : this.taxOption,
  }
  accountList=[];
  isDriverSelected=false;
  maxDate=new Date(dateWithTimeZone());
  accountType = new ValidationConstants().accountType.join(',');
  tripToolTip: ToolTipInfo;
  driverList = [];
  constantsTripV2 = new NewTripV2Constants()
  isTax = true;
  taxOptions = [];
  defaultTax = new ValidationConstants().defaultTax;
  currency_type:any;
  uploadedDocs=[];

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.isTax = this._taxService.getTax();
    this.getTaxDetails();
    this.commonloaderservice.getHide();
    this.maxDate = new Date(this.data.tripStartDate)
    if(this.data.isDriverAdded){
      this.isDriverSelected =this.data.isDriverAdded
    }    this.buildForm();
      if(this.data.type=='Edit'){
       this.patchForm(this.data['editdata'])
      }
    setTimeout(() => {
      this.getExpenseTypeList();
      this.getAccountList();
    }, 100);
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.OTHER_EXPENSES.CONTENT
    }
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
   
  }

  buildForm(){
    this.addOtherExpensesPopUpForm=this.formBuilder.group({
      id:[null],
      expense_type:[null,Validators.required],
      amount_before_tax:[null,[Validators.required, Validators.min(0.1)]],
      payment_mode:['',Validators.required],
      employee:[''],
      transaction_date:[this.maxDate,Validators.required],
      is_driver_paid: false,
      tax : [this.defaultTax],
      amount : [0.000],
      documents:[[]],
    })
  }

  getTaxDetails() {
		this._taxModuleService.getTaxDetails().subscribe(result => {
			this.taxOptions = result.result['tax'];
		})
	}
  patchForm(data){
    this.addOtherExpensesPopUpForm.patchValue({
      id:data.id,
      expense_type:data.expense_type.id,
      amount_before_tax:data.amount_before_tax,
      transaction_date:data.transaction_date,
      employee:data.employee_id,
      tax : data?.tax.id,
      amount : data.amount
    });
    if(data.documents?.length >0){
      let documents=this.addOtherExpensesPopUpForm.get('documents').value;
      data.documents.forEach(element => {
      documents.push(element.id);
      this.uploadedDocs.push(element)
      })
    };
    if(data.is_driver_paid){
      this.addOtherExpensesPopUpForm.get('payment_mode').setValue('paid_by_Driver');
      this.initialDetails.paymentModeOp = {label:'Paid By Employee',value:''}
      this.initialDetails.employee = {label : data.employee_name, value : data.employee_id}
      this.paymentmodeChanged()
    }else{
      this.addOtherExpensesPopUpForm.get('payment_mode').setValue(data.payment_mode.id);
      this.initialDetails.paymentModeOp = {label:data.payment_mode.name,value:''}
    }
    this.initialDetails.expenseType ={label:data.expense_type['name'],value:data.expense_type['id']};
    this.initialDetails.tax ={label:data.tax['label'],value:data.tax['id']};
  }

  getAccountList(){
    this._companyTripGetApiService.getAccounts(this.accountType ,accountList=>{ this.accountList = accountList });
 
   }

  getExpenseTypeList() {
    this._revenueService.getExpense().subscribe((response) => {
      this.expenseTypeList=response['result']
    })
  }
 onchageCharges(){
  const expenseObj=this.expenseTypeList.find(expense=>expense['id']==  this.addOtherExpensesPopUpForm.get('expense_type').value)
  if(expenseObj){
    this.addOtherExpensesPopUpForm.get('amount_before_tax').setValue(expenseObj['rate_per_unit']);
    this.onExpesneCalculationChange()
  }
 }

  paymentmodeChanged(){
    let value=this.addOtherExpensesPopUpForm.get('payment_mode').value;
    if(value==='paid_by_Driver'){   
      this.addOtherExpensesPopUpForm.get('employee').setValidators(Validators.required)   
      this.getAssignedDriversList()
    }else{
      this.addOtherExpensesPopUpForm.get('employee').setValidators(Validators.nullValidator)   
      this.addOtherExpensesPopUpForm.get('employee').setValue('')
    }
    this.addOtherExpensesPopUpForm.get('employee').updateValueAndValidity() 
  }

  getAssignedDriversList(){
    this._employeeService.getEmployeesListV2().subscribe((response) => {
      this.driverList = response['result'];      
    });
  }



  cancel(){
    this.dialogRef.close(false)
    this.commonloaderservice.getShow()

  }

  save(){
    let form = this.addOtherExpensesPopUpForm;    
    let documents=this.uploadedDocs.map(doc=>doc.id)
    this.addOtherExpensesPopUpForm.get('documents').setValue(documents)
     if(form.valid) {
      this.commonloaderservice.getShow();
      form.value['transaction_date'] = changeDateToServerFormat(form.value['transaction_date'])
      if(form.value['payment_mode']=='paid_by_Driver'){
        form.value['is_driver_paid']=true;
        form.value['payment_mode']=null;
      }else{
        form.value['is_driver_paid']=false;
      }
      let data={
        other_expenses: form.value
      }
       this.apiHandler.handleRequest(this.newTripv2service.putOtherExpenses(this.data.tripId, data), 'Expense saved successfully!').subscribe(
         {
           next: () => {
             this.dialogRef.close(true)
           }
         }
       )

    }else{
      this.setAsTouched(form);
    }

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

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  onExpesneCalculationChange(){
    let form = this.addOtherExpensesPopUpForm;
    this.taxOptions.forEach(tax=>{
      if(form.get('tax').value==tax.id){
        let amountWithoutTax = Number(form.get('amount_before_tax').value);
        let  amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +Number(amountWithoutTax)).toFixed(3);
        form.get('amount').setValue(amountWithTax)
      }
    })
  }

  addNewAdditionalCharge(event) {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data : {
			isEdit : false,
			charge_name : event,
			sales: false,
			purchase: true,
			vehicleCategory: false,
			isDisableSeletAll: false
      },
      width: '1000px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if(item){
        this.getExpenseTypeList();
        let form = this.addOtherExpensesPopUpForm
        form.get('expense_type').setValue(item?.name?.id);
        form.get('tax').setValue(item?.tax?.id);
        form.get('amount_before_tax').setValue(item?.purchase_unit_cost)
        this.initialDetails.expenseType ={label:item?.name?.name,value:''} ;
        this.initialDetails.tax = {label:item?.tax?.label,value:''};
        this.onExpesneCalculationChange();
      }
     
      dialogRefSub.unsubscribe();
    })
  }
 

  fileUploader(e){
    let documents=this.addOtherExpensesPopUpForm.get('documents').value;
    e.forEach(element => {
      documents.push(element.id);
      element['presigned_url']=element['url']
      this.uploadedDocs.push(element)
    });
  }
  fileDeleted(id){    
    this.uploadedDocs =  this.uploadedDocs.filter(doc=>doc.id !=id);
  }
}
