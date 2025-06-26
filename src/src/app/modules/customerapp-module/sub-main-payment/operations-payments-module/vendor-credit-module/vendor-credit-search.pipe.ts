import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "vendorCreditListFilter"
})

export class VendorCreditListFilterPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const vendor_credit_number = it.vendor_credit_number.toLowerCase().includes(searchString.toLowerCase());
           const display_name = it.vendor ? it.vendor.display_name.toLowerCase().includes(searchString.toLowerCase()):false;
           const status = it.status ? it.status.label.toLowerCase().includes(searchString.toLowerCase()):false;
           return ( vendor_credit_number || display_name || status);
       });
    }
}
