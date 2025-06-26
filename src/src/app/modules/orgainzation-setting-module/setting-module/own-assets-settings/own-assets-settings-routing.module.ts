import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnAssetSettingsComponent } from './own-asset-settings.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AssetPermitAddEditComponent } from './asset-permit-add-edit/asset-permit-add-edit.component';
import { AssetPermitListComponent } from './asset-permit-list/asset-permit-list.component';

const routes: Routes =  [{
  path:'',
  component:OwnAssetSettingsComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'permit/list',
      component:AssetPermitListComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/overview'
        }
      },
    },
    {
      path: '',
      redirectTo:'permit/list',
      pathMatch: 'full',
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/overview'
        }
      },
    },]

},
{
  path:'permit/add',
  component:AssetPermitAddEditComponent,
  data: {
    permissions: {
      only: 'super_user',
      redirectTo:'/overview'
    }
  },
},
{
  path:'permit/edit/:permitId',
  component:AssetPermitAddEditComponent,
  data: {
    permissions: {
      only: 'super_user',
      redirectTo:'/master/overview'
    }
  },
},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnAssetsSettingsRoutingModule { }
