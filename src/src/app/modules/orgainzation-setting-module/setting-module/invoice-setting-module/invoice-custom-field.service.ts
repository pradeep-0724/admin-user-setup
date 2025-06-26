
import { BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvoiceCustomFieldService {

  constructor(
    private _http: HttpClient
  ) { }
  getInvoiceFields(to_add,category=0): Observable<any> {
    return this._http.get(BASE_API_URL +'revenue/invoice/formfield/',{params:{to_add,category}})
  }


  allDisplayToggle(data): Observable<any> {
    return this._http.post(BASE_API_URL +'revenue/invoice/setting/',data)
  }

  getInvoiceSettings(category): Observable<any> {
    return this._http.get(BASE_API_URL +'revenue/invoice/setting/',{params:{category}})
  }
  postInvoiceSettings(data): Observable<any> {
    return this._http.post(BASE_API_URL +'revenue/invoice/setting/',data)

  }

  singleDisplayToggle(id,data): Observable<any> {
    return this._http.put(BASE_API_URL +'revenue/invoice/formfield/'+id+'/',data)
  }
  
  deleteCustomFiled(id): Observable<any> {
    return this._http.delete(BASE_API_URL +'revenue/invoice/formfield/'+id+'/')
  }

}

