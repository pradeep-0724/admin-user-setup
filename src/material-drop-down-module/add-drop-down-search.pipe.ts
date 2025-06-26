import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'optionsListFilter'
})
export class OptionsListFilterPipe implements PipeTransform {
	transform(list: any[], searchString: string) {
		let tempValues: any = [];
		if (typeof searchString !== 'string' || !searchString) {
			return list;
		}
		searchString = searchString.trim();
		for (let i = 0; i < list.length; i++) {
			if (list[i].label.toLowerCase().includes(searchString.toLowerCase())) {
				tempValues.push(list[i]);
			}
		}
		return tempValues;
	}
}
