import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { AppDateAdapter } from 'src/app/core/adapters/date.adapter';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { addErrorClass } from 'src/app/shared-module/utilities/form-utils';

@Component({
  selector: 'app-date-and-time-picker',
  templateUrl: './date-and-time-picker.component.html',
  styleUrls: ['./date-and-time-picker.component.scss'],
  providers:[{ provide: DateAdapter, useClass: AppDateAdapter }]
})
export class DateAndTimePickerComponent implements OnInit {

  @Input() control:FormControl
  @Input() min=null;
  @Input() max=null;
  @Input() disabled=false;
  @Output() dateTimeSelected=new EventEmitter()
  @Output() dateTimeSelectedChange=new EventEmitter()  
  constructor() {
   }

  ngOnInit(): void {
  }


  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }

  dateSelected(){
    this.dateTimeSelectedChange.emit(true)
    this.dateTimeSelected.emit(this.control)
  }

  onPickerOpen(picker: any): void {
    if (!this.control.value) {
      picker._selected = moment(dateWithTimeZone()).startOf('day');
    }
  }
  
}
