import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankingRoutingModule } from './banking-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BankingRoutingModule,
    NgxPermissionsModule.forChild()

  ]
})
export class BankingModule { }
