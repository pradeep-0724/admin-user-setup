import { RouterModule } from '@angular/router';
import { CustomerappComponent } from './customerapp.component';
import { SharedModule } from './../../shared-module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerappRoutingModule } from './customerapp.router';
import {CdkScrollableModule, ScrollingModule} from '@angular/cdk/scrolling';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HeaderFooterModuleModule } from 'src/app/header-footer-module/header-footer-module.module';
import { PrivacyPolicyModule } from './privacy-policy/privacy-policy.module';
import { SideNavBarComponent } from './side-nav-bar/side-nav-bar.component';
import { OverviewComponent } from './overview/overview.component';
import { UserOnboadingModule } from './user-onboading-popup/user-onboading.module';
import { GoThroughModule } from './go-through/go-through.module';
import { TrilperiodModule } from './trail-period-warning/trilperiod.module';
@NgModule({
  declarations: [
    CustomerappComponent,
    SideNavBarComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    CustomerappRoutingModule,
    SharedModule,
    ScrollingModule,
    HeaderFooterModuleModule,
    RouterModule,
    PrivacyPolicyModule,
    UserOnboadingModule,
    NgxPermissionsModule.forChild(),
    GoThroughModule,
    TrilperiodModule,
    CdkScrollableModule

  ],
})
export class CustomerappModule { }
