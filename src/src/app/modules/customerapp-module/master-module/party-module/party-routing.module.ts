import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';

const routes: Routes = [
  {
    path: TSRouterLinks.add,
   loadChildren:()=>import('./add-edit-party-module/add-edit-party-module.module').then(m=>m.AddEditPartyModule)
  },
  {
    path:'rate-card',
   loadChildren:()=>import('./rate-card-module/rate-card-module.module').then(m=>m.RateCardModuleModule)
  },
  {
    path: TSRouterLinks.edit,
   loadChildren:()=>import('./add-edit-party-module/add-edit-party-module.module').then(m=>m.AddEditPartyModule)
  },
  {
    path: TSRouterLinks.view,
    loadChildren:() => import('./party-list-module/party-list-module.module').then(m=>m.PartyListModule)
  },
  {
    path: TSRouterLinks.details,
    loadChildren: () => import('./party-details-v2/party-details-v2.module').then(m => m.PartyDetailsV2Module),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule { }
