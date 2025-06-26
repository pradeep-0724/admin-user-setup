import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CustomFormManupulation } from './custom-field-v2.utils';
import { CustomFieldServiceV2 } from '../customfield-v2.service';
import { Subject } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-custom-field-v2',
  templateUrl: './custom-field-v2.component.html',
  styleUrls: ['./custom-field-v2.component.scss']
})
export class CustomFieldV2Component implements OnInit,OnDestroy {
  customFieldForm: FormGroup;
  @Input() previewName = ''
  @Input() customFieldUrl = ''
  showAddCustomField = false;
  selectedColumnList = [];
  fieldTypeChange = new Subject()
  descriptionChange = new Subject()
  maxClientColumn = 10;
  activeColumn = 0;
  clientColumn = 0;
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  deleteId=''
  showOnlyNonPrivate=true;
  drop(event: CdkDragDrop<string[]>) {

    if (event.currentIndex != this.customFieldForm.controls.custom_field['controls'].length - 1)
      moveItemInArray(this.customFieldForm.controls.custom_field['controls'], event.previousIndex, event.currentIndex);
    this.addColumn();
    setTimeout(() => {
      const customField = new CustomFormManupulation(this.customFieldForm)
      customField.getFormGroupAt(event.currentIndex).get('order_no').setValue(event.currentIndex)
      customField.getFormGroupAt(event.previousIndex).get('order_no').setValue(event.previousIndex)
      this.updateOrder();
    }, 500);


  }
  constructor(private _fb: FormBuilder,private apiHandler: ApiHandlerService,
     private _customFieldServiceV2: CustomFieldServiceV2,private commonloaderservice: CommonLoaderService,) { }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.customFieldForm = this._fb.group({
      show_pdf_columns: [false],
      hide_pdf_empty_columns: [false],
      custom_field: this._fb.array([])
    });
    this.customFieldForm.get('custom_field').valueChanges.pipe(debounceTime(100)).subscribe(val => {
      this.addColumn();
    });
    this.getCustomFieldList();

    this.fieldTypeChange.pipe(debounceTime(1000)).subscribe(data => {
      this.updateFieldName(data)
    })

    this.descriptionChange.pipe(debounceTime(100)).subscribe(data => {
      this.updateDescription(data)
    })
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  addColumn() {
    const customField = new CustomFormManupulation(this.customFieldForm)
    this.selectedColumnList = customField.getColumnList();
    let isDescription=false;
    this.selectedColumnList.forEach(col=>{
     if(col.key=='description'){
      if(col.display==2){
       isDescription=true;
      }
     }
    })
    if(isDescription){
      this.activeColumn = this.selectedColumnList.length -1
    }else{
      this.activeColumn = this.selectedColumnList.length
    }
  
    this.clientColumn = customField.getClientColumnCount()
  }


  getCustomFieldList() {
    this._customFieldServiceV2.getCustomFieldList(this.customFieldUrl).subscribe(resp => {
      console.log(resp['result'])
      this.customFieldForm.patchValue(resp['result'])
      const customField = new CustomFormManupulation(this.customFieldForm)
      customField.buildCustomFiled(resp['result'].fields)
      this.addColumn();
      this.showOnlyNonPrivate = this.customFieldForm.get('show_pdf_columns').value
    })
  }

  modalClosed(e) {
    if (e) {
      this.getCustomFieldList();
    }
    this.showAddCustomField = false;
  }

  showPdfColumns() {
    let payLoad = {
      show_pdf_columns: this.customFieldForm.get('show_pdf_columns').value
    }
    this.showOnlyNonPrivate = this.customFieldForm.get('show_pdf_columns').value
    this.updateCustomField(payLoad)
  }

  hidePdfEmptyColums() {
    let payLoad = {
      hide_pdf_empty_columns: this.customFieldForm.get('hide_pdf_empty_columns').value
    }
    this.updateCustomField(payLoad)
  }

