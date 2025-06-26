import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ListWidgetListViewSettingsComponent } from './list-widget-list-view-settings.component';



@NgModule({
  declarations: [ListWidgetListViewSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    DragDropModule,
  ],
  exports:[ListWidgetListViewSettingsComponent]
})
export class ListViewSettingsModule { }
