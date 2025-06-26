import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TaxService } from 'src/app/core/services/tax.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { QuotationV2Service } from '../../../../api-services/trip-module-services/quotation-service/quotation-service-v2';
import { CommonService } from 'src/app/core/services/common.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { debounceTime } from 'rxjs/operators';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Dialog} from '@angular/cdk/dialog';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { Observable } from 'rxjs';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';

@Component({
	selector: 'app-item-others-quotation',
	templateUrl: './item-others-quotation.component.html',
	styleUrls: ['./item-others-quotation.component.scss']
})
export class ItemOthersQuotationComponent implements OnInit, AfterViewInit {
	itemOthersForm: FormGroup;
	initialValues = {
		item: [],
		units: [],
		tax:[]
	}
	isTax = true;
	staticOptions: any = {};
	defaultTax = new ValidationConstants().defaultTax;
	taxOptions = [];
	@Input() isShowRefresh = false;
	prefixUrl=getPrefix();
	@Output() itemOthersFormValue = new EventEmitter();
	@Input() isEdit = false;
	@Input() editData;
	@Input() customerId: Observable<string>;
	customer = '';
	currency ;
	constructor(private _fb: FormBuilder, private _commonService: CommonService,
		private _isTax: TaxService, private _quotationV2Service: QuotationV2Service,
		private _currencyService : CurrencyService ,private _rateCardService : RateCardService ,private dialog : Dialog) { }

	ngOnInit(): void {
		this.currency = this._currencyService.getCurrency();
		this.isTax = this._isTax.getTax();
		this.buildForm();
		this.buildNewItemExpenses([{}]);


		if (this.isEdit) {
			this.patchItemOthers();
		}
		this.itemOthersFormValue.emit(this.itemOthersForm)
		this.itemOthersForm.valueChanges.pipe(debounceTime(300)).subscribe(resp => {
			this.itemOthersFormValue.emit(this.itemOthersForm)
		})
		this.customerId.subscribe((res)=>{
			this.customer = res;
			this.getAdditionalCharges();
		})

	}

	ngAfterViewInit(): void {
		setTimeout(() => {
			this.getTaxDetails();
			this.getUnits();
		},0);
	}

	buildForm() {
		this.itemOthersForm = this._fb.group({
			tax: [this.defaultTax],
			other_items: this._fb.array([]),
		});
	}

	addMoreOtherItem() {
		const otherItems = this.itemOthersForm.controls['other_items'] as FormArray;
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(getBlankOption());
		this.initialValues.tax.push(getNonTaxableOption());
		otherItems.push(this.getItemOthers({}));
	}

	removeOtherItem(index) {
		const otherItems = this.itemOthersForm.controls['other_items'] as FormArray;
		this.initialValues.item.splice(index, 1);
		this.initialValues.units.splice(index, 1);
		otherItems.removeAt(index);
	}

	getItemOthers(item: any) {
		return this._fb.group({
			item: [null],
			quantity: [0],
			unit: [null],
			unit_cost: [0],
			total_amount: [0],
			tax:this.defaultTax
		});
	}
	buildNewItemExpenses(items = []) {
		this.initialValues.item = [];
		this.initialValues.units = [];
		this.initialValues.tax=[];
		let newOtherItem = this.itemOthersForm.controls['other_items'] as FormArray;
		newOtherItem.controls = [];
		if (items.length > 0) {
			items.forEach((i, item) => {
				this.initialValues.item.push(getBlankOption());
				this.initialValues.units.push(getBlankOption());
				this.initialValues.tax.push(getNonTaxableOption());
				newOtherItem.push(this.getItemOthers(i));
			});
		} else {
			this.addMoreOtherItem();
		}

	}
	addErrorClass(controlName: AbstractControl) {
		return TransportValidator.addErrorClass(controlName);
	}
	addNewAdditionalCharge(event,i) {
		const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
		  data : {
			data :'0',
			isEdit : false,
			charge_name : event,
			sales: true,
			purchase: false,
			vehicleCategory: true,
			isDisableSeletAll: true
		  },
		  width: '1000px',
		  maxWidth: '90%',
		  closeOnNavigation: true,
		  disableClose: true,
		  autoFocus: false
		});
		let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
		if(item){
			let itemarray = this.itemOthersForm.controls['other_items'] as FormArray;
			this.getAdditionalCharges();
			itemarray.controls[i].get('item').setValue(item?.name?.id);
			itemarray.controls[i].get('unit').setValue(item?.unit_of_measurement?.id);
			itemarray.controls[i].get('tax').setValue(item?.tax?.id);
			this.initialValues.item[i] = {label :item?.name?.name};
			this.initialValues.units[i] = {label : item?.unit_of_measurement?.label};
			this.initialValues.tax[i] = {label :item?.tax?.label};
			this.onTaxChanges();
		}
		 
		  dialogRefSub.unsubscribe();
		})
	  }

	onMaterialSelected(form: FormGroup, index,event) {
		this.resetOtherItem(form, index);		
		const itemSelected = this.staticOptions.materialList.filter((item) => item['name'].id === event.target.value)[0];
		form.get('unit_cost').setValue(itemSelected.rate);
		if (itemSelected['unit_of_measurement']) {
			form.get('unit').setValue(itemSelected.unit_of_measurement?.['id']);
			this.initialValues.units[index] = { label: itemSelected.unit_of_measurement.label, value: itemSelected.unit_of_measurement.id }
		}
		if (itemSelected['tax']) {
			form.get('tax').setValue(itemSelected.tax?.['id']);
			this.initialValues.tax[index] = { label: itemSelected.tax.label, value: itemSelected.tax.id }
		}
		this.makeMandatory(form);
	}

	resetOtherItem(formGroup: FormGroup, index) {
		formGroup.patchValue({ unit: null, unit_cost: 0.000, total_amount: 0.000, quantity: 0.000 ,tax:this.defaultTax});
		this.initialValues.units[index] = getBlankOption();
		this.initialValues.tax[index] = getNonTaxableOption();
	}

	getTaxDetails() {
		this._quotationV2Service.getTaxDetails().subscribe(result => {
			this.taxOptions = result.result['tax'];
		})
	}

	getAdditionalCharges() {
		let params ={
			vehicle_category : 0
		}
		this._rateCardService.getCustomerAdditionalCharge(this.customer,params).subscribe((response) => {
			this.staticOptions.materialList = response['result']
		})
	}

	getUnits() {
		this._commonService.getStaticOptions('item-unit').subscribe((response) => {
			this.staticOptions.itemUnits = response.result['item-unit'];

		});
	}



	refresh() {
		this.buildNewItemExpenses([{}]);
	}

	cloneItemOther(form: FormGroup, index) {
		this.addMoreOtherItem();
		const other_items = (this.itemOthersForm.get('other_items') as FormArray).at(index + 1);
		other_items.patchValue(form.value)
		if (form.value['item']) {
			let itemValue = []
			itemValue = this.staticOptions.materialList.filter(item => item['name']['id'] == form.value['item'])
			if (itemValue.length) this.initialValues.item[index + 1] = { label: itemValue[0].name['name'], value: itemValue[0]['name'].id }
		}
		if (form.value['unit']) {
			let unitValue = []
			unitValue = this.staticOptions.itemUnits.filter(item => item.id == form.value['unit'])
			if (unitValue.length) this.initialValues.units[index + 1] = { label: unitValue[0].label, value: unitValue[0].id }
		}
		if (form.value['tax']) {
			let taxvalue = []
			taxvalue = this.taxOptions.filter(item => item.id == form.value['tax'])
			if (taxvalue.length) this.initialValues.tax[index + 1] = { label: taxvalue[0].label, value: taxvalue[0].id }
		}
	}

	onTaxChanges() {
		const other_items = this.itemOthersForm.get('other_items') as FormArray
		other_items.controls.forEach(other => {
			let rate = Number(other.get('unit_cost').value);
			let quantity = Number(other.get('quantity').value);
			let amountbeforeTax = rate * quantity;
			other.get('total_amount').setValue((amountbeforeTax ).toFixed(3))
		})
	}

	makeMandatory(form: FormGroup) {
		if (form.value['item'] || form.value['unit'] || Number(form.value['unit_cost']) > 0 || Number(form.value['quantity']) > 0) {
			setUnsetValidators(form, 'unit_cost', [Validators.min(0.01)])
			setUnsetValidators(form, 'quantity', [Validators.min(0.01)])
			setUnsetValidators(form, 'item', [Validators.required])
			setUnsetValidators(form, 'unit', [Validators.required])
		} else {
			setUnsetValidators(form, 'unit_cost', [Validators.nullValidator])
			setUnsetValidators(form, 'quantity', [Validators.nullValidator])
			setUnsetValidators(form, 'item', [Validators.nullValidator])
			setUnsetValidators(form, 'unit', [Validators.nullValidator])
		}
	}


	patchItemOthers() {
		if (this.editData['tax']) {
			this.initialValues.tax = this.editData['tax']
			this.itemOthersForm.get('tax').setValue(this.editData['tax'].id)
		}
		let otherChargesList = []
		this.buildNewItemExpenses(this.editData.others)
		otherChargesList = this.editData.others
		otherChargesList.forEach((other, index) => {
			if (other['item']) {
				this.initialValues.item[index] = { label: other['item'].name, value: other['item'].id }
				other['item'] = other['item'].id
			}
			if (other['unit']) {
				this.initialValues.units[index] = { label: other['unit'].label, value: other['unit'].id }
				other['unit'] = other['unit'].id
			}
			if (other['tax']) {
				this.initialValues.tax[index] = { label: other['tax'].label, value: other['tax'].id }
				other['tax'] = other['tax'].id
			}
		})
		otherChargesList.forEach((others, index) => {
			const form = (this.itemOthersForm.get('other_items') as FormArray).at(index) as FormGroup;
			form.patchValue(others)
		})
		setTimeout(() => {
			this.itemOthersFormValue.emit(this.itemOthersForm)
		}, 400);
	}

}

