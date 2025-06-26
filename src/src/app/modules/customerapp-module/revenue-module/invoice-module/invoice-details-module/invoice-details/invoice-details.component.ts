import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Subject, combineLatest } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';

@Component({
  selector: 'app-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent implements OnInit,OnDestroy {

  constructor(private _route:ActivatedRoute,private _invoiceService: InvoiceService,private _loader:CommonLoaderService
    ) { }
  invoiceId=''
  invoiceDetails=new Subject();
  timesheetList:Array<any>=[];
  viewUploadedDocs={
    show: false,
    data:{}
  }
 
  ngOnInit() : void {
    this._loader.getHide()
    combineLatest([
      this._route.params,
      this._route.queryParams 
    ]).subscribe(([params, queryParams]) => {
      if(queryParams['viewId']){
        this.invoiceId = queryParams['viewId']
      }else{
        this.invoiceId  = params['invoice_id']
      }
      this.getInvoiceView();
    });
    this.getTimesheets()
  }

  viewUploadedDoc(data){
    this.viewUploadedDocs=cloneDeep(data)

  }

  getInvoiceView(){
    this._invoiceService.getInvoiceDetailsView(this.invoiceId).subscribe(resp=>{
    this.invoiceDetails.next(resp['result'])
    });
  }
  getTimesheets(){
    this._invoiceService.getInvoiceTimesheets(this.invoiceId).subscribe((res:any)=>{
      this.timesheetList=res.result
    })
  
  }

  ngOnDestroy(): void {
    this._loader.getShow()
  }

  editRequestClicked(e){
    if(e){
      this.invoiceDetails.next(null)
      this.getInvoiceView()
    }
  }

}
