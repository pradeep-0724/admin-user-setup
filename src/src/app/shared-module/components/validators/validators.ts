import { AbstractControl, UntypedFormArray, ValidatorFn } from '@angular/forms';
import { Moment } from 'moment';
import {  ValidationConstants } from 'src/app/core/constants/constant';

export class TransportValidator {
	static phoneNumberValidatorFunction(control: AbstractControl) {
		const regrxPhone = /^(\d{10})$/;

		if (!control) {
			return;
		}

		if (control.value === '') {
			return;
		}

		if (control.value === null) {
			return;
		}

		if (!regrxPhone.test(control.value) && control.value !== null) {
			return {
				phoneNotMatch: true
			};
		}
	}


	static usernameValidator(control: AbstractControl) {
		const regrxUsername = new ValidationConstants().VALIDATION_PATTERN.USERNAME;

		if (!control) {
			return;
		}

		if (control.value === '') {
			return;
		}

		if (control.value === null) {
			return;
		}

		if (!regrxUsername.test(control.value) && control.value !== null) {
			return {
				invalidUsername: true
			};
		}
	}

	static panNumberValidator(control:AbstractControl){
		// console.log(control)

		const regxCompanyPanNumber =new ValidationConstants().VALIDATION_PATTERN.PAN_VALIDATION;
		if(!control){
			return
		}
		if(control.value === ''){
			return
		}
		if(control.value === null){
			return
		}
		const companyPanuNumber=control.parent.get('pan');
		if(!regxCompanyPanNumber.test(companyPanuNumber.value) && companyPanuNumber.value !== null){
          return{
			  panNotMatch:true
		  }
		}

	}

	static vehicleRegNumberValidator(control: AbstractControl) {
		const regrxVehicleNumber = new ValidationConstants().VALIDATION_PATTERN.REG_NO;

		if (!control) {
			return;
		}

		if (control.value === '') {
			return;
		}

		if (control.value === null) {
			return;
		}
		const vehicleRegNumber = control.parent.get('reg_number') ;
		if (!regrxVehicleNumber.test(vehicleRegNumber.value) && vehicleRegNumber.value !== null) {
			return {
				regNotMatch: true
			};
		}
	}

	static phoneNumberValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}
		return TransportValidator.phoneNumberValidatorFunction(control.parent.get('primary_mobile_number'));
	}


	static alternatePhoneNumberValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}
		return TransportValidator.phoneNumberValidatorFunction(control.parent.get('alternate_mobile_number'));
	}

	static contactNumberValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}
		return TransportValidator.phoneNumberValidatorFunction(control.parent.get('contact_no'));
	}

	static employeePhoneNumberValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}
		return TransportValidator.phoneNumberValidatorFunction(control.parent.get('contact'));
	}

	static pinCodeValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}
		return 

		// const pin = control.parent.get('pin_code') || control.parent.get('pincode');
		// const regrxpin = /^[0-9 a-z]*$/;

		// if (!pin) {
		// 	return;
		// }

		// if (pin.value === '') {
		// 	return;
		// }

		// if (!regrxpin.test(pin.value) && pin.value !== null) {
		// 	return {
		// 		pinNotMatch: true
		// 	};
		// }
	}

	static duplicateAccount(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const accountNo = control.parent.get('account_number');

		if (!accountNo) {
			return;
		}

		if (accountNo.value === '') {
			return;
		}

		if (accountNo.value === null) {
			return;
		}

		const banks = control.parent.parent as UntypedFormArray;
		let bankExist = false;
		banks.controls.forEach((bank, index) => {
			if (control.parent !== bank) {
				if (bank.get('account_number').value === accountNo.value) {
					bankExist = true;
				}
			}
		});

		if (bankExist) {
			return {
				duplicateAccount: true
			};
		}
	}

	static confirmAccount(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const accountNo = control.parent.get('account_number');
		const confirmAccount = control.parent.get('confirm_account_number');

		if (!accountNo || !confirmAccount) {
			return;
		}

		if (confirmAccount.value === '') {
			return;
		}

		if (confirmAccount.value === null) {
			return;
		}

		if (accountNo.value !== confirmAccount.value) {
			return {
				accountsNotMatch: true
			};
		}
	}

	static DownPaymentBiggerLoanAmount(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const loanAmount = control.parent.get('amount');
		const downPayment = control.parent.get('down_payment');

		if (!loanAmount || !downPayment) {
			return;
		}

		if (downPayment.value === '') {
			return;
		}

		if (downPayment.value === null) {
			return;
		}

		if (parseFloat(downPayment.value) > parseFloat(loanAmount.value)) {
			return {
				loanAmountBigger: true
			};
		}
	}

	static EMIBiggerLoanAmount(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const loanAmount = control.parent.get('amount');
		const downPayment = control.parent.get('loan_emi_value');

		if (!loanAmount || !downPayment) {
			return;
		}

		if (downPayment.value === '') {
			return;
		}

		if (downPayment.value === null) {
			return;
		}

		if (parseFloat(downPayment.value) > parseFloat(loanAmount.value)) {
			return {
				loanAmountBigger: true
			};
		}
	}

	static emailValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const email = control.parent.get('email_address');
		const regrxEmail = new ValidationConstants().VALIDATION_PATTERN.EMAILV2;

		if (!email) {
			return;
		}

		if (email.value === '') {
			return;
		}

		if (email.value === null) {
			return;
		}

		if (!regrxEmail.test(email.value)) {
			return {
				emailNotMatch: true
			};
		}
	}

	static websiteValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const website = control.parent.get('website');
		const regexWebsite = new ValidationConstants().VALIDATION_PATTERN.WEBSITE;

		if (!website) {
			return;
		}

		if (website.value === '') {
			return;
		}

		if (website.value === null) {
			return;
		}

		if (!regexWebsite.test(website.value)) {
			return {
				websiteNotMatch: true
			};
		}
	}

	static gstValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const gst = control;
		const regexGst = new ValidationConstants().VALIDATION_PATTERN.GSTIN;

		if (!gst) {
			return;
		}

		if (gst.value === '') {
			return;
		}

		if (gst.value === null) {
			return;
		}

		if (!regexGst.test(gst.value)) {
			return {
				gstNotMatch: true
			};
		}
	}

  static tranValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const gst = control;
		const regexGst = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;

		if (!gst) {
			return;
		}

		if (gst.value === '') {
			return;
		}

		if (gst.value === null) {
			return;
		}

		if (!regexGst.test(gst.value)) {
			return {
				tranNotMatch: true
			};
		}
	}

	static crnValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const gst = control;
		const regexGst = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;

		if (!gst) {
			return;
		}

		if (gst.value === '') {
			return;
		}

		if (gst.value === null) {
			return;
		}

		if (!regexGst.test(gst.value)) {
			return {
				crnNotMatch: true
			};
		}
	}



	static addErrorClass(controlName: AbstractControl) {
		return {
			error: controlName.invalid && (controlName.dirty || controlName.touched)
		};
  }

  static validateOdometerReading(control: AbstractControl) {
    if (!control.parent || !control) {
			return;
    }

    const regexOdometer =new ValidationConstants().VALIDATION_PATTERN.ODOMETER;
    const odometer = control.parent.get('odo_reading');
    if (!odometer) {
			return;
		}
    if (odometer.value === '') {
			return;
		}

		if (odometer.value === null) {
			return;
    }

    if (!regexOdometer.test(odometer.value)) {
			return {
				odometerNotMatch: true
			};
    }
  }

  static addNegativeBalanceValidation(dueAmount,amount) {
    if(!dueAmount || !amount)
      return;
    if(amount > dueAmount)
     {
       return {
        negativeBalance: true
       }
     }
  }

  static amountPaidValidation(amountPaid, totalAmount) {
    if(amountPaid > totalAmount)
     {
       return {
        amountPaidExceeded: true
       }
     }
  }

  static minValueValidator(minValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
		const value: number = Number(control.value);
        if (value == undefined || (isNaN(value) || value < minValue)) {
            return { 'error': true };
        }
        return null;
    };
  }

  static lessThanEqualValidator(greaterValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
		const lessValue: number = Number(control.value)
        if (lessValue == undefined || (isNaN(lessValue) || greaterValue < lessValue)) {
            return { 'error': true };
        }
        return null;
    };
  }

  static equalValidator(greaterValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
		const lessValue: number = Number(control.value)
        if (lessValue == undefined || (isNaN(lessValue) || greaterValue == lessValue)) {
            return { 'error': true };
        }
        return null;
    };
  }

  static mobileNumberValidator(): ValidatorFn {
	return (control: AbstractControl): { [key: string]: any } | null => {
	   const regrxPhone =/^\d{0,10}$/
	  const valid = regrxPhone.test(control.value);
	  return valid ? null : { mobileNotMatch: true };
	};
  }
  

  static createPositiveValidator(createdValue: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
		const creatorValue: number = Number(control.value);
        if (creatorValue == undefined || (isNaN(creatorValue) || (creatorValue < 0 && createdValue < 0))) {
            return { 'error': true };
        }
        return null;
    };
  }

  static notZero(control: AbstractControl){
		const value: number = Number(control.value);
        if (value == undefined || (isNaN(value) || value == 0)) {
            return { 'error': true };
        }
        return null;
    };


  static required(control: AbstractControl) {
    if (control.value){
		return;
	}
	return {error: true}
	}

	static addErrorStyle(controlName: AbstractControl) {
		return {
			error: controlName.invalid
		};
	}

	static forceInvalidate(controlName: AbstractControl) {
		return {
			error: true
		};
	}


	static fileUploadValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const value: any[] = control.value;
			if (value && Array.isArray(value)) {
			  const length = value.length;
		
			  if (length ==0) {
				return { fileUploadError: true };
			  }
			}
		
			return null;
		  };
	  }


	  static bdpContainerNumberValidator(control: AbstractControl) {
		if (!control.parent || !control) {
			return;
		}

		const cn = control;
		const regexCN = new ValidationConstants().VALIDATION_PATTERN.BDPCONTAINERNUMBER;
		if (!regexCN.test(cn.value)) {
			return {
				bdpContainerInvalid: true
			};
		}
	}

	static maxLimitWOValidator(max: number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			const lessValue: number = Number(control.value)
			if (lessValue == undefined || (isNaN(lessValue) || max < lessValue)) {
				return { 'maxLimitWOError': true };
			}
			return null;
		};
	  }

	static minLimitWOValidator(min: number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			const greaterValue: number = Number(control.value)
			if (greaterValue == undefined || (isNaN(greaterValue) || min > greaterValue)) {
				return { 'minLimitWOError': true };
			}
			return null;
		};
	  }

	  static  minDateValidator(minDate: Moment): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
		  if (!control.value) {
			return null;
		  }
		  if (control.value < minDate) {
			return { 'matDatetimePickerMin': { minDate } };
		  }
		  return null;
		};
	  }	  
}
