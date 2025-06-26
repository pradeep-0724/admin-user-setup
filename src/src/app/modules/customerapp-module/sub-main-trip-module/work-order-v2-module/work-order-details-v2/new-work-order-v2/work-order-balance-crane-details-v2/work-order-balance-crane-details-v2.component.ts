import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-work-order-balance-crane-details-v2',
  templateUrl: './work-order-balance-crane-details-v2.component.html',
  styleUrls: ['./work-order-balance-crane-details-v2.component.scss']
})
export class WorkOrderBalanceCraneDetailsV2Component implements OnInit {

  @Input()workOrderDetail;
  @Input()workOrderId;
 
  vehObj:any;
  calulations:any;

  constructor() { }
 

  ngOnInit(): void {
    this.vehObj=this.workOrderDetail[this.getVehicleCategory(this.workOrderDetail?.vehicle_category)]
    let type=this.getVehicleCategory(this.workOrderDetail?.vehicle_category)+'_calculations'
    this.calulations=this.vehObj[type]
  }
  getVehicleCategory(category){
    if(category==0) return 'truck'
    if(category==1) return 'crane'
    if(category==2) return 'awp'
   
   }

  }

