import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditNoteCustomFieldComponent } from './credit-note-custom-field/credit-note-custom-field.component';
import { CreditNotePreferencesComponent } from './credit-note-preferences/credit-note-preferences.component';
import { CreditNoteSettingComponent } from './credit-note-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [{
  path:'',
  component:CreditNoteSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:CreditNotePreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:CreditNoteCustomFieldComponent,
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
export class CreditNoteSettingModuleRoutingModule { }
