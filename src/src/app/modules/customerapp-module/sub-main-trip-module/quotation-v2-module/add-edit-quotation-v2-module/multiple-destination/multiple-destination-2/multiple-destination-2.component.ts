import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { MapDirectionsService } from '@angular/google-maps';
import { map } from 'rxjs/internal/operators/map';
import { debounceTime } from 'rxjs/operators';
import { cloneDeep, isEqual } from 'lodash';
import { ToolTipInfo, getDHMS, getDistanceData, getEstimateDistance, scrollToRight, } from '../../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Constants } from '../../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { MultipleDestinationFormManupulation } from '../add-quotation-v2-utils/add-quotation-v2-utils';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { CommonService } from 'src/app/core/services/common.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
@Component({
  selector: 'app-multiple-destination2',
  templateUrl: './multiple-destination-2.component.html',
  styleUrls: ['./multiple-destination-2.component.scss'],
})
export class MultipleDestinationComponent2 implements OnInit {
  constantsTripV2 = new NewTripV2Constants();
  @Input()multipleDestinationForm: FormGroup;
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
  @Input() routeId: Observable<string>;
  @Input() customerId: Observable<string>;
  @Input() ismultipleDestinationFormValid: Observable<boolean>
  @Input() routeDestinations: Observable<[]>
  directionsResults$: Observable<google.maps.DirectionsResult | undefined>;
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  pointTypeList = [];
  coOrdinatesArray: string = '';
  selectedRoute: string = '';
  isFormvalid: boolean = true;
  isUpdateActive: boolean = false;
  routeDestinationsData = [];
  markerPositions = [];
  locationToolTip: ToolTipInfo;
  pointTypeToolTip: ToolTipInfo;
  tripMapToolTip: ToolTipInfo;
  pointOfTypeUrl = TSAPIRoutes.static_options;
  pintType = new NewTripV2Constants().pointType
  pointOfTypeParam: any = {};
  areaList = [];
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};

  starttoDestinationToolTip: ToolTipInfo
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.multipleDestinationForm.controls.start_end_destination['controls'], event.previousIndex, event.currentIndex);
    this.selectedTab(event.currentIndex);
    if (event.currentIndex == 0) {
      this.destinationChangedToStart(event.currentIndex);
    }
    this.drawthePathInMap();

  }
  constructor(private mapDirectionsService: MapDirectionsService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.initializeToolTip();
    setTimeout(() => {
      this.getPointType();
    }, 100);
   
    this.routeId.subscribe(routeId => {
      if (routeId) {
        this.selectedRoute = routeId
      }
    });
    this.routeDestinations.subscribe(destinations => {
      if (destinations.length) {
        this.patchDestinations(destinations)
        this.selectedIndex = 0;
      }
    })
    this.customerId.subscribe(customerId => {
      if (customerId) {
        this.routePopUpData.customerId = customerId;
        this.buildFormArray([{}, {}]);
        this.selectedIndex = 0;
        this.destinationWithLngLat = false;
      }
    })
    this.buildFormArray([{}, {}]);
    this.ismultipleDestinationFormValid.subscribe(valid => {
      this.isFormvalid = valid;
      if (!valid) {
        this.isFromToInvalid.next(valid);
        setAsTouched(this.multipleDestinationForm)
      }

    });
    this.getAreaList();
  }

  buildFormArray(destinations = []) {
    let destinationsArrayForm = new MultipleDestinationFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.buildDestinationFormArray(destinations, this.initialValues);
  }

  addNewDestination() {
    let destinationsArrayForm = new MultipleDestinationFormManupulation(this.multipleDestinationForm);
    destinationsArrayForm.addNewDestination(this.initialValues);
    this.selectedIndex = destinationsArrayForm.getFormArrayLength() - 1;
    this.drawthePathInMap();
    scrollToRight('drop-down-container');
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
        setAsTouched(this.multipleDestinationForm)
      }, 100);

    }
  }

  getAreaList(){
    this._commonService.getStaticOptions('area').subscribe((response) => {
      this.areaList = response.result['area'];
    });
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

  openRoutePopUp(type) {
    this.routePopUpData.type = type;
    this.routePopUpData.show = true;
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
          if(typeof routeDestination.point_type =='string' && typeof destinations[index].point_type =='string'){
            if (!isEqual(routeDestination.point_type, destinations[index].point_type)) {
              this.isUpdateActive = true;
              return
            }
          }else{
            if (!isEqual(routeDestination.point_type.id, destinations[index].point_type)) {
              this.isUpdateActive = true;
              return
            }
          }
          if (!isEqual(isValidValue(routeDestination?.area?.id ) ? routeDestination?.area?.id : routeDestination?.area , destinations[index].area)) {            
            this.isUpdateActive = true;
            return
          }
          if (!isEqual(routeDestination.location.name, destinations[index].location.name)) {
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


  patchDestinations(destinations: Array<any>) {
    this.initialValues = {
      point: [],
    }
    this.buildFormArray(destinations);
    let multipleDestinations = new MultipleDestinationFormManupulation(this.multipleDestinationForm)
    destinations.forEach((destination, index) => {
      let destinationPoint = multipleDestinations.getDestinationForm(index);
      destinationPoint.get('point_type').setValue(destination['point_type'].id);
      destinationPoint.get('area').setValue(destination['area']?.['id']);
      destinationPoint.get('area_label').patchValue({label : destination['area']?.['label']});
      this.initialValues.point[index] = {label:destination['point_type'].label,value:destination['point_type'].id};

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
    this.tripMapToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_MAP.CONTENT
    }
    this.starttoDestinationToolTip = {
      content: this.constantsTripV2.toolTipMessages.START_TO_DEST.CONTENT
    }
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

  areaSelected(form : FormGroup){    
    form.get('area_label').patchValue({
      label : this.areaList.find(area => area.id == form.get('area').value).label
    })    
  }

}
