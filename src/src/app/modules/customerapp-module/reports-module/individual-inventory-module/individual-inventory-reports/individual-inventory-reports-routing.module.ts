import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndividualInventoryReportsComponent } from './individual-inventory-reports.component';

const routes: Routes = [
  {
    path: '',

    component:IndividualInventoryReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndividualInventoryReportsRoutingModule { }
