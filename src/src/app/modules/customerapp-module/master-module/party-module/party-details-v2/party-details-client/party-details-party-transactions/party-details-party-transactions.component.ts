import { Component, Input, OnInit } from '@angular/core';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PartyDetailsClientService } from '../party-details-client.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-party-details-party-transactions',
  templateUrl: './party-details-party-transactions.component.html',
  styleUrls: ['./party-details-party-transactions.component.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', display: 'none', overflow: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class PartyDetailsPartyTransactionsComponent implements OnInit {
  @Input() partyId = ''
  isExpandVendorAdvance=false;
  isExpandSO=false;
  isExpandRefund=false;
  isExpandPayment=false;
  isExpandCreditNote=false;
  isExpandDebitNote=false;
  isExpandInvoice=true;
  isExpandPaymentSettlement=true;
  currency_type: any 
  queryParamsClientHead = {
    start_date: '',
    end_date: '',
  }

  queryParamsInvoice = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }
  queryParamsSO = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }

  queryParamsPaymentSettlement = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }
  queryParamsAdvance = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }

  queryParamsRefund = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  } 

  queryParamsPaymentCheque = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  } 

  queryParamsCreditNote= {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  } 
  queryParamsDebitNote= {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  } 
  isLoadingInvoice= false;
  isLoadingSO= false;
  isLoadingPaymentSettlement=false;
  isLoadingAdvance= false;
  isLoadingRefund= false;
  isLoadingPaymentCheque= false;
  isLoadingCreditNote= false;
  isLoadingDebitNote= false;
  invoiceList =[];
  soList =[];
  paymentSettlementList =[];
  advanceList =[];
  refundList =[];
  paymentChequeList =[];
  creditNoteList =[];
  debitNoteList =[];
  getPrefixUrl = getPrefix();
  clientStats;
  constructor(private _partyDetailsClientService:PartyDetailsClientService,private currency: CurrencyService,) { }


  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
  }

  expandCollapseAdvanceTable(e){
    this.isExpandVendorAdvance=e
  }
  expandCollapseSO(e){
    this.isExpandSO=e
  }
  expandCollapseRefundTable(e){
    this.isExpandRefund=e
  }

  expandCollapsePaymentTable(e){
    this.isExpandPayment=e;
  }
  expandCollapseCreditNoteTable(e){
    this.isExpandCreditNote=e
  }
  expandCollapseDebitNoteTable(e){
    this.isExpandDebitNote=e
  }
  expandCollapseInvoiceTable(e){
    this.isExpandInvoice=e
  }
  expandCollapsePaymentSettlementTable(e){
    this.isExpandPaymentSettlement=e
  }

  dateRangeClientStat(e) {
    this.queryParamsClientHead.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsClientHead.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsInvoice.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsInvoice.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsSO.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsSO.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsPaymentSettlement.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsPaymentSettlement.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsAdvance.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsAdvance.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsRefund.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsRefund.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsPaymentCheque.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsPaymentCheque.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsCreditNote.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsCreditNote.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsDebitNote.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsDebitNote.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsInvoice.next_cursor = '';
    this.queryParamsSO.next_cursor = '';
    this.queryParamsPaymentSettlement.next_cursor = '';
    this.queryParamsAdvance.next_cursor = '';
    this.queryParamsRefund.next_cursor = '';
    this.queryParamsPaymentCheque.next_cursor = '';
    this.queryParamsCreditNote.next_cursor = '';
    this.queryParamsDebitNote.next_cursor = '';
    this.getClientHead();
    this.getInvoice();
    this.getSO()
    this.getPaymentSettlement();
    this.getAdvance();
    this.getRefund();
    this.getPaymentCheque();
    this.getCreditNote();
    this.getDebitNote();
  }

  getClientHead() {
    this._partyDetailsClientService.getClientTransactionHead(this.partyId, this.queryParamsClientHead).subscribe(resp => {
      this.clientStats = resp['result'];
    });
  }

  getInvoice() {
    this._partyDetailsClientService.getClientInvoice(this.partyId, this.queryParamsInvoice).subscribe(resp => {
      this.invoiceList = resp['result'].invoice
      this.queryParamsInvoice.next_cursor = resp['result'].next_cursor;
    });
  }
  getSO() {
    this._partyDetailsClientService.getClientSO(this.partyId, this.queryParamsSO).subscribe(resp => {
      this.soList = resp['result'].work_order
      this.queryParamsSO.next_cursor = resp['result'].next_cursor;
    });
  }


  getPaymentSettlement() {
    this._partyDetailsClientService.getClientPaymentSettlement(this.partyId, this.queryParamsPaymentSettlement).subscribe(resp => {
      this.paymentSettlementList = resp['result'].payment
      this.queryParamsPaymentSettlement.next_cursor = resp['result'].next_cursor;
    });
  }

  getAdvance() {
    this._partyDetailsClientService.getClientAdvance(this.partyId, this.queryParamsAdvance).subscribe(resp => {
      this.advanceList = resp['result'].advance
      this.queryParamsAdvance.next_cursor = resp['result'].next_cursor;
    });
  }

  getRefund() {
    this._partyDetailsClientService.getClientPaymentRefund(this.partyId, this.queryParamsRefund).subscribe(resp => {
      this.refundList = resp['result'].refund
      this.queryParamsRefund.next_cursor = resp['result'].next_cursor;
    });
  }

  getPaymentCheque() {
    this._partyDetailsClientService.getClientPaymentCheque(this.partyId, this.queryParamsPaymentCheque).subscribe(resp => {
      this.paymentChequeList = resp['result'].cheque
      this.queryParamsPaymentCheque.next_cursor = resp['result'].next_cursor;
    });
  }

  getCreditNote() {
    this._partyDetailsClientService.getClientCreditNote(this.partyId, this.queryParamsCreditNote).subscribe(resp => {
      this.creditNoteList = resp['result'].credit_note
      this.queryParamsCreditNote.next_cursor = resp['result'].next_cursor;
    });
  }

  getDebitNote() {
    this._partyDetailsClientService.getClientDebitNote(this.partyId, this.queryParamsDebitNote).subscribe(resp => {
      this.debitNoteList = resp['result'].debit_note
      this.queryParamsDebitNote.next_cursor = resp['result'].next_cursor;
    });
  }

  searchedDataInvoice(e) {
    this.queryParamsInvoice.search = e;
    this.queryParamsInvoice.next_cursor = '';
    this.getInvoice();
  }
  searchedDataSO(e) {
    this.queryParamsSO.search = e;
    this.queryParamsSO.next_cursor = '';
    this.getSO();
  }

  searchedDataPaymentSettlement(e) {
    this.queryParamsPaymentSettlement.search = e;
    this.queryParamsPaymentSettlement.next_cursor = '';
    this.getPaymentSettlement();
  }

  searchedDataAdvance(e) {
    this.queryParamsAdvance.search = e;
    this.queryParamsAdvance.next_cursor = '';
    this.getAdvance();
  }

  searchedDataRefund(e) {
    this.queryParamsRefund.search = e;
    this.queryParamsRefund.next_cursor = '';
    this.getRefund();
  }

  searchedDataPaymentCheque(e) {
    this.queryParamsPaymentCheque.search = e;
    this.queryParamsPaymentCheque.next_cursor = '';
    this.getPaymentCheque();
  }

  searchedDataCreditNote(e) {
    this.queryParamsCreditNote.search = e;
    this.queryParamsCreditNote.next_cursor = '';
    this.getCreditNote();
  }

  searchedDataDebitNote(e) {
    this.queryParamsDebitNote.search = e;
    this.queryParamsDebitNote.next_cursor = '';
    this.getDebitNote();
  }

  onScrollInvoice(event) {
    const container = document.querySelector('.invoice_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingInvoice && this.queryParamsInvoice.next_cursor?.length > 0) {
      this.onScrollGetInvoice(this.queryParamsInvoice);
    }
  }
  onScrollSO(event) {
    const container = document.querySelector('.so_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingSO && this.queryParamsSO.next_cursor?.length > 0) {
      this.onScrollGetSO(this.queryParamsSO);
    }
  }

  onScrollPaymentSettlement(event) {
    const container = document.querySelector('.payment_settlement_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingPaymentSettlement && this.queryParamsPaymentSettlement.next_cursor?.length > 0) {
      this.onScrollGetPaymentSettlement(this.queryParamsPaymentSettlement);
    }
  }

  onScrollAdvance(event) {
    const container = document.querySelector('.advance_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingAdvance && this.queryParamsAdvance.next_cursor?.length > 0) {
      this.onScrollGetAdvance(this.queryParamsAdvance);
    }
  }

  onScrollRefund(event) {
    const container = document.querySelector('.refund_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingRefund && this.queryParamsRefund.next_cursor?.length > 0) {
      this.onScrollGetRefund(this.queryParamsRefund);
    }
  }

  onScrollPaymentCheque(event) {
    const container = document.querySelector('.payment_cheque_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingPaymentCheque && this.queryParamsPaymentCheque.next_cursor?.length > 0) {
      this.onScrollGetPaymentCheque(this.queryParamsPaymentCheque);
    }
  }

  onScrollCreditNote(event) {
    const container = document.querySelector('.credit_note_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingCreditNote && this.queryParamsCreditNote.next_cursor?.length > 0) {
      this.onScrollGetCreditNote(this.queryParamsCreditNote);
    }
  }

  onScrollDebitNote(event) {
    const container = document.querySelector('.debit_note_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingDebitNote && this.queryParamsDebitNote.next_cursor?.length > 0) {
      this.onScrollGetDebitNote(this.queryParamsDebitNote);
    }
  }



  onScrollGetInvoice(params) {
    this.isLoadingInvoice = true;
    this._partyDetailsClientService.getClientInvoice(this.partyId, params).subscribe(resp => {
      this.invoiceList.push(...resp['result'].invoice);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingInvoice = false;
    })
  }
  onScrollGetSO(params) {
    this.isLoadingSO = true;
    this._partyDetailsClientService.getClientSO(this.partyId, params).subscribe(resp => {
      this.soList.push(...resp['result'].work_order);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingSO = false;
    })
  }


  onScrollGetPaymentSettlement(params) {
    this.isLoadingPaymentSettlement = true;
    this._partyDetailsClientService.getClientPaymentSettlement(this.partyId, params).subscribe(resp => {
      this.paymentSettlementList.push(...resp['result'].payment);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingPaymentSettlement = false;
    })
  }


  onScrollGetAdvance(params) {
    this.isLoadingAdvance = true;
    this._partyDetailsClientService.getClientAdvance(this.partyId, params).subscribe(resp => {
      this.advanceList.push(...resp['result'].advance);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingAdvance = false;
    })
  }

  onScrollGetRefund(params) {
    this.isLoadingRefund = true;
    this._partyDetailsClientService.getClientPaymentRefund(this.partyId, params).subscribe(resp => {
      this.refundList.push(...resp['result'].refund);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingRefund = false;
    })
  }

  onScrollGetPaymentCheque(params) {
    this.isLoadingPaymentCheque = true;
    this._partyDetailsClientService.getClientPaymentCheque(this.partyId, params).subscribe(resp => {
      this.paymentChequeList.push(...resp['result'].cheque);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingPaymentCheque = false;
    })
  }

  onScrollGetCreditNote(params) {
    this.isLoadingCreditNote = true;
    this._partyDetailsClientService.getClientCreditNote(this.partyId, params).subscribe(resp => {
      this.creditNoteList.push(...resp['result'].credit_note);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingCreditNote = false;
    })
  }

  onScrollGetDebitNote(params) {
    this.isLoadingDebitNote = true;
    this._partyDetailsClientService.getClientDebitNote(this.partyId, params).subscribe(resp => {
      this.debitNoteList.push(...resp['result'].debit_note);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingDebitNote = false;
    })
  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }

}
