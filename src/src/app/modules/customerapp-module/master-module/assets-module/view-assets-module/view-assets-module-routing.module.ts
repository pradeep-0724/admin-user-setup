import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetsDetailsSectionComponent } from './assets-details-section/assets-details-section.component';

const routes: Routes = [
{
  path :':asset_id',
  component : AssetsDetailsSectionComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsViewModuleRoutingModule { }
