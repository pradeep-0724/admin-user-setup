import { Subscription } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy ,OnChanges} from '@angular/core';
import { I3MSService } from '../../api-services/i3ms-service/i3ms.service';

@Component({
  selector: 'custom-pagination',
  templateUrl: './custom-pagination.component.html',
  styleUrls: ['./custom-pagination.component.scss']
})
export class CustomPaginationComponent implements OnInit,OnDestroy,OnChanges {
  @Input() inputData: Array<any>;
  @Input() searchValue: string;
  @Input() pageNumberCount:number;
  @Output() outputData  = new EventEmitter<any>();
  @Output() outputPageCountData  = new EventEmitter<any>();
  @Input() dateParams: any;

  constructor( private _i3msService :I3MSService) { }
  pageNumbers=[];
  currentPage:number;
  pageNumberLength:number;
  pagesList: Array<any> = [];
	pageNumber = 1;
	pagesListData=[];
  pagesListSubscription:Subscription[]=[];
  paginitionvalueChange:boolean;
  totalPageCount: number = 0;


  ngOnInit() {
  this.paginitionvalueChange=false;
  this.currentPage=1;

  }
  ngOnChanges() {
    if(this.pageNumberCount >= 10){
      this.currentPage=1;
    }
    try {
      this.totalPageCount = this.inputData["pagination"].total_pages;
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
    this. getPages(page,"","")
    this.currentPage = page;
  }
  nextPage(){
    let firstPageNumber=this.pageNumbers[1];
    let totalPages =this.inputData["pagination"].total_pages;
    let pangeNumberRange = totalPages-this.pageNumbers[this.pageNumbers.length-1];
   if(this.currentPage<totalPages && pangeNumberRange>0 ){
     this.pageNumbers=[];
     let pageNumber = this.currentPage;
     for (let index =firstPageNumber; index < this.pageNumberLength+firstPageNumber; index++){
            this.pageNumbers.push(index);
            this.currentPage =this.pageNumbers[this.pageNumbers.length-1];

     }
     pageNumber=this.currentPage - pageNumber;
     const record= this.inputData["data"][this.inputData["data"].length-1]._id;
     const previous=0;
     this.getPages(this.currentPage,record,previous);
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
      const record= this.inputData["data"][0]._id;
      const previous=1;
      this.getPages(this.currentPage,record,previous);
     }
  }
  generatePageNumber(){
    this.pageNumbers=[];
    for (let index = 1; index <=this.pageNumberLength ; index++) {
      this.pageNumbers.push(index);
    }
  }

 getPages(pageNumber,record,previous){
  if(this.searchValue.trim().length ===0){
    if(this.inputData["data"].length>0){
      this.pagesListSubscription.push(this._i3msService.getPages(this.pageNumberCount, pageNumber, this.dateParams.start_date,
                                      this.dateParams.end_date).subscribe((responseData:any)=>{
        this.paginitionvalueChange=true;
        this.inputData =responseData.result;
        this.outputData.emit(this.inputData);
      }));
    }
  }else{
    this.pagesListSubscription.push(this._i3msService.searchTripListData(this.pageNumberCount,pageNumber,this.searchValue.trim(),
                                    this.dateParams.start_date, this.dateParams.end_date).subscribe((responseData:any)=>{
      this.paginitionvalueChange=true;
      this.inputData =responseData.result;
      this.outputData.emit(this.inputData);
    }));
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
