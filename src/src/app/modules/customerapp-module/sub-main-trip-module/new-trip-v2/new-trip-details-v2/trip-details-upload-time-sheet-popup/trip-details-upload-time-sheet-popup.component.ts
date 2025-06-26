import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cloneDeep, isArray } from 'lodash';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-trip-details-upload-time-sheet-popup',
  templateUrl: './trip-details-upload-time-sheet-popup.component.html',
  styleUrls: ['./trip-details-upload-time-sheet-popup.component.scss']
})
export class TripDetailsUploadTimeSheetPopupComponent implements OnInit {

  timeSheetForm: FormGroup;
  isEdit = false;
  billingBasdedOn=''
  constructor(private formBuillder: FormBuilder, private dialogRef: DialogRef<any>,
    @Inject(DIALOG_DATA) private dialogData: any, private _newTripV2Service: NewTripV2Service) { }

  ngOnInit(): void {
    this.buildForm();
    this.billingBasdedOn = this.dialogData.billingBasdedOn;
    if (this.dialogData.id) {
      this.isEdit = true
      this.getTimeSheetData();
    }
  }

  buildForm() {
    this.timeSheetForm = this.formBuillder.group({
      trip_id: this.dialogData.tripId,
      start_date: [new Date(dateWithTimeZone()),],
      end_date: [new Date(dateWithTimeZone()),],
      billing_hours: [0, [Validators.required, Validators.min(0.01)]],
      extra_hours: 0,
      remarks: [''],
      timesheet_no: '',
      documents: [[], [TransportValidator.fileUploadValidator()]]

    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  fileUploader(e) {
    let files = [];
    let fileValue = [];
    if (e.length) {
      e.forEach(element => {
        element['presigned_url'] = element['url']
        files.push(element);
      });
    }
    fileValue = this.timeSheetForm.get('documents').value
    if (isArray(fileValue)) {
      this.timeSheetForm.get('documents').setValue(fileValue.concat(files));
    }
  }

  fileDeleted(id) {
    let value = this.timeSheetForm.get('documents').value;
    this.timeSheetForm.get('documents').setValue(value.filter(item => item.id !== id));
  }

  close() {
    this.dialogRef.close(false);
  }

  save() {
    let form = this.timeSheetForm;
    let formValues = cloneDeep(form.value)
    if (form.valid) {
      formValues['start_date'] = changeDateToServerFormat(formValues['start_date'])
      formValues['end_date'] = changeDateToServerFormat(formValues['end_date'])
      formValues['documents'] = formValues['documents'].map(doc => doc.id)
      if(this.isEdit){
        this._newTripV2Service.putTimeSheets(this.dialogData['id'],formValues).subscribe(resp => {
          this.dialogRef.close(true);
        })
      }else{
        this._newTripV2Service.createTimeSheets(formValues).subscribe(resp => {
          this.dialogRef.close(true);
        })
      }
    } else {
      setAsTouched(form)
    }
  }


  getTimeSheetData(){
     this._newTripV2Service.getTimeSheetsDetails(this.dialogData['id']).subscribe(resp=>{
      this.timeSheetForm.patchValue(resp['result'])
     })
  }

}
