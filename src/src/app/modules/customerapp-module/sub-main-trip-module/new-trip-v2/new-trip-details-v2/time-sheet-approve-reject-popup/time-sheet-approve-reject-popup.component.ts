import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-time-sheet-approve-reject-popup',
  templateUrl: './time-sheet-approve-reject-popup.component.html',
  styleUrls: ['./time-sheet-approve-reject-popup.component.scss']
})
export class TimeSheetApproveRejectPopupComponent implements OnInit {

  heading : string = '';
  approvalOrRejectForm : FormGroup
  remarkValue ='';
  placeHolder = '';
  timeSheetId = '';
  isApproved : boolean;
  constructor( private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,private _fb : FormBuilder, 
    private _newTripV2Service: NewTripV2Service) { }


  ngOnInit(): void {    
    this.placeHolder = this.dialogData.isApproved ? 'Note' : 'Mention the Reason for Rejection';
    this.approvalOrRejectForm = this._fb.group({
      remark: ['', [Validators.required]],
      is_approved : [this.dialogData.isApproved]
    })
    this.heading =  this.dialogData.heading;
    this.isApproved = this.dialogData.isApproved;
    this.timeSheetId = this.dialogData.timeSheetId
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
  
  close(){
    this.dialogRef.close()
  }

  save(form){    
    if(form.valid){
      this._newTripV2Service.approvalAction(this.timeSheetId, 
      cloneDeep(this.approvalOrRejectForm.value)).subscribe(resp => {
      this.dialogRef.close(true);})
    }  
    else{
      setAsTouched(form)
    }
  }

}