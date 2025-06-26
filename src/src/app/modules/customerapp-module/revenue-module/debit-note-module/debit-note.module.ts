import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DebitNoteRoutingModule } from './debit-note-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DebitNoteRoutingModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class DebitNoteModule { }
