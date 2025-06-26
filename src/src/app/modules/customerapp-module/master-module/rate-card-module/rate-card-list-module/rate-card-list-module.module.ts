import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RateCardListModuleRoutingModule } from './rate-card-list-module-routing.module';
import { RateCardListComponent } from './rate-card-list/rate-card-list.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    RateCardListComponent
  ],
  imports: [
    CommonModule,
    AlertPopupModuleModule,
    ListModuleV2,
    NgxPermissionsModule,
    RateCardListModuleRoutingModule
  ]
})
export class RateCardListModuleModule { }
