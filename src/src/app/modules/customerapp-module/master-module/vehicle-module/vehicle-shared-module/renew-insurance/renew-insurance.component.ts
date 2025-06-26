import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, Validators, FormGroup, AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat, PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { getObjectFromList, roundOffAmount, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { VehicleService } from '../../../../api-services/master-module-services/vehicle-services/vehicle.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-renew-insurance',
  templateUrl: './renew-insurance.component.html',
  styleUrls: ['./renew-insurance.component.scss']
})
export class RenewInsuranceComponent implements OnInit {

 @Input() popUpRenewInsurance = {
    show: false,
    data: {}
  }
  @Input() isMarketVehicle;
  renewDocumentForm: FormGroup;
  staticOptions:any;
  currency_type:any;
  current_day = new Date(dateWithTimeZone());
  insuranceTypeParams: any = {};
  insuranceCompanyNameParams: any = {};
  insuranceCompanyPostApi = TSAPIRoutes.static_options;
  insuranceTypes =[];
  insuranceCompanyName =[];
  reminder_drop: any;
  remindDropdown =[];
  initialValues={
    insuranceType:{},
    insuranceCompanyName:{},
    remindMe:{},
  }
  insuranceId=''
  patterns = new ValidationConstants().VALIDATION_PATTERN;
  @Output() dataFromNewInsurance=new EventEmitter()
  constructor(private _fb: UntypedFormBuilder, private _commonService: CommonService, private currency:CurrencyService,private _vehicleService:VehicleService) { }

  ngOnInit(): void {
    this.buildForm();
    this.getInsuranceCompanyNames();
    this.getInsuranceTypes();
    this.currency_type = this.currency.getCurrency();
    this.patchInsuranceNameAndType(this.popUpRenewInsurance.data);
   this.patchRenewForm(this.popUpRenewInsurance.data);
   this.insuranceId =this.popUpRenewInsurance.data['id'];
  }


  buildForm() {
    this.renewDocumentForm = this._fb.group({
      company_name: ['',],
      insurance_type: ['',],
      insured_declared_value: [0, Validators.pattern(this.patterns.FLOAT)],
      amount: [0, Validators.pattern(this.patterns.FLOAT)],
      policy_number: ['', [Validators.pattern(this.patterns.POLICY_NUMBER)]],
      fees_and_charges: [0, Validators.pattern(this.patterns.FLOAT)],
      renewal_date: [null],
      reminder: [null],
      remind_me: [null],
      issue_date: [null],
      documents: [[]]
    });
  }
  fileUploader(filesUploaded) {
    let documents = this.renewDocumentForm.get('documents').value;
    filesUploaded.forEach((element) => {
        documents.push(element.id);
    });
   }
  fileDeleted(deletedFileIndex) {
    let documents = this.renewDocumentForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }

  remindMeSelect(termId) {
		if (termId) {
			this.reminder_drop = getObjectFromList(termId, this.remindDropdown);
			let expiry_date = this.renewDocumentForm.controls.renewal_date.value;
			this.renewDocumentForm.controls['reminder'].setValue(
				PaymentDueDateCalculator(expiry_date, this.reminder_drop ? this.reminder_drop.value : null));
		}
  }

  onClenderChangeRenewaldate(){
    let remId = this.renewDocumentForm.controls['remind_me'].value;
		if (remId)
			this.remindMeSelect(remId);
  }
  roundOffValue(formControl){
    roundOffAmount(formControl);
  }

  addParamsToInsuranceCompanyName (event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.insuranceCompanyNameParams = {
        key: 'insurance-company',
        label: word_joined,
        value: 0
      };
    }
  }

  getNewInsuranceTypes($event){

    if ($event){
      this.initialValues.insuranceType= {};
      this.getInsuranceTypes();
      this.initialValues.insuranceType = {value: $event.id, label: $event.label};
      this.renewDocumentForm.controls['insurance_type'].setValue($event.id);
    }

  }
  addParamsToInsuranceType(event){
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
    this.insuranceTypeParams = {
      key: 'insurance-type',
      label: word_joined,
      value: 0
    };
  }
  }

  getNewInsuranceCompanyNames ($event) {
    if ($event) {
      this.initialValues.insuranceCompanyName= {};
      this.getInsuranceCompanyNames();
      this.initialValues.insuranceCompanyName= {value: $event.id, label: $event.label};
	   	this.renewDocumentForm.controls['company_name'].setValue($event.id);
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched()
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  getInsuranceCompanyNames() {
    this._commonService.getStaticOptions('insurance-company,set-reminder').subscribe((response) => {
      this.insuranceCompanyName = response.result['insurance-company'];
      this.remindDropdown = response.result['set-reminder'];
  });
  }

  getInsuranceTypes() {
    this._commonService.getStaticOptions('insurance-type').subscribe((response: any) => {
      this.insuranceTypes = response.result['insurance-type'];
    });
  }

  onClenderChangeExpiryDate() {
    this.initialValues.remindMe = { label: 'Custom', value: '380c6101-0140-422a-8006-740b141b6d53' };
    this.renewDocumentForm.get('remind_me').setValue('380c6101-0140-422a-8006-740b141b6d53');
  }

  patchInsuranceNameAndType(data: any) {
    let insuranceCompanyNameObj = new Object();
    let insuranceTypeObj = new Object();
    insuranceCompanyNameObj['label'] = data.company_name_label;
    insuranceCompanyNameObj['value'] = data.company_name;
    insuranceTypeObj['label'] = data.insurance_type_label;
    insuranceTypeObj['value'] = data.insurance_type;
    this.initialValues.insuranceCompanyName=insuranceCompanyNameObj;
    this.initialValues.insuranceType=insuranceTypeObj;
  }

  patchRenewForm(data){
    this.renewDocumentForm.patchValue(data);
    this.renewDocumentForm.patchValue({
      issue_date:new Date(dateWithTimeZone()),
      renewal_date:null,
      reminder:null,
      remind_me:null,
    });
    this.renewDocumentForm.patchValue({
      documents:[]
    });

  }

  cancelButtonClick() {
    this.dataFromNewInsurance.emit(false);
    this.popUpRenewInsurance.show = false;
   }

   onOkButtonClick() {
    let form = this.renewDocumentForm
      if(form.valid){
        form.value['issue_date']=changeDateToServerFormat(form.value['issue_date']);
        form.value['renewal_date']=changeDateToServerFormat(form.value['renewal_date']);
        form.value['reminder']=changeDateToServerFormat(form.value['reminder']);
        this._vehicleService.postNewVehicleInsuranceDocument(this.insuranceId ,form.value).subscribe(resp=>{
          this.dataFromNewInsurance.emit(true);
          this.popUpRenewInsurance.show = false;
        });

      }else{
        this.setAsTouched(form)
      }

   }


}
