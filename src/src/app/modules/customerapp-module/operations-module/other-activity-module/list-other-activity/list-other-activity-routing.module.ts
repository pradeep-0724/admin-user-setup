import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOtherActivityComponent } from './list-other-activity.component';

const routes: Routes = [{
  path:'',
  component:ListOtherActivityComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListOtherActivityRoutingModule { }
