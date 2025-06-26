import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverAllVehicleDocumentRoutingModule } from './over-all-vehicle-document-routing.module';
import { OverAllVehicleDocumentComponent } from './over-all-vehicle-document/over-all-vehicle-document.component';
import { VehicleSharedModuleModule } from '../../../master-module/vehicle-module/vehicle-shared-module/vehicle-shared-module.module';
import { AddVehicleDocumentPopupComponent } from './add-vehicle-document-popup/add-vehicle-document-popup.component';
import { AddVehicleNewDocumentPopupComponent } from './add-vehicle-new-document-popup/add-vehicle-new-document-popup.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FileUploaderModule } from '../../../file-uploader-module/file-uploader-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { FileUploaderV2Module } from '../../../sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    OverAllVehicleDocumentComponent,
    AddVehicleDocumentPopupComponent,
    AddVehicleNewDocumentPopupComponent,
    
  ],
  imports: [
    CommonModule,
    FileUploaderV2Module,
    FileDeleteViewModule,
    ReactiveFormsModule,
    AppErrorModuleModule,
    MaterialDropDownModule,
    FileUploaderModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ListModuleV2,
    MatMomentDateModule,
    VehicleSharedModuleModule,
    OverAllVehicleDocumentRoutingModule,
    SharedModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class OverAllVehicleDocumentModule { }
