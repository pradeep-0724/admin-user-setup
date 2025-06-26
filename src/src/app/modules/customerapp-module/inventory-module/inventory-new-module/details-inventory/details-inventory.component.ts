import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { InventoryService } from '../../../api-services/inventory-service/inventory.service';
@Component({
  selector: 'app-details-inventory',
  templateUrl: './details-inventory.component.html',
  styleUrls: ['./details-inventory.component.scss']
})
export class DetailsInventoryComponent implements OnInit,OnDestroy {

  @Input() 'inventoryId':BehaviorSubject<String>;
  inventoryData: any =[];
  currency_type;
  areSparesPresent = false ;
  areTyresPresent  = false ;
  isTax:boolean=false;
  prefixUrl: string;
  isTDS=false;
  isPlaceOfSupply: boolean = false;

  inventoryNew=Permission.inventory_new.toString().split(',')
  inventorySubscription: Subscription;

  constructor(private _inventoryService: InventoryService,private currency:CurrencyService,
    private _tax:TaxService, private _prefixUrl:PrefixUrlService) {
    this.isTax = this._tax.getTax();
    this.isTDS = this._tax.getVat();
    this.isPlaceOfSupply = this._tax.isPlaceOfSupply();
  }
  ngOnDestroy(): void {
    this.inventorySubscription.unsubscribe()
  }

  ngOnInit() {
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getInventoryDetails();
  }

  getInventoryDetails(){
    this.inventorySubscription=this.inventoryId.subscribe((id) =>{
      this._inventoryService.getInventoryDetails(id).subscribe((res)=>{
        this.inventoryData = res['result'];
        try {
          this.inventoryData.spares.length > 0 ? this.areSparesPresent = true : this.areSparesPresent = false ;
          this.inventoryData.tyres.length > 0 ? this.areTyresPresent = true : this.areTyresPresent = false ;
        } catch (error) {

        }


      })
    }
    )
    }


}
