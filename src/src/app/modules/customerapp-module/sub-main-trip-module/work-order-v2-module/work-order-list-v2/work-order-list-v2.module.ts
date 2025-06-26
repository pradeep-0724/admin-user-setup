import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderListV2RoutingModule } from './work-order-list-v2-routing.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';
import { WorkOrderListV2Component } from './work-order-list-v2/work-order-list-v2.component';
import { WorkOrderTenureStatusModule } from '../work-order-shared-module/work-order-tenure-status/work-order-tenure-status.module';
import { OrderStatusFormatDataPipe } from './order-status.pipe';
import { FormatDataTenurePipe } from './tenure.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DialogModule } from '@angular/cdk/dialog';
import { CreateMultiTripModule } from '../work-order-shared-module/create-multi-trip/create-multi-trip-module.module';
import { GoThroughModule } from '../../../go-through/go-through.module';


@NgModule({
  declarations: [
    WorkOrderListV2Component,
    OrderStatusFormatDataPipe,
    FormatDataTenurePipe

  ],
  imports: [
    CommonModule,
    GoThroughModule,
    ListModuleV2,
    NgxPermissionsModule,
    RouterModule,
    WorkOrderListV2RoutingModule,
    WorkOrderTenureStatusModule,
    AlertPopupModuleModule,
    DialogModule,
    CreateMultiTripModule
    
  ]
})
export class WorkOrderListV2Module { }
