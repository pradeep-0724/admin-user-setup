import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListInventoryNewComponent } from './list-inventory-new.component';

const routes: Routes = [{
  path:'',
  component:ListInventoryNewComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListInventoryNewRoutingModule { }
