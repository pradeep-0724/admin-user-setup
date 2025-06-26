import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class OwnAssetsService {

  constructor(
    private _http: HttpClient
  ) { }

  getAssetsList(params?:any) {
    return this._http.get(BASE_API_URL + 'asset/' , {params : params});
  }
  getAssetsListExcel(params){
    return this._http.get(BASE_API_URL + 'asset/',{params,responseType: 'blob'})
  }
  deleteAssetsDetails(assetId: String): Observable<any> {
    return this._http.delete(BASE_API_URL +'asset/'+assetId+'/');
  }


  getSpecifications(category: any):Observable<any> {
    return this._http.get(BASE_API_URL + `vehicle/asset/category/spec/?category=${category}`)
  }

  getAssetMake(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_make);
  }

  getVehicleList(category,isActive): Observable<any> {
    let params = {
      vehicle_category : category,
      is_active_status : isActive
    }
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle ,{params});
  }


  getAssetModel(make_id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_model + make_id + '/');
  }

  getDefaultSubDetails(assetType): Observable<any>{
    return this._http.get(BASE_API_URL+`asset/subdetail/default/?asset_type=${assetType}`);

  }

  getDefaultCertificatesDocuments(assetType): Observable<any>{
    return this._http.get(BASE_API_URL+`asset/documents/?asset_type=${assetType}`);

  }

  getDefaultSubAssets(assetType): Observable<any>{
    return this._http.get(BASE_API_URL+`asset/subasset/default/?asset_type=${assetType}`);

  }

  deleteAssetItem(url,body): Observable<any> {
    return this._http.post(BASE_API_URL + url,body);
  }

  createOwnAssets(payload): Observable<any> {
    return this._http.post(BASE_API_URL + 'asset/', payload);
  }

  getOwnAssetDetailForEdit(assetId: any) {
    return this._http.get(BASE_API_URL +'asset/' + assetId + '/')
  }

  updateOwnAssets(payload,id): Observable<any> {
    return this._http.put(BASE_API_URL + 'asset/'+id+'/' , payload);
  }

  getAssetPermits(): Observable<any>{
    return this._http.get(BASE_API_URL+'asset/permit/');

  }

  activateAsset(id): Observable<any> {
    return this._http.put(BASE_API_URL  + 'asset/active/' + id + '/' ,{});
  }

  getCanCreateAsset(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.settings)
  }
}
