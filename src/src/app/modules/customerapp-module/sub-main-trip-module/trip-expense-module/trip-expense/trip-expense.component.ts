
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { Component, OnInit } from '@angular/core';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { PartyType, ValidationConstants, VendorType } from 'src/app/core/constants/constant';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isValidValue, getObjectFromList, getMinOrMaxDate, getBlankOption, getNonTaxableOption, } from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { PaymentDueDateCalculator, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { FleetOwnerClassService } from '../../fleet-owner-expenses/fleet-owner-class/fleet-owner.service';
import { TripExpenseService } from '../../../api-services/trip-module-services/trip-expense-service/trip-expense-service.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getEmployeeObject } from '../../../master-module/employee-module/employee-utils';
import { Dialog } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupComponent } from '../../../master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { cloneDeep } from 'lodash';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
@Component({
	selector: 'app-trip-expense',
	templateUrl: './trip-expense.component.html',
	styleUrls: ['./trip-expense.component.scss']
})
export class TripExpenseComponent implements OnInit {
	terminology: any;
	tripExpenseForm: UntypedFormGroup;
	expenseItemDropdownIndex: number = -1;
	blankOption = { label: '', value: null };
	presentPositionTyres: any = [];
	employeeList: any = [];
	vehicleList: any = [];
	staticOptions: any = {};
	vendorList: any = [];
	accountList: any = [];
	apiError: string;
	challansList: Array<any> = [];
	bankingChargeRequired: Boolean = false;
	vendorSelected: any = {};
	alphaNumericPattern = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
	newMechanicTotals: any = {
		subtotal: 0,
		subtotal_challan: 0.0,
		subtotal_others: 0.0,
		discountTotal: 0,
		taxes: [],
		discountAfterTaxTotal: 0,
		tdsAmount: 0,
		adjustmentAmount: 0,
		total: 0,
		advanceAmount: 0.0,
		balance: 0.0
	};
	selectedPaymentTerm: any;
	BillDate: any;
	materialList: any = [];
	serviceList: any = [];
	tripExpenseId: any;
	mechanicActivityData: any;
	paymentStatusDisable: boolean;
	current_date: Date = new Date(dateWithTimeZone());
	paymentAccountList: any = [];
	initialValues: any = {
		vendor: getBlankOption(),
		gstTreatment: getBlankOption(),
		placeOfSupply: getBlankOption(),
		paymentTerm: getBlankOption(),
		units: [],
		vehicle: [getBlankOption()],
		serviceType: [getBlankOption()],
		expenseAccount: [],
		item: [],
		taxPercent: [],
		tripChallanTax: [getNonTaxableOption()],
		employee: getBlankOption(),
		adjustmentChoice: getBlankOption(),
		discountAfterTaxType: getBlankOption(),
		tdsType: getBlankOption(),
		discountType: getBlankOption(),
		adjustmentAccount: getBlankOption()
	};
	itemDropdownPostApi = TSAPIRoutes.operation + TSAPIRoutes.expense;
	serviceTypePostApi = TSAPIRoutes.operation + TSAPIRoutes.service_type;
	mechanicExpensesItemParams: any = {};
	serviceTypeParams: any = {};
	unregisteredGst = new ValidationConstants().unregisteredGst;
	showGstinModal: boolean = false;
	vendorId: string;
	gstin: any = "";
	defaultTax = new ValidationConstants().defaultTax;
	taxOption = getNonTaxableOption();
	disableTax: boolean = false;
	minDate: Date;
	i;
	isDomReady: boolean = false;
	showAddExpenseItemPopup: any = { name: '', status: false };
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
	challanModelInline: Boolean = true;
	isAdd: boolean = false;
	currency_type;
	documentPatchData: any = [];
	patchFileUrls = new BehaviorSubject([]);
	vendorDetails;
	defaultAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
	showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
	showAddCoaPopup: any = { name: '', status: false };
	coaParams: any = {
		name: '',
	};
	coaDropdownIndex: number = -1;
	placeOfSupply = [];
	taxOptions = [];
	tdsOptions = [];
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
	lastSectionTaxDetails = new BehaviorSubject<any>(this.lastSectiondata);
	isTax = true;
	editData = new BehaviorSubject<any>({});
	lastSectionEditData = new BehaviorSubject<any>({});
	isTaxFormValid: boolean = true;
	taxFormValid = new BehaviorSubject<any>(true);
	taxDetails;
	prefixUrl: string;

