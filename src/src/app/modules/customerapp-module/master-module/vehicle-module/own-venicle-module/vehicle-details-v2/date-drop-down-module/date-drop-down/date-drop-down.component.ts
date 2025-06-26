import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel, DateRange } from '@angular/material/datepicker';
import moment from 'moment';
import { FinancialYearService } from 'src/app/core/services/financial-year.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
const today = moment();;
@Component({
  selector: 'app-date-drop-down',
  templateUrl: './date-drop-down.component.html',
  styleUrls: ['./date-drop-down.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy
    },
    DefaultMatCalendarRangeStrategy,
    MatRangeDateSelectionModel
  ]
})
export class DateDropDownComponent implements OnInit {

  constructor(private readonly selectionModel: MatRangeDateSelectionModel<Date>, private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>, private elementRef: ElementRef, private _financialYearService: FinancialYearService) { }
  @Input() selectedDateRangeType = 0;
  selectedOpt = '';
  selectedDateRange: DateRange<Date>;
  show = false;
  dateRangeAndType = {
    startDate: moment(),
    endDate: moment(),
    dateRangeType: ''
  }
  isCustomCalanderOpen = false;
  openCustomCalanderSlide = false;
  @Output() dateSelectedEmitter = new EventEmitter()
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (!this.isCustomCalanderOpen) {
        setTimeout(() => {
          this.show = false
          this.openCustomCalanderSlide = false;
        }, 100);

      }

    }
  }


  ngOnInit(): void {
    if (this.selectedDateRangeType == 0) {
      this.getSelectedDateRangeAndType(0, '7 Days', 'days')
    } else if (this.selectedDateRangeType == 1) {
      this.getSelectedDateRangeAndType(2, 'This Month', 'month');
    } else if (this.selectedDateRangeType == -1) {
      this.getSelectedDateRangeAndType(-1, '7 Days', 'days')
    }
    else if (this.selectedDateRangeType == 10) {
      this.getSelectedDateRangeAndType(10, 'This financial year', 'year');
    }
    else {
      this.getSelectedDateRangeAndType(0, '7 Days', 'days')
    }
  }

  rangeChanged(selectedDate: Date) {
    const selection = this.selectionModel.selection,
      newSelection = this.selectionStrategy.selectionFinished(
        selectedDate,
        selection
      );

    this.selectionModel.updateSelection(newSelection, this);
    this.selectedDateRange = new DateRange<Date>(newSelection.start, newSelection.end);

    if (this.selectionModel.isComplete()) {
      this.selectedOpt = "Custom";
      this.openCustomCalanderSlide = false;
      this.dateRangeAndType.startDate = moment(this.selectedDateRange.start);
      this.dateRangeAndType.endDate = moment(this.selectedDateRange.end)
      this.dateRangeAndType.dateRangeType = "Custom"
      this.isCustomCalanderOpen = false;
      this.show = false;
      this.dateSelectedEmitter.emit(this.dateRangeAndType)
    }
  }


  getSelectedDateRangeAndType(type, label, selectionType) {
    this.selectedOpt = label
    this.dateRangeAndType.dateRangeType = label
    if (type == 0) {
      this.dateRangeAndType.startDate = today.clone().subtract(6, 'days');
      this.dateRangeAndType.endDate = today.clone().subtract(0, 'days')

    }
    if (type == -1) {
      this.dateRangeAndType.startDate = null;
      this.dateRangeAndType.endDate = null
    }

    if (type >= 1 && type <= 4) {
      this.dateRangeAndType.startDate = today.clone().startOf(selectionType);
      this.dateRangeAndType.endDate = today.clone().endOf(selectionType);
    }
    if ((type >= 5 && type <= 7) || type == 9) {
      this.dateRangeAndType.startDate = today.clone().subtract(1, selectionType).startOf(selectionType);
      this.dateRangeAndType.endDate = today.clone().subtract(1, selectionType).endOf(selectionType);
    }
    if (type == 8) {
      let startOfPreviousQuarter, endOfPreviousQuarter;
      startOfPreviousQuarter = today.clone().subtract(1, 'quarter').startOf('quarter');
      endOfPreviousQuarter = today.clone().subtract(1, 'quarter').endOf('quarter');
      this.dateRangeAndType.startDate = startOfPreviousQuarter
      this.dateRangeAndType.endDate = endOfPreviousQuarter
    }
    if (type == 10) {

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const { start: fyStartMonth, end: fyEndMonth } = this._financialYearService.financialYear;

    let fyStartYear: number;
    let fyEndYear: number;

    if (fyStartMonth <= fyEndMonth) {
      // Example: Jan–Dec (UAE)
      if (currentMonth < fyStartMonth) {
        fyStartYear = currentYear - 1;
        fyEndYear = currentYear - 1;
      } else {
        fyStartYear = currentYear;
        fyEndYear = currentYear;
      }
    } else {
      if (currentMonth >= fyStartMonth) {
        fyStartYear = currentYear;
        fyEndYear = currentYear + 1;
      } else {
        fyStartYear = currentYear - 1;
        fyEndYear = currentYear;
      }
    }

    const startDate = new Date(fyStartYear, fyStartMonth - 1, 1);
    const endDate = new Date(fyEndYear, fyEndMonth, 0);

    this.dateRangeAndType.startDate = moment(startDate);
    this.dateRangeAndType.endDate = moment(endDate);
    }
    
    this.dateSelectedEmitter.emit(this.dateRangeAndType);
    this.selectedDateRange = new DateRange<Date>(new Date(dateWithTimeZone()), new Date(dateWithTimeZone()));
    this.openCustomCalanderSlide = false;
    this.show = false
  }

  openCustomCalander() {
    this.openCustomCalanderSlide = true
  }

  yearSelected(e) {
    this.isCustomCalanderOpen = true;
    setTimeout(() => {
      this.isCustomCalanderOpen = false;
    }, 10);
  }
  monthSelected(e) {
    this.isCustomCalanderOpen = true;
    setTimeout(() => {
      this.isCustomCalanderOpen = false;
    }, 10);
  }
  viewChanged(e) {
    this.isCustomCalanderOpen = true;
    setTimeout(() => {
      this.isCustomCalanderOpen = false;
    }, 10);
  }
}
