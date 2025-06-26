import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
	selector: 'app-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
	@Input() config: any = {};
	@Input() data: any = [];
	@Input() visible: boolean = false;
	@Input() clearFilter?: Observable<boolean>;
	@Output() onApplied: EventEmitter<any> = new EventEmitter();
	@Output() onClear: EventEmitter<any> = new EventEmitter();
	processedData: any = [];
	selectedCategory: any = {};
	filterdResult: any = [];
	toBeFilterd: any = [];
	filteredValueList: any = [];
	selectedCategoryIndex: number = 0;
	searchKey: string;
	activeTab = 0;
	searchfilter = false;


	constructor() { }

	ngOnInit() {
		this.processedData = [];
		this.config.columns.forEach((col) => {
			this.processedData.push({
				title: col.title,
				key: col.key,
				valueList: this.getValueList(col),
			});
		});
		this.changeSelectedCategory(this.selectedCategoryIndex);

		if(this.clearFilter){
			this.clearFilter.subscribe(isClear=>{
				if(isClear){
					this.clearClicked()
				}
			})
		}

	}

	ngOnChanges() {
		this.filterdResult = this.data;
		this.processedData = [];
		this.config.columns.forEach((col) => {
			this.processedData.push({
				title: col.title,
				key: col.key,
				valueList: this.getValueList(col),
				isApplied: false
			});
		});
		this.processedData.forEach((element, index) => {
			this.checkFilterApplied(index);
		});
		this.changeSelectedCategory(this.selectedCategoryIndex);
	}

	applyClicked() {
		// console.log('DATA GOT', this.data);
		// console.log('tobefilterd', this.toBeFilterd);
		this.filterdResult = this.data;
		for (let filterItem in this.toBeFilterd) {
			let filterSplit = filterItem.split(',');
			let filterCol = this.getCol(filterSplit);
			// console.log('COL DETAILS', filterCol);
			if (filterCol.type === 'unique') {
				this.filterdResult = this.filterdResult.filter((item) => {
					if (filterSplit.length == 2) {
						let childList = this.getValue(item, filterSplit[0]);
						return childList.some((childItem) => this.toBeFilterd[filterItem].includes(this.getValue(childItem, filterSplit[1])));
					}
					return this.toBeFilterd[filterItem].includes(this.getValue(item, filterItem));
				});
			}

			if (filterCol.type === 'dateRange') {
				this.filterdResult = this.filterdResult.filter((item) => {
					return this.toBeFilterd[filterItem].some((dateRange) => {
						let range = filterCol.range.filter((r) => r.label === dateRange)[0];
						let startDate = new Date(dateWithTimeZone());
						let endDate = new Date(dateWithTimeZone());
						startDate.setDate(startDate.getDate() + range.start);
						endDate.setDate(endDate.getDate() + range.end);
						return this.dateCheck(this.getDateString(startDate), this.getDateString(endDate), this.getValue(item, filterItem));
					});
				});
			}

		}


		const filtedEvent = {
			filtedData: this.filterdResult,
			appliedFilters: this.toBeFilterd,
			isFilterApplied: this.checkAnyItemSelected()
		};
		this.onApplied.emit(filtedEvent);
	}

	getDateString(dateObj: Date) {
		return dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + (dateObj.getDate() <= 9 ? '0' + dateObj.getDate() : dateObj.getDate());
	}

	dateCheck(from, to, check) {

		let fDate, lDate, cDate;
		fDate = Date.parse(from);
		lDate = Date.parse(to);
		cDate = Date.parse(check);
		if ((cDate <= lDate && cDate >= fDate)) {
			return true;
		}
		if (isNaN(lDate) && cDate >= fDate) {
			return true;
		}
		if (isNaN(fDate) && cDate <= lDate) {
			return true;
		}
		return false;
	}

	getCol(colKey) {
		if (colKey.length === 1)
			return this.config.columns.filter((item) => item.key === colKey[0])[0];
		return this.config.columns.filter((item) => item.key.toString() === colKey.toString())[0];
	}

	clearClicked() {
		this.toBeFilterd = [];
		this.changeSelectedCategory(this.selectedCategoryIndex);
		this.filterdResult = this.data;
		const filtedEvent = {
			filtedData: this.filterdResult,
			appliedFilters: this.toBeFilterd,
			isFilterApplied: false
		};
		this.onClear.emit(filtedEvent);
	}

	getValueList(col) {
		let valueList = [];

		if (col.type === 'unique') {
			this.data.forEach((item) => {
				if (!Array.isArray(col.key)) {
					this.addUniqueToList(item, col.key, valueList);
				} else {
					var childList = this.getValue(item, col.key[0]);
					if (childList) {
						childList.forEach((childItem) => {
							this.addUniqueToList(childItem, col.key[1], valueList);
						});
					}

				}
			});
		}

		if (col.type === 'dateRange') {
			if (col.range !== undefined) {
				col.range.forEach((range) => {
					valueList.push({
						value: range.label,
						isSelected: false
					});
				});
			}
		}
		return valueList;
	}

	addUniqueToList(item, key, list) {
		if (this.getValue(item, key) !== undefined && this.getValue(item, key) !== null) {
			if (
				list.filter((e) => {
					if (e.value !== null) {
						return e.value.toString().toLowerCase() === this.getValue(item, key).toString().toLowerCase();
					}
				}).length === 0
			)
				list.push({
					value: this.getValue(item, key),
					isSelected: false
				});
		}
	}

	changeSelectedCategory(index) {
		this.searchKey = '';
		this.selectedCategoryIndex = index;
		this.selectedCategory = this.processedData[this.selectedCategoryIndex];
		this.selectedCategory.valueList.forEach((item) => {
			if (
				this.toBeFilterd[this.selectedCategory.key] !== undefined &&
				this.toBeFilterd[this.selectedCategory.key].includes(item.value)
			) {
				item.isSelected = true;
			} else {
				item.isSelected = false;
			}
		});
		this.filteredValueList = this.selectedCategory.valueList;
	}

	filterValues(el) {
		var regExp = new RegExp(this.searchKey, 'gi');
		this.filteredValueList = this.selectedCategory.valueList.filter((item) => item.value.match(regExp));
	}

	getValue(item, key) {
		// console.log("ITEM GOT", item);
		// console.log("KEY GOT", key);
		const keySplit = key.split('.');

		if (Array.isArray(item[keySplit[0]])) {
			return item[keySplit[0]];
		}

		if (keySplit.length === 2 && item[keySplit[0]] !== null && item[keySplit[0]] !== undefined) {
			if (item[keySplit[0]][keySplit[1]] !== null && item[keySplit[0]][keySplit[1]] !== undefined) {
				return item[keySplit[0]][keySplit[1]];
			}
		}

		if (keySplit.length === 3 && item[keySplit[0]] !== null && item[keySplit[0]] !== undefined) {
			if (item[keySplit[0]][keySplit[1]] !== null && item[keySplit[0]][keySplit[1]] !== undefined) {
				if (item[keySplit[0]][keySplit[1]][keySplit[2]] !== null && item[keySplit[0]][keySplit[1]][keySplit[2]] !== undefined) {
					return item[keySplit[0]][keySplit[1]][keySplit[2]];
				}
			}
		}
		return item[key];
	}

	addToFilter(event, key, value) {
		if (event.target.checked) {
			if (this.toBeFilterd[key] === undefined) this.toBeFilterd[key] = [];
			this.toBeFilterd[key].push(value);
			this.processedData[this.activeTab].isApplied = true;
		} else {
			this.toBeFilterd[key] = this.toBeFilterd[key].filter((item) => item !== value);
			if (this.toBeFilterd[key].length === 0) {
				delete this.toBeFilterd[key];
				this.processedData[this.activeTab].isApplied = false;
			}

		}
	}

	filterFromList(list: any = [], key, value) {
		return list.filter((item) => this.getValue(item, key) === value);
	}

	checkFilterApplied(index) {
		let selectedCategory = this.processedData[index];
		selectedCategory.valueList.forEach((item) => {
			if (
				this.toBeFilterd[selectedCategory.key] !== undefined &&
				this.toBeFilterd[selectedCategory.key].includes(item.value)
			) {
				this.processedData[index]['isApplied'] = true;
			}
		});
	}

	checkAnyItemSelected() {
		let isTrue = false;
		this.processedData.forEach((element, index) => {
			if (this.processedData[index]['isApplied']) {
				isTrue = true;
			}
		});
		return isTrue
	}
}
