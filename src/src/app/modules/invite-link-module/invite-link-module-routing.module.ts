import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InviteLinkComponent } from './invite-link/invite-link.component';

const routes: Routes = [{
  path:'accept/invitation',
  component:InviteLinkComponent
},
{
  path: '',
  redirectTo: 'accept/invitation',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteLinkModuleRoutingModule { }
