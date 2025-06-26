import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { UserOnBoardingAuthGaurd } from 'src/app/core/services/user-onboarding-auth';

const routes: Routes = [{
  path:TSRouterLinks.add,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.siteInspection.toString().split(',')[0],
    }
  },
  loadChildren:() => import('./add-site-inspection/add-site-inspection.module').then(m => m.AddSiteInspectionModule),
},
{
  path:TSRouterLinks.edit,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.siteInspection.toString().split(',')[1],
    }
  },
  loadChildren:() => import('./add-site-inspection/add-site-inspection.module').then(m => m.AddSiteInspectionModule),
},
{
  path:TSRouterLinks.list,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.siteInspection.toString().split(',')[3],
    }
  },
  loadChildren:() => import('./list-site-inspection/list-site-inspection.module').then(m=>m.ListSiteInspectionModule)
},
{
  path:TSRouterLinks.view,
  canActivate: [NgxPermissionsGuard,UserOnBoardingAuthGaurd],
  data: {
    permissions: {
      only: Permission.siteInspection.toString().split(',')[3],
    }
  },
  loadChildren:() => import('./view-site-inspection/view-site-inspection.module').then(m=>m.ViewSiteInspectionModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteInspectionModuleRoutingModule { }
