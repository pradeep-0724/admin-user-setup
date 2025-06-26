import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({name: 'dateandTimeFormat'})
export class DateAndTimeFormat implements PipeTransform {
  transform(data: any): any {
    if(data){
        return moment(data).format('DD/MM/YYYY, h:mm: A')
      }
      return ''
  }
}