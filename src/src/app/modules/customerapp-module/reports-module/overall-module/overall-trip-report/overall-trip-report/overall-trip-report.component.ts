import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-overall-trip-report',
  templateUrl: './overall-trip-report.component.html',
  styleUrls: ['./overall-trip-report.component.scss']
})
export class OverallTripReportComponent implements OnInit ,OnDestroy{
  selectedTab=1;
  constructor(private commonloaderservice :CommonLoaderService) { }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }

  ngOnInit(): void {
    this.commonloaderservice.getHide()
  }

}
