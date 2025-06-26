import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { AddDriverAllowanceComponent } from '../add-driver-allowance/add-driver-allowance.component';
import { AddFuelComponent } from '../add-fuel/add-fuel.component';
import { AddOtherExpensesComponent } from '../add-other-expenses/add-other-expenses.component';
import { ChargeDeductionComponent } from '../charge-deduction/charge-deduction.component';
import { EditBillingV2Component } from '../edit-billing-module-v2/edit-billing-v2/edit-billing-v2.component';
import { Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TripDetailsMakeDeliveryNotePopupComponent } from '../trip-details-make-delivery-note-popup/trip-details-make-delivery-note-popup.component';
import { cloneDeep } from 'lodash';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-trip-details-transaction-section',
  templateUrl: './trip-details-transaction-section.component.html',
  styleUrls: ['./trip-details-transaction-section.component.scss']
})
export class TripDetailsTransactionSectionComponent implements OnInit,OnDestroy {
  @Input() tripPartyTransactionData: Observable<any>;
  @Input() tripId = ''
  @Input() tripStartDate: ''
  @Input() isDriverAdded: boolean = false;
  @Input() headerDetailsDataSub: Observable<any>
  @Input() tripStatusAndSummaryData: Observable<any>;
  @Input() tripTimeSheets:Observable<any> ;
  @Output() showDocuments=new EventEmitter();

  pulloutDepositTripId = [];
  invoiceUrl = '/income/invoice/add';
  performaInvoiceUrl = '/income/performa-invoice/add'
  vehicleProvider = '/trip/vehicle-payment/add'
  headerDetailsData: any
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  prefixUrl=getPrefix();
  trip=Permission.trip__new_trip.toString().split(',');
  totalMaterialQuanity:number=0
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList;
  billingUnitType ='';
  vehicleCategory ;
  constructor(private _analytics: AnalyticsService, private currency: CurrencyService, public dialog: Dialog, private _tripDataService: NewTripV2DataService, private _newTripV2Service: NewTripV2Service, private router: Router) { }
  currency_type: any

  ngOnInit(): void {
    this.tripTimeSheets.subscribe((res) => {
      this.billingUnitType = this.getBillingUnitName(res?.billing_unit);
    })
    this.currency_type = this.currency.getCurrency();
    this.headerDetailsDataSub.subscribe(resp => {
      this.headerDetailsData = resp;
    })
    this.tripStatusAndSummaryData.subscribe((res)=>{
      this.totalMaterialQuanity=0
      if(res?.material_info?.length>0){
        res?.material_info.forEach(element => {
          this.totalMaterialQuanity =this.totalMaterialQuanity+ Number(element.total_quantity);
        });
      }
      
    })
    this.tripPartyTransactionData.subscribe((data)=>{
      this.pulloutDepositTripId = data['pd_trip_id'];
    })

    

  }
  ngOnDestroy(): void {
    
  }
  viewUploadedDocument(docs,doc_no){
    let docsWithName=docs.map(e=>{
      return {...e,note:e.note+'-'+doc_no}
    })
    this.showDocuments.emit({
      data:cloneDeep(docsWithName),
      show:true
    })
  }

  openEditBillingPopup(data, type,categoary) {  
    if(categoary==4){
      this.router.navigate([this.prefixUrl+'/trip/new-trip/edit/',this.tripId])
      return
    }  
    const dialogRef = this.dialog.open(EditBillingV2Component, {
      minWidth: '75%',
      data: {
        editData: data,
        tripId: this.tripId,
        freight_type: type,
        tripDetails:this.headerDetailsData,
        vehicleCategory : categoary,
        totalMaterialQuanity:this.totalMaterialQuanity
      },
      closeOnNavigation: true, 
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateFreight(result);
      this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Trip Billing Updated");
      dialogRefSub.unsubscribe();
    });

  }
  openChargeDeductionClient(data, type) {
    const dialogRef = this.dialog.open(ChargeDeductionComponent, {
      width : '1050px',
      maxWidth : '85vw',
      data: {
        type: 'Edit',
        tripId: this.tripId,
        charge_deduction_type: 'Client',
        tripStartDate: this.tripStartDate,
        bill_type: type,
        vehicle_category  : this.headerDetailsData.vehicle_category,
        customerId  : this.headerDetailsData.customer?.id,
        editdata: data
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe();
      this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "New Charges and Deduction  Updated in OWN vehicle Trip");
      this._tripDataService.upDateProfitLoss(result);
    });
  }
  openChargeDeductionVendor(data, type) {
    const dialogRef = this.dialog.open(ChargeDeductionComponent, {
      width : '1050px',
      maxWidth : '85vw',
      data: {
        type: 'Edit',
        tripId: this.tripId,
        charge_deduction_type: 'Vendor',
        tripStartDate: this.tripStartDate,
        bill_type: type,
        editdata: data,
        vehicle_category  : this.headerDetailsData.vehicle_category,
        customerId  : this.headerDetailsData.customer?.id,
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe();
      this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "New Charges and Deduction  Updated in Market vehicle Trip");
      this._tripDataService.upDateProfitLoss(result);
    });
  }

  openFuelExpense(data) {
    const dialogRef = this.dialog.open(AddFuelComponent, {
      minWidth: '75%',
      data: {
        type: "Edit",
        editdata: data,
        tripId: this.tripId,
        tripStartDate: this.tripStartDate,
      },
      closeOnNavigation: false,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe();
      this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "New Fuel Updated in Trip");
      this._tripDataService.upDateProfitLoss(result);
    });
  }

  openDriverAllowance(data) {
    const dialogRef = this.dialog.open(AddDriverAllowanceComponent, {
      minWidth: '75%',
      data: {
        editdata: data,
        tripId: this.tripId,
        type: "Edit",
        tripStartDate: this.tripStartDate,
        isDriverAdded: this.isDriverAdded
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe();
      this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "New Driver Allowance Updated in Trip");
      this._tripDataService.upDateProfitLoss(result);
    });
  }

  openOtherExpenses(data) {
    const dialogRef = this.dialog.open(AddOtherExpensesComponent, {
      minWidth: '75%',
      data: {
        editdata: data,
        tripId: this.tripId,
        type: "Edit",
        tripStartDate: this.tripStartDate,
        isDriverAdded: this.isDriverAdded
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe();
      this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "New Other expense updated in Trip");
      this._tripDataService.upDateProfitLoss(result);
    });
  }

  deleteItems(id, deleteFor) {
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
      dialogRefSub.unsubscribe();
    });

  }

  confirmDelete(deleteId, deleteFor) {
    this._newTripV2Service.deleteTripDetailsItems(deleteId, deleteFor).subscribe(resp => {
      this._tripDataService.upDateProfitLoss(true);
      this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Items Deleted From Transaction Summary Section");
    });
  }

  createInvoice() {
    let queryParams = {
      customerId: this.headerDetailsData.customer.id,
      tripId: this.tripId,
      startDate: this.tripStartDate,
      customerName: this.headerDetailsData.customer.name,
      categoary:this.headerDetailsData.vehicle_category,
      pulloutDepositTripId :this.pulloutDepositTripId.length>0? this.pulloutDepositTripId.join(','):null
    };
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Create Invoice Button Clicked");
    this.router.navigate([getPrefix() + this.invoiceUrl], { queryParams });
  }

  createInvoiceClick(){
    if(Number(this.headerDetailsData.vehicle_category)==0 ||Number(this.headerDetailsData.vehicle_category)==3 || Number(this.headerDetailsData.vehicle_category)==4){
      this.createInvoice();
    }else{
      this.makeInvoice()
    }
  }

  createVehiclePaymentClick(){    
    if(Number(this.headerDetailsData.vehicle_category)==0 || Number(this.headerDetailsData.vehicle_category)==3 || Number(this.headerDetailsData.vehicle_category)==4){
      this.createVehicleProvider();
    }else{
      this.makeVehiclePayment();
    }
  }

  createVehicleProvider() {
    let queryParams = {
      vendorId: this.headerDetailsData.vehicle_provider.id,
      tripId: this.tripId,
      vendorName: this.headerDetailsData.vehicle_provider.name,
      startDate: this.tripStartDate,
      categoary:this.headerDetailsData.vehicle_category
    };
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Create Vehicle Provider Button Clicked");
    this.router.navigate([getPrefix() + this.vehicleProvider], { queryParams });
  }

  createPerformaInvoice(){
    let queryParams = {
      customerId: this.headerDetailsData.customer.id,
      tripId: this.tripId,
      startDate: this.tripStartDate,
      customerName: this.headerDetailsData.customer.name
    };
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Create Performa Invoice Button Clicked");
    this.router.navigate([getPrefix() + this.performaInvoiceUrl], { queryParams });
  }

  makeInvoice(){
    const dialogRef = this.dialog.open(TripDetailsMakeDeliveryNotePopupComponent, {
      width: '95%',
      maxWidth:'750px',
      data: {
        tripId:this.tripId,
        id:null,
        isVehiclePayment : false
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result:any) => {
      if(result !='close'){
        this._tripDataService.makeInvoiceData=result
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
        isVehiclePayment : true

      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result:any) => {
      if(result !='close'){
        this._tripDataService.makeInvoiceData=result;
        this.createVehicleProvider();
      }
      dialogRefSub.unsubscribe();      
    });
  }

  getBillingUnitName(billingUnit){
    if(billingUnit == null || billingUnit == undefined){
      return ''
    }
    return this.rateCardBillingList.find(e=>e.value == billingUnit).label
  }

}
