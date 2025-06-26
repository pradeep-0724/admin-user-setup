import { Component, OnInit ,Input} from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { MaintenanceService } from '../../operations-maintenance.service';
import { OdometerService } from 'src/app/core/services/odometer.service';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-maintenance-popup',
  templateUrl: './maintenance-popup.component.html',
  styleUrls: ['./maintenance-popup.component.scss']
})
export class MaintenancePopupComponent implements OnInit {
 @Input() maintence={
    show:true
  }
  maintenanceForm :UntypedFormGroup;
  vehicleList=[];
  vehicleStatus=[
    {
      id:'1',
      label:'Available'
    },
    {
      id:'2',
      label:'Maintenance'
    }
  ];
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/0GqDWfSAmqvkuk7H92Bs?embed%22"
  }
  todaysDate=new Date(dateWithTimeZone());
  patterns= new ValidationConstants();
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  constructor( private _fb: UntypedFormBuilder,private _analytics:AnalyticsService,private _maintenanceService:MaintenanceService,private _route:Router,private _odometerService:OdometerService) { }

  ngOnInit(): void {
    this.buildForm();
    this._maintenanceService.getVehicleList().subscribe(resp=>{
      this.vehicleList = resp['result'];
    });
    this._maintenanceService.getPrefixJobCard().subscribe(resp=>{
      this.maintenanceForm.controls['job_card_no'].setValue(resp.result['job_card']);
    })
  }

  onClickCancel(){
    this.maintence.show = false;
  }

  buildForm(){
    this.maintenanceForm = this._fb.group({
      vehicle:['',Validators.required],
      job_card_no:['',[Validators.pattern(this.patterns.VALIDATION_PATTERN.ALPHA_NUMERIC2),Validators.required]],
      start_date:[this.todaysDate,Validators.required],
      job_card_status:['1',Validators.required],
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

  saveMaintenance(){
    let form = this.maintenanceForm;
     if(this.maintenanceForm.valid){
      form.value['start_date'] = changeDateToServerFormat(form.value['start_date']);
      this._maintenanceService.postJobCard(form.value).subscribe(resp=>{
        this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.JOBCARD);
        this.maintence.show = false
        this._route.navigateByUrl(getPrefix()+'/expense/maintenance/'+resp.result)
      });
     }else{
      setAsTouched(this.maintenanceForm);
     }
  }

  setOdmeter() {
    let form = this.maintenanceForm;
    let vehicle =form.get('vehicle').value;
    let selectedDate=changeDateToServerFormat(form.get('start_date').value);
    if(vehicle&&selectedDate){
      this._odometerService.getOdometerReading(vehicle, selectedDate).subscribe(data => {
          form.get('kms').setValue(data['result']);
          form.get('error_message').setValue('');
      });
    }

  }

  setHour() {
    let form = this.maintenanceForm;
    let vehicle =form.get('vehicle').value;
    let selectedDate=changeDateToServerFormat(form.get('start_date').value);
    if(vehicle&&selectedDate){
      this._odometerService.getHourReading(vehicle, selectedDate).subscribe(data => {
        form.get('hour_min').get('hour').setValue(data['result']);
        form.get('error_message_hour').setValue('');
      });
    }
  }

  onHourChange(){
    let form = this.maintenanceForm;
    let vehicle =form.get('vehicle').value;
    let selectedDate=changeDateToServerFormat(form.get('start_date').value);
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
    let form = this.maintenanceForm;
    let vehicle =form.get('vehicle').value;
    let selectedDate=changeDateToServerFormat(form.get('start_date').value);
    let kms = form.value['kms'];
    if (vehicle && selectedDate) {
      this._odometerService.checkOdometerReading(vehicle, selectedDate, kms,'').subscribe(data => {
        form.get('error_message').setValue('');
      }, (error) => {
        form.get('error_message').setValue('Value entered Is less that the Odometer Reading ' + error.error['result']['kms'] + ' found as on  ' + error.error['result']['date'])
      })
    }
  }

  openGothrough(){
    this.goThroughDetais.show=true;
  }

}
