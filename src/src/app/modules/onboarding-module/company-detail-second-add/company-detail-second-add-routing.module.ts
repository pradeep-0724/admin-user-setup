import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyDetailSecondAddComponent } from './company-detail-second-add.component';

const routes: Routes = [{
  path:'',
  component:CompanyDetailSecondAddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyDetailSecondAddRoutingModule { }
