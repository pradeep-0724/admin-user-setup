import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyListModuleRoutingModule } from './party-list-module-routing.module';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { PartyListComponent } from './party-list/party-list.component';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { PartyListSearchFilterPipe } from './party-list-search.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ListFilterModulePopupModule } from '../../../list-filter-module-popup-module/list-filter-module-popup-module.module';
import { FormsModule } from '@angular/forms';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [PartyListComponent,PartyListSearchFilterPipe],
  imports: [
    CommonModule,
    MatNativeDateModule,
    FormsModule,
    ListModuleV2,
    GoThroughModule,
    NgxPaginationModule,
    AlertPopupModuleModule,
    VideoPlayModule,
    PartyListModuleRoutingModule,
    ListFilterModulePopupModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class PartyListModule{ }
