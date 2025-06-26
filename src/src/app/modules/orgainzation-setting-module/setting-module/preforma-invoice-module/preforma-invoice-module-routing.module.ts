import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreformaInvoicePrefrencesComponent } from './preforma-invoice-prefrences/preforma-invoice-prefrences.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PreformaInvoiceComponent } from './preforma-invoice.component';

const routes: Routes = [{
  path:'',
  component:PreformaInvoiceComponent,
  canActivateChild:[NgxPermissionsGuard],
  children:[
    {
      path:'prefrence',
      component:PreformaInvoicePrefrencesComponent,
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },
    {
      path: '',
      redirectTo:'prefrence',
      pathMatch: 'full',
      data: {
        permissions: {
          only: 'super_user',
          redirectTo:'/master/overview'
        }
      },
    },]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreformaInvoiceModuleRoutingModule { }
