import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class OnboadingPermission {
   isOnboaded =false;
   is_super_admin=false;

   getOnbodadedValue(){
     return this.isOnboaded;
   }

  setOnbodadedValue(value){
  this.isOnboaded=value
  }

  getIsSuperUserValue(){
    return this.is_super_admin;
  }

  setIsSuperUserValue(value){
 this.is_super_admin=value
 }
}
