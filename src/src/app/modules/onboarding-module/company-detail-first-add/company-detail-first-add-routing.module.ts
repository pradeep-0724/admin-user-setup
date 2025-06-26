import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDetailFirstAddComponent } from './company-detail-first-add.component';

const routes: Routes = [{
  path:'',
  component:CompanyDetailFirstAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyDetailFirstAddRoutingModule { }
