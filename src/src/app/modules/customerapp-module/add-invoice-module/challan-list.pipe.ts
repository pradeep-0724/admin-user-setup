import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "challanListFilter"
})

export class ChallanListFilterPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value  
       }
       return value.filter(it=>{   
           const challan_no = it.challan_no.toLowerCase().includes(searchString.toLowerCase());
           const consignee = it.consignee.toLowerCase().includes(searchString.toLowerCase());
           const consigner = it.consignor.toLowerCase().includes(searchString.toLowerCase());
           const vehicle_no = it.reg_number.toLowerCase().includes(searchString.toLowerCase());
           return ( challan_no || consignee || consigner || vehicle_no);      
       });
    }
}