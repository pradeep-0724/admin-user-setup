import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFilterPipe'
})
export class CustomFilterPipePipe implements PipeTransform {

  transform(value:any[],searchString:string ){

    if(!searchString){
      return value
    }
    return value.filter(it=>{
        const item = it.toString().toLowerCase().includes(searchString.toLowerCase());
        return (item);
    });
 }

}
