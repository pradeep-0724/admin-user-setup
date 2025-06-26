import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationConstants } from "src/app/core/constants/constant";
import { getBlankOption } from "src/app/shared-module/utilities/helper-utils";
import { NewTripV2Constants } from "../new-trip-v2-constants/new-trip-v2-constants";
import moment from "moment";

export type ToolTip={
  title:string
  content:Array<string>
}

export type ToolTipInfo={
  content:Array<string>
}

export function getDHMS(totalSeconds: number): ({ days: number, hours: number, minutes: number, totalSeconds: number }) {
  let days = Math.floor(totalSeconds / (24 * 60 * 60));
  let hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  let minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  return {
    days,
    hours,
    minutes,
    totalSeconds
  }
}

export function getTotalSecond(days: number,hours:number,minutes:number=0): ({ totalSeconds: number }) {
  let totalSeconds = (days*(24 * 60 * 60))+ (hours* (60 * 60)) +(minutes *60)
  return {
    totalSeconds
  }
}


export function getEstimateDistance(meters: number): number {
  return meters / 1000;
}

export function swapInitialValues(leftIndex: number, rightIndex: number, array: Array<any>) {
  let tempVal = array[leftIndex];
  array[leftIndex] = array[rightIndex];
  array[rightIndex] = tempVal
}


type DistanceDataObject = {
  end_location: google.maps.LatLng,
  distance: {
    value: number
  }
  duration: {
    value: number
  }

}
type DistanceDataReturnObject = {
  lat: number,
  lng: number,
  distance: number,
  duration: number,

}

export function getDistanceData(routeData: DistanceDataObject): DistanceDataReturnObject {
  return {
    lat: routeData.end_location.lat(),
    lng: routeData.end_location.lng(),
    distance: routeData.distance.value,
    duration: routeData.duration.value,
  }
}

export function scrollToRight(elementId: string) {
  setTimeout(() => {
    const container = document.getElementById(elementId);
    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
  }, 10)

}

type kmsAndTime = {
  kms: number,
  time: {
    hours: number,
    days: number,
    minutes: number
  }
}
export class MultipleDestinationFormManupulation {
  pattern = new ValidationConstants().VALIDATION_PATTERN
  pointList = new NewTripV2Constants().pointList;
  pintType =new NewTripV2Constants().pointType
  multipeDestinationFormArray: FormArray;
  constructor(public multipeDestinationForm: FormGroup) {
    this.multipeDestinationFormArray = this.multipeDestinationForm.get('start_end_destination') as FormArray;
  }

  removeFormAt(index: number, initialValues) {
    if (index >= 0) {
      this.multipeDestinationFormArray.removeAt(index);
      initialValues.point.splice(index, 1);
      initialValues.countryCode.splice(index, 1);
      initialValues.contactName.splice(index, 1);
    }
  }

  getDestinationForm(index: number): FormGroup {
    return (this.multipeDestinationFormArray).at(index) as FormGroup;
  }

  getFormArrayLength(): number {
    return (this.multipeDestinationFormArray).length
  }

  getAllLngLat(): Array<any> {
    let coordinates = [];
    this.multipeDestinationFormArray.controls.forEach(destination => {
      let latLng = destination.get('location').value;
      if (latLng['lat'] && latLng['lng']) {
        coordinates.push({
          lat: latLng['lat'],
          lng: latLng['lng']
        })
      }
    });
    return coordinates
  }

  getDeFaultDestinationFrom(item:any) {
    let fb: FormBuilder = new FormBuilder()
    return fb.group({
      show_in_invoice: [item.show_in_invoice !== undefined  ? item.show_in_invoice : true],
      point_type: [item.point_type||''],
      area_label : fb.group({
        label : [item.area?.label||''],
      }),
      area : [item.area?.id||'',[Validators.required]],
      location: fb.group({
        name: [item.location?.name||'', ],
        lng: [item.location?.lng||''],
        lat: [item.location?.lat||''],
        alias:[item.location?.alias||'']
      }),
      checklist: [item.checklist||[]],
      time: [item.time?moment(moment(new Date(item.time)).tz(localStorage.getItem('timezone'))): moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')],
      reach_time: [item.reach_time?moment(moment(new Date(item.reach_time)).tz(localStorage.getItem('timezone'))):  moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')],
      halt_time: fb.group({
        day: [item.halt_time?.day||''],
        hour: [item.halt_time?.hour||'', [Validators.max(23)]],
        minute: [item.halt_time?.minute||'', [Validators.max(59)]]
      }),
      time_taken: fb.group({
        day:[ item.time_taken?.day||0],
        hour: [item.time_taken?.hour||0, [Validators.max(23)]],
        minute: [item.time_taken?.minute||0, [Validators.max(59)]],
        total_time_seconds: [item.time_taken?.total_time_seconds||0]
      }),
      estimated_kms:[item.estimated_kms||0],
      contact_name: [item.contact_name||''],
      contact_no: fb.group({
        flag:[item.contact_no?.flag||''],
        code: [item.contact_no?.code||''],
        number: [item.contact_no?.number||'', [Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]]
      })
    })
  }


  buildDestinationFormArray(destinations = [], initialValues) {
    this.multipeDestinationFormArray.controls =[];
    destinations.forEach((destination, index) => {
      let destinationGroup = this.getDeFaultDestinationFrom(destination);
      if (index == 0) {
        destinationGroup.get('point_type').setValue(this.pintType.PICKUP)
        initialValues.point.push(this.pointList[0]);
      } else {
        initialValues.point.push(this.pointList[1]);
        destinationGroup.get('point_type').setValue(this.pintType.DROP);
      }
      destinationGroup.get('area').setValue(destination?.area?.id);
      destinationGroup.get('area_label').patchValue({label : destination?.area?.label});
      this.multipeDestinationFormArray.push(destinationGroup);
      initialValues.countryCode.push(getBlankOption());
      initialValues.contactName.push(getBlankOption());
    })
  }

  addNewDestination(initialValues) {
    let destinationGroup = this.getDeFaultDestinationFrom({});
    destinationGroup.get('point_type').setValue(this.pintType.DROP);
    this.multipeDestinationFormArray.push(destinationGroup);
    initialValues.point.push(this.pointList[1]);
    initialValues.countryCode.push(getBlankOption());
    initialValues.contactName.push(getBlankOption());

  }

  getTotalKmsAndTotalSeconds(): { totalmeters: number, totalSeconds: number } {
    let totalmeters = 0;
    let totalSeconds = 0;
    this.multipeDestinationFormArray.controls.forEach(destination => {
      let estimated_kms = destination.get('estimated_kms').value;
      let total_seconds = destination.get('time_taken').value['total_time_seconds'];
      let halt_time = destination.get('halt_time').value;
      if (estimated_kms) {
        totalmeters += (estimated_kms * 1000)
      }
      if (total_seconds) {
        totalSeconds += total_seconds
      }
      if(halt_time['day']||halt_time['hour']|| halt_time['minute']){
        let day=halt_time['day']?halt_time['day']:0;
        let hour=halt_time['hour']?halt_time['hour']:0;
        let minute=halt_time['minute']?halt_time['minute']:0;
        totalSeconds=totalSeconds+getTotalSecond(day,hour,minute).totalSeconds;
      }
    });
    return {
      totalmeters,
      totalSeconds
    }
  }

  getKmsAndTimeAt(index: number): kmsAndTime {
    let destinationForm = this.multipeDestinationFormArray.at(index) as FormGroup;
    let kmsAndTime = {
      kms: Number(destinationForm.get('estimated_kms').value),
      time: {
        hours: Number(destinationForm.get('time_taken').value['hour']),
        days: Number(destinationForm.get('time_taken').value['day']),
        minutes: Number(destinationForm.get('time_taken').value['minute'])
      }
    }
    return kmsAndTime
  }

}

export class MultipleDestinationContainerFormManupulation {
  pattern = new ValidationConstants().VALIDATION_PATTERN
  pointList = new NewTripV2Constants().pointList;
  pintType =new NewTripV2Constants().pointType
  multipeDestinationFormArray: FormArray;
  constructor(public multipeDestinationForm: FormGroup) {
    this.multipeDestinationFormArray = this.multipeDestinationForm.get('start_end_destination') as FormArray;
  }

  removeFormAt(index: number, initialValues) {
    if (index >= 0) {
      this.multipeDestinationFormArray.removeAt(index);
      initialValues.point.splice(index, 1);
      initialValues.countryCode.splice(index, 1);
      initialValues.contactName.splice(index, 1);
      initialValues.terminal.splice(index, 1);
      initialValues.inspection.splice(index, 1);
      initialValues.inspectionType.splice(index, 1);
    }
  }

  getDestinationForm(index: number): FormGroup {
    return (this.multipeDestinationFormArray).at(index) as FormGroup;
  }

  getFormArrayLength(): number {
    return (this.multipeDestinationFormArray).length
  }

  getAllLngLat(): Array<any> {
    let coordinates = [];
    this.multipeDestinationFormArray.controls.forEach(destination => {
      let latLng = destination.get('location').value;
      if (latLng['lat'] && latLng['lng']) {
        coordinates.push({
          lat: latLng['lat'],
          lng: latLng['lng']
        })
      }
    });
    return coordinates
  }

  getDeFaultDestinationFrom(item:any) {
    let fb: FormBuilder = new FormBuilder()
    return fb.group({
      show_in_invoice: [item.show_in_invoice !== undefined  ? item.show_in_invoice : true],
      area_label : fb.group({
        label : [item.area?.label||''],
      }),
      zone_label:[item.zone?.name||''],
      zone:[item?.zone?.id||null],
      area : [item?.area?.id||'',[Validators.required]],
      point_type: [item.point_type||''],
      location: fb.group({
        name: [item.location?.name||'', ],
        lng: [item.location?.lng||''],
        lat: [item.location?.lat||''],
        alias:[item.location?.alias||'']
      }),
      checklist: [item.checklist||[]],
      time: [item.time?moment(moment(new Date(item.time)).tz(localStorage.getItem('timezone'))): moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')],
      reach_time: [item.reach_time?moment(moment(new Date(item.reach_time)).tz(localStorage.getItem('timezone'))):  moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')],
      halt_time: fb.group({
        day: [item.halt_time?.day||''],
        hour: [item.halt_time?.hour||'', [Validators.max(23)]],
        minute: [item.halt_time?.minute||'', [Validators.max(59)]]
      }),
      time_taken: fb.group({
        day:[ item.time_taken?.day||0],
        hour: [item.time_taken?.hour||0, [Validators.max(23)]],
        minute: [item.time_taken?.minute||0, [Validators.max(59)]],
        total_time_seconds: [item.time_taken?.total_time_seconds||0]
      }),
      estimated_kms:[item.estimated_kms||0],
      contact_name: [item.contact_name||''],
      terminal:[item.terminal||''],
      is_inspection_required:[item.is_inspection_required||0],
      inspection_type:[item.inspection_type||[]],
      destination_type:[item.destination_type||0],
      contact_no: fb.group({
        flag:[item.contact_no?.flag||''],
        code: [item.contact_no?.code||''],
        number: [item.contact_no?.number||'', [Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]]
      })
    })
  }


  buildDestinationFormArray(destinations = [], initialValues) {
    this.multipeDestinationFormArray.controls =[];
    destinations.forEach((destination, index) => {
      let destinationGroup = this.getDeFaultDestinationFrom(destination);
      if (index == 0) {
        destinationGroup.get('point_type').setValue(this.pintType.PICKUP)
        initialValues.point.push(this.pointList[0]);
      } else {
        initialValues.point.push(this.pointList[1]);
        destinationGroup.get('point_type').setValue(this.pintType.DROP);
      }
      destinationGroup.get('area').setValue(destination?.area?.id);
      destinationGroup.get('area_label').patchValue({label : destination?.area?.label});
      this.multipeDestinationFormArray.push(destinationGroup);
      initialValues.countryCode.push(getBlankOption());
      initialValues.contactName.push(getBlankOption());
      initialValues.terminal.push(getBlankOption());
      initialValues.inspection.push({label:'No',value:''});
    })
  }

  addNewDestination(initialValues) {
    let destinationGroup = this.getDeFaultDestinationFrom({});
    destinationGroup.get('point_type').setValue(this.pintType.DROP);
    this.multipeDestinationFormArray.push(destinationGroup);
    initialValues.point.push(this.pointList[1]);
    initialValues.countryCode.push(getBlankOption());
    initialValues.contactName.push(getBlankOption());
    initialValues.terminal.push(getBlankOption());
    initialValues.inspection.push({label:'No',value:''});
  }

  getTotalKmsAndTotalSeconds(): { totalmeters: number, totalSeconds: number } {
    let totalmeters = 0;
    let totalSeconds = 0;
    this.multipeDestinationFormArray.controls.forEach(destination => {
      let estimated_kms = destination.get('estimated_kms').value;
      let total_seconds = destination.get('time_taken').value['total_time_seconds'];
      let halt_time = destination.get('halt_time').value;
      if (estimated_kms) {
        totalmeters += (estimated_kms * 1000)
      }
      if (total_seconds) {
        totalSeconds += total_seconds
      }
      if(halt_time['day']||halt_time['hour']|| halt_time['minute']){
        let day=halt_time['day']?halt_time['day']:0;
        let hour=halt_time['hour']?halt_time['hour']:0;
        let minute=halt_time['minute']?halt_time['minute']:0;
        totalSeconds=totalSeconds+getTotalSecond(day,hour,minute).totalSeconds;
      }
    });
    return {
      totalmeters,
      totalSeconds
    }
  }

  getKmsAndTimeAt(index: number): kmsAndTime {
    let destinationForm = this.multipeDestinationFormArray.at(index) as FormGroup;
    let kmsAndTime = {
      kms: Number(destinationForm.get('estimated_kms').value),
      time: {
        hours: Number(destinationForm.get('time_taken').value['hour']),
        days: Number(destinationForm.get('time_taken').value['day']),
        minutes: Number(destinationForm.get('time_taken').value['minute'])
      }
    }
    return kmsAndTime
  }

}


