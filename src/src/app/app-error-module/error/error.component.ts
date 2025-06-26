import { Component, Input } from '@angular/core';
import { AbstractControl, AbstractControlDirective } from '@angular/forms';

@Component({
	selector: 'app-error',
	templateUrl: 'error.component.html'
	//   styleUrls: ['error.component.scss']
})
export class ErrorComponent {
	message: any;
	msg: any = [];

	@Input() controlName: AbstractControl | AbstractControlDirective;
	@Input() forceShowError: boolean;

	/**
   * App level error messages (this will grow as the app grows)
   */
	errorMessages = { 
		required: () => `This field is required`,
		max: (params) => `Max. ${params.max} number are allowed`,
		min: (params) => `Min. ${params.min} number is allowed`,
		maxlength: (params) => `Max. ${params.requiredLength} characters are allowed`,
		pattern: () => `Enter a valid field`,
		minlength: (params) => `Min. ${params.requiredLength} characters are allowed`,
		passwordsNotMatch: (params) => `Password Does not Match`,
		pinNotMatch: () => 'Enter valid pin code of 6 digits',
		panNotMatch: () => `Enter valid pan number`,
		phoneNotMatch: () => `Max. 10 numbers are allowed`,
		accountsNotMatch: () => `Account number does not match`,
		duplicateAccount: () => `Account number already added`,
		emailNotMatch: () => `Please enter a  correct email`,
		mobileNotMatch: () => `Please enter a  correct mobile number`,
		websiteNotMatch: () => `Please enter a valid website`,
		gstNotMatch: () => `Please enter correct GSTIN number`,
		tranNotMatch: () => `Please enter correct TRN number`,
		crnNotMatch: () => `Please enter correct CRN number`,
		bdpContainerInvalid: () => `Enter a valid Container number (4 letters followed by 7 digits).`,
		matDatepickerMax: () => `Date value is above maximum`,
		matDatetimePickerMin: () => `Date and Time value is below minimum`,
		matDatetimePickerMax: () => `Date and Time value is below maximum`,
		matDatepickerMin: () => `Date cannot be below Start date`,
		loanAmountBigger: () => `Value should be lower than Loan amount`,
		regNotMatch: () => `Use '-' as valid format (KA-03-NA-1234)`,
		odometerNotMatch: () => `Max 6 digits are allowed upto 3 decimals`,
		negativeBalance: () => `Amount entered should not be greater than due amount`,
		amountPaidExceeded: () => `Cannot not be greater than total`,
		notUniqueVehicle: () => `Vehicle to be unique`,
		companyUniqueError: () => `Display Name already exists`,
		partyEmailError: () => `Party email already exists`,
		vehicleAssignedError: () => `This vehicle already exists with other employee`,
		unique: () => `Not Unique`,
		mobileAlreadyRegistered: () => `Number already registered in our system`,
		usernameAlreadyRegistered: () => `Username already registered`,
		invalidUsername: () => `Min 4, Max 20 lowercase characters are allowed`,
		lessThanEqualValidator: (params) => `less than or equall are allowed`,
		matDatetimePickerParse: (params) => `Something wrong with date`,
		fileUploadError:() => `Please upload file`,
		maxLimitWOError: () => `Max limit is 25`,
		minLimitWOError: () => `Min limit is 0`,
		error: (params) => ``
	};

	listOfErrors() {
		if (this.controlName.errors) {
			// console.log('%c Control Name','color: red', this.controlName);
			this.msg = [];
			Object.keys(this.controlName.errors).map((error) => {
				// console.log('%c Error','background: #222; color: #bada55', error);
				this.controlName.touched || this.controlName.dirty || (this.forceShowError && this.controlName.invalid)
					? this.msg.push(this.errorMessages[error](this.controlName.errors[error]))
					: '';
			});
			return this.msg;
		} else {
			return [];
		}
	}
}
