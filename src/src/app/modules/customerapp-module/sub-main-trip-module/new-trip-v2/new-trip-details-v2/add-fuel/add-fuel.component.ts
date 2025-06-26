import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from '../../../../../../shared-module/utilities/helper-utils';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TripsAddEditPopUp } from '../trip-details-v2.interface';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { TripService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/trip-services/trip.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { PartyType, VendorType } from 'src/app/core/constants/constant';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-fuel',
  templateUrl: './add-fuel.component.html',
  styleUrls: ['./add-fuel.component.scss']
})
export class AddFuelComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: TripsAddEditPopUp,private formBuilder:FormBuilder,
  private _companyTripGetApiService:CompanyTripGetApiService,private commonloaderservice:CommonLoaderService,
  private newTripV2service: NewTripV2Service,private _tripService: TripService, private _tokenExpireService:TokenExpireService,
  private currency: CurrencyService,private apiHandler: ApiHandlerService

  ) { }
  addFuelPopUpForm:FormGroup;
  partyNamePopup: string = '';
  showAddPartyPopup: any = {name: '', status: false};
  partyListVendor=[];
  tripId='';
  fuelInfo: ToolTipInfo;
  fuelSlipInfo: ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants()
  initialDetails = {
    customer:getBlankOption(),
    vehicle : getBlankOption()
  };
  vehiclesList:any = [];
  currency_type:any;
  
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.commonloaderservice.getHide()
    this.buildForm();    
    this.tripId=this.data['tripId']; 
    if( this.data['type']==='Edit'){
      this.patchForm(this.data['editdata'])
    }    
    setTimeout(() => {
      this.getPartyDetails();
    }, 100);
    this.fuelInfo = {
      content: this.constantsTripV2.toolTipMessages.FUEL_EXPENSE.CONTENT
    };
    this.fuelSlipInfo = {
      content: this.constantsTripV2.toolTipMessages.FUEL_SLIP_INFO.CONTENT
    }
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    });
    this.getActiveVehiclesList();
    if(isValidValue(this.data['vehicleDetails'])){      
      this.addFuelPopUpForm.get('vehicle_no').setValue(this.data['vehicleDetails'].id);
      this.initialDetails.vehicle.label = this.data['vehicleDetails'].name
    }
  }

  getActiveVehiclesList(){
    this.newTripV2service.getVehicleAssigend().subscribe((res:any)=>{
      this.vehiclesList = res;
    })
  }

  cancel(){
    this.dialogRef.close(false)
  }

  save(){
    let form = this.addFuelPopUpForm;
     if(form.valid) {
      this.commonloaderservice.getShow();
       this.apiHandler.handleRequest(this.newTripV2service.putFuelExpenses(this.tripId, this.addFuelPopUpForm.value), 'Fuel Bill saved successfully!').subscribe(
         {
           next: () => {
             this.dialogRef.close(true)
           }
         }
       )
    }else{
      this.setAsTouched(form);
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

  buildForm(){
    this.addFuelPopUpForm=this.formBuilder.group({
      id:[null],
      fuel_quantity:[0.000,[Validators.required,Validators.min(0.01)]],
      fuel_rate:[0.000],
      amount:[0.00],
      has_slip:[false],
      vehicle_no : [null,[Validators.required]],
      party_name:[null]
    })
  }
  patchForm(data){
    this.addFuelPopUpForm.patchValue({
      id:data.id,
      fuel_quantity:data?.fuel_quantity,
      fuel_rate:data?.fuel_rate,
      amount:data?.amount,
      has_slip:data.has_slip,
      vehicle_no : data?.vehicle_no?.id,
      party_name:data.party_name?data.party_name.id:null
    })
    this.initialDetails.customer.label=data.party_name?.display_name;
    this.initialDetails.customer.value=data.party_name?.id;
    this.initialDetails.vehicle.label = data?.vehicle_no?.reg_number;
    this.initialDetails.vehicle.value = data?.vehicle_no?.id
    this.fuelSlipChecked(false);

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  fuelSlipChecked(add){
    let has_slip =  this.addFuelPopUpForm.get('has_slip').value
    if(has_slip){
      setUnsetValidators(this.addFuelPopUpForm,'party_name',[Validators.required]);
      setUnsetValidators(this.addFuelPopUpForm,'fuel_rate',[Validators.required,Validators.min(0.01)]);
      setUnsetValidators(this.addFuelPopUpForm,'amount',[Validators.required,Validators.min(0.01)]);
    }else{
      setUnsetValidators(this.addFuelPopUpForm,'party_name',[Validators.nullValidator]);
      setUnsetValidators(this.addFuelPopUpForm,'fuel_rate',[Validators.nullValidator]);
      setUnsetValidators(this.addFuelPopUpForm,'amount',[Validators.nullValidator]);
      if(add){
        this.initialDetails.customer= {value:'', label:''};
        this.addFuelPopUpForm.get('party_name').setValue(null);
      }
     
    }
  }

  calculateFuelAmount(){
    let fuel_quantity=Number(this.addFuelPopUpForm.get('fuel_quantity').value)
    let fuel_rate=Number(this.addFuelPopUpForm.get('fuel_rate').value);
    let amount=this.addFuelPopUpForm.get('amount');
    amount.setValue((fuel_quantity*fuel_rate).toFixed(3));

  }

  openAddPartyModal($event) {
    if ($event)
    {
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

  closePartyPopup(){
    this.showAddPartyPopup = {name: '', status: false};

  }

  addPartyToOption($event) {
    if ($event.status) {
      this.getPartyDetails();
      this.initialDetails.customer= {value: $event.id, label: $event.label};
      this.addFuelPopUpForm.get('party_name').setValue($event.id);
    }

  }

  getPartyDetails(){
    this._companyTripGetApiService.getPartyTripDetails(VendorType.Othres,PartyType.Vendor,partyList=>{this.partyListVendor=partyList})
  }

  populateFuelRate() {
    let params = {
      date: changeDateToServerFormat((new Date(this.data.tripStartDate)).toDateString())
    }
    this._tripService.getFuelPrice(params).subscribe((res) => {
      this.addFuelPopUpForm.get('fuel_rate').setValue(res['result'].fuel_rate);
      this.calculateFuelAmount();

    })
  }



}
