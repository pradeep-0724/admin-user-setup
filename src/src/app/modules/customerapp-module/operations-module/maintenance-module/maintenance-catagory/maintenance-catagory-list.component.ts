import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { MaintenanceService } from '../operations-maintenance.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { OwnVehicleReportService } from '../../../api-services/master-module-services/vehicle-services/own-vehicle-report.service';
import { AssetsDetailsService } from '../../../api-services/master-module-services/assets-service/assets-details.service';

@Component({
  selector: 'app-maintenance-catagory-list',
  templateUrl: './maintenance-catagory-list.component.html',
  styleUrls: ['./maintenance-catagory-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)'
  }
})
export class MaintenanceCatagoryListComponent implements OnInit,OnDestroy {
  jobCardDetails: any;
  prefixUrl = getPrefix();
  addServices = {
    show: false
  }
  isSpare = false;
  isTyre = false;
  addInventory = {
    show: false
  }
  addDocuments = {
    show: false
  }
  jobCardId = '';
  isServiceEdit = false;
  isInventoryEdit = false;
  serviceEditId = ''
  inventoryEditId = ''
  showOptions: any;
  servicesInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }

  servicesEditInfo = {
    'msg': 'The edit is disabled as payment done via Pay Later screen',
    'type': 'error',
    'show': false
  }




  serviceDeleteId = '';
  inventoryDeleteId = '';
  isOpenJobcardClose = false;
  isOpenJobcardStart = false
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  jobCardStart = {
    data: {},
    open: false
  }
  currency_type;
  jobcardStatus = ''
  jobCardPriority = ''
  jobCardColor = '';
  jobCardStatusColor = '';
  serviceList = [];
  maintenancePermission = Permission.maintenance.toString().split(',')
  tyreMasterDetails:any;
  isAsset:boolean=true;
  constructor(private _activateRoute: ActivatedRoute, private _maintenanceService: MaintenanceService, private commonloaderservice: CommonLoaderService,
    private _route: Router, private _analytics: AnalyticsService, private currency: CurrencyService,private apiHandler:ApiHandlerService,private _ownVehicleReportService:OwnVehicleReportService,private _assetService:AssetsDetailsService
  ) { }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.currency_type = this.currency.getCurrency();
    this._activateRoute.params.subscribe(data => {
      if (data['id']) {
        this.jobCardId = data['id'];
        this.getJobCardDetails();
        this.getJobCardServicesList();
      }
    })


  }
  getTyreMaster(id){
    if(this.isAsset){
      this._assetService.getAssetsTyreDetails(id).subscribe(resp=>{
        this.tyreMasterDetails=resp['result']
      })

    }else{
      this._ownVehicleReportService.getVehicleTyreDetails(id).subscribe(resp=>{
        this.tyreMasterDetails=resp['result']
      })

    }
  }
  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  dataFormAddServices(isTrue) {
    if (isTrue) {
      this.getJobCardDetails();
    }
  }

  dataFromUpload(isTrue) {
    if (isTrue) {
      this.getJobCardDetails();
    }
    this.addDocuments.show = false
  }

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1) {
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  optionsList(e, list_index) {
    return this.showOptions = list_index;
  }
  addNewService() {
    let queryParams = {
      add_new_service: this.jobCardId,
      vehicleId:this.jobCardDetails?.vehicle?.id
    };
    this._route.navigate([getPrefix() + "/expense/maintenance/add/service"], { queryParams })
  }

  addNewTyreChange() {
    let queryParams = {
      add_tyre_change: this.jobCardId,
      vehicleId: this.jobCardDetails?.vehicle?.id,
      isAsset:this.isAsset
    };
    this._route.navigate([getPrefix() + "/expense/maintenance/add/tyre-change"], { queryParams })
  }

  editTyreChange(data) {
    if (!data.can_delete) {
      this.servicesEditInfo.show = true;
    } else {
      let queryParams = {
        add_tyre_change: this.jobCardId,
        vehicleId: this.jobCardDetails?.vehicle?.id,
        tyre_change_id: data.id,
        isAsset:this.isAsset
      };
      this._route.navigate([getPrefix() + "/expense/maintenance/edit/tyre-change"], { queryParams })
    }
  }


  addNewInventory() {
    this.inventoryEditId = '';
    this.isInventoryEdit = false
    this.addInventory.show = true;
  }


  getJobCardDetails() {
    this._maintenanceService.getJobCardHead(this.jobCardId).subscribe(resp => {
      this.jobCardDetails = resp.result;
      this.isAsset=(this.jobCardDetails?.category=='Trailer' || this.jobCardDetails?.category=='Dolly')?true:false
      this.jobcardStatus = this.getJobCardStatus();
      this.jobCardPriority = this.getJobCardPriority();
      this.jobCardColor = this.getJobCardColour();
      this.jobCardStatusColor = this.getJobCardStatusColour();
      this.getTyreMaster(resp?.result?.vehicle?.id)
    })
  }

  servicesEdit(serviceData) {
    if (!serviceData.can_delete) {
      this.servicesEditInfo.show = true;
    } else {
      let queryParams = {
        job_card_id: this.jobCardId,
        service_id: serviceData.id,
        vehicleId:this.jobCardDetails?.vehicle?.id
      };
      this._route.navigate([getPrefix() + "/expense/maintenance/edit/service"], { queryParams })
    }

  }

  editJobCard() {
    this._route.navigate([getPrefix() + "/expense/maintenance/edit/", this.jobCardId])
  }

  inventoryEdit(inventoryEditId) {
    this.inventoryEditId = inventoryEditId;
    this.isInventoryEdit = true
    this.addInventory.show = true;
  }

  navigateToMaintenanceList() {
    this._route.navigateByUrl(getPrefix() + "/expense/maintenance/list")
  }

  confirmServicesButton(e) {
    if (e) {
      this.deleteServices();
    }
  }

  deleteServicePopUp(id: string) {
    this.serviceDeleteId = id;
    this.servicesInputData.show = true;
  }

  deleteServices() {

    this.commonloaderservice.getShow();
    this.apiHandler.handleRequest( this._maintenanceService.deleteJobCardService(this.serviceDeleteId),'Service deleted successfully!').subscribe(
      {
        next: (resp) => {
          this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.JOBCARD);
      this._analytics.addEvent(this.analyticsType.DELETED, this.analyticsScreen.JOBCARDSERVICE);
      this.commonloaderservice.getHide();
      this.getJobCardServicesList();
      this.getJobCardDetails();
          },
          error: (err) => {
            this.commonloaderservice.getShow();

          },
      }
    )
  }


  startJobCard() {
    this.jobCardStart.data = this.jobCardDetails;
    this.jobCardStart.open = true;
  }


  openJobCard() {
    this.isOpenJobcardClose = true;
  }

  dataFromJobCardClose(e) {
    this.isOpenJobcardClose = false;
    if (e) {
      this.getJobCardDetails();
    }
  }
  dataFromJobCardStart(e) {
    this.jobCardStart.data = {};
    this.jobCardStart.open = false;
    if (e) {
      this.getJobCardDetails();
    }
  }

  fileDeleted(e) {
    this.getJobCardDetails();
  }

  getJobCardServicesList() {
    this._maintenanceService.getJobCardServicesList(this.jobCardId).subscribe(resp => {
      this.serviceList = resp.result
    })
  }

  editInfo(e) {
    this.servicesEditInfo.show = false;
  }

  getJobCardStatus() {
    if (this.jobCardDetails.status == 1) return 'Scheduled'
    if (this.jobCardDetails.status == 2) return 'In Progress'
    if (this.jobCardDetails.status == 3) return 'Completed'
  }

  getJobCardStatusColour() {
    if (this.jobCardDetails.status == 1) return 'rgb(255, 185, 0)';
    if (this.jobCardDetails.status == 2) return 'rgb(76, 172, 254)';
    if (this.jobCardDetails.status == 3) return 'rgb(43, 183, 65)';
  }

  getJobCardPriority() {
    if (this.jobCardDetails.priority == 0) return 'Highest'
    if (this.jobCardDetails.priority == 1) return 'High'
    if (this.jobCardDetails.priority == 2) return 'Medium'
    if (this.jobCardDetails.priority == 3) return 'Low'
    if (this.jobCardDetails.priority == 4) return 'Lowest'
  }

  getJobCardColour() {
    if (this.jobCardDetails.priority == 2) return '#FF8000'
    if (this.jobCardDetails.priority <= 1) return '#FF063D'
    if (this.jobCardDetails.priority >= 3) return '#15A4F6'
  }
}
