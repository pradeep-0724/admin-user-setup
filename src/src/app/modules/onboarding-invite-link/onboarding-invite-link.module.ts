import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingInviteLinkRoutingModule } from './onboarding-invite-link-routing.module';
import { OnboardingInviteComponent } from './onboarding-invite/onboarding-invite.component';


@NgModule({
  declarations: [
    OnboardingInviteComponent
  ],
  imports: [
    CommonModule,
    OnboardingInviteLinkRoutingModule
  ]
})
export class OnboardingInviteLinkModule { }
