import { TaxService } from './../../../core/services/tax.service';
import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs';

import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TaxModuleServiceService } from '../../tax-module-service.service';
@Component({
  selector: 'app-indian-tax-header-field',
  templateUrl: './indian-tax-header-field.component.html',
  styleUrls: ['./indian-tax-header-field.component.scss']
})
export class IndianTaxHeaderFieldComponent implements OnInit {

  indianTaxHeaderForm: UntypedFormGroup;
  companyRegistered =true;
  disableTax = false;
  initialValues={
    placeOfSupply:{}
  }
  placeOfSupply =[];
  isunregisteredGst = false;
  isplaceOfSupplyRequired = false;
  isPlaceOfSupply: boolean = false;


@Input() partyDetails :Observable<any>;
@Output () indianHeaderTax = new EventEmitter<any>();
@Input() indianTaxPatch :Observable<any>;
@Input() indianTaxFormValid :Observable<any>;
@Input() isInclusive;
@Input() showTaxFields : boolean = true;


	constructor(
		private _fb: UntypedFormBuilder,
    private _taxService :TaxModuleServiceService,
    private _tax:TaxService,
	) { }

  ngOnInit() {
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
    this.buildForm();
    this._taxService.getTaxDetails().subscribe(result=>{
      this.placeOfSupply=result.result['pos'];
    });
    this.partyDetails.subscribe(data=>{
      this.reset();
      this.isunregisteredGst = data.isPartyRegistered;
      if( this.isunregisteredGst && this.isPlaceOfSupply){
        this.addRemoveValidators(this.indianTaxHeaderForm,'place_of_supply',[Validators.required]);
        this.isplaceOfSupplyRequired = true;
      }else{
        this.addRemoveValidators(this.indianTaxHeaderForm,'place_of_supply',[Validators.nullValidator]);
        this.isplaceOfSupplyRequired = false;
      }
      this.disableTax = ! this.isunregisteredGst
      this.companyRegistered = data['companyRegistered'];
      this.setTaxDisableState();
      if(data.taxDeatils['place_of_supply']&& this.isPlaceOfSupply){
         this.initialValues.placeOfSupply = {label:data.taxDeatils['place_of_supply'],value:data.taxDeatils['place_of_supply']};
        this.indianTaxHeaderForm.get('place_of_supply').setValue(data.taxDeatils['place_of_supply']);
      }
    });
    this.indianTaxPatch.subscribe(data=>{
      if(data['patchData']){
        this.indianTaxHeaderForm.patchValue(data['patchData']);
        if(this.isPlaceOfSupply){
          this.initialValues.placeOfSupply = {label:data['patchData']['place_of_supply'],value:data['patchData']['place_of_supply']};
          this.indianTaxHeaderForm.get('place_of_supply').setValue(data['patchData']['place_of_supply']);
        }else{
          this.initialValues.placeOfSupply = {label:'',value:''};
          this.indianTaxHeaderForm.get('place_of_supply').setValue('');
        }
        this.setTaxDisableState();
      }
    });
    this.indianTaxFormValid.subscribe(data=>{
      if(!data){
        this.setAsTouched(this.indianTaxHeaderForm);
      }
    })

    this.indianTaxHeaderForm.valueChanges.subscribe(data=>{
       let taxData={
         isFormValid :this.indianTaxHeaderForm.valid,
         headerTaxDetails :this.indianTaxHeaderForm.value
       }
       this.indianHeaderTax.emit(taxData)
    });
  }

  buildForm() {
		this.indianTaxHeaderForm = this._fb.group({
			place_of_supply: [''],
			is_transaction_includes_tax: [false],
			is_transaction_under_reverse: [false],
		});
    return this.indianTaxHeaderForm;
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

  setTaxDisableState() {
    const isReverseMechanism = this.indianTaxHeaderForm.get('is_transaction_under_reverse').value
      if (!this.isunregisteredGst && !isReverseMechanism) {
        this.indianTaxHeaderForm.get('is_transaction_includes_tax').setValue(false);
        this.disableTax = true;
        this.addRemoveValidators(this.indianTaxHeaderForm,'place_of_supply',[Validators.nullValidator]);
        this.isplaceOfSupplyRequired = false;
      } else {
        this.disableTax = false;
      }
      if(isReverseMechanism &&! this.isunregisteredGst && this.isPlaceOfSupply ){
        this.addRemoveValidators(this.indianTaxHeaderForm,'place_of_supply',[Validators.required]);
        this.isplaceOfSupplyRequired = true;
      }
    }

    reset(){
      this.disableTax=false;
      this.indianTaxHeaderForm.patchValue({
        is_transaction_includes_tax: false,
        is_transaction_under_reverse: false,
        place_of_supply:''
      })
      this.companyRegistered = false;
      this.initialValues.placeOfSupply={}
    }

    addRemoveValidators(form:UntypedFormGroup,key:string,validators:Array<any>){
      form.get(key).setValidators(validators);
      form.get(key).updateValueAndValidity();
    }

}
