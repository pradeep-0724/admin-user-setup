import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-assets-header-section',
  templateUrl: './assets-header-section.component.html',
  styleUrls: ['./assets-header-section.component.scss']
})
export class AssetsHeaderSectionComponent implements OnInit {
  @Input() assetViewDetails:any;
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
     this._router.navigate([getPrefix()+'/onboarding/assets/list'])
    }
  } 

  


}




