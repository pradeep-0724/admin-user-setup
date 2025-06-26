import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsignmentNoteCustomFieldComponent } from './consignment-note-custom-field/consignment-note-custom-field.component';
import { ConsignmentNotePreferencesComponent } from './consignment-note-preferences/consignment-note-preferences.component';
import { ConsignmentNoteSettingComponent } from './consignment-note-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [{
  path:'',
  component:ConsignmentNoteSettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:ConsignmentNotePreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:ConsignmentNoteCustomFieldComponent,
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
      }
    },]

}
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsignmentNoteSettingRoutingModule { }
