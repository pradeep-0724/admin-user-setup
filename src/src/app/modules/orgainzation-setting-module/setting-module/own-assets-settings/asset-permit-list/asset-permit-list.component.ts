import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { OwnAssetPermitService } from '../own-assets-permit-service.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';

@Component({
  selector: 'app-asset-permit-list',
  templateUrl: './asset-permit-list.component.html',
  styleUrls: ['./asset-permit-list.component.scss']
})
export class AssetPermitListComponent implements OnInit ,AfterViewChecked{
  perfixUrl;
  ownAssetsPermitList = [];
  listIndexData = {};
  popupInputData = {
    msg: "Are you sure, you want to delete?",
    type: "warning",
    show: false,
  };
  constructor(private heightService:SetHeightService, private _permitService: OwnAssetPermitService) { }

  ngOnInit(): void {
    this.perfixUrl = getPrefix();
    this.getPermitList();
  }
  ngAfterViewChecked(): void {
    this.heightService.setTableHeight2(['.calc-height'],'asset-permit-list',4)
    
  }

  getPermitList(){
    this._permitService.getPermitList().subscribe((res)=>{
      this.ownAssetsPermitList = res['result'].vp; 
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