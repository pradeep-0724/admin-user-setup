import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PdfSampleComponent } from '../pdf-sample/pdf-sample.component';

const routes: Routes = [
  { path: '', redirectTo: 'sign-up', pathMatch: 'full' },
  {path : 'sign-up',component: SignUpComponent},
  {path : 'pdf',component: PdfSampleComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpModuleRoutingModule { }
