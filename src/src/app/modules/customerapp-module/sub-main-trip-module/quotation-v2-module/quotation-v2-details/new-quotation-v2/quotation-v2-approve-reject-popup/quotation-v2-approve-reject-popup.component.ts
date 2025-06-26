import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-quotation-v2-approve-reject-popup',
  templateUrl: './quotation-v2-approve-reject-popup.component.html',
  styleUrls: ['./quotation-v2-approve-reject-popup.component.scss']
})
export class QuotationV2ApproveRejectPopupComponent implements OnInit {

  heading : string = '';
  ApprovalOrRejectForm : FormGroup
  remarkValue ='';
  placeHolder = '';
  is_Approved : boolean;
  constructor( private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,private _fb : FormBuilder) { }

  ngOnInit(): void {    
    this.placeHolder = this.dialogData.isApproved ? 'Mention the Reason for Rejection' : 'Note';
    this.ApprovalOrRejectForm = this._fb.group({
      remark: ['', [Validators.required]],
      is_approved : ['']
    })
    this.heading =  this.dialogData.heading;
    this.is_Approved = this.dialogData.isApproved;

  }
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
  
  close(){
    this.dialogRef.close()
  }

  save(form){    
    if(this.dialogData.isApproved && form.valid){
      this.ApprovalOrRejectForm.get('is_approved').setValue(false)
      this.dialogRef.close(this.ApprovalOrRejectForm.value); 
    }else{
      setAsTouched(form)
    }
     if (!this.dialogData.isApproved){
      this.ApprovalOrRejectForm.get('is_approved').setValue(true)
      this.dialogRef.close(this.ApprovalOrRejectForm.value); 
    }

    
  }


}
