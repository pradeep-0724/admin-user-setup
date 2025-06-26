import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [{
  path:'details',
  loadChildren:()=> import('./bdp-details-module/bdp-details-module.module').then(m=>m.BdpDetailsModuleModule)
},
{
  path:TSRouterLinks.list,
  loadChildren:()=> import('./bdp-list-module/bdp-list-module.module').then(m=>m.BdpListModuleModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BdpModuleRoutingModule { }
