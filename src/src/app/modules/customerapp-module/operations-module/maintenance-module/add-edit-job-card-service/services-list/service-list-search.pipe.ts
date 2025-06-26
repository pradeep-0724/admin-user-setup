import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "serviceListSearch"
})

export class ServiceListSearchPipe implements PipeTransform {

    transform(value:any[],searchString:string ){

       if(!searchString){
         return value
       }
       return value.filter(it=>{
           const service_name = it.service_name.toLowerCase().includes(searchString.trim().toLowerCase());
           return (  service_name);

       });
    }
}
