 ;
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { InventoryServicesService } from '../../../api-services/inventory-adjustment-service/inventory-services-adjustment.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-detail-inventory',
  templateUrl: './detail-inventory-adjustment.component.html',
  styleUrls: [
    './detail-inventory-adjustment.component.scss'
  ]
})
export class InventoryAdjustmentDetailsComponent implements OnInit {
  @Input() expenseId: BehaviorSubject<string>;
  data: any;
  inventoryData: any =[];
  currency_type;
  isDescriptionEmpty = false;
  prefixUrl: string;

  constructor(
    private _masterInventory: InventoryServicesService, private currency:CurrencyService,
    private _prefixUrl:PrefixUrlService
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
  }

  ngOnInit() {
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.expenseId.subscribe((id) =>{
    this._masterInventory.getOperationInventoryAdjustmentDetails(id).subscribe((data:any)=>{
        this.data = data.result;
        this.inventoryData = data.result;
      this.checkIsDescriptionEmpty(this.data);
      });
    })
  }

  emptyState(data) {
    if (data) {
      return data;
    }
    return '0';
  }

  nullState(data) {
    if (data) {
      return data;
    }
    return '-';
  }

  dateChange(date) {
    return normalDate(date);
  }

  checkIsDescriptionEmpty(data){
    if(data.hasOwnProperty('tyres')){
      for(let i=0 ; i < data.tyres.length ; i++){
        if(data.tyres[i].note){

          this.isDescriptionEmpty = true;
          return;
        }
        else{
          this.isDescriptionEmpty = false;
        }

      }
    }

  }
}
