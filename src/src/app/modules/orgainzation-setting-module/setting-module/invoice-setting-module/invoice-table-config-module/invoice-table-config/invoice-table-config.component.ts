import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { InvoiceTableConfigFormManupulation } from '../invoice-table-config.utils';
import { InvoiceTableConfigService } from '../invoice-table-config.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { categoryOptions } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-invoice-table-config',
  templateUrl: './invoice-table-config.component.html',
  styleUrls: ['./invoice-table-config.component.scss']
})
export class InvoiceTableConfigComponent implements OnInit, OnDestroy,OnChanges {
  configFieldForm: FormGroup;
  previewName = 'Item Table Configuration'
  customFieldUrl = 'revenue/invoice/cf/freight/'
  @Input()category=''
  selectedColumnList = [];
  maxClientColumn = 10;
  activeColumn = 0;
  clientColumn = 0;
  showOnlyNonPrivate = true;
  @Input()defaultRentalChargeTerm=''
  descriptionList=[];
  categoryOptions=categoryOptions
  isTaxApplicable = true;
  drop(event: CdkDragDrop<string[]>) {
    if (event.currentIndex != this.configFieldForm.controls.config_field['controls'].length - 1)
      moveItemInArray(this.configFieldForm.controls.config_field['controls'], event.previousIndex, event.currentIndex);
    this.addColumn();
    setTimeout(() => {
      const configField = new InvoiceTableConfigFormManupulation(this.configFieldForm)
      configField.getFormGroupAt(event.currentIndex).get('order_no').setValue(event.currentIndex)
      configField.getFormGroupAt(event.previousIndex).get('order_no').setValue(event.previousIndex)
      this.updateOrder();
    }, 500);


  }
  constructor(private _fb: FormBuilder,private _tax:TaxService,
    private _configFieldService: InvoiceTableConfigService, private commonloaderservice: CommonLoaderService,private apiHandler: ApiHandlerService,) { }

  ngOnInit(): void {
    this.isTaxApplicable=this._tax.getTax();
    this.commonloaderservice.getHide();
    this.configFieldForm = this._fb.group({
      show_pdf_columns: [false],
      hide_pdf_empty_columns: [false],
      config_field: this._fb.array([])
    });
    this.configFieldForm.get('config_field').valueChanges.pipe(debounceTime(100)).subscribe(val => {
      this.addColumn();
    });

  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['category'] && changes['category']['currentValue'] ) {
      this.getConfigFieldList();
    }
  }

  addColumn() {
    const configField = new InvoiceTableConfigFormManupulation(this.configFieldForm)
    this.selectedColumnList = configField.getColumnList();
    this.clientColumn = configField.getClientColumnCount()
    this.descriptionList = configField.getDescriptionList();
    this.descriptionList= this.descriptionList.map((des:any) => des.field_label)
    this.activeColumn = this.selectedColumnList.filter(col=>col.field_for=='column').length;
  }


  getConfigFieldList() {
    this._configFieldService.getConfigFieldList(this.customFieldUrl,this.categoryOptions[this.category] ).subscribe(resp => {
      this.configFieldForm.patchValue(resp['result'])
      const configField = new InvoiceTableConfigFormManupulation(this.configFieldForm)
      if(this.isTaxApplicable){
        configField.buildConfigFiled(resp['result'].fields)
      }else{
        configField.buildConfigFiled(resp['result'].fields.filter(field => field.key !== 'amount' && field.key !== 'tax_amount'))
      }
      this.addColumn();
      this.showOnlyNonPrivate = this.configFieldForm.get('show_pdf_columns').value
    })
  }


  showPdfColumns() {
    let payLoad = {
      category:this.categoryOptions[this.category],
      show_pdf_columns: this.configFieldForm.get('show_pdf_columns').value
    }
    this.showOnlyNonPrivate = this.configFieldForm.get('show_pdf_columns').value
    this.updateConfigField(payLoad)
  }

  hidePdfEmptyColums() {
    let payLoad = {
      category:this.categoryOptions[this.category],
      hide_pdf_empty_columns: this.configFieldForm.get('hide_pdf_empty_columns').value
    }
    this.updateConfigField(payLoad)
  }

  changeFieldFor(form: FormGroup) {
    if (form.get('field_for').value == 'column') {
      if (this.clientColumn >= 10) {
        form.get('field_for').setValue('description')
        form.get('error_msg').setValue("error");
        setTimeout(() => {
          form.get('error_msg').setValue("");
        }, 4000);
      } else {
        let payLoad = {
          category:this.categoryOptions[this.category],
          field_for: form.get('field_for').value,
          field_id: form.get('id').value
        }
        this.updateConfigField(payLoad)
      }
    }else{
      let payLoad = {
        category:this.categoryOptions[this.category],
        field_for: form.get('field_for').value,
        field_id: form.get('id').value
      }
      this.updateConfigField(payLoad)

    }
  }

  changeFieldOn(form: FormGroup) {
     let payLoad = {
        category:this.categoryOptions[this.category],
        field_on: form.get('field_on').value,
        field_id: form.get('id').value
      }
      this.updateConfigField(payLoad)
  }

  changeVisibility(form: FormGroup) {
    if (form.get('is_private').value) {
      if (form.get('display').value == 2) {
        form.get('display').setValue(3)
      } else {
        form.get('display').setValue(2)
      }
      let payLoad = {
        category:this.categoryOptions[this.category],
        display: form.get('display').value,
        field_id: form.get('id').value
      }
      this.updateConfigField(payLoad)
    } else {
      if (form.get('display').value == 3) {
        if(form.get('field_for').value == 'column'){
          if (this.clientColumn >= 10) {
            form.get('display').setValue(3)
            form.get('error_msg').setValue("error");
            setTimeout(() => {
              form.get('error_msg').setValue("");
            }, 4000);
          } else {
            form.get('display').setValue(2)
            let payLoad = {
              category:this.categoryOptions[this.category],
              display: form.get('display').value,
              field_id: form.get('id').value
            }
            this.updateConfigField(payLoad)
          }
        }else{
          form.get('display').setValue(2)
          let payLoad = {
            category:this.categoryOptions[this.category],
            display: form.get('display').value,
            field_id: form.get('id').value
          }
          this.updateConfigField(payLoad)
        }
       
      } else {
        if (form.get('display').value == 2) {
          form.get('display').setValue(3)
        } else {
          form.get('display').setValue(2)
        }
        let payLoad = {
          category:this.categoryOptions[this.category],
          display: form.get('display').value,
          field_id: form.get('id').value
        }
        this.updateConfigField(payLoad)
      }
    }


  }

  updateConfigField(payLoad) {
    this.addColumn();
    this.apiHandler.handleRequest(this._configFieldService.putConfigField(this.customFieldUrl, payLoad), `Updated successfully!`).subscribe(
      {
        next: () => {
        }
      }
    );
  }

  changeFieldName(form: FormGroup) {
    if (form.valid &&form.get('field_label_editable').value)
     this.updateFieldName(form.value)
  }

  updateFieldName(value) {
    let formArray = this.configFieldForm.controls.config_field as FormArray
    let payLoad = {
      category:this.categoryOptions[this.category],
      field_label: value['field_label'],
      field_id: value['id']
    }
    this.apiHandler.handleRequest(this._configFieldService.putConfigField(this.customFieldUrl, payLoad), 'Updated successfully!').subscribe(
      {
        next: () => {
        },
        error: (err) => {
          formArray.controls.forEach(field => {
            if (field.get('id').value == value['id']) {
              field.get('field_label').setValue(err.error.result.last_column_name)
              field.get('api_error').setValue('error')
              setTimeout(() => {
                field.get('api_error').setValue('')
              }, 4000);
            }
          })
        },
      }
    )

  }



  changePrivate(form: FormGroup) {
    let payLoad = {
      category:this.categoryOptions[this.category],
      is_private: form.get('is_private').value,
      field_id: form.get('id').value
    }
    if (!form.get('is_private').value) {
      if(form.get('field_for').value == 'column'){
        if (this.clientColumn >= 10) {
          form.get('is_private').setValue(true)
          form.get('error_msg').setValue("error");
          setTimeout(() => {
            form.get('error_msg').setValue("");
          }, 4000);
          payLoad = {
            category:this.categoryOptions[this.category],
            is_private: form.get('is_private').value,
            field_id: form.get('id').value
          }
        } else {
          this.updateConfigField(payLoad)
        }
      }else{
        this.updateConfigField(payLoad)
      }
    } else {
      this.updateConfigField(payLoad)
    }
  }

  changeFieldType(form: FormGroup) {
    let payLoad = {
      category:this.categoryOptions[this.category],
      field_type: form.get('field_type').value,
      field_id: form.get('id').value
    }
    this.updateConfigField(payLoad)
  }

  updateOrder() {
    const configField = new InvoiceTableConfigFormManupulation(this.configFieldForm)
    let payLoad = {
      field_ids: configField.latestOrder()
    }
    this.apiHandler.handleRequest( this._configFieldService.putConfigFieldOrder(this.customFieldUrl,this.categoryOptions[this.category], payLoad), `Updated successfully!`).subscribe(
     {
       next: () => {
      }
     });
  }
}