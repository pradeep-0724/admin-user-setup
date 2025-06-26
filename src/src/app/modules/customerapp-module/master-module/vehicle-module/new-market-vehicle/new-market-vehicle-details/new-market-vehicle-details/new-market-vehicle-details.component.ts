import { Component, OnInit } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewMarketVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/new-market-vehicle-service/new-market-vehicle.service';

@Component({
  selector: 'app-new-market-vehicle-details',
  templateUrl: './new-market-vehicle-details.component.html',
  styleUrls: ['./new-market-vehicle-details.component.scss']
})
export class NewMarketVehicleDetailsComponent implements OnInit {

  selectedTab=1;
  headerDetails = new Subject();
  vehicle_Id : string ='';
  headerData:any
  constructor(private newMarketVehicleService : NewMarketVehicleService, private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ]).subscribe(([params, queryParams]) => {      
      if(params['vehicle_Id']){
        this.vehicle_Id =params['vehicle_Id']
        this.newMarketVehicleService.marketVehicleHeaderDetails(params['vehicle_Id']).subscribe((response)=>{
          this.headerDetails.next(response['result'])
          this.headerData = response['result'];
        })
      }
    });
    // this.activatedRoute.params.subscribe((params)=>{
    //   this.vehicle_Id = params['vehicle_Id'];
    //   this.newMarketVehicleService.marketVehicleHeaderDetails(params['vehicle_Id']).subscribe((response)=>{
    //     this.headerDetails.next(response['result'])
    //     this.headerData = response['result']
    //   })
    // })
  }

}
