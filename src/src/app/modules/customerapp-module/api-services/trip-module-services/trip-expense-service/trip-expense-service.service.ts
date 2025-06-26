import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable()
export class TripExpenseService {
	constructor(private _http: HttpClient) {

    }
    postTripExpense(body):Observable<any>{
    return this._http.post( BASE_API_URL+TSAPIRoutes.operation+'tripexpense/',body);
    }


    getTripExpense(id):Observable<any>{
        return this._http.get(BASE_API_URL+TSAPIRoutes.operation+'tripexpense/'+id+'/');
    }

    putTripExpense(id,body):Observable<any>{
        return this._http.put(BASE_API_URL+TSAPIRoutes.operation+'tripexpense/'+id+'/',body);
    }

}
