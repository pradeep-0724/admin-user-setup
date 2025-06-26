
import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { VehPaymentPdfViewComponent } from '../veh-payment-pdf-view/veh-payment-pdf-view.component';
import { Permission } from 'src/app/core/constants/permissionConstants';

@Component({
  selector: 'app-veh-payment-details-header',
  templateUrl: './veh-payment-details-header.component.html',
  styleUrls: ['./veh-payment-details-header.component.scss']
})
export class VehPaymentDetailsHeaderComponent implements OnInit {
  @Input() vehPaymentData:any;
  @Input() vehPaymentId;
  currency_type;
  vehicleProviderPermission = Permission.vehicle_provider.toString().split(",");

  constructor(private _route:ActivatedRoute,private _router:Router,		private currency: CurrencyService, private dialog:Dialog,
    ) { }
  isFormList=false;
  preFixUrl=getPrefix()
  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('formList')) {
        this.isFormList = true;
      }
    });
  }
  historyBack() {
      if(this.isFormList){
        history.back();
      }else{
        this._router.navigate([this.preFixUrl+'/trip/vehicle-payment/list'])
      }  
  }
  openPdf() {
    const dialogRef = this.dialog.open(VehPaymentPdfViewComponent, {
      width: '75%',
      data:this.vehPaymentId,
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      dialogRefSub.unsubscribe()
    });

  }
}
