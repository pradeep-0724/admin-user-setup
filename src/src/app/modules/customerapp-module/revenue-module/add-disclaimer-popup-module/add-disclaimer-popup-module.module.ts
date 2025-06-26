import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDisclaimerComponent } from './add-disclaimer/add-disclaimer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';



@NgModule({
  declarations: [AddDisclaimerComponent],
  imports: [
    CommonModule,
    AppErrorModuleModule,
    ReactiveFormsModule
  ],
  exports:[AddDisclaimerComponent]
})
export class AddDisclaimerPopupModule{ }
