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
import { PartyDetailsVendorCommonService } from '../../party-details-vendor-common-service.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-party-vehicle-provider-transactions',
  templateUrl: './party-vehicle-provider-transactions.component.html',
  styleUrls: ['./party-vehicle-provider-transactions.component.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', display: 'none', overflow: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class PartyVehicleProviderTransactionsComponent implements OnInit {

  @Input() partyId = ''
  isExpandBilling = true;
  isExpandPayment = true;
  isExpandPayLater = true;
  isExpandVendorCredit = false;
  isExpandVendorAdvance = false;
  queryParamsVendorHead = {
    start_date: '',
    end_date: '',
  }

  queryParamsBill = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }

  queryParamsPayment = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }

  queryParamsVendorCredit = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }

  queryParamsVendorAdvance = {
    start_date: '',
    end_date: '',
    next_cursor: '',
    search: ''
  }

  vendorStats;
  currency_type: any;
  billingList = [];
  paymentList = [];
  vendorCredit = [];
  vendorAdvance = [];
  isLoadingBills = false;
  isLoadingPayment = false;
  isLoadingVendorCredit = false;
  isLoadingVendorAdvance = false;
  getPrefixUrl = getPrefix();
  constructor(private _partyDetailsVendorCommonService: PartyDetailsVendorCommonService, private currency: CurrencyService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
  }
  expandCollapseBilling(e) {
    this.isExpandBilling = e;
  }

  expandCollapsePaylater(e) {
    this.isExpandPayLater = e;
  }
  expandCollapsePayment(e) {
    this.isExpandPayment = e;
  }
  expandCollapseVendorCredit(e) {
    this.isExpandVendorCredit = e
  }

  expandCollapseVendorAdvance(e) {
    this.isExpandVendorAdvance = e
  }

  dateRangeVendorStat(e) {
    this.queryParamsVendorHead.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsVendorHead.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsBill.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsBill.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsPayment.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsPayment.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsVendorCredit.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsVendorCredit.end_date = changeDateToServerFormat(e.endDate);
    this.queryParamsVendorAdvance.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsVendorAdvance.end_date = changeDateToServerFormat(e.endDate);
    this.getVendorHead();
    this.getBilling();
    this.getPayment();
    this.getVendorCredit();
    this.getVendorAdvance();

  }

  getVendorHead() {
    this._partyDetailsVendorCommonService.getVendorTransactionHead(this.partyId, this.queryParamsVendorHead).subscribe(resp => {
      this.vendorStats = resp['result'];
    });
  }

  getBilling() {
    this._partyDetailsVendorCommonService.getVendorTransactionBilling(this.partyId, this.queryParamsBill).subscribe(resp => {
      this.billingList = resp['result'].data
      this.queryParamsBill.next_cursor = resp['result'].next_cursor;
    });
  }

  getPayment() {
    this._partyDetailsVendorCommonService.getVendorTransactionPayment(this.partyId, this.queryParamsPayment).subscribe(resp => {
      this.paymentList = resp['result'].data;
      this.queryParamsPayment.next_cursor = resp['result'].next_cursor;
    });
  }

  getVendorCredit() {
    this._partyDetailsVendorCommonService.getVendorCredit(this.partyId, this.queryParamsVendorCredit).subscribe(resp => {
      this.vendorCredit = resp['result'].vendor_credit;
      this.queryParamsVendorCredit.next_cursor = resp['result'].next_cursor;
    });
  }
  getVendorAdvance() {
    this._partyDetailsVendorCommonService.getVendorAdvance(this.partyId, this.queryParamsVendorAdvance).subscribe(resp => {
      this.vendorAdvance = resp['result'].vendor_advance;
      this.queryParamsVendorAdvance.next_cursor = resp['result'].next_cursor;
    });
  }

  searchedDataBill(e) {
    this.queryParamsBill.search = e;
    this.queryParamsBill.next_cursor = '';
    this.getBilling();
  }

  searchedDataPayment(e) {
    this.queryParamsPayment.search = e;
    this.queryParamsPayment.next_cursor = '';
    this.getPayment();
  }

  searchedDataVendorCredit(e) {
    this.queryParamsVendorCredit.search = e;
    this.queryParamsVendorCredit.next_cursor = '';
    this.getVendorCredit();
  }

  searchedDataVdendorAdvance(e) {
    this.queryParamsVendorAdvance.search = e;
    this.queryParamsVendorAdvance.next_cursor = '';
    this.getVendorAdvance();
  }

  onScrollBills(event) {
    const container = document.querySelector('.bill_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingBills && this.queryParamsBill.next_cursor?.length > 0) {
      this.onScrollGetBills(this.queryParamsBill);
    }
  }

  onScrollGetBills(params) {
    this.isLoadingBills = true;
    this._partyDetailsVendorCommonService.getFuelVendorFuelSummary(this.partyId, params).subscribe(resp => {
      this.billingList.push(...resp['result'].data);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingBills = false;
    })
  }

  onScrollPayment(event) {
    const container = document.querySelector('.payment_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingPayment && this.queryParamsPayment.next_cursor?.length > 0) {
      this.onScrollGetPayment(this.queryParamsPayment);
    }
  }

  onScrollGetPayment(params) {
    this.isLoadingPayment = true;
    this._partyDetailsVendorCommonService.getFuelVendorFuelSummary(this.partyId, params).subscribe(resp => {
      this.billingList.push(...resp['result'].data);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingPayment = false;
    })
  }


  onScrollVendorCredit(event) {
    const container = document.querySelector('.vendor_credit_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingVendorCredit && this.queryParamsVendorCredit.next_cursor?.length > 0) {
      this.onScrollGetVendorCredit(this.queryParamsVendorCredit);
    }
  }

  onScrollGetVendorCredit(params) {
    this.isLoadingVendorCredit = true;
    this._partyDetailsVendorCommonService.getVendorCredit(this.partyId, params).subscribe(resp => {
      this.vendorCredit.push(...resp['result'].vendor_credit);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingVendorCredit = false;
    })
  }

  onScrollVendorAdvance(event) {
    const container = document.querySelector('.vendor_advance_scroll');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoadingVendorAdvance && this.queryParamsVendorAdvance.next_cursor?.length > 0) {
      this.onScrollGetVendorAdvance(this.queryParamsVendorAdvance);
    }
  }

  onScrollGetVendorAdvance(params) {
    this.isLoadingVendorAdvance = true;
    this._partyDetailsVendorCommonService.getVendorAdvance(this.partyId, params).subscribe(resp => {
      this.vendorAdvance.push(...resp['result'].vendor_credit);
      params.next_cursor = resp['result'].next_cursor;
      this.isLoadingVendorAdvance = false;
    })
  }

  getUrl(bill) {
    if (bill.redirect.name == "fleetowner")
      return this.getPrefixUrl + '/trip/vehicle-payment/list?pdfViewId=' + bill.redirect.id

    if (bill.redirect.name == "fuel")
      return this.getPrefixUrl + '/expense/fuel_expense/list?pdfViewId=' + bill.redirect.id

    if (bill.redirect.name == "otherexpenseactivity")
      return this.getPrefixUrl + '/expense/others_expense/list?pdfViewId=' + bill.redirect.id

    if (bill.redirect.name == "jobcartservice")
      return this.getPrefixUrl + '/expense/maintenance/' + bill.redirect.id

    if (bill.redirect.name == "tripexpense")
      return this.getPrefixUrl + '/trip/trip-expense/list?pdfViewId=' + bill.redirect.id
  }
  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }
}
