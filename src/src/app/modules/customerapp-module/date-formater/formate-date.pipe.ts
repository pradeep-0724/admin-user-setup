import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formateDate'
})
export class FormateDatePipe implements PipeTransform {

  transform(value: string): string {
    if(!value) return '-'
    return moment(value).format('DD-MM-YYYY');
  }

}
