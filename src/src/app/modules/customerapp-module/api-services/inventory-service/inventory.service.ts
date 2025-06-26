import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private _http: HttpClient) { }

  saveInventory(body):Observable<any>{
		return 	this._http.post(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.save_inventory, body);
	}

	getInventoryList(): Observable<any> {
			return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.list_inventory);
	}

	deleteInventoryActivity(activity_id: String) : Observable<any>{
			return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.list_inventory+activity_id+'/');
	}

	getInventoryDetails(activity_id):Observable<any>{
		return 	this._http.get(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.save_inventory+activity_id+'/');
	}

	putInventory(body,activity_id):Observable<any>{
		return 	this._http.put(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.save_inventory+activity_id+'/', body);
  	}

  	getAllInventoryRepairDetails(){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory + TSAPIRoutes.repair);
	}

	deleteInventoryRepairRecord(id){
		return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory + TSAPIRoutes.repair + id +'/');
	}

	postInventoryRepairData(data){
		return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory + TSAPIRoutes.repair ,data);
	}

	updateInventoryRepairData(id,data){
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory + TSAPIRoutes.repair + id + '/' ,data);
	}

	getInventoryRepairData(id){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory + TSAPIRoutes.repair + id + '/');
	}

	getInventoryItemStockByDate(itemId, date){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.item + itemId + "/stock/", {params: {'date': date}})
	}

	getApprovedPurchaseOrderData(id){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.approved_purchaseorders + TSAPIRoutes.vendor + id + '/');
	}

	getPurchaseOrderData(id){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.purchaseorder  + id + '/');
	}

}
