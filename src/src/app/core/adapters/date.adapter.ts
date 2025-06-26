import { Inject, Injectable, Optional } from "@angular/core";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MAT_DATE_LOCALE } from "@angular/material/core";
import moment, { Moment } from "moment-timezone";

@Injectable({
  providedIn:'any'
})
export class AppDateAdapter extends MomentDateAdapter {
  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super(dateLocale);
  }
  createDate(year: number, month: number, date: number): moment.Moment {
    if (month < 0 || month > 11) {
      throw Error(
        `Invalid month index "${month}". Month index has to be between 0 and 11.`
      );
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const monthString = ("0" + (month + 1)).slice(-2);
    const yearSting = ("0" + date).slice(-2);
    const dateString = `${year}-${monthString}-${yearSting} 00:00`;
    const result = moment.tz(dateString,  localStorage.getItem('timezone'));

    // If the result isn't valid, the date must have been out of bounds for this month.
    if (!result.isValid()) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  deserialize(value: any): moment.Moment | null {
    let date;
    if (value instanceof Date) {
      date = this._createMoment2(value).locale(this.locale);
    } else if (this.isDateInstance(value)) {
      return this.clone(value);
    }
    if (typeof value === "string") {
      if (!value) {
        return null;
      }
      date = this._createMoment2(value, moment.ISO_8601).locale(this.locale);
    }
    if (date && this.isValid(date)) {
      return this._createMoment2(date).locale(this.locale);
    }
    return super.deserialize(value);
  }

  parse(value: any, parseFormat: string | string[]): moment.Moment | null {
    if (value && typeof value === "string") {
      return this._createMoment2(value, parseFormat, this.locale);
    }
    return value ? this._createMoment2(value).locale(this.locale) : null;
  }

  today(): moment.Moment {
    return moment()
      .utc()
      .tz( localStorage.getItem('timezone'))
      .local(this.locale);
  }
  getHour(date: Moment): number {
    return  date.hour(); ;
  }
  getMinute(date: Moment): number {
    return  date.minute(); ;
  }
  getSecond(date: Moment): number {
    return  date.second();;
  }

  setHour(date:Moment , value: number) {
    date.set({ hour: value });
  }
  setMinute(date:Moment , value: number) {
    date.set({ minute: value });
  }
  setSecond(date:Moment , value: number) {
    date.set({ second: value });
  }


  copyTime(toDate: Moment, fromDate: Moment) {
    this.setHour(toDate, this.getHour(fromDate));
    this.setMinute(toDate, this.getMinute(fromDate));
    this.setSecond(toDate, this.getSecond(fromDate));
  }

  isSameTime(a: Moment, b: Moment): boolean {
    if (a == null || b == null) return true;
    return this.getHour(a) === this.getHour(b)
      && this.getMinute(a) === this.getMinute(b)
      && this.getSecond(a) === this.getSecond(b);
  }
  compareDateWithTime(first: Moment, second: Moment, showSeconds?: boolean): number {
    let res = super.compareDate(first, second) ||
      this.getHour(first) - this.getHour(second) ||
      this.getMinute(first) - this.getMinute(second);
    if (showSeconds) {
      res = res || this.getSecond(first) - this.getSecond(second);
    }
    return res;
  }

  clone(date) : moment.Moment {
    return moment(date)
  }

  format(date, displayFormat) {
    date = this.clone(date);
    if (!this.isValid(date)) {
        throw Error('MomentDateAdapter: Cannot format invalid date.');
    }
    return date.format("DD/MM/YYYY");
}

  setTimeByDefaultValues(date: Moment, defaultTime: number[]) {
    if (!Array.isArray(defaultTime)) {
      throw Error('@Input DefaultTime should be an array');
    }
    this.setHour(date, defaultTime[0] || 0);
    this.setMinute(date, defaultTime[1] || 0);
    this.setSecond(date, defaultTime[2] || 0);
  }

  private _createMoment2(
    date: moment.MomentInput,
    format?: moment.MomentFormatSpecification,
    locale?: string
  ): moment.Moment {
    const date2 = moment(date, format, locale).format("DD/MM/YYYY");
    return  moment.tz(date2, localStorage.getItem('timezone'));
  }
}

