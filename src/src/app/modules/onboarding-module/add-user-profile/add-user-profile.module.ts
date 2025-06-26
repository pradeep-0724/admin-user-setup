import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserProfileRoutingModule } from './add-user-profile-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { TaxModuleModule } from 'src/app/tax-module/tax-module.module';
import { AddUserProfileComponent } from './add-user-profile.component';
import { ProfilePicModule } from '../../customerapp-module/profile-pic-module/profile-pic-module.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [AddUserProfileComponent],
  imports: [
    CommonModule,
    AddUserProfileRoutingModule,
    ReactiveFormsModule,
    ProfilePicModule,
    FormsModule,
    MatMomentDateModule,
    MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule,SharedModule,
    MatSelectModule,TaxModuleModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AddUserProfileModule { }
