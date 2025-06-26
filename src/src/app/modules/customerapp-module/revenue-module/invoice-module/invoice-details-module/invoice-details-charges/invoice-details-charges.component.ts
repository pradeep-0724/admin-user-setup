import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-invoice-details-charges',
  templateUrl: './invoice-details-charges.component.html',
  styleUrls: ['./invoice-details-charges.component.scss']
})
export class InvoiceDetailsChargesComponent implements OnInit {
  @Input() invoiceDetail
  vehicleFreight:any={}
  cargoFreight:any={}
  cargoMarketFreight:any={}
  marketvehicleFreight:any={}
  chargesList=[];
  craneRentalCharges:any;
  awpRentalCharges:any
  additionalCharges:any;
  containerFreight:any;
  containerMarketFreight:any;

  currency_type: any
  isTax=false
  prefixUrl = getPrefix(); 
  billingUnitCrane:'day'|'hour'='hour';
	billingUnitAwp:'day'|'hour'='hour';
  constructor(private currency:CurrencyService,private _taxService:TaxService) { }

  ngOnInit(): void {
  this.vehicleFreight= this.invoiceDetail['table_data']['charges']['client_freights']
  this.cargoFreight= this.invoiceDetail['table_data']['charges']['loose_cargo_client_freights'];
  this.containerFreight= this.invoiceDetail['table_data']['charges']['container_client_freights'];
  this.cargoMarketFreight= this.invoiceDetail['table_data']['charges']['loose_cargo_vendor_freights'];
  this.containerMarketFreight= this.invoiceDetail['table_data']['charges']['container_vendor_freights'];
  this.marketvehicleFreight = this.invoiceDetail['table_data']['charges']['vendor_freights']
  this.chargesList=this.invoiceDetail['table_data']['charges']['charges'];
  this.craneRentalCharges=this.invoiceDetail['table_data']['charges']['crane_rental']
  this.awpRentalCharges=this.invoiceDetail['table_data']['charges']['awp_rental']
  this.additionalCharges=this.invoiceDetail['table_data']['charges']['additional_charges']
  if(this.craneRentalCharges['timesheets'].length>0){
    this.billingUnitCrane=this.craneRentalCharges['timesheets'][0].billing_unit
  }
  if(this.awpRentalCharges['timesheets'].length>0){
    this.billingUnitAwp=this.awpRentalCharges['timesheets'][0].billing_unit
  }
  this.currency_type = this.currency.getCurrency();
  this.isTax=this._taxService.getTax()
  }

}
