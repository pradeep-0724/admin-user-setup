import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [
  {
    path:TSRouterLinks.add,
    loadChildren:() => import('./add-trip-v2/add-trip-v2.module').then(m=>m.AddTripV2Module),
    canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
    data: {
      permissions: {
        only: Permission.trip__new_trip.toString().split(',')[0],
      }
    },

},
{
  path:TSRouterLinks.edit,
  loadChildren:() => import('./add-trip-v2/add-trip-v2.module').then(m=>m.AddTripV2Module),
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.trip__new_trip.toString().split(',')[1],
    }
  },

},
{
  path:TSRouterLinks.list,
  loadChildren:() => import('./list-trip-v2/list-trip-v2.module').then(m=>m.ListTripV2Module),
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.trip__new_trip.toString().split(',')[3],
    },
  },
},
{
  path:'details/:id',
  loadChildren:() => import('./new-trip-details-v2/new-trip-details-v2.module').then(m=>m.NewTripDetailsV2Module),
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.trip__new_trip.toString().split(',')[3],
    }
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTripV2RoutingModule { }
