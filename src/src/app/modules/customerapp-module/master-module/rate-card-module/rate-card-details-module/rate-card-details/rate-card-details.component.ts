import { Component, OnDestroy, OnInit } from '@angular/core';
import { RateCardServiceService } from '../../rate-card-service.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { categoryOptions } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-rate-card-details',
  templateUrl: './rate-card-details.component.html',
  styleUrls: ['./rate-card-details.component.scss']
})
export class RateCardDetailsComponent implements OnInit ,OnDestroy{

  rateCardDetails = new Subject<any>();
  vehicleCategory=''
    categoryOptions=categoryOptions
  

  constructor(private _rateCardService : RateCardServiceService,
    private _route : ActivatedRoute,private _commonLoaderService : CommonLoaderService) { }

  ngOnInit(): void {
    this._commonLoaderService.getHide();
    this._route.params.subscribe((params)=>{      
      this._rateCardService.getRentalRateCard(params['rateCardId']).subscribe((resp)=>{
        this.vehicleCategory=Object.keys(categoryOptions).filter(key => categoryOptions[key] === resp['result'].vehicle_category)[0];   
        setTimeout(() => {
          this.rateCardDetails.next(resp['result']);
        }, 100); 
        
      })
    })
  }

  ngOnDestroy(): void {
    this._commonLoaderService.getShow();
    
  }

}
