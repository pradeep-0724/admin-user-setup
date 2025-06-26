import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class VendorBillService {

  
    constructor(private _http:HttpClient) { }
  
  
    getVendorBillList(params):Observable<any>{
      return this._http.get(BASE_API_URL + 'operation/vendor_bill/list/',{params});
    }
    downloadVendorBillList(params): Observable<any> {
        return this._http.get(BASE_API_URL + 'operation/vendor_bill/list/',{params:params,responseType: "blob"
      });
      }
}
