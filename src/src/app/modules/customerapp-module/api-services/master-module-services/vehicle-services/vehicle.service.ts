import { BASE_API_URL, BASE_API_URL_V2 } from '../../../../../core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { Observable, BehaviorSubject } from 'rxjs';
import { StoreService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/store.service';
import { TSStoreKeys } from 'src/app/core/constants/store-keys.constants';
import { mergeMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  vehicle: any = {};

  isCompanyVehicle = new BehaviorSubject(true);
  addTimeline = {
    isDetailsSaved: false,
    isFinanceSaved: false,
    isInsuranceSaved: false,
    isDocumentsSaved: false,
    isTyresSaved: false,
    isWarrentySaved: false
  };

  constructor(private _http: HttpClient, private _storeService: StoreService) {}

  getVehicleMakeV2(): Observable<any> {
    return this._http.get(BASE_API_URL_V2 + TSAPIRoutes.vehicle_make);
  }

  getVehicleMake(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_make);
  }

  getVehicleModel(make_id,isTyreMaster?): Observable<any> {
    if(isTyreMaster){
      return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_model + make_id + '/unused/');
    }else{
      return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_model + make_id + '/');
    }

  }

  getVehicleModelV2(make_id,isTyreMaster?): Observable<any> {
    if(isTyreMaster){
      return this._http.get(BASE_API_URL_V2 + TSAPIRoutes.vehicle_model + make_id + '/unused/');
    }else{
      return this._http.get(BASE_API_URL_V2 + TSAPIRoutes.vehicle_model + make_id + '/');
    }

  }

  getVehicleModelFromManufacturer(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle+ TSAPIRoutes.manufacturer + id + '/' + TSAPIRoutes.model);
  }

  addVehicle(): Observable<any> {
    return this._storeService.getFromStore(TSStoreKeys.master_vehicle_add_details).pipe(
      mergeMap((vehicleDetails) => {
        this.vehicle['basic_detail'] = vehicleDetails;
        return this._storeService.getFromStore(TSStoreKeys.master_vehicle_add_finance).pipe(
          mergeMap((vehicleFinance) => {
            vehicleDetails.deprecated_date = vehicleFinance.deprecated_date;
            vehicleDetails.deprecated_value = vehicleFinance.deprecated_value;
            vehicleDetails.purchase_value = vehicleFinance.purchase_value;
            this.vehicle['finance'] = vehicleFinance.finance;
            return this._storeService.getFromStore(TSStoreKeys.master_vehicle_add_insurance).pipe(
              mergeMap((vehicleInsurance) => {
                this.vehicle['insurance'] = vehicleInsurance.insurance;
                return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_add, this.vehicle);
              })
            );
          })
        );
      })
    );
  }

  postVehicleDetails(vehicleDetails): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_add, { basic_detail: vehicleDetails });
  }

  getVehicleDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_add+id+"/");
  }
  deleteVehicleDetails(vehicleId: String, params?:any): Observable<any> {
    return this._http.delete(`${BASE_API_URL}${TSAPIRoutes.vehicle}${vehicleId}/${TSAPIRoutes.vehicle_detail}`, {params:params});
  }

  postActivateVehicleDetails(id): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle + TSAPIRoutes.archived_vehicle + id + '/' , { vehicle_uuid: id });
  }

  putVehicleDetails(vehicleDetails: any, vehicleId: String): Observable<any> {
    return this._http
      .put(BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_detail, {
        basic_detail: vehicleDetails
      })
      .pipe(
        map((response: any) => {
          if (response.result) {
            this.vehicle['id'] = response.result.detail.id;
          }
          return response;
        })
      );
  }

  postVehicleFinance(vehicleFinance, vehicle_id): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle + vehicle_id + '/' + TSAPIRoutes.vehicle_finance, {
      finance: vehicleFinance
    });
  }

  putVehicleFinance(vehicleFinance: any, vehicleId: String): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_finance, {
      finance: vehicleFinance
    });
  }

  deleteLoan(loanId: string, vehicleId: String): Observable<any> {
    return this._http.request(
      'delete',
      BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_finance,
      {
        body: {
          finance_id: [
            loanId
          ]
        }
      }
    );
  }

  postVehicleInsurance(vehicleInsurance, vehicle_id): Observable<any> {
    return this._http.post(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicle_id + '/' + TSAPIRoutes.vehicle_insurance,
      vehicleInsurance
    );
  }

  putVehicleInsurance(vehicleInsurance: String, vehicleId: String): Observable<any> {
    return this._http.put(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_insurance,
      vehicleInsurance
    );
  }

  postVehicleDocuments(vehicleDocuments, vehicle_id): Observable<any> {
    return this._http.post(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicle_id + '/' + TSAPIRoutes.vehicle_documents,
      vehicleDocuments
    );
  }

  putVehicleDocuments(vehicleDocuments: any, vehicleId: String): Observable<any> {
    return this._http.put(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_documents,
      vehicleDocuments
    );
  }

  deleteVehicleDocuments( vehicleId: String,body): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_documents,{params:body});
  }

  postVehicleWarrenty(vehicleWarrenty, vehicle_id): Observable<any> {
    return this._http.post(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicle_id + '/' + TSAPIRoutes.vehicle_warranty,
      vehicleWarrenty
    );
  }

  putVehicleWarrenty(vehicleWarrenty: any, vehicleId: String): Observable<any> {
    return this._http.put(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_warranty,
      vehicleWarrenty
    );
  }

  postVehicleTyres(vehicleTyres, vehicle_id): Observable<any> {
    return this._http.post(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicle_id + '/' + TSAPIRoutes.vehicle_tyres,
      vehicleTyres
    );
  }

  putVehicleTyres(vehicleTyres: any, vehicleId: String): Observable<any> {
    return this._http.put(
      BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_tyres,
      vehicleTyres
    );
  }

  getVehicleTyres(vehicleId: String): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + vehicleId + '/' + TSAPIRoutes.vehicle_tyres);
  }

  toggleVehicleStatus(flag: Boolean, vehicleIds: String[]): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_active_toggle, {
      vehicle_ids: vehicleIds,
      to_active: flag
    });
  }

  saveDocuments(): Observable<any> {
    return this._storeService.getFromStore(TSStoreKeys.master_vehicle_add_documents).pipe(
      mergeMap((vehicleDocuments) => {
        console.log(vehicleDocuments);
        return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_add, vehicleDocuments.documents);
      })
    );
  }

  getVehicleList(params?:any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list  , {params : params});
  }

  getVehicleListV2(params?:any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list +TSAPIRoutes.list , {params : params});
  }

  getVehicleListForTyreRotaion() {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list_tyre_rotaion);
  }

  getVehicleActiveList() {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_active_list);
  }

  getVehicleDetail(vehicle_id: any, params?: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + vehicle_id + '/', {params: params});
  }

  /* Vehicle Details Component -> Service Tab -> Vehicle Service Summary Section  */
  getServiceTabVehicleDetail(vehicle_id: any, params?: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vehicle_list + TSAPIRoutes.service+ TSAPIRoutes.summary +vehicle_id + '/', {params: params});
  }

  /* Vehicle Details Component -> Overview Tab ->  Service wise Summary Section  */
  getOverViewTabServiceDetail(vehicle_id: any, params?: any) {
      return this._http.get(BASE_API_URL + TSAPIRoutes.report +TSAPIRoutes.vehicle_list + TSAPIRoutes.service_summary +vehicle_id + '/', {params: params});
  }


  getVehicleDetailForEdit(vehicle_id: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + vehicle_id + '/').pipe(
      map((response) => {
        this._storeService.setToStore(TSStoreKeys.master_vehicle_edit, response);
        return response;
      })
    );
  }

  getTyreRotationDetails(vehicle_activity_id: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_rotation + vehicle_activity_id + '/').pipe(
      map((response) => {
        return response;
      })
    );
  }

  getTyreChangeNewDetails(vehicle_activity_id: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_new + vehicle_activity_id + '/').pipe(
      map((response) => {
        return response;
      })
    );
  }

  getMaintenanceNewDetails(vehicle_activity_id: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vehicle_maintance_new + vehicle_activity_id + '/').pipe(
      map((response) => {
        return response;
      })
    );
  }

  getParty(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.party);
  }

  getAllTyreMasters(){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master);
  }

  postTyreMasters(data){
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master,data);
  }

  updateTyreMasters(id,data){
    return this._http.put(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master+id+'/',data);
  }

  deleteTyreMaster(id){
    return this._http.delete(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master+id+'/');

  }

  getTyreMasterDetails(id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master+id+'/');
  }

  getModel(id): Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.vehicle_list+'tyre/manufacturer/'+id+'/model/')
  }

  getTyreMasterDetailsByModel(modelId){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list + TSAPIRoutes.vehicle_tyre + TSAPIRoutes.master + "?model=" + modelId);
  }

  getChangeHistoryDetails(vehicle_id: any,params:any,position_id?:any){
    if(position_id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.vehicle + TSAPIRoutes.vehicle_tyre +  'history/' + vehicle_id +'/', {params: {start_date:params.start_date, end_date:params.end_date, position:position_id }})
    }
    else{
      return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.vehicle + TSAPIRoutes.vehicle_tyre +  'history/' + vehicle_id +'/', {params: {start_date:params.start_date, end_date:params.end_date }})

    }
  }

  getTyreSummaryDetails(vehicle_id: any,params:any,position_id?:any){
    if(position_id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.vehicle + TSAPIRoutes.vehicle_tyre +  'header/' + vehicle_id +'/', {params: {start_date:params.start_date, end_date:params.end_date, position:position_id }})
    }
    else{
      return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.vehicle + TSAPIRoutes.vehicle_tyre +  'header/' + vehicle_id +'/', {params: {start_date:params.start_date, end_date:params.end_date }})

    }
  }

  getChangeHistoryDetailsForPostion(vehicle_id:any,params:any,position_id:any){

    return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.vehicle + TSAPIRoutes.vehicle_tyre +  'history/' + vehicle_id +'/', {params: {start_date:params.start_date, end_date:params.end_date, position:position_id }})

  }
  // /v1/vehicle/7d5a57c4-6f62-48fc-a17e-d32a28d1e407/document/renew/


  postVehicleDocument(vehicle_id: any, body) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_list + vehicle_id +'/document/renew/',body);
  }

  postNewVehicleInsuranceDocument(insurance_id: any, body) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_list + 'insurance/renew/'+insurance_id+"/",body);
  }


/*   getVehicleSufmmaryDetail(vehicle_id: any, params?:any){
    return this._http.get(BASE_API_URL + TSAPIRoutes.report + TSAPIRoutes.vehicle + TSAPIRoutes.vehiclesummary + vehicle_id + '/', {params: params})
  } */


  getTripHistoryDetails(vehicle_id: any, params?: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.report+ TSAPIRoutes.vehicle_list + 'tripsummary/'+ vehicle_id + '/', {params: params});
  }

  vehicleDownloadXlsxOrPdf(tableType,id,startDate,endDate,fileType) : Observable<Blob> {
    return this._http.get( BASE_API_URL + TSAPIRoutes.report +  TSAPIRoutes.vehicle_list  + tableType +'/' + id + "/?start_date=" + startDate + "&end_date=" + endDate+ "&export=true&file_type="+fileType, {
      responseType: 'blob'
    });
  }

  validatePosition(date, vehicle, position){
    return this._http.get( BASE_API_URL + TSAPIRoutes.validate_vehicle_position, {params: {date: date, vehicle: vehicle, position: position}})
  }

  postFinance(data,vehicle_id: any){
    return this._http.post(BASE_API_URL + 'vehicle/expense/' + vehicle_id +'/',data)
  }

  getFinance(vehicle_id: any){
    return this._http.get(BASE_API_URL + 'vehicle/expense/' + vehicle_id +'/')
  }


  getVehicleListExcel(params){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_list +TSAPIRoutes.list,{params,responseType: 'blob'})
  }

  getTripFuelLedger(vehicle_id: any,params?: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle +"fuel_transaction_list/"+vehicle_id + '/',{params: {start_date:params.start_date, end_date:params.end_date }});
  }

  resetFuelStock(body,vehicle_id){
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle +"reset_fuel_stock/"+vehicle_id + '/',body);

  }

  getFirstFuelTranDate(vehicle_id){
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle +"first_fuel_transaction_date/"+vehicle_id + '/');

  }
  getVehicleOwner(){
    return this._http.get(BASE_API_URL + TSAPIRoutes.party+'?party_type=1&vendor_party_type=2');

  }

  getDefaultDocuments(): Observable<any>{
    return this._http.get(BASE_API_URL+'vehicle/documents/');

  }


  getVehicleSpecifications(type): Observable<any>{
    return this._http.get(BASE_API_URL+ TSAPIRoutes.vehicle+'category/spec/?vehicle_category='+type);

  }

  getVehicleListByCatagory(type,specification) {
    return this._http.get(BASE_API_URL + 'vehicle/list/category/?vehicle_category='+type+'&vehicle_type='+specification+(Number(type) == 10 ? '&is_market_vehicle=' + false : '')
    );
  }

  getAlreadyScheduledJobsForVehicle(params){
    const encodedVehicles = encodeURIComponent(JSON.stringify(params));
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+TSAPIRoutes.trip+TSAPIRoutes.vehicle+'alert/?vehicles=' + encodedVehicles)
  }

  getVehicleListOwn(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle + TSAPIRoutes.company_add + "list/");
  }

  getAssetList(): Observable<any> {
    return this._http.get(BASE_API_URL +  "asset/list/");
  }

}
