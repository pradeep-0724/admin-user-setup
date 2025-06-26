import { Component, OnInit } from '@angular/core';
import { SettingSeviceService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';

@Component({
  selector: 'app-company-trip-setting-preferences',
  templateUrl: './company-trip-setting-preferences.component.html',
  styleUrls: ['./company-trip-setting-preferences.component.scss']
})
export class CompanyTripSettingPreferencesComponent implements OnInit {
  KEY ='company_trip';
  activate_advance = false;
  companyAdvance={
        cash_op: false,
        cash_view: false,
        fuel_op: false,
        fuel_view: false,
        batta_op: false,
        batta_view: false
  }


  constructor(
    private _advances:SettingSeviceService
  ) { }
  ngOnInit() {
    this.initialView();
  }

  updateAdvances(){
    this._advances.postAdvances(this.KEY,this.companyAdvance).subscribe(data=>{
      this.initialView();
    })
  }

  initialView(){
    this._advances.getAdvances(this.KEY).subscribe(data=>{
      this.companyAdvance = data['result'];
    })
    this._advances.getAdvancesSetting().subscribe(data=>{
      this.activate_advance= data.result['activate_advance'];
   })
  }
}
