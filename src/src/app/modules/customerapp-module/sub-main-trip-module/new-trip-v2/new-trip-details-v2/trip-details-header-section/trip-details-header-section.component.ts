import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { FormControl } from '@angular/forms';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TripDetailsVoidJobComponent } from '../trip-details-void-job/trip-details-void-job.component';
import { TripDetailsStartCompleteJobPopupComponent } from '../trip-details-start-complete-job-popup/trip-details-start-complete-job-popup.component';
import { VehicleChangeComponent } from '../vehicle-change/vehicle-change.component';
import { Permission } from 'src/app/core/constants/permissionConstants';
import moment from 'moment';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { EditRequestComponent } from 'src/app/modules/customerapp-module/edit-request-module/edit-request.component';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';

@Component({
  selector: 'app-trip-details-header-section',
  templateUrl: './trip-details-header-section.component.html',
  styleUrls: ['./trip-details-header-section.component.scss'],
})
export class TripDetailsHeaderSectionComponent implements OnInit,OnDestroy {

  constructor(private _route:ActivatedRoute,  public dialog: Dialog, private _companyService:CompanyServices,private _vehicleService: VehicleService,
     private _tripDataService: NewTripV2DataService, private router: Router,private _companyTripGetApiService: CompanyTripGetApiService,private _newTripV2Service: NewTripV2Service,) { }
  @Input() tripId: string = '';
  @Input() headerDetailsDataSub: Observable<any>;
  @Input() isTripComplete: boolean = false;
  @Input() isTripStarted: boolean = false;
  @Input() bdpMileStone: Observable<any>;
  @Input() tripStatusAndSummaryData: Observable<any>;
  @Input() tripPartyTransactionData:Subject<any>;
  partyTransactionData:any
  documentExpiryData= new Subject()

