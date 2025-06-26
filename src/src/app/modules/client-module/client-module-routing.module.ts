import { ClientComponentComponent } from './client-component.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component:ClientComponentComponent,
    children:[
      {
        path: 'client',
        loadChildren: () => import('../../modules/tanent-user-module/tanent-user-module.module').then(m => m.TanentUserModuleModule),
      },
      {
        path: '',
        pathMatch:'full',
        redirectTo:'client'
      },
    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientModuleRoutingModule { }
