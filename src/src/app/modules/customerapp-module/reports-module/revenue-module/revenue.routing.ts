import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'sales',
        loadChildren: () => import('./sales-by-customer/sales-by-customer.module').then(m => m.SalesByCustomerModule),

    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RevenueReportRoutingModule { }
