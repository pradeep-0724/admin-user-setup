import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddChartOfAccountComponent } from './add-chart-of-account-component/add-chart-of-account.component';

const routes: Routes = [
  {
    path:'',
    component: AddChartOfAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoaAddEditModuleRoutingModule { }
