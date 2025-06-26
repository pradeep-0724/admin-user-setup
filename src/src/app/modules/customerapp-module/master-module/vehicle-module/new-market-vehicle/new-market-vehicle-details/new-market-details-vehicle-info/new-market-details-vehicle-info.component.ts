import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { cloneDeep } from 'lodash';
import { NewMarketVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/new-market-vehicle-service/new-market-vehicle.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-new-market-details-vehicle-info',
  templateUrl: './new-market-details-vehicle-info.component.html',
  styleUrls: ['./new-market-details-vehicle-info.component.scss'],
  host: {
    "(document:click)": "outSideClick($event)",
  },
})
export class NewMarketDetailsVehicleInfoComponent implements OnInit {

  vehicleDetails : any ;
  certificatesDetails : any[] = [];
  certificatesDetailsDefault : any[] = [];
  preFixUrl = getPrefix();
  showOptions=''
  viewUploadedDocs={
    show: false,
    data:{}
  };
  currency_type;
  popUpRenewDocuments={
    data:{},
    show:false
  };

  @Input() headerDetails
  isVehicleEditPermission=false;
  constructor(private newMarketVehicleService : NewMarketVehicleService, private activatedRoute : ActivatedRoute,
    private route : Router, private _permissions:NgxPermissionsService) { }

  ngOnInit(): void {
    combineLatest([
      this.activatedRoute.params,
      this.activatedRoute.queryParams
    ]).subscribe(([params, queryParams]) => {
      if(params['vehicle_Id']){
        this.newMarketVehicleService.marketVehicleInfoDetails(params['vehicle_Id']).subscribe((response)=>{        
          this.vehicleDetails = response['result'];
        })
        this.newMarketVehicleService.marketVehicleCertificates(params['vehicle_Id']).subscribe((response)=>{        
          this.certificatesDetails = response['result'];
          this.certificatesDetailsDefault =response['result'];
        });
      }
    });
    this._permissions.hasPermission(Permission.market_vehicle.toString().split(',')[1]).then(val=>{
      this.isVehicleEditPermission= val
    })
  }

  documentEdit(){
    this.route.navigate([this.preFixUrl+'/onboarding/vehicle/market/edit/'+this.vehicleDetails?.id])
  }

  getStyle(color){
    if(color =="red")
    return {color :'red'};
     
    if(color=='yellow')
     return { color: 'rgb(255, 185, 0)' }
    if(color=='green')
      return { color: '#07c060' }
  }

  viewUploadedDocument(doc){
    this.viewUploadedDocs.data= cloneDeep(doc);    
    this.viewUploadedDocs.show= true;
  }

  renewDoc(doc){
    this.popUpRenewDocuments.data= cloneDeep(doc);    
    this.popUpRenewDocuments.show= true;
  }

  dataFromRenewalDoc(e){    
    this.popUpRenewDocuments.data={};
    this.popUpRenewDocuments.show= false;
    
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
    if(!e.trim()){
      this.certificatesDetails=  this.certificatesDetailsDefault
    }else{
      this.certificatesDetails=  this.certificatesDetailsDefault.filter(item=>{
       const name=  item.name.toLowerCase().includes(e.toLowerCase().trim())
       const info =  item.number.toLowerCase().includes(e.toLowerCase().trim())
       return name||info
      })
    }
  
  }


}
