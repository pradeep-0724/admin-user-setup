import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemMasterRoutingModule } from './item-master-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ItemMasterRoutingModule,
    NgxPermissionsModule.forChild(),
  ]
})
export class ItemMasterModule { }
