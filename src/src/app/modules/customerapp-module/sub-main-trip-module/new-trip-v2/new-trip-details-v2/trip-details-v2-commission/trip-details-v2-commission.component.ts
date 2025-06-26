import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AddDriverAllowanceComponent } from '../add-driver-allowance/add-driver-allowance.component';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-trip-details-v2-commission',
  templateUrl: './trip-details-v2-commission.component.html',
  styleUrls: ['./trip-details-v2-commission.component.scss']
})
export class TripDetailsV2CommissionComponent implements OnInit ,OnChanges{
  @Input() openCommssionPopup;
  @Output() closed = new EventEmitter;
  @Input() tripStartDate = '';
  @Input() tripId = '';
  @Input() staticBackdrop='staticBackdrop'

  show : boolean = false;
  showModal: Boolean = true;
  commissionList=[];
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  currency_type:any;
  constructor(private newTripV2Service : NewTripV2Service,private dialog : Dialog,private _tripDataService : NewTripV2DataService,
    private _analytics: AnalyticsService,private currency :CurrencyService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.openCommssionPopup.isOpen || this.show){
      this.getCommssionTimeSheetsList();
      this.show = this.openCommssionPopup.isOpen;
    }
    
  }
  
  
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();

  }

  getCommssionTimeSheetsList(){
    this.newTripV2Service.getCommissionTimeSheets(this.openCommssionPopup.data).subscribe((res)=>{
      this.commissionList = res['result'];
    })
  }

  close(){
   this.show = false;
    
  }
  
  deleteDocuments(id, deleteFor) {
    this.show = false
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      data: {
        message: 'Are you sure, you want to delete?',
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        this.confirmDelete(id, deleteFor)
      }
      this.show = true;
      dialogRefSub.unsubscribe();
    });

  }

  confirmDelete(deleteId, deleteFor) {
    this.newTripV2Service.deleteTripDetailsItems(deleteId, deleteFor).subscribe(resp => {
      this._tripDataService.upDateProfitLoss(true);
      this._tripDataService.updateTimeSheet(true)
      this.getCommssionTimeSheetsList();
      this.show = true;
      this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"Items Deleted From Profit Loss Section");
    });
  }

  openDriverAllowance(data) {
    this.show = false
    const dialogRef = this.dialog.open(AddDriverAllowanceComponent, {
      maxWidth:"85%",
      width:'1100px',
      data: {
        editdata: data,
        tripId: this.tripId,
        type: "Edit",
        tripStartDate: this.tripStartDate
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        this._tripDataService.updateTimeSheet(result)
        this._tripDataService.upDateProfitLoss(result);
        this.getCommssionTimeSheetsList();
      }
      this.show = true;
      dialogRefSub.unsubscribe();
      this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"New Driver Allowance Updated in Trip");
    });
  }
}