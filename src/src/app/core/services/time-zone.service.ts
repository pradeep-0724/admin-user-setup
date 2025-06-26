import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TimeZoneService {

  getTodaysDate(){
      return new Date();
  }
}

export function dateWithTimeZone(){
  return new Date(new Intl.DateTimeFormat('en-US', { timeZone: localStorage.getItem('timezone')}).format(new Date()))
}

