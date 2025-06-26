import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';

@Component({
  selector: 'app-route-pop-up',
  templateUrl: './route-pop-up.component.html',
  styleUrls: ['./route-pop-up.component.scss']
})
export class RoutePopUpComponent implements OnInit {
  @Input() routePopUpData={
    show:false,
    type:'',
    customerId:''
  }
  routeName:string='';
  isRouteNameValid:boolean=true;
  errorMsg='';
  isCreateNewRoute:boolean=false;
  @Output() routPopUpData= new EventEmitter();
  constructor(private _newTripDataService:NewTripV2DataService ,private _tripNewService:NewTripV2Service) { }

  ngOnInit(): void {

  }

  saveRoute(){
   if(this.routeName.trim()){
    this._tripNewService.checkNewRoute({name:this.routeName.trim(),customer:this.routePopUpData.customerId}).subscribe(resp=>{
      if(!resp.result.exists){
        this._newTripDataService.setNewRouteName(this.routeName.trim());
        this.routeName='';
        this.errorMsg=''
        if(this.isCreateNewRoute){
          this.routPopUpData.emit(true);
        }
        this.routePopUpData.show=false;
      }else{
      this.errorMsg='Route name already exists'
      }
    });
    
   }else{
    this.isRouteNameValid=false;
   }
  }

  updateRoute(){
   this._newTripDataService.upDateRoute(true);
   this.routPopUpData.emit(true);
   this.routePopUpData.show=false;
  }

  createNewRoute(){
   this.isCreateNewRoute=true;
   this.routePopUpData.type='save'
  }

}
