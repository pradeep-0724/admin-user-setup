import { Component, OnInit } from '@angular/core';
import { Validators, UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  resetPasswordForm: UntypedFormGroup;
  apiError: any;
  token: string;
  popupInputData = {
    'msg': 'Your password has been reset successfully!',
    'type': 'success',
    'show': false
  }

  constructor(private _tsAuth: AuthService,
    private _router: Router, private _fb: UntypedFormBuilder,
    private _activatedroute:ActivatedRoute) {
      this._activatedroute.queryParamMap.subscribe(params => {
        if(isValidValue(params['params']))
          this.token = params['params']['t'];
       });
     }

  ngOnInit() {
    this.buildForm()
  }

  buildForm() {
		this.resetPasswordForm = this._fb.group({
      _q: [
        ''
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
    const resetPasswordForm = this.resetPasswordForm as UntypedFormGroup;
    if(resetPasswordForm.get('password').value.localeCompare(resetPasswordForm.get('confirm_password').value) != 0) {
      resetPasswordForm.get('password').setErrors({passwordsNotMatch:true});
      resetPasswordForm.get('confirm_password').setErrors({passwordsNotMatch:true});
    }
    else {
      this.resetPassword();
    }
  }

  resetPassword() {
    const resetPasswordForm = this.resetPasswordForm as UntypedFormGroup;
    if(resetPasswordForm.valid) {
      resetPasswordForm.get('_q').patchValue(this.token);
    this._tsAuth.resetPassword(resetPasswordForm.value).subscribe(
      res => {
        this.popupInputData['show'] = true;
        setTimeout(() => {
          this._router.navigateByUrl('/' + TSRouterLinks.login);
        }, 3000);
      },
      error =>{
        this.showApiError(error);
      });
    }
    else {
      this.setAsTouched(this.resetPasswordForm);
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
		  this.resetPasswordForm.get('password').setErrors(null);
      this.resetPasswordForm.get('confirm_password').setErrors(null);
  }
}
