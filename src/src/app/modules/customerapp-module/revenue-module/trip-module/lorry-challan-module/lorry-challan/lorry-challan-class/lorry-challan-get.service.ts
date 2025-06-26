import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { Injectable } from '@angular/core';
import { map,switchMap} from 'rxjs/operators';
import { CommonService } from 'src/app/core/services/common.service';
import { of } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TimeZoneService } from 'src/app/core/services/time-zone.service';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { RevenueService } from '../../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { TripService } from '../../../../../api-services/revenue-module-service/trip-services/trip.service';
import { LorryChallanService } from '../../lorry-challan-service';


@Injectable({
  providedIn: 'root'
})
export class LorryChallanGetService {

  constructor(
    private _commonService: CommonService,
    private _tax:TaxService,
    private _taxService :TaxModuleServiceService,
    private _timeZone:TimeZoneService,
    private _currency:CurrencyService,
    private _employeeService: EmployeeService,
    private _lorryChallanService: LorryChallanService,
    private _companyModuleService :CompanyModuleServices,
    private _advances:SettingSeviceService,
    private revenueService:RevenueService,
    private _tripService: TripService,
   ) {


  }

  getStaticOptions(staticOptionsListCallBAck){
    let staticOptions={
      tripEmployeeType:[],
      itemUnit:[],
      paymentStatus:[]
    }
   let $getStaticOptionsSubscription=  this._commonService.getStaticOptions('item-unit,trip-employee-type,payment-status')
    .pipe(map(data=>{
      staticOptions.itemUnit=data.result['item-unit'];
      staticOptions.tripEmployeeType=data.result['trip-employee-type'];
      staticOptions.paymentStatus=data.result['payment-status'];
      return staticOptions
    }))
    .subscribe((response) => {
      staticOptionsListCallBAck(staticOptions);
    },err=>{
      staticOptionsListCallBAck(staticOptions);
    },()=>{
      setTimeout(() => { $getStaticOptionsSubscription.unsubscribe()},1000);
    })
  }

  getLorryChallanNumber(lorryChallanNumberCallBack){
   let $getLorryChallanNumberSubscription = this._commonService.getSuggestedIds('lorrychallan')
    .subscribe((res)=>{
      lorryChallanNumberCallBack(res.result.lorrychallan)
    },err=>{
      lorryChallanNumberCallBack('')
    },()=>{
      setTimeout(() => { $getLorryChallanNumberSubscription.unsubscribe()},1000);
    })
  }

  getEmployeeList(employeeListCallBack){
    let $employeeServiceSubscription= this._employeeService.getEmployeeList().subscribe((response) => {
         employeeListCallBack(response)
     },err=>{
       employeeListCallBack([])
     },()=>{
       setTimeout(() => {$employeeServiceSubscription.unsubscribe(); },1000);
     });
   }

   getInitialDetails(initialDetailsCallBack){

    let initailDetails={
      isTax:false,
      taxOptions:[],
      currency:{},
      timezone:''
    }
    const tax=of(this._tax.getTax());
    const timeZone=of(this._timeZone.getTodaysDate());
    const currency = of(this._currency.getCurrency())
    const taxOptions=this._taxService.getTaxDetails();
    let combined = taxOptions.pipe(
      switchMap(taxOptions=>{
         return tax
         .pipe(
           switchMap(taxdata=>{
            return currency
            .pipe(
              switchMap(currency=>{
                return timeZone
                .pipe(
                  map(timezone=>{
                    initailDetails.isTax= taxdata;
                    initailDetails.taxOptions=taxOptions['result'].tds
                    initailDetails.currency=currency
                    return initailDetails
                   }
                  )
                )
              })
            )
           })

         )
      })
    );
   let $combineSubscription=  combined.subscribe(data=>{
       initialDetailsCallBack(data);
     },err => {
      initialDetailsCallBack(initailDetails);
    },()=>{
      setTimeout(() => {$combineSubscription.unsubscribe(); },1000);
    });
  }

  getDriverDetailCustomFields(driverCustomFieldList) {
   let  $getDriverDetailCustomFieldsSubscription= this._lorryChallanService.getDriverCustomField().subscribe((response: any) => {
      driverCustomFieldList( response.result)
    },err=>{
      driverCustomFieldList([])
    },()=>{
      setTimeout(() => {$getDriverDetailCustomFieldsSubscription.unsubscribe(); },1000);
    });
  }

  getOwnerDetailCustomFields(ownerCustomFieldList) {
  let $getOwnerDetailCustomFieldsSubscription=  this._lorryChallanService.getOwnerCustomField().subscribe((response: any) => {
      ownerCustomFieldList(response.result);
    },err=>{
      ownerCustomFieldList([]);
    },()=>{
      setTimeout(() => {$getOwnerDetailCustomFieldsSubscription.unsubscribe(); },1000);
    });
  }

  getVehicleDetailCustomFields(vehicleCustomFieldList) {
    let $getVehicleDetailCustomFieldsSubscription = this._lorryChallanService.getVehicleCustomField().subscribe((response: any) => {
      vehicleCustomFieldList(response.result);
    },err=>{
      vehicleCustomFieldList([])
    },()=>{
      setTimeout(() => {$getVehicleDetailCustomFieldsSubscription.unsubscribe(); },1000);
    });
  }

  getOtherDetailCustomFields(otherCustomFieldList) {
   let $getOtherDetailCustomFieldsSubscription= this._lorryChallanService.getOtherCustomField().subscribe((response: any) => {
           otherCustomFieldList(response.result)
    },err=>{
      otherCustomFieldList([])
    },()=>{
      setTimeout(() => {$getOtherDetailCustomFieldsSubscription.unsubscribe(); },1000);
    });
  }

  getDriverDetailDrivers(driverList){
   let driverListItems=[]
   let $getDriverDetailDriversSubscription= this._lorryChallanService.getDrivers().subscribe((response: any) => {
    driverListItems=response.result
      driverList(driverListItems);
    },err=>{
      driverList(driverListItems);
    },()=>{
      setTimeout(() => {$getDriverDetailDriversSubscription.unsubscribe(); },1000);
    });
  }


  getOwnerDetailOwners(ownerList) {
   let $getOwnerDetailOwnersSubscription= this._lorryChallanService.getOwners().subscribe((response: any) => {
      ownerList(response.result)
    },err=>{
      ownerList([])
    },()=>{
      setTimeout(() => {$getOwnerDetailOwnersSubscription.unsubscribe(); },1000);
    });
  }

  getVehiclePopulateDetails(vehicleId,vehiclePopUpDetails){
   let $getVehiclePopulateDetailsSubscription=  this._lorryChallanService.getVehiclePopulateDetails(vehicleId).subscribe((res) => {
      vehiclePopUpDetails(res.result)
    },err=>{
    },()=>{
      setTimeout(() => {$getVehiclePopulateDetailsSubscription.unsubscribe(); },1000);
    })
  }

  getPhoneCode(countryPhoneCodeList){
   let $getPhoneCodeSubscription= this._companyModuleService.getPhoneCode()
    .pipe(map(result=>{
      return  result['results']}))
    .subscribe(result=>{
     countryPhoneCodeList(result)
    },err=>{
      countryPhoneCodeList([])
    },()=>{
      setTimeout(() => {$getPhoneCodeSubscription.unsubscribe(); },1000);
    })
  }

  getAdvances(advancesData){
    let advances={
      isMoneyReceived:false,
      isFuelReceived:false
    }
    let $getAdvancesSubscription= this._advances.getAdvances('market_vehicle')
    .pipe(map(
      data=>{
        advances.isFuelReceived = data['result'].fuel_op;
        advances.isMoneyReceived = data['result'].cash_ad_op;
        return advances
      }
    ))
    .subscribe(data=>{
      advancesData(data)
     },
     err=>{advancesData(advances)},
     ()=>{  setTimeout(() => {$getAdvancesSubscription.unsubscribe(); },1000);}
     )
  }

