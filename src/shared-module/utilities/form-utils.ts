import { AbstractControl, FormArray, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import { TransportValidator } from "../components/validators/validators";

export function setUnsetValidators(form:AbstractControl ,formControlName:string,validators:Array<any>) {
  form.get(formControlName).setValidators(validators);
  form.get(formControlName).updateValueAndValidity();

}


export function  addErrorClass(controlName: AbstractControl) {
  return TransportValidator.addErrorClass(controlName);
}
export function  setAsTouched(group: UntypedFormGroup | UntypedFormArray| FormGroup|FormArray) {
  group.markAsTouched();
  for (let i in group.controls) {
    if (group.controls[i] instanceof UntypedFormControl) {
      group.controls[i].markAsTouched();
    } else {
      setAsTouched(group.controls[i]);
    }
  }
}

