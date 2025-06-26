import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  TSAPIRoutes,
  BASE_API_URL,
} from "src/app/core/constants/api-urls.constants";

@Injectable({
  providedIn: "root",
})
export class NewBdpService {
    constructor(private _http: HttpClient){}

    getBDPList(): Observable<any> {
        return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+TSAPIRoutes.trip+TSAPIRoutes.bdp);
    }

    getBDpDetails(id:any){
        return this._http.get(BASE_API_URL + TSAPIRoutes.revenue+TSAPIRoutes.trip+TSAPIRoutes.bdp+id+'/');
    }

    isAcceptTender(body){
      return this._http.post(BASE_API_URL + TSAPIRoutes.revenue+TSAPIRoutes.trip+TSAPIRoutes.bdp+"acceptenance/",body);
  }
}