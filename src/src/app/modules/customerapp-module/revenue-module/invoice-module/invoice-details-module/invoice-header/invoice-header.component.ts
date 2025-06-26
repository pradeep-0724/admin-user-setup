import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { addressToText } from 'src/app/shared-module/utilities/pdfmake-uitls';
import { InvoicePdfViewComponent } from '../invoice-pdf-view/invoice-pdf-view.component';
import { EditRequestComponent } from 'src/app/modules/customerapp-module/edit-request-module/edit-request.component';
import { forkJoin } from 'rxjs';
import { InvoiceService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/invoice-service/invoice.service';
import { CommonService } from 'src/app/core/services/common.service';
import { InvoicePdfDataService } from '../invoice-pdf-view/invoicePdfData.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-invoice-header',
  templateUrl: './invoice-header.component.html',
  styleUrls: ['./invoice-header.component.scss']
})
export class InvoiceHeaderComponent implements OnInit {
  @Input() invoiceDetail
  @Input() invoiceId;
  @Output() editRequestClicked=new EventEmitter()
  currency_type
  invoicePdfData={
    company_logo:'',
    invoiceData:{},
    tripChallanDocumentList:[]
  }
  constructor(private _route:ActivatedRoute,private _router:Router,		private currency: CurrencyService, private dialog:Dialog, 
       private _invoiceService: InvoiceService,private _commonService: CommonService,private _invoicePdfDataService:InvoicePdfDataService
       
  
    ) { }
  isFormList=false;
  preFixUrl=getPrefix()
  invoicePermission= Permission.invoice.toString().split(',')
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('formList')) {
        this.isFormList = true;
      }
    });
    this.invoicePdfView();
  }
  historyBack() {
      if(this.isFormList){
        history.back();
      }else{
        this._router.navigate([this.preFixUrl+'/income/invoice/list'])
      }  
  }

  getAddressIntext(address){
    const addressText=addressToText(address, 1, -1)
    return addressText!="\n\n\n"?addressText:'-'
  }
  
  openPdf() {
    if(isValidValue(this.invoicePdfData.invoiceData)){
      setTimeout(() => {
          this._invoicePdfDataService.newPdfData(this.invoicePdfData)
      }, 10);
    }
   
    const dialogRef = this.dialog.open(InvoicePdfViewComponent, {
      minWidth: '75%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe()
    });
  }

  editRequest() {
    const dialogRef = this.dialog.open(EditRequestComponent, {
      width: '500px',
      maxWidth: '90%',
      data: {
        heading:'Edit Request',
        url:`revenue/invoice/edit_request/${this.invoiceId}/`,
        areRemarksMandatory : true
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this.editRequestClicked.emit(result)
      dialogRefSub.unsubscribe()
    });
  }

   invoicePdfView() {
      let invoiceData = this._invoiceService.getInvoicePrintView(this.invoiceId);
      let invoiceDoc = this._invoiceService.getTripDocumentChallan(this.invoiceId);
      let logo = this._commonService.fetchCompanyLogo();
      forkJoin([invoiceData, invoiceDoc, logo]).subscribe((response) => {
        this.invoicePdfData.company_logo = response[2]['result']['image_blob'];
        this.invoicePdfData.invoiceData = response[0]['result'];
        this.invoicePdfData.tripChallanDocumentList = response[1]['result'];  
        this._invoicePdfDataService.newPdfData(this.invoicePdfData)
      })
  
    }
}


