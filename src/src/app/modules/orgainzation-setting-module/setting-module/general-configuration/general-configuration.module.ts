import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralConfigurationComponent } from './general-configuration/general-configuration.component';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolTipModule } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { DialogModule } from '@angular/cdk/dialog';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';



@NgModule({
  declarations: [
    GeneralConfigurationComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    AppErrorModuleModule,
    MatCheckboxModule,
    MatRadioModule,
    SharedModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    ToolTipModule,
    MaterialDropDownModule,
    OrganizationSharedModeule,
  ],
  exports : [GeneralConfigurationComponent],
})
export class GeneralConfigurationModule { }
