import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MobileNavService {
   _mobilesidenavActive=new BehaviorSubject(false);
   $showMobileNab=this._mobilesidenavActive.asObservable();
   _newNav=new BehaviorSubject(false);
   $cloceMainMobNav=this._newNav.asObservable();
 constructor(){

 }
}
