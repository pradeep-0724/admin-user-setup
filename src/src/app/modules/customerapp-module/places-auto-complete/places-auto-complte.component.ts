import { distinctUntilChanged } from 'rxjs/operators';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Component, OnInit, Output, EventEmitter, Input, SimpleChange } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { PlacesAutoSearch } from './places-auto-search.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-places-auto-complte',
  templateUrl: './places-auto-complte.component.html',
  styleUrls: ['./places-auto-complte.component.scss'],
})
export class PlacesAutoComplteComponent implements OnInit {

  placeForm:FormGroup;
  newLocations=[];
  resentLocation=[];
  isSelected:boolean=false;
  googleMaps=`../../../../assets/img/google-maps.png`
  @Input() editData;
  @Input () isnameRequired:boolean=true;
  @Input() isFromToInvalid :Observable<boolean>
  token='';
  classId :number=0;
  constructor(private _fb:FormBuilder,private _placesService:PlacesAutoSearch) { }
  autocompleteInput='';
  showRecentData:boolean=true;
  @Output() placeDetails=new EventEmitter()
  ngOnInit(): void {
    this.placeForm=this._fb.group({
      name:[null,this.isnameRequired?Validators.required:Validators.nullValidator],
      lng:null,
      lat:null
    });
    this.getRecentData();
    this.prepareRequest();
    this.placeForm.patchValue({
      name:'',
      lng:null,
      lat:null,
    });
    this.isFromToInvalid.subscribe(isvalid=>{
      if(!isvalid){
        this.placeForm.markAsTouched();
      }
    })
    this.placeSearch();
  }

  ngOnChanges(change:SimpleChange){
    if('editData' in change){
      setTimeout(() => {
        if(change['editData']['currentValue']){
          this.placeForm.patchValue({
            name:change['editData']['currentValue'].name,
            lat:change['editData']['currentValue'].lat,
            lng:change['editData']['currentValue'].lng
           });
           this.isSelected = true;
        }
      }, 1500);
    }
    if('isnameRequired' in change){
      if(change['isnameRequired']['currentValue']){
        setTimeout(() => {
          setUnsetValidators(this.placeForm,'name',[Validators.required]);
        }, 1000);
      }
    }
    if('isnameRequired' in change){
      if(!change['isnameRequired']['currentValue'] && !change['isnameRequired']['firstChange']){
        setTimeout(() => {
          setUnsetValidators(this.placeForm,'name',[Validators.nullValidator]);
        }, 1000);
      }
    }
  }



 placeSearch(){
    this.placeForm.controls.name.valueChanges.pipe(debounceTime(1000),distinctUntilChanged()).subscribe(place=>{
       if(!this.isSelected && place.trim().length>2){
         this.getNewLocations(place.trim());
         this.placeForm.patchValue({
          lng:null,
          lat:null,
        });
       }
       if(place.trim().length==0){
        this.showRecentData=true;
        if(!this.isnameRequired){
          setUnsetValidators(this.placeForm,'name',[Validators.nullValidator]);
        }
       }
      });

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
  });
}



prepareRequest(){
  this.placeForm.valueChanges.pipe(debounceTime(500),distinctUntilChanged()).subscribe(formValues=>{
      let sendPlaceDetais={
      valid:this.placeForm.valid,
      value:formValues
    }
    this.placeDetails.emit(sendPlaceDetais)
  });
}

recentLocationSelected(loc){
  this.isSelected = true;
  this.placeForm.patchValue({
    name:loc.name,
    lng:loc.lng,
    lat:loc.lat,
  });
}

}





