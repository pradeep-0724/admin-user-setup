import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineBiltyPrefrencesComponent } from './online-bilty-prefrences/online-bilty-prefrences.component';
import { OnlineBiltyCustomFieldComponent } from './online-bilty-custom-field/online-bilty-custom-field.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { OnlineBiltySettingComponent } from './online-bilty-setting.component';

const routes: Routes = [{
  path:'',
  component:OnlineBiltySettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:OnlineBiltyPrefrencesComponent,
      data: {
        permissions: {
          only:'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:OnlineBiltyCustomFieldComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
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
          redirectTo:'/master/overview'
        }
      },
    },]

}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineBiltySettingsRoutingModule { }
