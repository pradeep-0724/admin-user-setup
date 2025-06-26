import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorList } from 'src/app/core/constants/error-list';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { getBlankOption, trimExtraSpaceBtwWords, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateTimeToServerFormat, changeDateToServerFormat, podTripCalculator,  } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { filterDriver,  } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-utils';
import { TripConstants } from '../../constant';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { LorryChallanGetService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/lorry-challan-module/lorry-challan/lorry-challan-class/lorry-challan-get.service';
import { BehaviorSubject } from 'rxjs';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-edit-new-trip-first-section',
  templateUrl: './edit-new-trip-first-section.component.html',
  styleUrls: ['./edit-new-trip-first-section.component.scss'],
 
})
export class EditNewTripFirstSectionComponent implements OnInit {

@Input () editNewTripFirstSectionData:any;
tripStatus: any = new TripConstants().vehicleTripStatus;
newEditTripForm :UntypedFormGroup;
apiError ='';
globalFormErrorList: any = [];
possibleErrors = new ErrorList().possibleErrors;
errorHeaderMessage = new ErrorList().headerMessage;
initialDetails = {
  vehicleDetail: {},
  consignee: {},
  consigner: {},
  customer: {},
  podPaymentTerm:{},
  driver: {},
  vehicleProvider:{},
  isMonthlyPaymentModeSelected :[],
};
vehicleList =[];
partyList: any = [];
employeeList =[];
driverList =[];
consignorParams = {};
consigneeParams = {};
selectedDropdown = '';
selectedDropdownMarket ='';
partyNamePopup: string = '';
vendor: boolean=false;
showAddPartyPopup: any = {name: '', status: false};
partyPopupDropDownIndex:number=-1;
hours = new ValidationConstants().hours;
postDriverAPI: any = TSAPIRoutes.lorrychallan_driver;
minutes = new ValidationConstants().minutes;
addDriverParams: any = {};
partyListVendor =[];
isTransporterTrip =false;
initialValues ={
  billingDropdown :getBlankOption()
}
advanceClientAccountList = []
fuelClientAccountList = []
battaClientAccountList = []
helperList =[];
paymentStatus =[];
accountType = new ValidationConstants().accountType.join(',');
paymentTermList= new ValidationConstants().paymentTermList;
accountList =[];
expenseTypeList = [];
chargedAddBillType =[];
chargedReducedBillType =[];
materialOptionsList =[];
driverListCompanyOrTransporter=[];
transporterDriverList = [];
dateSelected :any;
tripId ='';
preFixUrl =''
showEndTripInputs: boolean = false;
isPodReceivable:boolean = false;
estimatedKM: boolean;
estimatedDuration: boolean;
estimatePodMinDate = new Date(dateWithTimeZone());
isPodReveived =false;
gstin = '';
estPodReceivableTerm;
estimatedPodReceivedDate;
onStock = 0;
ischangeInstockPositive=false;
isDisabledFields=false;
isLRNumberDisabled= false;
disablePartyWorkOrder = false;
fromData;
toData;
isFromValid: boolean = true;
isToValid: boolean = true;
isFromToInvalid = new BehaviorSubject(true);
isDisabledDriver:boolean =false;
isDisableFromAndTo:boolean = false;
tripSettings:any;
pattern = new ValidationConstants().VALIDATION_PATTERN.NUMBER_ONLY

@Output() isSavedNewTripHead = new EventEmitter<boolean>()
constructor(
  private _fb: UntypedFormBuilder,
  private _companyTripGetApiService :CompanyTripGetApiService,
  private _lorryChallanGetService:LorryChallanGetService,
  private _newTripService:NewTripService,
  private _preFixUrl:PrefixUrlService,
  private _popupBodyScrollService:popupOverflowService
) { }

  ngOnInit() {
    this.preFixUrl =this._preFixUrl.getprefixUrl();
    this.buildForm();
    this.getInitialDetails();
    this.getPartyDetails();
  }

