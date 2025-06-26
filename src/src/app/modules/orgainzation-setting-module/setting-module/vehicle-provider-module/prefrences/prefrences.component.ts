import { Component, OnInit } from '@angular/core';
import { SettingSeviceService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';

@Component({
  selector: 'app-prefrences',
  templateUrl: './prefrences.component.html',
  styleUrls: ['./prefrences.component.scss']
})
export class PrefrencesComponent implements OnInit {
  KEY ='vehicle_provider';
  updateAdvancesText: any="Update Advances";
  successAdvancesMsg: boolean = false;
  invoiceAdvance={
    cash_view: false,
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
    this._advances.postAdvances(this.KEY,this.invoiceAdvance).subscribe(data=>{
       
      this.initialView();
      this.updateAdvancesText = "Update Advances";
      this.successAdvancesMsg = true;
    
      
      setTimeout(() => {
        this.successAdvancesMsg = false;
        this.updateAdvancesText = " Update Advances ";
        
      }, 5000);
    })
  }

  initialView(){
    this._advances.getAdvances(this.KEY).subscribe(data=>{
      this.invoiceAdvance = data['result'];
    })
    this._advances.getAdvancesSetting().subscribe(data=>{
      this.activate_advance= data.result['activate_advance'];
   })
  }

}
