import { Component,Input,OnInit } from '@angular/core';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-trip-details-map-section',
  templateUrl: './trip-details-map-section.component.html',
  styleUrls: ['./trip-details-map-section.component.scss']
})
export class TripDetailsMapSectionComponent implements OnInit {
  constructor(private _tripservice: NewTripService) {
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
  markerPositions: google.maps.LatLngLiteral[] = [];
  pathPositions: google.maps.LatLngLiteral[] = [];
  marker: any;
  pathOptions: google.maps.PolylineOptions = {
    geodesic: true,
    strokeColor: '#4285F4',
    strokeOpacity: .8,
    strokeWeight: 4,
    icons: [{
      icon: {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        strokeColor: '#5a6b7b',
        fillColor: '#5a6b7b',
        fillOpacity: .3,
        scale: 2
      },
      offset: '100%',
      repeat: '100px'
    }]
  }
  @Input() tripId:string=''
  ngOnInit(): void {
    this.getFullPath();
  }


  getFullPath() {
     this._tripservice.getLngLat(this.tripId,false).subscribe(resp => {
      if (resp.result.length) {
        this.markerPositions =[];
        let paths = cloneDeep(resp.result)
        this.pathPositions = paths;
        this.zoom = 17;
        this.center = paths[0];
        this.markerPositions.push(paths[0])
        this.markerPositions.push(resp.result.pop());
      }else{

      }
    });
  }

}
