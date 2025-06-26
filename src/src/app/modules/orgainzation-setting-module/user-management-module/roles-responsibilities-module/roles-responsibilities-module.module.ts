import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesResponsibilitiesModuleRoutingModule } from './roles-responsibilities-module-routing.module';
import { RolesResponsibilitiesComponent } from './roles-responsibilities/roles-responsibilities.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [RolesResponsibilitiesComponent, ListRolesComponent],
  imports: [
    CommonModule,
    RolesResponsibilitiesModuleRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ReactiveFormsModule, FormsModule,
    SharedModule,
    MatMomentDateModule,
    NgxPermissionsModule.forChild(),
    MatTooltipModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class RolesResponsibilitiesModuleModule { }
