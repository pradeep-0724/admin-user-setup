import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-details-terms-condition',
  templateUrl: './invoice-details-terms-condition.component.html',
  styleUrls: ['./invoice-details-terms-condition.component.scss']
})
export class InvoiceDetailsTermsConditionComponent implements OnInit {
   @Input() invoiceDetail
  constructor() { }

  ngOnInit(): void {
  }

}
