import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomFilterService } from './custom-filter-service';


@Component({
  selector: 'app-custom-filter',
  templateUrl: './custom-filter.component.html',
  styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent implements OnInit {
  @Input() config: any = [];
	@Input() url ='';
	@Input() searchValue=''
  @Input() startDateEndDate;
	@Input() visible: boolean = false;
  @Input () pageSize=''
	@Output() onApplied: EventEmitter<any> = new EventEmitter();
	@Output() onClear: EventEmitter<any> = new EventEmitter();
  @Output() onFilterSet: EventEmitter<any> = new EventEmitter();
	processedData: any = [];
	selectedCategory: any = {};
	filterdResult: any = [];
	toBeFilterd: any = [];
	filteredValueList: any = [];
	selectedCategoryIndex: number = 0;
	searchKey: string;
	activeTab: any = 0;
	selectedProperty: any='';
	checkedValues: any=[];
	filterKeysArray: any=[];
	toClearCheckedValues: boolean=false;
  filterDate :any;



  constructor(private _customFilterService: CustomFilterService) { }

	ngOnInit() {}

	ngOnChanges() {
		this.processedData = [];
    this.filterDate = this.startDateEndDate;
		if(this.config.length>0){
		this.config.forEach((col) => {
			this.processedData.push({
				title: col.display,
				key: col.field,
				valueList: col.values,
				type: col.type,
        isApplied:false
			});
		});
	}

	this.changeSelectedCategory(this.selectedCategoryIndex);

    }


	clearClicked() {
		this.checkStatus(true);
    this.checkedValues=[];
    this.searchKey=''
		this.toClearCheckedValues = true;
		this.onClear.emit(true);
    this.onFilterSet.emit([])
	}


	changeSelectedCategory(index) {

		if(this.processedData[index]){
		if( Array.isArray(this.processedData[index].valueList)){
			this.filteredValueList = this.processedData[index].valueList;
		}
		else{
			this.filteredValueList = Object.keys(this.processedData[index].valueList);
		}
		this.selectedProperty = index;
	}
	}

	checkStatus(value){
		if(!this.toClearCheckedValues){
		let isChecked = false
		this.checkedValues.forEach((ele)=>{
			if(Object.values(ele) == value){
				isChecked=true
			}

		})
		return isChecked;
	}
	else{
		return false;

	}

	}

	selectingValues(event,value){

		let payload = new Object()
		let key =this.processedData[this.selectedProperty].key;

		if (this.processedData[this.selectedProperty].type == 'dropdown') {
			value = this.processedData[this.selectedProperty].valueList[value];
		}

		if(event.target.checked){
		 payload[key] =value;
		 this.checkedValues.push(payload);
		}
		else{
			this.checkedValues.forEach((ele,index)=> {
				if(ele[key] == value){
                  this.checkedValues.splice(index,1);
				}
			}
			)
		}

		this.filterKeys()
	}

	filterKeys(){
		this.checkedValues.forEach((ele)=>{
			this.filterKeysArray.push(Object.keys(ele).toString())
		  })

	}

	applyFilters(){
		this.filterKeys();
		/* For getting the unique strings. keysString is an array of strings ["filterName1","filterName2"] */
		let obj={};
		let keysString=this.filterKeysArray.toString();
		keysString = Array.from(new Set(keysString.split(',')));

		keysString.forEach((ele)=>{
      if(ele){
        obj[ele]=[];
      }
		})

		this.checkedValues.forEach((ele)=>{
			let key= Object.keys(ele).toString();
			let value= Object.values(ele).toString();
			if(obj.hasOwnProperty(key)){
				obj[key].push(value);
			}
		})

		let finalFilterArray=[];
		let filterValuesArray=[]
		finalFilterArray.push(keysString);
		keysString.forEach((ele)=>{
      if(ele){
        filterValuesArray.push(obj[ele]);
      }
		})
    if(this.checkedValues.length>0){
      finalFilterArray.push(filterValuesArray);
          if(filterValuesArray.length>0){
           this._customFilterService.getFilterData(this.url,finalFilterArray,this.searchValue,this.filterDate,this.pageSize).subscribe(res=>{
           this.toClearCheckedValues = false;
           this.searchKey='';
           this.onApplied.emit(res);
           this.onFilterSet.emit(finalFilterArray)
      })
    }
    }
	}
}
