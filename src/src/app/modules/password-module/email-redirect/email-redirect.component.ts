import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, AbstractControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';

@Component({
  selector: 'app-email-redirect',
  templateUrl: './email-redirect.component.html',
  styleUrls: ['./email-redirect.component.scss']
})
export class EmailRedirectComponent implements OnInit {
  emailForm : UntypedFormGroup;
  apiError: any;
  popupInputData = {
    'msg': '',
    'type': 'success',
    'show': false
  }

  constructor(private _tsAuth: AuthService, private _fb: UntypedFormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
		this.emailForm = this._fb.group({
			email: [
				'',
				Validators.required
      ],
      app_access: ["main_portal"]
		});
  }

  sendEmailToResetPassword() {
    const emailForm = this.emailForm as UntypedFormGroup;
    if(emailForm.valid) {
    this._tsAuth.sendResetPasswordLinkToEmail(emailForm.value).subscribe(
      res => {
        this.popupInputData['msg'] = 'Email sent successfully! Please check ' + emailForm.get('email').value + ' for a link to reset your password.'
        this.popupInputData['show'] = true;
      },
      error =>{
        this.showApiError(error);
      });
    }
    else {
      this.emailForm.get('email').markAsTouched();
    }
  }

  showApiError(error) {
    if(error.status == 400 && error.error && error.error.hasOwnProperty("error")) {
      this.apiError = error.error.error;
    }
    else if (error.error && error.error.hasOwnProperty("message")) {
      this.apiError = error.error.message;
    }
    window.scrollTo(0, 0);
  }


  addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
  }

}
