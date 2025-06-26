import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnAssetsSettingsRoutingModule } from './own-assets-settings-routing.module';
import { AssetPermitListComponent } from './asset-permit-list/asset-permit-list.component';
import { AssetPermitAddEditComponent } from './asset-permit-add-edit/asset-permit-add-edit.component';
import { OwnAssetSettingsComponent } from './own-asset-settings.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';


@NgModule({
  declarations: [
    AssetPermitListComponent,
    AssetPermitAddEditComponent,
    OwnAssetSettingsComponent
  ],
  imports: [
    CommonModule,
    OwnAssetsSettingsRoutingModule,
    AlertPopupModuleModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    AppErrorModuleModule,
    MatCheckboxModule,
    MaterialDropDownModule,

  ]
})
export class OwnAssetsSettingsModule { }
