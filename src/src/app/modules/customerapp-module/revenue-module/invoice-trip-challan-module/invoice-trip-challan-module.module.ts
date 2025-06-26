import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceTripChallanComponent } from './invoice-trip-challan/invoice-trip-challan.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListFilterModulePopupModule } from '../../list-filter-module-popup-module/list-filter-module-popup-module.module';
import { CraneTripChallanComponent } from './crane-trip-challan/crane-trip-challan.component';
import { DialogModule } from '@angular/cdk/dialog';
import { SalesOrderAdditionalChargesComponent } from './sales-order-additional-charges/sales-order-additional-charges.component';
import { CraneChargesComponent } from './crane-charges/crane-charges.component';
import { CraneDeductionsComponent } from './crane-deductions/crane-deductions.component';
import { DateFormaterModule } from '../../date-formater/date-formater.module';
import { ToolTipModule } from '../../sub-main-trip-module/new-trip-v2/tool-tip/tool-tip.module';



@NgModule({
  declarations: [InvoiceTripChallanComponent, CraneTripChallanComponent, SalesOrderAdditionalChargesComponent, CraneChargesComponent, CraneDeductionsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ListFilterModulePopupModule,
    DialogModule,
    DateFormaterModule,
    ToolTipModule
  ],
  exports:[InvoiceTripChallanComponent,CraneTripChallanComponent,SalesOrderAdditionalChargesComponent,CraneChargesComponent, CraneDeductionsComponent]
})
export class InvoiceTripChallanModule { }
