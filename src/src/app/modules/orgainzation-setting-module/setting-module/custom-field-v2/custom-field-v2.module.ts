import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFieldV2Component } from './custom-field-v2/custom-field-v2.component';
import { ReactiveFormsModule } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { OrganizationSharedModeule } from '../organization-shared-modeule/organization-shared-modeule.module';
import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
    CustomFieldV2Component
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
    MatTooltipModule
  ],
  exports:[CustomFieldV2Component]
})
export class CustomFieldV2Module { }
