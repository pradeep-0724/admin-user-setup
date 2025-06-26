import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
  pure: true, 
})
export class OrderStatusFormatDataPipe implements PipeTransform {
  transform(data: any): any {
    return {
        percent: data.in_percent,
        utilized: data.utilized,
        total: data.total
      }
  }
}