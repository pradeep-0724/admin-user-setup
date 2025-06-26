import { ValidationConstants } from 'src/app/core/constants/constant';
import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, AbstractControl, Validators, UntypedFormControl, FormArray } from '@angular/forms';

import { CommonService } from 'src/app/core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { isValidValue, getBlankOption, getObjectFromList } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { defaultZero } from 'src/app/shared-module/utilities/currency-utils';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { InvoicePaymentClass } from '../invoice-settlement-class/invoice-settlement.class';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { PaymentsService } from '../../../../api-services/revenue-module-service/payment-services/payments-service.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { JournalService } from 'src/app/modules/customerapp-module/reports-module/accountant-module/journal-entry-module/services/journal.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TabIndexService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/tab-index.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';



@Component({
  selector: 'app-edit-invoice-settelment',
  templateUrl: './invoice-settelment.component.html',
  styleUrls: ['./invoice-settelment.component.scss'],
  host: {
    "(window:click)": "clickOutToHide($event)"
  }
})
export class InvoicePaymentComponent extends InvoicePaymentClass implements OnInit, OnDestroy, AfterViewChecked {
  editInvoicePaymentForm;
  partyList: any = [];
  selectedParty: any;
  paymentMethodList: any = [];
  bankingChargeRequired: Boolean = false;
  creditNoteList: any = [];
  invoiceList: any = [];
  advanceList: any = [];
  final_recieved: 0.0;
  amountAfterTax: number = 0;
  netAmountAfterTax: number = 0;
  balanceError: boolean = false;
  amountRecievedError: boolean = false;
  invoiceId: string;
  apiError: string;
  saveButton: Boolean = false;
  debitNoteList: any = [];
  accountsList: any;
  removeSelectedDebitNotes: any = [];
  removeSelectedCreditNotes: any = [];
  removeSelectedAdvances: any = [];
  removeSelectedInvoice: any = [];
  allInvoiceSelected: Boolean = false;
  totals: any = {
    credit_avail: 0.0,
    withheld: 0.0,
    outStandingAmonut: 0.0,
    total_discount_amount: 0.0,
    debit_amount_received: 0.0,
    invoice_amount_received: 0.0,
    bos_amount_received: 0.0,
    total_amount_received: 0.0,
    debit_amount_withheld: 0.0,
    invoice_amount_withheld: 0.0,
    total_amount_withheld: 0.0,
    total_party_received: 0.0,
    total_banking_charges: 0.0,
    total: 0.0,
  };
  total: number;
  amountPayable: number;
  deductAmountDisabled: boolean = false;
  paymentData: any = [];
  initialValues = {
    party: getBlankOption(),
    accountNo: getBlankOption(),
    paymentChoice: getBlankOption(),
    paymentChequeStatus: getBlankOption(),
    digitalSignature: {},
    termsAndCondition: getBlankOption()
  };
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  searchCredit: string;
  searchAdvance: string;
  searchDebit: string;
  searchInvoice: string;
  searchBos = '';
  partyId: any;
  deductAmount: any;
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;
  paymentModeSelected: boolean = false;
  currency_type;
  documentPatchData: any = [];
  patchFileUrls = new BehaviorSubject([]);
  isChequeRequired = false;
  paymentModeList = [];
  chequeStatusList = [];
  paymentConstants = new ValidationConstants();
  chequeId = this.paymentConstants.paymentChequeIds.chequeId
  accountNoBank = [];
  accountNoCash = [];
  bosList = [];
  termsAndConditions = [];
  cashId = this.paymentConstants.paymentChequeIds.cashId
  chequeClearedId = this.paymentConstants.paymentChequeIds.chequeClearedId
  chequeCancelId = this.paymentConstants.paymentChequeIds.chequeCancelId
  isChequeCleared = false;
  isPaymentDisabled = false;
  ischequeStatusDisabled = false;
  isClearedCheque = false;
  isAlreadyCancelled = false;
  isAlreadyCleared = false;
  doAutoFill: boolean;
  data: any;
  isTax: boolean = false;
  editData = new BehaviorSubject<any>({
    deduction_amount: 0
  });
  prefixUrl = '';
  gstin = '';
  isTdsDecleration = false;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  isTds = false;
  terminology: any;
  digitalSignature = [];
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/Q0fYCSUiptrvqiAR9dTl?embed%22"
  }
  breakUpAmountErr = false;
  deductAndWitheldErr = false;
  total_Utilised_Credit_Summation = {
    remaining_balance: 0,
    availing: 0,
  };
  total_Customer_Advance_Summation = {
    remaining_balance: 0,
    availing: 0,
  };
  total_Outstanding_Debit_Summation = {
    amount_received: 0,
    adjustment: 0,
  }
  total_Outstanding_Invoices_Summation = {
    amount_received: 0,
    adjustment: 0,
  };
  total_Outstanding_Bos_Summation = {
    amount_received: 0,
    adjustment: 0,
  }
  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _partyService: PartyService,
    private _paymentsService: PaymentsService,
    private _commonService: CommonService,
    private _journalService: JournalService,
    private _activateRoute: ActivatedRoute,
    private _route: Router,
    private currency: CurrencyService,
    private _tax: TaxService,
    private _analytics: AnalyticsService,
    private _terminologiesService: TerminologiesService,
    private _prefixUrl: PrefixUrlService,
    private _tabIndex: TabIndexService,
    private _scrollToTop: ScrollToTop,
    private _revenueservice: RevenueService,
    private apiHandler: ApiHandlerService,

  ) {
    super();
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
  }

  ngAfterViewChecked() {

    this._tabIndex.negativeTabIndex();

  }

  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.terminology = this._terminologiesService.terminologie;
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.buildForm();
    this.getTermsAndConditions();

    this._activateRoute.params.subscribe((params: any) => {
      this.invoiceId = params.invoice_id;
      let ClientPramas = '0';
      this._partyService.getPartyList('', ClientPramas).subscribe((response) => {
        this.partyList = response.result;
      });
      this._journalService.getAccountList().subscribe((response: any) => {
        let allAccountList = response.result;
        this.accountNoBank = allAccountList.filter(item => item.account_type == "Bank");
        this.accountNoCash = allAccountList.filter(item => item.account_type == "Cash in Hand");
        this.accountsList = this.accountNoBank;
      });
      this._commonService
        .getStaticOptions(
          'cheque-status,payment-mode'
        )
        .subscribe((response) => {
          this.paymentModeList = response.result['payment-mode'];
          let chequeList = []
          chequeList = response.result['cheque-status'];
          this.chequeStatusList = chequeList.filter(item => item.id !== this.paymentConstants.paymentChequeIds.chequeCancelId)
        });
      this.editInvoicePaymentForm.controls['date_of_payment'].setValue(new Date(dateWithTimeZone()));
      this.getPaymentNumber();
      this.getDigitalSignatureList();
      if (this.invoiceId) {
        setTimeout(() => {
          this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PAYMENTSETTLEMENT, this.screenType.EDIT, "Navigated");
          this.getFormValues();
        }, 1);
      } else {
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PAYMENTSETTLEMENT, this.screenType.ADD, "Navigated");
      }
    });
  }

  getPaymentNumber() {
    this._paymentsService.getSuggestedIds('payment_received').subscribe((response) => {
      this.editInvoicePaymentForm.controls['payment_number'].setValue(response.result['payment_received']);
    });
  }

  getTermsAndConditions() {
    this._revenueservice.getTersmAndConditionList('payment_received').subscribe((response) => {
      this.termsAndConditions = response.result['tc_content'];
    });
  }

  patchFormValues(data: any) {
    data.party = isValidValue(data.party) ? data.party.id : '';
    data.account = isValidValue(data.account) ? data.account.id : null;
    data.signature = isValidValue(data.signature) ? data.signature.id : null;
    data.terms_and_condition = isValidValue(data.terms_and_condition) ? data.terms_and_condition.id : null;
    this.editInvoicePaymentForm.patchValue(data);
    this.setBankingCharges()
    // this._commoservice.populateStaticOptionsWithValues(this.selectItems, data);
  }

  ngOnDestroy() {

    let body = document.getElementsByTagName('body')[0];
    body.classList.remove('removeLoader');

  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }
  clickOutToHide(e) {
    if (!e.target.className.includes('btn mx-0 px-2 max-width-220 btn--primary btn--default btn-mg-left btn--dropdown')) {
      this.saveButton = false;
    }

  }
  getFormValues() {
    this._paymentsService.getInvoiceDetail(this.invoiceId).subscribe((data: any) => {
      if (data !== undefined) {
        this.selectedParty = data.result.party.id;
        this.partyId = this.selectedParty;
        this.paymentData = data.result;
        this.patchSignature(this.paymentData.signature)
        this.onPartySelected();
        this.onEditGetPartyDetail(this.partyId);
        this.partyNamePatch(data.result);
        this.pamentModePatch(data.result);
        this.patchTermsAndConditions(data.result)
        this.patchFormValues(data.result);
        this.patchDocuments(data.result)
        this.setPartyAmountRecevied();
        this.patchPaymentMode(data.result);
        this.onPaymentModeSelected();
        this.setBankingCharges()
        if (this.isTax) {
          this.editData.next(this.paymentData)
        }
      }
    });
  }

  patchDocuments(data) {
    if (data.documents.length > 0) {
      let documentsArray = this.editInvoicePaymentForm.get('documents') as UntypedFormControl;
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
  patchSignature(signature) {
    if (signature) {
      this.initialValues.digitalSignature['value'] = signature.id
      this.initialValues.digitalSignature['label'] = signature.name
    } else {
      this.initialValues.digitalSignature['label'] = ''
    }
  }

  fileUploader(filesUploaded) {
    let documents = this.editInvoicePaymentForm.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
    });
  }

  fileDeleted(deletedFileIndex) {
    let documents = this.editInvoicePaymentForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }




  buildForm() {
    this.editInvoicePaymentForm = this._fb.group({
      party: ['', Validators.required],
      date_of_payment: [null, Validators.required],
      account: [null],
      bank_charge: [0, Validators.required],
      reference_number: [''],
      signature: [''],
      payment_number: ['', Validators.required],
      amount_received: [0],
      optional_comments: [''],
      terms_and_condition: [null],
      total_amount_outstanding: [''],
      total_credit_availed: [0],
      documents: [[]],
      utilise_credit: this._fb.array([]),
      outstanding_invoice: this._fb.array([]),
      outstanding_bos: this._fb.array([]),
      outstanding_debit: this._fb.array([]),
      advance_received: this._fb.array([]),
      all_debit_selected: [false],
      all_invoice_selected: [false],
      all_credit_note_selected: [false],
      all_bos_selected: [false],
      all_advance_selected: [false],
      credit_availed: [0],
      advance_availed: [0],
      withheld_amount: [0],
      payment_choice: [null, Validators.required],
      cheque_status: [null],
      cheque_date: [null],
      clearance_date: [null],
      cheque_no: ['', Validators.pattern('[a-zA-Z0-9]*')],
      is_tax_deducted: [false],
      deduction_amount: [0.00],
    });
    // utilised totals
    const utilise_creditArray = this.editInvoicePaymentForm.get('utilise_credit') as FormArray;
    utilise_creditArray.valueChanges.subscribe((values) => {
      this.total_Utilised_Credit_Summation.availing = 0;
      this.total_Utilised_Credit_Summation.remaining_balance = 0
      // this.total_Utilised_Credit_Summation.original_amount=0
      values.forEach((item) => {
        this.total_Utilised_Credit_Summation.availing += Number(item.availing_amount);
        this.total_Utilised_Credit_Summation.remaining_balance += Number(item.opening_balance);
      })
    })
    // customer advace
    const customer_Advance_Array = this.editInvoicePaymentForm.get('advance_received') as FormArray;
    customer_Advance_Array.valueChanges.subscribe((values) => {
      this.total_Customer_Advance_Summation.availing = 0;
      this.total_Customer_Advance_Summation.remaining_balance = 0
      values.forEach((item) => {
        this.total_Customer_Advance_Summation.availing += Number(item.availing_amount);
        this.total_Customer_Advance_Summation.remaining_balance += Number(item.opening_balance);
      })
    })
    // outstanding debit
    const outstanding_debit_Array = this.editInvoicePaymentForm.get('outstanding_debit') as FormArray;
    outstanding_debit_Array.valueChanges.subscribe((values) => {
      this.total_Outstanding_Debit_Summation.amount_received = 0;
      this.total_Outstanding_Debit_Summation.adjustment = 0
      values.forEach((item) => {
        this.total_Outstanding_Debit_Summation.amount_received += Number(item.amount_received);
        this.total_Outstanding_Debit_Summation.adjustment += Number(item.adjustment);
      })
    })
    // outstanding invoics
    const outstanding_invoice = this.editInvoicePaymentForm.get('outstanding_invoice') as FormArray;
    outstanding_invoice.valueChanges.subscribe((values) => {
      this.total_Outstanding_Invoices_Summation.amount_received = 0;
      this.total_Outstanding_Invoices_Summation.adjustment = 0
      values.forEach((item) => {
        this.total_Outstanding_Invoices_Summation.amount_received += Number(item.amount_received);
        this.total_Outstanding_Invoices_Summation.adjustment += Number(item.adjustment);
      })
    })
    //  bos
    const outstanding_bos = this.editInvoicePaymentForm.get('outstanding_bos') as FormArray;
    outstanding_bos.valueChanges.subscribe((values) => {
      this.total_Outstanding_Bos_Summation.amount_received = 0;
      this.total_Outstanding_Bos_Summation.adjustment = 0
      values.forEach((item) => {
        this.total_Outstanding_Bos_Summation.amount_received += Number(item.amount_received);
        this.total_Outstanding_Bos_Summation.adjustment += Number(item.adjustment);
      })
    })

  }

  buildDebitNotes(items: any[]) {
    this.debitNoteList = [];
    const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
    debitNotes.controls = [];
    items.forEach((item) => {
      const debitNoteForm = this.addDebitNote(item);
      debitNotes.push(debitNoteForm);
      this.debitNoteList.push(item);
    });
  }

  addDebitNote(item: any) {
    const debitForm = this._fb.group({
      id: [item.id || null],
      selected: [item.selected || false],
      debit_note: [item.debit_note || ''],
      adjustment: [item.adjustment || 0],
      withheld: [item.withheld || 0],
      balance: [item.balance || 0],
      total_balance: [0],
      amount_received: [item.amount_received || 0],
    });
    let previousValue: any;
    debitForm.get('total_balance').valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((currentValue: any) => {
      if (JSON.stringify(previousValue) !== JSON.stringify(currentValue)) {
        this.calculateOutstandingBalance();
      }
    });
    if (isValidValue(item.selected)) {
      debitForm.get('selected').setValue(true);
      debitForm.get('id').setValue(item.id);
      debitForm.get('debit_note').setValue(item.debit_note);
      debitForm.get('adjustment').setValue(item.adjustment);
      debitForm.get('withheld').setValue(item.withheld);
      debitForm.get('amount_received').setValue(item.amount_received);
    }
    return debitForm;
  }

  buildCreditNotes(items: any[]) {
    this.creditNoteList = [];
    const creditNotes = this.editInvoicePaymentForm.controls['utilise_credit'] as UntypedFormArray;
    creditNotes.controls = [];
    items.forEach((item, i) => {
      const creditNoteForm = this.addCreditNote(item);
      creditNotes.push(creditNoteForm);
      this.creditNoteList.push(item);
      creditNotes.controls[i].get('opening_balance').setValue(item.balance);
    });
  }

  addCreditNote(item: any) {
    const creditForm = this._fb.group({
      id: [item.id || null],
      selected: [item.selected || false],
      total_balance: [0],
      opening_balance: [0],
      credit_note: [item.credit_note || ''],
      availing_amount: [item.availing_amount || 0]
    });
    let tempValue: any
    creditForm.valueChanges.subscribe((updatedValue: any) => {
      if (JSON.stringify(tempValue) != JSON.stringify(updatedValue)) {
        tempValue = updatedValue;
        const netBalance = defaultZero(updatedValue.opening_balance) - defaultZero(updatedValue.availing_amount);
        creditForm.get('total_balance').setValue(netBalance);
      }
    });
    if (isValidValue(item.selected)) {
      creditForm.get('selected').setValue(true);
      creditForm.get('id').setValue(item.id);
      creditForm.get('credit_note').setValue(item.credit_number);
      creditForm.get('availing_amount').setValue(item.availing_amount);
    }
    return creditForm;
  }


  buildInvoices(items: any[]) {
    this.invoiceList = [];
    const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
    invoices.controls = [];
    items.forEach((item) => {
      invoices.push(this.addInvoice(item));
      this.invoiceList.push(item);
    });
  }

  buildBos(items: any[]) {
    this.bosList = [];
    const invoices = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
    invoices.controls = [];
    items.forEach((item) => {
      invoices.push(this.addBos(item));
      this.bosList.push(item);
    });
  }

  addInvoice(item: any) {
    const invoiceForm = this._fb.group({
      id: [item.id || null],
      selected: [item.selected || false],
      invoice: [item.invoice || ''],
      adjustment: [item.adjustment || 0],
      withheld: [item.withheld || 0],
      balance: [item.balance || 0],
      total_balance: [0],
      amount_received: [item.amount_received || 0],
    });
    return invoiceForm;
  }

  addBos(item: any) {
    const bosForm = this._fb.group({
      id: [item.id || null],
      selected: [item.selected || false],
      bos: [item.bos || ''],
      adjustment: [item.adjustment || 0],
      withheld: [item.withheld || 0],
      balance: [item.balance || 0],
      total_balance: [0],
      amount_received: [item.amount_received || 0],
    });
    return bosForm;
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
      this.editInvoicePaymentForm.get('party').setValue($event.id);

    }
  }

  /* For fecthing all the party details */
  getPartyDetails() {
    let ClientPramas = '0'; // Client
    this._partyService.getPartyList('', ClientPramas).subscribe((response) => {
      this.partyList = response.result;
    });

  }

  /* After closing the party modal to clear all the values */
  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }



  alreadySelectedDebitNote() {
    this.paymentData.outstanding_debit.forEach((selectedData, index) => {
      this.debitNoteList.forEach((data, i) => {
        if (selectedData.debit_note === data.id) {
          this.debitNoteList[i]['selected'] = true;
          this.debitNoteList[i]['debit_note'] = selectedData.debit_note;
          this.debitNoteList[i]['id'] = selectedData.id;
          this.debitNoteList[i]['adjustment'] = defaultZero(selectedData.adjustment);
          this.debitNoteList[i]['amount_received'] = defaultZero(selectedData.amount_received);
          this.debitNoteList[i]['withheld'] = defaultZero(selectedData.withheld);
          if (this.paymentData.status && this.paymentData.status.label == 'Draft') {
            this.debitNoteList[i]['balance'] = data.balance;
          } else {
            this.debitNoteList[i]['balance'] = Number(data.balance) + Number(this.debitNoteList[i]['adjustment'] +
              this.debitNoteList[i]['withheld'] + this.debitNoteList[i]['amount_received'])
          }
        }
      });
    });
  }

  alreadySelectedCreditNote() {
    this.paymentData.utilise_credit.forEach((selectedData, index) => {
      this.creditNoteList.forEach((data, i) => {
        if (selectedData.credit_note === data.id) {
          this.creditNoteList[i]['selected'] = true;
          this.creditNoteList[i]['credit_number'] = selectedData.credit_note;
          this.creditNoteList[i]['credit_note'] = selectedData.credit_note;
          this.creditNoteList[i]['id'] = selectedData.id;
          this.creditNoteList[i]['availing_amount'] = defaultZero(selectedData.availing_amount);
          if (this.paymentData.status && this.paymentData.status.label == 'Draft') {
            this.creditNoteList[i]['balance'] = Number(data.balance)
          } else {
            this.creditNoteList[i]['balance'] = Number(data.balance) + defaultZero(selectedData.availing_amount)
          }
        }
      });
    });
  }

  alreadySelectedAdvance() {
    this.paymentData.advance_received.forEach((selectedData, index) => {
      this.advanceList.forEach((data, i) => {
        if (selectedData.advance === data.id) {
          this.advanceList[i]['selected'] = true;
          this.advanceList[i]['advance'] = selectedData.advance;
          this.advanceList[i]['id'] = selectedData.id;
          this.advanceList[i]['availing_amount'] = defaultZero(selectedData.availing_amount);
          if (this.paymentData.status && this.paymentData.status.label == 'Draft') {
            this.advanceList[i]['balance'] = Number(data.balance)
          } else {
            this.advanceList[i]['balance'] = Number(data.balance) + defaultZero(selectedData.availing_amount)
          }
        }
      });
    });
  }



  alreadySelectedInvoice() {
    this.paymentData.outstanding_invoice.forEach((selectedData, index) => {
      this.invoiceList.forEach((data, i) => {
        if (selectedData.invoice === data.id) {
          this.invoiceList[i]['selected'] = true;
          this.invoiceList[i]['invoice'] = selectedData.invoice;
          this.invoiceList[i]['id'] = selectedData.id;
          this.invoiceList[i]['adjustment'] = defaultZero(selectedData.adjustment);
          this.invoiceList[i]['amount_received'] = defaultZero(selectedData.amount_received);
          this.invoiceList[i]['withheld'] = defaultZero(selectedData.withheld);
          if (this.paymentData.status && this.paymentData.status.label == 'Draft') {
            this.invoiceList[i]['balance'] = data.balance;
          } else {
            this.invoiceList[i]['balance'] = Number(data.balance) + Number(this.invoiceList[i]['adjustment'] +
              this.invoiceList[i]['withheld'] + this.invoiceList[i]['amount_received']);
          }
        }
      });
    });
  }


  alreadySelectedBos() {
    this.paymentData.outstanding_bos.forEach((selectedData, index) => {
      this.bosList.forEach((data, i) => {
        if (selectedData.bos === data.id) {
          this.bosList[i]['selected'] = true;
          this.bosList[i]['bos'] = selectedData.bos;
          this.bosList[i]['id'] = selectedData.id;
          this.bosList[i]['adjustment'] = defaultZero(selectedData.adjustment);
          this.bosList[i]['amount_received'] = defaultZero(selectedData.amount_received);
          this.bosList[i]['withheld'] = defaultZero(selectedData.withheld);
          if (this.paymentData.status && this.paymentData.status.label == 'Draft') {
            this.bosList[i]['balance'] = data.balance;
          } else {
            this.bosList[i]['balance'] = Number(data.balance) + Number(this.bosList[i]['adjustment'] +
              this.bosList[i]['withheld'] + this.bosList[i]['amount_received']);
          }
        }
      });
    });
  }

  buildAdvances(items: any[]) {
    this.advanceList = [];
    const customerAdvance = this.editInvoicePaymentForm.controls['advance_received'] as UntypedFormArray;
    customerAdvance.controls = [];
    items.forEach((item, i) => {
      const advanceForm = this.addAdvance(item);
      customerAdvance.push(advanceForm);
      this.advanceList.push(item);
      customerAdvance.controls[i].get('opening_balance').setValue(item.balance);
    });
  }

  addAdvance(item: any) {
    const advanceForm = this._fb.group({
      id: [item.id || null],
      selected: [item.selected || false],
      total_balance: [0],
      opening_balance: [0],
      advance: [item.advance || ''],
      availing_amount: [item.availing_amount || 0]
    });
    let tempValue: any
    advanceForm.valueChanges.subscribe((updatedValue: any) => {
      if (JSON.stringify(tempValue) != JSON.stringify(updatedValue)) {
        tempValue = updatedValue;
        const netBalance = defaultZero(updatedValue.opening_balance) - defaultZero(updatedValue.availing_amount);
        advanceForm.get('total_balance').setValue(netBalance);
      }
    });
    if (isValidValue(item.selected)) {
      advanceForm.get('selected').setValue(true);
      advanceForm.get('id').setValue(item.id);
      advanceForm.get('advance').setValue(item.advance);
      advanceForm.get('availing_amount').setValue(item.availing_amount);
    }
    return advanceForm;
  }

  onEditGetPartyDetail(partyId) {
    this._partyService.getPartyAdressDetails(partyId).subscribe((response) => {
      this.gstin = response.result.tax_details.gstin;
      this.isTdsDecleration = response.result.tax_details.tds_declaration;
    });
  }


  onPartySelected(ele?) {
    if (this.invoiceId) {
      if (ele && ele.target.value) {
        this.selectedParty = ele.target.value;
      }
      else if (this.partyId) {
        if (this.paymentData.status && this.paymentData.status && this.paymentData.status.label == 'Finalise') {

        }
      }
      if (ele && this.selectedParty == this.partyId) {
        this._route.routeReuseStrategy.shouldReuseRoute = () => false;
        this._route.onSameUrlNavigation = 'reload';
        this._route.navigate(['/revenue/payments/invoice/edit/' + this.invoiceId]);
      }
      else {
        this.resetFormData();
      }
      this._partyService.getSettlementPartyCreditNote(this.selectedParty, this.invoiceId).subscribe((response) => {
        this.creditNoteList = response.result;
        this.alreadySelectedCreditNote();
        this.buildCreditNotes(this.creditNoteList);
        this.calculateCreditAvail();
      });
      this._partyService.getSettlementPartyDebitNote(this.selectedParty, this.invoiceId).subscribe((response: any) => {
        this.debitNoteList = response.result;
        this.alreadySelectedDebitNote();
        this.buildDebitNotes(this.debitNoteList);
        this.calculateAmountReceived();
      });
      this._partyService.getSettlementPartyInvoices(this.selectedParty, this.invoiceId).subscribe((response) => {
        this.invoiceList = response.result;
        this.alreadySelectedInvoice();
        this.buildInvoices(this.invoiceList);
        this.calculateAmountReceived();
      });

      this._partyService.getSettlementPartyBos(this.selectedParty, this.invoiceId).subscribe((response) => {
        this.bosList = response.result;
        this.alreadySelectedBos();
        this.buildBos(this.bosList);
        this.calculateAmountReceived();
      });

      this._partyService.getSettlementPartyAdvance(this.selectedParty, this.invoiceId).subscribe((response) => {
        this.advanceList = response.result;
        this.alreadySelectedAdvance();
        this.buildAdvances(this.advanceList);
        this.calculateAdvanceAvail();
      });

    }
    else {
      this.doAutoFill = true;
      this.paymentModeSelected = false;

      let selectedParty = getObjectFromList(ele.target.value, this.partyList);
      this.selectedParty = selectedParty.id
      this.resetFormData();
      this._partyService.getPartyUnpaidCreditNotes(this.selectedParty).subscribe((response) => {
        this.creditNoteList = response.result;
        this.buildCreditNotes(this.creditNoteList);
      });
      this._partyService.getPartyUnpaidDebitNotes(this.selectedParty).subscribe((response: any) => {
        this.debitNoteList = response.result;
        this.buildDebitNotes(this.debitNoteList);
      });
      this._partyService.getPartyUnpaidInvoices(this.selectedParty).subscribe((response) => {
        this.invoiceList = response.result;
        this.buildInvoices(this.invoiceList);
      });

      this._partyService.getPartyUnpaidBos(this.selectedParty).subscribe((response) => {
        this.bosList = response.result;
        this.buildBos(this.bosList);
      });
      this.editInvoicePaymentForm.controls['date_of_payment'].setValue(new Date(dateWithTimeZone()));
      this.getPartyAdvance();
      this.populatePaymentMethod();

    }

    if (this.selectedParty) this.onEditGetPartyDetail(this.selectedParty);
    this.prefillBank();
  }

  getPartyAdvance() {
    this._partyService.getPartyAdvance(this.selectedParty, '1').subscribe((response) => {
      this.advanceList = response.result;
      this.buildAdvances(this.advanceList);
    });


  }

  populatePaymentMethod() {

    let vendorId = this.editInvoicePaymentForm.get('party').value;
    if (vendorId) {
      this.data = this.partyList.filter((ele) => ele.id === vendorId)[0];
    }
    this.onPaymentModeSelected();
  }

  onPaymentModeSelected() {
    let bank = this.editInvoicePaymentForm.controls['account'].value
    if (bank) {
      this.paymentModeSelected = true;
      // setUnsetValidators(this.editInvoicePaymentForm,'amount_received',[Validators.min(0.01)]);
    }
    this.bankingChargeRequired = bankChargeRequired(bank, this.editInvoicePaymentForm.get('bank_charge'), this.accountsList);
  }

  onSelectAllCreditNotes(ele) {
    const creditNotes = this.editInvoicePaymentForm.controls['utilise_credit'] as UntypedFormArray;
    creditNotes.controls.map((creditNote, index) => {
      creditNote.get('selected').setValue(ele.target.checked);
      ele.target.value = this.creditNoteList && this.creditNoteList.length > 0 ? this.creditNoteList[index].id : null;
      this.onCreditNotesSelected(ele, index);
      return true;
    });
  }

  onCreditNotesSelected(ele, index) {
    const creditNotes = this.editInvoicePaymentForm.controls['utilise_credit'] as UntypedFormArray;
    if (!ele.target.checked) {
      this.editInvoicePaymentForm.controls['all_credit_note_selected'].setValue(false);
    }
    if (creditNotes.controls[index].get('selected').value) {
      creditNotes.controls[index].get('availing_amount').setValue(this.creditNoteList[index].balance);
    } else {
      creditNotes.controls[index].get('availing_amount').setValue(0);
    }
    this.invoiceId ? this.onCheckboxChangeCredit(ele, this.creditNoteList, index) : this.onCheckboxChangeAddCredit(ele, this.creditNoteList, index);
    this.calculateCreditAvail();
    if (creditNotes.controls.every((creditNote) => creditNote.get('selected').value === true)) {
      this.editInvoicePaymentForm.controls['all_credit_note_selected'].setValue(true);
    }
  }



  onSelectAllAdvances(ele) {
    const customerAdvance = this.editInvoicePaymentForm.controls['advance_received'] as UntypedFormArray;
    customerAdvance.controls.map((advance, index) => {
      advance.get('selected').setValue(ele.target.checked);
      ele.target.value = this.advanceList && this.advanceList.length > 0 ? this.advanceList[index].id : null;
      this.onAdvanceSelected(ele, index);
      return true;
    });
  }

  onAdvanceSelected(ele, index) {
    const customerAdvance = this.editInvoicePaymentForm.controls['advance_received'] as UntypedFormArray;
    if (!ele.target.checked) {
      this.editInvoicePaymentForm.controls['all_advance_selected'].setValue(false);
    }
    if (ele.target.checked) {
      customerAdvance.controls[index].get('availing_amount').setValue(this.advanceList[index].balance)
    } else {
      customerAdvance.controls[index].get('availing_amount').setValue(0)
    }
    this.invoiceId ? this.onCheckboxChangeAdvance(ele, this.advanceList, index) : this.onCheckboxChangeAddAdvance(ele, this.advanceList, index)
    this.calculateAdvanceAvail();
    if (customerAdvance.controls.every((advance) => advance.get('selected').value === true)) {
      this.editInvoicePaymentForm.controls['all_advance_selected'].setValue(true);
    }
  }

  onCheckboxChangeAddAdvance(event, list, index) {
    const customerAdvances = this.editInvoicePaymentForm.controls['advance_received'] as UntypedFormArray;
    if (event.target.checked) {
      list.filter(data => {
        if (event.target.value == data.id) {
          customerAdvances.controls[index].get('advance').setValue(data.id);
        }
      });
    }
    else {
      this.clearControlValidator(customerAdvances.controls[index].get('availing_amount'));
      customerAdvances.controls[index].get('advance').setValue(null);
      customerAdvances.controls[index].get('availing_amount').setValue(0);
    }
  }

  onCheckboxChangeCredit(event, list, index) {
    const creditNotes = this.editInvoicePaymentForm.controls['utilise_credit'] as UntypedFormArray;
    if (event.target.checked) {
      if (this.removeSelectedCreditNotes.length && this.removeSelectedCreditNotes.indexOf(event.target.value) > -1) {
        let position = this.removeSelectedCreditNotes.indexOf(event.target.value);
        this.removeSelectedCreditNotes.splice(position, 1);
        list.filter(data => {
          if (event.target.value == data.id) {
            creditNotes.controls[index].get('credit_note').setValue(data.credit_number);
          }
        });
      }
      else {
        list.filter(data => {
          if (event.target.value == data.id) {
            creditNotes.controls[index].get('id').setValue(null);
            creditNotes.controls[index].get('credit_note').setValue(data.id);
          }
        });
      }
    }
    else {
      if (isValidValue(creditNotes.controls[index].get('id').value) && !creditNotes.controls[index].get('selected').value)
        this.removeSelectedCreditNotes.push(creditNotes.controls[index].get('id').value);
      creditNotes.controls[index].get('credit_note').setValue(null);
    }
  }

  onCheckboxChangeAdvance(event, list, index) {
    const customerAdvances = this.editInvoicePaymentForm.controls['advance_received'] as UntypedFormArray;
    if (event.target.checked) {
      if (this.removeSelectedAdvances.length && this.removeSelectedAdvances.indexOf(event.target.value) > -1) {
        let position = this.removeSelectedAdvances.indexOf(event.target.value);
        this.removeSelectedAdvances.splice(position, 1);
        list.filter(data => {
          if (event.target.value == data.id) {
            customerAdvances.controls[index].get('advance').setValue(data.advance);
          }
        });
      }
      else {
        list.filter(data => {
          if (event.target.value == data.id) {
            customerAdvances.controls[index].get('id').setValue(null);
            customerAdvances.controls[index].get('advance').setValue(data.id);
          }
        });
      }
    }
    else {
      if (isValidValue(customerAdvances.controls[index].get('id').value) && !customerAdvances.controls[index].get('selected').value)
        this.removeSelectedAdvances.push(customerAdvances.controls[index].get('id').value);
      customerAdvances.controls[index].get('advance').setValue(null);
    }
  }

  submitInvoicePayment(saveAsDraft: boolean) {
    this.setValidators();
    const form = this.editInvoicePaymentForm;
    const request = this.prepareRequest(form);
    const withHeldAmount = Number(this.totals.total_amount_withheld);
    const deductionAmount = Number(this.editInvoicePaymentForm.get('deduction_amount').value);

    if (form.valid) {
      if (this.total != this.amountPayable) {
        this.apiError = 'Amount Breakup should be equal to Total!';
        this.breakUpAmountErr = true
        this.deductAndWitheldErr = false
        this._scrollToTop.scrollToTop();
      }
      else if (withHeldAmount != deductionAmount) {
        if (this.isTax) {
          this.apiError = 'Withheld Amount should be equal to Deduction Amount!';
          this.deductAndWitheldErr = true
          this.breakUpAmountErr = false
          this._scrollToTop.scrollToTop();
        }
      }
      else if (Number(this.total) == 0 || Number(this.amountPayable) == 0) {
        this.apiError = "Total Amount Paid should be greater than 0"
        this._scrollToTop.scrollToTop();
      }

      else {
        request.utilise_credit.forEach((data: any) => {
          data.total_balance = defaultZero(data.total_balance);
          data.availing_amount = defaultZero(data.availing_amount);
        });
        request.advance_received.forEach((data: any) => {
          data.total_balance = defaultZero(data.total_balance);
          data.availing_amount = defaultZero(data.availing_amount);
        });
        request.outstanding_invoice.forEach((data: any) => {
          data.total_balance = defaultZero(data.total_balance);
          data.adjustment = defaultZero(data.adjustment);
          data.amount_received = defaultZero(data.amount_received);
          data.withheld = defaultZero(data.withheld);
        });
        request.outstanding_bos.forEach((data: any) => {
          data.total_balance = defaultZero(data.total_balance);
          data.adjustment = defaultZero(data.adjustment);
          data.amount_received = defaultZero(data.amount_received);
          data.withheld = defaultZero(data.withheld);
        });
        request.outstanding_debit.forEach((data: any) => {
          data.total_balance = defaultZero(data.total_balance);
          data.adjustment = defaultZero(data.adjustment);
          data.amount_received = defaultZero(data.amount_received);
          data.withheld = defaultZero(data.withheld);
        });

        if (saveAsDraft) {
          this.savePaymentSettelmentAsDraft(request, form);
        }
        else {
          this.editInvoicePayment(request, form);
        }
      }
    }
    else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
      this.scrollWindowToTop();
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

  editInvoicePayment(request, form) {
    if (this.invoiceId) {
      this.apiHandler.handleRequest(this._paymentsService.editInvoicePayment(request, this.invoiceId), 'Payment Received updated successfully!').subscribe(
        {
          next: () => {
            this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.PAYMENTSETTLEMENT)
            this._router.navigate([this.prefixUrl + '/income/payments/list/invoice'], { queryParams: { pdfViewId: this.invoiceId } });
          },
          error: (err) => {
            this.apiError = '';
            if (err.error.status == 'error') {
              this.setAsTouched(form);
              this.apiError = err.error.message;
              this.scrollWindowToTop();
            }
          }
        }
      );
    }
    else {
      this.apiHandler.handleRequest(this._paymentsService.addInvoicePayment(request), 'Payment Received added successfully!').subscribe(
        {
          next: () => {
            this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.PAYMENTSETTLEMENT)
            this._router.navigateByUrl(this.prefixUrl + '/income/payments/list/invoice');
          },
          error: (err) => {
            if (err.error.status == 'error') {
              this.setAsTouched(form);
              this.apiError = err.error.message;
              this.scrollWindowToTop();
            }
          }
        }
      );
    }
  }

  savePaymentSettelmentAsDraft(request, form) {
    if (this.invoiceId) {
      this.apiHandler.handleRequest(this._paymentsService.updatePaymentSettelmentAsDraft(request, this.invoiceId), 'Payment Received draft updated successfully!').subscribe(
        {
          next: () => {
            this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.PAYMENTSETTLEMENT)
            this._router.navigateByUrl(this.prefixUrl + '/income/payments/list/invoice');
          },
          error: (err) => {
            this.apiError = '';
            if (err.error.status == 'error') {
              this.setAsTouched(form);
              this._scrollToTop.scrollToTop();
              this.apiError = err.error.message;
              this.scrollWindowToTop();
            }
          }
        }
      );
    }
    else {
      this.apiHandler.handleRequest(this._paymentsService.savePaymentSettelmentAsDraft(request), 'Payment Received draft added successfully!').subscribe(
        {
          next: () => {
            this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.PAYMENTSETTLEMENT)
            this._router.navigateByUrl(this.prefixUrl + '/income/payments/list/invoice');
          },
          error: (err) => {
            this.apiError = '';
            if (err.error.status == 'error') {
              this.setAsTouched(form);
              this._scrollToTop.scrollToTop();
              this.apiError = err.error.message;
              this.scrollWindowToTop();
            }
          }
        });
    }
  }

  prepareRequest(form: UntypedFormGroup) {
    let params = form.value;
    params['deleted_out_debit'] = this.removeSelectedDebitNotes;
    params['deleted_out_credit'] = this.removeSelectedCreditNotes;
    params['deleted_out_invoice'] = this.removeSelectedInvoice;
    params['deleted_out_advance'] = this.removeSelectedAdvances;
    params['deleted_out_bos'] = this.removeSelectedBos;
    params['outstanding_invoice'] = params['outstanding_invoice'].filter(invoice => {
      return invoice.selected;
    });
    params['outstanding_bos'] = params['outstanding_bos'].filter(bos => {
      return bos.selected;
    });
    params['utilise_credit'] = params['utilise_credit'].filter(credit => {
      return credit.selected;
    });
    params['advance_received'] = params['advance_received'].filter(advance => {
      return advance.selected;
    });
    params['outstanding_debit'] = params['outstanding_debit'].filter(debit => {
      return debit.selected;
    });

    params['date_of_payment'] = changeDateToServerFormat(form.controls['date_of_payment'].value);
    params['cheque_date'] = changeDateToServerFormat(form.controls['cheque_date'].value);
    params['clearance_date'] = changeDateToServerFormat(form.controls['clearance_date'].value);
    params['advance_availed'] = this.totals.advance_avail;
    params['credit_availed'] = this.totals.credit_avail;
    params['withheld_amount'] = this.totals.total_amount_withheld;
    return params;
  }

  partyNamePatch(editInvoicePayment) {
    if (editInvoicePayment.party) {
      this.initialValues.party['value'] = editInvoicePayment.party.id;
      this.initialValues.party['label'] = editInvoicePayment.party.display_name;
    } else {
      this.initialValues.party = getBlankOption();
    }
  }

  patchTermsAndConditions(data) {
    if (data.terms_and_condition) {
      this.initialValues.termsAndCondition['value'] = data.terms_and_condition.id,
        this.initialValues.termsAndCondition['label'] = data.terms_and_condition.name
    } else {
      this.initialValues.termsAndCondition = getBlankOption()
    }
  }


  pamentModePatch(editInvoicePayment) {
    if (editInvoicePayment.account) {
      this.initialValues.accountNo['value'] = editInvoicePayment.account.id;
      this.initialValues.accountNo['label'] = editInvoicePayment.account.name;
    } else {
      this.initialValues.accountNo = getBlankOption();
    }
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  scrollWindowToTop() {
    window.scrollTo(0, 0);
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

  convertToNumber(amount) {
    return Number(amount);
  }

  resetFormData() {
    this.searchCredit = '';
    this.searchAdvance = '';
    this.searchDebit = '';
    this.searchInvoice = '';
    this.searchBos = '';
    this.total = 0;
    this.amountPayable = 0;
    this.totals.advance_avail = 0;
    this.totals.credit_avail = 0;
    this.totals.total_amount_withheld = 0;
    this.totals.debit_amount_received = 0;
    this.totals.invoice_amount_received = 0;
    this.totals.bos_amount_received = 0;
    this.editInvoicePaymentForm.controls['date_of_payment'].reset();
    this.editInvoicePaymentForm.controls['account'].reset();
    this.initialValues.accountNo = getBlankOption()
    this.editInvoicePaymentForm.controls['bank_charge'].patchValue(0);
    this.editInvoicePaymentForm.controls['reference_number'].patchValue('');
    this.editInvoicePaymentForm.controls['amount_received'].patchValue(0);
    this.deductAmountDisabled = true;
    this.bankingChargeRequired = false;
    this.editInvoicePaymentForm.controls['all_advance_selected'].patchValue(false);
    this.editInvoicePaymentForm.controls['all_debit_selected'].patchValue(false);
    this.editInvoicePaymentForm.controls['all_credit_note_selected'].patchValue(false);
    this.editInvoicePaymentForm.controls['all_invoice_selected'].patchValue(false);
    this.editInvoicePaymentForm.controls['all_bos_selected'].patchValue(false);
  }




  setValidators() {
    const invoices = this.editInvoicePaymentForm.controls['outstanding_invoice'] as UntypedFormArray;
    const debitNotes = this.editInvoicePaymentForm.controls['outstanding_debit'] as UntypedFormArray;
    const customerAdvances = this.editInvoicePaymentForm.controls['advance_received'] as UntypedFormArray;
    const bos = this.editInvoicePaymentForm.controls['outstanding_bos'] as UntypedFormArray;
    let creditNotes = this.editInvoicePaymentForm.controls['utilise_credit'] as UntypedFormArray;

    invoices.controls.forEach((invoice) => {
      const totalBalance = invoice.get('total_balance');
      const balance = invoice.get('balance').value;
      if (invoice.get('selected').value) {
        const usedAmount = defaultZero(balance) - defaultZero(totalBalance.value);
        if (usedAmount == 0) {
          totalBalance.setValidators(TransportValidator.forceInvalidate);
        } else {
          totalBalance.setValidators([Validators.min(0), Validators.max(balance)]);
        }
      } else {
        totalBalance.clearValidators();
      }
      totalBalance.updateValueAndValidity({ emitEvent: true });
    });

    bos.controls.forEach((bos) => {
      const totalBalance = bos.get('total_balance');
      const balance = bos.get('balance').value;
      if (bos.get('selected').value) {
        const usedAmount = defaultZero(balance) - defaultZero(totalBalance.value);
        if (usedAmount == 0) {
          totalBalance.setValidators(TransportValidator.forceInvalidate);
        } else {
          totalBalance.setValidators([Validators.min(0), Validators.max(balance)]);
        }
      } else {
        totalBalance.clearValidators();
      }
      totalBalance.updateValueAndValidity({ emitEvent: true });
    });

    debitNotes.controls.forEach((dnote) => {
      const totalBalance = dnote.get('total_balance');
      const balance = dnote.get('balance').value;
      if (dnote.get('selected').value) {
        const usedAmount = defaultZero(balance) - defaultZero(totalBalance.value);
        if (usedAmount == 0) {
          totalBalance.setValidators(TransportValidator.forceInvalidate);
        } else {
          totalBalance.setValidators([Validators.min(0), Validators.max(balance)]);
        }
      } else {
        totalBalance.clearValidators();
      }
      totalBalance.updateValueAndValidity({ emitEvent: true });
    });



    customerAdvances.controls.forEach((cadvance) => {
      const amountUsed = cadvance.get('availing_amount');
      const totalBalance = cadvance.get('opening_balance');
      if (cadvance.get('selected').value) {
        amountUsed.setValidators([Validators.min(0.01), Validators.max(totalBalance.value)])
      } else {
        amountUsed.clearValidators();
      }
      amountUsed.updateValueAndValidity({ emitEvent: true });
    });

    creditNotes.controls.forEach((cnote) => {
      let amountUsed = cnote.get('availing_amount');
      let totalBalance = cnote.get('opening_balance');
      if (cnote.get('selected').value) {
        amountUsed.setValidators([Validators.min(0.01), Validators.max(totalBalance.value)])
      } else {
        amountUsed.clearValidators();
      }
      amountUsed.updateValueAndValidity({ emitEvent: true });
    });
  }

  paymentModeChange(clearChequeAndAccount: boolean = true) {
    let paymentId = this.editInvoicePaymentForm.controls.payment_choice.value;
    if (paymentId == this.chequeId) {
      this.isChequeRequired = true;
      this.editInvoicePaymentForm.controls['cheque_status'].setValidators([Validators.required]);
      this.editInvoicePaymentForm.controls['cheque_no'].setValidators([Validators.required]);
      this.editInvoicePaymentForm.controls['cheque_date'].setValidators([Validators.required]);
      this.editInvoicePaymentForm.controls['cheque_status'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['cheque_no'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['cheque_date'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['account'].setValidators(null);
      this.editInvoicePaymentForm.controls['account'].updateValueAndValidity();
      this.accountsList = this.accountNoBank;
    } else {
      this.isChequeRequired = false;
      this.editInvoicePaymentForm.controls['cheque_status'].setValidators(null);
      this.editInvoicePaymentForm.controls['cheque_no'].setValidators(null);
      this.editInvoicePaymentForm.controls['cheque_date'].setValidators(null);
      this.editInvoicePaymentForm.controls['cheque_status'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['cheque_no'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['cheque_date'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['account'].setValidators([Validators.required]);
      this.editInvoicePaymentForm.controls['account'].updateValueAndValidity();
      if (paymentId == this.cashId) {
        this.accountsList = this.accountNoCash;
      } else {
        this.accountsList = this.accountNoBank;
      }
    }
    if (clearChequeAndAccount) {
      this.editInvoicePaymentForm.controls['account'].setValue(null);
      this.initialValues.accountNo = getBlankOption();
      this.clearChequeDetails();
      this.prefillBank()
    }

  }

  prefillBank() {
    let partyId = this.editInvoicePaymentForm.controls.party.value;
    let payment_mode = this.editInvoicePaymentForm.controls.payment_choice.value;
    this.editInvoicePaymentForm.controls.account.setValue(null);
    this.initialValues.accountNo = getBlankOption();
    if (payment_mode) {
      let params = {
        is_account: 'True',
        is_tenant: 'False',
        is_cash_account: 'True',
        remove_cash_account: 'True'
      }
      if (payment_mode === 'e9dc7261-5561-4a41-be9d-e076cff65a45') {
        params['remove_cash_account'] = 'False';
        params['is_cash_account'] = 'True';
      } else {
        params['is_cash_account'] = 'False';
        params['remove_cash_account'] = 'True';

      }
      this._revenueservice.getDefaultBank(partyId, params).subscribe((data) => {
        if (isValidValue(data)) {
          this.editInvoicePaymentForm.controls.account.setValue(data['result'].id)
          this.initialValues.accountNo['label'] = data['result'].name;
          this.initialValues.accountNo['value'] = data['result'].id;
          this.onPaymentModeSelected()
        }
      })
    }

  }

  clearChequeDetails() {
    this.isClearedCheque = false;
    this.initialValues.paymentChequeStatus = getBlankOption();
    this.editInvoicePaymentForm.get('cheque_no').setValue("");
    this.editInvoicePaymentForm.get('cheque_status').setValue(null);
    this.editInvoicePaymentForm.get('cheque_date').setValue(null);
    this.editInvoicePaymentForm.get('clearance_date').setValue(null);
  }

  checkChequeStatus() {
    let chequeStatus = this.editInvoicePaymentForm.controls['cheque_status'].value;
    if (chequeStatus == this.chequeClearedId) {
      this.isChequeCleared = true;
      this.isAlreadyCleared = true;
      this.isPaymentDisabled = true;
      this.ischequeStatusDisabled = true;
      this.chequeStatus(false);
    } else {
      this.isChequeCleared = false;
      this.isPaymentDisabled = false;
      this.ischequeStatusDisabled = false;
    }
    if (chequeStatus == this.chequeCancelId) {
      this.isPaymentDisabled = false;
      this.isChequeCleared = false;
      this.ischequeStatusDisabled = false;
      this.isAlreadyCancelled = true;
    }
  }

  patchChequeStatus(data) {
    this.initialValues.paymentChequeStatus = { label: data.cheque_status.label, value: data.cheque_status.id }
    this.editInvoicePaymentForm.controls['cheque_status'].setValue(data.cheque_status.id);
    this.checkChequeStatus();
  }

  patchPaymentMode(data) {
    this.initialValues.paymentChoice = { label: data.payment_choice.label, value: data.payment_choice.id }
    this.editInvoicePaymentForm.controls['payment_choice'].setValue(data.payment_choice.id);
    this.paymentModeChange(false);
    let paymentId = this.editInvoicePaymentForm.controls.payment_choice.value;
    if (paymentId == this.chequeId) {
      this.patchChequeStatus(data)
    }
  }

  checkstatusChange() {
    this.isChequeCleared = false;
  }

  chequeStatus(enableChequeEdit: boolean = true) {
    let checkistatusId = this.editInvoicePaymentForm.controls.cheque_status.value;
    if (enableChequeEdit) {
      this.isAlreadyCancelled = false;
    }


    if (checkistatusId == this.chequeClearedId) {
      this.isClearedCheque = true;
      this.editInvoicePaymentForm.controls['clearance_date'].setValidators([Validators.required]);
      this.editInvoicePaymentForm.controls['clearance_date'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['account'].setValidators([Validators.required]);
      this.editInvoicePaymentForm.controls['account'].updateValueAndValidity();
    } else {
      this.isClearedCheque = false;
      this.editInvoicePaymentForm.controls['clearance_date'].setValidators(null);
      this.editInvoicePaymentForm.controls['clearance_date'].updateValueAndValidity();
      this.editInvoicePaymentForm.controls['account'].setValidators(null);
      this.editInvoicePaymentForm.controls['account'].updateValueAndValidity();
    }

    if (checkistatusId != this.chequeClearedId) {
      this.paymentModeSelected = true;
      this.bankingChargeRequired = true;
    }
    else {
      this.paymentModeSelected = false;
      this.bankingChargeRequired = false;
    }
    this.onPaymentModeSelected()

  }
  stopLoaderClasstoBody() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add('removeLoader');
  }

  revenueHeader(data) {
    if (this.isTax) {
      this.editInvoicePaymentForm.get('is_tax_deducted').setValue(data['payementDetails'].is_tax_deducted)
      this.editInvoicePaymentForm.get('deduction_amount').setValue(Number(data['payementDetails'].deduction_amount));
      this.deductAmountDisabled = false;
      if (this.editInvoicePaymentForm.controls['is_tax_deducted'].value == false) {
        this.editInvoicePaymentForm.controls['deduction_amount'].patchValue(0);
        this.deductAmountDisabled = true;
      } else {
        this.deductAmountDisabled = false;
      }
      this.setDeductionAmount();
    }

  }

  getDigitalSignatureList() {
    this._commonService.getDigitalSignatureList().subscribe(data => {
      this.digitalSignature = data['result']['data']
    })
  }


}
