import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';

@Component({
  selector: 'app-new-quotation-v2-trailer-charge-section',
  templateUrl: './new-quotation-v2-trailer-charge-section.component.html',
  styleUrls: ['./new-quotation-v2-trailer-charge-section.component.scss']
})
export class NewQuotationV2TrailerChargeSectionComponent implements OnInit {
  @Input() quotationDetail;any;
  selectedTab=1;
  isTax=false;
  vehObject:any;
  currency_type;
  quotationDocuments = [];
  constructor(private _tax:TaxService,private _currency:CurrencyService,private _quotationV2Service: QuotationV2Service) { }

  ngOnInit(): void {
    this.currency_type = this._currency.getCurrency();
    this.isTax = this._tax.getTax();
    this.vehObject=this.quotationDetail[this.findCategory(this.quotationDetail?.vehicle_category)];
    this.getQuotationDocuments();
  }

  fileUploader(e){
    let documents=[];
    e.forEach(element => {
      documents.push(element.id);
      element['presigned_url']=element['url']
      this.quotationDocuments.push(element)
    });
    let payload={
      documents:documents
    }
    this._quotationV2Service.uploadQuotationDocument(this.quotationDetail.id,payload).subscribe(resp=>{
    });
  }

  getQuotationDocuments(){
    this._quotationV2Service.getUploadedQuotationDocuments(this.quotationDetail.id).subscribe(resp=>{
      this.quotationDocuments=resp['result']['doc'];
    });
  }

  fileDeleted(id){
    this.quotationDocuments =  this.quotationDocuments.filter(doc=>doc.id !=id);
    this._quotationV2Service.deleteUploadedQuotationDocuments(id).subscribe(resp=>{
    });
  }
  
  findCategory(type){
    if (type==3){
      return 'loose_cargo'
    }else if (type==4){
      return 'container'
    }
  }

}
