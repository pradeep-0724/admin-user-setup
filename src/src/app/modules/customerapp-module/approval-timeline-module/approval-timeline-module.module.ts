import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AlertPopupModuleModule } from 'src/app/alert-popup-module/alert-popup-module.module';
// import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
// import { MaterialDropDownModule } from '../material-drop-down-module/material-drop-down-module.module';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApprovalTimelineComponent } from './approval-timeline/approval-timeline.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ApprovalTimelineComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[ApprovalTimelineComponent]

})
export class ApprovalTimelineModule { }
