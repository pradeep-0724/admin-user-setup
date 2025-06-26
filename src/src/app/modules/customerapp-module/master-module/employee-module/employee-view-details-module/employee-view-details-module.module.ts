import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeViewDetailsModuleRoutingModule } from './employee-view-details-module-routing.module';
import { LastWorkingDateDialog, ViewEmployeeComponent } from './view-employee/view-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { EmployeeSharedModuleModule } from '../employee-shared-module/employee-shared-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ListWidgetFilterModule } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-widget-filter/list-widget-filter.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogModule } from '@angular/cdk/dialog';



@NgModule({
  declarations: [
    ViewEmployeeComponent,
    LastWorkingDateDialog,
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    ListWidgetFilterModule,
    EmployeeViewDetailsModuleRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertPopupModuleModule,
    VideoPlayModule,
    EmployeeSharedModuleModule,
    ListModuleV2,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    DialogModule,
    NgxPermissionsModule.forChild(),
  ],
 
})
export class EmployeeViewDetailsModule{ }
