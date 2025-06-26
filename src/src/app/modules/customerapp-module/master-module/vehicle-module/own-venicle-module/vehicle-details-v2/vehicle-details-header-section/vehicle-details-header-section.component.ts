import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-vehicle-details-header-section',
  templateUrl: './vehicle-details-header-section.component.html',
  styleUrls: ['./vehicle-details-header-section.component.scss']
})
export class VehicleDetailsHeaderSectionComponent implements OnInit {
  @Input() vehicleId='';
  @Input() vehicleHeaderDetails:any;
  isFormList = false;

  constructor( private _route:ActivatedRoute,private _router:Router) { }

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
     this._router.navigate([getPrefix()+'/onboarding/vehicle/own/vehicle-list'])
    }
  } 

  getVehicleCategory(category,isCategoryClass){
    if (isCategoryClass && category==3){
      return 'trailer-head'
    }
   if(category==0) return 'others'
   if(category==1) return 'crane'
   if(category==2) return 'awp'
   if(category==3) return 'trailer head'
  }

}
