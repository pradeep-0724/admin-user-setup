import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EditBillingV2Component } from '../edit-billing-module-v2/edit-billing-v2/edit-billing-v2.component';
import { Observable, Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { formatNumber } from 'src/app/shared-module/pipes/numberformat.pipe';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-trip-details-summary-section',
  templateUrl: './trip-details-summary-section.component.html',
  styleUrls: ['./trip-details-summary-section.component.scss']
})
export class TripDetailsSummarySectionComponent implements OnInit ,OnDestroy{
  @Input() tripStatusAndSummaryData: Observable<any>;
  @Input() headerDetailsDataSub: Observable<any>;
  currency_type: any
  constantsTripV2 = new NewTripV2Constants()
  materialInfo: ToolTipInfo;
  total_Trip_Time: ToolTipInfo;
  total_Trip_KM: ToolTipInfo;
  estimateTime: ToolTipInfo;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants; 
  headerData:any;
  totalMaterialQuanity:number=0;
  $subscriptions: Array<Subscription> = []; 
  workorderUnitStatus = {
    billing_type: 0,
    total_units:0,
    utilized_units:0
  }

  vehicleCategory=-1
  prefixUrl=getPrefix()




  constructor(private _analytics: AnalyticsService,public dialog: Dialog, private currency: CurrencyService, private _newTripV2DataService: NewTripV2DataService,  private _workorderServicev2:WorkOrderV2Service) { }

  ngOnDestroy(): void {
    if (this.$subscriptions.length) {
      this.$subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.materialInfo = {
      content: this.constantsTripV2.toolTipMessages.MATERIAL_INFO.CONTENT
    };
    this.total_Trip_Time = {
      content: this.constantsTripV2.toolTipMessages.TOTAL_TRIP_TIME.CONTENT
    };
    this.total_Trip_KM = {
      content: this.constantsTripV2.toolTipMessages.TOTAL_TRIP_KM.CONTENT
    }
    this.estimateTime = {
      content: this.constantsTripV2.toolTipMessages.ESITMATETIME.CONTENT
    }
   this.$subscriptions.push(
    this.headerDetailsDataSub.subscribe(resp => {
      this.headerData = resp
      this.vehicleCategory=this.headerData['vehicle_category'];
      if(this.headerData['vehicle_category']==0){
        if(this.headerData['job_from']['type']==1){
          this.getWorkorderUnits(this.headerData['job_from']['origin']['id'])
        }
      }
    }),
    this.tripStatusAndSummaryData.subscribe((res)=>{
      this.totalMaterialQuanity=0
      if(res?.material_info?.length>0){
        res?.material_info.forEach(element => {
          this.totalMaterialQuanity =this.totalMaterialQuanity+ Number(element.total_quantity);
        });
      }
      
    })
  );
 


  }

  editFeright(id, data, type,vehicle_category) {
    if(this.headerData['job_from']['type']==1){
      data['workorderUnitStatus']=this.workorderUnitStatus
    }
    const dialogRef = this.dialog.open(EditBillingV2Component, {
      minWidth: '75%',
      data: {
        editData: data,
        tripId: id,
        freight_type: type,
        tripDetails:this.headerData,
        vehicleCategory : vehicle_category,
        totalMaterialQuanity:this.totalMaterialQuanity,
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._newTripV2DataService.upDateFreight(result);
      this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.NEWTRIP,this.screenType.VIEW,"Trip Billing Updated From Trip Summary Section");
      dialogRefSub.unsubscribe()
    });

  }

  getWorkorderUnits(id){
    this._workorderServicev2.getWorkOrderUnitsStatus(id).subscribe(resp => {
      this.workorderUnitStatus=resp['result']
    })
  }

  convertToCommaSeparated(value : number){
    if(!isValidValue(value)) return 0
    return formatNumber(value, 'american', 0);
  }
}
