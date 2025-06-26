import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number | string, formatType: 'american' | 'indian' = 'american'): string {
    if (!value && value !== 0) return '-';
    return formatNumber(Number(value), formatType,);
  }
}

export function formatNumber(value: number, formatType: 'american' | 'indian' = 'american',decimal:number=3): string {
  if (isNaN(value)) return '-';
  const options = {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal
  };
  if(!environment.currencyConverter)
    return value.toString()
  if (formatType === 'american') {
    return value.toLocaleString('en-US',options);
  } else {
    return value.toLocaleString('en-IN',options);
  }
}

