import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ErrorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[ErrorComponent]
})
export class AppErrorModuleModule { }
