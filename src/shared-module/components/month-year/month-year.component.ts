import {Component,OnInit, Output, EventEmitter,Input,OnChanges} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment'
import {default as _rollupMoment, Moment} from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-month-year',
  template:`
  <mat-label class="input--required" *ngIf="labelName=='Null'">Month</mat-label>
  <mat-label class="input--required" *ngIf="labelName!='Null'">{{labelName}}</mat-label>
  <mat-form-field>
  <input matInput [matDatepicker]="dp" [formControl]="date" readonly (focus)="dp.open()">
  <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
  <mat-datepicker #dp
                  startView="year"
                  (yearSelected)="chosenYearHandler($event)"
                  (monthSelected)="chosenMonthHandler($event, dp)"
                  >
  </mat-datepicker>
</mat-form-field>
  `,
  styles:['mat-label {font-size: 13px;color: #676A6E;font-weight:600;line-height: 27px;margin: 0;margin-bottom: 10px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MonthYearComponent implements OnInit,OnChanges{
  date : UntypedFormControl;
 
  @Output() monthAndYear  = new EventEmitter<any>();
  @Input() initialDate :string;
  @Input() labelName ='Null'
  @Input() isRequired =false
  @Output() onMonthSelect = new EventEmitter<any>();
  constructor() {
  }

  ngOnInit() {
   this.dateOnChange();
  }
  ngOnChanges(){
    this.dateOnChange();
  }
  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.monthAndYear.emit(this.date.value);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.monthAndYear.emit(this.date.value);
    this.onMonthSelect.emit(this.date.value);
    datepicker.close();

  }
  dateOnChange(){
    if (this.initialDate == null) {
      this.initialDate = ""
    }
    let removeLoad= document.getElementsByTagName("body")[0];
    removeLoad.classList.add('removeLoader');
    if (this.initialDate == ''){
      this.date = new UntypedFormControl(moment(new Date(dateWithTimeZone())));
      this.monthAndYear.emit(this.date.value);
    }else{
      this.date = new UntypedFormControl(moment(new Date(this.initialDate)));
      this.monthAndYear.emit(this.date.value);
    }
  }
}
