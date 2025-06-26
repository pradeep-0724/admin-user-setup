import { Component, OnInit } from '@angular/core';
import { SettingSeviceService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';

@Component({
  selector: 'app-bill-of-supply-preferences',
  templateUrl: './bill-of-supply-preferences.component.html',
  styleUrls: ['./bill-of-supply-preferences.component.scss']
})
export class BillOfSupplyPreferencesComponent implements OnInit {
  updateAdvancesText: any="Update Advances";
  successAdvancesMsg: boolean = false;
  KEY ='bos';
  bos={
    cash_view: false,
    batta_view: false,
    fuel_view: false
  }
  activate_advance = false;
  billOfsupply='bos' 


  constructor(
    private _advances:SettingSeviceService
  ) { }
  ngOnInit() {
    this.initialView();
  }

  updateAdvances(){
    this._advances.postAdvances(this.KEY,this.bos).subscribe(data=>{
       
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
      this.bos = data['result'];
    });
    this._advances.getAdvancesSetting().subscribe(data=>{
      this.activate_advance= data.result['activate_advance'];
   })
  }
  advancesChange(value){
    this.bos.cash_view =value;
    this.bos.batta_view =value;
  }
}
