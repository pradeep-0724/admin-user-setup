import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { VehiclePermitService } from '../vehicle-permit.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';

@Component({
  selector: 'app-vehicle-permit-list',
  templateUrl: './vehicle-permit-list.component.html',
  styleUrls: ['./vehicle-permit-list.component.scss']
})
export class VehiclePermitListComponent implements OnInit,AfterViewChecked {

  perfixUrl;
  vehiclePermitList = [];
  listIndexData = {};
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  constructor(private heightService:SetHeightService,private _permitService: VehiclePermitService) { }

  ngOnInit(): void {
    this.perfixUrl = getPrefix();
    this.getPermitList();
  }
  ngAfterViewChecked(): void {
    this.heightService.setTableHeight2(['.calc-height'],'veh-permit-list',4)
    
  }

  getPermitList(){
    this._permitService.getPermitList().subscribe((res)=>{
      this.vehiclePermitList = res['result'].vp; 
    })
  }

  expiryMandatoryChanged(event,data){
    this._permitService.updateExpiryDateMandatory(data.id,event).subscribe((res)=>{
      this.getPermitList();
    })

  }

  popupFunction(id, index: any = null) {
    this.listIndexData = { id: id, index: index };
    this.popupInputData['show'] = true;
  }

  confirmButton(event) {
    if (event) {
      let id = this.listIndexData['id'];
      this.deletePermit(id);
      this.listIndexData = {};
    }
  }

  deletePermit(id){
    this._permitService.deletePermit(id).subscribe((res)=>{
      this.getPermitList();
    })
  }

  trackById(item: any): string {
    return item.id
  }


}
