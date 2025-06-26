import { Component, OnInit } from '@angular/core';
import { SettingSeviceService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';

@Component({
  selector: 'app-transporter-trip-custom-preferences',
  templateUrl: './transporter-trip-custom-preferences.component.html',
  styleUrls: ['./transporter-trip-custom-preferences.component.scss']
})
export class TransporterTripCustomPreferencesComponent implements OnInit {

  KEY ='transporter_trip';
  transporterTripAdvance={
    cash_rc_op: true,
    cash_rc_view: false,
    cash_ad_op: false,
    cash_ad_view: false,
    fuel_op: false,
    fuel_view: false
  }
  activate_advance = false;


  constructor(
    private _advances:SettingSeviceService
  ) { }
  ngOnInit() {
    this.initialView();
  }

  updateAdvances(){
    this._advances.postAdvances(this.KEY,this.transporterTripAdvance).subscribe(data=>{
      this.initialView();
    })
  }

  initialView(){
    this._advances.getAdvances(this.KEY).subscribe(data=>{
      this.transporterTripAdvance = data['result'];
    })
    this._advances.getAdvancesSetting().subscribe(data=>{
      this.activate_advance= data.result['activate_advance'];
   })
  }

}
