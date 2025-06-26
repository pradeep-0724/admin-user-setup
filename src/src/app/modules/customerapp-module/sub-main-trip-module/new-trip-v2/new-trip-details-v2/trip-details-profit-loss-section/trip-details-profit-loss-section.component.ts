import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EditBillingV2Component } from '../edit-billing-module-v2/edit-billing-v2/edit-billing-v2.component';
import { ChargeDeductionComponent } from '../charge-deduction/charge-deduction.component';
import { AddFuelComponent } from '../add-fuel/add-fuel.component';
import { AddDriverAllowanceComponent } from '../add-driver-allowance/add-driver-allowance.component';
import { AddOtherExpensesComponent } from '../add-other-expenses/add-other-expenses.component';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Observable } from 'rxjs';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { cloneDeep } from 'lodash';
import { Router } from '@angular/router';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';


@Component({
  selector: 'app-trip-details-profit-loss-section',
  templateUrl: './trip-details-profit-loss-section.component.html',
  styleUrls: ['./trip-details-profit-loss-section.component.scss']
})
export class TripDetailsProfitLossSectionComponent implements OnInit {

  constructor(private _analytics: AnalyticsService, public dialog: Dialog, private currency: CurrencyService, private _tripDataService: NewTripV2DataService, private _newTripV2Service: NewTripV2Service, private _route: Router) { }

  currency_type: any
  @Input() tripId = ''
  @Input() tripStartDate: ''
  @Input() profitLossDataObj: Observable<any>;
  @Input() headerDetailsDataSub: Observable<any>;
  @Input() tripTimeSheets:Observable<any> ;
  @Input() isDriverAdded: boolean = false;
  @Input() isTransporter: boolean = true;
  @Output() showDocuments = new EventEmitter();
  @Input() tripStatusAndSummaryData: Observable<any>;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  trip = Permission.trip__new_trip.toString().split(',')
  headerData: any;
  vehicleCategory: number;
  customerId = '';
  prefixUrl = getPrefix();
  isVoid: boolean = false;
  viewUploadedDocs = {
    show: false,
    data: {}
  }
  totalMaterialQuanity: number = 0;
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList;
  billingUnitType ='';
  considerationEdit=true;
  considerationAmountValue=0.000;

  ngOnInit(): void {
    this.tripTimeSheets.subscribe((res) => {
      this.billingUnitType = this.getBillingUnitName(res?.billing_unit);
    })
    this.currency_type = this.currency.getCurrency();

    this.headerDetailsDataSub.subscribe(resp => {
      this.vehicleCategory = resp['vehicle_category'];
      this.customerId = resp['customer']?.['id'];;
      this.isVoid = resp['approval_status']['status_screen_to_show'] === 'void';
      this.headerData = resp
    });
    this.tripStatusAndSummaryData.subscribe((res) => {
      this.totalMaterialQuanity = 0
      if (res?.material_info?.length > 0) {
        res?.material_info.forEach(element => {
          this.totalMaterialQuanity = this.totalMaterialQuanity + Number(element.total_quantity);
        });
      }

    })
    this.profitLossDataObj.subscribe(data=>{
      if(data?.revenue?.consideration?.show){
       this.considerationAmountValue=data?.revenue?.consideration?.amount
      }
    })
  }
  viewUploadedDocument(docs, doc_no) {
    let docsWithName = docs.map(e => {
      return { ...e, note: e.note + ' - ' + doc_no }
    })
    this.showDocuments.emit({
      data: cloneDeep(docsWithName),
      show: true
    })
  }

  openEditBillingPopup(data, type, category) {
    if (category == 4) {
      this._route.navigate([this.prefixUrl + '/trip/new-trip/edit/', this.tripId])
      return
    }
    const dialogRef = this.dialog.open(EditBillingV2Component, {
      minWidth: '75%',
      data: {
        editData: data,
        tripId: this.tripId,
        freight_type: type,
        tripDetails: this.headerData,
        vehicleCategory: category,
        totalMaterialQuanity: this.totalMaterialQuanity

      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateFreight(result)
      this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Trip Billing Updated");
      dialogRefSub.unsubscribe();
    });

  }
  openChargeDeductionClient(data, type) {
    const dialogRef = this.dialog.open(ChargeDeductionComponent, {
      width: '1050px',
      maxWidth: '85vw',
      data: {
        type: 'Edit',
        tripId: this.tripId,
        charge_deduction_type: 'Client',
        tripStartDate: this.tripStartDate,
        bill_type: type,
        editdata: data,
        is_Driver_Added: this.isDriverAdded,
        is_Transporter: this.isTransporter,
        vehicle_category: this.vehicleCategory,
        customerId: this.customerId
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
      width: '1050px',
      maxWidth: '85vw',
      data: {
        type: 'Edit',
        tripId: this.tripId,
        charge_deduction_type: 'Vendor',
        tripStartDate: this.tripStartDate,
        bill_type: type,
        editdata: data,
        vehicle_category: this.vehicleCategory,
        customerId: this.customerId
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
      maxWidth: "85%",
      width: '1100px',
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
      width: '1100px',
      maxWidth: '85%',
      data: {
        editdata: data,
        tripId: this.tripId,
        type: "Edit",
        tripStartDate: this.tripStartDate,
        isDriverAdded: this.isDriverAdded,
        vehicle_category: this.vehicleCategory
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
      width: '1000px',
      maxWidth: '85vw',
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
      this._tripDataService.updateTimeSheet(true);
      this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.NEWTRIP, this.screenType.VIEW, "Items Deleted From Profit Loss Section");
    });
  }

  getBillingUnitName(billingUnit){
    if(billingUnit == null || billingUnit == undefined){
      return ''
    }
    return this.rateCardBillingList.find(e=>e.value == billingUnit).label
  }

  considerationAmount(){
    this._newTripV2Service.postConsiderationAmount(this.tripId,{
      consideration_amount:this.considerationAmountValue
    }).subscribe(resp=>{
      this._tripDataService.upDateProfitLoss(true);
      this.considerationEdit=true
    }
    )
  }

}
