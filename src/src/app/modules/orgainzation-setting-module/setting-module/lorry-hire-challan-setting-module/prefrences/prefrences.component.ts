import { Component, OnInit } from '@angular/core';
import { SettingSeviceService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';


@Component({
  selector: 'app-prefrences',
  templateUrl: './prefrences.component.html',
  styleUrls: ['./prefrences.component.scss']
})
export class PrefrencesComponent implements OnInit {
  lorrychallan='lorrychallan';

  KEY ='market_vehicle';
  activate_advance = false;

  marketVehicle={
       cash_ad_op: false,
       cash_ad_view: false,
        fuel_op: false,
        fuel_view: false,
  }


  constructor(
    private _advances:SettingSeviceService
  ) { }


  ngOnInit() {
    this.initialView();
  }

  updateAdvances(){
    this._advances.postAdvances(this.KEY,this.marketVehicle).subscribe(data=>{
      this.initialView();
    })
  }

  initialView(){
    this._advances.getAdvances(this.KEY).subscribe(data=>{
      this.marketVehicle = data['result'];
    })
    this._advances.getAdvancesSetting().subscribe(data=>{
      this.activate_advance= data.result['activate_advance'];
   })
  }
}
