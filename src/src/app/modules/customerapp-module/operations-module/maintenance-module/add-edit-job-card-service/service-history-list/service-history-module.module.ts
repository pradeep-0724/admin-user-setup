import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceHistoryListComponent } from './service-history-list.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared-module/shared.module';



@NgModule({
  declarations: [ServiceHistoryListComponent],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  exports:[ServiceHistoryListComponent]
})
export class ServiceHistoryModule { }
