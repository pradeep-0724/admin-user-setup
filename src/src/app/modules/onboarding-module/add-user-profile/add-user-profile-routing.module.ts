import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUserProfileComponent } from './add-user-profile.component';

const routes: Routes = [{
  path:'',
  component:AddUserProfileComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddUserProfileRoutingModule { }
