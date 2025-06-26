import { Injectable } from '@angular/core';
import {  Subject, } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TokenExpireService {
   isTokenExpire= new Subject();
   observeTokenExpire= this.isTokenExpire.asObservable();
  constructor(){

 }

}
