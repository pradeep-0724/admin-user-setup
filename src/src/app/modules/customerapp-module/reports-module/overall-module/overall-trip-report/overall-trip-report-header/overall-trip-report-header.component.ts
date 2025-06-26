import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overall-trip-report-header',
  templateUrl: './overall-trip-report-header.component.html',
  styleUrls: ['./overall-trip-report-header.component.scss']
})
export class OverallTripReportHeaderComponent implements OnInit {

  constructor() { }

  historyBack(){
    history.back();
  }
  ngOnInit(): void {
  }

}
