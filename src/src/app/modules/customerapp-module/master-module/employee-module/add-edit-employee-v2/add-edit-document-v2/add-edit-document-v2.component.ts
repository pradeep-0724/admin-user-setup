import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-add-edit-document-v2',
  templateUrl: './add-edit-document-v2.component.html',
  styleUrls: ['./add-edit-document-v2.component.scss']
})
export class AddEditDocumentV2Component implements OnInit {

  addMoreForm: FormGroup;
  isEditDoc: boolean = false;
  isDelete: boolean = false;
  prenName = ''
  certificateErrMsg = '';
  documentNames = []
  constructor(private _fb: FormBuilder, private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any) { }


  ngOnInit(): void {
    this.isEditDoc = this.dialogData.isEdit;
    this.isDelete = this.dialogData.isDelete;
    this.documentNames = this.dialogData.documentNames;
    this.addMoreForm = this._fb.group({
      field_title: ['', [Validators.required]],
      is_expiry_mandatory:false
    });
    if(this.dialogData['prenName']){
      this.prenName=this.dialogData['prenName']
    }
    if(this.isEditDoc){
      this.addMoreForm.patchValue({
        field_title: this.prenName
      })
    }
    this.addMoreForm.get('field_title').valueChanges.subscribe((data)=>{
      this.checkForDuplicateNames()
    })
  }

  checkForDuplicateNames() {
    this.certificateErrMsg = '';
    if (isValidValue(this.addMoreForm.get('field_title').value)) {
      if (this.documentNames.includes((this.addMoreForm.get('field_title').value).toLowerCase())) {
        if(this.isEditDoc){
          if(this.addMoreForm.get('field_title').value.toLowerCase() !=this.prenName.toLowerCase()){
            this.certificateErrMsg = 'Certificate Name already exists'
            return false
          }else{
            this.certificateErrMsg = '';
            return true
          }
        }else{
          this.certificateErrMsg = 'Certificate Name already exists'
          return false
        }
    
      } else {
        this.certificateErrMsg = '';
        return true
      }
    } else {
      return false
    }

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  saveForm(form, isEdit) {
    if (form.valid) {
      if (this.checkForDuplicateNames()) {        
        let data = {
          isEdit: isEdit,
          isValid : true,
          field_name: this.addMoreForm.get('field_title').value,
          is_expiry_mandatory:this.addMoreForm.get('is_expiry_mandatory').value
        }
        this.dialogRef.close(data)
      } 
    }
    else {
      setAsTouched(form)
    }
  }

  deleteDoc() {
    let data = {
      isValid : false,
      isDelete : true
    }
    this.dialogRef.close(data)
  }



  close() {
    let data = {
      isValid : false,
      isDelete : false
    }
    this.certificateErrMsg = '';
    this.addMoreForm.reset();
    this.dialogRef.close(data)
  }

}
