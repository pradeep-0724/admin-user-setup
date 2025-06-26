import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingTypesComponent } from './billing-types/billing-types.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ToolTipModule } from '../tool-tip/tool-tip.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BillingTypesContainerComponent } from './billing-types-container/billing-types-container.component';
import { AddEditMaterialInfoSectionComponent, AddMaterialPopup } from './add-edit-material-info-section/add-edit-material-info-section.component';
import { SoBillingTypesComponent } from './so-billing-types/so-billing-types.component';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [
    BillingTypesComponent,
    BillingTypesContainerComponent,
    AddEditMaterialInfoSectionComponent,
    AddMaterialPopup,
    SoBillingTypesComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ToolTipModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  exports:[BillingTypesComponent,BillingTypesContainerComponent,AddEditMaterialInfoSectionComponent,SoBillingTypesComponent]
})
export class BillingTypesV2Module { }
