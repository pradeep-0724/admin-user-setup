import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListWidgetComponent } from './list-widget/list-widget.component';
import {MatSelectModule} from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import { ToggleSwitchComponent } from './toggle-switch/toggle-switch.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RouterModule } from '@angular/router';
import { ListWidgetFilterModule } from './list-widget-filter/list-widget-filter.module';
import { ListViewSettingsModule } from './list-widget-list-view-settings/list-view-settings.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DateDropDownModule } from './date-drop-down-module/date-drop-down-module.module';
import { IsItemHeaderValidPipe } from './table-head-comparison.pipe';



@NgModule({
  declarations: [
    ListWidgetComponent,
    ToggleSwitchComponent,
    IsItemHeaderValidPipe
  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatDatepickerModule,
    MatIconModule,
    MatNativeDateModule,
    RouterModule,
    ListWidgetFilterModule,
    ListViewSettingsModule,
    NgxPermissionsModule.forChild(),
    MatSelectModule,
    MatMomentDateModule,
    DateDropDownModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[ListWidgetComponent,IsItemHeaderValidPipe]
})
export class ListModuleV2 { }
