import { Component, OnInit, DoCheck, Output, EventEmitter } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-orgainzation-setting-slidebar',
  templateUrl: './orgainzation-setting-slidebar.component.html',
  styleUrls: ['./orgainzation-setting-slidebar.component.scss']
})
export class OrgainzationSettingSlidebarComponent implements  OnInit, DoCheck {
  @Output() isCollapsed = new EventEmitter();
  companyId: string;
  addCompany: Boolean = false;
  collapse: Boolean = false;
  vehicleInspection = Permission.vehicleInspection.toString().split(',');
  vehicleTrip=Permission.trip__new_trip.toString().split(',');
  invoice=Permission.invoice.toString().split(',');
  debitNote=Permission.debit_note.toString().split(',');
  creditNote=Permission.credit_note.toString().split(',');
  paymentStatement=Permission.payments__settlement.toString().split(',');
  paymentAdvance=Permission.payments__advance.toString().split(',');
  paymentRefund=Permission.payments__refund.toString().split(',');
  operationPayment = Permission.bill_payment.toString().split(',');
  operationsVendor = Permission.vendor_advance.toString().split(',');
  workOrder = Permission.workorder.toString().split(',');
  bos= Permission.bos.toString().split(',');
  quotation = Permission.quotations.toString().split(',');
  jobcard = Permission.maintenance.toString().split(',');
  party = Permission.party.toString().split(',');
  vehicle = Permission.vehicle.toString().split(',');
  siteInspection = Permission.siteInspection.toString().split(',');
  asset=Permission.assets.toString().split(',');
  localPurchaseOrder=Permission.localPurchaseOrder.toString().split(',');
  activeRoute ='';
  $routerSubscription:Subscription 

  constructor(
    private router:Router
  ) {}

  ngOnInit() {
    let urlArray=[]
    urlArray= window.location.href.split('/');
    this.activeRoute =urlArray[urlArray.length-2]
    this.$routerSubscription= this.router.events.pipe(
       filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        this.activeRoute =event['url'].split('/')[5]
      });
  }


  ngDoCheck() {
      const compExists = localStorage.getItem('TS_COMPANY_EXISTS');
      if (isValidValue(compExists)) {
        this.addCompany = true;
        this.companyId = compExists;
      } else {
        this.addCompany = false;
      }
  }
}
