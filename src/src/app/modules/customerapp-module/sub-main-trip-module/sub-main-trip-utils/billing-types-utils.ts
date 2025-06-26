import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms"
import { setUnsetValidators } from "src/app/shared-module/utilities/form-utils";
export type BillingTypeFields={
  id:string
  freight_type:string|number,
  rate:string|number,
  total_units:string|number,
  freight_amount:string|number,
}
export class BillingTypes{
  private billingForm:FormGroup
   constructor (){

   }

   buildForm(freight_type:number|string='1') {
    const _fb = new FormBuilder();
    this.billingForm = _fb.group({
      id: [null],
      freight_type:freight_type,
      rate: 0.00,
      total_units: 0.000,
      freight_amount: 0.000,
    });

    return  this.billingForm
  }

  

  onChangeCalulation() {      
    let rate = Number(this.billingForm.get('rate').value);
    let total_units = Number(this.billingForm.get('total_units').value);
    this.billingForm.get('freight_amount').setValue((rate * total_units).toFixed(3));
    if (rate > 0 || total_units > 0) {
      setUnsetValidators(this.billingForm, 'rate', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(this.billingForm, 'total_units', [Validators.required, Validators.min(0.01)])
      setUnsetValidators(this.billingForm, 'freight_type', [Validators.required]);
    } else {
      setUnsetValidators(this.billingForm, 'rate', [Validators.nullValidator]);
      setUnsetValidators(this.billingForm, 'total_units', [Validators.nullValidator])
      setUnsetValidators(this.billingForm, 'freight_type', [Validators.nullValidator]);
    }
  }

  onChangeCalculationsForTrips() {      
    let rate = Number(this.billingForm.get('rate').value);
    let total_units = Number(this.billingForm.get('total_units').value);
    this.billingForm.get('freight_amount').setValue((rate * total_units).toFixed(3));
  }

  onChangeBillingType() {
    this.billingForm.patchValue({
      rate: 0.00,
      total_units: 0.00,
      freight_amount: 0.000,
    });
    setUnsetValidators(this.billingForm, 'rate', [Validators.nullValidator]);
    setUnsetValidators(this.billingForm, 'total_units', [Validators.nullValidator])
  }

  patchBillingTypes(billingTypeField:BillingTypeFields){
    this.billingForm.patchValue({
      id:billingTypeField.id,
      freight_type:billingTypeField.freight_type,
      rate:billingTypeField.rate,
      total_units:billingTypeField.total_units,
      freight_amount:billingTypeField.freight_amount
    });
  }

  makeAllFieldRequired(except){
    if(except=='10' || except==10 ){
      setUnsetValidators(this.billingForm, 'rate', [Validators.nullValidator]);
      setUnsetValidators(this.billingForm, 'total_units', [Validators.nullValidator]);
      setUnsetValidators(this.billingForm, 'freight_amount', [Validators.required, Validators.min(0.01)]);
    }else{
      setUnsetValidators(this.billingForm, 'rate', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(this.billingForm, 'total_units', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(this.billingForm, 'freight_amount', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(this.billingForm, 'freight_type', [Validators.required]);

    }
  }

  addNewFormControl(controlName){
    this.billingForm.addControl(controlName,new FormControl(''))
  }

  

}