  ngOnChanges(): void {
    this.editNewTripFirstSectionData = this.editNewTripFirstSectionData;

  setTimeout(() => {
      if(this.editNewTripFirstSectionData.data){
        this.isDisabledFields= this.disableField(this.editNewTripFirstSectionData);
        if(this.editNewTripFirstSectionData.data.builty ||this.editNewTripFirstSectionData.data.builty ){
          this.isLRNumberDisabled = true;
        }else{
          this.isLRNumberDisabled = false
        }

        this.disablePartyWorkOrder = this.editNewTripFirstSectionData.data.disable_work_order;
        this.isDisabledDriver = this.editNewTripFirstSectionData.data.status >0 || this.editNewTripFirstSectionData.data.driver_trip_status >0;
        this.patchForm(this.editNewTripFirstSectionData.data);
        this.tripSettings=this.editNewTripFirstSectionData.data.trip_settings;
        this.estimatedKM=this.tripSettings.estimated_km;
        this.estimatedDuration=this.tripSettings.estimated_duration;        
        if( this.editNewTripFirstSectionData.data.is_driver_trip){
          this.isDisableFromAndTo =this.editNewTripFirstSectionData.data.status >=2 && this.editNewTripFirstSectionData.data.driver_trip_status >=2;
        }


        this.setEndTripInputs();
        if(!this.showEndTripInputs && !this.editNewTripFirstSectionData.data.is_transporter){
        this.getFuelStock();
        }
        if(!this.editNewTripFirstSectionData.data.is_transporter){
          this.tripFuelConsumptionChange();
        }
      }
    }, 2000);
  }

  setEndTripInputs() {
    this.showEndTripInputs = this.editNewTripFirstSectionData.data.status >= this.tripStatus.completed.id;
    this.isPodReveived = this.editNewTripFirstSectionData.data.status >= this.tripStatus.pod_received.id;
    if (this.showEndTripInputs) {
      this.newEditTripForm.get('end_date').setValidators(Validators.required);
      this.newEditTripForm.get('end_date').updateValueAndValidity();
    }
  }

  buildForm(){
    this.newEditTripForm = this._fb.group({
      c_vehicle:['',Validators.required],
      c_driver:null,
      customer:[null,Validators.required],
      total_fuel_stock:0,
      fuel_consumed:0,
      change_in_fuel_stock:[0,[Validators.required]],
      loop:[''],
      start_kms:[0],
      end_kms:[0],
      company_trip_id:[''],
      lr_no:[''],
      trip_id:[''],
      work_order_no: [''],
      estimated_pod_received_date:[null],
      estimated_kms:[0],
      estimated_durations: this._fb.group({
        day:['',[Validators.pattern(this.pattern)]],
        hour: [''],
  
    }),
      vehicle_provider:[''],
      from_loc:['',Validators.required],
      to_loc:['',Validators.required],
      error_message:'',
      est_pod_receivable_term:[-1],
      start_date: [
        null, [Validators.required]
      ],
      end_date: [
        null
      ],
      is_transporter:false,

    })
  }

  cancelButtonClick(){
   this.editNewTripFirstSectionData.show = false;
   this.isSavedNewTripHead.emit(false);
   this._popupBodyScrollService.popupHide();
  }

  onOkButtonClick(){

    let form = this.newEditTripForm
    form.value['start_date']= changeDateTimeToServerFormat(form.value['start_date']);
    form.value['end_date']= changeDateTimeToServerFormat(form.value['end_date']);
    form.value['estimated_pod_received_date']= changeDateToServerFormat(form.value['estimated_pod_received_date']);
     if(form.valid){
       this._newTripService.postNewTripHead(this.editNewTripFirstSectionData.data.id,form.value).subscribe(response=>{
        this.isSavedNewTripHead.emit(true);
        this.editNewTripFirstSectionData.show = false;
        this._popupBodyScrollService.popupHide()
       })

     }else{
      this.setAsTouched(form);
      this.setFormGlobalErrors();
     }

  }


