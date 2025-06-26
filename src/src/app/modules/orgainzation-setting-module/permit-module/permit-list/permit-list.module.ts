import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PermitListRoutingModule } from './permit-list-routing.module';
import { PermitListComponent } from './permit-list/permit-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermitLocationsSideBarComponent } from './permit-locations-side-bar/permit-locations-side-bar.component';


@NgModule({
  declarations: [
    PermitListComponent,
    PermitLocationsSideBarComponent
  ],
  imports: [
    CommonModule,
    PermitListRoutingModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FormsModule,
    AlertPopupModuleModule,
    NgxPermissionsModule.forChild(),

  ]
})
export class PermitListModule { }
