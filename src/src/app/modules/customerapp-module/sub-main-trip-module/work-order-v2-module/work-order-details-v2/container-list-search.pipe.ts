import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'containerSearch',
  pure: true, 
})
export class ContainerSearchPipe implements PipeTransform {
    transform(value:any[],searchString:string ){
        if(!searchString){
          return value
        }
        return value.filter((it) => {
          const name = it.name.toLowerCase().includes(searchString.toLowerCase());
          const size = it.size.toLowerCase().includes(searchString.toLowerCase());
          const  type = it.type ? it.type.label.toLowerCase().includes(searchString.toLowerCase()):false;
          return name || type || size;
        });
      }
}