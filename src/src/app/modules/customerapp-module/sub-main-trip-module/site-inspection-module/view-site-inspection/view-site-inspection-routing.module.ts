import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSiteInspectionComponent } from './view-site-inspection/view-site-inspection.component';

const routes: Routes = [{
  path:':inspectionId',
  component:ViewSiteInspectionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewSiteInspectionRoutingModule { }
