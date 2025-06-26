import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverAllVehicleDocumentComponent } from './over-all-vehicle-document/over-all-vehicle-document.component';

const routes: Routes = [{
  path:'',
  component:OverAllVehicleDocumentComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverAllVehicleDocumentRoutingModule { }
