import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { EditCustomFieldService } from './edit-custom-field-service';
import { CustomField } from '../../../sub-main-trip-utils/custom-field-form.utils';
import { addErrorClass } from 'src/app/shared-module/utilities/form-utils';
@Component({
  selector: 'app-edit-custom-fields',
  templateUrl: './edit-custom-fields.component.html',
  styleUrls: ['./edit-custom-fields.component.scss']
})
export class EditCustomFieldsComponent implements OnInit {

  customField:FormGroup;
  VehicleTripCustomField=[];
  customFieldClass:CustomField= new CustomField()
  prefixUrl='';
  @Input() url:string='';
  @Input() isTrip:boolean=true
  customFieldSubject:Subject<FormGroup>=new Subject();
  constructor(private _editCustomFieldService:EditCustomFieldService) { }

  ngOnInit(): void {
    this.customField=this.customFieldClass.buildCustomField();
    this.getCustomFields();
    this.customFieldSubject.pipe(debounceTime(500)).subscribe(data=>{
      this.editCustomField(data)
    });
    this.prefixUrl=getPrefix();
  }

  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }


getCustomFields() {
  this._editCustomFieldService.getTripCustomFields(this.url).subscribe(resp=>{
    this.VehicleTripCustomField =  resp['result'].fields;
    this.customFieldClass.addCustomFields(this.VehicleTripCustomField);
  })
}

oncheckBoxChange(fg: UntypedFormGroup){
  if (fg.get('field_type').value == "checkbox") {
    if (fg.get('value').value == "false" || fg.get('value').value == false) {
      fg.get('value').setValue('')
    }
  }
}

  valueChange(form:FormGroup){
    this.customFieldSubject.next(form)
  }

  editCustomField(form:FormGroup){
    if(form.valid){
      if(form['value']['field_type']=='datetime'){
        form['value']['value']=changeDateTimeToServerFormat(form['value']['value'])
      }
      if(form['value']['field_type']=='date'){
        form['value']['value']=changeDateToServerFormat(form['value']['value'])
      }
      let payload={
        id:form['value']['field'],
        value:form['value']['value']
      }
      this._editCustomFieldService.putCustomFields(this.url,payload).subscribe(resp=>{
      });
    }
  }

  dateTimeSelected(e,form:FormGroup){
    if(e){
      this.customFieldSubject.next(form)
    }
  }
  


}
