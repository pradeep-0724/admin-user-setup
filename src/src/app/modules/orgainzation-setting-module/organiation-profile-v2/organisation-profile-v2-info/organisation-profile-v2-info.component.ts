import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';
import { Subject } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { ProfileCertificateHistoryComponent } from '../profile-certificate-history/profile-certificate-history.component';

@Component({
  selector: 'app-organisation-profile-v2-info',
  templateUrl: './organisation-profile-v2-info.component.html',
  styleUrls: ['./organisation-profile-v2-info.component.scss']
})
export class OrganisationProfileV2InfoComponent implements OnInit {

  preFixUrl=getPrefix();
  @Input() companyDetails: Subject<any>=new Subject();
  companyData:any
  currency_type;
  popUpRenewDocuments={
    data:{},
    show:false
  };
  terminology: any;
  company_Id='';
  isTax=false;
  isTDS=false;
  viewUploadedDocs={
    show: false,
    data:{}
  }
  isSuperUser=false;
  @Output() isReload = new EventEmitter();
      constructor(private currency: CurrencyService,private route :Router,private _terminologiesService:TerminologiesService,
        private _tax:TaxService,private _permission:NgxPermissionsService,private _companyService: CompanyServices,
        public dialog: Dialog) { }

  ngOnInit(): void {
    this.terminology = this._terminologiesService.terminologie;
    this.isTDS = this._tax.getVat();
      this.isTax = this._tax.getTax();
    this.companyDetails.subscribe((data)=>{
      this.companyData=data
      this.company_Id=data.id
    })
    this.currency_type = this.currency.getCurrency();
    this._permission.hasPermission('super_user').then(val=>{
    this.isSuperUser = val;
    })
  }

  documentEdit(e){
    this.route.navigate([this.preFixUrl+'/organization_setting/profile/edit/'+this.companyData?.id])
  }

  
  getMonth(id){

    let month=[{
      id:'1',
      name:'Jan'
    },
    {
      id:'2',
      name:'Feb'
    },
    {
      id:'3',
      name:'Mar'
    },
    {
      id:'4',
      name:'Apr'
    },
    {
      id:'5',
      name:'May'
    },{
      id:'6',
      name:'Jun'
    },{
      id:'7',
      name:'July'
    },
    {
      id:'8',
      name:'Aug'
    },
    {
      id:'9',
      name:'Sept'
    },{
      id:'10',
      name:'Oct'
    },{
      id:'11',
      name:'Nov'
    },{
      id:'12',
      name:'Dec'
    }];

    if(id){
      return month.filter(item => item.id == id)[0].name
    }
  }

  routeToEdit(id){    
    this.route.navigate([this.preFixUrl+'/organization_setting/profile/edit/'+id])

  }
  renewDoc(doc){
    this.popUpRenewDocuments.data= cloneDeep(doc);    
    this.popUpRenewDocuments.show= true;
  }

  viewUploadedDocument(doc){
    this.viewUploadedDocs.data= cloneDeep(doc);    
    this.viewUploadedDocs.show= true;
  }

  dataFromRenewalDoc(e){    
    this.popUpRenewDocuments.data={};
    this.popUpRenewDocuments.show= false;
    if(e){
      this.isReload.emit(true)
    }
  }

  getStyle(color){
    if(color =="red")
    return {color :'red'};
     
    if(color=='yellow')
     return { color: 'rgb(255, 185, 0)' }

  }

  changeDateFormat(date){
    if(!date) return '-'
    return moment(date).format("DD-MM-YYYY")
  }

  openDocumentsHistory(data) {
    this._companyService.getCertificateHistory(data.id).subscribe((res)=>{
      const dialogRef = this.dialog.open(ProfileCertificateHistoryComponent, {
        minWidth: '55%',
        data: {
          data: res['result'],
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


}
