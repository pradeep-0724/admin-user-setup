import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';

@Injectable({
    providedIn: 'root'
})
export class InventoryServiceClass {

  constructor(
    private _commonService: CommonService,
    private _employeeService: EmployeeService,
    private _partyService: PartyService,
    private _revenueService: RevenueService,

  ){

  }
  getStaticOptions(cb){
    this._commonService
    .getStaticOptions(
      'billing-payment-method,gst-treatment,payment-term,tax,tds,item-unit'
    )
    .subscribe((response) => {
      cb(response.result)
    });
  }
  getDestinationOfSupply(cb){
  }
  getEmployeeList(cb){
    this._employeeService.getEmployeeList().subscribe((employeeList) => {
			cb(employeeList)
		});
  }
  getVendorDetails(cb){
		this._partyService.getPartyList('0','1').subscribe((response) => {
      cb(response.result)
    });
  }
  getAccounts(cb){
    this._revenueService.getAccounts().subscribe((response) => {
			if (response !== undefined) {
				cb(response.result);
			}
		});
  }
}
