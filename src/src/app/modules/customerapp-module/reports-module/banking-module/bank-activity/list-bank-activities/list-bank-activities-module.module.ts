import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListBankActivitiesModuleRoutingModule } from './list-bank-activities-module-routing.module';
import { BankActivitySearchPipe } from './bank-activity-search-pipe';
import { ListBankActivitiesComponent } from './list-bank-activities.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ListModuleV2 } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [ ListBankActivitiesComponent,BankActivitySearchPipe],
  imports: [
    CommonModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    ListModuleV2,
    ListBankActivitiesModuleRoutingModule
  ]
})
export class ListBankActivitiesModule{ }
