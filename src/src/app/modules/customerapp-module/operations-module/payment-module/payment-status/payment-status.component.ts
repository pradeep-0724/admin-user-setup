import { debounceTime } from 'rxjs/operators';
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent implements OnInit {

  paymentStatusForm: UntypedFormGroup;
  currency_type;
  vendorDetails;
  paymentAccountList: any = [];
  paidOption: Object = new ValidationConstants().paidOption;
  payLaterOption: Object = new ValidationConstants().payLaterOption;
  initialValues: any = {
    paymentMode: getBlankOption(),
    paymentStatus: this.payLaterOption,
    paid_employee:getBlankOption()
  }
  @Input() balanceAmount = 0;
  @Input() vendorId: string = '';
  @Input() billDate: string = '';
  @Input() vendorList = [];
  @Input() is_account='True'
  @Input() is_tenant='False'
  isAmountUsed = false;
  isBankingChargeRequired = false;
  isPaymentModeRequired = false;
  paymentStatusDisable = true;
  @Output() paymentStatusData = new EventEmitter();
  @Input() $paymentStatusValid: Observable<any>;
  @Input() editPayemntStatusData;




  constructor(private _fb: UntypedFormBuilder, private currency: CurrencyService, private _revenueService: RevenueService
  ) {
    this.currency_type = this.currency.getCurrency();
  }
  activeEmpList=[]
  ngOnInit(): void {
    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentAccountList = response.result;
    });
    this._revenueService.getActiveEmployeeList().subscribe((data)=>{
      this.activeEmpList=data['result']
      
    })
    this.paymentStatusForm = this._fb.group({
      payment_status: 1,
      amount_paid: 0.000,
      transaction_date: null,
      payment_mode: null,
      is_driver_paid:[false],
      bank_charges: 0.000,
      paid_employee:[null]


    });
    this.paymentStatusChange();
    this.prepareRequest();
    this.$paymentStatusValid.subscribe(isValid => {
      if (!isValid) {
        this.setAsTouched(this.paymentStatusForm);
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('balanceAmount' in changes) {
      if (!changes.balanceAmount.firstChange) {
        this.paymentStatusChange();
      }
    }
    if ('editPayemntStatusData' in changes) {
      if (!changes.editPayemntStatusData.firstChange) {
        setTimeout(() => {
         this.patchPaymentStatus();
        }, 1000);
      }
    }
    if('vendorId' in changes){
      if(changes['currentValue'] || changes['previousValue'] )
      this.paymentStatusChange()
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  paymentStatusChange(isPatchBillDate=true) {
    let form = this.paymentStatusForm;
    const selectedPaymentStatus = this.paymentStatusForm.controls['payment_status'].value;
    if (selectedPaymentStatus == 1) {
      this.initialValues.paymentMode = getBlankOption();
      this.initialValues.paid_employee = getBlankOption();
      this.paymentStatusForm.controls['payment_mode'].setValue(null)
      this.paymentStatusForm.controls['paid_employee'].setValue(null)
      this.paymentStatusForm.controls['amount_paid'].setValue(0.000)
      this.paymentStatusForm.controls['bank_charges'].setValue(0.000);
      this.paymentStatusForm.controls['transaction_date'].setValue(null);
      setUnsetValidators(form, 'payment_mode', [Validators.nullValidator]);
      setUnsetValidators(form, 'paid_employee', [Validators.nullValidator]);
      setUnsetValidators(form, 'amount_paid', [Validators.nullValidator]);
      this.paymentStatusForm.controls['bank_charges'].disable();
      this.paymentStatusForm.controls['transaction_date'].disable();
      this.paymentStatusForm.controls['amount_paid'].disable();
      this.paymentStatusForm.controls['paid_employee'].disable();
      this.paymentStatusForm.controls['payment_mode'].disable();
      this.isPaymentModeRequired = false;
      this.isBankingChargeRequired = false;
      this.paymentStatusDisable = true;
      form.get('is_driver_paid').setValue(false);

    } else {
      let payment_mode = this.paymentStatusForm.get('payment_mode').value;
      if (this.vendorId && !payment_mode) {
        this.vendorDetails = this.vendorList.filter((ele) => ele.id === this.vendorId)[0];

      }

      this.isPaymentModeRequired = true;
      this.paymentStatusDisable = false;
      setUnsetValidators(form, 'amount_paid', [Validators.min(0.01)]);
      setUnsetValidators(form, 'payment_mode', [Validators.required]);
      this.paymentStatusForm.controls['transaction_date'].enable();
      this.paymentStatusForm.controls['bank_charges'].enable();
      this.paymentStatusForm.controls['payment_mode'].enable();
      this.paymentStatusForm.controls['amount_paid'].enable();
      this.paymentStatusForm.controls['paid_employee'].enable();
      if(isPatchBillDate)
      this.paymentStatusForm.controls['transaction_date'].setValue(this.billDate);
    }

    if (selectedPaymentStatus == 3) {
      setUnsetValidators(form, 'amount_paid', [Validators.min(this.balanceAmount), Validators.max(this.balanceAmount)]);
      this.paymentStatusForm.controls['amount_paid'].setValue(this.balanceAmount)
      let payment_mode = this.paymentStatusForm.get('payment_mode').value;
      if(!this.paymentStatusForm.get('is_driver_paid').value && !payment_mode){
        this.getDefaultBank(this.vendorId);
      }

    }
  }

  populatePaymentMethod(data) {            
      this.initialValues.paymentMode['label'] = data.name;
      this.initialValues.paymentMode['value'] = data.id;
      this.paymentStatusForm.get('payment_mode').setValue(data.id);
      this.onPaymentModeSelected()
  }

   getDefaultBank(id){
    let params={
      is_account:this.is_account,
      is_tenant:this.is_tenant,
      remove_cash_account:'False'
    }
    this._revenueService.getDefaultBank(id,params).subscribe((data)=>{
      this.populatePaymentMethod(data['result']);   
    })
  }

  onPaymentModeSelected() {
    let bank = this.paymentStatusForm.controls['payment_mode'].value;
    let form=this.paymentStatusForm;
    if(form.get('payment_mode').value === "paid_By_Driver"){
      form.get('is_driver_paid').setValue(true);
      this.paymentStatusForm.controls['paid_employee'].enable();
      this.paymentStatusForm.get('paid_employee').setValidators([Validators.required]);
      this.paymentStatusForm.get('paid_employee').updateValueAndValidity()
    }else{
      form.get('is_driver_paid').setValue(false);
      this.paymentStatusForm.get('paid_employee').setValue(null);
      this.paymentStatusForm.get('paid_employee').setValidators([Validators.nullValidator]);
      this.paymentStatusForm.get('paid_employee').updateValueAndValidity()
    }
    
    this.isBankingChargeRequired = bankChargeRequired(bank, this.paymentStatusForm.get('bank_charges'), this.paymentAccountList);
  }

  prepareRequest() {
    this.paymentStatusForm.valueChanges.pipe(debounceTime(200)).subscribe((values => {
      if(values.payment_status == 1) {
          values['amount_paid'] = 0.000,
          values['transaction_date'] = null,
          values['payment_mode'] = null,
          values['paid_employee'] = null,
          values['bank_charges'] = 0.000
      }
      if(values['is_driver_paid']){
          values['payment_mode'] = null  
      }
      let formdata = {
        data: values,
        valid: this.paymentStatusForm.valid
      }
      this.paymentStatusData.emit(formdata);
    }));
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

  patchPaymentStatus() {
    this.initialValues.paid_employee['label']=this.editPayemntStatusData?.paid_employee?.display_name;
    this.initialValues.paid_employee['value']=this.editPayemntStatusData?.paid_employee?.id;
    this.paymentStatusForm.get('paid_employee').setValue(this.editPayemntStatusData?.paid_employee?.id);
    this.initialValues.paymentStatus['label'] = this.editPayemntStatusData.payment_status.label;
    this.initialValues.paymentMode['label'] = isValidValue(this.editPayemntStatusData.payment_mode) ? this.editPayemntStatusData.payment_mode.name : '';
    this.paymentStatusForm.patchValue({
      payment_status:  this.editPayemntStatusData.payment_status.index ,
      amount_paid: this.editPayemntStatusData.amount_paid,
      transaction_date: this.editPayemntStatusData.transaction_date,
      payment_mode: isValidValue(this.editPayemntStatusData.payment_mode) ? this.editPayemntStatusData.payment_mode.id : '',
      bank_charges: this.editPayemntStatusData.bank_charges,
      paid_employee:this.editPayemntStatusData?.paid_employee?.id,
      is_driver_paid:this.editPayemntStatusData.is_driver_paid
    });
    if(isValidValue(this.editPayemntStatusData?.paid_employee?.id)){
      this.paymentStatusForm.get('is_driver_paid').setValue(true)
    }
    if(this.editPayemntStatusData.payment_mode===''||this.editPayemntStatusData.payment_mode==null){
      this.initialValues.paymentMode['label']='Paid By Employee';
      this.paymentStatusForm.controls['payment_mode'].setValue("paid_By_Driver")
    }
    let form = this.paymentStatusForm;
    const selectedPaymentStatus = this.paymentStatusForm.controls['payment_status'].value;
    
    if (selectedPaymentStatus > 1) {
      this.isPaymentModeRequired = true;
      this.paymentStatusDisable = false;
      this.paymentStatusForm.controls['transaction_date'].enable();
      this.paymentStatusForm.controls['bank_charges'].enable();
      this.paymentStatusForm.controls['payment_mode'].enable();
      this.paymentStatusForm.controls['amount_paid'].enable();
    }
    this.onPaymentModeSelected();
    if(this.editPayemntStatusData.paid_employee==null && this.editPayemntStatusData.payment_mode==null){
      this.paymentStatusForm.controls['payment_mode'].setValue(null);
      this.paymentStatusForm.get('paid_employee').setValidators([Validators.nullValidator]);
      this.paymentStatusForm.get('is_driver_paid').setValue(false)
    }
    this.balanceAmount =this.editPayemntStatusData.balance;
    if (selectedPaymentStatus == 3) {
      setUnsetValidators(form, 'amount_paid', [Validators.min(this.balanceAmount), Validators.max(this.balanceAmount)]);
    }
    this.isAmountUsed = this.editPayemntStatusData.is_amount_used;
    this.paymentStatusChange(false)
  }

 amountFieldChanged(){
  let form = this.paymentStatusForm;
    const selectedPaymentStatus = this.paymentStatusForm.controls['payment_status'].value;
    if(selectedPaymentStatus==3){
      setUnsetValidators(form, 'amount_paid', [Validators.min(this.balanceAmount), Validators.max(this.balanceAmount)]);
      this.paymentStatusForm.controls['amount_paid'].setValue(this.balanceAmount);
      this.initialValues.paymentStatus=this.paidOption;
      this.paymentStatusForm.controls['payment_status'].setValue(3);
    }
}

}
