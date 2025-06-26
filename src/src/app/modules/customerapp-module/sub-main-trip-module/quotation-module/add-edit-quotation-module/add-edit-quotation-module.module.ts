import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditQuotationModuleRoutingModule } from './add-edit-quotation-module-routing.module';
import { QuotationComponent } from './quotation/quotation.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxPaginationModule } from 'ngx-pagination';
import { InvoiceService } from '../../../api-services/revenue-module-service/invoice-service/invoice.service';
import { QuotationService } from '../../../api-services/trip-module-services/quotation-service/quotation-service';
import { AddPartyPopupModule } from '../../../master-module/party-module/add-party-popup-module/add-party-popup-module.module';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { PlacesAutoCompleteModule } from '../../../places-auto-complete/places-auto-complete.module';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [QuotationComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    NgxPaginationModule,
    MatTableModule,
    AddPartyPopupModule,
    AddItemModule,
    MatCheckboxModule,
    PlacesAutoCompleteModule,
    MatMomentDateModule,
    AddEditQuotationModuleRoutingModule
  ],
  providers:[QuotationService,InvoiceService ,{ provide: DateAdapter, useClass: AppDateAdapter }]
})
export class AddEditQuotationModule { }
