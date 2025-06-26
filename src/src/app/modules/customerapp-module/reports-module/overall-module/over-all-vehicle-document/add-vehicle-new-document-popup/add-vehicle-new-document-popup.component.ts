import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogData } from 'src/app/modules/customerapp-module/sub-main-trip-module/quotation-module/list-view-quotation-module/quotation-list/quotation-list.component';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { OverallModuleService } from '../../../../api-services/reports-module-services/over-all-service/overall.service';

@Component({
  selector: 'app-add-vehicle-new-document-popup',
  templateUrl: './add-vehicle-new-document-popup.component.html',
  styleUrls: ['./add-vehicle-new-document-popup.component.scss']
})
export class AddVehicleNewDocumentPopupComponent implements OnInit {

  constructor(private formBuilder:FormBuilder,private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: DialogData,private overallService:OverallModuleService) { }
addnewDocumentPopUpForm;

  ngOnInit(): void {
    console.log(this.data);
    this.buildForm();
  }

  buildForm(){
    this.addnewDocumentPopUpForm=this.formBuilder.group({
      doc_name: [this.data['newDoc'],[Validators.required]],
      to_all:[],
    })
  }

  submitAddMoreDocument(){
    let form=this.addnewDocumentPopUpForm;
    let docName=form.get('doc_name').value;
    if(form.valid){
      this.overallService.postAddNewVehicleDoc(this.data['vehcileid'],form.value).subscribe((data)=>{
        console.log('data',data);
        let docData:any={
          docname: docName,
          id: data['result']
        }
      this.dialogRef.close(docData);
      })
    }else{
      this.setAsTouched(form)
    }
  }
  closePopUp(){
    this.dialogRef.close()
  }
  

  
  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

}
