import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PartyType, ValidationConstants, VendorType } from 'src/app/core/constants/constant';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-job-card-payments',
  templateUrl: './job-card-payments.component.html',
  styleUrls: ['./job-card-payments.component.scss']
})
export class JobCardPaymentsComponent implements OnInit {
  @Input() paymentForm:FormGroup;
  @Input()paymentEditData?:Observable<any>
  initialValues = {
    vendor: {},
    paymentMode: {},
    paid_employee: getBlankOption()
  }
  is_driver_paid = false;
  paymentTypes = [{
    label: 'Paid',
    id: 1
  },
  {
    label: 'Billed and Pay Later',
    id: 2
  },
    {
      label:'Not Applicable',
      id:-1
    }
  ];
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  vendorId = '';
  vendorList=[];
  paymentModeList =[];
  paymentEditDataValue:any;
  activeEmpList = [];
  paymentTermCustom=new ValidationConstants().paymentTermCustom;

  constructor(private _revenueService: RevenueService,private _partyService: PartyService,) { }

  ngOnInit(): void {
    this.getVendorDetails();
    this.getPaymentModeList();
    this.getActiveEmpList();
    if(this.paymentEditData){
      this.paymentEditData.subscribe(editData=>{
          this.paymentEditDataValue=editData;
          this.paymentEditDataValue.payment_type = this.paymentEditDataValue.payment_type.id;
          this.paymentForm.get('payment_type').setValue(this.paymentEditDataValue.payment_type);
          this.paymentForm.get('bill_number').setValue(this.paymentEditDataValue.bill_number)
          this.patchVendor();
          this.patchPaymentType();
      })
    }else{
      setTimeout(() => {
        this.onChangePaymentOptions();
      }, 1000);
     
    }
  }

  

  patchVendor() {
    if (this.paymentEditDataValue.vendor) {
      this.initialValues.vendor = { label: this.paymentEditDataValue.vendor.label };
      this.paymentForm.get('vendor').setValue(this.paymentEditDataValue.vendor.id);
    }

  }

  patchPaymentType() {
    if (this.paymentEditDataValue.payment_type == 1) {
      if (this.paymentEditDataValue.payment_mode == null) {
        this.paymentForm.get('payment_mode').setValue('paid_By_Driver');
        this.initialValues.paymentMode['label'] = 'Paid By Employee';
        this.is_driver_paid = true;
        this.paymentForm.get('paid_employee').setValue(this.paymentEditDataValue.paid_employee.id);
        this.initialValues.paid_employee['label'] = this.paymentEditDataValue?.paid_employee?.display_name;
        this.initialValues.paid_employee['value'] = this.paymentEditDataValue?.paid_employee?.id;
      }
      else {
        this.is_driver_paid = false;
        this.paymentForm.get('payment_mode').setValue(this.paymentEditDataValue.payment_mode.id);
        this.initialValues.paymentMode['label'] = this.paymentEditDataValue?.payment_mode?.name;
        this.initialValues.paymentMode['value'] = this.paymentEditDataValue?.payment_mode?.id;
      }
    }


  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  onChangePaymentOptions() {
    let form = this.paymentForm;
    const selectedOption = form.get('payment_type').value;
    form.get('bill_number').setValue('')
    if (selectedOption) {
      if (selectedOption == 1) {
        setUnsetValidators(form, 'payment_mode', [Validators.required]);
        setUnsetValidators(form, 'bill_date', [Validators.nullValidator]);
        setUnsetValidators(form, 'vendor', [Validators.nullValidator]);
        form.get('bill_date').setValue(new Date(dateWithTimeZone()));
        form.get('service_date').setValue(new Date(dateWithTimeZone()));
        form.get('due_date').setValue(new Date(dateWithTimeZone()));
      } else if (selectedOption == 2) {
        setUnsetValidators(form, 'bill_date', [Validators.required]);
        setUnsetValidators(form, 'vendor', [Validators.required]);
        setUnsetValidators(form, 'payment_mode', [Validators.nullValidator]);
        setUnsetValidators(form, 'paid_employee', [Validators.nullValidator]);
        form.get('service_date').setValue(new Date(dateWithTimeZone()));
        form.get('bill_date').setValue(new Date(dateWithTimeZone()));
        form.get('due_date').setValue(new Date(dateWithTimeZone()));
        form.get('payment_mode').setValue(null);
        form.get('paid_employee').setValue(null);
        this.is_driver_paid = false;
        this.initialValues.paymentMode = getBlankOption();
        this.initialValues.paid_employee = getBlankOption();
      }else if (selectedOption == -1) {
        setUnsetValidators(form, 'bill_date', [Validators.nullValidator]);
        setUnsetValidators(form, 'vendor', [Validators.nullValidator]);
        setUnsetValidators(form, 'payment_mode', [Validators.nullValidator]);
        setUnsetValidators(form, 'paid_employee', [Validators.nullValidator]);
        form.get('service_date').setValue(new Date(dateWithTimeZone()));
        form.get('bill_date').setValue(null);
        form.get('due_date').setValue(null);
        form.get('payment_mode').setValue(null);
        form.get('paid_employee').setValue(null);
        form.get('vendor').setValue(null);
        this.is_driver_paid = false;
        this.initialValues.paymentMode = getBlankOption();
        this.initialValues.paid_employee = getBlankOption();
        this.initialValues.vendor = getBlankOption();
      }
    }
  }


  openAddPartyModal($event) {
    if ($event)
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
  }
  closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}

