import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employeeOtherlistSearch'
})
export class EmployeeOthersPipe implements PipeTransform {

  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }
    return value.filter((it) => {
       const reference_no= it.reference_no.toLowerCase().includes(searchString.toLowerCase())
       const date = it.date.toLowerCase().includes(searchString.toLowerCase());
       const  expense_type = it.expense_type.toLowerCase().includes(searchString.toLowerCase());
       const payment_mode =it.payment_mode.name.toLowerCase().includes(searchString.toLowerCase());
      return reference_no || date ||expense_type ||payment_mode;
    });
  }
}
