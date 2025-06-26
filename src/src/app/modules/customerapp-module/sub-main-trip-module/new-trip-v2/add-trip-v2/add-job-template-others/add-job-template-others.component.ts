import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { cloneDeep, isArray } from 'lodash';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';

type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
}
@Component({
  selector: 'app-add-job-template-others',
  templateUrl: './add-job-template-others.component.html',
  styleUrls: ['./add-job-template-others.component.scss']
})
export class AddJobTemplateOthersComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() parentForm: FormGroup;
  @Input() formType = 'others';
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
  customFieldData = new Subject()
  driverAllowanceEdit = new Subject()
  materialFreightEditDetails=new BehaviorSubject(null);
  routeCodeList = [];
  defaultRouteCodeList = [];
  momentType=0
  constantsTripV2 = new NewTripV2Constants()
  othersForm: FormGroup;
  ismultipleDestinationFormValid = new Subject();
  routeId = new Subject();
  initialDetails = {
    route_code: getBlankOption(),
  }
  routeDestinations = new Subject();
  isFormValidclientFright = new Subject();
  isFormValidvehicleFreight = new Subject();
  isFormValidCustomField = new Subject();
  customerId = new Subject();
  preFixUrl = '';
  routeToolTip: ToolTipInfo;
  customFieldToolTip: ToolTipInfo;
  deFaultWorkOrderFreight = {
    freight_amount: 0.000,
    freight_type: 10,
    rate: 0.000,
    total_units: 0.000,
  }
  isDisableBillingTypes = false
  docToolTip: ToolTipInfo;
  workOrderClientFrightData: Subject<workOrderFrightDataType> = new Subject();
  workOrderVehicleFrightData: Subject<workOrderFrightDataType> = new Subject();
  iscustomFieldTabError = false;
  isDriverAllowanceTabError = false;
  isClientFieldTabError = false;
  isVendorFieldTabError = false;
  isFormValidDriverAllowanceField = new BehaviorSubject(true)
  $subscriptionList: Array<Subscription> = [];
  billingTypeList = new NewTripV2Constants().billingTypeList;
  officeStatus=0

  constructor(private _fb: FormBuilder,
    private _newTripDataService: NewTripV2DataService,
    private _newTripService: NewTripV2Service
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
    this.preFixUrl = getPrefix();
    this.getRouteCodeList();
    this._newTripDataService.newRouteName.subscribe((routeName: string) => {      
      if (routeName) {
        this.othersForm.get('route_code').setValue(routeName);
        this.initialDetails.route_code = { label: routeName, value: routeName };
        this.routeId.next(routeName)
      }
    });
    this._newTripDataService.newUpdateRoute.subscribe((update: boolean) => {
      if (update) {
        this.othersForm.get('update_route').setValue(update);
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
    this.parentForm.addControl(this.formType, this.othersForm);
    this.customerId.next(this.parentForm.get('customer').value)
    this.$subscriptionList.push(this.isFormValid.subscribe(vaild => {
      if (!vaild) {
        this.iscustomFieldTabError = this.othersForm?.get('other_details')?.invalid;
        this.isClientFieldTabError = this.othersForm?.get('client_freights')?.invalid;
        this.isVendorFieldTabError = this.othersForm?.get('vehicle_freights')?.invalid;
        this.isDriverAllowanceTabError = this.othersForm?.get('driver_allowances')?.invalid;
        this.isFormValidCustomField.next(this.othersForm?.get('other_details')?.valid)
        this.isFormValidDriverAllowanceField.next(this.othersForm?.get('driver_allowances')?.valid)
        this.isFormValidvehicleFreight.next(this.othersForm?.get('vehicle_freights')?.valid)
        this.isFormValidclientFright.next(this.othersForm?.get('client_freights')?.valid)
        this.ismultipleDestinationFormValid.next(this.othersForm?.get('destinations')?.valid)
        setAsTouched(this.othersForm);
      }
    }));
    this.momentType=Number(this.parentForm.get('type_of_movement').value)
    this.parentForm.get('type_of_movement').valueChanges.subscribe(momentType=>{      
      this.momentType=Number(momentType)
      setTimeout(() => {
        this.othersForm.get('route_code').setValue('');
        this.initialDetails.route_code = getBlankOption();
        this.routeId.next('');
        this.routeCodeListFilter(this.momentType)
        let customer = this.parentForm.get('customer').value;
        this.customerId.next(customer);
      }, 200);
    })
  }
  ngAfterViewInit(): void {

    if (this.workOrderDetails) {
      this.$subscriptionList.push(this.workOrderDetails.subscribe(val => {
        if (val)
          this.patchOtherForms(cloneDeep(val))
      }));
    }
    if (this.quotationDetails) {
      this.$subscriptionList.push(this.quotationDetails.subscribe(val => {
        if (val)
          this.patchOtherForms(cloneDeep(val))
      }))

    }
    if (this.tripDetails) {
      this.$subscriptionList.push(this.tripDetails.subscribe(val => {
        if (val)
          this.patchOthersEdit(val)
      }))

    }
  }

  buildTripForm() {
    this.othersForm = this._fb.group({
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
    this.routeId.next(this.othersForm.get('route_code').value)
    let routeInfo=this.routeCodeList.find(route => route.name == this.othersForm.get('route_code').value)
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
    fileValue = this.othersForm.get('documents').value
    if (isArray(fileValue)) {
      this.othersForm.get('documents').setValue(fileValue.concat(files));
    }
  }

  fileDeleted(id) {
    let value = this.othersForm.get('documents').value;
    this.othersForm.get('documents').setValue(value.filter(item => item.id !== id));
  }

  locationSelected(e){
   this.locationSelectedEmitter.emit(e)
  }


  patchOtherForms(data) {    
    let customer = this.parentForm.get('customer').value;
    this.customerId.next(customer);
    this.othersForm.patchValue(data)
    this.othersForm.get('update_route').setValue(false)
    
    this.isDisableBillingTypes = true;
    let frightDetails = data['freights'][0]
    frightDetails['total_units'] = 0.000
    frightDetails['freight_amount'] = 0.000
    if (Number(frightDetails['freight_type']) == 10) {
      frightDetails['freight_amount'] = frightDetails['rate']
      frightDetails['rate'] = 0
    }
    setTimeout(() => {
      this.routeId.next(this.othersForm.get('route_code').value)
      // this.materialFreightEditDetails.next(data['materials'])
      data['paths'].forEach(path => {
        path['time']=null
      });
      this.routeDestinations.next(data['paths'])
      this.workOrderClientFrightData.next(frightDetails);
      this.initialDetails.route_code = { label: data['route_code'], value: data['route_code'] }
      this.othersForm.patchValue({
        route_code : data['route_code']
      })
      this.routeId.next(this.othersForm.get('route_code').value)
    }, 1000);
  }

  getRouteCodeList() {
    let customer = this.parentForm.get('customer').value;
    if (customer)
      this._newTripService.getAllRoutes(customer).subscribe(resp => {
        this.defaultRouteCodeList = resp['result']
        this.routeCodeListFilter(this.momentType)
        this.customerId.next(customer);
      });
  }


  patchOthersEdit(data) {
    let formType = data['vehicle_category'] == 10 ? 'internal_job': 'others'    
    let jobFrom=this.parentForm.get('job_from').value;
    if (jobFrom != 2){
      this.isDisableBillingTypes = true;

    }
    const otherData = data[formType]
    this.officeStatus=data['office_status']
    otherData['path'].forEach((path,index) => {
      if(index!=0){
        path['reach_time']=path['time']
      }
    });
    let customer = this.parentForm.get('customer').value;
    this.customerId.next(customer);
    if(otherData['route_code']){
      this.initialDetails.route_code = { label: otherData['route_code']['name'], value: otherData['route_code']['id'] }
      otherData['route_code']=otherData['route_code']['name']
    }
    this.othersForm.patchValue(otherData)
    this.othersForm.get('update_route').setValue(false)
    this.othersForm.get('documents').setValue(otherData['documents'])
    this.isPaidByDriver = true;
    setTimeout(() => {
      this.routeId.next(this.othersForm.get('route_code').value)
      this.routeDestinations.next(cloneDeep(otherData['path']))
      this.materialFreightEditDetails.next(otherData['materials'])
      this.driverAllowanceEdit.next(otherData['driver_allowances'])
      this.customFieldData.next(otherData['other_details'])
      this.workOrderClientFrightData.next({
        freight_amount: otherData['client_freights'][0]?.['freight_amount'],
        freight_type: otherData['client_freights'][0]?.['freight_type'],
        rate: otherData['client_freights'][0]?.['rate'],
        total_units: otherData['client_freights'][0]?.['total_units'],
      });
      if(otherData['vehicle_freights'].length>0){
        this.workOrderVehicleFrightData.next({
          freight_amount: otherData['vehicle_freights'][0]['freight_amount'],
          freight_type: otherData['vehicle_freights'][0]['freight_type'],
          rate: otherData['vehicle_freights'][0]['rate'],
          total_units: otherData['vehicle_freights'][0]['total_units'],
        })
      }
    
    }, 1000);
  }

  routeCodeListFilter(momentType:number){        
   let selectedVehicleCategory=this.parentForm.get('vehicle_category').value;
    this.routeCodeList = this.defaultRouteCodeList.filter(routeCode=>selectedVehicleCategory ==0?routeCode.category==0 && routeCode.type_of_movement==momentType:selectedVehicleCategory == routeCode.category);
  }


}
