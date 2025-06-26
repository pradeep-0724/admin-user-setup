import { Component, OnDestroy, OnInit } from '@angular/core';
import moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BehaviorSubject } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import {  PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { changeDateToServerFormat, normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { QuotationConstants } from '../../constant';
import { QuotationService } from '../../../../api-services/trip-module-services/quotation-service/quotation-service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

export interface DialogData {
  selectedOption:any
}

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class QuotationListComponent implements OnInit,OnDestroy {
  quotationData: any;
  allData: any;
  showOptions: string = '';
  showFilter: boolean = false;
  animal: string;
  name: string;
  selectedOption:any
  quotationId = new BehaviorSubject('');
  filter = new ValidationConstants().filter;
  listIndexData = {};
  popupInputData = {
    'msg': 'Are you sure, you want to delete?',
    'type': 'warning',
    'show': false
  }
  filter_by: number = 5;
  p = 1;
  apiError: String = "";
  selectedId='';
  routeToDetail:Boolean;
  sortedData: any;
  currency_type;
  prefixUrl: string;
  isMobile=false;
  search=''
  isFilterApplied = false;
  selectedRange: Date[];
	dateToday = new Date(dateWithTimeZone());
  endDate = moment(this.dateToday).format('YYYY-MM-DD');
	startDate = moment(this.dateToday).subtract(2, 'days').format('YYYY-MM-DD');
  workOrderPermission = Permission.workorder.toString().split(',');
  quotation =Permission.quotations.toString().split(',');
  options: any = {
    columns: [
      {
        title: 'Quotation No',
        key: 'quotation_no',
        type: 'unique'
      },
      {
        title: 'Quotation Date',
        key: 'quote_date',
        type: 'dateRange',
        range: [
          { label: 'Less than 15 days', start: 'none', end: 15 },
          { label: '15 to 30 days', start: 15, end: 30 },
          { label: '30 to 45 days', start: 30, end: 45 },
          { label: '45+ days', start: 45, end: 'none' },
        ]
      },
      {
        title: 'Customer',
        key: 'customer.display_name',
        type: 'unique'
      },
      {
        title: 'Approval Status',
        key: 'status.label',
        type: 'unique'
      },
      {
        title: 'Validity Date',
        key: 'validity_date',
        type: 'dateRange',
        range: [
          { label: 'Less than 15 days', start: 'none', end: 15 },
          { label: '15 to 30 days', start: 15, end: 30 },
          { label: '30 to 45 days', start: 30, end: 45 },
          { label: '45+ days', start: 45, end: 'none' },
        ]
      },
      {
        title: 'Validity Term',
        key: 'validity_term.label',
        type: 'unique'
      },
    ]
  };

  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;


  constructor(
    private currency: CurrencyService,
    private _prefixUrl: PrefixUrlService,
    private deviceService: DeviceDetectorService,
    private _analytics:AnalyticsService,
    private _quotationService: QuotationService,
    public dialog: MatDialog, private _popupBodyScrollService:popupOverflowService,
    private _commonloaderservice:CommonLoaderService
  ) {
    this.dateToday = new Date(dateWithTimeZone());
    this.endDate = moment(this.dateToday).format('YYYY-MM-DD');
    this.startDate = moment(this.dateToday).subtract(30, 'days').format('YYYY-MM-DD');
    this.selectedRange = [new Date(this.startDate), new Date(this.endDate)];
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }

  ngOnInit() {
    this._commonloaderservice.getShow();
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.QUOTATION,this.screenType.LIST,"Navigated");
    this.isMobile = this.deviceService.isMobile();
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getQuotation();
  }


  filterWorkOrder(dateRange){
    if (dateRange && dateRange.length > 0) {
			this.startDate = changeDateToServerFormat(dateRange[0].toString());
			this.endDate = changeDateToServerFormat(dateRange[1].toString());
      this.getQuotation();
		}
  }

  getQuotation(){
    this._quotationService.getQuotation(this.startDate,this.endDate).subscribe((response)=>{
      this.quotationData=response.result
      this.allData = response.result;
      this.sortedData = response.result;
    })
  }

  menueButton(){
    this.quotationId.next(this.sortedData[0].id);
    this.routeToDetail = !this.routeToDetail;
    this.selectedId=this.sortedData[0].id;
  }

  routeToDetailById(id){
    this.quotationId.next(id);
    this.routeToDetail = true;
    this.selectedId=id;
  }


  dateChange(date) {
    if (!date) return '';
    return normalDate(date);
  }

  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }


  optionsList(list_index) {
    return this.showOptions = list_index;
  }

  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }


  /* For filtering the data */
  filterApplied(result) {
    this.sortedData = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied = result.isFilterApplied;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteQuotation(id);
      this.listIndexData = {};
    }
  }

  deleteQuotation(id) {
    this._quotationService.deleteQuotation(id).subscribe(
      data => {
        this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.QUOTATION)
        this.getQuotation();
      },
      error => {
        this.apiError = error['error']['message'];
        this.popupInputData['show'] = false;
        setTimeout(() => {
          this.apiError = '';
        }, 10000);
      }
    );
  }


  onClickCancel(){
    this.routeToDetail = false;
  }


openDialog(data): void {
  const dialogRef = this.dialog.open(ChangeQuotationStatus, {
    width: '250px',
    data: {selectedOption: data}
  });

  dialogRef.afterClosed().subscribe(result => {
    if(result){
   this. getQuotation();
    }
  });
}


}

@Component({
  selector: 'app-change-status',
  templateUrl: './changeStatusQuotation.html',
})
export class ChangeQuotationStatus {
  selectedValue='';
  selectedOption=''
  quotationConstants= new QuotationConstants().quotationApprovalStatus
  constructor(
    public dialogRef: MatDialogRef<ChangeQuotationStatus>, private _quotationService: QuotationService,
    private _commonloaderservice:CommonLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    ngOnInit(): void {
      this.selectedValue = this.data['selectedOption']['status'].label;
      this.quotationConstants.splice(this.data['selectedOption']['status'].index-1,1);
      if(this.data['selectedOption']['status'].index==1){
        this.quotationConstants.splice(2,1);
      }
    }

  click(e): void {
   this._commonloaderservice.getHide();
    if(e){
      this._quotationService.postQuotationStatus(this.data.selectedOption.id,this.selectedOption).subscribe(data=>{
        this.dialogRef.close(e);
      })
    }else{
      this.dialogRef.close(e);
    }

  }
}
