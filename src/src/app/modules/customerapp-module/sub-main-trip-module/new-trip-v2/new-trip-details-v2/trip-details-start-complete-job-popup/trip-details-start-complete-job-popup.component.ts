import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { OdometerService } from 'src/app/core/services/odometer.service';
import { Subject } from 'rxjs';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import moment from 'moment';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { AddTripV2ValidationComponent } from '../../add-trip-v2/add-trip-v2-validation/add-trip-v2-validation.component';

@Component({
  selector: 'app-trip-details-start-complete-job-popup',
  templateUrl: './trip-details-start-complete-job-popup.component.html',
  styleUrls: ['./trip-details-start-complete-job-popup.component.scss']
})
export class TripDetailsStartCompleteJobPopupComponent implements OnInit {


  startEndForm: FormGroup;
  VehicleTripCustomField = [];
  tripId: string = '';
  isMandatory: boolean = true
  isFinishTrip: boolean = false;
  tripTaskToolTip: ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants();
  markForTouched=new Subject();
  tripSummaryData;
  vehicleId='';
  currentJobvalidations : any[] = [];
  hasStoppedValidations : boolean ;

  constructor(private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) private dialogData: any,
    private _fb: FormBuilder, private _newTripV2Service: NewTripV2Service,private _odometerService: OdometerService,private dialog : Dialog) { }


  ngOnInit(): void {    
    this.tripTaskToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    }
    this.tripId = this.dialogData.tripId;
    this.getCurentJobValidations()
    this.isFinishTrip = this.dialogData.finishTrip
    this.vehicleId = this.dialogData.vehicleId;
    this.tripSummaryData =this.dialogData.tripSummaryData
    let startDate=this.tripSummaryData['scheduled_start_date'];
    let endDate=this.tripSummaryData['scheduled_end_date'];
    if(this.tripSummaryData['start_date'])startDate=this.tripSummaryData['start_date']
    if(this.tripSummaryData['end_date'])endDate=this.tripSummaryData['end_date']

    this.startEndForm = this._fb.group({
      start_date:moment.tz(startDate, localStorage.getItem('timezone')),
      end_date:moment.tz(endDate, localStorage.getItem('timezone')),
      start_kms:[this.tripSummaryData['odometer']['start']|0],
      start_hour:[this.tripSummaryData['hour']['start']|0],
      end_kms:[this.tripSummaryData['odometer']['end']|0],
      end_hour:[this.tripSummaryData['hour']['end']|0],
      error_message_hour:'',
      error_message:'',
      finish:this.dialogData.finishTrip,
      checklist: [this.tripSummaryData.checklist],
      saving_as : ['send_for_approval'],
      approval_remark : ['']

    });
    if(this.isFinishTrip){
      this.setOdmeter('end_date','end_kms');
      this.setHour('end_date','end_hour');
    }else{
      this.setOdmeter('start_date','start_kms');
      this.setHour('start_date','start_hour');
    }
   

  }

  getCurentJobValidations(){
    this._newTripV2Service.getCurrentJobValidations(this.tripId).subscribe((res)=>{
      this.currentJobvalidations = res['result']?.validations;
      this.hasStoppedValidations = res['result']?.has_stop_validations;
    })
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
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

  tripTaskData(e) {
    this.startEndForm.get('checklist').setValue(e['value']);
  }

  dateChange(datekey,kmsKey,hourkey){
    this.setOdmeter(datekey,kmsKey);
    this.setHour(datekey,hourkey);
  }

  setOdmeter(datekey,hourkey) {
    let form = this.startEndForm;
    let vehicle = this.vehicleId;
    let selectedDate = changeDateToServerFormat(form.get(datekey).value);
    if (vehicle && selectedDate) {
      this._odometerService.getOdometerReading(vehicle, selectedDate).subscribe(data => {
        form.get(hourkey).setValue(data['result']);
        form.get('error_message').setValue('');
      });
    }

  }

  setHour(datekey,hourkey) {
    let form = this.startEndForm;
    let vehicle = this.vehicleId;
    let selectedDate = changeDateToServerFormat(form.get(datekey).value);
    if (vehicle && selectedDate) {
      this._odometerService.getHourReading(vehicle, selectedDate).subscribe(data => {
        form.get(hourkey).setValue(data['result']);
        form.get('error_message_hour').setValue('');
      });
    }
  }

  onHourChange(datekey,hourkey) {
    let form = this.startEndForm;
    let vehicle = this.vehicleId;
    let selectedDate = changeDateToServerFormat(form.get(datekey).value);
    let hour = form.value[hourkey];
    if (vehicle && selectedDate) {
      this._odometerService.checkHourReading(vehicle, selectedDate, hour, '').subscribe(data => {
        form.get('error_message_hour').setValue('');
      }, (error) => {
        form.get('error_message_hour').setValue('Value entered Is less that the Run Time Reading ' + error.error['result']['hour'] + ' Hours found as on  ' + error.error['result']['date'])
      })
    }
  }

  onKmsChange(datekey,hourkey) {
    let form = this.startEndForm;
    let vehicleid = this.vehicleId;
    let selectedDate = changeDateToServerFormat(form.get(datekey).value);
    let kms = form.value[hourkey];
    if (vehicleid && selectedDate) {
      this._odometerService.checkOdometerReading(vehicleid, selectedDate, kms, '').subscribe(data => {
        form.get('error_message').setValue('');
      }, (error) => {
        form.get('error_message').setValue('Value entered Is less that the Odometer Reading ' + error.error['result']['kms'] + ' Kms found as on  ' + error.error['result']['date'])
      })
    }
  }

  openValidationPopup(){
    let heading = '';
    let is_submit : boolean;
    if(this.currentJobvalidations.length>0){
      if (this.hasStoppedValidations) {
        is_submit = false;
        heading = 'Validation Failed';
      } else {
        is_submit = true;
        heading = 'Send For Approval';
      }
      const dialogRef = this.dialog.open(AddTripV2ValidationComponent, {
        
        data : {
          data : this.currentJobvalidations,
          heading :heading,
          is_Submit : is_submit
        },
        width: '500px',
        maxWidth: '90%',
        closeOnNavigation: true,
        disableClose: true,
        autoFocus: false
      });
      let dialogRefSub = dialogRef.closed.subscribe((item: any) => {      
        if(isValidValue(item) && item.is_approved){
          this.startEndForm.get('approval_remark').setValue(item.remarkValue);
          this.save();
        }
        dialogRefSub.unsubscribe();
      });
    } else{
      this.startEndForm.get('saving_as').setValue('save_and_submit');
      this.save();
    }
  }

  save() {
    let form = this.startEndForm;
    form['value']['start_date'] = changeDateTimeToServerFormat(form['value']['start_date'])
    form['value']['end_date'] = changeDateTimeToServerFormat(form['value']['end_date']);
    form['value']['checklist'] = this.prepareCheckListData(form['value']['checklist'])
    if(this.isFinishTrip){
      setUnsetValidators(form,'end_hour',[Validators.min(Number(form['value']['start_hour']))])
      setUnsetValidators(form,'end_kms',[Validators.min(Number(form['value']['start_kms']))])
      if(form.valid){
        form['value']['start_date'] = changeDateTimeToServerFormat(form['value']['start_date'])
        form['value']['end_date'] = changeDateTimeToServerFormat(form['value']['end_date'])
        this.markForTouched.next(this.checkCheckListValid(form['value']['checklist']))
        if(this.checkCheckListValid(form['value']['checklist'])){
          this.apiCall(form.value);          
        }
      }else{
        this.setAsTouched(form)
      }
    }else{
      if(form.valid){
        this.apiCall(form.value)
      }else{
        this.setAsTouched(form)
      }
    }
  }

  apiCall(payload){
    this._newTripV2Service.changeTripStatus(this.tripId, payload).subscribe((res) => {
      this.dialogRef.close(true);
    })
  }

  close() {
    this.dialogRef.close(false);
  }

  checkCheckListValid(checklist=[]) {
    let checkListValid = true
    checklist.forEach(checkListItem => {
      if (checkListItem['mandatory'] == 'true' || checkListItem['mandatory'] == true) {
        if (checkListItem['field_type'] == 'upload') {
          if (checkListItem['value'].length == 0) {
            checkListValid=false;
          }
        } else {
          if (!checkListItem['value']) {
             checkListValid=false;
          }
        }
      }
    });
    return checkListValid
  }

  prepareCheckListData(checklist: Array<any>) {
    if (checklist.length) {
      checklist.forEach(checlistItem => {
        if (checlistItem['field_type'] == 'upload') {
          checlistItem['value'] = checlistItem['value'].map(value => value.id)
        }
        if(checlistItem['field_type'] == 'date'){
          checlistItem['value'] = changeDateToServerFormat(checlistItem['value'])
        }
      });
    }
    return checklist
  }




}

