import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';

@Component({
  selector: 'app-quotation-v2-route-section',
  templateUrl: './quotation-v2-route-section.component.html',
  styleUrls: ['./quotation-v2-route-section.component.scss']
})
export class QuotationV2RouteSectionComponent implements OnInit {
  @Input() quotationDetail: any;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  constructor( public dialog: Dialog) { }

  ngOnInit(): void {
  }
  findCategory(type){
    if (type==3){
      return 'loose_cargo'
    }else if (type==4){
      return 'container'
    }else if (type==0){
      return 'truck'
    }else if (type==1){
      return 'crane'
    }else if (type==2){
      return 'awp'
    }
  }


}
