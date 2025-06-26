import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';

@Component({
  selector: 'app-customfield-popup',
  templateUrl: './customfield-popup.component.html',
  styleUrls: ['./customfield-popup.component.scss']
})
export class CustomFieldPopupComponent implements OnInit {

  @Input () editNewTripCustomFieldData;
  @Output() isSavedNewTripHead = new EventEmitter<boolean>()
  customFieldForm: UntypedFormGroup;
  globalFormErrorList: any = [];

  constructor(
    private _fb: UntypedFormBuilder,
    private _newTripService:NewTripService
  ) {}

    ngOnInit() {
      this.buildForm();
    }

    ngOnChanges(): void {
      this.editNewTripCustomFieldData = this.editNewTripCustomFieldData;

    setTimeout(() => {
        if(this.editNewTripCustomFieldData.data){
          this.patchForm(this.editNewTripCustomFieldData.data);
        }
      }, 500);
    }

    buildForm(){
      this.customFieldForm = this._fb.group({
        other_details: this._fb.array([]),
      })
    }

    cancelButtonClick(){
     this.editNewTripCustomFieldData.show = false;
     this.isSavedNewTripHead.emit(false);
    }

    onOkButtonClick(){
      let form = this.customFieldForm
      this.processCutsomFieldData(form, 'other_details')
       if(form.valid){

         this._newTripService.postCustomFieldData(this.editNewTripCustomFieldData.data.id,form.value).subscribe(response=>{
          this.isSavedNewTripHead.emit(true);
          this.editNewTripCustomFieldData.show = false;
         })
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

    onDateTimeChange(fg: UntypedFormGroup){
      let date: moment.Moment = fg.get('value').value
      if (date == null) return
      fg.get('value').setValue(date.format('YYYY-MM-DDTHH:mm'));
    }

    ngOnDestroy() {}

    addErrorClass(controlName: AbstractControl) {
      return TransportValidator.addErrorClass(controlName);
    }

    patchForm(customFieldData) {
      const custom_field = this.customFieldForm.get('other_details') as UntypedFormArray;
      custom_field.controls = [];
      customFieldData.other_details.forEach((item) => {
        const customForm = this.buildFields(item);
        custom_field.push(customForm);
      });
    }

    buildFields(items: any) {
      return this._fb.group({
        field: [items.id],
        field_label: [items.field_label, [items.mandatory ? Validators.required : Validators.nullValidator]],
        value: [this.patchDatetimeField(items), [items.mandatory ? Validators.required : Validators.nullValidator]],
        mandatory: [items.mandatory],
        field_type: [items.field_type.data_type],
        option_list: [items['option_list'] ? items['option_list'] : []],
        selected_option: { label: items.value, value: items.value },
        disabled: [items.disable]
      })
    }

    patchDatetimeField(item){
        if (item.field_type.data_type == 'datetime') {
            if(item.value){
              return moment(item.value).format('YYYY-MM-DDTHH:mm')
            }else{
              return null
            }
        }
       return item.value
    }

    processCutsomFieldData(tripForm: UntypedFormGroup, formcontrol) {
      const custom_field = tripForm.get(formcontrol) as UntypedFormArray;
      custom_field.controls.forEach((item) => {
        if (item.get('field_type').value == "checkbox") {
          if (item.get('value').value == "false" || item.get('value').value == false) {
            item.get('value').setValue('')
          }
        }
        if (item.get('field_type').value == "date") {
          item.get('value').setValue(changeDateToServerFormat(item.get('value').value))
        }

        if (item.get('field_type').value != "datetime") {
          item.get('value').setValue(item.get('value').value.toString())
        }

      });
    }



  }
