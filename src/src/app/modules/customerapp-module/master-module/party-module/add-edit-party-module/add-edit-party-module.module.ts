import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditPartyModuleRoutingModule } from './add-edit-party-module-routing.module';
import { PartyComponent } from './party/party.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { PartyAddressComponent } from './party-address/party-address.component';
import { PartyContactPersonComponent } from './party-contact-person/party-contact-person.component';
import { PartyBalanceBillingComponent } from './party-balance-billing/party-balance-billing.component';
import { PartyNotesAttachmentsComponent } from './party-notes-attachments/party-notes-attachments.component';
import { PartyCertificateComponent } from './party-certificate/party-certificate.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FileDeleteViewModule } from '../../../sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { FileUploaderV2Module } from '../../../sub-main-trip-module/new-trip-v2/file-uploader-v2-module/file-uploader-module.module';
import { PartyAddEditItemsComponent } from './party-add-edit-items/party-add-edit-items.component';
import { PartyDeleteItemComponent } from './party-delete-item/party-delete-item.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {  MatCheckboxModule } from '@angular/material/checkbox';
import { GenericCustomFieldsModule } from '../../../generic-custom-fields/generic-custom-fields.module';


@NgModule({
  declarations: [PartyComponent, PartyAddressComponent, PartyContactPersonComponent, PartyBalanceBillingComponent, PartyNotesAttachmentsComponent, PartyCertificateComponent, PartyAddEditItemsComponent, PartyDeleteItemComponent],
  imports: [
    CommonModule,
    AddEditPartyModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    SharedModule,
    MaterialDropDownModule,
    NgxPermissionsModule.forChild(),
    TaxModuleModule,
    GoThroughModule,
    MatTabsModule,
    FileDeleteViewModule,
    FileUploaderV2Module,
    MatSlideToggleModule,
    MatMomentDateModule,
    MatCheckboxModule,
    GenericCustomFieldsModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],

})
export class AddEditPartyModule{ }
