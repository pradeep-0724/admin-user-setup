import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditItemComponent } from './add-edit-item/add-edit-item.component';

const routes: Routes = [{
  path:'',
  component:AddEditItemComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditItemMasterModuleRoutingModule { }
