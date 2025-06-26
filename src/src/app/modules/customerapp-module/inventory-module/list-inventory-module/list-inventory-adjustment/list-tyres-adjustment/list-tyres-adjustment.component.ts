import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { compare } from 'src/app/shared-module/utilities/helper-utils';
import { InventoryServicesService } from '../../../../api-services/inventory-adjustment-service/inventory-services-adjustment.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { FilterOptions } from 'src/app/shared-module/list-widget-module/interface/llist-widget.interface';

@Component({
  selector: 'app-view-tyres',
  templateUrl: './list-tyres-adjustment.component.html',
  styleUrls: ['./list-tyres-adjustment.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ListTyresAdjustmentComponent implements OnInit {
  allItems: any=[];
  sortedData: any=[];
  p = 1;
  popupInputData = {
		'msg': 'Are you sure, you want to delete?',
		'type': 'warning',
		'show': false
  }
  listIndexData = {};
  search: any='';


  showFilter: boolean = false;
  filter = new ValidationConstants().filter;
  filter_by = 5;

  showOptions: any='';
  apiError: any='';
  routeToDetail:boolean=false;
  inventoryDetailId = new BehaviorSubject('') ;
  allData: any =[];
  options: FilterOptions= {
		columns: [
      {
        title: 'Action',
        key: ['tyres','is_add'],
        type: 'unique',
        },
		  {
			title: 'Tyre Details',
			key: ['tyres','tyre_detail'],
			type: 'unique',
      },
      {
        title: 'Tyre Unique No.',
        key: ['tyres','unique_no'],
        type: 'unique',
        },
		]
	  };
  flatData: any[];
  currency_type;
  inventoryPermissions=Permission.inventory_adjustment.toString().split(',');
  selectedId=''
  prefixUrl: any;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  isMobile= false;
  openListDetails=new BehaviorSubject(false)
  constructor(private _inventoryService: InventoryServicesService,private currency:CurrencyService,private _analytics:AnalyticsService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVENTORYADJUSTMENTBILL,this.screenType.LIST,"Navigated");
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getAllInventoryTyresData();
  }

  getAllInventoryTyresData(){
    this._inventoryService.getInventoryAdjustments('tyre').subscribe((res)=>{
      this.allItems= res['result'];
      this.sortedData = res['result'];
      this.allData =res['result']


    })

  }

  turnToFlatData() {
		this.flatData = [];
		this.allData.forEach(itemKey => {
			itemKey.tyre.forEach((item) => {
				this.flatData.push(item);
			});
		});
  }

  filterApplied(result) {
    this.turnBackToNestedData(result.filtedData);
    this.showFilter = !this.showFilter;
  }


  turnBackToNestedData(data) {

    let tripDateData = [];
		this.allData.forEach(itemKey => {
			let tripData = [];
			data.forEach((item) => {
					tripData.push(item);

			});
			itemKey.tyre = tripData;
			const tripCount = itemKey.tyre.length;
			if (tripCount > 0) {
				itemKey.count = tripCount;
				tripDateData.push(itemKey);
			}
		});

		this.sortedData = tripDateData;
	}

  routeToDetailById(id){
  this.inventoryDetailId.next(id);
  this.routeToDetail = true;
  this.selectedId=id;
  this.openListDetails.next(true);
  }

  optionsList(event, list_index) {
		return (this.showOptions = list_index);
  }

  outSideClick(env) {
    if ((env.target.className).indexOf('more-icon') == -1)
      this.showOptions = ''
  }

  deleteRecord(id) {
    this._inventoryService.deleteMasterInventory(id).subscribe(
      data => {
        this._analytics.addEvent(this.analyticsType.DELETED,this.analyticsScreen.INVENTORYADJUSTMENTBILL)
        this.getAllInventoryTyresData();
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

  popupFunction(id, index: any = null) {
    this.listIndexData = { 'id': id, 'index': index };
    this.popupInputData['show'] = true;
    this._popupBodyScrollService.popupActive();
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deleteRecord(id);
      this.listIndexData = {};
    }
  }

  dataAvailable(data) {

    if (data || data ==0) {
      return data;
    }
    else {
      return '-';
    }
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
        case 'tyre_detail':
          return compare(a.tyre_detail, b.tyre_detail, isAsc);
        case 'unique_no':
          return compare(a.unique_no, b.unique_no, isAsc);
        case 'date':
            return compare(a.date, b.date, isAsc);
        case 'is_add':
            return compare(a.is_add, b.is_add, isAsc);
        case 'total':
            return compare(a.total, b.total, isAsc);
        default:
          return 0;
      }
    });
  }


  dateChange(date) {
    return normalDate(date);
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
      this.inventoryDetailId.next(this.sortedData[0].id);
      this.selectedId=this.sortedData[0].id;
    }

  }
  filteredData(e){
    this.sortedData =e
  }





}
