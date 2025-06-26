import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl, AbstractControl, UntypedFormArray } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { TaxModuleServiceService } from '../../tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { debounceTime } from 'rxjs/operators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';

@Component({
  selector: 'app-indian-tax-company-fields',
  templateUrl: './indian-tax-company-fields.component.html',
  styleUrls: ['./indian-tax-company-fields.component.scss'],
})
export class IndianTaxCompanyFieldsComponent implements OnInit {

  indianTaxcompany: UntypedFormGroup;
  hideGst: boolean = false;
  gstInMinDate: Date = new Date("2017-07-01");
  sourceSupplyList: any;
  gstTreatments=[];
  returnCycle=[];
  sos=[];
  unregisteredGst = new ValidationConstants().unregisteredGst;
  paymentCycle: any = {label: ''};
  sourceOfSupply=getBlankOption();
  gstTreatment=getBlankOption();
  isEdit=false;
  isTds=true;
  isSoSRequired= true;
	alphaNumneric = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC;
	country = '';
	isUAE : boolean = false;
	corporateTaxSelectedOption = getBlankOption();
  hideCrn : boolean = true;
  countryId=''

 @Output() taxOutputData= new EventEmitter<any>();
 @Input() isTaxFormValidCompany :BehaviorSubject<any>;
 @Input() patchCompanyTax:BehaviorSubject<any>;


  constructor(
    private _fb: UntypedFormBuilder,
    private _taxService:TaxModuleServiceService,
    private _tax: TaxService,
    private _countryId:CountryIdService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.countryId=this._countryId.getCountryId();
    this.isTds = this._tax.getVat();
    this.hideGstOnUnregister();
    this.isTaxFormValidCompany.subscribe(data=>{
      if(!data){
        this.setAsTouched(this.indianTaxcompany)
      }
    })
    this.indianTaxcompany.valueChanges.pipe(debounceTime(1000,
      )).subscribe(data=>{
      if( this.indianTaxcompany.value['registration_date']){
        this.indianTaxcompany.value['registration_date']= changeDateToServerFormat(this.indianTaxcompany.value['registration_date'])
      }
      let outputData={
          isFormValid:this.indianTaxcompany.valid,
          taxData:this.indianTaxcompany.value
      }
      this.taxOutputData.emit(outputData);
    });
    this._taxService.getTaxOptions(this.countryId).subscribe(result=>{
      this.gstTreatments=result.result['gst_treatments'];
      this.returnCycle=result.result['return_cycle'];
      this.sos=result.result['sos'];
    });
    this.patchCompanyTax.subscribe(data=>{
      if(data['id']){
        this.patchForm(data);
        this.isEdit=true;
        this.hideGstOnUnregister();
        if(this.isTds){
          setUnsetValidators(this.indianTaxcompany,'crn_treatment',[Validators.required])
        }
      }
    })

  }

  buildForm() {
    this.indianTaxcompany = this._fb.group({
        source_of_supply: ['', [Validators.required]],
        treatment: [null, [Validators.required]],
        gstin: [null,[Validators.required, TransportValidator.gstValidator]],
        registration_date: [null, [Validators.required]],
        return_cycle: [null, [Validators.required]],
        pan: ['',[TransportValidator.panNumberValidator]],
        id:null,
        crn_treatment : [null],
			  crn_no : [null]
    });
  }

  setGstValidators(gst: boolean) {
    const gstForm = this.indianTaxcompany as UntypedFormGroup;
    const registratioDate = gstForm.get('registration_date');
    const returnCycle = gstForm.get('return_cycle');
    const gstin = gstForm.get('gstin');
    const pan = gstForm.get('pan');
    const sourceOfSupply = gstForm.get('source_of_supply');

    if (gst){
      if(!this.isTds){
        registratioDate.setValidators([Validators.required]);
        returnCycle.setValidators([Validators.required]);
        gstin.setValidators([Validators.required, TransportValidator.gstValidator]);
        sourceOfSupply.setValidators([Validators.required]);
        this.isSoSRequired = true;
      }else{
        registratioDate.setValidators(null);
        returnCycle.setValidators(null);
        sourceOfSupply.setValidators([Validators.nullValidator]);
        this.isSoSRequired = false;
        gstin.setValidators([Validators.required,TransportValidator.tranValidator,Validators.maxLength(15)]);
      }
      pan.setValidators(null);
    }
    else {
      registratioDate.setValidators(null);
      returnCycle.setValidators(null);
      gstin.setValidators(null);
      if(this.isTds){
        this.isSoSRequired = false;
        sourceOfSupply.setValidators(null);
        pan.setValidators(null);
      }else{
        pan.setValidators([TransportValidator.panNumberValidator]);
      }


    }
    sourceOfSupply.updateValueAndValidity();
    registratioDate.updateValueAndValidity();
    returnCycle.updateValueAndValidity();
    gstin.updateValueAndValidity();
    pan.updateValueAndValidity();
  }

  gstinChange(){
    const gstForm = this.indianTaxcompany as UntypedFormGroup;
    const gstin = gstForm.get('gstin');
    let pattern=new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
    if(this.isTds){
      gstin.setValidators([Validators.required,Validators.pattern(pattern),Validators.max(15)]);
      gstin.updateValueAndValidity({onlySelf: true});

    }
  }



  hideGstOnUnregister() {
		const gstForm = this.indianTaxcompany as UntypedFormGroup;
		if (gstForm.get('treatment').value == this.unregisteredGst) {
      this.hideGst = true;
      this.setGstValidators(false);
      gstForm.patchValue({gstin: '', registration_date: null, return_cycle: null});
      this.paymentCycle = {label: ''};
	  } else {
      this.hideGst = false;
      this.setGstValidators(true);
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

patchForm(data){
  this.indianTaxcompany.patchValue(data);
  if(data['source_of_supply']){
    this.sourceOfSupply={label:data['source_of_supply'],value:data['source_of_supply']};
  }
  if(isValidValue(data['treatment'])){
    this.gstTreatment={label:data['treatment'].label,value:data['treatment'].id};
    this.indianTaxcompany.get('treatment').setValue(data['treatment'].id)
  }
  if(isValidValue(data['return_cycle'])){
    this.paymentCycle={label:data['return_cycle'].label,value:data['return_cycle'].id};
    this.indianTaxcompany.get('return_cycle').setValue(data['return_cycle'].id)
  }
  if(isValidValue(data['crn_treatment'])){
    this.corporateTaxSelectedOption={label:data['crn_treatment']?.label,value:data['crn_treatment']?.id};
    this.indianTaxcompany.get('crn_treatment').setValue(data['crn_treatment']?.id)
  }
  this.corporateTaxChanged();
}

  corporateTaxChanged(){
    let tax = this.indianTaxcompany.get('crn_treatment').value;
    if(isValidValue(tax) && tax != this.unregisteredGst){
      this.hideCrn = false;
      setUnsetValidators(this.indianTaxcompany,'crn_no', [TransportValidator.crnValidator,Validators.maxLength(20),Validators.required])
    }else{
      this.hideCrn = true;
      this.indianTaxcompany.get('crn_no').setValue('')
      setUnsetValidators(this.indianTaxcompany,'crn_no',[Validators.nullValidator])
    }
}

}
