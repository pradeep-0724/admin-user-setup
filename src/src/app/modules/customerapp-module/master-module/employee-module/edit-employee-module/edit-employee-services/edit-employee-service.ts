import { TSStoreKeys } from './../../../../../../core/constants/store-keys.constants';
import { BASE_API_URL, TSAPIRoutes } from './../../../../../../core/constants/api-urls.constants';
import { StoreService } from '../../../../api-services/auth-and-general-services/store.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable(
  {
    providedIn:'root'
  }
)
export class EditEmployeeService {

  employeeData = new BehaviorSubject(undefined);
  editEmployeeDone = new BehaviorSubject(false);
  editEmployeeAdd = new BehaviorSubject(false);
  editEmployeeDocument = new BehaviorSubject(false);
  editEmployeeBank = new BehaviorSubject(false);

  addTimeline = {
    isDetailsSaved: false,
    isFinanceSaved: false,
    isInsuranceSaved: false,
    isDocumentsSaved: false,
  };


  constructor ( private _http: HttpClient,
    private _storeService: StoreService) {}

  getAllEditDetails (employee_id):any {
    return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' ).pipe(map((response) =>{
      this._storeService.setToStore(TSStoreKeys.master_employee_edit_information, response);
      return response;
    }));
  }
  getDefaultDocuments ():Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list + 'documents/' )
  }
  addEmployee(data){
    return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list +'details/', data);
  }

  editEmployeeInformation (employee_id,data) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' +'details/', data);
  }

  editEmployeeAddress (employee_id, data) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' +'address/', data)
  }

  editEmployeeDocuments (employee_id, data) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' +'documents/', data)

  }

  editEmployeeBanks(employee_id, data) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' +'bank/', data)

  }

  deleteEmployeeDocuments (employee_id, data) {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' +'documents/',{params:data})

  }
  deleteEmployeeDocument ( data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + TSAPIRoutes.generic_document+'delete/',data)
  }

  addEmployeeDocument ( data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + TSAPIRoutes.generic_document+'add/',data)
  }

  updateEmployeeDocument ( data) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + TSAPIRoutes.generic_document+'update/',data)

  }

  getForeManList():Observable<any>{
    return this._http.get(BASE_API_URL +'foreman_list/')
  }

  getForeManModelList(id):Observable<any>{
    return this._http.get(BASE_API_URL +'foreman_models/'+id+"/")
  }

  postEmployeeDocument(vehicle_id: any, body) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.employee_list + vehicle_id +'/document/renew/',body);
  }


  editCheckJoiningDate(employee_id,date){
    return this._http.get(BASE_API_URL + TSAPIRoutes.employee_list + employee_id + '/' + TSAPIRoutes.validate_joining_date,{params: {date: date}})
  }
}
