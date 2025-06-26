import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path: TSRouterLinks.login,
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: TSRouterLinks.login,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
