import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "bosSearchListFilter"
})

export class BosSearchListFilter implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const bos_number = it.bos_number.toString().toLowerCase().includes(searchString.toLowerCase());
           return ( bos_number);
       });
    }
}
