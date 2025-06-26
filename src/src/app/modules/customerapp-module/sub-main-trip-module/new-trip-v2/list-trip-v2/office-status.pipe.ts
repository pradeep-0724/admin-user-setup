import { Pipe, PipeTransform } from '@angular/core';
import { cloneDeep } from 'lodash';
import moment from 'moment';

@Pipe({
  name: 'officeStatus',
  pure: true, 
})
export class OfficeStatusPipe implements PipeTransform {
  transform(data: any): any {
    let statusArray2= []
    statusArray2= cloneDeep(data.path);
    statusArray2.unshift({scheduled:this.dateChange(data.scheduled_at)});
    statusArray2.forEach((item,index)=>{
        if(index <= data.office_status){
          item['office_status']=100
        }
      })
   return statusArray2
  }

  dateChange(date) {
    if(date){
      return moment(date).tz(localStorage.getItem('timezone')).format('llll')
    }
    return '-'
  }
}