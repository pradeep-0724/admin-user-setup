import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-vehicle-provider-header',
  templateUrl: './party-vehicle-provider-header.component.html',
  styleUrls: ['./party-vehicle-provider-header.component.scss']
})
export class PartyVehicleProviderHeaderComponent implements OnInit {
  @Input()  partInfoDetails;
  constructor() { }

  ngOnInit(): void {
  }
  
  historyBack(){
    history.back();
  }
}
