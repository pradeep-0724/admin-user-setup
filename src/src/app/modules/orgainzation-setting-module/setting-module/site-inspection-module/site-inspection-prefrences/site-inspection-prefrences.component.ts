import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-site-inspection-prefrences',
  templateUrl: './site-inspection-prefrences.component.html',
  styleUrls: ['./site-inspection-prefrences.component.scss']
})
export class SiteInspectionPrefrencesComponent implements OnInit,OnDestroy {

  constructor(private _commonLoader:CommonLoaderService,private _commonservice:CommonService) { }
  vehicleCategories=[]
  ngOnInit(): void {
    this._commonservice.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategories = resp['result']['categories']
    })
    this._commonLoader.getHide()
  }

  ngOnDestroy(): void {
    this._commonLoader.getShow()
  }

}
