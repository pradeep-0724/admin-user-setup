import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationNotificationsComponent } from './organisation-notifications/organisation-notifications.component';

const routes: Routes = [
  {
    path:'',
    component:OrganisationNotificationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisationNotificationsModuleRoutingModule { }
