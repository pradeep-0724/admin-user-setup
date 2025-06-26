import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  accountType = new ValidationConstants().accountType.join(',');
  private subject = new Subject<any>();
  private invoice_no_subject = new Subject<any>();
  apiUrl: string;
private consignmentNoteData = {
    id:'',
    screenName :'',
    consignmentNoteName:''
  }

  constructor(
    private _http: HttpClient
  ) { }
  // employee/active/list/
  getActiveEmployeeList(): Observable<any> {
    return this._http.get(BASE_API_URL + 'employee/active/list/' );
  }

  getDefaultBank(id,params):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.party+'get_default/bank/'+id+'/',{params})
  }
  getTenantBank(){
    return this._http.get(BASE_API_URL+'company/bank/get_default/')

  }

  getDisclaimerOptions(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.disclaimer);
  }

  getMaterials(is_material=false): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.material,{params:{is_material:is_material}});
  }

  getCustomFieldsDetails():Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.consignment_note+TSAPIRoutes.form_filed);
  }

  getTripEstimateCustomFieldsDetails():Observable<any>{
    return this._http.get(BASE_API_URL+ TSAPIRoutes.revenue+TSAPIRoutes.consignment_note+TSAPIRoutes.custom_field);
  }

  postCustomFieldDetails(data, fieldId):Observable<any>{
    if (fieldId){
      return this._http.put(BASE_API_URL + TSAPIRoutes.consignment_note + TSAPIRoutes.form_filed + fieldId + '/', data);
    }
    return this._http.post(BASE_API_URL + TSAPIRoutes.consignment_note + TSAPIRoutes.form_filed, data);
  }

  deleteTripEstimateCustomFieldsDetails(fieldId) {
      return this._http.delete(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignment_note + TSAPIRoutes.custom_field + fieldId + '/');
  }

  postTripEstimateCustomFields(data):Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignment_note + TSAPIRoutes.custom_field, data);
  }

  putTripEstimateCustomFields(fieldId, data):Observable<any>{
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignment_note + TSAPIRoutes.custom_field + fieldId + '/', data);
  }

  getTripEstimateFieldOptions(fieldId):Observable<any>{
    return this._http.get(BASE_API_URL+ TSAPIRoutes.revenue+TSAPIRoutes.consignment_note+TSAPIRoutes.custom_field + 'option/' + fieldId + '/');
  }

  postLorryChallanCustomFieldDetails(data, fieldId):Observable<any>{
    if (fieldId){
      return this._http.put(BASE_API_URL + TSAPIRoutes.consignment_note + TSAPIRoutes.form_filed + fieldId + '/', data);
    }
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue+TSAPIRoutes.lorry_challan + TSAPIRoutes.form_filed, data);

  }

  getEditConsignmentDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.consignment_note+id+'/');
  }

  getUnusedConsignmentExistence():Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue + TSAPIRoutes.consignment_note + 'unused/count/');
  }

  updateConsignmentDetails(payload, id): Observable<any> {
    return this._http.put(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.consignment_note+id+'/', payload);
  }

  saveConsignmentDetails(data):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.consignment_note,data);
  }

  postLorryChallanDetails(data):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.lorry_challan,data);
  }

  getEditLorryChallanDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.lorry_challan+id+'/');
  }

  deleteLorryChallanDetails(id):Observable<any>{
    return this._http.delete(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.lorry_challan+id+'/');
  }

  updateLorryChallan(data,id):Observable<any>{
    return this._http.put(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.lorry_challan+id+'/',data);
  }

  getConsignmentNotes() {
		return this._http.get(BASE_API_URL+TSAPIRoutes.revenue + TSAPIRoutes.consignment_note + 'options/');
  }

  getConsignmentTripDetails(id,is_company:string='false'):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.consignment_note+id+'/trip/',{params:{is_company}});
  }

  getConsignmentDetails(data):Observable<any>{

    this.apiUrl=BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.consignment_note;
    if(data)
      this.apiUrl += '?status=' + data;
    return this._http.get(this.apiUrl);
  }

  getLorryChallanDetails(){
    return this._http.get(BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.lorry_challan);

  }

  getConsignmentPrintView(uuid:string): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + TSAPIRoutes.consignment_note_printview + uuid + '/')
  }

  deleteRecord(data){
    return this._http.request('delete',BASE_API_URL+TSAPIRoutes.revenue+TSAPIRoutes.consignment_note+data+'/',
    {
      body: {
        data: [
          data
        ]
      }
    }

    );
  }

  getAccounts(params?): Observable<any> {
    if (!params)
      params = {q: this.accountType} ;
    else if(params=='All'){}
    else{
      params = {q: params} ;
    }
    return this._http.get(BASE_API_URL + TSAPIRoutes.chart_of_account, {params : params});
  }

  getExpense(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.expense);
  }

  getVehicleList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue + 'trip/vehicles/');
  }

  getVehicleLoopId(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.revenue + 'trip_new/trip_id/',data);
  }
  
  getTransporterDrivers():Observable<any>{
    return this._http.get(BASE_API_URL +  TSAPIRoutes.lorrychallan_driver);
  }


  getChallanList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.challan);
  }

  getChallanListByParty(partyId): Observable<any> {
    return this._http.get(BASE_API_URL + 'revenue/challan_by_party/' + partyId + '/');
  }

  getTripChallanListByParty(partyId,category? :any): Observable<any> {
    let params = {
      category :  category && category.length ? category : 'others',
      screen : category && category.length ? 'vehicle_provider' : 'invoice'
    }
    return this._http.get(BASE_API_URL + 'revenue/trip/challan/' + partyId + '/',{params});
  }

  getTripChallanListByVendorForCargo(partyId,category? :any): Observable<any> {
    let params = {
      category :  category
    }
    return this._http.get(BASE_API_URL + 'operation/fleetowner/non_vp/trips/cargo/' + partyId + '/',{params});
  }

  getFLTripChallanListByParty(partyId): Observable<any> {
    return this._http.get(BASE_API_URL + 'revenue/trip/challan/fl/' + partyId + '/');
  }
  getTripExpenseListByParty(partyId): Observable<any> {
    return this._http.get(BASE_API_URL + 'revenue/tripexpense/party/' + partyId + '/');
  }
  getChallanListByInvoice(invoiceId): Observable<any> {
    return this._http.get(BASE_API_URL + 'revenue/invoice/challan/' + invoiceId + '/');
  }

  getFleetOwnerChallans(partyId) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.fleet_party + partyId + '/');
  }

  getFuelChallans(partyId) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.fuel_challan + partyId + '/');
  }

  getUnpaidChallans(partyId,params) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.unpaid_fuel_challan + partyId + '/',{params:params});
  }

  sendPartyId(partyId: string) {
    this.subject.next({partyId: partyId})
  }

  clearPartyId() {
    this.subject.next()
  }

  getPartyId(): Observable<any> {
    return this.subject.asObservable();
  }

  sendPartyIntime(PartyId){
    if (!PartyId)
        console.log('No Party to observe');
    if (PartyId instanceof Object == true)
        PartyId = PartyId.id
    setTimeout(() => {
      this.sendPartyId(PartyId);
    }, 500);
  }

  /* service list for mechanic activity
  */
  getServiceList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.service_type);
  }

  postServiceList(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.operation + TSAPIRoutes.service_type, data);
  }

  setInvoiceNumber(invocieNumber: String) {
    this.invoice_no_subject.next({invoice_number: invocieNumber});
  }

  getInvoiceNumber(): Observable<any> {
    return this.invoice_no_subject.asObservable();
  }

  getChequePayementDetails(params): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.revenue +TSAPIRoutes.payment_cheque+TSAPIRoutes.list,{params});
  }
  putChequePayementUpdate(id,data): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.revenue +TSAPIRoutes.payment_cheque+id+'/',data);
  }


  sendInvoiceIntime(InvoiceId){
    if (InvoiceId instanceof Object == true)
    InvoiceId = InvoiceId.id
    setTimeout(() => {
      this.setInvoiceNumber(InvoiceId);
    }, 500);
  }

  setConsignmentNoteDeatisl(consignmentNoteData){
    this.consignmentNoteData = consignmentNoteData
  }
  getConsignmentNoteDetailsForPatch(){
    return this.consignmentNoteData;
  }

  getTersmAndConditionList(key): Observable<any> {
    let params = {
      key : key
    }
    return this._http.get(BASE_API_URL +'setting/tc/',{params})
  }
}
