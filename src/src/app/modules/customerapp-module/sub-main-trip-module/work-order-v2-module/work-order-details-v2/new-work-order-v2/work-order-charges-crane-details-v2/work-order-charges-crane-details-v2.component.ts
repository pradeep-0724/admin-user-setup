import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { WorkOrderV2DataService } from '../../../work-order-v2-dataservice.service';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';
const DEFAULT_DURATION = 300;
@Component({
  selector: 'app-work-order-charges-crane-details-v2',
  templateUrl: './work-order-charges-crane-details-v2.component.html',
  styleUrls: ['./work-order-charges-crane-details-v2.component.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', display: 'none', overflow: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class WorkOrderChargesCraneDetailsV2Component implements OnInit {
  @Input() workOrderDetail;
  @Input() workOrderId;
  currency_type: any
  dailyHours = 10;
  weeklyHours = 60;
  monthlyHours = 260;
  isExpandJobInfo = true
  isExpandFlatJobInfo = true
  vehObj;
  jobHeaderList = [];
  jobList = []
  prefix = getPrefix();
  tableTitleAWPorCrane = ''
  defalultJobPrams = {
    search: '',
    next_cursor: ''
  }
  isLoading = false;
  isTax=false;
  isMarketVehicle=false;
  workOrderDocuments= [];
  salesOrderBasedOn: 'hour' | 'day' = 'day'
  shift:0|1;
  totalHours='' 
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour = this.rateCardBilling.hour
  rateCardBillingDays = this.rateCardBilling.day
  billingUnit = ''

  constructor(private _workOrderV2Service: WorkOrderV2Service,private currency:CurrencyService,private _tax:TaxService,private _workOrderDataService : WorkOrderV2DataService) { }
  expandCollapseJobInfoTable(e) {
    this.isExpandJobInfo = e
  }
  expandCollapseFlatJobInfoTable(e) {
    this.isExpandFlatJobInfo = e

  }

  ngOnInit(): void {
    this.isTax=this._tax.getTax();
    this.vehObj = this.workOrderDetail[this.getVehicleCategory(this.workOrderDetail?.vehicle_category)]
    this.tableTitleAWPorCrane = this.gettableTitleAWPorCrane(this.workOrderDetail?.vehicle_category)
    this.getCraneOrAwpInfo();
    this.getworkOrderDocuments();
    this._workOrderDataService.updateWorkOrderDetails.subscribe((result:any)=>{
      if(result){
        this.getCraneOrAwpInfo();
      }
    })
    this.isMarketVehicle=this.vehObj['rental_charge']['rental_charges'].some(rentalCharge=>rentalCharge['is_transporter']!=false)
    this.currency_type = this.currency.getCurrency();
    this.shift=this.vehObj['rental_charge']['no_of_shifts']
    this.salesOrderBasedOn= this.vehObj['rental_charge']['billing_unit']
    if(this.salesOrderBasedOn=='hour'){
      this.dailyHours=this.rateCardBillingHour.day;
      this.weeklyHours=this.rateCardBillingHour.week;
      this.monthlyHours=this.rateCardBillingHour.month;
    }
    if(this.salesOrderBasedOn=='day'){
      this.dailyHours=this.rateCardBillingDays.day;
      this.weeklyHours=this.rateCardBillingDays.week;
      this.monthlyHours=this.rateCardBillingDays.month;
    }
    this.billingUnit=this.rateCardBillingList.find(billing=>billing.value==this.salesOrderBasedOn).label;
    this.getWorkingHours(this.vehObj['rental_charge']['working_duration']);
  }
  getVehicleCategory(category) {
    if (category == 0) return 'truck'
    if (category == 1) return 'crane'
    if (category == 2) return 'awp'
  }

  gettableTitleAWPorCrane(category) {
    if (category == 0) return 'Truck'
    if (category == 1) return 'Crane Jobs'
    if (category == 2) return 'AWP Jobs'
  }
  isNotEmpty(any){
    return isValidValue(any)
  }


  getWorkDuration(item: any) {

    if (!item.duration || !item.working) {
      return "-";
    }
    const units: Record<string, string> = {
      daily: "Day",
      weekly: "Week",
      monthly: "Month",
    };
    const unit = units[item.working] || "";
    return unit ? `${item.duration} ${unit}${item.duration > 1 ? "s" : ""}` : "-";
  }
  getWorkingHours(item: any) {

    if (!item.duration || !item.working) {
      return "-"
    }
    const units: Record<string, string> = {
      daily: "day",
      weekly: "week",
      monthly: "month",
    };
   
    if(this.salesOrderBasedOn=='hour'){
      if(this.shift==1){
        this.dailyHours*=2;
        this.weeklyHours*=2;
        this.monthlyHours*=2;
      }
    }
    const hoursMapping: Record<string, number> = {
      daily: this.dailyHours,
      weekly: this.weeklyHours,
      monthly: this.monthlyHours,
    };
  
    const unit = units[item.working] || "";
    const hoursPerUnit = hoursMapping[item.working] || 0;
    const totalHours = hoursPerUnit * item.duration;
    const plural = item.duration > 1 ? "s" : "";
    if(this.salesOrderBasedOn=='day'){
      this.totalHours= `${item.duration} ${unit}${plural} x ${hoursPerUnit/this.dailyHours} Days = ${totalHours/this.dailyHours} Days`;
    }
    if(this.salesOrderBasedOn=='hour'){
      this.totalHours= `${item.duration} ${unit}${plural} x ${hoursPerUnit} hours = ${totalHours} hours`;
    }

  }

  getCraneOrAwpInfo() {
    this._workOrderV2Service.getWorkOrderJobInfo(this.workOrderId, this.defalultJobPrams).subscribe(resp => {
      this.jobList = resp['result'].trips
      this.defalultJobPrams.next_cursor = resp['result'].next_cursor
      if (this.jobList.length) {
        this.jobHeaderList = this.jobList[0].map(job => job.name)
      }
    })

  }

  settingsApplied(e) {
    if (e)
      this.getCraneOrAwpInfo()
  }

  searchJobList(e) {
    this.defalultJobPrams.search = e;
    this.defalultJobPrams.next_cursor = '';
    this.getCraneOrAwpInfo();
  }

  onScrollJob(e) {
    const container = document.querySelector('.job-class');
    if ((container.scrollTop + container.clientHeight >= container.scrollHeight - 10) && !this.isLoading && this.defalultJobPrams.next_cursor?.length > 0) {
      this.onScrollJobList(this.defalultJobPrams);
    }
  }

  onScrollJobList(params) {
    this.isLoading = true;
    this._workOrderV2Service.getWorkOrderJobInfo(this.workOrderId, params).subscribe(resp => {
      this.jobList.push(...resp['result'].trips);
      params.next_cursor = resp['result'].next_cursor
      this.isLoading = false;
    })
  }
  convertTYpe(data : string){
    if(isValidValue(data)){
      if(data === 'string'){
        return 'Text'
      }else if (data === 'decimal'){
        return 'Number'
      }else{
        return data.charAt(0).toUpperCase() + data.slice(1)
      }
    }
  }

  fileUploader(e) {    
    let documents = [];
    e.forEach(element => {
        documents.push(element.id);
        element['presigned_url'] = element['url']
        this.workOrderDocuments.push(element)
    });
    let payload = {
        documents: documents
    }
    this._workOrderV2Service.uploadSODocument(this.workOrderId, payload).subscribe(resp => {
    });
  }  

  getworkOrderDocuments(){
    this._workOrderV2Service.getUploadedSODocuments(this.workOrderId).subscribe(resp=>{
      this.workOrderDocuments=resp['result']['doc'];
    });
  }

  fileDeleted(id){
    this.workOrderDocuments =  this.workOrderDocuments.filter(doc=>doc.id !=id);
    this._workOrderV2Service.deleteUploadedSODocuments(id).subscribe(resp=>{
    });
  }



}
