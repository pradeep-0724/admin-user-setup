import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "spareUsageLogListPipe"
})

export class SpareUsageLogListPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           console.log(it);
           const date = it.date.toLowerCase().includes(searchString.trim().toLowerCase());
           return ( date );
        
       });
    }
}
