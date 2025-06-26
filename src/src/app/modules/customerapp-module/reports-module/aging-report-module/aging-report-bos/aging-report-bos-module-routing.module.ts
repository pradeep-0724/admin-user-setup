import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgingReportBosComponent } from './aging-report-bos.component';

const routes: Routes = [
  {
    path:'',
    component:AgingReportBosComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgingReportBosModuleRoutingModule { }
