import { Component, OnInit } from '@angular/core';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared-module/utilities/helper-utils';
import { InventoryService } from '../../../api-services/inventory-service/inventory.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix, PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-list-inventory-new',
  templateUrl: './list-inventory-new.component.html',
  styleUrls: ['./list-inventory-new.component.scss'],
  host: {
		'(document:click)': 'outSideClick($event)'
	}
})
export class ListInventoryNewComponent implements OnInit {

  p: number = 1;
  filter_by: number = 5;
  otherData: any;
  allData: any = [];
  filter = new ValidationConstants().filter;
  showFilter: boolean = false;
  showOptions: string = '';
  routeToDetail:Boolean;
  inventoryId = new BehaviorSubject('') ;
  sortedData: any = [];
  currency_type;
  options: any = {
    columns: [
      {
        title: 'Vendor',
        key: 'vendor.display_name',
        type: 'unique'
      },
      {
        title: 'PO Number',
        key: 'po.po_number',
        type: 'unique'
      },
      {
        title: 'Bill Number',
        key: 'bill_number',
        type: 'unique'
      },
      {
        title: 'Payment Status',
        key: 'payment_status',
        type: 'unique'
      },
      {
        title: 'Purchase Date',
        key: 'bill_date',
        type: 'dateRange',
        range: [
          { label: 'Less than 15 days', start: 'none', end: 15 },
          { label: '15 to 30 days', start: 15, end: 30 },
          { label: '30 to 45 days', start: 30, end: 45 },
          { label: '45+ days', start: 45, end: 'none' },
        ]
      },
      {
        title: 'Due Date',
        key: 'due_date',
        type: 'dateRange',
        range: [
          { label: 'Within 15 days', start: 0, end: 15 },
          { label: 'Within 15 to 30 days', start: 15, end: 30 },
          { label: 'Within 30 to 45 days', start: 30, end: 45 },
          { label: 'Overdue', start: 'none', end: 0 },
        ]
      }
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
  selectedId=''
  prefixUrl: any;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  isMobile = false;
  screenType=ScreenType;
  openListDetails=new BehaviorSubject(false)
  inventoryNew=Permission.inventory_new.toString().split(',')

  constructor(private _inventoryService: InventoryService,private currency:CurrencyService,private deviceservice:DeviceDetectorService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService,private _analytics:AnalyticsService,private _activateRoute:ActivatedRoute,
    private _router:Router) { }


  ngOnInit() {
     this.isMobile = this.deviceservice.isMobile();
     this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVENTORYNEWBILL,this.screenType.LIST,"Navigated");
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.initView();
    this._activateRoute.queryParams.subscribe(data=>{
      if(data['pdfViewId']){
        this.routeToDetailById(data['pdfViewId'])
      }
    });
  }
  initView() {
    this._inventoryService.getInventoryList().subscribe((response: any) => {
      this.otherData = response.result;
      this.allData = response.result;
      this.sortedData=response.result;
    })
  }


deleteInventaryActivity(activity_id) {
    this._inventoryService.deleteInventoryActivity(activity_id).subscribe(
      data => {
        this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.INVENTORYNEWBILL)
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

  filterApplied(result) {
    this.otherData = result.filtedData;
    this.showFilter = !this.showFilter;
  }

  popupFunction(id, index: any = null) {
		this.listIndexData = { 'id': id, 'index': index };
		this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive()
	}

	confirmButton(event) {
		if (event) {
			let id = this.listIndexData['id'];
			this.deleteInventaryActivity(id);
			this.listIndexData = {};
		}
  }

  routeToDetailById(id){
  this.inventoryId.next(id);
  this.routeToDetail = true;
  this.selectedId=id;
  this.openListDetails.next(true);
}
createQueryParems(id){
  let queryParms='?pdfViewId='+id
  let url = getPrefix()+"/inventory/list/inventory-new" +queryParms;
  this._router.navigateByUrl(url);
}

  sortData(sort: Sort) {
		const data = this.sortedData.slice();
		if (!sort.active || sort.direction === '') {
			this.sortedData = data;
			return;
		}
		this.sortedData = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'bill_date':
					return compare(a.bill_date, b.bill_date, isAsc);
				case 'due_date':
					return compare(a.due_date, b.due_date, isAsc);
				case 'bill_number':
					return compare(a.bill_number, a.bill_number, isAsc);
       	case 'vendor':
          return compare(a.vendor, b.vendor, isAsc);
        case 'po':
            return compare(a.po, b.po, isAsc);
        case 'amount_due':
          return compare(a.amount_due, b.amount_due, isAsc);
        case 'total':
          return compare(a.total, b.total, isAsc);
        case 'payment_status':
          return compare(a.payment_status, b.payment_status, isAsc);
				default:
					return 0;
			}
		});
	}

  searchFilter(e){
    this.search =e;
  }

  filterListBy(e){
    this.filter_by = e;
  }

  openListDetailsData(e){
    this.routeToDetail = !this.routeToDetail;
    let url = getPrefix()+"/inventory/list/inventory-new";
    this._router.navigateByUrl(url);
    if(e){
      this.inventoryId.next(this.sortedData[0].id);
      this.selectedId=this.sortedData[0].id;
    }
  }
  filteredData(e){
    this.sortedData =e
  }
}
