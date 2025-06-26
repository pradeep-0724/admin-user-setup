import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TSAPIRoutes, BASE_API_URL } from 'src/app/core/constants/api-urls.constants';
import { UserManagementModuleModule } from '../../../../orgainzation-setting-module/user-management-module/user-management-module.module';

@Injectable({
	providedIn: UserManagementModuleModule
})
export class UserManagementService {
 private cloneId='null'
  constructor(private _http: HttpClient) {}

  postRoles(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.user_roles,body)
  }

  getRolesDetails(id):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.user_roles+id+'/')
  }

  getRolesDetailsStructure(structure):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.user_roles,{params:{structure}})
  }

  getRolesList():Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.user_roles)
  }

  putRoles(body,id):Observable<any>{
    return this._http.put(BASE_API_URL+TSAPIRoutes.user_roles+id+'/',body)
  }

  deleteRole(id):Observable<any>{
    return this._http.delete(BASE_API_URL+TSAPIRoutes.user_roles+id+'/')
  }

  getCloneID(){
    return this.cloneId;
  }

  setCloneID(id){
    return this.cloneId =id;
  }

  getUserList():Observable<any>{
      return this._http.get(BASE_API_URL+TSAPIRoutes.company_user)
  }
  getUserByID(id):Observable<any>{
    return this._http.get(BASE_API_URL+TSAPIRoutes.company_user+id+'/')
}
  postUser(body):Observable<any>{
    return this._http.post(BASE_API_URL+TSAPIRoutes.company_invite,body)
}

resendInvite(inviteId):Observable<any>{
  return this._http.get(BASE_API_URL + TSAPIRoutes.company_resend_invite + inviteId + '/')
}

markeActive(inviteId):Observable<any>{
  return this._http.get(BASE_API_URL + TSAPIRoutes.company_user_activate + inviteId + '/')
}

putUser(body,id):Observable<any>{
  return this._http.put(BASE_API_URL+TSAPIRoutes.company_user+id+'/',body)
}

deleteUser(id):Observable<any>{
  return this._http.delete(BASE_API_URL+TSAPIRoutes.company_user+id+'/')
}






}
