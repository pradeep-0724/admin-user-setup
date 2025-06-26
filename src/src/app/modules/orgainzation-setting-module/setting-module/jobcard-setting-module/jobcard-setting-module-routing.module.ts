import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JobCardCustomFieldComponent } from './jobcard-custom-field/jobcard-custom-field.component';
import { JobCardPreferencesComponent } from './jobcard-preferences/jobcard-preferences.component';
import { JobCardSettingComponent } from './jobcard-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [{
  path:'',
  component:JobCardSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:JobCardPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:JobCardCustomFieldComponent,
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
    },
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobCardSettingModuleRoutingModule { }
