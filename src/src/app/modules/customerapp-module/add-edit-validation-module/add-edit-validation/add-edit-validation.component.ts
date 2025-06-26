import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { ValidationService } from '../validation-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

type validationType = {
  type: string,
  validationList: Array<any>,
  editData: any,
  url: string

}
@Component({
  selector: 'app-add-edit-validation',
  templateUrl: './add-edit-validation.component.html',
  styleUrls: ['./add-edit-validation.component.scss']
})
export class AddEditValidationComponent implements OnInit {
  validationForm: FormGroup
  validationList = [];
  conditionList = [];
  actionList = [];
  optionsList  = [];
  apiError = ''
  initialValues = {
    validation: getBlankOption(),
    condition: getBlankOption(),
    value: getBlankOption(),
    action: getBlankOption()
  }
  valueType = ''
  validationName = '';
  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private popupData: validationType, private _fb: FormBuilder, private _validationService: ValidationService,
  private apiHandler: ApiHandlerService) { }

  ngOnInit(): void {
    this.validationForm = this._fb.group({
      id: null,
      validation: ['', Validators.required],
      condition: ['', Validators.required],
      value: ['', Validators.required],
      action: ['', Validators.required],
      message: ['', Validators.required],
    })
    this.validationList = this.popupData['validationList']

    if (this.popupData.type == 'Edit') {      
      this._validationService.getValidations(this.popupData.url, this.popupData.editData).subscribe(resp => {
        this.patchValidations(resp['result']);
        this.validationName = resp['result']['validation']['label']
      })
    }


  }

  close() {
    this.dialogRef.close(false)
  }

  save() {
    let form = this.validationForm;
    if (form.valid) {
      if (this.popupData.type == 'Add') {
        this.apiHandler.handleRequest(this._validationService.postValidations(this.popupData.url, form.value),  'Validation added successfully!' ).subscribe(
          {
            next: () => {
              this.dialogRef.close(true)
            },
            error: (error) => {
              this.apiError = error.error.message
            }
          }
        )
      } else {
        this.apiHandler.handleRequest(this._validationService.putValidations(this.popupData.url, form.value), `${this.validationName} updated successfully!`).subscribe(
          {
            next: () => {
              this.dialogRef.close(true)
            },
            error: (error) => {
              this.apiError = error.error.message
            }
          }
        )
      }
    } else {
      setAsTouched(form)
    }

  }
  onChangeValidation() {
    this.validationForm.patchValue({
      condition: '',
      value: '',
      action: '',
      message: ''
    })
    this.initialValues.action = getBlankOption();
    this.initialValues.value = getBlankOption();
    this.initialValues.condition = getBlankOption();
    this.builtList()
  }

  builtList() {
    const validationData = this.validationList.find(validations => validations['validation']['key'] == this.validationForm.get('validation').value)
    if (validationData) {
      this.actionList = validationData['actions'];
      this.conditionList = validationData['conditions'];
      this.valueType = validationData['value']['type'];
      this.optionsList = validationData['value']['options'];
      if (this.valueType == 'disabled') {
        setUnsetValidators(this.validationForm, 'value', [Validators.nullValidator])
      } else {
        setUnsetValidators(this.validationForm, 'value', [Validators.required])
      }
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  patchValidations(data) {

    this.validationForm.patchValue({
      id: data.id,
      validation: data?.validation?.key,
      condition: data?.condition?.key,
      value: data?.value?.value,
      action: data?.action?.key,
      message: data?.message,
    })

    this.initialValues.action = { label: data?.action?.label, value: data?.action?.key };
    this.initialValues.condition = { label: data?.condition?.label, value: data?.condition?.key };
    this.initialValues.validation = { label: data?.validation?.label, value: data?.validation?.key };
    this.initialValues.value =  { label: data?.value?.value, value: data?.value?.value };
    this.builtList()
  }

}
