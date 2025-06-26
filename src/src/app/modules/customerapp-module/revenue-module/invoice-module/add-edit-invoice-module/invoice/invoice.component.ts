import { isValidValue, getObjectFromList, roundOffAmount, getBlankOption, getNonTaxableOption, getObjectFromListByKey } from 'src/app/shared-module/utilities/helper-utils';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { CommonService } from 'src/app/core/services/common.service';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { InvoiceService } from '../../../../api-services/revenue-module-service/invoice-service/invoice.service';
import {Router } from '@angular/router';
import { changeDateToServerFormat, PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { categoryOptions, ValidationConstants } from 'src/app/core/constants/constant';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { EmployeeService } from '../../../../api-services/master-module-services/employee-service/employee-service';
import { InvoiceClass } from '../invoice-class/invoice.class';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { cloneDeep } from 'lodash';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { Dialog } from '@angular/cdk/dialog';
import { CraneTripChallanComponent } from '../../../invoice-trip-challan-module/crane-trip-challan/crane-trip-challan.component';
import { SalesOrderAdditionalChargesComponent } from '../../../invoice-trip-challan-module/sales-order-additional-charges/sales-order-additional-charges.component';
import { CraneChargesComponent } from '../../../invoice-trip-challan-module/crane-charges/crane-charges.component';
import { CraneDeductionsComponent } from '../../../invoice-trip-challan-module/crane-deductions/crane-deductions.component';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { NewTripV2DataService } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-dataservice';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getEmployeeObject } from 'src/app/modules/customerapp-module/master-module/employee-module/employee-utils';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { InvoiceCustomFieldService } from 'src/app/modules/orgainzation-setting-module/setting-module/invoice-setting-module/invoice-custom-field.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { addAdditionalChargeItem, addChargeItem, addDeductionsItem, addInvoiceTripChallan, addOtherItem, addTimeSheetItem, getInvoiceForm } from '../invoice-form.utils';

@Component({
	selector: 'app-add-invoice',

	templateUrl: './invoice.component.html',
	styleUrls: [
		'./invoice.component.scss'
	],
	host: {
		"(window:click)": "clickOutToHide($event)"
	},
})
export class InvoiceComponent extends InvoiceClass implements OnInit, OnDestroy {
	@Input() selectedCategory = ''
	@Input() partyId: string = ''
	@Input() invoiceId: string = '';
	@Input() invoiceDetails: any;
	@Input()tripId:string=''
	@Input()pulloutAndDepositTripId=[]
	terminology: any;
	apiError: string;
	addInvoiceForm;
	SelectedDocuments = {
		other: [],
		crane: { charge: [], deduction: [] },
		awp: { charge: [], deduction: [] },
	}
	partyList = [];
	bankList: any = [];
	employeeList: any = [];
	paymentTermList = [];
	selectedParty: any;
	saveButton: boolean = false;
	tripChallansList: any = [];
	tripChallansListForContainer: any = [];
	staticOptions: any = {};
	isAdd: boolean = true;
	isTripAdd: boolean = true;
	gstin: '';
	totals: any = {
		subtotal: 0.00,
		advance_amount: 0.00,
		adjustment: 0.00,
		total: 0.00,
		roundOffAmount: 0.00,
		craneTimesheet: {
			billingHoursTotal: 0.00,
			extraHoursTotal: 0.00,
			billingHoursAmountTotal: 0.00,
			extraHoursAmountTotal: 0.00,
			timeSheetTaxTotal: 0.00,
			timeSheetSubTotal: 0.00,
		},
		awpTimesheet: {
			billingHoursTotal: 0.00,
			extraHoursTotal: 0.00,
			billingHoursAmountTotal: 0.00,
			extraHoursAmountTotal: 0.00,
			timeSheetTaxTotal: 0.00,
			timeSheetSubTotal: 0.00,
			deductionTotal: 0.00,
		},
		others: {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			deduction: 0.00,
			totaltax: 0.00,
			totalAmount: 0.00
		},
		container: {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			deduction: 0.00,
			totaltax: 0.00,
			totalAmount: 0.00
		},
		itemOther: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		craneAdditionalCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		awpAdditionalCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		containerAdditionalCharges: {
			units: 0,
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},

		craneCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		awpCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		containerCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},

		craneDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		awpDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			discountTotal: 0.00
		},
		containerDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			discountTotal: 0.00
		},
		othersAdditionalCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00,
			totalUnits: 0
		},
		taxes: []
	};
	inv_date: any = new Date(dateWithTimeZone());
	selectedPaymentTerm: any;
	pattern = new ValidationConstants();
	initialValues: any = {
		digitalSignature: {},
		paymentTerm: {},
		adjustmentAccount: getBlankOption(),
		items: [getBlankOption()],
		units: [getBlankOption()],
		termsAndCondition: {},
		contactperson: {},
		party: {},
		employee: {},
		challan_tax: [getNonTaxableOption()],
		tripChallanTax: [getNonTaxableOption()],
		bank_account: {},
		tax: [getNonTaxableOption()],
		awpTax: getNonTaxableOption(),
		craneTax: getNonTaxableOption(),

	};
	alphaNumericPattern = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
	expenseAccountList: any = [];
	afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	errorHeaderMessage = new ErrorList().headerMessage;
	otherExpenseValidatorSub: Subscription;
	challanValidatorSub: Subscription;
	termsAndConditions: any = [];
	currency_type;
	isDueDateRequired = false;

	PartyAddress: any;
	existingTripChallanIds: any = [];
	existingTripChallanIdsForContainer: any = [];
	patchFileUrls = new BehaviorSubject([]);
	finalAdjustment: any;
	taxOptions = [];
	disableTax: boolean = false;
	itemChallanCommonTax: any = getNonTaxableOption();
	tripChallanCommonTax: any = getNonTaxableOption();
	tripChallanCommonTaxForContainer: any = getNonTaxableOption();
	defaultTax = new ValidationConstants().defaultTax;
	tripChallanModelInline: boolean = false;
	tripChallanModelInlineForContainer: boolean = false;
	isTax: boolean = false;
	preFixUrl = '';
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
	contactPersonList = [];
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	digitalSignature = [];
	doTripChallanExists: boolean = false;
	doTripChallanExistsForContainer: boolean = false;
	populateTaxSelected = "";
	populateTaxSelectedForContainer = "";
	creditRemaining = {
		credit_remaining: 0,
		check_credit: false
	};
	customerDetails: any;
	

	creditOnsaveLimit = {
		open: false,
		msg: ''
	}
	creditOnsaveAsDraftLimit = {
		open: false,
		msg: ''
	}

	selectedDocumentInTrip = [];
	selectedTripDoc = new Subject()
	selectedTripDocForContainer = new Subject()
	paymentTermCustom = new ValidationConstants().paymentTermCustom;
	isAddExpense = false;
	openDescription = new Subject()
	openDescriptionForContainer = new Subject()
	openManageDescription = new Subject()
	openManageDescriptionForContainer = new Subject();
	craneTabActiveIndex = 1;
	awpTabActiveIndex = 1;
	containerTabActiveIndex = 1;
	othersTabActiveIndex = 1;
	taxAmount = 0;
	craneTimeSheet = {
		sheetList: [],
		selectedSheetList: []
	}
	awpTimeSheet = {
		sheetList: [],
		selectedSheetList: []
	}
	craneSOAdditionalCharge = {
		chargeList: [],
		selectedChargeList: []
	}
	awpSOAdditionalCharge = {
		chargeList: [],
		selectedChargeList: []
	}
	containerSOAdditionalCharge = {
		chargeList: [],
		selectedChargeList: []
	}
	craneCharges = {
		chargeList: [],
		selectedChargeList: []
	}
	awpCharges = {
		chargeList: [],
		selectedChargeList: []
	}
	containerCharges = {
		chargeList: [],
		selectedChargeList: []
	}
	othersSOAdditionalCharge = {
		chargeList: [],
		selectedChargeList: []
	}

	craneDeductions = {
		deductionList: [],
		selectedDeductionList: []
	}

	awpDeductions = {
		deductionList: [],
		selectedDeductionList: []
	}
	containerDeductions = {
		deductionList: [],
		selectedDeductionList: []
	}

	isCarneDataAvailable = false;
	isAWPDataAvailable = false;
	isOthersDataAvailable = false;
	isContainerDataAvailable = false;
	countryPhoneCode = [];
	countryId
	vehicleCategory = ''
	activetabIndex = 0;
	selectedDocuemnts = {
		crane_charges: [],
		awp_charges: [],
		crane_deductions: [],
		awp_deductions: [],
		containerCharges: [],
		containerDeductions: [],
		containerTripChallans: []
	}
	minDate: Date
	customFieldList = []
	billingUnitCrane: 'day' | 'hour' = 'hour';
	billingUnitAwp: 'day' | 'hour' = 'hour';
	categoryOptions = categoryOptions


	constructor(
		private _terminologiesService: TerminologiesService,
		private _fb: UntypedFormBuilder,
		private _commonService: CommonService,
		private _partyService: PartyService,
		private _employeeService: EmployeeService,
		private _revenueService: RevenueService,
		private _invoiceService: InvoiceService,
		private _router: Router,
		private currency: CurrencyService,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _preFixUrl: PrefixUrlService,
		private _tripService: NewTripService,
		private _analytics: AnalyticsService,
		private _newTripV2Service: NewTripV2Service,
		private _companyModuleService: CompanyModuleServices,
		private _scrollToTop: ScrollToTop,
		private _countryId: CountryIdService,
		public dialog: Dialog,
		private _rateCardService: RateCardService,
		private _tripDataService: NewTripV2DataService,
		private _commonLoaderService: CommonLoaderService,
		private _customFieldService: InvoiceCustomFieldService,
		private apiHandler: ApiHandlerService,
	) {
		super();
		this.getTaxDetails();
	}

	ngOnDestroy() {
		this.otherExpenseValidatorSub.unsubscribe();
		this._commonLoaderService.getShow();
	}
	clickOutToHide(e) {

		if (!e.target.className.includes('saveButton')) {
			this.saveButton = false;
		}
	}

	ngOnInit() {
		this._commonLoaderService.getHide();
		this.countryId = this._countryId.getCountryId();
		this.terminology = this._terminologiesService.terminologie;
		this.preFixUrl = this._preFixUrl.getprefixUrl();
		this.buildForm();
		this.addInvoiceForm.get('party').setValue(this.partyId);
		this.addInvoiceForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))
		this.currency_type = this.currency.getCurrency();
		this.addInvoiceForm.controls['invoice_date'].setValue(new Date(dateWithTimeZone()));
		this.minDate = new Date(dateWithTimeZone())
		this._companyModuleService.getPhoneCode().subscribe(result => {
			this.countryPhoneCode = result['results'].map(code => code.phone_code)
		})
		this.getDigitalSignatureList();
		this._employeeService.getEmployeeList().subscribe((employeeList) => {
			this.employeeList = employeeList;
		});
		this._commonService.getBankDropDownList().subscribe((stateData) => {
			if (stateData !== undefined) {
				this.bankList = stateData.result;
			}
		});
		this.getTermsAndConditions();
		if (this.invoiceId) {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.INVOICE, this.screenType.EDIT, "Navigated");
			this.isTax = this._tax.getTax();
			this._taxService.getTaxDetails().subscribe(result => {
				this.taxOptions = result.result['tax'];
				this.totals.taxes = this.taxOptions;
				this.getFormValues(this.invoiceDetails);

			})
			this._commonService.getStaticOptions('gst-treatment,tax,item-unit,payment-term').subscribe((response) => {
				this.paymentTermList = response.result['payment-term'];
				this.staticOptions.itemUnits = response.result['item-unit'];
			});
		}
		else {
			this.onPartySelected(this.partyId);
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.INVOICE, this.screenType.ADD, "Navigated");
			this._commonService.getSuggestedIds('invoice').subscribe((response) => {
				this.addInvoiceForm.controls['invoice_number'].setValue(response.result['invoice']);
			});
			this._revenueService.getTersmAndConditionList('invoice').subscribe((data) => {
				this.addInvoiceForm.controls['narrations'].setValue(data['result']['tc_setting']['narration']);
				if (data['result']['tc_content'].length) {
					let defaultTAC = data['result']['tc_content'].find(ts => ts.is_default == true)
					if (isValidValue(defaultTAC)) {
						this.initialValues.termsAndCondition = { label: defaultTAC.name, value: defaultTAC.id }
						this.addInvoiceForm.get('terms_and_condition').setValue(defaultTAC.id)
					}
				}
				if (data['result']['tc_setting']['default_tax']) {
					let defaultTax = data['result']['tc_setting']['default_tax']
					this.addInvoiceForm.get('awp.timesheet_tax').setValue(defaultTax.id)
					this.addInvoiceForm.get('crane.timesheet_tax').setValue(defaultTax.id)
					this.addInvoiceForm.get('others.trip_challan_tax').setValue(defaultTax.id)
					this.addInvoiceForm.get('container.trip_challan_tax').setValue(defaultTax.id)
					this.initialValues.craneTax = defaultTax
					this.initialValues.awpTax = defaultTax
					this.tripChallanCommonTaxForContainer = defaultTax
					this.itemChallanCommonTax= defaultTax
					this.populateTaxSelected=defaultTax.id;
					this.populateTaxSelectedForContainer=defaultTax.id;
				}
			})
			this._commonService.getStaticOptions('gst-treatment,tax,item-unit,payment-term').subscribe((response) => {
				this.paymentTermList = response.result['payment-term'];
				if (this.paymentTermList.length) {
					this.initialValues.paymentTerm = cloneDeep(this.paymentTermList[0]);
					this.addInvoiceForm.get('payment_term').setValue(this.paymentTermList[0].id)
					this.onpaymentTermSelected(this.paymentTermList[0].id)
				}
				this.staticOptions.itemUnits = response.result['item-unit'];

			});
			this._customFieldService.getInvoiceSettings(this.categoryOptions[this.selectedCategory]).subscribe((result: any) => {
				this.addInvoiceForm.get("signature").patchValue(null);
				this.initialValues.digitalSignature = getBlankOption();
				if (isValidValue(result["result"].signature)) {
					this.initialValues.digitalSignature = {
						label: result["result"].signature.name,
						value: result["result"].signature.id,
					};
					this.addInvoiceForm.get("signature").patchValue(result["result"].signature['id']);
				}
			}
			)
			this._customFieldService.getInvoiceFields(false, this.categoryOptions[this.selectedCategory]).subscribe(res => {
				if (!res.result?.display) {
					return
				}
				this.customFieldList = res['result'].fields.filter(item => item.display == true)
				this.addCustomFields(this.customFieldList)
			})
		}
		if(this.tripId){
			this._invoiceService.checkJobsByCustomer(this.partyId, '').subscribe(resp => {
				this.makeActiveAccordingToCategory(resp['result'])
			})
			setTimeout(() => {
				this.initialDetailsOnPartySelected(this.partyId)
			}, 1000);
		}
	}

	buildCustomFieldsItems(items: any) {
		return this._fb.group({
			field: [items.id],
			field_label: [items.field_label, [items.mandatory ? Validators.required : Validators.nullValidator]],
			value: [items.value || '', [items.mandatory ? Validators.required : Validators.nullValidator]],
			mandatory: [items.mandatory],
			field_type: [items.field_type?.data_type],
			option_list: [items['option_list'] ? items['option_list'] : []],
			selected_option: { label: items.value, value: items.value }
		})
	}


	addCustomFields(items: any = []) {
		const custom_field = this.addInvoiceForm.get('customfields') as UntypedFormArray;
		custom_field.controls = [];
		items.forEach((item) => {
			const customForm = this.buildCustomFieldsItems(item);
			custom_field.push(customForm);
		});
	}

	handleEmployeeChange() {
		let empId = this.addInvoiceForm.get('employee').value;
		let empObj = getEmployeeObject(this.employeeList, empId);
		this.initialValues.employee = { label: empObj?.display_name, value: empId }

	}


	getdefaultBank(id) {
		let params = {
			is_account: 'False',
			is_tenant: 'False',
			remove_cash_account: 'True'
		}
		this._revenueService.getDefaultBank(id, params).subscribe((data) => {
			this.initialValues.bank_account = getBlankOption();
			if (data['result']) {
				this.addInvoiceForm.get('bank_account').setValue(data['result'].id);
				this.initialValues.bank_account['label'] = data['result'].name;
			}

		})
	}

	getAdditionalCharges() {
		let params = {
			vehicle_category: -1
		}
		this._rateCardService.getCustomerAdditionalCharge(this.addInvoiceForm.get('party').value, params).subscribe((res) => {
			this.staticOptions.materialList = res['result'];
		})
	}


	makeActiveAccordingToCategory(data) {
		switch (this.selectedCategory) {
			case 'crane':
				this.isCarneDataAvailable = data['job_for_cranes'];
				break;
			case 'awp':
				this.isAWPDataAvailable = data['job_for_awp'];
				break;
			case 'cargo':
				this.isOthersDataAvailable = data['job_for_others'];
				break;
			case 'container':
				this.isContainerDataAvailable = data['job_for_container'];
				break;
			default:
				break;
		}
		this.activetabIndex = -1
		setTimeout(() => {
			this.activetabIndex = 0;
		}, 100);
	}


	onWorkEndDateChange() {
		let item = this.paymentTermList.find((item: any) => item.label == 'Custom')
		if (item) {
			this.initialValues.paymentTerm = { label: item.label, value: item.id };
			this.addInvoiceForm.get('payment_term').setValue(item.id)
		}
	}

	getTermsAndConditions() {
		this._revenueService.getTersmAndConditionList('invoice').subscribe((response) => {
			this.termsAndConditions = response.result['tc_content'];
		});
	}
	buildForm() {
		this.addInvoiceForm = getInvoiceForm(this._countryId);
		this.buildOtherItems([{}]);
		this.setOtherValidators();
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
		const challans = this.addInvoiceForm.controls['others'].get('trip_challan') as UntypedFormArray;
		const existingchallan = challans.value;
		challans.controls = [];
		challans.updateValueAndValidity();
		this.tripChallansList = [];
		this.selectedDocumentInTrip = [];
		items.forEach((item) => {
			item['tax'] = this.populateTaxSelected
			let arritem = getObjectFromListByKey('trip', item.trip, existingchallan);
			this.initialValues.tripChallanTax.push(this.tripChallanCommonTax);
			if (arritem) {
				item.adjustment = arritem.adjustment;
				item.freights = arritem.freights;
				item.freights_tax = arritem.freights_tax;
				item.charges = arritem.charges;
				item.charges_wo_tax = arritem.charges_wo_tax;
				item.charges_tax = arritem.charges_tax;
				item.charges_wt_tax = arritem.charges_wt_tax;
				item.deductions_wo_tax = arritem.deductions_wo_tax;
				item.deductions_tax = arritem.deductions_tax;
				item.deductions_wt_tax = arritem.deductions_wt_tax;
				item.deductions = arritem.deductions;
				item['tax'] = this.populateTaxSelected

			}
			challans.push(addInvoiceTripChallan(item));
			this.tripChallansList.push(item);
			this.selectedDocumentInTrip.push([]);
		});
		setTimeout(() => {
			this.getSelectedDocumentForthisTrip();
		}, 100);
	}



	buildOtherItems(items: any = []) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		otherItems.controls = [];
		otherItems.updateValueAndValidity();
		this.initialValues.items = [];
		this.initialValues.units = [];
		this.initialValues.tax = [];
		items.forEach((i, item) => {
			otherItems.push(addOtherItem(item));
			this.initialValues.items.push(getBlankOption());
			this.initialValues.units.push(getBlankOption());
			this.initialValues.tax.push(getNonTaxableOption());
		});
	}

	buildSOAdditionalCharges(items: any = [], type: string) {
		const charges = this.addInvoiceForm.get(type).get('additional_charges') as UntypedFormArray;
		const existingCharges = charges.value;
		charges.controls = [];
		charges.updateValueAndValidity();
		items.forEach((item) => {
			let arritem = getObjectFromListByKey('charge_id', item.charge_id, existingCharges);
			if (arritem) {
				item.discount = arritem.discount;
				item.amount = arritem.amount;
				item.quantity = arritem.quantity;
				item.unit_cost = arritem.unit_cost;
				item.tax = this.taxOptions.find(tax => tax.id == arritem.tax);
			}
			charges.push(addAdditionalChargeItem(item));
		});
	}

	buildJobCharges(items: any = [], type: string) {
		const charges = this.addInvoiceForm.get(type).get('charges') as UntypedFormArray;
		const existingCharges = charges.value;
		charges.controls = [];
		charges.updateValueAndValidity();
		items.forEach((item) => {
			let arritem = getObjectFromListByKey('charge_id', item.charge_id, existingCharges);
			if (arritem) {
				item.discount = arritem.discount;
				item.amount = arritem.amount;
				item.tax = this.taxOptions.find(tax => tax.id == arritem.tax);
			}
			charges.push(addChargeItem(item));
		});
		setTimeout(() => {
			this.getSelectedDocumentFromCharges();
		}, 100)
	}

	buildJobDeductions(items: any = [], type: string) {
		const deductions = this.addInvoiceForm.get(type).get('deductions') as UntypedFormArray;
		const existingDeductions = deductions.value;
		deductions.controls = [];
		deductions.updateValueAndValidity();
		items.forEach((item) => {
			let arritem = getObjectFromListByKey('charge_id', item.charge_id, existingDeductions);
			if (arritem) {
				item.discount = arritem.discount;
				item.amount = arritem.amount;
			}
			deductions.push(addDeductionsItem(item));

		});
		setTimeout(() => {
			this.getSelectedDocumentFromDeductions()
		}, 100)

	}

	buildJobTimeSheets(items: any = [], type: string) {
		if (type == 'crane') {
			if (items.length > 0) {
				this.billingUnitCrane = items[0].billing_unit
			}
		}
		if (type == 'awp') {
			if (items.length > 0) {
				this.billingUnitAwp = items[0].billing_unit
			}
		}
		const timesheets = this.addInvoiceForm.get(type).get('timesheets') as UntypedFormArray;
		timesheets.controls = [];
		timesheets.updateValueAndValidity();
		items.forEach((item) => {
			timesheets.push(addTimeSheetItem(item));
		});
	}

	resetOtherExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({
			units: null, unit_cost: 0.000, discount: 0.000, total_amount: 0.000,
			quantity: 0.000, amount: 0.000, tax: this.defaultTax
		});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.tax[index] = getNonTaxableOption();
	}
	getTripsDoc(docs: Array<String>) {
		return docs?.length > 1
			? `${docs.join(", ")} are missing`
			: docs?.length === 1
				? `${docs.join(", ")} is missing`
				: 'All documents are present';

	}


	onMaterialSelected(event, itemExpenseControl: UntypedFormGroup, index: number) {
		this.resetOtherExceptItem(itemExpenseControl, index);
		if (event.target.value) {
			const itemSelected = this.staticOptions.materialList.filter((item) => item.name.id === event.target.value)[0]
			itemExpenseControl.get('unit_cost').setValue(itemSelected.rate);
			itemExpenseControl.get('units').setValue(itemSelected.unit_of_measurement ? itemSelected.unit_of_measurement.id : null);
			if (itemSelected.unit_of_measurement) {
				this.initialValues.units[index] = { label: itemSelected.unit_of_measurement.label, value: itemSelected.unit_of_measurement.id }
			}
			if (itemSelected.tax) {
				itemExpenseControl.get('tax').setValue(itemSelected.tax.id);
				this.initialValues.tax[index] = { label: itemSelected.tax.label, value: itemSelected.tax.id }
			}
		}
		this.calculationsChanged();
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
		otherItems.push(addOtherItem({}));
	}

	clearAllOtherItems() {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		this.initialValues.items = [];
		this.initialValues.units = [];
		this.initialValues.tax = [];
		otherItems.controls = [];
		otherItems.updateValueAndValidity()
		this.addMoreOtherItem();
		this.calculationsChanged();
	}

	checkTripChallanExist(value) {
		this.doTripChallanExists = value
	}

	checkTripChallanExistForContainer(value) {
		this.doTripChallanExistsForContainer = value;
	}


	onPartySelected(partyId) {
		this.getAdditionalCharges();
		this._invoiceService.checkJobsByCustomer(partyId, '').subscribe(resp => {
			this.makeActiveAccordingToCategory(resp['result'])
		})
		this._partyService.getPartyAdressDetails(partyId).subscribe((response) => {
			this.customerDetails = response['result']
			this.creditRemaining.check_credit = this.customerDetails.check_credit
			this.creditRemaining.credit_remaining = this.customerDetails.credit_remaining
			this.initialDetailsOnPartySelected(partyId);
		});

	}

	initialDetailsOnPartySelected(partyId) {
		this.apiError = '';
		this.getdefaultBank(partyId)
		this.initialValues.paymentTerm = {};
		this.getContactPersonList(partyId)
		this.resetCraneAwpCargoContainerTableValues();
		this.getAdditionalCharges();
		this.addInvoiceForm.get('employee').patchValue('');
		this.initialValues.employee = getBlankOption();
		this._partyService.getPartyAdressDetails(partyId).subscribe((response) => {
			this.selectedParty = response.result;
			this.gstin = response.result.tax_details.gstin;
			this.partyId = partyId;
			if (this.selectedParty.sales_person_name?.id) {
				this.addInvoiceForm.get('employee').patchValue(this.selectedParty.sales_person_name?.id);
				this.initialValues.employee = { label: this.selectedParty.sales_person_name?.name, value: this.selectedParty.sales_person_name?.id }

			}
			this.addInvoiceForm.controls['address'].patchValue(this.selectedParty.address);
			this.tripChallanModelInline = false;
			this.tripChallanModelInlineForContainer = false;
			this._revenueService.sendPartyIntime(this.partyId);
			this.getCraneAndAWPCargoContainerDetailsDetails();
			this.vehicleCategory=this.categoryOptions[this.selectedCategory].toString()
			if (this.tripId) {
				if (Number(this.vehicleCategory) == 0) {
					this._revenueService.getTripChallanListByParty(partyId).subscribe(resp => {
						let selectedTripChallan = [];
						let tripChallanList = [];
						tripChallanList = resp['result'];
						if (tripChallanList.length > 0) {
							tripChallanList.forEach(item => {
								if (item.trip == this.tripId) {
									selectedTripChallan.push(item)
								}
							})
							this.tripChallansSelected(selectedTripChallan);
						}
					})
				}

				if (Number(this.vehicleCategory) == 1 || Number(this.vehicleCategory) == 2) {
					let jobData = this._tripDataService.makeInvoiceData
					this._tripDataService.makeInvoiceData = null
					if (jobData) {
						this.addInvoiceForm.controls['invoice_date'].setValue(jobData['invoiceDate']);
						this.addInvoiceForm.controls['invoice_number'].setValue(jobData['invoiceNumber']);
						if (Number(this.vehicleCategory) == 1) {
							this.patchCraneAndAwpFormJob(jobData, 'crane')
						}
						if (Number(this.vehicleCategory) == 2) {
							this.patchCraneAndAwpFormJob(jobData, 'awp')
						}
						this.calculationsChanged();
					}
				}
				if (Number(this.vehicleCategory) == 4) {
					this._revenueService.getTripChallanListByParty(partyId, 'container').subscribe(resp => {
						let selectedTripChallanForContainer = [];
						let tripChallanListForContainer = [];
						tripChallanListForContainer = resp['result'];
						if (tripChallanListForContainer.length > 0) {
							tripChallanListForContainer.forEach(item => {
								if (item.trip == this.tripId || this.pulloutAndDepositTripId.includes(item.trip)) {
									selectedTripChallanForContainer.push(item)
								}
							})
							this.tripChallansForContainerSelected(selectedTripChallanForContainer);
							this.calculationsChanged();
						}
					});
					const aggregatedJobData = {
						selectedChargeList: [] as any[],
						selectedDeductionList: [] as any[],
						selectedTimeSheetList: [] as any[],
					};
					let tripIds = [];
					tripIds.push(this.tripId, ...this.pulloutAndDepositTripId)
					tripIds.forEach((tripId: string) => {
						const jobData$ = forkJoin({
							charge: this._newTripV2Service.getJobCharges(tripId),
							deduction: this._newTripV2Service.getJobDeductions(tripId),
						});

						jobData$.subscribe({
							next: ({ charge, deduction }) => {
								aggregatedJobData.selectedChargeList.push(...(charge.result || []));
								aggregatedJobData.selectedDeductionList.push(...(deduction.result || []));
								this.patchCraneAndAwpFormJob(aggregatedJobData, 'container');
								this.calculationsChanged();
							},
						});
					});

				}

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
		this.clearAllOtherItems();
		this.calculationsChanged();
	}



	resetCraneAwpCargoContainerTableValues() {
		this.craneTimeSheet = {
			sheetList: [],
			selectedSheetList: []
		}
		this.awpTimeSheet = {
			sheetList: [],
			selectedSheetList: []
		}
		this.craneSOAdditionalCharge = {
			chargeList: [],
			selectedChargeList: []
		}
		this.awpSOAdditionalCharge = {
			chargeList: [],
			selectedChargeList: []
		}
		this.containerSOAdditionalCharge = {
			chargeList: [],
			selectedChargeList: []
		}
		this.craneCharges = {
			chargeList: [],
			selectedChargeList: []
		}
		this.awpCharges = {
			chargeList: [],
			selectedChargeList: []
		}
		this.othersSOAdditionalCharge = {
			chargeList: [],
			selectedChargeList: []
		}
		this.containerCharges = {
			chargeList: [],
			selectedChargeList: []
		}

		this.craneDeductions = {
			deductionList: [],
			selectedDeductionList: []
		}

		this.awpDeductions = {
			deductionList: [],
			selectedDeductionList: []
		}
		this.containerDeductions = {
			deductionList: [],
			selectedDeductionList: []
		}
		this.tripChallansListForContainer = [];
		this.buildJobDeductions([], 'awp')
		this.buildJobCharges([], 'awp')
		this.buildSOAdditionalCharges([], 'awp')
		this.buildJobTimeSheets([], 'awp')
		this.buildJobDeductions([], 'crane')
		this.buildJobCharges([], 'crane')
		this.buildSOAdditionalCharges([], 'crane')
		this.buildJobTimeSheets([], 'crane');
		this.buildJobDeductions([], 'container')
		this.buildJobCharges([], 'container')
		this.buildSOAdditionalCharges([], 'container')
	}

	getCraneAndAWPCargoContainerDetailsDetails() {
		switch (this.selectedCategory) {
			case 'crane':
				const craneTimeSheet = this._invoiceService.getTripCraneAwpTimesheetByParty('crane', this.partyId);
				const craneSOAdditionalCharge = this._invoiceService.getTripCraneAwpChargesByParty('crane', this.partyId);
				const craneCharges = this._invoiceService.getCraneAwpJobChargesByParty('crane', this.partyId)
				const craneDeductions = this._invoiceService.getCraneAwpJobDeductionsByParty('crane', this.partyId);
				forkJoin([craneTimeSheet, craneSOAdditionalCharge, craneCharges, craneDeductions]).subscribe(([sheetList, sochargeList, chargeList, deductionList]: any) => {
					this.craneTimeSheet.sheetList = sheetList['result']
					this.craneSOAdditionalCharge.chargeList = sochargeList['result']
					this.craneCharges.chargeList = chargeList['result']
					this.craneDeductions.deductionList = deductionList['result']
					if (isValidValue(this.invoiceId)) {
						this.craneTimeSheet.sheetList.push(...this.invoiceDetails['crane']['timesheets'])
						this.craneSOAdditionalCharge.chargeList.push(...this.invoiceDetails['crane']['additional_charges'])
						this.craneCharges.chargeList.push(...this.invoiceDetails['crane']['charges'])
						this.craneDeductions.deductionList.push(...this.invoiceDetails['crane']['deductions'])
					}
				});
				break;
			case 'awp':
				const awpTimeSheet = this._invoiceService.getTripCraneAwpTimesheetByParty('awp', this.partyId);
				const awpSOAdditionalCharge = this._invoiceService.getTripCraneAwpChargesByParty('awp', this.partyId);
				const awpCharges = this._invoiceService.getCraneAwpJobChargesByParty('awp', this.partyId)
				const awpDeductions = this._invoiceService.getCraneAwpJobDeductionsByParty('awp', this.partyId);
				forkJoin([awpTimeSheet, awpSOAdditionalCharge, awpCharges, awpDeductions]).subscribe(([sheetList, sochargeList, chargeList, deductionList]: any) => {
					this.awpTimeSheet.sheetList = sheetList['result']
					this.awpSOAdditionalCharge.chargeList = sochargeList['result']
					this.awpCharges.chargeList = chargeList['result']
					this.awpDeductions.deductionList = deductionList['result']
					if (isValidValue(this.invoiceId)) {
						this.awpTimeSheet.sheetList.push(...this.invoiceDetails['awp']['timesheets'])
						this.awpSOAdditionalCharge.chargeList.push(...this.invoiceDetails['awp']['additional_charges'])
						this.awpCharges.chargeList.push(...this.invoiceDetails['awp']['charges'])
						this.awpDeductions.deductionList.push(...this.invoiceDetails['awp']['deductions'])
					}
				})
				break;
			case 'cargo':
				this._invoiceService.getTripCraneAwpChargesByParty('others', this.partyId).subscribe((res) => {
					this.othersSOAdditionalCharge.chargeList = res['result'];
					if (isValidValue(this.invoiceId)) {
						this.othersSOAdditionalCharge.chargeList.push(...this.invoiceDetails['others']['additional_charges'])
					}
				});
				break;
			case 'container':
				const containerSOAdditionalCharge = this._invoiceService.getTripCraneAwpChargesByParty('container', this.partyId);
				const containerCharges = this._invoiceService.getCraneAwpJobChargesByParty('container', this.partyId)
				const containerDeductions = this._invoiceService.getCraneAwpJobDeductionsByParty('container', this.partyId);
				forkJoin([containerSOAdditionalCharge, containerCharges, containerDeductions]).subscribe(([sochargeList, chargeList, deductionList]: any) => {
					this.containerSOAdditionalCharge.chargeList = sochargeList['result']
					this.containerCharges.chargeList = chargeList['result']
					this.containerDeductions.deductionList = deductionList['result']
					if (isValidValue(this.invoiceId)) {
						this.containerSOAdditionalCharge.chargeList.push(...this.invoiceDetails['container']['additional_charges'])
						this.containerCharges.chargeList.push(...this.invoiceDetails['container']['charges'])
						this.containerDeductions.deductionList.push(...this.invoiceDetails['container']['deductions'])
					}
				})
				break;
			default:
				break;
		}
		this.activetabIndex = -1
		setTimeout(() => {
			this.activetabIndex = 0;
		}, 100);





	}

	onpaymentTermSelected(termId) {
		if (termId) {
			this.selectedPaymentTerm = getObjectFromList(termId, this.paymentTermList);
			if (termId == this.paymentTermCustom) {
				this.addInvoiceForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.inv_date, this.selectedParty['terms_days']));
			} else {
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

	onDateSelection() {
		this.inv_date = this.addInvoiceForm.controls['invoice_date'].value;
		let existingTerm = this.addInvoiceForm.controls['payment_term'].value;
		this.minDate = this.inv_date
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}

	getItemById(id: String, list: []): any {
		return list.filter((item: any) => item.id === id)[0];
	}

	challansSelected(ele) {
		this.apiError = '';
		this.calculationsChanged();
	}

	tripChallansSelected(ele) {
		this.apiError = '';

		this.tripChallanModelInline = false;
		if (ele.length > 0) {
			this.totals.advanceTotal = 0;
			this.totals.fuelTotal = 0;
			this.totals.battaAdvance = 0;
			this.tripChallanModelInline = true;
		}
		this.buildTripChallans(ele);
		this.calculationsChanged()
	}


	tripChallansForContainerSelected(ele) {
		this.tripChallanModelInlineForContainer = false;
		if (ele.length > 0) {
			this.totals.advanceTotal = 0;
			this.totals.fuelTotal = 0;
			this.totals.battaAdvance = 0;
			this.tripChallanModelInlineForContainer = true;
		}
		this.tripChallansListForContainer = [];
		this.selectedDocuemnts.containerTripChallans = [];
		this.buildTripChallansForCargoAndContainer(ele, 'container');
		this.calculationsChanged()
	}

	buildTripChallansForCargoAndContainer(items: any = [], type) {
		const challans = this.addInvoiceForm.controls[type].get('trip_challan') as UntypedFormArray;
		const existingchallan = challans.value;
		challans.controls = [];
		challans.updateValueAndValidity();
		items.forEach((item) => {
			item['tax'] = this.populateTaxSelectedForContainer;
			let arritem = getObjectFromListByKey('trip', item.trip, existingchallan);
			if (arritem) {
				item.adjustment = arritem.adjustment;
				item.freights = arritem.freights;
				item.freights_tax = arritem.freights_tax;
				item.charges = arritem.charges;
				item.charges_wo_tax = arritem.charges_wo_tax;
				item.charges_tax = arritem.charges_tax;
				item.charges_wt_tax = arritem.charges_wt_tax;
				item.deductions_wo_tax = arritem.deductions_wo_tax;
				item.deductions_tax = arritem.deductions_tax;
				item.deductions_wt_tax = arritem.deductions_wt_tax;
				item.deductions = arritem.deductions;
				item['tax'] = this.populateTaxSelectedForContainer

			}
			challans.push(addInvoiceTripChallan(item));
			this.tripChallansListForContainer.push(item)
		});
	}



	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}


	patchValue() {
		const tripChallans = this.addInvoiceForm.controls['others'].get('trip_challan') as UntypedFormArray;
		const tripChallansForContainer = this.addInvoiceForm.controls['container'].get('trip_challan') as UntypedFormArray;
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		tripChallans.controls.forEach((data) => {
			data.get('adjustment').value ? data.get('adjustment').value : data.get('adjustment').setValue(0);
			const index = this.existingTripChallanIds.indexOf(data.get('id').value, 0);
			if (index > -1) {
				this.existingTripChallanIds.splice(index, 1);
			}
		});
		const deletedTripChallans = this.addInvoiceForm.get('deleted_challans');
		this.existingTripChallanIds.forEach((ele) => {
			deletedTripChallans.push(this._fb.control(ele));
		});
		tripChallansForContainer.controls.forEach((data) => {
			data.get('adjustment').value ? data.get('adjustment').value : data.get('adjustment').setValue(0);
			const index = this.existingTripChallanIdsForContainer.indexOf(data.get('id').value, 0);
			if (index > -1) {
				this.existingTripChallanIdsForContainer.splice(index, 1);
			}
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
		if (form.valid) {
			if (this.creditRemaining.check_credit && this.creditRemaining.credit_remaining > 0) {
				const totalInvoiceAmount = Number(this.totals.total);
				if ((this.creditRemaining.credit_remaining - totalInvoiceAmount) < 0) {
					this.creditOnsaveLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount: ' + this.currency_type?.symbol + " " + this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
					this.creditOnsaveLimit.open = true;
				} else {
					this.invoiceOnSave();
				}
			} else {
				this.invoiceOnSave();
			}

		} else {
			setAsTouched(form);
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

	invoiceOnSave() {
		this.apiError = '';
		const form = this.addInvoiceForm;
		if (!isValidValue(this.invoiceId)) {
			this.apiHandler.handleRequest(this._invoiceService.saveInvoice(this.buildRequest(form)), 'Invoice added successfully!').subscribe(
				{
					next: (response) => {
						this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.INVOICE)
						this._router.navigateByUrl(this.preFixUrl + '/income/invoice/view/' + response['result']);
					},
					error: (err) => {
						this.apiError = '';
						if (err.error.status == 'error') {
							this.apiError = err.error.message;
							window.scrollTo(0, 0);
						}
					}
				}
			);
		} else {
			this.apiHandler.handleRequest(this._invoiceService.editInvoiceNote(this.buildRequest(form), this.invoiceId), 'Invoice updated successfully!').subscribe(
				{
					next: (response) => {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.INVOICE)
						this._router.navigateByUrl(this.preFixUrl + '/income/invoice/view/' + response['result']);
					},
					error: (err) => {
						this.apiError = '';
						if (err.error.status == 'error') {
							this.toggleItemOtherFilled(true);
							this.apiError = err.error.message;
							this._scrollToTop.scrollToTop();
							window.scrollTo(0, 0);
						}
					}
				}
			);
		}

	}


	saveAsDraft() {
		if (this.creditRemaining.check_credit && this.creditRemaining.credit_remaining >= 0) {
			const totalInvoiceAmount = Number(this.totals.total);
			if ((this.creditRemaining.credit_remaining - totalInvoiceAmount) < 0) {
				this.creditOnsaveAsDraftLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount:' + this.currency_type?.symbol + this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
				this.creditOnsaveAsDraftLimit.open = true;
			} else {
				this.invoiceSaveAsDraft();
			}
		} else {
			this.invoiceSaveAsDraft();
		}
	}

	invoiceSaveAsDraft() {
		this.patchValue();
		this.toggleItemOtherFilled();
		const form = this.addInvoiceForm as UntypedFormGroup;
		form.markAsUntouched();
		if (this.partyId) {
			if (!isValidValue(this.invoiceId)) {
				this.apiHandler.handleRequest(this._invoiceService.postInvoiceAsDraft(this.buildRequest(this.addInvoiceForm)), 'Invoice draft added successfully!').subscribe((response) => {
					if (this.addInvoiceForm.controls.party.value) {
					}
					this._router.navigateByUrl(this.preFixUrl + '/income/invoice/view/' + response['result']);

				});
			} else {
				this.apiHandler.handleRequest(this._invoiceService.putInvoiceAsDraft(this.buildRequest(this.addInvoiceForm), this.invoiceId), 'Invoice draft updated successfully!').subscribe((response) => {
					if (this.addInvoiceForm.controls.party.value) {
					}
					this._router.navigateByUrl(this.preFixUrl + '/income/invoice/view/' + response['result']);
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
		form.value['customfields'] = this.processCutsomFieldData(form.value['customfields'])
		form.value['category'] = this.categoryOptions[this.selectedCategory];
		return form.value;
	}

	processCutsomFieldData(customFieldData) {
		customFieldData.forEach((item) => {
			if (item['field_type'] == "checkbox") {
				if (item.value == "false" || item.value == false) {
					item['value'] = ''
				} else if (item.value == "true" || item.value == true) {
					item['value'] = 'true'
				}
			}
			if (item['field_type'] == "date") {
				item['value'] = changeDateToServerFormat(item['value'])
			}
		});

		return customFieldData
	}


	getAddress(event) {
		this.addInvoiceForm.controls['address'].patchValue(event);
	}

	calculateOtherFinalAmount(index) {
		this.calculationsChanged();
	}

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


	addNewExpenseType(event, itemExpenseControl: UntypedFormGroup, index: number) {
		const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
			data: {
				charge_name: event,
				isEdit: false,
				sales: false,
				purchase: false,
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
				this.getAdditionalCharges();
				itemExpenseControl.get('item').setValue(item?.name?.id);
				itemExpenseControl.get('units').setValue(item?.unit_of_measurement?.id);
				itemExpenseControl.get('tax').setValue(item?.tax?.id);
				itemExpenseControl.get('unit_cost').setValue(item?.rate);
				this.initialValues.items[index] = { label: item?.name?.name };
				this.initialValues.units[index] = { label: item?.unit_of_measurement?.label };
				this.initialValues.tax[index] = { label: item?.tax?.label };
			}

			dialogRefSub.unsubscribe();
		})
	}

	// round off amount
	roundOffAmount(formControl) {
		roundOffAmount(formControl);
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
			data.terms_and_condition = isValidValue(data.terms_and_condition) ? data.terms_and_condition.id : null
			data.reason = isValidValue(data.reason) ? data.reason.id : null;
			data?.others?.trip_challan_tax ? this.itemChallanCommonTax = { label: data?.others?.trip_challan_tax.label, value: data?.others?.trip_challan_tax.id } : this.itemChallanCommonTax = getNonTaxableOption();
			data['others']['trip_challan_tax'] = data?.others?.trip_challan_tax ? data?.others?.trip_challan_tax?.id : this.defaultTax;
			this.populateTaxSelected = data?.others?.trip_challan_tax;
			this.populateTaxSelectedForContainer = data?.container?.trip_challan_tax?.id;
			this.tripChallanCommonTaxForContainer = data.container.trip_challan_tax;
			data.container.trip_challan_tax = data?.container?.trip_challan_tax?.id;
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
				this.buildOtherItems([{}]);
			}

			if (data?.others?.trip_challan.length > 0) {
				this.tripChallanModelInline = true;
				this.initialValues.tripChallanTax = [];
				data?.others?.trip_challan.forEach((challan) => {
					if (isValidValue(challan.tax)) {
						this.initialValues.tripChallanTax.push({ label: challan.tax.label, value: challan.tax.id });
					} else {
						this.initialValues.tripChallanTax.push(getNonTaxableOption());
					}
					this.existingTripChallanIds.push(challan.id);
					challan = isValidValue(challan) ? challan : '';
					challan.tax = isValidValue(challan.tax) ? challan.tax.id : getNonTaxableOption().value;
				});
				this.buildTripChallans(data?.others?.trip_challan);
			}
			else {
				this.tripChallanModelInline = false;
			}
			if (data.container.trip_challan.length > 0) {
				this.tripChallanModelInlineForContainer = true;
				data.container.trip_challan.forEach((challan) => {
					this.existingTripChallanIdsForContainer.push(challan.id);
					challan = isValidValue(challan) ? challan : '';
					challan.tax = isValidValue(challan.tax) ? challan.tax.id : getNonTaxableOption().value;
				});
				this.tripChallansListForContainer = [];
				this.selectedDocuemnts.containerTripChallans = [];
				this.buildTripChallansForCargoAndContainer(data.container.trip_challan, 'container');
			}
			else {
				this.tripChallanModelInlineForContainer = false;
			}
			this.addInvoiceForm.patchValue(data);
			this.getAdditionalCharges();
			this.patchCraneAndAwpAndCargoAndContainer(data, 'awp')
			this.patchCraneAndAwpAndCargoAndContainer(data, 'crane')
			this.patchCraneAndAwpAndCargoAndContainer(data, 'container')
			this.othersSOAdditionalCharge.selectedChargeList = data['others']['additional_charges'];
			this.buildSOAdditionalCharges(data['others']['additional_charges'], 'others')
			this.getSelectedDocumentForthisTripForCargoAndContainer('container');
			setTimeout(() => {
				this.selectedTripDoc.next(data.attached_document_types?.other);
				this.selectedTripDocForContainer.next(data.attached_document_types?.container.jobs)
				this.calculationsChanged();
			}, 1000);
			this.addCustomFields(this.invoiceDetails['customfields'])
		}
	}

	patchCraneAndAwpAndCargoAndContainer(data, type) {

		if (data[type]['additional_charges'].length > 0) {
			if (type == 'awp') {
				this.awpSOAdditionalCharge.selectedChargeList = data[type]['additional_charges'];
			}
			if (type == 'crane') {
				this.craneSOAdditionalCharge.selectedChargeList = data[type]['additional_charges'];
			}
			if (type == 'container') {
				this.containerSOAdditionalCharge.selectedChargeList = data[type]['additional_charges'];
			}
			if (type == 'others') {
				this.othersSOAdditionalCharge.selectedChargeList = data[type]['additional_charges'];
			}
			this.buildSOAdditionalCharges(data[type]['additional_charges'], type)
		}
		if (data[type]['charges'].length > 0) {
			if (type == 'awp') {
				this.awpCharges.selectedChargeList = data[type]['charges'];
			}
			if (type == 'crane') {
				this.craneCharges.selectedChargeList = data[type]['charges'];
			}
			if (type == 'container') {
				this.containerCharges.selectedChargeList = data[type]['charges'];
			}
			this.buildJobCharges(data[type]['charges'], type)
		}

		if (data[type]['deductions'].length > 0) {
			if (type == 'awp') {
				this.awpDeductions.selectedDeductionList = data[type]['deductions'];
			}
			if (type == 'crane') {
				this.craneDeductions.selectedDeductionList = data[type]['deductions'];
			}
			if (type == 'container') {
				this.containerDeductions.selectedDeductionList = data[type]['deductions'];
			}
			this.buildJobDeductions(data[type]['deductions'], type)
		}
		if (data[type]?.timesheets?.length > 0) {
			if (type == 'awp') {
				this.awpTimeSheet.selectedSheetList = data[type]['timesheets'];
			}
			if (type == 'crane') {
				this.craneTimeSheet.selectedSheetList = data[type]['timesheets'];
			}
			this.buildJobTimeSheets(data[type]['timesheets'], type)
		}
		if (type != 'container') {
			this.addInvoiceForm.get(type).get('timesheet_tax').setValue(data[type]['timesheet_tax']['id'])
		}
		if (type == 'awp') {
			this.initialValues.awpTax = this.taxOptions.find(tax => tax.id == data[type]['timesheet_tax']['id'])
		}
		if (type == 'crane') {
			this.initialValues.craneTax = this.taxOptions.find(tax => tax.id == data[type]['timesheet_tax']['id'])
		}
	}

	patchCraneAndAwpFormJob(data, type) {

		if (data.selectedChargeList.length > 0) {
			if (type == 'awp') {
				this.awpCharges.selectedChargeList = data.selectedChargeList;
			}
			if (type == 'crane') {
				this.craneCharges.selectedChargeList = data.selectedChargeList;
			}
			if (type == 'container') {
				this.containerCharges.selectedChargeList = data.selectedChargeList;
			}
			this.buildJobCharges(data.selectedChargeList, type)
		}

		if (data.selectedDeductionList.length > 0) {
			if (type == 'awp') {
				this.awpDeductions.selectedDeductionList = data.selectedDeductionList;
			}
			if (type == 'crane') {
				this.craneDeductions.selectedDeductionList = data.selectedDeductionList;
			}
			if (type == 'container') {
				this.containerDeductions.selectedDeductionList = data.selectedDeductionList;
			}
			this.buildJobDeductions(data.selectedDeductionList, type)
		}
		if (data.selectedTimeSheetList.length > 0) {
			if (type == 'awp') {
				this.awpTimeSheet.selectedSheetList = data.selectedTimeSheetList;
			}
			if (type == 'crane') {
				this.craneTimeSheet.selectedSheetList = data.selectedTimeSheetList;
			}
			this.buildJobTimeSheets(data.selectedTimeSheetList, type)
		}
	}

	getFormValues(invoiceDetails) {
		this.invoiceDetails = invoiceDetails;
		this.minDate = invoiceDetails.invoice_date;
		this._invoiceService.checkJobsByCustomer(this.invoiceDetails.party.id, this.invoiceId).subscribe(resp => {
			this.makeActiveAccordingToCategory(resp['result'])
		})
		this._partyService.getPartyAdressDetails(this.invoiceDetails.party.id).subscribe(
			res => {
				this.gstin = res.result.tax_details.gstin;
				this.selectedParty = res['result']
				this.selectedParty['address'] = this.invoiceDetails['address']
			});
		this.partyId = this.invoiceDetails.party.id;
		this.getCraneAndAWPCargoContainerDetailsDetails();
		this.finalAdjustment = this.invoiceDetails.total_adjustment;
		this.partyId = this.invoiceDetails.party ? this.invoiceDetails.party.id : null
		this.totals.total = this.invoiceDetails.total_amount
		this.totals.battaAdvance = Number(this.invoiceDetails.trip_advance_data.batta).toFixed(3);
		this.totals.advanceTotal = Number(this.invoiceDetails.trip_advance_data.advance).toFixed(3);
		this.totals.fuelTotal = Number(this.invoiceDetails.trip_advance_data.fuel).toFixed(3);
		this.partyNamePatch(this.invoiceDetails);
		this.employeePatch(this.invoiceDetails);
		this.paymentTermPatch(this.invoiceDetails.payment_term);
		this.bankAccountPatch(this.invoiceDetails.bank_account);
		this.patchSignature(this.invoiceDetails.signature)
		this.itemOtherPatch(this.invoiceDetails);
		this.patchTermsAndConditions(this.invoiceDetails);
		this.getContactPersonList(this.partyId)
		this.patchFormValues(this.invoiceDetails);
		this.patchDocuments(this.invoiceDetails);

		setTimeout(() => {
			this.calculationsChanged();
		}, 1000);
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
	patchTermsAndConditions(invoiceDetails) {
		if (invoiceDetails.terms_and_condition) {
			this.initialValues.termsAndCondition['value'] = invoiceDetails.terms_and_condition.id,
				this.initialValues.termsAndCondition['label'] = invoiceDetails.terms_and_condition.name
		} else {
			this.initialValues.termsAndCondition = getBlankOption()
		}
	}

	patchOtherItems(items: any = []) {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		otherItems.controls = [];
		otherItems.updateValueAndValidity();
		items.forEach(item => {
			otherItems.push(addOtherItem(item));
		});
		this.calculationsChanged();
	}

	onSelectPopulateTax(value) {
		if (value) {
			this.populateTaxSelected = value
			const tax = getObjectFromList(value, this.taxOptions);
			if (tax) {
				this.tripChallanCommonTax = { label: tax.label, value: tax.id };
				this.initialValues.tripChallanTax.fill({ label: tax.label, value: tax.id });
				const challanTrips = this.addInvoiceForm.get('others').controls['trip_challan'] as UntypedFormArray;
				challanTrips.controls.forEach(element => {
					element.get('tax').setValue(tax.id);
				});

			}
			this.calculationsChanged();
		}
	}


	onSelectPopulateTaxForContainer(value) {
		if (value) {
			this.populateTaxSelectedForContainer = value
			const tax = getObjectFromList(value, this.taxOptions);
			if (tax) {
				this.tripChallanCommonTaxForContainer = { label: tax.label, value: tax.id };
				const challanTrips = this.addInvoiceForm.get('container').controls['trip_challan'] as UntypedFormArray;
				challanTrips.controls.forEach(element => {
					element.get('tax').setValue(tax.id);
				});

			}
			this.calculationsChanged();
		}
	}

	onSelectTimeSheetTax(type) {
		const timesheet = this.addInvoiceForm.get(type).get('timesheet_tax').value
		if (type == 'awp') {
			this.initialValues.awpTax = this.taxOptions.find(tax => tax.id == timesheet)
		}
		if (type == 'crane') {
			this.initialValues.craneTax = this.taxOptions.find(tax => tax.id == timesheet)
		}
		this.calculationsChanged()
	}

	taxValueChanged(type, index) {
		const charges = (this.addInvoiceForm.get(type).get('charges') as UntypedFormArray).at(index);
		const taxVal = this.taxOptions.find(tax => tax.id == charges.get('tax').value)
		if (taxVal) {
			charges.get('tax_label').setValue(taxVal.label)
		}

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
			this.taxOptions = result.result['tax'];
			this.totals.taxes = this.taxOptions;
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

	setFreightValueToChallanForContainer(tripId, value) {
		let tripChallans = this.addInvoiceForm.get('container').get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('freights').setValue(value);
			this.calculationsChanged();
		}
	}
	setFreightValueToChallan(tripId, value) {

		let tripChallans = this.addInvoiceForm.get('others').controls['trip_challan'] as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('freights').setValue(value);
			this.calculationsChanged();
		}
	}

	editCompleteTripFreight(event) {
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
		let customer = this.addInvoiceForm.get('party').value;
		if (id) {
			this.isAddExpense = true;
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				let charges = res.result['revenue']['charges']
				charges['id'] = id
				extras.id = id
				extras['customerId'] = customer
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
			this.isAddExpense = false;
			let customer = this.addInvoiceForm.get('party').value;
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				extras.id = id
				extras['customerId'] = customer
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

	setAddChargeValueToChallan(tripId, value) {
		let tripChallans = this.addInvoiceForm.get('others').controls['trip_challan'] as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('charges_wt_tax').setValue(value['wt_tax']);
			formChallan.get('charges_wo_tax').setValue(value['wo_tax']);
			formChallan.get('charges_tax').setValue(value['tax']);
			formChallan.get('charges').setValue(value['wo_tax'] + value['wt_tax'] + value['tax'])

			this.calculationsChanged();
		}
	}

	setReduceChargeValueToChallan(tripId, value) {
		let tripChallans = this.addInvoiceForm.get('others').controls['trip_challan'] as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('deductions_wo_tax').setValue(value['wo_tax']);
			formChallan.get('deductions_wt_tax').setValue(value['wt_tax']);
			formChallan.get('deductions_tax').setValue(value['tax']);
			formChallan.get('deductions').setValue(value['wo_tax'] + value['wt_tax'] + value['tax'])
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


	getContactPersonList(id) {
		this._partyService.getContactPersonList(id).subscribe(data => {
			this.contactPersonList = data['result'].contact_person;
			if (!isValidValue(this.invoiceId)) {
				this.patchDefaultContactPerson()
			}
		})
	}

	setContactPerson(contactPerson) {
		if (!isValidValue(contactPerson)) return
		this.addInvoiceForm.get('contact_person_name').setValue(contactPerson.display_name)
		this.addInvoiceForm.get('country_code').setValue(contactPerson.country_code)
		this.addInvoiceForm.get('contact_person_no').setValue(contactPerson.contact_person_no);
	}

	setContactPersons(contactPerson) {
		if (contactPerson.trim()) {
			this.addInvoiceForm.get('contact_person_name').setValue(contactPerson);
		} else {
			this.addInvoiceForm.get('country_code').setValue(getCountryCode(this.countryId))
			this.addInvoiceForm.get('contact_person_no').setValue('');
		}
	}

	onContactPersonChange() {
		let contactPersonName = this.addInvoiceForm.get('contact_person_name').value
		let cpObj = this.contactPersonList.find((item) => item.display_name == contactPersonName)
		if (cpObj) {
			this.addInvoiceForm.get('country_code').setValue(cpObj.country_code)
			this.addInvoiceForm.get('contact_person_no').setValue(cpObj.contact_person_no);
		}
	}
	clearContactPerson() {
		this.addInvoiceForm.get('contact_person_name').setValue('')
	}

	patchDefaultContactPerson() {
		this.clearContactPerson();
		const defaultContact = this.contactPersonList.find((item) => item.default == true)
		if (defaultContact) {
			this.setContactPerson(defaultContact)
		}
	}


	getDigitalSignatureList() {
		this._commonService.getDigitalSignatureList().subscribe(data => {
			this.digitalSignature = data['result']['data']
		})
	}

	onCreditLimitOnSave(e) {
		if (e) {
			this.invoiceOnSave();
		}
	}

	onCreditLimitOnSaveDraft(e) {
		if (e) {
			this.invoiceSaveAsDraft();
		}
	}

	selectedDocuments(e) {
		this.addInvoiceForm.get('attached_document_types').get('other').setValue(e);
		setTimeout(() => {
			this.getSelectedDocumentForthisTrip()
		},100)
	}

	selectedDocumentsForContainer(e) {
		this.addInvoiceForm.get('attached_document_types').get('container').get('jobs').setValue(e);
		setTimeout(() => {
			this.getSelectedDocumentForthisTripForCargoAndContainer('container');
		},100)
	}

	getSelectedDocumentForthisTrip() {
		let selectedDocs = this.addInvoiceForm.get('attached_document_types').get('other').value;

		if (selectedDocs.length) {
			this.tripChallansList.forEach((tripDetails, index) => {
				this.selectedDocumentInTrip[index] = [];
				selectedDocs.forEach(documentName => {
					if (!tripDetails.documents_name.includes(documentName)) {
						this.selectedDocumentInTrip[index].push(documentName)
					}
				});
			});
		}
	}

	getSelectedDocumentForthisTripForCargoAndContainer(type) {
		let selectedDocs = this.addInvoiceForm.get('attached_document_types').get(type).get('jobs').value;
		if (selectedDocs.length) {
			type === 'container' && this.tripChallansListForContainer.forEach((tripDetails, index) => {
				this.selectedDocuemnts.containerTripChallans[index] = [];
				selectedDocs.forEach(documentName => {
					if (!tripDetails.documents_name.includes(documentName)) {
						this.selectedDocuemnts.containerTripChallans[index].push(documentName)
					}
				});
			});
		}
	}


	openDescriptionPopup() {
		this.openDescription.next(true)
		this.openManageDescription.next(false)
	}

	openDescriptionPopupForContainer() {
		this.openDescriptionForContainer.next(true)
		this.openManageDescriptionForContainer.next(false)
	}

	openManageDescriptionPopup() {
		this.openManageDescription.next(true)
		this.openDescription.next(false)
	}

	openManageDescriptionPopupForContainer() {
		this.openManageDescriptionForContainer.next(true)
		this.openDescriptionForContainer.next(false)
	}

	handleSaveClick() {
		this.saveButton = !this.saveButton;
	}
	handleSpanClick() {

		this.handleSaveClick()
	}

	openCraneAwpTimeSheet(type) {
		let timeSheetList = [];
		let timeSheetSelectedList = [];
		if (type == 'crane') {
			timeSheetList = this.craneTimeSheet.sheetList
			timeSheetSelectedList = this.craneTimeSheet.selectedSheetList

		}
		if (type == 'awp') {
			timeSheetList = this.awpTimeSheet.sheetList
			timeSheetSelectedList = this.awpTimeSheet.selectedSheetList
			if (timeSheetSelectedList.length > 0) {
				this.billingUnitAwp = timeSheetSelectedList[0].billing_unit
			}
		}
		const dialogRef = this.dialog.open(CraneTripChallanComponent, {
			width: '1200px',
			maxWidth: '85%',
			data: {
				timeSheetList: timeSheetList,
				timeSheetSelectedList: timeSheetSelectedList
			},
			closeOnNavigation: true,
			disableClose: true,
			autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
			if (result !== 'close') {
				if (type == 'crane') {
					this.craneTimeSheet.selectedSheetList = result
					this.buildJobTimeSheets(result, 'crane')
				}
				if (type == 'awp') {
					this.awpTimeSheet.selectedSheetList = result
					this.buildJobTimeSheets(result, 'awp')
				}
				this.calculationsChanged()

			}
			dialogRefSub.unsubscribe()
		});
	}

	openCraneAwpAdditionalCharges(type) {
		let chargeList = [];
		let selectedChargeList = [];
		if (type == 'crane') {
			chargeList = this.craneSOAdditionalCharge.chargeList
			selectedChargeList = this.craneSOAdditionalCharge.selectedChargeList
		}
		if (type == 'awp') {
			chargeList = this.awpSOAdditionalCharge.chargeList
			selectedChargeList = this.awpSOAdditionalCharge.selectedChargeList
		}
		if (type == 'container') {
			chargeList = this.containerSOAdditionalCharge.chargeList
			selectedChargeList = this.containerSOAdditionalCharge.selectedChargeList
		}
		if (type == 'others') {
			chargeList = this.othersSOAdditionalCharge.chargeList
			selectedChargeList = this.othersSOAdditionalCharge.selectedChargeList
		}
		const dialogRef = this.dialog.open(SalesOrderAdditionalChargesComponent, {
			width: '1200px',
			maxWidth: '85%',
			data: {
				additionalChargesList: cloneDeep(chargeList),
				chargesSelectedList: cloneDeep(selectedChargeList),
				type: type
			},
			closeOnNavigation: true,
			disableClose: true,
			autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
			if (result !== 'close') {
				if (type == 'crane') {
					this.craneSOAdditionalCharge.selectedChargeList = result
					this.buildSOAdditionalCharges(result, 'crane')
				}

				if (type == 'awp') {
					this.awpSOAdditionalCharge.selectedChargeList = result
					this.buildSOAdditionalCharges(result, 'awp')
				}

				if (type == 'container') {
					this.containerSOAdditionalCharge.selectedChargeList = result
					this.buildSOAdditionalCharges(result, 'container')
				}
				if (type == 'others') {
					this.othersSOAdditionalCharge.selectedChargeList = result
					this.buildSOAdditionalCharges(result, 'others')
				}
				this.calculationsChanged()

			}


			dialogRefSub.unsubscribe()
		});
	}

	openCraneAwpCharges(type) {
		let chargeList = [];
		let selectedChargeList = [];
		let selectedDocs = [];

		if (type == 'crane') {
			chargeList = this.craneCharges.chargeList
			selectedChargeList = this.craneCharges.selectedChargeList,
				selectedDocs = this.addInvoiceForm.get('attached_document_types').get('crane').get('charge').value;
		}
		if (type == 'awp') {
			chargeList = this.awpCharges.chargeList
			selectedChargeList = this.awpCharges.selectedChargeList;
			selectedDocs = this.addInvoiceForm.get('attached_document_types').get('awp').get('charge').value;
		}
		if (type == 'container') {
			chargeList = this.containerCharges.chargeList
			selectedChargeList = this.containerCharges.selectedChargeList;
			selectedDocs = this.addInvoiceForm.get('attached_document_types').get('container').get('charge').value;
		}

		const dialogRef = this.dialog.open(CraneChargesComponent, {
			width: '1200px',
			maxWidth: '85%',
			height: 'auto',
			data: {
				chargesList: chargeList,
				chargesSelectedList: selectedChargeList,
				selectedDocs: selectedDocs,
				showDocuments: true,
				showAdjustment: false
			},
			closeOnNavigation: true,
			disableClose: true,
			autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
			if (result !== 'close') {
				if (type == 'crane') {
					this.craneCharges.selectedChargeList = result.selectedCharge;
					this.addInvoiceForm.get('attached_document_types').get('crane').get('charge').setValue(result.selectedDocument);
					this.buildJobCharges(result.selectedCharge, 'crane');

				}
				if (type == 'awp') {
					this.awpCharges.selectedChargeList = result.selectedCharge
					this.addInvoiceForm.get('attached_document_types').get('awp').get('charge').setValue(result.selectedDocument);
					this.buildJobCharges(result.selectedCharge, 'awp');
				};
				if (type == 'container') {
					this.containerCharges.selectedChargeList = result.selectedCharge
					this.addInvoiceForm.get('attached_document_types').get('container').get('charge').setValue(result.selectedDocument);
					this.buildJobCharges(result.selectedCharge, 'container');
				};
				this.calculationsChanged()
			}
			dialogRefSub.unsubscribe()
		});
	}

	openCraneAwpDeductions(type) {
		let deductionList = [];
		let selectedDeductionList = [];
		let selectedDocs = [];


		if (type == 'crane') {
			deductionList = this.craneDeductions.deductionList
			selectedDeductionList = this.craneDeductions.selectedDeductionList;
			selectedDocs = this.addInvoiceForm.get('attached_document_types').get('crane').get('deduction').value;
		}

		if (type == 'awp') {
			deductionList = this.awpDeductions.deductionList
			selectedDeductionList = this.awpDeductions.selectedDeductionList;
			selectedDocs = this.addInvoiceForm.get('attached_document_types').get('awp').get('deduction').value;
		}
		if (type == 'container') {
			deductionList = this.containerDeductions.deductionList
			selectedDeductionList = this.containerDeductions.selectedDeductionList;
			selectedDocs = this.addInvoiceForm.get('attached_document_types').get('container').get('deduction').value;
		}
		const dialogRef = this.dialog.open(CraneDeductionsComponent, {
			width: '1200px',
			maxWidth: '85%',
			data: {
				deductionsList: deductionList,
				deductionsSelectedList: selectedDeductionList,
				selectedDocs: selectedDocs,
				showDocuments: true,
				showAdjustment: false
			},
			closeOnNavigation: true,
			disableClose: true,
			autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
			if (result !== 'close') {
				if (type == 'crane') {
					this.craneDeductions.selectedDeductionList = result?.selectedCharge;
					this.addInvoiceForm.get('attached_document_types').get('crane').get('deduction').setValue(result.selectedDocument);
					this.buildJobDeductions(result.selectedCharge, 'crane')
				}

				if (type == 'awp') {
					this.awpDeductions.selectedDeductionList = result?.selectedCharge
					this.addInvoiceForm.get('attached_document_types').get('awp').get('deduction').setValue(result.selectedDocument);
					this.buildJobDeductions(result.selectedCharge, 'awp');
				};
				if (type == 'container') {
					this.containerDeductions.selectedDeductionList = result?.selectedCharge
					this.addInvoiceForm.get('attached_document_types').get('container').get('deduction').setValue(result.selectedDocument);
					this.buildJobDeductions(result.selectedCharge, 'container');
				};
				this.calculationsChanged()
			}
			dialogRefSub.unsubscribe()
		});
	}

	getSelectedDocumentFromCharges() {
		let craneChargesSelectedDocs = this.addInvoiceForm.get('attached_document_types').get('crane').get('charge').value;
		let awpChargesSelectedDocs = this.addInvoiceForm.get('attached_document_types').get('awp').get('charge').value;
		let containerChargesSelectedDocs = this.addInvoiceForm.get('attached_document_types').get('container').get('charge').value;
		if (craneChargesSelectedDocs?.length) {
			this.craneCharges.selectedChargeList.forEach((charge, index) => {
				this.selectedDocuemnts.crane_charges[index] = [];
				craneChargesSelectedDocs.forEach(documentName => {
					if (!charge.document_name.includes(documentName)) {
						this.selectedDocuemnts.crane_charges[index].push(documentName)
					}
				});
			});
		}
		if (awpChargesSelectedDocs?.length) {
			this.awpCharges.selectedChargeList.forEach((charge, index) => {
				this.selectedDocuemnts.awp_charges[index] = [];
				awpChargesSelectedDocs.forEach(documentName => {
					if (!charge.document_name.includes(documentName)) {
						this.selectedDocuemnts.awp_charges[index].push(documentName)
					}
				});
			});
		}
		if (containerChargesSelectedDocs?.length) {
			this.containerCharges.selectedChargeList.forEach((charge, index) => {
				this.selectedDocuemnts.containerCharges[index] = [];
				containerChargesSelectedDocs.forEach(documentName => {
					if (!charge.document_name.includes(documentName)) {
						this.selectedDocuemnts.containerCharges[index].push(documentName)
					}
				});
			});
		}

	}

	getSelectedDocumentFromDeductions() {
		let craneDeductionSelectedDocs = this.addInvoiceForm.get('attached_document_types').get('crane').get('deduction').value;
		let awpDeductionSelectedDocs = this.addInvoiceForm.get('attached_document_types').get('awp').get('deduction').value;
		let containerDeductionSelectedDocs = this.addInvoiceForm.get('attached_document_types').get('container').get('deduction').value;

		if (craneDeductionSelectedDocs?.length) {
			this.craneDeductions.selectedDeductionList.forEach((charge, index) => {
				this.selectedDocuemnts.crane_deductions[index] = [];
				craneDeductionSelectedDocs.forEach(documentName => {
					if (!charge.document_name.includes(documentName)) {
						this.selectedDocuemnts.crane_deductions[index].push(documentName)
					}
				});
			});
		}
		if (awpDeductionSelectedDocs?.length) {
			this.awpDeductions.selectedDeductionList.forEach((charge, index) => {
				this.selectedDocuemnts.awp_deductions[index] = [];
				awpDeductionSelectedDocs.forEach(documentName => {
					if (!charge.document_name.includes(documentName)) {
						this.selectedDocuemnts.awp_deductions[index].push(documentName)
					}
				});
			});
		}
		if (containerDeductionSelectedDocs?.length) {
			this.containerDeductions.selectedDeductionList.forEach((charge, index) => {
				this.selectedDocuemnts.containerDeductions[index] = [];
				containerDeductionSelectedDocs.forEach(documentName => {
					if (!charge.document_name.includes(documentName)) {
						this.selectedDocuemnts.containerDeductions[index].push(documentName)
					}
				});
			});
		}
	}
}

