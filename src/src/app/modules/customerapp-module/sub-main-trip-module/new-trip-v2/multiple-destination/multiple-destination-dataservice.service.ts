import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultipleDestionDataService{
 protected update_zone= new Subject();
 newUpdatedZone=this.update_zone.asObservable();

constructor() { }

upDateZones(update:any){
  this.update_zone.next(update)
}

}