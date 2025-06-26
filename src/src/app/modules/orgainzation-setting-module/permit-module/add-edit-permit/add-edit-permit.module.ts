import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddEditPermitRoutingModule } from './add-edit-permit-routing.module';
import { AddEditPermitComponent } from './add-edit-permit/add-edit-permit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    AddEditPermitComponent
  ],
  imports: [
    CommonModule,
    AddEditPermitRoutingModule,
    ReactiveFormsModule,
    MatRadioModule,
    FormsModule,
    AppErrorModuleModule,
    MatCheckboxModule,
    AlertPopupModuleModule,
    MaterialDropDownModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTooltipModule,
    GoogleMapsModule,
    MatRippleModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class AddEditPermitModule { }
