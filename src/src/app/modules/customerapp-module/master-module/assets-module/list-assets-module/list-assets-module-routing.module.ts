import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListAssetsComponent } from './list-assets/list-assets.component';

const routes: Routes = [{
    path:'',
    component:ListAssetsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsListModuleRoutingModule { }