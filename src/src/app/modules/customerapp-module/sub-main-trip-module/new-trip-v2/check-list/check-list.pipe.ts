import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Pipe({
  name: 'checkListSearch'
})
export class CheckListSearch implements PipeTransform {

  transform(value:FormGroup[],searchString:string ){
    if(!searchString){
      return value
    }
    return value.filter((it) => {
        let formValue= it.value
        const field_label = formValue.field_label.toLowerCase().includes(searchString.toLowerCase());
      return field_label
    });
  }

}
