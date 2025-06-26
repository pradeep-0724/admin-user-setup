import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPartyPopupComponent } from './add-party-popup/add-party-popup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { MaterialDropDownModule } from '../../../material-drop-down-module/material-drop-down-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';



@NgModule({
  declarations: [AddPartyPopupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    MaterialDropDownModule,
    AlertPopupModuleModule,
    AppErrorModuleModule,
    TaxModuleModule,
    MatMomentDateModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
  exports:[AddPartyPopupComponent]
})
export class AddPartyPopupModule{ }
