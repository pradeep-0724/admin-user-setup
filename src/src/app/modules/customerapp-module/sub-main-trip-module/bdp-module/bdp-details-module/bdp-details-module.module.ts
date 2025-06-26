import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BdpDetailsModuleRoutingModule } from './bdp-details-module-routing.module';
import { BdpDetailsComponent } from './bdp-details/bdp-details.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { BdpAddNewTripComponent } from './bdp-add-new-trip/bdp-add-new-trip.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { TripV2StatusModule } from '../../new-trip-v2/trip-v2-status/trip-v2-status.module';


@NgModule({
  declarations: [
    BdpDetailsComponent,
    BdpAddNewTripComponent
  ],
  imports: [
    CommonModule,
    BdpDetailsModuleRoutingModule,
    MatTabsModule,
    DialogModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    AddPartyPopupModule,
    TripV2StatusModule
  ]
})
export class BdpDetailsModuleModule { }
