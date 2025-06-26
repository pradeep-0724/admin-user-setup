import { Component, OnInit } from '@angular/core';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { EmployeeServiceService } from '../../api-services/employee-time-log-service/employee-service.service';
import { EmpTimelogConstants } from '../employeetimelog.constants';
import { filterDuplicates } from '../emptimelog.utils';

@Component({
  selector: 'app-employee-timelog',
  templateUrl: './employee-timelog.component.html',
  styleUrls: ['./employee-timelog.component.scss']
})
export class EmployeeTimelogComponent implements OnInit {

  preFixUrl=getPrefix();
  selectedTab = 'all';
  employeeTimelogData=[];
  employeeAll;
  employeeIn;
  employeeOut;
  search='';
  tabData=[];
  constructor(
  private employeeService:EmployeeServiceService
  ) { }

  ngOnInit(): void {
    
    this.selectedTab='All';
    this.getEmployeeTimelogData('all')

  }
  getEmployeeTimelogData(value){
    this.employeeService.getEmployeeTimelogList().subscribe((data)=>{
      this.employeeTimelogData=data.result[value];
      let empNames =[];
      this.employeeTimelogData.map((ele)=>{
        empNames.push(ele.employee_name)
      });
      let duplicateEmpNames = filterDuplicates(empNames);
      this.employeeTimelogData.map((ele)=>{
        if(duplicateEmpNames.includes(ele.employee_name)){
          ele.color=new EmpTimelogConstants().empColors.empOut;
        }
        else{
          ele.color=new EmpTimelogConstants().empColors.empIn;
        }
      })
      this.tabData=this.employeeTimelogData
      this.employeeAll=data.result.all.length
      this.employeeIn=data.result.in.length
      this.employeeOut=data.result.out.length
  })
  }

  empInandOut(type){
    this.selectedTab=type;
    this.tabData=this.employeeTimelogData.filter((ele)=>{
      if(ele.type===type){
        return ele
      }
    })    
  }

  allTabData(type){
    this.selectedTab=type;
    this.tabData=this.employeeTimelogData;
  }
  
}
