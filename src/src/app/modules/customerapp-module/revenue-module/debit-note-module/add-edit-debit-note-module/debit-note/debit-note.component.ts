import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { changeDateToServerFormat, PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { DebitService } from '../../../../api-services/revenue-module-service/debit-note-service/debit.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import * as _ from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { isValidValue, getObjectFromList, roundOffAmount, getBlankOption, getMinOrMaxDate, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { EmployeeService } from '../../../../api-services/master-module-services/employee-service/employee-service';
import { DebitNoteClass } from '../debit-note-class/debit-note.class';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
	selector: 'app-edit-debit-note',
	templateUrl: './debit-note.component.html',
	styleUrls: [
		'./debit-note.component.scss'
	],
	host: {
		"(window:click)": "clickOutToHide($event)"
	},
})
export class DebitNoteComponent extends DebitNoteClass implements OnInit {

	terminology: any;
	videoUrl = 'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Debit+note.mp4';
	addDebitNote;
	selectedParty: any;
	apiError: string;
	employeeList: any = [];
	partyList: any;
	paymentTermList: any;
	reasonList: any = [];
	invoiceList: any;	
	debitNoteId: string;
	saveButton: boolean = false;
	staticOptions: any = {};
	totals: any = {
		subtotal: 0.0,
		total: 0.0,
		roundOffAmount: 0.00,
		taxes: []
	};
	debitNoteData: any;
	dnNoteDate: any = new Date(dateWithTimeZone());
	selectedPaymentTerm: any;
	partyId: string;
	initialValues = {
		party: {},
		employee: {},
		paymentTerm: {},
		invoice: {},
		digitalSignature: {},
		item: [],
		units: [],
		reason: {},
		termsAndCondition: {},
		tax: []
	}
	
