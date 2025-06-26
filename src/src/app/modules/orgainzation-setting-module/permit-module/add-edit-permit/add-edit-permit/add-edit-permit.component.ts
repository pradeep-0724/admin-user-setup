import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CountryIdService } from 'src/app/core/services/countryid.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { getCountryDetails } from 'src/app/shared-module/utilities/countrycode-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { PlacesAutoSearch } from 'src/app/modules/customerapp-module/places-auto-complete/places-auto-search.service';
import { scrollToRight } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { PermitServiceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/permit-service/permit-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-edit-permit',
  templateUrl: './add-edit-permit.component.html',
  styleUrls: ['./add-edit-permit.component.scss']
})
export class AddEditPermitComponent implements OnInit {

  permitForm: FormGroup;
  isUnique: boolean;
  constructor(private _fb: FormBuilder, private _activateRoute: ActivatedRoute, private _commonloaderservice: CommonLoaderService,

    private permitService: PermitServiceService, private router: Router, private _countryId: CountryIdService, private _companyModuleService: CompanyModuleServices,
    private _placesService: PlacesAutoSearch,private apiHandler:ApiHandlerService) { }

  uniquePermitErr = '';
  permitId = '';
  permitEditData;
  addedPermitsList = [];
  countryId = '';
  countriesList = [];
  statesList = [];
  newLocations = [];
  isSelected: boolean = false;
  addCoOrdinatesForm: FormGroup;
  googleMaps = `../../../../../../../assets/img/google-maps.png`
  googleMapsGray = '../../../../../../../assets/img/icons/google-maps-gray.png'
  token = '';
  pattern = new ValidationConstants().VALIDATION_PATTERN.CO_ORDINATES;
  zoom = 10;
  center: google.maps.LatLngLiteral = { lat: 24.838156699240745, lng: 55.10218011500681 }
  minLocationSelectedErr = '';
  activeTab = 0;
  initialDetails = {
    areaSelection: []
  }
  areaCoverage = [
    {
      label: 'Entire State',
      value: 0
    },
    {
      label: 'Exclude Selected Areas',
      value: 1
    }, {
      label: 'Include Selected Areas',
      value: 2
    },
  ];
  updatedStates = [];
  ngOnInit(): void {
    this._commonloaderservice.getHide();
    this.countryId = this._countryId.getCountryId();
    this.getCountry();
    this.permitForm = this._fb.group({
      name: ['', Validators.required],
      searchLocation: [''],
      expiry_date_mandatory: [false],
      states: this._fb.array([]),
    });


    this._activateRoute.params.subscribe(prams => {
      if (prams['permitID']) {
        this.permitId = prams['permitID'];
        this.permitService.getPermitDetails(prams['permitID']).subscribe((response) => {
          this.permitEditData = response['result']
          this.permitForm.patchValue(response['result']);
          this.buildPermits(response['result']['states']);
          this.setLocationsValues(response['result']['states'])
          this.isUnique = true;
          this.getStates();
        })
      } else {
        this._companyModuleService.getStates(getCountryDetails(this.countryId).id).subscribe(result => {
          this.statesList = result['results'];
        })
      }
    })
    this.getAvailablePermitsList();
    this.permitForm.controls.name.valueChanges.pipe(debounceTime(600)).subscribe((value) => {
      this.uniquePermitErr = '';
      this.checkUniquePermit(value)
    })
    this.buildPermits([{}])
    this.placeSearch();
  }

  buildPermits(items: any[]) {
    let states = this.permitForm.get('states') as UntypedFormArray;
    states.controls = [];
    this.initialDetails.areaSelection = [];
    items.forEach((ele, index) => {
      this.initialDetails.areaSelection.push({})
      states.push(this.buildPermitgroup(ele));
      this.initialDetails.areaSelection[index] = this.areaCoverage[0];
    })
  }

  buildPermitgroup(item) {
    return this._fb.group({
      locations: this._fb.array([]),
      country: [
        item.country || getCountryDetails(this.countryId).country, [Validators.required]
      ],
      state: [
        item.state || '', [Validators.required]
      ],
      area: [item.area || 0],
    })
  }

  setLocationsValues(items: any[]) {
    let states = this.permitForm.get('states') as UntypedFormArray;
    states.controls.forEach((form, index) => {
      const locations = form.get('locations') as UntypedFormArray;
      const newLocations = items[index].locations;
      while (locations.length < newLocations.length) {
        locations.push(this._fb.control(null));
      }
      locations.setValue(newLocations);
    });
    items.forEach((ele, index) => {
      let selectedArea = this.areaCoverage.find(ele => ele.value == states.at(index).value['area'])
      this.initialDetails.areaSelection[index] = selectedArea;
    })
  }

  addMoreState() {
    let states = this.permitForm.get('states') as UntypedFormArray;
    this.activeTab = states.length
    this.initialDetails.areaSelection.push({})
    states.push(this.buildPermitgroup({}));
    this.initialDetails.areaSelection[states.length - 1] = this.areaCoverage[0];
    scrollToRight('fake-tab-bar-scroll');
    this.getStates();
    this.permitForm.get('searchLocation').setValue('')
  }
  tabChanged(index) {
    let states = this.permitForm.get('states') as UntypedFormArray;
    this.activeTab = index;
    let selectedArea = this.areaCoverage.find(ele => ele.value == states.at(this.activeTab).value['area'])
    this.initialDetails.areaSelection[index] = selectedArea;
    this.getStates();
    let locations = states.at(this.activeTab).get('locations') as UntypedFormArray
    if (locations.controls.length) {
      this.zoomTo(locations.value[0]['locations'])
    }
    this.permitForm.get('searchLocation').setValue('')
  }

  removeState(index) {
    let states = this.permitForm.get('states') as UntypedFormArray;
    states.removeAt(index);
    this.activeTab = index - 1;
    this.initialDetails.areaSelection.splice(index, 1)
    this.permitForm.get('searchLocation').setValue('')
  }


  getAvailablePermitsList() {
    this.permitService.getAllPermitDetails().subscribe((response) => {
      this.addedPermitsList = response['result'].vp;
    })
  }

  getCountry() {
    this._companyModuleService.getCountry().subscribe(result => {
      this.countriesList = result['results'];
    })
  }

  getStates() {
    let states = this.permitForm.get('states') as UntypedFormArray;
    let countryName = states.at(this.activeTab).get('country').value;
    let val = this.countriesList.filter(country => country.name === countryName);
    if (val.length)
      this._companyModuleService.getStates(val[0].id).subscribe(result => {
        this.statesList = result['results'];
      })
  }

  countryChange() {
    let states = this.permitForm.get('states') as UntypedFormArray;
    this.getStates();
    states.at(this.activeTab).get('state').setValue('');
    this.getStateArea()
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

  checkUniquePermit(name) {
    if (name.trim()) {
      let isPermitExits = this.addedPermitsList.some((ele) => ele.name.toLowerCase() === name.toLowerCase());
      if (isValidValue(this.permitId)) {
        if (this.permitEditData?.['name'].toLowerCase() !== name.toLowerCase() && isPermitExits) {
          this.uniquePermitErr = 'Permit already exists';
          this.isUnique = false
        } else {
          this.isUnique = true
          this.uniquePermitErr = '';
        }
      } else {
        if (isPermitExits) {
          this.uniquePermitErr = 'Permit already exists';
          this.isUnique = false
        } else {
          this.isUnique = true
          this.uniquePermitErr = '';
        }
      }

    }

  }

  submitForm() {
    if (this.permitForm.valid && this.isUnique) {
      this._commonloaderservice.getShow();
      if (!this.permitId) {
        this.apiHandler.handleRequest(this.permitService.postPermitDetails(this.permitForm.value),'Permit details added Successfully!').subscribe({
          next:(resp)=>{
            this.router.navigate([getPrefix() + '/organization_setting/permit/list']);
          },
          error:(err)=>{
            console.log(err)
          }
        })
      } else {
        this.apiHandler.handleRequest(this.permitService.updatePermitDetails(this.permitId, this.permitForm.value),'Permit details updated Successfully!').subscribe({
          next:(resp)=>{
            this.router.navigate([getPrefix() + '/organization_setting/permit/list'])
          },
          error:(err)=>{
            console.log(err)
          }
        })
      }
    }
    else {
      let states = this.permitForm.get('states') as UntypedFormArray;
      states.controls.forEach((form: FormGroup) => {
        this.setAsTouched(form)
      })
      this.setAsTouched(this.permitForm)

    }
  }

  cancel() {
    this.router.navigate([getPrefix() + '/organization_setting/permit/list'])
  }

  placeSearch() {
    let states = this.permitForm.get('states') as UntypedFormArray;
    this.permitForm.get('searchLocation').valueChanges
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(place => {
        let data = {
          country: this.getISOFromCountry(states.at(this.activeTab).value['country']),
          location: place.trim()
        };
        if (!this.isSelected && place.trim().length > 3) {
          this.getNewLocations(data);
        }
      });
  }
  

  optionSelected() {
    let selectedValue = this.permitForm.get('searchLocation').value;
    this.permitForm.get('searchLocation').setValue('');
    if (this.newLocations.length > 0 && !this.isSelected) {
      let option = this.newLocations.find(option => option.name === selectedValue);
      if (option) {
        let data = {
          name: option.name,
          locations: this.makeLatlng(option.coordinates),
        };
        this.addLocationValues(data);
        this.openResentList();
      }
    }
  }


  getISOFromCountry(country) {
    const c = this.countriesList.filter(countryObj => countryObj.name === country);
    if (c.length > 0) return c[0].iso2;
    return ''
  }

  stateSelected() {
    this.getStateArea()
  }


  getNewLocations(data) {
    this.newLocations = [];
    this.isSelected = false
    this.newLocations = []
    this._placesService.getAreaGeoCodes(data).subscribe(place => {
      this.newLocations = place.result;
      this.openResentList()
    });
  }

  addLocationValues(data) {
    let states = this.permitForm.get('states') as UntypedFormArray;
    let locations = states.at(this.activeTab).get('locations') as UntypedFormArray;
    let color = this.generateRandomHexColor()
    let item = this._fb.group({
      name: data.name,
      locations: [data.locations],
      polygonOptions: {
        strokeColor: color,
        strokeOpacity: 1.0,
        strokeWeight: 3,
        fillColor: color,
        fillOpacity: 0.5,
      }
    })
    locations.push(item);
    if (data.locations.length > 0) {
      this.zoom = 0;
      this.center = { lat: null, lng: null }
      setTimeout(() => {
        this.center = this.getOneLatLng(locations.controls[locations.controls.length - 1].value['locations'])
        this.zoom = 10
      }, 100);

    }
  }

  addLocationWithoutLatLng() {
    let states = this.permitForm.get('states') as UntypedFormArray;
    let locationName = this.permitForm.get('searchLocation').value
    if (locationName.trim()) {
      let locations = states.at(this.activeTab).get('locations') as UntypedFormArray;
      let item = this._fb.group({
        name: locationName,
        locations: [[]]
      })
      locations.push(item);
      this.permitForm.get('searchLocation').setValue('')
    }
  }




  recentLocationSelected(loc) {
    this.minLocationSelectedErr = '';
    this.addLocationValues(loc)
    this.openResentList()
  }

  openResentList() {
    this.isSelected = false;
  }


  removeLocation(index) {
    let states = this.permitForm.get('states') as UntypedFormArray;
    let locations = states.at(this.activeTab).get('locations') as UntypedFormArray
    locations.removeAt(index);
  }


  zoomTo(location) {
    if (location.length > 0) {
      this.zoom = 0;
      this.center = { lat: null, lng: null }
      setTimeout(() => {
        this.center = this.getOneLatLng(location)
        this.zoom = 10;
      }, 100);
    }

  }

  coverageAreaSelected() {
    this.getStateArea()
  }


  getStateArea() {
    let form = this.permitForm.get('states') as UntypedFormArray;
    let locs = form.at(this.activeTab).get('locations') as UntypedFormArray;
    locs.controls = [];
    locs.updateValueAndValidity();

    const areaType = form.at(this.activeTab).get('area').value;
    const state = form.at(this.activeTab).get('state').value;
    const country = form.at(this.activeTab).get('country').value;

    if (Number(areaType) === 0 && state && country) {
      const area = {
        country: this.getISOFromCountry(country),
        location: `${state} ${country}`
      };

      this._placesService.getAreaGeoCodes(area).subscribe(place => {
        this.newLocations = place.result;
        if (this.newLocations.length) {
          const data = {
            name: this.newLocations[0].name,
            locations: this.makeLatlng(this.newLocations[0].coordinates),
          };
          this.addLocationValues(data);
        }
      });
    }
  }

  checkIsStateAlreadySelected() {
    // not using for now
    let permits = this.permitForm.get('states') as UntypedFormArray;
    let selectedStates = permits.controls.map((element: FormGroup) => {
      return element.get('state').value
    });
    this.updatedStates = this.statesList;
    this.updatedStates = this.updatedStates.filter(
      (ele) => !selectedStates.includes(ele.name)
    );
    this.statesList = this.updatedStates;
  }

  makeLatlng(rawCoordinates) {
    if (rawCoordinates.length === 0) return [];
    const processCoordinates = (coordinates) => {
      if (
        Array.isArray(coordinates) &&
        coordinates.length > 0 &&
        typeof coordinates[0] === 'number'
      ) {
        const [lng, lat] = coordinates;
        return { lat, lng };
      }
      return coordinates.map(processCoordinates);
    };

    return processCoordinates(rawCoordinates);
  }

  generateRandomHexColor(): string {
    const randomR = Math.floor(Math.random() * 256);
    const randomG = Math.floor(Math.random() * 256);
    const randomB = Math.floor(Math.random() * 256);
    const randomColor = `#${randomR.toString(16).padStart(2, '0')}${randomG.toString(16).padStart(2, '0')}${randomB.toString(16).padStart(2, '0')}`;
    return randomColor;
  }

  getOneLatLng(rawCoordinates) {
    type LatLng = { lat: number; lng: number };
    const extractObject = (input: any): LatLng | null => {
      if (Array.isArray(input)) {
        if (Array.isArray(input[0])) {
          return input[0][0];
        } else {
          return input[0];
        }
      }
      return null;
    };
    return extractObject(rawCoordinates[0]);




  }

}


