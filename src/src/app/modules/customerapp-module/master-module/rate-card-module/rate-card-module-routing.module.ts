import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./rate-card-add-edit-module/rate-card-add-edit-module.module').then(m => m.RateCardAddEditModuleModule),
  },
  {
    path: '',
    loadChildren: () => import('./rate-card-list-module//rate-card-list-module.module').then(m => m.RateCardListModuleModule),
  },
  {
    path: '',
    loadChildren: () => import('./rate-card-details-module/rate-card-details-module.module').then(m => m.RateCardDetailsModuleModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateCardModuleRoutingModule { }
