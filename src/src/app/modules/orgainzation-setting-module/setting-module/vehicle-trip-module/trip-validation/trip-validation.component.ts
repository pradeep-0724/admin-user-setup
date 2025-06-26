import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
@Component({
  selector: 'trip-app-validation',
  templateUrl: './trip-validation.component.html',
  styleUrls: ['./trip-validation.component.scss']
})
export class TripValidationComponent implements OnInit,OnDestroy {

  constructor(public dialog: Dialog, private _commonloaderservice: CommonLoaderService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();  
  }
}
