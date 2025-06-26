import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
   loadChildren:()=>import('./add-zone-popup/add-zone-popup.module').then(m=>m.AddZonePopupModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewZoneRoutingModule { }
