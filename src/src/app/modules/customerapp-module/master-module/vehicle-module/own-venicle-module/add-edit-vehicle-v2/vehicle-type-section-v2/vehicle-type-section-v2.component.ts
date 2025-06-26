import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, isValidValue, } from 'src/app/shared-module/utilities/helper-utils';
import { EmployeeService } from '../../../../../api-services/master-module-services/employee-service/employee-service';
import { VehicleService } from '../../../../../api-services/master-module-services/vehicle-services/vehicle.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { OwnVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-service';
import { CreateVehicleService } from 'src/app/core/services/create-vehicle.service';
import { VehicleSettingService } from 'src/app/modules/orgainzation-setting-module/setting-module/vehicle-settings-module/vehicle-setting.service';
import { MatTabGroup } from '@angular/material/tabs';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-vehicle-type-section-v2',
  templateUrl: './vehicle-type-section-v2.component.html',
  styleUrls: ['./vehicle-type-section-v2.component.scss'],
})
export class VehicleTypeSectionV2Component implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  vehicleDetailsForm: UntypedFormGroup;
  regError: string = '';
  vehicleMake: any = [];
  vehicleModel: any = [];
  // vechileAlreadyAssignError: any = '';
  driverList: any;
  vehicleEmi: boolean = false;
  patterns = new ValidationConstants().VALIDATION_PATTERN;
  vechileTypeList = [];
  vehicleApi = 'vehicle/category/spec/'
  addVehicle: any = {};
  vehicleMakeParam: any = {};
  vehicleModelParam: any = {};
  vehicleMakeUrl = TSAPIRoutes.vehicle_make;
  vehicleModelUrl = TSAPIRoutes.vehicle_model;
  makeSelectedId: any;
  model = {};
  initialValues = {
    owner_type: getBlankOption(),
    vehicle_type: getBlankOption(),
    model: getBlankOption(),
    make: getBlankOption(),
    assetOne: getBlankOption(),
    assetTwo: getBlankOption(),
    assetThree: getBlankOption(),
    emiStatus: getBlankOption(),
    emi_reminder_frequency: getBlankOption(),
  };
  partyListVendor = [];
  apiError: string = ""
  isKmsDateRequired = false;
  prefixUrl = '';
  fuelReadingDateMin = new Date();
  companyName: any;
  emiRemindMe = [
    {
      label: '15 Days Before',
      id: '0'
    },
    {
      label: 'A Day Before',
      id: '1'
    },
    {
      label: 'A Month Before',
      id: '2'
    },
    {
      label: 'A Week Before',
      id: '3'
    }
  ];

  emiStatus = [
    {
      label: 'Active',
      value: '0'
    },
    {
      label: 'Complete',
      value: '1'
    },
    {
      label: 'Inactive',
      value: '2'
    },
  ]

  EMIRemainderFrequency = [
    {
      label: 'Every Month',
      value: '0'
    },
    {
      label: 'Every Two Months',
      value: '1'
    },
    {
      label: 'Every Quarter',
      value: '2'
    },
    {
      label: 'Every Six Months',
      value: '3'
    }
  ];
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  canCreateVehicle: boolean = true;
  vehicleId = ''
  vehicleDetails;
  documentList = new Subject()
  ownVehicleSubDetails = new Subject()
  certificate = new Subject()
  subAssets = new Subject();
  tyreDetails = new Subject();
  vehicleCatagory = new Subject();
  vehiclePermits = new Subject();
  isCatagorySelected = false;
  registeredVehicles = 0;
  selectedTabIndex = 0;
  isEmi = false;
  category_selected_err = ''
  showAddPartyPopup: any = { name: '', status: false };
  newPartyCertificatesDetails = new Subject();
  newPartyPermitDetails = new Subject();
  isFormValid = new Subject();

  driverEligibilityMsg = '';
  tabName = ''
  isFormSubmitted: Boolean = false;
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'specification',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 2,
    enableCheckAll: true,
    allowSearchFilter: false,
    defaultOpen: false,

  };
  dropdownSettingsForAssignAsset = {
    singleSelection: false,
    idField: 'id',
    textField: 'display_no',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 2,
    enableCheckAll: true,
    allowSearchFilter: true,
    defaultOpen: false,
  };
  assetTypeSelection: any = [
    {
      isSelected: false,
      type: 0,
      specification: [],
      specificationList: [],
      errorMsg: '',
      isValid: false,
      image: " ../../../../../../../../assets/img/icons/trailer.svg",
      asset_type: 'Trailer',
      index: 0

    },
    {
      isSelected: false,
      type: 1,
      specification: [],
      specificationList: [],
      errorMsg: '',
      isValid: false,
      image: " ../../../../../../../../assets/img/icons/dollie.svg",
      asset_type: 'Dolly',
      index: 1,
    },
  ];
  allSelected: boolean = true;
  assetSpecsList = [];
  assetData = [];
  showAssignAssetSectioon: boolean = false;
  asset1Specification = '';
  asset2Specification = '';
  asset3Specification = '';

  constructor(
    private _router: Router,
    private _fb: UntypedFormBuilder,
    private _vehicleService: VehicleService,
    private _ownVehicleService: OwnVehicleService,
    private _employeeService: EmployeeService,
    private _analytics: AnalyticsService,
    private _prefix: PrefixUrlService,
    private _commonloaderservice: CommonLoaderService,
    private _activateRoute: ActivatedRoute,
    private _scrollToTop: ScrollToTop,
    private _createVehicle: CreateVehicleService,
    private _vehicleSettings: VehicleSettingService,
    private _ownAssetsService: OwnAssetsService,
    private apiHandler: ApiHandlerService,
  ) {

  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }

  ngOnInit() {
    this.initialValues.emiStatus = this.emiStatus[2];
    this._commonloaderservice.getHide();
    this._vehicleSettings.getVehicleSettings().subscribe(resp => {
      this.isEmi = resp['result']['emi']
    })
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.OWNVEHICLES, this.screenType.ADD, "Navigated");
    this.prefixUrl = this._prefix.getprefixUrl();
    this.buildForm();
    this._employeeService.getDriverList().subscribe((response) => {
      this.driverList = response['result'];
    });
    this.getBrand();
  }

  ngAfterViewInit(): void {
    this._activateRoute.params.subscribe(prams => {
      if (prams['vehicle_id']) {
        this.vehicleId = prams['vehicle_id'];
        this.getVehicleDetails();
      } else {
        this._createVehicle.getIsVehicleCreate().subscribe(resp => {
          this.canCreateVehicle = resp.result.can_create_vehicle
          this._createVehicle.createVehicle = this.canCreateVehicle
          this.registeredVehicles = resp.result.max_vehicles;
        });
      }
    })
    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('tab')) {
        this.tabName = paramMap.get('tab')
      }
    });
    this.getAssetList();
  }

  getVehicleDetails() {
    this._ownVehicleService.getOwnVehicleDetailForEdit(this.vehicleId).subscribe(resp => {
      this.vehicleDetails = resp['result']
      this.patchVechicleTypeDetails()
    })
  }

  buildForm() {
    this.vehicleDetailsForm = this._fb.group({
      vehicle_category: [null, Validators.required],
      reg_number: [null, [Validators.required,]],
      vehicle_no: [null, [Validators.required,]],
      vehicle_type: [null, [Validators.required,]],
      asset_1: [null],
      asset_2: [null],
      asset_3: [null],
      brand: this._fb.group({
        make: [
          null, Validators.required
        ],
        model: [
          null, Validators.required
        ]
      }),
      asset_specifications: [],
      emi_amount: 0,
      emi_track: false,
      employees_assigned: [[]],
      emi_start_date: null,
      emi_reminder_frequency: null,
      emi_status: 2,
      emi_documents: [],
      emi_last_date: null,
      fuel_reading_date: null,
      documents: this._fb.array([]),
      subdetails: this._fb.array([]),
      subassets: this._fb.array([]),
      tyre_positions: this._fb.array([]),
      tyres_info: this._fb.array([]),
      spare_tyres_info: this._fb.array([]),
      permits: this._fb.array([])
    });
  }
  setDisplayNo() {
    let form = this.vehicleDetailsForm;
    form.get('reg_number').setValue(form.get('vehicle_no').value)
  }

  selectedDriverList(e) {
    if (e) {
      this.checkEmployeeEligiblity();

    }
  }

  vehicleCatagoryChange(catagory) {
    this.category_selected_err = '';
    this.vehicleDetailsForm.get('vehicle_category').setValue(catagory)
    this.isCatagorySelected = true;
    this.getVehicleOwnerTypeList()
    setTimeout(() => {
      this.vehicleCatagory.next(catagory)
      this.resetOntabSelection();
    }, 100);
  }

  vehicleSpecificationChange() {
    this.initialValues.make = getBlankOption();
    this.initialValues.model = getBlankOption();
    this.vehicleDetailsForm.get('brand').reset();
    this.checkEmployeeEligiblity();
  }

  getBrand() {
    this._vehicleService.getVehicleMake().subscribe((response) => {
      this.vehicleMake = response.result;
    });
  }

  getAssetList() {
    this._vehicleService.getAssetList().subscribe((response) => {
      this.assetData = response.result;
    });
  }

  onMakeSelected(ele) {
    if (ele.target.value != '') {
      this._commonloaderservice.getHide();
      this.makeSelectedId = ele.target.value;
      this.vehicleDetailsForm.get('brand').get('model').setValue(null);
      this.initialValues.model = getBlankOption()
      this._vehicleService.getVehicleModel(ele.target.value).subscribe((response) => {
        this.model = {};
        this.vehicleModel = response.result;
      });
    }
  }

  getAssetSpecificationsList(index) {
    this._ownAssetsService.getSpecifications(index).subscribe((response: any) => {
      this.assetSpecsList = response.result;
      this.assetTypeSelection[index].specificationList = response.result;
    });
  }

  assetTypeSelected(id, index, isChecked) {
    this.getAssetSpecificationsList(index)
    this.assetTypeSelection[id].isSelected = !this.assetTypeSelection[id].isSelected;
    if (!this.assetTypeSelection[id].isSelected) {
      this.assetTypeSelection[id].specification = [];
    }
    if (isChecked) {
      this.checkSpecificationSelected()
    }
  }

  onModelChange(e) {
    this.checkSpecificationSelected();
  }

  checkSpecificationSelected() {
    this.assetTypeSelection.forEach((ele, ind) => {
      if (ele.isSelected && ele.specification.length == 0) {
        ele.errorMsg = 'Select atleast one Specification';
        ele.isValid = false;
      }
      if (!ele.isSelected && ele.specification.length == 0) {
        ele.errorMsg = '';
        ele.isValid = true;
      }
      if (ele.isSelected && ele.specification.length > 0) {
        ele.errorMsg = '';
        ele.isValid = true;
      }
    })
    this.allSelected = this.assetTypeSelection.every(item => item.isValid == true);
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  submitForm() {
    this.isFormSubmitted = true;
    this.checkSpecificationSelected();
    const form = this.vehicleDetailsForm;
    form.value['employees_assigned'] = this.vehicleDetailsForm.get('employees_assigned').value.map(driver => driver?.id)
    form.value['asset_specifications'] = this.assetTypeSelection.map((ele) => {
      return {
        type: ele.type,
        specification: ele.specification,
        isSelected: ele.isSelected,
        asset_type: ele.asset_type
      };
    })
    if (form.valid) {
      if (this.allSelected) {
        if (this.vehicleId) {
          this.apiHandler.handleRequest(this._ownVehicleService.updateOwnVehicle(this.prepareRequest(), this.vehicleId), 'Vehicle details updated successfully!').subscribe(
            {
              next: (res) => {                
                this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.OWNVEHICLES)
                this._router.navigate([this.prefixUrl + '/onboarding/vehicle/own/details', this.vehicleId]);
              },
              error: (err) => {                
                this._scrollToTop.scrollToTop();
                this.regError = '';
                if (err.error.message.includes('Vehicle registration number already exists in system')) {
                  this.regError = 'Vehicle Display No. already exists in system';
                }else {
                  this.apiError = err.error.message;
                }
              }
            }
          )
        } else {
          this.apiHandler.handleRequest(this._ownVehicleService.createOwnVehicle(this.prepareRequest()), 'Vehicle details added successfully!').subscribe(
            {
              next: (response) => {                
                this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.OWNVEHICLES)
                this._router.navigate([this.prefixUrl + '/onboarding/vehicle/own/details', response.result]);
              },
              error: (err) => {
                this.regError = '';
                this._scrollToTop.scrollToTop();
                if (err.error.message.includes('Vehicle registration number already exists in system')) {
                  this.regError = 'Vehicle Display No. already exists in system';
                }else {
                  this.apiError = err.error.message;
                }
              }
            }
          )
        }
      } else {
        setAsTouched(form);
        this._scrollToTop.scrollToTop();
      }
    } else {
      setAsTouched(form);
      this.isFormValid.next(form.valid)
      if (!isValidValue(form.value.vehicle_category)) {
        this.category_selected_err = 'Please choose a Vehicle Category'
      }
      this._scrollToTop.scrollToTop();
      console.log(form.errors);
    }
  }


  prepareRequest() {
    let prepareForm = this.vehicleDetailsForm
    let payload = cloneDeep(prepareForm.value)
    payload['emi_last_date'] = changeDateToServerFormat(payload['emi_last_date'])
    payload['emi_start_date'] = changeDateToServerFormat(payload['emi_start_date'])
    if (payload['emi_documents'].length) {
      payload['emi_documents'] = payload['emi_documents'].map(doc => doc.id)
    }
    let tyres_info = [];
    payload['reg_number'] = payload['reg_number'].toUpperCase()
    payload['documents'].forEach((doc, index) => {
      doc['expiry_date'] = changeDateToServerFormat(doc['expiry_date'])
      doc['issue_date'] = changeDateToServerFormat(doc['issue_date'])
      if (doc['files'].length) {
        doc['files'] = doc['files'].map(file => file.id)
      }
    });
    payload['subdetails'].forEach((doc, index) => {
      if (doc['files'].length) {
        doc['files'] = doc['files'].map(file => file.id)
      }
      doc['emi_last_date'] = changeDateToServerFormat(doc['emi_last_date'])
    });
    payload['spare_tyres_info'].forEach((spare, index) => {
      spare['position_name'] = spare['name']
      delete spare['model_list']
      delete spare['name']
      spare['installation_date'] = changeDateToServerFormat(spare['installation_date']);
      spare['permitted_date'] = changeDateToServerFormat(spare['permitted_date']);
    })
    payload['tyre_positions'].forEach((tyre, index) => {
      tyre['left_tyers'].forEach(left => {
        left['position_name'] = left['name']
        left['installation_date'] = changeDateToServerFormat(left['installation_date']);
        left['permitted_date'] = changeDateToServerFormat(left['permitted_date']);
        delete left['model_list']
        delete left['name']
        tyres_info.push(left)
      });
      tyre['right_tyers'].forEach(right => {
        right['position_name'] = right['name']
        right['installation_date'] = changeDateToServerFormat(right['installation_date'])
        right['permitted_date'] = changeDateToServerFormat(right['permitted_date'])
        delete right['model_list']
        delete right['name']
        tyres_info.push(right)
      });
    });
    if(payload['tyres']['axle_count']==0){
      tyres_info=[];
    }
    if(payload['tyres']['spare_count']==0){
      payload['spare_tyres_info']=[]
    }
    payload['tyres'] = {
      tyres: payload['tyres'],
      tyres_info: tyres_info,
      spares_info: payload['spare_tyres_info']
    }
    payload['subassets'].forEach((doc, index) => {
      doc['expiry_date'] = changeDateToServerFormat(doc['expiry_date'])
      if (doc['files'].length) {
        doc['files'] = doc['files'].map(file => file.id)
      }
    });
    payload['permits'].forEach(element => {
      element['date'] = changeDateToServerFormat(element['date']);
      if (element['documents'].length) {
        element['documents'] = element['documents'].map(file => file.id)
      }
      if (this.vehicleId) {
        element['vehicle'] = this.vehicleId;
      } else {
        element['vehicle'] = null
      }
    });

    delete payload['tyre_positions']
    delete payload['spare_tyres_info']
    return payload
  }

  getVehicleOwnerTypeList() {
    this._vehicleService.getVehicleSpecifications(this.vehicleDetailsForm.get('vehicle_category').value).subscribe((response: any) => {
      this.vechileTypeList = response.result;
    });
  }

  getNewSpecifications(event) {
    if (event) {
      this.initialValues.vehicle_type = getBlankOption();
      this.vechileTypeList = [];
      this.initialValues.vehicle_type = { value: event.id, label: event.label };
      this.vehicleDetailsForm.controls['vehicle_type'].setValue(event.id);
      this.checkEmployeeEligiblity();
      this.getVehicleOwnerTypeList();
    }
  }

  addNewSpecifications(event) {
    if (event) {
      this.addVehicle = {
        vehicle_category: this.vehicleDetailsForm.get('vehicle_category').value,
        specification: event,
      };

    }
  }

  addNewVehicleMake(event) {
    this.vehicleMakeParam = {
      make_name: event,
    };
  }

  getNewVehicleMake(event) {
    if (event) {
      this.vehicleMake = [];
      this.vehicleDetailsForm.get('brand').get('model').setValue(null);
      this.initialValues.model = getBlankOption()
      this._vehicleService.getVehicleMake().subscribe((response) => {
        this.vehicleDetailsForm.controls['brand'].get('make').setValue(event.id);
        this.makeSelectedId = event.id;
        this.vehicleMake = response.result;
        this.vehicleModel = [];
      });
    }
  }

  addNewVehicleModel(event) {
    this.vehicleModelParam = {
      vehicle_make: this.makeSelectedId ? this.makeSelectedId : "",
      model_name: event
    };
  }

  getNewVehicleModel(event) {
    if (event) {
      this.vehicleModel = [];
      this._vehicleService.getVehicleModel(this.makeSelectedId).subscribe((response) => {
        this.vehicleDetailsForm.controls['brand'].get('model').setValue(event.id);
        this.vehicleModel = response.result;
      });
    }
  }

  patchVechicleTypeDetails() {
    this.patchVehicleMake(this.vehicleDetails);
    this.patchVehicleModel(this.vehicleDetails);
    this.patchFormValues(this.vehicleDetails);
    this.patchSpecifications(this.vehicleDetails)
    this.getVehicleOwnerTypeList();
    this.checkEmployeeEligiblity();
    this.patchAssignAsset(this.vehicleDetails);
    this.patchAssets(this.vehicleDetails);
  }

  patchAssets(data) {
    this.initialValues.assetOne = { label: data?.asset_1?.name, value: data?.asset_1?.id };
    this.initialValues.assetTwo = { label: data?.asset_2?.name, value: data?.asset_2?.id };
    this.initialValues.assetThree = { label: data?.asset_3?.name, value: data?.asset_3?.id };
    this.vehicleDetailsForm.patchValue({
      asset_1: data?.asset_1?.id,
      asset_2: data?.asset_2?.id,
      asset_3: data?.asset_3?.id,
    });
    setTimeout(() => {
      this.assetOneSelected();
      this.assetTwoSelected();
      this.assetThreeSelected();
    }, 400);
  }

  patchAssignAsset(data) {
    data.asset_specifications.forEach((element, ind) => {
      const index = this.assetTypeSelection.findIndex(asset => asset.type === element.type);
      this.getAssetSpecificationsList(index)
      this.assetTypeSelection[index].isSelected = data.asset_specifications[ind].isSelected;
      this.assetTypeSelection[index].specification = data.asset_specifications[ind].specification;
      this.assetTypeSelection[index].type = data.asset_specifications[ind].type;
    });
  }



  patchVehicleModel(data) {
    if (isValidValue(data.brand.model)) {
      this.initialValues.model['id'] = data.brand.model.id;
      this.initialValues.model['label'] = data.brand.model.model_name;
    }

  }


  patchSpecifications(data) {
    if (isValidValue(data.vehicle_type)) {
      this.initialValues.vehicle_type['value'] = data.vehicle_type.id;
      this.initialValues.vehicle_type['label'] = data.vehicle_type.label;
    }

  }

  patchVehicleMake(data) {
    if (isValidValue(data.brand.make)) {
      this.initialValues.make['id'] = data.brand.make.id;
      this.initialValues.make['label'] = data.brand.make.make_name;
      this.makeSelectedId = data.brand.make.id;
      this._vehicleService.getVehicleModel(data.brand.make.id).subscribe((response) => {
        this.vehicleModel = response.result;
      });
    }
  }


  patchFormValues(data: any) {
    const vehicleData = cloneDeep(data);
    this.initialValues.emiStatus = this.emiStatus[vehicleData.emi_status]
    vehicleData.brand.make = data.brand.make !== null && data.brand.make.id ? data.brand.make.id : null;
    vehicleData.brand.model = data.brand.model !== null && data.brand.model.id ? data.brand.model.id : null;
    vehicleData.vehicle_type = data.vehicle_type !== null ? data.vehicle_type.id : null;
    this.isCatagorySelected = true;
    this.vehicleDetailsForm.patchValue(vehicleData);
    this.patchEmiDetails(vehicleData)
    setTimeout(() => {
      this.ownVehicleSubDetails.next(vehicleData.subdetails);
      this.certificate.next(vehicleData.documents);
      this.subAssets.next(vehicleData.subassets);
      this.tyreDetails.next(vehicleData.tyres);
      this.vehiclePermits.next(vehicleData.permits);
      if (this.tabName) {
        this.tabGroup._tabs.forEach((tab, index) => {
          const tabLabel = tab.textLabel?.trim();
          if (tabLabel === this.tabName) {
            this.selectedTabIndex = index;
          }
        });
      }
    }, 500);
  }

  patchEmiDetails(data) {
    if (data.emi_reminder_frequency || data.emi_reminder_frequency == 0) {
      this.initialValues.emi_reminder_frequency = this.EMIRemainderFrequency.filter(item => item.value == data.emi_reminder_frequency)[0];
    }
  }

  getNewValues(e) {
    if (e) {
      this._vehicleService.getVehicleDetailForEdit(this.vehicleId).subscribe(resp => {
        this.documentList.next(resp['documents'])
      })
    }
  }

  resetOntabSelection() {
    this.initialValues.vehicle_type = getBlankOption();
    this.initialValues.make = getBlankOption();
    this.initialValues.model = getBlankOption();
    this.initialValues.assetOne = getBlankOption();
    this.initialValues.assetTwo = getBlankOption();
    this.initialValues.assetThree = getBlankOption();
    this.vehicleDetailsForm.patchValue({
      reg_number: null,
      vehicle_no: null,
      vehicle_type: null,
      asset_1: null,
      asset_2: null,
      asset_3: null,
      brand: {
        make: null,
        model: null
      },
      emi_amount: 0,
      emi_status: 2,
      emi_documents: [],
      employees_assigned: [],
      emi_start_date: null,
      emi_track: false,
      emi_reminder_frequency: null,
      emi_last_date: null,
      fuel_reading_date: null,
    });
    this.asset1Specification = '';
    this.asset2Specification = '';
    this.asset3Specification = '';
    this.assetTypeSelection.forEach(asset => {
      asset.isSelected = false;
      asset.specification = [];
      asset.specificationList = [];
      asset.errorMsg = '';
      asset.isValid = false;
    });
    this.showAssignAssetSectioon = false;
    this.vehicleDetailsForm.markAsUntouched();
  }

  addPartyToOption(e) {
    if (this.showAddPartyPopup['isFrom'] == 'permit') {
      this.newPartyPermitDetails.next(e);
    }
    if (this.showAddPartyPopup['isFrom'] == 'certificates') {
      this.newPartyCertificatesDetails.next(e);
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }
  addNewParty(e) {
    this.showAddPartyPopup = e
  }

  checkEmployeeEligiblity() {
    const specification = this.vehicleDetailsForm.get('vehicle_type').value;
    let drivers = this.vehicleDetailsForm.get('employees_assigned').value;
    drivers = drivers.map((ele) => ele?.id)
    let data = {
      drivers: drivers,
      specification: specification
    }
    if (specification)
      this._employeeService.checkEmployeeEligiblity(data).subscribe(resp => {
        this.driverEligibilityMsg = resp['result']
      })
  }

  fileUploader(e, i) {
    let doc = this.vehicleDetailsForm.controls.emi_documents.value
    e.forEach((element) => {
      element['presigned_url'] = element['url']
      doc.push(element);
    });

  }

  fileDeleted(id) {
    let doc = this.vehicleDetailsForm.controls.emi_documents.value
    this.vehicleDetailsForm.controls.emi_documents.setValue(doc.filter(doc => doc.id != id))
    this.vehicleDetailsForm.controls.emi_documents.updateValueAndValidity()
  }

  onchnageEmiStatus() {
    this.vehicleDetailsForm.patchValue({
      emi_amount: 0,
      emi_track: false,
      emi_start_date: null,
      emi_reminder_frequency: null,
      emi_documents: [],
      emi_last_date: null,
    })
    this.initialValues.emi_reminder_frequency = getBlankOption();
    let emiStatus = this.vehicleDetailsForm.controls.emi_status.value
    setUnsetValidators(this.vehicleDetailsForm, 'emi_last_date', [Validators.nullValidator])
    setUnsetValidators(this.vehicleDetailsForm, 'emi_start_date', [Validators.nullValidator])
    setUnsetValidators(this.vehicleDetailsForm, 'emi_amount', [Validators.nullValidator])
    setUnsetValidators(this.vehicleDetailsForm, 'emi_reminder_frequency', [Validators.nullValidator])
    if (Number(emiStatus) == 0) {
      setUnsetValidators(this.vehicleDetailsForm, 'emi_last_date', [Validators.required])
    }
  }

  onchangeEmiTrack() {
    setUnsetValidators(this.vehicleDetailsForm, 'emi_start_date', [Validators.nullValidator])
    setUnsetValidators(this.vehicleDetailsForm, 'emi_amount', [Validators.nullValidator])
    setUnsetValidators(this.vehicleDetailsForm, 'emi_reminder_frequency', [Validators.nullValidator])
    if (this.vehicleDetailsForm.controls.emi_track.value) {
      this.initialValues.emi_reminder_frequency = getBlankOption();
      setUnsetValidators(this.vehicleDetailsForm, 'emi_start_date', [Validators.required])
      setUnsetValidators(this.vehicleDetailsForm, 'emi_amount', [Validators.min(0.1)])
      setUnsetValidators(this.vehicleDetailsForm, 'emi_reminder_frequency', [Validators.required])
      this.vehicleDetailsForm.patchValue({
        emi_amount: 0,
        emi_start_date: null,
        emi_reminder_frequency: null,
      })
    }

  }

  assetOneSelected() {
    let asset1 = this.vehicleDetailsForm.get('asset_1').value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset1);
    if (isValidValue(selectedAsset)) {
      this.asset1Specification = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name
    }
  }
  assetTwoSelected() {
    let asset2 = this.vehicleDetailsForm.get('asset_2').value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset2);
    if (isValidValue(selectedAsset)) {
      this.asset2Specification = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name

    }
  }
  assetThreeSelected() {
    let asset3 = this.vehicleDetailsForm.get('asset_3').value;
    let selectedAsset = this.assetData.find(ele => ele.id == asset3);
    if (isValidValue(selectedAsset)) {
      this.asset3Specification = (selectedAsset?.category == 1 ? 'Dolly ' : 'Trailer ') + selectedAsset?.specification?.name
    }
  }
}
