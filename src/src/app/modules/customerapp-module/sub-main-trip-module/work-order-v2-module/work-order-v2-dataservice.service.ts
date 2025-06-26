import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderV2DataService{
 protected detailsChanged=new Subject();
 protected freightChanged=new Subject();
 updateWorkOrderDetails= this.detailsChanged.asObservable(); 
 updateWorkorderFreights=this.freightChanged.asObservable(); 
  constructor(
  ) { }

newUpdate(update:boolean){
    this.detailsChanged.next(update)
}

newFreightUpdate(update:boolean){
  this.freightChanged.next(update)
}

  
  
}