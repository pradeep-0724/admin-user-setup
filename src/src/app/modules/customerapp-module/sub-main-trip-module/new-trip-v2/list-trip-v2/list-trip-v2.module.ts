import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTripV2RoutingModule } from './list-trip-v2-routing.module';
import { ListTripV2Component } from './list-trip-v2/list-trip-v2.component';
import { ListModuleV2} from '../list-module-v2/list-module-v2.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { TripV2StatusModule } from '../trip-v2-status/trip-v2-status.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { OfficeStatusPipe } from './office-status.pipe';
import { LiveTrackingModule } from '../new-trip-details-v2/live-tracking/live-tracking-module.module';
import { DriverStatusPipe } from './driver-status.pipe';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ToolTipModule } from '../tool-tip/tool-tip.module';
import { ListTripV2UassignedVehiclesPopupComponent } from './list-trip-v2-uassigned-vehicles-popup/list-trip-v2-uassigned-vehicles-popup.component';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    ListTripV2Component,
    OfficeStatusPipe,
    DriverStatusPipe,
    ListTripV2UassignedVehiclesPopupComponent
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    NgxPermissionsModule,
    ListTripV2RoutingModule,
    ListModuleV2,
    RouterModule,
    TripV2StatusModule,
    LiveTrackingModule,
    AlertPopupModuleModule,
    ToolTipModule,
    MatTooltipModule
  ]
})
export class ListTripV2Module { }
