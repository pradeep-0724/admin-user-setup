import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSiteInspectionRoutingModule } from './list-site-inspection-routing.module';
import { ListSiteInspectionComponent } from './list-site-inspection/list-site-inspection.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    ListSiteInspectionComponent
  ],
  imports: [
    CommonModule,
    ListModuleV2,
    AlertPopupModuleModule,
    ListSiteInspectionRoutingModule,
    NgxPermissionsModule.forChild(),

  ]
})
export class ListSiteInspectionModule { }
