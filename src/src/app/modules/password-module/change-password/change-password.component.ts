import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { UntypedFormBuilder, Validators, UntypedFormGroup, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: UntypedFormGroup;
  apiError: any;
  popupInputData = {
    'msg': 'Password Changed Successfully',
    'type': 'success',
    'show': false
  }
  showPass={
    old:false,
    new:false,
    confirm:false
  }

  constructor(private _tsAuth: AuthService, private _fb: UntypedFormBuilder,private apiHandler:ApiHandlerService) { }

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
    this.changePasswordForm = this._fb.group({
      q_uuid: [
        ''
      ],
      old_password: [
        '',
        Validators.required
      ],
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
    this.matchPassword()
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
    if (changePasswordForm.valid) {
      changePasswordForm.get('q_uuid').patchValue(this.getUserUuidFromStorage())
      this.apiHandler.handleRequest( this._tsAuth.changePassword(changePasswordForm.value),'Password changed successfully!').subscribe({
        next:(resp)=>{
          this.changePasswordForm.reset();
        },
        error:(err)=>{
          this.showApiError(err);

        }
      })
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

  getUserUuidFromStorage() {
    return this._tsAuth.getUserUuid();
  }

  setAsUntouched() {
    this.changePasswordForm.get('password').setErrors(null);
    this.changePasswordForm.get('confirm_password').setErrors(null);
  }
}
