import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapServiceService } from '../services/map-service.service';
import { CommonModule } from '@angular/common';

export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
}
@Component({
  selector: 'app-maps-module',
  standalone: true,
  imports: [GoogleMapsModule,FormsModule,
    ReactiveFormsModule,CommonModule
],
  templateUrl: './maps-module.component.html',
  styleUrl: './maps-module.component.scss'
})
export class MapsModuleComponent {

  

  locationForm!: FormGroup;
  locations: Location[] = [];
  
  // Google Maps properties
  center: google.maps.LatLngLiteral = { lat: 39.8283, lng: -98.5795 }; // Center of the US
  zoom = 4;
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 3,
  };
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;
  constructor(
    private fb: FormBuilder,
    private locationService: MapServiceService
  ) {
    this.locationForm = this.fb.group({
      startLocation: [''],
      endLocation: ['']
    });
    
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#0088ff',
        strokeWeight: 6,
        strokeOpacity: 0.8
      }
    });
  }

  ngOnInit(): void {
    this.locations = this.locationService.getLocations();
    console.log(this.locations);
    
  }

  onMapInitialized(map: google.maps.Map): void {
    this.directionsRenderer.setMap(map);
  }

  drawRoute(): void {
    const startId = parseInt(this.locationForm.get('startLocation')?.value);
    const endId = parseInt(this.locationForm.get('endLocation')?.value);
    
    if (!startId || !endId) return;
    
    const startLocation = this.locationService.getLocationById(startId);
    const endLocation = this.locationService.getLocationById(endId);
    
    if (!startLocation || !endLocation) return;
    
    const request: google.maps.DirectionsRequest = {
      origin: { lat: startLocation.lat, lng: startLocation.lng },
      destination: { lat: endLocation.lat, lng: endLocation.lng },
      travelMode: google.maps.TravelMode.DRIVING
    };
    
    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
        
        // Optional: Adjust the map to fit the route
        if (result?.routes[0]?.bounds) {
          const bounds = result.routes[0].bounds;
          this.center = {
            lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
            lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2
          };
        }
      }
    });
  }




}
