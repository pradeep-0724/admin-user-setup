import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { EmailRedirectComponent } from './email-redirect/email-redirect.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

const routes: Routes = [
  {
    path: TSRouterLinks.change_password,
    component: ChangePasswordComponent,
  },
  {
    path: TSRouterLinks.reset,
    component: EmailRedirectComponent,
  },
  {
    path: TSRouterLinks.reset_password,
    component: ForgetPasswordComponent,
  },
  {
    path: '',
    redirectTo: TSRouterLinks.change_password,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordModuleRoutingModule { }
