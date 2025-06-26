import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PartyDetailsClientService } from '../../party-details-client/party-details-client.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Router } from '@angular/router';
import { TaxService } from 'src/app/core/services/tax.service';

@Component({
  selector: 'app-party-details-fuel-provider-info',
  templateUrl: './party-details-fuel-provider-info.component.html',
  styleUrls: ['./party-details-fuel-provider-info.component.scss']
})
export class PartyDetailsFuelProviderInfoComponent implements OnInit {
  
  @Input() partyId =''
  @Input()  partInfoDetails;
  currency_type: any 
  partyContactList=[];
  preFixUrl= getPrefix();
  isTax = false;
  isTds = false;
  constructor(private _partyDetailsClientService:PartyDetailsClientService,private currency: CurrencyService,private route:Router,private _tax: TaxService,) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.getPartyContacts();
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
  }

  getPartyContacts(){
    this._partyDetailsClientService.getPartyContactList(this.partyId).subscribe(resp=>{
      this.partyContactList = resp['result'].contact_person;
    });
  }

  makeContactDefault(contact){
    this._partyDetailsClientService.makePrtydefault(contact.id).subscribe(resp=>{
      this.getPartyContacts();
    });
  }

  editButton(e){
    if(e){
    this.route.navigate([this.preFixUrl+'/onboarding/party/edit/'+this.partyId])
    }
  }

  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }


}
