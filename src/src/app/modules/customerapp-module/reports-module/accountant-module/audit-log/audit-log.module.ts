import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLogRoutingModule } from './audit-log-routing.module';
import { FormsModule } from '@angular/forms';
import { AuditLogComponent } from './audit-log.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter, MatRippleModule } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [AuditLogComponent ],
  imports: [
    CommonModule,
    AuditLogRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatRippleModule,
    ListModuleV2,
    RouterModule
  ],
  providers:[   { provide: DateAdapter, useClass: AppDateAdapter }],
})
export class AuditLogModule { }
