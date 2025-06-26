import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';

@Injectable({
    providedIn : 'root'
})

export class I3MSService {

    constructor(private _http: HttpClient){
 
    }

    getActivationStatus(): Observable<any>{
        return this._http.get(BASE_API_URL + TSAPIRoutes.i3msActivationStatus)
    }

    getAll(count, pageNumber, from, to): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.i3ms_fetch + "?count=" + count + "&page_number=" + pageNumber + 
                              "&from=" + from + "&to=" + to)
    }

    searchTripListData(count, pageNumber,search, from, to): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.i3ms_fetch + "?count=" + count + "&page_number=" + pageNumber+"&search=" + search +
        "&from=" + from + "&to=" + to)
    }

    getPages(count,pageNumber, from, to): Observable<any>{
        return this._http.get(BASE_API_URL + TSAPIRoutes.i3ms_fetch + "?count=" + count +"&page_number="+ pageNumber +
        "&from=" + from + "&to=" + to)
        // return this._http.get(BASE_API_URL + TSAPIRoutes.i3ms_fetch + "?count=" + count +"&record=" + record +"&page_number=" + pageNumber+"&previous="+previous)

    }

    updateFieldValues(data): Observable<any>{
        return this._http.post(BASE_API_URL + TSAPIRoutes.i3ms_field_values, data)

    }

    getFieldValues(): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.i3ms_field_values)
    }
}