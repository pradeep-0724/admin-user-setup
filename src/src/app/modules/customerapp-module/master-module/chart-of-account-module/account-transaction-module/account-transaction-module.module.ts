import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTransactionModuleRoutingModule } from './account-transaction-module-routing.module';
import { AccountTransactionComponent } from './account-transaction-component/account-transaction.component';
import {  FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddNewCoaModule } from '../add-new-coa-module/add-new-coa-module.module';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'src/app/shared-module/shared.module';


@NgModule({
  declarations: [ AccountTransactionComponent],
  imports: [
    CommonModule,
    AccountTransactionModuleRoutingModule,
    FormsModule,
    AddNewCoaModule,
    SharedModule,
    MatIconModule,
    BsDatepickerModule.forRoot(),
    NgxPermissionsModule.forChild()
  ]
})
export class AccountTransactionModule{ }
