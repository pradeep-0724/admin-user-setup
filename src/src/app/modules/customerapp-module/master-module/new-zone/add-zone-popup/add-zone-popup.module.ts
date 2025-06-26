import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddZoneComponent } from './add-zone/add-zone.component';
import { ZoneListComponent } from './zone-list/zone-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ZoneRoutingModule } from './zone-routing.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';

@NgModule({
  declarations: [
    AddZoneComponent,
    ZoneListComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTooltipModule,
    CommonModule,
    AppErrorModuleModule,
    ZoneRoutingModule,
    ListModuleV2,
    GoogleMapsModule,
    GoThroughModule,
    AlertPopupModuleModule,
    NgxPermissionsModule.forChild(),
    MatTooltipModule,
    MaterialDropDownModule
  ]
})
export class AddZonePopupModule { }
