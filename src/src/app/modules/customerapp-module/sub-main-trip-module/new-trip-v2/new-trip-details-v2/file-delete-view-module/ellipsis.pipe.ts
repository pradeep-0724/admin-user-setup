import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string,size:number): string {
    if(!value) return ''
    if (value.length > 10) {
      return value.substring(0, size) + '...';
    }
    return value;
  }

}
