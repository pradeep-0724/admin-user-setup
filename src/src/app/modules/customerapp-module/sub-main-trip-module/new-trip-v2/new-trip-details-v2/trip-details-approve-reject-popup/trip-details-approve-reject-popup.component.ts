import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-trip-details-approve-reject-popup',
  templateUrl: './trip-details-approve-reject-popup.component.html',
  styleUrls: ['./trip-details-approve-reject-popup.component.scss']
})
export class TripDetailsApproveRejectPopupComponent implements OnInit {

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

