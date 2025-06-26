import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "inventoryTyreListSearch"
})

export class InventoryTyreListSearchPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const tyre_number=it.unique_no?it.unique_no.toLowerCase().includes(searchString.trim().toLowerCase()):false;
           const manufacturer=it.manufacturer?it.manufacturer.label.toLowerCase().includes(searchString.trim().toLowerCase()):false;
           const model=it.model?it.model.name.toLowerCase().includes(searchString.trim().toLowerCase()):false;
           return ( tyre_number|| manufacturer||model);

       });
    }
}
