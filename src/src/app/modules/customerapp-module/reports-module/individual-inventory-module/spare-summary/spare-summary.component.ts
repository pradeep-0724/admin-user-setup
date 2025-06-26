import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { ScreenType, OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { IndividualInventoryService } from '../../../api-services/reports-module-services/individual-inventory-service/individual-inventory.service';

@Component({
  selector: 'app-spare-summary',
  templateUrl: './spare-summary.component.html',
  styleUrls: ['./spare-summary.component.scss']
})
export class SpareSummaryComponent implements OnInit {
  sortedData: any = [];
  filter = new ValidationConstants().filter;
  filter_by = 5;
  p = 1;
  search: any = ""
  prefixUrl: string;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;


  constructor(private _individualInventoryService: IndividualInventoryService,private _analytics:AnalyticsService,
    private router: Router, private _prefixUrl: PrefixUrlService
  ) { }

  ngOnInit() {
    this._analytics.addEvent(this.analyticsType.IN,this.analyticsScreen.SPARESUMMARY,this.screenType.VIEW,"Navigated");
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this.getSpareSummaryDetails();
  }

  getSpareSummaryDetails() {
    this._individualInventoryService.getSpareSummaryList().subscribe((res) => {
      this.sortedData = res['result']
    })

  }

  routeToEditById(id) {
    this.router.navigateByUrl(this.prefixUrl + '/reports/inventory/spare-summary/' + id);
  }

  sortValues(e) {

  }

}
