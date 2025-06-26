import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankListModuleRoutingModule } from './bank-list-module-routing.module';
import { BankListFilterPipe } from './bank-list-search.pipe';
import { BankListComponent } from './bank-list/bank-list.component';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ListFilterModulePopupModule } from '../../../list-filter-module-popup-module/list-filter-module-popup-module.module';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [BankListComponent, BankListFilterPipe],
  imports: [
    CommonModule,
    ListModuleV2,
    FormsModule,
    MatSortModule,
    GoThroughModule,
    ListFilterModulePopupModule,
    AlertPopupModuleModule,
    NgxPaginationModule,
    VideoPlayModule,
    BankListModuleRoutingModule,
    NgxPermissionsModule.forChild()

  ]
})
export class BankListModule { }
