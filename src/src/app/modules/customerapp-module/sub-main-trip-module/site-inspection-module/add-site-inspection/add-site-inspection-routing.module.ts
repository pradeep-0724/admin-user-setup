import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddSiteInspectionComponent } from './add-site-inspection/add-site-inspection.component';

const routes: Routes = [{
  path:'',
  component:AddSiteInspectionComponent
},
{
  path:':siteinspection-id',
  component:AddSiteInspectionComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddSiteInspectionRoutingModule { }
