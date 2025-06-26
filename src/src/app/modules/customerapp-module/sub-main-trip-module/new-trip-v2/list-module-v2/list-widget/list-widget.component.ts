import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EmitSettingData, DropDownType, ListWidgetData, FilterDataCongig, FilterDataTypes, ButtonData } from '../list-module-v2-interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-list-widget',
  templateUrl: './list-widget.component.html',
  styleUrls: ['./list-widget.component.scss']
})
export class ListWidgetComponent implements OnInit, OnChanges, AfterViewInit {
  searchValueSubject: Subject<string> = new Subject<string>();
  searchInputValue$: Observable<string>;
  isOpenSettings = false;
  @Input() isExport: boolean = false;
  @Input() isSearch: boolean = true;
  @Input() isFilter: boolean = false;
  @Input() isDropDown: boolean = false;
  @Input() isSwitch: boolean = false;
  @Input() isAddButton: boolean = false;
  @Input() isDateRange : boolean = false;
  @Input() isDateRangeText : boolean = false;
  @Input() isSettings : boolean = false;
  @Input() subtractDays: number = 7
  @Output() listWidgetData: EventEmitter<ListWidgetData> = new EventEmitter();
  @Output() settingsApplied: EventEmitter<boolean> = new EventEmitter();
  @Output() viewChange: EventEmitter<boolean> = new EventEmitter();
  @Output() exportList: EventEmitter<boolean> = new EventEmitter();
  @Input() tabSelectionList: Array<DropDownType> = [];
  @Input() filterConfig: Array<FilterDataCongig> = [];
  @Input() buttonData: ButtonData = {
    name: '',
    permission: '',
    url: ''
  }
  @Input() settingsUrl: string = '';
  @Input() filterUrl: string = '';
  @Input() listTitle: string = '';
  @Input() date_range_needed=false;
  @Input() start_date;
  @Input() end_date;
  @Input() isDateDropDown :boolean= false;
  isFilterApplied: boolean = false
  showFilter = false;
  isNormalList: boolean = true;
  listWidget: ListWidgetData = {
    tabSelection: '1',
    dateRange: {
      startDate: null,
      endDate: null,
      selectedOpt : ''
    },
    searchValue: '',
    filterKeyData: [],
  };
  isDateRangeSelected : boolean = false;
  constructor(private route: ActivatedRoute) {

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.isDateRangeSelected=false
      this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
        this.checkActivatePrams(paramMap)
      });
    }, 100);
  }

  ngOnInit(): void {    
    this.isDateRangeSelected=false
    this.searchInputValue$ = this.searchValueSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    );
    this.searchInputValue$.subscribe((value) => {
      this.listWidgetData.emit(this.listWidget)
    });
  }
  onSearchValueChange(value: string) {
    this.searchValueSubject.next(value);
  }

  ngOnChanges(changes: SimpleChanges): void {   
    this.listWidget = this.listWidget;
  }

  listViewSettingsData(settingsData: EmitSettingData) {
    this.settingsApplied.emit(settingsData.isSettingApplied)
    this.isOpenSettings = false;
  }

  checkedChange(isListView: boolean) {
    this.isNormalList = isListView;
    if(isListView){
      this.isOpenSettings = false
    }
    this.viewChange.emit(isListView)
  }

  filterCancel(e){
    if(e){
      this.showFilter = false;
    }
  }


  tabOptionValue() {
    this.listWidgetData.emit(this.listWidget)
  }

  filterData(filterOptins: FilterDataTypes) {
    this.listWidget.filterKeyData = filterOptins.filteredKeys;
    this.listWidgetData.emit(this.listWidget);
    this.isFilterApplied = filterOptins.isApplied;
    this.showFilter = filterOptins.isShowFilter
  }

  checkActivatePrams(paramMap: ParamMap) {
    if (!paramMap.has('selectedTab')) {
      if(this.isDropDown){
        this.listWidget.tabSelection =this.tabSelectionList[0].value;
      }
      this.listWidget.searchValue = '';
      this.isFilterApplied = false;
      this.listWidget.dateRange.startDate=null,
      this.listWidget.dateRange.endDate=null,
      this.isDateRangeSelected=false;
    } else {
      if (paramMap.has('selectedTab')) {
        this.listWidget.tabSelection = paramMap.get('selectedTab');
      }
      if (paramMap.has('search')) {
        this.listWidget.searchValue = paramMap.get('search');
      }

      if (paramMap.has('filter')) {
        let filterData = [];
        filterData = JSON.parse(paramMap.get('filter'));
        if (filterData.length) {
          this.isFilterApplied = true;
        }
      } else {
        this.isFilterApplied = false;
      }
    }
    if (paramMap.has('start_date')) {
      this.listWidget.dateRange.startDate = new Date(paramMap.get('start_date'));
      this.listWidget.dateRange.endDate = new Date(paramMap.get('end_date'));
      this.listWidget.dateRange.selectedOpt = paramMap.get('label');
      this.isDateRangeSelected=true;
    }
    if (!paramMap.has('start_date')) {
      this.isDateRangeSelected=false;
      this.listWidget.dateRange.startDate=null,
      this.listWidget.dateRange.endDate=null,
      this.listWidget.dateRange.selectedOpt=''
    }
    if(paramMap.has('label')){
      if(isValidValue(paramMap.get('label'))){
        this.isDateRangeSelected=true;
      }
      else{
        this.isDateRangeSelected=false;
      } 
    }
    if (paramMap.has('search')) {
      this.listWidget.searchValue = paramMap.get('search');
    }

    if (paramMap.has('filter')) {
      let filterData :any;
      filterData = JSON.parse(paramMap.get('filter'));   
       
      if(isValidValue(filterData)){
        
        if (filterData.length>0) {          
          this.isFilterApplied = true;
        }else{
          this.isFilterApplied=false;
          this.listWidget.filterKeyData=[];
        }        
      }else{
        this.isFilterApplied=false;
        this.listWidget.filterKeyData=[];
      }
    } else {
      this.isFilterApplied = false;
      this.listWidget.filterKeyData=[];
      
    }


  }

  export(){
    this.exportList.emit(true)
  }

  dateSelectedEmitter(event){
    if(event){      
      this.isDateRangeSelected = true;
      this.listWidget.dateRange.startDate=event.startDate;
      this.listWidget.dateRange.endDate=event.endDate;
      this.listWidget.dateRange.selectedOpt=event.dateRangeType
      this.listWidgetData.emit(this.listWidget)
    }
  }

}
