import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetFilterPipe } from './widget-filter-pipe.pipe';
import { ListWidgetFilterComponent } from './list-widget-filter.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ WidgetFilterPipe,ListWidgetFilterComponent,],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports:[ListWidgetFilterComponent]
})
export class ListWidgetFilterModule { }
