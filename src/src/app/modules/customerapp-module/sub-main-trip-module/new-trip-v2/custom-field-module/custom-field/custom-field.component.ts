import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { VehicleTripCustomFieldService } from 'src/app/modules/orgainzation-setting-module/setting-module/vehicle-trip-module/vehicle-trip-setting-custom-fileds/vehicle-trip-custom-field-service.service';
import { changeDateTimeToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CustomField } from '../../../sub-main-trip-utils/custom-field-form.utils';
import { addErrorClass, setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { WorkOrderService } from '../../../../api-services/trip-module-services/work-order-service/work-order.service';

@Component({
  selector: 'app-custom-field',
  templateUrl: './custom-field.component.html',
  styleUrls: ['./custom-field.component.scss']
})
export class CustomFieldComponent implements OnInit,OnDestroy {
  @Input() parentForm?:FormGroup
  @Input() editData?:Observable<[]>
  customField:FormGroup;
  formType='other_details'
  customFieldClass:CustomField = new CustomField();
  VehicleTripCustomField=[];
  @Output() customFieldForm=new EventEmitter();
  @Input() isFormValid:Observable<boolean>;
  @Input() isTrip:boolean=true;
  prefixUrl='';
  showRefresh=false;
  isEdit=false;
  constructor(private _tripCustomField: VehicleTripCustomFieldService, private _workOrderService: WorkOrderService,
    ) { }

  ngOnInit(): void {
    this.getCustomFields();
    this.customField=this.customFieldClass.buildCustomField();
    this.customField.valueChanges.pipe(debounceTime(500)).subscribe(data=>{
     this.customFieldForm.emit({
      valid: this.customField.valid,
      formData: data['other_details']
     })
    });
    this.isFormValid.subscribe(isValid=>{
      if(!isValid){
        setAsTouched(this.customField)
      }
    });
    this.prefixUrl=getPrefix();
    if(this.parentForm){
      this.parentForm.addControl(this.formType, this.customField);
    }

    if(this.editData){
      this.editData.subscribe(customData=>{
        this.isEdit=true;
        this.VehicleTripCustomField =customData
        this.customFieldClass.addCustomFields(customData);
      })
    }
  }

  ngOnDestroy(): void {
    if(this.parentForm){
      this.parentForm.removeControl(this.formType);
    }
   
  }

  onDateTimeChange(fg: UntypedFormGroup){
    fg.get('value').setValue(changeDateTimeToServerFormat(fg.get('value').value));
  }

  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }

getCustomFields() {
  if(this.isTrip){
    this._tripCustomField.getCompanyTripFields(false).subscribe(data => {
      let allData = []
      this.showRefresh=false;
      if (!data['result'].display) { return }
      allData = data['result'].fields;
      this.VehicleTripCustomField = allData.filter(item => item.in_trip == true);
      this.customFieldClass.addCustomFields(this.VehicleTripCustomField);
    });
  }else{
    this._workOrderService.getWorkOrderFields(false).subscribe(data => {
      let allData = []
      this.showRefresh=false;
      if (!data['result'].display) { return }
      allData = data['result'].fields;
      this.VehicleTripCustomField = allData.filter(item => item.in_workorder == true)
      this.customFieldClass.addCustomFields(this.VehicleTripCustomField);
    });
  }

  
 
}

oncheckBoxChange(fg: UntypedFormGroup){
  if (fg.get('field_type').value == "checkbox") {
    if (fg.get('value').value == "false" || fg.get('value').value == false) {
      fg.get('value').setValue('')
    }
  }
}
  
linkClicked(){
  this.showRefresh=true;
}

}