  getClientExpenseAccounts(clientExpenseAccountsList){
    let clientExpenseAccounts={
      advanceClientAccountList:[],
      fuelClientAccountList:[]

    }
   let $getClientExpenseAccountsSubscription = this._tripService.getClientExpenseAccounts()
    .pipe(
      map(data=>{
        clientExpenseAccounts.advanceClientAccountList = data['result'].bank_accounts;
        clientExpenseAccounts.fuelClientAccountList = data['result'].fuel_accounts;
        return clientExpenseAccounts
      }
      )
    )
    .subscribe((response: any) => {
      clientExpenseAccountsList(response)
    },err=>{
      clientExpenseAccountsList(clientExpenseAccounts)
    },()=>{  setTimeout(() => {$getClientExpenseAccountsSubscription.unsubscribe(); },1000);});
  }

  getVendorList(employeeList){
   let $getVendorListSubscription = this._tripService.getVendorList('1').subscribe((response) => {
      employeeList(response.result);
    },err=>{ employeeList([])},
    ()=>{setTimeout(() => {$getVendorListSubscription.unsubscribe(); },1000);});
  }

  getAccounts(accountList){
    let $getAccountsSubscription=this._tripService.getAccounts()
    .subscribe((response: any) => {
      accountList(response.result);
    },err=>{accountList([])},
    ()=>{setTimeout(() => {$getAccountsSubscription.unsubscribe(); },1000);});
  }

  getVehicleDetailVehicles(vehicleList){
   let $getVehicleDetailVehiclesSubscription = this._tripService.getTransportVehicle().subscribe((response: any) => {
      vehicleList(response.result)
    },err=>{vehicleList([])},
    ()=>{setTimeout(() => {$getVehicleDetailVehiclesSubscription.unsubscribe(); },1000);});
  }

  getExpense(expenseList){
    let $getExpenseSubscription = this.revenueService.getExpense().subscribe((response) => {
      expenseList(response.result);
    },err=>{expenseList([])},
    ()=>{setTimeout(() => {$getExpenseSubscription.unsubscribe(); },1000);});
  }

  getMaterialDetails(materialDetails){
   let $getMaterialDetailsSubscription  = this.revenueService.getMaterials().subscribe((response)=>{
      materialDetails(response.result);
    },err => materialDetails([]),
    () => { setTimeout(() => {$getMaterialDetailsSubscription.unsubscribe();},1000); })
  }

  getConsignmentNotes(consignmentNoteList) {
   let $getConsignmentNotesSubscription = this.revenueService.getConsignmentNotes().subscribe((response: any) => {
      consignmentNoteList(response.result);
    },err => {consignmentNoteList([])},
   () => { setTimeout(() => {$getConsignmentNotesSubscription.unsubscribe();},1000);  } );
 }

 getEditLorryChallanDetails(challanID,lorryChallanDetails){
  let $getEditLorryChallanDetailsSubscription =this.revenueService.getEditLorryChallanDetails(challanID).subscribe((res)=>{
    lorryChallanDetails(res.result)
  },err =>{},
  ()=>{ setTimeout(() => {$getEditLorryChallanDetailsSubscription.unsubscribe();},1000);  })
 }

 getEditConsignmentDetails(detailsId,consignmentDetails){
 let $getEditConsignmentDetailsSubscription = this.revenueService.getEditConsignmentDetails(detailsId).subscribe((response) => {
    consignmentDetails(response.result);
  },err =>{},
  () => {setTimeout(() => {$getEditConsignmentDetailsSubscription.unsubscribe();},1000); }
  )
 }

}
