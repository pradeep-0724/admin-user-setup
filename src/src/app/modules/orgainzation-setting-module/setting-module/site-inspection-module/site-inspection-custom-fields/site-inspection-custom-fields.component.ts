import { Component, OnDestroy, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { SiteInspectionSettingsService } from '../site-inspection-settings.service';

@Component({
  selector: 'app-site-inspection-custom-fields',
  templateUrl: './site-inspection-custom-fields.component.html',
  styleUrls: ['./site-inspection-custom-fields.component.scss']
})
export class SiteInspectionCustomFieldsComponent implements OnInit,OnDestroy {

 
  catagorySelected='1'
  vehicleInspectionDetails=[];
  vehicleCategories=[];
  preFixUrl = getPrefix();

  constructor(private dialog:Dialog,private _commonLoader:CommonLoaderService,private apiHandler: ApiHandlerService,private _siteInspectionSettingsService:SiteInspectionSettingsService) { }

  ngOnInit(): void {
    this._commonLoader.getHide()
    this.getInspectionFromsList();
  }

  getInspectionFromsList(){
    this._siteInspectionSettingsService.getInspectionFormsList().subscribe((res)=>{
      console.log(res);
      this.vehicleInspectionDetails = res['result']
      
    })
  }

  ngOnDestroy(): void {
    this._commonLoader.getShow()
  }



  deleteVehicleInspection(id,inspectionName) {
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      width: '200px',
      maxWidth:'90%',
      data: {
        message:'Are you sure, you want to delete?'
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if(result){
        this.apiHandler.handleRequest(this._siteInspectionSettingsService.deleteSiteInspectionInPreference(id), `${inspectionName} deleted successfully!`).subscribe(
          {
            next: () => {
              this.getInspectionFromsList();
            }
          }
        )
      }
      dialogRefSub.unsubscribe()

    });
  }

  
}
