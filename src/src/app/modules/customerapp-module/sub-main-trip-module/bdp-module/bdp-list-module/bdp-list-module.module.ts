import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BdpListModuleRoutingModule } from './bdp-list-module-routing.module';
import { BdpListComponent } from './bdp-list/bdp-list.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    BdpListComponent
  ],
  imports: [
    CommonModule,
    BdpListModuleRoutingModule,
    RouterModule
    
  ]
})
export class BdpListModuleModule { }
