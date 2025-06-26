import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceJobCardComponent } from './maintenance-job-card/maintenance-job-card.component';


const routes: Routes = [{
    path:'',
    component:MaintenanceJobCardComponent
},
{
  path:':editId',
  component:MaintenanceJobCardComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaintenanceJobCardRoutingModule { }
