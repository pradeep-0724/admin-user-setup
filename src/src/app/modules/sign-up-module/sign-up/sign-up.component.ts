import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  signUpForm: UntypedFormGroup;
	invalidCred: Boolean = false;
	formNotValid: Boolean = false;
  token: string;
  param: { q: any; };
  apiError: string;
  popupInputData = {
    'msg': 'You have Successfully Signed Up!',
    'type': 'success',
    'show': false
  }

  constructor(
    private _tsAuth: AuthService,
    private _router: Router, private _fb: UntypedFormBuilder,
    private _activatedroute:ActivatedRoute
    ) {
    this._activatedroute.queryParamMap.subscribe(params => {
      if(isValidValue(params['params']))
        this.token = params['params']['t'];
        this.getDetailsFromToken(this.token);
     });
   }

  ngOnInit() {
		this.buildForm();
	}

	buildForm() {
		this.signUpForm = this._fb.group({
      fname: [
        ''
      ],
      lastname: [
        ''
      ],
      email: [
        ''
      ],
			username: [
				'',
				Validators.required
			],
			password: [
				'',
				Validators.required
      ],
      cnf_password: [
        '',
        Validators.required
      ]
		});
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

  patchFormValues(data) {
    const signupForm = this.signUpForm as UntypedFormGroup;
    signupForm.get('fname').patchValue(data.first_name);
    signupForm.get('lastname').patchValue(data.last_name);
    signupForm.get('email').patchValue(data.email);
  }

  getDetailsFromToken(token) {
     this.param = {
      q: token
    }
    this._tsAuth.getDetailsByToken(this.param).subscribe(
      res => {
        if(res && res.result)
          this.patchFormValues(res.result);
      },
      error => {
        this.showApiError(error);
      });
  }

  onFormSubmit() {
    this.matchPassword()
  }

  matchPassword() {
    const signupForm = this.signUpForm as UntypedFormGroup;
    if(signupForm.get('password').value.localeCompare(signupForm.get('cnf_password').value) != 0) {
      signupForm.get('password').setErrors({passwordsNotMatch:true});
      signupForm.get('cnf_password').setErrors({passwordsNotMatch:true});
    }
    else {
      this.signUp();
    }
  }

  signUp() {
    const signupForm = this.signUpForm as UntypedFormGroup;
    if(signupForm.valid) {
      let request = {
        username : signupForm.get('username').value,
        password: signupForm.get('password').value,
        confirm_password: signupForm.get('cnf_password').value
      }
    this._tsAuth.onSignup(request,this.param).subscribe(
      res => {
        this.popupInputData['show'] = true;
        setTimeout(() => {
          if(this._tsAuth.isLoggedIn)
            this._tsAuth.logout();
          else
            this._router.navigateByUrl('/' + TSRouterLinks.login);
        }, 3000);
      },
      error =>{
        this.showApiError(error);
      });
    }
    else {
      this.setAsTouched(this.signUpForm);
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

  setAsUntouched() {
    this.signUpForm.get('password').setErrors(null);
    this.signUpForm.get('cnf_password').setErrors(null);
  }
}
