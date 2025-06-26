import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FilterDataTypes } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-module-v2-interface';
import { WidgetSettingService } from 'src/app/modules/customerapp-module/sub-main-trip-module/new-trip-v2/list-module-v2/list-widget-list-view-settings/widget-settings.service';
type DateRangeAndType= {
  startDate: any
  endDate: any
  dateRangeType: string
}
@Component({
  selector: 'app-table-widget',
  templateUrl: './table-widget.component.html',
  styleUrls: ['./table-widget.component.scss']
})
export class TableWidgetComponent implements OnInit {
  @Input() WidthCollapse=false;
  @Input() isWidthExpanded=true;
  @Input() isCollapsable=false;
  @Input()  isExpanded=false;
  @Input()  isAddButton=false;
  @Input() isEditButton=false;
  @Input()  isFilter=false;
  @Input() isDateRange=false;
  @Input() isSearch=false;
  @Input() isExport=false;
  @Input() isSettings=false;
  @Input() isShowDateRangeText=false;
  @Input() selectedDateRangeType=0;
  @Input()  tableTitle=''
  @Input()filterUrl='';
  @Input()settingsUrl='';
  searchValue = ''
  showDateRange=true
  searchValueSubject: Subject<string> = new Subject<string>();
  searchInputValue$: Observable<string>;
  showFilter=false;
  isFilterApplied=false;
  isOpenSettings=false;
  settingsListLength:number=0
  dateRange:DateRangeAndType
  @Output() expandCollapseEvent= new EventEmitter();
  @Output() WidthCollapseEvent=new EventEmitter();
  @Output() searchedData= new EventEmitter();
  @Output() fileExportEvent= new EventEmitter();
  @Output() addButtonEvent= new EventEmitter();
  @Output() editButtonEvent= new EventEmitter();
  @Output() filterDataEmitter = new EventEmitter();
  @Output() dateRangeEmitter= new EventEmitter();
  @Output() settingAppliedEmitter= new EventEmitter();
  
  constructor(private _widgetSettingService:WidgetSettingService) { }

  ngOnInit(): void {
    this.searchInputValue$ = this.searchValueSubject.pipe(
      debounceTime(800),
      distinctUntilChanged()
    );
    this.searchInputValue$.subscribe((value) => {
      this.searchedData.emit(value)
    });
    if(this.isSettings)
    this.settingApiLength()
  }

  settingApiLength(){
    this._widgetSettingService.getSettings(this.settingsUrl).subscribe(resp=>{
      this.settingsListLength = resp.result.list_fields.length      
    });
  }


  onSearchValueChange(value: string) {
    this.searchValueSubject.next(value);
  }

  fileExport(){
   this.fileExportEvent.emit(true)
  }

  addButtonClick(){
    this.addButtonEvent.emit(true)
  }

  editButtonClick(){
    this.editButtonEvent.emit(true)
  }
  filterData(filterOptins: FilterDataTypes){
    this.filterDataEmitter.emit(filterOptins.filteredKeys);
    this.isFilterApplied = filterOptins.isApplied;
    this.showFilter = filterOptins.isShowFilter
  }
  
  filterCancel(e){
    if(e){
      this.showFilter = false;
    }
  }

  

  expandCollapse(){
    this.isExpanded=!this.isExpanded
    this.expandCollapseEvent.emit(this.isExpanded)
  }
  widthExpand(){
    this.isWidthExpanded=!this.isWidthExpanded;
    this.WidthCollapseEvent.emit(this.isWidthExpanded);


  }

  dateSelected(dateAndType:DateRangeAndType){
    setTimeout(() => {
      this.dateRange = dateAndType;
      this.dateRangeEmitter.emit(this.dateRange)
    }, 100);
    
  }

  listViewSettingsData(e){
    this.settingAppliedEmitter.emit(e.isSettingApplied);
    this.isOpenSettings = false;
  }

}


