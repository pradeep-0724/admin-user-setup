import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  TSAPIRoutes,
  BASE_API_URL,
  BASE_API_URL_V2,
} from "src/app/core/constants/api-urls.constants";

@Injectable({
  providedIn: "root",
})
export class NewTripV2Service {
  constructor(private _http: HttpClient) {}

  postTrips(body): Observable<any> {
    return this._http.post(
      BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip,
      body
    );
  }

  getAddress(body): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.place, body);
  }

  getGatePass(id): Observable<any> {
    return this._http.get(BASE_API_URL + 'revenue/trip_new/gatepass/'+id+'/');
  }



  getAssignedDriversList(id): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.place, id);
  }

  getExpiryDocs(params): Observable<any> {    
    return this._http.post(BASE_API_URL + 'company/resource/expiry/',params);
  }

  getUnassignedVehiclesList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+'trip_new/own/unassigned/vehicle/');
  }

  getRecent(): Observable<any> {
    return this._http.get(
      BASE_API_URL + TSAPIRoutes.places + TSAPIRoutes.recent
    );
  }
  getAllRoutes(customerId: string): Observable<any> {
    return this._http.get(
      BASE_API_URL +
        TSAPIRoutes.revenue +
        TSAPIRoutes.trip +
        "path/party/" +
        customerId +
        "/"
    );
  }

  checkNewRoute(body): Observable<any> {
    return this._http.post(
      BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.trip + "path/exists/",
      body
    );
  }
  
  getNewTripList(params): Observable<any>{
    return this._http.get(BASE_API_URL_V2 +TSAPIRoutes.revenue +TSAPIRoutes.trip +TSAPIRoutes.vehicle +TSAPIRoutes.list,{params:params});
  }

  getTripHeaderDetails(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue +"trip_new/" +id + "/"
    );
  }

  getTripStatusAndSummary(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue +"trip_new/path/" +id + "/"
    );
  }

  changeTripStatus(id,body): Observable<any>{
    return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue +"trip_new/path/status/" +id + "/",body );
  }

  getTripRouteAndContactList(id): Observable<any>{
    return this._http.get( BASE_API_URL  +"party/routes/" +id + "/"
    );
  }

  getTripProfitandLossDetails(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +"pl/" +id + "/"
    );
  }

  putAddandReduceInvoiceData(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +"charges/" +id+ "/",body);
  }

  putOtherExpenses(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +TSAPIRoutes.expenses +id+ "/",body);
  }

  updateTripRoute(id,body): Observable<any>{
    return this._http.put( BASE_API_URL  +TSAPIRoutes.revenue +"trip_new/path/" +id + "/",body );
  }

  putDriverAllowances(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'allowances/' +id+ "/",body);
  }

  putFuelExpenses(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'self_fuels/' +id+ "/",body);
  }

  deleteTripDetailsItems(id,type): Observable<any>{
    return this._http.delete( BASE_API_URL  +TSAPIRoutes.revenue +`trip_new/${type}/` +id + "/");
  }

  postConsiderationAmount(id,body): Observable<any>{
    return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'consideration/' +id+ "/",body);
  }

  putTripHeader(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'head/' +id+ "/",body);
  }

  putFreight(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'freights/' +id+ "/",body);
  }

  putMaterial(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'material/' +id+ "/",body);
  }

  putCheckList(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'path/checklist/value/' +id+ "/",body);
  }

  getPartyTransactions(id): Observable<any>{
    return this._http.get( BASE_API_URL  +TSAPIRoutes.revenue+TSAPIRoutes.new_trip +"transactions/" +id + "/"
    );
  }

  getTripDocuments(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +"document_upload/" +id + "/"
    );
  }

  putTripDocuments(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'document_upload/' +id+ "/",body);
  }

  deleteTripDocuments(id): Observable<any>{
    return this._http.delete( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'document_upload/' +id+ "/");
  }

  getTripCustomFields(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +"customfield/" +id + "/"
    );
  }

  getWorkorderDropDown(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+"workorder_dropdown_list/" +id + "/"
    );
  }

  getWorkOrderTripDetails(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+ TSAPIRoutes.workorder+TSAPIRoutes.trip+id + "/"
    );
  }

  putTripCustomFields(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +"customfield/" +id + "/",body );
  }

  downloadTripList(params): Observable<any> {
    return this._http.get(BASE_API_URL_V2 +TSAPIRoutes.revenue +TSAPIRoutes.trip +TSAPIRoutes.vehicle +TSAPIRoutes.list,{params:params,responseType: "blob"
  });
  }

  getBdpMilestone(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.trip+"bdp/"+id+"/"
    );
  }

  getTimeSheets(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+id+"/timesheets/"
    );
  }

  getDeliveryNoteDetails(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+id+"/deliverynotes/"
    );
  }


  getApprovedTimeSheets(id): Observable<any>{
    return this._http.get( BASE_API_URL + `revenue/invoice/timesheets/trip/${id}/`
    );
  }

  getJobCharges(id): Observable<any>{
    return this._http.get( BASE_API_URL + `revenue/invoice/charges/trip/${id}/`
    );
  }
  getJobDeductions(id): Observable<any>{
    return this._http.get( BASE_API_URL + `revenue/invoice/deductions/trip/${id}/`
    );
  }
  getApprovedTimeSheetsFrVP(id): Observable<any>{
    return this._http.get( BASE_API_URL + `operation/fleetowner/timesheets/trip/${id}/`
    );
  }

  getJobChargesFrVP(id): Observable<any>{
    return this._http.get( BASE_API_URL + `operation/fleetowner/charges/trip/${id}/`
    );
  }
  getJobDeductionsFrVp(id): Observable<any>{
    return this._http.get( BASE_API_URL + `operation/fleetowner/deductions/trip/${id}/`
    );
  }

  getCommissionTimeSheets(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+"timesheet/"+ id+'/commissions/'
    );
  }

  createTimeSheets(body): Observable<any>{
    return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+"timesheet/",body
    );
  }

  getTimeSheetsDetails(id): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+"timesheet/"+id+"/"
    );
  }

  deteleTime(id): Observable<any>{
    return this._http.delete( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+"timesheet/"+id+"/"
    );
  }

  putTimeSheets(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+"timesheet/"+id+"/",body
    );
  }


  createDeliveryNote(body): Observable<any>{
    return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip+"deliverynote/",body
    );
  }



  postBdpMilestone(id,body): Observable<any>{
    return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.trip+"bdp/milestone/"+id+"/",body);
  }

  putAssignVehicle(id,body): Observable<any>{
    return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'add/vehicle/' +id+ "/",body);
  }

  getTripListStat(): Observable<any>{
    return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'stats/');
  }

  addMaterial(data: any) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.get_and_post_material, data );
}

putAssignDriver(id,body): Observable<any>{
  return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'add/driver/' +id+ "/",body);
}

postMarketVehicleDetails(data: any) {
  return this._http.post(BASE_API_URL + TSAPIRoutes.vehicle+'market/pop/', data );
}

getWOAndQO(party_id,vehicle_category): Observable<any>{
  return this._http.get( BASE_API_URL + `revenue/trip/woqo/?party_id=${party_id}&vehicle_category=${vehicle_category}`);
}

getWOAndQOdetails(id,screen): Observable<any>{
  return this._http.get( BASE_API_URL + `revenue/trip/woqo/detail/?object_id=${id}&screen=${screen}`);
}

voidJob(id): Observable<any>{
  return this._http.post( BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.new_trip+'void/'+id+'/',{});
}

assignDriverVehicle(id,data): Observable<any>{
  return this._http.put( BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.new_trip+'add/vehicle/'+id+'/',data);
}

getTripDetails(id): Observable<any> {
  return this._http.get( BASE_API_URL + TSAPIRoutes.revenue+TSAPIRoutes.new_trip +'edit_details/' +id+ "/");
}

putTrips(id,body): Observable<any> {
  return this._http.put(
    BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.new_trip+id+"/",
    body
  );
}

getValidationDetails(): Observable<any>{
  return this._http.get( BASE_API_URL +'screen/validation/trip/');
}

getApprovalLevelDetails(category): Observable<any>{
  return this._http.get( BASE_API_URL +'screen/approval/trip/',{params:{category:category}});
}

getDocumentsExpiryStatus(): Observable<any> {
  return this._http.get(BASE_API_URL +'company/resource/expiry/');
}


approvalAction(timesheetId, body): Observable<any>{
  return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+TSAPIRoutes.new_trip +  `timesheet/${timesheetId}/approve/`, body);
}

jobApprovedorRejected(id,data): Observable<any> {
  return this._http.post(BASE_API_URL +'revenue/trip_new/approve/'+id+'/',data);
}

resendJobApproval(id,data): Observable<any> {
  return this._http.post(BASE_API_URL +'revenue/trip_new/approval/'+id+'/',data);
}

getCurrentJobValidations(id): Observable<any> {
  return this._http.get(BASE_API_URL +'revenue/trip_new/validations/'+id+'/');
}

getVehicleAssigend() {
  return this._http.get(BASE_API_URL + TSAPIRoutes.vehicle_active_list);
}

getJobContainerTableSettings(id): Observable<any> {
  return this._http.get(BASE_API_URL+TSAPIRoutes.revenue +`trip/${id}/container/setting/`)
}

getJobContainerData(id): Observable<any> {
  return this._http.get(BASE_API_URL+TSAPIRoutes.revenue +`trip/container/${id}/`)
}

putContainerDetails(id,body): Observable<any> {
  return this._http.put(BASE_API_URL+TSAPIRoutes.revenue +`trip/container/${id}/`,body)
}

getPaymentModeHistoryForDriverCommission(): Observable<any> {
  return this._http.get(BASE_API_URL+TSAPIRoutes.revenue +'trip_new/allowances/pre/data/')
}

postPullOutToken(id,body): Observable<any>{
  return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/token/pullout/",body);
}
postDepositToken(id,body): Observable<any>{
  return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/token/deposit/",body);
}
postVGM(id,body): Observable<any>{
  return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/vgm/",body);
}
getVGM(id): Observable<any>{
  return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/vgm/");
}
updatePullOutToken(id,pulloutId,body): Observable<any>{
  return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/token/pullout/"+pulloutId+"/" ,body);
}
updateDepositToken(id,depositId,body): Observable<any>{
  return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/token/deposit/"+depositId+"/" ,body);
}

updateVGM(id,body): Observable<any>{
  return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/vgm/" ,body);
}
getPullOutToken(id): Observable<any>{
  return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/token/pullout/");
}
getDepositToken(id): Observable<any>{
  return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+"/token/deposit/");
}
deleteToken(id,tokenid,key): Observable<any>{
  return this._http.delete( BASE_API_URL +  TSAPIRoutes.revenue+`trip_new/${id}/token/${key}/${tokenid}/`);
}
deleteVGM(id): Observable<any>{
  return this._http.post( BASE_API_URL +  TSAPIRoutes.revenue+`trip_new/${id}/vgm/`,[]);
}
cancelToken(id,tokenid,key,body): Observable<any>{
  return this._http.put( BASE_API_URL +  TSAPIRoutes.revenue+`trip_new/${id}/token/${key}/${tokenid}/cancel/`,body);
}

getTokenHistory(id,key): Observable<any>{
  return this._http.get( BASE_API_URL +  TSAPIRoutes.revenue+"trip_new/"+id+`/token/history/?type=${key}`);
}

getUniqueTokenVerification(token): Observable<any>{
  let params = {
    token : token
  }
  return this._http.get(BASE_API_URL+TSAPIRoutes.revenue+'trip_new/token/',{params : params})
}

getContainersListFromTheJob(tripdID): Observable<any>{
  return this._http.get(BASE_API_URL +TSAPIRoutes.revenue +TSAPIRoutes.trip +tripdID+'/container/names/');
}

getPointOfContactsList(id): Observable<any>{
  return this._http.get(BASE_API_URL+'report/party/poc/'+id+'/')
}

postPointOfContactsList(id,body): Observable<any>{
  return this._http.post(BASE_API_URL+'report/party/poc/'+id+'/',body)
}



}
