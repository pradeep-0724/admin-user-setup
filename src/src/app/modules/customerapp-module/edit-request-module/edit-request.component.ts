import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { EditRequestService } from './edit-request.service';

type editRequest={
  heading:string,
  url:string,
  areRemarksMandatory : boolean
}

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.scss']
})
export class EditRequestComponent implements OnInit {
  heading : string = '';
  editRequestForm : FormGroup
  constructor( private dialogRef: DialogRef<any>, private _editRequest:EditRequestService,
    @Inject(DIALOG_DATA) private dialogData: editRequest,private _fb : FormBuilder) { }

  ngOnInit(): void {    
    this.editRequestForm = this._fb.group({
      remark: ['', this.dialogData.areRemarksMandatory ?[Validators.required] : [Validators.nullValidator]],
    })
    this.heading =  this.dialogData.heading;
  }
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
  
  close(){
    this.dialogRef.close(false)
  }

  save(){   
    const form=this.editRequestForm;
    if(form.valid){
      this._editRequest.sendEditRequest(this.dialogData.url,form.value).subscribe(resp=>{
        this.dialogRef.close(true); 
      })
    }else{
      setAsTouched(form)
    }   
  }


}
