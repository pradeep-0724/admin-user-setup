import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { PartyDetailsClientService } from '../party-details-client.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-party-details-client',
  templateUrl: './party-details-client.component.html',
  styleUrls: ['./party-details-client.component.scss']
})
export class PartyDetailsClientComponent implements OnInit,OnDestroy {
  selectedTab=1;
  partyId=''
  partInfoDetails
  constructor(private commonloaderservice:CommonLoaderService,private _partyDetailsClientService:PartyDetailsClientService,private activatedRoute:ActivatedRoute) { }
  
  ngOnInit(): void {
    this.commonloaderservice.getHide();
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ]).subscribe(([params, queryParams]) => {      
        if(params['party_id']){
          this.partyId =params['party_id']
          this.getPartyInfo();
        }
    });

    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {      
      if (paramMap.has('openClientTab')) {
       this.selectedTab = Number(paramMap.get('openClientTab'))
      }
    });
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  getPartyInfo(){
    this._partyDetailsClientService.getPartyInfo(this.partyId).subscribe(resp=>{
      this.partInfoDetails = resp['result'];
    });
  }

  updatedParty(e){
    if(e)
    this.getPartyInfo();
  }

}
