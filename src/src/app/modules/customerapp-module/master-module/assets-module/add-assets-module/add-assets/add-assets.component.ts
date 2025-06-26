import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { OwnAssetsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-service.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.scss']
})
export class AddAssetsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  assetsDetailsForm: UntypedFormGroup;
  regError: string = '';
  assetsMake: any = [];
  assetModel: any = [];
  patterns = new ValidationConstants().VALIDATION_PATTERN;
  assetsTypeList = [];
  assetsApi = 'vehicle/asset/category/spec/'
  addSpecificatins: any = {};
  assetMakeParam: any = {};
  assetModelParam: any = {};
  assetMakeUrl = TSAPIRoutes.vehicle_make;
  assetModelUrl = TSAPIRoutes.vehicle_model;
  makeSelectedId: any;
  initialValues = {
    specification: getBlankOption(),
    model: getBlankOption(),
    make: getBlankOption(),
  };
  apiError: string = ""
  prefixUrl = '';
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  assetId = ''
  assetDetails;
  ownAssetSubDetails = new Subject()
  certificate = new Subject()
  subAssets = new Subject();
  tyreDetails = new Subject();
  catagory = new Subject();
  isCatagorySelected = false;
  selectedTabIndex = 0;
  category_selected_err = ''
  showAddPartyPopup: any = { name: '', status: false, from: '' };
  newPartyDetailsCertificate = new Subject();
  newPartyDetailsAssets = new Subject();
  assetsPermits = new Subject();
  isFormValid = new Subject();
  isCertificateTabError = false;
  isSubAssetTabError = false;
  isPermitsTabError = false;
  tabName = ''
  registeredAssets = 0;
  canCreateAsset: boolean = true;


  constructor(
    private _router: Router,
    private _fb: UntypedFormBuilder,
    private _ownAssetsService: OwnAssetsService,
    private _analytics: AnalyticsService,
    private _prefix: PrefixUrlService,
    private _commonloaderservice: CommonLoaderService,
    private _activateRoute: ActivatedRoute,
    private _scrollToTop: ScrollToTop,
    private apiHandler: ApiHandlerService
  ) { }
  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }

  ngOnInit() {
    this._commonloaderservice.getHide();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.OWNASSETS, this.screenType.ADD, "Navigated");
    this.prefixUrl = this._prefix.getprefixUrl();
    this.buildForm();
    this.getBrand();
		this.getCancreateAsset();
  }

  ngAfterViewInit(): void {
    this._activateRoute.params.subscribe(prams => {
      if (prams['asset_id']) {
        this.assetId = prams['asset_id'];
        this.getAssetDetails();
      }
    })

    this._activateRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('tab')) {
        this.tabName = paramMap.get('tab')
      }
    });
  }

  getAssetDetails() {
    this._ownAssetsService.getOwnAssetDetailForEdit(this.assetId).subscribe(resp => {
      this.assetDetails = resp['result']
      this.patchAssetTypeDetails()
    })
  }

  buildForm() {
    this.assetsDetailsForm = this._fb.group({
      category: [null, Validators.required],
      asset_no: [null, [Validators.required,]],
      display_no: [null, [Validators.required,]],
      specification: [null, [Validators.required,]],
      brand: this._fb.group({
        make: [null, Validators.required
        ],
        model: [
          null, Validators.required
        ],
      }),
      certificates: this._fb.array([]),
      subdetails: this._fb.array([]),
      attachments: this._fb.array([]),
      tyre_positions: this._fb.array([]),
      tyres_info: this._fb.array([]),
      spare_tyres_info: this._fb.array([]),
      permits: this._fb.array([]),
    });
  }
  setDisplayNo() {
    let form = this.assetsDetailsForm;
    form.get('display_no').setValue(form.get('asset_no').value)
  }

  assetCatagoryChange(catagory) {
    this.category_selected_err = '';
    this.assetsDetailsForm.get('category').setValue(catagory)
    this.isCatagorySelected = true;
    this.getAssetsTypeList()
    setTimeout(() => {
      this.catagory.next(catagory)
      this.resetOntabSelection();
    }, 100);
  }

  vehicleSpecificationChange() {
    this.initialValues.make = getBlankOption();
    this.initialValues.model = getBlankOption();
  }

  getBrand() {
    this._ownAssetsService.getAssetMake().subscribe((response) => {
      this.assetsMake = response.result;
    });
  }

  onMakeSelected(ele) {
    if (ele.target.value != '') {
      this._commonloaderservice.getHide();
      this.makeSelectedId = ele.target.value;
      this.initialValues.model = getBlankOption()
      this.assetsDetailsForm.get('brand').get('model').setValue(null);
      this._ownAssetsService.getAssetModel(ele.target.value).subscribe((response) => {
        this.assetModel = response.result;
      });
    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }


  submitForm() {
    const form = this.assetsDetailsForm;
    if (form.valid) {
      if (this.assetId) {
        this.apiHandler.handleRequest(this._ownAssetsService.updateOwnAssets(this.prepareRequest(), this.assetId), 'Asset details updated successfully!').subscribe(
          {
            next: (response) => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.OWNASSETS)
              this._router.navigate([this.prefixUrl + '/onboarding/assets/view', response.result]);
            },
            error: (error) => {
              this._scrollToTop.scrollToTop();
              this.regError = '';
              this.apiError = error.error.message;
            }
          }
        )
      } else {
        this.apiHandler.handleRequest(this._ownAssetsService.createOwnAssets(this.prepareRequest()), 'Asset details added successfully!').subscribe(
          {
            next: (response) => {
              if (response.result) {
                this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.OWNASSETS)
                this._router.navigate([this.prefixUrl + '/onboarding/assets/view', response.result]);
              }
            },
            error: (error) => {
              this.regError = '';
              this._scrollToTop.scrollToTop();
              this.apiError = error.error.message;
            }
          }
        );
      }



    } else {
      setAsTouched(form);
      this.isFormValid.next(form.valid)
      this.isCertificateTabError = form.get('certificates').invalid
      this.isSubAssetTabError = form.get('attachments').invalid
      this.isPermitsTabError = form.get('permits').invalid
      if (!isValidValue(form.value.category)) {
        this.category_selected_err = 'Please choose a Asset Category'
      }
      this._scrollToTop.scrollToTop();
      console.log(form.errors);
    }
  }


  prepareRequest() {
    let prepareForm = this.assetsDetailsForm
    let payload = cloneDeep(prepareForm.value)
    let tyres_info = [];
    payload['asset_no'] = payload['asset_no'].toUpperCase()
    payload['display_no'] = payload['display_no'].toUpperCase()
    payload['model'] = payload['brand']['model']
    payload['brand'] = payload['brand']['make']

    payload['certificates'].forEach((doc, index) => {
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
    payload['tyres'] = {
      tyres: payload['tyres'],
      tyres_info: tyres_info,
      spares_info: payload['spare_tyres_info']
    }
    payload['attachments'].forEach((doc, index) => {
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
    });

    delete payload['tyre_positions']
    delete payload['spare_tyres_info']
    delete payload['tyres_info']
    return payload
  }

  getAssetsTypeList() {
    this._ownAssetsService.getSpecifications(this.assetsDetailsForm.get('category').value).subscribe((response: any) => {
      this.assetsTypeList = response.result;
    });
  }

  getNewSpecifications(event) {
    if (event) {
      this.initialValues.specification = getBlankOption();
      this.assetsTypeList = [];
      this.initialValues.specification = { value: event.id, label: event.label };
      this.assetsDetailsForm.controls['specification'].setValue(event.id);
      this.getAssetsTypeList();
    }
  }

  addNewSpecifications(event) {
    if (event) {
      this.addSpecificatins = {
        category: this.assetsDetailsForm.get('category').value,
        specification: event,
      };

    }
  }

  addNewAssetMake(event) {
    this.assetMakeParam = {
      make_name: event,
    };
  }

  getNewAssetMake(event) {
    if (event) {
      this.assetsMake = [];
      this._ownAssetsService.getAssetMake().subscribe((response) => {
        this.initialValues.model = getBlankOption()
        this.assetsDetailsForm.get('brand').get('model').setValue(null);
        this.assetsDetailsForm.get('brand').get('make').setValue(event.id);
        this.makeSelectedId = event.id;
        this.assetsMake = response.result;
        this.assetModel = [];
      });
    }
  }

  addNewAssetModel(event) {
    this.assetModelParam = {
      vehicle_make: this.makeSelectedId ? this.makeSelectedId : "",
      model_name: event
    };
  }

  getNewAssetModel(event) {
    if (event) {
      this.assetModel = [];
      this._ownAssetsService.getAssetModel(this.makeSelectedId).subscribe((response) => {
        this.assetsDetailsForm.get('brand').get('model').setValue(event.id);
        this.assetModel = response.result;
      });
    }
  }

  patchAssetTypeDetails() {
    this.patchVehicleMake(this.assetDetails);
    this.patchVehicleModel(this.assetDetails);
    this.patchSpecifications(this.assetDetails)
    this.patchFormValues(this.assetDetails);
    this.getAssetsTypeList();
  }



  patchVehicleModel(data) {
    if (isValidValue(data.model)) {
      this.initialValues.model['id'] = data.model.id;
      this.initialValues.model['label'] = data.model.model_name;
    }

  }

  patchSpecifications(data) {
    if (isValidValue(data.specification)) {
      this.initialValues.specification['value'] = data.specification.id;
      this.initialValues.specification['label'] = data.specification.label;
    }

  }

  patchVehicleMake(data) {
    if (isValidValue(data.brand)) {
      this.initialValues.make['id'] = data.brand.id;
      this.initialValues.make['label'] = data.brand.make_name;
      this.makeSelectedId = data.brand.id;
      this._ownAssetsService.getAssetModel(data.brand.id).subscribe((response) => {
        this.assetModel = response.result;
      });
    }
  }


  patchFormValues(data: any) {
    const assetsData = cloneDeep(data);
    assetsData.specification = data.specification !== null ? data.specification.id : null;
    this.isCatagorySelected = true;
    this.assetsDetailsForm.patchValue(assetsData);
    this.assetsDetailsForm.get('brand').patchValue({
      make: data.brand !== null && data.brand.id ? data.brand.id : null,
      model: data.model !== null && data.model.id ? data.model.id : null
    })
    setTimeout(() => {
      this.ownAssetSubDetails.next(assetsData.subdetails);
      this.certificate.next(assetsData.certificates);
      this.subAssets.next(assetsData.attachments);
      this.tyreDetails.next(assetsData.tyres)
      this.assetsPermits.next(assetsData.permits)
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


  resetOntabSelection() {
    this.initialValues.specification = getBlankOption();
    this.initialValues.make = getBlankOption();
    this.initialValues.model = getBlankOption();
    this.assetsDetailsForm.get('brand').reset();
    this.assetsDetailsForm.patchValue({
      asset_no: null,
      display_no: null,
      specification: null,
    });
    this.assetsDetailsForm.markAsUntouched();
  }

  addPartyToOption(e) {
    if (this.showAddPartyPopup['from'] == 'certificate') {
      this.newPartyDetailsCertificate.next(e)
    } else {
      this.newPartyDetailsAssets.next(e)
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false, from: '' };
  }

  addNewParty(e) {
    this.showAddPartyPopup = e
  }


  getCancreateAsset(){
    this._ownAssetsService.getCanCreateAsset().subscribe(resp => {
      this.canCreateAsset = resp.result.can_create_asset;
      this.registeredAssets = resp.result.max_assets
    })
  }

}
