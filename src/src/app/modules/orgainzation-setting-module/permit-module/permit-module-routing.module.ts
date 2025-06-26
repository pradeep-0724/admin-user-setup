import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  // {
    // path:'',
    // component: PermitListComponent,
    // canActivateChild:[NgxPermissionsGuard],
    // children: [
      {
        path: 'list',
        loadChildren: () => import('./permit-list/permit-list.module').then(m => m.PermitListModule),
        data: {
          permissions: {
            except: 'all',
            redirectTo:'/organization_setting/notifications'
          }
        },
      },
      {
        path: 'add',
        loadChildren: () => import('./add-edit-permit/add-edit-permit.module').then(m => m.AddEditPermitModule),
        data: {
          // permissions: {
          //   except: 'all',
          //   redirectTo:'/organization_setting/notifications'
          // }
        },
      },
      {
        path: 'edit/:permitID',
        loadChildren: () => import('./add-edit-permit/add-edit-permit.module').then(m => m.AddEditPermitModule),
        data: {
          permissions: {
            except: 'all',
            redirectTo:'/organization_setting/notifications'
          }
        },
      },
    // ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermitModuleRoutingModule { }
