import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-quotation-v2-tnc-content',
  templateUrl: './quotation-v2-tnc-content.component.html',
  styleUrls: ['./quotation-v2-tnc-content.component.scss'],
  
})
export class QuotationV2TncContentComponent implements OnInit {
  @Input() content:string=""

  constructor() { }

  ngOnInit(): void {
  }

}
