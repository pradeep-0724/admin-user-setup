import {Component,OnInit, Output, EventEmitter,Input,OnChanges} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment'
import {default as _rollupMoment, Moment} from 'moment';

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
  selector: 'app-month-null',
  template:`
  <mat-label >{{labelName}}</mat-label>
  <mat-form-field>
  <input matInput [matDatepicker]="dp" [formControl]="date" (focus)="dp.open()" (ngModelChange)="change()">
  <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
  <mat-datepicker #dp
                  startView="year"
                  (yearSelected)="chosenYearHandler($event)"
                  (monthSelected)="chosenMonthHandler($event, dp)"
                  >
  </mat-datepicker>
</mat-form-field>
  `,
  styles:['mat-label {font-size: 13px;line-height: 27px;font-weight:600;margin: 0;margin-bottom: 10px;color: #676A6E;;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MonthNullComponent implements OnInit,OnChanges{
  date : UntypedFormControl;
 
  @Output() monthAndYear  = new EventEmitter<any>();
  @Input() initialDate :string;
  @Output() onMonthSelect = new EventEmitter<any>();
  @Input() labelName :string
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
    if (!ctrlValue) {
        this.date.setValue(normalizedYear);
    } else {
      ctrlValue.year(normalizedYear.year());
      this.date.setValue(ctrlValue);
    }
    this.monthAndYear.emit(this.date.value);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    if (!ctrlValue) {
        this.date.setValue(normalizedMonth);
    } else {
      ctrlValue.month(normalizedMonth.month());
      this.date.setValue(ctrlValue);
    }
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
      this.date = new UntypedFormControl(null);
      this.monthAndYear.emit(this.date.value);
    }else{
      this.date = new UntypedFormControl(moment(new Date(this.initialDate)));
      this.monthAndYear.emit(this.date.value);
    }
  }

  change(){
    if(!this.date.value){
      this.monthAndYear.emit(null);
    }
  }
}
