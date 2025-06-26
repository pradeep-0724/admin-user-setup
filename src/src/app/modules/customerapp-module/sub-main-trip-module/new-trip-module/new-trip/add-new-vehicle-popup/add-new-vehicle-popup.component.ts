import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { getBlankOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { filterDriver } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-utils';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { LorryChallanGetService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/lorry-challan-module/lorry-challan/lorry-challan-class/lorry-challan-get.service';
import { CreateVehicleService } from 'src/app/core/services/create-vehicle.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';

@Component({
  selector: 'app-add-new-vehicle-popup',
  templateUrl: './add-new-vehicle-popup.component.html',
  styleUrls: ['./add-new-vehicle-popup.component.scss']
})
export class AddNewVehiclePopupComponent implements OnInit {
  newVehicleForm :UntypedFormGroup;
  @Input() vehicleAddPopup: any
  vehicleList =[];
  vehicleType=[
    {
      vehicleType:'Own Vehicle',
      id:'own_vehicle'
    },
    {
      vehicleType:'Market Vehicle',
      id:'market_vehicle'
    }
  ]
  initialDetails ={
    vehicle:{},
    vehicleModel:{},
    vehicleDriver:{},
    vehicleMake:{},
    vehicleNumber:{}
  }
  vehicleMakeUrl = TSAPIRoutes.vehicle_make;
  vehicleModelUrl = TSAPIRoutes.vehicle_model;
  vehicleMakeParam: any = {};
  vehicleModelParam: any = {};
  vehicleMake = [];
  vehicleModel = [];
  addDriverParams: any = {};
  postDriverAPI: any = TSAPIRoutes.lorrychallan_driver;

  makeSelectedId ='';
  apiError =''
  model:any
  driverListCompany =[];
  transporterDriverList =[];
  @Output () addNewVehicleData= new EventEmitter()
  canCreateVehicle: boolean;
  registeredVehicles: number;
  totalActiveVehicleCreated: number;
  vehicleTypeFlag:boolean=false;
  countryPhoneCode=[];
  countryId="";
  initialValues={
    mobile_country_code:getBlankOption()
  }
  constructor(
    private _fb:UntypedFormBuilder,
    private _vehicleService: VehicleService,
    private _companyTripGetApiService :CompanyTripGetApiService,
    private _lorryChallanGetService:LorryChallanGetService,
    private _newTripService:NewTripService,
    private _createVehicle:CreateVehicleService,
    private _companyModuleService: CompanyModuleServices,
    private _countryId:CountryIdService,


    ) { 
    this.countryId = this._countryId.getCountryId();

    };


  ngOnInit() {
    this.formBuilt();
    this.initialDetails.vehicle={ value:  'own_vehicle', label: 'Own Vehicle' };
    this.newVehicleForm.get('vehicle_type').setValue('own_vehicle')
    this._companyModuleService.getPhoneCode().subscribe(result => {
			let codes = [];
			codes = result['results'];
			this.countryPhoneCode = codes.map(code => code.phone_code)
		})
		this.initialValues.mobile_country_code['label'] = getCountryCode(this.countryId)

    if(this.vehicleAddPopup.name){
      this.newVehicleForm.get('reg_number').setValue(this.vehicleAddPopup.name.toUpperCase());
      this.onVehicleTypeChange()
      this.getVehicleMake();
      this.getInitialDetails();
    }
    this._createVehicle.getIsVehicleCreate().subscribe(resp=>{
      this.canCreateVehicle =   resp.result.can_create_vehicle;
      this.totalActiveVehicleCreated=resp.result.max_vehicles;      
      this.registeredVehicles=resp.result.max_vehicles;
      if(!this.canCreateVehicle){
        this.vehicleType=[
          {
            vehicleType:'Market Vehicle',
            id:'market_vehicle'
          }];
          this.initialDetails.vehicle={ value:  'market_vehicle', label: 'Market Vehicle' };
          this.newVehicleForm.get('vehicle_type').setValue('market_vehicle')
      }
      this.setUnValidators('make',true);
      this.setUnValidators('model',true);
   });
  }

  cancelButtonClick(){
   this.vehicleAddPopup.status = false;
  }

  onOkButtonClick(){
   let form = this.newVehicleForm;   
   let emitdata={
     vehicle:{
      reg_number:'',
       id:''
     },
     isNewVehicle:false,
     isTransporter:false
   }
   if(form.valid){
     if(form.value['vehicle_type']=='own_vehicle'){
      form.value['is_transporter'] = false;
     }else{
      form.value['is_transporter'] = true;
     }
     this.apiError ='';
     this._newTripService.postAddNewVehicle(form.value).subscribe(data=>{      
      emitdata.vehicle = data['result']['vehicle']
      emitdata.isTransporter =data['result']['is_transporter'];
      emitdata.isNewVehicle = true;
      this.addNewVehicleData.emit(emitdata);
      this.vehicleAddPopup.status = false;
     },error=>{
       this.apiError = error.error.message;
     })

   }else{
     this.setAsTouched(form);
   }
  }

  formBuilt(){
     this.newVehicleForm = this._fb.group({
           vehicle_type:['',Validators.required],
           reg_number:['',Validators.required],
           make:[''],
           model:[''],
           driver:[''],
           market_driver: [
            ""
          ],
          mobile_country_code: [
            getCountryCode(this.countryId)
          ],
          mobile: [
            '',
            [TransportValidator.mobileNumberValidator()]
          ],
     });
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
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

  setUnValidators(formControlName:string,type:boolean){
   this.newVehicleForm.get(formControlName).setValidators(type?Validators.required:Validators.nullValidator)
   this.newVehicleForm.get(formControlName).updateValueAndValidity()
  }

  onVehicleTypeChange(){
    let vehicleType =  this.newVehicleForm.get('vehicle_type').value;
    this.initialDetails.vehicleDriver={};
    this.initialDetails.vehicleMake={};
    this.initialDetails.vehicleModel={}
    this.newVehicleForm.patchValue({
      make:null,
      model:null,
      driver:null
    })
    if(vehicleType=='own_vehicle'){
      this.vehicleTypeFlag=false
      this.setUnValidators('make',true);
      this.setUnValidators('model',true);
    }else{
      this.vehicleTypeFlag=true
      this.setUnValidators('make',false);
      this.setUnValidators('model',false);
    }
  }

  addNewVehicleMake(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.vehicleMakeParam = {
        make_name: word_joined
      };
    }
  }

  getNewVehicleMake(event) {
    if (event) {
      this.vehicleMake = [];
      this._vehicleService.getVehicleMakeV2().subscribe((response) => {
        this.newVehicleForm.get('make').setValue(event.id);
        this.makeSelectedId = event.id;
        this.vehicleMake = response.result;
        this.vehicleModel= [];
      });
    }
  }

  getVehicleMake(){
    this._vehicleService.getVehicleMakeV2().subscribe((response) => {
      this.vehicleMake = response.result;
    });
  }

  onMakeSelected(ele) {
    if (ele.target.value != '') {
      this.makeSelectedId = ele.target.value;
      this.newVehicleForm.get('model').setValue(null);
      this.initialDetails.vehicleModel = getBlankOption()
      this._vehicleService.getVehicleModelV2(ele.target.value).subscribe((response) => {
        this.model = {};
        this.vehicleModel = response.result;
      });
    }
  }

  getNewVehicleModel(event) {
    if (event) {
      this.vehicleModel = [];
      this._vehicleService.getVehicleModelV2(this.makeSelectedId).subscribe((response) => {
        this.newVehicleForm.get('model').setValue(event.id);
        this.vehicleModel = response.result;
      });
    }
  }

  addNewVehicleModel(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr:string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.vehicleModelParam = {
        vehicle_make: this.makeSelectedId ?this.makeSelectedId: "",
        model_name: word_joined
      };
    }
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
          this.initialDetails.vehicleDriver= {value: $event.id, label: $event.label};
          this.newVehicleForm.get('driver').setValue($event.id);
        }
      });
    }
  }

  getInitialDetails(){
    this._lorryChallanGetService.getDriverDetailDrivers(driverList=>{
      this.transporterDriverList=driverList;
    });
    this._companyTripGetApiService.getDrivers(employeeList=>{
      this.driverListCompany =filterDriver(employeeList);      
    });
  }


}
