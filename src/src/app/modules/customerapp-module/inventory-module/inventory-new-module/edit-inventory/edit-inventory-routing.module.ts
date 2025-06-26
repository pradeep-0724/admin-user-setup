import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditInventoryComponent } from './edit-inventory.component';

const routes: Routes = [
  {
    path:'',
    component:EditInventoryComponent
  },
  {
    path:'convert-to-bill',
    component:EditInventoryComponent
  },
  {
  path:':id',
  component:EditInventoryComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditInventoryRoutingModule { }
