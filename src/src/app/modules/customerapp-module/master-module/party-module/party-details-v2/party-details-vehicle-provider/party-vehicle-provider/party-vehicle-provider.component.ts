import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { PartyDetailsClientService } from '../../party-details-client/party-details-client.service';

@Component({
  selector: 'app-party-vehicle-provider',
  templateUrl: './party-vehicle-provider.component.html',
  styleUrls: ['./party-vehicle-provider.component.scss']
})
export class PartyVehicleProviderComponent implements OnInit,OnDestroy {
  selectedTab=1;
  partyId=''
  partInfoDetails
  constructor(private commonloaderservice:CommonLoaderService,private _route:ActivatedRoute,private _partyDetailsClientService:PartyDetailsClientService) { }
  
  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this._route.params.subscribe(parms=>{
      if(parms['party_id']){
        this.partyId =parms['party_id']
        this.getPartyInfo();
      }
    }) ;
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  getPartyInfo(){
    this._partyDetailsClientService.getPartyInfo(this.partyId).subscribe(resp=>{
      this.partInfoDetails = resp['result'];
    });
  }

}