import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { EditRouteComponent } from '../route-edit-module/edit-route/edit-route.component';
import { ChangeDestinationStatusComponent } from '../change-destination-status/change-destination-status.component';
import { FinishTripComponent } from '../finish-trip/finish-trip.component';
import { Observable, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { BdpStatusChangeComponent } from '../bdp-status-change/bdp-status-change.component';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

@Component({
  selector: 'app-trip-details-status-section',
  templateUrl: './trip-details-status-section.component.html',
  styleUrls: ['./trip-details-status-section.component.scss']
})
export class TripDetailsStatusSectionComponent implements OnInit,OnDestroy {
  @Input() tripStatusAndSummaryData: Observable<any>; 
  @Input() bdpMileStone: Observable<any>;
  @Input() headerDetailsDataSub: Observable<any>;
  constantsTripV2 = new NewTripV2Constants()
  driver_Status: ToolTipInfo;
  office_Status: ToolTipInfo;
  bdp_Status: ToolTipInfo;
  statusArray2 = []
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    items: 1,
    center: false,
    autoWidth: true,
    navSpeed: 700,
    navText: ['	&#129092;', '&#129094;'],
    nav: true
  }
  tripDetails: any;
  tripId = '';
  isTripComplete: boolean = false;
  reachButtonName: string = '';
  driverStatus = []
  bdpStatus = [];
  locationReachFullName = ''
  bdpDetails: any
  bdpButtonName = '';
  headerData: any
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  $subscriptions: Array<Subscription> = [];
  isAllDisabled : boolean = true;

  constructor(private _analytics: AnalyticsService,public dialog: Dialog, private _route: ActivatedRoute, private _tripDataService: NewTripV2DataService,) { }

  ngOnDestroy(): void {
    if (this.$subscriptions.length) {
      this.$subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }
  ngOnInit(): void {
    this._route.params.subscribe(parms => {
      if (parms['id']) {
        this.tripId = parms['id']
      }
    });
    this.$subscriptions.push(this.bdpMileStone.subscribe(data => {
      this.bdpDetails = data;
      this.bdpStatus = cloneDeep(this.constantsTripV2.bdpStatusList);
      this.makeBdpStatus();
    }));

    this.$subscriptions.push(this.headerDetailsDataSub.subscribe(resp => {
      this.headerData = resp;
      this.isAllDisabled = resp.approval_status.status_screen_to_show === 'void' || resp.approval_status.status_screen_to_show === 'approver_action' || resp.approval_status.status_screen_to_show === 'approval_rejected';
    }));

    this.$subscriptions.push(this.tripStatusAndSummaryData.subscribe(data => {
      if (data) {        
        this.tripDetails = data        
        this.isTripComplete = this.tripDetails.paths.length == this.tripDetails.office_status;
        this._tripDataService.setLocation(this.tripDetails.paths[0].location)
        this.driverStatus = cloneDeep(this.tripDetails.paths);
        this.statusArray2 = cloneDeep(this.tripDetails.paths);
        this.driverStatus.unshift({ scheduled: this.dateChange(this.tripDetails.scheduled_at) });        
        this.statusArray2.unshift({ scheduled: this.dateChange(this.tripDetails.scheduled_at) });        
        this.makeOfficeStatus();
        this.makeDriverStatus();
        if (!this.isTripComplete) {
          this.locationReachFullName = 'Reach to ' + this.statusArray2[this.tripDetails.office_status + 1].area['label'];
          this.reachButtonName = 'Reach to ' + cloneDeep(this.statusArray2[this.tripDetails.office_status + 1].area['label'])
          if (this.reachButtonName.length > 10) {
            this.reachButtonName = this.reachButtonName.substring(0, 20);
          } else {
            this.reachButtonName = this.reachButtonName
          }
        } else {
          this.reachButtonName = 'Completed'
        }
      }
    }))
    this.driver_Status = {
      content: this.constantsTripV2.toolTipMessages.DRIVER_STATUS.CONTENT
    }
    this.office_Status = {
      content: this.constantsTripV2.toolTipMessages.OFFICE_STATUS.CONTENT
    }
    this.bdp_Status = {
      content: this.constantsTripV2.toolTipMessages.BDP_STATUS.CONTENT
    }
  }

  locationReached() {
    if (this.tripDetails.paths.length == this.tripDetails.office_status + 1) {
      const dialogRef = this.dialog.open(FinishTripComponent, {
        minWidth: '85%',
      maxWidth: '85%',
        data: {
          tripId: this.tripId,
          tripDetails: cloneDeep(this.tripDetails),
          driverList: cloneDeep(this.headerData['driver'])
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
        this._tripDataService.upDateTripProfile(result)
        this._tripDataService.destinationUpdates(result);
        this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"Trip Finished");
        dialogRefSub.unsubscribe()
      });
    } else {
      const dialogRef = this.dialog.open(ChangeDestinationStatusComponent, {
        minWidth: '85%',
      maxWidth: '85%',
        data: {
          tripId: this.tripId,
          tripDetails: cloneDeep(this.tripDetails),
          driverList:cloneDeep(this.headerData['driver'])
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
        this._tripDataService.upDateTripProfile(result)
        this._tripDataService.destinationUpdates(result);
        this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"Location Reached Button Clicked");
        dialogRefSub.unsubscribe()
      });
    }

  }

  editRoute() {
    const dialogRef = this.dialog.open(EditRouteComponent, {
      minWidth: '85%',
      maxWidth: '85%',
      data: cloneDeep(this.tripDetails),
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });

    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.destinationUpdates(result);
      this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"Trip Route Updated");
      dialogRefSub.unsubscribe()
    });
  }

  finishRoute() {
    const dialogRef = this.dialog.open(FinishTripComponent, {
      minWidth: '80%',
      maxWidth:'80%',
      maxHeight: '600px',
      data: {
        tripId: this.tripId,
        tripDetails: cloneDeep(this.tripDetails),
        driverList: cloneDeep(this.headerData['driver'])
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.destinationUpdates(result);
      this._tripDataService.upDateTripProfile(result)
      this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"Trip Finished");
      dialogRefSub.unsubscribe()
    });
  }

  dateChange(date) {
    if (date) {
      return moment(date).tz(localStorage.getItem('timezone')).format('llll')
    }
    return '-'
  }

  makeOfficeStatus() {
    this.statusArray2.forEach((item, index) => {
      if (index <= this.tripDetails.office_status) {
        item['office_status'] = 100
      }
    })
  }

  makeDriverStatus() {
    const in_percent = this.tripDetails.driver_status.in_percent
    const driverStatus = this.tripDetails.driver_status.status
    this.driverStatus.forEach((item, index) => {
      item['isCurrentRouteIdle'] = false
      if (index < driverStatus) {
        item['width'] = 100
      }
      if (index == driverStatus) {
        item['width'] = in_percent
        if (in_percent == 0) {
          item['isCurrentRouteIdle'] = true
        }
      }
      if (index > driverStatus) {
        item['width'] = 0
      }
      if (this.tripDetails.paths.length == driverStatus) {
        item['width'] = 100
        item['isCurrentRouteIdle'] = false
      }
    })
  }

  makeBdpStatus() {
    if (this.bdpDetails.milestone_status < 4) {
      this.bdpButtonName = this.bdpStatus[this.bdpDetails.milestone_status + 1].name
    } else {
      this.bdpButtonName = 'Completed'
    }
    this.bdpStatus.forEach((item, index) => {
      if (index <= this.bdpDetails.milestone_status) {
        item['office_status'] = 100;
        if (index != 0)
          item['date'] = this.dateChange(this.bdpDetails.milestone_dates[index - 1]);
      }
    })
  }


  bdpStatusChange() {
    const dialogRef = this.dialog.open(BdpStatusChangeComponent, {
      minWidth: '60%',
      maxHeight: '600px',
      data: {
        tripId: this.tripId,
        bdpDetails: this.bdpDetails
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateBDP(result);
      dialogRefSub.unsubscribe()
    });
  }
  isTripTaskUpdated(){
    if(this._tripDataService.inlineTaskAdded)this._tripDataService.destinationUpdates(true);
  }

}
