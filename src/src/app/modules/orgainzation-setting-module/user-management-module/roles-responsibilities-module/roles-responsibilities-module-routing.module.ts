import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { ListRolesComponent } from './list-roles/list-roles.component';
import { RolesResponsibilitiesComponent } from './roles-responsibilities/roles-responsibilities.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [{
  path:'',
  component:ListRolesComponent,
  canActivate:[NgxPermissionsGuard],
  data: {
    permissions: {
      only: 'super_user',
      redirectTo:'/master/overview'
    }
  },
},
{
  path:'add-role',
  component:RolesResponsibilitiesComponent,
  canActivate:[NgxPermissionsGuard],
  data: {
    permissions: {
      only: 'super_user',
      redirectTo:'/master/overview'
    }
  },
},
{
  path:'edit-role/:id',
  component:RolesResponsibilitiesComponent,
  canActivate:[NgxPermissionsGuard],
  data: {
    permissions: {
      only: 'super_user',
      redirectTo:'/master/overview'
    }
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesResponsibilitiesModuleRoutingModule { }
