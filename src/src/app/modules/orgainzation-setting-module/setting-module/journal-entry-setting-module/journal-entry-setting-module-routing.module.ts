import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JournalEntryCustomFieldComponent } from './journal-entry-custom-field/journal-entry-custom-field.component';
import { JournalEntryPreferencesComponent } from './journal-entry-preferences/journal-entry-preferences.component';
import { JournalEntrySettingComponent } from './journal-entry-setting.component';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [{
  path:'',
  component:JournalEntrySettingComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:JournalEntryPreferencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path:'custom-field',
      component:JournalEntryCustomFieldComponent,
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
export class JournalEntrySettingModuleRoutingModule { }
