import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { OperationsActivityService } from '../../../../api-services/operation-module-service/operations-activity.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';

@Component({
  selector: 'app-details-employee-others',
  templateUrl: './details-employee-others.component.html',
  styleUrls: ['./details-employee-others.component.scss']
})
export class DetailsEmployeeOthersComponent implements OnInit,OnDestroy {

  @Input() 'expenseId':BehaviorSubject<String>;
  expenseData: any =[];
  preFixUrl:string=""
  currency_type;
  empSubscription: Subscription;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  employeeExpensePermission = Permission.employeeOthers.toString().split(',');

  constructor(private _operationActivityService:OperationsActivityService,private  _preFixUrl:PrefixUrlService, private currency:CurrencyService) { }
  ngOnDestroy(): void {
    this.empSubscription.unsubscribe()
  }
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  ngOnInit() {
    this.preFixUrl = this._preFixUrl.getprefixUrl();
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.empSubscription=this.expenseId.subscribe(data=>{
      if(data){
        this.getFormValues(data)
      }
    })
  }

  getFormValues(id){
    this._operationActivityService.getEmployeeOthersDetails(id).subscribe((response)=>{
      this.expenseData=response['result'];      
    })
  }

  changeDatetoNormalFormat(date){
    if(date){
      return normalDate(date)
    }else{
      return '-'
    }
  }
}
