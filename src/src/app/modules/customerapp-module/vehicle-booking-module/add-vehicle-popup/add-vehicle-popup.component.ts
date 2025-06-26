import { CommonService } from 'src/app/core/services/common.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CompanyTripGetApiService } from '../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { VehicleBookingService } from '../../api-services/vehicle-booking-service/vehicle-booking.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { PartyService } from '../../api-services/master-module-services/party-service/party.service';
@Component({
  selector: 'app-add-vehicle-popup',
  templateUrl: './add-vehicle-popup.component.html',
  styleUrls: ['./add-vehicle-popup.component.scss'],
 
})
export class AddVehiclePopupComponent implements OnInit {

  addBookingForm :UntypedFormGroup;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  constructor(private _fb:UntypedFormBuilder,private _commonService:CommonService, private _partyService: PartyService,
    private _companyTripGetApiService :CompanyTripGetApiService,private _analytics:AnalyticsService,private _vehicleBooking:VehicleBookingService, private _popupBodyScrollService:popupOverflowService) { }

  @Input() addVehiclePopup;

  @Output() dataFromVehicleBooking = new EventEmitter();

  initialValues={
    party:getBlankOption()
  }
  partyList =[]
  vehicleOptionsList=[];
  selectedVehicleList =[];
  partyNamePopup: string = '';
  showAddPartyPopup: any = {name: '', status: false};
  vendor: boolean=false;
  startDateMin = new Date(dateWithTimeZone());
  endDateMin = new Date(dateWithTimeZone());
  vehicleList =[];
  bookingId = '';
  vehicleBookingPopUp={
    deleteVehicle:false,
    cancel:false,
    addVehicleBooking:false,
    editVehicleBooking:false
  }

  ngOnInit() {

    this.buildForm();
    this.getInitialDetails();
    if(this.addVehiclePopup.data['id']){
      this.bookingId = this.addVehiclePopup.data['id'];
      this.patchBooking(this.addVehiclePopup.data);
      this.patchParty(this.addVehiclePopup.data);
      this.patchVehicle(this.addVehiclePopup.data);
    }else{
      this._commonService.getSuggestedIds('vehicle_booking').subscribe((response) => {
        this.addBookingForm.controls['booking_id'].setValue(response.result['vehicle_booking']);
      });
    }

  }

  cancelButtonClick(){
    this.addVehiclePopup.show = false;
    this.vehicleBookingPopUp.cancel = true;
    this.dataFromVehicleBooking.emit(this.vehicleBookingPopUp);
    this._popupBodyScrollService.popupHide();
  }

  buildForm(){

    this.addBookingForm = this._fb.group({
      booking_id:['',Validators.required],
      trip_start_date:[null,Validators.required],
      trip_end_date:[null,Validators.required],
      number_of_vehicles:[0,[Validators.required,Validators.min(0.01)]],
      party:[null,Validators.required],
      vehicle_numbers:[[]]
    })
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

 addPartyToOption($event) {
  if ($event.status) {
    this.addBookingForm.get('party').setValue($event.id);
    this.initialValues.party ={label:$event.label,value:''};
    this.partyApi();
  }
}

 closePartyPopup(){
  this.showAddPartyPopup = {name: '', status: false};
  this.vendor=false;
}

partyApi(){
  this._partyService.getPartyList('','0').subscribe((response: any) => {
    this.partyList=response.result
  })
}

startDateChange() {
  this.addBookingForm.get('trip_end_date').setValue(null);
  this.endDateMin = new Date(this.addBookingForm.get('trip_start_date').value)
}

getInitialDetails(){
  this._companyTripGetApiService.getVehicleNewTripList(vehicleList=>{
    this.vehicleList = vehicleList;
    if(this.vehicleList.length>0){
      this.vehicleList.forEach(item =>{
        this.vehicleOptionsList.push({
          display:item.reg_number,
          value:item.id
        })
      })
    }
 });
 this.partyApi();
}

changedVehicle(item){

  if(item.length>0){
    let idArray=[];
    idArray = item;
    let selectedItem = [];
    idArray.forEach(id=>{
      this.vehicleOptionsList.forEach(item=>{
        if(item.value==id){
         selectedItem.push(item)
        }
      })
    })
    this.selectedVehicleList = selectedItem;
  }else{
    this.selectedVehicleList =[];
  }

  this.setErrors();

}

setErrors(){
  if(this.selectedVehicleList.length>Number(this.addBookingForm.get('number_of_vehicles').value)){
    this.addBookingForm.get('vehicle_numbers').setErrors({'vehicle-error':'error'});
  }else{
    this.addBookingForm.get('vehicle_numbers').setErrors(null);
  }
}

saveButtonClick(){
   let form = this.addBookingForm;
  if(form.valid){
    this._popupBodyScrollService.popupHide();
    form.value['trip_end_date'] = changeDateToServerFormat( form.value['trip_end_date']);
    form.value['trip_start_date'] = changeDateToServerFormat( form.value['trip_start_date']);
    if(this.bookingId){
      this._vehicleBooking.putVehicleBooking(form.value,this.bookingId).subscribe(res=>{
        this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.VEHICLEBOOKING)
        this.vehicleBookingPopUp.editVehicleBooking = true;
        this.dataFromVehicleBooking.emit(this.vehicleBookingPopUp);
        this.addVehiclePopup.show = false;
      });
    }else{
      this._vehicleBooking.postVehicleBooking(form.value).subscribe(data=>{
        this.vehicleBookingPopUp.addVehicleBooking = true;
        this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.VEHICLEBOOKING)
        this.dataFromVehicleBooking.emit(this.vehicleBookingPopUp);
        this.addVehiclePopup.show = false;
     });
    }
  }else{
    this.setAsTouched(this.addBookingForm)
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

patchBooking(data){
  this.addBookingForm.patchValue(data);

}

deleteBooking(){
  this._vehicleBooking.deleteVehicleBooking(this.bookingId).subscribe(response=>{
    this.vehicleBookingPopUp.deleteVehicle = true;
    this.dataFromVehicleBooking.emit(this.vehicleBookingPopUp);
    this.addVehiclePopup.show = false;
  })
}

patchParty(data){
 this.addBookingForm.get('party').setValue(data.party.id);
 this.initialValues.party ={label: data.party.display_name,value:''}
}

patchVehicle(data){

  if(this.bookingId){
    let selectedVehicles = [];
    if(data.vehicle_numbers.length>0){
      let ids=[];
      data.vehicle_numbers.forEach(ele => {
        ids.push(ele.id)
        selectedVehicles.push(
          {
            display:ele.reg_number,
            value:ele.id
          })
      });
      this.addBookingForm.get('vehicle_numbers').setValue(ids)
    }
   this.selectedVehicleList = selectedVehicles;
  }
}

}
