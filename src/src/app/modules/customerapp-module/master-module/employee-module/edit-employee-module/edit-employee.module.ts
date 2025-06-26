import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
 import { SharedModule } from 'src/app/shared-module/shared.module';
import { CommonService } from 'src/app/core/services/common.service';
import { EditEmployeeRoutingModule } from './edit-employee-routing';
import { EditEmployeeComponent } from './edit-employee.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import { EditEmployeeService } from './edit-employee-services/edit-employee-service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { EmployeeService } from '../../../api-services/master-module-services/employee-service/employee-service';
import { EmployeeSharedModuleModule } from '../employee-shared-module/employee-shared-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { ProfilePicModule } from '../../../profile-pic-module/profile-pic-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    EditEmployeeComponent,
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    EditEmployeeRoutingModule,
    MatSelectModule,
    ProfilePicModule,
    VideoPlayModule,
    MatMomentDateModule,
    EmployeeSharedModuleModule
  ],
  exports: [
    EditEmployeeRoutingModule,
  ],
  providers: [EditEmployeeService, CommonService, EmployeeService, LocationsService,{ provide: DateAdapter, useClass: AppDateAdapter }]
})
export class EditEmployeeModule { }
