import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditNoteRoutingModule } from './credit-note-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    CreditNoteRoutingModule,
    NgxPermissionsModule.forChild(),
  ],
})
export class CreditNoteModule { }
