import { LorryChallanService } from './../../../lorry-challan-module/lorry-challan-service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { TimeZoneService } from 'src/app/core/services/time-zone.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { Injectable } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { map,switchMap} from 'rxjs/operators';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { of } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { ConsignmentNoteCustomfieldServiceService } from 'src/app/modules/orgainzation-setting-module/setting-module/consignment-note-setting-module/consignment-note-custom-field/consignment-note-customfield-service.service';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { RevenueService } from '../../../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { TripService } from '../../../../../api-services/revenue-module-service/trip-services/trip.service';

@Injectable({
  providedIn: 'root'
})
export class ConsignmentNoteService {
  constructor(private _commonService: CommonService,
    private _companyVehicleService:VehicleService,
    private _tax:TaxService,
    private _tripService:TripService,
    private _taxService :TaxModuleServiceService,
    private _timeZone:TimeZoneService,
    private _partyService: PartyService,
    private _employeeService: EmployeeService,
    private _lorryChallanService: LorryChallanService,
    private _revenueService:RevenueService,
    private _currency:CurrencyService,
    private _customFields: ConsignmentNoteCustomfieldServiceService,
    private _advances:SettingSeviceService) { }


  getUnit(unitCallBack){

   const $itemUnitSubscription = this._commonService
    .getStaticOptions('item-unit,tax', true).pipe(
     map(mapdata=>{
      return mapdata['result']['item-unit']
     })
    ).subscribe(
      data=>{
        unitCallBack(data);
      },err=>{
        unitCallBack([]);
      },()=>{
        setTimeout(() => { $itemUnitSubscription.unsubscribe(); },1000);
      }
    )
  }

  getConsignNumber(consignmentCallBack){

  const $consignmentSubscription= this._commonService.getSuggestedIds('consignment')
   .pipe(
    map(mapdata=>{
     return mapdata['result']['consignment']
    })
   ).subscribe((res)=>{
      consignmentCallBack(res);
    },err => {
      consignmentCallBack('');
    },()=>{
      setTimeout(() => {$consignmentSubscription.unsubscribe(); },1000);
    });
  }

  getAdvances(advancesCallBack){

    const advanceData={
      isMoneyReceived:false,
      isFuelReceived:false,
      isBataReceivaed:false,
      isTransporteradvance:false,
    }
    const $advancesSubscription= this._advances.getAdvances('delivery_note').pipe(
      map(advances=>{
        advanceData.isMoneyReceived=advances['result'].cash_op;
        advanceData.isFuelReceived=advances['result'].fuel_op;
        advanceData.isBataReceivaed=advances['result'].batta_op;
        advanceData.isTransporteradvance =advances['result'].cash_rc_op;
        return advanceData
      }
    )
    )
    .subscribe(result=>{
      advancesCallBack(result)
     },err => {
      advancesCallBack(advanceData)
    },()=>{
      setTimeout(() => {$advancesSubscription.unsubscribe(); },1000);
    })
  }

