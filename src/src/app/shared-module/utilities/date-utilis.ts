import * as moment from "moment";

export function changeDateToServerFormat(date: string): string {
  if (date == null)
    return null;
  if (date)
    return moment(date).format('YYYY-MM-DD');
  return '';
}

export function changeDateTimeToServerFormat(date: any): string {
  if (date == null) return null
  if (date){
    if(typeof date=='string'){
      date = moment(date)
    }
    let dateTime: moment.Moment = date;
    return dateTime.format('YYYY-MM-DDTHH:mm')
  }
  return '';
}

export function addCountryCode(phone: any): string {
  return phone.toString().includes('+91') ? phone : '+91' + phone;
}

export function normalDate(date: string): string {
  if (date) {
    return moment(date).format('DD-MM-YYYY');
  }
  else {
    return '-'
  }
}

export function monthDate(date: string): string {
  if (date)
    return moment(date).format('DD MMM YYYY');
}

export function bindFormControlValue(form, control, value) {

}

export function PaymentDueDateCalculator(date: any, daysflag: number): string {
  //console.log('date:',date, daysflag);
  /* daysflag key defination default date
  daysflag = {
   0: 'Due on receipt' [current selected date],
  -1: 'Due end of the month [selected (date=>month) of the last day date]',
  -2: 'Due end of next month [selected (date=>month) of the next month last day date]',
  -3: 'Custom' [user define date] } */
  if (!date)
    return null;
  date = new Date(date)
  if (date)
    switch (daysflag) {
      case 0:
        return moment(date).format('YYYY-MM-DD');
      case -1:
        let new_date1 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return moment(new_date1).format('YYYY-MM-DD');
      case -2:
        let new_date2 = new Date(date.getFullYear(), date.getMonth() + 2, 0)
        return moment(new_date2).format('YYYY-MM-DD');
      case -3:
        return '';

      case 1:
        // one day before
        console.log('dasda');
        let new_date3 = date.setDate(date.getDate() - 1)
        return moment(new_date3).format('YYYY-MM-DD');

      case -7:
        // one week before
        let new_date4 = date.setDate(date.getDate() - 7)
        return moment(new_date4).format('YYYY-MM-DD');

      case -15:
        // one week before
        let new_date5 = date.setDate(date.getDate() - 15)
        return moment(new_date5).format('YYYY-MM-DD');

      case -30:
        // one month before
        // let new_date6 =  new Date(date.getFullYear(), date.getMonth()-1, 0);
        let new_date6 = new Date(date.setMonth(date.getMonth() - 1));
        return moment(new_date6).format('YYYY-MM-DD');

      default:
        if (daysflag < 0)
          return moment(date).format('YYYY-MM-DD');
        let new_date7 = date.setDate(date.getDate() +(Number(daysflag)))
        return moment(new_date7).format('YYYY-MM-DD');
    }
}


export function podTripCalculator(date: any, daysflag: number): string {
  if (!date)
    return null;
  date = new Date(date)
  if (date)
    switch (daysflag) {
      case 1:
        return moment(date).format('YYYY-MM-DD');
      case 2:
        let new_date3 = date.setDate(date.getDate() + 7)
        return moment(new_date3).format('YYYY-MM-DD');

      case 3:
        let new_date4 = date.setDate(date.getDate() + 15)
        return moment(new_date4).format('YYYY-MM-DD');

      case 7:
        let end_trip_pod_1 = date.setDate(date.getDate() + 1)
        return moment(end_trip_pod_1).format('YYYY-MM-DD');
      case 8:
        let end_trip_pod_2=date.setDate(date.getDate() + 2)
        return moment(end_trip_pod_2).format('YYYY-MM-DD');

      case 9:
        let end_trip_pod_3 = date.setDate(date.getDate() + 3)
        return moment(end_trip_pod_3).format('YYYY-MM-DD');

      case 4:
        let new_date5 = date.setDate(date.getDate() + 7)
        return moment(new_date5).format('YYYY-MM-DD');

      case 5:
        let new_date6 = date.setDate(date.getDate() + 15)
        return moment(new_date6).format('YYYY-MM-DD');
      case 6:
        return '';

      default:
        if (daysflag < 0)
          return moment(date).format('YYYY-MM-DD');
        let new_date7 = date.setDate(date.getDate() + Number(daysflag))
        return moment(new_date7).format('YYYY-MM-DD');
    }
}

export function ValidityDateCalculator(date: any, daysflag: number): string {
  if (!date)
    return null;
  date = new Date(date);
  if (date)
    switch (daysflag) {
      case 15:
        let new_date_15_days = date.setDate(date.getDate() + 15);
        return moment(new_date_15_days).format('YYYY-MM-DD');
      case 7:
        let new_date_7_days = date.setDate(date.getDate() + 7);
        return moment(new_date_7_days).format('YYYY-MM-DD');
      case 1:
        let new_date_30_days = date.setDate(date.getDate() + 30);
        return moment(new_date_30_days).format('YYYY-MM-DD');
      case 3:
        let new_date_3_month = date.setMonth(date.getMonth() + 3);
        return moment(new_date_3_month).format('YYYY-MM-DD');
      case 6:
        let new_date_6_month = date.setMonth(date.getMonth() + 6);
        return moment(new_date_6_month).format('YYYY-MM-DD');
      case 12:
        let new_date_12_month = date.setMonth(date.getMonth() + 12);
        return moment(new_date_12_month).format('YYYY-MM-DD');
      case 24:
        let new_date_24_month = date.setMonth(date.getMonth() + 24);
        return moment(new_date_24_month).format('YYYY-MM-DD');
      case 45:
        let new_date_45_month = date.setDate(date.getDate() + 45);
        return moment(new_date_45_month).format('YYYY-MM-DD');
      case 60:
        let new_date_60_month = date.setDate(date.getDate() + 60);
        return moment(new_date_60_month).format('YYYY-MM-DD');
      case 30:
        let date_30_days = date.setDate(date.getDate() + 30);
        return moment(date_30_days).format('YYYY-MM-DD');
      case -1:
        let end_next_end_month = new Date(date.getFullYear(), date.getMonth() + 2, 0);
        return moment(end_next_end_month).format('YYYY-MM-DD');
      case -2:
        let end_curr_end_month = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return moment(end_curr_end_month).format('YYYY-MM-DD');
      case -3:
        let new_date_0_days = date.setDate(date.getDate());
        return moment(new_date_0_days).format('YYYY-MM-DD');
      default: return null
    }

}

export function ValidityDateJobCardCalculator(date: any, daysflag: number): string {
  if (!date)
    return null;
  if (daysflag==-1)
    return null;
  date = new Date(date);
  if (date){
    let new_date = date.setDate(date.getDate() + Number(daysflag));
    return moment(new_date).format('YYYY-MM-DD');
  }
 
}
export function getTimeDifference(startDateTime, endDateTime) {
  var startDate = moment(startDateTime);
  var endDate = moment(endDateTime);
   if(startDate.isAfter(endDate)){
    return { days: null, hours: null, minutes: null };
   }else{
    var duration = moment.duration(endDate.diff(startDate));
    var days = duration.days();
    var hours = duration.hours();
    var minutes = duration.minutes();
    return { days: days, hours: hours, minutes: minutes };
   }
 
}
