import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddAssetsComponent } from './add-assets/add-assets.component';

const routes: Routes = [{
    path:'',
    component:AddAssetsComponent
},
{
  path:':asset_id',
  component:AddAssetsComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsAddModuleRoutingModule { }