import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BalanceSheetRoutingModule } from './balance-sheet-routing.module';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { BalanceSheetComponent } from './balance-sheet.component';


@NgModule({
  declarations: [ BalanceSheetComponent,],
  imports: [
    CommonModule,
    BalanceSheetRoutingModule,
    FormsModule,
    BsDatepickerModule.forRoot(),
    NgxPaginationModule,
  ]
})
export class BalanceSheetModule { }
