import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaintenanceService } from '../../operations-maintenance.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
  @Output() serviceDetails= new EventEmitter();
  @Input() vehicleId=''
  serviceDetail={
    data:{},
  }
  search=''
  serviceList=[];
  addNewService=false;
  newServiceName='';
  apiError=''
  isOpenHistoryData={
    data:{},
    open:false
  };
  currency_type:any;
 
  constructor(private _maintenanceService:MaintenanceService,private currency: CurrencyService) { }

  ngOnInit(): void {
    this.currency_type = this.currency.getCurrency();
   this.getServiceTypeList();
  }


  closeAddService(){
    this.search ='';
    this.serviceDetails.emit(this.serviceDetail);
  }

  closeAddNewService(){
    this.addNewService=false;
    this.apiError='';
    this.newServiceName='';
  }

  addNewServiceType(){

    if(this.newServiceName.trim()){
      let payload ={
        service_name:this.newServiceName
      }
      this._maintenanceService.postNewServiceType(payload).subscribe((resp:any)=>{
        this.addNewService=false;
        this.newServiceName='';
        this.apiError='';
        this.getServiceTypeList();
      },err=>{
        this.apiError=err.error.message
      })
    }
  }

  getServiceTypeList(){
    this._maintenanceService.getServiceTypeList(this.vehicleId).subscribe((resp:any)=>{
      this.serviceList =resp['result']
    })
  }

  serviceSelected(data){
    this.serviceDetail.data =data;
    this.serviceDetails.emit(this.serviceDetail);
  }

  openHistory(data){
   this.isOpenHistoryData.data=data;
   this.isOpenHistoryData.open=true;
  }


}
