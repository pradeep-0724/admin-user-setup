import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { CustomField } from '../../sub-main-trip-module/sub-main-trip-utils/custom-field-form.utils';
import { addErrorClass, setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { GenericCustomFieldService } from '../../api-services/generic-custom-field-service/generic-custom-field.service';

@Component({
  selector: 'app-generic-custom-fields',
  templateUrl: './generic-custom-fields.component.html',
  styleUrls: ['./generic-custom-fields.component.scss']
})
export class GenericCustomFieldsComponent implements OnInit {
  @Input() parentForm?:FormGroup
  @Input() editData?:Observable<[]>;
  @Input() apiUrl;
  @Input() routeToSettings ;
  @Input()isEdit=false;
  customField:FormGroup;
  formType='other_details'
  customFieldClass:CustomField = new CustomField();
  customFieldsData=[];
  @Input() isFormValid:Observable<boolean>;
  @Input() screen ;
  prefixUrl='';
  showRefresh=false;

  constructor( private _genericCustomFieldService: GenericCustomFieldService,
    ) { }

  ngOnInit(): void {
    
    this.customField=this.customFieldClass.buildCustomField();
    this.isFormValid.subscribe(isValid=>{
      if(!isValid){
        setAsTouched(this.customField)
      }
    });
    this.prefixUrl=getPrefix();
    if(this.parentForm){
      this.parentForm.addControl(this.formType, this.customField);
    }

    if(!this.isEdit){
      this.getCustomFields();
    }
    if(this.editData){
      this.editData.subscribe(customData=>{        
        this.customFieldsData =customData
        this.customFieldClass.addCustomFields(customData);
      })
    }
  }

  ngOnDestroy(): void {
    if(this.parentForm){
      this.parentForm.removeControl(this.formType);
    }
   
  }

  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }

getCustomFields() {
    this._genericCustomFieldService.getCustomFields(this.apiUrl,true).subscribe(data => {
      this.showRefresh=false;
      this.customFieldsData = data['result'];
      this.customFieldClass.addCustomFields(this.customFieldsData);
    });

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
