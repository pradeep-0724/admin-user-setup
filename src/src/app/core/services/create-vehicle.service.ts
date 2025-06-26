import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BASE_API_URL, TSAPIRoutes } from '../constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CreateVehicleService {
 protected isVehicleCreate:boolean=false;
 protected canAssetCreate:boolean=false;
 $createVehicle = new Subject();
 $createAsset = new Subject();

 $createVehicleObj=this.$createVehicle.asObservable();
 $createAssetObj=this.$createAsset.asObservable();
 constructor(private _http: HttpClient){

 }

 get createVehicle(){
  return this.isVehicleCreate;
 }

 set createVehicle(val:boolean){
   this.isVehicleCreate =val;
   this.$createVehicle.next(val)
 }

 get createAsset(){
  return this.canAssetCreate;
 }

 set createAsset(val:boolean){
   this.canAssetCreate =val;
   this.$createAsset.next(val)
 }

 getIsVehicleCreate(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.settings)
}



}
