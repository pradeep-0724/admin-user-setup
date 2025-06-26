import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';


@Component({
  selector: 'app-quotation-v2-terms-condition-section',
  templateUrl: './quotation-v2-terms-condition-section.component.html',
  styleUrls: ['./quotation-v2-terms-condition-section.component.scss'],
  
})
export class QuotationV2TermsConditionSectionComponent implements OnInit {
  @Input() quotationDetail: any
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  constructor(public dialog: Dialog) { }

  ngOnInit(): void {
    
  }

}
