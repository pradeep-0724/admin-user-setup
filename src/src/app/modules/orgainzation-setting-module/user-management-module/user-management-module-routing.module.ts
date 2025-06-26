import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
const routes: Routes = [
  {
  path:'',
  component:UserManagementComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[{
    path:'users',
    loadChildren:() => import('./user-module/user-module.module').then(m => m.UserModuleModule),
    data: {
      permissions: {
        only: 'super_user',
        redirectTo:'/master/overview'
      }
    },

  },
  {
    path:'user-roles-responsibilities',
    loadChildren:() => import('./roles-responsibilities-module/roles-responsibilities-module.module').then(m => m.RolesResponsibilitiesModuleModule),
    data: {
      permissions: {
        only: 'super_user',
        redirectTo:'/master/overview'
      }
    },

  },
  {
    path:'',
    redirectTo:'users',
    pathMatch: 'full',
    data: {
      permissions: {
        only: 'super_user',
        redirectTo:'/master/overview'
      }
    },

  }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementModuleRoutingModule { }
