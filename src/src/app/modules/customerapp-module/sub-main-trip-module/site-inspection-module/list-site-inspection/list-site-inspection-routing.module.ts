import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSiteInspectionComponent } from './list-site-inspection/list-site-inspection.component';

const routes: Routes = [{
  path:'',
  component:ListSiteInspectionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListSiteInspectionRoutingModule { }
