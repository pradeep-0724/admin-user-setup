import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankactivityComponentComponent } from './bankactivity-component.component';
import { BankactivityCustomFieldComponent } from './bankactivity-custom-field/bankactivity-custom-field.component';
import { BankactivityPrefrencesComponent } from './bankactivity-prefrences/bankactivity-prefrences.component';
import { NgxPermissionsGuard } from 'ngx-permissions';



const routes: Routes = [{
  path:'',
  component:BankactivityComponentComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:BankactivityPrefrencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:BankactivityCustomFieldComponent,
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
export class BankActivitySettingModuleRoutingModule { }
