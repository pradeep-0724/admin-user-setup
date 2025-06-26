import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripDataService } from './new-trip-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { changeDateTimeToServerFormat, changeDateToServerFormat, podTripCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { ErrorList } from 'src/app/core/constants/error-list';
import { BehaviorSubject } from 'rxjs';
import { ValidationConstants } from '../../../../../core/constants/constant';
import { CompanyTripGetApiService } from '../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TransportValidator } from '../../../../../shared-module/components/validators/validators';
import { TSAPIRoutes } from '../../../../../core/constants/api-urls.constants';
import { getBlankOption,  getObjectFromListByKey, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';

import { filterDriver, filterHelper } from '../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-utils';
import { NewTripService } from '../../../api-services/trip-module-services/trip-service/new-trip-service';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { VehicleTripPreferenceService } from '../../../../orgainzation-setting-module/setting-module/vehicle-trip-module/vehicle-trip-setting-preferences/vehicle-trip-setting-preferences.service';
import { TripConstants } from '../constant';
import { getSetViewDetails } from 'src/app/core/services/getsetviewdetails.service';
import { SettingSeviceService } from '../../../api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { VehicleTripCustomFieldService } from '../../../../orgainzation-setting-module/setting-module/vehicle-trip-module/vehicle-trip-setting-custom-fileds/vehicle-trip-custom-field-service.service';
import { WorkOrderService } from '../../../api-services/trip-module-services/work-order-service/work-order.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { LorryChallanGetService } from '../../../revenue-module/trip-module/lorry-challan-module/lorry-challan/lorry-challan-class/lorry-challan-get.service';
import moment from 'moment';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

export interface outputData {
      isFormValid:boolean,
      allData:Array<[]>
}
@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)'
	}
})
export class NewTripComponent implements OnInit,OnDestroy {
  predefinedFields: any;

