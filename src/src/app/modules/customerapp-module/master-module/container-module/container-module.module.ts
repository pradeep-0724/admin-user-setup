import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainerModuleRoutingModule } from './container-module-routing.module';
import { ContainerListComponent } from './container-list/container-list.component';
import { ContainerAddEditPopupComponent } from './container-add-edit-popup/container-add-edit-popup.component';
import { ContainerViewComponent } from './container-view/container-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AssetsListModuleRoutingModule } from '../assets-module/list-assets-module/list-assets-module-routing.module';
import { GoThroughModule } from '../../go-through/go-through.module';
import { VideoPlayModule } from '../../video-play-module/video-play-module.module';
import { ListModuleV2 } from '../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    ContainerListComponent,
    ContainerAddEditPopupComponent,
    ContainerViewComponent
  ],
  imports: [
    CommonModule,
    ContainerModuleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    AssetsListModuleRoutingModule,
    GoThroughModule,
    VideoPlayModule,
    ListModuleV2,
    NgxPermissionsModule.forChild()

  ]
})
export class ContainerModuleModule { }
