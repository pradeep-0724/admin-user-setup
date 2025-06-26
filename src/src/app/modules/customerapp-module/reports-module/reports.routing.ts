import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { ReportBaseComponent } from './reports-base.component';

const routes: Routes = [
    {
        path: '',
        component: ReportBaseComponent,
    },
    {
        path: TSRouterLinks.overall,
        loadChildren: () => import('./../reports-module/overall-module/overall-module.module').then(m => m.OverallModuleModule),
    },
    {
        path: TSRouterLinks.report_accountant,
        loadChildren: () => import('./../reports-module/accountant-module/accountant.module').then(m => m.AccountantModule),
    },
    {
        path: TSRouterLinks.revenue,
        loadChildren: () => import('./../reports-module/revenue-module/revenue-module.module').then(m => m.RevenueModule),

    },
    {
      path:TSRouterLinks.master_inventory,
      loadChildren: () => import('./../reports-module/individual-inventory-module/individual-inventory-module.module').then(m => m.IndividualInventoryModuleModule),
    },
    {
        path: TSRouterLinks.report_bank_activity,
        loadChildren: () => import('./../reports-module/banking-module/banking.module').then(m => m.BankingModule),

    },
    {
      path: TSRouterLinks.tds,
      loadChildren: () => import('./../reports-module/tds-module/tds-module.module').then(m => m.TdsModuleModule),

  },
  {
    path: TSRouterLinks.vat,
    loadChildren: () => import('./../reports-module/vat-module/vat-module.module').then(m => m.VatModule),

},
  {
    path: TSRouterLinks.aging_report,
    loadChildren: () => import('./../reports-module/aging-report-module/aging-report-module.module').then(m => m.AgingReportModuleModule),

},
{
    path: TSRouterLinks.route_summary,
    loadChildren: () => import('./../reports-module/route-summary-module/route-summary-module.module').then(m => m.RouteSummaryModule),

},
  {
    path: TSRouterLinks.gst,
    loadChildren: () => import('./../reports-module/gst-module/gst-module.module').then(m => m.GstModuleModule),

},
    {
        path: '',
        redirectTo: 'reports',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportRoutingModule { }
