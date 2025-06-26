import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemListMasterModuleRoutingModule } from './item-list-master-module-routing.module';
import { ItemListMasterComponent } from './item-list-master/item-list-master.component';
import { FormsModule } from '@angular/forms';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    ItemListMasterComponent
  ],
  imports: [
    CommonModule,
    ItemListMasterModuleRoutingModule,
    FormsModule,
    GoThroughModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    VideoPlayModule,
    ListModuleV2
  ]
})
export class ItemListMasterModuleModule { }
