import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationProfileV2DetailsComponent } from './organisation-profile-v2-details/organisation-profile-v2-details.component';
import { CompanyDetailFirstAddComponent } from 'src/app/modules/onboarding-module/company-detail-first-add/company-detail-first-add.component';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path : '',
    canActivate:[UserOnBoardingAuthGaurd],
    component: OrganisationProfileV2DetailsComponent
  },
  {
    path : 'edit/:edit_id',
    component: CompanyDetailFirstAddComponent
  },
  {
    path : 'add/:add_id',
    component: CompanyDetailFirstAddComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganiationProfileV2RoutingModule { }
