import { Component, OnInit } from '@angular/core';
import { TaxService } from 'src/app/core/services/tax.service';
import { SettingSeviceService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { VehicleTripPreferenceService } from './vehicle-trip-setting-preferences.service';

@Component({
  selector: 'app-vehicle-trip-setting-preferences',
  templateUrl: './vehicle-trip-setting-preferences.component.html',
  styleUrls: ['./vehicle-trip-setting-preferences.component.scss']
})
export class VehicleTripSettingPreferencesComponent implements OnInit {
  KEY ='vehicle_trip';
  activate_advance = false;
  podReceived: boolean = true;
  estimatedKM:boolean=false;
  estimatedDuration:boolean=false;
  isEnabledBiltySet = false;
  isTax = true
  companyAdvance={
        cash_op: false,
        cash_view: false,
        fuel_op: false,
        fuel_view: false,
        batta_op: false,
        batta_view: false,
        fuel_rc_op:false,
        fuel_rc_view:false,
        cash_rc_op:false,
        cash_rc_view:false,
  }
  updateAdvancesText: any="Update Advances";
  successAdvancesMsg: boolean = false;
  updatePreferencesText:any='Update Preferences';
  successPreferencesMsg: boolean = false;


  constructor(
    private _advances:SettingSeviceService,
    private _preferenceService: VehicleTripPreferenceService,
    private _tax:TaxService
  ) { }
  ngOnInit() {
    this.isTax = this._tax.getTax();
    this.initialView();
  }

  updateAdvances(){
    this._advances.postAdvances(this.KEY,this.companyAdvance).subscribe(data=>{
       
      this.initialView();

      this.updateAdvancesText = "Update Advances";
      this.successAdvancesMsg = true;
    
      
      setTimeout(() => {
        this.successAdvancesMsg = false;
        this.updateAdvancesText = " Update Advances ";
        
      }, 5000);
    })
  }

  updatePreferences(){
    let obj={
      pod_received:this.podReceived,
      estimated_km:this.estimatedKM,
      estimated_duration:this.estimatedDuration
    }
    this._preferenceService.podReceivedToggle(obj).subscribe(data=>{
      this.updatePreferencesText='Update Preferences';
     this.successPreferencesMsg = true;
     setTimeout(() => {
      this.updatePreferencesText='Update Preferences';
     this.successPreferencesMsg = false;
     }, 5000);
    })
  }

  initialView(){
    this._advances.getAdvances(this.KEY).subscribe(data=>{
      this.companyAdvance = data['result'];
    })
    this._advances.getAdvancesSetting().subscribe(data=>{
      this.activate_advance= data.result['activate_advance'];
    })
    this._preferenceService.settings().subscribe(data => {
      this.podReceived = data.result['pod_received'];
      this.estimatedKM=data.result['estimated_km'];
      this.estimatedDuration=data.result['estimated_duration'];
    })
  }

  enabledBiltySet(e){
   this.isEnabledBiltySet = e;
  }
}
