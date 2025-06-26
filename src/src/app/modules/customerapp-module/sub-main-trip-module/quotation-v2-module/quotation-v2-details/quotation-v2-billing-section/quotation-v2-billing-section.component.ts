import { Component, Input, OnInit } from '@angular/core';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { Dialog } from '@angular/cdk/dialog';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import moment from 'moment';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';

@Component({
  selector: 'app-quotation-v2-billing-section',
  templateUrl: './quotation-v2-billing-section.component.html',
  styleUrls: ['./quotation-v2-billing-section.component.scss']
})
export class QuotationV2BillingSectionComponent implements OnInit {
  @Input() quotationDetail: any
  terminology: any;
  isTax: boolean = false;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  fraightTab=1;
  currency_type;
  quotationDocuments=[];

  constructor( private _terminologiesService: TerminologiesService, private _isTax: TaxService, public dialog: Dialog,
  private currency: CurrencyService,private _quotationV2Service: QuotationV2Service) { }
  billingTypeList = new NewTripV2Constants().WorkOrderbillingTypeList;

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.isTax = this._isTax.getTax();
    this.terminology = this._terminologiesService.terminologie;   
    this.getQuotationDocuments() 
  };

  getBillingType(type) {
    return this.billingTypeList.filter(types => types.value == type)[0].label
  }

  
  formatDate(date){
    return moment(date).format("DD-MM-YYYY")
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
    if (type==0){
      return 'truck'
    }else if (type==1){
      return 'crane'
    }else if (type == 2){
      return 'awp'
    }
  }

}