  changeVisibility(form: FormGroup) {
    if(form.get('is_private').value){
      if (form.get('display').value == 2) {
        form.get('display').setValue(3)
      } else {
        form.get('display').setValue(2)
      }
      let payLoad = {
        display: form.get('display').value,
        field_id: form.get('id').value
      }
      this.updateCustomField(payLoad)
    }else{
      if (form.get('display').value == 3) {
        if (this.clientColumn >= 10) {
          form.get('display').setValue(3)
          form.get('error_msg').setValue("error");
          setTimeout(() => {
            form.get('error_msg').setValue("");
          }, 4000);
        } else {
          form.get('display').setValue(2)
          let payLoad = {
            display: form.get('display').value,
            field_id: form.get('id').value
          }
          this.updateCustomField(payLoad)
        }
      } else {
        if (form.get('display').value == 2) {
          form.get('display').setValue(3)
        } else {
          form.get('display').setValue(2)
        }
        let payLoad = {
          display: form.get('display').value,
          field_id: form.get('id').value
        }
        this.updateCustomField(payLoad)
      }
    }
   

  }

  updateCustomField(payLoad) {
    this._customFieldServiceV2.putCustomField(this.customFieldUrl, payLoad).subscribe(resp => {
      this.addColumn();
    })
  }

  changeFieldName(form: FormGroup) {
    if(form.valid)
    this.fieldTypeChange.next(form.value)

  }

  changeDescription(form: FormGroup) {
    this.descriptionChange.next(form.value)
  }

  updateFieldName(value) {
    let formArray= this.customFieldForm.controls.custom_field as FormArray
    let payLoad = {
      field_label: value['field_label'],
      field_id: value['id']
    }
    this._customFieldServiceV2.putCustomField(this.customFieldUrl, payLoad).subscribe(resp => {
    },error=>{
     formArray.controls.forEach(field=>{
      if(field.get('id').value==value['id']){
        field.get('field_label').setValue(error.error.result.last_column_name)
        field.get('api_error').setValue('error')
        setTimeout(() => {
          field.get('api_error').setValue('')
        }, 4000);
      }
     })
    })
  }

  updateDescription(value){
    let payLoad = {
      description: value['description'],
      field_id: value['id']
    }
    this.updateCustomField(payLoad)
  }

  changePrivate(form: FormGroup) {
    let payLoad = {
      is_private: form.get('is_private').value,
      field_id: form.get('id').value
    }
    if (!form.get('is_private').value) {
      if (this.clientColumn >= 10) {
        form.get('is_private').setValue(true)
        form.get('error_msg').setValue("error");
        setTimeout(() => {
          form.get('error_msg').setValue("");
        }, 4000);
        payLoad = {
          is_private: form.get('is_private').value,
          field_id: form.get('id').value
        }
      } else {
        this.updateCustomField(payLoad)
      }
    } else {
      this.updateCustomField(payLoad)
    }
  }

  changeFieldType(form: FormGroup) {
    let payLoad = {
      field_type: form.get('field_type').value,
      field_id: form.get('id').value
    }
    this.updateCustomField(payLoad)
  }

  updateOrder() {
    const customField = new CustomFormManupulation(this.customFieldForm)
    let payLoad = {
      field_ids: customField.latestOrder()
    }
    this._customFieldServiceV2.putCustomFieldOrder(this.customFieldUrl, payLoad).subscribe(resp => {
    })
  }

  confirmButton(e){
   if(e){
    this.commonloaderservice.getShow()
     this.apiHandler.handleRequest(this._customFieldServiceV2.deleteCustomField(this.customFieldUrl, this.deleteId), 'Custom Field deleted successfully!').subscribe(
       {
         next: () => {
           this.commonloaderservice.getHide()
           this.getCustomFieldList()
         },
         error: () => {
           this.commonloaderservice.getHide()
         }
       }
     )
   }
  }

  deleteField(form: FormGroup){
    this.deleteId= form.get('id').value,
    this.popupInputData.show=true;
 
  }



}
