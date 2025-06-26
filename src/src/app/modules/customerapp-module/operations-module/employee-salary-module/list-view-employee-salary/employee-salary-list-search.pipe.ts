import { Pipe, PipeTransform } from '@angular/core';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Pipe({
  name: 'employeeSalaryListSearch'
})
export class EmployeeSalaryListSearchPipe implements PipeTransform {

  transform(value:any[],searchString:string ){

    if(!searchString){
      return value
    }
    return value.filter(it=>{
        const date = it.date.toString().toLowerCase().includes(searchString.toLowerCase());
        const reference_no = it.reference_no.toString().toLowerCase().includes(searchString.toLowerCase());
        const salary_year_month = it.salary_year_month.toString().toLowerCase().includes(searchString.toLowerCase());
        const allowance_year_month = isValidValue(it.allowance_year_month)?it.allowance_year_month.toString().toLowerCase().includes(searchString.toLowerCase()):false;
        const employees =it.employees.toString().toLowerCase().includes(searchString.toLowerCase());
        return (date||reference_no ||salary_year_month ||allowance_year_month ||employees);
    });
 }
}
