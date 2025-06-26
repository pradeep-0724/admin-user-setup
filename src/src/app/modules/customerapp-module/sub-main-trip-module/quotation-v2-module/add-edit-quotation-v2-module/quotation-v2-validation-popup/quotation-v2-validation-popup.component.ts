import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-v2-validation-popup',
  templateUrl: './quotation-v2-validation-popup.component.html',
  styleUrls: ['./quotation-v2-validation-popup.component.scss']
})
export class QuotationV2ValidationPopupComponent implements OnInit {

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
      this.failedValidations = this.failedValidations.filter((ele)=>ele.action_key==='stop_quote_create')
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
