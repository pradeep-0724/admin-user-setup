import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: TSRouterLinks.sign_up,
    component: SignUpComponent,
  },
  {
    path: '',
    redirectTo: TSRouterLinks.sign_up,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
