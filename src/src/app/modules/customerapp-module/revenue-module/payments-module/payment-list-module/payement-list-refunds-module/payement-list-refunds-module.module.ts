import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayementListRefundsModuleRoutingModule } from './payement-list-refunds-module-routing.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { RefundListFilterPipe } from '../refund-payment-search.pipe';
import { RefundListComponent } from './refunds-component/refund.component';
import { GoThroughModule } from 'src/app/modules/customerapp-module/go-through/go-through.module';
import { ListModuleV2 } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';


@NgModule({
  declarations: [
    RefundListComponent,
    RefundListFilterPipe,],
  imports: [
    CommonModule,
    GoThroughModule,
    PayementListRefundsModuleRoutingModule,
    FormsModule,
    SharedModule,
    ListModuleV2,
    NgxPaginationModule,
    NgxPermissionsModule.forChild(),
    MatIconModule
  ]
})
export class PayementListRefundsModule { }
