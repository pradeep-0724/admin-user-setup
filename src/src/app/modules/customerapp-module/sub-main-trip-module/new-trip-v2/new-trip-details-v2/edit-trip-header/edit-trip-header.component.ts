import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { AddMarketVehiclePopupComponent } from '../../add-market-vehicle-popup/add-market-vehicle-popup/add-market-vehicle-popup.component';
import { Subject } from 'rxjs';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';

@Component({
  selector: 'app-edit-trip-header',
  templateUrl: './edit-trip-header.component.html',
  styleUrls: ['./edit-trip-header.component.scss']
})
export class EditTripHeaderComponent implements OnInit{

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: any,private formBuilder:FormBuilder,
    private commonloaderservice:CommonLoaderService, private _tokenExpireService:TokenExpireService,private dialog : Dialog,
    private _companyTripGetApiService: CompanyTripGetApiService,private _newTripV2Service:NewTripV2Service,private _companyService:CompanyServices) {
      this.commonloaderservice.getHide();
    }
  editTripHeaderForm:FormGroup;
  vehicleList = [];
  initialDetails = {
    vehicle: getBlankOption(),
    customer: getBlankOption(),
    vehicle_provider: getBlankOption(),
    workorder:getBlankOption(),
  }
  vehicleNamePopup: string = '';
  vehicleType: string='  ';
  isTransporterTrip: boolean = false;
  driverList = [];
  foremanName: string = '';
  partyNamePopup: string = '';
  showAddPartyPopup: any = { name: '', status: false };
  vendor = false;
  partyType: any;
  partyList = [];
  partyListVendor = [];
  billingParty = "Billing Party";
  vehicleprovider = "Vehicle Provider";
  editDetails:any;
  vehicleAndDriverData:any;
  documentExpiryData= new Subject()
  selectedOption ={
    vehicle : getBlankOption()
  }

  ngOnInit(): void {
    this.editDetails = this.data;
     this.buildform();
     this.patchForm();
     setTimeout(() => {
      this.getVehicleList();
      this.getPartyTripDetails();
      this.getDriverList();
     }, 10);

    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
  }

  buildform(){
    this.editTripHeaderForm=this.formBuilder.group({
      vehicle:['',[Validators.required]],
      customer:[''],
      driver:[''],
      work_order_no:[''],
      vehicle_provider:[''],
      lr_no:[''],
      is_transporter: false,
    })
    this.editTripHeaderForm.get('driver').valueChanges.subscribe((value)=>{      
      this.getDocsExpiryLIst()
    })
    this.editTripHeaderForm.get('vehicle').valueChanges.subscribe((value)=>{      
      this.getDocsExpiryLIst()
    })
  }

  patchForm(){
    this.editTripHeaderForm.patchValue({
      vehicle:this.data.editData.vehicle?this.data.editData.vehicle.id:null,
      customer:this.data.editData.customer.id,
      driver:this.data.editData.driver?this.data.editData.driver.id:null,
      work_order_no:this.data.editData.work_order_no,
      vehicle_provider:this.data.editData.vehicle_provider?this.data.editData.vehicle_provider.id:null,
      lr_no:this.data.editData.lr_no,
      is_transporter: this.data.editData.is_transporter,
    });

    this.isTransporterTrip = this.data.editData.is_transporter;
    this.setUnsetVehicleProviderRequired();
    this.changeVehicleType();
    if(this.data.editData.vehicle)this.initialDetails.vehicle={label:this.data.editData.vehicle.name,value:''}
    if(this.data.editData.customer) this.initialDetails.customer={label:this.data.editData.customer.name,value:''}
    if(this.data.editData.vehicle_provider)this.initialDetails.vehicle_provider={label:this.data.editData.vehicle_provider.name,value:''}
    if(this.data.editData.work_order_no)this.initialDetails.workorder={label:this.data.editData.work_order_no,value:''}
    if(this.data.editData.driver && !this.isTransporterTrip){
      this.editTripHeaderForm.get('driver').setValue(this.data.editData.driver.map(driver=>{return {id:driver.id,first_name:driver.name}}))

    }
    this.selectedOption.vehicle.label = this.data.editData?.vehicle?.name;
    this.selectedOption.vehicle.value =  this.data.editData?.vehicle?.id;

    this.getDocsExpiryLIst()

  }

  setUnsetVehicleProviderRequired(){
    if(this.isTransporterTrip){
      setUnsetValidators(this.editTripHeaderForm,'vehicle_provider',[Validators.required])
    }else{
      setUnsetValidators(this.editTripHeaderForm,'vehicle_provider',[Validators.nullValidator])

    }
  }

  getVehicleList() {
    this._companyTripGetApiService.getVehicleNewTripList(vehicleList => {
      this.vehicleList = vehicleList;
    })
  }

  cancelHeader(){
    this.commonloaderservice.getShow();
    this.dialogRef.close(false)
  }

  saveHeader(){
    let formValue=this.editTripHeaderForm.value;
    if(this.editTripHeaderForm.valid){
      this.commonloaderservice.getShow();
      if(!this.isTransporterTrip){
        if(!formValue['driver']){
          formValue['driver']=[]
        }else{
          formValue['driver']=formValue['driver'].map(driver=>driver.id)
        } 
      }else{
        if(!formValue['driver']){
          formValue['driver']='';
        }
      }
      this._newTripV2Service.putTripHeader(this.data.tripId,formValue).subscribe(resp=>{
        this.dialogRef.close(true)
      });
    }else{
      this.editTripHeaderForm.markAllAsTouched();
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  openAddVehicle(event) {
    const dialogRef = this.dialog.open(AddMarketVehiclePopupComponent, {
      data : {
        name : this.vehicleNamePopup,
      },
      width: '800px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item:any) => {
      if(item.isValid){
        this.addNewVehicle(item)
      }else{
        this.initialDetails.vehicle = getBlankOption();
        this.initialDetails.vehicle.label = this.selectedOption.vehicle.label;
        this.initialDetails.vehicle.value = this.selectedOption.vehicle.value;
      }
      dialogRefSub.unsubscribe();
    });
  }
  
  addNewVehicle(event){
    this.getVehicleList()
    this.isTransporterTrip = true;
    this.editTripHeaderForm.get('vehicle').setValue(event.id);
    this.editTripHeaderForm.get('driver').setValue('');
    this.initialDetails.vehicle.label=event.reg_number;
    this.initialDetails.vehicle.value=event.id;
    setTimeout(() => {
      this.onVehicleChange()  
    }, 900);
  }

  addValueToVehiclePopUp(event) {

    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ').toUpperCase();
      this.vehicleNamePopup = word_joined;
    }
  }
  

  onVehicleChange() {
    let options = this.vehicleList.filter((item)=>item.id ==this.editTripHeaderForm.get('vehicle').value)[0];
    this.selectedOption.vehicle.label = options.reg_number;
    this.selectedOption.vehicle.value = options.id;
    this.vehicleType=''
    let vehicleId = this.editTripHeaderForm.get('vehicle').value;
    let selectedVehicle = [];
    this.editTripHeaderForm.get('driver').setValue('');
    selectedVehicle = this.vehicleList.filter(item => item.id == vehicleId);
    this.isTransporterTrip = selectedVehicle[0].is_transporter;
    this.editTripHeaderForm.get('vehicle_provider').setValue(null);
    this.editTripHeaderForm.get('is_transporter').setValue(this.isTransporterTrip)
    this.initialDetails.vehicle_provider=getBlankOption();
    this.setUnsetVehicleProviderRequired();
    if (selectedVehicle[0].driver_id) {
      this.editTripHeaderForm.get('driver').setValue([{id:selectedVehicle[0].driver_id,first_name: selectedVehicle[0].driver_name}]);
    } else {
      setTimeout(() => {
        this.editTripHeaderForm.get('driver').setValue(selectedVehicle[0].market_driver);
      }, 10);
    }

   this.changeVehicleType();
  }
  
  getDocsExpiryLIst(){
    let ids=[];
    this.changeVehicleType()
    if(isValidValue(this.editTripHeaderForm.get('driver').value) &&this.vehicleType==='Own Vehicle'){
      this.editTripHeaderForm.get('driver').value.map((ele)=>ids.push(ele.id))
    }else{
      ids=[]
    }
    this.vehicleAndDriverData={
      vehicle:this.editTripHeaderForm.get('vehicle').value,
      drivers:ids
    }

    this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((resp)=>{  
      this.documentExpiryData.next(resp)
    });
  }

  changeVehicleType(){
    if(!this.isTransporterTrip && this.editTripHeaderForm.controls.vehicle.valid){
      this.vehicleType='Own Vehicle';
    }
    if(this.isTransporterTrip && this.editTripHeaderForm.controls.vehicle.valid){
      this.vehicleType='Market Vehicle';
    }
  }
  getPartyTripDetails() {
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
       this.partyList = partyList['clients']
       this.partyListVendor = partyList['vendors']
      })
  }

  openAddPartyModal($event, type) {
    if ($event) {
      if (type == 'client') {
        this.vendor = false;
      } else {
        this.vendor = true;
      }
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }
    else {
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true }
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
    this.vendor = false;

  }
  addValueToPartyPopup(event, partyType) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
      this.partyType = partyType;
    }
  }
  // driver section
  getDriverList() {
    this._companyTripGetApiService.getDrivers(employeeList => {
      this.driverList = employeeList;
    });
  }

 
  addPartyToOption($event) {
    if ($event.status && this.partyType == this.vehicleprovider) {
      this.getPartyTripDetails();
      this.initialDetails.vehicle_provider = { value: $event.id, label: $event.label };
      this.editTripHeaderForm.get('vehicle_provider').setValue($event.id);
    }
  }
  
  
}
