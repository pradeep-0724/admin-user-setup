import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { VehicleSettingService } from '../vehicle-setting.service';

@Component({
  selector: 'app-prefrence',
  templateUrl: './prefrence.component.html',
  styleUrls: ['./prefrence.component.scss']
})
export class PrefrenceComponent implements OnInit {
  vehicleSettings:FormGroup=new FormGroup({
    emi:new FormControl(false)
  })
  constructor(private _vehicleSettings:VehicleSettingService) { }

  ngOnInit(): void {
    this._vehicleSettings.getVehicleSettings().subscribe(resp=>{
      this.vehicleSettings.patchValue(resp['result'])
    })

    this.vehicleSettings.valueChanges.subscribe(value=>{
      this._vehicleSettings.updateVehicleSettings(value).subscribe(resp=>{
      })
    })
  }

}
