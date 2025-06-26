import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-new-market-vehicle-header-details',
  templateUrl: './new-market-vehicle-header-details.component.html',
  styleUrls: ['./new-market-vehicle-header-details.component.scss']
})
export class NewMarketVehicleHeaderDetailsComponent implements OnInit {

  @Input() headerDetails : Observable<any>;
  headerInfo : any;
  preFixUrl = getPrefix();
  isFormList = false;

  constructor(private _route : ActivatedRoute,private _router : Router) { }

  ngOnInit(): void {
    this.headerDetails.subscribe((data)=>{
      this.headerInfo = data;
    })
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
     this._router.navigate([getPrefix()+'/onboarding/vehicle/market/list'])
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
