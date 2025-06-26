import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementModuleRoutingModule } from './user-management-module-routing.module';
import { UserManagementComponent } from './user-management/user-management.component';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [UserManagementComponent],
  imports: [
    CommonModule,
    UserManagementModuleRoutingModule,
    NgxPermissionsModule.forChild()

  ]
})
export class UserManagementModuleModule { }
