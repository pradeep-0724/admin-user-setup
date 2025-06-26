import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingInviteComponent } from './onboarding-invite/onboarding-invite.component';

const routes: Routes = [
  {
    path:'signup',
    component:OnboardingInviteComponent
  },
  {
    path: '',
    redirectTo: 'signup',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingInviteLinkRoutingModule { }
