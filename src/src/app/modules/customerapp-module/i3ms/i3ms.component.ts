import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { I3MSService } from '../api-services/i3ms-service/i3ms.service';
import {AbstractControl, UntypedFormControl, Validators} from '@angular/forms';
import {  Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged} from 'rxjs/operators';
import moment from 'moment';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
	selector: 'app-i3ms',
	templateUrl: './i3ms.component.html',
	styleUrls: ['./i3ms.component.scss']
})
export class I3MSComponent implements OnDestroy,OnInit {

	tripList: Array<any> = [];
	pageNumber = 1;
	triplistData=[];
	selectedOption=10;
	selectOptions=[10,20,30];
	i3msComponentSubscription:Subscription[]=[];
	requestType:string;
	searchDebounceObserbable = new Subject<string>();
	searchValue:string;
	selectedRange: Date[];

	date = new Date(dateWithTimeZone());
	endDate = moment(this.date).format('YYYY-MM-DD');
	startDate = moment(this.date).subtract(10, 'days').format('YYYY-MM-DD');
	dateParams: any = {start_date: this.startDate, end_date: this.endDate };

	transporters: Array<string> = [];
	licensees: Array<string> = [];
	destinations: Array<string> = [];
	sources: Array<string> = [];
	showLicensee: boolean = false;
	showDestination: boolean = false;
	showSource: boolean = false;
	
	transporterName = new UntypedFormControl('');
	licensee = new UntypedFormControl('');
	source = new UntypedFormControl('');
	destination = new UntypedFormControl('', [Validators.maxLength(20), Validators.minLength(5)]);

	constructor(private _i3msService: I3MSService) {
		this.selectedRange = [new Date(this.startDate), new Date(this.endDate)];
	}
	ngOnInit(): void {
		this.searchValue=" ";
		this.requestType="Edit";
		this.getTrips();
		this.getFieldValues();
		this.searchDebounceObserbable.pipe(
			debounceTime(400),
			distinctUntilChanged())
			.subscribe(value => {
				this.searchData(value);
			});
	}


	getTrips():void{
	 this.i3msComponentSubscription.push(this._i3msService.getAll(this.selectedOption, this.pageNumber, 
										 this.dateParams.start_date, this.dateParams.end_date).subscribe((response: any) => {
			this.tripList = response.result
			this.triplistData=this.tripList["data"];
		}));
		
	}

	getFieldValues():void{
		this.i3msComponentSubscription.push(this._i3msService.getFieldValues().subscribe((response:any)=>{

			const transporter_name = response.result["transporter"]['value'];
			this.transporters = response.result["transporter"]['options'];
			if (transporter_name) {
				this.transporterName.setValue(transporter_name);	
			}

			if ("source" in response.result) {
				this.showSource = true;
				this.sources = response.result['source']['options'];
				const source = response.result['source']['value'];
				if (source) {
					this.source.setValue(source);	
				}
			}

			if ("licensee" in response.result) {
				this.showLicensee = true;
				this.licensees = response.result['licensee']['options'];
				const licensee = response.result['licensee']['value'];
				if (licensee) {
					this.licensee.setValue(licensee);	
				}
			}

			if ("destination" in response.result) {
				this.showDestination = true;
				this.destinations = response.result['destination']['options'];
				const destination = response.result['destination']['value'];
				if (destination) {
					this.destination.setValue(destination);	
				}
			}

		}));
	}

	outputData(pageData):void{
	this.triplistData = pageData["data"];
	}

	updateTransporter(){
		if(this.transporterName.valid){
			const body={
				transporter: this.transporterName.value.trim()
			}
			this.i3msComponentSubscription.push(this._i3msService.updateFieldValues(body).subscribe((response:any)=>{
				
			}));
		}
	}

	updateSource(){
		if(this.source.valid){
			const body={
				source: this.source.value.trim()
			}
			this.i3msComponentSubscription.push(this._i3msService.updateFieldValues(body).subscribe((response:any)=>{
				
			}));
		}
	}

	updateDestination(){
		if(this.destination.valid){
			const body={
				destination: this.destination.value.trim()
			}
			this.i3msComponentSubscription.push(this._i3msService.updateFieldValues(body).subscribe((response:any)=>{
				
			}));
		}
	}

	updateLicensee(){
		if(this.licensee.valid){
			const body={
				destination: this.destination.value.trim()
			}
			this.i3msComponentSubscription.push(this._i3msService.updateFieldValues(body).subscribe((response:any)=>{
				
			}));
		}
	}

	optionSelected(selectedValue){
		this.selectedOption = selectedValue;
	       if(this.searchValue.trim().length===0){
			 this.getTrips();
		   }else{
			   this.searchData(this.searchValue)
		   }
	}

	searchData(value){
		value = value.trim().toLowerCase();
		this.i3msComponentSubscription.push(
			this._i3msService.searchTripListData(this.selectedOption,this.pageNumber, value, 
				this.dateParams.start_date, this.dateParams.end_date).subscribe((response:any)=>{
				this.tripList = response.result
				this.triplistData=this.tripList["data"];
		}));
	}

	ngOnDestroy():void{
		this.i3msComponentSubscription.forEach(subscription => {
			subscription.unsubscribe();	
		});
	}

	onDateRangeChange(dateRange) {
		if (dateRange && dateRange.length > 0) {
			this.dateParams = {
				start_date: changeDateToServerFormat(dateRange[0].toString()),
				end_date: changeDateToServerFormat(dateRange[1].toString())
			}

			if(this.searchValue.trim().length === 0){
				this.getTrips();
			  }else{
				  this.searchData(this.searchValue)
			  }
		}
	}

	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}
}

