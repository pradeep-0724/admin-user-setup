import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileDeleteViewComponent } from './file-delete-view/file-delete-view.component';
import { DeleteAlertModule } from 'src/app/shared-module/delete-alert-module/delete-alert-module.module';
import { DialogModule } from '@angular/cdk/dialog';
import { EllipsisPipe } from './ellipsis.pipe';
import { MaterialDropDownModule } from 'src/app/modules/customerapp-module/material-drop-down-module/material-drop-down-module.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    FileDeleteViewComponent,
    EllipsisPipe
  ],
  imports: [
    CommonModule,
    DeleteAlertModule,
    DialogModule,
    FormsModule,
    MaterialDropDownModule
  ],
  exports:[FileDeleteViewComponent]
})
export class FileDeleteViewModule{ }
