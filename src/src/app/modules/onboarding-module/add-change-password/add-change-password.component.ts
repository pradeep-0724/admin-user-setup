import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CompanyModuleServices } from '../../customerapp-module/api-services/company-service/company-module-service.service';

@Component({
  selector: 'app-add-change-password',
  templateUrl: './add-change-password.component.html',
  styleUrls: ['./add-change-password.component.scss']
})
export class AddChangePasswordComponent implements OnInit {
  changePasswordForm: UntypedFormGroup;
  apiError: any;
  constructor(private _companyModuleService:CompanyModuleServices, private _fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.changePasswordForm = this._fb.group({
      password: [
        '',
        Validators.required
      ],
      confirm_password: [
        '',
        Validators.required
      ]
    });
  }

  onFormSubmit() {
    this.matchPassword();
  }

  matchPassword() {
    const changePasswordForm = this.changePasswordForm as UntypedFormGroup;
    if (changePasswordForm.get('password').value.localeCompare(changePasswordForm.get('confirm_password').value) != 0) {
      changePasswordForm.get('password').setErrors({ passwordsNotMatch: true });
      changePasswordForm.get('confirm_password').setErrors({ passwordsNotMatch: true });
    }
    else {
      this.changePassword();
    }
  }

  changePassword() {
    const changePasswordForm = this.changePasswordForm as UntypedFormGroup;
    let userId = localStorage.getItem('TS_UID');
    if (changePasswordForm.valid) {
      this._companyModuleService.postUserPassword(userId,changePasswordForm.value).subscribe(
        res => {
          this._companyModuleService.isOpen.next(true);
        },
        error => {
          this.showApiError(error);
        });
    }
    else {
      this.setAsTouched(this.changePasswordForm);
    }
  }

  showApiError(error) {
    if (error.status == 400 && error.error && error.error.hasOwnProperty("error")) {
      this.apiError = error.error.error;
    }
    else if (error.error && error.error.hasOwnProperty("message")) {
      this.apiError = error.error.message;
    }
    window.scrollTo(0, 0);
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

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }



  setAsUntouched() {
    this.changePasswordForm.get('password').setErrors(null);
    this.changePasswordForm.get('confirm_password').setErrors(null);
  }

}
