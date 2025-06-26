import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { EmployeeService } from '../../master-module-services/employee-service/employee-service';

@Injectable({
  providedIn:'root'
})
export class QuotationV2Service {
  constructor(
    private _http: HttpClient,
    private _employeeService:EmployeeService
  ) { }

  getCustomerList(): Observable<any> {
       let params = {party_type: '0',vendor_party_type:''} ;
    return this._http.get(BASE_API_URL + TSAPIRoutes.party,{
        params:params
    });
}

getStaticOptions(keysRequired, includeRCM: boolean = false): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.static_options + '?key=' + keysRequired + '&includeRCM=' + includeRCM);
}
getEmployeeList(employeeListCallBack){

  let $employeeServiceSubscription= this._employeeService.getEmployeeList().subscribe((response) => {
       employeeListCallBack(response)
   },err=>{
     employeeListCallBack([])
   },()=>{
     setTimeout(() => {$employeeServiceSubscription.unsubscribe(); },1000);
   });
 }

getConsignor(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignor);
}
getQuotationListExcel(params){
  return this._http.get(BASE_API_URL +  TSAPIRoutes.quotation+TSAPIRoutes.list,{params,responseType: 'blob'})
}

getConsignee(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignee);
}

getOptionValuesForMaterailUnits(): Observable<any> {
  return this._http.get(BASE_API_URL + 'optionvalues/?key=material-item-unit');
}

getTaxDetails():Observable<any>{
  return this._http.get(BASE_API_URL+'tax/form/options/')
}

getDefaultBank(id,params):Observable<any>{
  return this._http.get(BASE_API_URL+TSAPIRoutes.party+'get_default/bank/'+id+'/',{params})
}
getTenantBank(){
  return this._http.get(BASE_API_URL+'company/bank/get_default/')
}


getMaterials(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.material);
}

getPartyAdressDetails(partyId: String): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.party + partyId + '/gst/detail/');
}

postQuotation(body): Observable<any> {
  return this._http.post(BASE_API_URL +TSAPIRoutes.quotation,body);
}

putQuotation(id,body): Observable<any> {
  return this._http.put(BASE_API_URL +TSAPIRoutes.quotation+id+"/",body);
}


postQuotationDetails(id): Observable<any> {
  return this._http.get(BASE_API_URL +TSAPIRoutes.quotation+id+"/");
}

deleteQuotation(id): Observable<any> {
  return this._http.delete(BASE_API_URL +TSAPIRoutes.quotation+id+"/");
}

getQuotation(start_date,end_date): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.quotation,{params:{start_date,end_date}});
}

postQuotationStatus(id,status): Observable<any> {
  return this._http.post(BASE_API_URL + TSAPIRoutes.quotation+"status-change/"+id+"/",{status});
}

getBankDropDownList(): Observable<any> {
  return this._http.get(BASE_API_URL + TSAPIRoutes.bankdropdownlist);
}

getPayementTermList(): Observable<any> {
  return this._http.get(BASE_API_URL +TSAPIRoutes.quotation+"payment-term/");
}

getTersmAndConditionList(): Observable<any> {
  return this._http.get(BASE_API_URL +'setting/tc/?key=quotation')
}

getQuotationPrintView(id): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.quotation+ `${id}/printview/`);
  }

getDigitalSignatureList(): Observable<any> {
    return this._http.get(BASE_API_URL +'setting/ds/')
  }

  getQuotationList(params): Observable<any> {
    return this._http.get(BASE_API_URL +'quotation/list/',{params:params})
  }

  getQuotationDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL +"quotation_v2/"+id+"/");
  }

  getQuotationEditDetails(id): Observable<any> {
    return this._http.get(BASE_API_URL +"quotation/"+id+"/");
  }

  putQuotationFields(id,type,body): Observable<any> {
    return this._http.put(BASE_API_URL +TSAPIRoutes.quotation+type+"/"+id+"/",body);
  }

  getPartyTCandSignature(id): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.party+"settings/"+id+"/");
  }

  getValidationDetails(): Observable<any> {
    return this._http.get(BASE_API_URL +'screen/validation/'+TSAPIRoutes.quotation);
  }

  getApprovalLevelDetails(getLatestBy,category): Observable<any> {
    return this._http.get(BASE_API_URL +'screen/approval/' + TSAPIRoutes.quotation, { params: {latest_by: getLatestBy,category:category}});
  }

  saveDraftStateQuotation(id,data): Observable<any> {
    return this._http.post(BASE_API_URL +'quotation/save/'+id+'/',data);
  }

  voidQuotation(id): Observable<any> {
    return this._http.post(BASE_API_URL +'quotation/void/'+id+'/',{});
  }

  quotationApprovedorRejected(id,data): Observable<any> {
    return this._http.post(BASE_API_URL +'quotation/approve/'+id+'/',data);}
    
  getQuotationListByPartyAndVehicleCatagory(partyId,vehicleCatagory): Observable<any> {
    return this._http.get(BASE_API_URL +'quotation/list/party/'+partyId+'/?vehicle_category='+vehicleCatagory);
  }

  uploadQuotationDocument(id,body): Observable<any>{
    return this._http.put(BASE_API_URL+'revenue/quotation/document_upload/'+id+'/',body)
  }

  getUploadedQuotationDocuments(id): Observable<any>{
    return this._http.get(BASE_API_URL+'revenue/quotation/document_upload/'+id+'/')
  }

  deleteUploadedQuotationDocuments(id): Observable<any>{
    return this._http.delete(BASE_API_URL+'revenue/quotation/document_upload/'+id+'/')
  }

  getPointOfContactsList(id): Observable<any>{
    return this._http.get(BASE_API_URL+'report/party/poc/'+id+'/')
  }

  postPointOfContactsList(id,body): Observable<any>{
    return this._http.post(BASE_API_URL+'report/party/poc/'+id+'/',body)
  }
}
