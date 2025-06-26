import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-against-preferences',
  templateUrl: './payment-against-preferences.component.html',
  styleUrls: ['./payment-against-preferences.component.scss']
})
export class PaymentAgainstPreferencesComponent implements OnInit {
  paymentAgainstBill ='operation_bill';
  constructor() { }

  ngOnInit() {
  }

}
