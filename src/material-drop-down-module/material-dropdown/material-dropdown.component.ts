
import { Component, OnInit, ContentChild, ElementRef, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

import {UntypedFormControl} from '@angular/forms';
import { MAT_SELECT_SCROLL_STRATEGY} from '@angular/material/select';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

export interface Options {
	label: string,
	value: string
}


@Component({
	selector: 'material-dropdown',
	templateUrl: './material-dropdown.component.html',
	styleUrls: [
		'./material-dropdown.component.scss'
	],
	providers: [ CommonService, { provide: MAT_SELECT_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] } ]
})
export class MaterialDropdownComponent implements OnInit {

	@ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger,static: true }) autoComplete: MatAutocompleteTrigger;
	@ContentChild('customSelect',{static: true}) selectEle: ElementRef;
	@Input() width200 : boolean = false;
	@Output() onOptionSelected = new EventEmitter<any>();
	@Output() postApiResponse = new EventEmitter<any>();
	@Output() addValueToList = new EventEmitter<any>();
	@Output() addChartOfAccount = new EventEmitter<any>();
	@Output() addItemPopup = new EventEmitter<any>();
	@Output() addPartyPopup = new EventEmitter<any>();
	@Output() dropdownStatus = new EventEmitter<any>();
	@Output() nonOptionSetValue = new EventEmitter<any>();
	@Output() addDisclaimerPopup = new EventEmitter<any>();
	@Output() addCoaPopup = new EventEmitter<any>();
	@Output() addFileName = new EventEmitter<any>();
	@Output() addNewOption = new EventEmitter<any>();

	@Input() placeholder:string='Select'
	@Input() searchable: Boolean = false;
	@Input() addable: Boolean = false;
	@Input() params;
	@Input() tdsField: Boolean = false;
	@Input() postApiUrl: string;
	@Input() isItemDropdown: boolean = false;
	@Input() chartOfAccount: boolean = false;
	@Input() item: boolean = false;
	@Input() party: boolean = false;
	@Input() status: boolean= false;
	@Input() disabled: boolean = false;
	@Input() addErrorClass: any = '';
	@Input() addBlank = false;
	@Input() disableLastInput = false;
	@Input() disclaimer = false;
	@Input() addJoinClass = false;
	@Input() styleLabourSection = false;
	@Input() maxLength = 30;
	@Input() isUpperCaseAllowed = false;
	@Input() addMobileCodeClass = false;
	@Input() addFile = false;
	@Input() addNewOptions = false;
	@Input() addItemText : string = '+ Add'
	dropdownShown: Boolean = false;
	addNewToggle: Boolean = false;
	dropdownOptions: any;
	addNewValue: string = '';
	addableOption: any = {'label': '', 'value': 'add-dropdown-value'}
	lastSelectedValue: any = {label: '', value: null };
	blankOption: any = {label: '', value: null };
	dropdownInput = new UntypedFormControl();
	inputSelected: boolean = true;

  lastValue: string = '';

  @Input()
  set selectedOption(option: any) {
		this.lastSelectedValue = option;
		this.dropdownInput.setValue(this.lastSelectedValue);
  }

  get selectedOption(): any { return this.lastSelectedValue; }

  constructor( private _commonService: CommonService) {}

  ngOnInit() {
	this.dropdownOptions = this.selectEle.nativeElement.options;
  }


islabelInOptions(addedLabel: string){
	const dropdownOptions = this.dropdownOptions;
	for ( let i = 0; i < dropdownOptions.length; i++){
		if (addedLabel != '' && this.convertTrimLowercase(dropdownOptions[i].label) == this.convertTrimLowercase(addedLabel))
			return {status: true, option: dropdownOptions[i]}
	}
	return {status: false, option: {}};
}

addNewValueToDropDown() {
	const addedLabel = this.addNewValue;
	if (Object.values(this.params).length)
		this._commonService.postDropDownValues(this.postApiUrl, this.params).subscribe((response: any) => {
			if (response.result) {
				let addedId = response.result.id ? response.result.id : response.result;
				this.postApiResponse.emit({id: addedId , label: addedLabel});
				let recentAddedOption = {label: addedLabel, value: addedId};
		
				// this.selectEle.nativeElement.value = response.result.id ? response.result.id : response.result;
				// this.selectEle.nativeElement.dispatchEvent(new Event('change'));
				
				this.dropdownInput.setValue(recentAddedOption);
				this.lastSelectedValue = recentAddedOption;					 
			}
		}, (err) => { this.dropdownInput.setValue(this.lastSelectedValue);
		});
	this.addNewValue = '';
}


  optionSelect(option: any) {
	this.inputSelected = true;
	if (this.addable && option.value == 'add-dropdown-value'){
		this.dropdownInput.setValue(this.blankOption);

		const addedLabel = this.addNewValue;
		const checkLabel = this.islabelInOptions(addedLabel);
		if (checkLabel.status){
			this.lastSelectedValue = checkLabel.option;
			this.dropdownInput.setValue(checkLabel.option);
			return;
		}

		if (addedLabel == ''){
			this.dropdownInput.setValue(this.lastSelectedValue);
			return;
		}
		
		if(this.chartOfAccount) 
			this.addChartOfAccount.emit(true);
		else if(this.item) 
				this.addItemPopup.emit(true);
		else if (this.disclaimer)
				this.addDisclaimerPopup.emit(true);
		else if (this.party)
				this.addPartyPopup.emit(true);
		else if (this.addFile)
		        this.addFileName.emit(this.addNewValue)
		else if (this.addNewOptions)
		    this.addNewOption.emit(this.addNewValue)
		else
			this.addNewValueToDropDown();
		return;
	}

	this.addNewValue = option.label;
	this.lastSelectedValue = option;
	this.selectEle.nativeElement.value = option.value;
	this.selectEle.nativeElement.dispatchEvent(new Event('change'));
}

displayFn(option: Options): string {
    return option && option.label ? option.label : '';
  }


recordKeys(event){
	const trimmed_value = event.target.value ? event.target.value : '';
	this.addNewValue = trimmed_value;

	if (event.key == 'Tab' || this.disableLastInput){
		return;
	}

	this.inputSelected = false;
	if (this.addable)
		this.addValueToList.emit(this.addNewValue);		
	}

convertTrimLowercase(value){
	 return value ? value.trim().toLowerCase() : "" ;
	}

selectLastOption(event) {
	if (this.inputSelected == false && this.disableLastInput == false) {
		if (event.relatedTarget == null || event.relatedTarget.tagName != 'MAT-OPTION') {
			this.dropdownInput.setValue(this.lastSelectedValue);
			this.inputSelected = true;
			this.autoComplete.closePanel();
		}
	} else {
		this.nonOptionSetValue.emit(this.addNewValue);
	}
	}
}
