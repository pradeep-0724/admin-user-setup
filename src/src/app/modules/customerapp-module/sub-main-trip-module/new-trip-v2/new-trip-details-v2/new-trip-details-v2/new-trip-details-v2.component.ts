import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { Subject, Subscription, combineLatest, forkJoin } from 'rxjs';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
@Component({
  selector: 'app-new-trip-details-v2',
  templateUrl: './new-trip-details-v2.component.html',
  styleUrls: ['./new-trip-details-v2.component.scss']
})
export class NewTripDetailsV2Component implements OnInit, OnDestroy {

  constructor(private _newTripV2Service: NewTripV2Service, private _route: ActivatedRoute, private _analytics: AnalyticsService, private _tripDataService: NewTripV2DataService, private commonloaderservice: CommonLoaderService) { }
  tripId = '';
  tripStatusAndSummaryData = new Subject();
  headerDetails = new Subject();
  bdpMileStone = new Subject();
  isDriverAdded: boolean = false;
  isTransporter: boolean = true;
  tripStartDate: string = '';
  isTripStarted: boolean = false;
  isTripComplete: boolean = false;
  profitLossData = new Subject();
  tripPartyTransactionData = new Subject();
  $subscriptions: Array<Subscription> = [];
  customFieldUrl = '';
  isDriverApp: boolean = false;
  mapConfig: any;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  vehicleCatagory = -1
  tripTimeSheets = new Subject();
  deliveryNoteData = new Subject();
  routeUpdated = new Subject();
  showTimeline = false;
  approvalTimelineData = [];
  viewUploadedDocs = {
    show: false,
    data: {}
  };
  viewUploadedDocsWithName = {
    show: false,
    data: {}
  };
  openCommssionPopup = {
    isOpen: false,
    data: '',
  }
  isAllDisabled: boolean = false;
  headerData: any;
  isTokenValid = false;
  zonelabel='Jebel Ali Port'
  scopeOfWork: string = '';
  typeOfMovement: string = '';

  ngOnInit(): void {
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Navigated");
    this.commonloaderservice.getHide();
    combineLatest([
      this._route.params,
      this._route.queryParams
    ]).subscribe(([params, queryParams]) => {
      if (queryParams['viewId']) {
        this.tripId = queryParams['viewId']
      } else {
        this.tripId = params['id']
      }
      this.customFieldUrl = TSAPIRoutes.revenue + TSAPIRoutes.new_trip + "customfield/" + params['id'] + "/"
      this.getBdpMileStone();
      this.getAllInitialDetails()
    });


    this.$subscriptions.push(this._tripDataService.newLatestDestinatins.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getAllDetails();

      }
    }));

    this.$subscriptions.push(this._tripDataService.newProfitLoss.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getAllDetails();
      }
    }));

    this.$subscriptions.push(this._tripDataService.newTimeSheet.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getTimeSheetsDetails();
      }
    }));

    this.$subscriptions.push(this._tripDataService.newDeliveryNote.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getDeliveryNoteDetails();
      }
    }));

    this.$subscriptions.push(this._tripDataService.newTripProfile.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getHeaderDetails();
        this.getAllDetails();

      }
    }));

    this._tripDataService.newFreight.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getAllDetails();
      };
    });

    this._tripDataService.newBdpUpdate.subscribe(isTrue => {
      if (isTrue == 'true' || isTrue == true) {
        this.getBdpMileStone();
      };
    });
  }

  ngOnDestroy(): void {
    if (this.$subscriptions.length) {
      this.$subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }
    this.commonloaderservice.getShow();
  }

  getTripStatusAndSummary() {
    this.$subscriptions.push(this._newTripV2Service.getTripStatusAndSummary(this.tripId).subscribe(resp => {
      if (this.vehicleCatagory == 0 || this.vehicleCatagory == 3 || this.vehicleCatagory == 4 || this.vehicleCatagory == 10) {
        this.tripStartDate = resp['result']['paths'][0].time;
        this.isTripStarted = resp['result'].office_status > 0 ? true : false;
        this.isTripComplete = resp['result'].paths.length == resp['result'].office_status;
      } else {
        this.tripStartDate = resp['result']['scheduled_start_date']
      }
      this._tripDataService.inlineTaskAdded = false;
      this.isDriverApp = resp['result'].is_driver_trip;
      this.mapConfig = resp['result'].map_config
      setTimeout(() => {
        this.tripStatusAndSummaryData.next(resp['result'])
      }, 500);
    }))
  }

  getHeaderDetails() {
    this.$subscriptions.push(this._newTripV2Service.getTripHeaderDetails(this.tripId).subscribe(resp => {
      this.isDriverAdded = true;
      this.isTransporter = resp['result']['is_transporter']
      this.headerDetails.next(resp['result']);
      let result = resp['result'];
      // if(result.status>=2){
      //   this.isAllDisabled = false;
      // }
      // if(result.approval_status.status_screen_to_show === 'void'  || result.approval_status.status_screen_to_show === 'approval_rejected'){
      //   this.isAllDisabled = true;
      // }
      // if((result.approval_status.status_screen_to_show === 'approver_action' && result.status==0)|| result.approval_status.status_screen_to_show === 'approver_action' && result.status==1){
      //   this.isAllDisabled = true;
      // }
      if (result.approval_status.status_screen_to_show === 'void' || result.approval_status.status_screen_to_show === 'approver_action' || result.approval_status.status_screen_to_show === 'approval_rejected') {
        this.isAllDisabled = true;
      } else {
        this.isAllDisabled = false;
      }
    }))
  }

  getProfitLossData() {
    this.$subscriptions.push(this._newTripV2Service.getTripProfitandLossDetails(this.tripId).subscribe((data) => {
      this.profitLossData.next(data['result'])
    }))
  }

  getPartyTransactions() {
    this.$subscriptions.push(this._newTripV2Service.getPartyTransactions(this.tripId).subscribe((data) => {
      this.tripPartyTransactionData.next(data['result'])
    }))
  }

  getBdpMileStone() {
    this.$subscriptions.push(this._newTripV2Service.getBdpMilestone(this.tripId).subscribe((data) => {
      this.bdpMileStone.next(data['result'])
    }));
  }

  getAllDetails() {
    this.routeUpdated.next(true)
    if (this._tripDataService.inlineTaskAdded) {
      this.getTripStatusAndSummary();
    } else {
      this.getTripStatusAndSummary();
      this.getProfitLossData();
      this.getPartyTransactions();
    }

  }

  getTimeSheetsDetails() {
    this.$subscriptions.push(this._newTripV2Service.getTimeSheets(this.tripId).subscribe((data) => {
      this.tripTimeSheets.next(data['result'])
    }));
  }

  getDeliveryNoteDetails() {
    this.$subscriptions.push(this._newTripV2Service.getDeliveryNoteDetails(this.tripId).subscribe((data) => {
      this.deliveryNoteData.next(data['result'])
    }));
  }

  getAllInitialDetails() {
    const tripsummary = this._newTripV2Service.getTripStatusAndSummary(this.tripId);
    const tripHeaser = this._newTripV2Service.getTripHeaderDetails(this.tripId);
    const profitLoss = this._newTripV2Service.getTripProfitandLossDetails(this.tripId);
    const bdpMileStone = this._newTripV2Service.getBdpMilestone(this.tripId);
    const tripPartyTransactionData = this._newTripV2Service.getPartyTransactions(this.tripId)
    forkJoin([tripsummary, tripHeaser, profitLoss, bdpMileStone, tripPartyTransactionData]).subscribe(resp => {
      this.vehicleCatagory = resp[0]['result']['vehicle_category']
      if (this.vehicleCatagory == 2 || this.vehicleCatagory == 1) {
        this.getTimeSheetsDetails();
        this.getDeliveryNoteDetails();
      }
      setTimeout(() => {

        if (resp[0]) {
           this.mapConfig = resp[0]['result'].map_config
          if (this.vehicleCatagory == 0 || this.vehicleCatagory == 3 || this.vehicleCatagory == 4 || this.vehicleCatagory == 10) {
            this.tripStartDate = resp[0]['result'].paths[0].time;
            this.isTripStarted = resp[0]['result'].office_status > 0 ? true : false;
            this.isTripComplete = resp[0]['result'].paths.length == resp[0]['result'].office_status;
          } else {
            this.tripStartDate = resp[0]['result']['scheduled_start_date']
          }
          this._tripDataService.inlineTaskAdded = false;
          this.isDriverApp = resp[0]['result'].is_driver_trip;
        }
        if (resp[1]) {
          this.isDriverAdded = true;
          // if(!resp[1]['result']['is_transporter'] ){
          //   if(resp[1]['result']['driver'].length){
          //     this.isDriverAdded = true;
          //   }
          //   else{
          //     this.isDriverAdded = false;
          //   }
          // }

          this.isTransporter = resp[1]['result']['is_transporter']
        }
        this.checkIfTokenValid(resp[1]['result'], resp[0]['result'])
        this.tripStatusAndSummaryData.next(resp[0]['result'])
        this.headerDetails.next(resp[1]['result']);
        this.profitLossData.next(resp[2]['result'])
        this.bdpMileStone.next(resp[3]['result'])
        this.tripPartyTransactionData.next(resp[4]['result']);
        this.headerData = resp[1]['result'];
        if (resp[1]['result'].approval_status.status_screen_to_show === 'void' || resp[1]['result'].approval_status.status_screen_to_show === 'approver_action' || resp[1]['result'].approval_status.status_screen_to_show === 'approval_rejected') {
          this.isAllDisabled = true;
        } else {
          this.isAllDisabled = false;
        }
      }, 500);

    })

  }

  approvalTime(e) {
    this.showTimeline = e.showTimeline
    this.approvalTimelineData = e.approvalTimelineData
  }

  onTimelineClose(e) {
    this.approvalTimelineData = [];
    this.showTimeline = false;
  }

  showDocuments(e) {
    this.viewUploadedDocs.data['files'] = e.data;
    this.viewUploadedDocs.show = e.show
  }
  showDocumentsWithName(e) {
    this.viewUploadedDocsWithName.data['files'] = e.data;
    this.viewUploadedDocsWithName.show = e.show
  }


  downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }



  displayCommissionPopup(e) {
    this.openCommssionPopup = {
      isOpen: e.isOpen,
      data: e.data,
    }
  }

  checkIfTokenValid(headerData, pathData) {
    this.typeOfMovement = headerData['type_of_movement']
    this.scopeOfWork  = headerData['movement_sow']
    if (headerData['vehicle_category'] != 4) return
    this.isTokenValid = false
    if (this.typeOfMovement == 'Export' || this.typeOfMovement == 'Import') {
    const zoneLabelsForType1 = pathData['paths']
      .filter(item => item.destination_type === 1 && item.zone && item.zone.label)
      .map(item => item.zone.label);
    const zoneLabelsForType2 = pathData['paths']
      .filter(item => item.destination_type === 2 && item.zone && item.zone.label)
      .map(item => item.zone.label);
      if (this.scopeOfWork == 'Pullout') {
        if(zoneLabelsForType1.includes(this.zonelabel)){
          this.isTokenValid = true
        }
      }
      if (this.scopeOfWork == 'Deposit') {
        if(zoneLabelsForType2.includes(this.zonelabel)){
          this.isTokenValid = true
        }
      }
      if (this.scopeOfWork == 'Live Loading') {
        if(zoneLabelsForType1.includes(this.zonelabel) || zoneLabelsForType2.includes(this.zonelabel)){
          this.isTokenValid = true
        }
      }

    }

  }




}
