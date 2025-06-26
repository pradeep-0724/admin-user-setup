import { Permission } from '../../../core/constants/permissionConstants';
import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { InventoryComponent } from './inventory.component';
import { EditInventoryAdjustmentComponent } from './inventory-adjustment-module/edit-inventory-adjustment/edit-inventory-adjustment.component';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [

  {
		path: '',
		component: InventoryComponent,
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: TSRouterLinks.inventory_add + '/' + TSRouterLinks.inventory_new,
        canActivate:[UserOnBoardingAuthGaurd],
        loadChildren: () => import('./inventory-new-module/edit-inventory/edit-inventory.module').then(m => m.EditInventoryModule),
        data: {
					permissions: {
						only:Permission.inventory_new.toString().split(',')[0],
					}
				},
      },
      {
        path: TSRouterLinks.inventory_list + '/' + TSRouterLinks.inventory_new,
        loadChildren: () => import('./inventory-new-module/list-inventory-new/list-inventory-new.module').then(m => m.ListInventoryNewModule),
        data: {
					permissions: {
						only:Permission.inventory_new.toString().split(',')[3],
					}
				},
      },
      {
        path: TSRouterLinks.inventory_add + '/' + TSRouterLinks.inventory_adjustment,
        canActivate:[UserOnBoardingAuthGaurd],
        loadChildren: () => import('./inventory-adjustment-module/inventory-module-adjustment.module').then(m => m.InventoryAdjustmentModuleModule),
        data: {
					permissions: {
            only:Permission.inventory_adjustment.toString().split(',')[0],
					}
				},
      },
      {
        path: TSRouterLinks.inventory_edit + '/' + TSRouterLinks.inventory_new,
        canActivate:[UserOnBoardingAuthGaurd],
        loadChildren: () => import('./inventory-new-module/edit-inventory/edit-inventory.module').then(m => m.EditInventoryModule),
        data: {
					permissions: {
						only:Permission.inventory_new.toString().split(',')[1],
					}
				},
      },
      {
        path: TSRouterLinks.inventory_edit + '/' + TSRouterLinks.inventory_adjustment + '/:id',
        component:EditInventoryAdjustmentComponent,
        canActivate:[UserOnBoardingAuthGaurd],
        data: {
					permissions: {
            only:Permission.inventory_adjustment.toString().split(',')[1],
					}
				},


      },
      {
        path: TSRouterLinks.inventory_list,
        loadChildren: () => import('./list-inventory-module/list-inventory.module').then(m => m.ListInventoryModule),
        data: {
					permissions: {
						 only:Permission.inventory_adjustment.toString().split(',')[3],
					}
				},
      },
      {
				path: 'purchase-order',
				loadChildren: () => import('./purchase-order-module/purchase-order-module.module').then(m => m.PurchaseOrderModuleModule),
				data: {
					permissions: {
						only: Permission.purchase_order.toString().split(','),
					}
				},
			}
    ]
  },
];

@NgModule({
	imports: [
    RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class InventoryRoutingModule { }
