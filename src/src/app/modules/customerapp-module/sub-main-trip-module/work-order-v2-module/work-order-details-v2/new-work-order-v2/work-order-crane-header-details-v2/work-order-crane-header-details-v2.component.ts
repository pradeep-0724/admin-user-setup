import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { CreateMultiTripComponent } from '../../../work-order-shared-module/create-multi-trip/create-multi-trip.component';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { WorkOrderVoidQuotationComponent } from '../../work-order-void-quotation/work-order-void-quotation.component';
import { WorkOrderV2DataService } from '../../../work-order-v2-dataservice.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { Subject } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { EditRequestComponent } from 'src/app/modules/customerapp-module/edit-request-module/edit-request.component';

@Component({
  selector: 'app-work-order-crane-header-details-v2',
  templateUrl: './work-order-crane-header-details-v2.component.html',
  styleUrls: ['./work-order-crane-header-details-v2.component.scss']
})
export class WorkOrderCraneHeaderDetailsV2Component implements OnInit {
  @Input()workOrderDetail;
  prefixUrl = getPrefix()
  ;
  @Input()workOrderId;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  tripUrl = '/trip/new-trip/add';
  workorderPermission = Permission.workorder.toString().split(',')[1]
  vehObj
  isFormList=false;
  vehicleAndDriverData: any = {
    vehicle : [],
    driver :  [],
    customer : []
  };
  documentExpiryData= new Subject()
  popupInputDataClose = {
    'msg': 'A closed Sales order cannot be reopened again. Are you sure, you want to close the Sales order?',
    'type': 'warning',
    'show': false
  };
  isSOEdit : boolean = false;
  locations = [];
  constructor(private _analytics: AnalyticsService, public dialog: Dialog, private router: Router,private _route:ActivatedRoute,
    private _workorderv2DataService: WorkOrderV2DataService,private _workorderV2service: WorkOrderV2Service,private _companyService:CompanyServices,private _ngxPermission : NgxPermissionsService) { }
  

  ngOnInit(): void {
    this._ngxPermission.hasPermission(Permission.workorder.toString().split(',')[1]).then(val=>{      
      this.isSOEdit = val;
    })
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this.vehObj=this.workOrderDetail[this.getVehicleCategory(this.workOrderDetail?.vehicle_category)];
    let location = this.vehObj['location_details']['location'];
    if(isValidValue(location.name) && (!location.lat || !location.lng)){
      this.locations.push(location);
    }    
    this.getDocsExpiryLIst();
  }
  historyBack() {
    if(this.isFormList){
      history.back();
    }else{
     this.router.navigate([getPrefix()+'/trip/work-order/list'])
    }
  }
  changeDatetoNormalFormat(date){
    return normalDate(date)
  }
  getVehicleCategory(category){
    if(category==0) return 'truck'
    if(category==1) return 'crane'
    if(category==2) return 'awp'
   
   }
   createMultipleTrip() {
    this.workOrderDetail['id'] = this.workOrderId
    const dialogRef = this.dialog.open(CreateMultiTripComponent, {
      minWidth: '25%',
      data: this.workOrderDetail,
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.VIEW,"Create Multiple Trip Button Clicked");
      dialogRefSub.unsubscribe()
    });
  }
  createJob() {
    let salesOrderDataDetails={
      vehicleCategory:this.workOrderDetail?.vehicle_category,
      customer:{
        id:this.workOrderDetail['customer']['id'],
        label:this.workOrderDetail['customer']['name']
      },
      saleorder:{
        id:this.workOrderDetail['id'],
        label:this.workOrderDetail['workorder_no']
      }
    }
    let queryParams = {
      salesOrderData: JSON.stringify(salesOrderDataDetails),
    };
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.VIEW,"Create One Trip Button Clicked");
    this.router.navigate([getPrefix() + this.tripUrl], { queryParams });

  }

  openVoidQuotation(){
    const dialogRef = this.dialog.open(WorkOrderVoidQuotationComponent, {
      data : {
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: boolean) => {      
      if(item){
        this._workorderV2service.voidQuotation(this.workOrderDetail.id).subscribe((res)=>{
          this._workorderv2DataService.newUpdate(true)
        })
      }
      dialogRefSub.unsubscribe();
    });
  }
  getDocsExpiryLIst() {
    let vehicleCategory = this.workOrderDetail['vehicle_category'];
    let rental_charges;
    let location
    if(vehicleCategory ==1){
      rental_charges = this.workOrderDetail['crane']['rental_charge']['rental_charges'];
      location=this.workOrderDetail['crane']['location_details']['location'];
    }else{
      rental_charges = this.workOrderDetail['awp']['rental_charge']['rental_charges'];
      location=this.workOrderDetail['awp']['location_details']['location'];
    }
    let vehicles = [];
    rental_charges.forEach(element => {
      if(isValidValue(element['vehicle_no'])){
        vehicles.push({
          date : element['job_start_date'],
          id : element['vehicle_no']['id']
        })
      }      
    });
    this.vehicleAndDriverData = {
      customer : [ { date : this.workOrderDetail['workstart_date'], id : this.workOrderDetail['customer']['id'] }],
      vehicle : vehicles,
      location:[location]
    }
    this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((resp)=>{  
       this.documentExpiryData.next(resp)
     });
  }

  workorderClose(event){
    if (event) {
      this._workorderV2service.closeWorkOrder(this.workOrderId).subscribe(() => {
        this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.WORKORDER,this.screenType.LIST,"Workorder Closed");
        this.popupInputDataClose['show'] = false;
        this._workorderv2DataService.newUpdate(true)
      })

    } else {
      this.popupInputDataClose['show'] = false;
    }
  }
  closeWorkOrder(){
   this.popupInputDataClose.show=true;
  }

  editRequest() {
    const dialogRef = this.dialog.open(EditRequestComponent, {
      width: '500px',
      maxWidth: '90%',
      data: {
        heading:'Edit Request',
        url:`revenue/workorder/edit_request/${this.workOrderId}/`,
        areRemarksMandatory : false
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._workorderv2DataService.newUpdate(result)
      dialogRefSub.unsubscribe()
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.VIEW,"Sales Order Comment Viewd");
    });
  }

}
