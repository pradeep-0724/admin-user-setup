import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class OperationsActivityService {
	constructor(private _http: HttpClient) {}

	postTyreRotationActivity(tyreRotationDetails): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_rotation, tyreRotationDetails);
	}
	getTyreRotationActivity(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_rotation);
	}

	putTyreRotationActivity(tyreRotationDetails, vehicle_activity_id): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_rotation + vehicle_activity_id + '/', tyreRotationDetails);
	}

	postTyreChangeActivity(tyreChangeDetails): Observable<any> {
		return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_new, tyreChangeDetails);
	}

	getTyreChangeNewActivity(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_new);
	}

	putTyreChangeActivity(tyreChangeDetails, vehicle_activity_id): Observable<any> {
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_new + vehicle_activity_id + '/', tyreChangeDetails);
	}

	postNewMaintainanceActivity(newMaintainanceDetails): Observable<any> {
		return this._http.post(
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vehicle_maintance_new,
			newMaintainanceDetails
		);
	}

	putNewMaintainanceActivity(newMaintainanceDetails, vehicle_activity_id): Observable<any> {
		return this._http.put(
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vehicle_maintance_new + vehicle_activity_id + '/',
			newMaintainanceDetails
		);
	}

	postNewOtherActivity(otherActivityDetails): Observable<any> {
		return this._http.post(
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.other_expense_new,
			otherActivityDetails
		);
	}

	putNewOtherActivity(otherActivityDetails, other_activity_id): Observable<any> {
		return this._http.put(
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.other_expense_new  + other_activity_id + '/',
			otherActivityDetails
		);
	}

	postNewMechanicActivity(mechanicActivityDetails): Observable<any> {
		return this._http.post(
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.mechanic_activity_list,
			mechanicActivityDetails
		);
	}
    postEmployeeSalaryExpense(employeeExpenseDetails): Observable<any>{
		return this._http.post(
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.employee_list +TSAPIRoutes.salary,employeeExpenseDetails
		);
	}
	putNewMechanicActivity(mechanicActivityDetails, mechanic_activity_id): Observable<any> {
		return this._http.put(
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.mechanic_activity_list + mechanic_activity_id + '/',
			mechanicActivityDetails
		);
	}

	getBills(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.bills);
	}

	getMechanicList(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.mechanic_activity_list);
	}

	getOthersList(params): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.other_expense_new+TSAPIRoutes.list,{params});
	}

	getVehicleList(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation_vehicle_list);
	}

	getMechanicActivityDetails(mechanic_activity_id: any) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.mechanic_activity_list + mechanic_activity_id + '/').pipe(
		  map((response) => {
			return response;
		  })
		);
	}
	getOtherActivityDetails(other_activity_id: any) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.other_expense_new + other_activity_id + '/').pipe(
		  map((response) => {
			return response;
		  })
		);
	}
	deleteMechanic (mechanic_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.mechanic_activity_list,
			{
				body: {
					mechanic_ids: [
						mechanic_id
					]
				}
			}
		);
	}
	deleteOtherActivity (activity_id: String) {
		return this._http.request(
			'delete',
			BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.other_expense_new,
			{
				body: {
					otheractivity_ids: [
						activity_id
					]
				}
			}
		);
	}
	deleteTyreRotation (tyre_rotation_id: String) {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_rotation + tyre_rotation_id + '/')

	}
	deleteTyreChangeNew (tyre_change_new_id: String) {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_new + tyre_change_new_id + '/')
	}

	deleteMaintenance (id):Observable<any> {
		return this._http.delete(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.vehicle_maintance_new + id + '/')
	}

	getFleetOwnerChallans (id) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.fleet_party + id + '/');
	}

	getPartyDetails(partyId, params?:any): Observable<any> {
		if (params)
            params = {party_type: params} ;
		return this._http.get(BASE_API_URL + TSAPIRoutes.party + partyId + '/',{
			params:params
		});
	}

	getFleetOwnerData (id) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.save_fleet_expense + id + '/');
	}

	getFleetOwnerPrintScreenData(id){
		return this._http.get(BASE_API_URL+TSAPIRoutes.save_fleet_expense+TSAPIRoutes.get_fleet_owner_print+id+'/');
	}

	getTripExpensePrintScreenData(id){
		return this._http.get(BASE_API_URL+TSAPIRoutes.operation + 'tripexpense/printview/' +id+'/');
	}

  	getForemanPrintScreenData(id){
		return this._http.get(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.foremen+'printview/'+id+'/');
	}

	getFuelExpensePrintScreenData(id){
		return this._http.get(BASE_API_URL+TSAPIRoutes.save_fuel_challan+TSAPIRoutes.get_fleet_owner_print+id+'/');
	}

	getOtherExpensePrintScreenData(id){
		return this._http.get(BASE_API_URL+TSAPIRoutes.save_other_challan+TSAPIRoutes.get_fleet_owner_print+id+'/');
	}

	getFuelExpenseData (id) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.save_fuel_challan + id + '/');
	}

	saveFleetExpense (body) {
		return this._http.post(BASE_API_URL + TSAPIRoutes.save_fleet_expense, body);
	}

	editFleetOwner (id, body) {
		return this._http.put(BASE_API_URL + TSAPIRoutes.save_fleet_expense + id + '/', body);
	}

	editFuelExpense (id, body) {
		return this._http.put(BASE_API_URL + TSAPIRoutes.save_fuel_challan + id + '/', body);
	}

	editEmployeeExpense (id, body) {
				return this._http.put(BASE_API_URL + TSAPIRoutes.employee_salary+ id + '/', body);
	}
	saveFuelExpenses (body) {
		return this._http.post(BASE_API_URL + TSAPIRoutes.save_fuel_challan, body);
	}
	// operation/fuel/list/?search=&filters=[{"key":"new_payment_status","values":["UnPaid"]}]&next_cursor=

	getAllFuelExpensesList (params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation+'fuel/list/',{params});
	}
	getAllEmployeeExpenses () {
		return this._http.get(BASE_API_URL + TSAPIRoutes.employee_salary,);
	}

  getForemen(id):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.operation +'foremen/'+id+"/")
  }

	deleteFuelExpenses (id) {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.save_fuel_challan + id + '/');
	}

	getAllFleetExpense (params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.save_fleet_expense+'list/',{params});
	}

	getAllFleetExpenseExportExcel (params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.save_fleet_expense+'list/',{params, responseType:'blob'});
	}

	getAllTripExpense (params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation+'tripexpense/list/',{params});
	}

	getAllTripExpenseExportExcel (params) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation+'tripexpense/list/',{params, responseType:'blob'});
	}

  getAllForemen () {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation+TSAPIRoutes.foremen);
	}

	deleteFleetExpense (id) {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.save_fleet_expense + id + '/');
	}

	deleteTripExpense (id) {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.operation+"tripexpense/" + id + '/');
	}

  deleteForemen (id) {
		return this._http.delete(BASE_API_URL + TSAPIRoutes.operation+TSAPIRoutes.foremen + id + '/');
	}
	deleteEmployeeExpenses(id){
		return this._http.delete(BASE_API_URL + TSAPIRoutes.employee_salary+ id + '/');
	}
	getEmployeeExpense(id): Observable<any>  {
		return this._http.get(BASE_API_URL + TSAPIRoutes.employee_salary + id + '/');
	}

	getExpenseTypes():Observable<any>{
		return this._http.get( BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.expense_type)

	}

	postEmployeeOthers(data):Observable<any>{
		return this._http.post( BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.other_expense ,data)

	}

	getOtherData(params):Observable<any>{
		return this._http.get( BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.other_expense+TSAPIRoutes.list,{params})
	}

	deleteEmployeeOthers(id){
		return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.other_expense + id + '/');
	}

	getEmployeeOthersDetails(id):Observable<any>{
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.other_expense + id + '/');
	}

	postEmployeeOthersDetails(id,data):Observable<any>{
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.other_expense + id + '/',data);

  	}

	postTyreChangeInventoryData(data){
		return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_inventory ,data);
	}

	updateTyreChangeInventoryData(id,data){
		return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_inventory + id + '/' ,data);
	}

	getAllInventoryDetails(){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_inventory);

	}

	deleteInventoryRecord(id){
		return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_inventory + id +'/');
	}

	getInventoryData(id){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.tyre_change_inventory + id + '/');

	}

	getAllMaintenanceNewDetails(){
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.vehicle_maintance_new );
	}

	postMaintenanceInventory(maintenanceInventoryDetails): Observable<any> {
			return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.maintenance_inventory, maintenanceInventoryDetails);
	}

	getMaintenanceInventoryList(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.maintenance_inventory);
	}

	deleteMaintenanceInventory(activity_id: String) : Observable<any>{
	return this._http.delete(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.maintenance_inventory+activity_id+'/');
	}

	getMaintenanceInventoryDetails(activity_id):Observable<any>{
			return 	this._http.get(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.maintenance_inventory+activity_id+'/');
	}

	putMaintenanceInventory(maintenanceInventoryDetails,activity_id): Observable<any> {
			return this._http.put(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.maintenance_inventory+activity_id+'/', maintenanceInventoryDetails);
	}

	getSpareItems(): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.spareitems);
	  }

	addSpareItem(data): Observable<any> {
	return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.spareitems, data);
	}

  addVehicleItem(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle_expense_item, data);
    }

  getVehicleItem(): Observable<any> {
      return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_expense_item);
  }

	getUniqueNumber(tyreno, tyreId: string = ""): Observable<any>{
		if (!tyreId) {
			return this._http.get(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.vehicle_tyers, {params:{tyreno: tyreno}})
		}
		return this._http.get(BASE_API_URL +TSAPIRoutes.operation + TSAPIRoutes.vehicle_tyers, {params:{tyreno: tyreno, tyreid: tyreId}})
	   }

	getInventoryTyres(make: string = "", model: string = "", threadType: string = "") {
		let params = {};
		if (make) {
			params['make'] = make;
		}

		if (model) {
			params['model'] = model;
		}

		if (threadType) {
			params['thread_type'] = threadType;
		}
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory_tyres, {params: params})
	}

	getMaintenanceTyres(make: string = "", model: string = "", threadType: string = "") {
		let params = {};
		if (make) {
			params['make'] = make;
		}

		if (model) {
			params['model'] = model;
		}

		if (threadType) {
			params['thread_type'] = threadType;
		}
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.maintenance_tyres, {params: params})
	}

	validateInventoryTyrePresent(date, itemId) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.inventory_validate_tyre, {params: {date: date, item_id: itemId}})
	}

	validateMaintenanceTyrePresent(date, itemId) {
		return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.maintenance_validate_tyre, {params: {date: date, item_id: itemId}})
	}
	getVehPayment(id): Observable<any> {
		return this._http.get(BASE_API_URL + TSAPIRoutes.save_fleet_expense+TSAPIRoutes.view+id+'/');
	}

	  getVPCraneAwpTimesheetByVendor(type,VendorId): Observable<any> {
        return this._http.get(BASE_API_URL + `${TSAPIRoutes.save_fleet_expense}timesheets/party/${VendorId}/?category=${type}`);
      }

	  getVPCraneAwpJobChargesByVendor(type,VendorId): Observable<any> {
        return this._http.get(BASE_API_URL + `${TSAPIRoutes.save_fleet_expense}charges/party/${VendorId}/?category=${type}`);
      }

      getVPCraneAwpJobDeductionsByVendor(type,VendorId): Observable<any> {
        return this._http.get(BASE_API_URL + `${TSAPIRoutes.save_fleet_expense}deductions/party/${VendorId}/?category=${type}`);
      }

      checkJobsByCustomer(vendorId,invoiceId?): Observable<any>{
        return this._http.get(BASE_API_URL + `${TSAPIRoutes.save_fleet_expense}items/party/exists/${vendorId}/?vp=${invoiceId}`);
      }
}
