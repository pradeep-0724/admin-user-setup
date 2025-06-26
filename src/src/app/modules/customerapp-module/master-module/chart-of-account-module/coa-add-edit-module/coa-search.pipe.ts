import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "chartOfAccountListFilter"
})

export class ChartOfAccountListFilterPipe implements PipeTransform {
  transform(value: any[], searchString: string){
    if(!searchString){
      return value
    }
    return value.filter(it=>{
     const name = it.value.name.toLowerCase().includes(searchString.toLowerCase());
      return name;
    });
  }
}
