import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ListInventoryComponent } from './list-inventory.component';
import { ListSparesAdjustmentComponent } from './list-inventory-adjustment/list-spares-adjustment/list-spares-adjustment.component';
import { ListTyresAdjustmentComponent } from './list-inventory-adjustment/list-tyres-adjustment/list-tyres-adjustment.component';
import { Permission } from 'src/app/core/constants/permissionConstants';


const routes: Routes = [

	{
		path: '',
		component: ListInventoryComponent,
    canActivateChild: [NgxPermissionsGuard],
		children: [
      {
				path: TSRouterLinks.inventory_adjustment_spare,
				component: ListSparesAdjustmentComponent,
        data: {
					permissions: {
						only:Permission.inventory_adjustment.toString().split(',')[3],
					}
				},
      },
      {
				path: TSRouterLinks.inventory_adjustment_tyre,
				component: ListTyresAdjustmentComponent,
        data: {
					permissions: {
						only:Permission.inventory_adjustment.toString().split(',')[3],
					}
				},
			},
      {
				path:'',
        pathMatch:'full',
        redirectTo:TSRouterLinks.inventory_adjustment_spare,

			},
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
export class ListInventoryRoutingModule {}
