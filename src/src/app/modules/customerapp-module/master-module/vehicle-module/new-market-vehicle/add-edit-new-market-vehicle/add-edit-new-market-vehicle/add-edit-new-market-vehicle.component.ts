import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getCountryCode } from 'src/app/shared-module/utilities/countrycode-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { NewMarketVehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/new-market-vehicle-service/new-market-vehicle.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-edit-new-market-vehicle',
  templateUrl: './add-edit-new-market-vehicle.component.html',
  styleUrls: ['./add-edit-new-market-vehicle.component.scss']
})
export class AddEditNewMarketVehicleComponent implements OnInit, AfterViewInit, OnDestroy {

  marketVehicleForm: FormGroup;
  initialValues = {
    owner_type: getBlankOption(),
    vehicle_type: getBlankOption(),
    model: getBlankOption(),
    make: getBlankOption(),
    mobile_country_code: getBlankOption(),
    market_owner: getBlankOption()
  };
  vehicleMakeUrl = TSAPIRoutes.vehicle_make;
  vehicleModelUrl = TSAPIRoutes.vehicle_model;
  regError: string = '';
  vehicleMake: any = null;
  vehicleModel: any = null;
  vechileAlreadyAssignError: any = '';
  vechileTypeList = [];
  vehicleApi = 'vehicle/category/spec/';
  addVehicle: any = {};
  vehicleMakeParam: any = {};
  vehicleModelParam: any = {};
  makeSelectedId: any;
  model = {};
  vendor = false;
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  vehicleprovider = "Vehicle Provider";
  partyListVendor = [];
  apiError: string = "";
  countryId = '';
  countryPhoneCode = [];
  prefixUrl = getPrefix();
  editData = new Subject();
  isEdit: boolean = false;
  vehicle_category = new Subject();
  is_vehicle_type_selected: boolean = false;
  vehicle_type_selected: number;
  vehicleId: string = '';
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  category_selected_err = '';
  isCertificateValid = new Subject();

  isFormSubmitted: boolean = false



  is_vehicle_selection_disabled: boolean = false;
  constructor(private formBuilder: FormBuilder, private _vehicleService: VehicleService, private newMarketVehicleService: NewMarketVehicleService,
    private _countryId: CountryIdService, private _companyModuleService: CompanyModuleServices, private _commonloaderservice: CommonLoaderService, private apiHandler: ApiHandlerService,
    private _scrollToTop: ScrollToTop, private router: Router, private activatedRoute: ActivatedRoute, private _analytics: AnalyticsService,) {
    this.countryId = this._countryId.getCountryId();
  }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }

  ngOnInit(): void {
    this._commonloaderservice.getHide();
    this.buildForm();
    this.getVehicleOwner();
    this.getBrand();
    this._companyModuleService.getPhoneCode().subscribe(result => {
      let codes = [];
      codes = result['results'];
      this.countryPhoneCode = codes.map(code => code.phone_code)
    });
    this.initialValues.mobile_country_code['label'] = getCountryCode(this.countryId)

  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe((params: ParamMap) => {
      if (params.hasOwnProperty('vehicle_id')) {
        this.vehicleId = params['vehicle_id'];
        this.newMarketVehicleService.getMarketVehicleData(params['vehicle_id']).subscribe((data) => {
          this.is_vehicle_selection_disabled = true;
          this.patchFormValues(data['result']);
          this.is_vehicle_type_selected = true;
          this.vehicle_type_selected = data['result'].vehicle_category
          setTimeout(() => {
            this.isEdit = true
            this.editData.next(data.result);
          }, 100);
        })
      }

    })
  }


  patchFormValues(data) {
    this.marketVehicleForm.patchValue(data);
    this.initialValues.make.label = data?.brand?.make?.make_name;
    this.initialValues.make.value = data?.brand?.make?.id;
    this.initialValues.model.label = data?.brand?.model?.model_name;
    this.initialValues.model.value = data?.brand?.model?.id;
    this.initialValues.market_owner.label = data?.market_owner?.display_name
    this.initialValues.market_owner.value = data?.market_owner?.id;
    this.initialValues.vehicle_type.label = data?.vehicle_type?.label;
    this.initialValues.vehicle_type.value = data?.vehicle_type?.id;
    this.initialValues.mobile_country_code.label = data.mobile_country_code
    this.marketVehicleForm.patchValue({
      vehicle_type: data?.vehicle_type?.id ? data?.vehicle_type?.id : '',
      market_owner: data?.market_owner?.id,
    })
    this.marketVehicleForm.get('brand').get('make').setValue(data.brand.make?.id ? data.brand.make?.id : null)
    this.marketVehicleForm.get('brand').get('model').setValue(data.brand.model?.id ? data.brand.model?.id : null);
    if (isValidValue(data.brand.make)) {
      this._vehicleService.getVehicleModel(data.brand.make.id).subscribe((response) => {
        this.model = {};
        this.vehicleModel = response.result;
      });
    }
    if (isValidValue(data.vehicle_type)) {
      this.getBrand()
    }
    this.getVehicleOwnerTypeList()
  }

  getBrand() {
    this._vehicleService.getVehicleMake().subscribe((response) => {
      this.vehicleMake = response.result;
    });
  }

  getVehicleOwnerTypeList() {
    this._vehicleService.getVehicleSpecifications(this.marketVehicleForm.get('vehicle_category').value).subscribe((response: any) => {
      this.vechileTypeList = response.result;
    });
  }

  getVehicleOwner() {
    this._vehicleService.getVehicleOwner().subscribe((data) => {
      this.partyListVendor = data['result']
    })
  }

  buildForm() {
    this.marketVehicleForm = this.formBuilder.group({
      reg_number: ['', Validators.required],
      brand: this.formBuilder.group({
        make: [
          null
        ],
        model: [
          null
        ]
      }),
      market_driver: [''],
      mobile_country_code: [
        getCountryCode(this.countryId)
      ],
      mobile: [
        '',
        [TransportValidator.mobileNumberValidator()]
      ],
      vehicle_type: null,
      vehicle_category: [null, [Validators.required]],
      market_owner: [''],
      documents: this.formBuilder.array([])
    })
  }

  addNewVehicleMake(event) {
    this.vehicleMakeParam = {
      make_name: event,
    };
  }

  getNewVehicleMake(event) {
    if (event) {
      this.vehicleMake = [];
      this.marketVehicleForm.get('brand').get('model').setValue(null);
      this.initialValues.model = getBlankOption()
      this._vehicleService.getVehicleMake().subscribe((response) => {
        this.marketVehicleForm.controls['brand'].get('make').setValue(event.id);
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
        this.marketVehicleForm.controls['brand'].get('model').setValue(event.id);
        this.vehicleModel = response.result;
      });
    }
  }
  onMakeSelected(ele) {
    if (ele.target.value != '') {
      this.makeSelectedId = ele.target.value;
      this.marketVehicleForm.get('brand').get('model').setValue(null);
      this.initialValues.model = getBlankOption()
      this._vehicleService.getVehicleModel(ele.target.value).subscribe((response) => {
        this.model = {};
        this.vehicleModel = response.result;
      });
    }else{
      this.marketVehicleForm.get('brand').get('model').setValue(null);
      this.initialValues.model = getBlankOption()
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
  openAddPartyModal($event, type) {
    if ($event) {
      this.vendor = true;
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }
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
    }
  }

  addPartyToOption($event) {
    if ($event.status) {
      this.getVehicleOwner();
      this.initialValues.market_owner = { value: $event.id, label: $event.label };
      this.marketVehicleForm.get('market_owner').setValue($event.id);
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
    this.vendor = false;

  }

  addNewVehicle(event) {
    if (event) {
      this.addVehicle = {
        vehicle_category: this.marketVehicleForm.get('vehicle_category').value,
        specification: event,
      };

    }
  }
  getNewVehicle(event) {
    if (event) {
      this.initialValues.vehicle_type = getBlankOption();
      this.vechileTypeList = [];
      this.initialValues.vehicle_type = { value: event.id, label: event.label };
      this.marketVehicleForm.controls['vehicle_type'].setValue(event.id);
      this.getVehicleOwnerTypeList();
    }
  }

  submitForm() {
    this.isFormSubmitted = true;
    let data = this.marketVehicleForm as FormGroup
    if (data.valid) {
      if (this.isEdit) {
        this.apiHandler.handleRequest(this.newMarketVehicleService.updateMarketVehicleData(this.vehicleId, this.prepareRequest(data)), 'Vehicle details updated successfully!').subscribe(
          {
            next: (respone) => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.MARKETVEHICLES);
              this.router.navigate([this.prefixUrl + '/onboarding/vehicle/market/details', this.vehicleId])
            },
            error: (err) => {
              this._scrollToTop.scrollToTop();
              if (err.error.message.includes('Vehicle registration number already exists in system')) {
                this.regError = 'Vehicle number already exists ';
              }
              else if (err.error.message.includes('This driver have already one vehicle')) {
                this.vechileAlreadyAssignError = "Driver Already has a vehicle assigned";
              }
              else {
                this.apiError = err.error.message;
              }
            }
          }
        )
      } else {
        this.apiHandler.handleRequest(this.newMarketVehicleService.createMarketVehicle(this.prepareRequest(data)), 'Vehicle details added sucessfully!').subscribe(
          {
            next: (respone) => {              
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.MARKETVEHICLES)
              this.router.navigate([this.prefixUrl + '/onboarding/vehicle/market/details', respone.result])
            },
            error: (err) => {
              this._scrollToTop.scrollToTop();
              if (err.error.message.includes('Vehicle registration number already exists in system')) {
                this.regError = 'Vehicle number already exists';
              }
              else if (err.error.message.includes('This driver have already one vehicle')) {
                this.vechileAlreadyAssignError = "Driver Already has a vehicle assigned";
              }
              else {
                this.apiError = err.error.message;
              }
            }
          }
        )
      }
    } else {
      setAsTouched(data);
      this.isCertificateValid.next(this.marketVehicleForm.valid)
      if (!isValidValue(data.value.vehicle_category)) {
        this.category_selected_err = 'Please choose a Vehicle Category'
      }
      this._scrollToTop.scrollToTop();
    }
  }
  prepareRequest(form) {
    form.value['documents'].forEach((doc, index) => {
      doc['expiry_date'] = changeDateToServerFormat(doc['expiry_date'])
      doc['issue_date'] = changeDateToServerFormat(doc['issue_date']);
      if (doc['files'].length) {
        doc['files'] = doc['files'].map(file => file.id)
      }
    });
    let data = {
      basic_detail: form.value
    }
    return data
  }

  vehicleTypeSelected(id) {
    this.category_selected_err = '';
    this.marketVehicleForm.reset();
    this.resetFormvalues();
    this.marketVehicleForm.get('vehicle_category').setValue(id);
    this.is_vehicle_type_selected = true;
    this.vehicle_type_selected = id
    setTimeout(() => {
      this.vehicle_category.next(id)
    }, 250);
    this.getVehicleOwnerTypeList();
  }

  resetFormvalues() {
    this.initialValues.make = getBlankOption();
    this.initialValues.model = getBlankOption();
    this.initialValues.market_owner = getBlankOption();
    this.initialValues.owner_type = getBlankOption();
    this.initialValues.vehicle_type = getBlankOption();
    this.marketVehicleForm.get('brand').reset();
    this.marketVehicleForm.get('mobile_country_code').setValue(getCountryCode(this.countryId));
    this.marketVehicleForm.patchValue({
      market_driver: '',
      mobile: ''
    })
    this.marketVehicleForm.markAsUntouched();
    this.marketVehicleForm.updateValueAndValidity();
  }

  vehicleSpecificationChange() {
    this.initialValues.make = getBlankOption();
    this.initialValues.model = getBlankOption();
    this.marketVehicleForm.get('brand').reset();
    this.getBrand();
  }



}