  getCompanyVehicleList(vehicleListCallBack){

    const  $vehicleListSubscription= this._companyVehicleService.getVehicleActiveList().subscribe((response: any) => {
    vehicleListCallBack(response);
    },err => {
      vehicleListCallBack([]);
    },()=>{
      setTimeout(() => {$vehicleListSubscription.unsubscribe(); },1000);
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
                    initailDetails.taxOptions=taxOptions['result'].tax
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

  getMoneyAdvanceAccounts(bankAccountListCallBack) {

   let $bankAccountListSubscription= this._tripService.getClientExpenseAccounts()
    .pipe(map(data=>{
      return data['result'].bank_accounts;
    }
    ))
    .subscribe((response: any) => {
      bankAccountListCallBack(response);
    },err => {
      bankAccountListCallBack([]);
    },()=>{
      setTimeout(() => {$bankAccountListSubscription.unsubscribe(); },1000);
    });
  }

  getTransportVehicleWithEmployeeList(params,transporterVehiclesCallBack){

    let $getTransportVehicleWithEmployeeList=  this._tripService.getTransportVehicleWithEmployeeList(params).subscribe((response: any) => {
      transporterVehiclesCallBack( response.result);
    },err => {
      transporterVehiclesCallBack([]);
    },()=>{
      setTimeout(() => {$getTransportVehicleWithEmployeeList.unsubscribe(); },1000);
    });
  }

  getFromApi(fromListCallBack){

    let $consigneeSubscriptiongetFromApi = this._tripService.from().subscribe(res => {
      fromListCallBack(res.result);
    }, err => {
      fromListCallBack([]);
    },()=>{
      setTimeout(() => {$consigneeSubscriptiongetFromApi.unsubscribe(); },1000);
    });
  }

  getToApi(toListCallBack){
    let $consigneeSubscriptiongetToApi = this._tripService.to().subscribe(res => {
      toListCallBack(res.result);
    }, err => {
      toListCallBack([]);
    },()=>{
      setTimeout(() => {$consigneeSubscriptiongetToApi.unsubscribe(); },1000);
    });
  }

  getQuantityListApi(quantityListCallBack){

   let  $getQuantityListApiSubscription = this._tripService.quantity().subscribe(res => {
      quantityListCallBack( res.result)
    }, err => {
      quantityListCallBack([])
    },
    ()=>{
      setTimeout(() => {$getQuantityListApiSubscription.unsubscribe(); },1000);
    });
  }

  getClientPartyFromApi(partyListCallBack) {

   let ClientPramas = '0'; // Client
   let $getClientPartyFromApiSubscription= this._partyService.getPartyList('',ClientPramas).subscribe((response: any) => {
      partyListCallBack(response.result)
    }, err => {
      partyListCallBack([])
    },()=>{
      setTimeout(() => {$getClientPartyFromApiSubscription.unsubscribe(); },1000);
    }
    );
  }
  getEmployeeList(employeeListCallBack){

   let $employeeServiceSubscription= this._employeeService.getEmployeeList('Helper,Driver').subscribe((response) => {
        employeeListCallBack(response)
    },err=>{
      employeeListCallBack([])
    },()=>{
      setTimeout(() => {$employeeServiceSubscription.unsubscribe(); },1000);
    });
  }

  getTransporterAndSetDriver(marketVehicledriverListCallBack) {

     let $getTransporterAndSetDriverSubscription=  this._lorryChallanService.getDrivers().subscribe((response: any) => {
      marketVehicledriverListCallBack(response.result)
      },err=>{
        marketVehicledriverListCallBack([])
      },()=>{
        setTimeout(() => {$getTransporterAndSetDriverSubscription.unsubscribe(); },1000);
      }
    );
  }

  getDetailFields(fieldDetailsCallBack){

   let $getDetailFieldsSubscription= this._customFields.getCompanyTripFields(false).subscribe((data:any)=>{
    fieldDetailsCallBack(data['result'])
  },err=>{

  },()=>{
    setTimeout(() => {$getDetailFieldsSubscription.unsubscribe(); },1000);
  })
  }

  getEditConsignmentDetails(consignID,consignmentDetailsCallBack){

   let $getEditConsignmentDetailsSubscription= this._revenueService.getEditConsignmentDetails(consignID).subscribe(
      (res)=>{
        consignmentDetailsCallBack(res['result'])
      },err=>{

      },()=>{
        setTimeout(() => {$getEditConsignmentDetailsSubscription.unsubscribe(); },1000);
      })
  }

  getMaterialDetails(materialDetailsCallBack){

    let $getMaterialDetailsSubscription=  this._revenueService.getMaterials().subscribe((response)=>{
      materialDetailsCallBack(response.result);
    },err=>{
      materialDetailsCallBack([])
    },()=>{
      setTimeout(() => {$getMaterialDetailsSubscription.unsubscribe(); },1000);
    })
  }

  getTripEstimateCustomFields(tripEstimateFieldsCallBack){

   let $getTripEstimateCustomFieldsSubscription= this._revenueService.getTripEstimateCustomFieldsDetails().subscribe((response)=>{
      tripEstimateFieldsCallBack(response.result)
    },err=>{
      tripEstimateFieldsCallBack([])
    },()=>{
      setTimeout(() => {$getTripEstimateCustomFieldsSubscription.unsubscribe(); },1000);
  });
}

getOnlyTripEstimateCustomFields(tripEstimateFieldsCallBack){

 let $getOnlyTripEstimateCustomFieldsSubscription= this._revenueService.getTripEstimateCustomFieldsDetails().subscribe((response)=>{
    tripEstimateFieldsCallBack(response.result)
    },err=>{
      tripEstimateFieldsCallBack([])
    },()=>{
      setTimeout(() => {$getOnlyTripEstimateCustomFieldsSubscription.unsubscribe(); },1000);
    });
 }
 getTripEstimateFieldOptions(fieldId,tripEstimateFieldOptionCallBack){

  let $getTripEstimateFieldOptionsSubscription= this._revenueService.getTripEstimateFieldOptions(fieldId).subscribe(
    (res) => {
      tripEstimateFieldOptionCallBack(res.result)
    },err=>{

    },()=>{
      setTimeout(() => {$getTripEstimateFieldOptionsSubscription.unsubscribe(); },1000);
    })
 }


}
