import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeDocumentComponent } from './employee-document/edit-document.component';

const routes: Routes = [
  {
    path:'',
    component:EmployeeDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddEditDocumentModuleRoutingModule { }
