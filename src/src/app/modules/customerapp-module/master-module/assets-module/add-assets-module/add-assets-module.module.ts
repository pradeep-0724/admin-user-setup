import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddAssetsComponent } from './add-assets/add-assets.component';
import { AssetsAddModuleRoutingModule } from './add-assets-module-routing.module';
import { AssetsDetailsComponent } from './assets-details/assets-details.component';
import { AssetsCertificateComponent } from './assets-certificate/assets-certificate.component';
import { AssetsPermitsComponent } from './assets-permits/assets-permits.component';
import { AssetsAttachmentsComponent } from './assets-attachments/assets-attachments.component';
import { AssetsTyreMasterComponent } from './assets-tyre-master/assets-tyre-master.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { FileUploaderV2Module } from '../../../sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { FileDeleteViewModule } from '../../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { AddPartyPopupModule } from '../../party-module/add-party-popup-module/add-party-popup-module.module';
import { VehicleTyrePositionLayoutModule } from '../../tyre-master-module/vehicle-tyre-position-layout/vehicle-tyre-position-layout.module';
import { AddEditOwnAssetsItemComponent } from './add-edit-own-assets-item/add-edit-own-assets-item.component';
import { DeleteOwnAssetsItemComponent } from './delete-own-assets-item/delete-own-assets-item.component';



@NgModule({
  declarations: [
    AddAssetsComponent,
    AssetsDetailsComponent,
    AssetsCertificateComponent,
    AssetsPermitsComponent,
    AssetsAttachmentsComponent,
    AssetsTyreMasterComponent,
    AddEditOwnAssetsItemComponent,
    DeleteOwnAssetsItemComponent
  ],
  imports: [
    CommonModule,
    AssetsAddModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    AddPartyPopupModule,
    GoThroughModule,
    VideoPlayModule,
    FileDeleteViewModule,
    FileUploaderV2Module,
    MatTabsModule,
    DialogModule,
    VehicleTyrePositionLayoutModule,
    MatRippleModule,
  ]
})
export class AddAssetsModuleModule { }
