import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TSRouterLinks } from 'src/app/core/constants/router.constants';
import { RateCardComponent } from './rate-card/rate-card.component';
import { AdditionalChargeRateCardComponent } from './additional-charge-rate-card/additional-charge-rate-card.component';
import { CustomerRateCardComponent } from './customer-rate-card/customer-rate-card.component';

const routes: Routes = [{
  path:TSRouterLinks.add,
  component:RateCardComponent
},
{
  path:TSRouterLinks.edit+"/"+":id",
  component:RateCardComponent
},
{
  path:'additional',
  component: AdditionalChargeRateCardComponent
},
{
  path:'additional'+"/"+":id",
  component: AdditionalChargeRateCardComponent
},
{
  path:'customer-rate-card',
  component: CustomerRateCardComponent
},
{
  path:'customer-rate-card'+"/"+":id",
  component: CustomerRateCardComponent
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateCardModuleRoutingModule { }
