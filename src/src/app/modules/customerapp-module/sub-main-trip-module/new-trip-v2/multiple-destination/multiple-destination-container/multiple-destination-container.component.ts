import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Observable, Subject, of } from 'rxjs';
import { MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs/internal/operators/map';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { MultipleDestinationContainerFormManupulation, getDistanceData, getEstimateDistance, getDHMS, scrollToRight, swapInitialValues, ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { debounceTime } from 'rxjs/operators';
import { cloneDeep, isArray, isEqual } from 'lodash';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { PhoneCodesFlagService } from 'src/app/core/services/phone-code_flag.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import moment from 'moment';
import { RateCardServiceService } from 'src/app/modules/customerapp-module/master-module/rate-card-module/rate-card-service.service';
import { MultipleDestionDataService } from '../multiple-destination-dataservice.service';
import { ZoneService } from 'src/app/modules/customerapp-module/api-services/master-module-services/zone-service/zone.service';
@Component({
  selector: 'app-multiple-destination-container',
  templateUrl: './multiple-destination-container.component.html',
  styleUrls: ['./multiple-destination-container.component.scss']
})
export class MultipleDestinationContainerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() parentForm?: FormGroup
  formType = 'destinations';
  constantsTripV2 = new NewTripV2Constants();
  optionsDropdownUrl = TSAPIRoutes.static_options;
  pontType = new NewTripV2Constants().pointType
  pointOfTypeParam: any = {};
  multipleDestinationForm: FormGroup;
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
    terminal: [],
    inspection: [],
    inspectionType: [],
    countryCode: [],
    contactName: [],
  }
  pointList = this.constantsTripV2.pointList;
  center: google.maps.LatLngLiteral = { lat: 12.922030489697406, lng: 77.66018159278231 };
  zoom = 4;
  destinationWithLngLat: boolean = false;
  messageInMap = this.constantsTripV2.messageConstants.ALL_LOCATION_CO_ORDINATES;

  routePopUpData = {
    show: false,
    type: '',
    customerId: ''
  }
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
  @Input() scopeOfWork = 0
  @Input() isShowTime: boolean = true
  @Input() routeId: Observable<string>;
  @Input() customerId: Observable<string>;
  @Input() contactPersonList = [];
  @Input() ismultipleDestinationFormValid: Observable<boolean>
  @Input() routeDestinations: Observable<[]>;
  @Input() isDisabledDestinationAdd = false;
  @Input() isShowTerminal = true;
  @Input() disabledIndex = 0;
  @Output() dateTimeChanged = new EventEmitter()
  @Output() locationSelectedEmitter = new EventEmitter()
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
  pointTypeList = [];
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
  terminalList = [];

  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};
  areaList = [];
  zonesList = []

  drop(event: CdkDragDrop<string[]>) {
    if (this.disabledIndex == 0) {
      this.dragAndDrop(event)
    }
    if (this.disabledIndex > 0 && event.currentIndex > this.disabledIndex - 1) {
      this.dragAndDrop(event)
    }
  }
  constructor(private _fb: FormBuilder, private mapDirectionsService: MapDirectionsService, private _phone_codes_flag_service: PhoneCodesFlagService, private _multipleDestionDataService: MultipleDestionDataService,
    private _companyModuleService: CompanyModuleServices, private _commonService: CommonService, private _rateCard: RateCardServiceService, private _zoneService: ZoneService) { }

  ngOnInit(): void {
    this.initializeToolTip();
    this.getZonesList();
    this.defaultPhoneFlag = this._phone_codes_flag_service.phoneCodesFlag;
    this.getPhoneCountryCode();
    this.getPointType();
    this.getTerminal();
    this.routeId.subscribe(routeId => {
      if (routeId) {
        this.selectedRoute = routeId
      }
    });
    this.routeDestinations.subscribe(destinations => {
      if (destinations.length) {
        this.patchDestinations(cloneDeep(destinations));
        this.selectedIndex = 0;
        this.updatedZones();
      }
    })
    this.customerId.subscribe(customerId => {
      if (customerId) {
        this.routePopUpData.customerId = customerId;
        this.selectedIndex = 0;
        this.destinationWithLngLat = false;
        this.initialValues.contactName.fill(getBlankOption())
      }
    })
    this.buildMultipleSestinationForm();
    this.buildFormArray([{}, {}]);
    this.ismultipleDestinationFormValid.subscribe(valid => {
      this.isFormvalid = valid;
      if (!valid) {
        this.isFromToInvalid.next(valid);
        this.setAsTouched(this.multipleDestinationForm)
      }
    });
    this.getAreaList();
  }

  dragAndDrop(event) {
    moveItemInArray(this.multipleDestinationForm.controls.start_end_destination['controls'], event.previousIndex, event.currentIndex);
    this.selectedTab(event.currentIndex);
    if (event.currentIndex == 0) {
      this.destinationChangedToStart(event.currentIndex);
    }
    swapInitialValues(event.previousIndex, event.currentIndex, this.initialValues.contactName)
    swapInitialValues(event.previousIndex, event.currentIndex, this.initialValues.countryCode);
    swapInitialValues(event.previousIndex, event.currentIndex, this.initialValues.inspection);
    swapInitialValues(event.previousIndex, event.currentIndex, this.initialValues.terminal);
    this.drawthePathInMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('isDisabledDestinationAdd' in changes) {
      this.isDisabledDestinationAdd = this.isDisabledDestinationAdd
    }
    if ('scopeOfWork' in changes) {
      this.scopeOfWork = this.scopeOfWork
      if (this.scopeOfWork) {
        if (Number(this.scopeOfWork) == 1) {
          this.buildFormArray([{
            destination_type: 1,
          }, {
            destination_type: 3,
          }]);
        }
        if (Number(this.scopeOfWork) == 2 || Number(this.scopeOfWork) == 4) {
          this.buildFormArray([{
            destination_type: 1,
          },
          {
            destination_type: 3,
          },
          {
            destination_type: 2,
          }]);
        }
        if (Number(this.scopeOfWork) == 3) {
          this.buildFormArray([{
            destination_type: 3,
          }, {
            destination_type: 2,
          }]);
        }
        let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
        multipleDestinations.multipeDestinationFormArray.controls.forEach((destination, index) => {
          if (destination.get('destination_type').value == 1 || destination.get('destination_type').value == 2) {
            destination.get('point_type').setValue(this.pontType.PORT);
            this.initialValues.point[index] = { label: "Port", value: this.pontType.PORT };
          }
          if (destination.get('destination_type').value == 3) {
            destination.get('point_type').setValue(this.pontType.CUSTOMERLOCATION);
            this.initialValues.point[index] = { label: "Customer Location", value: this.pontType.PORT };
          }
        })
        this.selectedTab(0)
      }
    }
  }

  ngOnDestroy(): void {
    if (this.parentForm) {
      this.parentForm.removeControl(this.formType);
    }

  }

  dateTimeSelected(e) {
    let date = moment(e.value).format('YYYY-MM-DD')
    this.dateTimeChanged.emit(date)

  }



  buildMultipleSestinationForm() {
    this.multipleDestinationForm = this._fb.group({
      start_end_destination: this._fb.array([])
    });

    if (this.parentForm) {
      this.parentForm.addControl(this.formType, this.multipleDestinationForm);
    }
  }


  buildFormArray(destinations = []) {
    this.initialValues = {
      point: [],
      countryCode: [],
      contactName: [],
      terminal: [],
      inspection: [],
      inspectionType: [],
    }
    let destinationsArrayForm = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.buildDestinationFormArray(destinations, this.initialValues);
    this.preFillCountryCodeeAndFlag();
  }

  addNewDestination() {
    let destinationsArrayForm = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.addNewDestination(this.initialValues);
    this.selectedIndex = destinationsArrayForm.getFormArrayLength() - 1;
    this.drawthePathInMap();
    scrollToRight('drop-down-container');
    this.preFillCountryCodeeAndFlag();
  }

  removeDestination(i) {
    let destinationsArrayForm = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.removeFormAt(i, this.initialValues);
    this.selectedIndex = destinationsArrayForm.getFormArrayLength() - 1;
    this.drawthePathInMap();
  }

  selectedTab(i) {
    this.selectedIndex = i;
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
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
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(i);
    let location = destination.get('location') as FormGroup;
    location.patchValue(e.value);
    this.drawthePathInMap();
    this.locationSelectedEmitter.emit(e)

    if (destination.get('destination_type').value == 1 && (this.scopeOfWork == 2 || this.scopeOfWork == 4)) {
      let multidestinationsForm = this.multipleDestinationForm.get('start_end_destination') as UntypedFormArray;
      let index = multidestinationsForm.controls.findIndex((control) => control.get('destination_type').value == 2)
      let location = multidestinationsForm.at(index).get('location') as FormGroup;
      location.patchValue(e.value);
      this.drawthePathInMap();
      this.locationSelectedEmitter.emit(e)
    }
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


  destinationChangedToStart(currentIndex) {
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    let destination = multipleDestinations.getDestinationForm(currentIndex);
    if (destination.value['destination_type'] == 0) {
      destination.get('point_type').setValue(this.pontType.PICKUP);
      this.initialValues.point[currentIndex] = this.pointTypeList[currentIndex];
    }
    destination.get('estimated_kms').setValue(0);
    destination.get('time_taken').patchValue({
      day: 0,
      hour: 0,
      minute: 0,
      total_time_seconds: 0
    });
    this.drawthePathInMap();
  }


  drawthePathInMap() {
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
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
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
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
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
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
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
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
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    let estimeteTimeAndKMS = multipleDestinations.getTotalKmsAndTotalSeconds();
    this.totalKmsAndTimeTaken.kms = estimeteTimeAndKMS.totalmeters / 1000;
    this.totalKmsAndTimeTaken.time = getDHMS(estimeteTimeAndKMS.totalSeconds);
  }

  getKmsAndTime() {
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    return multipleDestinations.getKmsAndTimeAt(this.selectedIndex)
  }

  openRoutePopUp(type) {
    this.routePopUpData.type = type;
    this.routePopUpData.show = true;
  }

  setContactPerson(contactPerson: string, index: number) {
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
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
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    let destination = multipleDestinations.getDestinationForm(index)
    let contact_no = destination.get('contact_no') as AbstractControl;
    if (contactPerson.trim()) {
      setUnsetValidators(contact_no, 'number', [Validators.required]);
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
          if (typeof routeDestination.point_type == 'string' && typeof destinations[index].point_type == 'string') {
            if (!isEqual(routeDestination.point_type, destinations[index].point_type)) {
              this.isUpdateActive = true;
              return
            }
          } else {
            if (!isEqual(routeDestination.point_type.id, destinations[index].point_type)) {
              this.isUpdateActive = true;
              return
            }
          }
          if (!isEqual(routeDestination.location?.name, destinations[index].location?.name)) {
            this.isUpdateActive = true;
            return
          }
          if (!isEqual(routeDestination.halt_time, destinations[index].halt_time)) {
            this.isUpdateActive = true;
            return
          }
          if (!isEqual(isValidValue(routeDestination?.area?.id) ? routeDestination?.area?.id : routeDestination?.area, destinations[index].area)) {
            this.isUpdateActive = true;
            return
          }
          if (!isEqual(routeDestination.show_in_invoice, destinations[index].show_in_invoice)) {
            this.isUpdateActive = true;
            return
          }
          if (!isEqual(routeDestination.contact_name, destinations[index].contact_name)) {
            this.isUpdateActive = true;
            return
          }
          if (destinations[index].contact_no.number) {
            destinations[index].contact_no.number = destinations[index].contact_no.number.toString()
          }
          if (!isEqual(routeDestination.contact_no, destinations[index].contact_no)) {
            this.isUpdateActive = true;
            return
          }
          if (routeDestination.checklist && destinations[index].checklist) {
            if (!isEqual(routeDestination.checklist, destinations[index].checklist)) {
              this.isUpdateActive = true;
              return
            }
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
    this.buildFormArray(destinations);
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
    destinations.forEach((destination, index) => {
      let destinationPoint = multipleDestinations.getDestinationForm(index);
      destinationPoint.get('point_type').setValue(destination['point_type'].id);
      if (destination['terminal']) {
        this.initialValues.terminal[index] = { label: destination['terminal'].label, value: destination['terminal'].id };
        destinationPoint.get('terminal').setValue(destination['terminal'].id);
      }
      this.initialValues.inspection[index] = this.inspectionRequired.find(val => val.value == destination['is_inspection_required'])
      this.initialValues.contactName[index] = { label: destination.contact_name, value: destination.contact_name }
      this.initialValues.point[index] = { label: destination['point_type'].label, value: destination['point_type'].id };
      if (destination.contact_no) this.initialValues.countryCode[index] = { label: destination.contact_no.code, value: destination.contact_no.code }
    });
    this.routeDestinationsData = cloneDeep(destinations)
    setTimeout(() => {
      this.isUpdateRouteActive();
    }, 1000);

  }

  onChangeTerminal(form: FormGroup, i) {
    const terminal = this.terminalList.find(terminalboj => terminalboj.id == form.value['terminal'])
    if (terminal) {
      this.initialValues.terminal[i] = { label: terminal.label, value: '' }
    }
  }
  onChangeInspection(form: FormGroup, i) {
    const inspection = this.inspectionRequired.find(inspectionObj => inspectionObj.value == form.value['is_inspection_required'])
    this.initialValues.inspection[i] = inspection
    if (Number(form.value['is_inspection_required']) == 1) {
      setUnsetValidators(form, 'inspection_type', [Validators.required])
    } else {
      setUnsetValidators(form, 'inspection_type', [Validators.nullValidator])
    }
    form.get('inspection_type').setValue([])
  }
  routPopUpData(e) {
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
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
        let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
        let destination = multipleDestinations.getDestinationForm(currentIndex);
        destination.get('point_type').setValue(event.id);
        this.initialValues.point[currentIndex] = { label: event.label, value: event.id }
      });
    }
  }

  getNewTerminal(event, currentIndex) {

    if (event) {
      this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
        this.terminalList = response['result']['path-terminal']
        let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
        let destination = multipleDestinations.getDestinationForm(currentIndex);
        destination.get('terminal').setValue(event.id);
        this.initialValues.terminal[currentIndex] = { label: event.label, value: event.id }
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

  getTerminal() {
    this._commonService.getStaticOptions('path-terminal').subscribe((response) => {
      this.terminalList = response['result']['path-terminal']
    });
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

  getAreaList() {
    this._commonService.getStaticOptions('area').subscribe((response) => {
      this.areaList = response.result['area'];
    });
  }
  areaSelected(form: FormGroup, i) {
    form.get('area_label').patchValue({
      label: this.areaList.find(area => area.id == form.get('area').value).label
    })
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(i);
    if (destination.get('destination_type').value == 1 && (this.scopeOfWork == 2 || this.scopeOfWork == 4)) {
      let multidestinationsForm = this.multipleDestinationForm.get('start_end_destination') as UntypedFormArray;
      let index = multidestinationsForm.controls.findIndex((control) => control.get('destination_type').value == 2)
      multidestinationsForm.at(index).get('area').setValue(form.get('area').value);
      multidestinationsForm.at(index).get('area_label').setValue(form.get('area_label').value);
      this.getZoneForLocation(multidestinationsForm.at(index))
    }
    this.getZoneForLocation(form)
  }


  zoneSelected(form: FormGroup,i) {
    form.get('zone_label').setValue(this.zonesList.find(zone => zone.id == form.get('zone').value).name)
    this.updatedZones();
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
    let destination = multipleDestinations.getDestinationForm(i);
    if (destination.get('destination_type').value == 1 && (this.scopeOfWork == 2 || this.scopeOfWork == 4)) {
      let multidestinationsForm = this.multipleDestinationForm.get('start_end_destination') as UntypedFormArray;
      let index = multidestinationsForm.controls.findIndex((control) => control.get('destination_type').value == 2)
      multidestinationsForm.at(index).get('zone').setValue(form.get('zone').value);
      multidestinationsForm.at(index).get('zone_label').setValue(form.get('zone_label').value);
    }
  }

  addNewArea(event) {
    this.areaParams = {
      key: 'area',
      label: event,
      value: 0
    };
  }
  getNewArea(event, form: FormGroup, index) {
    if (event) {
      form.get('area').setValue(event.id);
      form.get('area_label').patchValue({ label: event.label });
      this._commonService
        .getStaticOptions('area')
        .subscribe((response) => {
          this.areaList = response.result['area'];
        });
      let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm)
      let destination = multipleDestinations.getDestinationForm(index);
      if (destination.get('destination_type').value == 1 && (this.scopeOfWork == 2 || this.scopeOfWork == 4)) {
        let multidestinationsForm = this.multipleDestinationForm.get('start_end_destination') as UntypedFormArray;
        let index = multidestinationsForm.controls.findIndex((control) => control.get('destination_type').value == 2)
        multidestinationsForm.at(index).get('area').setValue(form.get('area').value);
        multidestinationsForm.at(index).get('area_label').setValue(form.get('area_label').value);
      }
      this.getZoneForLocation(form)
    }
  }


  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  updatedZones() {
    let multipleDestinations = new MultipleDestinationContainerFormManupulation(this.multipleDestinationForm);
    let destinations = cloneDeep(multipleDestinations.multipeDestinationFormArray.value)
    this._multipleDestionDataService.upDateZones(destinations.map(({ zone, destination_type }) => ({ zone, destination_type })))
  }


  getZoneForLocation(form) {
    this._zoneService.getZoneOnLocation(form.get('area').value).subscribe(resp => {
      if (isValidValue(resp['result'])) {
        form.get('zone').setValue(resp['result'].id);
        form.get('zone_label').patchValue(resp['result'].name);
      } else {
        form.get('zone').setValue(null);
        form.get('zone_label').patchValue('');
      }
      this.updatedZones();
    })
  }



}