import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFilterComponent } from './custom-filter/custom-filter.component';
import { CustomPaginationComponent } from './custom-pagination/custom-pagination.component';
import { CustomFilterPipePipe } from './custom-filter/custom-filter-pipe.pipe';
import { PaginationSearchComponent } from './pagination-search/pagination-search.component';



@NgModule({
  declarations: [CustomPaginationComponent,CustomFilterComponent,CustomFilterPipePipe,PaginationSearchComponent],
  imports: [
    CommonModule
  ],
  exports: [CustomPaginationComponent,CustomFilterComponent,PaginationSearchComponent],
})
export class CustomFilterPaginationModule { }
