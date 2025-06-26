import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'widgetFilterPipe'
})
export class WidgetFilterPipe implements PipeTransform {

  transform(value:any[],searchString:string ){

    if(!searchString){
      return value
    }
    return value.filter(it=>{
        const item = it.name.toString().toLowerCase().includes(searchString.toLowerCase());
        return (item);
    });
 }

}
