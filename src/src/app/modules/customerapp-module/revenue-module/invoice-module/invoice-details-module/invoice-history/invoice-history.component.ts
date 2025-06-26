import { Component, Input, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash';
import { CommonService } from 'src/app/core/services/common.service';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';

@Component({
  selector: 'app-invoice-history',
  templateUrl: './invoice-history.component.html',
  styleUrls: ['./invoice-history.component.scss']
})
export class InvoiceHistoryComponent implements OnInit {
@Input() invoiceId:string='';
invoiceHistory:any;
defaultInvoiceHistory:any;
currI=-1;
currJ=-1;




  constructor(private _invoiceService :InvoiceService,private _commonService:CommonService) { }
  

  ngOnInit(): void {
    this.getInvoiceHistory()
  }
  getInvoiceHistory(){
    this._invoiceService.getInvoiceHistory(this.invoiceId).subscribe((data:any)=>{
      this.invoiceHistory=data?.result;
      this.defaultInvoiceHistory=cloneDeep(this.invoiceHistory)

    })
  }
  cancelEdit(i,j){
    this.invoiceHistory[i]['values'][j].message=this.defaultInvoiceHistory[i]['values'][j]?.message;
    this.currI=-1;
    this.currJ=-1;
  }

  editRequest(type,id,remark){
    const payLoad={
      action:type,
      remark:remark
    }
    this._commonService.editRequestOperations(id,payLoad).subscribe(resp=>{
      this.currI=-1;
      this.currJ=-1;
     this.getInvoiceHistory()
    })
  }

}
