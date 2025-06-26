import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './404-component/page-not-found.component';
import { ServerErrorPageComponent } from './500-component/500-page.component';
import { LogInAuthGaurd } from './core/services/logInauth.guard';
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/client-module/client-module.module').then(m => m.ClientModuleModule),
    canActivate: [LogInAuthGaurd]
   },
    {
      path: '',
      loadChildren: () => import('./modules/login-module/login.module').then(m => m.LoginModule)
    },
    {
      path: '',
      loadChildren: () => import('./modules/invite-link-module/invite-link-module.module').then(m => m.InviteLinkModuleModule)
    },
    {
      path: '',
      loadChildren: () => import('./modules/onboarding-invite-link/onboarding-invite-link.module').then(m => m.OnboardingInviteLinkModule)
    },
    {
      path: '',
      loadChildren: () => import('./modules/sign-up-module/sign-up.module').then(m => m.SignUpModule)
    },
    {
      path: '',
      loadChildren: () => import('./modules/password-module/password-module.module').then(m => m.PasswordModuleModule)
    },
    {
		path: '404',
		component: PageNotFoundComponent
	},
	{
		path: '500',
		component: ServerErrorPageComponent
	},
	{
	  path: '**', redirectTo: getPrefix()+'/overview'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			useHash: Boolean(history.pushState) === false,
		})
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
