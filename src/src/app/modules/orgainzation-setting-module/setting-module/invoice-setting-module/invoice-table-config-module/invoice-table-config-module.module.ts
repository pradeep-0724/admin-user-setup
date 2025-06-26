import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceTableConfigComponent } from './invoice-table-config/invoice-table-config.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { OrganizationSharedModeule } from '../../organization-shared-modeule/organization-shared-modeule.module';
import { MatRippleModule } from '@angular/material/core';



@NgModule({
  declarations: [
    InvoiceTableConfigComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DragDropModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    AlertPopupModuleModule,
    OrganizationSharedModeule,
    MatCheckboxModule,
    MatTooltipModule,
    MatRippleModule,
  ], exports: [InvoiceTableConfigComponent]
})
export class InvoiceTableConfigModule { }
