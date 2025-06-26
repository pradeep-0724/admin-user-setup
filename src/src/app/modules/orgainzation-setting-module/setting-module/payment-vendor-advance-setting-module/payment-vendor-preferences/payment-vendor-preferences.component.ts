import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-vendor-preferences',
  templateUrl: './payment-vendor-preferences.component.html',
  styleUrls: ['./payment-vendor-preferences.component.scss']
})
export class PaymentVendorPreferencesComponent implements OnInit {
  paymentVendor ='vendor_advance'
  constructor() { }

  ngOnInit() {
  }

}
