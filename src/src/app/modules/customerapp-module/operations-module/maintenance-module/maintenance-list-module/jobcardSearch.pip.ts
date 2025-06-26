import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jobCardSearch'
})
export class JobCardSearch implements PipeTransform {

  transform(value:any[],searchString:string ){
    if(!searchString){
      return value
    }
    return value.filter((it) => {
      const job_card_status = it.job_card_status ? it.job_card_status.toLowerCase().includes(searchString.toLowerCase()):false;
      const  vehicle = it.vehicle ? it.vehicle.reg_number.toLowerCase().includes(searchString.toLowerCase()):false;
      const  job_card_no = it.job_card_no.toLowerCase().includes(searchString.toLowerCase());
      return job_card_status||vehicle||job_card_no;
    });
  }
}
