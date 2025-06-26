import { EmployeeSalaryModuleService } from '../../../../api-services/employee-salary-service/employee-salary-module-service.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-details-employee-salary',
  templateUrl: './details-employee-salary.component.html',
  styleUrls: ['./details-employee-salary.component.scss']
})
export class DetailsEmployeeSalaryComponent implements OnInit,OnDestroy {
  prefixUrl=""
  @Input()employeeSalaryId = new BehaviorSubject('');
  employeeSalaryDetails;
  currency_type;
  employeePermission = Permission.employee_salary.toString().split(',');
  empSalSubscription: Subscription;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  
    constructor(private _prefixUrl: PrefixUrlService,private currency:CurrencyService,private _employeeSalaryService :EmployeeSalaryModuleService) { }
  ngOnDestroy(): void {
    this.empSalSubscription.unsubscribe()
  }

    ngOnInit() {
      this.prefixUrl = this._prefixUrl.getprefixUrl();

       setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
      this.empSalSubscription=this.employeeSalaryId.subscribe(data=>{
        this.getTyreRotationDetails(data)
      })
    }
    openDetails(): void {
      this.routeToDetail=!this.routeToDetail;
      this.openDetailsEmitter.next(this.routeToDetail)
     }
    getTyreRotationDetails(data){
      if(data){
        this._employeeSalaryService.getEmployeeSalaryDetails(data).subscribe((response: any) => {
          this.employeeSalaryDetails=response['result'];
        })
      }
    }
}
