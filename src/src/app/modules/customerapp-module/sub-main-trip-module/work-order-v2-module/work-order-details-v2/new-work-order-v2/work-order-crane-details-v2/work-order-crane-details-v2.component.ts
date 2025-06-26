import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-work-order-crane-details-v2',
  templateUrl: './work-order-crane-details-v2.component.html',
  styleUrls: ['./work-order-crane-details-v2.component.scss']
})
export class WorkOrderCraneDetailsV2Component implements OnInit {
  currency_type:any
  constructor(private currency:CurrencyService) { }
  @Input() workOrderDetail;
  @Input() workOrderId;


  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
  }

}
