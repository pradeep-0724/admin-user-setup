import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { AddFuelComponent } from '../add-fuel/add-fuel.component';
import { AddDriverAllowanceComponent } from '../add-driver-allowance/add-driver-allowance.component';
import { AddOtherExpensesComponent } from '../add-other-expenses/add-other-expenses.component';
import { ChargeDeductionComponent } from '../charge-deduction/charge-deduction.component';
import { LiveTrackingComponent } from '../live-tracking/live-tracking.component';
import { ActivatedRoute } from '@angular/router';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { Observable, Subscription } from 'rxjs';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';

@Component({
  selector: 'app-trip-details-add-section',
  templateUrl: './trip-details-add-section.component.html',
  styleUrls: ['./trip-details-add-section.component.scss']
})
export class TripDetailsAddSectionComponent implements OnInit ,OnDestroy{

  constructor(private _analytics: AnalyticsService, public dialog: Dialog, private activatedRoute: ActivatedRoute, private _tripDataService: NewTripV2DataService,private _newTripV2Service : NewTripV2Service) {
  }
  tripId = '';
  @Input() tripStartDate: string = ''
  @Input() isDriverAdded: boolean = false;
  @Input() isTransporter: boolean = true;
  @Input() headerDetailsDataSub: Observable<any>;
  vehicleCategory : number;
  driver :any;
  isDriverTrip: boolean = true;
  isLiveTrack: boolean = true;
  mapConfig: any;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  @Input() tripStatusAndSummaryData: Observable<any>
  can_add_client_charge:boolean=true;
  can_add_vp_charge:boolean=true;
  isAllDisabled : boolean = true;
  $subscriptions: Array<Subscription> = [];
  timeSheets :any[] = [];
  customerId = '';
  isVoid : boolean = false;
  vehicleDetails : any ;
  ngOnDestroy(): void {
    if (this.$subscriptions.length) {
      this.$subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }

  ngOnInit(): void {    
    this.activatedRoute.params.subscribe((data) => {
      this.tripId = data['id']
    })
   this.$subscriptions.push(this.headerDetailsDataSub.subscribe((data)=>{
      this.customerId = data['customer']?.['id'];
    this.vehicleDetails = data['vehicle'];
    this.vehicleCategory = data.vehicle_category;
    this.driver=data?.driver
    this.isVoid = false;
    this.isAllDisabled = false;
      if( data.approval_status.status_screen_to_show === 'approver_action' || data.approval_status.status_screen_to_show === 'approval_rejected'){
        this.isAllDisabled = true;
      }
       if(data.approval_status.status_screen_to_show === 'void' ){
        this.isVoid = true;
      }      
    }))
    
    this.$subscriptions.push(this.tripStatusAndSummaryData.subscribe(data => {    
      this.isDriverTrip = data.is_driver_trip;
      this.isLiveTrack = data.is_live_track;
      this.mapConfig = data.map_config
      this.can_add_client_charge=data.can_add_client_charge;
      this.can_add_vp_charge=data.can_add_vp_charge;

    }))
    this.getApprovedTimeSheets();
    this.$subscriptions.push(this._tripDataService.approvedTimeSheets.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getApprovedTimeSheets()
      }
    }));

  }
  getApprovedTimeSheets(){
    this._newTripV2Service.getApprovedTimeSheets(this.tripId).subscribe((res)=>{
      this.timeSheets = res['result'];
    })
  }

  addFuel() {
    const dialogRef = this.dialog.open(AddFuelComponent, {
      maxWidth:"85%",
      width:'1100px',
      data: {
        type: 'Add',
        tripId: this.tripId,
        tripStartDate: this.tripStartDate,
        vehicleDetails : this.vehicleDetails
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });


    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateProfitLoss(result);
      this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"New Fuel Added in Trip");
      dialogRefSub.unsubscribe()

    });
  }

  addDriverAllowance() {
    const dialogRef = this.dialog.open(AddDriverAllowanceComponent, {
      maxWidth:"85%",
      width:'1100px',
      data: {
        type: 'Add',
        tripId: this.tripId,
        tripStartDate: this.tripStartDate,
        driver:this.driver,
        vehicle_category : this.vehicleCategory
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateProfitLoss(result);
      this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"New Driver Allowance Added in Trip");
      dialogRefSub.unsubscribe()

    });
  }

  addOtherExpenses() {
    const dialogRef = this.dialog.open(AddOtherExpensesComponent, {
      width : '1000px',
      maxWidth : '85vw',
      data: {
        type: 'Add',
        tripId: this.tripId,
        isDriverAdded: this.isDriverAdded,
        tripStartDate: this.tripStartDate
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });


    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateProfitLoss(result);
      this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"New Other expense Added in Trip");
      dialogRefSub.unsubscribe()

    });
  }
  openChargeandDedictionClient() {
    const dialogRef = this.dialog.open(ChargeDeductionComponent, {
      width : '1000px',
      minWidth : '75%',
      maxWidth : '85vw',
      data: {
        type: 'Add',
        tripId: this.tripId,
        charge_deduction_type: 'Client',
        tripStartDate: this.tripStartDate,
        is_Driver_Added: this.isDriverAdded,
        is_Transporter: this.isTransporter,
        vehicle_category : this.vehicleCategory,
        customerId : this.customerId

      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });


    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateProfitLoss(result);
      this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"New Charges and Deduction  Added in OWN vehicle Trip");
      dialogRefSub.unsubscribe()

    });
  }
  openChargeandDeductionVehicleProv() {
    const dialogRef = this.dialog.open(ChargeDeductionComponent, {
      width : '1000px',
      maxWidth : '85vw',
      minWidth : '75%',
      data: {
        tripId: this.tripId,
        type: 'Add',
        charge_deduction_type: 'Vendor',
        tripStartDate: this.tripStartDate,
        is_Driver_Added: this.isDriverAdded,
        is_Transporter: this.isTransporter,
        vehicle_category : this.vehicleCategory,
        customerId : this.customerId
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });


    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateProfitLoss(result);
      this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"New Charges and Deduction  Added in Market vehicle Trip");
      dialogRefSub.unsubscribe()

    });
  }
  openLiveTracking() {
    const dialogRef = this.dialog.open(LiveTrackingComponent, {
      minWidth: '50%',
      data: {
        tripId: this.tripId,
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });

    let dialogRefSub = dialogRef.closed.subscribe(result => {
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"Live Tracking Opened in Trip View");
      dialogRefSub.unsubscribe()
    });
  }
}
