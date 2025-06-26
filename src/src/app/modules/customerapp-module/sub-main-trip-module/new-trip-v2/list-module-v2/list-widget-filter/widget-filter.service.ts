import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {BASE_API_URL} from "src/app/core/constants/api-urls.constants";

@Injectable({
    providedIn: "root",
})
export class WidgetFilterService {
    constructor(private _http: HttpClient) { }

    getFilterOptions(url): Observable<any> {
        return this._http.get(BASE_API_URL + url);
    }

}
