import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterDataTypes } from '../list-module-v2-interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { WidgetFilterService } from './widget-filter.service';
type SelectedKeyValues={
	key:string,
	values:Array<string|number>
}
@Component({
	selector: 'app-list-widget-filter',
	templateUrl: './list-widget-filter.component.html',
	styleUrls: ['./list-widget-filter.component.scss']
})
export class ListWidgetFilterComponent implements OnInit  {
	@Input() visible: boolean = false;
	@Input() filterUrl:string='';
	@Output() filterData: EventEmitter<FilterDataTypes> = new EventEmitter();
	@Output() filterCancel:EventEmitter<boolean> = new EventEmitter();
	processedData:Array<any> = [];
	selectedCategory: any = {};
	filteredValueList: any = [];
	searchKey: string;
	activeTab: any = 0;
	selectedProperty: any = '';
	filterDataObj:FilterDataTypes={
		isApplied:false,
		filteredKeys:[],
		isClear:false,
		isShowFilter:true
	}


	constructor(private route: ActivatedRoute,private _widgetFilterService:WidgetFilterService) { }

	ngOnInit() { 
		this.getWidgetFilterOptions();
	}
 
	makeAllUncheck(){
		this.processedData.forEach((item) => {
			item['isApplied']=false;
			if(item.valueList.length){
				item.valueList.forEach(element => {
					element['isChecked']=false
				});
			}			
		});
	}

	clearClicked() {
	    this.makeAllUncheck();
		this.searchKey = ''
		this.filterDataObj={
			isApplied:false,
			filteredKeys:[],
			isClear:true,
			isShowFilter:false
		}
		
		this.changeSelectedCategory(0);
		this.filterData.emit(this.filterDataObj)
	}


	changeSelectedCategory(index) {
		this.activeTab =index;
		this.searchKey='';
		if (this.processedData[index]) {
			this.filteredValueList = this.processedData[index].valueList
			this.selectedProperty = index;
		}
	}

	itemSelected(){
		  let itemList=[];
		  let isAnyItemSelected=false;
		  itemList=this.processedData[this.selectedProperty].valueList;
		  if(itemList.length){
			itemList.forEach(item=>{
				if(item.isChecked){
					isAnyItemSelected=true;
				}
			});
			this.processedData[this.selectedProperty].isApplied=isAnyItemSelected;
		  }else{
			this.processedData[this.selectedProperty].isApplied=false;
		  }
	}

	applyFilters() {
		let selectedData:Array<SelectedKeyValues>=[];
		this.processedData.forEach(processItem => {
			if(processItem.valueList.length){
				let selectedItem =[];
				processItem.valueList.forEach(valueObj => {
					if(valueObj.isChecked){
						selectedItem.push(valueObj.name)
					}
				});
				if(selectedItem.length){
					selectedData.push({
						key:processItem.key,
						values:selectedItem
					})
				}
			}
			
		});
			this.filterDataObj={
				isApplied:selectedData.length?true:false,
				filteredKeys:selectedData,
				isClear:false,
				isShowFilter:false
			}
			this.filterData.emit(this.filterDataObj);
			this.changeSelectedCategory(0);
	}

	selectedValues(value:string){
     let selectKeyValuePairList:Array<any>=JSON.parse(value);
	 if(selectKeyValuePairList.length && this.processedData.length){
		selectKeyValuePairList.forEach(selectedItem=>{
			this.processedData.forEach((item,index) => {
				if(selectedItem.key==item.key){
					item.valueList.forEach(itemValue => {
						if(selectedItem.values.includes(itemValue.name)){
							itemValue['isChecked']=true;
						}	 
					});
					item['isApplied']=true
				}
			});	
		});
		this.changeSelectedCategory(0);
	 }else{
		this.processedData.forEach((item,index) => {
			item.isApplied = false;
			let newValueList=[];
			if(item.valueList.length){
				item.valueList.forEach(element => {
					if(typeof element =='string'){
						newValueList.push({
							name:element,
							isChecked:false
						});
					}else{
						element['isChecked']=false
						newValueList.push(element)
					}
				});
			}
			this.processedData[index].valueList=newValueList;
			
		});	
		this.changeSelectedCategory(0);
	 }
	}

	getWidgetFilterOptions(){
      this._widgetFilterService.getFilterOptions(this.filterUrl).subscribe(resp=>{
		let filterCatagories=[];
		filterCatagories =resp.result
		if(filterCatagories.length){
			filterCatagories.forEach((col) => {
				this.processedData.push({
					title: col.display,
					key: col.field,
					valueList: col.values,
					isApplied: false
				});
			});	
			this.processedData.forEach((item) => {
				let itemList=[];
				if(item.valueList.length){
					item.valueList.forEach(element => {
						itemList.push({
							name:element,
							isChecked:false
						})
					});
				}	
				item.valueList =itemList		
			});
		}
		this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
			if(paramMap.has('filter')){
			  this.selectedValues(paramMap.get('filter'))
			}else{
				this.makeAllUncheck();
				this.changeSelectedCategory(0);
			}
		  });

	  });
	}

	cancel(){
		this.filterCancel.next(true);
	}

}