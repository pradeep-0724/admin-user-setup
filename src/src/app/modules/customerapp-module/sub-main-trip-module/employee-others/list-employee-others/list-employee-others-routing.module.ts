import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListEmployeeOthersComponent } from './list-employee-others.component';

const routes: Routes = [{
  path:'',
  component:ListEmployeeOthersComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListEmployeeOthersRoutingModule { }
