import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Observable, Subject, of } from 'rxjs';
import { MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { cloneDeep, isArray, isEqual } from 'lodash';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { PhoneCodesFlagService } from 'src/app/core/services/phone-code_flag.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { NewTripV2Constants } from '../../../new-trip-v2-constants/new-trip-v2-constants';
import { MultipleDestinationFormManupulation, getDHMS, getDistanceData, getEstimateDistance, scrollToRight, swapInitialValues } from '../edit-multiple-destination-utils';
import { ToolTipInfo } from '../../../new-trip-v2-utils/new-trip-v2-utils';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
@Component({
  selector: 'app-multiple-destination',
  templateUrl: './multiple-destination.component.html',
  styleUrls: ['./multiple-destination.component.scss'],
})
export class EditMultipleDestinationComponent implements OnInit, OnChanges {
  constantsTripV2 = new NewTripV2Constants();
  multipleDestinationForm: FormGroup;
  pointOfTypeUrl = TSAPIRoutes.static_options;
  pintType = new NewTripV2Constants().pointType
  pointTypeList = [];
  pointOfTypeParam: any = {};
  selectedIndex = 0;
  totalKmsAndTimeTaken = {
    kms: 0,
    time: {
      days: 0,
      hours: 0,
      minutes: 0
    }
  }
  initialValues = {
    point: [],
    countryCode: [],
    contactName: [],
  }
  pointList = this.constantsTripV2.pointList;
  center: google.maps.LatLngLiteral = { lat: 12.922030489697406, lng: 77.66018159278231 };
  zoom = 4;
  destinationWithLngLat: boolean = false;
  messageInMap = this.constantsTripV2.messageConstants.ALL_LOCATION_CO_ORDINATES;

  options: google.maps.DirectionsRendererOptions;
  makeMarker: google.maps.MarkerOptions[] = []
  rendererOptions = {
    markerOptions: {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
      },
      label: {
        text: 'A',  // Remove the default label text (A, B, C, etc.)
        color: 'transparent',

      }
    }
  }
  isFromToInvalid = new Subject();
  @Input() routeId: Observable<string>;
  @Input() contactPersonList = [];
  @Input() officeStatus = 0;
  @Input() ismultipleDestinationFormValid: Observable<boolean>
  @Input() routeDestinations: Observable<[]>
  @Output() multipleDestinationFormData = new EventEmitter()
  directionsResults$: Observable<google.maps.DirectionsResult | undefined>;
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  coOrdinatesArray: string = '';
  selectedRoute: string = '';
  isFormvalid: boolean = true;
  countryPhoneCodeList = [];
  isUpdateActive: boolean = false;
  routeDestinationsData = [];
  countryId: string = '';
  defaultPhoneFlag = {
    code: '',
    flag: ''
  }
  markerPositions = [];
  locationToolTip: ToolTipInfo;
  pointTypeToolTip: ToolTipInfo;
  tripTaskToolTip: ToolTipInfo;
  scheduleDateandtimeToolTip: ToolTipInfo;
  reachTimeToolTip: ToolTipInfo;
  haltTimeToolTip: ToolTipInfo;
  tripMapToolTip: ToolTipInfo;
  starttoDestinationToolTip: ToolTipInfo
  drop(event: CdkDragDrop<string[]>) {
    if (this.officeStatus == 0) {
      this.dragAndDrop(event)
    }

    if (this.officeStatus > 0 && event.currentIndex > this.officeStatus - 1) {
      this.dragAndDrop(event)
    }

  }

  constructor(private _fb: FormBuilder, 
              private mapDirectionsService: MapDirectionsService, 
              private _phone_codes_flag_service: PhoneCodesFlagService, 
              private _companyModuleService: CompanyModuleServices, 
              private _commonService: CommonService) { }

  ngOnInit(): void {
    this.initializeToolTip();
    this.defaultPhoneFlag = this._phone_codes_flag_service.phoneCodesFlag;
    this.buildMultipleSestinationForm();
    setTimeout(() => {
      this.getPhoneCountryCode();
      this.getPointType();
    }, 100);
    this.routeId.subscribe(routeId => {
      if (routeId) {
        this.selectedRoute = routeId
      }
    });
    this.routeDestinations.subscribe(destinations => {
      if (destinations.length) {
        this.patchDestinations(destinations);
      }
    });
    this.ismultipleDestinationFormValid.subscribe(valid => {
      this.isFormvalid = valid;
      if (!valid) {
        this.isFromToInvalid.next(valid);
        this.setAsTouched(this.multipleDestinationForm)
      }

    });

    this.multipleDestinationForm.valueChanges.pipe(debounceTime(100), distinctUntilChanged()).subscribe(data => {
      this.multipleDestinationFormData.emit({
        isFormValid: this.multipleDestinationForm.valid,
        formData: cloneDeep(data['start_end_destination'])
      })
    });

  }

 

  ngOnChanges(changes: SimpleChanges): void {
    if ('contactPersonList' in changes) {
      this.contactPersonList = this.contactPersonList
    }
  }

  buildMultipleSestinationForm() {
    this.multipleDestinationForm = this._fb.group({
      start_end_destination: this._fb.array([])
    });
  }


  buildFormArray(destinations = []) {
    let destinationsArrayForm = new MultipleDestinationFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.buildDestinationFormArray(destinations, this.initialValues);
    this.preFillCountryCodeeAndFlag();
  }

  addNewDestination() {
    let destinationsArrayForm = new MultipleDestinationFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.addNewDestination(this.initialValues);
    this.selectedIndex = destinationsArrayForm.getFormArrayLength() - 1;
    this.drawthePathInMap();
    scrollToRight('drop-down-container');
    this.preFillCountryCodeeAndFlag();
  }

  removeDestination(i) {
    let destinationsArrayForm = new MultipleDestinationFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.removeFormAt(i, this.initialValues)
    this.selectedIndex = destinationsArrayForm.getFormArrayLength() - 1;
    this.drawthePathInMap();
  }

  selectedTab(i) {
    this.selectedIndex = i;
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(i);
    if (destination.get('point_type').value) {
      this.patchPointType(i, destination.get('point_type').value)
    }
    if (!this.isFormvalid) {
      setTimeout(() => {
        this.isFromToInvalid.next(this.isFormvalid);
        this.setAsTouched(this.multipleDestinationForm)
      }, 100);

    }
  }

  patchPointType(i, point_type) {
    this.initialValues.point[i] = this.pointTypeList.filter(point => point.id == point_type)[0]
  }

  locationSelected(e, i) {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(i);
    let location = destination.get('location') as FormGroup;
    location.patchValue(e.value);
    this.drawthePathInMap();
  }

  selectedCheckList(e, form) {
    let checklist = form.get('checklist') as FormArray;
    form.get('checklist').setValue([]);
    if (e.length) {
      e.forEach(element => {
        checklist.value.push(element)
      });
    }
  }

  startChangedToDestination(currentIndex) {
    this.drawthePathInMap();
  }

  destinationChangedToStart(currentIndex) {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(currentIndex);
    destination.get('point_type').setValue(this.pintType.PICKUP);
    destination.get('estimated_kms').setValue(0);
    destination.get('time_taken').patchValue({
      day: 0,
      hour: 0,
      minute: 0,
      total_time_seconds: 0
    });
    this.initialValues.point[currentIndex] = this.pointTypeList[currentIndex];
    this.drawthePathInMap();
  }


  drawthePathInMap() {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let coordinates = multipleDestinations.getAllLngLat();
    let isCoOrdinatesSame = this.coOrdinatesArray === JSON.stringify(multipleDestinations.getAllLngLat())
    if (coordinates.length == multipleDestinations.getFormArrayLength()) {
      if (!isCoOrdinatesSame || (!this.destinationWithLngLat && isCoOrdinatesSame)) {
        this.coOrdinatesArray = JSON.stringify(multipleDestinations.getAllLngLat());
        this.center = coordinates[0]
        const request: google.maps.DirectionsRequest = {
          origin: coordinates[0],
          destination: coordinates[coordinates.length - 1],
          waypoints: coordinates.slice(1, -1).map(coord => ({
            location: coord,
            stopover: true
          })),
          travelMode: google.maps.TravelMode.DRIVING
        };
        this.directionsResults$ = this.mapDirectionsService.route(request).pipe(map((response, status) => {
          this.destinationWithLngLat = true;
          this.markerPositions = coordinates;
          this.makeMarker = [];
          this.markerPositions.forEach((item, index) => {
            let destinationCount = index + 1;
            if (destinationCount < 11)
              this.makeMarker.push({
                icon: `assets/img/destinationImages/marker_red${destinationCount}.png`,
                label: {
                  text: 'Destination ' + destinationCount,
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Arial',
                  className: 'map-class-destination'
                }
              });

            if (destinationCount > 10)
              this.makeMarker.push({
                icon: `https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red${destinationCount}.png`,
                label: {
                  text: 'Destination ' + destinationCount,
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  fontFamily: 'Arial',
                  className: 'map-class-destination'
                }
              });

          })
          this.getEstimateTimeAndEstimateDistance(response.result)
          return response.result
        }
        ));
      }

    } else {
      this.directionsResults$ = of();
      this.destinationWithLngLat = false;
      this.messageInMap = this.constantsTripV2.messageConstants.ALL_LOCATION_CO_ORDINATES
      this.clearEstimateKms();
    }

  }

  getEstimateTimeAndEstimateDistance(distanceData) {
    if (distanceData.routes.length) {
      let routeListWithDistanceAndTime = distanceData.routes[0].legs
      routeListWithDistanceAndTime.forEach((routeData, index) => {
        this.patchEstimateTimeAndEstimateDistance(getDistanceData(routeData), index + 1)
      });
    } else {
      this.directionsResults$ = of();
      this.destinationWithLngLat = false;
      this.messageInMap = this.constantsTripV2.messageConstants.PATH_NOT_FOUND
    }

    this.getTotalEstimateKMSandTime();
  }

  patchEstimateTimeAndEstimateDistance(distaceData, index) {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(index);
    let dayHourMin = getDHMS(distaceData.duration)
    destination.get('time_taken').patchValue({
      day: dayHourMin.days,
      hour: dayHourMin.hours,
      minute: dayHourMin.minutes,
      total_time_seconds: dayHourMin.totalSeconds
    })
    destination.get('estimated_kms').setValue(getEstimateDistance(distaceData.distance))
  }

  clearEstimateKms() {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    multipleDestinations.multipeDestinationFormArray.controls.forEach(destination => {
      destination.get('time_taken').patchValue({
        day: 0,
        hour: 0,
        minute: 0,
        total_time_seconds: 0
      });
      destination.get('estimated_kms').setValue(0)
    });
  }

  preFillCountryCodeeAndFlag() {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let destinations = multipleDestinations.multipeDestinationFormArray;
    destinations.controls.forEach((destination, index) => {
      let contact_no = destination.get('contact_no') as FormGroup;
      let code = contact_no.get('code');
      let flag = contact_no.get('flag');
      if (!code.value) {
        code.setValue(this.defaultPhoneFlag.code);
        this.initialValues.countryCode[index] = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
      }
      if (!flag.value) {
        flag.setValue(this.defaultPhoneFlag.flag)
      }
    });

  }

  getTotalEstimateKMSandTime() {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let estimeteTimeAndKMS = multipleDestinations.getTotalKmsAndTotalSeconds();
    this.totalKmsAndTimeTaken.kms = estimeteTimeAndKMS.totalmeters / 1000;
    this.totalKmsAndTimeTaken.time = getDHMS(estimeteTimeAndKMS.totalSeconds);
  }

  getKmsAndTime() {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm);
    return multipleDestinations.getKmsAndTimeAt(this.selectedIndex)
  }

  setContactPerson(contactPerson: string, index: number) {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(index);
    let contact_no = destination.get('contact_no') as AbstractControl;
    if (contactPerson.trim()) {
      destination.get('contact_name').setValue(contactPerson);
      setUnsetValidators(contact_no, 'number', [Validators.required, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
      this.initialValues.contactName[index] = { label: contactPerson, value: contactPerson };
    } else {
      setUnsetValidators(contact_no, 'number', [Validators.nullValidator, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
      contact_no.get('code').setValue(this.defaultPhoneFlag.code)
      contact_no.get('number').setValue('');
      destination.get('contact_name').setValue('')
      this.initialValues.countryCode[index] = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
    }


  }

  onContactPersonSelection(contactPerson: string, index: number) {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(index)
    let contact_no = destination.get('contact_no') as AbstractControl;
    if (contactPerson.trim()) {
      setUnsetValidators(contact_no, 'number', [Validators.required, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
    } else {
      setUnsetValidators(contact_no, 'number', [Validators.nullValidator, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
    }
    let contactDetails = this.contactPersonList.filter(contact => contact.name == contactPerson)[0];
    this.initialValues.contactName[index] = { label: contactPerson, value: contactPerson }
    this.initialValues.countryCode[index] = { label: contactDetails.country_code, value: contactDetails.country_code }
    contact_no.get('code').setValue(contactDetails.country_code);
    contact_no.get('number').setValue(contactDetails.contact_number);
    let flag = this.countryPhoneCodeList.filter(codeFlag => codeFlag.phone_code == contact_no.value['code'])[0].flag_url
    contact_no.get('flag').setValue(flag)


  }

  isUpdateRouteActive() {
    this.multipleDestinationForm.valueChanges.pipe(debounceTime(300)).subscribe(data => {
      this.checkForUpdateRoute(data['start_end_destination'])
    });
  }

  checkForUpdateRoute(destinationsData: Array<any>) {
    this.isUpdateActive = false;
    let destinations = cloneDeep(destinationsData)
    if (this.multipleDestinationForm.valid && this.selectedRoute) {
      if (destinations.length == this.routeDestinationsData.length) {
        for (let index = 0; index < destinations.length; index++) {
          let routeDestination = this.routeDestinationsData[index];
          if (!isEqual(routeDestination.location, destinations[index].location)) {
            this.isUpdateActive = true;
            return
          }
          if (!isEqual(routeDestination.checklist, destinations[index].checklist)) {
            this.isUpdateActive = true;
            return
          }
        }
      } else {
        this.isUpdateActive = true;
      }

    }
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
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

  patchDestinations(destinations: Array<any>) {
    destinations.forEach(destination => {
      if (isArray(destination['checklist'])) {
        destination['checklist'].forEach(checklist => {
          checklist['selected'] = true
        });
      }
    });
    this.initialValues = {
      point: [],
      countryCode: [],
      contactName: [],
    }
    this.buildFormArray(destinations);
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm);

    destinations.forEach((destination, index) => {
      let destinationPoint = multipleDestinations.getDestinationForm(index);
      destinationPoint.get('point_type').setValue(destination['point_type'].id);
      this.initialValues.contactName[index] = { label: destination.contact_name, value: destination.contact_name }
      this.initialValues.point[index] = { label: destination['point_type'].label, value: destination['point_type'].id };
      this.initialValues.countryCode[index] = { label: destination.contact_no.code, value: destination.contact_no.code }
    });
    this.routeDestinationsData = cloneDeep(destinations)
    setTimeout(() => {
      this.isUpdateRouteActive();
    }, 1000);

  }

  routPopUpData(e) {
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    if (e) {
      this.routeDestinationsData = cloneDeep(multipleDestinations.multipeDestinationFormArray.value);
      this.checkForUpdateRoute(multipleDestinations.multipeDestinationFormArray.value)
    }
  }

  getPhoneCountryCode() {
    this._companyModuleService.getPhoneCode().subscribe(result => {
      this.countryPhoneCodeList = result['results'];
    });
  }

  onCountryCodeSelection(form: AbstractControl, index) {
    let contact_no = form.get('contact_no')
    let flag = this.countryPhoneCodeList.filter(codeFlag => codeFlag.phone_code == contact_no.value['code'])[0].flag_url
    contact_no.get('flag').setValue(flag)
    this.initialValues.countryCode[index] = { label: contact_no.value['code'], value: contact_no.value['code'] }
  }

  getNewPointOfType(event, currentIndex) {

    if (event) {
      this._commonService.getStaticOptions('route-point-type').subscribe((response) => {
        this.pointTypeList = response['result']['route-point-type']
        let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
        let destination = multipleDestinations.getDestinationForm(currentIndex);
        destination.get('point_type').setValue(event.id);
        this.initialValues.point[currentIndex] = { label: event.label, value: event.id }
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
      this.pointOfTypeParam = {
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

  initializeToolTip() {
    this.locationToolTip = {
      content: this.constantsTripV2.toolTipMessages.LOCATION.CONTENT
    }
    this.pointTypeToolTip = {
      content: this.constantsTripV2.toolTipMessages.POINT_TYPE.CONTENT
    }
    this.tripTaskToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    }
    this.scheduleDateandtimeToolTip = {
      content: this.constantsTripV2.toolTipMessages.SCHEDULE_DATE_TIME.CONTENT
    }
    this.reachTimeToolTip = {
      content: this.constantsTripV2.toolTipMessages.REACH_TIME.CONTENT
    }
    this.haltTimeToolTip = {
      content: this.constantsTripV2.toolTipMessages.HALT_TIME.CONTENT
    }
    this.tripMapToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_MAP.CONTENT
    }
    this.starttoDestinationToolTip = {
      content: this.constantsTripV2.toolTipMessages.START_TO_DEST.CONTENT
    }
  }

  disableTab(event, i: number) {
    if (i + 1 <= this.officeStatus) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  dragAndDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.multipleDestinationForm.controls.start_end_destination['controls'], event.previousIndex, event.currentIndex);
    this.selectedTab(event.currentIndex);
    this.startChangedToDestination(event.currentIndex);
    if (event.currentIndex == 0) {
      this.destinationChangedToStart(event.currentIndex);
    }
    this.drawthePathInMap();
    swapInitialValues(event.previousIndex, event.currentIndex, this.initialValues.contactName)
    swapInitialValues(event.previousIndex, event.currentIndex, this.initialValues.countryCode)
  }

}
