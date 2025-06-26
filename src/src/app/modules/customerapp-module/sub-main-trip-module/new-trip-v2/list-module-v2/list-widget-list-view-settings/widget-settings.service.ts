import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {BASE_API_URL} from "src/app/core/constants/api-urls.constants";

@Injectable({
    providedIn: "root",
})
export class WidgetSettingService {
    constructor(private _http: HttpClient) { }

    getSettings(url): Observable<any> {
        return this._http.get(BASE_API_URL + url);
    }

    postSettings(url,body): Observable<any> {
        return this._http.post(BASE_API_URL + url,body);
    }
}
