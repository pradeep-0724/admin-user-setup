import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PartyType, ValidationConstants, VendorType } from 'src/app/core/constants/constant';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { LpoService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/lpo-services/lpo.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { getEmployeeObject } from 'src/app/modules/customerapp-module/master-module/employee-module/employee-utils';
import { OtherClassService } from 'src/app/modules/customerapp-module/operations-module/other-activity-module/other-class/other.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { changeDateToServerFormat, ValidityDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, getNonTaxableOption, getObjectFromList, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';

@Component({
	selector: 'app-local-purchase-order',
	templateUrl: './local-purchase-order.component.html',
	styleUrls: ['./local-purchase-order.component.scss'],
	host: {
		"(window:click)": "clickOutToHide($event)"
	}
})
export class LocalPurchaseOrderComponent implements OnInit {
	lpoId: any;
	lpoForm: UntypedFormGroup;
	policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
	countryId: string = '';
	taxes = [];
	initialValues: any = {
		tax: [],
		vendor: {},
		validity: {},
		employee: {},
		paymentTerm: {}
	};
	isTax: boolean = false;
	companyRegistered: boolean = true;
	defaultTax = new ValidationConstants().defaultTax;
	isTdsDecleration = false;
	contactPersonList = [];
	vendorSelected: any = {};
	vendorId: string;
	gstin: any = '';
	showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
	vendorList: any = [];
	terminology: any;
	validityTerms = [];
	employeeList: any = [];
	countryPhoneCodes = [];
	paymentTermList: any = [];
	selectedPaymentTerm: any;
	BillDate: any;
	minDate: Date;
	paymentTermCustom = new ValidationConstants().paymentTermCustom;
	patchFileUrls = new BehaviorSubject([]);
	apiError
	preFixUrl: string = ''
	lpoData: any
	saveButton: boolean = false;
	currency_type;



	constructor(
		private _activateRoute: ActivatedRoute,
		private _fb: UntypedFormBuilder,
		private _countryId: CountryIdService,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _partyService: PartyService,
		private commonloaderservice: CommonLoaderService,
		private _terminologiesService: TerminologiesService,
		private _commonService: CommonService,
		private _quotationV2Service: QuotationV2Service,
		private _otherClassService: OtherClassService,
		private _companyModuleService: CompanyModuleServices,
		private _router: Router,
		private _preFixUrl: PrefixUrlService,
		private _lpoService: LpoService,
		private _scrollToTop: ScrollToTop,
		private _currency: CurrencyService,
		private apiHandler: ApiHandlerService,




	) {
		this.terminology = this._terminologiesService.terminologie;
	}

	ngOnInit(): void {
		this.currency_type = this._currency.getCurrency();
		this.countryId = this._countryId.getCountryId();
		this.preFixUrl = this._preFixUrl.getprefixUrl();
		this.buildForm();
		this.getTaxDetails();

		this.getStaticOptions();
		this.lpoForm.controls['lpo_date'].setValue(new Date(dateWithTimeZone()));
		this._companyModuleService.getPhoneCode().subscribe(result => {
			this.countryPhoneCodes = result['results'].map(code => code.phone_code)
		})


		this._activateRoute.params.subscribe((params) => {
			this.lpoId = params.lpo_id;
			this._otherClassService.getEmployeeList(employeeList => {
				if (employeeList && employeeList.length > 0) {
					this.employeeList = employeeList;
				}
			})
			this.getVendorDetails();

			this._commonService
				.getStaticOptions('gst-treatment,tax,item-unit,payment-term')
				.subscribe((response) => {
					this.paymentTermList = response.result['payment-term'];
					if (!this.lpoId) {
						this.initialValues.paymentTerm = this.paymentTermList[7];
						this.lpoForm.get('payment_term').setValue(this.paymentTermList[7].id)
					}
				});

			if (!this.lpoId) {
				this.buildNewItems([{}]);
				this.getLpoNumber();
				this.initialValues.tax.push(getNonTaxableOption());
			} else {
				this.getFormValues();
			}

		});
	}
	handleEmployeeChange() {
		let empId = this.lpoForm.get('employee').value;
		let empObj = getEmployeeObject(this.employeeList, empId);
		this.initialValues.employee = { label: empObj?.display_name, value: empId }

	}

	paymentTermPatch(editLpo) {
		if (editLpo.payment_term) {
			this.initialValues.paymentTerm['value'] = editLpo.payment_term.id;
			this.initialValues.paymentTerm['label'] = editLpo.payment_term.label;
			editLpo.payment_term = editLpo.payment_term.id;
		} else {
			this.initialValues.paymentTerm = getBlankOption();
		}
	}
	employeePatch(editLpo) {
		if (editLpo.employee?.id) {
			this.initialValues.employee['value'] = editLpo.employee.id;
			this.initialValues.employee['label'] = editLpo.employee.name;;
			editLpo.employee = editLpo.employee.id;
		} else {
			this.initialValues.employee = getBlankOption();
			editLpo.employee = null
		}
	}
	vendorSelectedPatch(editLpo) {
		if (editLpo.party) {
			this.initialValues.vendor['value'] = editLpo.party.id;
			this.initialValues.vendor['label'] = editLpo.party.name;
			this.lpoForm.controls['party'].setValue(editLpo.party.id)
		} else {
			this.initialValues.vendor = getBlankOption();
		}
	}
	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.lpoForm.get('documents') as UntypedFormControl;
			documentsArray.setValue([]);
			const documents = data.documents;
			let pathUrl = [];
			documents.forEach(element => {
				documentsArray.value.push(element.id);
				pathUrl.push(element);
			});
			this.patchFileUrls.next(pathUrl);
		}
	}
	buildItemsField(items = []) {
		let itemsArrayForm = this.lpoForm.get('items') as FormArray
		itemsArrayForm.controls = [];
		items.forEach((item, i) => {
			const form = this.buildItemForm(item)
			itemsArrayForm.push(form)
			this.initialValues.tax.push({ label: item?.tax?.label, value: item?.tax?.id })
			this.lpoData.items[i]['tax'] = item?.tax?.id
		});
		if (items.length == 0) {
			this.addItem()
		}
	}
	getFormValues() {
		this._lpoService.getLpoDetails(this.lpoId).subscribe((data: any) => {
			this.lpoData = data.result;
			this.paymentTermPatch(this.lpoData);
			this.employeePatch(this.lpoData);
			if (this.lpoData.validity) {
				this.initialValues.validity['value'] = this.lpoData?.validity?.id;
				this.initialValues.validity['label'] = this.lpoData?.validity?.label;
				this.lpoData.validity = this.lpoData?.validity?.id;
			} else {
				this.initialValues.validity = getBlankOption();
			}
			this.buildItemsField(this.lpoData?.items);
			this.vendorSelectedPatch(this.lpoData);
			this.lpoData.party = this.lpoData?.party?.id;
			this.getContactPersonList(this.lpoData?.party)

			setTimeout(() => {
				this.calcuationsChanged();
			}, 100);
			this.lpoForm.patchValue(this.lpoData);
			this.patchDocuments(this.lpoData);

		});
	}
	buildForm() {
		this.lpoForm = this._fb.group({
			party: [
				null,
				Validators.required
			],
			lpo_no: ['', [Validators.required]],
			lpo_date: [null, Validators.required],
			validity: ['', [Validators.required]],
			lpo_expiry_date: ['', [Validators.required]],
			reference_no: '',
			payment_term: [null, [Validators.required]],
			employee: [null],
			poc_name: [''],
			poc_mobile: this._fb.group({
				no: ['', [TransportValidator.mobileNumberValidator()]],
				code: getCountryCode(this.countryId)
			}),
			items: this._fb.array([]),
			subtotal: [0.000, [Validators.required]],
			tax_amount: [0.000],
			total_amount: [0.000, [Validators.required]],
			documents: [
				[]
			],
			save_as: "draft",


		});
	}
	buildItemForm(item: any) {
		return this._fb.group({
			description: [
				item.description || '', [Validators.required]
			],
			rate: [
				item.rate || 0, [Validators.min(0.01), Validators.required],
			],
			total_units: [
				item.total_units || 0, [Validators.min(1), Validators.required],
			],
			tax: [item.tax || this.defaultTax],
			amount_before_tax: [item.amount_before_tax || 0, Validators.required],
			amount: [
				item.total || 0, [Validators.required]
			],
		});
	}
	getTaxDetails() {
		this.isTax = this._tax.getTax();
		this._taxService.getTaxDetails().subscribe(result => {
			this.taxes = result.result['tax'];
			this.companyRegistered = result.result['registration_status']
		})
	}
	buildNewItems(items) {
		let newItems = this.lpoForm.controls['items'] as UntypedFormArray;
		items.forEach((item) => {
			newItems.push(this.buildItemForm(item));
		});
	}
	addItem() {
		let newItems = this.lpoForm.controls['items'] as UntypedFormArray;
		newItems.push(this.buildItemForm({}));
		this.initialValues.tax.push(getNonTaxableOption());
	}
	removeItem(index) {
		let items = this.lpoForm.controls['items'] as UntypedFormArray;
		items.removeAt(index);
		this.calcuationsChanged()
		this.initialValues.tax.splice(index, 1);

	}
	calculateItemsAmount(index) {
		const otherItems = this.lpoForm.controls['items'] as UntypedFormArray;
		let quantity = otherItems.at(index).get('total_units').value;
		let unit_cost = otherItems.at(index).get('rate').value;
		let setamount = otherItems.at(index).get('amount_before_tax');
		const amount = (quantity * unit_cost).toFixed(3);
		setamount.setValue(amount);
		this.calcuationsChanged();
	}

	calcuationsChanged() {
		let items = this.lpoForm.controls['items'] as UntypedFormArray;
		this.lpoForm.get('total_amount').setValue(0.000)
		this.lpoForm.get('tax_amount').setValue(0.000)
		this.lpoForm.get('subtotal').setValue(0.000)

		this.taxes.forEach((tax) => {
			items.controls.forEach((item) => {
				let amountWithoutTax = Number(item.get('amount_before_tax').value);
				let amountWithTax;
				let itemTax = 0.00
				if (item.get('tax').value == tax.id) {
					itemTax = Number(tax.value / 100 * amountWithoutTax);
					amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
					item.get('amount').setValue(amountWithTax);
					this.lpoForm.get('total_amount').setValue(Number(Number(this.lpoForm.get('total_amount').value) + Number(amountWithTax)).toFixed(3))
					this.lpoForm.get('tax_amount').setValue(Number(Number(this.lpoForm.get('tax_amount').value) + Number(itemTax)).toFixed(3));
					this.lpoForm.get('subtotal').setValue(Number(Number(this.lpoForm.get('subtotal').value) + Number(item.get('amount_before_tax').value)).toFixed(3))
				}
			});
		});

	}
	onVendorSelected(e) {
		this.getContactPersonList(e.target.value)
		this.commonloaderservice.getHide()
		if (e.target.value === '') {
			this.vendorSelected = null;
			this.vendorId = null;
			return;
		}
		this.initialValues.paymentTerm = {};
		if (isValidValue(e.target.value)) {
			this.vendorId = e.target.value;
			this._partyService.getPartyAdressDetails(e.target.value).subscribe(
				res => {
					this.vendorSelected = res.result;
					this.lpoForm.controls['payment_term'].setValue(null);
					this.lpoForm.controls['employee'].setValue(null);
					this.initialValues.employee = getBlankOption()
					if (this.vendorSelected.sales_person_name?.id) {
						this.lpoForm.get('employee').patchValue(this.vendorSelected.sales_person_name?.id);
						this.initialValues.employee = { label: this.vendorSelected.sales_person_name?.name, value: this.vendorSelected.sales_person_name?.id }

					}
					if (this.vendorSelected.terms?.id) {
						this.lpoForm.controls['payment_term'].setValue(
							this.vendorSelected.terms.id);
						this.initialValues.paymentTerm['label'] = this.vendorSelected.terms.label;
						this.initialValues.paymentTerm['value'] = this.vendorSelected.terms.id

					}
					else {
						this.initialValues.paymentTerm = this.paymentTermList[7];
						this.lpoForm.get('payment_term').setValue(this.paymentTermList[7].id)

					}

					this.gstin = this.vendorSelected.tax_details.gstin;
					this.isTdsDecleration = res.result.tax_details.tds_declaration;
				});
		}
	}
	getContactPersonList(id) {
		this._partyService.getContactPersonList(id).subscribe(data => {
			this.contactPersonList = data['result'].contact_person;
			if (!this.lpoId) {
				this.patchDefaultContactPerson()
			}


		})
	}
	patchDefaultContactPerson() {
		this.clearContactPerson();
		const defaultContact = this.contactPersonList.find((item) => item.default == true)
		if (defaultContact) {
			this.setContactPerson(defaultContact)
		}
	}
	clearContactPerson() {
		this.lpoForm.get('poc_name').setValue('')
	}
	setContactPerson(contactPerson) {
		if (!isValidValue(contactPerson)) return
		this.lpoForm.get('poc_name').setValue(contactPerson.display_name)
		this.lpoForm.get('poc_mobile').get('code').setValue(contactPerson.country_code)
		this.lpoForm.get('poc_mobile').get('no').setValue(contactPerson.contact_person_no);
	}
	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}


	/* For  Opening the Party Modal */
	openAddPartyModal($event) {
		if ($event)
			this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
	}

	/* Adding the entered value to the list */
	addValueToPartyPopup(event) {
		if (event) {
			this.partyNamePopup = event;
		}
	}

	/* For Displaying the party name in the subfield  */
	addPartyToOption($event) {
		if ($event.status) {
			this.getVendorDetails();
			this.initialValues.vendor = { value: $event.id, label: $event.label };
			this.lpoForm.get('party').setValue($event.id);

		}
	}

	/* To get all the Vendor Details */

	getVendorDetails() {
		this._partyService.getPartyList(VendorType.VehicleProvider, PartyType.Vendor).subscribe((response) => {
			this.vendorList = response.result;
		});

	}

	/* After closing the party modal to clear all the values */
	closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}
	stopLoaderClasstoBody() {
		let removeLoader = document.getElementsByTagName("body")[0];
		removeLoader.classList.add("removeLoader");
	}
	getLpoNumber() {

		this._commonService.getSuggestedIdsOperation('lpo').subscribe((response) => {

			this.lpoForm.controls['lpo_no'].setValue(response.result['lpo']);
		});
	}
	setValidityDate() {
		const validity_term = this.lpoForm.get('validity').value;
		let item = getObjectFromList(validity_term, this.validityTerms);
		let quotationDate = this.lpoForm.get("lpo_date").value;
		let da = ValidityDateCalculator(new Date(quotationDate), item.value);
		this.lpoForm.get('lpo_expiry_date').setValue(da);
	}
	onValidityDateChange() {
		let item = this.validityTerms.filter((item: any) => item.label == 'Custom')[0]
		this.lpoForm.get('validity').setValue(item.id)
		this.initialValues.validity = { label: item.label, value: item.id };

	}
	getStaticOptions() {
		this._quotationV2Service.getStaticOptions('item-unit,quotation-validity-term').subscribe((response: any) => {
			this.validityTerms = response.result['quotation-validity-term'];
			if (!this.lpoId) {
				this.lpoForm.get('validity').setValue(this.validityTerms[1].id);
				this.initialValues.validity = this.validityTerms[1];
				this.setValidityDate()
			}

		});
	}

	setContactPersons(contactPerson) {
		if (contactPerson.trim()) {
			this.lpoForm.get('poc_name').setValue(contactPerson);
		}
		// else {
		// 	this.lpoForm.get('poc_mobile').get('code').setValue(getCountryCode(this.countryId))
		// 	this.lpoForm.get('poc_mobile').get('no').setValue('');
		// }
	}
	onContactPersonChange() {
		console.log(this.lpoForm)
		let contactPersonName = this.lpoForm.get('poc_name').value;
		let cpObj = this.contactPersonList.find((item) => item.display_name == contactPersonName)
		if (cpObj) {
			this.lpoForm.get('poc_mobile').get('code').setValue(cpObj.country_code)
			this.lpoForm.get('poc_mobile').get('no').setValue(cpObj.contact_person_no);
		}
	}

	fileUploader(filesUploaded) {
		let documents = this.lpoForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.lpoForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}
	buildRequest(form: UntypedFormGroup) {
		form.controls['lpo_date'].setValue(changeDateToServerFormat(form.controls['lpo_date'].value));
		form.controls['lpo_expiry_date'].setValue(changeDateToServerFormat(form.controls['lpo_expiry_date'].value));

		return form.value;
	}
	submitForm(savetype: string) {

		const form = this.lpoForm;
		this.apiError = '';
		form.get('save_as').setValue(savetype)
		if (this.lpoForm.get('total_amount').value <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}
		if (form.valid) {

			if (!this.lpoId) {

				this.apiHandler.handleRequest(this._lpoService.saveLpo(this.buildRequest(form)),'LPO added successfully!')
				.subscribe({
					next: (response) => {
						this._router.navigateByUrl(this.preFixUrl + '/trip/local-purchase-order/view/' + response['result']);
					  },
					  error: () => {
						this.apiError = 'Failed to add  LPO!';
						setTimeout(() => (this.apiError = ''), 3000);
						this._scrollToTop.scrollToTop();
					    window.scrollTo(0, 0);
					  },
				}
				);
			}
			else {
				this.apiHandler.handleRequest(this._lpoService.editLpo(this.buildRequest(form), this.lpoId),'LPO updated successfully!')
				.subscribe({
					next: (response) => {
						this._router.navigateByUrl(this.preFixUrl + '/trip/local-purchase-order/view/' + response['result']);
					  },
					  error: () => {
						this.apiError = 'Failed to update  LPO!';
						setTimeout(() => (this.apiError = ''), 3000);
						this._scrollToTop.scrollToTop();
					    window.scrollTo(0, 0);
					  },
				});
			}


		} else {
			setAsTouched(form);
			this._scrollToTop.scrollToTop()
		}
	}
	RemoveLoaderClasstobody() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('removeLoader');
	}
	handleSaveClick() {
		this.saveButton = !this.saveButton;
		this.RemoveLoaderClasstobody();

	}
	handleSpanClick() {

		this.handleSaveClick()
	}
	clickOutToHide(e) {

		if (!e.target.className.includes('saveButton')) {
			this.saveButton = false;
		}
	}



}
