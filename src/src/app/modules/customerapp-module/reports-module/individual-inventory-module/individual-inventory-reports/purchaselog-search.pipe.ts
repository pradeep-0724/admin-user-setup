import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "purchaseLogListPipe"
})

export class PurchaseLogListPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const Vendor = it.Vendor.toLowerCase().includes(searchString.trim().toLowerCase());
           return ( Vendor );
        
       });
    }
}
