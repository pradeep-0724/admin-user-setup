import { AllVendorBillListComponent } from './all-vendor-bill-list/all-vendor-bill-list.component';
import { AllVendorBillRoutingModule } from './all-vendor-bill-routing.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { GoThroughModule } from 'src/app/modules/customerapp-module/go-through/go-through.module';
import { ListModuleV2 } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    AllVendorBillListComponent],
  imports: [
    CommonModule,
    GoThroughModule,
    FormsModule,
    SharedModule,
    ListModuleV2,
    NgxPaginationModule,
    NgxPermissionsModule.forChild(),
    MatIconModule,
    AllVendorBillRoutingModule
  ]
})
export class AllVendorBillModule { }
