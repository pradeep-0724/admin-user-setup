import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {Dialog} from '@angular/cdk/dialog';
import { TripDetailsUploadTimeSheetPopupComponent } from '../trip-details-upload-time-sheet-popup/trip-details-upload-time-sheet-popup.component';
import { TripDetailsMakeDeliveryNotePopupComponent } from '../trip-details-make-delivery-note-popup/trip-details-make-delivery-note-popup.component';
import { Observable } from 'rxjs';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TimeSheetApproveRejectPopupComponent } from '../time-sheet-approve-reject-popup/time-sheet-approve-reject-popup.component';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Router } from '@angular/router';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';


@Component({
  selector: 'app-trip-details-time-sheet-section',
  templateUrl: './trip-details-time-sheet-section.component.html',
  styleUrls: ['./trip-details-time-sheet-section.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class TripDetailsTimeSheetSectionComponent implements OnInit ,OnDestroy{
  @Input() tripTimeSheets:Observable<any> ;
  @Input() headerDetailsDataSub: Observable<any>
  @Input() tripPartyTransactionData: Observable<any>;
  @Input() tripStartDate;
  @Input() tripId=''
  @Output() approvalTime = new EventEmitter();
  @Output() showDocuments = new EventEmitter();
  @Input() isAllDisabled : boolean = false;
  showInvoiceNoColumn=false
  currency_type:any;
  openCommssionPopup = {
    isOpen : false,
    data : {},
  }
  headerDetailsData:any;
  invoiceUrl = '/income/invoice/add';
  vehiclePaymentUrl = '/trip/vehicle-payment/add'
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  prefixUrl=getPrefix();
  trip=Permission.trip__new_trip.toString().split(',')
  @Output() displayCommissionPopup = new EventEmitter()
  partyTransaction;
  isTransporter :  boolean = false;
  preFixUrl = getPrefix();
  showOptions='';
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  billingBasdedOn = ''
  constructor(public dialog: Dialog,private _tripDataService: NewTripV2DataService, private _newTripV2Service:NewTripV2Service,
    private currency: CurrencyService,private _analytics: AnalyticsService, private router: Router ) { }

  ngOnDestroy(): void {
    this.openCommssionPopup.isOpen = false;
  }

  ngOnInit(): void {    
    this.tripTimeSheets.subscribe(res=>{
      this.showInvoiceNoColumn=res.timesheets.some(e=>isValidValue(e?.invoice?.no));

    }) 
    this.currency_type = this.currency.getCurrency();
    this.headerDetailsDataSub.subscribe(resp => {
      this.isTransporter = resp['is_transporter'];
      this.headerDetailsData = resp;
    });
    this.tripPartyTransactionData.subscribe(resp=>{
      this.partyTransaction =resp
    })
    
   
  }
  openUploadTimesheet(){
    const dialogRef = this.dialog.open(TripDetailsUploadTimeSheetPopupComponent, {
      width: '90%',
      maxWidth:'700px',
      data: {
        tripId:this.tripId,
        billingBasdedOn:this.billingBasdedOn       
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.updateTimeSheet(result);
      this._tripDataService.updateApprovedTimeSheet(result);
      this._tripDataService.upDateProfitLoss(result);
      dialogRefSub.unsubscribe();
    });
  }
  makeInvoice(){
    const dialogRef = this.dialog.open(TripDetailsMakeDeliveryNotePopupComponent, {
      width: '95%',
      maxWidth:'750px',
      data: {
        tripId:this.tripId,
        id:null,
        isVehiclePayment : false,
        billingBasdedOn:this.billingBasdedOn
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result:any) => {
      if(result !='close'){
        this._tripDataService.makeInvoiceData=result;
        this.createInvoice();
      }
      dialogRefSub.unsubscribe();      
    });
  }

  makeVehiclePayment(){
    const dialogRef = this.dialog.open(TripDetailsMakeDeliveryNotePopupComponent, {
      width: '95%',
      maxWidth:'750px',
      data: {
        tripId:this.tripId,
        id:null,
        isVehiclePayment : true,
        billingBasdedOn:this.billingBasdedOn
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result:any) => {
      if(result !='close'){
        this._tripDataService.makeInvoiceData=result;
        this.createVehiclePayment();
      }
      dialogRefSub.unsubscribe();      
    });
  }

  viewUploadedDocument(doc){
    this.showDocuments.emit({
       data:doc,
       show: true,
    })
  }

  getBillingUnitName(billingUnit){
    this.billingBasdedOn=billingUnit
    if(billingUnit == null || billingUnit == undefined){
      return ''
    }
    return this.rateCardBillingList.find(e=>e.value == billingUnit).label
  }

  createVehiclePayment() {
    let queryParams = {
      vendorId: this.headerDetailsData.vehicle_provider.id,
      tripId: this.tripId,
      startDate: this.tripStartDate,
      vendorName: this.headerDetailsData.vehicle_provider.name,
      categoary:this.headerDetailsData.vehicle_category
    };
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Make Vehicle Payment Button Clicked");
    this.router.navigate([getPrefix() + this.vehiclePaymentUrl], { queryParams });
  }

  createInvoice() {
    let queryParams = {
      customerId: this.headerDetailsData.customer.id,
      tripId: this.tripId,
      startDate: this.tripStartDate,
      customerName: this.headerDetailsData.customer.name,
      categoary:this.headerDetailsData.vehicle_category
    };
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Make Invoice Button Clicked");
    this.router.navigate([getPrefix() + this.invoiceUrl], { queryParams });
  }


  onApprovalAction(timeSheetId: string, isApproved: boolean){
    {
      const dialogRef = this.dialog.open(TimeSheetApproveRejectPopupComponent, {
        data: {
          heading: isApproved ? "Approved" : "Rejected",
          isApproved: isApproved,
          timeSheetId: timeSheetId,
        },
        width: '500px',
        maxWidth: '90%',
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
        this._tripDataService.updateTimeSheet(item)
        dialogRefSub.unsubscribe();
      });
    }
  }

  openApprovalTimeline(timeline){
    this.approvalTime.emit({
      approvalTimelineData : timeline,
      showTimeline:true
    })
  }

  optionsList(list_index) {
    this.showOptions = list_index
  }


  outSideClick(env) {
    try {
      if (env.target.className.indexOf("more-icon") == -1) {
        this.showOptions = "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  editTimesheet(id){
    const dialogRef = this.dialog.open(TripDetailsUploadTimeSheetPopupComponent, {
      width: '90%',
      maxWidth:'700px',
      data: {
        tripId:this.tripId,
        id:id,
        billingBasdedOn:this.billingBasdedOn
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.updateTimeSheet(result);
      this._tripDataService.upDateProfitLoss(result);
      dialogRefSub.unsubscribe();
    });
  }

  deleteTimesheet(id){
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      width: '90%',
      maxWidth:'300px',
      data: {
        message:'Are you sure, you want to delete?'
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        this._newTripV2Service.deteleTime(id).subscribe(resp=>{
          this._tripDataService.updateTimeSheet(result);
          this._tripDataService.upDateProfitLoss(result);
         });
      }else{
        this._tripDataService.updateTimeSheet(result)
      }
      dialogRefSub.unsubscribe();
    });
  }

  openCommssion(data,amount){ 
    if(Number(amount)>0){
      this.openCommssionPopup ={
        isOpen : true,
        data : data,
      };
      this.displayCommissionPopup.emit(this.openCommssionPopup)
    }   
  
  }

  convertToCommaSeparated(value : number){
    return formatNumber(value, 'american', 0);
  }
}






 

