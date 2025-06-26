import { CompanyTripSettingPreferencesComponent } from './company-trip-setting-preferences/company-trip-setting-preferences.component';
import { CompanyTripSettingComponent } from './company-trip-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyTripSettingCustomFiledsComponent } from './company-trip-setting-custom-fileds/company-trip-setting-custom-fileds.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [{
  path:'',
  component:CompanyTripSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:CompanyTripSettingPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:CompanyTripSettingCustomFiledsComponent,
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
export class CompanyTripModuleRoutingModule { }
