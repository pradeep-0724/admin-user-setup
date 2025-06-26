import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceCatagoryRoutingModule } from './maintenance-catagory-routing.module';
import { MaintenanceCatagoryListComponent } from './maintenance-catagory-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { InventoryPopUpComponent } from './inventory-pop-up/inventory-pop-up.component';
import { InventorySpareListSearchPipe } from './inventory-spare-list/inventory-spare-list-search.pipe';
import { InventorySpareListComponent } from './inventory-spare-list/inventory-spare-list.component';
import { InventoryTyreListComponent } from './inventory-tyre-list/inventory-tyre-list.component';
import { InventoryTyreListSearchPipe } from './inventory-tyre-list/inventory-tyre-list-search.pipe';
import { UploadDocumentPopUpComponent } from './upload-document-pop-up/upload-document-pop-up.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CloseJobcardComponent } from './close-jobcard/close-jobcard.component';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FileDeleteViewModule } from '../../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { ServicesPopUpComponent } from './services-pop-up/services-pop-up.component';
import { FileUploaderV2Module } from '../../../sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { StartJobCardComponent } from './start-job-card/start-job-card.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddEditJobCardTyreChangeModule } from '../add-edit-job-card-tyre-change/add-edit-job-card-tyre-change.module';




@NgModule({
  declarations: [
    MaintenanceCatagoryListComponent,
    InventoryPopUpComponent,
    InventorySpareListSearchPipe,
    InventorySpareListComponent,
    InventoryTyreListComponent,
    InventoryTyreListSearchPipe,
    UploadDocumentPopUpComponent,
    CloseJobcardComponent,
    ServicesPopUpComponent,
    StartJobCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AddPartyPopupModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatRadioModule,
    FileDeleteViewModule,
    FileUploaderV2Module,
    NgxPermissionsModule.forChild(),
    MaintenanceCatagoryRoutingModule,
    MatMomentDateModule,
    MatTooltipModule,
    AddEditJobCardTyreChangeModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class MaintenanceCatagoryModule { }
