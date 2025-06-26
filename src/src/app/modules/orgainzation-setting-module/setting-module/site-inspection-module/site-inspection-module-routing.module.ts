import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteInspectionSettingsComponent } from './site-inspection-settings/site-inspection-settings.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SiteInspectionPrefrencesComponent } from './site-inspection-prefrences/site-inspection-prefrences.component';
import { SiteInspectionCustomFieldsComponent } from './site-inspection-custom-fields/site-inspection-custom-fields.component';

const routes: Routes = [{
  path:'',
  component:SiteInspectionSettingsComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:SiteInspectionPrefrencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component: SiteInspectionCustomFieldsComponent,
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
export class SiteInspectionModuleRoutingModule { }
