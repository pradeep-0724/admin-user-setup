import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "issueLogListPipe"
})

export class IssueLogListPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const vehicle = it.vehicle.toLowerCase().includes(searchString.trim().toLowerCase());
           const date = it.date.toLowerCase().includes(searchString.trim().toLowerCase());

           return (  vehicle || date );
        
       });
    }
}
