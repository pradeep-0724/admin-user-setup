import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';

@Component({
  selector: 'app-vehicle-inspection-preference',
  templateUrl: './vehicle-inspection-preference.component.html',
  styleUrls: ['./vehicle-inspection-preference.component.scss']
})
export class VehicleInspectionPreferenceComponent implements OnInit {
  vehicleCategories=[]
  constructor(private _commonLoader:CommonLoaderService,private _commonservice:CommonService) { }

  ngOnInit(): void {
    this._commonLoader.getHide()
    this._commonservice.getVehicleCatagoryType().subscribe(resp => {
      this.vehicleCategories = resp['result']['categories']
    })
  }

  ngOnDestroy(): void {
    this._commonLoader.getShow()
  }

}
