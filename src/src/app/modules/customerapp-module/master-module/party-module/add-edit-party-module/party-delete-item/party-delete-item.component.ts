import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
interface DialogType{
  message:string,
  name:string
  url:string
}
@Component({
  selector: 'app-party-delete-item',
  templateUrl: './party-delete-item.component.html',
  styleUrls: ['./party-delete-item.component.scss']
})
export class PartyDeleteItemComponent implements OnInit {

  deleteDocumentForm : FormGroup
  initialDetails:DialogType;
  constructor( private _fb :FormBuilder,private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: DialogType,private _partyService:PartyService,) { }

  ngOnInit(): void {    
    this.buildForm()
    this.initialDetails= this.dialogData
  }

  buildForm(){
    this.deleteDocumentForm = this._fb.group({
      all_party :true,
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
      this._partyService.deletePartyItems(this.dialogData.url,form.value).subscribe(resp=>{
        this.dialogRef.close(true)
      });
    }
    
  }
}
