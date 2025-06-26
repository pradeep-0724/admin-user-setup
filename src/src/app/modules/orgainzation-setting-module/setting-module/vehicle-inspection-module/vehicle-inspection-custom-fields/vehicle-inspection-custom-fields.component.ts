import { Component, OnInit } from '@angular/core';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { Dialog } from '@angular/cdk/dialog';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { VehicleInspectionServiceService } from 'src/app/modules/customerapp-module/api-services/vehicle-inspection/vehicle-inspection-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-vehicle-inspection-custom-fields',
  templateUrl: './vehicle-inspection-custom-fields.component.html',
  styleUrls: ['./vehicle-inspection-custom-fields.component.scss']
})
export class VehicleInspectionCustomFieldsComponent implements OnInit {
 
  catagorySelected='1'
  vehicleInspectionDetails=[];
  vehicleCategories=[];
  preFixUrl = getPrefix();

  constructor(private dialog:Dialog,private _commonLoader:CommonLoaderService,private apiHandler: ApiHandlerService,
    private _vehicleInspectionService : VehicleInspectionServiceService) { }

  ngOnInit(): void {
    this._commonLoader.getHide()
    this.getInspectionFromsList();
  }

  getInspectionFromsList(){
    this._vehicleInspectionService.getInspectionFormsList().subscribe((res)=>{
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
        this.apiHandler.handleRequest(this._vehicleInspectionService.deleteVehicleInspectionInPreference(id), `${inspectionName} deleted successfully!`).subscribe(
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
