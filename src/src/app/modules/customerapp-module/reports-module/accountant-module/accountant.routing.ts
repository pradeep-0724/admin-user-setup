
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [
      {
        path: TSRouterLinks.report_journal_entry,
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./../accountant-module/journal-entry-module/journal-entry.module').then(m => m.JournalEntryModule),
				data: {
					permissions: {
						expect: ['need to add permission'],
					}
				},
      },
      {
        path: TSRouterLinks.report_trial_balance,
        loadChildren:()=>import('./trial-balance-module/trial-balance.module').then(m=>m.TrialBalanceModule),
        canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: 'report_trial_balance__view',
					}
				},
      },
      {
        path:  TSRouterLinks.report_balance_sheet,
        loadChildren:()=> import('./balance-sheet-module/balance-sheet.module').then(m=>m.BalanceSheetModule),
        canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: 'report_balance_sheet__view',
					}
				},
      },
      {
        path:  TSRouterLinks.report_audit_log,
        loadChildren:() =>import('./audit-log/audit-log.module').then(m=>m.AuditLogModule),
        canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: 'report_audit_log__view',
					}
				},
      },
      {
        path:  TSRouterLinks.report_profit_loss,
        loadChildren:() =>import('./profit-loss-module/profit-loss.module').then(m=>m.ProfitLossModule),
        canActivate: [NgxPermissionsGuard],
				data: {
					permissions: {
						only: 'report_profit_loss__view',
					}
				},
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountantRoutingModule { }
