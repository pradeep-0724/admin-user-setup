import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuelChallanModuleRoutingModule } from './fuel-challan-module-routing.module';
import { FuelChallanListComponent } from './fuel-challan-list/fuel-challan-list.component';
import { FuelChallanPopUpComponent } from './fuel-challan-pop-up/fuel-challan-pop-up.component';
import { SharedModule } from 'src/app/shared-module/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FuelChallanService } from '../api-services/fuel-challan-service/fuel-challan.service';
import { FuelChallanSearchPipePipe } from './fuel-challan-search-pipe.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ListModuleV2 } from '../sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2.module';

@NgModule({
  declarations: [FuelChallanListComponent, FuelChallanPopUpComponent, FuelChallanSearchPipePipe],
  imports: [
    CommonModule,
    FuelChallanModuleRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatMomentDateModule,
		MatFormFieldModule,
    MatInputModule,
    NgxPermissionsModule.forChild(),
    ListModuleV2,
  ],
  providers:[FuelChallanService,{ provide: DateAdapter, useClass: AppDateAdapter }]
})
export class FuelChallanModule{ }
