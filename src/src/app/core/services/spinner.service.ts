import { Injectable } from '@angular/core';
import { BehaviorSubject, } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SpinnerService {
   _showSpinner=new BehaviorSubject(false);
 constructor(){

 }
}
