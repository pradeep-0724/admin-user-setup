import { Component, Input, OnInit } from '@angular/core';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';

@Component({
  selector: 'app-work-order-cargo-material-tab',
  templateUrl: './work-order-cargo-material-tab.component.html',
  styleUrls: ['./work-order-cargo-material-tab.component.scss']
})
export class WorkOrderCargoMaterialTabComponent implements OnInit {
  @Input() workOrderId:string;
  materials=[]

  constructor(private workOrderService:WorkOrderV2Service) {
    
   }

  ngOnInit(): void {
    this.workOrderService.getSOCargoMaterialInfo(this.workOrderId).subscribe(resp=>{
      this.materials=resp?.result;
    })

  }

}