  addPartyToOption($event) {
		if ($event.status) {
			this.getVendorDetails();
			this.initialValues.vendor = { value: $event.id, label: $event.label };
			this.paymentForm.get('vendor').setValue($event.id);

		}
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

  vendorSelected(id) {   
    this.vendorId = id;
    let params = {
      is_account: 'True',
      is_tenant: 'False',
      remove_cash_account:'False'
    }
   // this.getPartyDetails(id)
    this._revenueService.getDefaultBank(this.vendorId, params).subscribe((data) => {
      this.initialValues.paymentMode = getBlankOption();
      if(data['result']){
        this.paymentForm.get('payment_mode').setValue(data['result'].id);
        this.initialValues.paymentMode['label'] = data['result'].name;
        this.paymentModeChanged();
      }
    })
  }

  getPartyDetails(id){
    let form = this.paymentForm;
    const billDate=  form.get('bill_date').value
    const dueDate=  form.get('due_date')
    this._partyService.getPartyAdressDetails(id).subscribe(
      res => {
        const partyData= res['result']
        if(partyData['terms']){
          if(partyData['terms']['id']==this.paymentTermCustom){
            dueDate.setValue(PaymentDueDateCalculator(billDate, partyData['terms_days']))
          }else{
            dueDate.setValue(PaymentDueDateCalculator(billDate, partyData['terms']['value']))
          }
        }else{
          form.get('due_date').setValue(new Date(dateWithTimeZone()));
        }
       })
  }

  paymentModeChanged() {
    let value = this.paymentForm.get('payment_mode').value;
    if (value === 'paid_By_Driver') {
      this.is_driver_paid = true;
      setUnsetValidators(this.paymentForm, 'paid_employee', [Validators.required])
    }
    else {
      this.is_driver_paid = false;
      this.paymentForm.get('paid_employee').setValue(null)
      this.initialValues.paid_employee = getBlankOption();
      setUnsetValidators(this.paymentForm, 'paid_employee', [Validators.nullValidator])
    }
  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  getPaymentModeList() {
    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentModeList = response.result
    });
  }


  getActiveEmpList() {
    this._revenueService.getActiveEmployeeList().subscribe((data) => {
      this.activeEmpList = data['result']
    })
  }

  

}
