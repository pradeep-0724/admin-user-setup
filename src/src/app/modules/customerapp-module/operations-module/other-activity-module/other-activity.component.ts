import { TaxService } from '../../../../core/services/tax.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isValidValue, getObjectFromList, getMinOrMaxDate, getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat, PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { OperationsActivityService } from '../../api-services/operation-module-service/operations-activity.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { PartyType, ValidationConstants, VendorType } from 'src/app/core/constants/constant';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { OthersClass } from './other-class/other.class';
import { OtherClassService } from './other-class/other.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { getEmployeeObject } from '../../master-module/employee-module/employee-utils';
import { Dialog } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupComponent } from '../../master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { cloneDeep } from 'lodash';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';


@Component({
	selector: 'app-edit-other-activity',
	templateUrl: './other-activity.component.html',
	styleUrls: [
		'./other-activity.component.scss'
	],
})
export class OtherActivityComponent extends OthersClass implements OnInit, OnDestroy {
	otherActivityForm: UntypedFormGroup;
	expenseItemDropdownIndex: number = -1;
	employeeList: any = [];
	vehicleList: any = [];
	staticOptions: any = {};
	current_date: Date = new Date(dateWithTimeZone());
	vendorList: any = [];
	accountList: any = [];
	bankingChargeRequired: Boolean = false;
	vendorSelected: any = {};
	newExpenseTotals: any = {
		subtotal: 0,
		discountTotal: 0,
		taxes: [],
		discountAfterTaxTotal: 0,
		tdsAmount: 0,
		adjustmentAmount: 0,
		total: 0,
		balance: 0.0
	};
	BillDate: any;
	selectedPaymentTerm: any;
	materialList: any = [];
	paymentAccountList: any;
	paymentStatusDisable: boolean;
	defaultTax = new ValidationConstants().defaultTax;
	itemDropdownPostApi = TSAPIRoutes.operation + TSAPIRoutes.expense;
	itemParams: any = {
		name: '',
	};
	initialDropdownValue: any = getBlankOption();
	initialDropdownObject: any = {
		name: '',
		rate_per_unit: 0
	}
	initialValues: any = {
		vendor: {},
		tds: {},
		gstTreatment: {},
		placeOfSupply: {},
		employee: {},
		paymentTerm: {},
		item: [],
		units: [],
		tax: [],
		account: [],
		adjustmentAccount: getBlankOption(),
		paymentStatus: {
			label: 'Unpaid',
			value: 1
		},
		paymentMode: {},

	};
	disableTax: boolean = false;
	unregisteredGst = new ValidationConstants().unregisteredGst;
	showGstinModal: boolean = false;
	vendorId: string;
	gstin: any = '';
	otherActivityId: any;
	otherActivityData: any;
	loadPage: boolean = false;
	isDomReady: boolean = false;
	paymentStatusOptions = [
		{ id: 1, label: 'Unpaid' },
		{ id: 2, label: 'Partially Paid' },
		{ id: 3, label: 'Paid' },
	]
	isAmountUsed: boolean;
	minDate: Date;
	companyRegistered: boolean = true;
	afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption
	expenseAccountList: any = [];
	otherExpenseValidatorSub: Subscription;
	adjustmentValidatorSub: Subscription;
	discountAfterTaxSub: Subscription;
	discountSub: Subscription;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	errorHeaderMessage = new ErrorList().headerMessage;
	paymentModeRequired: boolean = false;
	currency_type;
	documentPatchData: any = [];
	patchFileUrls = new BehaviorSubject([]);
	vendorDetails;
	isDueDateRequired = false;

	showAddCoaPopup: any = { name: '', status: false };
	coaParams: any = {
		name: '',
	};
	coaDropdownIndex: number = -1;
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
	lastSectiondata = {
		data: []
	}
	partyTaxDetails = new BehaviorSubject<any>(this.partyDetailsData);
	lastSectionTaxDetails = new BehaviorSubject<any>(this.lastSectiondata);
	isTax = true;
	placeOfSupply = [];
	taxOptions = [];
	tdsOptions = [];
	editData = new BehaviorSubject<any>({});
	lastSectionEditData = new BehaviorSubject<any>({});
	taxFormValid = new BehaviorSubject<any>(true);
	taxDetails;
	prefixUrl: string;
	isTdsDecleration = false;
	apiError ='';
  isTds=false;
  policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  terminology :any;
  isPaymentstatusValid=true;
  $paymentStatusValid = new BehaviorSubject(true)
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/SIoQhrEnNXg1aiCjLwwE?embed%22"
  }
  paymentTermCustom=new ValidationConstants().paymentTermCustom;

	constructor(
		private _fb: UntypedFormBuilder,
		private _commonService: CommonService,
		private _partyService: PartyService,
		private _operationsActivityService: OperationsActivityService,
		private _revenueService: RevenueService,
		private _route: Router,
		private _activateRoute: ActivatedRoute,
		private currency: CurrencyService,
		private _taxService: TaxModuleServiceService,
		private _otherClassService: OtherClassService,
		private _prefixUrl: PrefixUrlService,
		private _isTax:TaxService,
		private _analytics:AnalyticsService,
		private _terminologiesService:TerminologiesService,
		private _scrollToTop:ScrollToTop,
		private dialog : Dialog,
		private commonloaderservice:CommonLoaderService,
		private apiHandler:ApiHandlerService

	) {
		super();
		this.getTaxDetails();
    this.terminology = this._terminologiesService.terminologie;
	}

	ngOnDestroy() {
		this.otherExpenseValidatorSub.unsubscribe();
		this.adjustmentValidatorSub.unsubscribe();
		this.discountSub.unsubscribe();
		let removeLoader = document.getElementsByTagName("body")[0];
		removeLoader.classList.remove("removeLoader");
		this.commonloaderservice.getShow()
	}

	ngOnInit() {
		setTimeout(() => {
			this.prefixUrl = this._prefixUrl.getprefixUrl();
			this.currency_type = this.currency.getCurrency();
			this.isTax = this._isTax.getTax();
      this.isTds = this._isTax.getVat();
		}, 1000);
		this.buildForm();

		this.otherActivityForm.controls['bill_date'].setValue(new Date(dateWithTimeZone()));
		this.minDate=new Date(dateWithTimeZone());
		this.otherActivityForm.controls['reminder'].setValue(new Date(dateWithTimeZone()))
		this._activateRoute.params.subscribe((pramas) => {
			this.otherActivityId = pramas.other_activity_id;
			this._otherClassService.getEmployeeList(employeeList => {
				if (employeeList && employeeList.length > 0) {
					this.employeeList = employeeList;
				}
			})


			this._otherClassService.getVehicleList(vehicleList => {
				if (vehicleList && vehicleList.length > 0) {
					this.vehicleList = vehicleList;
				}
			})

			this._otherClassService.getAccountsList(accountList => {
				if (accountList && accountList.length > 0) {
					this.accountList = accountList;
				}
			})

			this._otherClassService.getPaymentAccountsList(paymentAccountList => {
				if (paymentAccountList && paymentAccountList.length > 0) {
					this.paymentAccountList = paymentAccountList;
				}
			})

			this.getVendorDetails()
			this._commonService
				.getStaticOptions(
					'billing-payment-method,payment-term,item-unit'
				)
				.subscribe((response) => {
					this.staticOptions.paymentMethods = response.result['billing-payment-method'];
					this.staticOptions.paymentTermList = response.result['payment-term'];
					this.staticOptions.itemUnits = response.result['item-unit'];
					if(!this.otherActivityId){
						this.initialValues.paymentTerm=cloneDeep(this.staticOptions.paymentTermList[0]);
				        this.otherActivityForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0]?.id)
						this.onpaymentTermSelected(this.staticOptions.paymentTermList[0]?.id)
					}
				});






			if (!this.otherActivityId) {
				this.buildNewItemExpenses([
					{}
				]);
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.OTHERSBILL,this.screenType.ADD,"Navigated");
				this.initialValues.tax.push(getNonTaxableOption());
			} else {
                this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.OTHERSBILL,this.screenType.EDIT,"Navigated");
		        this.getFormValues();
			}
		});
		this.getMaterials();
		this.getExpenseAccountsAndSetAccount();
	}

	handleEmployeeChange(){
		let empId=this.otherActivityForm.get('employee').value;
		let empObj=getEmployeeObject(this.employeeList,empId);
		this.initialValues.employee={label:empObj?.display_name,value:empId}
	
	  }
	
	ngAfterViewInit() {
		if (this.otherActivityId) {
			setTimeout(() => {
				this.isDomReady = true;
			}, 1);
		}
	}
	onWorkEndDateChange() {
		let item = this.staticOptions.paymentTermList.filter((item: any) => item.label == 'Custom')[0]				
		this.initialValues.paymentTerm = { label: item.label, value: item.id };
		this.otherActivityForm.get('payment_term').setValue(item.id)
	} 

	openGothrough(){
		this.goThroughDetais.show=true;
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
			this.otherActivityForm.get('vendor').setValue($event.id);

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


	getFormValues() {
		this._operationsActivityService.getOtherActivityDetails(this.otherActivityId).subscribe((data: any) => {
			this.otherActivityData = data.result;
			this.taxDetails = data.result;
			this.isAmountUsed = this.otherActivityData.is_amount_used;
			this.vendorId=data.result.vendor?.id;
			this.minDate=getMinOrMaxDate(data.result.bill_date);
			if(this.vendorId){
				this._partyService.getPartyAdressDetails(this.vendorId).subscribe(
					res => {
						this.vendorSelected = res.result;
					});
			}
			
			this.paymentTermPatch(this.otherActivityData);
			this.employeePatch(this.otherActivityData);
			this.adjustmentAccountPatch(this.otherActivityData);
			if (isValidValue(this.otherActivityData['discount_after_tax_type'])) {
				this.otherActivityData['discount_after_tax_type'] = this.otherActivityData['discount_after_tax_type']['index']
			}
			this.otherActivityForm.patchValue(this.otherActivityData);
			this.vendorSelectedPatch(this.otherActivityData);
			this.patchDocuments(this.otherActivityData);
			if (this.isTax) {
				this.onVendorId();
				this.lastSectionEditData.next({
					patchData: this.otherActivityData,
					lastSectionData: this.lastSectiondata.data
				})
			}
			if (this.otherActivityData.item_expenses.length > 0) {
				this.initialValues.item = [];
				this.initialValues.tax = [];
				this.otherActivityData.item_expenses.forEach((itemexpenses, index) => {
					this.initialValues.account.push({
						value: itemexpenses.expense_account ? itemexpenses.expense_account.id : null,
						label: itemexpenses.expense_account ? itemexpenses.expense_account.name : ''
					});
					itemexpenses.expense_account = isValidValue(itemexpenses.expense_account) ? itemexpenses.expense_account.id : null;
					this.initialValues.item.push(
						{
							label: isValidValue(itemexpenses.item) ? itemexpenses.item.name : '',
							value: isValidValue(itemexpenses.item) ? itemexpenses.item.id : null
						}
					);
					itemexpenses.item = isValidValue(itemexpenses.item) ? itemexpenses.item.id : null;
					this.initialValues.tax.push(
						{
							label: isValidValue(itemexpenses.tax) ? itemexpenses.tax.label : '',
							value: isValidValue(itemexpenses.tax) ? itemexpenses.tax.id : null
						}
					);
					itemexpenses.tax = isValidValue(itemexpenses.tax) ? itemexpenses.tax.id : this.defaultTax;
					this.initialValues.units.push({
						value: itemexpenses.units ? itemexpenses.units.id : null,
						label: itemexpenses.units ? itemexpenses.units.label : ''
					});
					itemexpenses.units = isValidValue(itemexpenses.units) ? itemexpenses.units.id : null;
				});
				this.buildNewItemExpenses(this.otherActivityData.item_expenses);
			} else {
				this.buildNewItemExpenses([
					{}
				]);
			}
			setTimeout(() => {
				this.onCalcuationsChanged();
			}, 100);
		});
	}

	fileUploader(filesUploaded) {
		let documents = this.otherActivityForm.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}
	fileDeleted(deletedFileIndex) {
		let documents = this.otherActivityForm.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.otherActivityForm.get('documents') as UntypedFormControl;
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


	addExpenseToOption($event) {
		if ($event) {

			this._revenueService.getAccounts('Expense').subscribe((response) => {
				if (response !== undefined) {
					this.accountList = response.result;
				}
			});
			if (this.coaDropdownIndex != -1) {
				this.initialValues.account[this.coaDropdownIndex] = { value: $event.id, label: $event.label };

				let other_expense = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
				other_expense.at(this.coaDropdownIndex).get('expense_account').setValue($event.id);
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

	onChangeOtherExpenseItem(index) {
		const otherExpenses = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		const otherExpense = otherExpenses.at(index);
		const itemId = otherExpense.get('item').value;
		if (itemId) {
			const expenseItem = getObjectFromList(itemId, this.materialList);
			if (expenseItem) {
				if (expenseItem.account) {
					otherExpense.get('expense_account').setValue(expenseItem.account.id);
					this.initialValues.account[index] = { label: expenseItem.account.name, value: expenseItem.account.id }
				}
				else {
					otherExpense.get('expense_account').setValue(null);
					this.initialValues.account[index] = getBlankOption();
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

			}
		}
		this.onCalcuationsChanged();
	}

	getMaterials() {

		this._otherClassService.getMaterialsList(materialList => {
			if (materialList && materialList.length > 0) {
				this.materialList = materialList;
			}
		})
	}

	getExpenseAccountsAndSetAccount() {
		this._otherClassService.getExpenseAccountsAndSetAccountList(expenseAccountList => {
			if (expenseAccountList && expenseAccountList.length > 0) {
				this.expenseAccountList = expenseAccountList;
				if (!this.otherActivityId) {
					this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
					this.otherActivityForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
				}
			}
		})
	}

	addParamsToItems($event) {
		this.itemParams = {
			name: $event
		};
	}

	buildForm() {
		this.otherActivityForm = this._fb.group({
			bill_date: [
				null,
				Validators.required
			],
			bill_number: [
				'',
				[Validators.required, Validators.pattern(this.policyNumber)]
			],
			vendor: [
				null,
				Validators.required
			],
			place_of_supply: [''],
			employee: [
				null
			],
			payment_term: [
				null
			],
			due_date: [
				moment().format('YYYY-MM-DD')
			],
			discount_type: [
				0
			],
			discount: [
				0
			],
			sub_total_without_tax: [0],
			adjustment_account: [
				null
			],
			adjustment_choice: [
				0
			],
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
			tds_type: [
				null
			],
			tds_amount: [
				0
			],
			tds: [
				0.0, [Validators.min(0), Validators.max(100)]
			],
			item_expenses: this._fb.array([]),
			payment_status: [
				1
			],
			amount_paid: [
				0
			],
			payment_mode: [
				null
			],
			paid_employee:[null],
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
			deleted_items: this._fb.array([]),
		});

		this.otherActivityForm.controls['transaction_date'].setValue(this.current_date);
		if (this.otherActivityForm.controls['payment_status'].value == 1)
			this.paymentStatusDisable = true;
		this.otherActivityForm.controls['transaction_date'].setValue(null);
		this.setFormValidators();
		this.onCalcuationsChanged();

	}

	buildNewItemExpenses(items) {
		let newItemExpenses = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		items.forEach((item) => {
			newItemExpenses.push(this.buildNewMaintainanceForm(item));
		});
	}


	addItemExpense() {
		let itemExpenses = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		itemExpenses.push(this.buildNewMaintainanceForm({}));
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
		this.initialValues.account.push(getBlankOption());
		this.initialValues.tax.push(getNonTaxableOption());
	}

	removeItemExpense(index) {
		let itemExpenses = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		itemExpenses.removeAt(index);
		this.onCalcuationsChanged()
		this.initialValues.units.splice(index, 1);
		this.initialValues.item.splice(index, 1);
		this.initialValues.tax.splice(index, 1);
		this.initialValues.account.splice(index, 1);
	}

	resetOtherItem(formGroup: UntypedFormGroup, index) {
		const singleUse = this.buildNewMaintainanceForm({});
		formGroup.patchValue(singleUse.value);
		this.initialValues.account[index] = getBlankOption();
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.item[index] = getBlankOption();
		this.initialValues.tax[index] = getNonTaxableOption();
		this.onCalcuationsChanged();
	}

	clearAllItemExpense() {
		let itemExpenses = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		itemExpenses.reset();
		itemExpenses.controls = [];
		this.emptyItemExpense();
		this.addItemExpense();
		this.onCalcuationsChanged()
	}

	emptyItemExpense() {
		this.initialValues.item = [];
		this.initialValues.units = [];
		this.initialValues.account = [];
		this.initialValues.tax = [];
	}


	clearNewItemExpenses() {
		const newItemExpenses = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		this.initialValues.item = [];
		newItemExpenses.controls.forEach((controls, index) => {
			let item_expenses_id = controls.get('id').value;
			controls.reset(index);
			controls.get('id').setValue(item_expenses_id);
			this.initialValues.item.push(getBlankOption());
		});
		this.onCalcuationsChanged();
	}

	buildNewMaintainanceForm(item: any) {
		return this._fb.group({
			id: [
				item.id || ''
			],
			expense_account: [
				item.expense_account || null,
			],
			item: [
				item.item || null,
			],
			quantity: [
				item.quantity || 0 ,[Validators.min(1)],
			],
			units: [
				item.units || null,[Validators.required],
			],
			tax: [item.tax || this.defaultTax],
			total_before_tax: [item.total_before_tax || 0],
			rate_per_unit: [
				item.rate_per_unit || 0 ,[Validators.min(0.01)],
			],
			total: [
				item.total || 0,
			],
		});
	}

	onVendorSelected(e) {
		this.commonloaderservice.getHide()
		if (e.target.value === '') {
			this.vendorSelected = null;
			this.vendorId = null;
			return;
		}
		this.initialValues.paymentTerm = {};
		if (isValidValue(e.target.value)) {
			this.vendorId = e.target.value;
			this.clearAllItemExpense();
			this._partyService.getPartyAdressDetails(e.target.value).subscribe(
				res => {
					this.vendorSelected = res.result;
					this.otherActivityForm.controls['payment_term'].setValue(null);
					this.otherActivityForm.controls['due_date'].setValue(null);
					if (this.vendorSelected.terms?.id) {
						this.onpaymentTermSelected(this.vendorSelected.terms ? this.vendorSelected.terms.id : null);
						this.otherActivityForm.controls['payment_term'].setValue(
							this.vendorSelected.terms.id);
							this.initialValues.paymentTerm['label']=this.vendorSelected.terms.label;
							this.initialValues.paymentTerm['value']=this.vendorSelected.terms.value

					}
					else{
						this.initialValues.paymentTerm=this.staticOptions.paymentTermList[0];
				     	this.otherActivityForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0].id);
				     	this.otherActivityForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))

					}

					this.gstin = this.vendorSelected.tax_details.gstin;
					this.isTdsDecleration =res.result.tax_details.tds_declaration;
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
		}
	}

	onpaymentTermSelected(termId) {
		if (termId) {
			this.selectedPaymentTerm = getObjectFromList(termId, this.staticOptions.paymentTermList);
			this.BillDate = this.otherActivityForm.controls['bill_date'].value;
			if(termId==this.paymentTermCustom){
				this.otherActivityForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.BillDate, this.vendorSelected['terms_days'] ));
			}else{
				this.otherActivityForm.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.BillDate, this.selectedPaymentTerm ? this.selectedPaymentTerm.value : ''));
			}
			
		}

		if (termId) {
			this.otherActivityForm.controls['due_date'].setValidators([Validators.required]);
			this.otherActivityForm.controls['due_date'].updateValueAndValidity();
			this.isDueDateRequired = true;
		} else {
			this.isDueDateRequired = false;
			this.otherActivityForm.controls['due_date'].setValidators(null);
			this.otherActivityForm.controls['due_date'].updateValueAndValidity();
		}

	}

	onCalendarChangePTerm(billDate) {
		if (billDate) {
			if (this.otherActivityForm.controls['payment_status'].value != 1) {
				this.otherActivityForm.controls['transaction_date'].patchValue(billDate);
			}
			this.otherActivityForm.controls['due_date'].patchValue(null);
			this.minDate = getMinOrMaxDate(billDate);
		}
		let existingTerm = this.otherActivityForm.controls['payment_term'].value;
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}

	onItemSelected(itemExpenseControl: UntypedFormGroup, index: number) {
		this.resetOtherExpenseExceptItem(itemExpenseControl, index);
		this.onChangeOtherExpenseItem(index);
	}

	resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({ units: null, rate_per_unit: 0, total: 0, quantity: 0, expense_account: null,total_before_tax : 0 });
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.account[index] = getBlankOption();
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


	toggleItemOtherFilled(enable: Boolean = false) {
		const otherItems = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		otherItems.controls.forEach(ele => {
			if (enable) {
				ele.enable();
			} else {
				if (Number(ele.value.total) == 0) {
					ele.disable();
				}
			}
		});
	}

	updateExpense() {
		this.toggleItemOtherFilled();
		let form = this.otherActivityForm;
		if (form.valid) {
			this.apiHandler.handleRequest(this._operationsActivityService.putNewOtherActivity(this.prepareRequest(form), this.otherActivityId),'Bill updated successfully!').subscribe(
				{
					next: (resp) => {
						this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.OTHERSBILL)
				this._route.navigate([this.prefixUrl + '/expense/others_expense/list'], { queryParams: { pdfViewId:this.otherActivityId } });
						},
						error: (error) => {
							this.apiError = error['error']['message'];
					setTimeout(() => {
						this.apiError = '';
					}, 10000);
						},
				}
			)
		} else {
			this.setAsTouched(form);
			this.setFormGlobalErrors();
		}
		this.toggleItemOtherFilled(true);
	}

	saveExpense() {
		this.toggleItemOtherFilled();
		let form = this.otherActivityForm;
    this.$paymentStatusValid.next(this.isPaymentstatusValid);
		if (this.newExpenseTotals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop()
			window.scrollTo(0, 0);
		}
		if (form.valid && this.isPaymentstatusValid) {
			this.apiError ='';
			this.apiHandler.handleRequest(this._operationsActivityService.postNewOtherActivity(this.prepareRequest(form)),'Bill added successfully!').subscribe(
				{
					next: (resp) => {
						this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.OTHERSBILL)
				this._route.navigateByUrl(this.prefixUrl + '/expense/others_expense/list');
						},
						error: (error) => {
							this.apiError = error['error']['message'];
					setTimeout(() => {
						this.apiError = '';
					}, 10000);
						},
				}
			)
			
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop()
			this.setFormGlobalErrors();
			this.taxFormValid.next(form.valid);
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

	prepareRequest(form: UntypedFormGroup) {
		form.patchValue({
			bill_date: changeDateToServerFormat(form.controls['bill_date'].value),
			transaction_date: changeDateToServerFormat(form.controls['transaction_date'].value),
			reminder: changeDateToServerFormat(form.controls['reminder'].value),
			due_date: changeDateToServerFormat(form.controls['due_date'].value)
		});
		return form.value;
	}

	resetDropdowns() {
		this.initialDropdownValue = getBlankOption();
	}

	vendorSelectedPatch(ediOtherActivity) {
		if (ediOtherActivity.vendor) {
			this.initialValues.vendor['value'] = ediOtherActivity.vendor.id;
			this.initialValues.vendor['label'] = ediOtherActivity.vendor.display_name;
			this.otherActivityForm.controls['vendor'].patchValue(ediOtherActivity.vendor.id)
		} else {
			this.initialValues.vendor = getBlankOption();
		}
	}

	paymentTermPatch(editOtherActivity) {
		if (editOtherActivity.payment_term) {
			this.initialValues.paymentTerm['value'] = editOtherActivity.payment_term.id;
			this.initialValues.paymentTerm['label'] = editOtherActivity.payment_term.label;
			editOtherActivity.payment_term = editOtherActivity.payment_term.id;
		} else {
			this.initialValues.paymentTerm = getBlankOption();
		}
	}

	employeePatch(editOtherActivity) {
		if (editOtherActivity.employee) {
			this.initialValues.employee['value'] = editOtherActivity.employee.id;
			this.initialValues.employee['label'] = editOtherActivity.employee.display_name;
			editOtherActivity.employee = editOtherActivity.employee.id;
		} else {
			this.initialValues.employee = getBlankOption();
		}
	}


	adjustmentAccountPatch(details) {

		if (details.adjustment_account) {
			this.initialValues.adjustmentAccount['value'] = details.adjustment_account.id
			this.initialValues.adjustmentAccount['label'] = details.adjustment_account.name
			details.adjustment_account = details.adjustment_account.id;
		} else {
			this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
			this.otherActivityForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
		}
	}

	setFormValidators() {
		const item_other = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
			items.forEach((key, index) => {
				const item = item_other.at(index).get('item');
				const unit_cost = item_other.at(index).get('rate_per_unit');
				const quantity = item_other.at(index).get('quantity');
				const expense_account = item_other.at(index).get('expense_account');

				item.setValidators(Validators.required);
				expense_account.setValidators(Validators.required);
				if (items.length == 1) {
					if (!Number(unit_cost.value) && !item.value && !Number(expense_account.value) && !Number(quantity.value)) {
						item.clearValidators();
						expense_account.clearValidators();
					}
				}
				item.updateValueAndValidity({ emitEvent: true });
				expense_account.updateValueAndValidity({ emitEvent: true });
			});
		});

		let adjustmentAmount = this.otherActivityForm.get('adjustment');
		this.adjustmentValidatorSub = adjustmentAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

			const adjustmentAmount = this.otherActivityForm.get('adjustment');
			const adjustmentChoice = this.otherActivityForm.get('adjustment_choice');
			const adjustmentAfterSubtotal = this.newExpenseTotals.adjustmentAmount;
			const totalAmount = this.newExpenseTotals.total;
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

		let discountBeforeAmount = this.otherActivityForm.get('discount');
		this.discountSub = discountBeforeAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

			const adjustmentAmount = this.otherActivityForm.get('discount');
			const adjustmentChoice = this.otherActivityForm.get('discount_type');
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
			this.isTransactionIncludesTax =this.otherActivityForm.get('is_transaction_includes_tax').value;
			this.isTransactionUnderReverse =this.otherActivityForm.get('is_transaction_under_reverse').value;
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
			this.newExpenseTotals.taxes = result.result['tax'];
			this.tdsOptions = result.result['tds'];
			this.lastSectiondata.data = this.tdsOptions;
			this.lastSectionTaxDetails.next(this.lastSectiondata)
			this.companyRegistered = result.result['registration_status'];
		})
	}
	stopLoaderClasstoBody() {
		let removeLoader = document.getElementsByTagName("body")[0];
		removeLoader.classList.add("removeLoader");
	}

	setAllTaxAsNonTaxable() {
		this.initialValues.tax.fill(getNonTaxableOption());
		const otherItems = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		otherItems.controls.forEach((controls) => {
			controls.get('tax').setValue(this.defaultTax);
		});
		this.otherActivityForm.get('discount_after_tax').setValue(0);
	}

	lastSectionOutPut(data) {
		const form = this.otherActivityForm;
		form.get('tds_type').setValue(data['tds_type']);
		form.get('tds').setValue(data['tds']);
		this.onCalcuationsChanged();
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
			this.partyTaxDetails.next(this.partyDetailsData);
		}
		this.gstin = this.taxDetails['vendor'].tax_details['gstin'];
		this.isTdsDecleration =this.taxDetails['vendor'].tax_details['tds_declaration'];
		this.editData.next(
			{
				patchData: this.otherActivityData,
			});
		this.otherActivityForm.get('discount_after_tax').setValue(this.taxDetails['discount_after_tax']);
	}

  paymentStatusData(data:{data:any,valid:boolean}){
    this.otherActivityForm.patchValue({
      amount_paid:data.data.amount_paid,
      bank_charges:data.data.bank_charges,
      payment_mode : data.data.payment_mode,
      payment_status:data.data.payment_status,
	  paid_employee:data.data.paid_employee,
      transaction_date:changeDateToServerFormat(data.data.transaction_date)
    })
    this.isPaymentstatusValid=data.valid;
  }

  addNewAdditionalCharge(event,i) {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data : {
			isEdit : false,
			charge_name : event,
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
      if(item){
		this.expenseItemDropdownIndex=i
		this._revenueService.getExpense().subscribe((response) => {
			if (response && response.result && response.result.length > 0) {
				if (this.expenseItemDropdownIndex != -1) {
					this.materialList = response.result;
					this.initialValues.item[this.expenseItemDropdownIndex] = { value: item.name.id, label: item.name.name };
					let other_expense = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
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
