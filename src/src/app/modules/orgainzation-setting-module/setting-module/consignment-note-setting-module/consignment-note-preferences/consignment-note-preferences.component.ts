import { SettingSeviceService } from '../../../../customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-consignment-note-preferences',
  templateUrl: './consignment-note-preferences.component.html',
  styleUrls: ['./consignment-note-preferences.component.scss']
})
export class ConsignmentNotePreferencesComponent implements OnInit {
  consignmentnote="consignmentnote";
  activate_advance =false;
  KEY ='delivery_note';
  consignmentAdvance={
        cash_op: false,
        cash_view: false,
        cash_rc_op: false,
        cash_rc_view: false,
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
    this._advances.postAdvances(this.KEY,this.consignmentAdvance).subscribe(data=>{
      this.initialView();
    })
  }

  initialView(){
    this._advances.getAdvances(this.KEY).subscribe(data=>{
      this.consignmentAdvance = data['result'];
    })

    this._advances.getAdvancesSetting().subscribe(data=>{
       this.activate_advance= data.result['activate_advance'];
    })
  }

}
