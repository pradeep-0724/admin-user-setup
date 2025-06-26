import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CommonService } from 'src/app/core/services/common.service';
import { RateCardServiceService } from '../../rate-card-service.service';
import { categoryOptions } from 'src/app/core/constants/constant';
@Component({
  selector: 'app-rate-card-add-edit',
  templateUrl: './rate-card-add-edit.component.html',
  styleUrls: ['./rate-card-add-edit.component.scss']
})
export class RateCardAddEditComponent implements OnInit {
  rateCardId = '';
  rateCardDetails;
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[]
  };
  categorySelected=''
  categoryOptions=categoryOptions
	
  constructor(private commonloaderservice: CommonLoaderService,
    private _rateCard: RateCardServiceService, private activatedRoute: ActivatedRoute,
    private _commonService: CommonService) { }

  ngOnInit(): void {

    this.commonloaderservice.getHide();
    this.activatedRoute.params.subscribe((params) => {      
      if (params['rateCardId']) {
        this.rateCardId = params['rateCardId']
        this._commonService.getVehicleCatagoryType().subscribe(resp=>{
          this.vehicleCategiriesObj.hasMultipleCategories=resp['result']['has_multiple_categories']
          this.vehicleCategiriesObj.categories=resp['result']['categories']
          if([0, 3].some(value => this.vehicleCategiriesObj.categories.includes(value))){
            this.vehicleCategiriesObj.hasMultipleCategories=true;
          }
          this.getRateCardDetails();
        })
      }else{
        this._commonService.getVehicleCatagoryType().subscribe(resp=>{
          this.vehicleCategiriesObj.hasMultipleCategories=resp['result']['has_multiple_categories']
          this.vehicleCategiriesObj.categories=resp['result']['categories']
          if([0, 3].some(value => this.vehicleCategiriesObj.categories.includes(value))){
            this.vehicleCategiriesObj.hasMultipleCategories=true;
          }
          if(this.vehicleCategiriesObj.categories.includes(1)){
            this.vehicleCatagoryChange('crane')
            return
          }
          if(this.vehicleCategiriesObj.categories.includes(2)){
            this.vehicleCatagoryChange('awp')
            return
          }
          if (this.vehicleCategiriesObj.categories.includes(3) || this.vehicleCategiriesObj.categories.includes(0)) {
            this.vehicleCatagoryChange('container')
            return
          }
        })
      }
    });
    
  }
  getRateCardDetails() {
    this._rateCard.getRentalRateCard(this.rateCardId).subscribe(resp => {
      this.rateCardDetails = resp['result'];
      setTimeout(() => {
        this.categorySelected=Object.keys(categoryOptions).filter(key => categoryOptions[key] === this.rateCardDetails.vehicle_category)[0];    
      }, 100);
    })
  }

  vehicleCatagoryChange(val) {
    this.categorySelected =val;
  }
}

