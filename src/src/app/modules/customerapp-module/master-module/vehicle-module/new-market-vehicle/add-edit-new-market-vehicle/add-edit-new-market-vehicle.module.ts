import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditNewMarketVehicleRoutingModule } from './add-edit-new-market-vehicle-routing.module';
import { AddEditNewMarketVehicleComponent } from './add-edit-new-market-vehicle/add-edit-new-market-vehicle.component';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { NewMarketVehicleDocumentsComponent } from './new-market-vehicle-documents/new-market-vehicle-documents.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FileDeleteViewModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { FileUploaderV2Module } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AddEditDocumntPopupComponent } from '../add-edit-documnt-popup/add-edit-documnt-popup.component';
import { AddPartyPopupModule } from '../../../party-module/add-party-popup-module/add-party-popup-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    AddEditNewMarketVehicleComponent,
    NewMarketVehicleDocumentsComponent,
    AddEditDocumntPopupComponent
  ],
  imports: [
    CommonModule,
    AddPartyPopupModule,
    AppErrorModuleModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    FileDeleteViewModule,
    FileUploaderV2Module,
    AlertPopupModuleModule,
    AddEditNewMarketVehicleRoutingModule,
    MatRippleModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class AddEditNewMarketVehicleModule { }
