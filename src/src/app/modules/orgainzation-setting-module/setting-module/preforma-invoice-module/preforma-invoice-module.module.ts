import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreformaInvoiceModuleRoutingModule } from './preforma-invoice-module-routing.module';
import { PreformaInvoiceComponent } from './preforma-invoice.component';
import { PreformaInvoicePrefrencesComponent } from './preforma-invoice-prefrences/preforma-invoice-prefrences.component';
import { FormsModule } from '@angular/forms';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';


@NgModule({
  declarations: [
    PreformaInvoiceComponent,
    PreformaInvoicePrefrencesComponent
  ],
  imports: [
    CommonModule,
    PreformaInvoiceModuleRoutingModule,
    OrganizationSharedModeule,
    FormsModule
  ]
})
export class PreformaInvoiceModuleModule { }