  bdpDetails: any;
  isFormList = false;
  prefixUrl = getPrefix();
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  driverList=[];
  driverControl= new FormControl()
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/U59jxYWBQ9hfPo6vUfgx?embed%22"
  };
  vehicleAndDriverData:any={
    vehicle: [],
    drivers:[],
    customer : [],
    location:[],
    asset : []
  };
  vehicleId='';
  vehicle_category : number;
  tripSummaryData;
  trip=Permission.trip__new_trip.toString().split(',')
  $subscriptions: Array<Subscription> = [];
  specification : any;
  isAllDisabled : boolean = true;
  isApprivalMechanismOn: boolean = true;
  customerId = '';
  driverId = ''
  startJob :any;
  locationlist=[]
  locations = [];
  tripDetails : any;
  isDownloadGatePass =new BehaviorSubject<boolean>(false);
  scheduledJobsForSelectedVehicleList = [];
  ngOnDestroy(): void {
    if (this.$subscriptions.length) {
      this.$subscriptions.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }

  ngOnInit(): void {    
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this.$subscriptions.push(this.tripPartyTransactionData.subscribe(res=>{
      this.partyTransactionData=res

    }))
    this.tripStatusAndSummaryData.subscribe((res)=>{
      let vehicle_category = res['vehicle_category'];
      if(vehicle_category== 1 || vehicle_category ==2){
        this.locationlist=[res['location']]
        this.startJob = res['start_date']?res['start_date']:res['scheduled_start_date'];
      }else{
        this.startJob = moment(res['paths'][0].time).format('YYYY-MM-DD')
        this.locationlist=res['paths'].map(loc=>loc.location)
      }  
      this.locationlist.forEach((ele)=>{
        if(isValidValue(ele.name) && (!ele.lat || !ele.lng ))
        this.locations.push(ele)
      }); 
    })
    this.bdpMileStone.subscribe(data => {
      this.bdpDetails = data;
    });
   this.$subscriptions.push(this.headerDetailsDataSub.subscribe(resp=>{ 
      this.tripDetails = resp;   
      this.customerId = resp.customer?.id;
      this.specification = resp['specification'];
      this.vehicle_category = resp.vehicle_category ;
      if(resp.approval_status.status_screen_to_show === 'void' || resp.approval_status.status_screen_to_show === 'approver_action' || resp.approval_status.status_screen_to_show === 'approval_rejected'){
        this.isAllDisabled = true;
      }else{
        this.isAllDisabled = false;
      }
      if(!resp.is_transporter)
      if(isValidValue(resp.driver)){
        this.driverControl.setValue(resp.driver.map(driver=>{return {id:driver.id,first_name:driver.name}}))
      }
      this.getDocsExpiryLIst(resp);
      this.getAlreadyScheduledJobsForVehicles(resp);
    }))
    this.getDriverList();
    this.$subscriptions.push(this.tripStatusAndSummaryData.subscribe(data => {
      if (data) {      
        this.tripSummaryData= data;
      }
    }))   
  }

  getAlreadyScheduledJobsForVehicles(data){
    let vehicle = data.vehicle?.id;
    let params = [{
      date : moment(this.startJob).format('YYYY-MM-DD'),
      id : data.vehicle?.id
    }]
    this.scheduledJobsForSelectedVehicleList=[];
    this.tripDetails.approval_status.status_screen_to_show !='Completed' && isValidValue(vehicle) && this._vehicleService.getAlreadyScheduledJobsForVehicle(params).subscribe((resp:any)=>{                        
      let result = resp['result'][0].filter(id =>id.trip_id !=this.tripDetails.trip_id)            
      this.scheduledJobsForSelectedVehicleList=result
    })
  }
  
  getDocsExpiryLIst(data){  
    this.startJob = moment(this.startJob).format('YYYY-MM-DD');
    let ids=[]; 
    let asset = [];   
    if( isValidValue(data.driver) && data.is_transporter!=true){
      data.driver.map((ele)=>ids.push(
        {
          id :  ele.id,
          date : this.startJob
        }
      ))
    }
    if(Number(data?.vehicle_category) == 0 || Number(data?.vehicle_category) == 4){
      if(isValidValue(data['asset_1']?.id)){
        asset.push({
          date : this.startJob,
          id : data['asset_1']['id']
        })
      }
      if(isValidValue(data['asset_2']?.id)){
        asset.push({
          date : this.startJob,
          id : data['asset_2']['id']
        })
      }if(isValidValue(data['asset_3']?.id)){
        asset.push({
          date : this.startJob,
          id : data['asset_3']['id']
        })
      }
    }
    this.vehicleId=data.vehicle?.id;
    this.vehicleAndDriverData.driver=ids;
    this.vehicleAndDriverData.customer = isValidValue(this.customerId) ? [ { date : this.startJob, id : this.customerId}] : [];
    this.vehicleAndDriverData.location=this.locationlist;
    this.vehicleAndDriverData.asset=asset;
    if(isValidValue(data.vehicle)){
      this.vehicleAndDriverData.vehicle =  [{ date :  this.startJob , id :  data.vehicle?.id }]
    }
    this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((resp)=>{  
      this.documentExpiryData.next(resp)
    });

  }

  backToList() {
    if(this.isFormList){
      history.back();
    }else{
     this.router.navigate([getPrefix()+'/trip/new-trip/list'])
    }
  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }

  getDriverList() {
    this._companyTripGetApiService.getDrivers(employeeList => {
      this.driverList = employeeList;
    });
  }

  selectedDriverList(e){    
    let drivers=e.map(driver=>driver.id)
    this._newTripV2Service.putAssignDriver(this.tripId,{driver:drivers}).subscribe(resp=>{
      this.vehicleAndDriverData.drivers=drivers
      this._tripDataService.upDateTripProfile(true)
    })
  }

  openVoidQuotation(){
    const dialogRef = this.dialog.open(TripDetailsVoidJobComponent, {
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
        this._newTripV2Service.voidJob(this.tripId).subscribe((res)=>{
          this._tripDataService.upDateTripProfile(true)
        })
      }
      dialogRefSub.unsubscribe();
    });

  }

  openAssignVehicle(){
    this.startJob = moment(this.startJob).format('YYYY-MM-DD');
    const dialogRef = this.dialog.open(VehicleChangeComponent, {
      data : {
        jobId : this.tripId,
        vehicle_category : this.vehicle_category,
        specification : this.specification,
        jobStartDate : this.startJob,
        customerId : this.customerId,
        locationlist:this.locationlist,
        tripDetails : this.tripDetails
      },
      width: '650px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {   
      this._tripDataService.upDateTripProfile(resp)   
      dialogRefSub.unsubscribe();
    });

  }

  openStartJob(isStarted){    
    const dialogRef = this.dialog.open(TripDetailsStartCompleteJobPopupComponent, {
      data : {
        finishTrip : isStarted,
        tripSummaryData : this.tripSummaryData,
        tripId : this.tripId,
        vehicleId:this.vehicleId
      },
      width: '1100px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
      let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => { 
        this._tripDataService.upDateTripProfile(resp);
        dialogRefSub.unsubscribe();
    });

  }
  getVehicleCategory(category){
    if(category==0) return 'others'
    if(category==1) return 'crane'
    if(category==2) return 'awp'
    if(category==4) return 'container'
   }

   isTripTaskUpdated(){
    if(this._tripDataService.inlineTaskAdded)this._tripDataService.destinationUpdates(true);
  }

  findfingFirstName(name:string){
    return name.split('')[0]
  }

  downloadGatePass(){
   this.isDownloadGatePass.next(true)
  }

  editRequest() {
    const dialogRef = this.dialog.open(EditRequestComponent, {
      width: '500px',
      maxWidth: '90%',
      data: {
        heading:'Edit Request',
        url:`revenue/trip_new/edit_request/${this.tripId}/`,
        areRemarksMandatory : true
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._tripDataService.upDateTripProfile(true)
      dialogRefSub.unsubscribe()
    });
  }


}
