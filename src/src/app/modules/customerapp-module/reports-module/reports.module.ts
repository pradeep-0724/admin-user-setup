import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportBaseComponent } from './reports-base.component';
import { ReportRoutingModule } from './reports.routing';
import { NgxPermissionsModule } from 'ngx-permissions';
@NgModule({
  declarations: [
    ReportBaseComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    NgxPermissionsModule.forChild()

  ],
  providers: [],
  exports: [

  ]
})
export class ReportsModule { }
