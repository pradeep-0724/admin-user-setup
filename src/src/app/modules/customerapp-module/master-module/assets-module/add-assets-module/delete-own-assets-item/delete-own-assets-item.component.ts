import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
interface DialogType{
  message:string,
  asset_type:string
  name:string
  url:string,
  type:string,
}

@Component({
  selector: 'app-delete-own-assets-item',
  templateUrl: './delete-own-assets-item.component.html',
  styleUrls: ['./delete-own-assets-item.component.scss']
})
export class DeleteOwnAssetsItemComponent implements OnInit {
  deleteDocumentForm : FormGroup
  initialDetails:DialogType;
  constructor( private _fb :FormBuilder,private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: DialogType,private _ownAssetService:OwnAssetsService) { }

  ngOnInit(): void {    
    this.buildForm()
    this.initialDetails= this.dialogData
  }

  buildForm(){
    this.deleteDocumentForm = this._fb.group({
      all_asset :false,
      type_asset :false,
      asset_type:this.dialogData.asset_type,
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
      if(!form.value['all_asset']){
        form.value['type_asset']=true;
      }
      this._ownAssetService.deleteAssetItem(this.dialogData.url,form.value).subscribe(resp=>{
        this.dialogRef.close(true)
      });
    }
    
  }
}