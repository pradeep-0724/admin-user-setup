import { TSStoreKeys } from '../../../../core/constants/store-keys.constants';
import { BASE_API_URL, TSAPIRoutes } from '../../../../core/constants/api-urls.constants';
import { StoreService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/store.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class CompanyServices {
  companyData: any = {};
  editCompanyInfoDone = new BehaviorSubject(false);
  editCompanyAddDone = new BehaviorSubject(false);
  editCompanyCertiDone = new BehaviorSubject(false);
  showEditCompany = new BehaviorSubject(false);

  constructor(
    private _http: HttpClient,
    private _storeService: StoreService
  ) { }

  postCompanyDetails(details) {
    return this._http.post(BASE_API_URL + TSAPIRoutes.company_add_details, details);
  }
  postCompanyRenewDocData(company_id,details) {
    return this._http.post(BASE_API_URL + 'company/renew/certificate/'+company_id+'/', details);
  }

  postCompanyAddress (address, company_id) {
    return this._http.post(BASE_API_URL
      + TSAPIRoutes.company_add
      + company_id
      + '/' + TSAPIRoutes.company_address, address);
  }

  postCompanyCertificate (certificate, company_id) {
    return this._http.post(BASE_API_URL
      + TSAPIRoutes.company_add
      + company_id
      + '/' + TSAPIRoutes.company_certificate, certificate);
  }

  editCompany(companyUUID: String) {
    return this._storeService.getFromStore(TSStoreKeys.master_company_add_details)
    .pipe(mergeMap((detailsData) => {
        this.companyData['details'] = detailsData;
        return this._storeService.getFromStore(TSStoreKeys.master_company_add_address);
    })).pipe(mergeMap((addressData) => {
      this.companyData['address'] = addressData;
      return this._storeService.getFromStore(TSStoreKeys.master_company_add_certificate);
    })).pipe(mergeMap((certificateData) => {
      this.companyData['certificates'] = certificateData;
      return this._http.put(BASE_API_URL + TSAPIRoutes.company_add + companyUUID, this.companyData);
    }));
  }

  editCompanyDetail (company_id, data) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.company_add + company_id + '/details/', data);
  }

  editCompanyAddress (company_id, data) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.company_add + company_id + '/address/', data);
  }

  editCompanyCertificate (data,company_id) {
    return this._http.put(BASE_API_URL + TSAPIRoutes.company_add + company_id + '/certificates/', data);
  }

  getCompanyDetailOnsubmit (company_id: any) {
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_add + company_id  + '/');
  }

  getCompanyDetail () {
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_add);
  }

  getMasterOverview() {
    return this._http.get(BASE_API_URL + "master/overview/");
  }

  getCompanyDetailPrintView() {
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_detail_printview);
  }
  getWhatsappStatus() :Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.whatsapp);
  }
  postWhatsappStatus(data) :Observable<any>{
    return this._http.post(BASE_API_URL + TSAPIRoutes.whatsapp,data);
  }

  checkMobileUniqueness(data) :Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.check_mobile_uniqueness, data)
  }

  sendVerificationCode(data) :Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.send_verification_code, data)
  }

  switchWhatsAppOptin(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.switch_whatsapp_optin, data)
  }

  verifyMobileOTP(data): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.verify_mobile_otp, data)
  }

  ressetDemoData(): Observable<any> {
    return this._http.get(BASE_API_URL + 'reset/',)
  }

  getNotificationCount(): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_add + TSAPIRoutes.notifications+ 'count/')
  }

  getNotifications(page,pageSize): Observable<any>{
    return this._http.get(BASE_API_URL + TSAPIRoutes.company_add + TSAPIRoutes.notifications,{params: {page: page, page_size: pageSize}})
  }
  getExpiryDocs(params): Observable<any> {    
    return this._http.post(BASE_API_URL + 'company/resource/expiry/',params);
  }
  getCertificateHistory(id): Observable<any> {    
    return this._http.get(BASE_API_URL + 'company/history/certificate/'+id+'/');
  }
}
