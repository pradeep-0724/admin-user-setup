import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-prefrences',
  templateUrl: './prefrences.component.html',
  styleUrls: ['./prefrences.component.scss']
})
export class PrefrencesComponent implements OnInit,OnDestroy {

  constructor(private _commonloaderservice: CommonLoaderService,) { }

  ngOnInit() {
    this._commonloaderservice.getHide();
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }

}
