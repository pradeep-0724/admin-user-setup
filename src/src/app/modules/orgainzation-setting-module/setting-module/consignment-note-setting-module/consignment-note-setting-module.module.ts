import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsignmentNoteSettingRoutingModule } from './consignment-note-setting-module-routing.module';
import { ConsignmentNoteCustomFieldComponent } from './consignment-note-custom-field/consignment-note-custom-field.component';
import { ConsignmentNotePreferencesComponent } from './consignment-note-preferences/consignment-note-preferences.component';
import { ConsignmentNoteSettingComponent } from './consignment-note-setting.component';
import { FormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';

@NgModule({
  declarations: [ConsignmentNoteCustomFieldComponent, ConsignmentNotePreferencesComponent,ConsignmentNoteSettingComponent],
  imports: [
    CommonModule,
    ConsignmentNoteSettingRoutingModule,
    OrganizationSharedModeule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    FormsModule,
  ]
})
export class ConsignmentNoteSettingModuleModule { }
