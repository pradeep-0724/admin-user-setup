import { Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { OverallTripReportService } from '../overall-trip-report.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripV2Constants } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { LiveTrackingComponent } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/live-tracking/live-tracking.component';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Dialog } from '@angular/cdk/dialog';
import { AnalyticsService } from 'src/app/core/services/analytics.service';

@Component({
  selector: 'app-overall-trip-report-overview',
  templateUrl: './overall-trip-report-overview.component.html',
  styleUrls: ['./overall-trip-report-overview.component.scss']
})
export class OverallTripReportOverviewComponent implements OnInit {
  queryParams = {
    start_date: '',
    end_date: '',
    filters: '' 
  }

  queryParamsTripList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  tripList = [];
  tripHeader = [];
  tripIds = [];
  scheduledVehicleIDs = [];
  scheduledIsMarket = [];
  
  isLoading = false;
  getPrefixUrl = getPrefix();
  tripHistoryHead: any
  currency_type: any;
  queryParamsOngoingList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  };
  ongoingIsMarket = [];
  ongoingVehicleIDs = [];
  ScheduledCustomerList=[];
  OngoingCustomerList=[];
  BillingPendingCustomerList=[];
  ongoingTripList = [];
  ongoingTripHeader = [];
  ongoingTripIds = [];
  ongoingisLoading = false;

  queryParamsBillingList = {
    start_date: '',
    end_date: '',
    filters: '',
    next_cursor: '',
    search: ''
  }
  billingTripList = [];
  billingTripHeader = [];
  billingTripIds = [];
  billingIsmarket = [];
  billingVehicleIds = [];
  billingisLoading = false;
  constantsTripV2 = new NewTripV2Constants();
  GrayMapIconTooltip: ToolTipInfo;
  RedMapIconTooltip:ToolTipInfo;
  googleMaps = `../../../../../../../assets/img/google-maps.png`;
  mapRedIcon=`<img  class="cursor-pointer trip-list-map-icon" src="../../../../../../../assets/img/icons/google-maps-red.png" />`
  mapGrayIcon=`<img  class="cursor-pointer trip-list-map-icon" src="../../../../../../../assets/img/icons/google-maps-gray.png" />`;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  tripListData=[]
  prefixUrl =getPrefix()
  constructor(private _overallTripReportService: OverallTripReportService, private currency: CurrencyService, public dialog: Dialog,private _analytics: AnalyticsService,) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.getTripHead()
    this.GrayMapIconTooltip = {
      content: this.constantsTripV2.toolTipMessages.APP_NOT_ACTIVE.CONTENT
    }
    this.RedMapIconTooltip = {
      content: this.constantsTripV2.toolTipMessages.RED_MAP_ICON_TEXT.CONTENT
    }
  }
  openLiveTracking(id,openDialog:boolean) {
    if (openDialog){
      const dialogRef = this.dialog.open(LiveTrackingComponent, {
        minWidth: '50%',
        data: {
          tripId: id,
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
  
      let dialogRefSub = dialogRef.closed.subscribe(result => {
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.NEWTRIP,this.screenType.LIST,"Trip Live Tracking Opened");
        dialogRefSub.unsubscribe()
      });
    }
    
  }
  
  filterDataScheduled(e) {    
    this.queryParamsTripList.filters = JSON.stringify(e);
    this.queryParamsTripList.next_cursor = '';
    this.getScheduledTripList();
  }

  dateRangeScheduledTrips(e) {    
    this.queryParamsTripList.next_cursor = '';
    this.queryParamsTripList.start_date = changeDateToServerFormat(e.startDate);
    this.queryParamsTripList.end_date = changeDateToServerFormat(e.endDate);
    this.getScheduledTripList();
  }


  getTripHead() {
    this._overallTripReportService.getOverallTripReportOverviewHead(this.queryParams).subscribe(resp => {      
      this.tripHistoryHead = resp['result']
      
    })
  }

  searchedDataScheduledList(e) {
    this.queryParamsTripList.next_cursor = '';
    this.queryParamsTripList.search = e;
    this.getScheduledTripList();
  }
  settingAppliedTrip(e) {
    if (e) {
      this.queryParamsTripList.next_cursor = '';
      this.getScheduledTripList();
    }

  }

  getScheduledTripList() {
    this._overallTripReportService.getOverallTripReportOverviewScheduledTripList( this.queryParamsTripList).subscribe((data) => {            
      this.tripList = data['result'].trips;
      this.tripHeader = data['result'].header;
      this.tripIds = data['result'].trip_ids;
      this.scheduledIsMarket = data['result'].is_market;
      this.scheduledVehicleIDs =  data['result'].vehicle_ids;
      this.ScheduledCustomerList=data['result']?.customer_ids;
      this.queryParamsTripList.next_cursor = data['result'].next_cursor;

    });
  }

  onScroll(event) {
    const container = document.querySelector('.trip_details_scroll_trips');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.queryParamsTripList.next_cursor?.length > 0) {
      this.onScrollGetTripList(this.queryParamsTripList);
    }
  }

  onScrollGetTripList(params) {
    this.isLoading = true;
    this._overallTripReportService.getOverallTripReportOverviewScheduledTripList( params).subscribe(data => {
      this.tripHeader=data['result'].header
      this.tripIds.push(...data['result'].trip_ids);
      this.scheduledIsMarket.push(...data['result'].is_market);
      this.scheduledVehicleIDs.push(...data['result'].vehicle_ids);
      params.next_cursor = data['result'].next_cursor;
      this.tripList.push(...data['result'].trips);
      this.isLoading = false;
    })
  }
/////////ongoing trips///////////////
filterDataOngoing(e) {    
  this.queryParamsOngoingList.filters = JSON.stringify(e);
  this.queryParamsOngoingList.next_cursor = '';
  this.getOngoingList();
}

dateRangeOngoingTrips(e) {    
  this.queryParamsOngoingList.next_cursor = '';
  this.queryParamsOngoingList.start_date = changeDateToServerFormat(e.startDate);
  this.queryParamsOngoingList.end_date = changeDateToServerFormat(e.endDate);
  this.getOngoingList();
}

searchedDataOngoingList(e) {
  this.queryParamsOngoingList.next_cursor = '';
  this.queryParamsOngoingList.search = e;
  this.getOngoingList();
}
settingAppliedOngoing(e) {
  if (e) {
    this.queryParamsOngoingList.next_cursor = '';
    this.getOngoingList();
  }

}

getOngoingList() {
  this._overallTripReportService.getOverallTripReportOverviewOngoingTripList( this.queryParamsOngoingList).subscribe((data) => {          
    this.ongoingTripList = data['result'].trips;
    this.ongoingTripHeader = data['result'].header;
    this.ongoingTripIds = data['result'].trip_ids;
    this.ongoingIsMarket= data['result'].is_market;
    this.ongoingVehicleIDs= data['result'].vehicle_ids;
    this.OngoingCustomerList=data['result'].customer_ids;
    this.queryParamsOngoingList.next_cursor = data['result'].next_cursor;
  });
}

onScrollOngoing(event) {
  const container = document.querySelector('.trip_details_ongoing_scroll');
  if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.ongoingisLoading && this.queryParamsOngoingList.next_cursor?.length > 0) {
    this.onScrollGetOngoingList(this.queryParamsOngoingList);
  }
}

