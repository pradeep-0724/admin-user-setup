import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicle-type-info-header',
  templateUrl: './vehicle-type-info-header.component.html',
  styleUrls: ['./vehicle-type-info-header.component.scss']
})
export class VehicleTypeInfoHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  historyBack(){
    history.back();
  }
}
