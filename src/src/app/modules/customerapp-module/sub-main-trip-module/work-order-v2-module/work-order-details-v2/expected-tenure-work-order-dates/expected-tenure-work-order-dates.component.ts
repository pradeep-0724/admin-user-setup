import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { WorkOrderV2DataService } from '../../work-order-v2-dataservice.service';

@Component({
  selector: 'app-expected-tenure-work-order-dates',
  templateUrl: './expected-tenure-work-order-dates.component.html',
  styleUrls: ['./expected-tenure-work-order-dates.component.scss']
})
export class ExpectedTenureWorkOrderDatesComponent implements OnInit, OnChanges {

  @Input() workOrderDetail: any;
  @Input() workOrderId: string;

  currBillingType: string = "";
  lablesBilling: any
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 85,
    elements: {
      arc: {
        borderWidth: 5
      }
    },
    tooltips: {
      enabled: false,
    }
  };
  chartData: ChartDataSets[] = [];
  billingTypeList = new NewTripV2Constants().WorkOrderbillingTypeList
  billingTypeLabelList = new NewTripV2Constants().billingTypeLabels
  currency_type;
  frightDetails = {}
  constructor(private _currency: CurrencyService, private _workOrderV2Service: WorkOrderV2Service, private _workOrderV2DataService: WorkOrderV2DataService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if ('workOrderDetail' in changes) {
      this.workOrderFrieghtDetails()
    }
  }

  setBillingType(val) {
    this.billingTypeList.forEach(type => {
      if (type.value == val) {
        this.currBillingType = type.label;
      }
    })
    this.billingTypeLabelList.forEach(type => {
      if (type.value == val) {
        this.lablesBilling = type;
      }
    })
  }
  ngOnInit(): void {
    this.workOrderFrieghtDetails();
    this.currency_type = this._currency.getCurrency();
    this._workOrderV2DataService.updateWorkorderFreights.subscribe(isUpdate => {
      if (isUpdate)
        this.getWorkOrderDetails()
    });

  }
  getWorkOrderDetails() {
    this._workOrderV2Service.getWorkOrderFrightDetails(this.workOrderId).subscribe(resp => {
      this.frightDetails = resp['result'];
      this.setBillingType(this.frightDetails['billing_type'])
      this.workOrderDetail['utilization_progress']= this.frightDetails['utilization_progress']
      if (this.workOrderDetail?.utilization_progress?.movement_sow == 4) {
        let utilizationData = {
          data:[],
          backgroundColor: ['#146ADB','#FFB900', '#06A3F4','#e04aeb','#16b4c9','#f54747','#64B164']
        }
        utilizationData.data.push(this.workOrderDetail.utilization_progress?.pending.per)
        utilizationData.data.push(this.workOrderDetail.utilization_progress?.pullout_scheduled.per)
        utilizationData.data.push(this.workOrderDetail.utilization_progress?.pullout_ongoing.per)
        utilizationData.data.push(this.workOrderDetail.utilization_progress?.deposit_pending.per)
        utilizationData.data.push(this.workOrderDetail.utilization_progress?.deposit_scheduled.per)
        utilizationData.data.push(this.workOrderDetail.utilization_progress?.deposit_ongoing.per)
        utilizationData.data.push(this.workOrderDetail.utilization_progress?.completed.per)
        this.chartData =[utilizationData]
      } else {
        this.chartData = [{ data: [this.workOrderDetail.utilization_progress?.scheduled.per, this.workOrderDetail.utilization_progress?.ongoing.per, this.workOrderDetail.utilization_progress?.completed.per, this.workOrderDetail.utilization_progress?.pending.per], backgroundColor: ['#FFB900', '#06A3F4', '#64B164', '#146ADB'] }];
      }

    })
  }
  workOrderFrieghtDetails() {
    if (this.workOrderDetail) {
      if (this.workOrderDetail['vehicle_category'] == 0) {
        this.setBillingType(this.workOrderDetail?.freights[0]?.freight_type)
      }
      if (this.workOrderDetail['vehicle_category'] == 4) {
        this.getWorkOrderDetails()
      } else {
        this.chartData = [{ data: [this.workOrderDetail.utilization_progress?.scheduled.per, this.workOrderDetail.utilization_progress?.ongoing.per, this.workOrderDetail.utilization_progress?.completed.per, this.workOrderDetail.utilization_progress?.pending.per], backgroundColor: ['#FFB900', '#06A3F4', '#64B164', '#146ADB'] }];
      }
      if ((this.workOrderDetail.utilization_progress.in_percent == 100 || this.workOrderDetail.utilization_progress.out_percent == 0) || (this.workOrderDetail.utilization_progress.in_percent == 0 || this.workOrderDetail.utilization_progress.out_percent == 100)) {
        this.chartOptions.elements = {
          arc: {
            borderWidth: 0
          }
        }
      }

    }
  }


  changeDatetoNormalFormat(date) {
    return normalDate(date)
  }



}
