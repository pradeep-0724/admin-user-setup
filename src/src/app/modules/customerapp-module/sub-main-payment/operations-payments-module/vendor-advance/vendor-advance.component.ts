import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';

import { VehicleService } from '../../../api-services/master-module-services/vehicle-services/vehicle.service';
import { CommonService } from 'src/app/core/services/common.service';
import { PartyService } from '../../../api-services/master-module-services/party-service/party.service';
import { RevenueService } from '../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isValidValue, getObjectFromList, roundOffAmount, getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { OperationsPaymentService } from '../../../api-services/payment-module-service/payment-service/operations-payments.service';
import { bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { EmployeeService } from '../../../api-services/master-module-services/employee-service/employee-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { getEmployeeObject } from '../../../master-module/employee-module/employee-utils';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
	selector: 'app-edit-vendor-advance',
	templateUrl: './vendor-advance.component.html',
	styleUrls: [
		'./vendor-advance.component.scss'
	],
})
export class VendorAdvanceComponent implements OnInit, OnDestroy {
	advancePaymentForm: UntypedFormGroup;
	employeeList: any = [];
	vehicleList: any = [];
	staticOptions: any = {};
	vendorList: any = [];
	accountList: any = [];
	bankingChargeRequired: Boolean = false;
	vendorSelected: any = {};
	materialList: any = [];
	vendorAdvanceId: any;
	vendorAdvanceData: any;
	loadPage: boolean = false;
	isDomReady: boolean = false;
	initialValues = {
		vendor: getBlankOption(),
		paymentMode: {},
		employee: {},
		party: {},

	};
	currency_type;
	documentPatchData: any = [];
	patchFileUrls = new BehaviorSubject([]);
	data: any;
	showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
	partyDetailsData = {
		isPartyRegistered: true,
		taxDeatils: {},
		placeOfSupply: [],
		companyRegistered: true
	};
	isTransactionIncludesTax = false;
	isTransactionUnderReverse = false;
	partyTaxDetails = new BehaviorSubject<any>(this.partyDetailsData);
	isTax = false;
	placeOfSupply = [];
	editData = new BehaviorSubject<any>({});
	isTaxFormValid: boolean = true;
	taxFormValid = new BehaviorSubject<any>(true);
	prefixUrl: any;
	gstin = '';
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/t8G3DmKDjNa3qOAsL5ka?embed%22"
	}

	constructor(
		private _fb: UntypedFormBuilder,
		private _employeeService: EmployeeService,
		private _vehicleService: VehicleService,
		private _commonService: CommonService,
		private _partyService: PartyService,
		private _operationsPaymentService: OperationsPaymentService,
		private _revenueService: RevenueService,
		private _route: Router,
		private _activateRoute: ActivatedRoute,
		private currency: CurrencyService,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _prefixUrl: PrefixUrlService,
		private _scrollToTop: ScrollToTop,
		private _analytics: AnalyticsService,
		private apiHandler: ApiHandlerService,


	) {
		this.isTax = this._tax.getTax();
		this.getTaxDetails();
	}



	ngOnDestroy() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('removeLoader');

	}
	ngOnInit() {
		setTimeout(() => {
			this.prefixUrl = this._prefixUrl.getprefixUrl();
			this.currency_type = this.currency.getCurrency();
		}, 1000);
		this._activateRoute.params.subscribe((pramas) => {
			this.vendorAdvanceId = pramas.vendor_advance_id;
			this.buildForm();
			this._employeeService.getEmployeeList().subscribe((employeeList) => {
				this.employeeList = employeeList;
			});

			this._vehicleService.getVehicleList().subscribe((vehicleList) => {
				this.vehicleList = vehicleList;
			});

			this._commonService.getStaticOptions('billing-payment-method,gst-treatment').subscribe((response) => {
			});

			this._revenueService.getAccounts().subscribe((response) => {
				if (response !== undefined) {
					this.accountList = response.result;
				}
			});
			let VendorPramas = '1'; // Vendor
			this._partyService.getPartyList('0,1,2,3', VendorPramas).subscribe((response) => {
				this.vendorList = response.result;
			});

			this._revenueService.getExpense().subscribe((response) => {
				if (response !== undefined) {
					this.materialList = response.result;
				}
			});
		});

		this.advancePaymentForm.controls['date'].setValue(new Date(dateWithTimeZone()));

	}
	handleEmployeeChange() {
		let empId = this.advancePaymentForm.get('employee').value;
		let empObj = getEmployeeObject(this.employeeList, empId);
		this.initialValues.employee = { label: empObj?.display_name, value: empId }

	}


	ngAfterViewInit() {
		if (this.vendorAdvanceId) {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.ADVANCEBILL, this.screenType.EDIT, "Navigated");
			setTimeout(() => {
				this.getFormValues();
				this.isDomReady = true;
			}, 1000);
		}
		else {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.ADVANCEBILL, this.screenType.ADD, "Navigated");
			this._operationsPaymentService.getPrefixOperationsIds('vendor_advance').subscribe((response) => {
				this.advancePaymentForm.controls['advance_number'].setValue(response.result['vendor_advance']);
			});
		}
	}

	openGothrough() {
		this.goThroughDetais.show = true;
	}


	getFormValues() {
		this._operationsPaymentService.getVendorAdvanceDetails(this.vendorAdvanceId).subscribe((data: any) => {
			this.vendorAdvanceData = data.result;
			this.getVednorPatch(this.vendorAdvanceData);
			this.paymentModePatch(this.vendorAdvanceData);
			this.employeePatch(this.vendorAdvanceData);
			this.advancePaymentForm.patchValue(this.vendorAdvanceData);
			this._partyService.getPartyAdressDetails(this.advancePaymentForm.get('party').value).subscribe(
				res => {
					this.gstin = res.result.tax_details.gstin;
				});
			this.patchDocuments(this.vendorAdvanceData);
			this.partyDetailsData = {
				isPartyRegistered: false,
				taxDeatils: {},
				placeOfSupply: this.placeOfSupply,
				companyRegistered: true,
			}
			this.partyTaxDetails.next(this.partyDetailsData)
			this.editData.next(
				{
					patchData: this.vendorAdvanceData
				});
		});
	}

	fileUploader(filesUploaded) {
		let documents = this.advancePaymentForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.advancePaymentForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.advancePaymentForm.get('documents') as UntypedFormControl;
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



	buildForm() {
		this.advancePaymentForm = this._fb.group({
			banking_charge: [
				0
			],
			date: [
				'',
				Validators.required
			],
			documents: [
				[]
			],
			paid_amount: [
				0
			],
			remarks: [
				''
			],
			advance_number: [
				'',
				Validators.required
			],
			place_of_supply: [''],
			payment_mode: [
				null, [Validators.required]
			],
			amount: [
				0,
				[Validators.required, Validators.min(0.01)]
			],
			description_of_supply: [
				''
			],
			is_transaction_under_reverse: [false],
			is_transaction_includes_tax: [false],
			party: [
				null,
				Validators.required
			],
			employee: [
				null
			]
		});
	}

	onVendorSelected(e) {
		if (isValidValue(e.target.value)) {
			this.vendorSelected = getObjectFromList(e.target.value, this.vendorList);
			this._partyService.getPartyAdressDetails(e.target.value).subscribe(
				res => {
					this.gstin = res.result.tax_details.gstin;
					this.partyDetailsData = {
						isPartyRegistered: false,
						taxDeatils: res.result.tax_details,
						placeOfSupply: this.placeOfSupply,
						companyRegistered: true
					}
					this.partyTaxDetails.next(this.partyDetailsData)

				});
			this.getDefaultBank(e.target.value)
		}
	}
	getDefaultBank(id) {
		let params = {
			is_account: 'True',
			is_tenant: 'False'
		}
		this._revenueService.getDefaultBank(id, params).subscribe((data) => {
			this.initialValues.paymentMode = getBlankOption();
			if (data['result']) {
				this.advancePaymentForm.get('payment_mode').setValue(data['result'].id);
				this.initialValues.paymentMode['label'] = data['result'].name
				this.initialValues.paymentMode['value'] = data['result'].id
				this.populatePaymentMethod()
			}


		})
	}

	populatePaymentMethod() {

		let vendorId = this.advancePaymentForm.get('party').value;
		if (vendorId) {
			this.data = this.vendorList.filter((ele) => ele.id === vendorId)[0];
		}

		this.onPaymentModeSelected()
	}

	onPaymentModeSelected(ele?: any) {
		let bank = this.advancePaymentForm.controls['payment_mode'].value
		this.bankingChargeRequired = bankChargeRequired(bank, this.advancePaymentForm.get('banking_charge'), this.accountList);
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
			this.initialValues.party = { value: $event.id, label: $event.label };
			this.advancePaymentForm.get('party').setValue($event.id);

		}
	}

	/* To get all the Vendor Details */

	getVendorDetails() {
		let VendorPramas = '1'; // Vendor
		this._partyService.getPartyList('0,1,2,3', VendorPramas).subscribe((response) => {
			this.vendorList = response.result;
		});

	}

	/* After closing the party modal to clear all the values */
	closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
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

	updateAdvanceForm() {
		const form = this.advancePaymentForm;
		if (form.valid) {
			this.advancePaymentForm.controls['banking_charge'].setValue(this.advancePaymentForm.controls['banking_charge'].value ? this.advancePaymentForm.controls['banking_charge'].value : 0);
			this.apiHandler.handleRequest(this._operationsPaymentService.putNewAdvancePayment(this.prepareRequest(form), this.vendorAdvanceId),'Vendor Advance updated successfully!').subscribe(
				{
					next: () => {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.ADVANCEBILL)
				        this._route.navigate([this.prefixUrl + '/payments/list/advance'], { queryParams: { pdfViewId: this.vendorAdvanceId } });
					  },
					  error: () => {
					  },
				}
			)
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
		}
	}

	saveAdvanceForm() {
		const form = this.advancePaymentForm;

		if (form.valid && this.isTaxFormValid) {
			this.advancePaymentForm.controls['banking_charge'].setValue(this.advancePaymentForm.controls['banking_charge'].value ? this.advancePaymentForm.controls['banking_charge'].value : 0);
			this.apiHandler.handleRequest(this._operationsPaymentService.postNewAdvancePayment(this.prepareRequest(form)),'Vendor Advance added successfully!').subscribe(
				{
					next: () => {
						this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.ADVANCEBILL)
				        this._route.navigateByUrl(this.prefixUrl + '/payments/list/advance');
					  },
					  error: () => {
					  },
				}
			)
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.taxFormValid.next(false);
		}
	}

	prepareRequest(form: UntypedFormGroup) {
		form.patchValue({
			date: changeDateToServerFormat(form.controls['date'].value)
		});
		return form.value;
	}



	getVednorPatch(editVendorCredit) {
		if (editVendorCredit.party) {
			this.initialValues.vendor['value'] = editVendorCredit.party.id;
			this.initialValues.vendor['label'] = editVendorCredit.party.display_name;
			editVendorCredit.party = editVendorCredit.party.id;
		} else {
			this.initialValues.vendor = getBlankOption();
		}
	}

	paymentModePatch(editVendorCredit) {
		if (editVendorCredit.payment_mode) {
			this.initialValues.paymentMode['value'] = editVendorCredit.payment_mode.id;
			this.initialValues.paymentMode['label'] = editVendorCredit.payment_mode.name;
			editVendorCredit.payment_mode = editVendorCredit.payment_mode.id;
		} else {
			this.initialValues.paymentMode = getBlankOption();
		}
	}

	stopLoaderClasstoBody() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.add('removeLoader');
	}

	employeePatch(editVendorCredit) {
		if (editVendorCredit.employee) {
			this.initialValues.employee['value'] = editVendorCredit.employee.id;
			this.initialValues.employee['label'] = editVendorCredit.employee.display_name;
			editVendorCredit.employee = editVendorCredit.employee.id;
		} else {
			this.initialValues.employee = getBlankOption();
		}
	}

	roundOffAmount(formControl) {
		roundOffAmount(formControl)
	}

	headerTaxDetails(data) {
		if (this.isTax) {
			this.isTaxFormValid = data.isFormValid;
			this.advancePaymentForm.get('place_of_supply').setValue(data['headerTaxDetails'].place_of_supply);
			this.isTransactionIncludesTax = data['headerTaxDetails'].is_transaction_includes_tax;
			this.isTransactionUnderReverse = data['headerTaxDetails'].is_transaction_under_reverse;
			this.advancePaymentForm.get('is_transaction_under_reverse').setValue(this.isTransactionUnderReverse);
			this.advancePaymentForm.get('is_transaction_includes_tax').setValue(this.isTransactionIncludesTax);
		}
	}

	getTaxDetails() {
		this._taxService.getTaxDetails().subscribe(result => {
			this.placeOfSupply = result.result['pos'];
		})
	}
}
