import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContainerReportComponent } from './container-report/container-report.component';

const routes: Routes = [{
  path:'',
  component:ContainerReportComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComtainerReportModuleRoutingModule { }
