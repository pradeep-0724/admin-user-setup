import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateCardAddEditModuleRoutingModule } from './rate-card-add-edit-module-routing.module';
import { RateCardAddEditComponent } from './rate-card-add-edit/rate-card-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonRateCardCraneAwpComponent } from './common-rate-card-crane-awp/common-rate-card-crane-awp.component';
import { CommonRateCardContainerComponent } from './common-rate-card-container/common-rate-card-container.component';


@NgModule({
  declarations: [
    RateCardAddEditComponent,
    CommonRateCardCraneAwpComponent,
    CommonRateCardContainerComponent
  ],
  imports: [
    CommonModule,
    RateCardAddEditModuleRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialDropDownModule,
    AppErrorModuleModule,
    MatMomentDateModule,
    MatCheckboxModule
  ]
})
export class RateCardAddEditModuleModule { }
