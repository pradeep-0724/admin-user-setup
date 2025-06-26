import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAssetsComponent } from './list-assets/list-assets.component';
import { AssetsListModuleRoutingModule } from './list-assets-module-routing.module';
import { FormsModule } from '@angular/forms';
import { GoThroughModule } from '../../../go-through/go-through.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { VideoPlayModule } from '../../../video-play-module/video-play-module.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';



@NgModule({
  declarations: [
    ListAssetsComponent
  ],
  imports: [
    CommonModule,
    AssetsListModuleRoutingModule,
    FormsModule,
    GoThroughModule,
    SharedModule,
    NgxPermissionsModule.forChild(),
    VideoPlayModule,
    ListModuleV2
  ]
})
export class ListAssetsModuleModule { }
