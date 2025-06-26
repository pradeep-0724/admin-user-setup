import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateTimeToServerFormat, changeDateToServerFormat, podTripCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { TripConstants } from '../../constant';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


export interface outputdata{
  allData:Array<[]>,
  isFormValid:boolean
}

@Component({
  selector: 'app-edit-trip-freight',
  templateUrl: './edit-trip-freight.component.html',
  styleUrls: ['./edit-trip-freight.component.scss'],
})
export class EditTripFreightComponent implements OnInit {
  tripStatus: any = new TripConstants().vehicleTripStatus;
  paymentTermList= new ValidationConstants().paymentTermList;
  @Output () dataFromBilling = new EventEmitter<any>();
  @Input () isEdit = false;
  @Input () isClientFrightValid = new BehaviorSubject(true);
  isFormValidClient = new BehaviorSubject(true);
  isFormValid = new BehaviorSubject(true);
  isClientBillingValid = false
  isVpBillingValid = false
  isTripValid = false
  selectedDropdown: any;
  payload: any = {
    client_freights: null,
    client_freights_type: 1,
    vehicle_freights: null,
    vehicle_freights_type: 1,
    trip_details: null
  };
  selectedVPDropdown: any;
  clientFreightsType = [];
  incomingFreightData: any;
  isTransporter: boolean = false;
  editFreightData: any = [];
  editVPFreightData: any = [];
  chargeAddBillType: string = "";
  chargeReduceBillType: string = "";
  showUnloading: boolean = false;
  mindate = new Date(dateWithTimeZone());
  tripForm: UntypedFormGroup;
  clientFreightType: any = getBlankOption();
  vehicleFreightType: any = getBlankOption();
  hours = new ValidationConstants().hours;
  minutes = new ValidationConstants().minutes;
  initialDetails = {
    podPaymentTerm:{}
  };
  materialOptionsList = [];
  materialList = [];
  customFieldDetails = []
  dropdownType = new TripConstants().billingTypes;
  showEndTripInputs: boolean = false;
  showClientFreights: boolean = false;
  showVehicleFreights: boolean = false;
  estPodReceivableTerm;
  estimatedPodReceivedDate;
  totalFuelPurchase = 0 ;
  tripFuelConsumption = 0;
  changeInStock = 0;
  onStock = 0;
  isBillingTypeDisabled: boolean = false;
  vehicleId ='';
  startDate ='';
  workOrder: any;
  storageRate = 0;
  storageRateTransporter=0;
  pattern = new ValidationConstants().VALIDATION_PATTERN.FLOAT
  isCompleteSelected = false;
  isPodReceived:boolean;

  constructor(private _companyTripGetApiService:CompanyTripGetApiService, private _fb: UntypedFormBuilder,
              private _newTripService:NewTripService,


              ) { }

  @Input()
  set freightData(data: any) {
    this.isPodReceived=data.data.trip_settings.pod_received;    
		this.incomingFreightData = data.data;
    this.totalFuelPurchase = data.data.total_fuel_stock;
    this.tripFuelConsumption = data.data.fuel_consumed;
    this.changeInStock = data.data.change_in_fuel_stock;
    this.vehicleId = data.data.c_vehicle;
    this.startDate = data.data.start_date;
    this.isCompleteSelected = data.extras.isCompleteSelected
    this.showUnloading = data.extras.isCompleteSelected || this.incomingFreightData.status >= this.tripStatus.completed.id;
    this.showClientFreights = data.extras.showClientFreights;
    this.showVehicleFreights = data.extras.showVehicleFreights;
    this.showEndTripInputs = data.extras.showEndTripInputs;
    this.estPodReceivableTerm =this.incomingFreightData.est_pod_receivable_term;
    this.estimatedPodReceivedDate=this.incomingFreightData.estimated_pod_received_date;
    this.mindate = new Date(this.incomingFreightData.start_date)
    this.isTransporter = this.incomingFreightData.is_transporter;
    this.editFreightData = this.incomingFreightData['client_freights'] || null;
    this.editVPFreightData = this.incomingFreightData['vehicle_freights'] || null;

    this.workOrder = this.incomingFreightData.workorder_details
    this.isBillingTypeDisabled = this.workOrder && this.workOrder.workorder_type == 1 ? true : false

    if(this.editFreightData.length > 0){
      let selectedDropdown = this.editFreightData[0]['freight_type'];
      this.dropdownType.forEach(item => {
        if(item.value == selectedDropdown){
          this.selectedDropdown = item;
          return
        }
      });
    }

    if(this.editVPFreightData.length > 0){
      let selectedVPDropdown = this.editVPFreightData[0]['freight_type'];
      this.dropdownType.forEach(item => {
        if(item.value == selectedVPDropdown){
          this.selectedVPDropdown = item;
          return
        }
      });
    }

    if (this.showEndTripInputs) {
      this.emitTripChanges();
    }
  }
  get freightData(): any { return this.incomingFreightData }

  clientBilling($event) {
    if(!this.showClientFreights){
      this.payload.client_freights = null;
    }
    this.payload.client_freights = $event.allData
    this.payload.client_freights_type = this.selectedDropdown.value;
    this.isClientBillingValid = $event.isFormValid
    this.emitData()
  }

  emitData(){
    let isValid = true;
    if (this.isTransporter && this.showVehicleFreights){
      isValid = this.isVpBillingValid
    }
    if (this.showClientFreights){
      isValid = isValid && this.isClientBillingValid
    }
    if (this.showEndTripInputs){
      isValid = isValid && this.isTripValid
    }
    this.dataFromBilling.emit({allData: this.payload, isFormValid: isValid});
  }

  vpBilling($event) {
    if(!this.showVehicleFreights){
      this.payload.vehicle_freights = null;
    }
    this.payload.vehicle_freights = $event.allData
    this.payload.vehicle_freights_type = this.selectedVPDropdown.value;
    this.isVpBillingValid = $event.isFormValid
    this.emitData()
  }

  emitTripChanges(){
    this.buildForm();
    this.getCustomFields();
    this.tripForm.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(data => {
      this.isTripValid = true;
      if (this.showEndTripInputs) {
        if(!this.tripForm.valid) {
          this.isTripValid = false;
        }
        data['estimated_pod_received_date']= changeDateToServerFormat(data['estimated_pod_received_date']);
      }
        data['end_date'] = changeDateTimeToServerFormat(data['end_date']);
        this.payload.trip_details = data;
        this.emitData();
    })
  }

  ngOnInit() {
    this.getMaterials();
    this.patchPodTerms();
    this.patchFuelExpense();
    this.patchTripEndDate();
    this.onpaymentTermSelected(this.incomingFreightData.est_pod_receivable_term)
    if(!this.incomingFreightData.is_transporter){
      this.getFuelStock();
    }

    this.isClientFrightValid.subscribe(valid=>{
      this.isFormValid.next(valid)
      if(!valid && this.showEndTripInputs){
        this.setAsTouched(this.tripForm)
      }
    });
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

  buildForm(){
    this.tripForm = this._fb.group({
      end_date: [null, Validators.required],
      estimated_pod_received_date:[null],
      est_pod_receivable_term:[-1],
      total_fuel_stock:0,
      fuel_consumed:0,
      fuel_stock:0,
      change_in_fuel_stock:[0,[Validators.min(0),Validators.required]],
      end_kms: [0, [Validators.pattern(this.pattern)]],
      custom_details: this._fb.array([]),
      is_complete_trip: false,
      error_message: ''
    });
  }

  getCustomFields(){
    // this._tripApiService.getCustomFields(customFieldDetails => {
    //   this.customFieldDetails = customFieldDetails;
    //   if( this.customFieldDetails.length>0){
    //    this.addCustomFields(this.customFieldDetails)
    //     }
    // })
  }

  patchTripEndDate(){
    if(this.incomingFreightData.driver_trip_status >= 2){
      this.tripForm.controls.end_date.setValue(moment(new Date(this.incomingFreightData.driver_trip_end_date)));
      this.tripForm.controls.end_kms.setValue(this.incomingFreightData.driver_trip_distance_travelled);
    } else {
      this.tripForm.controls.end_kms.setValue(this.incomingFreightData.end_kms);
      this.tripForm.controls.end_date.setValue(moment(new Date(dateWithTimeZone())));
    }
  }

  addCustomFields(items: any) {
    const custom_field = this.tripForm.get('custom_details') as UntypedFormArray;
    custom_field.controls=[];
    items.forEach((item) => {
      const customForm = this.buildCustomFields(item);
      custom_field.push(customForm);
    });
  }

  buildCustomFields(items:any) {
    return this._fb.group({
      field: [items.id],
      field_label: [items.field_label, [items.mandatory?Validators.required:Validators.nullValidator]],
      value: [items.value || '', [items.mandatory ? Validators.required : Validators.nullValidator]],
      mandatory:[items.mandatory],
      field_type:[items.field_type.data_type],
      option_list:[items['option_list']? items['option_list']:[]],
      selected_option:{label:items.value,value:items.value}
    })
  }


  getMaterials(){
    this._companyTripGetApiService.getMaterials(materialList=>{
      this.materialList=materialList;
      if(this.incomingFreightData['work_order']){
        this.isBillingTypeDisabled= true;
      }
      if(this.isCompleteSelected){
        if(this.incomingFreightData.client_freights.length>0){
          if(this.incomingFreightData.client_freights[0].hasOwnProperty('material')){
            if(this.incomingFreightData.client_freights[0].material.length==1){
              let materialObj=  this.materialList.filter(mat=>mat.id==this.incomingFreightData.client_freights[0].material[0])
              this.storageRate = materialObj[0]['shortage_rate']
            }
          }
        }
        if(this.incomingFreightData.vehicle_freights.length>0){
        if(this.incomingFreightData.vehicle_freights[0].hasOwnProperty('material')){
            if(this.incomingFreightData.vehicle_freights[0].material.length==1){
              let materialObj=  this.materialList.filter(mat=>mat.id==this.incomingFreightData.vehicle_freights[0].material[0])
              this.storageRateTransporter = materialObj[0]['vehicle_freight_shortage_rate']
            }
          }
        }
      }
      this.materialList.forEach(item =>{
        this.materialOptionsList.push({
          display:item.name,
           value:item.id
        })
      })
    });
  }

  billingDropDownChange($event){
    // drop down change
    this.payload.client_freights = [];
    this.editFreightData = [];
    this.dropdownType.forEach(item => {
      if(item.value == $event.target.value){
        this.selectedDropdown = item;
        return
      }
    });
  }

  billingVPDropDownChange($event){
    // drop down change
    this.payload.vehicle_freights = [];
    this.editVPFreightData = [];
    this.dropdownType.forEach(item => {
      if(item.value == $event.target.value){
        this.selectedVPDropdown = item;
        return
      }
    });
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  mandatoryFieldCheckbox(tripFreight: UntypedFormGroup, formcontrol) {
    const custom_field = tripFreight.get(formcontrol) as UntypedFormArray;
    custom_field.controls.forEach((item) => {
      if (item.get('field_type').value == "checkbox") {
        if (item.get('value').value == "false" || item.get('value').value == false || item.get('value').value == "") {
          item.get('value').setValue('')
        }
      }
    });
  }

  onpaymentTermSelected(value){

    if(value=='2'||value=='3'){
      let dateValue=  podTripCalculator(this.mindate,Number(value));
      this.tripForm.get('estimated_pod_received_date').setValue(dateValue);
      return
    }else if(value=='1'||value=='4'||value=='5'||value=='7'||value=='8'||value=='9'){
      let dateValue=  podTripCalculator(this.tripForm.controls.end_date.value,Number(value));
      this.tripForm.get('estimated_pod_received_date').setValue(dateValue);
      return
    }else if(this.estPodReceivableTerm==6){
      if(this.estimatedPodReceivedDate){
        this.tripForm.get('estimated_pod_received_date').setValue(this.estimatedPodReceivedDate);
        return
       }
    }else{
      this.tripForm.get('estimated_pod_received_date').setValue(null);
      return
    }

  }

  updatePodDate(){
    this.tripForm.get('est_pod_receivable_term').setValue(6);
    this.initialDetails.podPaymentTerm={label:"Custom"};
   }


  reSetPodDate(){
    if (this.estPodReceivableTerm == null) {
      this.onpaymentTermSelected('')
    }
    if(this.estPodReceivableTerm){
      this.onpaymentTermSelected(this.estPodReceivableTerm.toString())
    }

   }

  updateCalcs(){
    this.reSetPodDate();
 }


   patchPodTerms(){
     if(this.showEndTripInputs){
      if(this.estPodReceivableTerm){
        let podTerm = this.paymentTermList.filter(item =>item.value==this.estPodReceivableTerm.toString())[0];
        this.initialDetails.podPaymentTerm = podTerm;
        this.tripForm.get('est_pod_receivable_term').setValue(this.estPodReceivableTerm);
      }

      if(this.estimatedPodReceivedDate){
       this.tripForm.get('estimated_pod_received_date').setValue(this.estimatedPodReceivedDate);
      }
     }
   }

   patchFuelExpense(){
    if(this.showEndTripInputs){
      this.tripForm.get('total_fuel_stock').setValue(this.totalFuelPurchase);
      this.tripForm.get('fuel_consumed').setValue(this.tripFuelConsumption);
      this.tripForm.get('change_in_fuel_stock').setValue( this.changeInStock);
      this.tripForm.get('fuel_stock').setValue(this.onStock);
      }
   }

   tripFuelConsumptionChange(){
    const form = this.tripForm;
    const total_fuel_stock = form.get('total_fuel_stock').value;
    const fuel_consumed = form.get('fuel_consumed').value;
    form.get('change_in_fuel_stock').setValue(((Number(total_fuel_stock)-Number(fuel_consumed))+Number(this.onStock)).toFixed(3));

   }

   getFuelStock(){
    if(this.showEndTripInputs){
      let date ='';
      date = changeDateToServerFormat(this.startDate);
      if(date&&this.vehicleId['id'])
      this._newTripService.getFuelStock(this.vehicleId['id'],date).subscribe(data=>{
        this.onStock = data['result'].fuel_stock;
        this.tripForm.get('fuel_stock').setValue(this.onStock);
        this.tripFuelConsumptionChange();
      })
    }

  }


}
