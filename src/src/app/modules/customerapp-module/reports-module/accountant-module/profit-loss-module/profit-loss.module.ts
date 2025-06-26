import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfitLossRoutingModule } from './profit-loss-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProfitLossComponent } from './profit-loss.component';


@NgModule({
  declarations: [ProfitLossComponent],
  imports: [
    CommonModule,
    ProfitLossRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
  ]
})
export class ProfitLossModule { }
