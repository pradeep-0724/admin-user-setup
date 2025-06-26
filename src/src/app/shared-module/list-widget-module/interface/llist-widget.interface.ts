import { EventEmitter } from "@angular/core"
import { BehaviorSubject } from "rxjs"

export interface ListWidget {
  isSearchEnable:boolean,
  isExportEnable:boolean,
  isShowingEnable:boolean,
  isFilterEnable:boolean,
  isDetailsEnable:boolean,
  searchValue:string,
  routeToDetail:boolean,
  isFilterApplied:boolean,
  showFilter:boolean,
  isMobile:boolean,
  apiError:string,
  filterBy:number,
  searchValueEmitter:EventEmitter<string>,
  openDetailsEmitter:EventEmitter<boolean>,
  showItemByEmitter:EventEmitter<number>,
  filteredDataEmitter:EventEmitter<Array<any>>,
  fileDownloadEmitter:EventEmitter<boolean>,
  openListDetails:BehaviorSubject<boolean>,
  filterList:Array<any>,
  filterOptions:FilterOptions,
  filterDataList:Array<any>,
  filterApplied(data:FilterModel):void,
  showItemBy():void,
  downLoadXls():void,
  openDetails():void,
  searchEvent():void,
  onClickCancel():void
}


export interface FilterModel{
  appliedFilters:Array<any>,
  filtedData:Array<any>,
  isFilterApplied:boolean
}

export type ColumnOptions={
  title: string,
  key: string|Array<string>,
  type: string,
  range?:Array<any>
}
export interface FilterOptions{
  columns:Array<ColumnOptions>
}

