import { Injectable } from '@angular/core';

export interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
}


@Injectable({
  providedIn: 'root'
})
export class MapServiceService {

  constructor() { }
  private locations: Location[] = [
    { id: 1, name: 'New York', lat: 40.7128, lng: -74.0060 },
    { id: 2, name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { id: 3, name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { id: 4, name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { id: 5, name: 'Phoenix', lat: 33.4484, lng: -112.0740 }
  ];

  getLocations(): Location[] {
    return this.locations;
  }

  getLocationById(id: number): Location | undefined {
    return this.locations.find(loc => loc.id === id);
  }

}
