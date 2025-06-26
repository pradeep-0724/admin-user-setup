import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewAddCompanyComponent } from './new-add-company.component';

const routes: Routes = [{
  path:'',
  component:NewAddCompanyComponent,
  children: [
   {
    path:'user-details/:id',
    loadChildren:() => import('./add-user-profile/add-user-profile.module').then(m=>m.AddUserProfileModule)
   },
   {
    path:'change-password/:id',
    loadChildren:() =>import('./add-change-password/add-change-password.module').then(m=>m.AddChangePasswordModule)
   },
   {
    path:'',
    redirectTo:'company-details',
    pathMatch:'full'
   }
]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyModuleAddRoutingModule { }
