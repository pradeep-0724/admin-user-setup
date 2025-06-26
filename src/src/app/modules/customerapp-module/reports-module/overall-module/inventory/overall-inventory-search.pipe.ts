import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "inventoryPipe"
})

export class OverallInventoryPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const item_name = it.item_name.toLowerCase().includes(searchString.trim().toLowerCase());
           return ( item_name );
        
       });
    }
}
