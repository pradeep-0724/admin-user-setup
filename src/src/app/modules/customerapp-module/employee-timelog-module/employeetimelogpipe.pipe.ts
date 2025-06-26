import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeetimelogpipe'
})
export class EmployeetimelogpipePipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }

    return value.filter((it) => {
        const employee_name = it.employee_name?it.employee_name.toLowerCase().includes(searchString.toLowerCase()):false;
       
        return employee_name;
    })
  }

}
