import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'payable',
    loadChildren:()=> import('./tds-payable/tds-payable.module').then(m =>m.TdsPayableModule)
  },
  {
    path:'receivable',
    loadChildren:() => import('./tds-receivable/tds-receivable.module').then(m =>m.TdsReceivableModule)
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TdsRouting { }
