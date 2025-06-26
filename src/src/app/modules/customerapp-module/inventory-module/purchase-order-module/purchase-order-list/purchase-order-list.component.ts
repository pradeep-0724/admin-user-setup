import { PurchaseOrderService } from '../../../api-services/inventory-purchase-order-service/purchase-order.service';
import { Component, OnInit } from '@angular/core';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-purchase-order-list',
  templateUrl: './purchase-order-list.component.html',
  styleUrls: ['./purchase-order-list.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)'
	}
})
export class PurchaseOrderListComponent implements OnInit {
  p: number = 1;
  filter_by: number = 5;
  otherData: any;
  allData: any = [];
  filter = new ValidationConstants().filter;
  showFilter: boolean = false;
  showOptions: string = '';
  routeToDetail:Boolean;
  purchaseOrderId=new BehaviorSubject('') ;
  sortedData: any = [];
  currency_type;
  options: any = {
    columns: [
      {
        title: 'Vendor',
        key: 'vendor',
        type: 'unique'
      },
      {
        title: 'Approver',
        key: 'approval_user',
        type: 'unique'
      },
      {
        title: 'Status',
        key: 'status.label',
        type: 'unique'
      },
      {
        title: 'PO Date',
        key: 'po_date',
        type: 'dateRange',
        range: [
          { label: 'Less than 15 days', start: 'none', end: 15 },
          { label: '15 to 30 days', start: 15, end: 30 },
          { label: '30 to 45 days', start: 30, end: 45 },
          { label: '45+ days', start: 45, end: 'none' },
        ]
      },
      {
        title: 'Expected Delivery Date',
        key: 'expected_delivery_date',
        type: 'dateRange',
        range: [
          { label: 'Less than 15 days', start: 'none', end: 15 },
          { label: '15 to 30 days', start: 15, end: 30 },
          { label: '30 to 45 days', start: 30, end: 45 },
          { label: '45+ days', start: 45, end: 'none' },
        ]
      },
    ]
  };

  popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
	}
	popupOutputData: any;
	listIndexData = {};
  apiError: String = "";
  search;
  selectedId='';
  isFilterApplied=false;
  allDataPurchase= new BehaviorSubject({
    data:[],
    show:false
  })
  prefixUrl: string;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  purchasePer=Permission.purchase_order.toString().split(',');
  openListDetails=new BehaviorSubject(false);
  isMobile = false;





  constructor(private _purchaseOrder: PurchaseOrderService,private currency:CurrencyService,private _analytics:AnalyticsService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService,private deviceservice:DeviceDetectorService) { }

  ngOnInit() {
    this.isMobile = this.deviceservice.isMobile();
     this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.PURHCASEORDER,this.screenType.LIST,"Navigated");
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.initView();
  }
  initView() {
    this._purchaseOrder.getPurchaseOrder().subscribe((response: any) => {
      this.otherData = response.result;
      this.allData = response.result;
      this.sortedData=response.result;
    })
  }


deletePurchaseOrder(activity_id) {
    this._purchaseOrder.deletePurchaseOrder(activity_id).subscribe(
      data => {
        this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.PURHCASEORDER)
        this.initView();
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

  dateChange(date) {
    return normalDate(date);
  }

  dataAvailable(data) {
    if (data) {
      return data;
    }
    else {
      return '-';
    }
  }

  optionsList(event, list_index) {
    return this.showOptions = list_index;
  }

  outSideClick(env) {
    try {
      if ((env.target.className).indexOf('more-icon') == -1){
        this.showOptions = ''
      }
    } catch (error) {
      console.log(error)
    }
  }

  filteredData(result) {
    this.sortedData = result;
  }

  popupFunction(id, index: any = null) {
		this.listIndexData = { 'id': id, 'index': index };
		this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deletePurchaseOrder(id);
			this.listIndexData = {};
		}
  }

  menueButton(){
    this.purchaseOrderId.next(this.sortedData[0].id);
    this.routeToDetail = !this.routeToDetail;
    this.selectedId=this.sortedData[0].id;
}
  routeToDetailById(id){
  this.purchaseOrderId.next(id);
  this.routeToDetail = true;
  this.selectedId=id;
  this.openListDetails.next(true)
}

changeStatus(id){
  let data = this.sortedData.filter(item => item.id ==id)
  this.allDataPurchase.next({
    data:data,
    show:true
  })
  this._popupBodyScrollService.popupActive()
}

resultOut(e):void{
  if(e){
    this.initView();
  }
}

checkShowDots(data){
  let status = false;
  if(data.status.index==3 || data.status.index==4){
    status= false;
  }else{
    status =true;
  }
  return status
}

checkBillConvert(data){
  let status = false;
  if(data.status.index==2){
    status= true;
  }else{
    status =false;
  }
  return status
}

checkEditDelete(data){
  let status = false;
  if(data.status.index==0 ||data.status.index==1){
    status= true;
  }else{
    status =false;
  }
  return status
}

searchFilter(e){
  this.search =e;
}

filterListBy(e){
  this.filter_by = e;
}

openListDetailsData(e){
  this.routeToDetail = e;
  if(e){
    this.purchaseOrderId.next(this.sortedData[0].id);
    this.selectedId=this.sortedData[0].id;
  }

}

}
