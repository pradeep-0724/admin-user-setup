import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tenure',
  pure: true, 
})
export class FormatDataTenurePipe implements PipeTransform {
  transform(data: any): any {
    return {
        percent: data.in_percent,
        utilized: data.completed_days,
        total: data.total_days
      }
  }
}