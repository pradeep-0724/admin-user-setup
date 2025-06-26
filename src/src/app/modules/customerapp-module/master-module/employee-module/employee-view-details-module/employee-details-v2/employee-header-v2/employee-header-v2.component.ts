import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { getPrefix } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-employee-header-v2',
  templateUrl: './employee-header-v2.component.html',
  styleUrls: ['./employee-header-v2.component.scss']
})
export class EmployeeHeaderV2Component implements OnInit {

  constructor(private _route: ActivatedRoute,private _router:Router) { }
  isFormList = false;
  @Input()employeeInfo:Observable<any>;
  employeeDetails;

  historyBack() {
    if(this.isFormList){
      history.back();
    }else{
     this._router.navigate([getPrefix()+'/onboarding/employee/view'])
    }
    
  }
  ngOnInit(): void {
    this._route.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('fromlist')) {
        this.isFormList = true;
      }
    });
    this.employeeInfo.subscribe(resp=>{
      this.employeeDetails = resp;
    })
  }

}
