import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationV2ListModuleRoutingModule } from './quotation-v2-list-module-routing.module';
import { QuotationV2ListComponent } from './quotation-v2-list/quotation-v2-list.component';
import { ListModuleV2 } from '../../new-trip-v2/list-module-v2/list-module-v2.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../../go-through/go-through.module';


@NgModule({
  declarations: [
    QuotationV2ListComponent
  ],
  imports: [
    CommonModule,
    GoThroughModule,
    ListModuleV2,
    NgxPermissionsModule,
    AlertPopupModuleModule,
    QuotationV2ListModuleRoutingModule,
    
  ]
})
export class QuotationV2ListModuleModule { }
