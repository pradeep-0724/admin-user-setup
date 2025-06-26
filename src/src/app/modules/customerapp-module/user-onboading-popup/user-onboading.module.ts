import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOnboadingPopupComponent } from './user-onboading-popup.component';
import { CompanyDetailFirstAddModule } from '../../onboarding-module/company-detail-first-add/company-detail-first-add.module';
import { CompanyDetailSecondAddModule } from '../../onboarding-module/company-detail-second-add/company-detail-second-add.module';



@NgModule({
  declarations: [UserOnboadingPopupComponent],
  imports: [
    CommonModule,
    CompanyDetailFirstAddModule,
    CompanyDetailSecondAddModule
  ],
  exports:[UserOnboadingPopupComponent]
})
export class UserOnboadingModule { }
