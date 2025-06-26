import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartOfAccountRoutingModule } from './chart-of-account.routing';
import { NgxPermissionsModule } from 'ngx-permissions';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ChartOfAccountRoutingModule,
    NgxPermissionsModule.forChild()

  ],
})
export class ChartOfAccountModule { }
