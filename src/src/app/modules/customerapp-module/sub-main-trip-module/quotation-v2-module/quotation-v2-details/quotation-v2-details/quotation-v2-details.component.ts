import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { QuotationV2Service } from '../../../../api-services/trip-module-services/quotation-service/quotation-service-v2';
import { Subject, combineLatest} from 'rxjs';
import { QuotationV2DataService } from '../../quotation-v2-data-service.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
@Component({
  selector: 'app-quotation-v2-details',
  templateUrl: './quotation-v2-details.component.html',
  styleUrls: ['./quotation-v2-details.component.scss']
})
export class QuotationV2DetailsComponent implements OnInit, OnDestroy {

  constructor(private _analytics: AnalyticsService, private commonloaderservice: CommonLoaderService, private _route: ActivatedRoute, private _quotationV2Service: QuotationV2Service, private _quotationV2DataService: QuotationV2DataService) { }
  quotationId: string = '';
  quotationDetails: Subject<any> = new Subject();
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  vehicle_category:any=-1;

  ngOnInit(): void {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.VIEW,"Navigated");
    this.commonloaderservice.getHide();
    combineLatest([
      this._route.params,
      this._route.queryParams
    ]).subscribe(([params, queryParams]) => {
      if(queryParams['viewId']){
        this.quotationId = queryParams['viewId']
      }else{
        this.quotationId = params['quotation-id'];
      }
      this.getQuotationDetails();
      this.quotationDetails.next(null)
    });
    
    this._quotationV2DataService.newQuotationUpdate.subscribe(isUpdate => {      
      if (isUpdate) this.getQuotationDetails();
    })
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }

  getQuotationDetails() {
    this.vehicle_category=-1
    this._quotationV2Service.getQuotationDetails(this.quotationId).subscribe(resp => {
      this.vehicle_category = resp['result'].vehicle_category
      setTimeout(() => {
        this.quotationDetails.next(resp['result'])
      }, 100);
    })
  }  

}
