import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, } from '@angular/router';
import { cloneDeep, isArray } from 'lodash';
import { BehaviorSubject, Subject, forkJoin } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { AddMarketVehiclePopupComponent } from '../../add-market-vehicle-popup/add-market-vehicle-popup/add-market-vehicle-popup.component';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { changeDateTimeToServerFormat, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import moment from 'moment';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { AddTripV2ValidationComponent } from '../add-trip-v2-validation/add-trip-v2-validation.component';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { LpoService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/lpo-services/lpo.service';
import { WorkOrderV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/work-order-service/work-order-v2.service';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
import { ValidationConstants } from 'src/app/core/constants/constant';
@Component({
  selector: 'app-add-trip-v2',
  templateUrl: './add-trip-v2.component.html',
  styleUrls: ['./add-trip-v2.component.scss'],
})
export class AddTripV2Component implements OnInit, OnDestroy, AfterViewInit {

  constantsTripV2 = new NewTripV2Constants()
  addTrip: FormGroup;
  apiError: string = '';
  vehicleList = [];
  isTransporterTrip: boolean = false;
  partyList = [];
  vehicleNamePopup: string = '';
  postDriverAPI: any = TSAPIRoutes.lorrychallan_driver;
  showAddPartyPopup: any = { name: '', status: false };
  addDriverParams: any = {};
  partyNamePopup: string = '';
  transporterDriverList = [];
  employeeList = [];
  vendor = false;
  vehicleprovider = "Vehicle Provider";
  billingParty = "Billing Party";
  partyType: any;
  partyListVendor = [];
  driverId = new Subject();
  initialDetails = {
    driver: getBlankOption(),
    vehicle: getBlankOption(),
    customer: getBlankOption(),
    vehicle_provider: getBlankOption(),
    route_code: getBlankOption(),
    workOrder: getBlankOption(),
    jobfrom: getBlankOption(),
    jobfromValue: getBlankOption(),
    specification: getBlankOption(),
    lpo: getBlankOption(),
    assetOne: getBlankOption(),
    assetTwo: getBlankOption(),
    assetThree: getBlankOption(),
    typeOfMovement: getBlankOption(),
    inspectionRequired: getBlankOption(),
    sow: getBlankOption(),
    jobType: getBlankOption(),
    poc: getBlankOption(),

  }

  preFixUrl = '';
  contactPersonList = [];
  routeCodeList = [];
  driverList = [];
  lpoList = [];
  vechileSpecifications = [];
  tripToolTip: ToolTipInfo;
  vehicleType: string = '  ';
  docToolTip: ToolTipInfo;
  tripDocuments = [];
  documents = [];
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  vehicleAndDriverData: any = {
    vehicle: [],
    driver: [],
    customer: [],
    location: [],
    asset : []
  };
  isFormValid = new Subject()
  currency_type;
  quotationList = []
  quotationListOrsalesOrderList = [];
  salesOrderList = [];
  isCatagorySelected = false;
  isCustomerChanged = false;
  jobFromList = [
    {
      label: 'Quotation',
      value: 0

    },
    {
      label: 'Sales Order',
      value: 1

    },
    {
      label: 'N/A',
      value: 2

    }
  ]
  workOrderDetails = new BehaviorSubject('')
  quotationDetails = new BehaviorSubject('')
  tripDetails = new BehaviorSubject('');
  prevRentalCharge = new Subject();
  specificationChange = new Subject();
  tripDetailsEditdata;
  tripId = '';
  validationDetailsList: any[] = [];
  isApprovalConfigured: boolean;
  heading_text: string = '';
  is_Submit: boolean;
  type_of_save: any;
  areCertificatesExpired: boolean;
  grace_period_expired: any;
  creditLimit: any
  checkCreditLimit: boolean = false;
  dataForSubmission: any;
  failedValidations = [];
  allDocumentsExpiryStatus = [];
  totalValue: any;
  isSiteInspectionSelected: boolean = false;
  isQuotationSelected: boolean = false;
  rentalChargesArray;
  isZoneSelected: boolean = false;
  price_validationDetails: any;
  isVehicleDocExpired: boolean = false;
  isDriversDocExpired: boolean = false;
  isVehicleTyreExpired: boolean = false;
  isVehicleSubAssetExpired: boolean = false;
  isVehiclePermitExpired: boolean = false;
  isAssetCertificateExpired: boolean = false;
  isAssetSubAssetExpired: boolean = false;
  isAssetTyreExpired: boolean = false;
  isPermitNotFound: boolean = false;
  isFieldEditable = true;
  disableTypeOfMovementAndSow = false;
  rateCardQuotationApiValues: {};
  quotationExpiryDate: boolean;
  salesOrderSpec: string = '';
  routeCodeBdp = '';
  vehicleCategiriesObj = {
    hasMultipleCategories: false,
    categories: []
  };
  jobstartDate = '';
  todaySDate = moment(new Date(dateWithTimeZone())).format('YYYY-MM-DD');
  documentExpiryData = new Subject();
  workingDuration = '';
  fuelProvision = '';
  actualFreightValues: any = {
    freight_amount: 0,
    rate: 0,
    total_units: 0
  };
  freightValuesOfSoOrQuotation: any = {
    freight_amount: 0,
    rate: 0,
    total_units: 0
  }

  workorderUnitStatus = {
    billing_type: 0,
    total_units: 0,
    utilized_units: 0
  }
  billingType = new NewTripV2Constants().billingTypeList;
  containerJobType = this.constantsTripV2.containerJobType
  locations = [];
  assetData: any[] = []
  movementTypes = [
    {
      label: 'Import',
      value: '1'
    },
    {
      label: 'Export',
      value: '2'
    }, {
      label: 'Local',
      value: '3'
    },
    {
      label: 'Cross Border',
      value: '4'
    },
  ];
  inspectionRequired = [
    {
      label: 'No',
      value: 0
    },
    {
      label: 'Yes',
      value: 1
    }
  ];
  sowList = [
    {
      label: 'Pullout',
      value: 1,
      key : 'pullout'
    },
    {
      label: 'Deposit',
      value: 3,
      key : 'deposit'

    },
    {
      label: 'Live Loading',
      value: 2,
      key : 'live_loading'
    }
  ]
  addInspectionApi = 'optionvalues/?key=inspection-type';
  vehicleSpecFor3and4 = '';
  asset1Specification = '';
  asset2Specification = '';
  asset3Specification = '';
  isMarketVehicleSelected = new Subject();
  isCustomerRateCardExisted : boolean = false;
  isPartyApproverRequired=false;
  isPartyApproverAvailable:boolean = true;
  partyApproverErrorMesg={
    validation:'Party Approver',
     message:'Please add a Party Approver before proceeding',
     action_key:'stop_job_create',
  }
  isLinkedClicked=false;
  commonRateCardvalues = {};
  scheduledJobsForSelectedVehicleList = [];
  countryPhoneCodeList = [];
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  defaultPhoneFlag = {
    code: '',
    flag: ''
  };
  pointOfContactsList = [];
  pocURL = '';
  pocParam = {};
  
  constructor(private _fb: FormBuilder,
    private _companyTripGetApiService: CompanyTripGetApiService,
    private _commonservice: CommonService,
    private _newTripService: NewTripV2Service,
    private _route: Router,
    private _scrollToTop: ScrollToTop,
    private currency: CurrencyService,
    private _analytics: AnalyticsService,
    private commonloaderservice: CommonLoaderService,
    private dialog: Dialog,
    private _vehicleService: VehicleService,
    private _activateRoute: ActivatedRoute,
    private _companyService: CompanyServices,
    private _lpoService: LpoService,
    private _workorderServicev2: WorkOrderV2Service,
    private apiHandler: ApiHandlerService,
    private _partyService: PartyService,
   private _tripDataService:NewTripV2DataService,
  ) {

  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  ngOnInit(): void {
    this._tripDataService.isEditTrip=false;
    this.jobstartDate = this.todaySDate;
    this.commonloaderservice.getHide();
    this.buildTripForm();
    this.getDriverList();
    this.getPartyTripDetails();
    this.getAssetList();
    this.currency_type = this.currency.getCurrency();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.NEWTRIP, this.screenType.ADD, "Navigated");
    this.preFixUrl = getPrefix();
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_NUMBER.CONTENT
    }
    this.docToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_DOCUMENT.CONTENT
    };
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
    this.getValidationDetils();
    this.addTrip.get('c_vehicle').valueChanges.subscribe((vehicle)=>{
      this.getAlreadyScheduledJobsForVehicles();
    })
  }


  ngAfterViewInit(): void {
    this._activateRoute.params.subscribe(prams => {
      if (prams['trip-id']) {
        this._tripDataService.isEditTrip=true
        this.tripId = prams['trip-id']
        this.getTripDetails();
        this._commonservice.getVehicleCatagoryType().subscribe(resp => {
          this.vehicleCategiriesObj.categories = resp['result']['categories']
          this.vehicleCategiriesObj.hasMultipleCategories = resp['result']['has_multiple_categories']
          if ([0, 3].some(value => this.vehicleCategiriesObj.categories.includes(value))) {
            this.vehicleCategiriesObj.hasMultipleCategories = true
          }
        })
      } else {
        this.getTripId();
        this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
          this._commonservice.getVehicleCatagoryType().subscribe(resp => {
            this.vehicleCategiriesObj.hasMultipleCategories = resp['result']['has_multiple_categories']
            this.vehicleCategiriesObj.categories = resp['result']['categories']
            if ([0, 3].some(value => this.vehicleCategiriesObj.categories.includes(value))) {
              this.vehicleCategiriesObj.hasMultipleCategories = true
            }
            if (paramMap.keys.length) {
              if (paramMap.has('quotationData')) {
                this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
                  this.partyList = partyList['clients']
                  this.partyListVendor = partyList['vendors']
                  this.convertToJob(paramMap.get('quotationData'), true)
                })
              }
              if (paramMap.has('salesOrderData')) {
                this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
                  this.partyList = partyList['clients']
                  this.partyListVendor = partyList['vendors']
                  this.convertToJob(paramMap.get('salesOrderData'), false)
                })
              }
              if (paramMap.has('bdpCustomerId') && paramMap.has('bdpRouteCode') && paramMap.has('tenderNumber')) {
                this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
                  this.partyList = partyList['clients']
                  this.partyListVendor = partyList['vendors']
                  this.patchCustomerAndRouteCodeAndTenderNumber(paramMap.get('bdpCustomerId'), paramMap.get('bdpRouteCode'), paramMap.get('tenderNumber'))

                });
              }
            } else {
              if (this.vehicleCategiriesObj.categories.includes(1)) {
                this.addTrip.get('vehicle_category').setValue('1')
                this.getApprovalLevelDetails(1);
                this.isCatagorySelected = true;
                this.getVehicleSpecifications();
                this.getVehicleList();
                return
              }
              if (this.vehicleCategiriesObj.categories.includes(2)) {
                this.addTrip.get('vehicle_category').setValue('2')
                this.getApprovalLevelDetails(3);
                this.isCatagorySelected = true;
                this.getVehicleSpecifications();
                this.getVehicleList();
                return
              }
              if (this.vehicleCategiriesObj.categories.includes(3) || this.vehicleCategiriesObj.categories.includes(0)) {
                this.addTrip.get('vehicle_category').setValue('0')
                this.getApprovalLevelDetails(0);
                this.isCatagorySelected = true;
                this.getVehicleSpecifications();
                this.getVehicleList();
                return
              }
            }




          })
        })

      }
    })

  }

  buildTripForm() {
    this.addTrip = this._fb.group({
      c_vehicle: [null],
      vehicle_category: '',
      driver: '',
      movement_sow: null,
      job_type: null,
      customer: ['', [Validators.required]],
      job_from: this._fb.group({
        type: ['', Validators.required],
        id: '',
      }),
      vehicle_provider: '',
      trip_id: '',
      is_transporter: false,
      lr_no: '',
      lpo: null,
      bdp_tender_number: '',
      type_of_movement: [null],
      no: [''],
      date: [null],
      no_of_containers: [0],
      is_inspection_required: [0],
      inspection_type: [],
      specification: [''],
      asset_1: [null],
      asset_2: [null],
      asset_3: [null],
      poc : null,
    })
  }

  resetHeadForm() {
    let category = Number(this.addTrip.get('vehicle_category').value);
    this.addTrip.patchValue({
      c_vehicle: null,
      lpo: null,
      driver: '',
      movement_sow: null,
      vehicle_provider: '',
      is_transporter: false,
      lr_no: '',
      specification: '',
      asset_1: null,
      asset_2: null,
      asset_3: null,
      job_type: null,
      type_of_movement: category == 0 || category == 4 ? null : 0,
      no: '',
      date: null,
      no_of_containers: 0,
      is_inspection_required: 0,
      inspection_type: [],
      poc : null,
    });
    this.initialDetails.poc = getBlankOption();
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
    this.isCustomerChanged = true;
    this.workorderUnitStatus = {
      billing_type: 0,
      total_units: 0,
      utilized_units: 0
    }
    setTimeout(() => {
      this.workOrderDetails.next('')
      this.quotationDetails.next('')
      this.tripDetails.next('')
      this.isCustomerChanged = false;
    }, 100);
    this.addTrip.get('job_from').reset();
    this.initialDetails.driver = getBlankOption();
    this.initialDetails.jobfrom = getBlankOption();
    this.initialDetails.jobfromValue = getBlankOption();
    this.initialDetails.specification = getBlankOption();
    this.initialDetails.vehicle_provider = getBlankOption();
    this.initialDetails.assetOne = getBlankOption();
    this.initialDetails.assetTwo = getBlankOption();
    this.initialDetails.assetThree = getBlankOption();
    this.initialDetails.lpo = getBlankOption();
    this.initialDetails.vehicle = getBlankOption();
    this.initialDetails.typeOfMovement = getBlankOption();
    this.initialDetails.jobType = getBlankOption();
    this.vehicleType = '';
    this.vehicleSpecFor3and4 = '';
    this.asset1Specification = '';
    this.asset2Specification = '';
    this.asset3Specification = '';
    this.pointOfContactsList = [];
    if(category==10){
      this.initialDetails.jobfrom =this.jobFromList[2];
      this.addTrip.get('job_from').patchValue({
        type:2,
        id:''
      })
    }
    setUnsetValidators(this.addTrip, 'vehicle_provider', [Validators.nullValidator]);
    this.addRemoveValidators(this.addTrip, 'type_of_movement', category == 0 || category == 4 ? [Validators.required] : [Validators.nullValidator])
    this.isFormValid.next(true)
    this.isTransporterTrip = false;
    setUnsetValidators(this.addTrip, 'movement_sow', [Validators.nullValidator])

  }

  getValidationDetils() {
    this._newTripService.getValidationDetails().subscribe((res) => {
      this.validationDetailsList = res['result'];
    })
  }

  getApprovalLevelDetails(category) {
    this._newTripService.getApprovalLevelDetails(category).subscribe((res) => {
      this.isApprovalConfigured = res['result'].is_approval_configured
      if(res['result']?.approvals?.find(ele=>ele.id == "party_approver")){
        this.isPartyApproverRequired=true
      }
    })
  }
  movementTypeChanged() {
    this.addTrip.patchValue({
      no: '',
      date: null,
      no_of_containers: 0,
      is_inspection_required: 0,
      inspection_type: [],
      movement_sow: null,
      job_type : '0'
    })
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
    this.initialDetails.jobType = { label: 'Regular', value:'0' };
    this.initialDetails.sow = getBlankOption()
    this.inspectionRequiredSelected();
    if (Number(this.addTrip.get('vehicle_category').value) == 4 && Number(this.addTrip.get('type_of_movement').value) <= 2) {
      setUnsetValidators(this.addTrip, 'movement_sow', [Validators.required])
    } else {
      setUnsetValidators(this.addTrip, 'movement_sow', [Validators.nullValidator])
    }

  }

  inspectionRequiredSelected() {
    let value = this.addTrip.get('is_inspection_required').value
    this.addTrip.get('inspection_type').setValue([]);
    this.addRemoveValidators(this.addTrip, 'inspection_type', Number(value) == 1 ? [Validators.required] : [Validators.nullValidator]);
  }

  addRemoveValidators(form: AbstractControl, key: string, ValidatorsList: Array<any>) {
    form.get(key).setValidators(ValidatorsList);
    form.get(key).updateValueAndValidity();
  }

  




  onSpecificationChange() {
    let vehicleCategory = this.addTrip.get('vehicle_category').value
    if (Number(vehicleCategory) > 0) {
      this.addTrip.patchValue({
        c_vehicle: null,
        driver: '',
        vehicle_provider: '',
        lpo: null,
        is_transporter: false,
      });
      this.initialDetails.driver = getBlankOption();
      this.initialDetails.vehicle_provider = getBlankOption();
      this.initialDetails.lpo = getBlankOption();
      this.initialDetails.vehicle = getBlankOption();
      this.vehicleType = '';
      this.vehicleSpecFor3and4 = '';
      this.isTransporterTrip = false;
      this.specificationChange.next(this.addTrip.get('specification').value)
      setUnsetValidators(this.addTrip, 'vehicle_provider', [Validators.nullValidator]);
      this.getDocsExpiryLIst();
    }


  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  vehicleCatagoryChange(type) {
    this.isPartyApproverRequired=false;
    this.isPartyApproverAvailable = true;
    this.addTrip.get('vehicle_category').setValue(type)
    this.isCatagorySelected = true;
    this.addTrip.patchValue({
      customer: '',
    });
    this.resetHeadForm();
    this.initialDetails.customer = getBlankOption();
    this.getVehicleSpecifications();
    setUnsetValidators(this.addTrip, 'customer',type==10? [Validators.nullValidator] :[Validators.required])
    if (type == '0' || type == '4' ||type == '10') {
      setUnsetValidators(this.addTrip, 'specification', [Validators.nullValidator])
    } else {
      setUnsetValidators(this.addTrip, 'specification', [Validators.required])
    }
    this.getVehicleList();
    this.vehicleAndDriverData = {
      vehicle: [],
      driver: [],
      customer: [],
      location: [],
    };
    this.jobstartDate = this.todaySDate;
    this.getDocsExpiryLIst();
    this.makeJobFromDisabled();
    this.getApprovalLevelDetails(type);
  }

  convertToJob(data, isQuotation = true) {
    this.initialDetails.jobfrom = isQuotation ? this.jobFromList[0] : this.jobFromList[1]
    let toConvertData = JSON.parse(data);
    this.addTrip.patchValue({
      vehicle_category: toConvertData['vehicleCategory'],
      customer: toConvertData['customer']['id'],
      inspection_type: [],
      poc : toConvertData['poc']?.id
    });
    this.getPointOfContactsList(toConvertData['customer']['id'])
    this.initialDetails.poc = { label : toConvertData?.poc?.display_name,value : toConvertData?.poc?.id };
    this.getApprovalLevelDetails(toConvertData['vehicleCategory'])
    this.addTrip.get('job_from').patchValue({
      type: isQuotation ? 0 : 1,
      id: isQuotation ? toConvertData['quotation']['id'] : toConvertData['saleorder']['id']
    })
    this.isCatagorySelected = true;
    this.initialDetails.jobfromValue = isQuotation ? toConvertData['quotation'] : toConvertData['saleorder'];
    this.initialDetails.customer = toConvertData['customer'];
    this.getVehicleSpecifications();
    if (toConvertData['vehicleCategory'] == '0') {
      setUnsetValidators(this.addTrip, 'specification', [Validators.nullValidator])
    } else {
      setUnsetValidators(this.addTrip, 'specification', [Validators.required])
    }
    this.getVehicleList();
    this.initialDetailsOnClientSelected();
    this._newTripService.getWOAndQO(toConvertData['customer']['id'], toConvertData['vehicleCategory']).subscribe(resp => {
      this.quotationList = resp.result['qo'];
      this.salesOrderList = resp.result['wo']
      this.quotationListOrsalesOrderList = isQuotation ? this.quotationList : this.salesOrderList;
      this.jobformValueChange();
    })
    this.isCustomerChanged = false

  }

  openAddVehicle(event) {
    const dialogRef = this.dialog.open(AddMarketVehiclePopupComponent, {
      data: {
        name: this.vehicleNamePopup,
        vehicle_category: this.addTrip.get('vehicle_category').value,
        vechileSpecifications: this.vechileSpecifications.find(specifications => specifications.id == this.addTrip.get('specification').value)

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
      }
      dialogRefSub.unsubscribe();
    });

  }



  addNewVehicle(newVehicleData) {
    let specification = '';
    let vehicleCategory = this.addTrip.get('vehicle_category').value
    if (Number(vehicleCategory) == 1 || Number(vehicleCategory) == 2) {
      specification = this.addTrip.get('specification').value
    }
    if (Number(vehicleCategory) == 4) {
      vehicleCategory = 3
    }
    if (vehicleCategory == 3 || vehicleCategory == 0) {
      const trailerHed$ = this._vehicleService.getVehicleListByCatagory(3, '')
      const othersVehicle$ = this._vehicleService.getVehicleListByCatagory(0, '')
      forkJoin([trailerHed$, othersVehicle$]).subscribe(([trailerHed, othersVehicle]) => {
        this.vehicleList = [...trailerHed['result']['veh'], ...othersVehicle['result']['veh']];
        this.addTrip.get('c_vehicle').setValue(newVehicleData.id);
        this.initialDetails.vehicle = { value: '', label: newVehicleData.reg_number };
        this.onVehicleChange()
      })
    } else {
      this._vehicleService.getVehicleListByCatagory(vehicleCategory, specification).subscribe((response: any) => {
        this.vehicleList = response.result['veh'];
        this.addTrip.get('c_vehicle').setValue(newVehicleData.id);
        this.initialDetails.vehicle = { value: '', label: newVehicleData.reg_number };
        this.onVehicleChange()
      });

    }

  }


  prefillDriverSelf(e) {
    if (e) {
      this.driverId.next(e)
    }
  }
  selectedDriverList(e) {
    if (e) {
      this.getDocsExpiryLIst();
    }
  }

  selectedJobStartDate(e) {
    this.jobstartDate = e
    this.getDocsExpiryLIst();
    this.getAlreadyScheduledJobsForVehicles();
  }

  getDocsExpiryLIst() {
    let ids = [];
    if (this.vehicleType === 'Own Vehicle' && this.addTrip.get('driver').value != null && this.addTrip.get('driver').value.length > 0) {
      this.addTrip.get('driver').value.map((ele) => ids.push(
        {
          date: this.jobstartDate,
          id: ele.id
        }
      ))
    }
    let vehicleId = this.addTrip.get('c_vehicle').value;
    let customerId = this.addTrip.get('customer').value;
    let location = [];
    let asset = [];
    this.locations = [];
    if (isValidValue(customerId) && isValidValue(this.jobstartDate)) {
      if (Number(this.addTrip.get('vehicle_category').value) == 0) {
        if (this.addTrip.value['others']) {
          location = this.addTrip.value['others']['destinations']['start_end_destination'].map(loc => loc.location)
        }
      }
      if (Number(this.addTrip.get('vehicle_category').value) == 1) {
        if (this.addTrip.value['crane']) {
          location = [this.addTrip.value['crane']['location_details']['location']]
        }
      }
      if (Number(this.addTrip.get('vehicle_category').value) == 2) {
        if (this.addTrip.value['awp']) {
          location = [this.addTrip.value['awp']['location_details']['location']]
        }
      }
      if (Number(this.addTrip.get('vehicle_category').value) == 4) {
        if (this.addTrip.value['container']) {
          location = this.addTrip.value['container']['destinations']['start_end_destination'].map(loc => loc.location)
        }
      }
      location.forEach((ele) => {
        if (isValidValue(ele.name) && (!ele.lat || !ele.lng))
          this.locations.push(ele)
      });
      if(Number(this.addTrip.get('vehicle_category').value) == 0 || Number(this.addTrip.get('vehicle_category').value) == 4){
        if(isValidValue(this.addTrip.get('asset_1').value)){
          asset.push({
            date : this.jobstartDate,
            id : this.addTrip.get('asset_1').value
          })
        }
        if(isValidValue(this.addTrip.get('asset_2').value)){
          asset.push({
            date : this.jobstartDate,
            id : this.addTrip.get('asset_2').value
          })
        }if(isValidValue(this.addTrip.get('asset_3').value)){
          asset.push({
            date : this.jobstartDate,
            id : this.addTrip.get('asset_3').value
          })
        }
      }
      this.vehicleAndDriverData = {
        driver: ids,
        customer: [{ date: this.jobstartDate, id: customerId }],
        location: location,
        asset : asset
      }
      if (isValidValue(vehicleId)) {
        this.vehicleAndDriverData.vehicle = [{ date: this.jobstartDate, id: vehicleId }]
      }
      this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((data) => {
        this.documentExpiryData.next(data)
        this.isDriversDocExpired = data['result'].driver.expired_count > 0;
        this.isVehicleDocExpired = data['result'].vehicle.expired_count > 0;
        this.isVehicleSubAssetExpired = data['result'].vehicle_subasset.expired_count > 0;
        this.isVehicleTyreExpired = data['result'].vehicle_tyre.expired_count > 0;
        this.isAssetCertificateExpired = data['result'].asset.expired_count > 0;
        this.isAssetSubAssetExpired = data['result'].asset_subasset.expired_count > 0;
        this.isAssetTyreExpired = data['result'].asset_tyre.expired_count > 0;
        this.areCertificatesExpired = data['result']['customer'].expired_count > 0;        
        this.grace_period_expired = data['result']['customer'].grace_period_expired;
        this.creditLimit = data['result']['customer'].credit_remaining;
        this.checkCreditLimit = data['result']['customer'].check_credit_limit;
        this.isVehiclePermitExpired = data['result']['vehicle_permit'].expired > 0;
        this.isPermitNotFound = data['result']['vehicle_permit'].not_found.length > 0;
      })
    } else {
      this.documentExpiryData.next(null)
    }

  }

  getVehicleSpecifications() {
    let vehicleCategory = this.addTrip.get('vehicle_category').value
    this._vehicleService.getVehicleSpecifications(vehicleCategory).subscribe((response: any) => {
      this.vechileSpecifications = response.result;
    });
  }

  locationSelected(e) {
    this.getDocsExpiryLIst();
  }

  getWOAndQO() {
    const customer = this.addTrip.get('customer').value;
    const vehicle_category = this.addTrip.get('vehicle_category').value
    this._newTripService.getWOAndQO(customer, vehicle_category).subscribe(resp => {
      this.quotationList = resp.result['qo'];
      this.salesOrderList = resp.result['wo']
    })
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

  onVehicleChange() {
    this.vehicleType = '';
    this.vehicleSpecFor3and4 = '';
    let vehicleId = this.addTrip.get('c_vehicle').value;
    let selectedVehicle = [];
    selectedVehicle = this.vehicleList.filter(item => item.id == vehicleId);
    this.isTransporterTrip = selectedVehicle[0].is_transporter;
    this.vehicleSpecFor3and4 = selectedVehicle[0]?.specification?.name
    this.addTrip.get('vehicle_provider').setValue(null)
    this.addTrip.get('lpo').setValue(null)
    this.initialDetails.vehicle_provider = getBlankOption();
    this.initialDetails.lpo = getBlankOption();
    this.addTrip.get('is_transporter').setValue(this.isTransporterTrip);


    if (this.isTransporterTrip) {
      this.addTrip.patchValue({
        asset_1: null,
        asset_2: null,
        asset_3: null
      });
      this.initialDetails.assetOne = getBlankOption();
      this.initialDetails.assetTwo = getBlankOption();
      this.initialDetails.assetThree = getBlankOption();
      this.asset1Specification = '';
      this.asset2Specification = '';
      this.asset3Specification = '';
      this.isMarketVehicleSelected.next(true);
      setUnsetValidators(this.addTrip, 'vehicle_provider', [Validators.required])
    } else {
      this.isMarketVehicleSelected.next(false);
      setUnsetValidators(this.addTrip, 'vehicle_provider', [Validators.nullValidator])
    }
    this.addTrip.get('driver').setValue(null);
    this.addTrip.patchValue({
      asset_1: selectedVehicle[0]?.asset_1[0]?.id ? selectedVehicle[0]?.asset_1[0]?.id : null,
      asset_2: selectedVehicle[0]?.asset_2[0]?.id ? selectedVehicle[0]?.asset_2[0]?.id : null,
      asset_3: selectedVehicle[0]?.asset_3[0]?.id ? selectedVehicle[0]?.asset_3[0]?.id : null,
    })
    this.initialDetails.assetOne = { label: selectedVehicle[0]?.asset_1[0]?.name, value: selectedVehicle[0]?.asset_1[0]?.id };
    this.initialDetails.assetTwo = { label: selectedVehicle[0]?.asset_2[0]?.name, value: selectedVehicle[0]?.asset_2[0]?.id };
    this.initialDetails.assetThree = { label: selectedVehicle[0]?.asset_3[0]?.name, value: selectedVehicle[0]?.asset_3[0]?.id };
    this.assetOneSelected();
    this.assetTwoSelected();
    this.assetThreeSelected();
    if (!this.isTransporterTrip) {
      this.driverId.next(selectedVehicle[0].employees_assigned[0]?.id)
      this.addTrip.get('driver').setValue(selectedVehicle[0].employees_assigned);
    } else {
      setTimeout(() => {
        this.addTrip.get('driver').setValue(selectedVehicle[0]['market_driver']);
      }, 100);
    }
    if (!this.isTransporterTrip && this.addTrip.controls.c_vehicle.valid) {
      this.vehicleType = 'Own Vehicle';
    }
    if (this.isTransporterTrip && this.addTrip.controls.c_vehicle.valid) {
      this.vehicleType = 'Market Vehicle';
    }
    this.getDocsExpiryLIst();
  }

  getAlreadyScheduledJobsForVehicles(){
    let vehicle = this.addTrip.get('c_vehicle').value;
    let params = [{
      date : this.jobstartDate,
      id :  this.addTrip.get('c_vehicle').value
    }]
    this.scheduledJobsForSelectedVehicleList= []
    isValidValue(vehicle) &&  this._vehicleService.getAlreadyScheduledJobsForVehicle(params).subscribe((resp)=>{
      let result = resp['result'][0].filter(id =>id.trip_id !=this.addTrip.get('trip_id').value)      
      this.scheduledJobsForSelectedVehicleList=result
    })
  }

  setDefaultPOC(){
    this.addTrip.get('poc').setValue(null);
    this.initialDetails.poc = getBlankOption();
    let defaultPOC = this.pointOfContactsList.find(poc=>poc.default==true)
      this.addTrip.get('poc').setValue(defaultPOC?.id);
      this.initialDetails.poc = {
        label : defaultPOC?.display_name,
        value : defaultPOC?.id
      }
  }

  jobfromChange() {
    this.addTrip.get('lr_no').setValue('')
    this.addTrip.get('job_from.id').setValue('')
    this.addTrip.get('type_of_movement').setValue(null);
    this.initialDetails.typeOfMovement = getBlankOption();
    this.addTrip.get('job_type').setValue(null)
    this.initialDetails.jobType = getBlankOption();
    this.initialDetails.jobfromValue = getBlankOption();
    const type = this.addTrip.get('job_from.type').value
    if (Number(type) == 0) {
      this.quotationListOrsalesOrderList = this.quotationList
      setUnsetValidators(this.addTrip.get('job_from'), 'id', [Validators.required])
    } else if (Number(type) == 1) {
      this.quotationListOrsalesOrderList = this.salesOrderList
      setUnsetValidators(this.addTrip.get('job_from'), 'id', [Validators.required])
    } else {
      this.quotationListOrsalesOrderList = []
      setUnsetValidators(this.addTrip.get('job_from'), 'id', [Validators.nullValidator])

    }
    this.resetVehicleFonfo();
    this.jobstartDate = this.todaySDate;
    this.getDocsExpiryLIst();
    this.workOrderDetails.next('')
    this.quotationDetails.next('')
    this.tripDetails.next('')
    this.isCustomerChanged = true;
    setTimeout(() => {
      this.isCustomerChanged = false;
    }, 100);
  }

  jobformValueChange() {
    this.resetVehicleFonfo();

    this.workorderUnitStatus = {
      billing_type: 0,
      total_units: 0,
      utilized_units: 0
    }
    const id = this.addTrip.get('job_from.id').value
    const type = this.addTrip.get('job_from.type').value;
    let category = Number(this.addTrip.get('vehicle_category').value);
    let screen = ''
    this.tripDetails.next('')
    if (Number(type) == 0) {
      screen = 'quotation'
      this._newTripService.getWOAndQOdetails(id, screen).subscribe(resp => {
        if (category == 0) {
          this.freightValuesOfSoOrQuotation = cloneDeep(resp['result']['freights'][0]);
        }
        this.workOrderDetails.next('')
        this.quotationDetails.next(resp['result'])
        this.quotationExpiryDate = resp['result']?.is_validity_expired;
        this.addTrip.get('lr_no').setValue(resp['result']['ref_no']);
        this.addTrip.get('type_of_movement').setValue(resp['result']['type_of_movement']);
        let typeMatched = this.movementTypes.find(ele => ele.value == resp['result']['type_of_movement']);
        this.initialDetails.typeOfMovement = typeMatched
        if (Number(this.addTrip.get('vehicle_category').value) != 0) {
          this.preFillSpecification(resp['result'], false);
        } else {
          this.preFillSpecificationForOther(resp['result'])
        };
        this.jobstartDate = this.todaySDate;
        this.getDocsExpiryLIst();
      })
    } else if (Number(type) == 1) {
      screen = 'workorder'
      this._newTripService.getWOAndQOdetails(id, screen).subscribe(resp => {
        if (category == 0) {
          this.freightValuesOfSoOrQuotation = cloneDeep(resp['result']['freights'][0]);
          this.getWorkorderUnits(id)
          this.addTrip.patchValue({
            is_inspection_required: resp['result']['is_inspection_required'],
            type_of_movement: resp['result']['type_of_movement'],
            inspection_type: resp['result']['inspection_type'],
            lr_no: resp['result']['enquiry_no'],
            no: resp['result']['no'],
            date: resp['result']['date'],
            no_of_containers: resp['result']['no_of_containers'],
          })
        }
        this.addTrip.get('lr_no').patchValue(resp['result']['enquiry_no']);
        this.quotationDetails.next('')
        this.workOrderDetails.next(resp['result']);
        if (resp['result']['is_inspection_required'] == 1) {
          this.initialDetails.inspectionRequired = this.inspectionRequired[1];
        } else {
          this.initialDetails.inspectionRequired = this.inspectionRequired[0];
        }
        let typeMatched = this.movementTypes.find(ele => ele.value == resp['result']['type_of_movement']);
        this.initialDetails.typeOfMovement = typeMatched
        if (Number(this.addTrip.get('vehicle_category').value) != 0) {
          this.jobstartDate = resp['result']['rental_charges'][0]['job_start_date']; ''
          this.preFillSpecification(resp['result'], true);
          this.salesOrderSpec = resp['result']?.rental_charges[0]?.specification?.id
        } else {
          this.jobstartDate = this.todaySDate
        }
        this.getDocsExpiryLIst();
      })
    } else {
      this.getDocsExpiryLIst();
      this.addTrip.get('lr_no').setValue('');
      screen = ''
    }
  }

  preFillSpecification(data, isVehicle) {
    if (data['rental_charges'].length == 1) {
      if (data['rental_charges'][0]['specification']) {
        this.addTrip.get('specification').setValue(data['rental_charges'][0]['specification']['id']);
        this.initialDetails.specification = { label: data['rental_charges'][0]['specification']['specification'], value: '' }
        this.getVehicleList();
      }
      if (isVehicle) {
        if (data['rental_charges'][0]['vehicle']) {
          this.addTrip.get('c_vehicle').setValue(data['rental_charges'][0]['vehicle']['id']);
          this.initialDetails.vehicle = { label: data['rental_charges'][0]['vehicle']['reg_number'], value: '' }
          if (this.addTrip.get('specification').value)
            this._vehicleService.getVehicleListByCatagory(this.addTrip.get('vehicle_category').value, this.addTrip.get('specification').value).subscribe((response: any) => {
              this.vehicleList = response.result['veh'];
              this.onVehicleChange();
              this.preFillVehiclePeroviderAndLpo(data)
            });
        }
      }
    }
  }
  preFillVehiclePeroviderAndLpo(data) {
    if (data['rental_charges'].length == 1) {
      if (data['rental_charges'][0]['vehicle_provider']) {
        this.getLpoList(data['rental_charges'][0]['vehicle_provider']['id'])
        this.addTrip.get('vehicle_provider').setValue(data['rental_charges'][0]['vehicle_provider']['id']);
        this.initialDetails.vehicle_provider = { label: data['rental_charges'][0]['vehicle_provider']['name'], value: '' }
      }

      if (data['rental_charges'][0]['lpo']) {
        this.addTrip.get('lpo').setValue(data['rental_charges'][0]['lpo']['id']);
        this.initialDetails.lpo = { label: data['rental_charges'][0]['lpo']['name'], value: '' }
      }

    }
  }

  preFillSpecificationForOther(data) {
    if (Number(this.addTrip.get('vehicle_category').value) == 0) {
      if (data['freights'].length == 1) {
        if (data['freights'][0]['specification']) {
          this.addTrip.get('specification').setValue(data['freights'][0]['specification']['id']);
          this.initialDetails.specification = { label: data['freights'][0]['specification']['name'], value: '' }
        }
      }
    }
    this.getVehicleList();
  }

  patchCustomerAndRouteCodeAndTenderNumber(customerId, routeCode, tenderNumber) {
    this.addTrip.patchValue({
      vehicle_category: '0',
      customer: customerId,
      bdp_tender_number: tenderNumber
    });
    this.initialDetails.jobfrom = this.jobFromList[2]
    this.addTrip.get('job_from.type').setValue(2)
    this.isCustomerChanged = true;
    const selectedParty = this.partyList.find(party => party.id == customerId);
    if (selectedParty) {
      this.initialDetails.customer = { label: selectedParty['party_display_name'], value: '' }
    }
    this.routeCodeBdp = routeCode;
    this.getVehicleSpecifications();
    this.initialDetailsOnClientSelected();
    setUnsetValidators(this.addTrip, 'specification', [Validators.nullValidator])
    this.getVehicleList();
    setTimeout(() => {
      this.isCatagorySelected = true;
      this.isCustomerChanged = false;
    }, 100);
  }

  resetVehicleFonfo() {
    this.addTrip.patchValue({
      c_vehicle: null,
      driver: '',
      vehicle_provider: '',
      is_transporter: false,
      lpo: null,
      specification: '',
    });
    this.initialDetails.driver = getBlankOption();
    this.initialDetails.specification = getBlankOption();
    this.initialDetails.vehicle_provider = getBlankOption();
    this.initialDetails.vehicle = getBlankOption();
    this.initialDetails.lpo = getBlankOption();
    this.vehicleType = '';
    this.vehicleSpecFor3and4 = '';
    setUnsetValidators(this.addTrip, 'vehicle_provider', [Validators.nullValidator])
    this.isTransporterTrip = false;
  }


  openAddPartyModal($event, type) {
    if ($event) {
      if (type == 'client') {
        this.vendor = false;
      } else {
        this.vendor = true;
      }
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

  assetOneSelected() {
    let asset1 = this.addTrip.get('asset_1').value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset1);
    if (isValidValue(selectedAsset)) {
      this.getDocsExpiryLIst();
      this.asset1Specification = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name
    } else {
      this.asset1Specification = '';
    }
  }
  assetTwoSelected() {
    let asset2 = this.addTrip.get('asset_2').value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset2);
    if (isValidValue(selectedAsset)) {
      this.getDocsExpiryLIst();
      this.asset2Specification = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name
    } else {
      this.asset2Specification = '';
    }
  }
  assetThreeSelected() {
    let asset3 = this.addTrip.get('asset_3').value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset3);
    if (isValidValue(selectedAsset)) {
      this.getDocsExpiryLIst();
      this.asset3Specification = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name
    } else {
      this.asset3Specification = '';
    }
  }



  addPartyToOption($event) {
    if ($event.status && this.partyType == this.vehicleprovider) {
      this.getPartyTripDetails();
      this.initialDetails.vehicle_provider = { value: $event.id, label: $event.label };
      this.addTrip.get('vehicle_provider').setValue($event.id);
      this.getLpoList($event.id);
      this.initialDetails.lpo = getBlankOption();
      this.addTrip.get('lpo').setValue(null);
    }
    if ($event.status && this.partyType == this.billingParty) {
      this.initialDetails.customer = { value: $event.id, label: $event.label };
      this.addTrip.get('customer').setValue($event.id);
      this.getPartyTripDetails();
      this.contactPersonList = [];

    }

  }

  onVehicleProviderSelection() {
    this.initialDetails.lpo = getBlankOption();
    this.addTrip.get('lpo').setValue(null);
    const vehicleProvider = this.addTrip.get('vehicle_provider').value
    this.getLpoList(vehicleProvider);
  }


  getPartyTripDetails() {
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients']
      this.partyListVendor = partyList['vendors']
    })
  }

  onvendorSelected() {
    this.isLinkedClicked=false;
    this.initialDetailsOnClientSelected();
    this.resetHeadForm();
    this.isCustomerChanged = true;
    this.routeCodeBdp = '';
    this.getWOAndQO();
    let vehicleCategory = Number(this.addTrip.get('vehicle_category').value)
    if (vehicleCategory == 4) {
      setTimeout(() => {
        this.addTrip.get('type_of_movement').setValue('1')
        this.initialDetails.typeOfMovement = this.movementTypes.find(momentVal => momentVal.value == '1')
        this.movementTypeChanged();
      }, 200);

    }
    setTimeout(() => {
      this.isCustomerChanged = false;
    }, 100);
    this.getDocsExpiryLIst();
    this.makeJobFromDisabled();
    this.getPointOfContactsList(this.addTrip.get('customer').value)
  }

  makeJobFromDisabled() {
    if (Number(this.addTrip.get('vehicle_category').value) == 4) {
      this.addTrip.get('job_from.type').setValue(2)
      this.jobfromChange()
    }
  }


  initialDetailsOnClientSelected() {
    let customer = this.addTrip.get('customer').value;
    this._partyService.getPartyAdressDetails(customer).subscribe((response) => {
      if(isValidValue(response['result']?.party_approver)){
        this.isPartyApproverAvailable=true 
      }else{
        this.isPartyApproverAvailable=false 
      }
    });
    if (customer) {
      let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == customer)[0].contacts)
      if (isArray(contactPersonList)) {
        this.contactPersonList = contactPersonList
      }
    }
  }



  addValueToPartyPopup(event, partyType) {
    if (event) {
      this.partyNamePopup = event;
      this.partyType = partyType;
    }
  }

  getVehicleList() {
    this.vehicleList = [];
    let specification = '';
    let vehicleCategory = this.addTrip.get('vehicle_category').value
    if (Number(vehicleCategory) == 1 || Number(vehicleCategory) == 2) {
      specification = this.addTrip.get('specification').value
      if (specification) {
        this.getVehicleListByCatagory(vehicleCategory, specification)
      }
    } else if (Number(vehicleCategory) == 4) {
      this.getVehicleListByCatagory(3, specification)
    }
    else {
      this.getVehicleListByCatagory(vehicleCategory, specification)
    }
  }


  getVehicleListByCatagory(vehicleCategory, specification) {
    if (vehicleCategory == 3 || vehicleCategory == 0) {
      const trailerHed$ = this._vehicleService.getVehicleListByCatagory(3, '')
      const othersVehicle$ = this._vehicleService.getVehicleListByCatagory(0, '')
      forkJoin([trailerHed$, othersVehicle$]).subscribe(([trailerHed, othersVehicle]) => {
        this.vehicleList = [...trailerHed['result']['veh'], ...othersVehicle['result']['veh']];
      })
    }else if(vehicleCategory==10){
      this._vehicleService.getVehicleListByCatagory(10, '').subscribe((response: any) => {
        this.vehicleList = response.result['veh'];
      });
    }
     else {
      this._vehicleService.getVehicleListByCatagory(vehicleCategory, specification).subscribe((response: any) => {
        this.vehicleList = response.result['veh'];
      });
    }

  }
  getAssetList() {
    this._vehicleService.getAssetList().subscribe((response) => {
      this.assetData = response.result;
    });
  }




  getTripId() {
    this._commonservice.getSuggestedIds('trip').subscribe(resp => {
      this.addTrip.get('trip_id').setValue(resp.result.trip)
    })
  }

  getDriverList() {
    this._companyTripGetApiService.getDrivers(employeeList => {
      this.driverList = employeeList;
    });
  }


  saveTrip(type: string, heading, isSubmit) {
    this.addRemoveValidators(this.addTrip, 'inspection_type', Number(this.addTrip.get('is_inspection_required').value) == 1 ? [Validators.required] : [Validators.nullValidator]);

    let form = this.addTrip;
    form.value['saving_as'] = type;
    this.heading_text = heading;
    this.is_Submit = isSubmit;
    if (form.valid) {
      if (Number(form.value['vehicle_category']) === 0) {
        if (Number(form.value['job_from']['type']) == 1) {
          let billingType = form.value['others']['client_freights']['freight_type']
          let totalUnits = form.value['others']['client_freights']['total_units']
          let unitType = this.billingType.find(type => type.value == billingType).label;
          let isSameSO = this.tripDetailsEditdata?.job_from['id'] == form.value['job_from']['id']
          if (billingType == 10) {
            if (this.tripId && isSameSO) {
              if ((this.workorderUnitStatus.total_units - this.workorderUnitStatus.utilized_units) < 0) {
                this.checkSalesOrderUnits(cloneDeep(form.value), "Jobs")

              } else {
                this.vehicleCatagoryOthersAsve(cloneDeep(form.value))
                this.checkingForvalidation();

              }
            } else {
              if ((this.workorderUnitStatus.total_units - this.workorderUnitStatus.utilized_units - 1) < 0) {
                this.checkSalesOrderUnits(cloneDeep(form.value), "Jobs")

              } else {
                this.vehicleCatagoryOthersAsve(cloneDeep(form.value))
                this.checkingForvalidation();

              }
            }

          } else {
            if (this.tripId && isSameSO) {
              let usedUnitsInThisJob = this.tripDetailsEditdata['other']['client_freights'][0]['total_units']
              if ((this.workorderUnitStatus.total_units - this.workorderUnitStatus.utilized_units - totalUnits + usedUnitsInThisJob) < 0) {
                this.checkSalesOrderUnits(cloneDeep(form.value), unitType)
              } else {
                this.vehicleCatagoryOthersAsve(cloneDeep(form.value))
                this.checkingForvalidation();
              }
            } else {
              if ((this.workorderUnitStatus.total_units - this.workorderUnitStatus.utilized_units - totalUnits) < 0 || (this.workorderUnitStatus.total_units - this.workorderUnitStatus.utilized_units) == 0) {
                this.checkSalesOrderUnits(cloneDeep(form.value), unitType)
              }
              else {
                this.vehicleCatagoryOthersAsve(cloneDeep(form.value))
                this.checkingForvalidation();

              }
            }

          }



        } else {
          this.vehicleCatagoryOthersAsve(cloneDeep(form.value))
          this.checkingForvalidation();
        }
      }
      if (Number(form.value['vehicle_category']) === 1) {
        this.vehicleCatagoryCrane(cloneDeep(form.value))
        this.checkingForvalidation();

      }
      if (Number(form.value['vehicle_category']) === 2) {
        this.vehicleCatagoryAWP(cloneDeep(form.value))
        this.checkingForvalidation();
      }
      if (Number(form.value['vehicle_category']) === 4) {
        this.vehicleCatagoryContainer(cloneDeep(form.value))
        this.checkingForvalidation();
      }
      if (Number(form.value['vehicle_category']) === 10) {
        this.vehicleCatagoryInternalJob(cloneDeep(form.value))
        this.dataForSubmission['saving_as'] = 'save_and_submit';
        this.dataForSubmission['approval_remark'] = ''
        this.saveApi(this.dataForSubmission)
      }
    } else {
      setAsTouched(form);
      this.isFormValid.next(form.valid)
      this._scrollToTop.scrollToTop();
      console.log(form)
    }
  }

  checkSalesOrderUnits(formValue, unitsType) {
    let message = ''
    if (this.workorderUnitStatus.utilized_units == 0) {
      message = `You have Sales Order created for ${this.workorderUnitStatus.total_units} ${unitsType} . Are you sure you want to increase the no. of ${unitsType}?`
    } else if (this.workorderUnitStatus.utilized_units >= this.workorderUnitStatus.total_units) {

      message = `Your Sales Order of ${this.workorderUnitStatus.total_units} ${unitsType} has been fulfilled. Are you sure you want to proceed?`

    } else {
      message = `You have SO created for ${this.workorderUnitStatus.total_units} ${unitsType} .${this.workorderUnitStatus.utilized_units} ${unitsType} have been utilized. Are you sure you want to increase the no. of ${unitsType}?`
    }
    const dialogRef = this.dialog.open(DeleteAlertComponent, {
      minWidth: '25%',
      data: {

        message: message
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
      if (result) {
        this.vehicleCatagoryOthersAsve(cloneDeep(formValue))
        this.checkingForvalidation();
      }
      dialogRefSub.unsubscribe();
    });
  }

  callSaveApi(formValue) {
    this.saveApi(formValue);
  }

  saveApi(formValue) {
    if (!this.isTransporterTrip) {
      if (!formValue['driver']) {
        formValue['driver'] = []
      } else {
        formValue['driver'] = formValue['driver'].map(driver => driver.id)
      }
    } else {
      if (!formValue['driver']) {
        formValue['driver'] = '';
      }
    }
    if (this.tripId) {
      this.apiHandler.handleRequest(this._newTripService.putTrips(this.tripId, formValue), 'Job updated successfully!').subscribe(
        {
          next: (resp) => {
            this._route.navigate([this.preFixUrl + '/trip/new-trip/details', resp['result']])
          },
          error: () => {
            this.apiError = 'Failed to update job!';
            setTimeout(() => (this.apiError = ''), 3000);
          },
        }
      )
    } else {
      this.apiHandler.handleRequest(this._newTripService.postTrips(formValue), 'Job added successfully!').subscribe(
        {
          next: (resp) => {
            this._route.navigate([this.preFixUrl + '/trip/new-trip/details', resp['result']])
          },
          error: () => {
            this.apiError = 'Failed to add job!';
            setTimeout(() => (this.apiError = ''), 3000);
          },
        }
      );

    }

  }

  rateCardQuotationPreviousValues(event) {
    this.rateCardQuotationApiValues = event;

  }

  checkingForvalidation() {
    this.failedValidations = [];
    let stoppedValidations = [];
    let type = Number(this.addTrip.get('job_from.type').value);
    let category = this.addTrip.get('vehicle_category').value;
    if (this.isApprovalConfigured) {
      this.validationDetailsList.forEach((data) => {
        if (data.validation_key.includes('customer_credit_limit')) {
          if (this.checkCreditLimit && Number(this.creditLimit) < Number(this.totalValue)) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('customer_document')) {
          if (this.areCertificatesExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('customer_grace_period')) {
          if (this.grace_period_expired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_certificate')) {
          if (this.isVehicleDocExpired || this.isAssetCertificateExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('operator_document')) {
          if (this.isDriversDocExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_spec_so')) {
          let spec = this.addTrip.get('specification').value;
          const type = this.addTrip.get('job_from.type').value
          if (Number(type) == 1 && Number(category) != 0 && !(Number(category) > 2) && spec !== this.salesOrderSpec) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('quotation_validity')) {
          if (this.quotationExpiryDate && type == 0) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_sub_assets')) {
          if (this.isVehicleSubAssetExpired || this.isAssetSubAssetExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_tyre')) {
          if (this.isVehicleTyreExpired || this.isAssetTyreExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_permit')) {
          if (data.condition_key === 'is_expired' && this.isVehiclePermitExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
          if (data.condition_key === 'is_restricted' && this.isPermitNotFound) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if((category==1 || category ==2) &&  data.validation_key.includes('customer_rate_card')){
          if(!this.isCustomerRateCardExisted){
            this.failedValidations.push(data);
          }if(!this.isCustomerRateCardExisted && data.action_key ==='stop_job_create'){
            stoppedValidations.push(true)
          }
        } 
        if (data.validation_key.includes('price') && category != 0 && !(category>2)) {
          let spec = this.addTrip.get('specification').value;
          let actucalRentalCharge = Number(this.rentalChargesArray[0].rental_charge);
          let actualExtraHours = Number(this.rentalChargesArray[0].extra_hours);
          let fuel_Provision = this.rateCardQuotationApiValues['fuelProvision'];
          let working_duration = this.rateCardQuotationApiValues['working_duration'];

          if (data.value === 'Sales Order' && type == 1) {
            if (this.rateCardQuotationApiValues.hasOwnProperty(spec)) {

              let typeOfRateCard = this.rateCardQuotationApiValues['billing_type'] + '_sales_order_rate_card';
              if (this.rateCardQuotationApiValues[spec].hasOwnProperty(typeOfRateCard)) {
                let prefilledSalesOrderRentalValue = this.rateCardQuotationApiValues[spec][typeOfRateCard][working_duration][fuel_Provision];
                let prefilledSalesExtraHoursValue = this.rateCardQuotationApiValues[spec][typeOfRateCard][working_duration]['additional_hours'];
                if (Number(actucalRentalCharge) < Number(prefilledSalesOrderRentalValue) || (Number(actualExtraHours) < Number(prefilledSalesExtraHoursValue)) && !this.failedValidations.some(ele => ele.id === data.id)) {
                  this.failedValidations.push(data);
                  if (data.action_key === 'stop_job_create') {
                    stoppedValidations.push(true);
                  }
                }
              }

            }
          }
          if (data.value === 'Quotation' && type == 0) {
            if (this.rateCardQuotationApiValues.hasOwnProperty(spec)) {
              let typeOfRateCard = this.rateCardQuotationApiValues['billing_type'] + '_quotation_rate_card';
              if (this.rateCardQuotationApiValues[spec].hasOwnProperty(typeOfRateCard)) {
                let prefilledSalesOrderRentalValue = this.rateCardQuotationApiValues[spec][typeOfRateCard][working_duration][fuel_Provision];
                let prefilledSalesExtraHoursValue = this.rateCardQuotationApiValues[spec][typeOfRateCard][working_duration]['additional_hours'];
                if (Number(actucalRentalCharge) < Number(prefilledSalesOrderRentalValue) || (Number(actualExtraHours) < Number(prefilledSalesExtraHoursValue)) && !this.failedValidations.some(ele => ele.id === data.id)) {
                  this.failedValidations.push(data);
                  if (data.action_key === 'stop_job_create') {
                    stoppedValidations.push(true);
                  }
                }
              }
            }
          }

          if (data.value === 'Rate Card') {
            let typeOfRateCard = this.rateCardQuotationApiValues['billing_type'] + '_rate_card';
            if (this.rateCardQuotationApiValues.hasOwnProperty(spec) && Object.keys(this.rateCardQuotationApiValues[spec]).some(key => key === typeOfRateCard)) {
              let fuel_Provision = this.rateCardQuotationApiValues['fuelProvision'];
              let working_duration = this.rateCardQuotationApiValues['working_duration'];
              let rateValue = this.rateCardQuotationApiValues[spec][typeOfRateCard][working_duration][fuel_Provision];
              let prefiled_extra_hours_value = this.rateCardQuotationApiValues[spec][typeOfRateCard][working_duration]['additional_hours'];
              if ((Number(actucalRentalCharge) < Number(rateValue)) || (Number(actualExtraHours) < Number(prefiled_extra_hours_value)) && !this.failedValidations.some(ele => ele.id === data.id)) {
                this.failedValidations.push(data);
                if (data.action_key === 'stop_job_create') {
                  stoppedValidations.push(true);
                }
              }
            }
          }
        }
        if (data.validation_key.includes('price') && Number(category) == 0 && !(Number(category) > 2) && type != 2) {
          let isFreightIncreased: boolean;
          if (Number(this.actualFreightValues.freight_type) == 10) {
            isFreightIncreased = Number(this.actualFreightValues.freight_amount) < Number(this.freightValuesOfSoOrQuotation.rate);
          } else {
            isFreightIncreased = Number(this.actualFreightValues.rate) < Number(this.freightValuesOfSoOrQuotation.rate);
          }
          if (data.value === 'Quotation' && type == 0 && isFreightIncreased) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true);
            }
          }
          if (data.value === 'Sales Order' && type == 1 && isFreightIncreased) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true);
            }
          }
        }
        if(data.validation_key.includes('price') && data.value === 'Rate Card' && Number(category) == 4 && (this.dataForSubmission['job_type'] != null && Number(this.dataForSubmission['type_of_movement'])== 1 || Number(this.dataForSubmission['type_of_movement'])== 2)  ){
          let freightData = this.dataForSubmission['container']?.['client_freights'][0]
          if(Number(freightData?.freight_type)==11){
            let scopeOfWork = this.sowList.find(ele => ele.value == Number(this.dataForSubmission['movement_sow'])).key
            let containerJobType = this.containerJobType.find(ele => Number(ele.id) == Number(this.dataForSubmission['job_type'])).key
            if(Number(freightData?.rate) < this.commonRateCardvalues?.[scopeOfWork]?.[containerJobType]){
              this.failedValidations.push(data);
              if (data.action_key === 'stop_job_create') {
                stoppedValidations.push(true);
              }
            }
          }
          
        }

      })
      if(this.isPartyApproverRequired&&!this.isPartyApproverAvailable){
        this.failedValidations.push(this.partyApproverErrorMesg)
         stoppedValidations.push(true);
      } 
      if (this.failedValidations.length > 0 && stoppedValidations.length > 0) {
        this.is_Submit = false;
        this.heading_text = 'Validation Failed';
        this.openValidationPopup(this.dataForSubmission)
      } else if (this.failedValidations.length > 0 && stoppedValidations.length == 0) {
        this.is_Submit = true;
        this.heading_text = 'Send Approval';
        this.dataForSubmission['saving_as'] = 'send_for_approval';
        this.openValidationPopup(this.dataForSubmission)
      } else if (this.failedValidations.length == 0 && this.is_Submit) {
        this.openValidationPopup(this.dataForSubmission)
      }
      else {
        this.dataForSubmission['approval_remark'] = ''
        this.saveApi(this.dataForSubmission)
      }
    } else {
      this.dataForSubmission['saving_as'] = 'save_and_submit';
      this.dataForSubmission['approval_remark'] = ''
      this.saveApi(this.dataForSubmission)
    }

  }

  openValidationPopup(formdata) {
    const dialogRef = this.dialog.open(AddTripV2ValidationComponent, {
      data: {
        data: this.failedValidations,
        heading: this.heading_text,
        is_Submit: this.is_Submit
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if (isValidValue(item) && item.is_approved) {
        formdata['approval_remark'] = item.remarkValue
        this.saveApi(formdata)
      }
      dialogRefSub.unsubscribe();
    });
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

  getLpoList(id) {
    this._lpoService.getLopListByVendor(id).subscribe(resp => {
      this.lpoList = resp['result']['lpo']
    })
  }
  vehicleCatagoryContainer(formValue) {
    delete formValue['no'];
    delete formValue['date'];
    delete formValue['no_of_containers'];    
    formValue['container']['client_freights'] = [formValue['container']['client_freights']]
    formValue['container']['vehicle_freights'] = this.isTransporterTrip ? [formValue['container']['vehicle_freights']] : []
    formValue['container']['other_details'] = this.processCutsomFieldData(formValue['container']['other_details']['other_details'])
    formValue['container']['path'] = this.processMultipleDestinationFormData(formValue['container']['destinations']['start_end_destination']);
    formValue['container']['driver_allowances'] = this.isTransporterTrip ? [] : this.processDriverAllowance(formValue['container']['driver_allowances']['self_driver'])
    formValue['container']['documents'] = formValue['container']['documents'].map(doc => doc.id);
    this.totalValue = formValue['container']['client_freights'][0].freight_amount;
    formValue['container']['materials'] = formValue['container']['materials']['materials']
      .filter(item => {
        let values = Object.values(item);
        return values.some(ele => {
          if (typeof ele === 'string' || Array.isArray(ele)) {
            return ele.length > 0;
          } else if (typeof ele === 'number') {
            return ele !== 0;
          } else {
            return ele != null;
          }
        });
      })
    delete formValue['container']['destinations'];
    delete formValue['inspection_type'];
    this.dataForSubmission = formValue;
  }

  vehicleCatagoryOthersAsve(formValue) {
    formValue['type_of_movement'];
    formValue['no'];
    formValue['date'];
    formValue['no_of_containers'];
    formValue['is_inspection_required'];
    formValue['date'] = changeDateToServerFormat(formValue['date'])
    formValue['inspection_type'] = formValue['inspection_type'].map(item => item.id);
    formValue['others']['client_freights'] = [formValue['others']['client_freights']]
    formValue['others']['vehicle_freights'] = this.isTransporterTrip ? [formValue['others']['vehicle_freights']] : []
    formValue['others']['other_details'] = this.processCutsomFieldData(formValue['others']['other_details']['other_details'])
    formValue['others']['path'] = this.processMultipleDestinationFormData(formValue['others']['destinations']['start_end_destination'])
    formValue['others']['driver_allowances'] = this.isTransporterTrip ? [] : this.processDriverAllowance(formValue['others']['driver_allowances']['self_driver'])
    formValue['others']['documents'] = formValue['others']['documents'].map(doc => doc.id)
    formValue['others']['materials'] = formValue['others']['materials']['materials']
    delete formValue['others']['destinations'];
    delete formValue['others']['materials']['materials']
    this.dataForSubmission = formValue;
    this.totalValue = formValue['others']['client_freights'][0].freight_amount;
    this.actualFreightValues = cloneDeep(formValue['others']['client_freights'][0]);

  }

  vehicleCatagoryInternalJob(formValue) {
    formValue['type_of_movement'];
    formValue['no'];
    formValue['date'];
    formValue['no_of_containers'];
    formValue['is_inspection_required'];
    formValue['movement_sow'];
    formValue['inspection_type'] = []
    formValue['date'] = changeDateToServerFormat(formValue['date'])
    formValue['internal_job']['vehicle_freights'] = this.isTransporterTrip ? [formValue['internal_job']['vehicle_freights']] : []
    formValue['internal_job']['other_details'] = this.processCutsomFieldData(formValue['internal_job']['other_details']['other_details'])
    formValue['internal_job']['path'] = this.processMultipleDestinationFormData(formValue['internal_job']['destinations']['start_end_destination'])
    formValue['internal_job']['driver_allowances'] = this.isTransporterTrip ? [] : this.processDriverAllowance(formValue['internal_job']['driver_allowances']['self_driver'])
    formValue['internal_job']['documents'] = formValue['internal_job']['documents'].map(doc => doc.id)
    formValue['internal_job']['materials'] = formValue['internal_job']['materials']['materials']
    delete formValue['internal_job']['destinations'];
    delete formValue['internal_job']['materials']['materials']
    this.dataForSubmission = formValue;

  }

  vehicleCatagoryCrane(formValue) {
    delete formValue['type_of_movement'];
    delete formValue['no'];
    delete formValue['date'];
    delete formValue['no_of_containers'];
    delete formValue['is_inspection_required'];
    delete formValue['inspection_type'];

    formValue['crane']['driver_allowances'] = this.isTransporterTrip ? [] : this.processDriverAllowance(formValue['crane']['driver_allowances']['self_driver'])
    formValue['crane']['rental_charge']['no_of_shifts'] = Number(formValue['crane']['rental_charge']['no_of_shifts']) == 1 ? 0 : 1
    formValue['crane']['rental_charge']['fuel_type'] = Number(formValue['crane']['rental_charge']['fuel_type']) == 1 ? 0 : 1
    formValue['crane']['market_rental_charge']['market_no_of_shifts'] = Number(formValue['crane']['market_rental_charge']['market_no_of_shifts']) == 1 ? 0 : 1
    formValue['crane']['market_rental_charge']['market_fuel_type'] = Number(formValue['crane']['market_rental_charge']['market_fuel_type']) == 1 ? 0 : 1
    formValue['crane']['other_details'] = []
    formValue['crane']['documents'] = formValue['crane']['documents'].map(doc => doc.id)
    formValue['crane']['location_details']['end_date'] = changeDateTimeToServerFormat(formValue['crane']['location_details']['job_end_date'])
    formValue['crane']['location_details']['start_date'] = changeDateTimeToServerFormat(formValue['crane']['location_details']['job_start_date'])
    delete formValue['crane']['location_details']['job_end_date']
    delete formValue['crane']['location_details']['job_start_date']
    formValue['crane']['location_details']['checklist'].forEach(checkListItem => {
      if (typeof checkListItem['field_type'] != 'string') {
        checkListItem['field_type'] = checkListItem['field_type']['data_type']
      }
    });
    this.dataForSubmission = formValue;
    this.price_validationDetails = formValue['crane']['price_validation_details'];
    this.rentalChargesArray = formValue['crane']['rental_charge']['rental_charges'];
    this.totalValue = formValue['crane']['rental_charge']['rental_charges'][0].total_amount;
    this.workingDuration = formValue['crane']['rental_charge']['working_duration']['working'];
    this.fuelProvision = formValue['crane']['rental_charge']['fuel_type'];


  }

  vehicleCatagoryAWP(formValue) {
    delete formValue['type_of_movement'];
    delete formValue['no'];
    delete formValue['date'];
    delete formValue['no_of_containers'];
    delete formValue['is_inspection_required'];
    delete formValue['inspection_type'];

    formValue['awp']['driver_allowances'] = this.isTransporterTrip ? [] : this.processDriverAllowance(formValue['awp']['driver_allowances']['self_driver'])
    formValue['awp']['rental_charge']['no_of_shifts'] = Number(formValue['awp']['rental_charge']['no_of_shifts']) == 1 ? 0 : 1
    formValue['awp']['rental_charge']['fuel_type'] = Number(formValue['awp']['rental_charge']['fuel_type']) == 1 ? 0 : 1
    formValue['awp']['market_rental_charge']['market_no_of_shifts'] = Number(formValue['awp']['market_rental_charge']['market_no_of_shifts']) == 1 ? 0 : 1
    formValue['awp']['market_rental_charge']['market_fuel_type'] = Number(formValue['awp']['market_rental_charge']['market_fuel_type']) == 1 ? 0 : 1
    formValue['awp']['other_details'] = []
    formValue['awp']['documents'] = formValue['awp']['documents'].map(doc => doc.id)
    formValue['awp']['location_details']['end_date'] = changeDateTimeToServerFormat(formValue['awp']['location_details']['job_end_date'])
    formValue['awp']['location_details']['start_date'] = changeDateTimeToServerFormat(formValue['awp']['location_details']['job_start_date'])
    delete formValue['awp']['location_details']['job_end_date']
    delete formValue['awp']['location_details']['job_start_date']
    formValue['awp']['location_details']['checklist'].forEach(checkListItem => {
      if (typeof checkListItem['field_type'] != 'string') {
        checkListItem['field_type'] = checkListItem['field_type']['data_type']
      }
    });
    this.dataForSubmission = formValue;
    this.price_validationDetails = formValue['awp']['price_validation_details'];
    this.rentalChargesArray = formValue['awp']['rental_charge']['rental_charges'];
    this.totalValue = formValue['awp']['rental_charge']['rental_charges'][0].total_amount;
    this.workingDuration = formValue['awp']['rental_charge']['working_duration']['working'];
    this.fuelProvision = formValue['awp']['rental_charge']['fuel_type'];


  }
  processCutsomFieldData(customFieldData) {
    customFieldData.forEach((item) => {
      if (item['field_type'] == "checkbox") {
        if (item.value == "false" || item.value == false) {
          item['value'] = ''
        }
      }
      if (item['field_type'] == "date") {
        item['value'] = changeDateToServerFormat(item['value'])
      }
      if (item['field_type'] != "datetime") {
        item['value'] = (item['value'].toString())
      }
    });

    return customFieldData
  }

  processDriverAllowance(allowanceData = []) {
    let allowance = []
    allowanceData.forEach(item => {
      if (item['employee'] && Number(item['paid']) > 0) {
        if (item['account'] == "paid_by_driver") {
          item['is_driver_paid'] = true;
          item['account'] = null;
        } else {
          item['is_driver_paid'] = false;
        }
        item['transaction_date'] = changeDateToServerFormat(item['transaction_date'])
        allowance.push(item)
      }
    })

    return allowance
  }

  processMultipleDestinationFormData(data) {
    let destinations = [];
    destinations = cloneDeep(data)
    if (destinations.length > 0) {
      destinations.forEach((destination, index) => {
        if (index == 0) {
          destination['time'] = changeDateTimeToServerFormat(destination['time'] ? moment(destination['time']) : null);
        } else {
          destination['time'] = changeDateTimeToServerFormat(destination['reach_time'] ? moment(destination['reach_time']) : null)
        }
        delete destination.reach_time
        if (destination['checklist'].length > 0) {
          destination['checklist'].forEach(checkListItem => {
            if (typeof checkListItem['field_type'] != 'string')
              checkListItem['field_type'] = checkListItem['field_type']['data_type']
          });
        }
        if (destination.hasOwnProperty('inspection_type') && destination['inspection_type'].length > 0) {
          destination['inspection_type'] = destination['inspection_type'].map(inspection => inspection.id)
        }
      })
    }
    return destinations
  }

  getTripDetails() {
    this._newTripService.getTripDetails(this.tripId).subscribe(resp => {
      this.tripDetailsEditdata = cloneDeep(resp['result'])
      this.patchHeadForm()
    })
  }

  patchHeadForm() {
    this.isCustomerChanged = true;
    this.isCatagorySelected = true;
    if (this.tripDetailsEditdata['c_vehicle']) {
      this.initialDetails.vehicle = { label: this.tripDetailsEditdata['c_vehicle']['name'], value: this.tripDetailsEditdata['c_vehicle']['id'] };
      this.tripDetailsEditdata['c_vehicle'] = this.tripDetailsEditdata['c_vehicle']['id']
    }

    if (this.tripDetailsEditdata['customer']) {
      this.initialDetails.customer = { label: this.tripDetailsEditdata['customer']['name'], value: this.tripDetailsEditdata['customer']['id'] };
      this.tripDetailsEditdata['customer'] = this.tripDetailsEditdata['customer']['id']
    }

    if (this.tripDetailsEditdata['vehicle_provider']) {
      this.initialDetails.vehicle_provider = { label: this.tripDetailsEditdata['vehicle_provider']['name'], value: this.tripDetailsEditdata['vehicle_provider']['id'] };
      this.tripDetailsEditdata['vehicle_provider'] = this.tripDetailsEditdata['vehicle_provider']['id']
      this.getLpoList(this.tripDetailsEditdata['vehicle_provider'])
    }
    if (this.tripDetailsEditdata['lpo']) {
      this.initialDetails.lpo = { label: this.tripDetailsEditdata['lpo']['name'], value: this.tripDetailsEditdata['lpo']['id'] };
      this.tripDetailsEditdata['lpo'] = this.tripDetailsEditdata['lpo']['id']
    }
    if (this.tripDetailsEditdata['asset_1']) {
      this.initialDetails.assetOne = { label: this.tripDetailsEditdata['asset_1']?.['name'], value: this.tripDetailsEditdata['asset_1']?.['id'] };
      this.tripDetailsEditdata['asset_1'] = this.tripDetailsEditdata['asset_1']?.['id']
    }
    if (this.tripDetailsEditdata['asset_2']) {
      this.initialDetails.assetTwo = { label: this.tripDetailsEditdata['asset_2']?.['name'], value: this.tripDetailsEditdata['asset_2']?.['id'] };
      this.tripDetailsEditdata['asset_2'] = this.tripDetailsEditdata['asset_2']?.['id']
    }
    if (this.tripDetailsEditdata['asset_3']) {
      this.initialDetails.assetThree = { label: this.tripDetailsEditdata['asset_3']?.['name'], value: this.tripDetailsEditdata['asset_3']?.['id'] };
      this.tripDetailsEditdata['asset_3'] = this.tripDetailsEditdata['asset_3']?.['id']
    }
    if (this.tripDetailsEditdata['poc']) {
      this.initialDetails.poc = { label: this.tripDetailsEditdata['poc']?.['display_name'], value: this.tripDetailsEditdata['poc']?.['id'] };
      this.tripDetailsEditdata['poc'] = this.tripDetailsEditdata['poc']?.['id']
    }

    if (this.tripDetailsEditdata['is_inspection_required'] == 1) {
      this.initialDetails.inspectionRequired = this.inspectionRequired[1];
    } else {
      this.initialDetails.inspectionRequired = this.inspectionRequired[0];
    }
    if (this.tripDetailsEditdata['movement_sow']) {
      this.initialDetails.sow = this.sowList.find(value => value.value == this.tripDetailsEditdata['movement_sow'])
    }
    let typeMatched = this.movementTypes.find(ele => ele.value == this.tripDetailsEditdata['type_of_movement']);
    this.initialDetails.typeOfMovement = typeMatched
    let jobType = this.containerJobType.find(ele => ele.id == this.tripDetailsEditdata['job_type'])
    if (jobType) {
      this.initialDetails.jobType = { 'label': jobType.label, value: '' }
    }
    if (this.tripDetailsEditdata['job_from']) {
      this.initialDetails.jobfrom = this.jobFromList.find(jobFrom => jobFrom.value == this.tripDetailsEditdata['job_from']['type'])
      if (this.tripDetailsEditdata['job_from']['type'] != 2) {
        this.initialDetails.jobfromValue = { label: this.tripDetailsEditdata['job_from']['name'], value: this.tripDetailsEditdata['job_from']['id'] }
        if (this.tripDetailsEditdata['job_from']['type'] == 1) {
          this.getWorkorderUnits(this.tripDetailsEditdata['job_from']['id'])
        }
      }
      if (this.tripDetailsEditdata['job_from']['type'] == 2) {
        this.tripDetailsEditdata['job_from']['id'] = ''
      }
    }

    if (this.tripDetailsEditdata['specification']) {
      this.initialDetails.specification = { label: this.tripDetailsEditdata['specification']['specification'], value: this.tripDetailsEditdata['specification']['id'] };
      this.tripDetailsEditdata['specification'] = this.tripDetailsEditdata['specification']['id']
    }
    setTimeout(() => {
      let selectedVehicle = this.vehicleList.filter(item => item.id == this.tripDetailsEditdata['c_vehicle']);
      this.vehicleSpecFor3and4 = selectedVehicle[0]?.specification?.name
    }, 800);
    this.isTransporterTrip = this.tripDetailsEditdata['is_transporter']
    this.addTrip.patchValue(cloneDeep(this.tripDetailsEditdata));
    let customer = this.addTrip.get('customer').value;
    this._newTripService.getPointOfContactsList(customer).subscribe((response) => {
      this.pointOfContactsList = response['result'];
    })
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients']
      this.partyListVendor = partyList['vendors']
      if (customer) {
        let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == customer)[0].contacts)
        if (isArray(contactPersonList)) {
          this.contactPersonList = contactPersonList
        }
      }
      this.isFormValid.next(true)
      this.workOrderDetails.next('')
      this.quotationDetails.next('')
      this.tripDetails.next(cloneDeep(this.tripDetailsEditdata));
      setTimeout(() => {
        this.isCustomerChanged = false;
      }, 500);
    })
    const vehicle_category = this.addTrip.get('vehicle_category').value
    if (Number(vehicle_category) == 0 || Number(vehicle_category) == 4 || Number(vehicle_category) == 10) {
      setUnsetValidators(this.addTrip, 'specification', [Validators.nullValidator])
    } else {
      setUnsetValidators(this.addTrip, 'specification', [Validators.required])
    }
    setUnsetValidators(this.addTrip,'customer',vehicle_category ==10 ? [Validators.nullValidator]: [Validators.required])
    vehicle_category !=10 && this._newTripService.getWOAndQO(customer, vehicle_category).subscribe(resp => {
      this.quotationList = resp.result['qo'];
      this.salesOrderList = resp.result['wo']
      this.quotationListOrsalesOrderList = this.salesOrderList;
      if (Number(this.tripDetailsEditdata['job_from']['type']) == 0) {
        this.quotationListOrsalesOrderList = this.quotationList;
      }
    })

    if (!this.isTransporterTrip && this.tripDetailsEditdata['c_vehicle']) {
      this.vehicleType = 'Own Vehicle';
    }
    if (this.isTransporterTrip && this.tripDetailsEditdata['c_vehicle']) {
      this.vehicleType = 'Market Vehicle';
      this.addTrip.get('driver').setValue(this.tripDetailsEditdata['market_driver']);
    }
    this.apiCalForPreviousWoQuotValues()
    this.getVehicleSpecifications();
    if (this.tripDetailsEditdata['status'] != 0) {
      this.isFieldEditable = false;
    }
    if (this.tripDetailsEditdata['status'] == 1) {
      this.disableTypeOfMovementAndSow = true;
    }
    let date
    if (vehicle_category == 1) {
      date = this.tripDetailsEditdata['crane']['location_details']['start_date'];
    }
    if (vehicle_category == 2) {
      date = this.tripDetailsEditdata['awp']['location_details']['start_date'];
    }
    if (Number(vehicle_category) == 0 || Number(vehicle_category) == 4) {
      setTimeout(() => {
        this.assetOneSelected();
        this.assetTwoSelected();
        this.assetThreeSelected();
      }, 400);
      date = this.tripDetailsEditdata?.['start_date'];
    }
    if (vehicle_category == 0) {
      date = this.tripDetailsEditdata['estimated_start_date'];
    }
    this.jobstartDate = moment(date).format('YYYY-MM-DD');
    setTimeout(() => {
      this.getDocsExpiryLIst();
    }, 500);
    this.getVehicleList();
    this.getApprovalLevelDetails(this.tripDetailsEditdata['vehicle_category'])

  }
  apiCalForPreviousWoQuotValues() {
    const id = this.addTrip.get('job_from.id').value
    const type = this.addTrip.get('job_from.type').value;
    let category = Number(this.addTrip.get('vehicle_category').value);
    let screen = '';
    let vehcategiorytext = '';
    if (category == 1 || category == 2) {
      if (category == 1) {
        vehcategiorytext = 'crane';
      } else {
        vehcategiorytext = 'awp';
      }
      if (Number(type) == 0) {
        screen = 'quotation'
        setTimeout(() => {
          this._newTripService.getWOAndQOdetails(id, screen).subscribe(resp => {
            this.quotationExpiryDate = resp['result']?.is_validity_expired;
            let working = this.tripDetailsEditdata[vehcategiorytext]['rental_charge']['working_duration']['working'];
            let fuelType = this.tripDetailsEditdata[vehcategiorytext]['rental_charge']['fuel_type'];
            let fuelSelection;
            if (fuelType == 1) {
              fuelSelection = 'with_fuel'
            } else {
              fuelSelection = 'without_fuel'
            };
            this.prevRentalCharge.next(resp['result']['rental_charges'][0][working][fuelSelection]);
          })
        }, 1500);
      } else if (Number(type) == 1) {
        screen = 'workorder'
        setTimeout(() => {
          this._newTripService.getWOAndQOdetails(id, screen).subscribe(resp => {
            this.prevRentalCharge.next(resp['result']['rental_charges'][0]['rental_charge']);
            this.salesOrderSpec = resp['result']?.rental_charges[0]?.specification?.id;
          })
        }, 1500);
      } else {
        screen = ''
      }
    } else {
      if (Number(category) == 0) {
        if (Number(type) == 0 || Number(type) == 1) {
          screen = type === 0 ? 'quotation' : 'workorder';
          setTimeout(() => {
            this._newTripService.getWOAndQOdetails(id, screen).subscribe(resp => {
              this.freightValuesOfSoOrQuotation = cloneDeep(resp['result']['freights'][0]);
            })
          }, 1500);
        } else {
          screen = ''
        }
      }
    }

  }

  getWorkorderUnits(id) {
    this._workorderServicev2.getWorkOrderUnitsStatus(id).subscribe(resp => {
      this.workorderUnitStatus = resp['result']
    })
  }

  customerRateCardExisted(rateCards:boolean[]){
    this.isCustomerRateCardExisted = rateCards.every(ratecard=> ratecard === true);
  }

  linkClicked(){
   this.isLinkedClicked=true;
  }

  commonRateCardValuesEmitter(event){    
    this.commonRateCardvalues = event['rateCard'];
  }

  getAddedPoC(event) {    
    if (event) {
      this.pointOfContactsList = [];
      this.addTrip.get('poc').setValue(null);
      this.initialDetails.poc = getBlankOption();
      this._newTripService.getPointOfContactsList(this.addTrip.get('customer').value).subscribe((response) => {
        this.addTrip.get('poc').setValue(event.id);
        this.pointOfContactsList = response.result;
        this.initialDetails.poc = {
          label: event.label,
          value: event.id
        };
      });
    }
  }

  addNewPoC(event) {
    this.pocURL = `report/party/poc/${this.addTrip.get('customer').value}/`;
    this.pocParam = {
      name: event
    }; 
  }

  getPointOfContactsList(id) {
    this.pointOfContactsList = [];
    isValidValue(id) && this._newTripService.getPointOfContactsList(id).subscribe((response) => {
      this.pointOfContactsList = response['result'];
      this.setDefaultPOC();
    })
  }

}

