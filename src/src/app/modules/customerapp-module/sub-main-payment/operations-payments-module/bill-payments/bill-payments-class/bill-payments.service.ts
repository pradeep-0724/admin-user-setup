import { Injectable } from '@angular/core';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';


@Injectable({
    providedIn: 'root'
  })

  export class BillPaymentsClassService {

    constructor(private _employeeService: EmployeeService,
        private _vehicleService: VehicleService,
        private _partyService: PartyService,
        private _revenueService: RevenueService,

        ){}


        getEmployeeList(employeeListCallBack){

            let $employeeServiceSubscription= this._employeeService.getEmployeeList().subscribe((response) => {
                 employeeListCallBack(response)
             },err=>{
               employeeListCallBack([])
             },()=>{
               setTimeout(() => {$employeeServiceSubscription.unsubscribe(); },1000);
             });
           }

           getVehicleList(vehicleListCallBack){

            let $vehicleServiceSubscription= this._vehicleService.getVehicleList().subscribe((response) => {
                vehicleListCallBack(response)
             },err=>{
                vehicleListCallBack([])
             },()=>{
               setTimeout(() => {$vehicleServiceSubscription.unsubscribe(); },1000);
             });
           }

           getAccountsList(accountsListCallBack){

            let $accountsServiceSubscription= this._revenueService.getAccounts('Expense').subscribe((response) => {
                accountsListCallBack(response.result)
             },err=>{
                accountsListCallBack([])
             },()=>{
               setTimeout(() => {$accountsServiceSubscription.unsubscribe(); },1000);
             });
           }

           getPaymentAccountsList(paymentAccountsListCallBack){

            let $paymentAccountsServiceSubscription= this._revenueService.getAccounts().subscribe((response) => {
                paymentAccountsListCallBack(response.result)
             },err=>{
                paymentAccountsListCallBack([])
             },()=>{
               setTimeout(() => {$paymentAccountsServiceSubscription.unsubscribe(); },1000);
             });
           }

           getMaterialsList(materialsListCallBack){

            let $materialsServiceSubscription= this._revenueService.getExpense().subscribe((response) => {
                materialsListCallBack(response.result)
             },err=>{
                materialsListCallBack([])
             },()=>{
               setTimeout(() => {$materialsServiceSubscription.unsubscribe(); },1000);
             });
           }

           getExpenseAccountsAndSetAccountList(expenseListCallBack){

            let $expenseServiceSubscription= this._revenueService.getAccounts('Expense,Other Expense,Cost of Services / COGS').subscribe((response) => {
                expenseListCallBack(response.result)
             },err=>{
                expenseListCallBack([])
             },()=>{
               setTimeout(() => {$expenseServiceSubscription.unsubscribe(); },1000);
             });
           }

           getPartyList(partyListCallBack){

            let VendorParams = '1'; // Vendor
            let $partyServiceSubscription= this._partyService.getPartyList('0,1,2,3',VendorParams).subscribe((response) => {
                partyListCallBack(response.result)
             },err=>{
                partyListCallBack([])
             },()=>{
               setTimeout(() => {$partyServiceSubscription.unsubscribe(); },1000);
             });
           }

  }