	tripChallanModelInline: boolean = false
	isTripAdd: boolean = true;
	tripChallansList: any = [];
	disableTripTax: boolean = false;
	tripId = '';
	isTdsDecleration = false;
	isWOEmpty: boolean = false;
	isTds = false;
	policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	doChallanExists: boolean = false;
	isPaymentstatusValid = true;
	$paymentStatusValid = new BehaviorSubject(true)
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/OsBPoLcKaxHgknPd13ht?embed%22"
	}
	paymentTermCustom = new ValidationConstants().paymentTermCustom;


	constructor(private _fb: UntypedFormBuilder,
		private _terminologiesService: TerminologiesService,
		private _commonService: CommonService,
		private _partyService: PartyService,
		private _activatedRoute: ActivatedRoute,
		private _revenueService: RevenueService,
		private currency: CurrencyService,
		private _taxService: TaxModuleServiceService,
		private _fleetOwnerClassService: FleetOwnerClassService,
		private _tax: TaxService,
		private _prefixUrl: PrefixUrlService,
		private _tripExpenseService: TripExpenseService,
		private _analytics: AnalyticsService,
		private _scrollToTop: ScrollToTop,
		private dialog: Dialog,
		private commonloaderswervie: CommonLoaderService,
		private apiHandler: ApiHandlerService,
		private _route: Router) {
		this.isTax = this._tax.getTax();
		this.isTds = this._tax.getVat();
		this.getTaxDetails();
	}


	ngOnDestroy() {
		this.commonloaderswervie.getShow()
		this.otherExpenseValidatorSub.unsubscribe();
		this.adjustmentValidatorSub.unsubscribe();
		this.discountSub.unsubscribe();
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('removeLoader');

	}

	ngOnInit() {
		this.commonloaderswervie.getHide()
		this.terminology = this._terminologiesService.terminologie;
		setTimeout(() => {
			this.prefixUrl = this._prefixUrl.getprefixUrl();
			this.currency_type = this.currency.getCurrency();
		}, 1000);
		this._activatedRoute.params.subscribe((response: any) => {
			this.tripExpenseId = response.id;
			this.buildForm();
			this.challanModelInline = this.tripExpenseId ? true : false;
			this.tripExpenseForm.controls['id'].setValue(this.tripExpenseId);
			this._fleetOwnerClassService.getEmployeeList(employeeList => {
				if (employeeList && employeeList.length > 0) {
					this.employeeList = employeeList;
				}
			})

			this._fleetOwnerClassService.getVehicleList(vehicleList => {
				if (vehicleList && vehicleList.length > 0) {
					this.vehicleList = vehicleList;
				}
			})


			this._fleetOwnerClassService.getAccountsList(accountList => {
				if (accountList && accountList.length > 0) {
					this.accountList = accountList;
				}
			})


			this._fleetOwnerClassService.getPaymentAccountsList(paymentAccountList => {
				if (paymentAccountList && paymentAccountList.length > 0) {
					this.paymentAccountList = paymentAccountList;
				}
			})
			this.getVendorDetails();
			this._commonService
				.getStaticOptions(
					'billing-payment-method,gst-treatment,payment-term,tax,tds,item-unit'
				)
				.subscribe((response) => {

					this.staticOptions.paymentMethods = response.result['billing-payment-method'];
					this.staticOptions.gstPercent = response.result['tax'];
					this.staticOptions.treatmentList = response.result['gst-treatment'];
					this.staticOptions.paymentTermList = cloneDeep(response.result['payment-term'])
					this.staticOptions.itemUnits = response.result['item-unit'];
					this.staticOptions.tds = response.result['tds'];
					this.initialValues.paymentTerm = cloneDeep(this.staticOptions.paymentTermList[0]);
					this.tripExpenseForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0].id)
					this.onpaymentTermSelected(this.staticOptions.paymentTermList[0].id);
				})
			this.getMaterials();
		});
		this.tripExpenseForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))
		this.getExpenseAccountsAndSetAccount();
		this.tripExpenseForm.controls['bill_date'].setValue(new Date(dateWithTimeZone()));
		this.minDate = new Date(dateWithTimeZone())
		this.tripExpenseForm.controls['reminder'].setValue(new Date(dateWithTimeZone()));

	}
	handleEmployeeChange() {
		let empId = this.tripExpenseForm.get('employee').value;
		let empObj = getEmployeeObject(this.employeeList, empId);
		this.initialValues.employee = { label: empObj?.display_name, value: empId }

	}


	checkChallanExist(value) {
		this.doChallanExists = value
	}

	getExpenseAccountsAndSetAccount() {
		this._fleetOwnerClassService.getExpenseAccountsAndSetAccountList(expenseAccountList => {
			if (expenseAccountList && expenseAccountList.length > 0) {
				this.expenseAccountList = expenseAccountList;
				this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
				this.tripExpenseForm.get('adjustment_account').setValue(this.defaultAdjustmentAccount.value);
			}
		})
	}

	openGothrough() {
		this.goThroughDetais.show = true;
	}

	ngAfterViewInit() {
		if (this.tripExpenseId) {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.TRIPEXPENSEBILL, this.screenType.EDIT, "Navigated");
			setTimeout(() => {
				this.getFormValues();
				this.isDomReady = true;
			}, 1);
		} else {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.TRIPEXPENSEBILL, this.screenType.ADD, "Navigated");
		}
	}

	getFormValues() {
		this._tripExpenseService.getTripExpense(this.tripExpenseId).subscribe((data: any) => {
			this.mechanicActivityData = data.result;
			this.taxDetails = this.mechanicActivityData;
			this.vendorId = this.mechanicActivityData.vendor.id
			this.minDate = data.result.bill_date;
			this._revenueService.sendPartyIntime(this.vendorId);
			if (this.vendorId) {
				this._partyService.getPartyAdressDetails(this.vendorId).subscribe(res => {
					this.vendorSelected = res.result;
				});
			}

			this.initialValues.vendor['label'] = isValidValue(this.mechanicActivityData.vendor) ? this.mechanicActivityData.vendor.display_name : '';

			this.initialValues.employee['label'] = isValidValue(this.mechanicActivityData.employee) ? this.mechanicActivityData.employee.name : '';
			this.mechanicActivityData.employee = isValidValue(this.mechanicActivityData.employee) ? this.mechanicActivityData.employee.id : null;

			this.initialValues.paymentTerm['label'] = isValidValue(this.mechanicActivityData.payment_term) ? this.mechanicActivityData.payment_term.label : '';
			this.mechanicActivityData.payment_term = isValidValue(this.mechanicActivityData.payment_term) ? this.mechanicActivityData.payment_term.id : null;

			this.initialValues.adjustmentChoice['label'] = isValidValue(this.mechanicActivityData.adjustment_choice) ? this.mechanicActivityData.adjustment_choice.label : '';
			this.mechanicActivityData.adjustment_choice = isValidValue(this.mechanicActivityData.adjustment_choice) ? this.mechanicActivityData.adjustment_choice.index : null;

			this.initialValues.discountType['label'] = isValidValue(this.mechanicActivityData.discount_type) ? this.mechanicActivityData.discount_type.label : '';
			this.mechanicActivityData.discount_type = isValidValue(this.mechanicActivityData.discount_type) ? this.mechanicActivityData.discount_type.index : null;

			this.initialValues.discountAfterTaxType['label'] = isValidValue(this.mechanicActivityData.discount_after_tax_type) ? this.mechanicActivityData.discount_after_tax_type.label : '';
			this.mechanicActivityData.discount_after_tax_type = isValidValue(this.mechanicActivityData.discount_after_tax_type) ? this.mechanicActivityData.discount_after_tax_type.index : null;

			this.initialValues.adjustmentAccount['value'] = isValidValue(this.mechanicActivityData.adjustment_account) ? this.mechanicActivityData.adjustment_account.id : this.afterTaxAdjustmentAccount.value;
			this.initialValues.adjustmentAccount['label'] = isValidValue(this.mechanicActivityData.adjustment_account) ? this.mechanicActivityData.adjustment_account.name : this.afterTaxAdjustmentAccount.label;
			this.mechanicActivityData.adjustment_account = isValidValue(this.mechanicActivityData.adjustment_account) ? this.mechanicActivityData.adjustment_account.id : this.afterTaxAdjustmentAccount.value;
			this.patchItemOthers();
			this.tripExpenseForm.patchValue(this.mechanicActivityData);
			this.onVendorId();
			if (this.isTax) {
				this.lastSectionEditData.next({
					patchData: this.taxDetails,
					lastSectionData: this.lastSectiondata.data
				});
			}
			this.tripExpenseForm.controls['vendor'].setValue(this.mechanicActivityData.vendor.id);
			this.patchDocuments(this.mechanicActivityData);

		})



	}

	fileUploader(filesUploaded) {
		let documents = this.tripExpenseForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.tripExpenseForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.tripExpenseForm.get('documents') as UntypedFormControl;
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
			this.tripExpenseForm.get('vendor').setValue($event.id);
			this.onVendorSelected($event.id);
		}
	}

	/* To get all the Vendor Details */

	getVendorDetails() {
		this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
			this.vendorList = response.result;
		});
	}

	/* After closing the party modal to clear all the values */
	closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}

	onCalendarChangePTerm(billDate) {
		if (billDate) {
			if (this.tripExpenseForm.controls['payment_status'].value != 1) {
				this.tripExpenseForm.controls['transaction_date'].patchValue(billDate);
			}
			this.minDate = getMinOrMaxDate(billDate);
		}
		let existingTerm = this.tripExpenseForm.controls['payment_term'].value;
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}

	onpaymentTermSelected(termId) {
		if (termId) {
			this.selectedPaymentTerm = getObjectFromList(termId, this.staticOptions.paymentTermList);
			this.BillDate = this.tripExpenseForm.controls['bill_date'].value;
			if (termId == this.paymentTermCustom) {
				this.tripExpenseForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.BillDate, this.vendorSelected['terms_days']));
			} else {
				this.tripExpenseForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.BillDate, this.selectedPaymentTerm ? this.selectedPaymentTerm.value : null));
			}
		}
	}

	addExpenseToOption($event) {
		if ($event) {
			this._revenueService.getAccounts('Expense').subscribe((response) => {
				if (response !== undefined) {
					this.accountList = response.result;
				}
			});
			if (this.coaDropdownIndex != -1) {
				this.initialValues.expenseAccount[this.coaDropdownIndex] = { value: $event.id, label: $event.label };

				let other_expense = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
				other_expense.at(this.coaDropdownIndex).get('expense_account').setValue($event.id);
				this.coaDropdownIndex = -1;
			}
		}
	}

	openAddCoaModal($event, index) {
		if ($event)
			this.coaDropdownIndex = index;
		this.showAddCoaPopup = { name: this.coaParams.name, status: true };
	}

	closeCoaPopup() {
		this.showAddCoaPopup = { name: '', status: false };
	}

	addParamsCoaItem($event) {
		this.coaParams = {
			name: $event
		};
	}

	challansSelected(ele) {
		// because selected challans should have challan as id and no id.
		if (ele.length == 0)
			this.challanModelInline = false;
		else
			this.challanModelInline = true;

		ele.forEach((challan) => {
			if (challan.fleetowner_expense == undefined) {
				challan.fleetowner_expense = challan.id;
			}
		});

		this.apiError = '';
	}

	buildNewItemExpenses(items) {
		let newItemExpenses = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		items.forEach((i, item) => {
			newItemExpenses.push(this.buildNewMaintainanceForm(i));
		});
	}

	buildNewMaintainanceForm(item: any) {
		return this._fb.group({
			id: [item.id || ''],
			expense_account: [
				item.expense_account || null
			],
			item: [
				item.item || null
			],
			quantity: [
				item.quantity || 0
			],
			unit: [
				item.unit || null
			],
			unit_cost: [
				item.unit_cost || 0
			],
			total: [
				item.total || 0
			],
			total_before_tax: [0],
			tax: [
				item.tax || this.defaultTax
			]
		});
	}

	addTripChallan(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			date: [
				item.date || null
			],
			vehicle: [
				item.vehicle || null
			],
			work_order_no: [
				item.work_order_no || ''
			],
			builty_no: [
				item.builty_no || ''
			],
			expense_type: [item.expense_type || ''],
			amount: [item.amount || 0.00],
			tripcharge: [
				item.tripcharge, [Validators.required]
			],
			adjustment: [
				item.adjustment || 0.00
			],
			expense_amount_before_tax: [item.expense_amount_before_tax],
			expense_amount: [item.expense_amount],
			total: [
				item.total
			],
			tax: [item.tax.id || this.defaultTax]
		});
	}


	buildTripChallans(items: any = []) {
		const challans = this.tripExpenseForm.controls['expenses'] as UntypedFormArray;
		challans.controls = [];
		challans.setValue([]);
		this.tripChallansList = [];
		this.initialValues.tripChallanTax = [];
		items.forEach((item, index) => {
			this.initialValues.tripChallanTax.push(getNonTaxableOption());
			this.initialValues.tripChallanTax[index] = { label: item.tax.label, value: item.tax.id };
			this.tripChallansList.push(item);
			challans.push(this.addTripChallan(item));
		});
	}

	resetTripChallanFormArray() {
		const challans = this.tripExpenseForm.controls['expenses'] as UntypedFormArray;
		challans.controls = [];
		challans.setValue([]);
		this.initialValues.tripChallanTax = [];
		this.tripChallansList = [];
	}

	tripChallansSelected(ele) {
		this.apiError = '';

		this.tripChallanModelInline = false;
		if (ele.length > 0) {
			this.tripChallanModelInline = true;
		}

		this.buildTripChallans(ele);
		this.onCalcuationsChanged();
	}




	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}


	getMaterials() {
		this._fleetOwnerClassService.getMaterialsList(materialList => {
			if (materialList && materialList.length > 0) {
				this.staticOptions.materialList = materialList;
			}
		})
	}


	onChangeOtherExpenseItem(index) {
		const otherExpenses = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		const otherExpense = otherExpenses.at(index);
		const itemId = otherExpense.get('item').value;
		if (itemId) {
			const expenseItem = getObjectFromList(itemId, this.staticOptions.materialList);
			if (expenseItem) {
				if (expenseItem.account) {
					otherExpense.get('expense_account').setValue(expenseItem.account.id);
					this.initialValues.expenseAccount[index] = { label: expenseItem.account.name, value: expenseItem.account.id }
				}
				else {
					otherExpense.get('expense_account').setValue(null);
					this.initialValues.expenseAccount[index] = getBlankOption();
				}

				if (expenseItem.tax) {
					otherExpense.get('tax').setValue(expenseItem.tax.id);
					this.initialValues.taxPercent[index] = { label: expenseItem.tax.label, value: expenseItem.tax.id }
				}

				if (expenseItem.unit) {
					otherExpense.get('unit').setValue(expenseItem.unit.id);
					this.initialValues.units[index] = { label: expenseItem.unit.label, value: expenseItem.unit.id }
				}
				else {
					otherExpense.get('unit').setValue(null);
					this.initialValues.units[index] = getBlankOption();
				}

				otherExpense.get('unit_cost').setValue(expenseItem.rate_per_unit);
			}
		}
	}



	buildForm() {
		this.tripExpenseForm = this._fb.group({
			id: [''],
			bill_date: [
				null, Validators.required
			],
			bill_number: [
				'', [Validators.required, Validators.pattern(this.policyNumber)]
			],
			vendor: [
				null, Validators.required
			],
			employee: [
				null
			],
			payment_term: [
				null
			],
			due_date: [
				null
			],
			discount_type: [
				0
			],
			place_of_supply: [''],
			discount: [
				0
			],
			tds_type: [
				null
			],
			tds: [
				0.0, [Validators.min(0), Validators.max(100)]
			],
			tds_amount: [
				0
			],
			adjustment_account: [
				null
			],
			adjustment_choice: [
				0
			],
			sub_total_without_tax: [0],
			adjustment: [
				0
			],
			is_transaction_includes_tax: [
				false
			],
			is_transaction_under_reverse: [
				false
			],
			discount_after_tax_type: [
				0
			],
			discount_after_tax: [
				0
			],
			expenses: this._fb.array([]),
			other_expenses: this._fb.array([]),
			payment_status: [
				1
			],
			amount_paid: [
				0
			],
			payment_mode: [
				null
			],
			paid_employee: [null],
			transaction_date: [
				null
			],
			bank_charges: [
				0
			],
			reminder: [
				null
			],
			comments: [
				''
			],
			documents: [
				[]
			],
		});
		if (!this.tripExpenseId) {
			this.addMoreOtherItem();
		}

		this.setFormValidators();
		return this.tripExpenseForm;
	}


	addMoreOtherItem() {
		const otherItems = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		this.initialValues.expenseAccount.push(getBlankOption());
		this.initialValues.item.push(getBlankOption());
		this.initialValues.taxPercent.push(getNonTaxableOption());
		this.initialValues.units.push(getBlankOption());
		otherItems.push(this.buildNewMaintainanceForm({}));
	}

	removeOtherItem(index) {
		const otherItems = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		this.initialValues.expenseAccount.splice(index, 1);
		this.initialValues.item.splice(index, 1);
		this.initialValues.units.splice(index, 1);
		this.initialValues.taxPercent.splice(index, 1);
		otherItems.removeAt(index);
		this.onCalcuationsChanged()

	}


	resetOtherItem(formGroup: UntypedFormGroup, index) {
		const singleUse = this.buildNewMaintainanceForm({})
		formGroup.patchValue(singleUse.value);
		this.initialValues.expenseAccount[index] = getBlankOption();
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.item[index] = getBlankOption();
		this.onCalcuationsChanged()
	}

	clearAllOtherItems() {
		const otherItems = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		this.emptyOtherItems();
		otherItems.reset();
		otherItems.controls = [];
		this.addMoreOtherItem();
		this.onCalcuationsChanged()
	}

	emptyOtherItems() {
		this.initialValues.units = [];
		this.initialValues.expenseAccount = [];
		this.initialValues.item = [];
		this.initialValues.taxPercent = [];
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




	stopLoaderClasstoBody() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.add('removeLoader');
	}
	onVendorSelected(e) {
		if (e === '') {
			this.vendorSelected = null;
			this.vendorId = null;
			return;
		}

		if (isValidValue(e)) {
			this.vendorId = e;
			this.resetTripChallanFormArray();
			this.clearAllOtherItems();
			this.challanModelInline = false;
			this._revenueService.sendPartyIntime(this.vendorId);
			this.tripChallanModelInline = false;
			this._partyService.getPartyAdressDetails(e).subscribe(res => {
				this.vendorSelected = res.result;
				this.isTdsDecleration = res.result.tax_details.tds_declaration;
				this.gstin = this.vendorSelected.tax_details.gstin;
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
				this.initialValues.paymentTerm = getBlankOption();
				this.patchChallans(e);

				this.tripExpenseForm.controls['payment_term'].setValue('');
				this.tripExpenseForm.controls['due_date'].setValue(null);
				if (this.vendorSelected ? this.vendorSelected.terms : null) {
					this.onpaymentTermSelected(this.vendorSelected.terms ? this.vendorSelected.terms.id : null);
					this.initialValues.paymentTerm = {
						label: this.vendorSelected.terms && this.vendorSelected.terms.label ? this.vendorSelected.terms.label : '',
						value: this.vendorSelected.terms ? this.vendorSelected.terms.id : null
					}
					this.tripExpenseForm.controls['payment_term'].setValue(
						this.vendorSelected.terms ? this.vendorSelected.terms.id : '');
				}
				else {
					this.initialValues.paymentTerm = cloneDeep(this.staticOptions.paymentTermList[0]);
					this.tripExpenseForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0].id);
					this.tripExpenseForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))
				}
			});
		}
		else {
			this.vendorSelected = null;
		}
	}

	removeSelectedIndex(index: number) {
		this.initialValues.units.splice(index, 1);
	}

	onItemSelected(event, itemExpenseControl: UntypedFormGroup, index: number) {
		if (event.target.value) {
			const itemSelected = getObjectFromList(event.target.value, this.staticOptions.materialList);
			itemExpenseControl.get('cost').setValue(itemSelected.rate_per_unit);
			itemExpenseControl.get('unit').setValue(itemSelected.unit.id);
			this.initialValues.units[index] = {
				label: itemSelected.unit.label,
				value: itemSelected.unit.id
			}
			return;
		}
		else {
			itemExpenseControl.get('cost').setValue(0);
			itemExpenseControl.get('unit').setValue(null);
			this.initialValues.units[index] = getBlankOption()
		}
	}

	resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({ unit: null, unit_cost: 0, total: 0, quantity: 0, expense_account: null });
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.expenseAccount[index] = getBlankOption();
	}

	onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
		this.resetOtherExpenseExceptItem(itemExpenseControl, index);
		this.onChangeOtherExpenseItem(index);
	}

	toggleItemOtherFilled(enable: Boolean = false) {
		const otherItems = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		otherItems.controls.forEach(ele => {
			if (enable) {
				ele.enable();
			} else {
				if (Number(ele.value.total) == 0 && !Number(ele.value.unit_cost) && !ele.value.item && !Number(ele.value.expense_account) && !Number(ele.value.quantity) && !ele.value.unit) {
					ele.disable();
				}
			}
		});
	}

	saveExpense() {
		this.toggleItemOtherFilled();
		this.$paymentStatusValid.next(this.isPaymentstatusValid);
		let form = this.tripExpenseForm;
		if (this.newMechanicTotals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}
		if (form.valid && this.isPaymentstatusValid) {
			this.apiError = '';
			this.tripExpenseForm.controls['payment_mode'].enable();
			if (this.tripExpenseId) {
				this.apiHandler.handleRequest(this._tripExpenseService.putTripExpense(this.tripExpenseId, this.prepareRequest(form)), 'Job Expense updated successfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.TRIPEXPENSEBILL)
							this._route.navigate([this.prefixUrl + '/trip/trip-expense/list'], { queryParams: { pdfViewId: this.tripExpenseId } })

						},
						error: () => {
							this.apiError = 'Failed to update Job Expense!';
							setTimeout(() => (this.apiError = ''), 3000);
						},
					}
				)
			}
			else {
				this.apiHandler.handleRequest(this._tripExpenseService.postTripExpense(this.prepareRequest(form)), 'Job Expense added successfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.TRIPEXPENSEBILL)
							this._route.navigateByUrl(this.prefixUrl + '/trip/trip-expense/list');

						},
						error: () => {
							this.apiError = 'Failed to add Job Expense!';
							setTimeout(() => (this.apiError = ''), 3000);
						},
					}
				)
			}
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.taxFormValid.next(form.valid);
			this.setFormGlobalErrors();
		}
		this.toggleItemOtherFilled(true);
	}

	prepareRequest(form: UntypedFormGroup) {
		form.patchValue({
			bill_date: changeDateToServerFormat(form.controls['bill_date'].value),
			transaction_date: changeDateToServerFormat(form.controls['transaction_date'].value),
			reminder: changeDateToServerFormat(form.controls['reminder'].value),
			due_date: changeDateToServerFormat(form.controls['due_date'].value)
		});
		return form.value;
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

	closeExpenseItemPopup() {
		this.showAddExpenseItemPopup = { name: '', status: false };
	}

	setFormValidators() {
		const item_other = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
			items.forEach((key, index) => {
				const item = item_other.at(index).get('item');
				const unit_cost = item_other.at(index).get('unit_cost');
				const unit = item_other.at(index).get('unit');
				const quantity = item_other.at(index).get('quantity');
				const expense_account = item_other.at(index).get('expense_account');

				item.setValidators(Validators.required);
				unit.setValidators(Validators.required);
				expense_account.setValidators(Validators.required);
				quantity.setValidators(Validators.min(0.01));
				unit_cost.setValidators(Validators.min(0.01));
				quantity.setValidators(Validators.min(0.01));
				if (items.length == 1) {
					if (!Number(unit_cost.value) && !item.value && !Number(expense_account.value) && !Number(quantity.value) && !unit.value) {
						item.clearValidators();
						expense_account.clearValidators();
						quantity.clearValidators();
						unit_cost.clearValidators();
						quantity.clearValidators();
						unit.clearValidators();
					}
				}
				item.updateValueAndValidity({ emitEvent: true });
				expense_account.updateValueAndValidity({ emitEvent: true });
				quantity.updateValueAndValidity({ emitEvent: true });
				unit_cost.updateValueAndValidity({ emitEvent: true });
				quantity.updateValueAndValidity({ emitEvent: true });
				unit.updateValueAndValidity({ emitEvent: true });
			});
		});

		let adjustmentAmount = this.tripExpenseForm.get('adjustment');
		this.adjustmentValidatorSub = adjustmentAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

			const adjustmentAmount = this.tripExpenseForm.get('adjustment');
			const adjustmentChoice = this.tripExpenseForm.get('adjustment_choice');
			const adjustmentAfterSubtotal = this.newMechanicTotals.adjustmentAmount;
			const totalAmount = this.newMechanicTotals.total;
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

		let discountBeforeAmount = this.tripExpenseForm.get('discount');
		this.discountSub = discountBeforeAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

			const adjustmentAmount = this.tripExpenseForm.get('discount');
			const adjustmentChoice = this.tripExpenseForm.get('discount_type');
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
		this.isTransactionIncludesTax =this.tripExpenseForm.get('is_transaction_includes_tax').value
		this.isTransactionUnderReverse = this.tripExpenseForm.get('is_transaction_under_reverse').value
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
			this.newMechanicTotals.taxes = result.result['tax'];
			this.tdsOptions = result.result['tds'];
			this.lastSectiondata.data = this.tdsOptions;
			this.lastSectionTaxDetails.next(this.lastSectiondata)
			this.companyRegistered = result.result['registration_status'];
		})
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
		this.patchChallansAndOtherItems(this.taxDetails);


	}

	patchChallansAndOtherItems(data) {
		this.resetTripChallanFormArray();
		if (data.expenses.length > 0) {
			this.tripChallanModelInline = true;
			this.buildTripChallans(data.expenses);
		} else {
			this.tripChallanModelInline = false;
		}
		setTimeout(() => {
			this.onCalcuationsChanged();
		}, 1000);
	}

	patchItemOthers() {
		if (this.mechanicActivityData.other_expenses.length > 0) {
			this.initialValues.expenseAccount = [];
			this.initialValues.item = [];
			this.initialValues.units = [];
			this.initialValues.taxPercent = [];
			this.mechanicActivityData.other_expenses.forEach((otherexpense, index) => {
				this.initialValues.expenseAccount.push(
					{ label: isValidValue(otherexpense.expense_account) ? otherexpense.expense_account.name : null }
				);
				this.initialValues.item.push(
					{ label: isValidValue(otherexpense.item) ? otherexpense.item.name : null }
				);
				this.initialValues.units.push(
					{ label: isValidValue(otherexpense.unit) ? otherexpense.unit.label : null }
				);
				this.initialValues.taxPercent.push(
					{ label: isValidValue(otherexpense.tax) ? otherexpense.tax.label : null }
				);
				otherexpense.item = isValidValue(otherexpense.item) ? otherexpense.item.id : null;
				otherexpense.tax = isValidValue(otherexpense.tax) ? otherexpense.tax.id : null;
				otherexpense.unit = isValidValue(otherexpense.unit) ? otherexpense.unit.id : null;
				otherexpense.expense_account = isValidValue(otherexpense.expense_account) ? otherexpense.expense_account.id : null;
			});
			this.buildNewItemExpenses(this.mechanicActivityData.other_expenses);
		} else {
			this.addMoreOtherItem();
		}
	}
	patchChallans(e) {
		if (this.tripId) {
			this._revenueService.getFLTripChallanListByParty(e).subscribe((response) => {
				let selectedTripChallan = [];
				let tripChallanList = [];
				tripChallanList = response['result'];
				if (tripChallanList.length > 0) {
					tripChallanList.forEach(item => {
						if (item.trip == this.tripId) {
							selectedTripChallan.push(item);
						}
					});
					this.tripChallansSelected(selectedTripChallan);

				}
			});
		}
	}


	onCalcuationsChanged() {
		let otherItems = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		let tripExpenses = this.tripExpenseForm.controls['expenses'] as UntypedFormArray;
		this.newMechanicTotals.subtotal_challan = 0;
		this.newMechanicTotals.subtotal_others = 0;
		this.newMechanicTotals.subtotal = 0;
		this.newMechanicTotals.total = 0;
		this.newMechanicTotals.taxTotal = 0;
		this.newMechanicTotals.taxes.forEach((tax) => {
			tax.total = 0;
			tax.taxAmount = 0;
			tripExpenses.controls.forEach((challan, index) => {
				if (challan.get('tax').value == tax.id) {
					let amountWithoutTax = Number(challan.value.expense_amount_before_tax) + Number(challan.get('adjustment').value);
					let rate = amountWithoutTax;
					let amountWithTax;
					challan.get('amount').setValue(challan.value.expense_amount_before_tax);
					if (isValidValue(amountWithoutTax)) {
						if (this.isTransactionIncludesTax) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
							tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
							amountWithTax = rate.toFixed(3);
						}
						else {
							tax.total = (Number(tax.total) + Number(amountWithoutTax)).toFixed(3);
							tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * Number(amountWithoutTax))).toFixed(3);
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						challan.get('expense_amount').setValue(amountWithTax);
						challan.get('total').setValue(amountWithTax);
						this.newMechanicTotals.subtotal_challan += (Number(this.newMechanicTotals.subtotal_challan) + Number(amountWithoutTax)).toFixed(3);
						this.newMechanicTotals.subtotal = (Number(this.newMechanicTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
						this.newMechanicTotals.total = (Number(this.newMechanicTotals.total) + Number(amountWithTax)).toFixed(3);
					}
				}
			});

			otherItems.controls.forEach((others) => {
				let amountWithoutTax = Number(others.get('total_before_tax').value);
				let rate = amountWithoutTax;
				let amountWithTax;
				if (others.get('tax').value == tax.id) {
					if (isValidValue(amountWithoutTax)) {
						if (this.isTransactionIncludesTax) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
							tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
							amountWithTax = rate.toFixed(3);
						}
						else {
							tax.total = (Number(tax.total) + Number(amountWithoutTax)).toFixed(3);
							tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
							amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
						}
						others.get('total').setValue(Number(amountWithTax));
						this.newMechanicTotals.subtotal_others = (Number(this.newMechanicTotals.subtotal_others) +
							Number(amountWithoutTax)).toFixed(3);
						this.newMechanicTotals.subtotal = (Number(this.newMechanicTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
						this.newMechanicTotals.total = (Number(this.newMechanicTotals.total) + Number(amountWithTax)).toFixed(3);
					}
				}
			});
			this.newMechanicTotals.taxTotal = (Number(this.newMechanicTotals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
		});
		this.calculateTotals();
	}
	calculateTotals() {
		const form = this.tripExpenseForm;
		const discountAmount = form.get('discount').value;
		const discountAfterTaxAmount = form.get('discount_after_tax').value;
		const adjustmentAmount = form.get('adjustment').value;
		const tds = Number(form.get('tds').value);

		if (isValidValue(discountAmount)) {
			this.newMechanicTotals.discountTotal =
				form.get('discount_type').value == 0
					? (discountAmount / 100 * this.newMechanicTotals.subtotal).toFixed(3)
					: discountAmount;
		} else {
			this.newMechanicTotals.discountTotal = 0.000;
		}
		this.tripExpenseForm.controls.sub_total_without_tax.setValue(this.newMechanicTotals.subtotal);
		if (isValidValue(discountAfterTaxAmount)) {
			this.newMechanicTotals.discountAfterTaxTotal =
				form.get('discount_after_tax_type').value == 0
					? (Number(discountAfterTaxAmount) /
						100 *
						(Number(this.newMechanicTotals.total) -
							Number(this.newMechanicTotals.discountTotal))).toFixed(3)
					: discountAfterTaxAmount;
		} else {
			this.newMechanicTotals.discountAfterTaxTotal = 0.000;
		}

		if (isValidValue(adjustmentAmount)) {
			this.newMechanicTotals.adjustmentAmount =
				form.get('adjustment_choice').value == 0
					? ((Number(this.newMechanicTotals.subtotal) -
						Number(this.newMechanicTotals.discountTotal) +
						Number(this.newMechanicTotals.taxTotal) -
						Number(this.newMechanicTotals.discountAfterTaxTotal)) *
						Number(adjustmentAmount) /
						100).toFixed(3)
					: adjustmentAmount;
		}

		this.newMechanicTotals.total = (this.newMechanicTotals.total -
			Number(this.newMechanicTotals.discountTotal) -
			Number(this.newMechanicTotals.discountAfterTaxTotal) +
			Number(this.newMechanicTotals.adjustmentAmount)).toFixed(3);

		const deductTdsAmount = Number(this.newMechanicTotals.subtotal) - Number(this.newMechanicTotals.discountTotal);
		this.newMechanicTotals.tdsAmount = (deductTdsAmount * tds / 100).toFixed(3);
		this.newMechanicTotals.balance = (Number(this.newMechanicTotals.total) - Number(this.newMechanicTotals.advanceAmount) -
			Number(this.newMechanicTotals.tdsAmount)).toFixed(3);
	}

	calculateItemOther(index) {
		const otherItems = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		let fuel_quantity = otherItems.at(index).get('quantity');
		let rate = otherItems.at(index).get('unit_cost');
		let amount = otherItems.at(index).get('total_before_tax').value;

		if (amount == 0) {
			rate.setValue(0.000)
			fuel_quantity.setValue(0.000);
		}
		if (rate.value == 0 && fuel_quantity.value == 0) {
		} else
			if (fuel_quantity.value == 0 && rate.value != 0) {
				const setFuelQuantity = (amount / rate.value).toFixed(3);
				fuel_quantity.setValue(setFuelQuantity);
			} else {
				const setRate = (amount / fuel_quantity.value).toFixed(3);
				rate.setValue(setRate);
			}
		this.onCalcuationsChanged();
	}

	calculateItemOthersAmount(index) {
		const otherItems = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		let quantity = otherItems.at(index).get('quantity').value;
		let unit_cost = otherItems.at(index).get('unit_cost').value;
		let setamount = otherItems.at(index).get('total_before_tax');
		const amount = (quantity * unit_cost).toFixed(3);
		setamount.setValue(amount);
		this.onCalcuationsChanged();
	}


	dueDateChange() {
		let customObj = this.staticOptions.paymentTermList.filter(item => item.label == 'Custom')[0];
		this.initialValues.paymentTerm = { label: customObj['label'], value: '' };
		this.tripExpenseForm.controls['payment_term'].setValue(customObj['id'])
	}

	setAllTaxAsNonTaxable() {
		this.initialValues.tripChallanTax.fill(getNonTaxableOption());
		this.initialValues.taxPercent.fill(getNonTaxableOption());
		const challans = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
		challans.controls.forEach((controls) => {
			controls.get('tax').setValue(this.defaultTax);
		});
		const tripChallan = this.tripExpenseForm.controls['expenses'] as UntypedFormArray;
		tripChallan.controls.forEach((controls) => {
			controls.get('tax').setValue(this.defaultTax);
		});
		this.tripExpenseForm.get('discount_after_tax').setValue(0);
	}

	lastSectionOutPut(data) {
		const form = this.tripExpenseForm;
		form.get('tds_type').setValue(data['tds_type']);
		form.get('tds').setValue(data['tds']);
		this.onCalcuationsChanged();
	}
	paymentStatusData(data: { data: any, valid: boolean }) {
		this.tripExpenseForm.patchValue({
			amount_paid: data.data.amount_paid,
			bank_charges: data.data.bank_charges,
			payment_mode: data.data.payment_mode,
			payment_status: data.data.payment_status,
			paid_employee: data.data.paid_employee,
			transaction_date: changeDateToServerFormat(data.data.transaction_date)
		})
		this.isPaymentstatusValid = data.valid;
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
				this.expenseItemDropdownIndex = i
				this._revenueService.getExpense().subscribe((response) => {
					if (response && response.result && response.result.length > 0) {
						this.staticOptions.materialList = response.result;
						if (this.expenseItemDropdownIndex != -1) {
							this.initialValues.item[this.expenseItemDropdownIndex] = { value: item.name.id, label: item.name.name };
							let other_expense = this.tripExpenseForm.controls['other_expenses'] as UntypedFormArray;
							other_expense.at(this.expenseItemDropdownIndex).get('item').setValue(item.name.id);

							let itemExpenseControl = other_expense.at(this.expenseItemDropdownIndex) as UntypedFormGroup;
							this.resetOtherExpenseExceptItem(itemExpenseControl, this.expenseItemDropdownIndex);
							this.onChangeOtherExpenseItem(this.expenseItemDropdownIndex);
							this.expenseItemDropdownIndex = -1;
						}
					}
				});
			}

			dialogRefSub.unsubscribe();
		})
	}
}
