import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
interface DialogType{
  message:string,
  vehicle_type:string
  name:string
  url:string,
  type:string,
}
@Component({
  selector: 'app-delete-own-vehicle-items',
  templateUrl: './delete-own-vehicle-items.component.html',
  styleUrls: ['./delete-own-vehicle-items.component.scss']
})
export class DeleteOwnVehicleItemsComponent implements OnInit {
  deleteDocumentForm : FormGroup
  initialDetails:DialogType;
  constructor( private _fb :FormBuilder,private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: DialogType,private _ownVehicleService:OwnVehicleService) { }

  ngOnInit(): void {    
    this.buildForm()
    this.initialDetails= this.dialogData
  }

  buildForm(){
    this.deleteDocumentForm = this._fb.group({
      all_vehicle :false,
      type_vehicle :false,
      is_market:false,
      vehicle_type:this.dialogData.vehicle_type,
      name:this.dialogData.name
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  cancel(){
    this.dialogRef.close(false)
  }

  confirm(){
    const form = this.deleteDocumentForm
    if(form.valid){
      if(!form.value['all_vehicle']){
        form.value['type_vehicle']=true;
      }
      this._ownVehicleService.deleteVehicleItem(this.dialogData.url,form.value).subscribe(resp=>{
        this.dialogRef.close(true)
      });
    }
    
  }
}
