import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperationsRoutingModule } from './operations-routing.module';
import { OperationsComponent } from './operations.component';
import { NgxPermissionsModule } from 'ngx-permissions';


@NgModule({
	declarations: [
		OperationsComponent,
	],
	imports: [
		CommonModule,
		OperationsRoutingModule,
		NgxPermissionsModule.forChild(),
	],
	exports: [
		OperationsRoutingModule
	]
})
export class OperationsModule {}
