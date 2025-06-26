import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

interface DialogType{
  heading:string,
  label:string,
  editData?:any,
  url:string,
  documentList:Array<any>
}

@Component({
  selector: 'app-party-add-edit-items',
  templateUrl: './party-add-edit-items.component.html',
  styleUrls: ['./party-add-edit-items.component.scss']
})
export class PartyAddEditItemsComponent implements OnInit {

  editDocumentForm : FormGroup
  initialDetails:DialogType;
  isDocumentDuplicate=false;
  isEdit=false;
  constructor( private _fb :FormBuilder,private dialogRef: DialogRef<any>,private _partyService:PartyService,
    @Inject(DIALOG_DATA) private dialogData: DialogType) { }

  ngOnInit(): void {    
    this.buildForm()
    this.initialDetails= this.dialogData
    if(this.dialogData.editData){
     this.isEdit=true;
     this.editDocumentForm.get('name').setValue(this.dialogData.editData)
    }
  }

  buildForm(){
    this.editDocumentForm = this._fb.group({
      id :null,
      name:['',Validators.required],
      all_party : true,
      is_expiry_mandatory:false,
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  cancel(){
    this.dialogRef.close(false)
  }

  save(form){
    let formValue=cloneDeep(form.value)
    this.isDocumentDuplicate =this.dialogData.documentList.includes(form.value['name'].trim())
    if(form.valid && !this.isDocumentDuplicate){
      if(this.isEdit){
        formValue['prev_name']=this.dialogData.editData;
        formValue['new_name']=formValue['name'];
         delete formValue['name']
         delete formValue['is_expiry_mandatory']
        this._partyService.updatePartyCertificate(formValue).subscribe(resp=>{
          this.dialogRef.close(formValue['new_name'])
        })
      }else{
        this._partyService.addPartyCertificate(formValue).subscribe(resp=>{
          this.dialogRef.close(formValue)
        })
      }
    
    }else{
      setAsTouched(form)
    }
  }
}

