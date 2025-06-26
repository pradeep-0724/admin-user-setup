import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attendenceSearchPipe'
})
export class AttendenceSearchPipePipe implements PipeTransform {

  transform(value:any[],searchString:string ){

    if(!searchString){
      return value
    }
    return value.filter(it=>{
        const name = it.name.toString().toLowerCase().includes(searchString.toLowerCase());
        return (name);
    });
 }

}
