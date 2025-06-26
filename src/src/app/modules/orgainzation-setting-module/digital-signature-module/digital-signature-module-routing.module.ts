import { DigitalSignatureListComponent } from './digital-signature-list/digital-signature-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
{
  path:'list',
  component:DigitalSignatureListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalSignatureModuleRoutingModule { }
