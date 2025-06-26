import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceListModuleRoutingModule } from './maintenance-list-module-routing.module';
import { MaintenanceListComponent } from './maintenance-list.component';
import { AddEditMaintenanceModule } from '../add-edit-maintenance-module/add-edit-maintenance-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxPaginationModule } from 'ngx-pagination';
import { JobCardSearch } from './jobcardSearch.pip';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { JobcardPriority } from './jobcard-priority.pip';
import { ToolTipModule } from '../../../sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';



@NgModule({
  declarations: [
    MaintenanceListComponent,JobCardSearch,JobcardPriority
  ],
  imports: [
    CommonModule,
    AddEditMaintenanceModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatRippleModule,
    ListModuleV2,
    ToolTipModule,
    AlertPopupModuleModule,
    NgxPermissionsModule.forChild(),
    MaintenanceListModuleRoutingModule,
    GoThroughModule,
    MatMomentDateModule,
    MatMenuModule,
    MatIconModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class MaintenanceListModule{ }
