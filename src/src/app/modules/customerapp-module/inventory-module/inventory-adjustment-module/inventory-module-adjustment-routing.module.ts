import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddInventoryAdjustmentComponent } from './add-inventory-ajdustment/add-inventory-adjustment.component';


const routes: Routes = [{
  path:'',
  component:AddInventoryAdjustmentComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryModuleRoutingModule { }
