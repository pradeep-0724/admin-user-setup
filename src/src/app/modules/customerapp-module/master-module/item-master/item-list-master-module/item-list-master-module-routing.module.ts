import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemListMasterComponent } from './item-list-master/item-list-master.component';

const routes: Routes = [{
  path:'',
  component:ItemListMasterComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemListMasterModuleRoutingModule { }
