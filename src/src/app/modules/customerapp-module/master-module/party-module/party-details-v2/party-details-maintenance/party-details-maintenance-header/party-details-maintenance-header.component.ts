import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-party-details-maintenance-header',
  templateUrl: './party-details-maintenance-header.component.html',
  styleUrls: ['./party-details-maintenance-header.component.scss']
})
export class PartyDetailsMaintenanceHeaderComponent implements OnInit {
  @Input() partInfoDetails;
  isFormList = false;
  constructor(private _route: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {

    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
  }
  
  historyBack(){
    if(this.isFormList){
      history.back();
    }else{
     this._router.navigate([getPrefix()+'/onboarding/party/view'])
    }
  }
}
