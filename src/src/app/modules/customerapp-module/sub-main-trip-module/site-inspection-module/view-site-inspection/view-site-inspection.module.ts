import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewSiteInspectionRoutingModule } from './view-site-inspection-routing.module';
import { ViewSiteInspectionComponent } from './view-site-inspection/view-site-inspection.component';
import { FileDeleteViewModule } from '../../new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { DateFormaterModule } from '../../../date-formater/date-formater.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [
    ViewSiteInspectionComponent
  ],
  imports: [
    CommonModule,
    ViewSiteInspectionRoutingModule,
    FileDeleteViewModule,
    DateFormaterModule,
    NgxPermissionsModule.forChild(),

  ]
})
export class ViewSiteInspectionModule { }
