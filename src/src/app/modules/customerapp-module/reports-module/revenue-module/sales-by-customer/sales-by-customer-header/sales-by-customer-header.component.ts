import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales-by-customer-header',
  templateUrl: './sales-by-customer-header.component.html',
  styleUrls: ['./sales-by-customer-header.component.scss']
})
export class SalesByCustomerHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  historyBack(){
    history.back();
  }
}
