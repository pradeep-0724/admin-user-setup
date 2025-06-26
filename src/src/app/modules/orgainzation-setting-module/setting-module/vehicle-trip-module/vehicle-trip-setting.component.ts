import { Component, OnInit } from '@angular/core';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-vehicle-trip-setting',
  templateUrl: './vehicle-trip-setting.component.html',
  styleUrls: ['./vehicle-trip-setting.component.scss']
})
export class VehicleTripSettingComponent implements OnInit {
  isTax = true
  constructor(private _tax:TaxService) { }

  ngOnInit() {
    this.isTax = this._tax.getTax();
  }

}
