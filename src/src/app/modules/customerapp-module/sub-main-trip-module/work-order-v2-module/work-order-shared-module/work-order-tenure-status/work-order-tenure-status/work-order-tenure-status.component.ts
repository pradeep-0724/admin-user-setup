import { Component, Input, OnInit } from '@angular/core';
type workOrderTenureStatusType = {
  percent: number,
  utilized: number,
  total: number

}
@Component({
  selector: 'app-work-order-tenure-status',
  templateUrl: './work-order-tenure-status.component.html',
  styleUrls: ['./work-order-tenure-status.component.scss']
})
export class WorkOrderTenureStatusComponent implements OnInit {
  @Input() type: string = 'orderstatus';
  @Input() workOrderStatus: workOrderTenureStatusType = {
    percent: 10,
    utilized: 10,
    total: 100
  }
  constructor() { }

  ngOnInit(): void {
  }

  

}
