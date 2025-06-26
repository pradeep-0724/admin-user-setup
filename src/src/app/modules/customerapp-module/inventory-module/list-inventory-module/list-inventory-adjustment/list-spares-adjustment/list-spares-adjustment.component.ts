import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { FilterOptions } from 'src/app/shared-module/list-widget-module/interface/llist-widget.interface';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { compare } from 'src/app/shared-module/utilities/helper-utils';
import { InventoryServicesService } from '../../../../api-services/inventory-adjustment-service/inventory-services-adjustment.service';

@Component({
  selector: 'app-view-spares',
  templateUrl: './list-spares-adjustment.component.html',
  styleUrls: ['./list-spares-adjustment.component.scss'],
  host: {
    '(document:click)': 'outSideClick($event)',
  }
})
export class ListSparesAdjustmentComponent implements OnInit {

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
  currency_type;
  selectedId=''
  inventoryAdjustmentPermission = Permission.inventory_adjustment.toString().split(',');
  prefixUrl: any;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  screenType=ScreenType;
  isMobile= false;
  options: FilterOptions = {
    columns: [
      {
        title: 'Item Name',
        key: ['spares','item'],
        type: 'unique',
        },
		]
	  };
  openListDetails=new BehaviorSubject(false)

  constructor(private _inventoryService:InventoryServicesService, private currency:CurrencyService,private _analytics:AnalyticsService,
    private _prefixUrl:PrefixUrlService, private _popupBodyScrollService:popupOverflowService) { }

  ngOnInit() {
     this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.INVENTORYADJUSTMENTBILL,this.screenType.LIST,"Navigated");
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getAllInventorySparesData();
  }

  getAllInventorySparesData(){
    this._inventoryService.getInventoryAdjustments('spare').subscribe((res)=>{
      this.allItems= res['result'];
      this.sortedData = res['result'];
      this.allData =res['result']
   })

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
        this.getAllInventorySparesData();
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

  filterApplied(result) {
    this.sortedData = result.filtedData;
    this.showFilter = !this.showFilter;
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
        case 'item':
          return compare(a.item, b.item, isAsc);
        case 'rate':
          return compare(a.rate, b.rate, isAsc);
        case 'quantity_available':
            return compare(a.quantity_available, b.quantity_available, isAsc);
        case 'stock_date':
            return compare(a.stock_date, b.stock_date, isAsc);
        case 'total':
            return compare(a.total, b.total, isAsc);
        case 'new_quantity':
              return compare(a.new_quantity, b.new_quantity, isAsc);
         case 'adjustment':
              return compare(a.adjustment, b.adjustment, isAsc);
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
