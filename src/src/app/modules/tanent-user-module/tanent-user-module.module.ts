import { NgxPermissionsModule } from 'ngx-permissions';
import { MatMenuModule } from '@angular/material/menu';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TanentUserModuleRoutingModule } from './tanent-user-module-routing.module';
import { TanentUserComponentComponent } from './tanent-user-component/tanent-user-component.component';
import { TanentUserComponent } from './tanent-user.component';
import { SharedModule } from 'src/app/shared-module/shared.module';

@NgModule({
  declarations: [TanentUserComponentComponent, TanentUserComponent],
  imports: [
    CommonModule,
    TanentUserModuleRoutingModule,
    SharedModule,
    MatMenuModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class TanentUserModuleModule { }
