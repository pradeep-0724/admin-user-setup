import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidationConstants } from "src/app/core/constants/constant";
import { NewTripV2Constants } from "../../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants";

export type ToolTip={
  title:string
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
  pointType = new NewTripV2Constants().pointType;
  areaList = [];
  multipeDestinationFormArray: FormArray;
  constructor(public multipeDestinationForm: FormGroup) {
    this.multipeDestinationFormArray = this.multipeDestinationForm.get('start_end_destination') as FormArray;
  }

  removeFormAt(index: number, initialValues) {
    if (index >= 0) {
      this.multipeDestinationFormArray.removeAt(index);
      initialValues.point.splice(index, 1);
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
      area: [item?.area?.id||'',[Validators.required]],
      location: fb.group({
        name: [item?.location?.name||'',],
        lng: [item?.location?.lng||''],
        lat: [item?.location?.lat||''],
        alias:[item?.location?.alias||'']
      }),
      time_taken: fb.group({
        day:[ item?.time_taken?.day||0],
        hour: [item?.time_taken?.hour||0, [Validators.max(23)]],
        minute: [item?.time_taken?.minute||0, [Validators.max(59)]],
        total_time_seconds: [item?.time_taken?.total_time_seconds||0]
      }),
      estimated_kms:[item?.estimated_kms||0],
    })
  }


  buildDestinationFormArray(destinations = [], initialValues) {
    this.multipeDestinationFormArray.controls =[];
    destinations.forEach((destination, index) => {
      let destinationGroup = this.getDeFaultDestinationFrom(destination);
      if (index == 0) {
        destinationGroup.get('point_type').setValue(this.pointType.PICKUP)
        initialValues.point.push(this.pointList[0]);
      } else {
        initialValues.point.push(this.pointList[1]);
        destinationGroup.get('point_type').setValue(this.pointType.DROP);
      }
      destinationGroup.get('area').setValue(destination?.area?.id);
      destinationGroup.get('area_label').patchValue({label : destination?.area?.label});
      this.multipeDestinationFormArray.push(destinationGroup);
    })
  }

  addNewDestination(initialValues) {
    let destinationGroup = this.getDeFaultDestinationFrom({});
    destinationGroup.get('point_type').setValue(this.pointType.DROP);
    this.multipeDestinationFormArray.push(destinationGroup);
    initialValues.point.push(this.pointList[1]);

  }

  getTotalKmsAndTotalSeconds(): { totalmeters: number, totalSeconds: number } {
    let totalmeters = 0;
    let totalSeconds = 0;
    this.multipeDestinationFormArray.controls.forEach(destination => {
      let estimated_kms = destination.get('estimated_kms').value;
      let total_seconds = destination.get('time_taken').value['total_time_seconds'];
      if (estimated_kms) {
        totalmeters += (estimated_kms * 1000)
      }
      if (total_seconds) {
        totalSeconds += total_seconds
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
