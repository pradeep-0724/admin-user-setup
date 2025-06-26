import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { changeDateTimeToServerFormat, changeDateToServerFormat, getTimeDifference } from 'src/app/shared-module/utilities/date-utilis';
import moment from 'moment';
import { OdometerService } from 'src/app/core/services/odometer.service';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { AddTripV2ValidationComponent } from '../../add-trip-v2/add-trip-v2-validation/add-trip-v2-validation.component';
import { CommonService } from 'src/app/core/services/common.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
type destinationReachDataType = {
  tripId: string,
  tripDetails: {}
  driverList:[]
}
@Component({
  selector: 'app-change-destination-status',
  templateUrl: './change-destination-status.component.html',
  styleUrls: ['./change-destination-status.component.scss']
})
export class ChangeDestinationStatusComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: destinationReachDataType, private formBuilder: FormBuilder, private _tripService: NewTripV2Service, private _odometerService: OdometerService,private _tokenExpireService:TokenExpireService,
  private dialog : Dialog,private _commonService: CommonService) { }

  changeDestinationStatusForm: FormGroup;
  destinationData;
  isTransporter: boolean = false
  tripId = '';
  office_status = 0;
  tripTaskToolTip: ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants();
  previousDestinationData;
  driverList=[]
  dirivenBy=getBlankOption();
  currentJobvalidations : any[] = [];
  hasStoppedValidations : boolean ;
  terminalList = []
  initialValues = {
    terminal: getBlankOption(),
  };
  pointOfTypeParam: any = {};
  optionsDropdownUrl = TSAPIRoutes.static_options;

  ngOnInit(): void {        
    this.tripTaskToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    }
    this.tripId = this.data.tripId
    this.office_status = this.data.tripDetails['office_status'];
    this.isTransporter = this.data.tripDetails['is_transporter'];
    this.destinationData = this.data.tripDetails['paths'][this.office_status];
    this.driverList= this.data.driverList;
    this.getTerminal();
    this.buildForm();
    if (this.office_status == 0 && !this.isTransporter && this.data.tripDetails['odometer'].start == 0) {
      setTimeout(() => {
        this.setOdmeter();
        this.setHour();
      }, 100);
      this.changeDestinationStatusForm.get('time').valueChanges.subscribe(value => {
        this.setOdmeter();
        this.setHour();
      });
    }

    this._tokenExpireService.observeTokenExpire.subscribe(isExpired=>{
      if(isExpired){
        this.dialogRef.close(false)
      }
    })
    this.getCurentJobValidations();
  }

  buildForm() {
    this.changeDestinationStatusForm = this.formBuilder.group({
      time: [moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')],
      halt_time: this.formBuilder.group({
        day: [this.destinationData.halt_actual_time.day || ''],
        hour: [this.destinationData.halt_actual_time.hour || '', [Validators.max(23)]],
        minute: [this.destinationData.halt_actual_time.minute || '', [Validators.max(59)]],
      }),
      actual_kms: [this.destinationData.actual_kms],
      time_taken: this.formBuilder.group({
        day: [''],
        hour: ['', [Validators.max(23)]],
        minute: ['', [Validators.max(59)]],
      }),
      driven_by_id:this.destinationData.driven_by?this.destinationData.driven_by.id:null,
      can_edit_driven_by:this.destinationData.can_edit_driven_by,
      error_message: '',
      error_message_hour: '',
      checklist: [this.destinationData.checklist],
      start_kms: [this.data.tripDetails['odometer'].start || 0,[Validators.maxLength(7)]],
      start_hour: [0],
      approval_remark : [''],
      saving_as : [''],
      terminal : [this.destinationData?.terminal?.id || null ]
    });
    this.destinationData.driven_by?this.dirivenBy={label:this.destinationData.driven_by['name'],value:this.destinationData.driven_by['id']}:this.dirivenBy=getBlankOption();
    this.initialValues.terminal = {label :  this.destinationData?.terminal?.label , value : this.destinationData?.terminal?.id}
    if (this.destinationData.actual_time) {
      this.changeDestinationStatusForm.get('time').setValue(moment.tz(this.destinationData.actual_time, localStorage.getItem('timezone')))
    }
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  cancel() {
    this.dialogRef.close(false)
  }
  getCurentJobValidations(){
    this._tripService.getCurrentJobValidations(this.tripId).subscribe((res)=>{
      this.currentJobvalidations = res['result']?.validations;
      this.hasStoppedValidations = res['result']?.has_stop_validations;
    })
  }

  openValidationPopup(){
    let heading = '';
    let is_submit : boolean;
    if(this.data.tripDetails['vehicle_category'] !=10 && this.currentJobvalidations.length>0){
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
          this.changeDestinationStatusForm.get('approval_remark').setValue(item.remarkValue);
          this.changeDestinationStatusForm.get('saving_as').setValue('send_for_approval');
          this.save();
        }
        dialogRefSub.unsubscribe();
      });
    } else{
      this.changeDestinationStatusForm.get('saving_as').setValue('save_and_submit');
      this.save();
    }
  }

  save() {
    let form = this.changeDestinationStatusForm;
    form.value['time'] = changeDateTimeToServerFormat(form.value['time']);
    form.value['checklist'] = this.prepareCheckListData(form.value['checklist']);
    let payload = {
      "finish": false,
      "paths": form.value,
      saving_as : form.value['saving_as'],
      approval_remark : form.value['approval_remark']
    }
    if (form.valid) {
      this._tripService.changeTripStatus(this.tripId, payload).subscribe(resp => {
        this.dialogRef.close(true)
      })

    } else {
      setAsTouched(form);
    }

  }

  prepareCheckListData(checklist: Array<any>) {
    if (checklist.length) {
      checklist.forEach(checlistItem => {
        if (checlistItem['field_type'] == 'upload') {
          checlistItem['value'] = checlistItem['value'].map(value => value.id)
        }
        if (checlistItem['field_type'] == 'date') {
          checlistItem['value'] = changeDateToServerFormat(checlistItem['value'])
        }
      });
    }
    return checklist
  }

  tripTaskData(e) {
    this.changeDestinationStatusForm.get('checklist').setValue(e['value']);
  }

  setOdmeter() {
    let form = this.changeDestinationStatusForm;
    let vehicle = this.data.tripDetails['vehicle'];
    let selectedDate = changeDateToServerFormat(this.changeDestinationStatusForm.get('time').value);
    if (vehicle && selectedDate) {
      this._odometerService.getOdometerReading(vehicle, selectedDate).subscribe(data => {
        form.get('start_kms').setValue(data['result']);
        form.get('error_message').setValue('');
      });
    }

  }

  setHour() {
    let form = this.changeDestinationStatusForm;
    let vehicle = this.data.tripDetails['vehicle'];
    let selectedDate = changeDateToServerFormat(this.changeDestinationStatusForm.get('time').value);
    if (vehicle && selectedDate) {
      this._odometerService.getHourReading(vehicle, selectedDate).subscribe(data => {
        form.get('start_hour').setValue(data['result']);
        form.get('error_message_hour').setValue('');
      });
    }
  }

  onHourChange() {
    let form = this.changeDestinationStatusForm;
    let vehicle = this.data.tripDetails['vehicle'];
    let selectedDate = changeDateToServerFormat(this.changeDestinationStatusForm.get('time').value);
    let hour = form.value['start_hour'];
    if (vehicle && selectedDate) {
      this._odometerService.checkHourReading(vehicle, selectedDate, hour, '').subscribe(data => {
        form.get('error_message_hour').setValue('');
      }, (error) => {
        form.get('error_message_hour').setValue('Value entered Is less that the Run Time Reading ' + error.error['result']['hour'] + ' found as on  ' + error.error['result']['date'])
      })
    }
  }

  onKmsChange() {
    let form = this.changeDestinationStatusForm;
    let vehicleid = this.data.tripDetails['vehicle'];
    let selectedDate = changeDateToServerFormat(this.changeDestinationStatusForm.get('time').value);
    let kms = form.value['start_kms'];
    if (vehicleid && selectedDate) {
      this._odometerService.checkOdometerReading(vehicleid, selectedDate, kms, '').subscribe(data => {
        form.get('error_message').setValue('');
      }, (error) => {
        form.get('error_message').setValue('Value entered Is less that the Odometer Reading ' + error.error['result']['kms'] + ' found as on  ' + error.error['result']['date'])
      })
    }
  }

  calculateTimeTaken() {
    if (this.office_status != 0 && !this.isTransporter) {
    let form = this.changeDestinationStatusForm;
    this.previousDestinationData = this.data.tripDetails['paths'][this.office_status - 1];
    let timeDiff = getTimeDifference(this.previousDestinationData.actual_time, form.get('time').value)
    let halt_time = form.get('halt_time') as FormGroup
    let time_taken = form.get('time_taken') as FormGroup
    let day = halt_time.get('day').value;
    let hour = halt_time.get('hour').value;
    let minute = halt_time.get('minute').value;
    time_taken.get('minute').setValue(timeDiff.minutes + Number(minute))
    time_taken.get('day').setValue(timeDiff.days + Number(day))
    time_taken.get('hour').setValue(timeDiff.hours + Number(hour))
    this.calculateHour(form,timeDiff);
    this.calculateMin(form,timeDiff);
    if(timeDiff.days==null&&timeDiff.hours==null&&timeDiff.minutes==null){
      time_taken.get('minute').setValue(timeDiff.minutes)
      time_taken.get('day').setValue(timeDiff.days)
      time_taken.get('hour').setValue(timeDiff.hours)
    }
  }
  }

  calculateHour(form:FormGroup,timeDiff){
    let halt_time = form.get('halt_time') as FormGroup
    let day = halt_time.get('day').value;
    let hour = halt_time.get('hour').value;
    let time_taken = form.get('time_taken') as FormGroup
    let totalHours=(timeDiff.hours + Number(hour))
    if(totalHours>=24){
      let newdays=Math.floor((totalHours)/24);
      time_taken.get('day').setValue(timeDiff.days + Number(day)+newdays)
      time_taken.get('hour').setValue(timeDiff.hours + Number(hour)-(newdays*24))
    }
  }

  calculateMin(form:FormGroup,timeDiff){
    let halt_time = form.get('halt_time') as FormGroup
    let time_taken = form.get('time_taken') as FormGroup
    let hour = halt_time.get('hour').value;
    let minute = halt_time.get('minute').value;
    let totalMin=(timeDiff.minutes + Number(minute))
    if(totalMin>=60){
      let newHour=Math.floor(totalMin/60);
      time_taken.get('hour').setValue(timeDiff.hours + Number(hour)+newHour)
      time_taken.get('minute').setValue(timeDiff.minutes + Number(minute)-(newHour*60))
    }
    this.calculateHour(form,timeDiff)
  }

  dateTimeSelectedChange(e){
    this.calculateTimeTaken();
  }

  getTerminal() {
    this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
      this.terminalList = response['result']['path-terminal']
    });
  }

onChangeTerminal(form: FormGroup, i) {
    const terminal = this.terminalList.find(terminalboj => terminalboj.id == this.changeDestinationStatusForm.value['terminal'])
    if (terminal) {
      this.initialValues.terminal[i] = { label: terminal.label, value: '' }
    }
  }

getNewTerminal(event, currentIndex) {
    if (event) {
      this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
        this.terminalList = response['result']['path-terminal']
        this.changeDestinationStatusForm.get('terminal').setValue(event.id)
        this.initialValues.terminal[currentIndex] = { label: event.label, value: event.id }
      });
    }
  }

addNewTerminal(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.pointOfTypeParam = {
        key: 'path-terminal',
        label: word_joined,
        value: 0
      };
    }
  }
}

