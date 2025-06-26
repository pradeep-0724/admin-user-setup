import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';

import { cloneDeep, isArray } from 'lodash';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { Dialog } from '@angular/cdk/dialog';
import { ContainerInfoPopupComponent } from '../container-info-popup/container-info-popup.component';
import { Moment } from 'moment';

type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
  job_type: number | string,
}
@Component({
  selector: 'app-add-job-template-container',
  templateUrl: './add-job-template-container.component.html',
  styleUrls: ['./add-job-template-container.component.scss']
})
export class AddJobTemplateContainerComponent implements OnInit,OnDestroy, AfterViewInit {
  @Input() parentForm: FormGroup;
  @Input() formType = 'container';
  @Input() contactPersonList = [];
  @Input() driverId: Observable<any>
  @Input() isFormValid: Observable<boolean>
  @Input() workOrderDetails?: Observable<any>
  @Input() quotationDetails?: Observable<any>
  @Input() tripDetails?: Observable<any>
  @Input() routeCodeBdp?='';
  isPaidByDriver = true;
  @Output() selectedJobStartDate = new EventEmitter<any>();
  @Output() locationSelectedEmitter = new EventEmitter<any>();
  @Output() commonRateCardValuesEmitter = new EventEmitter<any>();
  customFieldData = new Subject()
  driverAllowanceEdit = new Subject()
  routeCodeList = [];
  constantsTripV2 = new NewTripV2Constants()
  containerForm: FormGroup;
  ismultipleDestinationFormValid = new Subject();
  routeId = new Subject();
  initialDetails = {
    route_code: getBlankOption(),
  }
  routeDestinations = new Subject();
  isFormValidCustomField = new Subject();
  customerId = new Subject();
  preFixUrl = '';
  routeToolTip: ToolTipInfo;
  customFieldToolTip: ToolTipInfo;
  deFaultWorkOrderFreight = {
    freight_amount: 0.000,
    freight_type: 7,
    rate: 0.000,
    total_units: 0.000,
  }
  docToolTip: ToolTipInfo;
  workOrderClientFrightData: Subject<workOrderFrightDataType> = new Subject();
  workOrderVehicleFrightData: Subject<workOrderFrightDataType> = new Subject();
  iscustomFieldTabError = false;
  isDriverAllowanceTabError = false;
  isMaterialInfoTabError = false;
  isFormValidDriverAllowanceField = new BehaviorSubject(true)
  isFreightFormFieldValid = new BehaviorSubject(true);
  materialFreightEditDetails  = new BehaviorSubject(null);
  $subscriptionList: Array<Subscription> = [];
  showBasiceContainer : boolean = false;
  containerInfoTable : any[]= [];
  scopeOfWork=0;
  billingTypeList =[{
    label:'Jobs',
    value:'10'
  },
  {
    label:'Containers',
    value:'11'
  }]
  isDisableBillingTypes = false
  deFaultRouteCodeList=[]
  momentType=0
  officeStatus=0
  jobType:any;
  isWorkorderContainer : boolean = false;
  customer=''

  constructor(private _fb: FormBuilder,
    private _newTripDataService: NewTripV2DataService,
    private _newTripService: NewTripV2Service,
    private _dialog : Dialog
  ) {
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.formType);
    this.$subscriptionList.forEach(sub => {
      sub.unsubscribe()
    })
  }


  ngOnInit(): void {
    this.buildTripForm();
    this.customer=this.parentForm.get('customer').value
    this.preFixUrl = getPrefix();
    this.getRouteCodeList();
    this._newTripDataService.newRouteName.subscribe((routeName: string) => {
      if (routeName) {
        this.containerForm.get('route_code').setValue(routeName);
        this.initialDetails.route_code = { label: routeName, value: routeName };
        this.routeId.next(routeName)
      }
    });
    this._newTripDataService.newUpdateRoute.subscribe((update: boolean) => {
      if (update) {
        this.containerForm.get('update_route').setValue(update);
      }
    });
    this.routeToolTip = {
      content: this.constantsTripV2.toolTipMessages.ROUTE.CONTENT
    }
    this.customFieldToolTip = {
      content: this.constantsTripV2.toolTipMessages.CUSTOM_FIELD.CONTENT
    }
    this.docToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_DOCUMENT.CONTENT
    }
    this.parentForm.addControl(this.formType, this.containerForm);

    this.customerId.next(this.parentForm.get('customer').value)
    this.$subscriptionList.push(this.isFormValid.subscribe(vaild => {
      if (!vaild) {
        this.iscustomFieldTabError = this.containerForm?.get('other_details')?.invalid;
        this.isDriverAllowanceTabError = this.containerForm?.get('driver_allowances')?.invalid;
        this.isMaterialInfoTabError = this.containerForm?.get('client_freights')?.invalid;
        this.isFormValidCustomField.next(this.containerForm?.get('other_details')?.valid)
        this.isFormValidDriverAllowanceField.next(this.containerForm?.get('driver_allowances')?.valid)
        this.ismultipleDestinationFormValid.next(this.containerForm?.get('destinations')?.valid)
        setAsTouched(this.containerForm);
      }
    }));
    this.momentType=Number(this.parentForm.get('type_of_movement').value)
    if(isValidValue(this.parentForm.get('job_type').value)){
      this.jobType=Number( this.parentForm.get('job_type').value)
    }
    this.parentForm.get('job_type').valueChanges.subscribe((value)=>{
      if(isValidValue(value)){
        this.jobType=value
      }     
    })
    this.parentForm.get('type_of_movement').valueChanges.subscribe((value)=>{
      if(Number(value)==3 || Number(value)==4){
        this.showBasiceContainer = true;
      }else{
        this.showBasiceContainer = false;
      }
      this.momentType=Number(value)
      this.containerForm.get('route_code').setValue('');
      this.initialDetails.route_code = getBlankOption();
      this.routeId.next('')
      this.routeCodeListFilter(this.momentType,this.scopeOfWork)
    })
    this.parentForm.get('movement_sow').valueChanges.subscribe((value)=>{
      this.scopeOfWork=Number(value)
      this.routeCodeListFilter(this.momentType,this.scopeOfWork)
      this.containerForm.get('route_code').setValue('');
      this.initialDetails.route_code = getBlankOption();
      this.routeId.next('')
    })
   
  }
  ngAfterViewInit(): void {
    if (this.tripDetails) {
      this.$subscriptionList.push(this.tripDetails.subscribe(val => {
        if (val){
          this.isWorkorderContainer = val?.job_from?.type ==1 && isValidValue(val?.job_from?.name)  
          this.isDisableBillingTypes = val?.job_from?.type ==1 && isValidValue(val?.job_from?.name)          
          this.patchContainerEdit(val);        
          this.materialFreightEditDetails.next(val['container']['materials'])
        }    
      }))

    }
  }

  buildTripForm() {
    this.containerForm = this._fb.group({
      route_code: '',
      update_route: false,
      path: [[]],
      documents: [[]]
    })
    
  }
  dateTimeChanged(e){
    this.selectedJobStartDate.emit(e);
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  routeSelected() {
    this.routeId.next(this.containerForm.get('route_code').value)
    let routeInfo=this.routeCodeList.find(route => route.name == this.containerForm.get('route_code').value)
    if(routeInfo){
      routeInfo.paths.forEach(path => {
        path['time']=null
      });
      this.routeDestinations.next( routeInfo.paths);
    }

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
    fileValue = this.containerForm.get('documents').value
    if (isArray(fileValue)) {
      this.containerForm.get('documents').setValue(fileValue.concat(files));
    }
  }

  fileDeleted(id) {
    let value = this.containerForm.get('documents').value;
    this.containerForm.get('documents').setValue(value.filter(item => item.id !== id));
  }

  locationSelected(e){
   this.locationSelectedEmitter.emit(e)
  }


  getRouteCodeList() {
    let customer = this.parentForm.get('customer').value;
    if (customer)
      this._newTripService.getAllRoutes(customer).subscribe(resp => {
        this.deFaultRouteCodeList=resp['result']
        this.routeCodeListFilter(this.momentType,this.scopeOfWork)
        this.customerId.next(customer);
        if(this.routeCodeBdp){
          this.containerForm.get('route_code').setValue(this.routeCodeBdp);
          this.initialDetails.route_code = { label: this.routeCodeBdp, value: this.routeCodeBdp }
          setTimeout(() => {
           this.routeSelected()
          }, 1000);
        }
      });
  }

  patchContainerEdit(data) {
    this.officeStatus=data['office_status']
    const containerData = data['container']
    this.scopeOfWork=data['movement_sow']
    if(Number(data['type_of_movement'])==3 || Number(data['type_of_movement'])==4){
      this.showBasiceContainer = true;
    }else{
      this.showBasiceContainer = false;
    }
    containerData['path'].forEach((path,index) => {
      if(index!=0){
        path['reach_time']=path['time']
      }
    });
    let customer = this.parentForm.get('customer').value;
    this.customerId.next(customer);
    if(containerData['route_code']){
      this.initialDetails.route_code = { label: containerData['route_code']['name'], value: containerData['route_code']['id'] }
      containerData['route_code']=containerData['route_code']['name']
    }
    this.containerForm.patchValue(containerData)
    this.containerForm.get('update_route').setValue(false)
    this.containerForm.get('documents').setValue(containerData['documents'])
    this.isPaidByDriver = true;
    this._newTripService.getAllRoutes(customer).subscribe(resp => {
      this.deFaultRouteCodeList=resp['result']
      this.routeCodeListFilter(Number(data['type_of_movement']),Number(data['movement_sow']))
    });
    setTimeout(() => {
      this.routeId.next(this.containerForm.get('route_code').value)
      this.routeDestinations.next(cloneDeep(containerData['path']))
      this.driverAllowanceEdit.next(containerData['driver_allowances'])
      this.customFieldData.next(containerData['other_details'])
      this.workOrderClientFrightData.next({
        freight_amount: containerData['client_freights'][0]['freight_amount'],
        freight_type: containerData['client_freights'][0]['freight_type'],
        rate: containerData['client_freights'][0]['rate'],
        total_units: containerData['client_freights'][0]['total_units'],
        job_type: containerData['client_freights'][0]['job_type'],

      });
      if(containerData['vehicle_freights'].length>0){
        this.workOrderVehicleFrightData.next({
          freight_amount: containerData['vehicle_freights'][0]['freight_amount'],
          freight_type: containerData['vehicle_freights'][0]['freight_type'],
          rate: containerData['vehicle_freights'][0]['rate'],
          total_units: containerData['vehicle_freights'][0]['total_units'],
          job_type: containerData['vehicle_freights'][0]['job_type'],
        })
      }
    
    }, 1000);
  }

  openAddContainerPopUp(){
    const dialogRef = this._dialog.open(ContainerInfoPopupComponent, {
      maxWidth:"85%",
      width:'1100px',
      data: {
        workOrderId : '767b989b-d608-420a-b1a1-c52cba1a1abb',
        selectedContainersData : this.containerInfoTable
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result:any) => {
      if(result){
        this.containerInfoTable = result.selectedContainer;
        dialogRefSub.unsubscribe()
      }
    });
  }

  ChangeDatetoNormalFormats(date:Moment){
    if(isValidValue(date)){
      return date?.toDate()
    }else{
      return '-'
    }
    
  }

  routeCodeListFilter(momentType,scopeOfWork){
    this.routeCodeList = this.deFaultRouteCodeList.filter(routeCode=>routeCode.category==4&& routeCode.type_of_movement==momentType && routeCode.movement_sow==scopeOfWork )

  }

  emitCommonRateCardValues(event){    
    this.commonRateCardValuesEmitter.emit(event)
  }

}
