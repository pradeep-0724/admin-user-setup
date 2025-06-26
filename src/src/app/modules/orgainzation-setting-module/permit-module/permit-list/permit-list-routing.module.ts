import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitListComponent } from './permit-list/permit-list.component';

const routes: Routes = [
  {
    path: '',
    component : PermitListComponent,
    // data: {
    //   permissions: {
    //     except: 'all',
    //     redirectTo:'/organization_setting/notifications'
    //   }
    // },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermitListRoutingModule { }
