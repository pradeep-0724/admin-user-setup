import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/reports-module-services/revenue-service/revenue.service';

@Component({
  selector: 'app-pagination-search',
  templateUrl: './pagination-search.component.html',
  styleUrls: ['./pagination-search.component.scss']
})
export class PaginationSearchComponent implements OnInit,OnChanges,OnDestroy {

  @Input() inputData: Array<any>;
  @Input() searchValue: string='';
  @Input() startDate;
  @Input() endDate;
  @Input() pageNumberCount:number;
  @Input() url;
  @Input() filterSet=[];

  @Output() outputData  = new EventEmitter<any>();
  @Output() outputPageCountData  = new EventEmitter<any>();
  pageNumbers=[];
  currentPage:number;
  pageNumberLength:number;
  pagesListSubscription:Subscription[]=[];
  paginitionvalueChange:boolean;
  constructor(private revenueService:RevenueService) { }


  ngOnInit() {
    this.currentPage =1;
    this.paginitionvalueChange =false;
  }
  ngOnChanges(simpleChanges:SimpleChanges){
    this.filterSet=this.filterSet;
    if(this.pageNumberCount>=5){
      this.currentPage=1;
    }
    if(simpleChanges['startDate'] && simpleChanges['startDate']['previousValue']!=simpleChanges['startDate']['currentValue']){
      this.currentPage=1;
    }
    try {
      if(this.inputData["pagination"].total_pages>=6){
        this.pageNumberLength=6;
        this.generatePageNumber();

      }else{
        this.pageNumberLength=this.inputData["pagination"].total_pages;
        this.generatePageNumber();
      }

    } catch (error) {
    }
  }

  changePage(page){
    if(page !==this.currentPage){
      this.currentPage = page;
      this.getPages();
    }

  }
  nextPage(){
    let firstPageNumber=this.pageNumbers[1];
    let totalPages =this.inputData["pagination"].total_pages;
    let pangeNumberRange = totalPages-this.pageNumbers[this.pageNumbers.length-1];
    if(this.currentPage<totalPages && pangeNumberRange>0 ){
      this.pageNumbers=[];
      for (let index =firstPageNumber; index < this.pageNumberLength+firstPageNumber; index++){
             this.pageNumbers.push(index);
             this.currentPage =this.pageNumbers[this.pageNumbers.length-1];
      }
      this.getPages();
    }

  }

  previousPage(){
    let pangeNumberRange = this.pageNumbers[this.pageNumbers.length-1] - this.pageNumberLength;
    if(this.currentPage >1 && this.pageNumbers[0]>0 &&pangeNumberRange){
     let lastNumber=this.pageNumbers[this.pageNumbers.length-1];
      this.pageNumbers=[];
      for (let index =lastNumber -this.pageNumberLength; index < lastNumber; index ++){
            this.pageNumbers.push(index);
            this.currentPage =this.pageNumbers[0];
     }
     this.getPages();
    }

  }
  generatePageNumber(){
    this.pageNumbers=[];
    for (let index = 1; index <=this.pageNumberLength ; index++) {
      this.pageNumbers.push(index);
    }
  }

  getPages(){
    if(this.filterSet.length>0){
      this.pagesListSubscription.push(this.revenueService.getFilterData(this.url,this.filterSet,this.searchValue.trim(),this.startDate,this.endDate,this.pageNumberCount,this.currentPage).subscribe((data:any)=>{
        this.paginitionvalueChange=true;
        this.inputData =data;
        this.outputData.emit(this.inputData);
      })
    )
    }else{
      if(this.searchValue.trim().length ===0){
        if(this.inputData["result"].length>0){
        this.pagesListSubscription.push(this.revenueService.getPaginatedData(this.url,this.startDate,this.endDate,this.currentPage,this.pageNumberCount).subscribe((data:any)=>{
        this.inputData=data;
        this.paginitionvalueChange = true;
        this.outputData.emit(this.inputData);
      }));
      }
      }
      else{
        this.pagesListSubscription.push(this.revenueService.getSearchPaginatedData(this.url,this.startDate,this.endDate,this.currentPage,this.pageNumberCount,this.searchValue.trim()).subscribe((data:any)=>{
          this.paginitionvalueChange=true;
          this.inputData =data;
          this.outputData.emit(this.inputData);
        }));
      }
    }

  }

  ngOnDestroy(){
    if(this.paginitionvalueChange){
      this.pagesListSubscription.forEach(subscription =>{
       subscription.unsubscribe();
      });
    }
  }

}
