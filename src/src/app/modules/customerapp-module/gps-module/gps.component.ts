import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/general.service';

@Component({
  selector: 'app-gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.scss']
})
export class GpsComponent implements OnInit {

  constructor( private _gService: GeneralService) { }

  ngOnInit(): void {
    this._gService.getGPSAccessKey().subscribe(res => {
      if (res.result && res.result.gps_status === true) {
        location.replace(res.result['link'])
      }
    });
  }

}
