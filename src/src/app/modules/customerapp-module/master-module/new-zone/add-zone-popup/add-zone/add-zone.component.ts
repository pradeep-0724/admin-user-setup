import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ActivatedRoute, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { ZoneService } from 'src/app/modules/customerapp-module/api-services/master-module-services/zone-service/zone.service';
import { SetHeightService } from 'src/app/core/services/set-height.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent implements OnInit, AfterViewChecked, OnDestroy {

  placeForm: FormGroup;
  googleMaps = `../../../../../../../assets/img/google-maps.png`
  googleMapsGray = '../../../../../../../assets/img/icons/google-maps-gray.png'
  pattern = new ValidationConstants().VALIDATION_PATTERN.CO_ORDINATES;
  isUnique: boolean;
  zoom = 10;
  center: google.maps.LatLngLiteral = { lat: 25.20584515715115, lng: 55.29476642979386, };
  markerOptions: google.maps.MarkerOptions = {
    icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  marker: any;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  apiError = '';
  locationList = []
  emptyLocation=getBlankOption();
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};


  constructor(private _countryId: CountryIdService, private _companyModuleService: CompanyModuleServices, private _fb: FormBuilder, private _activateRoute: ActivatedRoute, private _commonloaderservice: CommonLoaderService,
    private zoneService: ZoneService, private router: Router, private setHeight: SetHeightService, private apiHandler: ApiHandlerService, private _analytics: AnalyticsService, private _commonService: CommonService) { }
  uniqueZoneErr = '';
  zoneId = '';
  zoneEditData = {};
  country = [];
  statesBilling = [];
  countryId;
  minLocationSelectedErr = '';
  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }

  ngOnInit(): void {
    this.getCountry();
    this.getLocationList();
    this.countryId = this._countryId.getCountryId();
    this._commonloaderservice.getHide();
    this.placeForm = this._fb.group({
      name: [null, Validators.required],
      areas: this._fb.array([]),
      location_selection: '',
      country: [getCountryDetails(this.countryId)?.country, [Validators.required]],
      state: ['', [Validators.required]]
    });


    this._activateRoute.params.subscribe(prams => {
      if (prams['id']) {
        this.zoneId = prams['id'];
        this.zoneService.getZone(prams['id']).subscribe((response) => {
          this.zoneEditData = response['result']
          this.isUnique = true;
          this.placeForm.get('name').setValue(this.zoneEditData['zone_detail'].name);
          this.placeForm.get('country').setValue(this.zoneEditData['zone_detail'].country || '');
          this.placeForm.get('state').setValue(this.zoneEditData['zone_detail'].state || '');
          let country = this.country.find(c => c.name == this.zoneEditData['zone_detail'].country);
          if (country) {
            this._companyModuleService.getStates(country.id).subscribe(result => {
              this.statesBilling = result['results'];
            })
          }
          this.zoneEditData['zone_detail'].areas.forEach((data) => {
            this.addLocationValues(data)
          });
        })
      } else {
        this._companyModuleService.getStates(getCountryDetails(this.countryId).id).subscribe(result => {
          this.statesBilling = result['results'];
        })
      }
    })
  }

  ngAfterViewChecked(): void {
    let size = (this.placeForm.get('areas') as UntypedFormArray).length
    if (size) {
      this.setHeight.setTableHeight2(['.calc-height'], 'locations-table', 0)
    } else {
      this.setHeight.setTableHeight2(['.calc-height'], 'google-map', 0);
    }

  }
  getCountry() {
    this._companyModuleService.getCountry().subscribe(result => {
      this.country = result['results'];


    })
  }
  billingCountryChange() {
    this.getStates();
    this.placeForm.get('state').setValue('');
  }

  addLocationValues(data){
    let areas = this.placeForm.get('areas') as UntypedFormArray;
    areas.push(this.getArea(data));
  }
  getStates() {
    let countryName = this.placeForm.get('country').value;
    let val = this.country.filter(country => country.name === countryName);
    if (val.length)
      this._companyModuleService.getStates(val[0].id).subscribe(result => {
        this.statesBilling = result['results'];
      })
  }

  zonenameChange(){
    this.checkUniqueZone(this.placeForm.controls.name.value)
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

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  checkUniqueZone(name) {
    this.uniqueZoneErr = '';
    if (name.trim()) {
      this.zoneService.checkIsZoneNameUnique(name).subscribe((response) => {
        if (response?.result?.is_exists) {
          this.uniqueZoneErr = 'Zone already exists';
          this.isUnique = false
        } else {
          this.isUnique = true
          this.uniqueZoneErr = '';
        }
      })
    }

  }

  submitForm() {
    this.minLocationSelectedErr = '';
    let areas = this.placeForm.get('areas').value;
    if (this.placeForm.valid && this.isUnique) {
      if (areas.length > 0) {
        if (!this.zoneId) {
          this.apiHandler.handleRequest(this.zoneService.addZone(this.placeForm.value), 'Zone details added successfully!').subscribe(
            {
              next: () => {
                this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.ZONE)
                this.router.navigate([getPrefix() + '/onboarding/zone/list']);
              },
              error: () => {
                this.apiError = 'Failed to update zone details!';
                setTimeout(() => (this.apiError = ''), 3000);
              },
            })
        } else {
          this.apiHandler.handleRequest(this.zoneService.updateZone(this.zoneId, this.placeForm.value), 'Zone details updated successfully!').subscribe(
            {
              next: () => {
                this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.ZONE)
                this.router.navigate([getPrefix() + '/onboarding/zone/list']);
              },
              error: () => {
                this.apiError = 'Failed to add zone details!';
                setTimeout(() => (this.apiError = ''), 3000);
              },
            })
        }
      } else {
        this.minLocationSelectedErr = 'Add atleast one areas';
      }
    }
    else {
      this.setAsTouched(this.placeForm)

    }
  }

  cancel() {
    this.router.navigate([getPrefix() + '/onboarding/zone/list'])
  }
  locationSelected(form: FormGroup) {
  let locObj= this.locationList.find(location=>location.id==form.get('location_selection').value)
  if(locObj){
    this.addLocationValues(locObj)
    form.get('location_selection').setValue('')
    this.emptyLocation={label:'',value:''}
  }
  }

  getNewArea(event, form: FormGroup) {
    if (event) {
      this._commonService
        .getStaticOptions('area')
        .subscribe((response) => {
          this.addLocationValues(event)
          this.locationList = response.result['area'];
          this.placeForm.get('location_selection').setValue('')
          this.emptyLocation={label:'',value:''}
        });
    }
  }

  getLocationList() {
    this._commonService
      .getStaticOptions('area')
      .subscribe((response) => {
        this.locationList = response.result['area'];
      });
  }

  addNewArea(event) {
    this.areaParams = {
      key: 'area',
      label: event,
      value: 0
    };
  }

  removeZone(index) {
    let areas = this.placeForm.get('areas') as UntypedFormArray;
    areas.removeAt(index);
  }

  getArea(area){
    return this._fb.group({
      name:area?.name?area?.name:area?.label,
      id:area.id
    })
  }


}

