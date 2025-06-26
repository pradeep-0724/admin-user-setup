import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/operators';
import { NewMarketVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/new-market-vehicle-service/new-market-vehicle.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-add-edit-documnt-popup',
  templateUrl: './add-edit-documnt-popup.component.html',
  styleUrls: ['./add-edit-documnt-popup.component.scss']
})
export class AddEditDocumntPopupComponent implements OnInit {

  editDocumentForm: FormGroup;
  isEdit: boolean=false
  isDelete: boolean=false
  isAdd: boolean=false
  isDuplicateDocInAllVech = false;
  documentNameObj = new Subject();
  constructor(private _fb: FormBuilder, private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) private dialogData: any, private newMarketVehicleService: NewMarketVehicleService) { }

  ngOnInit(): void {
    this.isEdit = this.dialogData.isEdit;
    this.isDelete = this.dialogData.isDelete;
    this.isAdd = this.dialogData.isAdd;
    this.buildForm(this.dialogData.data)
    this.documentNameObj.pipe(debounceTime(100))
    .subscribe((val:string)=>{
      if(val){
        this.checkDefaultDocument(val)
      }
    })
  }

  buildForm(data) {
    this.editDocumentForm = this._fb.group({
      id: [data.id],
      name: [data.name || null, [Validators.required, Validators.minLength(2)]],
      number: [data.number || ''],
      expiry_date: [data.expiry_date || null],
      issue_date: [data.issue_date || null],
      files: [data.files || []],
      all_vehicle: [data.all_vehicle || false],
      type_vehicle:true,
      is_market: [true],
      vehicle_type: [data.vehicle_type],
      new_name: [''],
      is_expiry_mandatory:false,
      prev_name: [data.name]
    })
    if (this.dialogData.isEdit || this.dialogData.isDelete) {
      this.editDocumentForm.get('all_vehicle').setValue(data.all_vehicle)
      this.editDocumentForm.get('type_vehicle').setValue(data.type_vehicle)
    }

  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  cancel() {
    this.documentNameObj.unsubscribe()
    this.dialogRef.close()
  }

  save(form) {
    this.editDocumentForm.get('new_name').setValue(this.editDocumentForm.get('name').value);
    if (form.valid) {
      if (!this.isDelete && this.dialogData.allDocNames.includes(form.get('name').value)) {
        if(this.isEdit){
          if (!this.isDuplicateDocInAllVech) {
            this.newMarketVehicleService.updateDefaultDocument(form.value).subscribe((response) => {
              this.documentNameObj.unsubscribe()
              this.dialogRef.close(form.value)
            })
          }
        }
        if(this.isAdd){
          this.newMarketVehicleService.addDefaultDocument(form.value).subscribe((response) => {
            this.documentNameObj.unsubscribe()
            this.dialogRef.close()
          })
        }
      } else {
        if(this.isDelete){
          if(!form.value['all_vehicle']){
            form.value['type_vehicle']=true;
          }
          this.newMarketVehicleService.deleteDefaultDocument(form.value).subscribe((response) => {
            this.documentNameObj.unsubscribe()
            this.dialogRef.close(true)
          })
        }
        if(this.isEdit){
          if (!this.isDuplicateDocInAllVech) {
            this.newMarketVehicleService.updateDefaultDocument(form.value).subscribe((response) => {
              this.documentNameObj.unsubscribe()
              this.dialogRef.close(form.value)
            })
          }
        }
        if(this.isAdd){
          this.newMarketVehicleService.addDefaultDocument(form.value).subscribe((response) => {
            this.documentNameObj.unsubscribe()
            this.dialogRef.close(form.value)
          })
        }
      }
    } else {
      setAsTouched(form)
    }
  }

  documentName() {
    this.documentNameObj.next(this.editDocumentForm.get('name').value)
  }

  checkDefaultDocument(val='') {
    if(val.trim()){
      let payLoad = {
        "all_vehicle": true,
        "type_vehicle": false,
        "vehicle_type": this.dialogData.data.vehicle_type,
        "name": val.trim(),
        "is_market": true
      }
      this.newMarketVehicleService.checkDefaultDocument(payLoad).subscribe((response) => {
        this.isDuplicateDocInAllVech = response['result'];
        if(this.isEdit){
          if(this.dialogData.data['name']==val.trim()){
            this.isDuplicateDocInAllVech=false;
          }
        }
      })
    }
  
  }
}
