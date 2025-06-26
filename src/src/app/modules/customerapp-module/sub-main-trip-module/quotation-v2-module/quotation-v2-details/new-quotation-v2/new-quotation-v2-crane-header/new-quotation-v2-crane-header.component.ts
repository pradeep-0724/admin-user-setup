import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { QuotationV2PdfComponent } from '../../quotation-v2-pdf/quotation-v2-pdf.component';
import { QuotationCommentsComponent } from '../../quotation-comments/quotation-comments.component';
import { QuotationV2VoidPopupComponent } from '../quotation-v2-void-popup/quotation-v2-void-popup.component';
import { QuotationV2EditRequestPopupComponent } from '../quotation-v2-edit-request-popup/quotation-v2-edit-request-popup.component';
import { QuotationV2DataService } from '../../../quotation-v2-data-service.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { EditRequestComponent } from 'src/app/modules/customerapp-module/edit-request-module/edit-request.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { forkJoin, Subject } from 'rxjs';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';


@Component({
  selector: 'app-new-quotation-v2-crane-header',
  templateUrl: './new-quotation-v2-crane-header.component.html',
  styleUrls: ['./new-quotation-v2-crane-header.component.scss']
})
export class NewQuotationV2CraneHeaderComponent implements OnInit {

  constructor(private _route:ActivatedRoute, private _analytics: AnalyticsService, public dialog: Dialog, private _quotationService: QuotationV2Service, private _commonService: CommonService, private router: Router,
    private _quotationV2DataService: QuotationV2DataService,private _ngxPermission:NgxPermissionsService, private _companyService:CompanyServices) { }
  pdfData: any
  @Input() quotationDetail: any
  vehObject:any
  company_logo: any;
  prefixUrl = getPrefix();
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  workOrderUrl = '/trip/work-order/add';
  jobUrl = '/trip/new-trip/add';
  isFormList = false;
  isShow: boolean = false;
  isQuotationEdit=false;
  vehicleAndDriverData: any = {
    vehicle : [],
    driver :  [],
    customer : []
  };
  documentExpiryData= new Subject()

  ngOnInit(): void {
    this._ngxPermission.hasPermission(Permission.quotations.toString().split(',')[1]).then(val=>{
      this.isQuotationEdit=val
    })
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this.vehObject=this.quotationDetail[this.quotationDetail.vehicle_category.toLowerCase()]
   this.getDocsExpiryLIst();

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getViewDetails(this.quotationDetail.id);
  }

  openPdf() {
    if (this.pdfData) {
      const dialogRef = this.dialog.open(QuotationV2PdfComponent, {
        minWidth: '75%',
        data: {
          image: this.company_logo,
          pdfData: this.pdfData
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
        dialogRefSub.unsubscribe()
        this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.VIEW,"Quotation Pdf Viewd");
      });
    }

  }

  openComments() {
    const dialogRef = this.dialog.open(QuotationCommentsComponent, {
      minWidth: '100%',
      minHeight: '100%',
      data: this.quotationDetail.id,
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
      panelClass: 'quotation-comment',
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe()
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.VIEW,"Quotation Comment Viewd");
    });
  }

  getViewDetails(id) {
    let logo= this._commonService.fetchCompanyLogo();
       let pdfData=this._quotationService.getQuotationPrintView(id);
       forkJoin([logo,pdfData]).subscribe((response) => {
         this.company_logo = response[0].result.image_blob;
         this.pdfData = response[1]['result']
       })
  }

  historyBack() {
    if(this.isFormList){
      history.back();
    }else{
     this.router.navigate([getPrefix()+'/trip/quotation/list'])
    }

  }



  createWorKorderOrJob(isJob=false) {
    let duotationDetails={
      vehicleCategory:this.quotationDetail['vehicle_category']=='Crane'?'1':'2',
      customer:{
        id:this.quotationDetail['customer']['id'],
        label:this.quotationDetail['customer']['display_name']
      },
      quotation:{
        id:this.quotationDetail['id'],
        label:this.quotationDetail['quotation_no']
      }

    }
    let queryParams = {
      quotationData: JSON.stringify(duotationDetails),
    };
    let url=this.workOrderUrl
    if(isJob){
     url=this.jobUrl
     this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.VIEW,"Create Job button Clicked");
    }else{
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.VIEW,"Create WorkOrder button Clicked");
    }
    this.router.navigate([getPrefix() + url], { queryParams });
  }

  changeDatetoNormalFormat(date){
    return normalDate(date)
  }

 
  openVoidQuotation(){
    const dialogRef = this.dialog.open(QuotationV2VoidPopupComponent, {
      data : {
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: boolean) => {      
      if(item){
        this._quotationService.voidQuotation(this.quotationDetail.id).subscribe((res)=>{
          this._quotationV2DataService.upDateQuotation(true)
        })
      }
      dialogRefSub.unsubscribe();
    });

  }
  openEditRequest(){
    const dialogRef = this.dialog.open(QuotationV2EditRequestPopupComponent, {
      data : {
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {      
      dialogRefSub.unsubscribe();
    });
  }

  editRequest() {
    const dialogRef = this.dialog.open(EditRequestComponent, {
      width: '500px',
      maxWidth: '90%',
      data: {
        heading:'Edit Request',
        url:`quotation/edit_request/${this.quotationDetail.id}/`,
        areRemarksMandatory : true
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false,
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      this._quotationV2DataService.upDateQuotation(result)
      dialogRefSub.unsubscribe()
      this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.VIEW,"Quotation Comment Viewd");
    });
  }

  getDocsExpiryLIst() {
    this.vehicleAndDriverData = {
      customer : [ { date : this.quotationDetail['quote_date'], id : this.quotationDetail['customer']['id'] }],
    }
    this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((resp)=>{  
      this.documentExpiryData.next(resp)
    });
  }

 
 
  

}
