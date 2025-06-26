import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewTripV2DataService{
 protected routeName=new Subject();
 protected update_route= new Subject();
 protected destinationUpdated=new Subject();
 protected tripProfile= new Subject();
 protected profitLoss= new Subject();
 protected freightUpdate = new Subject();
 protected bdpUpdate = new Subject();
 protected timeSheetUpdate = new Subject();
 protected deliveryNoteUpdate = new Subject();
 protected approvedTimeSheetsUpdate = new Subject();
 private inlineTasksAdded: boolean = false;
 private isEdit: boolean = false;
 private makeInvoiceJobData: any;
 protected documentUpdate = new Subject();
 newRouteName= this.routeName.asObservable(); 
 newUpdateRoute=this.update_route.asObservable();
 newLatestDestinatins=this.destinationUpdated.asObservable(); 
 newProfitLoss= this.profitLoss.asObservable(); 
 newTripProfile =this.tripProfile.asObservable(); 
 newFreight = this.freightUpdate.asObservable(); 
 newBdpUpdate = this.bdpUpdate.asObservable(); 
 newTimeSheet=this.timeSheetUpdate.asObservable()
 newDocument=this.documentUpdate.asObservable()
 newDeliveryNote=this.deliveryNoteUpdate.asObservable();
 approvedTimeSheets=this.approvedTimeSheetsUpdate.asObservable();

 location:any;
  constructor(
  ) { }

  get inlineTaskAdded():boolean{
     return this.inlineTasksAdded
  }

  set inlineTaskAdded(val:boolean){
    this.inlineTasksAdded =val
 }
 get isEditTrip():boolean{
    return this.isEdit
 }
 set isEditTrip(val:boolean){
  this.isEdit =val
}


 get makeInvoiceData():any{
  return this.makeInvoiceJobData
}

set makeInvoiceData(val:any){
 this.makeInvoiceJobData =val
}

setNewRouteName(routeName:string){
    this.routeName.next(routeName)
}

destinationUpdates(update:boolean){
 this.destinationUpdated.next(update)
}

upDateRoute(update:boolean){
  this.update_route.next(update)
}
upDateDocument(update:boolean){
  this.documentUpdate.next(update)
}

upDateProfitLoss(update:boolean){
  this.profitLoss.next(update)
}

upDateTripProfile(update:boolean){
  this.tripProfile.next(update)
}

upDateFreight(update:boolean){
  this.freightUpdate.next(update)
}

upDateBDP(update:boolean){
  this.bdpUpdate.next(update)
}

setLocation(location){
  this.location=location
}

updateTimeSheet(update:boolean){
 this.timeSheetUpdate.next(update)
}

updateDeliveryNote(update:boolean){
  this.deliveryNoteUpdate.next(update)
 }

 updateApprovedTimeSheet(update:boolean){
  this.approvedTimeSheetsUpdate.next(update)
 }


getLocation(){
  return this.location
}
  
}