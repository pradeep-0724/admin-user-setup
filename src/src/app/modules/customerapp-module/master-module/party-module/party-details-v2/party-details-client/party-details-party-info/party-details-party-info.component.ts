import { Component, Input, OnInit } from '@angular/core';
import { PartyDetailsClientService } from '../party-details-client.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxService } from 'src/app/core/services/tax.service';
import { cloneDeep } from 'lodash';
import { Dialog } from '@angular/cdk/dialog';
import { PartyCertificateHistoryComponent } from '../party-certificate-history/party-certificate-history.component';
import { NgxPermissionsService } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { combineLatest } from 'rxjs';
import { PartySettingService } from 'src/app/modules/orgainzation-setting-module/setting-module/party-setting-module/party-setting.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-party-details-party-info',
  templateUrl: './party-details-party-info.component.html',
  styleUrls: ['./party-details-party-info.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class PartyDetailsPartyInfoComponent implements OnInit {
  partyId =''
  @Input()  partInfoDetails;
  currency_type: any 
  partyContactList=[];
  partyCertificateList=[];
  preFixUrl= getPrefix();
  isTax = false;
  isTds = false;
  showOptions = "";
  viewUploadedDocs={
    show: false,
    data:{}
  }
  popUpRenewDocuments = {
    show: false, 
    data: {}
  };
  isPartyEditPermission=true;
  listQuerparams ={
    search :'',
    filters :'[]'
  };
  customFieldData :any[] = [];

  constructor(private _partyDetailsClientService:PartyDetailsClientService,private currency: CurrencyService,private route:Router, private _tax: TaxService,public dialog: Dialog,private _permissions:NgxPermissionsService,
    private activatedRoute : ActivatedRoute,private _partyCustomSettingService : PartySettingService) { }

  ngOnInit(): void {
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
    this.currency_type = this.currency.getCurrency();
    this._permissions.hasPermission(Permission.party.toString().split(',')[1]).then(val=>{
      this.isPartyEditPermission=val;
    })
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ]).subscribe(([params, queryParams]) => {      
        if(params['party_id']){
          this.partyId =params['party_id']
          this.getPartyCertificateList();
          this.getPartyContacts();
          this.getPartyCustomFieldsData(this.partyId);
        }
    });
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

  getPartyCustomFieldsData(party){
    this._partyCustomSettingService.partyCustomFieldsDataforEdit(party).subscribe((res)=>{
      this.customFieldData = res['result']['fields']
    })
  }

  editButton(e){
    if(e){
    this.route.navigate([this.preFixUrl+'/onboarding/party/edit/'+this.partyId])
    }
  }

   changeKyc(){
    this.partInfoDetails.kyc=!this.partInfoDetails.kyc
    let payLoad={"party_id":this.partyId, "kyc": this.partInfoDetails.kyc}
    this._partyDetailsClientService.updatePrtyKyc(payLoad).subscribe(resp=>{
   })
   }

   getPartyCertificateList(){
    this._partyDetailsClientService.getPartyCertificateList(this.partyId,this.listQuerparams).subscribe(resp=>{
      this.partyCertificateList = resp['result']
    })
   }

   getStyle(color){
    if(color =="red")
    return {color :'red'};
     
    if(color=='yellow')
     return { color: 'rgb(255, 185, 0)' }
    if(color=='green')
      return { color: '#07c060' }

  }

  renewDocuments(data){
    this.popUpRenewDocuments.data = data
    this.popUpRenewDocuments.show = true;
  }

  openDocumentsHistory(data){
    this._partyDetailsClientService.getCertificateHistory(data['id']).subscribe(resp=>{
      const dialogRef = this.dialog.open(PartyCertificateHistoryComponent, {
        minWidth: '55%',
        data: {
          data: resp['result'],
          name : data.name,
        },
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
        dialogRefSub.unsubscribe()
  
      });
    })
  
  }

  dataFromRenewalDoc(e){
    if(e){
      this.listQuerparams = cloneDeep(this.listQuerparams)
      this.getPartyCertificateList();
    }
    this.popUpRenewDocuments.data = {}
    this.popUpRenewDocuments.show = false;
  }

  viewUploadedDocument(data){
    this.viewUploadedDocs.data= cloneDeep(data);    
    this.viewUploadedDocs.show= true;
  }

  optionsList(event, list_index) {
    return (this.showOptions = list_index);
  }


  outSideClick(env) {
    try {
      if (env.target.className.indexOf("more-icon") == -1) {
        this.showOptions = "";
      }
    } catch (error) {
      console.log(error);
    }
  }

  searchCertificate(e){
    this.listQuerparams.search = e;
    this.getPartyCertificateList()
  }

  filterDataOngoing(e){
    this.listQuerparams.filters = JSON.stringify(e);
    this.getPartyCertificateList()
    
  }

  convertToNormalDate(date : string){
    return normalDate(date)
  }
}
