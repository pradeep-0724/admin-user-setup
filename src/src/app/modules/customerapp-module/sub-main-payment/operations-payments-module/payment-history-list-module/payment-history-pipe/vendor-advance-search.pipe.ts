import { Pipe, PipeTransform } from '@angular/core';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Pipe({
    name: "vendorAdvanceListFilter"
})

export class VendorAdvanceListFilterPipe implements PipeTransform {

    transform(value: any[], searchString: string) {

        if (!searchString) {
            return value
        }

        return value.filter(it=>{
            const display_name = it.party.display_name.toString().toLowerCase().includes(searchString.toLowerCase());
            const payment_no = it.advance_number.toLowerCase().includes(searchString.toLowerCase());
            const payment_mode =isValidValue(it.payment_mode)?it.payment_mode.name.toLowerCase().includes(searchString.toLowerCase()):false
            return (display_name || payment_no ||payment_mode);
        })
    }
}
