import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgainzationSettingComponent } from './orgainzation-setting.component';
import { TSRouterLinks } from '../../core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [{
  path:'',
  component: OrgainzationSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children: [
    {
      path: TSRouterLinks.profile,
      loadChildren: () => import('./organiation-profile-v2/organiation-profile-v2.module').then(m => m.OrganiationProfileV2Module),
      data: {
        permissions: {
          except: 'all',
          redirectTo:'/organization_setting/notifications'
        }
      },
    },
    {
      path: TSRouterLinks.user_management,
      loadChildren: () => import('./user-management-module/user-management-module.module').then(m => m.UserManagementModuleModule),
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/organization_setting/notifications'
        }
      },
    },
    {
      path: TSRouterLinks.driver_app_access_management,
      loadChildren: () => import('./driver-app-access-module/driver-app-access-module.module').then(m => m.DriverAppAccessModule),
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/organization_setting/notifications'
        }
      },
    },
    {
      path: TSRouterLinks.notifications,
      loadChildren: () => import('./organisation-notifications-module/organisation-notifications-module.module').then(m => m.OrganisationNotificationsModuleModule),
      data: {
        permissions: {
          except: 'allUser',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path: 'permit',
      loadChildren: () => import('./permit-module/permit-module.module').then(m => m.PermitModuleModule),
      data: {
        permissions: {
          except: 'allUser',
          redirectTo:'profile'
        }
      },
    },
    {
      path: '',
      redirectTo: 'profile',
      pathMatch: 'full',
    },
    {
      path:'settings',
      loadChildren: () => import('./setting-module/setting-module.module').then(m => m.SettingModuleModule),
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/organization_setting/notifications'
        }
      },
    },
    {
      path:'security',
      loadChildren: () => import('../password-module/password-module.module').then(m => m.PasswordModuleModule),
      data: {
        permissions: {
          except: 'allUser',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'signature',
      loadChildren: () => import('./digital-signature-module/digital-signature-module.module').then(m => m.DigitalSignatureModule),
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/organization_setting/notifications'
        }
      },
    },
  ]
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgainzationSettingRoutingModule { }
