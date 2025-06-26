import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditLimitComponent } from './credit-limit/credit-limit.component';



@NgModule({
  declarations: [
    CreditLimitComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[CreditLimitComponent]
})
export class CreditLimitModule { }
