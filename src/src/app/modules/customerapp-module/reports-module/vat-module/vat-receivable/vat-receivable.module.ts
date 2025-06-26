import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VatReceivableRoutingModule } from './vat-receivable-routing.module';
import { VatReceivableComponent } from './vat-receivable.component';
import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ListModuleV2 } from '../../../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    VatReceivableComponent
  ],
  imports: [
    CommonModule,
    VatReceivableRoutingModule,
    ListModuleV2,
    BsDatepickerModule.forRoot(),
    FormsModule,
    SharedModule,
  ]
})
export class VatReceivableModule { }