	companyRegistered: boolean = true;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	otherExpenseValidatorSub: Subscription;
	tersmAndConditions = [];
	currency_type;
	patchFileUrls = new BehaviorSubject([]);
	isDueDateRequired = false;
	showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
	taxOptions = [];
	defaultTax =new ValidationConstants().defaultTax;
	taxFormValid = new BehaviorSubject<any>(true);
	editData = new BehaviorSubject<any>({
		place_of_supply: ''
	});
	isTax = false;
	preFixUrl = '';
	gstin = '';
	taxDetails;
	digitalSignature = [];
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	minDate:Date;
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/CxynQegrHRRf2FTJcvOL?embed%22"
	}
	creditRemaining = {
		credit_remaining: 0,
		check_credit: false
	};
	customerDetails: any;
	creditLimit = {
		open: false,
		msg: ''
	}

	creditOnsaveLimit = {
		open: false,
		msg: ''
	}
	creditOnsaveAsDraftLimit = {
		open: false,
		msg: ''
	}
	paymentTermCustom=new ValidationConstants().paymentTermCustom;

	constructor(
		private _terminologiesService: TerminologiesService,
		private _router: Router,
		private _fb: UntypedFormBuilder,
		private _debitService: DebitService,
		private _commonService: CommonService,
		private _revenueService: RevenueService,
		private _partyService: PartyService,
		private _employeeService: EmployeeService,
		private _activateRoute: ActivatedRoute,
		private currency: CurrencyService,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _preFixUrl: PrefixUrlService,
		private _analytics: AnalyticsService,
		private _scrollToTop: ScrollToTop,
		private commonloaderservice: CommonLoaderService,
		public dialog: Dialog,private _commonloaderServie : CommonLoaderService,
		private _rateCardService: RateCardService,private apiHandler: ApiHandlerService

	) {
		super();
		this.getTaxDetails();
	}


	ngOnDestroy() {
		this.otherExpenseValidatorSub.unsubscribe();
		this.commonloaderservice.getShow();
	}

	ngOnInit() {
		this.terminology = this._terminologiesService.terminologie;
		this.preFixUrl = this._preFixUrl.getprefixUrl();
		this.isTax = this._tax.getTax();
		setTimeout(() => {
			this.currency_type = this.currency.getCurrency();
			this._commonloaderServie.getHide();
		}, 1000);
		this._debitService.getDebitSuggestedIds().subscribe((response: any) => {
			this.addDebitNote.controls['debit_note_number'].setValue(response.result['debitnote']);

		});
		this._activateRoute.params.subscribe((pramas) => {
			this.debitNoteId = pramas.debit_id;
			this.buildForm();
			let ClientPramas = '0'; // Client
			this._debitService.getPartyList(ClientPramas).subscribe((data: any) => {
				this.partyList = data.result;
			});

			this._employeeService.getEmployeeList().subscribe((employeeList) => {
				this.employeeList = employeeList;
			});
			this._commonService
				.getStaticOptions('payment-term,tax,item-unit,gst-treatment,debitnotereason')
				.subscribe((response) => {
					this.reasonList = response.result['debitnotereason'];
					this.staticOptions.itemUnits = response.result['item-unit'];
					this.paymentTermList = response.result['payment-term'];
					this.initialValues.paymentTerm = {...this.paymentTermList[0]};
					this.addDebitNote.get('payment_term').setValue(this.paymentTermList[0].id)
					this.onpaymentTermSelected(this.paymentTermList[0].id)
				});
			this._taxService.getTaxDetails().subscribe(result => {
				this.taxOptions = result.result['tax'];
				this.companyRegistered = result.result['registration_status'];
				this.totals.taxes = this.taxOptions;
			})

			this.addDebitNote.get('debit_note_date').setValue(new Date(dateWithTimeZone()));
			this.minDate=new Date(dateWithTimeZone());
			this.getTersmAndConditionList();
			this.getDigitalSignatureList();

			if (this.debitNoteId) {
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.DEBITNOTE, this.screenType.EDIT, "Navigated");
				setTimeout(() => {
					this.getFormValues();
				}, 1);
			} else {
				this._revenueService.getTersmAndConditionList('debit_note').subscribe((data) => {				
					this.addDebitNote.controls['narrations'].setValue(data['result']['tc_setting']['narration']);
					if (data['result']['tc_content'].length) {
						let defaultTAC = data['result']['tc_content'].find(ts => ts.is_default == true)
						if (isValidValue(defaultTAC)) {
							this.initialValues.termsAndCondition = { label: defaultTAC.name, value: defaultTAC.id }
							this.addDebitNote.get('terms_and_condition').setValue(defaultTAC.id)
						}
					}
				});
				this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.DEBITNOTE, this.screenType.ADD, "Navigated");
			}
		});
	}
	
	clickOutToHide(e) {
		if (!e.target.className.includes('btn btn--primary')) {
			this.saveButton = false;
		}

	}
	onWorkEndDateChange() {
		let item = this.paymentTermList.filter((item: any) => item.label == 'Custom')[0]
		this.initialValues.paymentTerm = { label: item.label, value: item.id };
		this.addDebitNote.get('payment_term').setValue(item.id)
	}

	
	openGothrough() {
		this.goThroughDetais.show = true;
	}

	getTersmAndConditionList() {
		this._revenueService.getTersmAndConditionList('debit_note').subscribe((response: any) => {
		  this.tersmAndConditions = response.result['tc_content'];
		});
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
			this.addDebitNote.get('party').setValue($event.id);
			this.initialDetailsOnPartySelected($event.id);


		}
	}

	/* For getting all the party Details */
	getPartyDetails() {
		let ClientPramas = '0'; // Client
		this._debitService.getPartyList(ClientPramas).subscribe((data: any) => {
			this.partyList = data.result;

		});
	}

	/* After closing the party modal to clear all the values */
	closePartyPopup() {
		this.showAddPartyPopup = { name: '', status: false };
	}

	patchFormValues(data: any) {		
		if (isValidValue(data)) {
			if (isValidValue(data.invoice)) {
				this.addDebitNote.controls['invoice_date'].setValue(data.invoice.invoice_date);
			}
			this.dnNoteDate = data.debit_note_date;
			data.party = isValidValue(data.party) ? data.party.id : null;
			data.employee = isValidValue(data.employee) ? data.employee.id : null;
			data.reason = isValidValue(data.reason) ? data.reason.id : null;
			data.payment_term = isValidValue(data.payment_term) ? data.payment_term.id : null;
			data.signature = isValidValue(data.signature) ? data.signature.id : null;
			data.terms_and_condition = isValidValue(data.terms_and_condition) ? data.terms_and_condition.id : null
			data.invoice = isValidValue(data.invoice) ? data.invoice.id : null;
			
			if (data.other_items.length > 0) {
				data.other_items.forEach((otherItem) => {
					otherItem.item = isValidValue(otherItem.item) ? otherItem.item.id : null;
					otherItem.units = isValidValue(otherItem.units) ? otherItem.units.id : null;
					otherItem.tax = isValidValue(otherItem.tax) ? otherItem.tax.id : this.defaultTax;
					otherItem.total = otherItem.total
				});
				this.buildOtherItems(data.other_items);
			} else {
				this.buildOtherItems([
					{}
				]);
			}
			this.addDebitNote.patchValue(data);
		}
	}

	getFormValues() {
		this._debitService.getDebitNoteDetails(this.debitNoteId).subscribe((data: any) => {
			this.debitNoteData = data.result;
			this.editData.next(this.debitNoteData);
			let partyId = this.debitNoteData.party ? this.debitNoteData.party.id : null
			this.partyId = partyId;
			this.minDate=getMinOrMaxDate(data.result.debit_note_date)
			if (partyId) {
				this._partyService.getPartyInvoices(partyId, '1,2').subscribe((response) => {
					this.invoiceList = response.result;
				});
				this._partyService.getPartyAdressDetails(partyId).subscribe((response) => {
					this.selectedParty = response.result;	
				});
			}
			this.partyNamePatch(this.debitNoteData);
			this.invoicePatch(this.debitNoteData);
			this.employeePatch(this.debitNoteData);
			this.paymentTermPatch(this.debitNoteData);
			this.reasonPatch(this.debitNoteData);
			this.itemOtherPatch(this.debitNoteData);
			this.patchTermsAndConditions(this.debitNoteData);
			this.patchSignature(this.debitNoteData.signature)
			this.patchFormValues(this.debitNoteData);
			this.patchDocuments(this.debitNoteData);
			setTimeout(() => {
				this.calculationsChanged();
			}, 1000);
			this.getAdditionalCharges();
		});
	}

	patchSignature(signature) {
		if (signature) {
			this.initialValues.digitalSignature['value'] = signature.id
			this.initialValues.digitalSignature['label'] = signature.name
		} else {
			this.initialValues.digitalSignature['label'] = ''
		}
	}

	patchDocuments(data) {
		if (data.documents.length > 0) {
			let documentsArray = this.addDebitNote.get('documents') as UntypedFormControl;
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

	fileUploader(filesUploaded) {
		let documents = this.addDebitNote.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}

	fileDeleted(deletedFileIndex) {
		let documents = this.addDebitNote.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	onPartySelected() {
		const party = this.addDebitNote.get('party').value;
		this._partyService.getPartyAdressDetails(party).subscribe((response) => {
			this.customerDetails = response['result']
			this.creditRemaining.check_credit = this.customerDetails.check_credit
			this.creditRemaining.credit_remaining = this.customerDetails.credit_remaining
			if (this.creditRemaining.check_credit) {
				if (this.creditRemaining.credit_remaining > 0) {
					this.initialDetailsOnPartySelected(party);
				} else {
					this.creditLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount: ' + this.currency_type?.symbol +" "+ this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
					this.creditLimit.open = true;
				}
			} else {
				this.initialDetailsOnPartySelected(party);
			}
		});
		this.getAdditionalCharges();
	}

	initialDetailsOnPartySelected(ele) {
		this.apiError = '';
		if (ele === '') {
			this.selectedParty = null;
			this.partyId = null;
			return;
		}
		this.partyId = ele;
		this.initialValues.paymentTerm = {};
		this.addDebitNote.get('employee').patchValue('');
		this.initialValues.employee=getBlankOption();
		this._partyService.getPartyAdressDetails(ele).subscribe((response) => {
			this.gstin = response.result.tax_details.gstin;
			this.selectedParty = response.result;
			if(this.selectedParty.sales_person_name?.id){
				this.addDebitNote.get('employee').patchValue(this.selectedParty.sales_person_name?.id);
				this.initialValues.employee={label:this.selectedParty.sales_person_name?.name ,value:this.selectedParty.sales_person_name?.id}
		
			}

			this.addDebitNote.controls['invoice'].setValue(null);
			if (this.partyId) {
				this._partyService.getPartyInvoices(this.partyId, '1,2', '1').subscribe((response) => {
					this.invoiceList = response.result;

				});
			}
			this.addDebitNote.controls['address'].patchValue(this.selectedParty.address);
			this.addDebitNote.controls['payment_term'].setValue('');
			this.addDebitNote.controls['due_date'].setValue('');
			if (this.selectedParty.balance_billing.terms?.id) {
				this.onpaymentTermSelected(this.selectedParty.balance_billing.terms ? this.selectedParty.balance_billing.terms.id : null);

				this.addDebitNote.controls['payment_term'].setValue(
					this.selectedParty.balance_billing.terms.id);
				this.initialValues.paymentTerm['label'] = this.selectedParty.balance_billing.terms.label;
			}
			else {
				this.initialValues.paymentTerm['label'] = this.paymentTermList[0].label;
				this.addDebitNote.get('payment_term').setValue(this.paymentTermList[0].id);
				this.addDebitNote.get('due_date').setValue(moment().format('YYYY-MM-DD'))
			}
		});

		this.addDebitNote.controls['invoice_date'].setValue('');
		this.initialValues.invoice = {};
		this.calculationsChanged();
	}

	populate_invoice_date(evn) {
		this.commonloaderservice.getHide();
		const invoice = getObjectFromList(evn, this.invoiceList);
		this.addDebitNote.controls['invoice_date'].setValue(invoice ? invoice.invoice_date : null);
	}

	onpaymentTermSelected(termId) {
		if (termId) {
			this.selectedPaymentTerm = getObjectFromList(termId, this.paymentTermList);
			if(termId==this.paymentTermCustom){
				this.addDebitNote.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.dnNoteDate, this.selectedParty['terms_days']));
			}else{
				this.addDebitNote.controls['due_date'].setValue(
					PaymentDueDateCalculator(this.dnNoteDate, this.selectedPaymentTerm ? this.selectedPaymentTerm.value : null));
			}
		
		}
		if (termId) {
			this.addDebitNote.controls['due_date'].setValidators([Validators.required]);
			this.addDebitNote.controls['due_date'].updateValueAndValidity();
			this.isDueDateRequired = true;
		} else {
			this.isDueDateRequired = false;
			this.addDebitNote.controls['due_date'].setValidators(null);
			this.addDebitNote.controls['due_date'].updateValueAndValidity();
		}
	}

	onDateSelection() {
		let existingTerm = this.addDebitNote.controls['payment_term'].value;
		this.dnNoteDate = this.addDebitNote.controls['debit_note_date'].value;
		this.minDate=getMinOrMaxDate(this.dnNoteDate)
		if (existingTerm)
			this.onpaymentTermSelected(existingTerm);
	}

	getItemById(id: String, list: []): any {
		return list.filter((item: any) => item.id === id)[0];
	}

	resetOtherExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({
			units: null, unit_cost: 0.00, discount: 0.00, total: 0.00,
			quantity: 0.000, amount: 0.00,tax:this.defaultTax
		});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.tax[index] = getNonTaxableOption()
	}

	resetOther(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({
			units: null, unit_cost: 0.00, discount: 0.00, total: 0.00,
			quantity: 0.000, amount: 0.00, item: null,tax:this.defaultTax
		});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.item[index] = getBlankOption();
		this.initialValues.tax[index] = getNonTaxableOption();
		this.calculationsChanged();
	}


	onMaterialSelected(event, itemExpenseControl: UntypedFormGroup, index: number) {
		this.resetOtherExceptItem(itemExpenseControl, index);
		if (event.target.value) {
			const itemSelected = this.staticOptions.materialList.find(charges=> charges['name']['id']==event.target.value);
			itemExpenseControl.get('unit_cost').setValue(itemSelected.rate);
			itemExpenseControl.get('tax').setValue(itemSelected.tax['id']);
			itemExpenseControl.get('units').setValue(itemSelected.unit_of_measurement ? itemSelected.unit_of_measurement.id : null);
			if (itemSelected.unit_of_measurement) {
				this.initialValues.units[index] = { label: itemSelected.unit_of_measurement.label, value: itemSelected.unit_of_measurement.id }
			}
			this.initialValues.tax[index] = { label: itemSelected.tax.label, value: itemSelected.tax.id }
		}
		this.calculationsChanged();
	}

	buildForm() {
		this.addDebitNote = this._fb.group({
			party: [
				'',
				Validators.required
			],
			reason: [
				null
			],

			reference_number: [
				''
			],
			signature: [''],
			debit_note_date: [
				null,
				Validators.required
			],
			debit_note_number: [
				'',
				Validators.required
			],
			payment_term: [
				null
			],
			due_date: [
				moment().format('YYYY-MM-DD')
			],
			invoice: [
				null,
				Validators.required
			],
			invoice_date: [
				null
			],
			narrations: [
				''
			],
			remarks: [
				''
			],
			terms_and_condition: [
				null
			],
			documents: [
				[]
			],
			employee: [
				''
			],
			is_roundoff: [
				false
			],
			place_of_supply: [''],
			is_transaction_under_reverse: [
				false
			],
			is_transaction_includes_tax: [
				false
			],
			address: this._fb.array([
				this._fb.group({
					address_line_1: [
						''
					],
					address_type: [
						0
					],
					city: [
						''
					],
					district: [
						''
					],
					document: [],
					pincode: [
						null
					],
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
						1
					],
					city: [
						''
					],
					district: [
						''
					],
					document: [],
					pincode: [
						null
					],
					state: [
						''
					],
					street: [
						''
					]
				})
			]),
			others: this._fb.array([]),
			deleted_items: this._fb.array([])
		});
		if (!this.debitNoteId) {
			this.buildOtherItems([{}]);
		}
		this.setOtherValidators();
	}

	buildOtherItems(items: any = []) {
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
		this.initialValues.tax.push(getNonTaxableOption());
		items.forEach((item) => {
			otherItems.push(this.addOthers(item));
		});
		this.calculationsChanged();
	}

	addOthers(item) {
		const otherForm = this._fb.group({
			id: [
				item.id || null
			],
			item: [
				item.item || null
			],
			quantity: [
				item.quantity || 0
			],
			units: [
				item.units || null
			],
			unit_cost: [
				item.unit_cost || 0
			],
			amount: [
				item.amount || 0,
				Validators.required
			],
			discount: [
				item.discount || 0
			],
			tax: [item.tax || this.defaultTax],
			total: [
				item.total || 0,
				Validators.required
			]
		});
		return otherForm;
	}

	addMoreOtherItem() {
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
		this.initialValues.tax.push(getNonTaxableOption());
		otherItems.push(this.addOthers({}));
	}

	removeOtherItem(index) {
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
		this.initialValues.item.splice(index, 1);
		this.initialValues.units.splice(index, 1);
		this.initialValues.tax.splice(index, 1);
		otherItems.removeAt(index);
		this.calculationsChanged();
	}



	emptyOtherItems() {
		this.initialValues.item = [];
		this.initialValues.units = [];
		this.initialValues.tax = [];
	}

	clearAllOtherItems() {
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
		otherItems.reset();
		otherItems.controls = [];
		this.emptyOtherItems();
		this.addMoreOtherItem();
		this.calculationsChanged();
	}

	

	patchValues() {
		(this.addDebitNote.controls['address'] as UntypedFormArray).controls[0].get('address_type').setValue(0);
		(this.addDebitNote.controls['address'] as UntypedFormArray).controls[1].get('address_type').setValue(1);
		this.addDebitNote.patchValue({
			debit_note_date: changeDateToServerFormat(this.addDebitNote.controls['debit_note_date'].value),
			due_date: changeDateToServerFormat(this.addDebitNote.controls['due_date'].value)
		});
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
		otherItems.controls.forEach((data) => {
			data.get('discount').value ? data.get('discount').value : data.get('discount').setValue(0);
			data.get('units').value ? data.get('units').value : data.get('units').setValue(null);
		});
		this.addDebitNote.controls["payment_term"].value ? this.addDebitNote.controls["payment_term"].value : this.addDebitNote.controls["payment_term"].setValue(null);
		this.addDebitNote.controls["due_date"].value ? this.addDebitNote.controls["due_date"].value : this.addDebitNote.controls["due_date"].setValue(null);
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
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
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



	submitForm() {
		this.toggleItemOtherFilled();
		const form = this.addDebitNote as UntypedFormGroup;
		this.patchValues();
		this.apiError = '';
		if (this.totals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}
		if (form.valid) {
			if (this.creditRemaining.check_credit && this.creditRemaining.credit_remaining >0) {
				const totalDebitAmount = Number(this.totals.total);
				if ((this.creditRemaining.credit_remaining - totalDebitAmount) < 0) {
					this.creditOnsaveLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount:' + this.currency_type?.symbol + this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
					this.creditOnsaveLimit.open = true;
				} else {
					this.saveDebitNote();
				}
			} else {
				this.saveDebitNote();
			}

		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
		}
		this.toggleItemOtherFilled(true);
	}

	saveDebitNote() {
		const form = this.addDebitNote as UntypedFormGroup;
		if (this.debitNoteId) {
			this.apiHandler.handleRequest(this._debitService.editDebitNote(form.value, this.debitNoteId), 'Debit Note updated successfully!').subscribe(
				{
					next: () => {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.DEBITNOTE)
						this._router.navigate([this.preFixUrl +
							'/income/debit-note/list'
						], { queryParams: { pdfViewId: this.debitNoteId } });
					},
					error: (err) => {
						this.apiError = '';
						let controlsName = err.error.hasOwnProperty("serializer") ? Object.keys(err.error.serializer)[0] : 'default_val';
						switch (controlsName) {
							case 'total_amount':
								this.apiError = err.error.serializer.total_amount
								window.scrollTo(0, 0);
								break;
							default:
								if (err.error.hasOwnProperty("message")) {
									this.apiError = err.error.message;
									window.scrollTo(0, 0);
								}
						}
					}
				}
			);
		}
		else {
			this.apiHandler.handleRequest(this._debitService.postDebitNote(form.value), 'Debit Note added successfully!').subscribe(
				{
					next: () => {
						this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.DEBITNOTE)
						this._router.navigate([this.preFixUrl +
							'/income/debit-note/list'
						]);
					},
					error: (err) => {
						this.apiError = '';
						if (err.error.status == 'error') {
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

		this.toggleItemOtherFilled();
		this.patchValues();
		const form = this.addDebitNote as UntypedFormGroup;
		if (form.valid) {
			if (this.creditRemaining.check_credit && this.creditRemaining.credit_remaining >= 0) {
				const totalInvoiceAmount = Number(this.totals.total);
				if ((this.creditRemaining.credit_remaining - totalInvoiceAmount) < 0) {
					this.creditOnsaveAsDraftLimit.msg = 'The customer has reached the credit limit, Remaining Credit Amount:' + this.currency_type?.symbol + this.creditRemaining.credit_remaining + ', Do you still want to continue ?';
					this.creditOnsaveAsDraftLimit.open = true;
				} else {
					this.debitNoteAsDraft();
				}
			} else {
				this.debitNoteAsDraft();
			}

		}
		else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
		}
		this.toggleItemOtherFilled(true);
	}

	debitNoteAsDraft() {
		const form = this.addDebitNote as UntypedFormGroup;
		if (this.debitNoteId) {
			this.apiHandler.handleRequest(this._debitService.putDebitNoteAsDraft(this.addDebitNote.value, this.debitNoteId), 'Debit Note draft updated successfully!').subscribe(
				{
					next: () => {
						this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.DEBITNOTE)
						this._router.navigate([this.preFixUrl +
							'/income/debit-note/list'
						]);
					},
					error: (err) => {
						this.apiError = '';
						if (err.error.hasOwnProperty("message")) {
							this.apiError = err.error.message;
							this._scrollToTop.scrollToTop();
							window.scrollTo(0, 0);
						}
					}
				}
			);
		}
		else {
			if (this.partyId) {
				this.apiHandler.handleRequest(this._debitService.postDebitNoteAsDraft(this.addDebitNote.value), 'Debit Note draft added successfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.DEBITNOTE)
							this._router.navigate([this.preFixUrl +
								'/income/debit-note/list'
							]);
						},
						error: (err) => {
							this.apiError = '';
							if (err.error.status == 'error') {
								this.apiError = err.error.message;
								this._scrollToTop.scrollToTop();
								window.scrollTo(0, 0);
							}
						}
					}
				);
			}
			else {
				this.apiError = 'Please select party';
				window.scrollTo(0, 0);
				form.get('party').markAsTouched();
				this._scrollToTop.scrollToTop();
			}

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

	partyNamePatch(vendorData) {
		if (vendorData.party) {
			this.initialValues.party['value'] = vendorData.party.id;
			this.initialValues.party['label'] = vendorData.party.display_name;
		} else {
			this.initialValues.party = getBlankOption();
		}
		this._partyService.getPartyAdressDetails(this.initialValues.party['value']).subscribe((response) => {
			this.gstin = response.result.tax_details.gstin;
		});
	}

	employeePatch(vendorData) {
		if (vendorData.employee) {
			this.initialValues.employee['value'] = vendorData.employee.id;
			this.initialValues.employee['label'] = vendorData.employee.display_name;
		} else {
			this.initialValues.employee = getBlankOption();
		}
	}

	paymentTermPatch(vendorData) {
		if (vendorData.payment_term) {
			this.initialValues.paymentTerm['value'] = vendorData.payment_term.id;
			this.initialValues.paymentTerm['label'] = vendorData.payment_term.label;
		} else {
			this.initialValues.paymentTerm = getBlankOption();
		}
	}

	reasonPatch(vendorData) {
		if (vendorData.reason) {
			this.initialValues.reason['value'] = vendorData.reason.id;
			this.initialValues.reason['label'] = vendorData.reason.label;
		} else {
			this.initialValues.reason = getBlankOption();
		}
	}

	patchTermsAndConditions(editCredit) {		
		if (editCredit.terms_and_condition) {
			this.initialValues.termsAndCondition['value'] = editCredit.terms_and_condition.id,
			this.initialValues.termsAndCondition['label'] = editCredit.terms_and_condition.name
		} else {
			this.initialValues.termsAndCondition = getBlankOption()
		}
	}

	invoicePatch(editCredit) {
		if (editCredit.invoice) {
			this.initialValues.invoice['value'] = editCredit.invoice.id;
			this.initialValues.invoice['label'] = editCredit.invoice.invoice_number;
		} else {
			this.initialValues.invoice = getBlankOption();
		}
	}


	itemOtherPatch(debitNote) {
		this.initialValues.tax = [];
		this.initialValues.item = [];
		this.initialValues.units = [];
		debitNote.other_items.forEach((ele, index) => {
			if (ele.item) {
				const obj = {
					value: ele.item.id,
					label: ele.item.name
				}
				this.initialValues.item.push(obj);
			} else {
				this.initialValues.item.push(getBlankOption());
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

			if (ele.units) {
				const obj = {
					value: ele.units.id,
					label: ele.units.label
				}
				this.initialValues.units.push(obj);
			} else {
				this.initialValues.units.push(getBlankOption());
			}

		});
	}

	getAddress(event) {
		this.addDebitNote.controls['address'].patchValue(event);
	}

	// round off amount
	roundOffAmount(formControl) {
		roundOffAmount(formControl);
	}

	// set validators for other expense in any value is added
	setOtherValidators() {
		const item_other = this.addDebitNote.controls['others'] as UntypedFormArray;
		this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(300)).subscribe((items) => {
			items.forEach((key, index) => {
				const item = item_other.at(index).get('item');
				const unit_cost = item_other.at(index).get('unit_cost');
				const units = item_other.at(index).get('units');
				const quantity = item_other.at(index).get('quantity');
				const amount = item_other.at(index).get('amount');
				const discount = item_other.at(index).get('discount');

				item.setValidators(Validators.required);
				units.setValidators(Validators.required);
				amount.setValidators(Validators.min(0.01));
				quantity.setValidators(Validators.min(0.01));
				unit_cost.setValidators(Validators.min(0.01));
				discount.setValidators(TransportValidator.lessThanEqualValidator(Number(amount.value)));
				if (items.length == 1) {
					if (!Number(unit_cost.value) && !item.value && !Number(discount.value) && !Number(quantity.value) && !Number(amount.value) && !units.value) {
						item.clearValidators();
						amount.clearValidators();
						discount.clearValidators();
						quantity.clearValidators();
						unit_cost.clearValidators();
						units.clearValidators();
					}
				}
				item.updateValueAndValidity({ emitEvent: true });
				amount.updateValueAndValidity({ emitEvent: true });
				discount.updateValueAndValidity({ emitEvent: true });
				quantity.updateValueAndValidity({ emitEvent: true });
				unit_cost.updateValueAndValidity({ emitEvent: true });
				units.updateValueAndValidity({ emitEvent: true });
			});
		});
	}


	

	
	setAllTaxAsNonTaxable() {
		this.initialValues.tax.fill(getNonTaxableOption());
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
		otherItems.controls.forEach((controls) => {
			controls.get('tax').setValue(this.defaultTax);
		});
	}

	getTaxDetails() {
		this.isTax = this._tax.getTax();
		this._taxService.getTaxDetails().subscribe(result => {
			this.taxOptions = result.result['tax'];
			this.companyRegistered = result.result['registration_status'];
			this.totals.taxes = this.taxOptions;
		})
	}

	getDigitalSignatureList() {
		this._commonService.getDigitalSignatureList().subscribe(data => {
			this.digitalSignature = data['result']['data']
		})
	}

	onCreditLimit(e) {
		if (e) {
			this.initialDetailsOnPartySelected(this.addDebitNote.get('party').value);
		} else {
			this.addDebitNote.get('party').setValue(null);
			this.initialValues.party = getBlankOption();
			this.gstin = '';
		}
	}

	onCreditLimitOnSave(e) {
		if (e) {
			this.saveDebitNote();
		}
	}

	onCreditLimitOnSaveDraft(e) {
		if (e) {
			this.debitNoteAsDraft();
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
			if(item){
				this.getAdditionalCharges();
				itemExpenseControl.get('item').setValue(item?.name?.id);
				itemExpenseControl.get('units').setValue(item?.unit_of_measurement?.id);
				itemExpenseControl.get('tax').setValue(item?.tax?.id);
				itemExpenseControl.get('unit_cost').setValue(item?.rate);
				this.initialValues.item[index] = { label: item?.name?.name };
				this.initialValues.units[index] = { label: item?.unit_of_measurement?.label };
				this.initialValues.tax[index] = { label: item?.tax?.label };
				this.calculationsChanged();
			}
		
			dialogRefSub.unsubscribe();
		});
	}

	getAdditionalCharges() {
		let params = {
			vehicle_category: -1
		}
		this._rateCardService.getCustomerAdditionalCharge(this.addDebitNote.get('party').value, params).subscribe((res) => {
			this.staticOptions.materialList = res['result'];
		})
	}


}
