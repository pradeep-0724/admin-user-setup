import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-trip-v2-validation',
  templateUrl: './add-trip-v2-validation.component.html',
  styleUrls: ['./add-trip-v2-validation.component.scss']
})
export class AddTripV2ValidationComponent implements OnInit {

  failedValidations: any;
  is_Submit: boolean;
  heading = '';
  remarkValue = '';
  remarkErrMsg = '';
  constructor(private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,) { }

  ngOnInit(): void {
    this.failedValidations = this.dialogData.data;
    this.is_Submit = this.dialogData.is_Submit;
    this.heading = this.dialogData.heading;
    if(!this.is_Submit){
      this.failedValidations = this.failedValidations.filter((ele)=>ele.action_key==='stop_job_create')
    }
  }

  onModelChange(e) {
    this.remarkErrMsg = '';
    if (this.remarkValue.length == 0) {
      this.remarkErrMsg = 'Please enter remarks';
    } else {
      this.remarkErrMsg = '';
    }

  }
  close(){
    this.dialogRef.close()
  }

  save(status) {
    if (this.remarkValue.length >0 ) {
      let data = {
        remarkValue: this.remarkValue,
        is_approved: status
      }
      this.dialogRef.close(data)
    }else{
      this.remarkErrMsg = 'Please enter remarks';
    }
  }

}
