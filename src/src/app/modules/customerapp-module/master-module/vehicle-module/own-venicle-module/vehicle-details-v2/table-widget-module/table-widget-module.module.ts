import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableWidgetComponent } from './table-widget/table-widget.component';
import { FormsModule } from '@angular/forms';
import { DateDropDownModule } from '../date-drop-down-module/date-drop-down-module.module';
import { ListWidgetFilterModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-widget-filter/list-widget-filter.module';
import { ListViewSettingsModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-widget-list-view-settings/list-view-settings.module';



@NgModule({
  declarations: [
    TableWidgetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DateDropDownModule,
    ListWidgetFilterModule,
    ListViewSettingsModule
  ],
  exports:[TableWidgetComponent]
})
export class TableWidgetModule { }
