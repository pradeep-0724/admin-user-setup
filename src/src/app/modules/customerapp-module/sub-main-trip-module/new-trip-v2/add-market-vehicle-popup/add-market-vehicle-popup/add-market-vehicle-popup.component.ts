import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-add-market-vehicle-popup',
  templateUrl: './add-market-vehicle-popup.component.html',
  styleUrls: ['./add-market-vehicle-popup.component.scss']
})
export class AddMarketVehiclePopupComponent implements OnInit {

  addMarketVehicleForm : FormGroup;
  display_msg_error : string = '';
  vechileTypeList : any[] = [];
  vehicleApi = 'vehicle/category/spec/'
  addVehicle: any = {};
  initialValues = {
    vehicle_type : getBlankOption(),
    mobile_country_code : {}
  };
  isCatagorySelected : boolean = false;
  countryPhoneCode = [];
  countryId = '';
  regError = '';
  apiError = '';
  category_selected_err = ''
  vehicle_category=''
  vechileSpecifications=''

  constructor(private _fb: FormBuilder, private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,private _vehicleService: VehicleService,private newTriV2service : NewTripV2Service,
    private _countryId: CountryIdService, private _scrollToTop : ScrollToTop, private _companyModuleService : CompanyModuleServices,) { 
    this.countryId = this._countryId.getCountryId();

    }

  ngOnInit(): void {   
    this.buildForm();
    this.setPhoneCode()
    this.addMarketVehicleForm.get('reg_number').setValue(this.dialogData.name);
    this._companyModuleService.getPhoneCode().subscribe(result => {
      let codes = [];
      codes = result['results'];
      this.countryPhoneCode = codes.map(code => code.phone_code)
    })
    if(Number(this.dialogData['vehicle_category'])>=0){
      this.isCatagorySelected = true;
      this.vehicle_category = this.dialogData['vehicle_category'].toString()
      if(Number( this.vehicle_category )==4){
        this.vehicle_category='3'
      }
      this.addMarketVehicleForm.get('vehicle_category').setValue(Number(this.vehicle_category));
      this.getVehicleOwnerTypeList( this.vehicle_category)
    }
    if(this.dialogData['vechileSpecifications']){
      this.addMarketVehicleForm.get('vehicle_type').setValue(this.dialogData['vechileSpecifications']['id']);
      this.initialValues.vehicle_type={label:this.dialogData['vechileSpecifications']['specification'],value:''}
      this.vechileSpecifications=this.dialogData['vechileSpecifications']['id']
    }

  }

  setPhoneCode() {
    this.initialValues.mobile_country_code = { label: getCountryCode(this.countryId) };
    this.addMarketVehicleForm.get('mobile_country_code').setValue(getCountryCode(this.countryId))
  }

  buildForm(){
    this.addMarketVehicleForm = this._fb.group({
      vehicle_category : [null,[Validators.required]],
      reg_number : ['',[Validators.required]],
      vehicle_type :  [''],
      market_driver  : [''],
      mobile : [''],
      mobile_country_code: [getCountryCode(this.countryId), [Validators.required]],
      documents : this._fb.array([])
    })

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  vehicleCatagoryChange(category){
    this.category_selected_err = '';
    this.initialValues.vehicle_type = getBlankOption();
    this.addMarketVehicleForm.controls['vehicle_type'].setValue(null);
    this.addMarketVehicleForm.get('vehicle_category').setValue(category);
    this.isCatagorySelected = true;
    this.getVehicleOwnerTypeList(category);
  }

  getVehicleOwnerTypeList(category) {
    this._vehicleService.getVehicleSpecifications(category).subscribe((response: any) => {
      this.vechileTypeList = response.result;
    });
  }

  addNewSpecifications(event) {
    if (event) {
      this.addVehicle = {
        vehicle_category: this.addMarketVehicleForm.get('vehicle_category').value,
        specification: event,
      };
    }
  }
  
  getNewSpecifications(event) {
    if (event) {
      this.initialValues.vehicle_type = getBlankOption();
      this.vechileTypeList = [];
      this.initialValues.vehicle_type = { value: event.id, label: event.label };
      this.addMarketVehicleForm.controls['vehicle_type'].setValue(event.id);
      this.getVehicleOwnerTypeList(event.id);
    }
  }

  close(){
    let data = {
      isValid : false
    }
    this.dialogRef.close(data)
  }


  

  saveForm(form){    
    if(form.valid){
      let data = {
        basic_detail : form.value
      }
      this.newTriV2service.postMarketVehicleDetails(data).subscribe((res:any)=>{
        let vehicle= {
          reg_number : form.value.reg_number,
          id : res?.result,
          isNewVehicle : true,
          isValid : true
        }
        this.dialogRef.close(vehicle)
      },(err) => {
        this._scrollToTop.scrollToTop();
        this.regError = '';
        if (err.error.message.includes('Vehicle registration number already exists in system')) {
          this.regError = 'Vehicle registration number already exists in system';
        }
        else {
          this.apiError = err.error.message;
        }
      })
    }else{
      if(!isValidValue(form.value.vehicle_category)){
        this.category_selected_err = 'Please choose a Vehicle Category'
      }
      setAsTouched(form)
    }

  }
}
