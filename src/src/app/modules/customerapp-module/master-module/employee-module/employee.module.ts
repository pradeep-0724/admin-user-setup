
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoutingModule } from './employee-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
    declarations: [

    ],
    imports: [
        EmployeeRoutingModule,
        CommonModule,
        NgxPermissionsModule.forChild(),
    ]
})
export class EmployeeModule { }
