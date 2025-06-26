
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DashboardComponent} from './dashboard.component'
import { DashboardRoutingModule } from './dashboard.routing';
import { MatIconModule } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatRippleModule
  ],
  exports: [
    DashboardRoutingModule
  ],

})
export class DashboardModule { }
