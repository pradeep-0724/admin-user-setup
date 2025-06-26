import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { cloneDeep, isArray } from 'lodash';
import moment from 'moment';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { AddMarketVehiclePopupComponent } from '../../../new-trip-v2/add-market-vehicle-popup/add-market-vehicle-popup/add-market-vehicle-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ContainerPathPopUpComponent } from '../container-path-pop-up/container-path-pop-up.component';
import { BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
@Component({
  selector: 'app-workorder-to-job-container',
  templateUrl: './workorder-to-job-container.component.html',
  styleUrls: ['./workorder-to-job-container.component.scss']
})
export class WorkorderToJobContainerComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  workOrderJobForm: FormGroup
  search = ''
  containerList = []
  copyOfcontainerList = []
  selectedJobGroup = 0;
  vehicleList = []
  asset1Specification = ''
  asset2Specification = ''
  asset3Specification = ''
  assetData = []
  driverList = []
  partyListVendor = []
  terminalList = []
  vehicleType = ''
  selectedJobTab = -1
  workOrderId = ''
  preFixUrl = getPrefix();
  sowList = [
    {
      label: 'Pullout',
      value: 1
    },
    {
      label: 'Deposit',
      value: 3
    },
    {
      label: 'Pullout & Deposit',
      value: 4
    },
    {
      label: 'Live Loading',
      value: 2
    }
  ]
  headingName = '';
  operationType = 0
  containerName = '';
  vehicleNamePopup: string = '';
  selectedVehicleOption = getBlankOption();
  optionsDropdownUrl = TSAPIRoutes.static_options;
  pointOfTypeParam: any = {};
  partyNamePopup: string = '';
  showAddPartyPopup: any = { name: '', status: false };
  vendor = false;
  partyType: any;
  partyList = [];
  billingParty = "Billing Party";
  vehicleprovider = "Vehicle Provider";
  isContainersGreaterthenOne = true;
  isFilterApplied = false;
  showFilter = false;
  containerJobType=new NewTripV2Constants().containerJobType
  containerErrorMsg: string = ""
  options = {
    columns: [
      {
        title: 'Container Type',
        key: 'type.label',
        type: 'unique'
      },
      {
        title: 'Container Size',
        key: 'size',
        type: 'unique'
      },
      {
        title: 'Storage From',
        key: 'storage_from',
        type: 'dateRange',
        range: [
          { label: 'Overdue', start: 'none', end: 0 },
          { label: 'Today', start: 0, end: 1 },
          { label: 'Tomorrow', start:1, end: 2 },
          { label: 'In 2 Days', start: 0, end: 3 },
          { label: 'In 5 Days', start: 0, end: 6 },
          { label: 'Within 7 Days', start: 0, end: 8 },
          { label: 'More Than 7 Days', start: 8, end: 'none' },
        ]
      },

      {
        title: 'Storage To',
        key: 'storage_to',
        type: 'dateRange',
        range: [
          { label: 'Overdue', start: 'none', end: 0 },
          { label: 'Today', start: 0, end: 1 },
          { label: 'Tomorrow', start:1, end: 2 },
          { label: 'In 2 Days', start: 0, end: 3 },
          { label: 'In 5 Days', start: 0, end: 6 },
          { label: 'Within 7 Days', start: 0, end: 8 },
          { label: 'More Than 7 Days', start: 8, end: 'none' },
        ]
      },

      {
        title: 'Cutoff Date',
        key: 'cutoff',
        type: 'dateRange',
        range: [
          { label: 'Overdue', start: 'none', end: 0 },
          { label: 'Today', start: 0, end: 1 },
          { label: 'Tomorrow', start:1, end: 2 },
          { label: 'In 2 Days', start: 0, end: 3 },
          { label: 'In 5 Days', start: 0, end: 6 },
          { label: 'Within 7 Days', start: 0, end: 8 },
          { label: 'More Than 7 Days', start: 8, end: 'none' },
        ]
      },
    ]
  };
  clearFilter = new BehaviorSubject(false)
  isDifferentDestinations=false;
  isShowContainerHandling=false;
  isShowConsiderationAmount=true;
  canShowToken : boolean=false;
  isShowTerminal=false;
  pointOfTypeUrl = TSAPIRoutes.static_options;
  pintType = new NewTripV2Constants().pointType
  pointOfTypeParamLoc: any = {};
  pointTypeList = [];
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};
  areaList = [];
  disabledIndex: number = 0;
  isFromToInvalid = new Subject();
  pointList = new NewTripV2Constants().pointList;
  bookingSlotOptions = [];
  tokenResponsibilityOptions = [
    {
      label :'Company',
      value : '1'
    },
    {
      label :'Customer',
      value : '0'
    },
  ];
  includeInInvoiceCharge = [
    {
      label : 'Yes',
      value : '0'
    },
    {
      label : 'No',
      value : '1'
    }
  ];
  timeSlots = [
    { value: "00:00 - 02:00", label: "00:00 - 02:00" },
    { value: "02:00 - 04:00", label: "02:00 - 04:00" },
    { value: "04:00 - 06:00", label: "04:00 - 06:00" },
    { value: "06:00 - 08:00", label: "06:00 - 08:00" },
    { value: "08:00 - 10:00", label: "08:00 - 10:00" },
    { value: "10:00 - 12:00", label: "10:00 - 12:00" },
    { value: "12:00 - 14:00", label: "12:00 - 14:00" },
    { value: "14:00 - 16:00", label: "14:00 - 16:00" },
    { value: "16:00 - 18:00", label: "16:00 - 18:00" },
    { value: "18:00 - 20:00", label: "18:00 - 20:00" },
    { value: "20:00 - 22:00", label: "20:00 - 22:00" },
    { value: "22:00 - 00:00", label: "22:00 - 00:00" }
  ];
  employeeList = [];
  accountList = [];
  accountType = new ValidationConstants().accountType.join(',');
  movementType : number ;
  scopeOfWork :number;
  bankList = [];
  containerId = '';

  isFromContainerReport:boolean=false;
  documentExpiryData = new Subject();
  vehicleAndDriverData: any = {
    vehicle: [],
    driver: [],
    customer: [],
    location: [],
    asset : []
  };
  scheduledJobsForSelectedVehicleList = [[]];
  constructor(  private router: Router,private _setHeight: SetHeightService, private _fb: FormBuilder, private _vehicleService: VehicleService, private _activateRoute: ActivatedRoute,
    private _companyTripGetApiService: CompanyTripGetApiService, private _commonService: CommonService, private _workOrderV2Service: WorkOrderV2Service,
    private _loaderService: CommonLoaderService, private _route: Router, private _scrollToTop: ScrollToTop, private dialog: Dialog,
  ) { }

  ngOnInit(): void {
    this._loaderService.getHide()
    this.workOrderJobForm = this._fb.group({
      movement_type : '',
      job_list: this._fb.array([])
    })
    let joblist = this.workOrderJobForm.get('job_list') as FormArray
    joblist.push(this.getJobListForm());    
    this.getVehicleList();
    this.getAssetList();
    this.getDriverList();
    this.getPartyTripDetails();
    this.getTerminal();
    this.getAreaList();
    this.getPointType();
    this.initialDetail();
    this.selectedJobTab = 0
  }
  ngAfterViewChecked(): void {
    this._setHeight.setTableHeight2(['.calc-height'], 'setHeight1', 0)
    this._setHeight.setTableHeight2(['.calc-height'], 'setHeight2', 0)

  }

  ngOnDestroy(): void {
    this._loaderService.getShow()
  }

  ngAfterViewInit(): void {
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('fromContainerReport')){
        this.isFromContainerReport=true
      }
      if (paramMap.has('workOrderId') && paramMap.has('operationType')) {
        this.workOrderId = paramMap.get('workOrderId');
        this.operationType = Number(paramMap.get('operationType'))
        if (paramMap.has('movementType')) {
          this.movementType = Number(paramMap.get('movementType'))
        }
        if (paramMap.has('containerId')) {
          this.containerId = paramMap.get('containerId');
        }
        if (paramMap.has('scopeOfWork')) {
          this.scopeOfWork = Number(paramMap.get('scopeOfWork'))
        }
        if(Number(paramMap.get('billingType'))==10){
          this.isShowConsiderationAmount=false;
        }
        if (paramMap.has('canShowToken')) {
          const value = paramMap.get('canShowToken');
          this.canShowToken = value === 'true';
        }
        if (this.operationType == 1) {
          this.options.columns.splice(4, 1)
        }
        if (this.operationType == 3) {
          this.options.columns.splice(2, 2)
        }
        if (this.operationType == -1) {
          this.options.columns.splice(2, 3)
        }
        this.getContainers()
        let heading = this.sowList.find(so => so.value == this.operationType)        
        if (heading) {
          this.headingName = heading.label
        }else if (this.operationType==5){
          this.headingName = "Local Job"
        }
         else {
          this.headingName = "Job"
        }
        this.generateDestinationFormGroup([{}, {}])
        this.generateVGMFormGroup([{}])
      }
    });
  }
  historyBack() {
    if (this.isFromContainerReport) {
      history.back();
    } else {
      this.router.navigate([getPrefix() + '/trip/work-order/details/'+this.workOrderId])
    }

  }

  generateDestinationFormGroup(items:any[]){
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let destinationList = form.get('destinations') as FormArray;  
    items.forEach((item,index) => {
      destinationList.push(this.addDestinationFormGroup());
    })
  }

  generateVGMFormGroup(items:any[]){
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let vgm = form.get('vgm') as FormArray;  
    items.forEach((item,index) => {
      vgm.push(this.addVGMFormGroup());
    })
  }

  addNewJob(ind) {  
    let joblist = this.workOrderJobForm.get('job_list') as FormArray;
    this.scheduledJobsForSelectedVehicleList.push([])
    joblist.push(this.getJobListForm());    
    this.selectedJobTab = joblist.controls.length-1
    this.generateDestinationFormGroup([{},{}])
    this.generateVGMFormGroup([{}]);
  }

  deleteJobList(i) {
    let joblist = this.workOrderJobForm.get('job_list') as FormArray
    joblist.controls[i].get('containers').value.forEach(item => {
      this.containerList.push(item)
    });
    this.scheduledJobsForSelectedVehicleList.splice(i,1)
    joblist.removeAt(i)
    this.selectedJobTab = 0
    this.resSetFilter()


  }

  getJobListForm() {
    return this._fb.group({
      vehicle: null,
      job_type:null,
      consideration_amount:'',
      vehicle_op: getBlankOption(),
      asset_1: null,
      asset_1_specification: '',
      asset_2_specification: '',
      asset_3_specification: '',
      is_transporter: false,
      asset_2: null,
      asset_3: null,
      date:moment(new Date()).tz(localStorage.getItem('timezone')),
      driver: '',
      terminal: null,
      vehicle_provider: null,
      asset_1_op: getBlankOption(),
      asset_2_op: getBlankOption(),
      asset_3_op: getBlankOption(),
      vehicle_provider_op: getBlankOption(),
      terminal_op: getBlankOption(),
      container_handling_op: getBlankOption(),
      containers: [[]],
      destinations : this._fb.array([]),
      pullout_token : [false],
      deposit_token : [false],
      vgm_token : [false],
      vgm : this._fb.array([]),
      pullout : this._fb.group({
        token_no : [''],
        token_existed : false,
        token_date : moment(new Date()).tz(localStorage.getItem('timezone')),
        payment_mode : [null],
        is_employee_paid : [false],
        employee : [null],
        token_responsibility : ['1'],
        token_responsibility_op : this._fb.group({
          label : ['Company'],
          value : ['1']
        }),
        token_amount : [0],
        include_in_invoice : ['0'],
        include_in_invoice_op : this._fb.group({
          label : ['Yes'],
          value : ['0']
        }),
        charge_amount : [0],
        token_slot : [''],
        terminal : [null],
        terminal_op : this._fb.group({
          label : '',
          value : ''
        }),
        token_slot_op : this._fb.group({
          label : '',
          value : ''
        }),
        documents : [[]]
      }),
      deposit : this._fb.group({
        token_no : [''],
        token_existed : false,
        token_date : moment(new Date()).tz(localStorage.getItem('timezone')),
        payment_mode : [null],
        is_employee_paid : [false],
        employee : [null],
        token_responsibility : ['1'],
        token_responsibility_op : this._fb.group({
          label : ['Company'],
          value : ['1']
        }),
        include_in_invoice_op : this._fb.group({
          label : ['Yes'],
          value : ['0']
        }),
        token_amount : [0],
        include_in_invoice : ['0'],
        charge_amount : [0],
        token_slot : [''],
        token_slot_op : this._fb.group({
          label : '',
          value : '',
        }),
        terminal : [null],
        terminal_op : this._fb.group({
          label : '',
          value : ''
        }),
        documents : [[]]
      })
    })
  }

  addDestinationFormGroup(){
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let destinationList = form.get('destinations') as FormArray;  
    return this._fb.group({
      point_type :[ destinationList.length==0 ? this.pintType.PICKUP:this.pintType.DROP],
      area :[ null,this.operationType==5 ? [Validators.required] : [Validators.nullValidator]],
      location : this._fb.group({
        name:[ ''],
        alias:[ ''],
        lat: [null],
        lng: [null],
      }),
      point_type_op : {
        label :destinationList.length==0 ?  this.pointList[0].label : this.pointList[1].label
      },
      area_label : {
        label : ''
      }
    })
  }

  addVGMFormGroup(){
    return this._fb.group({
      reference_no : [''],
      container_no : [''],
      vgm_date : [new Date(dateWithTimeZone())],
      vgm_responsibility : ['1'],
      vgm_responsibility_op : this._fb.group({
        label : ['Company'],
        value : ['1']
      }),
      vgm_amount : [0],
      charge_amount : [0],
      payment_mode : [null],
      is_employee_paid : [false],
      employee : [null],
      include_in_invoice : ['0'],
      include_in_invoice_op : this._fb.group({
        label : ['Yes'],
        value : ['0']
      }),
      documents : [[]],
    })
  }

  selectJob(i) {
    this.selectedJobTab = i
  }

  filterApplied(result) {
    this.copyOfcontainerList = result.filtedData;
    this.showFilter = !this.showFilter;
    this.isFilterApplied = result.isFilterApplied;
  }

  resSetFilter() {
    this.showFilter = true;
    this.clearFilter.next(true)
  }


  addContainerToJob(item) {
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let container = form.get('containers').value
    if (container.length == 0) {
      container.push(item)
      this.containerList =cloneDeep(this.containerList.filter(container => container.id !== item.id))
      this.copyOfcontainerList =cloneDeep(this.copyOfcontainerList.filter(container => container.id !== item.id))
    } else {
      if (!this.compareObjects(item, container[0])) {
        this.containerName = item['name'];
        this.isDifferentDestinations=true;
        setTimeout(() => {
          this.containerName = '';
          this.isDifferentDestinations=false;
        }, 5000);
      } else {
        container.push(item)
        this.containerList =cloneDeep(this.containerList.filter(container => container.id !== item.id))
        this.copyOfcontainerList =cloneDeep(this.copyOfcontainerList.filter(container => container.id !== item.id))
      }
    }
    if(container.length){
      let containerHandlingOption=container[0].handling_type
      if(isValidValue(containerHandlingOption) && this.isShowContainerHandling){
        let isAllSameType=container.every(containerItem=>containerItem.handling_type==containerHandlingOption)
        if(isAllSameType){
          let commonContainerHandeling=this.containerJobType.find(container=>container.id==containerHandlingOption)
          form.get('job_type').setValue(commonContainerHandeling['id'])
          form.get('container_handling_op').setValue({label:commonContainerHandeling['label'],value:''})
        }else{
          form.get('container_handling_op').setValue({label:'Regular',value:''})
          form.get('job_type').setValue('0')
        }

      }
    }

  }

  removeFromJob(item, i) {
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let container = form.get('containers').value
    container.splice(i, 1)
    this.containerList.push(item)
    this.resSetFilter()

  }

  getContainerForm(item) {
    return this._fb.group({
      name: item.name,
      size: item.size,
      type: item.type,
    })
  }
  onVehicleChange(form: FormGroup) {
    let vehicleId = form.get('vehicle').value;
    form.get('driver').setValue('');
    let selectedVehicle
    selectedVehicle = this.vehicleList.find(item => item.id == vehicleId);
    this.selectedVehicleOption = getBlankOption();
    this.selectedVehicleOption.label = selectedVehicle?.reg_number;
    this.selectedVehicleOption.value = selectedVehicle?.id;
    if (selectedVehicle) {
      let isTransporterTrip = selectedVehicle.is_transporter;
      form.patchValue({
        asset_1: null,
        asset_2: null,
        asset_3: null,
        asset_1_specification: '',
        asset_2_specification: '',
        asset_3_specification: '',
        vehicle_provider: null,
        asset_1_op: getBlankOption(),
        asset_2_op: getBlankOption(),
        asset_3_op: getBlankOption(),
        vehicle_provider_op: getBlankOption(),
        terminal_op: getBlankOption(),
        is_transporter: isTransporterTrip
      })
      if (!isTransporterTrip) {
        form.get('driver').setValue(selectedVehicle?.employees_assigned);

        if(isValidValue(selectedVehicle['asset_1'][0])){
          form.patchValue({
            asset_1:selectedVehicle['asset_1'][0].id,
            asset_1_op:{value:selectedVehicle['asset_1'][0].id,label:selectedVehicle['asset_1'][0].name}
          })
          this.assetSelected(form,'asset_1','asset_1_specification')
        }
        if(isValidValue(selectedVehicle['asset_2'][0])){
          form.patchValue({
            asset_2:selectedVehicle['asset_2'][0].id,
            asset_2_op:{value:selectedVehicle['asset_2'][0].id,label:selectedVehicle['asset_2'][0].name}
          })
          this.assetSelected(form,'asset_2','asset_2_specification')
        }
        if(isValidValue(selectedVehicle['asset_3'][0])){
          form.patchValue({
            asset_3:selectedVehicle['asset_3'][0].id,
            asset_3_op:{value:selectedVehicle['asset_3'][0].id,label:selectedVehicle['asset_3'][0].name}
          })
          this.assetSelected(form,'asset_3','asset_3_specification')
        }
      } else {
        setUnsetValidators(form, 'vehicle_provider', [Validators.nullValidator])
        setTimeout(() => {
          setUnsetValidators(form, 'vehicle_provider', [Validators.required])
          form.get('driver').setValue(selectedVehicle.market_driver);
        }, 10);
      }
    }
    this.getAlreadyScheduledJobsForVehicles(form);
  }

  assetSelected(form: FormGroup, parentKey, childKey) {
    let asset = form.get(parentKey).value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset);
    if (selectedAsset) {
      const value = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name
      form.get(childKey).setValue(value)
    }
  }


  getVehicleList() {
    const trailerHed$ = this._vehicleService.getVehicleListByCatagory(3, '')
    const othersVehicle$ = this._vehicleService.getVehicleListByCatagory(0, '')
    forkJoin([trailerHed$, othersVehicle$]).subscribe(([trailerHed, othersVehicle]) => {
      this.vehicleList = [...trailerHed['result']['veh'], ...othersVehicle['result']['veh']];
    })
  }

  getAssetList() {
    this._vehicleService.getAssetList().subscribe((response) => {
      this.assetData = response.result;
    });
  }

  getDriverList() {
    this._companyTripGetApiService.getDrivers(employeeList => {
      this.driverList = employeeList;
    });
  }

  getPartyTripDetails() {
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyListVendor = partyList['vendors']
    })
  }

  getTerminal() {
    this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
      this.terminalList = response['result']['path-terminal']
    });
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  save() {
    this.containerErrorMsg = '';
    let form = this.workOrderJobForm
    if (form.valid) {
      this.operationType == 5 ? form.value['movement_type'] = 'local':''
      this._workOrderV2Service.convertWoToJob(this.prepareRequest(cloneDeep(form.value))).subscribe(resp => {
        if (resp['result']['ids'].length == 1) {
          this._route.navigate([this.preFixUrl + '/trip/new-trip/details', resp['result']['ids'][0]])
        } else {
          this._route.navigate([this.preFixUrl + '/trip/new-trip/list'])
        }
      }, error => {
        this.containerErrorMsg = error.error.message;
      })
    } else {
      this._scrollToTop.scrollToTop();
      setAsTouched(form)
    }
  }

  prepareRequest(data) {
    data['workorder_id'] = this.workOrderId;
    if (this.operationType > 0) {
      data['movement_sow'] = this.operationType
    } else {
      data['movement_sow'] = 0
    }
    data['job_list'].forEach(job => {
      delete job['asset_1_specification']
      delete job['asset_2_specification']
      delete job['asset_3_specification']
      delete job['asset_1_op']
      delete job['asset_2_op']
      delete job['asset_3_op'],
      delete job['vehicle_op'],
      delete job['pullout']['token_existed'],
      delete job['deposit']['token_existed'],
      delete job['vehicle_provider_op']
      delete job['terminal_op']
      if (!job['is_transporter']) {
        if (!job['driver']) {
          job['driver'] = []
        } else {
          job['driver'] = job['driver'].map(driverObj => driverObj['id'])
        }
      } else {
        if (!job['driver']) {
          job['driver'] = '';
        }
      }

      if(job['pullout']['payment_mode'] =='paid_by_driver'){
        job['pullout']['is_employee_paid'] = true
        job['pullout']['payment_mode'] = null
      }else{
        job['pullout']['is_employee_paid'] = false
        job['pullout']['employee'] = null
      }

      if(job['deposit']['payment_mode'] =='paid_by_driver'){
        job['deposit']['is_employee_paid'] = true
        job['deposit']['payment_mode'] = null
      }else{
        job['deposit']['is_employee_paid'] = false
        job['deposit']['employee'] = null
      }

      delete job['pullout']['include_in_invoice_op']
      delete job['pullout']['terminal_op']
      delete job['pullout']['token_responsibility_op']
      delete job['pullout']['token_slot_op']

      delete job['deposit']['include_in_invoice_op']
      delete job['deposit']['terminal_op']
      delete job['deposit']['token_responsibility_op']
      delete job['deposit']['token_slot_op']
      job['date'] = changeDateTimeToServerFormat(job['date'])
      job['deposit']['token_date'] = changeDateTimeToServerFormat(job['deposit']['token_date'])
      job['pullout']['token_date'] = changeDateTimeToServerFormat(job['pullout']['token_date'])

      job['pullout']['documents'] = job['pullout']['documents'].map(doc=>doc.id)
      job['deposit']['documents'] = job['deposit']['documents'].map(doc=>doc.id)

   
      job['containers'] = job['containers'].map(container => container['id'])
    });
    data['job_list'].forEach(element => {
      element['destinations'].forEach(destination => {
        delete destination['area_label'];
        delete destination['point_type_op'];
      });
    });

    data['job_list'].forEach(element => {
      element['vgm'].forEach(destination => {
        destination['documents'] = destination['documents'].map(doc=>doc.id);
        destination['vgm_date'] = changeDateToServerFormat(destination['vgm_date'])
        if(destination['payment_mode'] =='paid_by_driver'){
          destination['is_employee_paid'] = true
          destination['payment_mode'] = null
        }else{
          destination['is_employee_paid'] = false
          destination['employee'] = null
        }
        delete destination['include_in_invoice_op'];
        delete destination['vgm_responsibility_op'];
      });
    });
    return data
  }

  getContainers() {
    this._workOrderV2Service.getWorkorderContainerData(this.workOrderId).subscribe(response => {
      let containerDataList: [] = response['result'];
      this.isShowTerminal=true;
      this.isShowContainerHandling=true
      if (this.operationType == 1) {
        this.containerList = containerDataList.filter(containers => {
          const pullout_job_no = containers['pullout_job_no'] ? false : true
          return pullout_job_no
        }

        )

      }
      if (this.operationType == 2) {
        this.containerList = containerDataList.filter(containers => {
          const pullout_job_no = containers['pullout_job_no'] ? false : true
          const deposit_job_no = containers['deposit_job_no'] ? false : true
          return  pullout_job_no && deposit_job_no
        })
      }
      if (this.operationType == 3) {
         this.containerList = containerDataList.filter((containers: any) => {
          const deposit_job_no = containers['deposit_job_no'] ? false : true
          let pullout_job_no = true
          if(containers.hasOwnProperty('pullout_job_no')&&containers.hasOwnProperty('deposit_job_no') ){
            if(containers['pullout_job_no']){
               this.isShowContainerHandling=false;
            }
          }
          if (containers.hasOwnProperty('pullout_job_no')) {
            pullout_job_no = containers['pullout_job_no'] ? true : false
          }
          return deposit_job_no && pullout_job_no
        })
      }
      if (this.operationType == -1) {
        this.containerList = containerDataList
        .filter(containers => {
          const isEditable = containers['is_editable']
          return  isEditable

        })
      }
      if (this.operationType == 5) {
        this.containerList = containerDataList
        this.isShowContainerHandling=false;
        this.isShowTerminal=false;
      }
      if (this.containerList.length > 1) {
        this.isContainersGreaterthenOne = true
      } else {
        this.isContainersGreaterthenOne = false;
      }
      if(this.containerId){
        let containerObj=this.containerList.find(container=>container.id==this.containerId)
        if(containerObj){
          this.addContainerToJob(containerObj)
        }
      }
      this.copyOfcontainerList = cloneDeep(this.containerList)

     
      
    });
  }

  dateChangeTime(date) {
    if (date) {
      return moment(date).tz(localStorage.getItem('timezone')).format('llll')
    }
    return '-'
  }

  dateChange(date) {
    if (date) {
      return moment(date).format('DD/MM/YYYY')
    }
    return '-'
  }


  compareObjects(obj1, obj2) {
    function isValidFormat(value) {
      return value &&
        typeof value.lat === 'number' &&
        typeof value.lng === 'number' &&
        typeof value.name === 'string' &&
        typeof value.alias === 'string';
    }
    let keysToSkip = ['pullout_port', 'deposit_pickup'];
    if (this.operationType == 1) {
      keysToSkip.splice(1, 1)
    }
    if (this.operationType == 3) {
      keysToSkip.splice(0, 1)
    }
    if (this.operationType == -1) {
      keysToSkip = []
    }
    for (let key in obj1) {
      if (keysToSkip.includes(key)) continue;
      if (isValidFormat(obj1[key])) {
        if (!obj2.hasOwnProperty(key) || JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          return false;
        }
      }
    }
    for (let key in obj2) {
      if (keysToSkip.includes(key)) continue;
      if (isValidFormat(obj2[key])) {
        if (!obj1.hasOwnProperty(key) || JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
          return false;
        }
      }
    }
    return true;
  }

  addValueToVehiclePopUp(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ').toUpperCase();
      this.vehicleNamePopup = word_joined;
    }
  }

  openAddVehicle(event) {
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    const dialogRef = this.dialog.open(AddMarketVehiclePopupComponent, {
      data: {
        name: this.vehicleNamePopup,
        vehicle_category: 3,
        vechileSpecifications: ''
      },
      width: '800px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if (item.isValid) {
        this.addNewVehicle(item)
      } else {
        form.get('vehicle_op').setValue(this.selectedVehicleOption);
      }
      dialogRefSub.unsubscribe();
    });
  }

  addNewVehicle(event) {
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let obj = {
      label: event.reg_number,
      value: event.id
    }
    form.get('vehicle_op').setValue(obj);
    form.get('vehicle').setValue(event.id)

    const trailerHed$ = this._vehicleService.getVehicleListByCatagory(3, '')
    const othersVehicle$ = this._vehicleService.getVehicleListByCatagory(0, '')
    forkJoin([trailerHed$, othersVehicle$]).subscribe(([trailerHed, othersVehicle]) => {
      this.vehicleList = [...trailerHed['result']['veh'], ...othersVehicle['result']['veh']];
      this.onVehicleChange(form)
    })
  }

  openAddPartyModal($event, type) {
    if ($event) {
      this.vendor = true;
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }
    else {
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true }
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
    this.vendor = false;

  }
  addValueToPartyPopup(event, partyType) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
      this.partyType = partyType;
    }
  }

  addPartyToOption($event) {
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    if ($event.status && this.partyType == this.vehicleprovider) {
      this.getPartyTripDetails();
      let obj = {
        label: $event.label,
        value: $event.id
      }
      form.get('vehicle_provider_op').setValue(obj)
      form.get('vehicle_provider').setValue($event.id);
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

  getNewTerminal(event, control:FormGroup) {    
    if (event) {
      this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
        this.terminalList = response['result']['path-terminal']
        control.get('terminal').setValue(event.id);
        let obj = {
          label: event.label,
          value: event.id
        }
        control.get('terminal_op').setValue(obj);
      });
    }
  }

  openContainerPath(id) {
    const dialogRef = this.dialog.open(ContainerPathPopUpComponent, {
      data: {
        id,
        movement_sow: this.operationType
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: boolean) => {
      dialogRefSub.unsubscribe();
    });

  }

  getNewPointOfType(event, currentIndex) {

    if (event) {
      let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
      let destinationList = form.get('destinations') as FormArray;
      this._commonService.getStaticOptions('route-point-type').subscribe((response) => {
        this.pointTypeList = response['result']['route-point-type']
        destinationList.at(currentIndex).get('point_type').setValue(event.id);
        destinationList.at(currentIndex).get('point_type_op').setValue({label: event.label, value: event.id});
      });
    }
  }

  addNewPointOfType(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.pointOfTypeParamLoc = {
        key: 'route-point-type',
        label: word_joined,
        value: 0
      };
    }
  }

  getPointType() {
    this._commonService.getStaticOptions('route-point-type').subscribe((response) => {
      this.pointTypeList = response['result']['route-point-type']
    });
  }
  getAreaList() {
    this._commonService.getStaticOptions('area').subscribe((response) => {
      this.areaList = response['result']['area']
    });
  }
  
  areaSelected(form : FormGroup){ 
    form.get('area_label').patchValue({
      label : this.areaList.find(area => area.id == form.get('area').value).label
    })    
  }

  addNewArea(event,index) {
    this.areaParams = {
      key: 'area',
      label: event,
      value: 0
    };
  }
  getNewArea(event,form:FormGroup,index) {    
		if (event) {
			this._commonService
			.getStaticOptions('area')
			.subscribe((response) => {
        form.get('area').setValue(event.id);
        form.get('area_label').patchValue({label : event.label});
				this.areaList = response.result['area'];
			});
		}
	}

  locationSelected(e, i) {
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let destinationList = form.get('destinations') as FormArray;
    let location = destinationList.at(i).get('location') as FormGroup;
    location.patchValue(e.value);
  }

  addNewDestinationFormGroup(){
    this.generateDestinationFormGroup([{}])
  }

  removeVGMFormGroup(ind:number){
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let destinationList = form.get('vgm') as FormArray;
    destinationList.removeAt(ind)
  }

  addNewVGMFormGroup(){
    this.generateVGMFormGroup([{}])
  }

  removeNewDestinationFormGroup(ind){
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let destinationList = form.get('destinations') as FormArray;
    destinationList.removeAt(ind)
  }

  fileUploader(e,form : FormGroup) {
    let files = [];
    let fileValue = [];
    if (e.length) {
      e.forEach(element => {
        element['presigned_url'] = element['url']
        files.push(element);
      });
    }
    fileValue = form.get('documents').value
    if (isArray(fileValue)) {
      form.get('documents').setValue(fileValue.concat(files));
    }
  }

  fileDeleted(id,form : FormGroup) {
    let value = form.get('documents').value;
    form.get('documents').setValue(value.filter(item => item.id !== id));
  }

  initialDetail() {
    this._companyTripGetApiService.getAll(employeeList => {
      this.employeeList = employeeList;
    });
    this._commonService.getBankDropDownList().subscribe((stateData) => {
			if (stateData !== undefined) {
				this.bankList = stateData.result;
			}
		});
  }

  findTimeSlot(value: string | Date) {
    const selectedTime = moment(new Date(value));
    const matchedSlot = this.timeSlots.find(slot => {
      const [start, end] = slot.value.split(" - ");
      const startTime = moment(start, "HH:mm");
      let endTime = moment(end, "HH:mm");

      if (endTime.isBefore(startTime)) {
        endTime.add(1, 'day');
      }

      const selected = selectedTime.clone();
      if (selected.isBefore(startTime)) selected.add(1, 'day');

      return selected.isSameOrAfter(startTime) && selected.isBefore(endTime);
    });
    return matchedSlot ? matchedSlot : null;
  }

  dateTimeSelected(e,form: FormGroup) {  
    const timezone = localStorage.getItem('timezone') || 'Asia/Kolkata';
    const zonedMoment = moment(e.value).tz(timezone);
    const zonedDate = new Date(zonedMoment.format('YYYY-MM-DDTHH:mm:ss'));
    let slotValue = this.findTimeSlot(zonedDate);            
    if (slotValue) {      
      form.get('token_slot').setValue(slotValue.value);
      form.get('token_slot_op').setValue(slotValue);
    }
  }

  onTokenChange(e,form:FormGroup){
    this._workOrderV2Service.getUniqueTokenVerification(form.get('token_no').value).subscribe((res)=>{
      if(isValidValue(res['result'])){
        const tripIds=res['result']['cancelled_trips']
        const tripIdInString=tripIds.join(',')
        const isCancelled=res['result']['is_cancelled']
        let message='This token already exists. Do you still want to reuse the same?'
        if(isCancelled){
          message=`Please Note: This token number has been cancelled for the following job${tripIds.length==1?'':'s'}:${tripIdInString}.
            Do you still want to reuse this token number?`
        }
        const dialogRef = this.dialog.open(DeleteAlertComponent, {
          data: {
            message: message
          },
          width: '200px',
          maxWidth: '90%',
          closeOnNavigation: true,
          disableClose: true,
          autoFocus: false
        });
        let dialogRefSub = dialogRef.closed.subscribe((resp: boolean) => {          
          if (resp) {
            let includeInvoiceLable = this.includeInInvoiceCharge.find(ele=>Number(ele.value)===Number(res['result']['include_in_invoice']))
            let tokenReponsilityLable = this.tokenResponsibilityOptions.find(ele=>Number(ele.value)===Number(res['result']['token_responsibility']))
            let tokenSlotLabel = this.timeSlots.find(ele=>ele.value===res['result']['token_slot'])
            form.patchValue({
              token_existed : true,
              token_no :  res['result']['token_no'],
              include_in_invoice : res['result']['include_in_invoice'],
              token_date : moment(new Date(res['result']['token_date'])).tz(localStorage.getItem('timezone')) ,
              token_responsibility : res['result']['token_responsibility'],
              token_slot : res['result']['token_slot'],
              token_slot_op : tokenSlotLabel,
              token_responsibility_op : tokenReponsilityLable,
              include_in_invoice_op : includeInvoiceLable,
              terminal:res['result'].terminal?res['result'].terminal.id:null,
              terminal_op: {
                label : res['result'].terminal?res['result'].terminal.label:'',
                value : res['result'].terminal?res['result'].terminal.id:null,
              }
            })
          }else{
            form.get('token_no').setValue('')

          }
          dialogRefSub.unsubscribe();
        });
      }
    })
  }

  tokenSelected(event,form:FormGroup){
    form.patchValue({
      token_no: '',
      token_existed: false,
      token_date:moment(new Date()).tz(localStorage.getItem('timezone')),
      payment_mode: null,
      is_employee_paid: false,
      employee: null,
      token_responsibility:'1',
      token_responsibility_op: {
        label: 'Company',
        value: '1'
      },
      token_amount: 0,
      include_in_invoice: '0',
      include_in_invoice_op: {
        label: ['Yes'],
        value: ['0']
      },
      charge_amount: 0,
      token_slot: '',
      terminal: null,
      terminal_op: {
        label: '',
        value: ''
      },
      token_slot_op: {
        label: '',
        value: ''
      },
      documents: []
    })
    setTimeout(() => {
      let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as any      
      let pulloutTokenDate = form.get('pullout').get('token_date');
      let depositTokenDate = form.get('deposit').get('token_date');          
      this.dateTimeSelected(pulloutTokenDate,form.get('pullout'));
      this.dateTimeSelected(depositTokenDate,form.get('deposit'));       
    }, 400);
  }
  tokenSelectedForVGM(){
    let form = (this.workOrderJobForm.get('job_list') as FormArray).at(this.selectedJobTab) as FormGroup
    let vgmArray = form.get('vgm') as FormArray;
    vgmArray.clear();
    this.generateVGMFormGroup([{}])
  }

  tokenAmountChange(form:FormGroup){    
    form.get('charge_amount').setValue(form.get('token_amount').value ? form.get('token_amount').value : 0)
  }

  tokenAmountChangeForVGM(form:FormGroup){
    form.get('charge_amount').setValue(form.get('vgm_amount').value ? form.get('vgm_amount').value : 0)
  }

  includeInvoiceSelected(form:FormGroup){
    form.get('charge_amount').setValue(form.get('token_amount').value)
  }

  includeInvoiceSelectedForVGM(form:FormGroup){
    form.get('charge_amount').setValue(form.get('vgm_amount').value)
  }

  getAlreadyScheduledJobsForVehicles(form:FormGroup){
    let vehicleIds = [];
    let jobList = this.workOrderJobForm.value['job_list'];
    jobList.forEach(job => {
      vehicleIds.push({
        id: job['vehicle'],
        date : changeDateToServerFormat(job['date'])
      })
    })
    this._vehicleService.getAlreadyScheduledJobsForVehicle(vehicleIds).subscribe((resp)=>{
      this.scheduledJobsForSelectedVehicleList=resp['result']
    })
  }


}
