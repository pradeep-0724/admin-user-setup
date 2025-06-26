import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { cloneDeep } from 'lodash';
import { VehicleCertifcatesHistoryComponent } from '../../../vehicle-module/own-venicle-module/vehicle-details-v2/vehicle-details-v2/vehicle-certifcates-history/vehicle-certifcates-history/vehicle-certifcates-history.component'; 
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { combineLatest } from 'rxjs';
import { AssetsDetailsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-details.service';
import { PermitCertifcatesHistoryComponent } from '../../../permits-shared-module/permit-certifcates-history/permit-certifcates-history.component';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-assets-info-section',
  templateUrl: './assets-info-section.component.html',
  styleUrls: ['./assets-info-section.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class AssetsInfoSectionComponent implements OnInit {
  assetId='';
  @Input () assetViewDetails;
  @Output() openSelectedTab= new EventEmitter();
  showOptions=''
  assetDetailsCollapse:boolean=true;
  isWidthExpandedCertificate:boolean=false;
  isWidthExpandedAttachments:boolean=false;
  isWidthExpandedPermits:boolean=false;
  isAssetEditPermission=false;
  constructor(public dialog: Dialog,private _permissions:NgxPermissionsService,private apiHandler: ApiHandlerService,
    private _route : ActivatedRoute,private _assetDetailsService:AssetsDetailsService) { }
  getPrefixUrl=getPrefix();
  assetCertificatesList=[];
  popUpRenewDocuments = {
    show: false,
    data: {}
  };
  renewPermitsData = {
    show: false,
    data: {}
  };

  viewUploadedDocs={
    show: false,
    data:{}
  }
  assetSubDetails=[];
  assetAttachments=[];
  assetTyreMaster=[];
  assetSubDetailsDefault=[];
  assetPermitDetails = [];
  listQuerParams = {
    search : '',
    filters : '[]'
  }
  listQuerParamsSubAssets = {
    search : '',
    filters : '[]'
  }
  listQuerParamsPermits = {
    search : '',
    filters : '[]'
  }
  
  ngOnInit(): void {
    combineLatest([
      this._route.params,
      this._route.queryParams
    ]).subscribe(([params, queryParams]) => {
      if(params['asset_id']){
        this.assetId =params['asset_id']
        this.getAssetSubDetails();
        this.getAssetCertificates();
        this.getAssetsAttachments();
        this.getTyreDetails();
        this.getAssestsPermitList();
      }
    });
    this._permissions.hasPermission(Permission.assets.toString().split(',')[1]).then(val=>{      
      this.isAssetEditPermission=val
    })
  }


  getAssetSubDetails(){
    this._assetDetailsService.getAssetsSubDetails(this.assetId).subscribe(resp=>{
      this.assetSubDetails = resp['result']
      this.assetSubDetailsDefault =resp['result']
     });
  }

  getAssetsAttachments(){
    this._assetDetailsService.getAssetsSubAssets(this.assetId,this.listQuerParamsSubAssets).subscribe(resp=>{
      this.assetAttachments = resp['result']   
    })
  }

  getTyreDetails(){
    this._assetDetailsService.getAssetsTyreMaster(this.assetId).subscribe(resp=>{
      this.assetTyreMaster=  resp['result'];
    })
  }


  getAssetCertificates(){
    this._assetDetailsService.getAssetsDocuments(this.assetId,this.listQuerParams).subscribe(resp=>{
      this.assetCertificatesList = resp['result']          
    })
  }

  getAssestsPermitList(){
    this._assetDetailsService.getPermitDetails(this.assetId,this.listQuerParamsPermits).subscribe((res)=>{      
      this.assetPermitDetails = res['result'];
    })
  }

  wCollapseCertificateEvent(val:boolean){
    this.isWidthExpandedCertificate=val;
  }
  wCollapseSubAssetEvent(val:boolean){
    this.isWidthExpandedAttachments=val;
  }
  wCollapsePermitEvent(val:boolean){
    this.isWidthExpandedPermits=val;
  }
  
  dataFromRenewalDoc(e) {
    let certificatename = this.popUpRenewDocuments.data['name'];
    this.popUpRenewDocuments.data = {};
    if (e.isClosed) {
      let data ={
        number : e.data.number,
        expiry_date : e.data.expiry_date,
        issue_date : e.data.issue_date,
        vendor : e.data.vendor,
        files : e.data.files
      }
      this.apiHandler.handleRequest(this._assetDetailsService.renewAssetCertificates(e.data.apiText,data),`${certificatename} renewed successfully!`).subscribe((response)=>{
        if(e.data.apiText.includes('subasset')){
          this.getAssetsAttachments();
        }else{
          this.getAssetCertificates();
        }
      })
      this.popUpRenewDocuments.show = false;

    }
  }
 
  renewDocuments(event,apiText) {        
    this.popUpRenewDocuments.data = event;
    if(apiText==='subasset'){
      this.popUpRenewDocuments.data['isAttachment'] = false
    }else{
      this.popUpRenewDocuments.data['isAttachment'] = true;
    }
    this.popUpRenewDocuments.data['apiText'] = event.id+'/'+apiText;
    this.popUpRenewDocuments.show = true;
  }

  renewPermit(e) {
    this.renewPermitsData.data = {};
    if (e.isClosed) {      
      this._assetDetailsService.renewPermits(e.data['id'],e.data).subscribe((response)=>{
        this.getAssestsPermitList();
        this.renewPermitsData.show = false;
      })
    }
  }
 
  openPermitRenewPopup(event) {        
    this.renewPermitsData.data = event;
    this.renewPermitsData.show = true;
  }

  getStyle(color){
    if(color =="red")
    return {color :'red'};
     
    if(color=='yellow')
     return { color: 'rgb(255, 185, 0)' };
    if(color=='green')
      return { color: '#07c060' }

  }
  fixedTo3Decimal(value){
    return Number(value).toFixed(3)
   }

   
  viewUploadedDocument(doc){
    this.viewUploadedDocs.data= cloneDeep(doc);    
    this.viewUploadedDocs.show= true;
  }

  openTyreDetailsTab(){
   this.openSelectedTab.emit(2)
  }

  openDocumentsHistory(data,apiText,isAttachment) {
    let apiTxt = data.id +'/'+apiText
    this._assetDetailsService.getAssetCertificatesHistory(apiTxt).subscribe((res)=>{
      const dialogRef = this.dialog.open(VehicleCertifcatesHistoryComponent, {
        minWidth: '55%',
        data: {
          data: res['result'],
          name : data.name,
          isAttachment : isAttachment
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
 
  openPermitHistory(data) {
    this._assetDetailsService.permitHistoryList(data.id).subscribe((res)=>{
      const dialogRef = this.dialog.open(PermitCertifcatesHistoryComponent, {
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

  searchAssetDetails(e){
    if(!e.trim()){
      this.assetSubDetails=  this.assetSubDetailsDefault
    }else{
      this.assetSubDetails=  this.assetSubDetailsDefault.filter(item=>{
       const name=  item.name.toLowerCase().includes(e.toLowerCase().trim())
       const info =  item.number.toLowerCase().includes(e.toLowerCase().trim())
       return name||info
      })
    }
  
  }

  filterDataCertificates(e){
    this.listQuerParams.filters = JSON.stringify(e);
    this.getAssetCertificates()
  }
  

  searchCertificateDetails(e){
    this.listQuerParams.search = e;
    this.getAssetCertificates();
  }


  filterDataSubAssets(e){
    this.listQuerParamsSubAssets.filters = JSON.stringify(e);
    this.getAssetsAttachments()
  }
  

  searchAssets(e){
    this.listQuerParamsSubAssets.search = e;
    this.getAssetsAttachments();
  }

  filterDataPermits(e){
    this.listQuerParamsPermits.filters = JSON.stringify(e);
    this.getAssestsPermitList()
  }
  

  searchPermits(e){
    this.listQuerParamsPermits.search = e;
    this.getAssestsPermitList()
  }


}
