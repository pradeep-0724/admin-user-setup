import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
type RemarkType = {
  remark: string,
  isSave: boolean
}
@Component({
  selector: 'app-site-inspection-remark',
  templateUrl: './site-inspection-remark.component.html',
  styleUrls: ['./site-inspection-remark.component.scss']
})
export class SiteInspectionRemarkComponent implements OnInit {
  remarkForm = new FormGroup({
    remark: new FormControl('', [Validators.required])
  })
  popupType = ''

  constructor(@Inject(DIALOG_DATA) private dialogData: any, private dialogRef: DialogRef<RemarkType>,) { }

  ngOnInit(): void {
    this.popupType = this.dialogData['type']
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  cancel() {
    this.dialogRef.close({
      remark:'',
      isSave: false
     })
  }

  save() {
    const form = this.remarkForm
    if (form.valid) {
     this.dialogRef.close({
      remark:form.value['remark'],
      isSave: true
     })
    }else{
      setAsTouched(form)
    }
  }
}
