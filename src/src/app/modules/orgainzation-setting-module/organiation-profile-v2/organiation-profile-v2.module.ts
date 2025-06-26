import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganiationProfileV2RoutingModule } from './organiation-profile-v2-routing.module';
import { OrganisationProfileHeaderV2Component } from './organisation-profile-header-v2/organisation-profile-header-v2.component';
import { OrganisationProfileV2InfoComponent } from './organisation-profile-v2-info/organisation-profile-v2-info.component';
import { OrganisationProfileV2DetailsComponent } from './organisation-profile-v2-details/organisation-profile-v2-details.component';
import { TableWidgetModule } from '../../customerapp-module/master-module/vehicle-module/own-venicle-module/vehicle-details-v2/table-widget-module/table-widget-module.module';
import { EmployeeSharedModuleModule } from '../../customerapp-module/master-module/employee-module/employee-shared-module/employee-shared-module.module';
import { FileDeleteViewModule } from '../../customerapp-module/sub-main-trip-module/new-trip-v2/new-trip-details-v2/file-delete-view-module/file-delete-view-module.module';
import { ViewUploadedDocumentModule } from './view-uploaded-document/view-uploaded-document.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ProfileCertificateHistoryComponent } from './profile-certificate-history/profile-certificate-history.component';


@NgModule({
  declarations: [
    OrganisationProfileHeaderV2Component,
    OrganisationProfileV2InfoComponent,
    OrganisationProfileV2DetailsComponent,
    ProfileCertificateHistoryComponent
  ],
  imports: [
    CommonModule,
    EmployeeSharedModuleModule,
    TableWidgetModule,
    FileDeleteViewModule,
    ViewUploadedDocumentModule,
    ViewUploadedDocumentModule,
    NgxPermissionsModule.forChild(),
    OrganiationProfileV2RoutingModule
  ]
})
export class OrganiationProfileV2Module { }
