import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { cloneDeep, isArray } from 'lodash';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
}
@Component({
  selector: 'app-add-job-template-trailer-loose-cargo',
  templateUrl: './add-job-template-trailer-loose-cargo.component.html',
  styleUrls: ['./add-job-template-trailer-loose-cargo.component.scss']
})
export class AddJobTemplateTrailerLooseCargoComponent implements OnInit,OnDestroy, AfterViewInit {
  @Input() parentForm: FormGroup;
  @Input() formType = 'loose_cargo';
  @Input() contactPersonList = [];
  @Input() driverId: Observable<any>
  @Input() isFormValid: Observable<boolean>
  @Input() workOrderDetails?: Observable<any>
  @Input() quotationDetails?: Observable<any>
  @Input() tripDetails?: Observable<any>;
  @Input() routeCodeBdp?='';
  isPaidByDriver = true;
  @Output() selectedJobStartDate = new EventEmitter<any>();
  @Output() locationSelectedEmitter = new EventEmitter<any>();
  isSubFormValid = new Subject();
  customFieldData = new Subject()
  driverAllowanceEdit = new Subject()
  routeCodeList = [];
  constantsTripV2 = new NewTripV2Constants()
  trailerForm: FormGroup;
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
    freight_type: 7,
    rate: 0.000,
    total_units: 0.000,
  }
  isDisableBillingTypes = false
  docToolTip: ToolTipInfo;
  workOrderVehicleFrightData: Subject<workOrderFrightDataType> = new Subject();
  billingFrieightChanged : BehaviorSubject<any> = new BehaviorSubject(null);
  iscustomFieldTabError = false;
  isDriverAllowanceTabError = false;
  isClientFieldTabError = false;
  isVendorFieldTabError = false;
  isFormValidDriverAllowanceField = new BehaviorSubject(true)
  $subscriptionList: Array<Subscription> = [];
  materialFreightEditDetails  = new BehaviorSubject(null);
  billingTypeList : any[] = [
    {
      label : 'Quantity',
      value : 14
    },
    {
      label : 'Jobs',
      value : 10
    }
  ];
  defaultBillingType = '';
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
        this.trailerForm.get('route_code').setValue(routeName);
        this.initialDetails.route_code = { label: routeName, value: routeName };
        this.routeId.next(routeName)
      }
    });
    this._newTripDataService.newUpdateRoute.subscribe((update: boolean) => {
      if (update) {
        this.trailerForm.get('update_route').setValue(update);
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
    this.parentForm.addControl(this.formType, this.trailerForm);
    this.customerId.next(this.parentForm.get('customer').value)
    this.$subscriptionList.push(this.isFormValid.subscribe(vaild => {
      if (!vaild) {
        this.iscustomFieldTabError = this.trailerForm?.get('other_details')?.invalid;
        this.isClientFieldTabError = this.trailerForm?.get('materials')?.invalid;
        this.isVendorFieldTabError = this.trailerForm?.get('vehicle_freights')?.invalid;
        this.isDriverAllowanceTabError = this.trailerForm?.get('driver_allowances')?.invalid;
        this.isFormValidCustomField.next(this.trailerForm?.get('other_details')?.valid)
        this.isFormValidDriverAllowanceField.next(this.trailerForm?.get('driver_allowances')?.valid)
        this.isFormValidvehicleFreight.next(this.trailerForm?.get('vehicle_freights')?.valid)
        this.isFormValidclientFright.next(this.trailerForm?.get('client_freights')?.valid)
        this.ismultipleDestinationFormValid.next(this.trailerForm?.get('destinations')?.valid);
        this.isSubFormValid.next(true);
        setAsTouched(this.trailerForm);
      }
    }));
    this.parentForm.get('is_transporter').valueChanges.subscribe((value)=>{
      this.billingFrieightChanged.next((this.parentForm.value['loose_cargo']?.['materials']?.['billing']))
    })
  }
  ngAfterViewInit(): void {

    if (this.workOrderDetails) {
      this.$subscriptionList.push(this.workOrderDetails.subscribe(val => {
        if (val){
          this.materialFreightEditDetails.next(val)
          this.patchOtherForms(cloneDeep(val))
        }
        
      }));
    }
    if (this.quotationDetails) {
      this.$subscriptionList.push(this.quotationDetails.subscribe(val => {
        if (val){
          this.materialFreightEditDetails.next(val)
          this.patchOtherForms(cloneDeep(val))
        }
        
      }))

    }
    if (this.tripDetails) {
      this.$subscriptionList.push(this.tripDetails.subscribe(val => {
        if (val){
          this.materialFreightEditDetails.next(val)
          this.patchOthersEdit(val)
        }

      }))

    }
  }

  buildTripForm() {
    this.trailerForm = this._fb.group({
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
    this.routeId.next(this.trailerForm.get('route_code').value)
    let routeInfo=this.routeCodeList.find(route => route.name == this.trailerForm.get('route_code').value)
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
    fileValue = this.trailerForm.get('documents').value
    if (isArray(fileValue)) {
      this.trailerForm.get('documents').setValue(fileValue.concat(files));
    }
  }

  fileDeleted(id) {
    let value = this.trailerForm.get('documents').value;
    this.trailerForm.get('documents').setValue(value.filter(item => item.id !== id));
  }

  locationSelected(e){
   this.locationSelectedEmitter.emit(e)
  }


  patchOtherForms(data) {
    let customer = this.parentForm.get('customer').value;
    this.customerId.next(customer);
    this.trailerForm.patchValue(data)
    this.trailerForm.get('update_route').setValue(false)
    this.initialDetails.route_code = { label: data['route_code'], value: data['route_code'] }
    this.isDisableBillingTypes = true;
    setTimeout(() => {
      this.routeId.next(this.trailerForm.get('route_code').value)
      data['paths'].forEach(path => {
        path['time']=null
      });
      this.routeDestinations.next(data['paths'])
    }, 1000);
  }

  getRouteCodeList() {
    let customer = this.parentForm.get('customer').value;
    if (customer)
      this._newTripService.getAllRoutes(customer).subscribe(resp => {
        this.routeCodeList = resp['result']
        this.customerId.next(customer);
        if(this.routeCodeBdp){
          this.trailerForm.get('route_code').setValue(this.routeCodeBdp);
          this.initialDetails.route_code = { label: this.routeCodeBdp, value: this.routeCodeBdp }
          setTimeout(() => {
           this.routeSelected()
          }, 1000);
        }
      });
  }

  patchOthersEdit(data) {
    let jobFrom=this.parentForm.get('job_from').value;
    if (jobFrom != 2){
      this.isDisableBillingTypes = true;

    }
    this.officeStatus=data['office_status']
    const otherData = data['loose_cargo'];
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
    this.trailerForm.patchValue(otherData)
    this.trailerForm.get('update_route').setValue(false)
    this.trailerForm.get('documents').setValue(otherData['documents'])
    this.isPaidByDriver = true;
    setTimeout(() => {
      this.routeId.next(this.trailerForm.get('route_code').value)
      this.routeDestinations.next(cloneDeep(otherData['path']))
      this.driverAllowanceEdit.next(otherData['driver_allowances'])
      this.customFieldData.next(otherData['others'])
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

  materailsFormValue(e:FormGroup){
    
  }

  billingTypeChanged(e){
    this.defaultBillingType = e
    this.billingFrieightChanged.next(this.defaultBillingType)
  }



}
