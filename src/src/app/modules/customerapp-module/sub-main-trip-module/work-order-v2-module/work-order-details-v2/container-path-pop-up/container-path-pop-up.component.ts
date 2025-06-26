import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-container-path-pop-up',
  templateUrl: './container-path-pop-up.component.html',
  styleUrls: ['./container-path-pop-up.component.scss']
})
export class ContainerPathPopUpComponent implements OnInit {
  movementSow=0
  paths=[]
  constructor( private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any, private _workOrderV2Service: WorkOrderV2Service,) { }

  ngOnInit(): void {
    this._workOrderV2Service.containerPaths(this.dialogData['id'],this.dialogData['movement_sow']).subscribe(resp=>{
      if(isValidValue(resp['result'])){
        resp['result'].forEach((item)=>{
          item['area']={
            label : item.location
          };
        })
      }
      this.paths=resp['result']
    })
  }

  close(){
    this.dialogRef.close(true);
  }


}
