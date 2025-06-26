import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleDetailsV2EMIPaidPopupComponent } from '../vehicle-details-v2-emi-paid-popup/vehicle-details-v2-emi-paid-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { cloneDeep } from 'lodash';
import { OwnVehicleReportService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-report.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { VehicleSettingService } from 'src/app/modules/orgainzation-setting-module/setting-module/vehicle-settings-module/vehicle-setting.service';
import { combineLatest } from 'rxjs';
import { AssetsDetailsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-details.service';
import { PermitCertifcatesHistoryComponent } from '../../../../permits-shared-module/permit-certifcates-history/permit-certifcates-history.component';
import { VehicleCertifcatesHistoryComponent } from '../vehicle-details-v2/vehicle-certifcates-history/vehicle-certifcates-history/vehicle-certifcates-history.component';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-vehicle-details-vehicle-info-section',
  templateUrl: './vehicle-details-vehicle-info-section.component.html',
  styleUrls: ['./vehicle-details-vehicle-info-section.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class VehicleDetailsVehicleInfoSectionComponent implements OnInit ,OnChanges{
  vehicleId='';
  @Input () vehicleHeaderDetails;
  @Output() openSelectedTab= new EventEmitter();
  vehicleCategory ;
  showOptions=''
  vehDetailsCollapse:boolean=true;
  isWidthExpandedCertificate:boolean=false;
  isWidthExpandedSubAsset:boolean=false;
  isWidthExpandedPermit:boolean=false;
  vehcileInfo:any
  isVehicleEditPermission=false;
  constructor(private route:Router,public dialog: Dialog,private _ownVehicleReportService:OwnVehicleReportService,private apiHandler: ApiHandlerService,
    private currency: CurrencyService,private _permissions:NgxPermissionsService,private _vehicleSettings:VehicleSettingService,
    private _route : ActivatedRoute,private _assetDetailsService:AssetsDetailsService) { }
  getPrefixUrl=getPrefix();
  vehicleDocumentList=[];
  currency_type: any 
  popUpRenewDocuments = {
    show: false,
    data: {}
  };

  viewUploadedDocs={
    show: false,
    data:{}
  }
  vehicleSubDetails=[];
  vehiclePermitDetails=[];
  vehicleSubAssets=[];
  vehicleTyreMaster=[];
  vehicleSubDetailsDefault=[];
  listQuerParams = {
    search : '',
    filters : '[]'
  }
  listQuerParamsSubAssets = {
    search : '',
    filters : '[]'
  };
  renewPermitsData = {
    show: false,
    data: {}
  };
  isEmi=false;
  isSpecificationAdded :boolean = false;
  
  ngOnInit(): void {
    combineLatest([
      this._route.params,
      this._route.queryParams
    ]).subscribe(([params, queryParams]) => {
      if(params['vehicle_id']){
        this.vehicleId =params['vehicle_id']
        this.getVehicleInfo();
        this.getVehicleSubDetails();
        this.getVehicleDocuments();
        this.getVehicleSubAssets();
        this.getTyreDetails();
        this.getPermitDetails();
      }
    });
    this._vehicleSettings.getVehicleSettings().subscribe(resp=>{
     this.isEmi = resp['result']['emi']
    })
    this.currency_type = this.currency.getCurrency();
    this._permissions.hasPermission(Permission.vehicle.toString().split(',')[1]).then(val=>{
      this.isVehicleEditPermission=val
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.vehicleCategory= this.vehicleHeaderDetails?.vehice_category;
  }

  documentEdit(e){    
   this.route.navigate([getPrefix()+'/onboarding/vehicle/own/edit/'+this.vehicleId])
  }

  openEMIpaidPopup(event){        
    const dialogRef = this.dialog.open(VehicleDetailsV2EMIPaidPopupComponent, {
      minWidth: '28%',
      data: {
        amount:event,
        id:this.vehicleId
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result:boolean) => {
      if(result){
        dialogRefSub.unsubscribe();
        this.getVehicleInfo();
        this.getVehicleDocuments()
      }
      

    });

  }

  getVehicleInfo(){
    this._ownVehicleReportService.getVehicleInfo(this.vehicleId).subscribe(resp=>{
     this.vehcileInfo = resp['result'];
     this.isSpecificationAdded = this.vehcileInfo?.asset_specifications.every(ele=>ele.specification.length==0)
    });
  }

  getEmiStatus(val){
     if(val==0) return 'Active'
     if(val==1) return 'Complete'
     if(val==2) return 'Inactive'
  }

  getVehicleSubDetails(){
    this._ownVehicleReportService.getVehicleSubDetails(this.vehicleId).subscribe(resp=>{
      this.vehicleSubDetails = resp['result']
      this.vehicleSubDetailsDefault =resp['result']
     });
  }

  getVehicleSubAssets(){
    this._ownVehicleReportService.getVehicleSubAssets(this.vehicleId,this.listQuerParamsSubAssets).subscribe(resp=>{
      this.vehicleSubAssets = resp['result']   
    })
  }

  getTyreDetails(){
    this._ownVehicleReportService.getVehicleTyreMaster(this.vehicleId).subscribe(resp=>{
      this.vehicleTyreMaster=  resp['result'];
    })
  }

  getPermitDetails(){
    this._ownVehicleReportService.getPermitDetails(this.vehicleId).subscribe((res)=>{
      this.vehiclePermitDetails = res['result'];
    })
  }


  getVehicleDocuments(){
    this._ownVehicleReportService.getVehicleDocuments(this.vehicleId,this.listQuerParams).subscribe(resp=>{
      this.vehicleDocumentList = resp['result']    
    })
  }

  wCollapseCertificateEvent(val:boolean){
    this.isWidthExpandedCertificate=val;
  }
  wCollapseSubAssetEvent(val:boolean){
    this.isWidthExpandedSubAsset=val;
  }
  wCollapsePermitEvent(val:boolean){
    this.isWidthExpandedPermit=val;
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
      this.apiHandler.handleRequest(this._ownVehicleReportService.renewVehicleCertificates(e.data.apiText, data), `${certificatename} renewed successfully!`).subscribe(
        {
          next: () => {
            if (e.data.apiText.includes('subasset')) {
              this.getVehicleSubAssets()
            } else {
              this.getVehicleDocuments();
            }
          }
        }
      )
      this.popUpRenewDocuments.show = false;

    }
  }
 
  renewDocuments(event,apiText) {        
    this.popUpRenewDocuments.data = event;
    if(apiText==='subasset'){
      this.popUpRenewDocuments.data['isSubAsset'] = false
    }else{
      this.popUpRenewDocuments.data['isSubAsset'] = true;
    }
    this.popUpRenewDocuments.data['vehicle_number'] = this.vehicleHeaderDetails['reg_number'];
    this.popUpRenewDocuments.data['apiText'] = event.id+'/'+apiText;
    this.popUpRenewDocuments.show = true;
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
   this.openSelectedTab.emit(5)
  }

  openDocumentsHistory(data,apiText,isAttachment) {
    let apiTxt = data.id +'/'+apiText
    this._ownVehicleReportService.getVehicleHistoryCertificates(apiTxt).subscribe((res)=>{
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

  searchVehicleDetails(e){
    if(!e.trim()){
      this.vehicleSubDetails=  this.vehicleSubDetailsDefault
    }else{
      this.vehicleSubDetails=  this.vehicleSubDetailsDefault.filter(item=>{
       const name=  item.name.toLowerCase().includes(e.toLowerCase().trim())
       const info =  item.number.toLowerCase().includes(e.toLowerCase().trim())
       return name||info
      })
    }
  
  }

  filterDataCertificates(e){
    this.listQuerParams.filters = JSON.stringify(e);
    this.getVehicleDocuments()
  }
  

  searchCertificateDetails(e){
    this.listQuerParams.search = e;
    this.getVehicleDocuments();
  }


  filterDataSubAssets(e){
    this.listQuerParamsSubAssets.filters = JSON.stringify(e);
    this.getVehicleSubAssets()
  }
  

  searchAssets(e){
    this.listQuerParamsSubAssets.search = e;
    this.getVehicleSubAssets();
  }

  renewPermit(e) {
    this.renewPermitsData.data = {};
    if (e.isClosed) {      
      this._assetDetailsService.renewPermits(e.data['id'],e.data).subscribe((response)=>{
        this.getPermitDetails();
        this.renewPermitsData.show = false;
      })
    }
  }
 
  openPermitRenewPopup(event) {        
    this.renewPermitsData.data = event;
    this.renewPermitsData.show = true;
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

  getVehicleIcon(type){

    if (type ==0 ){
      return ' ../../../../../../../../assets/img/icons/trailer.svg';
    }
    else if(type ==1 ){
      return ' ../../../../../../../../assets/img/icons/dollie.svg';
    }
    

  }
 
  


}
