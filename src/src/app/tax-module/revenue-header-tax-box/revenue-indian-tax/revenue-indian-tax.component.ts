import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';

import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

import { Observable } from 'rxjs';
import { TaxModuleServiceService } from '../../tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-revenue-indian-tax',
  templateUrl: './revenue-indian-tax.component.html',
  styleUrls: ['./revenue-indian-tax.component.scss']
})
export class RevenueIndianTaxComponent implements OnInit {

  indianTaxHeaderForm: UntypedFormGroup;
  placeOfSupplyStateList =[]
  initialValues={
    placeOfSupply:{}
  }
  placeOfSupply =[];
  isPlaceOfSupply=false;

@Input() partyDetails :Observable<any>;
@Input() dataPatch :Observable<any>;
@Input() isFormValid :Observable<any>;

@Output () indianHeaderTax = new EventEmitter<any>()

	constructor(
		private _fb: UntypedFormBuilder,
    private _taxService :TaxModuleServiceService,
    private _pos:TaxService
	) {
    this.isPlaceOfSupply = this._pos.isPlaceOfSupply();
  }

  ngOnInit() {
    this.buildForm();
    this._taxService.getTaxDetails().subscribe(result=>{
      this.placeOfSupply=result.result['pos'];
    });
    this.partyDetails.subscribe(data=>{
      this.reset();
      if(data.taxDeatils['place_of_supply']&&this.isPlaceOfSupply){
         this.initialValues.placeOfSupply = {label:data.taxDeatils['place_of_supply'],value:data.taxDeatils['place_of_supply']};
        this.indianTaxHeaderForm.get('place_of_supply').setValue(data.taxDeatils['place_of_supply']);
      }
    })
    this.dataPatch.subscribe(data=>{
      this.reset();
      this.indianTaxHeaderForm.patchValue(data)
     if(data['place_of_supply']&&this.isPlaceOfSupply){
      this.initialValues.placeOfSupply = {label:data['place_of_supply'],value:data['place_of_supply']};
      this.indianTaxHeaderForm.get('place_of_supply').setValue(data['place_of_supply']);
     }
    })

    this.indianTaxHeaderForm.valueChanges.subscribe(data=>{
       let taxData={
         isFormValid :this.indianTaxHeaderForm.valid,
         headerTaxDetails :this.indianTaxHeaderForm.value
       }
       this.indianHeaderTax.emit(taxData)
    });
    this.isFormValid.subscribe(data=>{
      if(!data){
         this.setAsTouched(this.indianTaxHeaderForm)
      }
    })
  }

  buildForm() {
		this.indianTaxHeaderForm = this._fb.group({
			place_of_supply: [
				'', [this.isPlaceOfSupply?Validators.required:Validators.nullValidator]
			],
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


    reset(){
      this.indianTaxHeaderForm.patchValue({
        is_transaction_includes_tax: false,
        is_transaction_under_reverse: false,
        place_of_supply:''
      })
      this.initialValues.placeOfSupply={}
    }

}
