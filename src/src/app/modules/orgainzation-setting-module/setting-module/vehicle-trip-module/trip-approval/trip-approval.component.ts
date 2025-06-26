import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'trip-app-approval',
  templateUrl: './trip-approval.component.html',
  styleUrls: ['./trip-approval.component.scss']
})
export class TripApprovalComponent implements OnInit, OnDestroy {

  constructor(private _commonloaderservice: CommonLoaderService) { }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }
  ngOnInit(): void {
    this._commonloaderservice.getHide();
  }
}
