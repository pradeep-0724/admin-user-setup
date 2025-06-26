import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormArray, UntypedFormGroup, AbstractControl, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import moment from 'moment';
import { Subscription, BehaviorSubject } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { ErrorList } from 'src/app/core/constants/error-list';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getSetViewDetails } from 'src/app/core/services/getsetviewdetails.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { NewTripService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { PerformaInvoiceClass } from '../performa-invoice-class/performa-invoice.class';
import {  getBlankOption, getNonTaxableOption, getObjectFromList, getObjectFromListByKey, isValidValue, roundOffAmount } from 'src/app/shared-module/utilities/helper-utils';
import { cloneDeep } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { PaymentDueDateCalculator, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { PerformaInvoiceServiceService } from '../../../../api-services/revenue-module-service/performa-invoice-service/performa-invoice-service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


@Component({
	selector: 'app-performa-invoice',
	templateUrl: './performa-invoice.component.html',
	styleUrls: ['./performa-invoice.component.scss'],
	host: {
		"(window:click)": "clickOutToHide($event)"
	}
})
export class PerformaInvoiceComponent extends PerformaInvoiceClass implements OnInit, OnDestroy, AfterViewInit {
	videoUrl = "https://ts-pub-directory.s3.ap-south-1.amazonaws.com/New+Invoice.mp4";
	terminology: any;
	ItemDropdownIndex: number = -1;
	showGstinModal: Boolean = false;
	apiError: string;
	addInvoiceForm;
	partyList = [];
	treatmentList: any = [];
	placeOfSupplyList: any = [];
	bankList: any = [];
	employeeList: any = [];
	paymentTermList: any = [];
	partyId: string
	selectedParty: any;
	saveButton: boolean = false;
	additionalDetails: any;
	PlaceOfSupplyStateList: any;
	tripChallansList: any = [];
	staticOptions: any = {};
	isAdd: boolean = true;
	isTripAdd: boolean = true;
	gstin: '';
	totals: any = {
		subtotal_challan: 0.00,
		subtotal_others: 0.00,
		subtotal: 0.00,
		advance_amount: 0.00,
		adjustment: 0.00,
		total: 0.00,
		roundOffAmount: 0.00,
		taxes: [],
		advanceTotal: 0,
		fuelTotal: 0,
		battaAdvance: 0,
		invoiceBalance: 0,
		allAdvanceTotal: 0
	};
	inv_date: any = new Date(dateWithTimeZone());
	selectedPaymentTerm: any;
	unregisteredGst = new ValidationConstants().unregisteredGst;
	pattern = new ValidationConstants();
	materialApiCall: string = TSAPIRoutes.get_and_post_material;
	disclaimerApiCall: string = TSAPIRoutes.revenue + TSAPIRoutes.disclaimer;
	materialParams = {
		name: '',
		unit: null,
		rate_per_unit: 0.00,
	};
	initialValues: any = {
		gstTreatment: {},
		placeOfSupply: {},
		digitalSignature: {},
		paymentTerm: {},
		adjustmentAccount: getBlankOption(),
		items: [getBlankOption()],
		units: [getBlankOption()],
		disclaimer: {},
		contactperson: {},
		party: {},
		employee: {},
		challan_tax: [getNonTaxableOption()],
		tripChallanTax: [getNonTaxableOption()],
		bank_account: {},
		tax: [getNonTaxableOption()],
	};
	showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
	alphaNumericPattern = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
	showAddItemPopup: any = { name: '', status: false };
	showAddDisclaimerPopup: any = { name: '', status: false };
	companyRegistered: boolean = true;
	expenseAccountList: any = [];
	afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	errorHeaderMessage = new ErrorList().headerMessage;
	otherExpenseValidatorSub: Subscription;
	adjustmentValidatorSub: Subscription;
	disclaimerList: any = [];
	disclaimerParams: any = {};
	isTPEmpty: boolean = false;
	currency_type;
	isDueDateRequired = false;
	invoiceId = 'null';
	PartyAddress: any;
	existingChallanIds: any = [];
	existingTripChallanIds: any = [];
	patchFileUrls = new BehaviorSubject([]);
	invoiceDetails: any;
	finalAdjustment: any;
	isAmountUsed: boolean;
	isDomReady: boolean;
	partyDetailsData = {
		taxDeatils: {},
		placeOfSupply: [],
	};
	placeOfSupply = [];
	isTransactionIncludesTax = false;
	isTransactionUnderReverse = false;
	partyTaxDetails = new BehaviorSubject<any>(this.partyDetailsData);
	taxOptions = [];
	disableTax: boolean = false;
	itemChallanCommonTax: any = getNonTaxableOption();
	tripChallanCommonTax: any = getNonTaxableOption();
	defaultTax = new ValidationConstants().defaultTax;
	tripChallanModelInline: boolean = false
	editData = new BehaviorSubject<any>({
		place_of_supply: ''
	});
	isTaxFormValid: boolean = true;
	taxFormValid = new BehaviorSubject<any>(true);
	isTax: boolean = false;
	preFixUrl = '';
	disableTripTax: boolean = false;
	showFreightPopup = {
		type: '',
		show: false,
		data: {},
		extras: { id: '' }
	}
	showChargesPopup = {
		type: '',
		show: false,
		data: {},
		extras: { id: '' }
	}

	showAdvancePopup = {
		type: '',
		show: false,
		data: {},
		extras: { id: '' }
	}
	tripId = '';
	isWorkOrderAvailable = false;
	contactPersonList = [];
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	digitalSignature = [];
	doChallanExists: boolean = false;
	doTripChallanExists: boolean = false;
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/bVgXIdtWl5pGxp8vtSkf?embed%22"
	}
	paymentTermCustom=new ValidationConstants().paymentTermCustom;
	isAddExpense=false;
	constructor(
		private _terminologiesService: TerminologiesService,
		private _fb: UntypedFormBuilder,
		private _commonService: CommonService,
		private _partyService: PartyService,
		private _employeeService: EmployeeService,
		private _revenueService: RevenueService,
		private _performainvoiceService: PerformaInvoiceServiceService,
		private _router: Router,
		private currency: CurrencyService,
		private _activatedRoute: ActivatedRoute,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _preFixUrl: PrefixUrlService,
		private _tripService: NewTripService,
		private _viewDetailsService: getSetViewDetails,
		private _analytics: AnalyticsService,
		private _newTripV2Service: NewTripV2Service,
		private _scrollToTop: ScrollToTop,
	) {
		super();
		this.getTaxDetails();
	}

	ngOnDestroy() {
		this.otherExpenseValidatorSub.unsubscribe();
		this.adjustmentValidatorSub.unsubscribe();
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('removeLoader');
	}
	clickOutToHide(e) {

		if (!e.target.className.includes('saveButton')) {
			this.saveButton = false;
		}
	}
	ngOnInit() {
		this.terminology = this._terminologiesService.terminologie;
		this.preFixUrl = this._preFixUrl.getprefixUrl();
		this.buildForm();
		this.addInvoiceForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))
		this.currency_type = this.currency.getCurrency();
		this._commonService
			.getStaticOptions('gst-treatment,tax,item-unit,payment-term')
			.subscribe((response) => {
				this.treatmentList = response.result['gst-treatment'];
				this.paymentTermList = response.result['payment-term'];
				this.initialValues.paymentTerm = this.paymentTermList[0];
				this.staticOptions.itemUnits = response.result['item-unit'];
				this.addInvoiceForm.get('payment_term').setValue(this.paymentTermList[0].id)
			});
		this.getDigitalSignatureList();
		this.getPartyDetails();
		this._employeeService.getEmployeeList().subscribe((employeeList) => {
			this.employeeList = employeeList;
		});

		this._revenueService.getMaterials().subscribe((response) => {
			if (response !== undefined) {
				this.staticOptions.materialList = response.result;
			}
		});
		this._commonService.getBankDropDownList().subscribe((stateData) => {
			if (stateData !== undefined) {
				this.bankList = stateData.result;
			}
		});
		this._activatedRoute.params.subscribe((pramas) => {
			if (pramas['performa_invoice_id']) {				
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PERFORMAINVOICE, this.screenType.EDIT, "Navigated");
				this.invoiceId = pramas.performa_invoice_id;
				this.getFormValues();
			} else {
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PERFORMAINVOICE, this.screenType.ADD, "Navigated");
				this._commonService.getSuggestedIds('performainvoice').subscribe((response) => {					
					this.addInvoiceForm.controls['invoice_number'].setValue(response.result['performainvoice']);
				});
			}
		})
		this.getExpenseAccountsAndSetAccount();
		this.getDisclaimerOptions();
		this.addInvoiceForm.controls['invoice_date'].setValue(new Date(dateWithTimeZone()));

	}

	openGothrough() {
		this.goThroughDetais.show = true;
	}

	ngAfterViewInit(): void {
		this._activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('customerId') && paramMap.has('tripId')) {
				let customer = paramMap.get('customerId');
				this.tripId = paramMap.get('tripId')
				this.initialValues.party = { label: paramMap.get('customerName') };
				this.addInvoiceForm.controls['party'].setValue(customer);
				setTimeout(() => {
					this.onPartySelected(customer)
				}, 1000);

			}
		});
	}

	backToTrip() {
		this._viewDetailsService.viewInfo = {
			id: this.tripId,
			screen: "",
			sub_screen: ""
		};
		this._router.navigateByUrl(this.preFixUrl + '/income/invoice/list');
	}

	getDisclaimerOptions() {
		this._revenueService.getDisclaimerOptions().subscribe((response) => {
			this.disclaimerList = response.result;
		});
	}

	getExpenseAccountsAndSetAccount() {
		this._revenueService.getAccounts('Expense,Other Expense,Cost of Services / COGS').subscribe((response) => {
			const adjustAcc = this.addInvoiceForm.get('adjustment_account').value;
			this.expenseAccountList = response.result;
			if (!adjustAcc) {
				this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
				this.addInvoiceForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
			}
		});
	}

	buildForm() {
		this.addInvoiceForm = this._fb.group({
			party: [
				'',
				Validators.required
			],
			employee: [
				''
			],
			reference_no: ['', [Validators.pattern(this.pattern.VALIDATION_PATTERN.ALPHA_NUMERIC2)]],
			contact_person: [null],
			invoice_number: [
				'',
				Validators.required
			],
			invoice_date: [
				'',
				Validators.required
			],
			due_date: [
				null
			],
			payment_term: [
				null
			],
			bank_account: [
				null,
			],
			adjustment_account: [
				null
			],
			adjustment_amount: [
				0.00
			],
			adjustment_choice: [
				0
			],
			is_roundoff: [
				true
			],
			disclaimer: [
				null
			],
			optional_comments: [
				''
			],
			is_transaction_under_reverse: [
				false
			],
			is_transaction_includes_tax: [
				false
			],
			place_of_supply: [''],
			signature: [''],
			documents: [[]],
			deleted_challans: this._fb.array([]),
			deleted_trip_challans: this._fb.array([]),
			trip_challan: this._fb.array([]),
			item_others: this._fb.array([]),
			address: this._fb.array([
				this._fb.group({
					address_line_1: [
						''
					],
					address_type: [
						''
					],
					address_type_index: 0,
					country: [''],
					document: [],
					pincode: [
						null,
						[TransportValidator.pinCodeValidator, Validators.maxLength(70)]],
					state: [
						''
					],
					street: [
						''
					]
				}),
				this._fb.group({
					address_line_1: [
						''
					],
					address_type: [
						''
					],
					address_type_index: 1,
					country: [''],
					document: [],
					pincode: [null, [TransportValidator.pinCodeValidator, Validators.maxLength(70)]],
					state: [
						''
					],
					street: [
						''
					]
				})
			])
		});
		this.buildOtherItems([
			{}
		]);

		this.setOtherValidators();
		this.setAdusjtmentAmountValidator();
	}

	fileUploader(filesUploaded) {
		let documents = this.addInvoiceForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}

	fileDeleted(deletedFileIndex) {
		let documents = this.addInvoiceForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}


	buildTripChallans(items: any = []) {
		const challans = this.addInvoiceForm.controls['trip_challan'] as UntypedFormArray;
		const existingchallan = challans.value;
		challans.controls = [];
		challans.setValue([]);
		this.tripChallansList = [];

		items.forEach((item) => {
			let arritem = getObjectFromListByKey('trip', item.trip, existingchallan);
			this.initialValues.tripChallanTax.push(this.tripChallanCommonTax);
			if (arritem) {
				item.adjustment = arritem.adjustment;
			}
			challans.push(this.addInvoiceTripChallan(item));
			this.tripChallansList.push(item);
			this.tripChallansList.forEach(item => {
				if (item.work_order_no) {
					this.isWorkOrderAvailable = true;
				}
			});
		});
	}



	buildOtherItems(items: any = []) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		items.forEach((i, item) => {
			otherItems.push(this.addOtherItem(item));
			if (i > 0)
				this.initialValues.units.push({ label: '', value: null });
		});
	}

	resetOtherExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({
			units: null, unit_cost: 0.000, discount: 0.000, total_amount: 0.000,
			quantity: 0.000, amount: 0.000
		});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.tax[index] = getNonTaxableOption();
	}

	resetOther(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({
			units: null, unit_cost: 0.000, discount: 0.000, total_amount: 0.000,
			quantity: 0.000, amount: 0.000, item: null
		});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.items[index] = getBlankOption();
		this.initialValues.tax[index] = getNonTaxableOption();
		this.calculationsChanged();
	}
	
	onMaterialSelected(event, itemExpenseControl: UntypedFormGroup, index: number) {
		this.resetOtherExceptItem(itemExpenseControl, index);
		if (event.target.value) {
			const itemSelected = getObjectFromList(event.target.value, this.staticOptions.materialList);
			itemExpenseControl.get('unit_cost').setValue(itemSelected.rate_per_unit);
			itemExpenseControl.get('units').setValue(itemSelected.unit ? itemSelected.unit.id : null);
			if (itemSelected.unit) {
				this.initialValues.units[index] = { label: itemSelected.unit.label, value: itemSelected.unit.id }
			}
		}
		this.calculationsChanged();
	}

	addInvoiceChallan(item) {
		return this._fb.group({
			id: [
				item.id || ''
			],
			created_at: [
				item.created_at || ''
			],
			challan_no: [
				item.challan_no || ''
			],
			material: [
				item.material || ''
			],
			final_weight: [
				item.final_weight || 0.000
			],
			rate_per_unit: [
				item.rate_per_unit || 0.00
			],
			net_receiveable_amount: [
				item.net_receiveable_amount || 0.00
			],
			challan: [
				item.id || ''
			],
			adjustment: [
				item.adjustment || 0.00
			],
			total_amount: [
				0.00
			],
			narration: [
				item.narration || ''
			],
			additionalDetails: [
				false
			],
			transporter_permit_no: [
				item.transporter_permit_no || ""
			],
			tax: [item.tax || this.defaultTax]
		});
	}

	addInvoiceTripChallan(item) {
		return this._fb.group({
			id: [
				item.id || null
			],
			work_order_no: [item.work_order_no || ''],
			date: [
				item.date || null
			],
			vehicle: [
				item.vehicle || null
			],
			lr_no: [
				item.lr_no || ''
			],
			dn_date: [
				item.dn_date || null
			],
			freights: [
				item.freights || 0.00
			],
			charges: [
				item.charges || 0.00
			],
			advance: [item.advance || 0.00],
			balance: [item.balance || 0.00],
			deductions: [
				item.deductions || 0.00
			],
			trip: [
				item.trip, [Validators.required]
			],
			adjustment: [
				item.adjustment || 0.00
			],
			total_amount: [
				0.00
			],
			tax: [item.tax || this.defaultTax]
		});
	}

	addOtherItem(item) {
		const form = this._fb.group({
			id: [
				''
			],
			item: [
				item.item || null,
			],
			quantity: [
				item.quantity || 0
			],
			units: [
				item.units || null
			],
			unit_cost: [
				item.unit_cost || 0.00
			],
			amount: [
				item.amount || 0.00
			],
			tax: [item.tax || this.defaultTax],
			discount: [
				item.discount || 0.00
			],
			total_amount: [
				item.total_amount || 0.00
			]
		});
		return form;
	}



	removeOtherItem(index) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		this.initialValues.items.splice(index, 1);
		this.initialValues.units.splice(index, 1);
		this.initialValues.tax.splice(index, 1);
		otherItems.removeAt(index);
		this.calculationsChanged();
	}

	addMoreOtherItem() {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		this.initialValues.items.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
		this.initialValues.tax.push(getNonTaxableOption());
		otherItems.push(this.addOtherItem({}));
	}

	emptyOtherItems() {
		this.initialValues.items = [];
		this.initialValues.units = [];
	}


	clearAllOtherItems() {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		otherItems.reset();
		otherItems.controls = [];
		this.emptyOtherItems();
		this.addMoreOtherItem();
		this.calculationsChanged();
	}

	checkTripChallanExist(value) {
		this.doTripChallanExists = value
	}

	checkChallanExist(value) {
		this.doChallanExists = value
	}

	onPartySelected(ele) {
		this.apiError = '';
		if (ele === '') {
			this.selectedParty = null;
			this.partyId = null;
			return;
		}

		this.initialValues.paymentTerm = {};
		const x = ele;
		this.getContactPersonList(x)
		this._partyService.getPartyAdressDetails(x).subscribe((response) => {
			this.selectedParty = response.result;
			this.gstin = response.result.tax_details.gstin;
			this.partyId = x;
			this.partyDetailsData = {
				taxDeatils: this.selectedParty.tax_details,
				placeOfSupply: this.placeOfSupply
			}
			this.partyTaxDetails.next(this.partyDetailsData)
			this.addInvoiceForm.controls['address'].patchValue(this.selectedParty.address);
			this.tripChallanModelInline = false;
			this._revenueService.sendPartyIntime(this.partyId);
			if (this.tripId) {
				this._revenueService.getTripChallanListByParty(x).subscribe((response) => {
					let selectedTripChallan = [];
					let tripChallanList = [];
					tripChallanList = response['result'];
					if (tripChallanList.length > 0) {
						tripChallanList.forEach(item => {
							if (item.trip == this.tripId) {
								selectedTripChallan.push(item)
							}
						})
						this.getTripDetails(this.tripId);
						this.tripChallansSelected(selectedTripChallan);
					}
				});
			}
			this.addInvoiceForm.controls['payment_term'].setValue('');
			this.addInvoiceForm.controls['due_date'].setValue('');
			if (this.selectedParty.balance_billing.terms?.id) {
				this.onpaymentTermSelected(this.selectedParty.balance_billing.terms ? this.selectedParty.balance_billing.terms.id : '');
				this.addInvoiceForm.controls['payment_term'].setValue(
					this.selectedParty.balance_billing.terms.id);
				this.initialValues.paymentTerm['label'] = this.selectedParty.balance_billing.terms.label;
			}
			else {
				this.initialValues.paymentTerm['value'] = this.paymentTermList[0].value;
				this.initialValues.paymentTerm['label'] = 'Immediate';
				this.addInvoiceForm.get('payment_term').setValue(this.paymentTermList[0].id)
				this.addInvoiceForm.get('due_date').setValue(moment().format('YYYY-MM-DD'));
			}
		});
		const tripChallans = this.addInvoiceForm.controls['trip_challan'] as UntypedFormArray;
		tripChallans.controls = [];
		tripChallans.setValue([]);
		this.tripChallansList = [];
		this.clearAllOtherItems();
		this.calculationsChanged();
		this.getdefaultBank(ele);
	}
	getdefaultBank(id){
		let params={
			is_account :'False',
            is_tenant :'False',
			remove_cash_account:'True'
		  }
		this._revenueService.getDefaultBank(id,params).subscribe((data)=>{						
			this.initialValues.bank_account=getBlankOption();
			if(data['result']){
				this.addInvoiceForm.get('bank_account').setValue(data['result'].id);
				this.initialValues.bank_account['label']=data['result'].name;
			}
		})
	}

	onpaymentTermSelected(termId) {
		if (termId) {
			this.selectedPaymentTerm = getObjectFromList(termId, this.paymentTermList);
			if(termId==this.paymentTermCustom){
				this.addInvoiceForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.inv_date, this.selectedParty['terms_days']));
			}else{
				this.addInvoiceForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.inv_date, this.selectedPaymentTerm ? this.selectedPaymentTerm.value : ''));
			}
		
		}

		if (termId) {
			this.addInvoiceForm.controls['due_date'].setValidators([Validators.required]);
			this.addInvoiceForm.controls['due_date'].updateValueAndValidity();
			this.isDueDateRequired = true;
		} else {
			this.isDueDateRequired = false;
			this.addInvoiceForm.controls['due_date'].setValidators(null);
			this.addInvoiceForm.controls['due_date'].updateValueAndValidity();
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
			this.getPartyDetails();
			this.initialValues.party = { value: $event.id, label: $event.label };
			this.addInvoiceForm.get('party').setValue($event.id);
			this.onPartySelected($event.id)
		}
	}

	/* After closing the party modal to clear all the values */
	closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}

	/* For getting all the party Details */
	getPartyDetails() {
		let ClientPramas = '0'; // Client
		this._partyService.getPartyList('', ClientPramas).subscribe((response) => {
			this.partyList = response.result;
		});
	}


	onDateSelection() {
		this.inv_date = this.addInvoiceForm.controls['invoice_date'].value;
		let existingTerm = this.addInvoiceForm.controls['payment_term'].value;
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}

	getItemById(id: String, list: []): any {
		return list.filter((item: any) => item.id === id)[0];
	}

	
	tripChallansSelected(ele) {
		this.apiError = '';

		this.tripChallanModelInline = false;
		if (ele.length > 0) {
			this.totals.advanceTotal = 0;
			this.totals.fuelTotal = 0;
			this.totals.battaAdvance = 0;
			ele.forEach(element => {
				this.getTripDetails(element.trip)
			});
			this.tripChallanModelInline = true;
		}

		this.buildTripChallans(ele);
		this.calculationsChanged();
		
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

	patchValue() {
		const tripChallans = this.addInvoiceForm.controls['trip_challan'] as UntypedFormArray;
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		const deletedChallans = this.addInvoiceForm.get('deleted_challans');
		this.existingChallanIds.forEach((ele) => {
			deletedChallans.push(this._fb.control(ele));
		});

		tripChallans.controls.forEach((data) => {
			data.get('adjustment').value ? data.get('adjustment').value : data.get('adjustment').setValue(0);
			const index = this.existingTripChallanIds.indexOf(data.get('id').value, 0);
			if (index > -1) {
				this.existingTripChallanIds.splice(index, 1);
			}
		});
		const deletedTripChallans = this.addInvoiceForm.get('deleted_trip_challans');
		this.existingTripChallanIds.forEach((ele) => {
			deletedTripChallans.push(this._fb.control(ele));
		});

		otherItems.controls.forEach((data) => {
			data.get('total_amount').value ? data.get('total_amount').value : data.get('total_amount').setValue(0.000);
			data.get('unit_cost').value ? data.get('unit_cost').value : data.get('unit_cost').setValue(0.000);
			data.get('discount').value ? data.get('discount').value : data.get('discount').setValue(0.000);
			data.get('amount').value ? data.get('amount').value : data.get('amount').setValue(0.000);
			data.get('quantity').value ? data.get('quantity').value : data.get('quantity').setValue(0.000);
			data.get('units').value ? data.get('units').value : data.get('units').setValue(null);

		});
		(this.addInvoiceForm.controls['address'] as UntypedFormArray).controls[0].get('address_type').setValue(0);
		(this.addInvoiceForm.controls['address'] as UntypedFormArray).controls[1].get('address_type').setValue(1);
		this.addInvoiceForm.controls['payment_term'].value ? this.addInvoiceForm.controls['payment_term'].value : this.addInvoiceForm.controls['payment_term'].setValue(null);
		this.addInvoiceForm.controls['due_date'].value ? changeDateToServerFormat(this.addInvoiceForm.controls['due_date'].value) : this.addInvoiceForm.controls['due_date'].setValue(null);
	}

	// toggleItemOtherFilled(enable: Boolean = false) {
	// 	const otherItems = this.addInvoiceForm.controls['item_others'] as FormArray;
	// 	if (otherItems.length == 1){
	// 		if (enable) {
	// 			otherItems.enable();
	// 		} else {
	// 			otherItems.controls.forEach(ele => {
	// 			if (ele.value.item == null && ele.value.quantity == 0  && ele.value.units == null
	// 			    && ele.value.unit_cost == 0 && ele.value.discount == 0) {
	// 				this.setOtherValidators(true);
	// 				ele.disable();
	// 			} else {
	// 				this.setOtherValidators();
	// 			}
	// 		  });
	// 		}
	// 	} else {
	// 		this.setOtherValidators();
	// 	}
	//   }

	toggleItemOtherFilled(enable: Boolean = false) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		otherItems.controls.forEach(ele => {
			if (enable) {
				ele.enable();
			} else {
				if (ele.value.item == null && ele.value.quantity == 0 && ele.value.units == null
					&& ele.value.unit_cost == 0 && ele.value.discount == 0) {
					ele.disable();
				}
			}
		});
	}



	submitInvoiceForm() {
		this.toggleItemOtherFilled();
		const form = this.addInvoiceForm;
		this.patchValue();
		this.apiError = '';
		if (this.totals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}
		if (form.valid && this.isTaxFormValid) {
			this.apiError = '';
			if (this.invoiceId == 'null') {
				this._performainvoiceService.saveInvoice(this.buildRequest(form)).subscribe((response) => {
					this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.PERFORMAINVOICE)
					this._router.navigateByUrl(this.preFixUrl + '/income/performa-invoice/list');
				}, (err) => {
					this.apiError = '';
					if (err.error.status == 'error') {
						this.apiError = err.error.message;
						this._scrollToTop.scrollToTop()
					}
				});
			} else {
				this._performainvoiceService.editInvoiceNote(this.buildRequest(form), this.invoiceId).subscribe((response) => {
					this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.PERFORMAINVOICE)
					this._router.navigate([this.preFixUrl + '/income/performa-invoice/list'],  { queryParams: { pdfViewId:this.invoiceId } });
				}, (err) => {
					this.apiError = '';
					if (err.error.status == 'error') {
						this.toggleItemOtherFilled(true);
						this.apiError = err.error.message;
						this._scrollToTop.scrollToTop()
					}
				});
			}

		} else {
			this.setAsTouched(form);
			this.taxFormValid.next(false);
			this.setFormGlobalErrors();
			this._scrollToTop.scrollToTop();
		}
		this.toggleItemOtherFilled(true);
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


	saveAsDraft() {
		this.patchValue();
		this.toggleItemOtherFilled();
		const form = this.addInvoiceForm as UntypedFormGroup;
		form.markAsUntouched();
		if (this.partyId) {
			if (this.invoiceId == 'null') {
				this._performainvoiceService.postInvoiceAsDraft(this.buildRequest(this.addInvoiceForm)).subscribe((response) => {
					if (this.addInvoiceForm.controls.party.value) {
					}
					this._router.navigate([this.preFixUrl +
						'/income/performa-invoice/list'
					]);
				});
			} else {
				this._performainvoiceService.putInvoiceAsDraft(this.buildRequest(this.addInvoiceForm), this.invoiceId).subscribe((response) => {
					if (this.addInvoiceForm.controls.party.value) {
					}
					this._router.navigate([this.preFixUrl +
						'/income/performa-invoice/list'
					]);
				});
			}
		}
		else {
			this.apiError = 'Please select party';
			window.scrollTo(0, 0);
			this._scrollToTop.scrollToTop();
			form.get('party').markAsTouched();
		}
	}

	buildRequest(form: UntypedFormGroup) {
		form.controls['invoice_date'].setValue(changeDateToServerFormat(form.controls['invoice_date'].value));
		form.controls['due_date'].setValue(changeDateToServerFormat(form.controls['due_date'].value));
		return form.value;
	}


	getAddress(event) {
		this.addInvoiceForm.controls['address'].patchValue(event);
	}

	calculateOtherFinalAmount(index) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		let amount = Number(otherItems.at(index).get('amount').value);
		let discount = Number(otherItems.at(index).get('discount').value);
		let totalAmountControl = otherItems.at(index).get('total_amount');
		const totalAmount = (Number(amount) - Number(discount)).toFixed(3);
		totalAmountControl.setValue(totalAmount);
		this.calculationsChanged();
	}

	// auto calulate rate or amount or quantity if any two value is entered
	calculateItemOthersAmount(index) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		let quantity = otherItems.at(index).get('quantity').value;
		let rate = otherItems.at(index).get('unit_cost').value;
		let setamount = otherItems.at(index).get('amount');
		const amount = (quantity * rate).toFixed(3);
		setamount.setValue(amount);
		this.calculateOtherFinalAmount(index);
	}

	calculateItemOther(index) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		let quantity = otherItems.at(index).get('quantity');
		let rate = otherItems.at(index).get('unit_cost');
		let amount = Number(otherItems.at(index).get('amount').value);

		if (amount == 0) {
			rate.setValue(0.000)
			quantity.setValue(0.000);
		}

		if (rate.value == 0 && quantity.value == 0) {
			this.calculateOtherFinalAmount(index);
			return;
		}

		if (quantity.value == 0 && rate.value != 0) {
			const setFuelQuantity = (amount / rate.value).toFixed(3);
			quantity.setValue(setFuelQuantity);
			this.calculateOtherFinalAmount(index);
			return;
		}
		const setRate = (amount / quantity.value).toFixed(3);
		rate.setValue(setRate);
		this.calculateOtherFinalAmount(index);
	}

	paymentTermPatch(payment) {
		if (payment) {
			setTimeout(() => {
				const gstObj = this.paymentTermList.filter(item => item.id == payment)
				if (gstObj) {
					this.initialValues.paymentTerm['value'] = gstObj[0].id;
					this.initialValues.paymentTerm['label'] = gstObj[0].label;
				} else {

				}
			}, 2000);
		} else {
			this.initialValues.paymentTerm['value'] = '';
		}
	}

	addValueToMaterial($event) {
		this.materialParams = {
			name: $event,
			unit: null,
			rate_per_unit: 0.00,
		};
	}

	addValueToDisclaimer($event) {
		this.disclaimerParams = {
			name: $event,
			description: ''
		};
	}

	addDropDownMaterial($event) {
		if ($event.status)
			this._revenueService.getMaterials().subscribe((response) => {
				if (response && response.result && response.result.length > 0) {
					this.staticOptions.materialList = response.result;
					if (this.ItemDropdownIndex != -1) {
						this.initialValues.items[this.ItemDropdownIndex] = { value: $event.id, label: $event.label };
						this.addInvoiceForm.controls.item_others.at(this.ItemDropdownIndex).get('item').setValue($event.id);
						this.ItemDropdownIndex = -1;
					}
				}
			});
	}

	setDisclaimer($event) {
		if ($event.status)
			this._revenueService.getDisclaimerOptions().subscribe((response) => {
				if (response && response.result && response.result.length > 0) {
					this.disclaimerList = response.result;
					this.initialValues.disclaimer = { value: $event.id, label: $event.label };
					this.addInvoiceForm.get('disclaimer').setValue($event.id);
				}
			});
	}

	// round off amount
	roundOffAmount(formControl) {
		roundOffAmount(formControl);
	}


	openAddItemModal($event, index) {
		if ($event) {
			this.ItemDropdownIndex = index;
			this.showAddItemPopup = { name: this.materialParams.name, status: true };
		}
	}

	openAddDisclaimerModal($event) {
		if ($event)
			this.showAddDisclaimerPopup = { name: this.disclaimerParams.name, status: true };
	}

	closeItemPopup() {
		this.showAddItemPopup = { name: '', status: false };
	}

	closeDisclaimerPopup() {
		this.showAddDisclaimerPopup = { name: '', status: false };
	}




	// set validators for other expense in any value is added
	setOtherValidators() {
		const item_other = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
			items.forEach((key, index) => {
				const item = item_other.at(index).get('item');
				const unit_cost = item_other.at(index).get('unit_cost');
				const quantity = item_other.at(index).get('quantity');
				const amount = item_other.at(index).get('amount');
				const discount = item_other.at(index).get('discount');

				item.setValidators(Validators.required);
				amount.setValidators(Validators.min(0.01));
				discount.setValidators(TransportValidator.lessThanEqualValidator(Number(amount.value)));
				if (items.length == 1) {
					if (!Number(unit_cost.value) && !item.value && !Number(discount.value) && !Number(quantity.value) && !Number(amount.value)) {
						item.clearValidators();
						amount.clearValidators();
						discount.clearValidators();
					}
				}
				item.updateValueAndValidity({ emitEvent: true });
				amount.updateValueAndValidity({ emitEvent: true });
				discount.updateValueAndValidity({ emitEvent: true });
			});
		});
	}

	setAdusjtmentAmountValidator() {
		let adjustmentAmount = this.addInvoiceForm.get('adjustment_amount');
		this.adjustmentValidatorSub = adjustmentAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

			const adjustmentAmount = this.addInvoiceForm.get('adjustment_amount');
			const adjustmentChoice = this.addInvoiceForm.get('adjustment_choice');
			const adjustmentAfterSubtotal = this.totals.adjustment;
			const totalAmount = this.totals.total;
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
	}

	patchFormValues(data: any) {
		if (isValidValue(data)) {
			this.inv_date = data.invoice_date;
			this.addInvoiceForm.controls['invoice_date'].setValue(data.invoice_date);
			this._revenueService.sendPartyIntime(data.party);
			data.party = isValidValue(data.party) ? data.party.id : null;
			this.PartyAddress = data.address
			this.addInvoiceForm.controls['address'].patchValue(this.PartyAddress);
			data.employee = isValidValue(data.employee) ? data.employee.id : null;
			data.bank_account = isValidValue(data.bank_account) ? data.bank_account.id : null;
			data.signature = isValidValue(data.signature) ? data.signature.id : null;
			data.adjustment_account = isValidValue(data.adjustment_account) ? data.adjustment_account.id : this.afterTaxAdjustmentAccount.value;
			data.adjustment_choice = isValidValue(data.adjustment_choice.index) ? data.adjustment_choice.index : '';
			data.disclaimer = isValidValue(data.disclaimer) ? data.disclaimer.id : null
			data.reason = isValidValue(data.reason) ? data.reason.id : null;
			const tripChallans = this.addInvoiceForm.controls['trip_challan'] as UntypedFormArray;
			tripChallans.controls = [];
			const othersItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
			othersItems.reset();
			othersItems.controls = [];
			this.tripChallansList = [];
			data.payment_term = isValidValue(data.payment_term) ? data.payment_term : '';
			data.invoice = isValidValue(data.invoice) ? data.invoice.id : '';
			if (data.other_items.length > 0) {
				data.other_items.forEach((otherItem) => {
					otherItem.item = isValidValue(otherItem.item) ? otherItem.item.id : null;
					otherItem.units = isValidValue(otherItem.units) ? otherItem.units.id : null;
					otherItem.tax = isValidValue(otherItem.tax) ? otherItem.tax.id : this.defaultTax;
				});
				this.patchOtherItems(data.other_items);
			} else {
				this.buildOtherItems([
					{}
				]);
			}

			if (data.trip_challan.length > 0) {
				this.tripChallanModelInline = true;
				this.initialValues.tripChallanTax = [];
				data.trip_challan.forEach((challan) => {
					if (isValidValue(challan.tax)) {
						this.initialValues.tripChallanTax.push({ label: challan.tax.label, value: challan.tax.id });
					} else {
						this.initialValues.tripChallanTax.push(getNonTaxableOption());
					}
					this.existingTripChallanIds.push(challan.id);
					challan = isValidValue(challan) ? challan : '';
					challan.tax = isValidValue(challan.tax) ? challan.tax.id : getNonTaxableOption().value;
				});
				this.buildTripChallans(data.trip_challan);
			}
			else {
				this.tripChallanModelInline = false;
			}

			this.addInvoiceForm.patchValue(data);

		}
	}

	getFormValues() {
		this._performainvoiceService.getInvoiceDetail(this.invoiceId).subscribe((data: any) => {
			this.invoiceDetails = data.result;


			this._partyService.getPartyAdressDetails(this.invoiceDetails.party.id).subscribe(
				res => {
					this.gstin = res.result.tax_details.gstin;
					this.selectedParty=res.result
				});

			this.partyId = this.invoiceDetails.party.id;
			this.editData.next(this.invoiceDetails);
			this.finalAdjustment = this.invoiceDetails.total_adjustment;
			this.partyId = this.invoiceDetails.party ? this.invoiceDetails.party.id : null
			this.totals.total = this.invoiceDetails.total_amount
			this.totals.battaAdvance = Number(this.invoiceDetails.trip_advance_data.batta).toFixed(3);
			this.totals.advanceTotal = Number(this.invoiceDetails.trip_advance_data.advance).toFixed(3);
			this.totals.fuelTotal = Number(this.invoiceDetails.trip_advance_data.fuel).toFixed(3);
			if (Object.keys(this.invoiceDetails).length)
				this.isDomReady = true;
			this.isAmountUsed = this.invoiceDetails.is_amount_used;
			this.partyNamePatch(this.invoiceDetails);
			this.employeePatch(this.invoiceDetails);
			this.paymentTermPatch(this.invoiceDetails.payment_term);
			this.bankAccountPatch(this.invoiceDetails.bank_account);
			this.patchSignature(this.invoiceDetails.signature)
			this.itemOtherPatch(this.invoiceDetails);
			this.patchAdjustmentAccount(this.invoiceDetails);
			this.patchDisclaimer(this.invoiceDetails);
			this.patchContactPerson();
			this.patchFormValues(this.invoiceDetails);
			this.patchDocuments(this.invoiceDetails);

			setTimeout(() => {
				this.calculationsChanged();
			}, 1000);
		});
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.addInvoiceForm.get('documents') as UntypedFormControl;
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

	itemOtherPatch(invoiceDetails) {
		this.initialValues.items = [];
		this.initialValues.units = [];
		this.initialValues.tax = [];
		invoiceDetails.other_items.forEach((ele, index) => {
			if (ele.item) {
				const obj = {
					value: ele.item.id,
					label: ele.item.name
				}
				this.initialValues.items.push(obj);
			} else {
				this.initialValues.items.push({ id: '' });
			}
			if (ele.units) {
				const obj = {
					value: ele.units.id,
					label: ele.units.label
				}
				this.initialValues.units.push(obj);
			} else {
				this.initialValues.units.push({ id: '' });
			}

			if (ele.tax) {
				const obj = {
					value: ele.tax.id,
					label: ele.tax.label
				}
				this.initialValues.tax.push(obj);
			} else {
				this.initialValues.tax.push(getNonTaxableOption());
			}

		});
	}


	partyNamePatch(vendorData) {
		if (vendorData.party) {
			this.initialValues.party['value'] = vendorData.party.id;
			this.initialValues.party['label'] = vendorData.party.display_name;
		} else {
			this.initialValues.party['value'] = '';
		}
	}

	employeePatch(invoiceDetails) {
		if (invoiceDetails.employee) {
			this.initialValues.employee['value'] = invoiceDetails.employee.id;
			this.initialValues.employee['label'] = invoiceDetails.employee.display_name;
		} else {
			this.initialValues.employee['value'] = '';
		}
	}

	bankAccountPatch(bankAccount) {
		if (bankAccount) {
			this.initialValues.bank_account['value'] = bankAccount.id;
			this.initialValues.bank_account['label'] = bankAccount.account_holder_name;
		} else {
			this.initialValues.bank_account['value'] = '';
		}
	}

	patchSignature(signature) {
		if (signature) {
			this.initialValues.digitalSignature['value'] = signature.id
			this.initialValues.digitalSignature['label'] = signature.name
		} else {
			this.initialValues.digitalSignature['label'] = ''
		}
	}


	patchAdjustmentAccount(invoiceDetails) {
		if (invoiceDetails.adjustment_account) {
			this.initialValues.adjustmentAccount['value'] = invoiceDetails.adjustment_account.id,
				this.initialValues.adjustmentAccount['label'] = invoiceDetails.adjustment_account.name
		} else {
			this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
		}
	}

	patchDisclaimer(invoiceDetails) {
		if (invoiceDetails.disclaimer) {
			this.initialValues.disclaimer['value'] = invoiceDetails.disclaimer.id,
				this.initialValues.disclaimer['label'] = invoiceDetails.disclaimer.name
		} else {
			this.initialValues.disclaimer = getBlankOption()
		}
	}

	patchOtherItems(items: any = []) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		items.forEach(item => {
			otherItems.push(this.addOtherItem(item));
		});
		this.calculationsChanged();
	}

	headerTaxDetails(data) {
		if (this.isTax) {
			this.isTaxFormValid = data.isFormValid;
			this.addInvoiceForm.get('place_of_supply').setValue(data.headerTaxDetails['place_of_supply'])
			this.addInvoiceForm.get('is_transaction_under_reverse').setValue(data.headerTaxDetails['is_transaction_under_reverse'])
			this.addInvoiceForm.get('is_transaction_includes_tax').setValue(data.headerTaxDetails['is_transaction_includes_tax'])
			if (data.headerTaxDetails['is_transaction_under_reverse']) {
				this.disableTax = true;
				this.addInvoiceForm.get('is_transaction_under_reverse').setValue(data.headerTaxDetails['is_transaction_under_reverse'])
				this.setAllTaxAsNonTaxable();
				this.calculationsChanged();
			} else {
				this.disableTax = false;
				this.addInvoiceForm.get('is_transaction_includes_tax').setValue(data.headerTaxDetails['is_transaction_includes_tax']);
				this.calculationsChanged();
			}
		}
	}

	onSelectPopulateTax($event) {
		if ($event.target.value) {
			const tax = getObjectFromList($event.target.value, this.taxOptions);
			if (tax) {
				this.itemChallanCommonTax = { label: tax.label, value: tax.id };
				this.tripChallanCommonTax = { label: tax.label, value: tax.id };
				this.initialValues.challan_tax.fill({ label: tax.label, value: tax.id });
				this.initialValues.tripChallanTax.fill({ label: tax.label, value: tax.id });
				const challanTrips = this.addInvoiceForm.get('trip_challan') as UntypedFormArray;
				challanTrips.controls.forEach(element => {
					element.get('tax').setValue(tax.id);
				});

			}
			this.calculationsChanged();
		}
	}

	onSelectPopulateTripTax($event) {
		if ($event.target.value) {
			const tax = getObjectFromList($event.target.value, this.taxOptions);
			if (tax) {
				this.tripChallanCommonTax = { label: tax.label, value: tax.id };
				this.initialValues.tripChallanTax.fill({ label: tax.label, value: tax.id });
				const challanItems = this.addInvoiceForm.get('trip_challan') as UntypedFormArray;
				challanItems.controls.forEach(element => {
					element.get('tax').setValue(tax.id);
				});
			}
			this.calculationsChanged();
		}
	}


	setTripTaxValue(index: number, event) {
		if (event.target.value != 'null') {
			this.addInvoiceForm.controls['trip_challan'].controls[index].controls.tax.setValue(event.target.value);
		}
		else {
			this.addInvoiceForm.controls['trip_challan'].controls[index].controls.tax.setValue(this.defaultTax)
		}
		this.calculationsChanged();
	}


	setAllTaxAsNonTaxable() {
		this.initialValues.tax.fill(getNonTaxableOption());
		this.initialValues.challan_tax.fill(getNonTaxableOption());
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		otherItems.controls.forEach((controls) => {
			controls.get('tax').setValue(this.defaultTax);
		});
	}

	getTaxDetails() {
		this.isTax = this._tax.getTax();
		this._taxService.getTaxDetails().subscribe(result => {
			this.placeOfSupply = result.result['pos'];
			this.taxOptions = result.result['tax'];
			this.companyRegistered = result.result['registration_status'];
			this.totals.taxes = this.taxOptions;
			this.partyDetailsData = {
				taxDeatils: {},
				placeOfSupply: this.placeOfSupply
			}
			this.partyTaxDetails.next(this.partyDetailsData)
		})
	}

	editTripFreight(id: string = "", workOrderNumber) {
		if (id) {
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				let data = res.result
				data['id'] = id
				data['customerId'] = this.addInvoiceForm.get('party').value;
				this.showFreightPopup = {
					type: 'client-freights',
					show: true,
					data: res.result,
					extras: { id: workOrderNumber }
				}
			})
		}
	}


	setFreightValueToChallan(tripId, value) {
		let tripChallans = this.addInvoiceForm.get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('freights').setValue(value);
			this.calculationsChanged();
		}
	}

	editCompleteTripFreight($event) {

		const tripId = this.showFreightPopup.data['id'];
		if (tripId) {
			this._tripService.getTripSubDetails(tripId, 'freights', { type: 'client-freights', operation: 'sum' }).subscribe((res: any) => {
				this.setFreightValueToChallan(tripId, res['result']);
			});
		}
		this.showFreightPopup = {
			type: '',
			show: false,
			data: {},
			extras: { id: '' },
		}
	}


	editTripAddBillCharges(id: string = "", extras: any = {}) {
		if (id) {
			this.isAddExpense=true;
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				let charges = res.result['revenue']['charges']
				charges['id'] = id
				extras.id = id
				this.showChargesPopup = {
					type: 'party-charge-bill',
					show: true,
					data: cloneDeep(res.result['revenue']['charges']),
					extras: extras
				}
			})
		}
	}

	editTripReduceBillCharges(id: string = "", extras: any = {}) {
		if (id) {
			this.isAddExpense=false;
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				extras.id = id
				let charges = res.result['expense']['charges']
				charges['id'] = id
				this.showChargesPopup = {
					type: 'party-charge-reduce-bill',
					show: true,
					data: cloneDeep(res.result['expense']['charges']),
					extras: extras
				}
			})
		}
	}
	editTripAddAdvances(id: string = "", extras: any = {}) {
		if (id) {
			this._tripService.getTripsDetails(id).subscribe((res: any) => {
				extras.id = id
				this.showAdvancePopup = {
					type: '',
					show: true,
					data: res.result,
					extras: extras
				}
			})
		}
	}


	setAddChargeValueToChallan(tripId, value) {
		let tripChallans = this.addInvoiceForm.get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('charges').setValue(value);
			this.calculationsChanged();
		}
	}

	setReduceChargeValueToChallan(tripId, value) {
		let tripChallans = this.addInvoiceForm.get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('deductions').setValue(value);
			this.calculationsChanged();
		}
	}

	editCompleteTripCharges($event) {
		if ($event) {
			const tripId = this.showChargesPopup.data['id'];
			const type = this.showChargesPopup.type
			if (tripId && type == "party-charge-bill") {
				this._tripService.getTripSubDetails(tripId, 'charges', { type: 'add-bill-party', operation: 'sum' }).subscribe((res: any) => {
					this.setAddChargeValueToChallan(tripId, res['result']);
				});
			}

			if (tripId && type == "party-charge-reduce-bill") {
				this._tripService.getTripSubDetails(tripId, 'charges', { type: 'reduce-bill-party', operation: 'sum' }).subscribe((res: any) => {
					this.setReduceChargeValueToChallan(tripId, res['result']);
				});
			}
		}
		this.showChargesPopup = {
			type: '',
			show: false,
			data: {},
			extras: { id: '' },
		}
	}

	stopLoaderClasstoBody() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.add('removeLoader');
	}
	RemoveLoaderClasstobody() {
		let body = document.getElementsByTagName('body')[0];
		body.classList.remove('removeLoader');
	}
	dataFromAdavnces(data) {
		this.totals.battaAdvance = 0;
		this.totals.advanceTotal = 0;
		this.totals.fuelTotal = 0;
		if (data) {
			const tripId = this.showAdvancePopup.data['id'];
			let tripChallans = this.addInvoiceForm.get('trip_challan') as UntypedFormArray;
			let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
			if (formChallan) {
				formChallan.get('advance').setValue(data.totalAdvances);
				this.calculationsChanged();
			}
			tripChallans.controls.forEach(ele => {
				this.getTripDetails(ele.value.trip);
			});
		}
	}


	getTripDetails(tripId) {
		this._tripService.getTripsDetails(tripId).subscribe((res: any) => {
			// let data = res['result'];
			// if (data.fuel_advances.length > 0) {
			// 	let totalFuelamount = 0;
			// 	data.fuel_advances.forEach(element => {
			// 		totalFuelamount = totalFuelamount + Number(element.amount)
			// 	});
			// 	this.totals.fuelTotal = (Number(this.totals.fuelTotal) + Number(totalFuelamount)).toFixed(3);
			// }
			// if (data.party_advances.length > 0) {
			// 	let totalPartyamount = 0;
			// 	data.party_advances.forEach(element => {
			// 		totalPartyamount = totalPartyamount + Number(element.amount)
			// 	});
			// 	this.totals.advanceTotal = (Number(this.totals.advanceTotal) + Number(totalPartyamount)).toFixed(3);
			// }
			// this.totals.battaAdvance = (Number(this.totals.battaAdvance) + Number(data.customer_driver_allowance)).toFixed(3);
		});
	}

	getContactPersonList(id) {
		this._partyService.getContactPersonList(id).subscribe(data => {
			this.contactPersonList = data['result'].contact_person;
			if (this.invoiceId == 'null') {
				this.patchDefaultContactPerson()
			}
		})
	}

	setContactPerson(contactPerson) {
		if (!isValidValue(contactPerson)) return
		this.initialValues.contactperson = { label: contactPerson.display_name, value: contactPerson.id }
		this.addInvoiceForm.get('contact_person').setValue(contactPerson.id)
	}

	clearContactPerson() {
		this.initialValues.contactperson = { label: "", value: "" }
		this.addInvoiceForm.get('contact_person').setValue(null)
	}

	patchDefaultContactPerson() {
		this.clearContactPerson();
		const defaultContact = this.contactPersonList.filter((item) => item.default == true)[0]
		if (defaultContact) {
			this.setContactPerson(defaultContact)
		}
	}

	patchContactPerson() {
		this.getContactPersonList(this.partyId)
		const contactPerson = this.invoiceDetails.contact_person;
		if (!isValidValue(contactPerson)) return
		this.setContactPerson(contactPerson)
		this.invoiceDetails.contact_person = contactPerson.id
	}

	getDigitalSignatureList() {
		this._commonService.getDigitalSignatureList().subscribe(data => {
			this.digitalSignature = data['result']['data']
		})
	}

}


