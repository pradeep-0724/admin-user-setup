
import { Component, OnInit } from '@angular/core';
import { DashBoardService } from '../api-services/dashboard-services/dashboard.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss',
  ]
})
export class DashboardComponent implements OnInit {

  receivable;
  payable;
  tripDetails;
  vehicle;
  workOrderScheduled;
  workOrdersOngoing;
  fuelSlip;
  clientList=[];
  vendorList=[];
  preFixUrl=getPrefix();
  currency_type: any;
  totalReceiveable=0;
  totalPayable=0;

  

  constructor(private _dashboardService: DashBoardService,private currency: CurrencyService,) {
    this.currency_type = this.currency.getCurrency();
  }



  ngOnInit() {
    this.getTrips();
    this.getReceivable();
    this.getPayable();
    this.getVehicle();
    this.workOrderSchedule();
    this.workOrderOngoing();
    this.getFuelStat();
    this.getTop10Payable();
    this.getTop10Receivable();

  }

  getTrips() {
    this._dashboardService.getOverallTripStatus().subscribe(resp => {
      this.tripDetails = resp['result'];
    });
  }

  getVehicle() {
    this._dashboardService.getOverallVehicleStatus().subscribe(resp => {
      this.vehicle = resp['result']
    });
  }

  workOrderSchedule() {
    this._dashboardService.getWorkorderSchedule().subscribe(resp => {
      this.workOrderScheduled = resp['result'];
    });
  }

  workOrderOngoing() {
    this._dashboardService.getWorkorderOngoing().subscribe(resp => {
      this.workOrdersOngoing = resp['result']
    });
  }

  getFuelStat() {
    this._dashboardService.getFuelsStats().subscribe(resp => {
      this.fuelSlip = resp['result']
    });
  }

  getPayable() {
    this._dashboardService.getPayables().subscribe(resp => {
      this.payable = resp['result'];

    });
  }

  getReceivable() {
    this._dashboardService.getReceivables().subscribe(resp => {
      this.receivable = resp['result']
    });
  }

  getTop10Payable() {
    this._dashboardService.getTop10Payables().subscribe(resp => {
      this.vendorList =resp['result']
      this.totalPayable = (this.vendorList.map(vendor=>vendor.amount)).reduce((accumulator, currentValue) => accumulator + currentValue,0)
    });
  }

  getTop10Receivable() {
    this._dashboardService.getTop10Receivables().subscribe(resp => {
      this.clientList =resp['result'];
      this.totalReceiveable = (this.clientList.map(client=>client.amount)).reduce((accumulator, currentValue) => accumulator + currentValue,0)
    });
  }


  fixedTo3Decimal(value){
   return Number(value).toFixed(3)
  }






}
