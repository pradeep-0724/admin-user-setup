import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobCardTyreChangeComponent } from './job-card-tyre-change/job-card-tyre-change.component';

const routes: Routes = [{
  path:'',
  component:JobCardTyreChangeComponent

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditJobCardTyreChangeRoutingModule { }
