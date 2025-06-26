import { Component, OnInit } from '@angular/core';
import { EmployeeDetailsService } from '../employee-details.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-employee-details-v2',
  templateUrl: './employee-details-v2.component.html',
  styleUrls: ['./employee-details-v2.component.scss']
})
export class EmployeeDetailsV2Component implements OnInit {
  selectedTab=2;
  employeeInfo=new Subject();
  empDisplayName = '';
  employeeId=''
  constructor(private _employeeDetails:EmployeeDetailsService,private _router:ActivatedRoute) { }

  ngOnInit(): void {
    this._router.params.subscribe(resp=>{
      this.employeeId = resp['employee_id'];
      this._employeeDetails.getEmployeeInfo(resp['employee_id']).subscribe(resp=>{
        this.empDisplayName = resp['result']['display_name'];
        this.employeeInfo.next(resp['result'])
      })
    })
   
  }

}
