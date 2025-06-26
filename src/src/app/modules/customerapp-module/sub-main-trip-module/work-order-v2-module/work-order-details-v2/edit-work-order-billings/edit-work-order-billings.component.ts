import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';
import { addErrorClass, setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { BillingTypes, BillingTypeFields } from '../../../sub-main-trip-utils/billing-types-utils';
import { WorkOrderV2Service } from '../../../../api-services/trip-module-services/work-order-service/work-order-v2.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
type WorkOrderFrightDataTypes={
  editData:{
    id: string,
    freight_type: string|number,
    rate: string,
    total_units: string,
    freight_amount:string,
  }
  workOrderId:string, 
}
@Component({
  selector: 'app-edit-work-order-billings',
  templateUrl: './edit-work-order-billings.component.html',
  styleUrls: ['./edit-work-order-billings.component.scss']
})
export class EditWorkOrderBillingsComponent implements OnInit {

 
  billingForm: UntypedFormGroup;
  initialValues = {
    billingType: getBlankOption()
  }
  billingType:BillingTypes = new BillingTypes();
  billingTypeSelected = '';
  constantsTripV2 = new NewTripV2Constants()
  billingTypeList = new NewTripV2Constants().WorkOrderbillingTypeList
  billingTypesToolTip:ToolTipInfo;
  billingTypeSelected2='';
  is_billing_type_editable:boolean = true;
  billingTypeLabels = new NewTripV2Constants().billingTypeLabels;
  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA)  private data: WorkOrderFrightDataTypes,private _workOrderV2Service:WorkOrderV2Service, private _tokenExpireService:TokenExpireService
  ) { }

  ngOnInit() {
    this.is_billing_type_editable = this.data['editData']['is_billing_type_editable'];
    this.billingForm = this.billingType.buildForm();
    this.billingType.makeAllFieldRequired(1); 
    this.billingTypesToolTip={
      content:this.constantsTripV2.toolTipMessages.BILLING_TYPES.CONTENT
     }

    this.patchForm();
    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
  }

  onChangeCalulation() {
    this.billingType.onChangeCalulation();
  }

  onChangeBillingType() {
    let billingType = this.billingForm.get('freight_type').value;
    this.getSelectedBillingType(billingType)
    this.billingType.onChangeBillingType();
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
      this._workOrderV2Service.putWorkOrderFields(this.data.workOrderId,'freight',form.value).subscribe(resp=>{
        this.dialogRef.close(true)
      });
    }else{
      setAsTouched(form);
    } 

  }

  getSelectedBillingType(billingType){ 
    let selectedBilling =this.billingTypeList.filter(item => item.value == billingType)[0]
    this.initialValues.billingType = selectedBilling;
    this.billingTypeSelected = this.billingTypeLabels.filter(item => item.value == billingType)[0].label;
    this.billingTypeSelected2 = this.billingTypeLabels.filter(item => item.value == billingType)[0].label2

  }


}
