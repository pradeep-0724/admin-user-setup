import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-v2-edit-request-popup',
  templateUrl: './quotation-v2-edit-request-popup.component.html',
  styleUrls: ['./quotation-v2-edit-request-popup.component.scss']
})
export class QuotationV2EditRequestPopupComponent implements OnInit {

  constructor( private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,) { }

  ngOnInit(): void {
    console.log(this.dialogData);
    
  }
  close(){
    this.dialogRef.close();
  }


}
