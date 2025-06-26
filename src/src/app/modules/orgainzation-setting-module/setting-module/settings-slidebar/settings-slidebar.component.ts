import { NavigationStart, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-settings-slidebar',
  templateUrl: './settings-slidebar.component.html',
  styleUrls: ['./settings-slidebar.component.scss']
})
export class SettingsSlidebarComponent implements OnInit {
  collapse: boolean = false;
  vehicleTrip=Permission.trip__new_trip.toString().split(',');
  invoice=Permission.invoice.toString().split(',');
  assets=Permission.assets.toString().split(',');
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
  activeRoute ='';
  sideBar={
    onBoarding:false,
    trips:true,
    income:false,
    expense:false,
    report:false,
    payments:false,
  }

  revenue =[];

  $routerSubscription:Subscription;
  vehicleCategories=[]
  constructor(private router:Router ,private _commonservice:CommonService) { }

  ngOnInit() {
    this._commonservice.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategories = resp['result']['categories']
    })
    let urlArray=[]
    urlArray= window.location.href.split('/');
    this.activeRoute =urlArray[urlArray.length-2]
    this.$routerSubscription= this.router.events.pipe(
       filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        this.activeRoute =event['url'].split('/')[5]
      });

  }
  ngOnDestroy(): void {
    this.$routerSubscription.unsubscribe()
  }

  resetSlideBar(type){
    for (const key in this.sideBar) {
      if (Object.prototype.hasOwnProperty.call(this.sideBar, key)) {
       this.sideBar[key];
        if(key !==type){
          this.sideBar[key]=false;
        }

      }
    }
  }

}
