import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignUpModuleRoutingModule } from './sign-up-module-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorModuleModule } from '../error-module/error-module.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ErrorModuleModule,
    ReactiveFormsModule,
    FormsModule,
    SignUpModuleRoutingModule
  ]
})
export class SignUpModuleModule { }
