import { AddressLengthService } from '../../../../../../../core/services/addresslength.service';
import { isBillingAndShippingAddressSame, getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, AbstractControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/store.service';

import { EditEmployeeService } from '../../edit-employee-services/edit-employee-service';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { TSStoreKeys } from 'src/app/core/constants/store-keys.constants';
import { EmployeeService } from '../../../../../api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';


@Component({
	selector: 'edit-emloyee-address',
	templateUrl: './edit-address.component.html'
})
export class EmployeeAddressComponent implements OnInit {
	id: any;
	address: UntypedFormArray;
	employee_address;
	present: Boolean = true;
	permanent: Boolean = true;
	present_toggle: Boolean = true;
	permanent_toggle: Boolean = true;
	is_same_as_billing: boolean = false;
	presentStateSelected: Boolean = false;
	permanentStateSelected: Boolean = false;
	permanentState: any;
	presentStateList: any;
	permanentStateList: any;
	employeeDesignation: any;
	presentAddressDocumentAttachments = [];
	permanentAddressDocumentAttachments = [];
	initialDetails = {
		billingState: {},
		state: {},
		country: {},
		billingCountry: {}
	};
	loadShippingAddress: any = [];
	loadBillingAddress: any = [];
	selectedState: String;
	selectedStatePermanent: any;
	patchFileUrls = new BehaviorSubject([]);
	country: any = [];
	statesShipping = [];
	statesBilling = [];
	employee_id: any;
	prefixUrl = '';
	addressLength:any;

	constructor(
		private _router: Router,
		private _fb: UntypedFormBuilder,
		private _stateService: StoreService,
		private _editEmployeeService: EditEmployeeService,
		private _companyModuleService: CompanyModuleServices,
		private _employeeService: EmployeeService,
		private _routeParams: ActivatedRoute,
		private _prefixUrl: PrefixUrlService,
		private _addressLength:AddressLengthService,
		private _scrollToTop:ScrollToTop
	) { }

	ngOnInit() {		
		this.prefixUrl = this._prefixUrl.getprefixUrl();
        this.addressLength = this._addressLength.adressLength;
		this.buildForm();
		let urlString = location.href.split('/');
		if (urlString[7] == "edit") {
			this.id = urlString[8];
		}
		this._routeParams.params.subscribe((params: any) => {
			if (params.employee_id)
				this.employee_id = params.employee_id;
		});
		this.getCountry();
		if (this.id) {
			this.getFormValues();
		}

	}

	getFormValues() {
		this._editEmployeeService.getAllEditDetails(this.id).subscribe((response) => {
			if (response !== undefined) {
				if (response.address) {
					this.buildForm();
					this.patchDocuments(response);
					response.address.data.filter(data => {
						if (data.address_type_index == 2) {
							this.loadBillingAddress.push(data);
							this.patchBillingAddress(data);
							this.checkInitialDetails(this.loadBillingAddress, this.initialDetails.billingState);
							(this.employee_address.controls.address as UntypedFormArray).controls[0].patchValue(data);
						}
						else if (data.address_type_index == 3) {
							this.loadShippingAddress.push(data);
							this.patchShippingAddress(data)
							this.checkInitialDetails(this.loadShippingAddress, this.initialDetails.state);
							(this.employee_address.controls.address as UntypedFormArray).controls[1].patchValue(data);
						}
					});

					if (response.address[0] && response.address[1])
						this.is_same_as_billing = isBillingAndShippingAddressSame(response.address[0], response.address[1]) ? true : false;
				}
			}




		});
	}



	getCountry() {
		this._companyModuleService.getCountry().subscribe(result => {
			this.country = result['results'];
		})
	}

	getStates() {
		let countryName = this.employee_address.controls.address.controls[0].get('country').value;
		let val = this.country.filter(country => country.name == countryName);
		this._companyModuleService.getStates(val[0].id).subscribe(result => {
			this.statesBilling = result['results'];
		})
	}

	getStateShipping() {
		let countryName = this.employee_address.controls.address.controls[1].get('country').value;
		let val = this.country.filter(country => country.name == countryName);
		this._companyModuleService.getStates(val[0].id).subscribe(result => {
			this.statesShipping = result['results'];
		})
	}

	patchBillingAddress(data: any) {
		this.initialDetails.billingState['label'] = data.state;
		this.initialDetails.billingState['value'] = data.state;

		this.initialDetails.billingCountry['label'] = data.country;
		this.initialDetails.billingCountry['value'] = data.country;
	}

	patchShippingAddress(data: any) {
		this.initialDetails.state['label'] = data.state;
		this.initialDetails.state['value'] = data.state;

		this.initialDetails.country['label'] = data.country;
		this.initialDetails.country['value'] = data.country;
	}

	checkInitialDetails(response: any, data?: any) {
		if (response !== undefined) {
			if (response.length) {
				return true;
			}
			else {
				return false;
			}
		}
	}

	buildForm() {
		this.employee_address = this._fb.group({
			address: this._fb.array([
				this._fb.group({
					id: [
						undefined
					],
					address_line_1: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					street: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					country: [
						''
					],
					state: [
						''
					],
					pincode: [
						'',
						[TransportValidator.pinCodeValidator,Validators.maxLength(70)]
					],
					address_type: [
						2
					],
				}),
				this._fb.group({
					id: [
						undefined
					],
					address_line_1: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					street: [
						'', Validators.maxLength(parseInt(this.addressLength.address_length))
					],
					country: [
						''
					],
					state: [
						''
					],
					pincode: [
						'',
            [TransportValidator.pinCodeValidator,Validators.maxLength(70)]
					],
					address_type: [
						3
					],
				})
			]),
			address_document: [
				[]
			]
		});
	}

	fileUploader(filesUploaded) {
		let documents = this.employee_address.get('address_document').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.employee_address.get('address_document').value;
		documents.splice(deletedFileIndex, 1);
	}




	patchDocuments(data) {
		if (data.address.address_document.length > 0) {
			let documentsArray = this.employee_address.get('address_document') as UntypedFormControl;
			documentsArray.setValue([]);
			const documents = data.address.address_document;
			let pathUrl = [];
			documents.forEach(element => {
				documentsArray.value.push(element.id);
				pathUrl.push(element);


			});
			this.patchFileUrls.next(pathUrl);
		}
	}



	fileUploaderPresentAddress(filesUploaded, documentIndex = 0) {
		if (this.presentAddressDocumentAttachments[documentIndex] === undefined) {
			this.presentAddressDocumentAttachments[documentIndex] = [];
		}
		filesUploaded.forEach((element) => {
			this.presentAddressDocumentAttachments[documentIndex].push(element.id);
		});
	}

	fileUploaderPermanentAddress(filesUploaded, documentIndex = 0) {
		if (this.permanentAddressDocumentAttachments[documentIndex] === undefined) {
			this.permanentAddressDocumentAttachments[documentIndex] = [];
		}
		filesUploaded.forEach((element) => {
			this.permanentAddressDocumentAttachments[documentIndex].push(element.id);
		});
	}

	fileDeletedPresentAddress(deletedFileIndex, documentIndex) {
		this.permanentAddressDocumentAttachments[documentIndex].splice(deletedFileIndex, 1);
	}

	fileDeletedPermanentAddress(deletedFileIndex, documentIndex) {
		this.permanentAddressDocumentAttachments[documentIndex].splice(deletedFileIndex, 1);
	}

	onPresentFileUpload(files: any[]) { }

	onPermanentFileUpload(files: any[]) { }

	toggleSameAddress(e) {
		const address = this.employee_address.controls.address as UntypedFormArray;
		if (e.target.checked) {
			const presentAddressValue = _.cloneDeep(
				(this.employee_address.controls.address as UntypedFormArray).controls[0].value
			);
			presentAddressValue.id = (this.employee_address.controls.address as UntypedFormArray).controls[1].value.id;
			(this.employee_address.controls.address as UntypedFormArray).controls[1].setValue(presentAddressValue);

			this.permanentStateSelected = true;
			this.initialDetails.state['label'] = address.controls[0].get('state').value;
			this.initialDetails.state['value'] = address.controls[0].get('state').value;

			this.initialDetails.country['label'] = address.controls[0].get('country').value;
			this.initialDetails.country['value'] = address.controls[0].get('country').value;
			this.employee_address.addControl('is_permanent_addr_same', new UntypedFormControl(true));
		} else {
			const resetObj = {
				address_line_1: '',
				address_type: '',
				id: (this.employee_address.controls.address as UntypedFormArray).controls[1].get('id').value,
				pincode: null,
				state: '',
				street: '',
				country: '',
			};
			this.initialDetails.state = getBlankOption();
			this.initialDetails.country = getBlankOption();
			(this.employee_address.controls.address as UntypedFormArray).controls[1].reset(resetObj);
			this.permanentStateSelected = false;
			this.employee_address.addControl('is_permanent_addr_same', new UntypedFormControl(false));
		}
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

	patchForm() {
		let addresses = this.employee_address.controls.address as UntypedFormArray;
		addresses.controls[0].patchValue({
			address_type: 2
		});
		addresses.controls[1].patchValue({
			address_type: 3
		});
		if (!addresses.controls[0].get('pincode').value)
			addresses.controls[0].get('pincode').setValue(null)
		if (!addresses.controls[1].get('pincode').value)
			addresses.controls[1].get('pincode').setValue(null);
		if (!addresses.controls[0].get('address_line_1').value)
			addresses.controls[0].get('address_line_1').setValue('');
		if (!addresses.controls[1].get('address_line_1').value)
			addresses.controls[1].get('address_line_1').setValue('');
		if (!addresses.controls[1].get('street').value)
			addresses.controls[1].get('street').setValue('');
		if (!addresses.controls[0].get('street').value)
			addresses.controls[0].get('street').setValue('');
	}

	finishForm(form: UntypedFormGroup | UntypedFormArray) {
		this.patchForm();
		if (form.valid) {
			if (form.value && form.value.address) {
				if (this.id) {
					if (!this.isAddressNotEmpty(form.value)) {
						this._editEmployeeService.editEmployeeAddress(this.id, form.value).subscribe((data) => {
							this._editEmployeeService.editEmployeeAdd.next(false);
							this._employeeService.addTimeline.isAddressSaved = false;
							this._router.navigate([
								this.prefixUrl + '/onboarding/employee/view'
							]);
						})
					}
					else {
						this._editEmployeeService.editEmployeeAddress(this.id, form.value).subscribe((data) => {
							this._editEmployeeService.editEmployeeAdd.next(true);
							this._employeeService.addTimeline.isAddressSaved = true;
							this._router.navigate([this.prefixUrl +
								'/onboarding/employee/view'
							]);
						});
					}
				}
				else {
					if (!this.isAddressNotEmpty(form.value)) {
						this._employeeService.addTimeline.isAddressSaved = false;
						this._router.navigate([this.prefixUrl +
							'/onboarding/employee/view'
						]);
					}

					else {
						this._stateService.setToStore(TSStoreKeys.master_employee_add_address, form.value);
						this._employeeService.postAddress(form.value, this.employee_id).subscribe((response) => {
							if (response) {
								this._employeeService.addTimeline.isAddressSaved = true;
								this._router.navigate([this.prefixUrl +
									'/onboarding/employee/view'
								]);
							}
						});
					}

				}

			}
		}
		else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			console.log(form.errors);
		}

	}

	submitForm(form: UntypedFormGroup | UntypedFormArray) {
		this.patchForm();
		if (form.valid) {
			if (form.value && form.value.address) {
				if (this.id) {
					if (!this.isAddressNotEmpty(form.value)) {
						this._editEmployeeService.editEmployeeAddress(this.id, form.value).subscribe((data) => {
							this._editEmployeeService.editEmployeeAdd.next(true);
							this._employeeService.addTimeline.isAddressSaved = false;
							this._router.navigate([this.prefixUrl +
								'/onboarding/employee/edit/' + this.id + '/document'
							]);
						});
					}
					else {
						this._editEmployeeService.editEmployeeAddress(this.id, form.value).subscribe((data) => {
							this._editEmployeeService.editEmployeeAdd.next(true);
							this._employeeService.addTimeline.isAddressSaved = true;
							this._router.navigate([this.prefixUrl +
								'/onboarding/employee/edit/' + this.id + '/document'
							]);
						});
					}
				}

				else {
					if (!this.isAddressNotEmpty(form.value)) {
						this._employeeService.addTimeline.isAddressSaved = false;
						this._router.navigate([this.prefixUrl +
							'/onboarding/employee/add/document/' + this.employee_id
						]);
					}
					else {
						this._stateService.setToStore(TSStoreKeys.master_employee_add_address, form.value);
						this._employeeService.postAddress(form.value, this.employee_id).subscribe((response) => {
							if (response) {
								this._employeeService.addTimeline.isAddressSaved = true;
								this._router.navigate([this.prefixUrl +
									'/onboarding/employee/add/document/' + this.employee_id
								]);
							}
						});
					}
				}


			}
		}
		else {
			this.setAsTouched(form);
			console.log(form.errors);
		}
	}


	getStateSelected(stateName) {
		const stateObj = this.selectedAddressName(this.permanentStateList, stateName);
		if (stateObj) {
			this.initialDetails.state['value'] = stateObj[0].name;
			this.initialDetails.state['label'] = stateObj[0].name;
		} else {
			this.initialDetails.state = getBlankOption();
		}
	}



	selectedAddressName(list, name) {
		return list.filter(ele => ele.name === name);
	}

	isAddressNotEmpty(data) {
		let filterAddr = data.address.filter(ad => {
			let address_line_1 = (ad.address_line_1) ? true : false;
			let country = (ad.country) ? true : false;
			let pincode = (ad.pincode) ? true : false;
			let state = (ad.state) ? true : false;
			let street = (ad.street) ? true : false;
			return address_line_1 ||
				country ||
				pincode ||
				state ||
				street;
		});
		return filterAddr.length > 0 || data.address_document.length > 0 ? true : false;
	}
}
