import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListChartOfAccountComponent } from './view-chart-of-account-component/view-chart-of-account.component';

const routes: Routes = [
  {
    path:'',
    component: ListChartOfAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewCoaModuleRoutingModule { }
