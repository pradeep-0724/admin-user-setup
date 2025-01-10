import { AbstractControl } from "@angular/forms";

export class PersonalValidator {
    static addErrorClass(controlName: AbstractControl) {
		return {
			error: controlName.invalid && (controlName.dirty || controlName.touched)
		};
  }
}