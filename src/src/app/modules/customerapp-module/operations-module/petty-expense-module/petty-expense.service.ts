import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class PettyExpenseService {

  constructor(private _http: HttpClient) { }

  postPettyExpense(data):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.petty_expense,data)
  }

  getPettyExpenses(params):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.petty_expense+TSAPIRoutes.list,{params})
  }

  deletePettyExpense(id):Observable<any>{
    return this._http.delete(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.petty_expense+id+'/')
  }

  getPettyExpenseDetail(id):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.petty_expense+id+'/')
   }

   updatePettyExpense(data,id):Observable<any>{
     return this._http.put(BASE_API_URL+TSAPIRoutes.operation+TSAPIRoutes.petty_expense+id+'/',data)
   }
}
