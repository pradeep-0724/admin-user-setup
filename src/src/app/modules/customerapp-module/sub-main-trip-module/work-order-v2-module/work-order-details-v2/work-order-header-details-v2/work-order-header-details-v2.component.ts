import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CreateMultiTripComponent } from '../../work-order-shared-module/create-multi-trip/create-multi-trip.component';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { WorkOrderVoidQuotationComponent } from '../work-order-void-quotation/work-order-void-quotation.component';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';
import { Subject } from 'rxjs';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { EditRequestComponent } from 'src/app/modules/customerapp-module/edit-request-module/edit-request.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import moment from 'moment';

@Component({
  selector: 'app-work-order-header-details-v2',
  templateUrl: './work-order-header-details-v2.component.html',
  styleUrls: ['./work-order-header-details-v2.component.scss']
})
export class WorkOrderHeaderDetailsV2Component implements OnInit {
  currency_type: any
  constructor(private _analytics: AnalyticsService, private currency: CurrencyService, private router: Router, public dialog: Dialog, private _route: ActivatedRoute,
    private _workorderServicev2: WorkOrderV2Service, private _workOrderV2DataService: WorkOrderV2DataService, private _companyService: CompanyServices,
    private _ngxPermission : NgxPermissionsService,private _workOrderV2Service : WorkOrderV2Service) { }
  @Input() workOrderDetail: any
  @Input() workOrderId: string
  tripUrl = '/trip/new-trip/add';
  prefixUrl = getPrefix();
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  isFormList = false;
  workorderPermission = Permission.workorder.toString().split(',')[1];
  vehicleAndDriverData: any = {
    vehicle: [],
    driver: [],
    customer: [],
  };
  documentExpiryData = new Subject();
  workorderUnitStatus = {
    billing_type: 0,
    total_units:0,
    utilized_units:0
  }
  popupInputDataClose = {
    'msg': 'A closed Sales order cannot be reopened again. Are you sure, you want to close the Sales order?',
    'type': 'warning',
    'show': false
  };
  isSOEdit : boolean;
  noOfContainers=0;
  billingType=10
  movementTypes = [
    {
      label: 'Import',
      value: '1'
    },
    {
      label: 'Export',
      value: '2'
    }, {
      label: 'Local',
      value: '3'
    },
    {
      label: 'Cross Border',
      value: '4'
    },
  ];
  sowList = [
    {
      label: 'Pullout',
      value: 1,
      key : 'pullout'
    },
    {
      label: 'Deposit',
      value: 3,
      key : 'deposit'

    },
    {
      label: 'Pullout & Deposit',
      value: 4,
      key : 'pullout_deposit'

    },
    {
      label: 'Live Loading',
      value: 2,
      key : 'live_loading'

    }
  ]
  ngOnInit(): void {        
    this._ngxPermission.hasPermission(Permission.workorder.toString().split(',')[1]).then(val=>{      
      this.isSOEdit = val;
    })
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this.currency_type = this.currency.getCurrency();
    this.getDocsExpiryLIst();
    this._workorderServicev2.getWorkOrderUnitsStatus(this.workOrderId).subscribe(resp => {
      this.workorderUnitStatus=resp['result']
    })
    this._workOrderV2DataService.updateWorkorderFreights.subscribe(isUpdate => {
      if (isUpdate)
          this.getWorkOrderFreights()
    });
    if(this.workOrderDetail?.vehicle_category==4){
      this.getWorkOrderFreights()
    }
  }

  historyBack() {
    if (this.isFormList) {
      history.back();
    } else {
      this.router.navigate([getPrefix() + '/trip/work-order/list'])
    }

  }

  getWorkOrderFreights() {
    this._workOrderV2Service.getWorkOrderFrightDetails(this.workOrderId).subscribe(resp => {
      this.billingType=resp['result']['billing_type']
      this.noOfContainers=resp['result']['no_of_containers']
    })
  }

  changeDatetoNormalFormat(date) {
    return normalDate(date)
  }

  createJob() {
    let salesOrderDataDetails = {
      vehicleCategory: this.workOrderDetail?.vehicle_category ? this.workOrderDetail?.vehicle_category : 0,
      customer: {
        id: this.workOrderDetail['customer']['id'],
        label: this.workOrderDetail['customer']['display_name']
      },
      saleorder: {
        id: this.workOrderDetail['id'],
        label: this.workOrderDetail['workorder_no']
      }
    }
    let queryParams = {
      salesOrderData: JSON.stringify(salesOrderDataDetails),
    };
    if(this.workorderUnitStatus.billing_type==10 &&this.workorderUnitStatus.utilized_units >=this.workorderUnitStatus.total_units ){
      let message='';
      if(this.workorderUnitStatus.utilized_units ==this.workorderUnitStatus.total_units){
        message=`You have SO created for ${this.workorderUnitStatus.total_units} ${this.workorderUnitStatus.total_units >1 ? 'jobs' : 'job'}. Are you sure you want to scheduled new job?`
      }else{
        message= `You have SO created for ${this.workorderUnitStatus.total_units}  ${this.workorderUnitStatus.total_units>1 ? 'jobs' : 'job'}.${this.workorderUnitStatus.utilized_units} jobs have been created. Are you sure want to schedule new Jobs?`
      }
      const dialogRef = this.dialog.open(DeleteAlertComponent, {
        minWidth: '25%',
        data:{
          message:message
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
        if(result){
          this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.WORKORDER, this.screenType.VIEW, "Create One Trip Button Clicked");
          this.router.navigate([getPrefix() + this.tripUrl], { queryParams });
        }
        dialogRefSub.unsubscribe()
      });
    }else{
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.WORKORDER, this.screenType.VIEW, "Create One Trip Button Clicked");
      this.router.navigate([getPrefix() + this.tripUrl], { queryParams });
    }

  }

  createMultipleTrip() {
    this.workOrderDetail['id'] = this.workOrderId
    this.workOrderDetail['workorderUnitStatus']=this.workorderUnitStatus
    const dialogRef = this.dialog.open(CreateMultiTripComponent, {
      minWidth: '25%',
      data: this.workOrderDetail,
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.WORKORDER, this.screenType.VIEW, "Create Multiple Trip Button Clicked");
      dialogRefSub.unsubscribe()
    });
  }


  openVoidQuotation() {
    const dialogRef = this.dialog.open(WorkOrderVoidQuotationComponent, {
      data: {
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: boolean) => {
      if (item) {
        this._workorderServicev2.voidQuotation(this.workOrderDetail.id).subscribe((res) => {
          this._workOrderV2DataService.newUpdate(true)
        })
      }
      dialogRefSub.unsubscribe();
    });

  }

  convertContainerToJob(type) {
    const canShowToken = this.workOrderDetail.paths.some(path => {
      const type = Number(path.destination_type);
      return (type === 1 || type === 2) && path.zone?.label === 'Jebel Ali Port';
    });      
    let typeMatched = this.movementTypes.find(ele => ele.label == this.workOrderDetail['type_of_movement']);
    let sow =  this.sowList.find(list => list.label == this.workOrderDetail['movement_sow']).value
    let queryParams = {
      workOrderId:this.workOrderId,
      operationType:type,
      billingType:this.billingType,
      movementType : typeMatched.value,
      scopeOfWork : sow,
      canShowToken : canShowToken
    };
    this.router.navigate([getPrefix()+'/trip/work-order/details/assign-job'],{ queryParams })
  }

  getDocsExpiryLIst() {
    let workOrderDate = this.workOrderDetail['vehicle_category'] == 4 ? this.workOrderDetail['workorder_date'] : this.workOrderDetail['workstart_date'];
    this.vehicleAndDriverData = {
      customer: [{ date: workOrderDate, id: this.workOrderDetail['customer']['id'] }],
    }
    this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((resp) => {
      this.documentExpiryData.next(resp)
    });
  }

  workorderClose(event) {
    if (event) {
      this._workorderServicev2.closeWorkOrder(this.workOrderId).subscribe(() => {
        this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.WORKORDER, this.screenType.LIST, "Workorder Closed");
        this.popupInputDataClose['show'] = false;
        this._workOrderV2DataService.newUpdate(true)
      })

    } else {
      this.popupInputDataClose['show'] = false;
    }
  }
  closeWorkOrder() {
    this.popupInputDataClose.show = true;
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
      this._workOrderV2DataService.newUpdate(result)
      dialogRefSub.unsubscribe()
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.WORKORDER,this.screenType.VIEW,"Sales Order Comment Viewd");
    });
  }
  findCategory(type){
    if (type==3){
      return 'loose_cargo'
    }else if (type==4){
      return 'container'
    }else if (type==0){
      return 'others'
    }
  }

  createJobForCargo(){
    let payload = {
      multiple_job : [
        {
          num_trips : 1,
          date : moment().format('YYYY-MM-DD')
        }
      ],
      wo_id : this.workOrderId
    }
      this._workOrderV2Service.createMultipleTrips(payload).subscribe(resp=>{
        this.router.navigate([getPrefix()+'/trip/new-trip/details/'+ resp['result']['ids'][0]])
      });
  }

  

}
