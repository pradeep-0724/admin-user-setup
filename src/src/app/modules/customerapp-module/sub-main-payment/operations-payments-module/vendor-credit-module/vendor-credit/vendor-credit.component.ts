import { TSAPIRoutes } from '../../../../../../core/constants/api-urls.constants';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, Validators, AbstractControl, UntypedFormControl } from '@angular/forms';
import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { isValidValue, getObjectFromList, getSelectedObject, getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { CommonService } from 'src/app/core/services/common.service';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { OperationsPaymentService } from '../../../../api-services/payment-module-service/payment-service/operations-payments.service';
import { Router, ActivatedRoute } from '@angular/router';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { VendorCreditClass } from './vendor-credit-class/vendor-credit.class';
import { VendorCreditClassService } from './vendor-credit-class/vendor-credit.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { getEmployeeObject } from 'src/app/modules/customerapp-module/master-module/employee-module/employee-utils';
import { Dialog } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
	selector: 'app-edit-vendor-credit',
	templateUrl: './vendor-credit.component.html',
	styleUrls: [
		'./vendor-credit.component.scss'
	]
})
export class VendorCreditsComponent extends VendorCreditClass implements OnInit, OnDestroy {
	editVendorCredit: UntypedFormGroup;
	expenseItemDropdownIndex: number = -1;
	employeeList: any = [];
	vehicleList: any = [];
	staticOptions: any = {};
	vendorList: any = [];
	accountList: any = [];
	billList: any = [];
	bankingChargeRequired: Boolean = false;
	vendorSelected: any = {};
	additionalDetails: any;
	vendorCreditTotals: any = {
		subtotal: 0,
		discountTotal: 0,
		taxes: [],
		discountAfterTaxTotal: 0,
		adjustmentAmount: 0,
		total: 0
	};
	materialList: any = [];
	vendorCreditId: any;
	vendorCreditData: any;
	loadPage: boolean = false;
	isDomReady: boolean = false;
	initialValues = {
		vendor: getBlankOption(),
		billNumber: {},
		employee: {},
		items: [],
		accounts: [],
		units: [],
		adjustmentAccount: getBlankOption(),
		tax: [getNonTaxableOption()]
	}
	materialApiCall: string = TSAPIRoutes.get_and_post_material;
	companyRegistered: boolean = true;
	afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
	expenseAccountList: any = [];
	otherExpenseValidatorSub: Subscription;
	adjustmentValidatorSub: Subscription;
	discountAfterTaxSub: Subscription;
	discountSub: Subscription;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	errorHeaderMessage = new ErrorList().headerMessage;
	paymentModeRequired: boolean = false;
	vendorId: string;
	vendor_Id;
	currency_type;
	documentPatchData: any = [];
	patchFileUrls = new BehaviorSubject([]);
	isAddItem = false;
	partyNamePopup: string = '';
	showAddPartyPopup: any = { name: '', status: false };
	showAddCoaPopup: any = { name: '', status: false };
	coaParams: any = {
		name: '',
	};
	coaDropdownIndex: number = -1;
	partyDetailsData = {
		isPartyRegistered: true,
		taxDeatils: {},
		placeOfSupply: [],
		companyRegistered: true
	};
	isTransactionIncludesTax = false;
	isTransactionUnderReverse = false;
	lastSectiondata = {
		data: []
	}
	partyTaxDetails = new BehaviorSubject<any>(this.partyDetailsData);
	isTax = false;
	placeOfSupply = [];
	taxOptions = [];
	tdsOptions = [];
	editData = new BehaviorSubject<any>({});
	isTaxFormValid: boolean = true;
	taxFormValid = new BehaviorSubject<any>(true);
	disableTax: boolean = false;
	defaultTax = new ValidationConstants().defaultTax;
	taxDetails;
	gstin = '';
	prefixUrl: string;
	isTdsDecleration = false;
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	isTds = false;
	terminology: any;
	screenType = ScreenType;

	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/NvTpA6F3RwLmMXCTz944?embed%22"
	}



	constructor(
		private _fb: UntypedFormBuilder,
		private _partyService: PartyService,
		private _commonService: CommonService,
		private _revenueService: RevenueService,
		private _operationsPayments: OperationsPaymentService,
		private _route: Router,
		private _activateRoute: ActivatedRoute,
		private currency: CurrencyService,
		private _tax: TaxService,
		private _taxService: TaxModuleServiceService,
		private _prefixUrl: PrefixUrlService,
		private _vendorCreditClassService: VendorCreditClassService,
		private _analytics: AnalyticsService,
		private _terminologiesService: TerminologiesService,
		private _scrollToTop: ScrollToTop,
		private dialog: Dialog,
		private apiHandler: ApiHandlerService,

	) {
		super();
		this.isTax = this._tax.getTax();
		this.isTds = this._tax.getVat();
		this.terminology = this._terminologiesService.terminologie;
		this.getTaxDetails();
	}

	ngOnDestroy() {
		this.otherExpenseValidatorSub.unsubscribe();
		this.adjustmentValidatorSub.unsubscribe();
		this.discountSub.unsubscribe();
	}

	ngOnInit() {
		setTimeout(() => {
			this.prefixUrl = this._prefixUrl.getprefixUrl();
			this.currency_type = this.currency.getCurrency();
		}, 1000);
		this._activateRoute.params.subscribe((pramas) => {
			this.vendorCreditId = pramas.vendor_credit_id;
			this.buildForm();

			this._vendorCreditClassService.getPartyList(vendorList => {
				if (vendorList && vendorList.length > 0) {
					this.vendorList = vendorList;
				}
			})
			this._commonService
				.getStaticOptions(
					'gst-treatment,tax,item-unit'
				)
				.subscribe((response) => {
					this.staticOptions.itemUnits = response.result['item-unit'];
					this._revenueService.getAccounts('All').subscribe((response) => {
						if (response !== undefined) {
							this.accountList = response.result;
						}
					});
				});

			this._vendorCreditClassService.getMaterialsList(materialList => {
				if (materialList && materialList.length > 0) {
					this.materialList = materialList;
				}
			})

			this._vendorCreditClassService.getEmployeeList(employeeList => {
				if (employeeList && employeeList.length > 0) {
					this.employeeList = employeeList;
				}
			})
		});

		this.editVendorCredit.controls['vendor_credit_date'].setValue(new Date(dateWithTimeZone()));


		this.getExpenseAccountsAndSetAccount();
	}
	handleEmployeeChange() {
		let empId = this.editVendorCredit.get('employee').value;
		let empObj = getEmployeeObject(this.employeeList, empId);
		this.initialValues.employee = { label: empObj?.display_name, value: empId }

	}

	openGothrough() {
		this.goThroughDetais.show = true;
	}

	getExpenseAccountsAndSetAccount() {
		this._vendorCreditClassService.getExpenseAccountsAndSetAccountList(expenseAccountList => {
			if (expenseAccountList && expenseAccountList.length > 0) {
				this.expenseAccountList = expenseAccountList;
				this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
				this.editVendorCredit.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
			}
		})
	}


	ngAfterViewInit() {
		if (this.vendorCreditId) {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.VENDORCREDIT, this.screenType.EDIT, "Navigated");
			setTimeout(() => {
				this.getFormValues();
				this.isDomReady = true;
			}, 1);
		} else {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.VENDORCREDIT, this.screenType.ADD, "Navigated");
		}
	}

	getFormValues() {
		this._operationsPayments.getVendorCreditDetails(this.vendorCreditId).subscribe((data: any) => {
			this.vendorCreditData = data.result;
			this.taxDetails = data.result;
			if (isValidValue(this.vendorCreditData.vendor)) {
				this._partyService.getPartyBills(this.vendorCreditData.vendor.id).subscribe((response) => {
					this.billList = response.result;
				});
				this._partyService.getPartyAdressDetails(this.vendorCreditData.vendor.id).subscribe((response) => {
					this.vendorSelected = response.result;

				});
			} else {
				this.vendorSelected = null;

			}
			this.employeePatch(this.vendorCreditData);
			this.adjustmentAccountPatch(this.vendorCreditData);
			this.billNumberPatch(this.vendorCreditData);
			this.editVendorCredit.patchValue(this.vendorCreditData);
			this.vendorNamePatch(this.vendorCreditData);
			if (this.isTax) {
				this.onVendorId();
			}
			this.itemsPatch(this.vendorCreditData);
			this.vendorCreditData['items'].forEach(ele => {
				ele.account = isValidValue(ele.account) ? ele.account.id : null;
				ele.tax = isValidValue(ele.tax) ? ele.tax.id : null;
				ele.item = isValidValue(ele.item) ? ele.item.id : null;
				this.initialValues.units.push({
					value: ele.units && ele.units.id ? ele.units.id : null,
					label: ele.units && ele.units.label ? ele.units.label : ''
				});
				ele.units = isValidValue(ele.units) ? ele.units.id : null;
			});
			if (this.vendorCreditData.items.length > 0) {
				this.buildVendorItems(this.vendorCreditData.items);
			} else {
				this.addMoreItem();
			}
			this.editVendorCredit.get('discount_after_tax_type').setValue(this.taxDetails.discount_after_tax_type.index);
			this.onCalcuationsChanged();
			this.patchDocuments(this.vendorCreditData);

		});
	}

	buildForm() {
		this.editVendorCredit = this._fb.group({
			total: [
				0,
				Validators.required
			],
			sub_total_without_tax: [0],
			discount_type: [
				0
			],
			discount: [
				0
			],
			adjustment_account: [
				null
			],
			adjustment_choice: [
				0
			],
			adjustment: [
				0
			],
			bill_number: [null,
				Validators.required
			],
			documents: [
				[]
			],

			order_number: [
				''
			],
			employee: [
				null
			],
			vendor_credit_number: [
				'',
				Validators.required
			],
			vendor_credit_date: [
				null,
				Validators.required
			],
			vendor: [
				null,
				Validators.required
			],
			comments: [
				''
			],
			remarks: [
				''
			],
			is_transaction_includes_tax: [
				false
			],
			is_transaction_under_reverse: [
				false
			],
			place_of_supply: [''],
			discount_after_tax_type: [
				0
			],
			discount_after_tax: [
				0
			],
			vendor_items: this._fb.array([]),
			deleted_items: this._fb.array([])
		});

		if (!this.vendorCreditId) {
			this.addMoreItem();
		}
		this.setFormValidators();
		this.onCalcuationsChanged();
	}

	buildVendorItems(items) {
		const vendorItems = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		items.forEach((item) => {
			vendorItems.push(this.buildVendorItem(item));
		});
	}

	buildVendorItem(item) {
		return this._fb.group({
			id: [
				item.id || ''
			],
			amount: [
				item.amount || 0
			],

			quantity: [
				item.quantity || 0
			],
			units: [
				item.units || null,
			],
			cess: [item.cess || 0],
			description: [
				item.description || ''
			],
			account: [
				item.account || null
			],
			rate: [
				item.rate || 0
			],
			item: [
				item.item || null, [Validators.required]
			],
			total_before_tax: [item.total_before_tax || 0],
			tax: [item.tax || this.defaultTax],
			additionalDetails: [
				false
			]
		});
	}

	fileUploader(filesUploaded) {
		let documents = this.editVendorCredit.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.editVendorCredit.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.editVendorCredit.get('documents') as UntypedFormControl;
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

	clearAllCell() {
		const vendorItems = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		vendorItems.reset();
		vendorItems.controls = [];
		this.initialValues.accounts = [];
		this.initialValues.items = [];
		this.initialValues.units = [];
		this.addMoreItem();
		this.onCalcuationsChanged();
	}

	onVendorSelected(e) {
		if (e.target.value === '') {
			this.vendorSelected = null;
			this.vendorId = null;
			return;
		}

		this.vendor_Id = e.target.value;

		if (isValidValue(e.target.value)) {
			this.vendorId = this.vendor_Id;
			this.clearAllCell();
			this._partyService.getPartyBills(e.target.value).subscribe((response) => {
				this.billList = response.result;
			});
			this._partyService.getPartyAdressDetails(e.target.value).subscribe((response) => {

				this.vendorSelected = response.result;
				this.gstin = this.vendorSelected.tax_details.gstin;
				this.isTdsDecleration = this.vendorSelected.tax_details.tds_declaration;
				if (this.gstin == 'Unregistered') {
					this.partyDetailsData = {
						isPartyRegistered: false,
						taxDeatils: this.vendorSelected.tax_details,
						placeOfSupply: this.placeOfSupply,
						companyRegistered: this.companyRegistered
					}
					this.partyTaxDetails.next(this.partyDetailsData)
				} else {
					this.partyDetailsData = {
						isPartyRegistered: true,
						taxDeatils: this.vendorSelected.tax_details,
						placeOfSupply: this.placeOfSupply,
						companyRegistered: this.companyRegistered
					}
					this.partyTaxDetails.next(this.partyDetailsData)
				}

			});
		} else {
			this.vendorSelected = null;

		}
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

	/*  To get all the vendor details */
	getVendorDetails() {
		let VendorPramas = '1'; // Vendor
		this._partyService.getPartyList('0,1,2,3', VendorPramas).subscribe((response) => {
			this.vendorList = response.result;
		});

	}

	/* For Displaying the party name in the subfield  */
	addPartyToOption($event) {
		if ($event.status) {
			this.getVendorDetails();
			this.initialValues.vendor = { value: $event.id, label: $event.label };
			this.editVendorCredit.get('vendor').setValue($event.id);

		}
	}

	/* After closing the party modal to clear all the values */
	closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}

	clearVendorItems() {
		const vendorItems = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		vendorItems.reset();
		vendorItems.controls = [];
		this.emptyItemInitialValues();
		this.addMoreItem();
		this.onCalcuationsChanged();
	}

	emptyItemInitialValues() {
		this.initialValues.accounts = [];
		this.initialValues.items = [];
		this.initialValues.units = [];
	}

	removeItems(i) {
		const vendorItems = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		this.initialValues.accounts.splice(i, 1);
		this.initialValues.items.splice(i, 1);
		this.initialValues.units.splice(i, 1);
		vendorItems.removeAt(i);
		this.onCalcuationsChanged();
	}

	addMoreItem() {
		const vendorItems = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		vendorItems.push(this.buildVendorItem({}));
		this.initialValues.accounts.push(getBlankOption());
		this.initialValues.items.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
	}

	cloneVendorItem(form: UntypedFormGroup) {
		const vendorItems = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		form.value.id ? delete form.value.id : '';
		vendorItems.push(this.buildVendorItem(form.value));
		this.cloneTax(form.value);
		this.cloneAccount(form.value);
		this.cloneItem(form.value);
		this.cloneUnits(form.value);
		this.onCalcuationsChanged();
	}

	resetItem(formGroup, i) {
		const singleUse = this.buildVendorItem({});
		formGroup.patchValue(singleUse.value);
		this.initialValues.accounts[i] = getBlankOption();
		this.initialValues.items[i] = getBlankOption();
		this.initialValues.units[i] = getBlankOption();
		this.onCalcuationsChanged();
	}

	addExpenseToOption($event) {
		if ($event) {
			this._revenueService.getAccounts('All').subscribe((response) => {
				if (response !== undefined) {
					this.accountList = response.result;
				}
			});
			if (this.coaDropdownIndex != -1) {
				this.initialValues.accounts[this.coaDropdownIndex] = { value: $event.id, label: $event.label };

				let other_expense = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
				other_expense.at(this.coaDropdownIndex).get('account').setValue($event.id);
				this.coaDropdownIndex = -1;

			}
		}
	}

	addParamsCoaItem($event) {
		this.coaParams = {
			name: $event
		};
	}

	openAddCoaModal($event, index) {
		if ($event)
			this.coaDropdownIndex = index;
		this.showAddCoaPopup = { name: this.coaParams.name, status: true };
	}

	closeCoaPopup() {
		this.showAddCoaPopup = { name: '', status: false };
	}


	onItemSelected(event, itemExpenseControl: UntypedFormGroup, index: number) {
		if (event.target.value !== null) {
			this.resetOtherExpenseExceptItem(itemExpenseControl, index);
			const itemSelected = getObjectFromList(event.target.value, this.materialList);
			itemExpenseControl.get('rate').setValue(itemSelected.rate_per_unit);
			itemExpenseControl.get('units').setValue(itemSelected.unit ? itemSelected.unit.id : null);
			if (itemSelected.unit) {
				this.initialValues.units[index] = { label: itemSelected.unit.label, value: itemSelected.unit.id };
			}
			this.onCalcuationsChanged();
		}
	}

	resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({ units: null, rate: 0, quantity: 0, account: null, amount: 0 });
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.accounts[index] = getBlankOption();
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

	saveVendorCredit() {
		let form = this.editVendorCredit;
		if (form.valid && this.isTaxFormValid) {
			this.apiHandler.handleRequest(this._operationsPayments.postNewVendorCredit(this.prepareRequest(form)),'Vendor Credit added successfully!').subscribe(
				{
					next: () => {
						this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.VENDORCREDIT)
				        this._route.navigateByUrl(this.prefixUrl + '/payments/vendor_credit/list');
					  },
					  error: () => {
					  },
				}
			)
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.taxFormValid.next(false);
			this.setFormGlobalErrors();
		}
	}

	updateVendorCredit() {
		let form = this.editVendorCredit;
		if (form.valid) {
			this.apiHandler.handleRequest(this._operationsPayments.putNewVendorCredit(this.prepareRequest(form), this.vendorCreditId),'Vendor Credit updated successfully!').subscribe(
				{
					next: () => {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.VENDORCREDIT)
				        this._route.navigateByUrl(this.prefixUrl + '/payments/vendor_credit/list');
					  },
					  error: () => {
					  },
				}
			)
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
		}
	}

	setFormGlobalErrors() {
		this.globalFormErrorList = [];
		let errorIds = Object.keys(this.possibleErrors);
		for (let prop of errorIds) {
			const error = this.possibleErrors[prop];
			if (error.status == true) {
				this.globalFormErrorList.push(error.message);
			}
		}
	}


	prepareRequest(form: UntypedFormGroup) {
		form.patchValue({
			vendor_credit_date: changeDateToServerFormat(form.controls['vendor_credit_date'].value)
		});
		return form.value;
	}




	employeePatch(vendorCreditData) {
		if (vendorCreditData.employee) {
			this.initialValues.employee['value'] = vendorCreditData.employee.id;
			this.initialValues.employee['label'] = vendorCreditData.employee.display_name;
			vendorCreditData.employee = vendorCreditData.employee.id;
		} else {
			this.initialValues.employee = getBlankOption();
		}
	}

	vendorNamePatch(vendorCreditData) {
		if (vendorCreditData.vendor) {
			this.initialValues.vendor['value'] = vendorCreditData.vendor.id;
			this.initialValues.vendor['label'] = vendorCreditData.vendor.display_name;
			this.editVendorCredit.get('vendor').setValue(vendorCreditData.vendor.id);
		} else {
			this.initialValues.vendor = getBlankOption();
		}
	}



	billNumberPatch(vendorCreditData) {
		if (vendorCreditData.bill_number) {
			this.initialValues.billNumber['value'] = vendorCreditData.bill_number.id;
			this.initialValues.billNumber['label'] = vendorCreditData.bill_number.bill_number;
			vendorCreditData.bill_number = vendorCreditData.bill_number.id;
		} else {
			this.initialValues.billNumber = getBlankOption();
		}
	}


	adjustmentAccountPatch(vendorCreditData) {
		if (vendorCreditData.adjustment_account) {
			this.initialValues.adjustmentAccount['value'] = vendorCreditData.adjustment_account.id;
			this.initialValues.adjustmentAccount['label'] = vendorCreditData.adjustment_account.name;
			vendorCreditData.adjustment_account = vendorCreditData.adjustment_account.id;
		} else {
			this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
		}
	}

	itemsPatch(vendorCreditData) {
		this.initialValues.tax = [];
		vendorCreditData.items.forEach((ele, index) => {
			if (ele.account) {
				this.initialValues.accounts.push({ value: ele.account.id, label: ele.account.name });
			} else {
				this.initialValues.accounts.push(getBlankOption())
			}
			if (ele.tax) {
				this.initialValues.tax.push({ value: ele.tax.id, label: ele.tax.label });
			} else {
				this.initialValues.accounts.push(getNonTaxableOption())
			}

			if (ele.item) {
				this.initialValues.items.push({ value: ele.item.id, label: ele.item.name });
			} else {
				this.initialValues.items.push(getBlankOption());
			}
		});
	}

	onChangeOtherExpenseItem(index) {
		const otherExpenses = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		const otherExpense = otherExpenses.at(index);
		const itemId = otherExpense.get('item').value;
		if (itemId) {
			const expenseItem = getObjectFromList(itemId, this.materialList);
			if (expenseItem) {
				if (expenseItem.account) {
					otherExpense.get('account').setValue(expenseItem.account.id);
					this.initialValues.accounts[index] = { label: expenseItem.account.name, value: expenseItem.account.id }
				}
				else {
					otherExpense.get('account').setValue(null);
					this.initialValues.accounts[index] = getBlankOption();
				}

				if (expenseItem.tax) {
					otherExpense.get('tax').setValue(expenseItem.tax.id);
					this.initialValues.tax[index] = { label: expenseItem.tax.label, value: expenseItem.tax.id }
				}

				if (expenseItem.unit) {
					otherExpense.get('units').setValue(expenseItem.unit.id);
					this.initialValues.units[index] = { label: expenseItem.unit.label, value: expenseItem.unit.id }
				}
				else {
					otherExpense.get('units').setValue(null);
					this.initialValues.units[index] = getBlankOption();
				}

				otherExpense.get('rate').setValue(expenseItem.rate_per_unit);
			}
		}
	}

	cloneAccount(formValue) {
		const accountObj = getSelectedObject(this.accountList, formValue.account);
		this.initialValues.accounts.push({ value: accountObj ? accountObj.id : null, label: accountObj ? accountObj.name : '' });
	}

	cloneTax(formValue) {
		const accountObj = getSelectedObject(this.taxOptions, formValue.tax);
		this.initialValues.tax.push({ value: accountObj ? accountObj.id : null, label: accountObj ? accountObj.label : '' });
	}



	cloneItem(formValue) {
		const accountObj = getSelectedObject(this.materialList, formValue.item);
		this.initialValues.items.push({ value: accountObj ? accountObj.id : null, label: accountObj ? accountObj.name : '' });
	}

	cloneUnits(formValue) {
		const unitsObj = getSelectedObject(this.staticOptions.itemUnits, formValue.units);
		this.initialValues.units.push({ value: unitsObj ? unitsObj.id : null, label: unitsObj ? unitsObj.label : '' });
	}


	setFormValidators() {
		const item_other = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
			items.forEach((key, index) => {
				const item = item_other.at(index).get('item');
				const expense_account = item_other.at(index).get('account');
				const quantity = item_other.at(index).get('quantity');
				const units = item_other.at(index).get('units');
				const rate = item_other.at(index).get('rate');
				item.setValidators(Validators.required);
				units.setValidators(Validators.required);
				expense_account.setValidators(Validators.required);
				quantity.setValidators([Validators.min(0.01), Validators.required]);
				rate.setValidators([Validators.min(0.01), Validators.required]);
				item.updateValueAndValidity({ emitEvent: true });
				quantity.updateValueAndValidity({ emitEvent: true });
				expense_account.updateValueAndValidity({ emitEvent: true });
				units.updateValueAndValidity({ emitEvent: true });
				rate.updateValueAndValidity({ emitEvent: true });
			});
		});

		let adjustmentAmount = this.editVendorCredit.get('adjustment');
		this.adjustmentValidatorSub = adjustmentAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

			const adjustmentAmount = this.editVendorCredit.get('adjustment');
			const adjustmentChoice = this.editVendorCredit.get('adjustment_choice');
			const adjustmentAfterSubtotal = this.vendorCreditTotals.adjustmentAmount;
			const totalAmount = this.vendorCreditTotals.total;
			let validators: any = [];

			if (adjustmentAfterSubtotal < 0 && totalAmount < 0) {
				validators.push(TransportValidator.createPositiveValidator(totalAmount))
			}

			if (adjustmentChoice.value == 0) {
				validators.push(Validators.max(100));
				validators.push(Validators.min(-100));
			}
			adjustmentAmount.setValidators(validators);
			adjustmentAmount.updateValueAndValidity({ emitEvent: true })

		});

		let discountBeforeAmount = this.editVendorCredit.get('discount');
		this.discountSub = discountBeforeAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

			const adjustmentAmount = this.editVendorCredit.get('discount');
			const adjustmentChoice = this.editVendorCredit.get('discount_type');
			let validators: any = [];

			if (adjustmentChoice.value == 0) {
				validators.push(Validators.max(100));
				validators.push(Validators.min(-100));
			}
			adjustmentAmount.setValidators(validators);
			adjustmentAmount.updateValueAndValidity({ emitEvent: true })
		});
	}

	headerTaxDetails(data) {
		if (this.isTax) {
			this.isTaxFormValid = data.isFormValid;
			this.editVendorCredit.get('place_of_supply').setValue(data['headerTaxDetails'].place_of_supply);
			this.isTransactionIncludesTax = data['headerTaxDetails'].is_transaction_includes_tax;
			this.isTransactionUnderReverse = data['headerTaxDetails'].is_transaction_under_reverse;
			this.editVendorCredit.get('is_transaction_under_reverse').setValue(this.isTransactionUnderReverse);
			this.editVendorCredit.get('is_transaction_includes_tax').setValue(this.isTransactionIncludesTax);
			if (this.companyRegistered || this.isTransactionUnderReverse) {
				this.disableTax = false;
			}
			if (!this.partyDetailsData.isPartyRegistered && !this.isTransactionUnderReverse) {
				this.setAllTaxAsNonTaxable();
				this.disableTax = true;
			}
			this.onCalcuationsChanged();
		}
	}

	getTaxDetails() {
		this._taxService.getTaxDetails().subscribe(result => {
			this.placeOfSupply = result.result['pos'];
			this.taxOptions = result.result['tax'];
			this.vendorCreditTotals.taxes = result.result['tax'];
			this.companyRegistered = result.result['registration_status'];
		})
	}

	setAllTaxAsNonTaxable() {
		this.initialValues.tax.fill(getNonTaxableOption());
		const otherItems = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		otherItems.controls.forEach((controls) => {
			controls.get('tax').setValue(this.defaultTax);
		});
		this.editVendorCredit.get('discount_after_tax').setValue(0);
	}

	onVendorId() {
		if (this.taxDetails['vendor'].tax_details['gstin'] == 'Unregistered') {
			this.partyDetailsData = {
				isPartyRegistered: false,
				taxDeatils: this.taxDetails['vendor'].tax_details,
				placeOfSupply: this.placeOfSupply,
				companyRegistered: this.companyRegistered
			}
			this.partyTaxDetails.next(this.partyDetailsData)
		} else {
			this.partyDetailsData = {
				isPartyRegistered: true,
				taxDeatils: this.taxDetails['vendor'].tax_details,
				placeOfSupply: this.placeOfSupply,
				companyRegistered: this.companyRegistered
			}
			this.partyTaxDetails.next(this.partyDetailsData)
		}
		this.gstin = this.taxDetails['vendor'].tax_details['gstin'];
		this.isTdsDecleration = this.taxDetails['vendor'].tax_details['tds_declaration'];
		this.editData.next(
			{
				patchData: this.taxDetails
			});
		this.editVendorCredit.get('discount_after_tax').setValue(this.taxDetails.discount_after_tax);
	}

	addNewAdditionalCharge(event, i) {
		const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
			data: {
				isEdit: false,
				charge_name: event,
				sales: false,
				purchase: true,
				vehicleCategory: false,
				isDisableSeletAll: false
			},
			width: '1000px',
			maxWidth: '90%',
			closeOnNavigation: true,
			disableClose: true,
			autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
			if (item) {
				this.expenseItemDropdownIndex = i;
				this._revenueService.getExpense().subscribe((response) => {
					if (response && response.result && response.result.length > 0) {
						this.materialList = response.result;
						if (this.expenseItemDropdownIndex != -1) {
							this.initialValues.items[this.expenseItemDropdownIndex] = { value: item.name.id, label: item.name.name };
							let other_expense = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
							other_expense.at(this.expenseItemDropdownIndex).get('item').setValue(item.name.id)
							this.onChangeOtherExpenseItem(this.expenseItemDropdownIndex)
							this.expenseItemDropdownIndex = -1;
						}
					}
				});
			}

			dialogRefSub.unsubscribe();
		})
	}


}
