import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { MaintenanceService } from '../../operations-maintenance.service';
import { OdometerService } from 'src/app/core/services/odometer.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidityDateJobCardCalculator, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { ActivatedRoute, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { cloneDeep } from 'lodash';
import { getEmployeeObject } from 'src/app/modules/customerapp-module/master-module/employee-module/employee-utils';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-maintenance-job-card',
  templateUrl: './maintenance-job-card.component.html',
  styleUrls: ['./maintenance-job-card.component.scss']
})
export class MaintenanceJobCardComponent implements OnInit,AfterViewChecked {
  maintenanceForm :UntypedFormGroup;
  vehicleList=[];
  dueInList=[
    {
      label:'Today',
      value:0,
    },
    {
      label:'Tomorrow',
      value:1,
    },
    {
      label:'7 days',
      value:7,
    },
    {
      label:'15 days',
      value:15,
    },
    {
      label:'Custom',
      value:-1,
    }
  ]
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/0GqDWfSAmqvkuk7H92Bs?embed%22"
  }
  todaysDate=new Date(dateWithTimeZone());
  patterns= new ValidationConstants();
  analyticsType= OperationConstants;
  analyticsScreen=ScreenConstants;
  initialValues={
    dueIn:{},
    employee:getBlankOption(),
    vehicle:getBlankOption(),
    serviceType: [],
    serviceTypeCopy : []
  }
  employeeList=[];
  preFixUrl=getPrefix();
  jobCardId='';
  jobCardDetail;
  jobcardStatus=1;

  search=''
  serviceList=[];
  serviceListCopy = [];
  addNewService=false;
  newServiceName='';
  apiError=''
  selectedTab=1;


  constructor( private _fb: UntypedFormBuilder,private _analytics:AnalyticsService,private _maintenanceService:MaintenanceService,private _odometerService:OdometerService,
     private _employeeService: EmployeeService,private _route:Router,private _activateRoute: ActivatedRoute,private _setHeight:SetHeightService,private apiHandler:ApiHandlerService
     ) { }

  ngOnInit(): void {
    this.buildForm();
    this.getEmployeeList();
    this.initialValues.dueIn['label']='Today';
    this.initialValues.dueIn['value']='1';
    this._maintenanceService.getVehicleAndAssetList().subscribe(resp=>{
      this.vehicleList = resp['result'];
    });
   
    this._activateRoute.params.subscribe((response: any) => {
      this.jobCardId = response.editId;
      if(this.jobCardId){
        this._maintenanceService.getJobCardDetail(this.jobCardId).subscribe(resp=>{
          this.jobCardDetail = resp['result'];
          this.patchJobCard();
        })
      }else{
        this._maintenanceService.getPrefixJobCard().subscribe(resp=>{
          this.maintenanceForm.controls['job_card_no'].setValue(resp.result['job_card']);
        })
      }
    });
    this.getServiceTypeList();
  }
 ngAfterViewChecked(): void {
  if(!this.jobCardId){
   this._setHeight.setTableHeight2(['.calc-height'],'service-wrap',0)
   this._setHeight.setTableHeight2(['.calc-height'],'selected-services',0)
  }

 }


  handleEmployeeChange(){
		let empId=this.maintenanceForm.get('employee_incharge').value;
		let empObj=getEmployeeObject(this.employeeList,empId);
		this.initialValues.employee={label:empObj?.display_name,value:empId}
	
	  }

  buildForm(){
    this.maintenanceForm = this._fb.group({
      vehicle:['',Validators.required],
      job_card_no:['',[Validators.pattern(this.patterns.VALIDATION_PATTERN.ALPHA_NUMERIC2),Validators.required]],
      start_date:[this.todaysDate,Validators.required],
      end_date:[this.todaysDate,Validators.required],
      actual_start_date:[null],
      actual_end_date:[null],
      employee_incharge:null,
      priority:['2'],
      due_in:[0],
      kms:[0],
      error_message:'',
      error_message_hour:'',
      hour_min:this._fb.group({
        hour:[0],
        min:[0]
      }),
      services: this._fb.array([]),
    })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  saveMaintenance(){
    let form = this.maintenanceForm;
     if(this.maintenanceForm.valid){
      form.value['start_date'] = changeDateToServerFormat(form.value['start_date']);
      form.value['end_date'] = changeDateToServerFormat(form.value['end_date']);
      form.value['actual_start_date'] = changeDateToServerFormat(form.value['actual_start_date']);
      form.value['actual_end_date'] = changeDateToServerFormat(form.value['actual_end_date']);
      form.value['services'] = form.value['services'].map(data=>data?.id)
      if(this.jobCardId){
        this.apiHandler.handleRequest(this._maintenanceService.putJobCard(this.jobCardId,form.value),'Job Card updated successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.UPDATED,this.analyticsScreen.JOBCARD);
              this._route.navigate([this.preFixUrl+'/expense/maintenance/view/',resp['result']])
              },
              error: (error) => {
              this.apiError = error['error']['message'];
              setTimeout(() => (this.apiError = ''), 3000);
              },
          }
        )
      }else{
        this.apiHandler.handleRequest(this._maintenanceService.postJobCard(form.value),'Job Card added successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.CREATED,this.analyticsScreen.JOBCARD);
          this._route.navigate([this.preFixUrl+'/expense/maintenance/view/',resp['result']])
              },
              error: (error) => {
              this.apiError = error['error']['message'];
              setTimeout(() => (this.apiError = ''), 3000);
              },
          }
        )
      }
    
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

  onVehicleOrDateChange(){
    if(this.jobcardStatus>1){
     this.setOdmeter();
     this.setHour();
    }
  }

  onDueInChange(){
    const scheduleDate=this.maintenanceForm.get('start_date').value;
    const dueIn=this.maintenanceForm.get('due_in').value;
    const end_date = ValidityDateJobCardCalculator(scheduleDate,dueIn)
    this.maintenanceForm.get('end_date').setValue(end_date);
    }

    onChangeCompletionDate(){
      this.maintenanceForm.get('due_in').setValue(-1);
      this.initialValues.dueIn=new Object({
        label:'Custom',
        value:'-1'
      })
    
    
    }

  onHourChange(){
    let form = this.maintenanceForm;
    let vehicle =form.get('vehicle').value;
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
    let form = this.maintenanceForm;
    let vehicle =form.get('vehicle').value;
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

  openGothrough(){
    this.goThroughDetais.show=true;
  }

  getEmployeeList(){
    this._employeeService.getEmployeeList().subscribe(resp=>{
      this.employeeList = resp;
    })
  }

  patchJobCard(){
    this.jobcardStatus=this.jobCardDetail.status
    this.jobCardDetail.priority=this.jobCardDetail.priority?.toString();
    if(this.jobCardDetail.employee_incharge){
     this.initialValues.employee.label =this.jobCardDetail.employee_incharge.name;
     this.jobCardDetail.employee_incharge=this.jobCardDetail.employee_incharge.id;
    }
    if(this.jobCardDetail.vehicle){
      this.initialValues.vehicle.label=this.jobCardDetail.vehicle.reg_number;
      this.jobCardDetail.vehicle=this.jobCardDetail.vehicle.id;
    }
   this.initialValues.dueIn=cloneDeep(this.dueInList.filter(duelist=>duelist.value ==this.jobCardDetail.due_in)[0])
    this.maintenanceForm.patchValue(this.jobCardDetail)
  }

  // service list codee

  serviceSelected(data) {
    this.initialValues.serviceType.push({ label: data.service_name })
    this.initialValues.serviceTypeCopy.push({ label: data.service_name })
    let serviceDetials = {
      id : data.id,
      service_name : data.service_name
    }
    this.addServiceItem([serviceDetials]);
    const content= document.getElementById('selected-services')

    setTimeout(() => {
      content.scrollTo({
        top: content.scrollHeight,
        behavior: 'smooth'
      });
    }, 0);
  }

  removeService(i) {
    const servicearray = this.maintenanceForm.controls['services'] as UntypedFormArray;
    servicearray.removeAt(i);
    this.initialValues.serviceType.splice(i, 1);
    this.initialValues.serviceTypeCopy.splice(i, 1);
  }


  addServiceItem(service: Array<any>) {
    const servicearray = this.maintenanceForm.controls['services'] as UntypedFormArray;
    service.forEach((item) => {
      const arrayItem = this.buildService(item);
      servicearray.push(arrayItem);
    });
  }

  buildService(item) {
    return this._fb.group({
      id: [item.id || null],
      service_name : [item.service_name || null]
    });
  }

  addNewServiceType(){
    if(this.newServiceName.trim()){
      let payload ={
        service_name:this.newServiceName
      }
      this._maintenanceService.postNewServiceType(payload).subscribe((resp:any)=>{
        this.addNewService=false;
        this.newServiceName='';
        this.apiError='';
        this.getServiceTypeList();
      },err=>{
        this.apiError=err.error.message
      })
    }
  }

  getServiceTypeList(){
    this._maintenanceService.getServiceTypeListForAdd().subscribe((resp:any)=>{
      this.serviceList =resp['result']
      this.serviceListCopy =resp['result']
    })
  }

  searchValueChanged(event:string){
    if(event.length){
      this.serviceList = this.serviceListCopy.filter(service=>{
        const service_name = service.service_name.toLowerCase().includes(event.trim().toLowerCase());
        return (  service_name);
      });
    }else{
      this.serviceList = this.serviceListCopy;
    }
  }

  searchValueChangedForSelectedServices(event:string){
    this.initialValues.serviceType = [];
    if(event.length){
      this.initialValues.serviceType = this.initialValues.serviceTypeCopy.filter(service=>{
        const service_name = service.label.toLowerCase().includes(event.trim().toLowerCase());
        return (  service_name);
      });
    }else{
      this.initialValues.serviceType.push(...this.initialValues.serviceTypeCopy);
    }
  }

}