  constructor( private _fb: UntypedFormBuilder ,
    private _companyTripGetApiService :CompanyTripGetApiService,
    private _lorryChallanGetService:LorryChallanGetService,
    private _newTripService:NewTripService,
    private _preFixUrl:PrefixUrlService,
    private _route:Router,
    private _dataService:NewTripDataService,
    private _preferenceService: VehicleTripPreferenceService,
    private _activeRoute: ActivatedRoute,
    private _viewDetailsService:getSetViewDetails,
    private _advances:SettingSeviceService,
    private _partyService: PartyService,
    private _tripCustomField: VehicleTripCustomFieldService,
    private _workOrderService:WorkOrderService,
    private _analytics:AnalyticsService,
    private _terminologiesService:TerminologiesService,
    private _permissionService:NgxPermissionsService,
    private _commonloaderservice:CommonLoaderService

   ) {
    this.terminology = this._terminologiesService.terminologie;
    let permissionObject= this._permissionService.getPermissions();
    if ('trip_freight__view' in permissionObject) {
      this.isTripFreight=true;
    }
   }
  dropdownVideos = false;
  terminology:any;
  newAddTripForm: UntypedFormGroup;
  billingTypes = new TripConstants().billingTypes;
  billingDropdown=[{
    label:'Tonnes',
    value:'tonnes'
  },
  {
    label:'Kgs',
    value:'kgs'
  },
  {
    label:'KMS',
    value:'kms'
  },
  {
    label:'Litres',
    value:'litres'
  },
  {
    label:'Hours',
    value:'hour'
  },
  {
    label:'Days',
    value:'days'
  },
  {
    label:'Jobs',
    value:'jobs'
  },
  {
    label:'Gallon',
    value:'gallon'
  },
  {
    label:'Units',
    value:'units'
  }
]

paymentType=[{
  label:'To be Paid',
  value:false
},
{
  label:'To Pay',
  value:true
}]

paymentTermList= new ValidationConstants().paymentTermList;

apiError ='';
foremanName ='';
KEY ='vehicle_trip';
globalFormErrorList: any = [];
possibleErrors = new ErrorList().possibleErrors;
errorHeaderMessage = new ErrorList().headerMessage;
initialDetails = {
  vehicle_provider:{},
  vehicleDetail: {},
  consignee: {},
  consigner: {},
  customer: {},
  driver: {},
  unit: [],
  vehicle: {},
  podPaymentTerm:{},
  isMonthlyPaymentModeSelected :[],
};
partyCharge={
  addToBill:false,
  reduceToBill:false
}
vehicleProviderCharge={
  addToBill:false,
  reduceToBill:false
}
partyType: any;
formError={};
vehicleList =[];
partyList: any = [];
employeeList =[];
driverList =[];
materialList =[];
paymentModeList=[];
unitOptionList =[];
expenseAccountList = [];
tripEmployeeTypeList =[];
selectedDropdown = '';
selectedDropdownMarket ='';
partyNamePopup: string = '';
vendor: boolean=false;
activeTab=1;
activeFuelTab=1;
activeFuelTabDriver =1;
chargeActiveTab =1;
chargeAddToBillAdndReduceTab =1;
vehicleproviderAddToBillAdndReduceTab =1;
activeAdvanceTab = 1;
showAddPartyPopup: any = {name: '', status: false};
hours = new ValidationConstants().hours;
postDriverAPI: any = TSAPIRoutes.lorrychallan_driver;
minutes = new ValidationConstants().minutes;
addDriverParams: any = {};
partyListVendor =[];
selfFuelVendorList =[];
isTransporterTrip : boolean =false;
  initialValues ={
    billingDropdown :getBlankOption(),
    vehicleFrightDropDown:getBlankOption(),
    tripCodes:{label: 'Trip Code'},
    routeCodes:{},
    tripcodeList:{},
    prefill_work_order:{label:'Work Order No',value:''},
    workOrder:{}
  }
advanceClientAccountList = []
fuelClientAccountList = []
battaClientAccountList = []
helperList =[];
paymentStatus =[];
accountType = new ValidationConstants().accountType.join(',');
employeeType =new ValidationConstants().EMPLOYEETYPEDRIVERID;
accountList =[];
expenseTypeList = [];
chargedAddBillType =[];
chargedReducedBillType =[];
materialOptionsList =[];
driverListCompanyOrTransporter=[];
transporterDriverList = [];
dateSelected :any;
tripId ='';
fuelPurchesed =0.00;
partyAdvanceTripFuel =0.00;
fuelStock =0.00;
isVehicleChange : boolean=false;
preFixUrl =''
displayPodReceived: boolean = false;
estimatedKM:boolean;
estimatedDuration:boolean;
disableVehicleField: boolean = false;
isTripCodeSelected: boolean = false;
editCustomerFreightData: any = [];
editMarketFreightData: any = [];
tripCodes = []
isTripCodeGotId : boolean = false;
isTabFieldFilled = this.getTabFilled();
isFormValid = this.getFormValid();
isFormError = this.getFormValid();
isAllSubFormValid =true;
isTripCodeChange : boolean = true;
routeCodeList =[];
allTripsCodeList =[];
vendorList =[];
popupInputData = {
  'msg': 'Are you sure, you want to delete?',
  'type': 'warning',
  'show': false,
  'tripId':''
}
popupInputDataAssignDriver = {
  'msg': '',
  'type': 'warning-driver-allowance',
  'show': false,
}
popupWorkOrderInputData={
  'msg': '',
  'type': 'warning-work-order',
  'show': false,
}
popupWorkOrderInputDataSave={
  'msg': '',
  'type': 'warning-work-order',
  'show': false,
}
gstin='';
gst_in='';
isVehicleId :boolean = false;
vehicleAddPopup : any = {name: '', status: false};
vehicleNamePopup: string = '';
driverSelf =[];
isDrverselfChanged:boolean= true;
driverId=''
vehicleprovider="Vehicle Provider";
billingParty="Billing Party";
companyAdvance={
  cash_op: false,
  cash_view: false,
  fuel_op: false,
  fuel_view: false,
  batta_op: false,
  batta_view: false,
  fuel_rc_op:false,
  fuel_rc_view:false,
  cash_rc_op:false,
  cash_rc_view:false,
}
isClientFrightValid = new BehaviorSubject(true);
isVehileFreightValid = new BehaviorSubject(true);
isSelfFuelValid = new BehaviorSubject(true);
isSelfDriverFormValid = new BehaviorSubject(true);
isOtherExpenseFormValid = new BehaviorSubject(true);
isPartyAdvanceFuelFormValid = new BehaviorSubject(true);
isPartyAdvanceFormValid = new BehaviorSubject(true);
isVehicleAdvanceFormValid = new BehaviorSubject(true);
isChargeAddToBillFormValid = new BehaviorSubject(true);
isChargeReduceToBillFormValid = new BehaviorSubject(true);
isVehicleAddToBillFormValid = new BehaviorSubject(true);
isVehicleReduceToBillFormValid = new BehaviorSubject(true);
pattern = new ValidationConstants().VALIDATION_PATTERN.NUMBER_ONLY
isEstimatedPod=false;
estimatePodMinDate = new Date(dateWithTimeZone());
VehicleUrls = new ValidationConstants().videoUrls;
VehicleTripCustomField = [];
workOrderList =[];
workOrderValue={};
mintripStartDate = new Date(null);
isClientBillingDisabled = false;
analyticsType= OperationConstants;
analyticsScreen=ScreenConstants;
screenType=ScreenType;
isTripFreight:boolean= false;
isDriverAllowance:boolean=false;
fromData;
toData;
isFromValid: boolean = true;
isToValid: boolean = true;
isFromToInvalid = new BehaviorSubject(true);




  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.NEWTRIP,this.screenType.ADD,"Navigated");
    this.preFixUrl =this._preFixUrl.getprefixUrl();
    this.getCustomFields();
    this.getPrefrences();
    this.buildForm();
    this.getInitialDetails();
    this.getPartyTripDetails();
    this.initialValues.billingDropdown = this.billingDropdown[0];
    this.initialValues.vehicleFrightDropDown= this.billingDropdown[0];

    this.newAddTripForm.get('billing_name').setValue(this.billingDropdown[0].value);
    this.newAddTripForm.get('billing_name_market').setValue(this.billingDropdown[0].value);
    this.selectedDropdown =this.newAddTripForm.get('billing_name').value;
    this.selectedDropdownMarket = this.newAddTripForm.get('billing_name_market').value;
    this.clearAllDataService();
    this.populateVehicle();
    if(this._workOrderService.workOredrcustomerData['id']){
      let customerDetail= this._workOrderService.workOredrcustomerData['customer'];
      let workorder_no =this._workOrderService.workOredrcustomerData['workorder_no'];
      this.getWorkOrderList(customerDetail.id);
      this.newAddTripForm.get('customer').setValue(customerDetail.id);
      this.initialDetails.customer ={label:customerDetail.name,value:''};
      this.initialValues.workOrder ={label:workorder_no,value:''};
      this.onWorkOrderSelection(this._workOrderService.workOredrcustomerData['id'])
      this.newAddTripForm.get('work_order_no').setValue(workorder_no);
      this._workOrderService.workOredrcustomerData={}
    }
  }


  populateVehicle(){
    let viewable_attr={
      id:this.popupInputData.tripId,
      screen: "",
      sub_screen: ""
      }
      if(this._viewDetailsService.viewInfo){
       this.tripId=this._viewDetailsService.viewInfo.id;
      }

    this._companyTripGetApiService.getVehicleNewTripList(vehicleList=>{
      this._commonloaderservice.getHide();
      this.vehicleList = vehicleList;
      this._activeRoute.params.subscribe((params) => {
        const vehicleId = params.vehicle_id;
        if(vehicleId){
          this.isVehicleId = true;
        }
        const vehicle = getObjectFromListByKey('id', vehicleId, this.vehicleList)
        if (vehicle) {
          this.newAddTripForm.get('c_vehicle').setValue(vehicle.id)
          this.newAddTripForm.get('create_new').setValue(false)
          this.initialDetails.vehicle = {label: vehicle.reg_number, id: vehicle.id}
          this.disableVehicleField = true;
          this.onVehicleChange();
          if(this._viewDetailsService.viewInfo){
            if(this._viewDetailsService.viewInfo.id){
              this._newTripService.getPrefillLoopData(this._viewDetailsService.viewInfo.id).subscribe(data=>{
                this._viewDetailsService.viewInfo =viewable_attr;
                if(data['result']['driver']){
                  this.newAddTripForm.get('c_driver').setValue(data['result']['driver']['id']);
                  this.initialDetails.driver ={label:data['result']['driver']['display_name']};
                }
                // if(data['result']['route_code']['route_code_name']){

                //   this.onChangePrefillType('r-code');
                //   this.initialValues.tripCodes ={label:'Route Code'};
                //   this.initialValues.routeCodes ={label:data['result']['route_code'].route_code_name};
                //   this.initialValues.tripcodeList = {label:data['result']['trip_code'].trip_code_name};
                //   this.newAddTripForm.get('route_code').setValue(data['result']['route_code'].route_code_id);
                //   this.newAddTripForm.get('trip_code').setValue(data['result']['trip_code'].trip_code_id);
                //   this.onChangeRouteCode(data['result']['route_code'].route_code_id);
                //   setTimeout(() => {
                //     this.onChangeTripCode(data['result']['trip_code'].trip_code_id);
                //   }, 1000);
                // }
              })
            }
          }

        }
      });
    })
  }

  getFormValid() {

    return{
      clientFreight:true,
      vehileFreight:true,
      fuelSelf:true,
      fuelMarket:true,
      fuelParty:true,
      otherExpense:true,
      chargePartyAddTobill:true,
      chargePartyReduceToBill:true,
      chargeVehicleProviderAddToBill:true,
      chargeVehicleProviderReduceToBill:true,
      partyAdvance:true,
      vehicleProviderAdvance:true,
      driverAllowanceSelf:true,
      driverAllowanceParty:true,
    }
  }

  getTabFilled(){
    return{
      clientFreight:false,
      vehileFreight:false,
      fuelSelf:false,
      fuelMarket:false,
      fuelParty:false,
      otherExpense:false,
      chargePartyAddTobill:false,
      chargePartyReduceToBill:false,
      chargeVehicleProviderAddToBill:false,
      chargeVehicleProviderReduceToBill:false,
      partyAdvance:false,
      vehicleProviderAdvance:false,
      driverAllowanceSelf:false,
      driverAllowanceParty:false,
    }
  }


  buildForm(){
    this.newAddTripForm = this._fb.group({
      c_vehicle:['',Validators.required],
      customer:['',Validators.required],
      c_driver:null,
      loop_id:[''],
      start_kms:[0],
      company_trip_id:[''],
      lr_no:[''],
      transporter_trip_id:[''],
      billing_name:'',
      billing_name_market:'',
      vehicle_provider:[''],
      est_pod_receivable_term:[-1],
      from_loc:['',Validators.required],
      to_loc:['',Validators.required],
      error_message:'',
      start_date: [moment(new Date(dateWithTimeZone())), [Validators.required]
      ],
      client_freights:[[]],
      vehicle_freights:[[]],
      fuel_advances:[[]],
      estimated_pod_received_date:[null],
      fuel_self:[[]],
      other_expenses:[[]],
      driver_allowances:[[]],
      is_to_pay:[false],
      party_add_bill_charges:[[]],
      party_reduce_bill_charges:[[]],
      vp_add_bill_charges:[[]],
      vp_reduce_bill_charges:[[]],
      vp_advances:[[]],
      party_advances:[[]],
      customer_driver_allowance:0.00,
      estimated_kms:[''],
      is_transporter:false,
      client_freights_type:'',
      vehicle_freights_type:'',
      is_pod_receivable: false,
      create_new: true,
      trip_code:null,
      total_fuel_purchased:0,
      total_fuel_party_advance:0,
      total_fuel_stock:0,
      fuel_consumed:0,
      change_in_fuel_stock:0,
      route_code:null,
      work_order_no: "",
    estimated_durations: this._fb.group({
      day:['',[Validators.pattern(this.pattern)]],
      hour: [''],

  }),
  other_details: this._fb.array([]),
    })
  }

  billingDropDownChange(){
    // drop down change
    this.isClientFrightValid.next(true);
    this.selectedDropdown =this.newAddTripForm.get('billing_name').value;
  }

  billingDropDownChangeMarket(){
    // drop down change
    this.isVehileFreightValid.next(true);
    this.selectedDropdownMarket =this.newAddTripForm.get('billing_name_market').value;
  }

  updateCalcs(event){
    this.estimatePodMinDate = new Date( this.newAddTripForm.get('start_date').value);
    this.newAddTripForm.get('estimated_pod_received_date').setValue(null);
    this.newAddTripForm.get('est_pod_receivable_term').setValue(-1);
    this.initialDetails.podPaymentTerm={};
    this.getFuelStock();
 }
 updatePodDate(e){
  this.newAddTripForm.get('est_pod_receivable_term').setValue(6);
  this.initialDetails.podPaymentTerm={label:"Custom"};
 }

 podReceived(){

   if(this.newAddTripForm.get('is_pod_receivable').value){
    this.isEstimatedPod = true
   }else{
    this.isEstimatedPod = false;
    this.initialDetails.podPaymentTerm={};
    this.newAddTripForm.get('estimated_pod_received_date').setValue(null);
    this.newAddTripForm.get('est_pod_receivable_term').setValue(-1);
   }

 }


addErrorClass(controlName: AbstractControl) {
  return TransportValidator.addErrorClass(controlName);
}

openAddPartyModal($event,type) {
  if ($event)
  {
    if(type=='client'){
      this.vendor=false;
    }else{
      this.vendor=true;
    }
    this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
  }
  else{
    this.showAddPartyPopup = {name: this.partyNamePopup, status: true}
  }
}

addValueToPartyPopup(event,partyType){
  if (event) {
    const val = trimExtraSpaceBtwWords(event);
    const arrStr = val.toLowerCase().split(' ');
    const titleCaseArr:string[] = [];
    for (const str of arrStr) {
      titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
    }
    const word_joined = titleCaseArr.join(' ');
    this.partyNamePopup = word_joined;
    this.partyType = partyType;
    }
}
/* Displaying the customer name  */
addPartyToOption($event) {

  if ($event.status && this.partyType == this.vehicleprovider) {
    this.getVehicleProviderDetails();
    this.initialDetails.vehicle_provider = {value: $event.id, label: $event.label};
    this.newAddTripForm.get('vehicle_provider').setValue($event.id);
  }
  if($event.status && this.partyType == this.billingParty){
    this.initialDetails.customer = {value: $event.id, label: $event.label};
    this.newAddTripForm.get('customer').setValue($event.id);
    this.getPartyTripDetails();
  }

}
getVehicleProviderDetails(){
  this._companyTripGetApiService.getPartyTripDetails('0,2','1',partyList=>{this.partyListVendor=partyList});
}

 /* After closing the modal to clear all the values */
 closePartyPopup(){
  this.showAddPartyPopup = {name: '', status: false};
  this.vendor=false;

}

addParamsToDriver($event) {
  this.addDriverParams = {
    driver_name: $event
  };
}
getAndSetDriver($event){
  if ($event){
    this._lorryChallanGetService.getDriverDetailDrivers(driverList=>{
      this.transporterDriverList=driverList;
      if ($event.id) {
        this.initialDetails.driver = {value: $event.id, label: $event.label};
        this.newAddTripForm.get('c_driver').setValue($event.id);
      }
    });
  }
}


getPartyTripDetails(){
  this._companyTripGetApiService.getPartyTripDetails('','0',partyList=>{this.partyList=partyList})
}

getInitialDetails(){
  this._partyService.getPartyList('0', '1').subscribe((response) => {
    this.vendorList = response.result;
  });
  this._companyTripGetApiService.getPartyTripDetails('0,2','1',partyList=>{this.partyListVendor=partyList});
  this._companyTripGetApiService.getPartyTripDetails('0,1','1',partyList=>{this.selfFuelVendorList=partyList});
  this._companyTripGetApiService.getClientExpenseAccounts(accountListObjCb=>{
    this.advanceClientAccountList = accountListObjCb.advanceClientAccountList;
    this.fuelClientAccountList = accountListObjCb.fuelClientAccountList;
    this.battaClientAccountList = accountListObjCb.battaClientAccountList;
  });
  this._companyTripGetApiService.getEmployeeList(employeeList=>{
    this.employeeList = employeeList;
    this.driverList =filterDriver(this.employeeList);
    this.helperList =filterHelper(this.employeeList);
  });

  this._companyTripGetApiService.getStaticOptions(staticOptionObject=>{
    this.unitOptionList=staticOptionObject.unitOptionList;
    this.tripEmployeeTypeList=staticOptionObject.tripEmployeeTypeList;
    this.paymentStatus =staticOptionObject.paymentStatus;
    this.expenseTypeList=staticOptionObject.expenseType;
    this.chargedAddBillType=staticOptionObject.chargedAddBillType
    this.chargedReducedBillType=staticOptionObject.chargedReducedBillType
   });
   this._companyTripGetApiService.getMaterials(materialList=>{
    this.materialList=materialList
    this.materialList.forEach(item =>{
      this.materialOptionsList.push({
        display:item.name,
         value:item.id
      })
    })
  });
   this._companyTripGetApiService.getAccounts(this.accountType ,accountList=>{ this.accountList = accountList });
   this._companyTripGetApiService.getexpenseAccountList(expenseAccountList=>{ this.expenseAccountList=expenseAccountList});
   this._companyTripGetApiService.getTransporterDrivers(transporterDriverList=>{ this.transporterDriverList=transporterDriverList});

   this._preferenceService.settings().subscribe(data => {
    this.predefinedFields=data.result;
     this.displayPodReceived = data.result['pod_received'];
     this.estimatedKM=data.result['estimated_km'];
     this.estimatedDuration=data.result['estimated_duration'];
     if (data.result['pod_received']) {
      this.newAddTripForm.get('is_pod_receivable').setValue(true);
      this.podReceived();
     }
   })
}

setFormGlobalErrors() {
  this.globalFormErrorList = [];
  let errorIds = Object.keys(this.possibleErrors);
  for (let prop of errorIds) {
      const error = this.possibleErrors[prop];
      if (error.status == true) {
        this.globalFormErrorList.push(error.message);
      }
  }
}

clientBilling(data:outputData,option){
  this.newAddTripForm.get('client_freights').setValue(data['allData']);
  this.newAddTripForm.get('client_freights_type').setValue(option);
  this.isFormValid.clientFreight = data['isFormValid'];
}


onVehicleChange(){
this.isTripCodeChange = false;
this.isTabFieldFilled = this.getTabFilled();
this.isFormValid = this.getFormValid();
this.isFormError = this.getFormValid();
this.clearAllDataService();
this.initialValues.routeCodes ={};
this.initialValues.tripcodeList={};
this.newAddTripForm.get('route_code').setValue(null);
this.newAddTripForm.get('trip_code').setValue(null);
this.initialValues.tripCodes={label: 'Trip Code'};
this.isVehicleChange =true;
this.isTripCodeChange = true;
let vehicleId = this.newAddTripForm.get('c_vehicle').value;
const createNew = this.newAddTripForm.get('create_new').value;
let selectedVehicle=[];
selectedVehicle = this.vehicleList.filter(item =>item.id ==vehicleId);
this.isTransporterTrip = selectedVehicle[0].is_transporter;
this.newAddTripForm.get('is_transporter').setValue(this.isTransporterTrip)
this.tabSetting();
if(!this.isTransporterTrip){
  this.driverListCompanyOrTransporter = this.driverList
}else{
  this.driverListCompanyOrTransporter= this.transporterDriverList;
}
if(this.isTransporterTrip){
  this.newAddTripForm.get('vehicle_provider').setValidators([Validators.required])
}else{
  this.newAddTripForm.get('vehicle_provider').setValidators([Validators.nullValidator])
}
this.newAddTripForm.get('vehicle_provider').updateValueAndValidity();
if(selectedVehicle[0].driver_id){
  this.newAddTripForm.get('c_driver').setValue(selectedVehicle[0].driver_id);
  this.initialDetails.driver = {label:selectedVehicle[0].driver_name};
  if(this.newAddTripForm.get('c_driver').value){
    let foremenData =[];
    foremenData =this.driverListCompanyOrTransporter.filter( item => item.id ==this.newAddTripForm.get('c_driver').value);
    if(foremenData.length>0){
      this.foremanName =foremenData[0].foreman
    }

  }

}else{
  this.initialDetails.driver = getBlankOption();
  this.newAddTripForm.get('c_driver').setValue(null);
}
let payloadBody={
  is_transporter: this.isTransporterTrip, vehicle:vehicleId,
  create_new: createNew,
  trip_id:this.tripId?this.tripId:null
}
this._companyTripGetApiService.getVehicleLoopID(payloadBody,vehiclesLoopDetails=>{
    this.newAddTripForm.get('loop_id').setValue(vehiclesLoopDetails.loop_id);
    if(this.isTransporterTrip){
      this.newAddTripForm.get('transporter_trip_id').setValue(vehiclesLoopDetails.trip_id);
    }else{
      this.newAddTripForm.get('company_trip_id').setValue(vehiclesLoopDetails.trip_id);

    }
});
this.getFuelStock();
setTimeout(() => {
  this.isVehicleChange= false;
  this.clearAllDataService();
  this.prefillDriverSelf();
}, 10);
}





setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
  group.markAsTouched();
  for (let i in group.controls) {
    if (group.controls[i] instanceof UntypedFormControl) {
      group.controls[i].markAsTouched();
    } else {
      this.setAsTouched(group.controls[i]);
    }
  }
}
tripFuelOutPutData(data){
  let form = this.newAddTripForm;
   form.get('total_fuel_purchased').setValue(data['fuel_purchesed']);
   form.get('total_fuel_party_advance').setValue(data['party_advance']);
   form.get('total_fuel_stock').setValue(data['total']);
   form.get('fuel_consumed').setValue(data['trip_fuel']);
   form.get('change_in_fuel_stock').setValue(data['change_on_stock']);
}
marketVehicleBilling(data:outputData,option){
  this.newAddTripForm.get('vehicle_freights').setValue(data['allData']);
  this.newAddTripForm.get('vehicle_freights_type').setValue(option);
  this.isFormValid.vehileFreight = data['isFormValid'];
}

selfFuelData(dataFormSelfFuel:outputData){
  this.isFormValid.fuelSelf= dataFormSelfFuel['isFormValid'];
  let selfFuelData =[];
  if(dataFormSelfFuel['allData'].length>0){
    selfFuelData = JSON.parse(JSON.stringify(dataFormSelfFuel['allData']));
    selfFuelData.forEach(ele => {
      if(ele['payment_mode']=="paid_By_Driver"){
        ele['is_driver_paid'] = true;
        ele['payment_mode'] = null;
      }
    });
  }
  if(this.isFormValid.fuelSelf&& dataFormSelfFuel['allData'].length>0){
    setTimeout(() => {
      if(this.isTransporterTrip){
          this.isTabFieldFilled.fuelMarket = true
      }else{
        this.isTabFieldFilled.fuelSelf= true
      }
    }, 1000);
  }else{
    if(this.isTransporterTrip){
      this.isTabFieldFilled.fuelMarket = false
    }else{
      this.isTabFieldFilled.fuelSelf= false
    }
  }
  this.newAddTripForm.get('fuel_self').setValue(selfFuelData);

  if(!this.isTransporterTrip){
    let fuelQuantity =0;
    if(selfFuelData.length>0){
      selfFuelData.forEach(item=>{
        fuelQuantity = fuelQuantity + Number(item['fuel_quantity'])
      });
      this.fuelPurchesed = Number(fuelQuantity)
    }
  }
}

partyAdvance(dataFromFuelParty:outputData){
    this.newAddTripForm.get('fuel_advances').setValue(dataFromFuelParty['allData']);
  this.isFormValid.fuelParty= dataFromFuelParty['isFormValid'];
  if(this.isFormValid.fuelParty && dataFromFuelParty['allData'].length>0){
    this.isTabFieldFilled.fuelParty= true;
  }else{
    this.isTabFieldFilled.fuelParty= false;
  }
  if(!this.isTransporterTrip){
   this.partyAdvanceTripFuel=0;
   let fuelQuantity =0;
   if(dataFromFuelParty['allData'].length>0){
     dataFromFuelParty['allData'].forEach(item=>{
      fuelQuantity =fuelQuantity+ Number(item['fuel_quantity'])
     })
   }
   this.partyAdvanceTripFuel =Number( fuelQuantity)
  }
}

selfDriver(dataFromSelfDriver:outputData){
  let selfDriverData =[];
  if( dataFromSelfDriver['allData'].length>0){
    selfDriverData = JSON.parse(JSON.stringify(dataFromSelfDriver['allData']));
    selfDriverData.forEach(ele => {
     if(ele['account']=="paid_by_driver"){
       ele['is_driver_paid'] = true;
       ele['account'] = null;
     }
   });
 }
  this.newAddTripForm.get('driver_allowances').setValue(selfDriverData);
  this.isFormValid.driverAllowanceSelf = dataFromSelfDriver['isFormValid'];
  if(this.isFormValid.driverAllowanceSelf && dataFromSelfDriver['allData'].length>0){
    this.isTabFieldFilled.driverAllowanceSelf = true;
  }else{
    this.isTabFieldFilled.driverAllowanceSelf = false;
  }
}

dataFromDriverAdvance(dataFromDriverAdvance:outputData){
  if(this.companyAdvance.batta_op){
    this.newAddTripForm.get('customer_driver_allowance').setValue(dataFromDriverAdvance['allData'][0]['customer_driver_allowance']);
  }
  this.isFormValid.driverAllowanceParty = dataFromDriverAdvance['isFormValid'];
  if( this.isFormValid.driverAllowanceParty && Number(dataFromDriverAdvance['allData'][0]['customer_driver_allowance'])>0 ){
    this.isTabFieldFilled.driverAllowanceParty = true;
  }else{
    this.isTabFieldFilled.driverAllowanceParty = false;
  }

}

dataFromTripOthers(dataFromTripOthers:outputData){

  let  expenseOthers = [];
  if( dataFromTripOthers['allData'].length>0){
    expenseOthers = JSON.parse(JSON.stringify(dataFromTripOthers['allData']));
    expenseOthers.forEach(ele => {
      if(ele['payment_mode']=="paid_By_Driver"){
        ele['is_driver_paid'] = true;
        ele['payment_mode'] = null;
      }
   });
    this.isTabFieldFilled.otherExpense = true;

 }
 if(!dataFromTripOthers['isFormValid']){
  this.isTabFieldFilled.otherExpense = false;
 }
   this.newAddTripForm.get('other_expenses').setValue(expenseOthers)
   this.isFormValid.otherExpense =dataFromTripOthers['isFormValid']
}

vehicleProviderAddToBill(vehicleProviderAddToBill:outputData){
  this.isFormValid.chargeVehicleProviderAddToBill = vehicleProviderAddToBill['isFormValid']
  this.newAddTripForm.get('vp_add_bill_charges').setValue(vehicleProviderAddToBill['allData']);
  if(this.isFormValid.chargeVehicleProviderAddToBill && vehicleProviderAddToBill['allData'].length>0){
    this.isTabFieldFilled.chargeVehicleProviderAddToBill= true;
   }else{
     this.isTabFieldFilled.chargeVehicleProviderAddToBill= false;
   }
}

partyAddToBill(partyAddToBill:outputData){
  this.isFormValid.chargePartyAddTobill = partyAddToBill['isFormValid']
  this.newAddTripForm.get('party_add_bill_charges').setValue(partyAddToBill['allData']);
  if(this.isFormValid.chargePartyAddTobill && partyAddToBill['allData'].length>0){
   this.isTabFieldFilled.chargePartyAddTobill = true;
  }else{
    this.isTabFieldFilled.chargePartyAddTobill = false;
  }
 }

partyReduceBill(partyReduceBill:outputData){
  this.isFormValid.chargePartyReduceToBill = partyReduceBill['isFormValid'];
  this.newAddTripForm.get('party_reduce_bill_charges').setValue(partyReduceBill['allData']);
  if(this.isFormValid.chargePartyReduceToBill && partyReduceBill['allData'].length>0){
    this.isTabFieldFilled.chargePartyReduceToBill = true;
   }else{
     this.isTabFieldFilled.chargePartyReduceToBill = false;
   }
  }

vendorReduceBill(vendorReduceBill:outputData){
  this.isFormValid.chargeVehicleProviderReduceToBill = vendorReduceBill['isFormValid'];
  this.newAddTripForm.get('vp_reduce_bill_charges').setValue(vendorReduceBill['allData']);
  if(this.isFormValid.chargeVehicleProviderReduceToBill && vendorReduceBill['allData'].length>0){
    this.isTabFieldFilled.chargeVehicleProviderReduceToBill = true;
   }else{
     this.isTabFieldFilled.chargeVehicleProviderReduceToBill = false;
   }
  }

partyAdvanceDetails(partyAdvanceDetails:outputData){
  this.isFormValid.partyAdvance = partyAdvanceDetails['isFormValid'];
  if(this.companyAdvance.cash_rc_op){
    this.newAddTripForm.get('party_advances').setValue(partyAdvanceDetails['allData']);
  }
  if(this.isFormValid.partyAdvance && partyAdvanceDetails['allData'].length>0){
    this.isTabFieldFilled.partyAdvance =true;
  }else{
    this.isTabFieldFilled.partyAdvance = false;
  }
}

vehicleAdvance(vehicleAdvance:outputData){
   this.isFormValid.vehicleProviderAdvance = vehicleAdvance['isFormValid']
   this.newAddTripForm.get('vp_advances').setValue(vehicleAdvance['allData']);
   if(this.isFormValid.vehicleProviderAdvance && vehicleAdvance['allData'].length>0 ){
     this.isTabFieldFilled.vehicleProviderAdvance = true;
   }else{
     this.isTabFieldFilled.vehicleProviderAdvance = false;
   }

}

onDateTimeChange(fg: UntypedFormGroup){

  fg.get('value').setValue(changeDateTimeToServerFormat(fg.get('value').value));
}

ngOnDestroy() {
  this._commonloaderservice.getShow();
}

saveTrip(){
  this.isAllSubFormValid = true;
  this.processCutsomFieldData(this.newAddTripForm, 'other_details')
  let form = this.newAddTripForm
  console.log(form.value['start_date'])
  form.value['start_date']= changeDateTimeToServerFormat(form.value['start_date']);
  form.value['estimated_pod_received_date']= changeDateToServerFormat(form.value['estimated_pod_received_date']);
  this.checkFormValid();

  if(form.valid&& this.isAllSubFormValid){
    if(this.isClientBillingDisabled && this.workOrderValue['workorder_type']==1){
    let total_units = parseInt(form.get('client_freights').value[0].total_units)
    if(this.workOrderValue['balance']<total_units){
      this.popupWorkOrderInputDataSave={
        'msg': 'The Quantity mentioned in the Trip '+ total_units +' is greater than the Remaining Quantity '+ this.workOrderValue['balance'] +' of the Work order, Do you still want to Continue to Create the Trip?',
        'type': 'warning-work-order',
        'show': true,
      }
    }else{
     // this.saveTripAPI();
    }
    }else{
      if(form.value['c_driver']){
       // this.saveTripAPI();
      }else{
        if(this.isTransporterTrip){
         // this.saveTripAPI();
        }else{
          if(form.value['driver_allowances'].length){
          //  this.checkDriverAllowances(form.value['driver_allowances']);
          }else{
           // this.saveTripAPI();
          }
        }

      }


    }

 }else{
  this.setAsTouched(form);
  this.setFormGlobalErrors();
  console.log(this.isFormValid)
  this.isFormError = this.isFormValid;
  this.showFormErrorInSubFields();
  this.isFromToInvalid.next(false);
  console.log(form,this.isFormError)
 }
}


clearAllDataService(){
  this.fuelPurchesed =0.00;
  this.partyAdvanceTripFuel =0.00;
   this._dataService.advanceData =[];
   this._dataService.chargeData =[];
   this._dataService.otherExpenseData =[];
   this._dataService.partyAdvanceDataDeriver ='';
   this._dataService.partyAdvanceFuelData =[];
   this._dataService.partychargeData =[];
   this._dataService.reduceChargeData =[];
   this._dataService.selfDriverData =[];
   this._dataService.selfFuelData =[];
   this._dataService.transporterreduceChargeData =[];
   this._dataService.vehicleProvideradvanceData =[];
}




onChangePrefillType(value){
  if (value == "t-code") {
    this.isTripCodeSelected = true;
    this.tripCodes = JSON.parse(JSON.stringify(this.allTripsCodeList));
    this.initialValues.routeCodes ={};
    this.initialValues.tripcodeList={}
  }else{
    this.tripCodes =[];
    this.isTripCodeSelected = false;
    this.isTripCodeChange = false;
  }
  setTimeout(() => {
    this.isTripCodeChange = true;
    this.isTabFieldFilled = this.getTabFilled();
    this.isFormValid = this.getFormValid();
    this.isFormError = this.getFormValid();
    this.clearAllDataService();
  }, 100);
}

onChangeRouteCode(value){
   if(value){
     let tripCodes= this.routeCodeList.filter(item =>item.id ==value)[0];
     this.tripCodes = tripCodes.trip_codes;
     setTimeout(() => {
      this.isTripCodeChange = true;
      this.isTabFieldFilled = this.getTabFilled();
      this.isFormValid = this.getFormValid();
      this.isFormError = this.getFormValid();
      this.clearAllDataService();
    }, 100);
   }
}

onpaymentTermSelected(value){
  if(value=='2'||value=='3'){
    let dateValue=  podTripCalculator(this.newAddTripForm.controls.start_date.value,Number(value));
    this.newAddTripForm.get('estimated_pod_received_date').setValue(dateValue);
  }else{
    this.newAddTripForm.get('estimated_pod_received_date').setValue(null);
  }

}

selectedTripCode(id){
  let tripCodes= this.tripCodes.filter(item =>item.id ==id)[0];
  this.initialValues.tripcodeList ={value:tripCodes.trip_code,label:tripCodes.trip_code}
}

onChangeTripCode(value){
  if(value){
    this.isTripCodeChange = false;
    this.fuelPurchesed =0.00;
    this.partyAdvanceTripFuel =0.00;
    this.selectedTripCode(value)
  }
}

patchTripValuesFromTripCode(data){
  this.isTripCodeGotId = true;
  this.newAddTripForm.get('estimated_durations').patchValue(data['estimated_durations']);
  this.newAddTripForm.get('estimated_kms').patchValue(data['estimated_kms']);
  if(data.from_loc){
    this.newAddTripForm.get('from_loc').setValue(data.from_loc);
    this.fromData = data.from_loc;
  }

  if(data.to_loc){
    this.newAddTripForm.get('to_loc').setValue(data.to_loc.id);
    this.toData =data.to_loc;
  }
  this.editCustomerFreightData = data.client_freights;
  if(this.editCustomerFreightData.length > 0){
    this.selectedDropdown = ""
    setTimeout(() => {
      const clientFreightType = getObjectFromListByKey('value', String(this.editCustomerFreightData[0].freight_type), this.billingTypes);
      if(clientFreightType){
        this.selectedDropdown = clientFreightType.name;
        this.initialValues.billingDropdown = {value:'',label:clientFreightType.label}
        this.newAddTripForm.get('client_freights_type').setValue(clientFreightType.value);
        this.newAddTripForm.get('client_freights').setValue(data.client_freights)
      }
    }, 1000);
  }

  this.newAddTripForm.get('is_pod_receivable').setValue(data.is_pod_receivable);
  this.podReceived();
  this._dataService.partyAdvanceFuelData = data.fuel_advances;
  this.newAddTripForm.get('fuel_advances').setValue(data.fuel_advances);
  this._dataService.partyAdvanceDataDeriver = data.customer_driver_allowance;
  this._dataService.reduceChargeData = data.party_reduce_bill_charges;
  this._dataService.partychargeData = data.party_add_bill_charges;
  this._dataService.advanceData = data.party_advances;
  this._dataService.otherExpenseData = data.other_expenses
  if(data.fuel_advances.length>0){
    this.isTabFieldFilled.fuelParty= true;
  }
  if(!this.isTransporterTrip){

    if(data.driver_allowances.length>0){
      this.newAddTripForm.get('driver_allowances').setValue(data.driver_allowances)
      data.driver_allowances.forEach(ele => {
        ele['paid'] = ele['amount']
        if(ele.is_driver_paid){
          ele['account']= 'paid_By_Driver'
        }else{
          ele['account'] = ele['payment_mode']
        }
      });
      this.driverSelf = data.driver_allowances;
      this.prefillDriverSelf();
    }
    if(data.customer_driver_allowance > 0){
      this.isTabFieldFilled.driverAllowanceParty = true;
      if(this.companyAdvance.batta_op){
        this.newAddTripForm.get('customer_driver_allowance').setValue(data.customer_driver_allowance)
      }
    }
  }

  if(data.party_advances.length > 0){
    this.isTabFieldFilled.partyAdvance = true;
    if(this.companyAdvance.cash_rc_op){
      this.newAddTripForm.get('party_advances').setValue(data.party_advances)
    }
  }
  if(data.party_add_bill_charges.length > 0){
    this.isTabFieldFilled.chargePartyAddTobill = true;
    this.newAddTripForm.get('party_add_bill_charges').setValue(data.party_add_bill_charges)

  }
  if(data.party_reduce_bill_charges.length > 0){
    this.isTabFieldFilled.chargePartyReduceToBill = true;
    this.newAddTripForm.get('party_reduce_bill_charges').setValue(data.party_reduce_bill_charges)

  }

  if(data.other_expenses.length > 0){
    this.isTabFieldFilled.otherExpense = true;
    this.newAddTripForm.get('other_expenses').setValue(data.other_expenses)
  }

  if(this.isTransporterTrip){
    this.isFormValid.driverAllowanceSelf = true;
    if(data.market_fuel_expense.length>0){
      this.isTabFieldFilled.fuelMarket = true
      this.activeTab = 0;
      this._dataService.selfFuelData = data.market_fuel_expense;
      setTimeout(() => {
        this.activeTab = 1;
      }, 1000);
      if(this.companyAdvance.fuel_op){
        this.newAddTripForm.get('fuel_self').setValue(data.fuel_self)
      }
    }
    this._dataService.vehicleProvideradvanceData = data.vp_advances;
    if(data.vp_advances.length > 0){
       this.isTabFieldFilled.vehicleProviderAdvance = true;
      if(this.companyAdvance.cash_op){
        this.newAddTripForm.get('vp_advances').setValue(data.vp_advances)
      }
    }

    this._dataService.chargeData = data.vp_add_bill_charges
    this._dataService.transporterreduceChargeData = data.vp_reduce_bill_charges;
    if(data.vp_add_bill_charges.length > 0){
      this.isTabFieldFilled.chargeVehicleProviderAddToBill= true;
      this.newAddTripForm.get('vp_add_bill_charges').setValue(data.vp_add_bill_charges)
    }
    if(data.vp_reduce_bill_charges.length > 0){
      this.isTabFieldFilled.chargeVehicleProviderReduceToBill = true;
      this.newAddTripForm.get('vp_reduce_bill_charges').setValue(data.vp_reduce_bill_charges)

    }

    this.editMarketFreightData = data.vehicle_freights;
    if(this.editMarketFreightData.length > 0){
      this.selectedDropdownMarket = "";
      setTimeout(() => {
        const vehicleFreightType = getObjectFromListByKey('value', String(this.editMarketFreightData[0].freight_type), this.billingTypes);
        if(vehicleFreightType){
          this.selectedDropdownMarket = vehicleFreightType.name;
          this.initialValues.vehicleFrightDropDown = {value:'',label:vehicleFreightType.label}
          this.newAddTripForm.get('vehicle_freights_type').setValue(vehicleFreightType.value)
          this.newAddTripForm.get('vehicle_freights').setValue(data.vehicle_freights)
        }
      }, 1000);
    }
  } else {
    if(data.company_fuel_expense.length>0){
      if(this.foremanName){
        this.isTabFieldFilled.fuelSelf= false;
      }else{
        this.isTabFieldFilled.fuelSelf= true;
      }
      this.activeTab = 0;
      this._dataService.selfFuelData = data.company_fuel_expense;
      setTimeout(() => {
        this.activeTab = 1;
      }, 1000);

    }

  }
}

checkFormValid(){
  for (const key in this.isFormValid) {
    if (Object.prototype.hasOwnProperty.call(this.isFormValid, key)) {
      const element = this.isFormValid[key];
       if(!element){
         this.isAllSubFormValid = false;
         return
       }
    }
  }
}


confirmButton(isTrue){
  if(isTrue){
     let queryParms='?pdfViewId='+this.popupInputData.tripId
      let url = getPrefix()+"/trip/new-trip/list" +queryParms;
      this._route.navigateByUrl(url);
  }else{
    this.initialDetails.vehicle={}
    this.newAddTripForm.get('c_vehicle').setValue(null)
  }
}

openAddVehicle(event){
  if(event){
    this.vehicleAddPopup = {name: this.vehicleNamePopup, status: true};
  }
}
addValueToVehiclePopUp(event){

  if (event) {
    const val = trimExtraSpaceBtwWords(event);
    const arrStr = val.toLowerCase().split(' ');
    const titleCaseArr:string[] = [];
    for (const str of arrStr) {
      titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
    }
    const word_joined = titleCaseArr.join(' ');
       this.vehicleNamePopup = word_joined;
    }
}

addNewVehicle(newVehicleData){
  console.log(newVehicleData)

  if(newVehicleData.isNewVehicle){
    this._companyTripGetApiService.getVehicleNewTripList(vehicleList=>{
      this.vehicleList = vehicleList;
      this.newAddTripForm.get('c_vehicle').setValue(newVehicleData.vehicle.id);
      this.initialDetails.vehicle = {value:'',label:newVehicleData.vehicle.reg_number};
      if(newVehicleData.isTransporter){
        this._companyTripGetApiService.getTransporterDrivers(transporterDriverList=>{ this.transporterDriverList=transporterDriverList
        this.onVehicleChange()});
      }else{
        this._companyTripGetApiService.getEmployeeList(employeeList=>{
          this.employeeList = employeeList;
          this.driverList =filterDriver(this.employeeList);
          this.onVehicleChange()
        });
      }
    });
  }
}

