import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DebitNoteCustomFieldComponent } from './debit-note-custom-field/debit-note-custom-field.component';
import { DebitNotePreferencesComponent } from './debit-note-preferences/debit-note-preferences.component';
import { DebitNoteSettingComponent } from './debit-note-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [{
  path:'',
  component:DebitNoteSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:DebitNotePreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:DebitNoteCustomFieldComponent,
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
export class DebitNoteSettingModuleRoutingModule { }
