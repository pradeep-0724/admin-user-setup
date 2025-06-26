import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: "driverUserSearchFilter"
})

export class DriverUserSearchFilter implements PipeTransform {
  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }
    return value.filter((it) => {
      const display_name = it.display_name.toLowerCase().includes(searchString.toLowerCase());
      const designation =it.designation?it.designation.toLowerCase().includes(searchString.toLowerCase()):false;
      const contact_number= it.contact_number?it.contact_number.toLowerCase().includes(searchString.toLowerCase()):false;
      return display_name || contact_number || designation;
    });
  }
}
