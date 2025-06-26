import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PartyType, ValidationConstants, VendorType } from 'src/app/core/constants/constant';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { OperationsActivityService } from '../../api-services/operation-module-service/operations-activity.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { isValidValue, getObjectFromList, getMinOrMaxDate, getBlankOption, getNonTaxableOption, getObjectFromListByKey, checkEmptyDataKey } from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { PaymentDueDateCalculator, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { FleetOwnerClass } from './fleet-owner-class/fleet-owner.class';
import { FleetOwnerClassService } from './fleet-owner-class/fleet-owner.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { NewTripService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { NewTripV2Service } from '../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getEmployeeObject } from '../../master-module/employee-module/employee-utils';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { CompanyModuleServices } from '../../api-services/company-service/company-module-service.service';
import { NewTripV2DataService } from '../new-trip-v2/new-trip-v2-dataservice';
import { CraneChargesComponent } from '../../revenue-module/invoice-trip-challan-module/crane-charges/crane-charges.component';
import { CraneDeductionsComponent } from '../../revenue-module/invoice-trip-challan-module/crane-deductions/crane-deductions.component';
import { CraneTripChallanComponent } from '../../revenue-module/invoice-trip-challan-module/crane-trip-challan/crane-trip-challan.component';
import { Dialog } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupComponent } from '../../master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { RateCardService } from '../../api-services/master-module-services/rate-card-service/rate-card.service';
import { debounceTime } from 'rxjs/operators';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';



@Component({
	selector: 'app-edit-fleet-owner-expenses',
	templateUrl: './fleet-owner-expenses.component.html',
	styleUrls: ['./fleet-owner-expenses.component.scss']
})
export class FleetOwnerExpensesComponent extends FleetOwnerClass implements OnInit, OnDestroy, AfterViewInit {

	terminology: any;
	mechanicActivityForm: UntypedFormGroup;
	expenseItemDropdownIndex: number = -1;
	employeeList: any = [];
	staticOptions: any = {};
	vendorList: any = [];
	accountList: any = [];
	apiError: string;
	bankingChargeRequired: Boolean = false;
	vendorSelected: any = {};
	newMechanicTotals: any = {
		taxes: [],
		total: 0,
	};
	selectedPaymentTerm: any;
	BillDate: any;
	materialList: any = [];
	fleetExpenseId: any;
	fleetExpenseEditdata: any;
	paymentAccountList: any = [];
	isDueDateRequired = false;
	initialValues: any = {
		vendor: getBlankOption(),
		gstTreatment: getBlankOption(),
		placeOfSupply: getBlankOption(),
		paymentTerm: getBlankOption(),
		tax: [],
		expenseAccount: [],
		item: [],
		taxPercent: [],
		tripChallanTax: [getNonTaxableOption()],
		employee: getBlankOption(),
		units: [getBlankOption()],
		craneTax : getNonTaxableOption(),
		awpTax : getNonTaxableOption()
	};
	otherExpensesItemParams: any = {
		name: '',
	};
	vendorId: string;
	gstin: any = "";
	companyRegistered: boolean = true;
	disableTax: boolean = false;
	defaultTax = new ValidationConstants().defaultTax;
	minDate: Date;
	showAddExpenseItemPopup: any = { name: '', status: false };
	expenseAccountList: any = [];
	otherExpenseValidatorSub: Subscription;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	errorHeaderMessage = new ErrorList().headerMessage;
	isAdd: boolean = false;
	currency_type;
	patchFileUrls = new BehaviorSubject([]);
	showAddVendorPopup: any = { name: '', status: false };
	vendorNamePopup: string = '';
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
	
	partyTaxDetails = new BehaviorSubject<any>(this.partyDetailsData);
	
	lastSectionTaxDetails = new BehaviorSubject<any>({data : []});
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
	showFreightPopupForLooseCargo = {
		type: '',
		show: false,
		data: {},
		extras: { id: '' }
	}
	tripId = '';
	isTdsDecleration = false;
	isWOEmpty: boolean = false;
	isTds = false;
	policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	doTripChallanExists: boolean = false;
	isPaymentstatusValid = true;
	$paymentStatusValid = new BehaviorSubject(true);
	openDescription = new Subject()
	openManageDescription = new Subject()
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/hjCYjPtLfY7LntvUna3s?embed%22"
	};
	paymentTermCustom = new ValidationConstants().paymentTermCustom;
	isAddExpense=false;
	countryId;
	contactPersonList = [];
	countryPhoneCode = [];
	vehicleCategory=''
	activetabIndex=0;

	craneTabActiveIndex = 1;
	awpTabActiveIndex = 1;
	craneTimeSheet = {
		sheetList: [],
		selectedSheetList: []
	}
	craneCharges = {
		chargeList: [],
		selectedChargeList: []
	}
	craneDeductions = {
		deductionList: [],
		selectedDeductionList: []
	}
	awpTimeSheet = {
		sheetList: [],
		selectedSheetList: []
	}
	awpCharges = {
		chargeList: [],
		selectedChargeList: []
	}
	awpDeductions = {
		deductionList: [],
		selectedDeductionList: []
	}
	looseCargoDeductions = {
		deductionList: [],
		selectedDeductionList: []
	}
	looseCargoCharges = {
		chargeList: [],
		selectedChargeList: []
	}
	containerDeductions = {
		deductionList: [],
		selectedDeductionList: []
	}
	containerCharges = {
		chargeList: [],
		selectedChargeList: []
	}
	isCarneDataAvailable = false;
	isAWPDataAvailable = false;
	isOthersDataAvailable = false;
	isContainerDataAvailable = false;

	totals: any = {
		discountAfterTaxTotal: 0,
		tdsAmount: 0,
		balance: 0.0,
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
		looseCargo: {
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
		looseCargoCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		looseCargoDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			discountTotal: 0.00
		},
		containerCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		containerDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			discountTotal: 0.00
		},
		taxes: []
	};
	doTripChallanExistsForLoosecargo : boolean = false;
    tripChallanCommonTaxForLooseCargo : any = getNonTaxableOption();
	itemChallanCommonTax: any = getNonTaxableOption();
    tripChallanModelInlineForLooseCargo: boolean = false;
    populateTaxSelectedForLooseCargo = "";
    populateTaxSelectedForOthers = "";
    openDescriptionForLooseCargo = new Subject()
    openManageDescriptionForLooseCargo = new Subject();
    looseCargoTabActiveIndex = 1;
    isLooseCargoDataAvailable = false;
	tripChallansListForLooseCargo : any = [];


	doTripChallanExistsForContainer : boolean = false;
    tripChallanCommonTaxForContainer : any = getNonTaxableOption();
    tripChallanModelInlineForContainer: boolean = false;
    populateTaxSelectedForContainer = "";
    openDescriptionForContainer = new Subject()
    openManageDescriptionForContainer = new Subject();
    containerTabActiveIndex = 1;
	tripChallansListForContainer: any = [];
	billingUnitCrane:'day'|'hour'='hour';
	billingUnitAwp:'day'|'hour'='hour';

	constructor(private _fb: UntypedFormBuilder,
		private _terminologiesService: TerminologiesService,
		private _commonService: CommonService,
		private _partyService: PartyService,
		private _activatedRoute: ActivatedRoute,
		private _operationsActivityService: OperationsActivityService,
		private _revenueService: RevenueService,
		private currency: CurrencyService,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _fleetOwnerClassService: FleetOwnerClassService,
		private _prefixUrl: PrefixUrlService,
		private _tripService: NewTripService,
		private _popupBodyScrollService: popupOverflowService,
		private _analytics: AnalyticsService,
		private _newTripV2Service: NewTripV2Service,
		private _scrollToTop: ScrollToTop,
		private commnloaderservice: CommonLoaderService,
		private _countryId : CountryIdService,
		private _companyModuleService: CompanyModuleServices,
		private _tripDataService: NewTripV2DataService,
		private _rateCardService : RateCardService,
		public dialog: Dialog,
		private apiHandler: ApiHandlerService,
		private _commonLoaderService : CommonLoaderService,
		private _route: Router) {
		super();
		this.isTax = this._tax.getTax();
		this.isTds = this._tax.getVat();
		this.getTaxDetails();
	}


	ngOnDestroy() {
		this.commnloaderservice.getShow()
		this.otherExpenseValidatorSub.unsubscribe();
		this._commonLoaderService.getShow();

	}

	ngOnInit() {		
		this.countryId = this._countryId.getCountryId();
		this._companyModuleService.getPhoneCode().subscribe(result => {
			this.countryPhoneCode = result['results'].map(code => code.phone_code)
		})
		this.commnloaderservice.getHide()
		this.terminology = this._terminologiesService.terminologie;

		setTimeout(() => {
			this.prefixUrl = this._prefixUrl.getprefixUrl();
			this.currency_type = this.currency.getCurrency();
		}, 1000);
		this._activatedRoute.params.subscribe((response: any) => {

			this.fleetExpenseId = response.id;			
			this.buildForm();
			this.mechanicActivityForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))
			this.mechanicActivityForm.controls['id'].setValue(this.fleetExpenseId);

			this._fleetOwnerClassService.getEmployeeList(employeeList => {
				if (employeeList && employeeList.length > 0) {
					this.employeeList = employeeList;
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

			this._fleetOwnerClassService.getPartyList(vendorList => {
				if (vendorList && vendorList.length > 0) {
					this.vendorList = vendorList;
				}
			})

			this._commonService
				.getStaticOptions(
					'billing-payment-method,gst-treatment,payment-term,tax,tds,item-unit'
				)
				.subscribe((response) => {
					this.staticOptions.paymentMethods = response.result['billing-payment-method'];
					this.staticOptions.gstPercent = response.result['tax'];
					this.staticOptions.treatmentList = response.result['gst-treatment'];
					this.staticOptions.paymentTermList = response.result['payment-term'];
					this.staticOptions.itemUnits = response.result['item-unit'];
					this.staticOptions.tds = response.result['tds'];
					if (!this.fleetExpenseId) {
						this.initialValues.paymentTerm = this.staticOptions.paymentTermList[0];
						this.mechanicActivityForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0].id)
						this.onpaymentTermSelected(this.staticOptions.paymentTermList[0].id)
					}
				});

			this.getMaterials();
		});
		this.getExpenseAccountsAndSetAccount();
		this.mechanicActivityForm.controls['bill_date'].setValue(new Date(dateWithTimeZone()));
		this.minDate=new Date(dateWithTimeZone())
		this.mechanicActivityForm.controls['reminder'].setValue(new Date(dateWithTimeZone()));
	}
	toggleItemOtherFilled(enable: Boolean = false) {
		const otherItems = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
		otherItems.controls.forEach(ele => {
			if (enable) {
				ele.enable();
			} else {
				
				if (!Number(ele.value.unit_cost) && !ele.value.item && !ele.value.expense_account && !Number(ele.value.quantity) && !ele.value.unit) {
					ele.disable();
				}
			}
		});
	}
	handleEmployeeChange() {
		let empId = this.mechanicActivityForm.get('employee').value;
		let empObj = getEmployeeObject(this.employeeList, empId);
		this.initialValues.employee = { label: empObj?.display_name, value: empId }

	}

	getExpenseAccountsAndSetAccount() {

		this._fleetOwnerClassService.getExpenseAccountsAndSetAccountList(expenseAccountList => {
			if (expenseAccountList && expenseAccountList.length > 0) {
				this.expenseAccountList = expenseAccountList;
			}
		})
	}

	openGothrough() {
		this.goThroughDetais.show = true;
	}


	checkTripChallanExist(value) {		
		this.doTripChallanExists = value
	}
	checkTripChallanExistForLooseCargo(value) {		
		this.doTripChallanExistsForLoosecargo = value
	}
	checkTripChallanExistForContainer(value) {
		this.doTripChallanExistsForContainer = value;
	}

	onWorkEndDateChange() {
		let item = this.staticOptions.paymentTermList.filter((item: any) => item.label == 'Custom')[0]
		this.initialValues.paymentTerm = { label: item.label, value: item.id };
		this.mechanicActivityForm.get('payment_term').setValue(item.id)
	}

	ngAfterViewInit() {
		if (this.fleetExpenseId) {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.VENHICLEPROVIDER, this.screenType.EDIT, "Navigated");
			setTimeout(() => {
				this.getFormValues();
			}, 2000);
		} else {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.VENHICLEPROVIDER, this.screenType.ADD, "Navigated");
		}
		this._activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
			if (paramMap.has('vendorId') && paramMap.has('tripId')) {
				let vendor = paramMap.get('vendorId');
				this.tripId = paramMap.get('tripId');
				this.vehicleCategory = paramMap.get('categoary');
				
				this.initialValues.vendor = { label: paramMap.get('vendorName') };
				this.mechanicActivityForm.controls['vendor'].setValue(vendor);
				this.onVendorSelected(vendor);
			}
		});
	}

	getFormValues() {
		this._operationsActivityService.getFleetOwnerData(this.fleetExpenseId).subscribe((data: any) => {
			
			this.fleetExpenseEditdata = data.result;
			this.taxDetails = this.fleetExpenseEditdata;
			this.vendorId = this.fleetExpenseEditdata.vendor.id
			this._revenueService.sendPartyIntime(this.vendorId);
			this.minDate=data.result.bill_date;
			if(this.vendorId){
				this._partyService.getPartyAdressDetails(this.vendorId).subscribe(res => {
					this.vendorSelected = res.result;
				});
			}
			this._operationsActivityService.checkJobsByCustomer(this.vendorId,this.fleetExpenseId).subscribe(resp=>{
				this.isCarneDataAvailable=resp['result']['job_for_cranes'];
				this.isAWPDataAvailable=resp['result']['job_for_awp'];
				this.isOthersDataAvailable=resp['result']['job_for_others'];
				this.isLooseCargoDataAvailable=resp['result']['job_for_cargo'];
				this.isContainerDataAvailable = resp['result']['job_for_container'];
				this.activetabIndex=-1;
				setTimeout(() => {
					this.activetabIndex=0;
				}, 100);
			})
			this.getCraneAndAWPCargoContainerDetailsDetails();
			this.initialValues.vendor['label'] = isValidValue(this.fleetExpenseEditdata.vendor) ? this.fleetExpenseEditdata.vendor.display_name : '';

			this.initialValues.employee['label'] = isValidValue(this.fleetExpenseEditdata.employee) ? this.fleetExpenseEditdata.employee.name : '';
			this.fleetExpenseEditdata.employee = isValidValue(this.fleetExpenseEditdata.employee) ? this.fleetExpenseEditdata.employee.id : null;

			this.initialValues.paymentTerm['label'] = isValidValue(this.fleetExpenseEditdata.payment_term) ? this.fleetExpenseEditdata.payment_term.label : '';
			this.fleetExpenseEditdata.payment_term = isValidValue(this.fleetExpenseEditdata.payment_term) ? this.fleetExpenseEditdata.payment_term.id : null;
			this.populateTaxSelectedForLooseCargo = this.fleetExpenseEditdata?.cargo?.trip_challan_tax?.id;	
			this.populateTaxSelectedForContainer = this.fleetExpenseEditdata?.container?.trip_challan_tax?.id;	
			this.populateTaxSelectedForOthers = this.fleetExpenseEditdata?.others?.trip_challan_tax?.id;			
			this.tripChallanCommonTaxForContainer = { label: this.fleetExpenseEditdata?.container?.trip_challan_tax?.label, value: this.fleetExpenseEditdata?.container?.trip_challan_tax?.id }
			this.tripChallanCommonTaxForLooseCargo = { label: this.fleetExpenseEditdata?.cargo?.trip_challan_tax?.label, value: this.fleetExpenseEditdata?.cargo?.trip_challan_tax?.id }
			this.itemChallanCommonTax = { label: this.fleetExpenseEditdata?.others?.trip_challan_tax?.label, value: this.fleetExpenseEditdata?.others?.trip_challan_tax?.id }
			this.fleetExpenseEditdata.cargo.trip_challan_tax = this.fleetExpenseEditdata?.cargo?.trip_challan_tax?.id
			this.fleetExpenseEditdata.container.trip_challan_tax = this.fleetExpenseEditdata?.container?.trip_challan_tax?.id;
			this.fleetExpenseEditdata.others.trip_challan_tax = this.fleetExpenseEditdata?.others?.trip_challan_tax?.id;
			this.onVendorId();			
			this.mechanicActivityForm.patchValue(this.fleetExpenseEditdata);
			if (this.isTax) {
				this.lastSectionEditData.next({
					patchData: this.taxDetails,
					lastSectionData: this.tdsOptions
				});
			}
			this.mechanicActivityForm.controls['vendor'].setValue(this.fleetExpenseEditdata.vendor.id);
			this.mechanicActivityForm.controls['payment_term'].setValue(this.fleetExpenseEditdata.payment_term);
			this.mechanicActivityForm.controls['discount_after_tax_type'].setValue(this.fleetExpenseEditdata.discount_after_tax_type.index);
			this.getContactPersonList(this.vendorId)
			this.patchDocuments(this.fleetExpenseEditdata);
			this.patchCraneAndAwp(this.fleetExpenseEditdata, 'awp')
			this.patchCraneAndAwp(this.fleetExpenseEditdata, 'crane');
			this.patchCraneAndAwp(this.fleetExpenseEditdata, 'cargo');
			this.patchCraneAndAwp(this.fleetExpenseEditdata, 'container');
			setTimeout(() => {
				this.onCalcuationsChanged();
			}, 2000);
		});
	}

	fileUploader(filesUploaded) {
		let documents = this.mechanicActivityForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.mechanicActivityForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.mechanicActivityForm.get('documents') as UntypedFormControl;
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
			this.showAddVendorPopup = { name: this.vendorNamePopup, status: true };
	}

	/* Adding the entered value to the list */
	addValueToPartyPopup(event) {
		if (event) {
			this.vendorNamePopup = event;
		}
	}

	/* For Displaying the party name in the subfield  */
	addPartyToOption($event) {
		if ($event.status) {
			this.getVendorDetails();
			this.initialValues.vendor = { value: $event.id, label: $event.label };
			this.mechanicActivityForm.get('vendor').setValue($event.id);
			this.onVendorSelected($event.id);
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
		this.showAddVendorPopup = { name: '', status: false };
	}

	


	onCalendarChangePTerm(billDate) {
		if (billDate) {
			if (this.mechanicActivityForm.controls['payment_status'].value != 1) {
				this.mechanicActivityForm.controls['transaction_date'].patchValue(billDate);
			}
			this.mechanicActivityForm.controls['due_date'].patchValue(null);
			this.minDate = getMinOrMaxDate(billDate);
		}
		let existingTerm = this.mechanicActivityForm.controls['payment_term'].value;
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}

	onpaymentTermSelected(termId) {
		if (termId) {
			this.selectedPaymentTerm = getObjectFromList(termId, this.staticOptions.paymentTermList);
			this.BillDate = this.mechanicActivityForm.controls['bill_date'].value;
			if (termId == this.paymentTermCustom) {
				this.mechanicActivityForm.controls['due_date'].setValue(PaymentDueDateCalculator(this.BillDate, this.vendorSelected['terms_days']));
			} else {
				this.mechanicActivityForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.BillDate, this.selectedPaymentTerm ? this.selectedPaymentTerm.value : null));
			}
		}


		if (termId) {
			this.mechanicActivityForm.controls['due_date'].setValidators([Validators.required]);
			this.mechanicActivityForm.controls['due_date'].updateValueAndValidity();
			this.isDueDateRequired = true;
		} else {
			this.isDueDateRequired = false;
			this.mechanicActivityForm.controls['due_date'].setValidators(null);
			this.mechanicActivityForm.controls['due_date'].updateValueAndValidity();
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

				let other_expense = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
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


	buildNewItemExpenses(items) {
		let newItemExpenses = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
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
			lr_no: [
				item.lr_no || ''
			],
			advance: [item.advance || 0.00],
			// balance: [item.balance || 0.00],
			dn_date: [
				item.dn_date || null
			],
			freights: [
				item.freights || 0.00
			],
			freights_tax: [0.00],
			charges: [
				item.charges || 0.00
			],
			deductions: [
				item.deductions || 0.00
			],
			trip: [
				item.trip, [Validators.required]
			],
			adjustment: [
				item.adjustment || 0.00
			],
			total: [
				0.00
			],
			tax_amount : [0],
			charges_tax: [item.charges_tax || 0.00],
			charges_wt_tax: [item.charges_wt_tax || 0.00],
			charges_wo_tax: [item.charges_wo_tax || 0.00],
			tax: [item.tax || this.defaultTax]
		});
	}


	buildTripChallans(items: any = []) {
		const challans = this.mechanicActivityForm.controls['others'].get('trip_challan') as UntypedFormArray;
		const existingchallan = challans.value;
		challans.controls = [];
		challans.setValue([]);
		this.tripChallansList = [];
		this.isWOEmpty = checkEmptyDataKey(items, "work_order_no");
		items.forEach((item, index) => {
			item['tax'] = this.populateTaxSelectedForOthers;
			let arritem = getObjectFromListByKey('trip', item.trip, existingchallan);
			this.initialValues.tripChallanTax.push(getNonTaxableOption());
			if (arritem) {
				item.adjustment = arritem.adjustment;
				item.tax = arritem.tax
			}
			challans.push(this.addTripChallan(item));
			this.tripChallansList.push(item);
		});
	}

	resetTripChallanFormArray() {
		const challans = this.mechanicActivityForm.controls['others'].get('trip_challan') as UntypedFormArray;
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

	tripChallansForLooseCargoSelected(ele){				
		this.tripChallanModelInlineForLooseCargo = false;
		if (ele.length > 0) {			
			this.totals.advanceTotal = 0;
			this.totals.fuelTotal = 0;
			this.totals.battaAdvance = 0;
			this.tripChallanModelInlineForLooseCargo = true;
		}
		this.tripChallansListForLooseCargo = [];
		this.buildTripChallansForCargoAndContainer(ele,'cargo');
		this.onCalcuationsChanged()
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
		this.buildTripChallansForCargoAndContainer(ele,'container');
		this.onCalcuationsChanged()
	}

	buildTripChallansForCargoAndContainer(items: any = [],type) {		
		const challans = this.mechanicActivityForm.controls[type].get('trip_challan') as UntypedFormArray;
		const existingchallan = challans.value;
		challans.controls = [];
		challans.updateValueAndValidity();
		items.forEach((item) => {
			item['tax'] = type === 'cargo' ? this.populateTaxSelectedForLooseCargo : this.populateTaxSelectedForContainer;
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
				item['tax'] = type === 'cargo' ? this.populateTaxSelectedForLooseCargo : this.populateTaxSelectedForContainer

			}
			challans.push(this.addInvoiceTripChallan(item));
			type === 'cargo' ? this.tripChallansListForLooseCargo.push(item) : this.tripChallansListForContainer.push(item)
			
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
			freights_tax: [0.00],
			charges: [
				item.charges || 0.00
			],
			trip_id: [item.trip_id || '-'],
			charges_wo_tax: [item.charges_wo_tax || 0.00],
			charges_tax: [item.charges_tax || 0.00],
			charges_wt_tax: [item.charges_wt_tax || 0.00],
			deductions_wo_tax: [item.deductions_wo_tax || 0.00],
			deductions_tax: [item.deductions_tax || 0.00],
			deductions_wt_tax: [item.deductions_wt_tax || 0.00],
			advance: [item.advance || 0.00],
			// balance: [item.balance || 0.00],
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
			total : [item.total || 0.00],
			tax_amount: [0.00],
			tax: [item.tax || this.defaultTax]
		});
	}
	resetTripChallanFormArrayForCargoAndContainer(type) {
		const challans = this.mechanicActivityForm.get(type).get('trip_challan') as UntypedFormArray;
		challans.controls = [];
		challans.setValue([]);
		this.tripChallansListForLooseCargo = [];
		this.tripChallansListForContainer = [];
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
		const otherExpenses = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
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
		this.onCalcuationsChanged();
	}



	buildForm() {
		this.mechanicActivityForm = this._fb.group({
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
			is_transaction_includes_tax:false,
			// is_transaction_under_reverse:false,
			subtotal_before_tax : [0],
			tax_amount : [0],
			total : [0],
			discount_after_tax_amount:[0],
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
			discount_after_tax_type: [
				0
			],
			discount_after_tax: [
				0
			],
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
			reference_no : [''],
			contact_person_name: [''],
			contact_person_no: this._fb.group({
				code : getCountryCode(this.countryId),
				no :  ['', [TransportValidator.mobileNumberValidator()]],
			}),
			crane: this._fb.group({
				timesheet_tax: [this.defaultTax],
				timesheets: this._fb.array([]),
				charges: this._fb.array([]),
				deductions: this._fb.array([]),
				additional_charges: this._fb.array([]),
			}),
			awp: this._fb.group({
				timesheet_tax: [this.defaultTax],
				timesheets: this._fb.array([]),
				charges: this._fb.array([]),
				deductions: this._fb.array([]),
				additional_charges: this._fb.array([]),
			}),
			cargo : this._fb.group({				
				trip_challan_tax : [this.defaultTax],
				charges: this._fb.array([]),
				deductions: this._fb.array([]),
			    trip_challan : this._fb.array([])
			}),
			container: this._fb.group({
				trip_challan_tax: [this.defaultTax],
				charges: this._fb.array([]),
				deductions: this._fb.array([]),
				trip_challan: this._fb.array([])
			}),
			others : this._fb.group({
				trip_challan: this._fb.array([]),
				trip_challan_tax: [this.defaultTax]
			})
		});
		if (!this.fleetExpenseId) {
			this.addMoreOtherItem();
		}
		this.mechanicActivityForm.controls['transaction_date'].setValue(null);
		this.onCalcuationsChanged();
		this.setFormValidators();
		return this.mechanicActivityForm;
	}


	addMoreOtherItem() {
		const otherItems = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
		this.initialValues.expenseAccount.push(getBlankOption());
		this.initialValues.item.push(getBlankOption());
		this.initialValues.taxPercent.push(getNonTaxableOption());
		this.initialValues.units.push(getBlankOption());
		otherItems.push(this.buildNewMaintainanceForm({}));
	}

	removeOtherItem(index) {
		const otherItems = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
		this.initialValues.expenseAccount.splice(index, 1);
		this.initialValues.item.splice(index, 1);
		this.initialValues.units.splice(index, 1);
		this.initialValues.taxPercent.splice(index, 1);
		otherItems.removeAt(index);
		this.onCalcuationsChanged();
	}


	resetOtherItem(formGroup: UntypedFormGroup, index) {
		const singleUse = this.buildNewMaintainanceForm({})
		formGroup.patchValue(singleUse.value);
		this.initialValues.expenseAccount[index] = getBlankOption();
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.item[index] = getBlankOption();
		this.onCalcuationsChanged();
	}

	clearAllOtherItems() {
		const otherItems = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
		this.emptyOtherItems();
		otherItems.reset();
		otherItems.controls = [];
		this.addMoreOtherItem();
		this.onCalcuationsChanged();
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
		this._commonLoaderService.getShow();
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
			this.resetTripChallanFormArrayForCargoAndContainer('cargo');
			this.resetTripChallanFormArrayForCargoAndContainer('container');
			this.getContactPersonList(e)
			this.clearAllOtherItems();
			this._revenueService.sendPartyIntime(this.vendorId);
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
				this.mechanicActivityForm.controls['payment_term'].setValue('');
				this.mechanicActivityForm.controls['due_date'].setValue(null);
				if (this.vendorSelected ? this.vendorSelected.terms : null) {
					this.onpaymentTermSelected(this.vendorSelected.terms ? this.vendorSelected.terms.id : null);
					this.initialValues.paymentTerm = {
						label: this.vendorSelected.terms && this.vendorSelected.terms.label ? this.vendorSelected.terms.label : '',
						value: this.vendorSelected.terms ? this.vendorSelected.terms.id : null
					}
					this.mechanicActivityForm.controls['payment_term'].setValue(
						this.vendorSelected.terms ? this.vendorSelected.terms.id : '');
				}
				else {
					this.initialValues.paymentTerm = this.staticOptions.paymentTermList[0];
					this.mechanicActivityForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0].id);
					this.mechanicActivityForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))
				}
			});
			this._operationsActivityService.checkJobsByCustomer(e,'').subscribe(resp=>{
				this.isCarneDataAvailable=resp['result']['job_for_cranes'];
				this.isAWPDataAvailable=resp['result']['job_for_awp'];
				this.isOthersDataAvailable=resp['result']['job_for_others'];
				this.isLooseCargoDataAvailable=resp['result']['job_for_cargo'];
				this.isContainerDataAvailable = resp['result']['job_for_container'];
				this.activetabIndex=-1;
				setTimeout(() => {
					this.activetabIndex=0;
				}, 100);
		        this.initialDetailsOnPartySelected(e);
			})
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
			itemExpenseControl.get('cost').setValue(itemSelected.rate_per_unit.toFixed(3));
			itemExpenseControl.get('unit').setValue(itemSelected.unit.id);
			this.initialValues.units[index] = {
				label: itemSelected.unit.label,
				value: itemSelected.unit.id
			}
			return;
		}
		else {
			itemExpenseControl.get('cost').setValue(0.000);
			itemExpenseControl.get('unit').setValue(null);
			this.initialValues.units[index] = getBlankOption()
		}
	}

	resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({ unit: null, unit_cost: 0.000, total: 0.000, quantity: 0.000, expense_account: null });
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.expenseAccount[index] = getBlankOption();
	}

	onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
		this.resetOtherExpenseExceptItem(itemExpenseControl, index);
		this.onChangeOtherExpenseItem(index);
	}

	

	saveExpense() {
		this.toggleItemOtherFilled()
		this.$paymentStatusValid.next(this.isPaymentstatusValid);
		let form = this.mechanicActivityForm;
		if (this.totals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}		
		if (form.valid && this.isTaxFormValid && this.isPaymentstatusValid) {
			this.apiError = '';
			this.mechanicActivityForm.controls['payment_mode'].enable();			
			if (this.fleetExpenseId) {
				this.apiHandler.handleRequest(this._operationsActivityService.editFleetOwner(this.fleetExpenseId, this.prepareRequest(form)),'Vehicle Payment updated successfully!').subscribe({
					next: () => {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.VENHICLEPROVIDER)
					    this._route.navigate([this.prefixUrl + '/trip/vehicle-payment/view',this.fleetExpenseId],{ queryParams: { formList: 'vehicle-payment' } });
					  },
					  error: () => {
						this.apiError = 'Failed to update Vehicle Payment !';
						setTimeout(() => (this.apiError = ''), 3000);
					  },
				});
				
				
			}
			else {
				this.apiHandler.handleRequest(this._operationsActivityService.saveFleetExpense(this.prepareRequest(form)),'Vehicle Payment added successfully!').subscribe(
					{
						next: (response) => {
				    	this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.VENHICLEPROVIDER)
						this._route.navigate([this.prefixUrl + '/trip/vehicle-payment/view',response?.['result']]);						  },
						  error: () => {
							this.apiError = 'Failed to update Vehicle Payment !';
							setTimeout(() => (this.apiError = ''), 3000);
						  },
					}
			);
			}
				
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.taxFormValid.next(false);
			this.setFormGlobalErrors();
		}
		this.toggleItemOtherFilled(true)
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
			bill_date: changeDateToServerFormat(form.controls['bill_date'].value),
			transaction_date: changeDateToServerFormat(form.controls['transaction_date'].value),
			reminder: changeDateToServerFormat(form.controls['reminder'].value),
			due_date: changeDateToServerFormat(form.controls['due_date'].value)
		});		
		form.value['container']['trip_challan'].forEach((element) => {
			delete element['charges'];
			delete element['charges_tax'];
			delete element['charges_wo_tax'];
			delete element['charges_wt_tax'];
			delete element['deductions'];
			delete element['deductions_tax'];
			delete element['deductions_wo_tax'];
			delete element['deductions_wt_tax'];
		})
		form.value['cargo']['trip_challan'].forEach((element) => {
			delete element['charges'];
			delete element['charges_tax'];
			delete element['charges_wo_tax'];
			delete element['charges_wt_tax'];
			delete element['deductions'];
			delete element['deductions_tax'];
			delete element['deductions_wo_tax'];
			delete element['deductions_wt_tax'];
		})
		return form.value;
	}



	setFormValidators() {
		const itemOther = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
		this.otherExpenseValidatorSub = itemOther.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
			items.forEach((key, index) => {
				const item = itemOther.at(index).get('item');
				const unit = itemOther.at(index).get('unit');
				const unit_cost = itemOther.at(index).get('unit_cost');
				const quantity = itemOther.at(index).get('quantity');
				const expense_account = itemOther.at(index).get('expense_account');

				item.setValidators(Validators.required);
				unit.setValidators(Validators.required);
				expense_account.setValidators(Validators.required);
				unit_cost.setValidators(Validators.min(0.01));
				quantity.setValidators(Validators.min(0.01));
				if (items.length == 1) {
					if (!Number(unit_cost.value) && !item.value && !expense_account.value && !Number(quantity.value) && !unit.value) {
						item.clearValidators();
						expense_account.clearValidators();
						unit_cost.clearValidators();
						quantity.clearValidators();
						unit.clearValidators();
					}
				}
				item.updateValueAndValidity({ emitEvent: true });
				expense_account.updateValueAndValidity({ emitEvent: true });
				unit_cost.updateValueAndValidity({ emitEvent: true });
				quantity.updateValueAndValidity({ emitEvent: true });
				unit.updateValueAndValidity({ emitEvent: true });
			});
		});

	}
	headerTaxDetails(data) {
		if (this.isTax) {
			this.isTaxFormValid = data;
			this.isTransactionIncludesTax =this.mechanicActivityForm.get('is_transaction_includes_tax').value
			// ||this.isTransactionUnderReverse =this.mechanicActivityForm.get('is_transaction_under_reverse').value
			if (this.companyRegistered ) {
				this.disableTax = false;
			}
			// && !this.isTransactionUnderReverse
			if (!this.partyDetailsData.isPartyRegistered ) {
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
			this.totals.taxes = result.result['tax'];
			this.tdsOptions = result.result['tds'];
			this.lastSectionTaxDetails.next({data : this.tdsOptions})
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
		this.onCalcuationsChanged();

	}

	patchChallansAndOtherItems(data) {
		this.resetTripChallanFormArray();
		this.resetTripChallanFormArrayForCargoAndContainer('cargo');
		this.resetTripChallanFormArrayForCargoAndContainer('container');
		if (data?.others?.trip_challan.length > 0) {
			this.tripChallanModelInline = true;
			data?.others?.trip_challan.forEach((challan) => {
				this.initialValues.tripChallanTax.push(
					{
						label: isValidValue(challan.tax) ? challan.tax.label : '',
						value: isValidValue(challan.tax) ? challan.tax.id : null
					});
				challan.tax = isValidValue(challan.tax) ? challan.tax.id : null;
				challan.total = isValidValue(challan.total) ? challan.total : '';
			});
			this.buildTripChallans(data?.others?.trip_challan);
		} else {
			this.tripChallanModelInline = false;
		}		
		if (data.cargo.trip_challan.length > 0) {
			this.tripChallanModelInlineForLooseCargo = true;
			data.cargo.trip_challan.forEach((challan) => {
				challan = isValidValue(challan) ? challan : '';
				challan.tax = isValidValue(challan.tax) ? challan.tax.id : getNonTaxableOption().value;
			});
			this.buildTripChallansForCargoAndContainer(data.cargo.trip_challan,'cargo');				
		}
		else {
			this.tripChallanModelInlineForLooseCargo = false;
		}

		if (data.container.trip_challan.length > 0) {
			this.tripChallanModelInlineForContainer = true;
			data.container.trip_challan.forEach((challan) => {
				challan = isValidValue(challan) ? challan : '';
				challan.tax = isValidValue(challan.tax) ? challan.tax.id : getNonTaxableOption().value;
			});
			this.buildTripChallansForCargoAndContainer(data.container.trip_challan,'container');				
		}
		else {
			this.tripChallanModelInlineForContainer = false;
		}


		if (this.fleetExpenseEditdata.other_expenses.length > 0) {
			this.initialValues.expenseAccount = [];
			this.initialValues.item = [];
			this.initialValues.units = [];
			this.initialValues.taxPercent = [];
			this.fleetExpenseEditdata.other_expenses.forEach((otherexpense, index) => {
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
			this.buildNewItemExpenses(this.fleetExpenseEditdata.other_expenses);
		} else {
			this.addMoreOtherItem();
		}
		setTimeout(() => {
			this.onCalcuationsChanged();
		}, 1000);
	}

	editTripFreight(id: string = "", extras: any = {}) {
		this._popupBodyScrollService.popupActive();
		if (id) {
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				extras.id = id
				let data = res.result;
				data['id'] = id;
				this.showFreightPopup = {
					type: 'vehicle-freights',
					show: true,
					data: res.result,
					extras: extras
				}
			})
		}
	}


	setFreightValueToChallan(tripId, value) {
		let tripChallans = this.mechanicActivityForm.controls['others'].get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('freights').setValue(value);
			this.onCalcuationsChanged();
		}
	}

	editCompleteTripFreight($event) {

		const tripId = this.showFreightPopup.data['id'];
		if (tripId) {
			this._tripService.getTripSubDetails(tripId, 'freights', { type: 'vehicle-freights', operation: 'sum' }).subscribe((res: any) => {
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
	editTripFreightForLooseCargo(id: string = "", workOrderNumber) {		
		if (id) {
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				let data = res.result
				data['id'] = id
				data['customerId'] = this.mechanicActivityForm.get('vendor').value;
				this.showFreightPopupForLooseCargo = {
					type: 'vehicle-freights',
					show: true,
					data: res.result,
					extras: { id: workOrderNumber }
				}
			})
		}
	}

	completeFReightEditcargo(event) {		
		const tripId = this.showFreightPopupForLooseCargo.data['id'];
		if (tripId) {
			this._tripService.getTripSubDetails(tripId, 'freights', { type: 'vehicle-freights', operation: 'sum' }).subscribe((res: any) => {
				this.setFreightValueToChallanForLooseCargo(tripId, res['result']);
			});
		}
		this.showFreightPopupForLooseCargo = {
			type: '',
			show: false,
			data: {},
			extras: { id: '' },
		}
	}

	setFreightValueToChallanForLooseCargo(tripId, value) {
		let tripChallans = this.mechanicActivityForm.get('cargo').get('trip_challan') as UntypedFormArray;		
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('freights').setValue(value);
			this.onCalcuationsChanged();
		}
	}
	onSelectPopulateTaxForCargoAndContainer(value,type) {
		if (value) {
			type === 'cargo' ?  this.populateTaxSelectedForLooseCargo = value  : this.populateTaxSelectedForContainer = value
			const tax = getObjectFromList(value, this.taxOptions);
			if (tax) {
				type === 'cargo' ? this.tripChallanCommonTaxForLooseCargo = { label: tax.label, value: tax.id } : this.tripChallanCommonTaxForContainer = { label: tax.label, value: tax.id };
				const challanTrips = this.mechanicActivityForm.get(type).get('trip_challan') as UntypedFormArray;
				challanTrips.controls.forEach(element => {
					element.get('tax').setValue(tax.id);
				});
			}
			this.onCalcuationsChanged();
		}
	}
	onSelectPopulateTax(value) {
		if (value) {
			this.populateTaxSelectedForOthers = value
			const tax = getObjectFromList(value, this.taxOptions);
			if (tax) {
				this.itemChallanCommonTax = { label: tax.label, value: tax.id };
				this.initialValues.tripChallanTax.fill({ label: tax.label, value: tax.id });
				const challanTrips = this.mechanicActivityForm.controls['others'].get('trip_challan') as UntypedFormArray;
				challanTrips.controls.forEach(element => {
					element.get('tax').setValue(tax.id);
				});

			}
			this.onCalcuationsChanged();
		}
	}


	editTripAddBillCharges(id: string = "", extras: any = {}) {
		this._popupBodyScrollService.popupActive();
       let vendor=this.mechanicActivityForm.controls.vendor.value
		if (id) {
			this.isAddExpense = false;
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				extras.id = id
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				let charges = {}
				charges['vp_add_bill_charges'] = res.result['expense']['charges']['vp_add_bill_charges']
				charges['id'] = id
				extras['customerId'] = vendor
				this.showChargesPopup = {
					type: 'vp-charge-bill',
					show: true,
					data: charges,
					extras: extras
				}
			})
		}
	}

	editTripReduceBillCharges(id: string = "", extras: any = {}) {
		this._popupBodyScrollService.popupActive();
		let vendor=this.mechanicActivityForm.controls.vendor.value
		if (id) {
			this.isAddExpense = true;
			this._newTripV2Service.getTripProfitandLossDetails(id).subscribe((res: any) => {
				extras.id = id
				res['result']['status'] = -1
				res['result']['fl_status'] = -1
				let charges = {}
				charges['vp_reduce_bill_charges'] = res.result['revenue']['charges']['vp_reduce_bill_charges']
				charges['id'] = id
				extras['customerId'] = vendor
				this.showChargesPopup = {
					type: 'vp-charge-reduce-bill',
					show: true,
					data: charges,
					extras: extras
				}
			})
		}
	}


	setAddChargeValueToChallan(tripId, value) {
		let tripChallans = this.mechanicActivityForm.controls['others'].get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('charges_wt_tax').setValue(value['wt_tax']);
			formChallan.get('charges_wo_tax').setValue(value['wo_tax']);
			formChallan.get('charges_tax').setValue(value['tax']);
			formChallan.get('charges').setValue(value['wo_tax'] + value['wt_tax'] + value['tax'])
			this.onCalcuationsChanged();
		}
	}

	setReduceChargeValueToChallan(tripId, value) {
		let tripChallans = this.mechanicActivityForm.controls['others'].get('trip_challan') as UntypedFormArray;
		let formChallan = tripChallans.controls.filter(ele => ele.value.trip == tripId)[0]
		if (formChallan) {
			formChallan.get('deductions').setValue(value);
			this.onCalcuationsChanged();
		}
	}

	editCompleteTripCharges($event) {
		if ($event) {
			const tripId = this.showChargesPopup.data['id'];
			const type = this.showChargesPopup.type
			if (tripId && type == "vp-charge-bill") {
				this._tripService.getTripSubDetails(tripId, 'charges', { type: 'add-bill-vp', operation: 'sum' }).subscribe((res: any) => {
					this.setAddChargeValueToChallan(tripId, res['result']);
				});
			}

			if (tripId && type == "vp-charge-reduce-bill") {
				this._tripService.getTripSubDetails(tripId, 'charges', { type: 'reduce-bill-vp', operation: 'sum' }).subscribe((res: any) => {
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


	patchChallans(e) {
		if (this.tripId) {
			this._revenueService.getFLTripChallanListByParty(e).subscribe((response) => {
				let selectedTripChallan = [];
				let tripChallanList = [];
				let advanceAmount = 0;
				tripChallanList = response['result'];
				if (tripChallanList.length > 0) {
					tripChallanList.forEach(item => {
						if (item.trip == this.tripId) {
							selectedTripChallan.push(item);
							advanceAmount = advanceAmount + Number(item.advance)
						}
					});
					this.tripChallansSelected(selectedTripChallan);
				}
			});
		}
	}

	patchChallansForCargo(e) {
		if (this.tripId) {
			this._revenueService.getTripChallanListByVendorForCargo(e,'cargo').subscribe((response) => {								
				let selectedTripChallanForCargo = [];
				let tripChallanListForCargo = [];
				let advanceAmount = 0;
				tripChallanListForCargo = response['result'];
				if (tripChallanListForCargo.length > 0) {
					tripChallanListForCargo.forEach(item => {
						if (item.trip == this.tripId) {
							selectedTripChallanForCargo.push(item);
							advanceAmount = advanceAmount + Number(item.advance)
						}
					});					
					this.tripChallansForLooseCargoSelected(selectedTripChallanForCargo);
				}
			});
		}
	}

	patchChallansForContainer(e) {
		if (this.tripId) {
			this._revenueService.getTripChallanListByVendorForCargo(e,'container').subscribe((response) => {								
				let selectedTripChallanForContainer = [];
				let tripChallanListForContainer = [];
				let advanceAmount = 0;
				tripChallanListForContainer = response['result'];
				if (tripChallanListForContainer.length > 0) {
					tripChallanListForContainer.forEach(item => {
						if (item.trip == this.tripId) {
							selectedTripChallanForContainer.push(item);
							advanceAmount = advanceAmount + Number(item.advance)
						}
					});										
					this.tripChallansForContainerSelected(selectedTripChallanForContainer);
				}
			});
		}
	}


	paymentStatusData(data: { data: any, valid: boolean }) {
		this.mechanicActivityForm.patchValue({
			amount_paid: data.data.amount_paid,
			bank_charges: data.data.bank_charges,
			payment_mode: data.data.payment_mode,
			payment_status: data.data.payment_status,
			paid_employee: data.data.paid_employee,
			transaction_date: changeDateToServerFormat(data.data.transaction_date)
		})
		this.isPaymentstatusValid = data.valid;
	}

	changeDateToDDMMYYYY(date) {
		return moment(date).format('DD-MM-YYYY')
	}

	getContactPersonList(id) {
		this._partyService.getContactPersonList(id).subscribe(data => {
			this.contactPersonList = data['result'].contact_person;
			if (this.fleetExpenseId == 'null') {
				this.patchDefaultContactPerson()
			}
		})
	}

	setContactPerson(contactPerson) {
		if (!isValidValue(contactPerson)) return
		this.mechanicActivityForm.get('contact_person_name').setValue(contactPerson.display_name)
		this.mechanicActivityForm.get('contact_person_no').get('code').setValue(contactPerson.country_code)
			this.mechanicActivityForm.get('contact_person_no').get('no').setValue(contactPerson.contact_person_no);
	}

	setContactPersons(contactPerson) {
		if (contactPerson.trim()) {
			this.mechanicActivityForm.get('contact_person_name').setValue(contactPerson);
		} else {
			this.mechanicActivityForm.get('contact_person_no').get('code').setValue(getCountryCode(this.countryId))
			this.mechanicActivityForm.get('contact_person_no').get('no').setValue('');
		}
	}

	onContactPersonChange() {
		let contactPersonName = this.mechanicActivityForm.get('contact_person_name').value
		let cpObj = this.contactPersonList.find((item) => item.display_name == contactPersonName)
		if (cpObj) {
			this.mechanicActivityForm.get('contact_person_no').get('code').setValue(cpObj.country_code)
			this.mechanicActivityForm.get('contact_person_no').get('no').setValue(cpObj.contact_person_no);
		}
	}
	clearContactPerson() {
		this.mechanicActivityForm.get('contact_person_name').setValue('')
	}

	patchDefaultContactPerson() {
		this.clearContactPerson();
		const defaultContact = this.contactPersonList.find((item) => item.default == true)
		if (defaultContact) {
			this.setContactPerson(defaultContact)
		}
	}

	initialDetailsOnPartySelected(vendorID) {		
		this.apiError = '';
		this.resetCraneAwpCargoContainerTableValues();
		this.tripChallanModelInline = false;
		this.tripChallanModelInlineForLooseCargo = false;
		this.tripChallanModelInlineForContainer = false;
		this.getCraneAndAWPCargoContainerDetailsDetails();				
			if (this.tripId) {
			    if(Number(this.vehicleCategory)==0){
					this.patchChallans(vendorID);
				}
				if(Number(this.vehicleCategory)==3){	
					this.patchChallansForCargo(vendorID)
					let obs1 = this._newTripV2Service.getJobChargesFrVP(this.tripId);
					let obs2 = this._newTripV2Service.getJobDeductionsFrVp(this.tripId);
					forkJoin([obs1, obs2]).subscribe(([charge, deduction]: any) => {
						let jobData = {
							selectedChargeList: charge['result'],
							selectedDeductionList: deduction['result'],
							selectedTimeSheetList:[]
						}
						if (Number(this.vehicleCategory) == 3) {
							this.patchCraneAndAwpFormJob(jobData, 'cargo')
						}
						this.onCalcuationsChanged();
					})
				}
				if(Number(this.vehicleCategory)==4){	
					this.patchChallansForContainer(vendorID)
					let obs1 = this._newTripV2Service.getJobChargesFrVP(this.tripId);
					let obs2 = this._newTripV2Service.getJobDeductionsFrVp(this.tripId);
					forkJoin([obs1, obs2]).subscribe(([charge, deduction]: any) => {
						let jobData = {
							selectedChargeList: charge['result'],
							selectedDeductionList: deduction['result'],
							selectedTimeSheetList:[]
						}
						if (Number(this.vehicleCategory) == 4) {
							this.patchCraneAndAwpFormJob(jobData, 'container')
						}
						this.onCalcuationsChanged();
					})

				}
				if(Number(this.vehicleCategory)==1||Number(this.vehicleCategory)==2){
					let jobData=this._tripDataService.makeInvoiceData
					this._tripDataService.makeInvoiceData=null					
					if(jobData){
						this.mechanicActivityForm.controls['bill_date'].setValue(jobData['invoiceDate']);
						this.mechanicActivityForm.controls['bill_number'].setValue(jobData['invoiceNumber']);
						if(Number(this.vehicleCategory)==1){
							this.patchCraneAndAwpFormJob(jobData,'crane')
						}
						if(Number(this.vehicleCategory)==2){
							this.patchCraneAndAwpFormJob(jobData,'awp')
						}
						this.onCalcuationsChanged();
					}					
				}

			}
		this.clearAllOtherItems();
		this.onCalcuationsChanged();
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
		this.craneCharges = {
			chargeList: [],
			selectedChargeList: []
		}
		this.awpCharges = {
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
		this.looseCargoCharges = {
			chargeList: [],
			selectedChargeList: []
		}
		this.looseCargoDeductions = {
			deductionList: [],
			selectedDeductionList: []
		}
		this.containerCharges = {
			chargeList: [],
			selectedChargeList: []
		}
		this.containerDeductions = {
			deductionList: [],
			selectedDeductionList: []
		}
		this.buildJobDeductions([], 'awp')
		this.buildJobCharges([], 'awp')
		this.buildJobTimeSheets([], 'awp')
		this.buildJobDeductions([], 'crane')
		this.buildJobCharges([], 'crane')
		this.buildJobTimeSheets([], 'crane');
		this.buildJobDeductions([], 'cargo')
		this.buildJobCharges([], 'cargo')
		this.buildJobDeductions([], 'container')
		this.buildJobCharges([], 'container')
	}

	getCraneAndAWPCargoContainerDetailsDetails() {
		const craneTimeSheet = this._operationsActivityService.getVPCraneAwpTimesheetByVendor('crane', this.vendorId);
		const craneCharges = this._operationsActivityService.getVPCraneAwpJobChargesByVendor('crane', this.vendorId)
		const craneDeductions = this._operationsActivityService.getVPCraneAwpJobDeductionsByVendor('crane', this.vendorId);
		forkJoin([craneTimeSheet, craneCharges, craneDeductions]).subscribe(([sheetList, chargeList, deductionList]: any) => {
			this.craneTimeSheet.sheetList = sheetList['result']
			this.craneCharges.chargeList = chargeList['result']
			this.craneDeductions.deductionList = deductionList['result']
			if (isValidValue(this.fleetExpenseId)) {
				this.craneTimeSheet.sheetList.push(...this.fleetExpenseEditdata['crane']['timesheets'])
				this.craneCharges.chargeList.push(...this.fleetExpenseEditdata['crane']['charges'])
				this.craneDeductions.deductionList.push(...this.fleetExpenseEditdata['crane']['deductions'])
			}
		});
		const awpTimeSheet = this._operationsActivityService.getVPCraneAwpTimesheetByVendor('awp', this.vendorId);
		const awpCharges = this._operationsActivityService.getVPCraneAwpJobChargesByVendor('awp', this.vendorId)
		const awpDeductions = this._operationsActivityService.getVPCraneAwpJobDeductionsByVendor('awp', this.vendorId);
		forkJoin([awpTimeSheet, awpCharges, awpDeductions]).subscribe(([sheetList, chargeList, deductionList]: any) => {
			this.awpTimeSheet.sheetList = sheetList['result']
			this.awpCharges.chargeList = chargeList['result']
			this.awpDeductions.deductionList = deductionList['result']
			if (isValidValue(this.fleetExpenseId)) {
				this.awpTimeSheet.sheetList.push(...this.fleetExpenseEditdata['awp']['timesheets'])
				this.awpCharges.chargeList.push(...this.fleetExpenseEditdata['awp']['charges'])
				this.awpDeductions.deductionList.push(...this.fleetExpenseEditdata['awp']['deductions'])
			}	
		})
		const looseCargoCharges = this._operationsActivityService.getVPCraneAwpJobChargesByVendor('cargo', this.vendorId)
		const looseCargoDeductions = this._operationsActivityService.getVPCraneAwpJobDeductionsByVendor('cargo', this.vendorId);
		forkJoin([looseCargoCharges, looseCargoDeductions]).subscribe(([  chargeList, deductionList]: any) => {
			this.looseCargoCharges.chargeList = chargeList['result']
			this.looseCargoDeductions.deductionList = deductionList['result']
			if (isValidValue(this.fleetExpenseId)) {
				this.looseCargoCharges.chargeList.push(...this.fleetExpenseEditdata['cargo']['charges'])
				this.looseCargoDeductions.deductionList.push(...this.fleetExpenseEditdata['cargo']['deductions'])
			}	
		})
		const containerCharges = this._operationsActivityService.getVPCraneAwpJobChargesByVendor('container', this.vendorId)
		const containerDeductions = this._operationsActivityService.getVPCraneAwpJobDeductionsByVendor('container', this.vendorId);
		forkJoin([containerCharges, containerDeductions]).subscribe(([  chargeList, deductionList]: any) => {
			this.containerCharges.chargeList = chargeList['result']
			this.containerDeductions.deductionList = deductionList['result']
			if (isValidValue(this.fleetExpenseId)) {
				this.containerCharges.chargeList.push(...this.fleetExpenseEditdata['container']['charges'])
				this.containerDeductions.deductionList.push(...this.fleetExpenseEditdata['container']['deductions'])
			}	
		})
	}

	buildJobCharges(items: any = [], type: string) {
		const charges = this.mechanicActivityForm.get(type).get('charges') as UntypedFormArray;
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
			charges.push(this.addChargeItem(item));
		});
	}

	buildJobDeductions(items: any = [], type: string) {
		const deductions = this.mechanicActivityForm.get(type).get('deductions') as UntypedFormArray;
		const existingDeductions = deductions.value;
		deductions.controls = [];
		deductions.updateValueAndValidity();
		items.forEach((item) => {
			let arritem = getObjectFromListByKey('charge_id', item.charge_id, existingDeductions);
			if (arritem) {
				item.discount = arritem.discount;
				item.amount = arritem.amount;
			}
			deductions.push(this.addDeductionsItem(item));

		});
	}

	buildJobTimeSheets(items: any = [], type: string) {
		if(type == 'crane'){
			if(items.length>0){
				this.billingUnitCrane=items[0].billing_unit
			}
		}
		if(type == 'awp'){
			if(items.length>0){
				this.billingUnitAwp=items[0].billing_unit
			}
		}
		const timesheets = this.mechanicActivityForm.get(type).get('timesheets') as UntypedFormArray;
		timesheets.controls = [];
		timesheets.updateValueAndValidity();
		items.forEach((item) => {
			timesheets.push(this.addTimeSheetItem(item));
		});
	}

	addChargeItem(item) {
		const form = this._fb.group({
			charge_id: [item.charge_id || null],
			name: [item.name || ''],
			workorder_no: [item.workorder_no || ''],
			trip_id: [item.trip_id || ''],
			date: [item.date || ''],
			vehicle_no: [
				item.vehicle_no || ''
			],
			amount: [
				item.amount || 0.00
			],
			unit_cost: [
				item.unit_cost || 0.00
			],
			amount_before_tax: [item.amount_before_tax || 0.00],
			tax: [item.tax?.id || this.defaultTax],
			tax_label: [item?.tax?.label || ''],
			discount: [
				item.discount || 0.00
			],
			total: [
				item.total || 0.00
			]
		});
		return form;
	}

	addDeductionsItem(item) {
		const form = this._fb.group({
			charge_id: [item.charge_id || null],
			name: [item.name || ''],
			workorder_no: [item.workorder_no || ''],
			trip_id: [item.trip_id || ''],
			date: [item.date || ''],
			vehicle_no: [
				item.vehicle_no || ''
			],
			amount: [
				item.amount || ''
			],
			discount: [
				item.discount || 0.00
			],
			total: [
				item.total || 0.00
			]
		});
		return form;
	}

	addTimeSheetItem(item) {
		const form = this._fb.group({
			timesheet_id: [item.timesheet_id || null],
			trip_id: [item.trip_id || ''],
			workorder_no: [item.workorder_no || ''],
			start_date: [item.start_date || ''],
			timesheet_no: [item.timesheet_no || ''],
			date: [item.date || ''],
			end_date: [item.end_date || ''],
			location: [item.location || ''],
			billing_hours: [item.billing_hours || 0.00],
			billing_rate: [item.billing_rate || 0.00],
			billing_amount: [item.billing_amount || 0.00],
			extra_hours: [item.extra_hours || 0.00],
			extra_rate: [item.extra_rate || 0.00],
			extra_amount: [item.extra_amount || 0.00],
			tax_amount: [item.tax_amount || 0.00],
			amount: [item.amount || 0.00],
			vehicle_no: [
				item.vehicle_no || ''
			],
			amount_before_tax: [
				item.amount_before_tax || 0.00
			],
			total: [
				item.total || 0.00
			]
		});
		return form;
	}

	patchCraneAndAwp(data, type) {
		if (data[type]['charges'].length > 0) {
			if (type == 'awp') {
				this.awpCharges.selectedChargeList = data[type]['charges'];
			}
			if (type == 'crane') {
				this.craneCharges.selectedChargeList = data[type]['charges'];
			}
			if (type == 'cargo') {
				this.looseCargoCharges.selectedChargeList = data[type]['charges'];
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
			if (type == 'cargo') {
				this.looseCargoDeductions.selectedDeductionList = data[type]['deductions'];
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
		if(type ==='crane'|| type === 'awp'){
			this.mechanicActivityForm.get(type).get('timesheet_tax').setValue(data[type]['timesheet_tax']['id'])
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
			if (type == 'cargo') {
				this.looseCargoCharges.selectedChargeList = data.selectedChargeList;
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
			if (type == 'cargo') {
				this.looseCargoDeductions.selectedDeductionList = data.selectedDeductionList;
			}
			if (type == 'container') {
				this.containerDeductions.selectedDeductionList = data.selectedDeductionList;
			}
			this.buildJobDeductions(data.selectedDeductionList, type)
		}
		if (data?.selectedTimeSheetList.length > 0) {
			if (type == 'awp') {
				this.awpTimeSheet.selectedSheetList = data.selectedTimeSheetList;
			}
			if (type == 'crane') {
				this.craneTimeSheet.selectedSheetList = data.selectedTimeSheetList;
			}
			this.buildJobTimeSheets(data.selectedTimeSheetList, type)
		}
	}

	openCraneAwpCharges(type) {
		let chargeList = [];
		let selectedChargeList = [];
		let selectedDocs=[];

		if (type == 'crane') {
			chargeList = this.craneCharges.chargeList
			selectedChargeList = this.craneCharges.selectedChargeList
		}
		if (type == 'awp') {
			chargeList = this.awpCharges.chargeList
			selectedChargeList = this.awpCharges.selectedChargeList;
		}
		if (type == 'cargo') {
			chargeList = this.looseCargoCharges.chargeList
			selectedChargeList = this.looseCargoCharges.selectedChargeList;
		}
		if (type == 'container') {
			chargeList = this.containerCharges.chargeList
			selectedChargeList = this.containerCharges.selectedChargeList;
		}
		
		const dialogRef = this.dialog.open(CraneChargesComponent, {
			width: '1200px',
			maxWidth: '85%',
			height : 'auto',
			data: {
				chargesList: chargeList,
				chargesSelectedList: selectedChargeList,
				selectedDocs:selectedDocs,
				showDocuments : false,
				showAdjustment : true
				// remove these from both compos when docs are added to the VP as well.
			},
			closeOnNavigation: true,
			disableClose: true,
			autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((result: any) => {			
			if (result !== 'close') {
				if (type == 'crane') {
					this.craneCharges.selectedChargeList = result.selectedCharge;
					this.buildJobCharges(result.selectedCharge, 'crane');
				}
				if (type == 'awp') {
					this.awpCharges.selectedChargeList = result.selectedCharge
					this.buildJobCharges(result.selectedCharge, 'awp');
				};
				if (type == 'cargo') {
					this.looseCargoCharges.selectedChargeList = result.selectedCharge
					this.buildJobCharges(result.selectedCharge, 'cargo');
				};
				if (type == 'container') {
					this.containerCharges.selectedChargeList = result.selectedCharge
					this.buildJobCharges(result.selectedCharge, 'container');
				};
				this.onCalcuationsChanged()
			}
			dialogRefSub.unsubscribe()
		});
	}
	
	openCraneAwpDeductions(type) {
		let deductionList = [];
		let selectedDeductionList = [];
		let selectedDocs=[];

		if (type == 'crane') {
			deductionList = this.craneDeductions.deductionList
			selectedDeductionList = this.craneDeductions.selectedDeductionList;
		}
		if (type == 'awp') {
			deductionList = this.awpDeductions.deductionList
			selectedDeductionList = this.awpDeductions.selectedDeductionList;
		}	
		if (type == 'cargo') {
			deductionList = this.looseCargoDeductions.deductionList
			selectedDeductionList = this.looseCargoDeductions.selectedDeductionList;
		}	
		if (type == 'container') {
			deductionList = this.containerDeductions.deductionList
			selectedDeductionList = this.containerDeductions.selectedDeductionList;
		}	

		const dialogRef = this.dialog.open(CraneDeductionsComponent, {
			width: '1200px',
			maxWidth: '85%',
			data: {
				deductionsList: deductionList,
				deductionsSelectedList: selectedDeductionList,
				selectedDocs:selectedDocs,
				showDocuments : false,
				showAdjustment : true
			},
			closeOnNavigation: true,
			disableClose: true,
			autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((result: any) => {
			if (result !== 'close') {
				if (type == 'crane') {
					this.craneDeductions.selectedDeductionList = result?.selectedCharge;
					this.buildJobDeductions(result.selectedCharge, 'crane')
				}

				if (type == 'awp') {
					this.awpDeductions.selectedDeductionList = result?.selectedCharge
					this.buildJobDeductions(result.selectedCharge, 'awp');
				};
				if (type == 'cargo') {
					this.looseCargoDeductions.selectedDeductionList = result?.selectedCharge
					this.buildJobDeductions(result.selectedCharge, 'cargo');
				};
				if (type == 'container') {
					this.containerDeductions.selectedDeductionList = result?.selectedCharge
					this.buildJobDeductions(result.selectedCharge, 'container');
				};
				this.onCalcuationsChanged()
			}
			dialogRefSub.unsubscribe()
		});
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
			timeSheetSelectedList = this.awpTimeSheet.selectedSheetList;
			if(timeSheetSelectedList.length>0){
				this.billingUnitAwp=timeSheetSelectedList[0].billing_unit
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
				this.onCalcuationsChanged()

			}
			dialogRefSub.unsubscribe()
		});
	}
	onSelectTimeSheetTax(type) {
		const timesheet = this.mechanicActivityForm.get(type).get('timesheet_tax').value
		if (type == 'awp') {
			this.initialValues.awpTax = this.taxOptions.find(tax => tax.id == timesheet)
		}
		if (type == 'crane') {
			this.initialValues.craneTax = this.taxOptions.find(tax => tax.id == timesheet)
		}
		this.onCalcuationsChanged()
	}



	taxValueChanged(type, index) {
		const charges = (this.mechanicActivityForm.get(type).get('charges') as UntypedFormArray).at(index);
		const taxVal = this.taxOptions.find(tax => tax.id == charges.get('tax').value)
		if (taxVal) {
			charges.get('tax_label').setValue(taxVal.label)
		}

	}

	
	getAdditionalCharges(){
		let params = {
			vehicle_category: -1
		  }
		this._rateCardService.getCustomerAdditionalCharge(this.mechanicActivityForm.get('party').value,params).subscribe((res)=>{
			this.staticOptions.materialList = res['result'];
		})
	}

	openDescriptionPopup() {
		this.openDescription.next(true)
		this.openManageDescription.next(false)
	}

	openManageDescriptionPopup() {
		this.openManageDescription.next(true)
		this.openDescription.next(false)
	}
	openDescriptionPopupForLooseCargo() {
		this.openDescriptionForLooseCargo.next(true)
		this.openManageDescriptionForLooseCargo.next(false)
	}

	openManageDescriptionPopupForLooseCargo() {		
		this.openManageDescriptionForLooseCargo.next(true)
		this.openDescriptionForLooseCargo.next(false)
	}

	openDescriptionPopupForContainer() {
		this.openDescriptionForContainer.next(true)
		this.openManageDescriptionForContainer.next(false)
	}

	openManageDescriptionPopupForContainer() {		
		this.openManageDescriptionForContainer.next(true)
		this.openDescriptionForContainer.next(false)
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
							this.initialValues.item[this.expenseItemDropdownIndex] = { value: item?.name?.id, label: item?.name?.name };
							let other_expense = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
							other_expense.at(this.expenseItemDropdownIndex).get('item').setValue(item?.name?.id);
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

