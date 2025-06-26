import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-v2-void-popup',
  templateUrl: './quotation-v2-void-popup.component.html',
  styleUrls: ['./quotation-v2-void-popup.component.scss']
})
export class QuotationV2VoidPopupComponent implements OnInit {

  constructor( private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,) { }

  ngOnInit(): void {
    console.log(this.dialogData);
    
  }

  close(flag){
    this.dialogRef.close(flag);
  }

}
