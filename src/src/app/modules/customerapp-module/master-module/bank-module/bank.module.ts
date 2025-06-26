import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankRoutingModule } from './bank.route';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    BankRoutingModule,
    NgxPermissionsModule.forChild()

  ]
})
export class BankModule { }
