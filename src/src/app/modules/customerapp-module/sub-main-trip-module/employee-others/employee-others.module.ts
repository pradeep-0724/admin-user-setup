import { SharedModule } from '../../../../shared-module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EmployeeOthersRoutingModule } from './employee-others-routing.module';
import { EmployeeOthersComponent } from './employee-others.component';
import { EmployeeOthersClassService } from './employee-others-class/employee-others.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { GoThroughModule } from '../../go-through/go-through.module';
import { AppErrorModuleModule } from 'src/app/app-error-module/app-error-module.module';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
	declarations: [
		EmployeeOthersComponent,

	],
	imports: [
		CommonModule,
		GoThroughModule,
        EmployeeOthersRoutingModule,
		FormsModule,
		AppErrorModuleModule,
		ReactiveFormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatNativeDateModule,
		MatAutocompleteModule,
		SharedModule,
		MatMomentDateModule,
    NgxPermissionsModule.forChild(),

	],
	providers :[EmployeeOthersClassService]
})
export class EmployeeOthersModule {}
