import { Injectable } from '@angular/core';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSalaryModuleService{


  constructor(
    private _http: HttpClient
  ) { }


  getAllEmployee(date):Observable<any>{
   return  this._http.get(BASE_API_URL +TSAPIRoutes.op_employee_salary+'status/?q='+date)
  }
  getEmployeeMeta(body):Observable<any>{
    return  this._http.post(BASE_API_URL +TSAPIRoutes.op_employee_salary+'meta/',body)
   }

  postEmployeeSalary(body):Observable<any>{
    return  this._http.post(BASE_API_URL +TSAPIRoutes.op_employee_salary,body)
   }

   getEmployeeSalary(params):Observable<any>{
    return  this._http.get(BASE_API_URL +TSAPIRoutes.op_employee_salary+TSAPIRoutes.list,{params})
   }

   deleteEmployeeSalary(id) :Observable<any>{
    return  this._http.delete(BASE_API_URL +TSAPIRoutes.op_employee_salary+id+'/')
   }

   getEmployeeSalaryDetails(id) :Observable<any>{
    return  this._http.get(BASE_API_URL +TSAPIRoutes.op_employee_salary+id+'/')
   }

   putEmployeeSalary(body,id):Observable<any>{
    return  this._http.put(BASE_API_URL +TSAPIRoutes.op_employee_salary+id+'/',body)
   }
}
