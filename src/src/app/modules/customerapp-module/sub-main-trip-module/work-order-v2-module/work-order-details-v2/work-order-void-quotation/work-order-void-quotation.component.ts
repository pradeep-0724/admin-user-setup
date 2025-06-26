import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-order-void-quotation',
  templateUrl: './work-order-void-quotation.component.html',
  styleUrls: ['./work-order-void-quotation.component.scss']
})
export class WorkOrderVoidQuotationComponent implements OnInit {

  
  constructor( private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any,) { }

  ngOnInit(): void {
    console.log(this.dialogData);
    
  }

  close(flag){
    this.dialogRef.close(flag);
  }

}
