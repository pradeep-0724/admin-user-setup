import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListFuelComponent } from './list-fuel.component';

const routes: Routes = [{
  path:'',
  component:ListFuelComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListFuelRoutingModule { }
