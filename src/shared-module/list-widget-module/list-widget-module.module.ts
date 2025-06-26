import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListWidgetComponent } from './list-widget/list-widget.component';
import { FormsModule } from '@angular/forms';
import { ListFilterModulePopupModule } from 'src/app/modules/customerapp-module/list-filter-module-popup-module/list-filter-module-popup-module.module';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    ListWidgetComponent
  ],
  imports: [
    CommonModule,
    ListFilterModulePopupModule,
    FormsModule,
    MatIconModule,
  ],
  exports:[ListWidgetComponent]
})
export class ListWidgetModule { }
