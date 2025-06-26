import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOthersQuotationComponent } from './item-others-quotation/item-others-quotation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddItemModule } from '../../../master-module/item-module/add-item-module/add-item-module.module';
import { RouterModule } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';



@NgModule({
  declarations: [
    ItemOthersQuotationComponent,
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    AddItemModule,
    DialogModule,
    
  ],
  exports:[ItemOthersQuotationComponent]
})
export class ItemOthersQuotationModule { }
