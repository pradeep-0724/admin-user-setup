import { WorkOrderSettingApprovalComponent } from './work-order-setting-approval/work-order-setting-approval.component';
import { WorkOrderSettingCustomFieldsComponent } from './work-order-setting-custom-fields/work-order-setting-custom-fields.component';
import { WorkOrderSettingPreferencesComponent } from './work-order-setting-preferences/work-order-setting-preferences.component';
import { WorkOrderSettingValidationsComponent } from './work-order-setting-validations/work-order-setting-validations.component';
import { WorkOrderSettingComponent } from './work-order-setting.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [{
  path:'',
  component:WorkOrderSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:WorkOrderSettingPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'validation',
      component:WorkOrderSettingValidationsComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'approval',
      component:WorkOrderSettingApprovalComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component: WorkOrderSettingCustomFieldsComponent,
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
export class WorkOrderSettingModuleRoutingModule { }
