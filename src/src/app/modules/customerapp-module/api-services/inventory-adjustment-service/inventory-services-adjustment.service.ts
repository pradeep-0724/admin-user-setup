import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_API_URL, TSAPIRoutes } from '../../../../core/constants/api-urls.constants';
import {Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InventoryServicesService {

  constructor(
    private _http: HttpClient,
  ) { }

  postMasterInventory(inventoryData) :Observable<any>{
  return  this._http.post(BASE_API_URL +TSAPIRoutes.maintenance_inventory_spare,inventoryData)
  }

  getMasterInventoryList():Observable<any>{
     return this._http.get(BASE_API_URL+TSAPIRoutes.maintenance_inventory_spare)
  }

  getInventoryList(inventoryType):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.master_inventory_list ,{ params: {  inventory_type: inventoryType }})
  }

  getInventoryAdjustments(inventoryType):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.operation_inventory_adjustment ,{ params: {  inventory_type: inventoryType }})
  }

  deleteMasterInventory(itemId):Observable<any>{
    return this._http.delete(BASE_API_URL+TSAPIRoutes.maintenance_inventory_spare+itemId+'/')
 }

 putMasterInventory(inventoryData,inventoryId) :Observable<any>{
  return  this._http.put(BASE_API_URL +TSAPIRoutes.maintenance_inventory_spare+inventoryId+'/',inventoryData)
  }

  getMasterInventoryDetails(inventoryId) :Observable<any>{
    return  this._http.get(BASE_API_URL +TSAPIRoutes.maintenance_inventory_spare+inventoryId+'/')
    }

    getOperationInventoryAdjustmentDetails(inventoryId) :Observable<any>{
      return  this._http.get(BASE_API_URL +TSAPIRoutes.operation_inventory_adjustment_printview+inventoryId+'/'+'printview/')
      }

}
