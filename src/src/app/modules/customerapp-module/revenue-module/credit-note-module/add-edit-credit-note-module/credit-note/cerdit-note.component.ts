import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, Validators, UntypedFormControl } from '@angular/forms';
import { DebitService } from '../../../../api-services/revenue-module-service/debit-note-service/debit.service';
import { CommonService } from 'src/app/core/services/common.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CreditService } from '../../../../api-services/revenue-module-service/credit-note-service/credit-note.service';

import { Router, ActivatedRoute } from '@angular/router';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { PartyService } from '../../../../api-services/master-module-services/party-service/party.service';
import { isValidValue, getObjectFromList, getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { EmployeeService } from '../../../../api-services/master-module-services/employee-service/employee-service';
import { CreditNoteClass } from '../credit-note-class/credit-note.class';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
	selector: 'app-edit-cerdit-note',
	templateUrl: './cerdit-note.component.html',
	styleUrls: [
		'./cerdit-note.component.scss'
	],
	host: {
		"(window:click)": "clickOutToHide($event)"
	},
})
export class CreditNoteComponent extends CreditNoteClass implements OnInit {

	terminology: any;
	videoUrl = 'https://ts-pub-directory.s3.ap-south-1.amazonaws.com/Credit+Note.mp4';
	addCreditNote;
	partyId: string;
	debitDocument = [];
	apiError: string;
	saveButton: boolean = false;
	partyList: any;
	invoiceList: any;
	employeeList: any;
	debitNoteData: any;
	staticOptions: any = {};
	selectedParty: any;
	creditNoteId: any;
	reasonList: any = [];
	totals: any = {
		subtotal: 0.0,
		total: 0.0,
		item: [],
		units: [],
		roundOffAmount: 0.00,
		taxes: [],

	};
	selectedPaymentTerm: any;
	showAddPartyPopup: any = { name: '', status: false };
	partyNamePopup: string = '';
	initialValues = {
		party: {},
		employee: {},
		invoice: {},
		digitalSignature: {},
		reason: {},
		item: [],
		units: [],
		termsAndCondition: {},
		tax: [],
	}
	party_id;
	nonTaxableLabel = new ValidationConstants().nonTaxableLabel;
	showAddItemPopup: any = { name: '', status: false };
	selectedInvoiceId: string;
	companyRegistered: boolean = true;
	globalFormErrorList: any = [];
	possibleErrors = new ErrorList().possibleErrors;
	otherExpenseValidatorSub: Subscription;
	tersmAndConditions = [];
	currency_type;
	patchFileUrls = new BehaviorSubject([]);
	isDueDateRequired = false;
	taxOptions = [];
	defaultTax =new ValidationConstants().defaultTax;
	isTax = false;
	preFixUrl = '';
	gstin = '';
	digitalSignature = [];
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
	goThroughDetais = {
		show: false,
		url: "https://demo.arcade.software/wWZOqOd9TcPnZDEOarlz?embed%22"
	}

	constructor(
		private _terminologiesService: TerminologiesService,
		private _router: Router,
		private _fb: UntypedFormBuilder,
		private _debitService: DebitService,
		private _commonService: CommonService,
		private _creditService: CreditService,
		private _employeeService: EmployeeService,
		private _revenueService: RevenueService,
		private _partyService: PartyService,
		private _activateRoute: ActivatedRoute,
		private currency: CurrencyService,
		private _taxService: TaxModuleServiceService,
		private _tax: TaxService,
		private _preFixUrl: PrefixUrlService,
		private _analytics: AnalyticsService,
		private _scrollToTop: ScrollToTop,
		public dialog: Dialog,
		private _rateCardService: RateCardService,
		private apiHandler: ApiHandlerService,
		private _commonLoaderService : CommonLoaderService
	) {
		super();
		this.getTaxDetails();
	}

	ngOnDestroy() {
		this.otherExpenseValidatorSub.unsubscribe();
    	this._commonLoaderService.getShow();
	}

	ngOnInit() {
		this.terminology = this._terminologiesService.terminologie;
		this.preFixUrl = this._preFixUrl.getprefixUrl();
		setTimeout(() => {
			this.currency_type = this.currency.getCurrency();
		    this._commonLoaderService.getHide();
		}, 1000);
		this._activateRoute.params.subscribe((pramas) => {
			this.creditNoteId = pramas.credit_id;
			this.buildForm();
			let ClientPramas = '0'; // Client
			this._debitService.getPartyList(ClientPramas).subscribe((data: any) => {
				this.partyList = data.result;
			});
			this._employeeService.getEmployeeList().subscribe((employeeList) => {
				this.employeeList = employeeList;
			});
			this._debitService.getCreditSuggestedIds().subscribe((response: any) => {
				this.addCreditNote.controls['credit_note_number'].setValue(response.result['creditnote']);
			});
			this.addCreditNote.get('credit_note_date').setValue(new Date(dateWithTimeZone()));

			this._commonService
				.getStaticOptions('payment-term,tax,item-unit,gst-treatment,creditnotereason')
				.subscribe((response) => {
					this.reasonList = response.result['creditnotereason'];
					this.staticOptions.itemUnits = response.result['item-unit'];
				});
		});
		this.getTersmAndConditionList();
		this.getDigitalSignatureList();
	}

	
	clickOutToHide(e) {
		if (!e.target.className.includes("btn btn--primary")) {
			this.saveButton = false;
		}
	}

	openGothrough() {
		this.goThroughDetais.show = true;
	}


	getTersmAndConditionList() {
		this._revenueService.getTersmAndConditionList('credit_note').subscribe((response: any) => {
			this.tersmAndConditions = response.result['tc_content'];
		});
	}

	patchFormValues(data: any) {
		if (isValidValue(data)) {

			if (isValidValue(data.invoice)) {
				this.addCreditNote.controls['invoice_date'].setValue(data.invoice.invoice_date);
			}

			data.party = isValidValue(data.party) ? data.party.id : '';
			data.employee = isValidValue(data.employee) ? data.employee.id : '';
			data.reason = isValidValue(data.reason) ? data.reason.id : null;
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

			this.addCreditNote.patchValue(data);

		}
		setTimeout(() => {
			this.calculationsChanged();
		}, 1000);
	}

	getFormValues() {
		this._creditService.getcreditNoteDetails(this.creditNoteId).subscribe((data: any) => {
			this.debitNoteData = data.result;
			let partyId = this.debitNoteData.party ? this.debitNoteData.party.id : null;
			this.partyId = partyId;
			if (partyId) {
				this._partyService.getPartyInvoices(partyId, '1,2').subscribe((response) => {
					this.invoiceList = response.result;
				});
			}
			this.partyNamePatch(this.debitNoteData);
			this.employeePatch(this.debitNoteData);
			this.itemOtherPatch(this.debitNoteData);
			this.invoicePatch(this.debitNoteData);
			this.reasonPatch(this.debitNoteData);
			this.patchTermsAndConditions(this.debitNoteData);
			this.patchSignature(this.debitNoteData.signature)
			this.patchFormValues(this.debitNoteData);
			this.patchDocuments(this.debitNoteData);
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
			let documentsArray = this.addCreditNote.get('documents') as UntypedFormControl;
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
		let documents = this.addCreditNote.get('documents').value;
		filesUploaded.forEach((element) => {
			documents.push(element.id);
		});
	}

	fileDeleted(deletedFileIndex) {
		let documents = this.addCreditNote.get('documents').value;
		documents.splice(deletedFileIndex, 1);
	}

	ngAfterViewInit() {
		if (this.creditNoteId) {
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.CREDITNOTE, this.screenType.EDIT, "Navigated");
			setTimeout(() => {
				this.getFormValues();
			}, 1);
		} else {
			this._revenueService.getTersmAndConditionList('credit_note').subscribe((data) => {				
				this.addCreditNote.controls['narrations'].setValue(data['result']['tc_setting']['narration']);
				if (data['result']['tc_content'].length) {
					let defaultTAC = data['result']['tc_content'].find(ts => ts.is_default == true)
					if (isValidValue(defaultTAC)) {
						this.initialValues.termsAndCondition = { label: defaultTAC.name, value: defaultTAC.id }
						this.addCreditNote.get('terms_and_condition').setValue(defaultTAC.id)
					}
				}
			});
			this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.CREDITNOTE, this.screenType.ADD, "Navigated");
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
			this.addCreditNote.get('party').setValue($event.id);
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
		this._debitService.getPartyList(ClientPramas).subscribe((data: any) => {
			this.partyList = data.result;
		});
	}

	statusCheck() {
		if (this.debitNoteData.status.label === 'Finalise') return false;
		return true;
	}

	onPartySelected(ele) {
		this.apiError = '';
		if (ele === '') {
			this.selectedParty = null;
			this.selectedInvoiceId = '';
			this.partyId = null;
			return;
		}
		this.party_id = ele;
		this.addCreditNote.get('employee').patchValue('');
		this.initialValues.employee=getBlankOption();
		this._partyService.getPartyAdressDetails(ele).subscribe((response) => {
			this.selectedParty = response.result;
			this.gstin = response.result.tax_details.gstin;
			this.partyId = this.party_id;
			if(this.selectedParty.sales_person_name?.id){
				this.addCreditNote.get('employee').patchValue(this.selectedParty.sales_person_name?.id);
				this.initialValues.employee={label:this.selectedParty.sales_person_name?.name ,value:this.selectedParty.sales_person_name?.id}
			}
			this.addCreditNote.controls['address'].patchValue(this.selectedParty.address);
			this.addCreditNote.controls['invoice'].setValue('');
			if (this.partyId) {
				this._partyService.getPartyInvoices(this.partyId, '1,2', '1').subscribe((response) => {
					this.invoiceList = response.result;
				});
			}

		});
		this.getAdditionalCharges();
		this.addCreditNote.controls['invoice_date'].setValue(null);
		this.initialValues.invoice = {};
		this.calculationsChanged();
	}

	populate_invoice_date(evn) {
		const invoice = getObjectFromList(evn, this.invoiceList);
		this.selectedInvoiceId = invoice.id ? invoice.id : null;
		this.addCreditNote.controls['invoice_date'].setValue(invoice ? invoice.invoice_date : null);
	}

	

	getItemById(id: String, list: []): any {
		return list.filter((item: any) => item.id === id)[0];
	}


	resetOtherExceptItem(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({
			units: null, unit_cost: 0.000, discount: 0.000, total: 0.000,
			quantity: 0.000, amount: 0.000,tax:this.defaultTax

		});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.tax[index]= getNonTaxableOption();
	}

	resetOther(formGroup: UntypedFormGroup, index) {
		formGroup.patchValue({
			units: null, unit_cost: 0.000, discount: 0.000, total: 0.000,
			quantity: 0.000, amount: 0.000, item: null,tax:this.defaultTax
		});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.item[index] = getBlankOption();
		this.initialValues.tax[index]=getNonTaxableOption();
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
		this.addCreditNote = this._fb.group({
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
			credit_note_date: [
				null,
				Validators.required
			],
			credit_note_number: [
				'',
				Validators.required
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
					country: [''],
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
					country: [''],
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
		if (!this.creditNoteId) {
			this.buildOtherItems([{}]);
		}
		this.setOtherValidators();
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
				item.amount || 0
			],
			tax: [item.tax || this.defaultTax],
			discount: [
				item.discount || 0
			],
			total: [
				item.total || 0,
				Validators.required
			]
		});
		return otherForm;
	}

	buildOtherItems(items: any = []) {
		const otherItems = this.addCreditNote.controls['others'] as UntypedFormArray;
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
		this.initialValues.tax.push(getNonTaxableOption());
		items.forEach((item) => {
			otherItems.push(this.addOthers(item));
		});
	}


	addMoreOtherItem() {
		const otherItems = this.addCreditNote.controls['others'] as UntypedFormArray;
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
		otherItems.push(this.addOthers({}));
		this.initialValues.tax.push(getNonTaxableOption());
	}

	removeOtherItem(index) {
		const otherItems = this.addCreditNote.controls['others'] as UntypedFormArray;
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
		const otherItems = this.addCreditNote.controls['others'] as UntypedFormArray;
		otherItems.reset();
		otherItems.controls = [];
		this.emptyOtherItems();
		this.addMoreOtherItem();
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

	patchValues() {
		const otherItems = this.addCreditNote.controls['others'] as UntypedFormArray;
		(this.addCreditNote.controls['address'] as UntypedFormArray).controls[0].get('address_type').setValue(0);
		(this.addCreditNote.controls['address'] as UntypedFormArray).controls[1].get('address_type').setValue(1);
		this.addCreditNote.patchValue({
			credit_note_date: changeDateToServerFormat(this.addCreditNote.controls['credit_note_date'].value),
			// due_date: changeDateToServerFormat(this.addCreditNote.controls['due_date'].value),
			invoice_date: changeDateToServerFormat(this.addCreditNote.controls['invoice_date'].value)
		});
		
		otherItems.controls.forEach((data) => {
			data.get('discount').value ? data.get('discount').value : data.get('discount').setValue(0);
			data.get('units').value ? data.get('units').value : data.get('units').setValue(null);
		});
	}

	toggleItemOtherFilled(enable: Boolean = false) {
		const otherItems = this.addCreditNote.controls['others'] as UntypedFormArray;
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
		const form = this.addCreditNote as UntypedFormGroup;
		this.patchValues();
		this.apiError = '';
		if (this.totals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}
		if (form.valid ) {
			if (this.creditNoteId) {
				this.apiHandler.handleRequest(this._creditService.editCreditNote(form.value, this.creditNoteId), 'Credit Note updated successfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.CREDITNOTE)
							this._router.navigate([this.preFixUrl +
								'/income/credit-note/list'
							], { queryParams: { pdfViewId: this.creditNoteId } });
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
										this._scrollToTop.scrollToTop();
										window.scrollTo(0, 0);
									}
							}
						}
					}
				);
			}
			else {
				this.apiError = '';
				this.apiHandler.handleRequest(this._creditService.postCreditNote(form.value), 'Credit Note added successfully!').subscribe(
					{
						next: () => {
							this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.CREDITNOTE)
							this._router.navigate([
								this.preFixUrl + '/income/credit-note/list'
							]);
						},
						error: (err) => {
							if (err.error.status == 'error') {
								this.apiError = err.error.message;
								this._scrollToTop.scrollToTop();
								window.scrollTo(0, 0);
							}
						}
					}
				);
			}
		} else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
		}
		this.toggleItemOtherFilled(true);
	}

	saveAsDraft() {
		this.toggleItemOtherFilled();
		this.patchValues();
		const form = this.addCreditNote as UntypedFormGroup;
		if (this.totals.total <= 0) {
			this.apiError = 'Please check detail, Total amount should be greater than zero'
			form.setErrors({ 'invalid': true });
			this._scrollToTop.scrollToTop();
			window.scrollTo(0, 0);
		}

		if (form.valid) {
			if (this.creditNoteId) {
				this.apiHandler.handleRequest(this._creditService.putCreditNoteAsDraft(this.addCreditNote.value, this.creditNoteId),'Credit Note draft updated successfully!').subscribe((response) => {
					this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.CREDITNOTE)
					this._router.navigate([this.preFixUrl +
						'/income/credit-note/list'
					]);
				}, (err) => {
					this.apiError = '';
					if (err.error.hasOwnProperty("message")) {
						this.apiError = err.error.message;
						this._scrollToTop.scrollToTop();
						window.scrollTo(0, 0);
					}
				});
			}
			else {
				this.apiHandler.handleRequest(this._creditService.postCreditNoteDraft(this.addCreditNote.value),'Credit Note draft added successfully!').subscribe((response) => {
					this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.CREDITNOTE)
					this._router.navigate([this.preFixUrl +
						'/income/credit-note/list'
					]);
				}, (err) => {
					this.apiError = '';
					if (err.error.status == 'error') {
						this.apiError = err.error.message;
						this._scrollToTop.scrollToTop();
						window.scrollTo(0, 0);
					}
				});
			}
		}
		else {
			this.setAsTouched(form);
			this._scrollToTop.scrollToTop();
			this.setFormGlobalErrors();
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


	employeePatch(editCredit) {
		if (editCredit.employee) {
			this.initialValues.employee['value'] = editCredit.employee.id;
			this.initialValues.employee['label'] = editCredit.employee.display_name;
		} else {
			this.initialValues.employee = getBlankOption();
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

	reasonPatch(editCredit) {
		if (editCredit.reason) {
			this.initialValues.reason['value'] = editCredit.reason.id;
			this.initialValues.reason['label'] = editCredit.reason.label;
		} else {
			this.initialValues.reason = getBlankOption();
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

	itemOtherPatch(creditNote) {
		this.initialValues.tax = [];
		this.initialValues.item = [];
		this.initialValues.units = [];
		creditNote.other_items.forEach((ele, index) => {
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


	closeItemPopup() {
		this.showAddItemPopup = { name: '', status: false };
	}





	// set validators for other expense in any value is added
	setOtherValidators() {
		const item_other = this.addCreditNote.controls['others'] as UntypedFormArray;
		this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
			items.forEach((key, index) => {
				const item = item_other.at(index).get('item');
				const unit_cost = item_other.at(index).get('unit_cost');
				const quantity = item_other.at(index).get('quantity');
				const amount = item_other.at(index).get('amount');
				const discount = item_other.at(index).get('discount');
				const units = item_other.at(index).get('units');

				item.setValidators(Validators.required);
				units.setValidators(Validators.required);
				amount.setValidators(Validators.min(0.01));
				unit_cost.setValidators(Validators.min(0.01));
				quantity.setValidators(Validators.min(0.01));
				discount.setValidators(TransportValidator.lessThanEqualValidator(Number(amount.value)));
				if (items.length == 1) {
					if (!Number(unit_cost.value) && !item.value && !Number(discount.value) && !Number(quantity.value) && !Number(amount.value) && !units.value) {
						item.clearValidators();
						amount.clearValidators();
						discount.clearValidators();
						unit_cost.clearValidators();
						quantity.clearValidators();
						units.clearValidators();
					}
				}
				item.updateValueAndValidity({ emitEvent: true });
				amount.updateValueAndValidity({ emitEvent: true });
				discount.updateValueAndValidity({ emitEvent: true });
				unit_cost.updateValueAndValidity({ emitEvent: true });
				quantity.updateValueAndValidity({ emitEvent: true });
				units.updateValueAndValidity({ emitEvent: true });
			});
		});
	}


	
	
	setAllTaxAsNonTaxable() {
		this.initialValues.tax.fill(getNonTaxableOption());
		const otherItems = this.addCreditNote.controls['others'] as UntypedFormArray;
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
		this._rateCardService.getCustomerAdditionalCharge(this.addCreditNote.get('party').value, params).subscribe((res) => {
			this.staticOptions.materialList = res['result'];
		})
	}
}
