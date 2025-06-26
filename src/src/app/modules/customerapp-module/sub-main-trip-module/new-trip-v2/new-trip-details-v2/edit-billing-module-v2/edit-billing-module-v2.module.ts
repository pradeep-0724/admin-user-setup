import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditBillingV2Component } from './edit-billing-v2/edit-billing-v2.component';
import { EditBillingRoutingModule } from './edit-billing-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ToolTipModule } from '../../tool-tip/tool-tip.module';



@NgModule({
  declarations: [
    EditBillingV2Component
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ToolTipModule,
    EditBillingRoutingModule
  ]
})
export class EditBillingModuleV2Module { }
