import { InviteLinkComponent } from './invite-link/invite-link.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InviteLinkModuleRoutingModule } from './invite-link-module-routing.module';

@NgModule({
  declarations: [InviteLinkComponent],
  imports: [
    CommonModule,
    InviteLinkModuleRoutingModule,
    FormsModule
  ]
})
export class InviteLinkModuleModule { }
