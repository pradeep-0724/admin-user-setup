import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OdometerService } from 'src/app/core/services/odometer.service';
import { MaintenanceService } from '../../operations-maintenance.service';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-start-job-card',
  templateUrl: './start-job-card.component.html',
  styleUrls: ['./start-job-card.component.scss']
})
export class StartJobCardComponent implements OnInit {
  startJobCard :UntypedFormGroup;
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  todaysDate=new Date(dateWithTimeZone());
  apiError=''
  @Input()jobCardStart={
    data:{},
    open:false
  };
  vehicleId=''
  @Output() dataFromJobCardStart=new EventEmitter(false)
  constructor(private _fb: UntypedFormBuilder,private _analytics:AnalyticsService,private _maintenanceService:MaintenanceService,private _odometerService:OdometerService,) { }

  ngOnInit(): void {
    this.buildForm();
    this.vehicleId=this.jobCardStart.data['vehicle'].id;
    this.setOdmeter();
    this.setHour();
    }


  buildForm(){
    this.startJobCard = this._fb.group({
      actual_start_date:[this.todaysDate,Validators.required],
      kms:[null],
      error_message:'',
      error_message_hour:'',
      hour_min:this._fb.group({
        hour:[0],
        min:[0]
      })
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  setOdmeter() {
    let form = this.startJobCard;
    let vehicle =this.vehicleId;
    let selectedDate=changeDateToServerFormat(form.get('actual_start_date').value);
    if(vehicle&&selectedDate){
      this._odometerService.getOdometerReading(vehicle, selectedDate).subscribe(data => {
          form.get('kms').setValue(data['result']);
          form.get('error_message').setValue('');
      });
    }

  }

  setHour() {
    let form = this.startJobCard;
    let vehicle =this.vehicleId;
    let selectedDate=changeDateToServerFormat(form.get('actual_start_date').value);
    if(vehicle&&selectedDate){
      this._odometerService.getHourReading(vehicle, selectedDate).subscribe(data => {
        form.get('hour_min').get('hour').setValue(data['result']);
        form.get('error_message_hour').setValue('');
      });
    }
  }


  onHourChange(){
    let form = this.startJobCard;
    let vehicle =this.vehicleId;
    let selectedDate=changeDateToServerFormat(form.get('actual_start_date').value);
    let hour = form.value['hour_min']['hour'];
    if (vehicle && selectedDate) {
      this._odometerService.checkHourReading(vehicle, selectedDate, hour,'').subscribe(data => {
        form.get('error_message_hour').setValue('');
      }, (error) => {
        form.get('error_message_hour').setValue('Value entered Is less that the Run Time Reading ' + error.error['result']['hour'] + ' found as on  ' + error.error['result']['date'])
      })
    }
  }

  

  onKmsChange() {
    let form = this.startJobCard;
    let vehicle =this.vehicleId;
    let selectedDate=changeDateToServerFormat(form.get('actual_start_date').value);
    let kms = form.value['kms'];
    if (vehicle && selectedDate) {
      this._odometerService.checkOdometerReading(vehicle, selectedDate, kms,'').subscribe(data => {
        form.get('error_message').setValue('');
      }, (error) => {
        form.get('error_message').setValue('Value entered Is less that the Odometer Reading ' + error.error['result']['kms'] + ' found as on  ' + error.error['result']['date'])
      })
    }
  }

  cancel(){
   this.dataFromJobCardStart.emit(false)
   this.jobCardStart.open=false
  }

  save(){
    let form = this.startJobCard;
    if(this.startJobCard.valid){
     form.value['actual_start_date'] = changeDateToServerFormat(form.value['actual_start_date']);
     this._maintenanceService.postJobCardStart(this.jobCardStart.data['id'],form.value).subscribe(resp=>{
       this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.JOBCARD);
       this.dataFromJobCardStart.emit(true);
       this.jobCardStart.open=false
     });
    }else{
     setAsTouched(this.startJobCard);
    }
  }

}
