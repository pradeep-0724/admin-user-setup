import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-party-details-fuel-provider-header',
  templateUrl: './party-details-fuel-provider-header.component.html',
  styleUrls: ['./party-details-fuel-provider-header.component.scss']
})
export class PartyDetailsFuelProviderHeaderComponent implements OnInit {
  @Input()  partInfoDetails;
  constructor() { }

  ngOnInit(): void {
  }

  historyBack(){
    history.back();
  }

}
