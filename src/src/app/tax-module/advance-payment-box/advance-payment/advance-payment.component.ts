import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TaxModuleServiceService } from '../../tax-module-service.service';

@Component({
  selector: 'app-advance-payment',
  templateUrl: './advance-payment.component.html',
  styleUrls: ['./advance-payment.component.scss']
})
export class AdvancePaymentComponent implements OnInit {

  advancePaymentForm: UntypedFormGroup;
  placeOfSupplyStateList =[]
  initialValues={
    placeOfSupply:{}
  }
  placeOfSupply =[];

@Input() isFormValid :Observable<any>;
@Input() paymentPatch :Observable<any>;
@Input() isPlaceOfSupplyRequired :Observable <any>;
@Output () indianHeaderTax = new EventEmitter<any>();
isPlaceOfSupplyRequireds=false;
isPlaceOfSupply: boolean = false;

	constructor(
		private _fb: UntypedFormBuilder,
    private _taxService :TaxModuleServiceService,
    private _tax:TaxService,

	) { }

  ngOnInit() {
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
    this.buildForm();
    this._taxService.getTaxDetails().subscribe(result=>{
      this.placeOfSupplyStateList=result.result['pos'];
    });
    this.isPlaceOfSupplyRequired.subscribe(data=>{
      if( data &&   this.isPlaceOfSupply ){
        this.addRemoveValidators(this.advancePaymentForm,'place_of_supply',[Validators.required]);
        this.isPlaceOfSupplyRequireds = true;
      }else{
        this.addRemoveValidators(this.advancePaymentForm,'place_of_supply',[Validators.nullValidator]);
        this.isPlaceOfSupplyRequireds = false;
      }
    })
    this.paymentPatch.subscribe(data=>{
      this.reset();
      if(data['place_of_supply'] &&  this.isPlaceOfSupply ){
         this.initialValues.placeOfSupply = {label:data['place_of_supply'],value:data['place_of_supply']};
         this.advancePaymentForm.get('place_of_supply').setValue(data['place_of_supply']);
      }
    })

    this.advancePaymentForm.valueChanges.subscribe(data=>{
       let taxData={
         isFormValid :this.advancePaymentForm.valid,
         headerTaxDetails :this.advancePaymentForm.value
       }
       this.indianHeaderTax.emit(taxData)
    })

    this.isFormValid.subscribe(data=>{
      if(!data){
        this.setAsTouched(this.advancePaymentForm)
      }
    })
  }

  buildForm() {
		this.advancePaymentForm = this._fb.group({
			place_of_supply: [''],
		});
    return this.advancePaymentForm;
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
      this.advancePaymentForm.patchValue({
        place_of_supply:''
      })
      this.initialValues.placeOfSupply={}
    }


    addRemoveValidators(form:UntypedFormGroup,key:string,validators:Array<any>){
      form.get(key).setValidators(validators);
      form.get(key).updateValueAndValidity();
    }




}
