import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import {  compare } from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Sort } from '@angular/material/sort';
import { ChartType, ChartOptions } from 'chart.js';
import {  Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip} from 'ng2-charts';
import { OverallModuleService } from '../../../api-services/reports-module-services/over-all-service/overall.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {


  date = new Date(dateWithTimeZone());
  endDate = moment(this.date).format('YYYY-MM-DD');
  startDate = moment(this.date).subtract(30, 'days').format('YYYY-MM-DD');
  defaultDate: Date[];
  inventoryTabNumber=1;


  	/*  Charts variables data */
	pieChartOptions: ChartOptions = {
		responsive: true,
		legend: {
		  position: 'right',
		},
	  };
	   pieChartLabels: Label[] = [];
	   pieChartData= [];
	   pieChartType: ChartType = 'pie';
	   pieChartLegend = true;
     pieChartPlugins = [];

    dateParams = {};
  topInventoryBlockData: any=[];
  topEstimateBlockData: any=[];
  availableData: any=[];
  maintenanceData: any=[];
  criticalLimitData: any=[];
  inventoryUtilisationData: any=[];
  p1 = 1;
  p2=1;
  p3=1;
  filter = new ValidationConstants().filter;
  filter_by: number = 5;
  search ='';
  currency_type;
  screenType=ScreenType;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;


  constructor(private _overallService:OverallModuleService,private currency:CurrencyService,private _analytics:AnalyticsService) {
    this.defaultDate = [new Date(this.startDate), new Date(this.endDate)];
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();

   }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.OVERALLINVENTORYREPORT,this.screenType.VIEW,"Navigated");
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
  }

  purpleBlockDetails(){
    this._overallService.getTopBlockInventoryDetails().subscribe((res)=>{
      this.topInventoryBlockData = res['result'];
    })
  }

  pinkBlockDetails(startDate,endDate){
    this._overallService.getTopBlockEstimatedDetails(startDate,endDate).subscribe((res)=>{
      this.topEstimateBlockData = res['result']
    })
  }

  inventoryAvailableDetails(startDate,endDate){
    this._overallService.getInventoryAvailableData(startDate,endDate).subscribe((res)=>{
      this.availableData = res['result']
    })
  }

  inventoryMaintenanceDetails(startDate,endDate){
    this._overallService.getInventoryMaintenanceData(startDate,endDate).subscribe((res)=>{
      this.maintenanceData = res['result']
    })
  }

  itemsBelowCriticalLimitDetails(startDate,endDate){
    this._overallService.getItemsBelowCriticalLimitData(startDate,endDate).subscribe((res)=>{
      this.criticalLimitData = res['result']
    })
  }

  inventoryUtilizationDetails(startDate,endDate){
    this.pieChartLabels=[];
    this.pieChartData=[];
    this._overallService.getInventoryUtilisationData(startDate,endDate).subscribe((res)=>{
      this.inventoryUtilisationData = res['result'];
      this.inventoryUtilisationData.forEach((ele)=>{
        this.pieChartLabels.push(ele['item_name']);
        this.pieChartData.push(ele['in_stock']);
      })
    })
  }

  selectInventoryTab(value){
    this.search ='';
    this.inventoryTabNumber = value ;

  }


	activeInventoryTab(value){
		return this.inventoryTabNumber == value;
  }

  getSelectedDate(dateRange) {
    if (dateRange && dateRange.length > 0) {
       this.dateParams = {
        start_date: changeDateToServerFormat(dateRange[0].toString()),
        end_date: changeDateToServerFormat(dateRange[1].toString())
      }
      this.purpleBlockDetails();
      this.pinkBlockDetails(this.dateParams['start_date'],this.dateParams['end_date']);
      this.inventoryAvailableDetails(this.dateParams['start_date'],this.dateParams['end_date']);
      this.inventoryMaintenanceDetails(this.dateParams['start_date'],this.dateParams['end_date']);
      this.itemsBelowCriticalLimitDetails(this.dateParams['start_date'],this.dateParams['end_date']);
      this.inventoryUtilizationDetails(this.dateParams['start_date'],this.dateParams['end_date']);
    }


 }

  sortAvialableTable(sort: Sort) {
    const data = this.availableData.slice();

    if (!sort.active || sort.direction === '') {
      this.availableData = data;
      return;
    }

    this.availableData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'item_name':
          return compare(a.item_name, b.item_name, isAsc);
        case 'opening':
          return compare(a.opening, b.opening, isAsc);
        case 'issued':
            return compare(a.issued, b.issued, isAsc);
        case 'purchased':
          return compare(a.purchased, b.purchased, isAsc);
        case 'repaired':
          return compare(a.repaired, b.repaired, isAsc);
        case 'closing':
            return compare(a.closing, b.closing, isAsc);
        default:
          return 0;
      }
    });
  }

  sortUnderMaintenanceDataTable(sort: Sort) {
    const data = this.maintenanceData.slice();

    if (!sort.active || sort.direction === '') {
      this.maintenanceData = data;
      return;
    }

    this.maintenanceData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'item_name':
          return compare(a.item_name, b.item_name, isAsc);
        case 'opening':
          return compare(a.opening, b.opening, isAsc);
        case 'repair':
            return compare(a.repair, b.repair, isAsc);
        case 'repaired':
          return compare(a.repaired, b.repaired, isAsc);
        case 'closing':
            return compare(a.closing, b.closing, isAsc);
        default:
          return 0;
      }
    });
  }





}
