import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewTripDataService {

  private selfFuel =[];
  private marketVehicleFuel =[];
  private partyAdvanceDeriver=''
  private partyAdvanceFuel=[];
  private selfDriver =[];
  private otherExpense =[];
  private chargeAddBill =[];
  private partychargeAddBill =[];
  private reduceCharge =[];
  private transporteRreduceCharge =[];
  private advance =[];
  private vehicleProviderList =[];
  private setVehicleProviderDetails={};
  private setCustomer ={}

  constructor() { }
  set selfFuelData(fuellist){
      this.selfFuel = fuellist;
  }

  get selfFuelData(){
    return  this.selfFuel
  }

  set marketVehicleFuelData(marketVehicleFuel){
    this.marketVehicleFuel = marketVehicleFuel;
}

get marketVehicleFuelData(){
  return  this.marketVehicleFuel
}

set partyAdvanceFuelData(partyfuellist){
    this.partyAdvanceFuel = partyfuellist;
}

get partyAdvanceFuelData(){
  return  this.partyAdvanceFuel
}

set selfDriverData(selfDriverDataList){
   this.selfDriver =selfDriverDataList
}

get selfDriverData(){
 return this.selfDriver
}
set partyAdvanceDataDeriver(value){
   this.partyAdvanceDeriver = value
}
get partyAdvanceDataDeriver(){
  return this.partyAdvanceDeriver
}

set otherExpenseData(value){
  this.otherExpense = value
}
get otherExpenseData(){
 return this.otherExpense
}

set chargeData(value){
  this.chargeAddBill = value
}
get chargeData(){
 return this.chargeAddBill
}

set partychargeData(value){
  this.partychargeAddBill = value
}
get partychargeData(){
 return this.partychargeAddBill
}

set reduceChargeData(value){
  this.reduceCharge = value
}
get reduceChargeData(){
 return this.reduceCharge
}

set transporterreduceChargeData(value){
  this.transporteRreduceCharge = value
}
get transporterreduceChargeData(){
 return this.transporteRreduceCharge
}

set advanceData(value){
  this.advance = value
}
get advanceData(){
 return this.advance
}

set vehicleProvideradvanceData(value){
  this.vehicleProviderList = value
}

get vehicleProvideradvanceData(){
 return this.vehicleProviderList
}

set vehicleProvider(value){
    this.setVehicleProviderDetails = value
}

get vehicleProvider(){
  return  this.setVehicleProviderDetails
}

set customerDetails(value:any){
  this.setCustomer = value
}

get customerDetails(){
  return this.setCustomer
}

}
