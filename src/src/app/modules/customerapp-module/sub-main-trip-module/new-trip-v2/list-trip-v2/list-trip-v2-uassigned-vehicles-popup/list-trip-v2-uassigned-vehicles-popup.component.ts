import { Component, Input, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';

@Component({
  selector: 'app-list-trip-v2-uassigned-vehicles-popup',
  templateUrl: './list-trip-v2-uassigned-vehicles-popup.component.html',
  styleUrls: ['./list-trip-v2-uassigned-vehicles-popup.component.scss']
})
export class ListTripV2UassignedVehiclesPopupComponent implements OnInit {
  @Input() show=false;

  constructor(private newTripV2Service: NewTripV2Service,   ) { }
  showModal: Boolean = true;
  prefixUrl=getPrefix()
  vehicleList=[];
  
  ngOnInit(): void {
    
    this.newTripV2Service.getUnassignedVehiclesList().subscribe((data)=>{
      this.vehicleList=data['result']
      
    })
    
  }

  close(){
   
    
  }

}