onScrollGetOngoingList(params) {
  this.ongoingisLoading = true;
  this._overallTripReportService.getOverallTripReportOverviewOngoingTripList( params).subscribe(data => {
    this.ongoingTripList.push(...data['result'].trips);
    this.ongoingTripHeader=data['result'].header
    this.ongoingTripIds.push(...data['result'].trip_ids);
    this.ongoingIsMarket.push(...data['result'].is_market);
    this.ongoingVehicleIDs.push(...data['result'].vehicle_ids)
    params.next_cursor = data['result'].next_cursor;
    this.ongoingisLoading = false;
  })
}
// billing //////////////////
filterDataBilling(e) {    
  this.queryParamsBillingList.filters = JSON.stringify(e);
  this.queryParamsBillingList.next_cursor = '';
  this.getBillingList();
}

dateRangeBillingTrips(e) {    
  this.queryParamsBillingList.next_cursor = '';
  this.queryParamsBillingList.start_date = changeDateToServerFormat(e.startDate);
  this.queryParamsBillingList.end_date = changeDateToServerFormat(e.endDate);
  this.getBillingList();
}

searchedDataBillingList(e) {
  this.queryParamsBillingList.next_cursor = '';
  this.queryParamsBillingList.search = e;
  this.getBillingList();
}
settingAppliedBilling(e) {
  if (e) {
    this.queryParamsBillingList.next_cursor = '';
    this.getBillingList();
  }

}

getBillingList() {
  this._overallTripReportService.getOverallTripReportOverviewBillingTripList( this.queryParamsBillingList).subscribe((data) => {          
    this.billingTripList = data['result'].trips;
    this.billingTripHeader = data['result'].header;
    this.billingTripIds = data['result'].trip_ids;
    this.billingIsmarket = data['result'].is_market;
    this.billingVehicleIds = data['result'].vehicle_ids
    this.BillingPendingCustomerList=data['result'].customer_ids;
    this.queryParamsBillingList.next_cursor = data['result'].next_cursor;
  });
}

onScrollBilling(event) {
  const container = document.querySelector('.trip_details_billing_scroll');  
  if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.billingisLoading && this.queryParamsBillingList.next_cursor?.length > 0) {
    this.onScrollGetBillingList(this.queryParamsBillingList);
  }
}

onScrollGetBillingList(params) {
  this.billingisLoading = true;
  this._overallTripReportService.getOverallTripReportOverviewBillingTripList( params).subscribe(data => {
    
    this.billingTripHeader=data['result'].header
    this.billingTripIds.push(...data['result'].trip_ids);
    this.billingIsmarket.push(...data['result'].is_market);
    this.billingVehicleIds.push(...data['result'].vehicle_ids)
    params.next_cursor = data['result'].next_cursor;
    this.billingisLoading = false;
    this.billingTripList.push(...data['result'].trips);
  })
}
fixedTo3Decimal(value){
  return Number(value).toFixed(3)
 }
}


