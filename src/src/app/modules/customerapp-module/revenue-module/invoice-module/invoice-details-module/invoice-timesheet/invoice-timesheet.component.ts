import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-invoice-timesheet',
  templateUrl: './invoice-timesheet.component.html',
  styleUrls: ['./invoice-timesheet.component.scss']
})
export class InvoiceTimesheetComponent implements OnInit {

  @Input() timesheetList:Array<any>=[];
  @Output () viewDocEvent= new EventEmitter<any>();
  currency_type: any;
  viewUploadedDocs={
    show: false,
    data:{}
  }
 
  

  constructor(private currency:CurrencyService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    
  }
  viewUploadedDocument(data){
    this.viewUploadedDocs.data= cloneDeep({files:data.document});    
    this.viewUploadedDocs.show= true;
    this.viewDocEvent.emit(this.viewUploadedDocs)
  }

  
}
