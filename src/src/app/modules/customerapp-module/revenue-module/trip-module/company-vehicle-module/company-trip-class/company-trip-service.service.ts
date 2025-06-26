import { SettingSeviceService } from '../../../../api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { Injectable } from '@angular/core';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { CommonService } from 'src/app/core/services/common.service';
import { map } from 'rxjs/operators';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { RevenueService } from '../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { TripService } from '../../../../api-services/revenue-module-service/trip-services/trip.service';
import { ValidationConstants } from 'src/app/core/constants/constant';

@Injectable({
  providedIn: 'root'
})
export class CompanyTripGetApiService {

  constructor(
    private _vehicleService: VehicleService,
    private _employeeService: EmployeeService,
    private _commonService: CommonService,
    private _advances:SettingSeviceService,
    private _partyService: PartyService,
    private _revenueService: RevenueService,
    private _tripService: TripService,
  ) { }


  getVehicleActiveList(vehicleListCB){
  let $getVehicleActiveListSubscription=  this._vehicleService.getVehicleActiveList().subscribe((response: any) => {
      vehicleListCB(response)
    },err=>{
      vehicleListCB([])
    },()=>{setTimeout(() => {$getVehicleActiveListSubscription.unsubscribe()}, 100);});
  }

  getVehicleNewTripList(vehicleListCB){
    let $getVehicleActiveListSubscription=  this._revenueService.getVehicleList().subscribe((response: any) => {
        vehicleListCB(response['result'])
      },err=>{
        vehicleListCB([])
      },()=>{setTimeout(() => {$getVehicleActiveListSubscription.unsubscribe()}, 100);});
  }

  getVehicleLoopID(data,vehicleLoppid){
    let $getVehicleLoopID=  this._revenueService.getVehicleLoopId(data).subscribe((response: any) => {
        vehicleLoppid(response['result'])
      },err=>{
        vehicleLoppid([])
      },()=>{setTimeout(() => {$getVehicleLoopID.unsubscribe()}, 100);});
  }


  getTransporterDrivers(transporterReiverListCB){
    let $getTransporterDrivers=  this._revenueService.getTransporterDrivers().subscribe((response: any) => {
        transporterReiverListCB(response['result'])
      },err=>{
        transporterReiverListCB([])
      },()=>{setTimeout(() => {$getTransporterDrivers.unsubscribe()}, 100);});
  }

  getEmployeeList(employeeListCb){
    let $getEmployeeListSubscription =this._employeeService.getEmployeeList('Helper,Driver').subscribe((response) => {
      if(response)
        employeeListCb(response)
    },err=>{},
    ()=>{setTimeout(() => {$getEmployeeListSubscription.unsubscribe()}, 100);});
  }

  getAll(employeeListCb){
    let $getEmployeeListSubscription =this._employeeService.getEmployeesListV2().subscribe((response) => {
      if(response)
        employeeListCb(response['result'])
    },err=>{},
    ()=>{setTimeout(() => {$getEmployeeListSubscription.unsubscribe()}, 100);});
  }

  getHelperDrivers(employeeListCb){
    const params = {"designation": "Helper,Driver"}
    let $getEmployeeListSubscription =this._employeeService.getEmployeesListV2(params).subscribe((response) => {
      if(response)
        employeeListCb(response['result'])
    },err=>{},
    ()=>{setTimeout(() => {$getEmployeeListSubscription.unsubscribe()}, 100);});
  }

  getDrivers(employeeListCb){
    const params = {"designation": "Driver"}
    let $getEmployeeListSubscription =this._employeeService.getEmployeesListV2(params).subscribe((response) => {
      if(response)
        employeeListCb(response['result'])
    },err=>{},
    ()=>{setTimeout(() => {$getEmployeeListSubscription.unsubscribe()}, 100);});
  }

  getStaticOptions(staticOptionsListCb){
    let staticOptionsList={
      unitOptionList:[],
      tripEmployeeTypeList:[],
      paymentStatus:[],
      expenseType:[],
      chargedAddBillType:[],
      chargedReducedBillType:[],
    }
   let $getStaticOptionsSubscription= this._commonService.getStaticOptions('item-unit,trip-employee-type,payment-status,expense-type,charge-add-bill-type,charge-reduce-bill-type')
    .pipe(
      map(data=>{
        staticOptionsList={
          unitOptionList:data.result['item-unit'],
          tripEmployeeTypeList:data.result['trip-employee-type'],
          paymentStatus:data.result['payment-status'],
          expenseType:data.result['expense-type'],
          chargedAddBillType:data.result['charge-add-bill-type'],
          chargedReducedBillType:data.result['charge-reduce-bill-type'],
        }
        return staticOptionsList
      })
    )
    .subscribe((response) => {
    staticOptionsListCb(response)
    },err=>{staticOptionsListCb(staticOptionsList)},
     ()=>{setTimeout(() => {$getStaticOptionsSubscription.unsubscribe()}, 100);});
  }


  getChargesOptions(staticOptionsListCb){
    let staticOptionsList={
      chargedAddBillType:[],
      chargedReducedBillType:[],
    }
   let $getStaticOptionsSubscription= this._commonService.getStaticOptions('charge-add-bill-type,charge-reduce-bill-type')
    .pipe(
      map(data=>{
        staticOptionsList={
          chargedAddBillType:data.result['charge-add-bill-type'],
          chargedReducedBillType:data.result['charge-reduce-bill-type'],
        }
        return staticOptionsList
      })
    )
    .subscribe((response) => {
    staticOptionsListCb(response)
    },err=>{staticOptionsListCb(staticOptionsList)},
     ()=>{setTimeout(() => {$getStaticOptionsSubscription.unsubscribe()}, 100);});
  }

  getAdvances(getAdvancesObjCb){
    let advancesObj={
      isMoneyReceived:false,
      isFuelReceived:false,
      isBataReceivaed:false
    }
   let $getAdvancesSubscription= this._advances.getAdvances('company_trip')
    .pipe(
      map(data=>{
        advancesObj={
         isMoneyReceived:data['result'].cash_op,
         isFuelReceived:data['result'].fuel_op,
         isBataReceivaed:data['result'].batta_op,
        }
        return advancesObj
      })
    )
    .subscribe(data=>{
      getAdvancesObjCb(data)
     },err=>{ getAdvancesObjCb(advancesObj)},
     ()=>{setTimeout(() => {$getAdvancesSubscription.unsubscribe()}, 100);})
  }

  getPartyDetails(ClientPramas,partyListCb){
    let $getPartyDetailsSubscription=  this._partyService.getPartyList(ClientPramas).subscribe((response: any) => {
      partyListCb( response.result)
    },err=>{partyListCb([])},
    ()=>{setTimeout(() => {$getPartyDetailsSubscription.unsubscribe()}, 100);});

  }

  getPartyTripDetails(vendor_party_type='0',ClientPramas,partyListCb){
    let $getPartyDetailsSubscription=  this._partyService.getPartyList(vendor_party_type,ClientPramas).subscribe((response: any) => {
      partyListCb( response.result)
    },err=>{partyListCb([])},
    ()=>{setTimeout(() => {$getPartyDetailsSubscription.unsubscribe()}, 100);});

  }

  getPartyTripDetailsV2(partyListCb){
    let $getPartyDetailsSubscription=  this._partyService.getPartyListV2().subscribe((response: any) => {
      partyListCb( response.result)
    },err=>{partyListCb([])},
    ()=>{setTimeout(() => {$getPartyDetailsSubscription.unsubscribe()}, 100);});

  }

  getMaterials(materialListCb){
   let $getMaterialsSubscription = this._revenueService.getMaterials(true).subscribe((response) => {
      materialListCb(response.result)
    },err=>{ materialListCb([])}
    ,()=>{setTimeout(() => {$getMaterialsSubscription.unsubscribe()}, 100);});
  }

  getExpense(expenseListCb){
  let $getExpenseSubscription=  this._revenueService.getExpense().subscribe((response) => {
      expenseListCb(response.result)
    },err=>{expenseListCb([])},
    ()=>{setTimeout(() => {$getExpenseSubscription.unsubscribe()}, 100);});
  }

  getConsignmentNotes(consignmentNoteListCb) {
   let $getConsignmentNotesSubscription= this._revenueService.getConsignmentNotes().subscribe((response: any) => {
      consignmentNoteListCb( response.result);
    },err=>{consignmentNoteListCb([])},
    ()=>{setTimeout(() => {$getConsignmentNotesSubscription.unsubscribe()}, 100);});
  }

  getConsignmentTripDetails(consignmentNoteId,detailsCb) {
   let $getConsignmentTripDetailsSubscription = this._revenueService.getConsignmentTripDetails(consignmentNoteId,'true').subscribe((response) => {
      detailsCb(response.result)
    },err=>{},
    ()=>{setTimeout(() => {$getConsignmentTripDetailsSubscription.unsubscribe()}, 100);})

  }

  getAccountsList(allAccountListCb){
    let $getAccountsListSubscription=this._tripService.getAccounts().subscribe((response: any) => {
      allAccountListCb(response.result)
    },err=>{allAccountListCb([])},
    ()=>{setTimeout(() => { $getAccountsListSubscription.unsubscribe()}, 100);});
  }

  getAccounts(accountType,accountListcb){
    let  $getAccountsSubscription =  this._tripService.getAccounts({ q: accountType }).subscribe((response: any) => {
      accountListcb(response.result);
    },err=>{accountListcb([])},
    ()=>{setTimeout(() => { $getAccountsSubscription.unsubscribe()}, 100);});
  }

  // returns {"name": <>, "id": <>}
  getAccountsV2(accountType,accountListcb){
    let  $getAccountsSubscription =  this._tripService.getAccountsV2({ q: accountType }).subscribe((response: any) => {
      accountListcb(response.result);
    },err=>{accountListcb([])},
    ()=>{setTimeout(() => { $getAccountsSubscription.unsubscribe()}, 100);});
  }

  getexpenseAccountList(expenseAccountListCb){
   let $sub= this._tripService.getAccounts(new ValidationConstants().expense).subscribe((response: any) => {
      expenseAccountListCb(response.result);
    },err=>{expenseAccountListCb([])},
    ()=>{setTimeout(() => { $sub.unsubscribe()}, 100);});
  }

  getClientExpenseAccounts(accountListObjCb){
    let accountListOb ={
      advanceClientAccountList:[],
      fuelClientAccountList:[],
      battaClientAccountList:[]
    }

   let $sub= this._tripService.getClientExpenseAccounts()
    .pipe(
      map(data=>{
        accountListOb={
          advanceClientAccountList:data['result'].bank_accounts,
          fuelClientAccountList:data['result'].fuel_accounts,
          battaClientAccountList:data['result'].batta_accounts,
        }
        return accountListOb
      })
    )
    .subscribe((response: any) => {
      accountListObjCb(response)
    },err=>{accountListObjCb(accountListOb)},
    ()=>{setTimeout(() => { $sub.unsubscribe()}, 100);});

  }

}
