import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountantRoutingModule } from './accountant.routing';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    AccountantRoutingModule,
    NgxPermissionsModule.forChild()
  ]
})
export class AccountantModule { }
