import { BASE_API_URL, TSAPIRoutes } from '../../../../core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(
    private _http: HttpClient
  ) { }

  uploadFiles(files): Observable<any> {
    return this._http.post(BASE_API_URL + TSAPIRoutes.generic_document, files);
  }

  deleteFile(fileUuid): Observable<any> {
    return this._http.delete(BASE_API_URL + TSAPIRoutes.generic_document + fileUuid + '/');
  }

  updateFileName(body,fileUuid): Observable<any> {
    return this._http.put(BASE_API_URL + TSAPIRoutes.generic_document +"update/"+ fileUuid + '/',body);
  }

  getDocumentUniqueList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.generic_document +"name/");
  }

  getBlob(url): Observable<any> {
    return this._http.get(BASE_API_URL +TSAPIRoutes.generic_document+"blob/?url="+url);
  }

}

