import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "addDebitListFilter"
})

export class AddDebitListFilterPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value  
       }
       return value.filter(it=>{   
           const debit_note_number = it.debit_note_number.toString().toLowerCase().includes(searchString.toLowerCase());
           const status = it.status ? it.status.label.toLowerCase().includes(searchString.toLowerCase()): false;

           return ( debit_note_number || status);      
       });
    }
}