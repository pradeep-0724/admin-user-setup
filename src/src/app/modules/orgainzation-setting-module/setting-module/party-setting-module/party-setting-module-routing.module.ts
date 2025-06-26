import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartySettingComponent } from './party-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PrefrenceComponent } from './prefrence/prefrence.component';
import { PartySettingsCustomFieldComponent } from './party-settings-custom-field/party-settings-custom-field.component';

const routes: Routes =  [{
  path:'',
  component:PartySettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:PrefrenceComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:PartySettingsCustomFieldComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/overview'
        }
      },
    },
    {
      path: '',
      redirectTo:'prefrence',
      pathMatch: 'full',
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/overview'
        }
      },
    },]

}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartySettingModuleRoutingModule { }
