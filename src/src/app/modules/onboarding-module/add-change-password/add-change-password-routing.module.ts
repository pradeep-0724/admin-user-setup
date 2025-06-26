import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddChangePasswordComponent } from './add-change-password.component';

const routes: Routes = [{
  path:'',
  component:AddChangePasswordComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddChangePasswordRoutingModule { }
