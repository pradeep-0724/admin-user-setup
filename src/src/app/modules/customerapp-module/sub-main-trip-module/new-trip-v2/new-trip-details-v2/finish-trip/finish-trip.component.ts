import { DIALOG_DATA, Dialog, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateTimeToServerFormat, changeDateToServerFormat, getTimeDifference } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import moment from 'moment';
import { Subject } from 'rxjs';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { OdometerService } from 'src/app/core/services/odometer.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { TokenExpireService } from 'src/app/core/services/token-expire.service';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { AddTripV2ValidationComponent } from '../../add-trip-v2/add-trip-v2-validation/add-trip-v2-validation.component';
import { CommonService } from 'src/app/core/services/common.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
type destinationReachDataType = {
  tripId: string,
  tripDetails: {},
  driverList:[]
}
@Component({
  selector: 'app-finish-trip',
  templateUrl: './finish-trip.component.html',
  styleUrls: ['./finish-trip.component.scss']
})
export class FinishTripComponent implements OnInit {

  constructor(private dialogRef: DialogRef<boolean>, @Inject(DIALOG_DATA) private data: destinationReachDataType, private formBuilder: FormBuilder, private _tripService: NewTripV2Service,private _odometerService:OdometerService, private _tokenExpireService:TokenExpireService,
    private dialog : Dialog,private _commonService: CommonService) { }
  finishTripForm: FormGroup;
  currentTab: Number = 0;
  paths = [];
  errorTabs = [];
  tripId = '';
  isCheckListValid: boolean = true;
  markForTouched: Subject<boolean> = new Subject();
  tripTaskToolTip: ToolTipInfo; 
  constantsTripV2 = new NewTripV2Constants();
  isTransporter:boolean=false;
  driverList=[]
  dirivenBy=[];
  currentJobvalidations : any[] = [];
  hasStoppedValidations : boolean ;
  initialValues = {
    terminal: [],
  };
  terminalList = []
  pointOfTypeParam: any = {};
  optionsDropdownUrl = TSAPIRoutes.static_options;

  ngOnInit(): void {        
    this.buildForm();
    this.getTerminal();
    this.tripId = this.data.tripId
    this.paths = this.data.tripDetails['paths'];
    this.isTransporter = this.data.tripDetails['is_transporter'];
    this.driverList= this.data.driverList;
    this.addDestinationForm(this.paths);
    this.calculateTimeTaken();
    this.tripTaskToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    }

    if(!this.isTransporter){
      if(this.data.tripDetails['odometer'].start==0){
        setTimeout(() => {
          this.setOdmeter(); 
        }, 100);
      }
      if(!this.data.tripDetails['hour'].start){
        setTimeout(() => {
          this.setHour();
        }, 100);
      }
      if(this.data.tripDetails['odometer'].end==0){
        setTimeout(() => {
          this.setEndKms();
        }, 100);
      }

      if(!this.data.tripDetails['hour'].end){
        setTimeout(() => {
          this.setEndHour();
        }, 100);
      }

  
      let startForm = (this.finishTripForm.controls['paths'] as UntypedFormArray).at(0) as FormGroup;
       startForm.get('time').valueChanges.subscribe(value=>{
        this.setOdmeter();
        this.setHour();
      });
      let endForm = (this.finishTripForm.controls['paths'] as UntypedFormArray).at(this.paths.length-1) as FormGroup;
         endForm.get('time').valueChanges.subscribe(value=>{
        this.setEndKms();
        this.setEndHour();
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
    this.finishTripForm = this.formBuilder.group({
      start_kms: [this.data.tripDetails['odometer'].start||0,[Validators.maxLength(7)]],
      end_kms: [this.data.tripDetails['odometer'].end||0,[Validators.maxLength(7)]],
      error_message:'',
      error_message_hour:'',
      start_hour:[this.data.tripDetails['hour'].start||0],
      end_hour:[this.data.tripDetails['hour'].end||0],
      paths: this.formBuilder.array([]),
      approval_remark : [''],
      saving_as : [''],
    })

  }

  addDestinationForm(items: Array<any>) {    
    this.dirivenBy=[]
    let addDestinationForm = this.finishTripForm.controls['paths'] as UntypedFormArray;
    addDestinationForm.controls = [];
    this.initialValues.terminal = [];
    this.errorTabs = [];
    items.forEach((element,index) => {
      if(element.driven_by){
        this.dirivenBy.push({label:element.driven_by['name'],value:element.driven_by.id});
      }else{
        this.dirivenBy.push(getBlankOption());
      }
      this.initialValues.terminal.push(getBlankOption());
      this.initialValues.terminal[index] = {label : element?.terminal?.label ,value : element?.terminal?.id}
      const destination = this.getdestinationForm(element);
      addDestinationForm.push(destination);
      this.errorTabs.push(false)
    })
    this.currentTab = addDestinationForm.length - 1;
  }

  getdestinationForm(item) {    
    let drivenby=null
    let momentDate= moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')
    if(item.actual_time){
      momentDate = moment.tz(item.actual_time, localStorage.getItem('timezone'))
    }
    if(item.driven_by){
      drivenby=item.driven_by.id
    }
    return this.formBuilder.group({
      time: [momentDate],
      actual_kms: [item.actual_kms],
      halt_time: this.formBuilder.group({
        day: [item.halt_actual_time.day||''],
        hour: [item.halt_actual_time.hour||'', [Validators.max(23)]],
        minute: [item.halt_actual_time.minute||'', [Validators.max(59)]]
      }),
      checklist: [item.checklist],
      isCheckListValid: true,
      driven_by_id:drivenby,
      can_edit_driven_by:[item.can_edit_driven_by],
      time_taken: this.formBuilder.group({
        day: [item.time_taken.day||''],
        hour: [item.time_taken.hour||'', [Validators.max(23)]],
        minute: [item.time_taken.minute||'', [Validators.max(59)]]
      }),
      terminal : [item?.terminal?.id ? item?.terminal?.id : null]

    })
  }

  onTabChange(event: number) {
    this.currentTab = event;
    setTimeout(() => {
      if (!this.isCheckListValid) this.markForTouched.next(this.isCheckListValid)
    }, 100);
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

  getCurentJobValidations(){
    this._tripService.getCurrentJobValidations(this.tripId).subscribe((res)=>{
      this.currentJobvalidations = res['result']?.validations;
      this.hasStoppedValidations = res['result']?.has_stop_validations;
    })
  }

  cancel() {
    this.dialogRef.close(false)
  }

  openValidationPopup(){
    let heading = '';
    let is_submit : boolean;
    if(this.data.tripDetails['vehicle_category'] !=10 &&  this.currentJobvalidations.length>0){
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
          this.finishTripForm.get('saving_as').setValue('send_for_approval');
          this.finishTripForm.get('approval_remark').setValue(item.remarkValue);
          this.save();
        }
        dialogRefSub.unsubscribe();
      });
    } else{
      this.finishTripForm.get('saving_as').setValue('save_and_submit');
      this.save();
    }
  }

  save() {
    if(!this.isTransporter){
      if(Number(this.finishTripForm.get('start_kms').value)!=0){
        setUnsetValidators(this.finishTripForm,'end_kms',[Validators.min(Number(this.finishTripForm.get('start_kms').value))])
      }
      if(Number(this.finishTripForm.get('start_hour').value)!=0){
        setUnsetValidators(this.finishTripForm,'end_hour',[Validators.min(Number(this.finishTripForm.get('start_hour').value))])
      }
    }
    let form = this.finishTripForm;
    if (this.checkCheckListValid() && form.valid ) {
      let form = this.finishTripForm;
      form.value['paths'].forEach(item => {
        item['time'] = changeDateTimeToServerFormat(item['time'])
        item['checklist'] = this.prepareCheckListData(item['checklist'])
      });
      let payload = {
        "finish": true,
        "start_kms": form.value['start_kms'],
        "end_kms": form.value['end_kms'],
        "start_hour": form.value['start_hour'],
        "end_hour": form.value['end_hour'],
        paths: form.value['paths'],
        saving_as : form.value['saving_as'],
        approval_remark : form.value['approval_remark']
      }
      this._tripService.changeTripStatus(this.tripId, payload).subscribe(resp => {
        this.dialogRef.close(true)
      });
    } else {
      this.setAsTouched(form);
      this.isCheckListValid = false;
      this.markForTouched.next(this.isCheckListValid)
    }

  }

  tripTaskData(event, destination: FormGroup) {
    destination.get('isCheckListValid').setValue(event['isValid'])
    destination.get('checklist').setValue(event['value'])
  }

  checkCheckListValid() {
    let checkListValid = true
    let destinationForm = this.finishTripForm.controls['paths'] as UntypedFormArray;
    destinationForm.controls.forEach((destinatin, index) => {
      let checkList = destinatin.get('checklist').value;
      if (checkList.length) {
        checkList.forEach(checkListItem => {
          if (checkListItem['mandatory'] == 'true' || checkListItem['mandatory'] == true) {
            if (checkListItem['field_type'] == 'upload') {
              if (checkListItem['value'].length == 0) {
                destinatin.get('isCheckListValid').setValue(false)
              }
            } else {
              if (!checkListItem['value']) {
                destinatin.get('isCheckListValid').setValue(false)
              }
            }
          }
        });
      }
      this.errorTabs[index] = !destinatin.get('isCheckListValid').value;
      if (!destinatin.get('isCheckListValid').value) checkListValid = false
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


  setOdmeter() {
    let form = this.finishTripForm;
    let vehicle =this.data.tripDetails['vehicle'];
    let pathForm = (form.controls['paths'] as UntypedFormArray).at(0) as FormGroup;
    let selectedDate=changeDateToServerFormat(pathForm.get('time').value);
    if(vehicle&&selectedDate){
      this._odometerService.getOdometerReading(vehicle, selectedDate).subscribe(data => {
          form.get('start_kms').setValue(data['result']);
          form.get('error_message').setValue('');
          setUnsetValidators(this.finishTripForm,'end_kms',[Validators.min(Number(data['result']))])
      });
    }

  }

  setEndKms(){
    let form = this.finishTripForm;
    let vehicle =this.data.tripDetails['vehicle'];
    let pathForm = (form.controls['paths'] as UntypedFormArray).at(this.paths.length-1) as FormGroup;
    let selectedDate=changeDateToServerFormat(pathForm.get('time').value);
    if(vehicle&&selectedDate){
      this._odometerService.getOdometerReading(vehicle, selectedDate).subscribe(data => {
          form.get('end_kms').setValue(data['result']);
      });
    }
  }

  setHour() {
    let form = this.finishTripForm;
    let vehicle =this.data.tripDetails['vehicle'];
    let pathForm = (form.controls['paths'] as UntypedFormArray).at(0) as FormGroup;
    let selectedDate=changeDateToServerFormat(pathForm.get('time').value);
    if(vehicle&&selectedDate){
      this._odometerService.getHourReading(vehicle, selectedDate).subscribe(data => {
        form.get('start_hour').setValue(data['result']);
        form.get('error_message_hour').setValue('');
      });
    }
  } 

  setEndHour() {
    let form = this.finishTripForm;
    let vehicle =this.data.tripDetails['vehicle'];
    let pathForm = (form.controls['paths'] as UntypedFormArray).at(this.paths.length-1) as FormGroup;
    let selectedDate=changeDateToServerFormat(pathForm.get('time').value);
    if(vehicle&&selectedDate){
      this._odometerService.getHourReading(vehicle, selectedDate).subscribe(data => {
        form.get('end_hour').setValue(data['result']);
        form.get('error_message_hour').setValue('');
      });
    }
  } 

  onHourChange(){
    let form = this.finishTripForm;
    let vehicle =this.data.tripDetails['vehicle'];
    let pathForm = (form.controls['paths'] as UntypedFormArray).at(0) as FormGroup;
    let selectedDate=changeDateToServerFormat(pathForm.get('time').value);
    let hour = form.value['start_hour'];
    if (vehicle && selectedDate) {
      this._odometerService.checkHourReading(vehicle, selectedDate, hour,'').subscribe(data => {
        form.get('error_message_hour').setValue('');
      }, (error) => {
        form.get('error_message_hour').setValue('Value entered Is less that the Run Time Reading ' + error.error['result']['hour'] + ' found as on  ' + error.error['result']['date'])
      })
    }
  }

  onKmsChange() {
    let form = this.finishTripForm;
    let vehicleid =this.data.tripDetails['vehicle'];
    let pathForm = (form.controls['paths'] as UntypedFormArray).at(0) as FormGroup;
    let selectedDate=changeDateToServerFormat(pathForm.get('time').value);
    let kms = form.value['start_kms'];
    setUnsetValidators(this.finishTripForm,'end_kms',[Validators.min(Number(kms))])
    if (vehicleid && selectedDate) {
      this._odometerService.checkOdometerReading(vehicleid, selectedDate, kms,'').subscribe(data => {
        form.get('error_message').setValue('');
      }, (error) => {
        form.get('error_message').setValue('Value entered Is less that the Odometer Reading ' + error.error['result']['kms'] + ' found as on  ' + error.error['result']['date'])
      })
    }
  }

  calculateTimeTaken() {
    let destinationForm = this.finishTripForm.controls['paths'] as UntypedFormArray;
    destinationForm.controls.forEach((destinatin:FormGroup, index) => {
      if(index!=0){
        let form = destinatin;
        let previousDestinationData = (destinationForm.controls[index-1] as FormGroup)
        let timeDiff = getTimeDifference(previousDestinationData.value.time, form.get('time').value)
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
    })
   
  }

  calculateHour(form:FormGroup,timeDiff){
    let halt_time = form.get('halt_time') as FormGroup
    let day = halt_time.get('day').value;
    let hour = halt_time.get('hour').value;
    let time_taken = form.get('time_taken') as FormGroup
    let totalHour=timeDiff.hours + Number(hour)
    if((totalHour)>=24){
      let newdays=Math.floor(totalHour/24);
      time_taken.get('day').setValue(timeDiff.days + Number(day)+newdays)
      time_taken.get('hour').setValue(totalHour-(newdays*24))
    }
  }

  calculateMin(form:FormGroup,timeDiff){
    let halt_time = form.get('halt_time') as FormGroup
    let time_taken = form.get('time_taken') as FormGroup
    let hour = halt_time.get('hour').value;
    let minute = halt_time.get('minute').value;
    let totalMin=timeDiff.minutes + Number(minute)
    if((totalMin)>=60){
      let newHour=Math.floor(totalMin/60);
      time_taken.get('hour').setValue(timeDiff.hours + Number(hour)+newHour)
      time_taken.get('minute').setValue(totalMin-(newHour*60))
    }
    this.calculateHour(form,timeDiff)
  }

  dateTimeSelectedChange(e){
    setTimeout(() => {
      this.calculateTimeTaken();
    }, 100);
  }

  getTerminal() {
    this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
      this.terminalList = response['result']['path-terminal']
    });
  }

onChangeTerminal(form: FormGroup, i) {
    const terminal = this.terminalList.find(terminalboj => terminalboj.id == form.value['terminal'])
    if (terminal) {
      this.initialValues.terminal[i] = { label: terminal.label, value: '' }
    }
  }

getNewTerminal(event, currentIndex) {
    if (event) {
      this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
        this.terminalList = response['result']['path-terminal']
        let form = (this.finishTripForm.controls['paths'] as UntypedFormArray).at(currentIndex) as FormGroup;
        form.get('terminal').setValue(event.id);
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
