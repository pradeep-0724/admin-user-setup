import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "materialListPipe"
})

export class MaterialListPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const name = it.name.toLowerCase().includes(searchString.trim().toLowerCase());
           const unit = it['unit']['label'].toLowerCase().includes(searchString.trim().toLowerCase());
          if(it['hsn_code']){
             const hsn = it['hsn_code'].toLowerCase().includes(searchString.trim().toLowerCase());
             const name = it.name.toLowerCase().includes(searchString.trim().toLowerCase());
             const unit = it['unit']['label'].toLowerCase().includes(searchString.trim().toLowerCase());

             return hsn || name || unit
          }
           return ( name||unit );

       });
    }
}
