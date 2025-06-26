import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrialBalanceRoutingModule } from './trial-balance-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { MainTreeComponent } from '../tree/tree.component';
import { TreeComponent } from './tree/tree.component';
import { TrialBalanceComponent } from './trial-balance.component';


@NgModule({
  declarations: [  TrialBalanceComponent,TreeComponent,MainTreeComponent],
  imports: [
    CommonModule,
    TrialBalanceRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
  ]
})
export class TrialBalanceModule { }
