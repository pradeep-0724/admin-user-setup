import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priorityPipe'
})
export class JobcardPriority implements PipeTransform {

  transform(value:any ){
    if(value.priority==0) return 'Highest'
    if(value.priority==1) return 'High'
    if(value.priority==2) return 'Medium'
    if(value.priority==3) return 'Low'
    if(value.priority==4) return 'Lowest'
  }
}
