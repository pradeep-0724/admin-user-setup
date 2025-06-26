import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { TrackVehicle } from 'src/app/core/constants/constant';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
type trackingType = {
  tripId: string
}

@Component({
  selector: 'app-live-tracking',
  templateUrl: './live-tracking.component.html',
  styleUrls: ['./live-tracking.component.scss']
})
export class LiveTrackingComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: trackingType, private _tripservice: NewTripService,private commonloaderservice:CommonLoaderService, private _tokenExpireService:TokenExpireService
  ) {
  }
  zoom = 17;
  center: google.maps.LatLngLiteral = { lat: 12.917397230158727, lng: 77.62292047769888 };
  markerOptions: google.maps.MarkerOptions = {
    icon: 'assets/img/vech.png'
  };
  lineSymbol = {
    path: 'M 1.5 1 L 1 0 L 1 2 M 0.5 1 L 1 0',
    fillColor: 'black',
    strokeColor: 'black',
    strokeWeight: 2,
    strokeOpacity: 1
  };
  mapType = TrackVehicle
  markerPositions: google.maps.LatLngLiteral[] = [];
  marker: any;
  $intervalSub: Subscription;
  $driverLoc: Subscription;
  isAllLoaded=false;


  ngOnInit(): void {
    this.commonloaderservice.getHide()
    this.markerPositions = [];
    setTimeout(() => {
      this.getTrackVehicle();
      this.$intervalSub = interval(30000).subscribe(resp => {
        this.getTrackVehicle();
      });
    }, 100);
     
 this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
  if(isExpired){
    this.dialogRef.close(false)
  }
})
  
  }

  getTrackVehicle() {
    this.$driverLoc = this._tripservice.getLngLat(this.data.tripId, true).subscribe(resp => {
      this.isAllLoaded = true;
      if (resp.result.length) {
        this.markerPositions =[];
        this.zoom = 17;
        this.center = resp.result[0];
        this.markerPositions.push(resp.result[0]);
      }
    });
  }

  close() {
    this.$intervalSub.unsubscribe();
    this.$driverLoc.unsubscribe();
    this.dialogRef.close(false)
  }
}
