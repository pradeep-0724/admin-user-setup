import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, AbstractControl, Validators } from '@angular/forms';
import { addErrorClass, setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2Constants } from '../../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../../new-trip-v2-utils/new-trip-v2-utils';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { NewTripV2Service } from '../../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { BillingTypeFields, BillingTypes } from '../../../../sub-main-trip-utils/billing-types-utils';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
type FrightDataTypes={
  editData:{
    id: string,
    freight_type: string|number,
    rate: string,
    total_units: string,
    freight_amount:string,
    is_billing_editable:boolean,
  }
  tripId:string,
  freight_type:string
  tripDetails?:any,
  vehicleCategory ?: number ,
  totalMaterialQuanity:number
}
@Component({
  selector: 'app-edit-billing-v2',
  templateUrl: './edit-billing-v2.component.html',
  styleUrls: ['./edit-billing-v2.component.scss']
})
export class EditBillingV2Component implements OnInit {

  billingForm: UntypedFormGroup;
  initialValues = {
    billingType: getBlankOption()
  }
  totalSumErr:boolean=false
  workOrderTripDetails={}
  workOrderList=[]
  billingType:BillingTypes = new BillingTypes();
  billingTypeSelected = '';
  constantsTripV2 = new NewTripV2Constants()
  billingTypeList = new NewTripV2Constants().billingTypeList
  billingTypesToolTip:ToolTipInfo;
  freightType:string='';
  billingTypeSelected2='';
  isDisableBillingTypes = false;
  warningMessage='';
  isWorkorderThere=false;
  billingTypeLabels = new NewTripV2Constants().billingTypeLabels;
  billingTypesForCargo = [
    {
      label:'Quantity',
      value:'14'
    },
    {
      label:'Jobs',
      value:'10'
    }
  ];
  billingTypesForContainer= [
    {
      label:'Containers',
      value:'11'
    },
    {
      label:'Jobs',
      value:'10'
    }
  ]
  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: FrightDataTypes,private _newTripV2Service:NewTripV2Service, private _tokenExpireService:TokenExpireService
  ) { }

  ngOnInit() {
    this.isDisableBillingTypes =this.data.editData.is_billing_editable
    this.billingForm = this.billingType.buildForm();
    this.freightType=this.data.freight_type;
    this.billingTypesToolTip={
      content:this.constantsTripV2.toolTipMessages.BILLING_TYPES.CONTENT
     }
    this.data.vehicleCategory ===3 ? this.billingTypeList = this.billingTypesForCargo : '';
    this.data.vehicleCategory ===4 ? this.billingTypeList = this.billingTypesForContainer : '';
   if(this.data.editData['workorderUnitStatus']){
    this.isWorkorderThere=true;
   }

   if(this?.data?.vehicleCategory == 3 &&  ( Number(this.data?.totalMaterialQuanity) >0 && this.data?.totalMaterialQuanity != Number(this.data?.editData?.total_units)) && this.data?.editData?.freight_type == 14 && this.data?.freight_type == 'Client'){
    this.totalSumErr=true
   }
    this.patchForm();
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
    if(Number(this.billingForm.get('freight_type').value) ==10){
      setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
      setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator])
      setUnsetValidators(this.billingForm,'freight_amount',[Validators.required,Validators.min(0.01)])
    }
  }

  onChangeCalulation() {
    if(Number(this.data?.vehicleCategory)>=3){
      this.billingType.makeAllFieldRequired(0);
      if(Number(this.billingForm.get('freight_type').value) ==10){
        setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
        setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator])
        setUnsetValidators(this.billingForm,'freight_amount',[Validators.required,Validators.min(0.01)])
      }
    }
    this.billingType.onChangeCalculationsForTrips();
    if(this.isWorkorderThere && this.data.freight_type=='Client'){
      this.showWarningMessage()
     }
     let billingType=this.billingForm.get("freight_type").value;
     if(billingType==14){
      this.showSumError()
    }
  }
  showSumError(){
    let billingType=this.billingForm.get("freight_type").value;
     let totalUnits=Number(this.billingForm.get("total_units").value);
     if(this?.data?.vehicleCategory == 3 &&  (this.data?.totalMaterialQuanity>0 && this.data?.totalMaterialQuanity != totalUnits) && billingType == 14 && this.data?.freight_type == 'Client'){
      this.totalSumErr=true
     }else{
      this.totalSumErr=false
     }
  }

  onChangeBillingType() {
    let billingType = this.billingForm.get('freight_type').value;
    this.getSelectedBillingType(billingType)
    this.billingType.onChangeBillingType();
    this.showSumError()
    if(Number(this.data?.vehicleCategory)>=3){
      this.billingType.makeAllFieldRequired(0);
      if(Number(this.billingForm.get('freight_type').value) ==10){        
        setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
        setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator])
        setUnsetValidators(this.billingForm,'freight_amount',[Validators.required,Validators.min(0.01)])
      }
    }
     
  }

  patchForm(){
   let billingTypeFields:BillingTypeFields={
      id: this.data.editData.id,
      freight_type:this.data.editData.freight_type,
      rate:this.data.editData.rate,
      total_units:this.data.editData.total_units,
      freight_amount:this.data.editData.freight_amount,
    }
    this.billingType.patchBillingTypes(billingTypeFields);
    this.getSelectedBillingType(this.data.editData.freight_type)
  }


  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName)
  }
 

  cancel(){
    this.dialogRef.close(false)
  }

  save(){
    let form = this.billingForm;    
     if(form.valid) {
      let payLoad=new Object();
      if(this.data.freight_type=='Client'){
        payLoad['client_freights']=[form.value];
      }else{
        payLoad['vehicle_freights']=[form.value];
      }
      this._newTripV2Service.putFreight(this.data.tripId,payLoad).subscribe(resp=>{
        this.dialogRef.close(true)
      });
    }else{
      setAsTouched(form);
    } 

  }

  getSelectedBillingType(billingType){ 
    let selectedBilling =this.billingTypeList.filter(item => item.value == billingType)[0]
    this.initialValues.billingType = selectedBilling;
    this.billingTypeSelected = this.billingTypeLabels.filter(item => item.value == billingType)[0]?.label;
    this.billingTypeSelected2 = this.billingTypeLabels.filter(item => item.value == billingType)[0]?.label2

  }
 

  showWarningMessage(){
    let total_units = Number(this.billingForm.get('total_units').value);
    if(Number(this.billingForm.get('freight_type').value)>0){
      let  message=`Your Sales Order of ${this.data.editData['workorderUnitStatus'].total_units}  ${this.billingTypeSelected2} has been fulfilled. Are you sure you want to proceed?` ;
      let balance = (this.data.editData['workorderUnitStatus']['total_units'] - this.data.editData['workorderUnitStatus']['utilized_units'])+ Number(this.data.editData.total_units);
      if ((total_units > balance) &&this.data.editData['workorderUnitStatus']['billing_type']!=10) {
        this.warningMessage=message
      } else{
        this.warningMessage='';
      }
    }
  }


}
