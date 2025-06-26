import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';
import { OtherActivityComponent } from './other-activity.component';

const routes: Routes = [
  {
		path: 'add',
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
		component: OtherActivityComponent,
    data: {
      permissions: {
        only: Permission.others.toString().split(',')[0],
      }
    },
	},
	{
		path: 'edit/:other_activity_id',
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
		component: OtherActivityComponent,
    data: {
      permissions: {
        only: Permission.others.toString().split(',')[1],
      }
    },
	},
  {
    path:'list',
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: Permission.others.toString().split(',')[3],
      }
    },
    loadChildren:()=>import('./list-other-activity/list-other-activity.module').then(m=>m.ListOtherActivityModule)
  }
];

@NgModule({
	imports: [
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class EditOtherActivityRoutingModule {}
