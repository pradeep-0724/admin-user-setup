import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY, DefaultMatCalendarRangeStrategy, MatRangeDateSelectionModel, DateRange } from '@angular/material/datepicker';
import { ActivatedRoute, ParamMap } from '@angular/router';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
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
export class DateDropDownComponent implements OnInit{
 
  constructor(private readonly selectionModel: MatRangeDateSelectionModel<Date>,  private readonly selectionStrategy: DefaultMatCalendarRangeStrategy<Date>, private elementRef: ElementRef,
    private route : ActivatedRoute) { }

  selectedDateRangeType=0;
  selectedOpt = 'Select a Date Range';
  selectedDateRange: DateRange<Date>;
  show = false;
  dateRangeAndType = {
    startDate: null,
    endDate:null,
    dateRangeType: ''
  }
  isCustomCalanderOpen=false;
  openCustomCalanderSlide=false;
  @Output() dateSelectedEmitter= new EventEmitter()
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if(!this.isCustomCalanderOpen){
        setTimeout(() => {
          this.show = false
          this.openCustomCalanderSlide=false;
        }, 100);
      
      }
    
    }
  }


  ngOnInit(): void {    
    this.route.queryParamMap.subscribe((paramMap: ParamMap) => {            
      if(paramMap.has('label') && isValidValue(paramMap.get('label'))){
        
          this.dateRangeAndType.startDate = paramMap.get('start_date');
          this.dateRangeAndType.endDate = paramMap.get('end_date')
       
      }else{
        this.dateRangeAndType.startDate = "";
          this.dateRangeAndType.endDate = ""

      }
      
    })
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
      this.selectedOpt ="Custom";
      this.openCustomCalanderSlide=false;
      this.dateRangeAndType.startDate = moment(this.selectedDateRange.start);
      this.dateRangeAndType.endDate = moment(this.selectedDateRange.end)
      this.dateRangeAndType.dateRangeType = "Custom"
      this.isCustomCalanderOpen= false;
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
    if(type>9 && type<=12){
      this.dateRangeAndType.startDate = today.clone().add(selectionType,'days')
      this.dateRangeAndType.endDate = today.clone().add(selectionType,'days');      
    }
    this.dateSelectedEmitter.emit(this.dateRangeAndType);
    this.selectedDateRange = new DateRange<Date>(new Date(dateWithTimeZone()),new Date(dateWithTimeZone()));
    this.openCustomCalanderSlide=false;
    this.show = false;
  }

  openCustomCalander(){
    this.openCustomCalanderSlide=true
  }

  yearSelected(e){
    this.isCustomCalanderOpen= true;
    setTimeout(() => {
      this.isCustomCalanderOpen= false;
    }, 10);
  }
  monthSelected(e){
    this.isCustomCalanderOpen= true;
    setTimeout(() => {
      this.isCustomCalanderOpen= false;
    }, 10);
  }
  viewChanged(e){
    this.isCustomCalanderOpen= true;
    setTimeout(() => {
      this.isCustomCalanderOpen= false;
    }, 10);
  }
}
