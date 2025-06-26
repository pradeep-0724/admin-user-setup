import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewTripComponent } from './new-trip.component';

const routes: Routes = [
  {
    path:'',
    component:NewTripComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTripAddModuleRoutingModule { }
