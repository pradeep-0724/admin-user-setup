import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditInspectionFormsComponent } from './add-edit-inspection-forms/add-edit-inspection-forms.component';

const routes: Routes = [
  {
    path : '',
    component : AddEditInspectionFormsComponent
  },
  {
    path : ':inspectionId',
    component : AddEditInspectionFormsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspectionFormSettingsRoutingModule { }
