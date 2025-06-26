import { FormBuilder, FormGroup, UntypedFormArray, Validators } from "@angular/forms";
import * as moment from 'moment';

export class CustomField{
    protected customFieldForm:FormGroup;
    protected _fb:FormBuilder= new FormBuilder();
    constructor(){};

    buildCustomField():FormGroup{
       
        this.customFieldForm=this._fb.group({
            other_details:this._fb.array([])
          });
      return  this.customFieldForm;   
    }


    private   buildCustomFieldsItems(items: any) {
        return this._fb.group({
          field: [items.id],
          field_label: [items.field_label, [items.mandatory ? Validators.required : Validators.nullValidator]],
          value: [items.value||'', [items.mandatory ? Validators.required : Validators.nullValidator]],
          mandatory: [items.mandatory],
          field_type: [items.field_type?.data_type],
          option_list: [items['option_list'] ? items['option_list'] : []],
          selected_option:{label:items.value,value:items.value}
        })
      }


      addCustomFields(items: any = []) {
        const custom_field = this.customFieldForm.get('other_details') as UntypedFormArray;
        custom_field.controls = [];
        items.forEach((item) => {
          if(item.field_type.data_type=="datetime")   {
           if(item.value){
             item.value= moment.tz(item.value, localStorage.getItem('timezone'))
           }
          }         
          const customForm = this.buildCustomFieldsItems(item);
          custom_field.push(customForm);
        });
      }


}