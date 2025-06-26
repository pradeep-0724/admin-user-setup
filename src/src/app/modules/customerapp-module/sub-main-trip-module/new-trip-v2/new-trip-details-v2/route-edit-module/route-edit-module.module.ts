import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditRouteComponent } from './edit-route/edit-route.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditMultipleDestinationModule } from '../edit-multiple-destination/multiple-destination.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';



@NgModule({
  declarations: [
    EditRouteComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EditMultipleDestinationModule,
    MaterialDropDownModule
  ],
  exports:[EditRouteComponent]
})
export class RouteEditModule { }
