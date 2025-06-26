import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { changeDateToServerFormat} from 'src/app/shared-module/utilities/date-utilis';
import { ChartType, ChartOptions,ChartDataSets } from 'chart.js';
import { SingleDataSet, Label,Color } from 'ng2-charts';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { compare } from 'src/app/shared-module/utilities/helper-utils';
import { IndividualInventoryService } from '../../../api-services/reports-module-services/individual-inventory-service/individual-inventory.service';
import { RevenueService } from '../../../api-services/reports-module-services/revenue-service/revenue.service';
import {  TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ActivatedRoute } from '@angular/router';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';


@Component({
  selector: 'app-individual-inventory-reports',
  templateUrl: './individual-inventory-reports.component.html',
  styleUrls: ['./individual-inventory-reports.component.scss']
})
export class IndividualInventoryReportsComponent implements OnInit {
  selectedRange: Date[];
  date = new Date(dateWithTimeZone());
	startDate1 = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
	endDate = moment(this.date).format('YYYY-MM-DD');
	startDate = moment(this.date).subtract(10, 'days').format('YYYY-MM-DD');
  defaultDate: Date[];
   pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },
  };
   pieChartLabels: Label[] = ['Download', 'Sales', 'Mail Sales'];
   pieChartData: SingleDataSet = [300, 500, 100];
   pieChartType: ChartType = 'pie';
   pieChartLegend = true;
   pieChartPlugins = [];
   lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Expense Summary' },
  ];
   lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
   pieChartColors: Array < any > = [{
    backgroundColor: ['aqua', 'coral', 'lime'],
    borderColor: ['rgba(135,206,250,1)', 'rgba(106,90,205,1)', 'rgba(148,159,177,1)']
 }];
   lineChartColors: Color[] = [
    {
      borderColor: '#72bdf1',
      backgroundColor: 'transparent',
    },
  ];
   lineChartLegend = true;
   lineChartType = 'line';
   lineChartPlugins = [];

  p: number = 1;
  filter_by: number = 5;
  otherData: any;
  allData: any = [];
  filter = new ValidationConstants().filter;
  showFilter: boolean = false;
  showOptions: string = '';
  routeToDetail:Boolean;
  OtherExpenseDetailId = new BehaviorSubject('') ;
  sortedData: any = [];
	popupOutputData: any;
	listIndexData = {};
  apiError: String = "";

  headerData: any=[];

  id=''

  purchaseLogData: any=[];
  purchaseLogDetails: any=[];
  purchaseLogUrl = '';
  purchaseLogSelectedOption =5;


  issueLogData: any=[];
  issueLogDetails: any=[];
  issueLogUrl = '';
  issueLogSelectedOption =5;



  spareUsageLogData: any=[];
  spareUsageLogDetails: any=[];
  spareUsageLogUrl = '';
  spareUsageLogSelectedOption =5;

  search1 ='';
  search2 ='';
  search3  = '';

  constructor(private _individualInventoryService: IndividualInventoryService,private revenueService: RevenueService,
    private _activatedroute: ActivatedRoute) {
    this.selectedRange = [new Date(this.startDate), new Date(this.endDate)];
   }

  ngOnInit() {
    this._activatedroute.params.subscribe((params)=>{
      this.id=params.spare_id;
    })
  }

  filterApplied(result) {
    this.otherData = result.filtedData;
    this.showFilter = !this.showFilter;
  }

  menueButton(){
    this.OtherExpenseDetailId.next(this.sortedData[0].id);
    this.routeToDetail = !this.routeToDetail;
  }

  getSelectedDate(event) {
    if (event && event.length > 1 ) {
      this.startDate = changeDateToServerFormat(event[0].toString());
      this.endDate = changeDateToServerFormat(event[1].toString());
      this.getHeaderBlockDetails();
      this.getPurchaseLogDetails();
      this.getIssueLogDetails();
      this.getSpareUsageLogDetails();
      // this.getInventoryDetails();


    }
  }

  getInventoryDetails(){
    this._individualInventoryService.getInventoryList().subscribe((res)=>{
      if(res['result'].length>0){
      this.id  = res['result'][0].id
      }
    })
  }

  getHeaderBlockDetails(){
    this._individualInventoryService.getHeaderBlockData(this.id,this.startDate,this.endDate).subscribe((res)=>{
      this.headerData = res['result']
    })
  }

  getPurchaseLogDetails(){
    const page =1;
    this.purchaseLogUrl = TSAPIRoutes.report + TSAPIRoutes.individualinventory + TSAPIRoutes.purchaselog + this.id + '/'
    this.revenueService.getPaginatedData(this.purchaseLogUrl,this.startDate,this.endDate,page,this.purchaseLogSelectedOption).subscribe((data:any)=>{
      this.purchaseLogDetails=data.result;
      this.purchaseLogData =data;
    })
  }

  purchaseLogoutputData(paginationData){
    this.purchaseLogDetails=paginationData["result"];
    }


  getIssueLogDetails(){
    const page =1;
    this.issueLogUrl = TSAPIRoutes.report + TSAPIRoutes.individualinventory + TSAPIRoutes.issuelog + this.id + '/';
    this.revenueService.getPaginatedData(this.issueLogUrl,this.startDate,this.endDate,page,this.issueLogSelectedOption).subscribe((data:any)=>{
      this.issueLogDetails=data.result;
      this.issueLogData =data;
    })
  }

  issueLogoutputData(paginationData){
    this.issueLogDetails=paginationData["result"];
    }

  getSpareUsageLogDetails(){
    const page =1;
    this.spareUsageLogUrl = TSAPIRoutes.report + TSAPIRoutes.individualinventory + TSAPIRoutes.spare_usage_log + this.id + '/';
    this.revenueService.getPaginatedData(this.spareUsageLogUrl,this.startDate,this.endDate,page,this.spareUsageLogSelectedOption).subscribe((data:any)=>{
      this.spareUsageLogDetails=data.result;
      this.spareUsageLogData =data;
    })
  }

  spareUsageLogoutputData(paginationData){
    this.spareUsageLogDetails=paginationData["result"];
  }


  sortIssueLogData(sort: Sort) {
		const data = this.issueLogDetails.slice();
		if (!sort.active || sort.direction === '') {
			this.issueLogDetails = data;
			return;
		}

		this.issueLogDetails = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'date':
					return compare(a.date, b.date, isAsc);
				case 'vehicle':
          return compare(a.vehicle, b.vehicle, isAsc);
        case 'quantity':
          return compare(a.quantity, b.quantity, isAsc);
				case 'est_value':
					return compare(a.est_value, b.est_value, isAsc);
				default:
					return 0;
			}
		});
  }


  sortUsageLogData(sort: Sort) {
		const data = this.spareUsageLogDetails.slice();
		if (!sort.active || sort.direction === '') {
			this.spareUsageLogDetails = data;
			return;
		}

		this.spareUsageLogDetails = data.sort((a, b) => {
			const isAsc = sort.direction === 'asc';
			switch (sort.active) {
				case 'date':
					return compare(a.date, b.date, isAsc);
				case 'count':
          return compare(a.count, b.count, isAsc);
        case 'issued':
          return compare(a.quantity, b.quantity, isAsc);
				case 'repaired':
          return compare(a.est_value, b.est_value, isAsc);
        case 'purchased':
            return compare(a.purchased, b.purchased, isAsc);
        case 'closing_balance':
              return compare(a.closing_balance, b.closing_balance, isAsc);
        case 'issue':
              return compare(a.issue, b.issue, isAsc);
        case 'purchase':
                return compare(a.purchase, b.purchase, isAsc);
				default:
					return 0;
			}
		});
  }





}
