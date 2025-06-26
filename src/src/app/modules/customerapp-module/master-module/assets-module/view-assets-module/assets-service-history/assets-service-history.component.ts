import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { AssetsDetailsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-details.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-assets-service-history',
  templateUrl: './assets-service-history.component.html',
  styleUrls: ['./assets-service-history.component.scss']
})
export class AssetsServiceHistoryComponent implements OnInit {
  @Input() assetId = '';
  jobCardCountsCost: any;
  currency_type: any
  getPrefixUrl = getPrefix();
  totalServices = 0;
  lagendColors=[];
  isOpenHistoryData={
    data:{},
    open:false
  }
  constructor(private _assetDetailsService:AssetsDetailsService, private currency: CurrencyService,private _tax: TaxService,
    ) { }
  chartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display:false,
      position: 'left',
    },
    maintainAspectRatio: false,
    cutoutPercentage: 75,
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    tooltips: {
      enabled: true,
    }
  };
  chartData: ChartDataSets[] = [];
  chartLabels: string[];
  jobCardParams = {
    start_date: '',
    end_date: '',
  }
  serviceDonutParams = {
    start_date: '',
    end_date: '',
  }

  serviceJobCardSummary = {
    start_date: '',
    end_date: '',
    search: '',
    next_cursor: ''
  }
  jobCardList = [];

  serviceExpense = [];
  isLoading = false;
  isServiceLoading = false;
  assetService = {
    start_date: '',
    end_date: '',
    search: '',
    next_cursor: ''
  }
  isTax = false;
  assetServiceList = [];
  ngOnInit(): void {
    this.isTax = this._tax.getTax();
    this.chartData = [{ data: [] }];
    this.chartLabels = []
    this.currency_type = this.currency.getCurrency();
  }

  dateRangeJobCard(e) {
    this.jobCardParams.start_date = changeDateToServerFormat(e.startDate);
    this.jobCardParams.end_date = changeDateToServerFormat(e.endDate);
    this.getJobCardHeader();
  }

  dateRangeDougnut(e) {
    this.serviceDonutParams.start_date = changeDateToServerFormat(e.startDate);
    this.serviceDonutParams.end_date = changeDateToServerFormat(e.endDate);
    this.getServiceDonut()
  }

  getJobCardHeader() {
    this._assetDetailsService.getServiceJobCard(this.assetId, this.jobCardParams).subscribe(resp => {
      this.jobCardCountsCost = resp['result'];
    })
  }

  getServiceDonut() {
    this._assetDetailsService.getServiceJobDonut(this.assetId, this.serviceDonutParams).subscribe(resp => {
      this.serviceExpense = resp['result'];
      this.lagendColors =[];
      this.totalServices = 0;
      this.chartData = [{ data: this.serviceExpense.map(service => service.cost),backgroundColor:[] }];
      let colors=[]
      this.serviceExpense.forEach(item=>{
        colors.push(this.generateRandomColor())
      })
      this.chartData[0].backgroundColor=colors
      this.lagendColors =colors
      this.chartLabels = this.serviceExpense.map(service => service.service_name);
      let services = [];
      services = this.serviceExpense.map(service => service.cost);
      services.forEach(item => {
        this.totalServices = this.totalServices + item;
      })
      this.totalServices = Number(this.totalServices.toFixed(3))
    })
  }

  searchedDataJobCardSummary(e) {
    this.serviceJobCardSummary.next_cursor = '';
    this.serviceJobCardSummary.search = e;
    this.getJobCardList();
  }

  dateRangeJobCardSummary(e) {
    this.serviceJobCardSummary.next_cursor = '';
    this.serviceJobCardSummary.start_date = changeDateToServerFormat(e.startDate);
    this.serviceJobCardSummary.end_date = changeDateToServerFormat(e.endDate);
    this.getJobCardList();
  }

  getJobCardList() {    
    this._assetDetailsService.getJobCardSummary(this.assetId, this.serviceJobCardSummary).subscribe(resp => {
      this.jobCardList = resp['result'].jobcards;
      this.serviceJobCardSummary.next_cursor = resp['result'].next_cursor;
    })
  }

  onScroll(event) {
    const container = document.querySelector('.job_card_summary');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.serviceJobCardSummary.next_cursor?.length > 0) {
      this.onScrollgetJobCardList(this.serviceJobCardSummary);
    }
  }

  onScrollAssetService(event) {
    const container = document.querySelector('.vehicle_service');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isServiceLoading && this.assetService.next_cursor?.length > 0) {
      this.onScrollgetAssetServiceList(this.assetService);
    }
  }

  onScrollgetJobCardList(params) {
    this.isLoading = true;
    this._assetDetailsService.getAssetJobList(this.assetId, params).subscribe(data => {
      this.jobCardList.push(...data['result'].trips);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  getAssetService() {
    this._assetDetailsService.getAssetService(this.assetId, this.assetService).subscribe(resp => {
      this.assetServiceList = resp['result'].services;
      this.assetService.next_cursor = resp['result'].next_cursor;
    })

  }

  searchedDataAssetService(e) {
    this.assetService.next_cursor = '';
    this.assetService.search = e;
    this.getAssetService();
  }

  dateRangeAssetService(e) {
    this.assetService.next_cursor = '';
    this.assetService.start_date = changeDateToServerFormat(e.startDate);
    this.assetService.end_date = changeDateToServerFormat(e.endDate);
    this.getAssetService();
  }

  onScrollgetAssetServiceList(params) {
    this.isServiceLoading = true;
    this._assetDetailsService.getAssetJobList(this.assetId, params).subscribe(data => {
      this.assetServiceList.push(...data['result'].trips);
      params.next_cursor = data['result'].next_cursor;
      this.isServiceLoading = false;
    })
  }

  generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }

   openHistory(data){
    data['has_history']=true
    this.isOpenHistoryData.data=data;
    this.isOpenHistoryData.open=true;
   }




}
