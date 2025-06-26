import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { PettyExpenseService } from '../petty-expense.service';
import { normalDate } from 'src/app/shared-module/utilities/date-utilis';

@Component({
  selector: 'app-details-petty-expense',
  templateUrl: './details-petty-expense.component.html',
  styleUrls: ['./details-petty-expense.component.scss']
})
export class DetailsPettyExpenseComponent implements OnInit,OnDestroy {
  expenseData: any;
  itemExpensesData: any;
  currency_type;
  prefixUrl: string;
  pettyPermissin =Permission.petty_expense.toString().split(',');
  expenseSubscription: Subscription;
  @Input() routeToDetail: boolean = false;
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  @Input()expenseId :BehaviorSubject<string>


  constructor(private _pettyExpenseService:PettyExpenseService,private currency:CurrencyService,
    private _prefixUrl:PrefixUrlService) { }

  ngOnInit() {
     setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
   this.getExpenseDetails()
  }
  openDetails(): void {
    this.routeToDetail=!this.routeToDetail;
    this.openDetailsEmitter.next(this.routeToDetail)
   }

  /* To get the details of the expense */
  getExpenseDetails(){
    this.expenseSubscription=this.expenseId.subscribe((id)=>{
      this._pettyExpenseService.getPettyExpenseDetail(id).subscribe((response)=>{
        this.expenseData=response.result;  
        this.itemExpensesData=response.result.expense_item;
      })
    })

  }
  ngOnDestroy(): void {
    this.expenseSubscription.unsubscribe()
  }

  changeDatetoNormalFormat(date){
    if(date){
    return normalDate(date)
    }else{
      return '-'
    }
  }

}
