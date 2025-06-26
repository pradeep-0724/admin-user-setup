import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfitLossComponent } from './profit-loss.component';

const routes: Routes = [{
  path:  '',
  component: ProfitLossComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfitLossRoutingModule { }
