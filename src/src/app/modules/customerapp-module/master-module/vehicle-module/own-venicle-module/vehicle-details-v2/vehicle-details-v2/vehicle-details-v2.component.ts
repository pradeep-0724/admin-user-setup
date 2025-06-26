import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { OwnVehicleReportService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-report.service';

@Component({
  selector: 'app-vehicle-details-v2',
  templateUrl: './vehicle-details-v2.component.html',
  styleUrls: ['./vehicle-details-v2.component.scss']
})
export class VehicleDetailsV2Component implements OnInit,OnDestroy {

  selectedTab=1;
  constructor(private commonloaderservice:CommonLoaderService,private _route:ActivatedRoute,private _ownVehicleReportService:OwnVehicleReportService) { }
  vehicleId='';
  vehicleHeaderDetails;
  ngOnInit(): void {
    this.commonloaderservice.getHide();
    combineLatest([
      this._route.params,
      this._route.queryParams
    ]).subscribe(([params, queryParams]) => {
      if(params['vehicle_id']){
        this.vehicleId =params['vehicle_id']
        this.getVehicleHeader();
      }
    });
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  getVehicleHeader(){
    this._ownVehicleReportService.getVehicleReportHeader(this.vehicleId).subscribe(resp=>{
      this.vehicleHeaderDetails = resp['result'];      
    })
  }

  openSelectedTab(e){
    this.selectedTab=e;
  }

 


}
