import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBankActivitiesComponent } from './list-bank-activities.component';

const routes: Routes = [
  {
    path:'',
    component: ListBankActivitiesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListBankActivitiesModuleRoutingModule { }
