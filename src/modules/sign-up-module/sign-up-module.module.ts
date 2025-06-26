import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUpModuleRoutingModule } from './sign-up-module-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorModuleModule } from '../error-module/error-module.module';
import { PdfSampleComponent } from '../pdf-sample/pdf-sample.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ErrorModuleModule,
    ReactiveFormsModule,
    FormsModule,
    PdfSampleComponent,
    SignUpModuleRoutingModule
  ]
})
export class SignUpModuleModule { }
