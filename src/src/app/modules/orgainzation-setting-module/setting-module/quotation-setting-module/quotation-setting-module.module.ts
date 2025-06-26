import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrefrencesComponent } from './prefrences/prefrences.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { QuotationSettingComponent } from './quotation-setting.component';
import { QuotationSettingRoutingModule } from './quotation-setting-module-routing.module';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { CustomFieldV2Module } from '../custom-field-v2/custom-field-v2.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApprovalComponent } from './approval/approval.component';
import { ValidationComponent } from './validation/validation.component';
import { AddEditValidationModule } from '../../../customerapp-module/add-edit-validation-module/add-edit-validation-module.module';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { UserManagementService } from '../../../customerapp-module/api-services/orgainzation-setting-module-services/user-management-service/user-management-service.service';
import { MaterialDropDownModule } from '../../../customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';


@NgModule({
  declarations: [PrefrencesComponent, CustomFieldComponent, QuotationSettingComponent, ApprovalComponent, ValidationComponent],
  imports: [
    AddEditValidationModule,
    QuotationSettingRoutingModule,
    CommonModule,
    CustomFieldV2Module,
    OrganizationSharedModeule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    MaterialDropDownModule,
    DeleteAlertModule
  ],
  providers:[UserManagementService]

})
export class QuotationSettingModuleModule { }