prefillDriverSelf(){
    this.isDrverselfChanged = false;
    if(this.newAddTripForm.get('c_driver').value){
      let driverData=[];
      driverData = this.driverListCompanyOrTransporter.filter( item => item.id ==this.newAddTripForm.get('c_driver').value)
      if(driverData.length>0){
        this.foremanName = driverData[0].foreman
      }
    }
    if(this.driverSelf.length>0){
      this.driverSelf.forEach(item=>{
        item['employee_type'] =this.employeeType,
        item['employee']=this.newAddTripForm.get('c_driver').value?this.newAddTripForm.get('c_driver').value:null
      })
      this._dataService.selfDriverData = this.driverSelf;
      setTimeout(() => {
        this.isDrverselfChanged = true;
        if(this.newAddTripForm.get('c_driver').value){
          if(this.foremanName){
            this.isTabFieldFilled.driverAllowanceSelf =false;
            this.isFormValid.driverAllowanceSelf = false;
          }else{
            this.isTabFieldFilled.driverAllowanceSelf =true;
            this.isFormValid.driverAllowanceSelf = true;
            this.isFormError.driverAllowanceSelf = true;
          }

        }else{
          this.isTabFieldFilled.driverAllowanceSelf =false;
          this.isFormValid.driverAllowanceSelf = false;
          this.isFormError.driverAllowanceSelf = false;
        }

      }, 1000);
    }else{
      let drivrSelfData =[{
        id: null,
        employee_type:this.employeeType,
        employee:this.newAddTripForm.get('c_driver').value?this.newAddTripForm.get('c_driver').value:null,
        month:-1,
        account:null,
        paid: 0,
        transaction_date:null,
        is_driver_paid:false
      }]
      this._dataService.selfDriverData = drivrSelfData;
      setTimeout(() => {
        this.isDrverselfChanged = true;
        this.isTabFieldFilled.driverAllowanceSelf =true;
        this.isFormValid.driverAllowanceSelf = true;
        this.isFormError.driverAllowanceSelf = true;
      }, 1000);
    }
}
onvendorSelected(e){
 if (isValidValue(e.target.value)) {
      this._partyService.getPartyAdressDetails(e.target.value).subscribe(
        res => {
          this.gstin =res.result.tax_details.gstin;
        });
    }
    this.getWorkOrderList(e.target.value);
    let workorderNumber =this.newAddTripForm.get('work_order_no').value
    if(workorderNumber){
      this.initialValues.workOrder ={ label: '',value: ''};
      this.newAddTripForm.get('work_order_no').setValue('');
      this.clearWorderDetails();
    }

  }
onvendor_Selected(e){
 if (isValidValue(e.target.value)) {
      this._partyService.getPartyAdressDetails(e.target.value).subscribe(
        res => {
          this.gst_in =res.result.tax_details.gstin;
        });
    }
  }
getPrefrences(){
  this._advances.getAdvances(this.KEY).subscribe(data=>{
    this.companyAdvance = data['result'];
    this.tabSetting()
  })
}

tabSetting(){
    if(!this.companyAdvance.fuel_op&&this.isTransporterTrip){
      this.activeFuelTab = 2;
    }
    if(!this.companyAdvance.fuel_op&&this.isTransporterTrip &&!this.companyAdvance.fuel_rc_op ){
      this.activeTab = 3;
    }
    if(this.companyAdvance.cash_op&&!this.companyAdvance.cash_rc_op&&this.isTransporterTrip){
      this.activeAdvanceTab=2;
    }
}

showFormErrorInSubFields(){
  this.isClientFrightValid.next(this.isFormError.clientFreight);
  this.isVehileFreightValid.next(this.isFormError.vehileFreight);
  this.isSelfFuelValid.next(this.isFormError.fuelSelf);
  this.isSelfDriverFormValid.next(this.isFormError.driverAllowanceSelf);
  this.isOtherExpenseFormValid.next(this.isFormError.otherExpense);
  this.isPartyAdvanceFuelFormValid.next(this.isFormError.fuelParty);
  this.isPartyAdvanceFormValid.next(this.isFormError.partyAdvance);
  this.isVehicleAdvanceFormValid.next(this.isFormError.vehicleProviderAdvance);
  this.isChargeAddToBillFormValid.next(this.isFormError.chargePartyAddTobill);
  this.isChargeReduceToBillFormValid.next(this.isFormError.chargePartyReduceToBill);
  this.isVehicleAddToBillFormValid.next(this.isFormError.chargeVehicleProviderAddToBill);
  this.isVehicleReduceToBillFormValid.next(this.isFormError.chargeVehicleProviderReduceToBill);

}

getFuelStock(){
  let vehicleId ='';
  let date ='';
  vehicleId =  this.newAddTripForm.get('c_vehicle').value;
  date = changeDateToServerFormat( this.newAddTripForm.get('start_date').value)
  if(date&&vehicleId)
  this._newTripService.getFuelStock(vehicleId,date).subscribe(data=>{
    this.fuelStock = data['result'].fuel_stock
  })
}

closeVideo(e){ this.dropdownVideos = e;}
outSideClick(env){}

getCustomFields() {
  this._tripCustomField.getCompanyTripFields(false).subscribe(data => {
    let allData = []
    if (!data['result'].display) { return }
    allData = data['result'].fields;
    this.VehicleTripCustomField = allData.filter(item => item.in_trip == true)
    this.addCustomFields(this.VehicleTripCustomField)
  });
}

addCustomFields(items: any = []) {
  const custom_field = this.newAddTripForm.get('other_details') as UntypedFormArray;
  custom_field.controls = [];
  items.forEach((item) => {
    const customForm = this.buildFields(item);
    custom_field.push(customForm);
  });
}


buildFields(items: any) {
  return this._fb.group({
    field: [items.id],
    field_label: [items.field_label, [items.mandatory ? Validators.required : Validators.nullValidator]],
    value: ['', [items.mandatory ? Validators.required : Validators.nullValidator]],
    mandatory: [items.mandatory],
    field_type: [items.field_type.data_type],
    option_list: [items['option_list'] ? items['option_list'] : []],
  })
}

processCutsomFieldData(tripForm: UntypedFormGroup, formcontrol) {
  const custom_field = tripForm.get(formcontrol) as UntypedFormArray;
  custom_field.controls.forEach((item) => {
    if (item.get('field_type').value == "checkbox") {
      if (item.get('value').value == "false" || item.get('value').value == false) {
        item.get('value').setValue('')
      }
    }
    if (item.get('field_type').value == "date") {
      item.get('value').setValue(changeDateToServerFormat(item.get('value').value))
    }

    if (item.get('field_type').value != "datetime") {
      item.get('value').setValue(item.get('value').value.toString())
    }

  });
}

onWorkOrderSelection(e){
  this._workOrderService.getWorkOrder(e).subscribe(data=>{
    this.workOrderValue = data['result'];
    this.showPopUpMsgForWorkOrder();
  });
}


setWorkOrder(e){
  let workorderNumber = [];
  workorderNumber=this.workOrderList.filter(item => item.workorder_no==e);
  if(e&& workorderNumber.length<=0){
    this.workOrderValue={};
    this.newAddTripForm.get('work_order_no').setValue(e);
    this.clearWorderDetails();
  }
}

clearWorderDetails(){
  this.initialDetails.consigner = getBlankOption();
  this.initialDetails.consignee = getBlankOption();
  this.newAddTripForm.get('from_loc').setValue(null);
  this.newAddTripForm.get('to_loc').setValue(null);
  this.mintripStartDate= new Date(null);
  this.isClientBillingDisabled = false;
  this.isTripCodeGotId = false;
  this.editCustomerFreightData=[];
  this.selectedDropdown =''
  setTimeout(() => {
  this.initialValues.billingDropdown = this.billingDropdown[0];
  this.newAddTripForm.get('billing_name').setValue(this.billingDropdown[0].value);
  this.selectedDropdown =this.newAddTripForm.get('billing_name').value;
  this.isClientFrightValid.next(true);
  }, 1000);
}

getWorkOrderList(id){
  this._workOrderService.getWorkOrderListByCustomerId(id).subscribe(data=>{
    this.workOrderList = data['result']
  })
}

showPopUpMsgForWorkOrder(){
  let currentDate = new Date(dateWithTimeZone());
  let workOrderEndDate = new Date(this.workOrderValue['workend_date']);
  if(this.workOrderValue['workend_date']){
    if (currentDate.getTime() > workOrderEndDate.getTime()){
      this.popupWorkOrderInputData={
        'msg': 'Work Order End Date is Past the Current Date, Do you still want to Continue to Create the Trip?',
        'type': 'warning-work-order',
        'show': true,
      }

    }
    else if(this.workOrderValue['workorder_type']==1  && this.workOrderValue['balance']<=0){
      this.popupWorkOrderInputData={
        'msg': 'This Work Order Is Fulfilled based on the Quantity Mentioned, Do you still want to Continue to Create the Trip?',
        'type': 'warning-work-order',
        'show': true,
      }
    }
    else if(this.workOrderValue['workorder_type']==3  && this.workOrderValue['balance']<=0){
      this.popupWorkOrderInputData={
        'msg': 'This Work Order Is Fulfilled based on the Trips Mentioned, Do you still want to Continue to Create the Trip?',
        'type': 'warning-work-order',
        'show': true,
      }
    }
    else{
      this.patchWorkOrderDetails();
    }
  }
  else{
    this.patchWorkOrderDetails();
  }


}

confirmWorkOrderButton(e){
  if(e){
    this.patchWorkOrderDetails();
  }else{
    this.newAddTripForm.get('work_order_no').setValue('');
    this.initialValues.workOrder ={ label: '',value: ''};
    this.workOrderValue={};
    this.clearWorderDetails();
  }
}

patchWorkOrderDetails(){
  this.editCustomerFreightData =[];
  this.newAddTripForm.get('work_order_no').setValue(this.workOrderValue['workorder_no']);
  this.mintripStartDate= new Date(this.workOrderValue['workstart_date']);

  if (this.workOrderValue['from_loc']) {
    this.newAddTripForm.get('from_loc').setValue(this.workOrderValue['from_loc']);
    this.fromData =this.workOrderValue['from_loc'];
  }

  if (this.workOrderValue['to_loc']) {
    this.newAddTripForm.get('to_loc').setValue(this.workOrderValue['to_loc']);
    this.toData =this.workOrderValue['to_loc'];
  }
  this.isClientBillingDisabled = true;
  if(this.workOrderValue['workorder_type']==1){
    this.editCustomerFreightData.push({
      rate:this.workOrderValue['unit_cost']
    });
    this.selectedDropdown='';
    this.isTripCodeGotId = true;
    setTimeout(() => {
      this.initialValues.billingDropdown= this.billingDropdown[this.workOrderValue['units']-1];
      this.newAddTripForm.get('billing_name').setValue(this.billingDropdown[this.workOrderValue['units']-1].value)
      this.isClientFrightValid.next(true);
      this.selectedDropdown =this.newAddTripForm.get('billing_name').value;
    }, 1000);

    if(!this.isTripFreight){
      let clientFrightData=this.getDefaultFright();
      clientFrightData.rate =this.workOrderValue['unit_cost']
      this.newAddTripForm.get('client_freights').setValue([clientFrightData])
      this.newAddTripForm.get('client_freights_type').setValue(this.workOrderValue['units'].toString());
      this.newAddTripForm.get('vehicle_freights').setValue([this.getDefaultFright()])
      this.newAddTripForm.get('vehicle_freights_type').setValue('1');
    }



  }else{
    this.selectedDropdown ='';
    this.editCustomerFreightData=[];
    this.isTripCodeGotId = false;
    setTimeout(()=>{
      this.initialValues.billingDropdown= this.billingDropdown[this.workOrderValue['billing_type'].index-1];
      this.newAddTripForm.get('billing_name').setValue(this.billingDropdown[this.workOrderValue['billing_type'].index-1].value)
      this.selectedDropdown =this.newAddTripForm.get('billing_name').value;
      this.isClientFrightValid.next(true);
      if(!this.isTripFreight){
        this.newAddTripForm.get('client_freights_type').setValue(this.workOrderValue['billing_type'].index.toString());
        this.newAddTripForm.get('client_freights').setValue([this.getDefaultFright()])
        this.newAddTripForm.get('vehicle_freights').setValue([this.getDefaultFright()])
        this.newAddTripForm.get('vehicle_freights_type').setValue('1');
      }
    },1000)

  }
}

saveTripAPI(){
  let form = this.newAddTripForm;
  if(!this.isTripFreight){
    if(!form.value['client_freights'].length){
      form.value['client_freights'] = [this.getDefaultFright()]
      form.value['client_freights_type'] ='1';
    }
    if(!form.value['vehicle_freights'].length && this.isTransporterTrip){
      form.value['vehicle_freights'] = [this.getDefaultFright()]
      form.value['vehicle_freights_type'] ='1';
    }
  }
   this._newTripService.postTrips(form.value).subscribe(response=>{
     if(this.isTransporterTrip){
      this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.MARKETVEHICLETRIP)
     }else{
      this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.OWNVEHICLETRIP)
     }
     let queryParms='?pdfViewId='+response['result']
     let url = getPrefix()+"/trip/new-trip/list" +queryParms;
     this._route.navigateByUrl(url);
   });
}

confirmWorkOrderSaveButton(e){
  if(e){
    let form = this.newAddTripForm
    if(form.value['driver_allowances'].length){
      this.checkDriverAllowances(form.value['driver_allowances']);
    }else{
      this.saveTripAPI();
    }
  }
}


checkDriverAllowances(driverAllowances){
    let driverList=[];
    driverList =driverAllowances.filter(item=>item.employee_type ==this.employeeType);
    if(driverList.length){
      let driverDetails =  this.driverListCompanyOrTransporter.filter(item=>item.id ==driverList[0].employee)
      if(driverDetails.length){
        this.driverId = driverList[0].employee;
        let driverName=driverDetails[0].display_name
        this.popupInputDataAssignDriver.msg=`Please Note: ${driverName} is not assigned to this Trip.Do you want to Assign ${driverName} to this Trip ?`
        this.popupInputDataAssignDriver.show=true;
      }else{
        this.saveTripAPI();
      }
    }else{
      this.saveTripAPI();
    }


}

getDefaultFright(){
  return {
    adjustment_amount: 0,
    charged_units: 0,
    extra_or_shortage_amount:0,
    extra_or_shortage_rate: 0,
    extra_or_shortage_units:0,
    freight_amount:0,
    id: null,
    is_editable: true,
    material: [],
    net_receivable: 0,
    rate:0,
    total_units:0,
    unloading_units: 0
  }
}

assignDriver(isTrue:boolean){
  if(isTrue){
    let form = this.newAddTripForm;
    form.value['c_driver'] = this.driverId;
  }
  this.saveTripAPI();
}

fromAdressData(data){
  this.isFromValid=data.valid;
  if(data.value['name']){
    this.newAddTripForm.get('from_loc').setValue(data.value)
  }else{
    this.newAddTripForm.get('from_loc').setValue(null)
  }
}

toAdressData(data){
  this.isToValid=data.valid;
  if(data.value['name']){
    this.newAddTripForm.get('to_loc').setValue(data.value)
  }else{
    this.newAddTripForm.get('to_loc').setValue(null)
  }
}

}
