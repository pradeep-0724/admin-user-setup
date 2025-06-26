import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { VehicleDetailsV2Service } from '../../../../../api-services/master-module-services/vehicle-services/vehicle-details-v2.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { cloneDeep } from 'lodash';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { FileDownLoadAandOpen } from 'src/app/core/services/file-download-service';

@Component({
  selector: 'app-vehicle-details-service-history-section',
  templateUrl: './vehicle-details-service-history-section.component.html',
  styleUrls: ['./vehicle-details-service-history-section.component.scss']
})
export class VehicleDetailsServiceHistorySectionComponent implements OnInit {
  @Input() vehicleId = '';
  @Input() vehicleHeaderDetails:any;
  
  jobCardCountsCost: any;
  currency_type: any
  getPrefixUrl = getPrefix();
  totalServices = 0;
  lagendColors=[];
  isOpenHistoryData={
    data:{},
    open:false
  }
  constructor(private _vehicleDetailsV2Service: VehicleDetailsV2Service, private currency: CurrencyService,private _tax: TaxService,private _commonloaderservice : CommonLoaderService,
    private _fileDownload : FileDownLoadAandOpen
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
  vehicleService = {
    start_date: '',
    end_date: '',
    search: '',
    next_cursor: ''
  }
  isTax = false;
  vehicleServiceList = [];
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
    this._vehicleDetailsV2Service.getServiceJobCard(this.vehicleId, this.jobCardParams).subscribe(resp => {
      this.jobCardCountsCost = resp['result'];
    })
  }

  getServiceDonut() {
    this._vehicleDetailsV2Service.getServiceJobDonut(this.vehicleId, this.serviceDonutParams).subscribe(resp => {
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
    this._vehicleDetailsV2Service.getJobCardSummary(this.vehicleId, this.serviceJobCardSummary).subscribe(resp => {
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

  onScrollVehicleService(event) {
    const container = document.querySelector('.vehicle_service');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isServiceLoading && this.vehicleService.next_cursor?.length > 0) {
      this.onScrollgetVehicleServiceList(this.vehicleService);
    }
  }

  onScrollgetJobCardList(params) {
    this.isLoading = true;
    this._vehicleDetailsV2Service.getJobCardSummary(this.vehicleId, params).subscribe(data => {
      this.jobCardList.push(...data['result'].trips);
      params.next_cursor = data['result'].next_cursor;
      this.isLoading = false;
    })
  }

  getVehicleService() {
    this._vehicleDetailsV2Service.getVehicleService(this.vehicleId, this.vehicleService).subscribe(resp => {
      this.vehicleServiceList = resp['result'].services;
      this.vehicleService.next_cursor = resp['result'].next_cursor;
    })

  }

  searchedDataVehicleService(e) {
    this.vehicleService.next_cursor = '';
    this.vehicleService.search = e;
    this.getVehicleService();
  }

  dateRangeVehicleService(e) {
    this.vehicleService.next_cursor = '';
    this.vehicleService.start_date = changeDateToServerFormat(e.startDate);
    this.vehicleService.end_date = changeDateToServerFormat(e.endDate);
    this.getVehicleService();
  }

  onScrollgetVehicleServiceList(params) {
    this.isServiceLoading = true;
    this._vehicleDetailsV2Service.getVehicleService(this.vehicleId, params).subscribe(data => {
      this.vehicleServiceList.push(...data['result'].trips);
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

  fileExportEventForJobCard(){
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.serviceJobCardSummary)
		queryParams['is_export']=true;
    queryParams['next_cursor']='';
		this._vehicleDetailsV2Service.getJobCardSummaryExport(this.vehicleId,queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'      
			fileName = this.vehicleHeaderDetails.reg_number + "_Job Card Summary"  + "_" + (isValidValue(queryParams.start_date) ?  queryParams.start_date+ '_To_'+ queryParams.end_date : '') + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {        
				this._commonloaderservice.getHide();
      });
		})
  }

  fileExportEventForServices(){
		this._commonloaderservice.getShow();
		let queryParams = cloneDeep(this.vehicleService)
		queryParams['is_export']=true;
    queryParams['next_cursor']='';
		this._vehicleDetailsV2Service.getVehicleServiceExport(this.vehicleId,queryParams).subscribe(resp => {
			let fileName;
			let type = 'xlsx'      
			fileName = this.vehicleHeaderDetails.reg_number + "_Services"  + "_" + (isValidValue(queryParams.start_date) ?  queryParams.start_date+ '_To_'+ queryParams.end_date : '') + '.' + type;
			this._fileDownload.writeAndOpenFile(resp, fileName).then(data => {        
				this._commonloaderservice.getHide();
      });
		})
  }
 





}
