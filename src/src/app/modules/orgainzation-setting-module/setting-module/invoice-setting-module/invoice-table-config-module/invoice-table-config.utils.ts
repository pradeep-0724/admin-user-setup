import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

export class InvoiceTableConfigFormManupulation {
   
    configFieldFormArray: FormArray;
    constructor(public configFieldForm: FormGroup) {
      this.configFieldFormArray = this.configFieldForm.get('config_field') as FormArray;
    }

    generateConfigField(item) { 
        let _fb: FormBuilder = new FormBuilder()
        return _fb.group({
          display: [item.display],
          is_private: [item.is_private],
          id: [item.id || null],
          key:[item.key || null],
          field_type: [item.field_type],
          field_label: [item.field_label,[Validators.required]],
          field_for:[item.field_for],
          field_label_editable:[item.field_label_editable],
          field_for_editable:[item.field_for_editable],
          is_deletable: [item.is_deletable],
          order_no:[item.order_no],
          field_on:[item.field_on || ''],
          field_on_editable:[item.field_on_editable],
          error_msg:'',
          api_error:'',
        })
      }
  
      buildConfigFiled(items = []) {
        const configField = this.configFieldFormArray;
        configField.controls = [];
        items.forEach(custom => {
          const customForm = this.generateConfigField(custom);
          configField.push(customForm)
        })
      }

      getFormGroupAt(i):FormGroup{
       return  this.configFieldFormArray.at(i) as FormGroup;
      }


      latestOrder(){
       const customField =  this.configFieldFormArray;
       const ids=  customField.value.map(fields=>fields.id);
       return ids
      }

      getColumnList(){
        let selectedColumnList = []
        const customField = this.configFieldFormArray;
        customField.controls.forEach(form => {
          if (Number(form.get('display').value)<=2) {
            selectedColumnList.push(form.value)
          }
        })

        return selectedColumnList
      }

      getClientColumnCount(){
        let count = 0
        const customField = this.configFieldFormArray;
        customField.controls.forEach(form => {
          if ((!form.get('is_private').value) && Number(form.get('display').value)<=2 &&form.get('field_for').value=='column') {
           count++
          }
        })

        return count
      }
      getDescriptionList(){
        let selectedDescriptionList = []
        const customField = this.configFieldFormArray;
        customField.controls.forEach(form => {
          if (Number(form.get('display').value)<=2 && form.get('field_for').value=='description' && !form.get('is_private').value) {
            selectedDescriptionList.push(form.value)
          }
        })

        return selectedDescriptionList
      }

  
  }