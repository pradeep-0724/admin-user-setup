import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL, TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Injectable({
  providedIn: 'root'
})
export class EmployeeServiceService {

  constructor(
    private _http: HttpClient
  ) { }

  getEmployeeTimelogList(): Observable<any> {
    return this._http.get(BASE_API_URL + TSAPIRoutes.employeeTimelog+TSAPIRoutes.empInfo);
  }
  getEmployeeTotalTime(empId:string,start:string,end:string){
    return this._http.get(BASE_API_URL + TSAPIRoutes.employeeTimelog+TSAPIRoutes.empInfo+empId+'/',{params:{query:`custom-start-${start},custom-end-${end}`}});
  }

  getPerDayEmployeeTimelog(empId:string,date:string,):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.employeeTimelog+ TSAPIRoutes.employeePunch+empId+"/",{params:{date:date}});

  }
  getaWeektimeData(empId:string,date:string,range:number):Observable<any>{
    return this._http.get(BASE_API_URL +TSAPIRoutes.employeeTimelog+TSAPIRoutes.empDays+TSAPIRoutes.empInfo+empId+"/",{params:{date:date,range:range}});

  }
}
