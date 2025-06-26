import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AddressLengthService {

 protected adressObject;
 protected defaultAddress=[{key: "address_length", value: "70"}]
  set adressLength(address){
    if(address.length){
      this.adressObject = this.getAddressObject(this.defaultAddress)
    }else{
      this.adressObject = this.getAddressObject(this.defaultAddress)
    }

  }
  get adressLength(){
    return  this.adressObject
  }

  getAddressObject(items=[]){
    let adressLength={}
    items.forEach(element=>{
      adressLength[element.key]=element.value
     });

     return adressLength
  }
}
