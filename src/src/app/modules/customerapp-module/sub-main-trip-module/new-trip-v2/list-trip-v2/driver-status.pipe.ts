import { Pipe, PipeTransform } from '@angular/core';
import { cloneDeep } from 'lodash';
import moment from 'moment';

@Pipe({
  name: 'driverStatus',
  pure: true, 
})
export class DriverStatusPipe implements PipeTransform {
  transform(data: any): any {
    const in_percent=data.driver_status.in_percent
    const driverStatus = data.driver_status.status
    let statusArray2= []
    statusArray2= cloneDeep(data.path);
    statusArray2.unshift({scheduled:this.dateChange(data.scheduled_at)});
    statusArray2.forEach((item,index)=>{
        item['isCurrentRouteIdle'] = false
        if(index <driverStatus){
          item['width']=100
        }
        if(index ==driverStatus){
            item['width']=in_percent
            if(in_percent==0){
                item['isCurrentRouteIdle'] = true
            }
        }
        if(index >driverStatus){
            item['width']=0
        }
        if(data.path.length==driverStatus){
          item['width']=100
          item['isCurrentRouteIdle'] = false
        }
      })
   return statusArray2
  }

  dateChange(date) {
    if(date){
      return moment(date).format('llll')
    }
    return '-'
  }
}
