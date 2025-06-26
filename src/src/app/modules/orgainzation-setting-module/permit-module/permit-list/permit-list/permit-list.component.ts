import { Component, OnInit } from '@angular/core';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { PermitServiceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/permit-service/permit-service.service';

@Component({
  selector: 'app-permit-list',
  templateUrl: './permit-list.component.html',
  styleUrls: ['./permit-list.component.scss']
})
export class PermitListComponent implements OnInit {

  perfixUrl;
  vehiclePermitList = [];
  listIndexData = {};
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  show : boolean = false;
  locations = []

  constructor(private heightService:SetHeightService,private _permitService: PermitServiceService,private apiHandler:ApiHandlerService) { }

  ngOnInit(): void {
    this.perfixUrl = getPrefix();
    this.getPermitList();
  }
  ngAfterViewChecked(): void {
    this.heightService.setTableHeight2(['.calc-height'],'veh-permit-list',4)
    
  }

  getPermitList(){
    this._permitService.getAllPermitDetails().subscribe((res)=>{
      this.vehiclePermitList = res['result'].vp; 
    })
  }

  expiryMandatoryChanged(event,data){
    this._permitService.setExpiry(data.id,event).subscribe((res)=>{
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
    this.apiHandler.handleRequest( this._permitService.deletePermitDetails(id),'Permit details deleted Successfully!').subscribe({
      next:(resp)=>{
        this.getPermitList();
      },
      error:(err)=>{
        console.log(err)
      }
    })
  }

  trackById(item: any): string {
    return item.id
  }


  openLocationsSideBar(locations){
    this.locations = locations;
    this.show = true;
  }
  closePopup(e){
    this.show = e;
  }


}
