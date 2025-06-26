import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { AssetsDetailsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-details.service';

@Component({
  selector: 'app-assets-details-section',
  templateUrl: './assets-details-section.component.html',
  styleUrls: ['./assets-details-section.component.scss']
})
export class AssetsDetailsSectionComponent implements OnInit,OnDestroy {

  selectedTab=1;
  constructor(private commonloaderservice:CommonLoaderService,private _route:ActivatedRoute,private _assetsDetailsService:AssetsDetailsService) { }
  assetId='';
  assetViewDetails;
  ngOnInit(): void {
    this.commonloaderservice.getHide();
    combineLatest([
      this._route.params,
      this._route.queryParams
    ]).subscribe(([params, queryParams]) => {
      if(params['asset_id']){
        this.assetId =params['asset_id']
        this.getAssetHeader();
      }
    });
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  getAssetHeader(){
    this._assetsDetailsService.getAssetsView(this.assetId).subscribe(resp=>{
      this.assetViewDetails = resp['result'];      
    })
  }

  openSelectedTab(e){
    this.selectedTab=e;
  }

 


}
