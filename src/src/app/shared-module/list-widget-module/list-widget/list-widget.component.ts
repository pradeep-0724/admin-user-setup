import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { FilterModel, FilterOptions, ListWidget } from '../interface/llist-widget.interface';

@Component({
  selector: 'app-list-widget',
  templateUrl: './list-widget.component.html',
  styleUrls: ['./list-widget.component.scss']
})
export class ListWidgetComponent implements OnInit, ListWidget ,OnChanges {

  @Output() fileDownloadEmitter = new EventEmitter<boolean>();
  @Output() openDetailsEmitter =new EventEmitter<boolean>();
  @Output() filteredDataEmitter =new EventEmitter<Array<any>>();
  @Output() searchValueEmitter =new EventEmitter<string>();
  @Output() showItemByEmitter =new EventEmitter<number>();
  @Input() isShowingEnable: boolean = false;
  @Input() isFilterEnable: boolean = false;
  @Input() isSearchEnable: boolean = false;
  @Input() isExportEnable: boolean = false;
  @Input() isDetailsEnable: boolean = false;
  @Input() filterDataList: any[]=[];
  @Input() filterOptions: FilterOptions;
  @Input() openListDetails:BehaviorSubject<boolean>
  @Input() filterBy: number = 5;
  @Input()apiError: string ='';
  @Input() isMobile: boolean = false;
  routeToDetail: boolean = false;
  isFilterApplied: boolean = false;
  showFilter: boolean = false;
  searchValue:string='';
  filterList: any[] = new ValidationConstants().filter;
  constructor() {
  }

  ngOnInit(): void {
    this.openListDetails.subscribe(isTrue=>{
      this.routeToDetail = isTrue;
    })

  }

  ngOnChanges() {
    this.filterDataList= this.filterDataList;
    this.filterOptions = this.filterOptions;
    this.apiError =this.apiError;
    this.isMobile = this.isMobile;
  }


  filterApplied(filterData:FilterModel): void {
    this.filteredDataEmitter.next(filterData.filtedData)
    this.showFilter = !this.showFilter;
    this.isFilterApplied=filterData.isFilterApplied;
  }

  downLoadXls(): void {
    this.fileDownloadEmitter.emit(true);
  }

  openDetails(): void {
   this.routeToDetail=!this.routeToDetail;
   this.openDetailsEmitter.next(this.routeToDetail)
  }

  searchEvent(): void {
    this.searchValueEmitter.next(this.searchValue)
  }

  showItemBy(): void {
    this.showItemByEmitter.emit(this.filterBy)
  }

  onClickCancel():void{
    this.routeToDetail = false;
    this.openDetailsEmitter.next(false)
  }
}
