
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';


const routes: Routes = [

      {
        path: TSRouterLinks.inventory,
        loadChildren:() => import('./inventory/inventory.module').then(m=>m.InventoryModule),
        canActivate: [NgxPermissionsGuard],
        data: {
            permissions: {
                only:['report_inventories__view']
            }
        },

      },
      {
        path: 'trips',
        loadChildren:() => import('./overall-trip-report/overall-trip-report.module').then(m=>m.OverallTripReportModule)

      },
      {
        path: 'party-kyc',
        loadChildren:() => import('./customer-kyc/customer-kyc.module').then(m=>m.CustomerKycModule)

      },
      {
        path: 'vehicle-type-report',
        loadChildren:() => import('./vehicle-type-report/vehicle-type-report.module').then(m=>m.VehicleTypeReportModule)

      },
      {
        path: TSRouterLinks.vehicle+"/"+TSRouterLinks.document,
        loadChildren:() => import('./over-all-vehicle-document/over-all-vehicle-document.module').then(m=>m.OverAllVehicleDocumentModule)

      },
      {
        path: 'container-report',
        loadChildren:() => import('./comtainer-report-module/comtainer-report-module.module').then(m=>m.ComtainerReportModule)

      },
      {
        path: 'all-vendor-bill',
        loadChildren:() => import('./all-vendor-bill/all-vendor-bill.module').then(m=>m.AllVendorBillModule)

      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverallRoutingModule { }
