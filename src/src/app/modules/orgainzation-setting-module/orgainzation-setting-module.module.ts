import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgainzationSettingComponent } from './orgainzation-setting.component';
import { OrgainzationSettingRoutingModule } from './orgainzation-setting-routing.module';
import { OrgainzationSettingSlidebarComponent } from './orgainzation-setting-slidebar/orgainzation-setting-slidebar.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { ScrollingModule, CdkScrollableModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { HeaderFooterModuleModule } from 'src/app/header-footer-module/header-footer-module.module';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GoThroughModule } from '../customerapp-module/go-through/go-through.module';
import { PrivacyPolicyModule } from '../customerapp-module/privacy-policy/privacy-policy.module';
import { UserOnboadingModule } from '../customerapp-module/user-onboading-popup/user-onboading.module';
import { TrilperiodModule } from '../customerapp-module/trail-period-warning/trilperiod.module';


@NgModule({
  declarations: [OrgainzationSettingComponent, OrgainzationSettingSlidebarComponent],
  imports: [
    CommonModule,
    OrgainzationSettingRoutingModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPermissionsModule.forChild(),
    SharedModule,
    ScrollingModule,
    HeaderFooterModuleModule,
    RouterModule,
    PrivacyPolicyModule,
    UserOnboadingModule,
    GoThroughModule,
    TrilperiodModule,
    CdkScrollableModule
  ],
})
export class OrgainzationSettingModuleModule { }
