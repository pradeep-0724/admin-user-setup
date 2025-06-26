import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, UntypedFormArray, UntypedFormControl, UntypedFormGroup, FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { PlacesAutoSearch } from 'src/app/modules/customerapp-module/places-auto-complete/places-auto-search.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-location-v2',
  templateUrl: './location-v2.component.html',
  styleUrls: ['./location-v2.component.scss']
})
export class LocationV2Component implements OnInit {

  @Input()placeForm:FormGroup;
  newLocations=[];
  resentLocation=[];
  isSelected:boolean=false;
  addCoOrdinatesForm:FormGroup;
  isAddNewLoc:boolean=false;
  googleMaps=`../../../../../../../assets/img/google-maps.png`
  @Input()  disabled=false;
  @Input () isnameRequired:boolean=true;
  @Input() isFromToInvalid :Observable<boolean>
  @Input() isFromContainerInfo=false;
  token='';
  classId :number=0;
  pattern = new ValidationConstants().VALIDATION_PATTERN.CO_ORDINATES
  constructor(private _fb:FormBuilder,private _placesService:PlacesAutoSearch) { }
  autocompleteInput='';
  showRecentData:boolean=true;
  @Output() placeDetails=new EventEmitter();
  placeSearch=new Subject();
  toolTipText="Coordinates for the selected location is not found, hence we will not be able to populate the Estimate Time/KMS and the Route map for this Job"
  ngOnInit(): void {
    setUnsetValidators(this.placeForm,'name',[this.isnameRequired?Validators.required:Validators.nullValidator]);
    this.addCoOrdinatesForm= this._fb.group({
      co_ordinates:['',[Validators.pattern(this.pattern),Validators.required]],
      name:'',
      alias:'',
      lng:null,
      lat:null,
    })
    this.getRecentData();
    this.getAdressFromLatLng();
    if(this.placeForm?.value?.name){
      if(this.placeForm?.value?.lng){
        this.toolTipText="Coordinates for the selected location is found, hence we will  be able to populate the Estimate Time/KMS and the Route map for this Job"
      }else{
        this.toolTipText="Coordinates for the selected location is not found, hence we will not be able to populate the Estimate Time/KMS and the Route map for this Job"
      }
    }
    this.isFromToInvalid.subscribe(isvalid=>{
      if(!isvalid){
        this.placeForm.markAllAsTouched();
      }
    })
    if(!this.isnameRequired){
      setUnsetValidators(this.placeForm,'name',[Validators.nullValidator]);
    }
    this.placeSearch.pipe(debounceTime(500),distinctUntilChanged()).subscribe((place)=>{
     this.getPlaces(place);
    })
    if(!this.isFromContainerInfo){
      this.prepareRequest();
    }
  }



 getPlaces(place){
  if(!this.isSelected && isValidValue(place) && place.trim().length>2 &&!this.isAddNewLoc){
     this.getNewLocations(place.trim());
     this.placeForm.patchValue({
      lng:null,
      lat:null,
    });
   }
   if(isValidValue(place)&& place.trim().length==0){
    this.showRecentData=true;
   }
 }

 searchPlaceByname(e){
  this.placeSearch.next(e);
 }

 openResentList(e){
  this.showRecentData=true;
  this.isSelected = false;
 }


 getRecentData(){
   this._placesService.getRecent().subscribe(resp=>{
    this.resentLocation = resp.result.locations;
   });
 }


getNewLocations(place){
  let payload={
    query:place,
    token:this.token
  }
  this.newLocations=[];
  this._placesService.searchPlaces(payload).subscribe(resp=>{
  this.token =resp.result.token
  this.newLocations= resp.result.locations;
  this.showRecentData=false;
  });
  setUnsetValidators(this.placeForm,'name',[Validators.required]);
}

getAddress(loc){
  this.isSelected = true;
  this.placeForm.patchValue({
    name:loc.name,
    lng:null,
    lat:null,
  });
  this.getAdressWithPlaceId(loc.place_id)

}

getAdressWithPlaceId(placeId){
  let payload={
    place_id:placeId,
    token:this.token
  }
    this._placesService.getAddress(payload).subscribe(place=>{
      this.newLocations=[];
      this.token =''
      this.placeForm.patchValue({
        lng:place.result.lng,
        lat:place.result.lat,
      });
      this.prepareRequest();
    });

}


prepareRequest(){
  let sendPlaceDetais={
    valid:this.placeForm.valid,
    value:this.placeForm.value
  }
  this.placeDetails.emit(sendPlaceDetais);
}

recentLocationSelected(loc){
  this.isSelected = true;
  if(loc.lng){
    this.toolTipText="Coordinates for the selected location is found, hence we will  be able to populate the Estimate Time/KMS and the Route map for this Trip"
  }else{
    this.toolTipText="Coordinates for the selected location is not found, hence we will not be able to populate the Estimate Time/KMS and the Route map for this Trip"
  }
  this.placeForm.patchValue({
    name:loc.name,
    lng:loc.lng,
    lat:loc.lat,
  });
  this.prepareRequest();
}
cancelLoc(){
 this.isAddNewLoc=false;
 this.addCoOrdinatesForm.reset();
}

addLoc(){
  if(this.addCoOrdinatesForm.valid){
    let newCoOrdinatesData=this.addCoOrdinatesForm.value
    if(newCoOrdinatesData['alias']){
      newCoOrdinatesData['name']=newCoOrdinatesData['alias']
    }
    this.placeForm.patchValue(newCoOrdinatesData);
    setTimeout(() => {
      this.addCoOrdinatesForm.reset();
      this.isAddNewLoc=false;
    }, 500);
  }else{
    this.setAsTouched(this.addCoOrdinatesForm)
  }
  this.prepareRequest();
}

getAdressFromLatLng(){
  let co_ordinates = this.addCoOrdinatesForm.get('co_ordinates') as FormControl
  co_ordinates.valueChanges.pipe(debounceTime(500)).subscribe(resp=>{
    if(co_ordinates.valid){
      this._placesService.getAdressFromLatLng(resp).subscribe(result=>{
        this.addCoOrdinatesForm.patchValue({
          name:result.result.address,
          lng:Number(result.result.lng),
          lat:Number(result.result.lat),
        })
      });
    }
  })
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

}
