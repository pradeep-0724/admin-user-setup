import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
const quotationVersion='QUOTATION_VERSION';
const routes: Routes = [
  {
    path:'quotation',
    canActivate: [NgxPermissionsGuard],
    loadChildren: async () => {
      if (localStorage.getItem(quotationVersion)=='true') {
        const module = await  import('./quotation-module/quotation-module.module');
        return module.QuotationModule
      } else {
        const module = await import('./quotation-v2-module/quotation-v2-module.module');
        return module.QuotationV2ModuleModule;
      }
    },
    data: {
      permissions: {
        only:Permission.quotations.toString().split(','),
      }
    },
  },
  {
    path:'work-order',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./work-order-v2-module/work-order-v2-module.module').then(m => m.WorkOrderV2),
    data: {
      permissions: {
        only: Permission.workorder.toString().split(','),
      }
    },
  },
  
  {
    path:'new-trip',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./new-trip-v2/new-trip-v2.module').then(m => m.NewTripV2Module),
    data: {
      permissions: {
        only: Permission.trip__new_trip.toString().split(','),
      }
    },
  },
  {
    path:'vehicle-payment',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./fleet-owner-expenses/fleet-owner-expense.module').then(m => m.FleetOwnerExpenseModule),
    data: {
      permissions: {
        only: Permission.vehicle_provider.toString().split(','),
      }
    },
  },
  {
    path:'trip-expense',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./trip-expense-module/trip-expense-module.module').then(m => m.TripExpenseModuleModule),
    data: {
      permissions: {
        only: Permission.tripexpense.toString().split(','),
      }
    },
  },
  {
    path:'bdp',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./bdp-module/bdp-module.module').then(m => m.BdpModuleModule),
    data: {
      permissions: {
        only:'bdp_user'
      }
    },
  },
  {
    path:'employee-others',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./employee-others/employee-others.module').then(m => m.EmployeeOthersModule),
    data: {
      permissions: {
        only: Permission.employeeOthers.toString().split(','),

      }
    },
  },
  {
    path:'site-inspection',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./site-inspection-module/site-inspection-module.module').then(m => m.SiteInspectionModuleModule),
    data: {
      permissions: {
        only: Permission.siteInspection.toString().split(','),

      }
    },
    
  },
  {
    path:'local-purchase-order',
    canActivate: [NgxPermissionsGuard],
    loadChildren: () => import('./local-purchase-order-module/local-purchase-order-module.module').then(m => m.LocalPurchaseOrderModuleModule),
    data: {
      permissions: {
        only: Permission.localPurchaseOrder.toString().split(','),

      }
    },
    
  }
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubMainTripModuleRoutingModule {

 }
