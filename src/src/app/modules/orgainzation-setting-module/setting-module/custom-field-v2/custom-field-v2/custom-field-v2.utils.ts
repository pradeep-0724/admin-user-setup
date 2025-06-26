import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";

export class CustomFormManupulation {
   
    customFieldFormArray: FormArray;
    constructor(public customFieldForm: FormGroup) {
      this.customFieldFormArray = this.customFieldForm.get('custom_field') as FormArray;
    }

    generateCustomField(item) {
        let _fb: FormBuilder = new FormBuilder()
        return _fb.group({
          system_created: [item.system_created],
          display: [item.display],
          is_private: [item.is_private],
          id: [item.id || null],
          key:[item.key || null],
          field_type: [item.field_type],
          field_label: [item.field_label,[Validators.required]],
          description: [item.description],
          is_edit_deletable: [item.is_edit_deletable],
          order_no:[item.order_no],
          error_msg:'',
          api_error:'',
        })
      }
  
      buildCustomFiled(items = []) {
        const customField = this.customFieldFormArray;
        customField.controls = [];
        items.forEach(custom => {
          const customForm = this.generateCustomField(custom);
          customField.push(customForm)
        })
      }

      getFormGroupAt(i):FormGroup{
       return  this.customFieldFormArray.at(i) as FormGroup;
      }


      latestOrder(){
        const customField =  this.customFieldFormArray;
       const ids=  customField.value.map(fields=>fields.id);
       return ids
      }

      getColumnList(){
        let selectedColumnList = []
        const customField = this.customFieldFormArray;
        customField.controls.forEach(form => {
          if (Number(form.get('display').value)<=2) {
            selectedColumnList.push(form.value)
          }
        })

        return selectedColumnList
      }

      getClientColumnCount(){
        let count = 0
        const customField = this.customFieldFormArray;
        customField.controls.forEach(form => {
          if ((!form.get('is_private').value) && Number(form.get('display').value)<=2 && form.get('key').value!='description') {
           count++
          }
        })

        return count
      }

  
  }