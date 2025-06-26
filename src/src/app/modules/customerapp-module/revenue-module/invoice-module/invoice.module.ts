import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceRoutingModule } from './invoice-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    NgxPermissionsModule.forChild(),

  ],
})
export class InvoiceModule { }
