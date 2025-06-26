import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobCardServiceComponent } from './job-card-service/job-card-service.component';

const routes: Routes = [{
  path:'',
  component:JobCardServiceComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditJobCardServiceRoutingModule { }
