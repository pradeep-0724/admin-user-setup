import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

interface DialogType {
  heading: string,
  label: string,
  editData?: any,
  validationUrl?: string
  url: string,
  expiryLabel: string,
  isExpiry: boolean,
  vehicle_type: string
  documentList: Array<any>
}

@Component({
  selector: 'app-add-edit-own-vehicle-items',
  templateUrl: './add-edit-own-vehicle-items.component.html',
  styleUrls: ['./add-edit-own-vehicle-items.component.scss']
})
export class AddEditOwnVehicleItemsComponent implements OnInit {

  editDocumentForm: FormGroup
  initialDetails: DialogType;
  URL = ''
  isDocumentDuplicate = false;
  isEdit = false
  documentNameObj = new Subject();
  isDuplicateDocInAllVech = false;
  constructor(private _fb: FormBuilder, private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: DialogType, private _ownVehicleService: OwnVehicleService) { }

  ngOnInit(): void {
    this.buildForm()
    this.initialDetails = this.dialogData
    this.URL = this.dialogData.url
    this.documentNameObj.pipe(debounceTime(100))
      .subscribe((val: string) => {
        if (val) {
          this.checkDocumentExist(val)
        }

      })
    if (this.dialogData.editData) {
      this.isEdit = true;
      this.editDocumentForm.get('name').setValue(this.dialogData.editData)
    }
  }

  buildForm() {
    this.editDocumentForm = this._fb.group({
      id: null,
      vehicle_type: this.dialogData.vehicle_type,
      is_market: false,
      name: ['', Validators.required],
      all_vehicle: false,
      type_vehicle: true,
      is_expiry_mandatory: false,
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  documentName() {
    this.documentNameObj.next(this.editDocumentForm.get('name').value)
  }


  cancel() {
    this.documentNameObj.unsubscribe()
    this.dialogRef.close(false)
  }

  save(form) {
    this.isDocumentDuplicate = this.dialogData.documentList.includes(form.value['name'].trim())
    if (form.valid) {
      if (this.isDocumentDuplicate) {
        if (this.isEdit) {
          if (!this.isDuplicateDocInAllVech) {
            let payload = {
              "all_vehicle": true,
              "type_vehicle": false,
              "is_market": false,
              "vehicle_type": this.dialogData.vehicle_type,
              "new_name": form.value['name'],
              "prev_name": this.dialogData.editData
            }
            this._ownVehicleService.updateVehicleItem(this.URL, payload).subscribe(resp => {
              this.documentNameObj.unsubscribe()
              this.dialogRef.close(form.value['name'])
            })
          }
        } else {
          this._ownVehicleService.addNewVehicleItem(this.URL, form.value).subscribe(resp => {
            this.documentNameObj.unsubscribe()
            this.dialogRef.close()
          })
        }
      } else {
        if (this.isEdit) {
          if (!this.isDuplicateDocInAllVech) {
            let payload = {
              "all_vehicle": true,
              "type_vehicle": false,
              "is_market": false,
              "vehicle_type": this.dialogData.vehicle_type,
              "new_name": form.value['name'],
              "prev_name": this.dialogData.editData
            }
            this._ownVehicleService.updateVehicleItem(this.URL, payload).subscribe(resp => {
              this.documentNameObj.unsubscribe()
              this.dialogRef.close(form.value['name'])
            })
          }
        } else {
          this._ownVehicleService.addNewVehicleItem(this.URL, form.value).subscribe(resp => {
            this.documentNameObj.unsubscribe()
            if (this.initialDetails.isExpiry) {
              this.dialogRef.close(form.value)
            } else {
              this.dialogRef.close(form.value['name'])
            }
          })
        }
      }

    } else {
      setAsTouched(form)
    }
  }

  checkDocumentExist(val = '') {
    if (val.trim()) {
      let payload = {
        "all_vehicle": true,
        "type_vehicle": false,
        "is_market": false,
        "vehicle_type": this.dialogData.vehicle_type,
        "name": val.trim()
      }
      this._ownVehicleService.checkVehicleItem(this.dialogData.validationUrl, payload).subscribe(resp => {
        this.isDuplicateDocInAllVech = resp['result']
        if (this.isEdit) {
          if (this.dialogData.editData == val.trim()) {
            this.isDuplicateDocInAllVech = false
          }
        }
      })
    }

  }
}