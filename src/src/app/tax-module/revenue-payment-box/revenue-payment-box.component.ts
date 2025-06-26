import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-revenue-payment-box',
  templateUrl: './revenue-payment-box.component.html',
  styleUrls: ['./revenue-payment-box.component.scss']
})
export class RevenuePaymentBoxComponent implements OnInit {

  constructor() { }
  @Output () revenueHeader = new EventEmitter<any>();
  @Input() editData :Observable <any>
  paymentPatch = new BehaviorSubject<any>({})

  ngOnInit() {
    this.editData.subscribe(data=>{
      this.paymentPatch.next(data)
    })
  }

  revenuePayementHeader(e){
    this.revenueHeader.emit(e);
  }

}
