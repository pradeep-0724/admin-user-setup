import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { OperationsActivityService } from 'src/app/modules/customerapp-module/api-services/operation-module-service/operations-activity.service';

@Component({
  selector: 'app-veh-payment-details',
  templateUrl: './veh-payment-details.component.html',
  styleUrls: ['./veh-payment-details.component.scss']
})
export class VehPaymentDetailsComponent implements OnInit,OnDestroy {

  vehPaymentId;
  vehPaymentData:any;
  currency_type;
  isTax:boolean=false;
  isVat:boolean=false;
  preFixUrl=getPrefix()


  constructor(private _route:ActivatedRoute,private _operationService:OperationsActivityService,private currency:CurrencyService,private _taxService:TaxService,private _loader:CommonLoaderService) { }

  ngOnInit(): void {
    this._loader.getHide()
    
    this.currency_type = this.currency.getCurrency();
    this.isTax=this._taxService.getTax()
    this.isVat=this._taxService.getVat();
   
    this._route.params.subscribe((params) => {
        
          this.vehPaymentId  = params['id'];
          this.getvehPayment(this.vehPaymentId)
        })
  }
  ngOnDestroy(): void {
    this._loader.getShow()

  }
  

  getvehPayment(id){
    this._operationService.getVehPayment(id).subscribe((res)=>{
      this.vehPaymentData=res.result;
    })


  }
    


}
