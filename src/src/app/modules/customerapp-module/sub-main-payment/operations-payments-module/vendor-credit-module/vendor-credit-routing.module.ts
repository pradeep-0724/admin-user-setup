import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { ListVendorCreditComponent } from './list-vendor-credit/list-vendor-credit.component';
import { VendorCreditsComponent } from './vendor-credit/vendor-credit.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
	{
    path: TSRouterLinks.operations_vendor_credit_add,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    component: VendorCreditsComponent,
    data: {
      permissions: {
        only: Permission.vendor_credit.toString().split(',')[0],
      }
    },
  },
  {
    path: TSRouterLinks.operations_vendor_credit_list,
    canActivate: [NgxPermissionsGuard],
    component: ListVendorCreditComponent,
    data: {
      permissions: {
        only: Permission.vendor_credit.toString().split(',')[3],
      }
    },
  },
  {
    path: TSRouterLinks.operations_vendor_credit_edit + '/:vendor_credit_id',
    component: VendorCreditsComponent,
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.vendor_credit.toString().split(',')[1],
      }
    },
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
export class VendorCreditRoutingModule {}