  onChangeStartDate(){
    this.estimatePodMinDate = new Date( this.newEditTripForm.get('start_date').value);
    if(this.showEndTripInputs){
      let startDate = new Date(this.newEditTripForm.get('start_date').value);
      let endDate = new Date( this.newEditTripForm.get('end_date').value);
      if(startDate.getTime()>endDate.getTime()){
        this.newEditTripForm.get('end_date').setErrors({error:'End date cannot be less than Start Date'})
      }else{
        this.newEditTripForm.get('end_date').setErrors(null);
      }
    }
    this.updatePodTerms();
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  openAddPartyModal($event) {
    if ($event)
    {
      this.vendor=false;
      this.showAddPartyPopup = {name: this.partyNamePopup, status: true};
    }
    else{
      this.showAddPartyPopup = {name: this.partyNamePopup, status: true}
    }
  }

  addValueToPartyPopup(event){
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
      }
  }
  /* Displaying the customer name  */
  addPartyToOption($event) {
    if ($event.status && this.partyPopupDropDownIndex == -1) {
      this.getPartyDetails();
      this.initialDetails.customer = {value: $event.id, label: $event.label};
      this.newEditTripForm.get('customer').setValue($event.id);
    }

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
          this.newEditTripForm.get('c_driver').setValue($event.id);
        }
      });
    }
  }


  getPartyDetails(){
    this._companyTripGetApiService.getPartyDetails('0',partyList=>{this.partyList=partyList})
  }

  getInitialDetails(){
    this._companyTripGetApiService.getVehicleNewTripList(vehicleList=>{ this.vehicleList =vehicleList })
    this._companyTripGetApiService.getPartyDetails('1',partyList=>{this.partyListVendor=partyList});
    this._companyTripGetApiService.getEmployeeList(employeeList=>{
      this.employeeList = employeeList;
      this.driverList =filterDriver(this.employeeList);
    });
     this._companyTripGetApiService.getTransporterDrivers(transporterDriverList=>{ this.transporterDriverList=transporterDriverList});
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

  onChangeEndDate(){
    this.updatePodTerms();
  }


  ngOnDestroy() {
  }

  patchForm(patchData){
    let data = patchData;
    this.isPodReceivable = data.is_pod_receivable;
    this.estimatePodMinDate = new Date(data.start_date)
    if(isValidValue(data)){
      this.newEditTripForm.patchValue(data);
      if(data.start_date){
        this.newEditTripForm.patchValue({
          start_date:moment(new Date(data.start_date))
        });
      }
      if(data.end_date){
        this.newEditTripForm.patchValue({
        end_date:moment(new Date(data.end_date))
      });
      }
      this.isTransporterTrip = data['is_transporter'];
      this.estPodReceivableTerm =data.est_pod_receivable_term;
      this.estimatedPodReceivedDate=data.estimated_pod_received_date;
      if(!this.isTransporterTrip){
        this.driverListCompanyOrTransporter = this.driverList
      }else{
        this.driverListCompanyOrTransporter= this.transporterDriverList;
      }
      this.onStock = data.fuel_stock;
      this.patchVehicle(data);
      this.driverNamePatch(data);
      this.patchCustomer(data);
      this.patchFromTo(data);
      this.patchVehicleProvider(data);
      this.patchPodTerms();
    }

  }

  patchCustomer(data){
    if(isValidValue(data['customer'])){
      this.initialDetails.customer= {label:data['customer'].display_name}
      this.newEditTripForm.get('customer').setValue(data['customer'].id)
    }
  }

  patchVehicle(data){
  if(isValidValue(data['c_vehicle'])){
    this.initialDetails.vehicleDetail= {label:data['c_vehicle'].reg_number}
    this.newEditTripForm.get('c_vehicle').setValue(data['c_vehicle'].id)
  }
  }

  driverNamePatch(data){
    if(this.isTransporterTrip){
      if(isValidValue(data['c_driver'])){
        this.initialDetails.driver= {label:data['c_driver'].driver_name}
        this.newEditTripForm.get('c_driver').setValue(data['c_driver'].id)
      }
    }else{
      if(isValidValue(data['c_driver'])){
        this.initialDetails.driver= {label:data['c_driver'].display_name}
        this.newEditTripForm.get('c_driver').setValue(data['c_driver'].id)
      }
    }
  }

  patchFromTo(data){
    if(isValidValue(data['from_loc'])){
      this.newEditTripForm.get('from_loc').setValue(data['from_loc']);
      this.fromData =data['from_loc']
    }
    if(isValidValue(data['to_loc'])){
      this.newEditTripForm.get('to_loc').setValue(data['to_loc']);
      this.toData =data['to_loc'];
    }
  }

  patchVehicleProvider(data){
    if(isValidValue(data['vehicle_provider'])){
      this.initialDetails.vehicleProvider= {label:data['vehicle_provider'].display_name};
      this.newEditTripForm.get('vehicle_provider').setValue(data['vehicle_provider'].id)
    }
  }

  onpaymentTermSelected(value){

    if(value=='2'||value=='3'){
      let dateValue=  podTripCalculator(this.newEditTripForm.controls.start_date.value,Number(value));
      this.newEditTripForm.get('estimated_pod_received_date').setValue(dateValue);
      return
    }else if(value=='1'||value=='4'||value=='5'|| value=='7'||value=='8'||value=='9'){
      let dateValue=  podTripCalculator(this.newEditTripForm.controls.end_date.value,Number(value));
      this.newEditTripForm.get('estimated_pod_received_date').setValue(dateValue);
      return
    }else if(this.estPodReceivableTerm==6){
      if(this.estimatedPodReceivedDate){
        this.newEditTripForm.get('estimated_pod_received_date').setValue(this.estimatedPodReceivedDate);
        return
       }
    }else{
      this.newEditTripForm.get('estimated_pod_received_date').setValue(null);
      return
    }

  }

  updatePodDate(e){
    this.newEditTripForm.get('est_pod_receivable_term').setValue(6);
    this.initialDetails.podPaymentTerm={label:"Custom"};
   }

   updatePodTerms(){
    this.estimatePodMinDate = new Date( this.newEditTripForm.get('start_date').value);
    if(!this.isPodReveived && this.estPodReceivableTerm != null){
      this.onpaymentTermSelected(this.estPodReceivableTerm.toString())
    }

 }

 patchPodTerms(){
  if(this.isPodReceivable){
   if(this.estPodReceivableTerm){
     let podTerm = this.paymentTermList.filter(item =>item.value==this.estPodReceivableTerm.toString())[0];
     this.initialDetails.podPaymentTerm= podTerm;
     this.newEditTripForm.get('est_pod_receivable_term').setValue(this.estPodReceivableTerm);
   }

   if(this.estimatedPodReceivedDate){
    this.newEditTripForm.get('estimated_pod_received_date').setValue(this.estimatedPodReceivedDate);
   }
  }
}


tripFuelConsumptionChange(){
  const form = this.newEditTripForm;
  const total_fuel_stock = form.get('total_fuel_stock').value;
  const fuel_consumed = form.get('fuel_consumed').value;
  form.get('change_in_fuel_stock').setValue(((Number(total_fuel_stock)-Number(fuel_consumed))+Number(this.onStock)).toFixed(3));
  this.calculation();

 }


 getFuelStock(){
  let vehicleId ='';
  let date ='';
  vehicleId =  this.newEditTripForm.get('c_vehicle').value;
  date = changeDateToServerFormat( this.newEditTripForm.get('start_date').value)
  if(date&&vehicleId)
  this._newTripService.getFuelStock(vehicleId,date).subscribe(data=>{
    this.onStock = data['result'].fuel_stock;
    this.tripFuelConsumptionChange();
  })
}

calculation(){
  const form = this.newEditTripForm;
  const total = form.get('total_fuel_stock').value;
  const fuelTrip = form.get('fuel_consumed').value;
  form.get('change_in_fuel_stock').setValue(((Number(total)-Number(fuelTrip))+Number(this.onStock)).toFixed(3));
  if(Number(fuelTrip)>0 && Number(form.get('change_in_fuel_stock').value)<0 ){
   this.ischangeInstockPositive=false;
  }else{
   this.ischangeInstockPositive=true;
  }
 }

 disableField(data){
    if(data.data.is_pod_receivable){
      return this.editNewTripFirstSectionData.data.status >= this.tripStatus.pod_received.id;
    }else{
      return this.editNewTripFirstSectionData.data.status >= this.tripStatus.completed.id;
    }

 }

 fromAdressData(data){
  this.isFromValid=data.valid;
  if(!data.valid){
    this.newEditTripForm.get('from_loc').setValue(null)
  }else{
    this.newEditTripForm.get('from_loc').setValue(data.value)
  }
}

toAdressData(data){
  this.isToValid=data.valid;
  if(!data.valid){
    this.newEditTripForm.get('to_loc').setValue(null)
  }else{
    this.newEditTripForm.get('to_loc').setValue(data.value)
  }
}

}
