import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgingReportBosModuleRoutingModule } from './aging-report-bos-module-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { AgingReportBosComponent } from './aging-report-bos.component';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [AgingReportBosComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ListModuleV2,
    AgingReportBosModuleRoutingModule
  ]
})
export class AgingReportBosModule { }
