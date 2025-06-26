import { DialogRef, DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { AddMarketVehiclePopupComponent } from '../../add-market-vehicle-popup/add-market-vehicle-popup/add-market-vehicle-popup.component';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { Subject, forkJoin } from 'rxjs';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { LpoService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/lpo-services/lpo.service';

@Component({
  selector: 'app-vehicle-change',
  templateUrl: './vehicle-change.component.html',
  styleUrls: ['./vehicle-change.component.scss']
})
export class VehicleChangeComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: any,
     private formBuilder: FormBuilder,
    private commonloaderservice: CommonLoaderService, 
    private _tokenExpireService:TokenExpireService,
    private dialog : Dialog,
    private _vehicleService:VehicleService,
    private _companyService:CompanyServices,
    private _companyTripGetApiService: CompanyTripGetApiService,
    private _lpoService:LpoService,
    private _newTripV2Service: NewTripV2Service) {
    this.commonloaderservice.getHide();
  }
  changeVehicleForm: FormGroup;
  vehicleList = [];
  vechileSpecifications=[];
  initialDetails = {
    vehicle: getBlankOption(),
    vehicle_provider: getBlankOption(),
    specification:getBlankOption(),
    lpo:getBlankOption(),
    assetOne : getBlankOption(),
    assetTwo : getBlankOption(),
    assetThree : getBlankOption(),
  }
  vehicleNamePopup: string = '';
  vehicleType: string = '  ';
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
  vehicleAndDriverData : any = {
    driver : [],
    customer : [],
    vehicle : [],
    asset : []
  };
  specification : any;
  vehicleCategory=0;
  documentExpiryData= new Subject()
  selectedVehicleOption = getBlankOption();
  lpoList=[]
  assetData = [];
  asset1Specification = '';
  asset2Specification = '';
  asset3Specification = '';
  vehicleSpecFor3and4 =''
  scheduledJobsForSelectedVehicleList = []

  ngOnInit(): void {
    this.specification = this.data.specification ? this.data.specification:null;
    this.initialDetails.specification.label = this.specification? this.specification.name:'';
    this.initialDetails.specification.value =this.specification? this.specification.id:'';
    this.buildform();
    this.getAssetList();
    this.vehicleCategory=Number(this.data.vehicle_category)    
      setTimeout(() => {
      this.getVehicleList();
      this.getPartyTripDetails();
      this.getDriverList();
      this.getVehicleSpecifications();
    }, 10);
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
    this.changeVehicleForm.patchValue({
      asset_1: this.data.tripDetails?.asset_1?.id ? this.data.tripDetails?.asset_1?.id : null,
      asset_2: this.data.tripDetails?.asset_2?.id ? this.data.tripDetails?.asset_2?.id : null,
      asset_3: this.data.tripDetails?.asset_3?.id ? this.data.tripDetails?.asset_3?.id : null,
    })
    this.initialDetails.assetOne =   { label : this.data.tripDetails?.asset_1?.name, value : this.data.tripDetails?.asset_1?.id};
    this.initialDetails.assetTwo =   { label : this.data.tripDetails?.asset_2?.name, value : this.data.tripDetails?.asset_2?.id};
    this.initialDetails.assetThree = { label : this.data.tripDetails?.asset_3?.name, value : this.data.tripDetails?.asset_3?.id};
    this.assetOneSelected();
    this.assetTwoSelected();
    this.assetThreeSelected();
  }

  buildform() {
    this.changeVehicleForm = this.formBuilder.group({
      c_vehicle: ['', [Validators.required]],
      driver: [''],
      vehicle_provider: [''],
      specification:[this.specification? this.specification.id:null],
      is_transporter: false,
      lpo:null,
      asset_1 : [null],
      asset_2: [null],
      asset_3 : [null],
    })
  }



  setUnsetVehicleProviderRequired() {
    if (this.isTransporterTrip) {
      setUnsetValidators(this.changeVehicleForm, 'vehicle_provider', [Validators.required])
    } else {
      setUnsetValidators(this.changeVehicleForm, 'vehicle_provider', [Validators.nullValidator])

    }
  }

  getVehicleList() {
    this.changeVehicleForm.patchValue({
      c_vehicle:'',
      driver:'',
      vehicle_provider:'',
      is_transporter: false,
      lpo:null,
    })
    this.initialDetails.vehicle=getBlankOption();
    this.initialDetails.vehicle_provider=getBlankOption();
    this.initialDetails.lpo=getBlankOption();
    this.vehicleType=''
    this.vehicleList=[];
    let specification='';
    if(Number(this.data.vehicle_category)==1 || Number(this.data.vehicle_category)==2){
      specification=this.changeVehicleForm.get('specification').value
    }
    let vehiclecategory=this.vehicleCategory
    if(this.vehicleCategory==4){
      vehiclecategory=3
    }
    if(vehiclecategory==0|| vehiclecategory==3 ){
      const trailerHed$= this._vehicleService.getVehicleListByCatagory(3, '')
      const othersVehicle$=this._vehicleService.getVehicleListByCatagory(0, '')
      forkJoin([trailerHed$,othersVehicle$]).subscribe(([trailerHed,othersVehicle])=>{
        this.vehicleList =[...trailerHed['result']['veh'],...othersVehicle['result']['veh']];
      })
    }else if(vehiclecategory==10){
      this._vehicleService.getVehicleListByCatagory(10,'').subscribe((response: any) => {
        this.vehicleList  = response.result['veh'];
      });
    }
    else{
      this._vehicleService.getVehicleListByCatagory(vehiclecategory,specification).subscribe((response: any) => {
        this.vehicleList  = response.result['veh'];
      });
    }
    this.getAlreadyScheduledJobsForVehicles();
    this.getDocsExpiryLIst();
  }

  cancelHeader() {
    this.commonloaderservice.getShow();
    this.dialogRef.close(false)
  }

  saveHeader() {
    let formValue=this.changeVehicleForm.value;
    if (this.changeVehicleForm.valid) {
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
      this._newTripV2Service.putAssignVehicle(this.data['jobId'],formValue).subscribe(resp => {
        this.dialogRef.close(true)
      });
    } else {
      this.changeVehicleForm.markAllAsTouched();
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  openAddVehicle(event) {
    const dialogRef = this.dialog.open(AddMarketVehiclePopupComponent, {
      data : {
        name : this.vehicleNamePopup,
        vehicle_category: this.vehicleCategory,
        vechileSpecifications:this.vechileSpecifications.find(specifications=>specifications.id == this.changeVehicleForm.get('specification').value)
      },
      width: '800px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if(item.isValid){
        this.addNewVehicle(item)
      }else{
        this.initialDetails.vehicle = this.selectedVehicleOption;        
      }
      dialogRefSub.unsubscribe();
    });
  }

  addNewVehicle(event){    
    this.isTransporterTrip = true;
    this.initialDetails.vehicle=getBlankOption()
    this.initialDetails.vehicle.label=event.reg_number;
    this.initialDetails.vehicle.value=event.id;
    this.changeVehicleForm.get('c_vehicle').setValue(event.id)
    let specification='';
    if(Number(this.data.vehicle_category)==1 || Number(this.data.vehicle_category)==2){
      specification=this.changeVehicleForm.get('specification').value
    }
    let vehiclecategory=this.vehicleCategory
    if(this.vehicleCategory==4){
      vehiclecategory=3
    }
    if(vehiclecategory==0|| vehiclecategory==3){
      const trailerHed$= this._vehicleService.getVehicleListByCatagory(3, '')
      const othersVehicle$=this._vehicleService.getVehicleListByCatagory(0, '')
      forkJoin([trailerHed$,othersVehicle$]).subscribe(([trailerHed,othersVehicle])=>{
        this.vehicleList =[...trailerHed['result']['veh'],...othersVehicle['result']['veh']];
        this.onVehicleChange()
      })
    }else{
      this._vehicleService.getVehicleListByCatagory(vehiclecategory,specification).subscribe((response: any) => {
        this.vehicleList  = response.result['veh'];
        this.onVehicleChange()
      });
    }
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
    this.vehicleType = ''
    let vehicleId = this.changeVehicleForm.get('c_vehicle').value;
    this.changeVehicleForm.get('driver').setValue('');
    let selectedVehicle = [];
    selectedVehicle = this.vehicleList.filter(item => item.id == vehicleId);  
    this.selectedVehicleOption = getBlankOption();  
    this.selectedVehicleOption.label = selectedVehicle[0].reg_number;
    this.selectedVehicleOption.value = selectedVehicle[0].id;
    this.isTransporterTrip = selectedVehicle[0].is_transporter;
    this.vehicleSpecFor3and4 = selectedVehicle[0]?.specification?.name
    this.changeVehicleForm.get('vehicle_provider').setValue(null);
    this.changeVehicleForm.get('lpo').setValue(null);
    this.changeVehicleForm.get('is_transporter').setValue(this.isTransporterTrip);
    this.setUnsetVehicleProviderRequired();
    if (!this.isTransporterTrip) {
      this.changeVehicleForm.get('driver').setValue( selectedVehicle[0]?.employees_assigned);
      this.changeVehicleForm.patchValue({
        asset_1: selectedVehicle[0]?.asset_1[0]?.id ? selectedVehicle[0]?.asset_1[0]?.id : null,
        asset_2: selectedVehicle[0]?.asset_2[0]?.id ? selectedVehicle[0]?.asset_2[0]?.id : null,
        asset_3: selectedVehicle[0]?.asset_3[0]?.id ? selectedVehicle[0]?.asset_3[0]?.id : null,
      })
      this.initialDetails.assetOne =   { label : selectedVehicle[0]?.asset_1[0]?.name, value : selectedVehicle[0]?.asset_1[0]?.id};
      this.initialDetails.assetTwo =   { label : selectedVehicle[0]?.asset_2[0]?.name, value : selectedVehicle[0]?.asset_2[0]?.id};
      this.initialDetails.assetThree = { label : selectedVehicle[0]?.asset_3[0]?.name, value : selectedVehicle[0]?.asset_3[0]?.id};
      this.assetOneSelected();
      this.assetTwoSelected();
      this.assetThreeSelected();
    } else {
      this.changeVehicleForm.patchValue({
        asset_1 : null,
        asset_2 : null,
        asset_3 : null,
      })
      this.initialDetails.vehicle_provider = getBlankOption();
      this.initialDetails.lpo = getBlankOption();
      this.initialDetails.assetOne = getBlankOption();
      this.initialDetails.assetTwo = getBlankOption();
      this.initialDetails.assetThree = getBlankOption();
      this.asset1Specification = '';
      this.asset2Specification = '';
      this.asset3Specification = '';
      setTimeout(() => {
        this.changeVehicleForm.get('driver').setValue(selectedVehicle[0].market_driver);

      }, 10);
    }
    this.getDocsExpiryLIst()
    this.changeVehicleType();
    this.getAlreadyScheduledJobsForVehicles();
  }

  getAlreadyScheduledJobsForVehicles(){
    let vehicle = this.changeVehicleForm.get('c_vehicle').value;
    let params = [{
      date : this.data.jobStartDate,
      id : this.changeVehicleForm.get('c_vehicle').value
    }]
    this.scheduledJobsForSelectedVehicleList=[]
    isValidValue(vehicle) &&   this._vehicleService.getAlreadyScheduledJobsForVehicle(params).subscribe((resp)=>{      
      this.scheduledJobsForSelectedVehicleList=resp['result'][0]
      
    })
  }
  onVehicleProviderChange(){
    const vehicleProvider= this.changeVehicleForm.get('vehicle_provider').value
    this.initialDetails.lpo=getBlankOption();
    this.changeVehicleForm.get('lpo').setValue(null);
    this.getLpoList(vehicleProvider)
  }

  selectedDriverList(e){
    if(e){
      this.getDocsExpiryLIst()
    }
  }

  getDocsExpiryLIst(){
    let ids=[]; 
    let asset = [];   
    if(  typeof(this.changeVehicleForm.get('driver').value)==='object'){
      this.changeVehicleForm.get('driver').value.map((ele)=>ids.push({
        id : ele.id,
        date : this.data.jobStartDate
      }))
    }
    let vehicleId = this.changeVehicleForm.get('c_vehicle').value
    this.vehicleAndDriverData={
      driver:ids,
      customer : isValidValue(this.data.customerId) ?  [ {date : this.data.jobStartDate , id : this.data.customerId}] : [],
      location:this.data.locationlist
    };
    if(isValidValue(vehicleId)){
      this.vehicleAndDriverData.vehicle = [{ date : this.data.jobStartDate,  id : vehicleId}];
    }
    
    if(Number(this.data.tripDetails?.vehicle_category) == 0 || Number(this.data.tripDetails?.vehicle_category) == 4){
      if(isValidValue(this.changeVehicleForm.get('asset_1').value)){
        asset.push({
          date : this.data.jobStartDate,
          id : this.changeVehicleForm.get('asset_1').value
        })
      }
      if(isValidValue(this.changeVehicleForm.get('asset_2').value)){
        asset.push({
          date : this.data.jobStartDate,
          id : this.changeVehicleForm.get('asset_2').value
        })
      }if(isValidValue(this.changeVehicleForm.get('asset_3').value)){
        asset.push({
          date : this.data.jobStartDate,
          id : this.changeVehicleForm.get('asset_3').value
        })
      }
      this.vehicleAndDriverData.asset = asset
    }
    this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((resp)=>{  
      this.documentExpiryData.next(resp)
    });
  }

  changeVehicleType() {
    if (!this.isTransporterTrip && this.changeVehicleForm.controls.c_vehicle.valid) {
      this.vehicleType = 'Own Vehicle';
    }
    if (this.isTransporterTrip && this.changeVehicleForm.controls.c_vehicle.valid) {
      this.vehicleType = 'Market Vehicle';
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
      this.changeVehicleForm.get('vehicle_provider').setValue($event.id);
      this.getLpoList($event.id);
      this.initialDetails.lpo=getBlankOption();
      this.changeVehicleForm.get('lpo').setValue(null);
    }
  }

  getLpoList(id){
    this._lpoService.getLopListByVendor(id).subscribe(resp=>{
     this.lpoList=resp['result']['lpo']
    })
   }

  getVehicleSpecifications() {
    let vehicleCategory=this.data.vehicle_category
    this._vehicleService.getVehicleSpecifications(vehicleCategory).subscribe((response: any) => {
      this.vechileSpecifications = response.result;
    });
  }

  close(){
    this.dialog.closeAll()
  }

  getAssetList() {
    this._vehicleService.getAssetList().subscribe((response) => {      
      this.assetData = response.result;
    });
  }

  assetOneSelected(){
    let asset1 = this.changeVehicleForm.get('asset_1').value;
    let selectedAsset =  this.assetData.find(ele=>ele.id==asset1);
    if (isValidValue(selectedAsset)){
      this.getDocsExpiryLIst()
      this.asset1Specification =(selectedAsset?.category==1 ? 'Dolly '  : 'Trailer ') + selectedAsset?.specification?.name
    }else{
      this.asset1Specification = '';
    }
  }
  assetTwoSelected() {
    let asset2 = this.changeVehicleForm.get('asset_2').value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset2);
    if (isValidValue(selectedAsset)) {
      this.getDocsExpiryLIst()
      this.asset2Specification = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name
    } else {
      this.asset2Specification = '';
    }
  }

  assetThreeSelected(){
    let asset3 = this.changeVehicleForm.get('asset_3').value;
    let selectedAsset =  this.assetData.find(ele=>ele.id==asset3);
    if (isValidValue(selectedAsset)){
      this.getDocsExpiryLIst()
      this.asset3Specification =(selectedAsset?.category==1 ? 'Dolly '  : 'Trailer ') + selectedAsset?.specification?.name
    }else{
      this.asset3Specification = '';
    }
  }

  


}
