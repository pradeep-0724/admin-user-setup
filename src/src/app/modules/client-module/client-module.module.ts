import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientModuleRoutingModule } from './client-module-routing.module';
import { ClientComponentComponent } from './client-component.component';

@NgModule({
  declarations: [ClientComponentComponent],
  imports: [
    CommonModule,
    ClientModuleRoutingModule
  ]
})
export class ClientModuleModule { }
