import { Component, Input, OnInit } from '@angular/core';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PartyDetailsClientService } from '../../party-details-client/party-details-client.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Router } from '@angular/router';
import { TaxService } from 'src/app/core/services/tax.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { NgxPermissionsService } from 'ngx-permissions';
import { PartySettingService } from 'src/app/modules/orgainzation-setting-module/setting-module/party-setting-module/party-setting.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-party-details-maintenance-party-info',
  templateUrl: './party-details-maintenance-party-info.component.html',
  styleUrls: ['./party-details-maintenance-party-info.component.scss']
})
export class PartyDetailsMaintenancePartyInfoComponent implements OnInit {
  @Input() partyId =''
  @Input()  partInfoDetails;
  currency_type: any 
  partyContactList=[];
  preFixUrl= getPrefix();
  isTax = false;
  isTds = false;
  isPartyEditPermission=false;
  customFieldData = [];

  constructor(private _partyDetailsClientService:PartyDetailsClientService,private currency: CurrencyService,private route:Router,private _tax: TaxService,private _permissions:NgxPermissionsService,
    private _partyCustomSettingService : PartySettingService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
    this.getPartyContacts();
    this.getPartyCustomFieldsData(this.partyId);
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
    this._permissions.hasPermission(Permission.party.toString().split(',')[1]).then(val=>{
      this.isPartyEditPermission=val
    })
  }

  getPartyContacts(){
    this._partyDetailsClientService.getPartyContactList(this.partyId).subscribe(resp=>{
      this.partyContactList = resp['result'].contact_person;
    });
  }

  getPartyCustomFieldsData(party){
    this._partyCustomSettingService.partyCustomFieldsDataforEdit(party).subscribe((res)=>{
      this.customFieldData = res['result']['fields']
    })
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
  convertToNormalDate(date : string){
    return normalDate(date)
  }

}
