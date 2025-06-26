import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { isValidValue,getBlankOption,trimExtraSpaceBtwWords} from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { OperationsActivityService } from '../../../../api-services/operation-module-service/operations-activity.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-edit-new-tyre',
  templateUrl: './edit-new-tyre.component.html',
  styleUrls: ['./edit-new-tyre.component.scss']
})
export class EditNewTyreComponent implements OnInit {

  editNewTyreForm: UntypedFormGroup;
  staticOptions: any = {};
  defaultTax = new ValidationConstants().defaultTax;
	afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
  alphaNumericPattern= new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  expenseAccountList: any = [];
  newTryeTotal: any = {
  subtotal: 0,
  subtotal_challan: 0.0,
	subtotal_others: 0.0,
	discountTotal: 0,
	taxes: [],
	discountAfterTaxTotal: 0,
	tdsAmount: 0,
	adjustmentAmount: 0,
    total: 0,
	balance: 0.0
  };
  modelApi = '';
  newTyreItemPerms: any = {
		name: '',
    };
    modelParams = {
      name: ''
    };
  	initialValues: any = {
      expenseAccount: [],
      item: [],
      adjustmentAccount: getBlankOption(),
      manufacturer:[],
      threadType:[],
      model:[],
    };
    is_transaction_includes_tax:boolean;
    manufacturerApi = TSAPIRoutes.static_options;
    disableTax:boolean;
    manufacturerParams: any = {};
    companyRegistered:boolean;
    threadTypeParams: any = {};
    tyreModel = [];
    isDisable=true;
    itemsDisable: any=[];
    currency_type;
    showCustomFieldsByDefault: boolean = false;
  @Input() inventorydata =new BehaviorSubject({});
  @Output() newTyreData =new EventEmitter<any>();
  @Input() isFormValid=new BehaviorSubject({});
  @Input() inventoryDetails:any;
  inventorydataObject={
    companyRegistered:'',
  }
  isUniqueNumber:boolean=true;
  makePlaceholderOption: any = { label: 'MAKE', value: null }
  modelPlaceholderOption: any = { label: 'MODEL', value: null }
  typePlaceholderOption: any = { label: 'TYPE', value: null }

  constructor(
    private _fb: UntypedFormBuilder,
    private _revenueService: RevenueService,
    private _commonService: CommonService,
    private _vehicleService: VehicleService,
    private _operationActivityService: OperationsActivityService,
    private currency:CurrencyService
  ) { }

  ngOnInit() {

     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);

    this._commonService
    .getStaticOptions(
      'tyre-manufacturer,tyre-thread-type'
    )
    .subscribe((response) => {
      this.staticOptions.threadType = response.result['tyre-thread-type'];
      this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
    });

    this.buildForm();
    this.getExpenseAccountsAndSetAccount();
    this.inventorydata.subscribe(data=>{

      if(this.inventorydataObject['companyRegistered'] !==data['companyRegistered']){
        this.companyRegistered=data['companyRegistered'];
      }
      this.initialiseDataObject(data);
    })
  }
  ngOnChanges(): void {
    this.patchForm(this.inventoryDetails);
  }
  buildForm() {
		this.editNewTyreForm = this._fb.group({
     new_tyre:this._fb.array([]),
    discount_type: [
      0
    ],
    discount: [
      0
    ],
    adjustment_account: [
      null
    ],
    adjustment_choice: [
      0
    ],
    sub_total_without_tax: [0],
    adjustment: [
      0
    ],
    hsn_code:['',[Validators.pattern(this.alphaNumericPattern)]],
		});
    return this.editNewTyreForm;
  }


  initialiseDataObject(data){
    for (const key in data ) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        this.inventorydataObject[key]=data[key];
      }
    }
  }

 patchForm(inventoryDetails){
  if(inventoryDetails['tyres']){
    let  itemdata=[];
      inventoryDetails['tyres'].forEach(item=>{
      this.itemsDisable.push(item.disabled);
      itemdata.push({
       id: item.id,
       unique_number: item.unique_no,
       manufacturer: item.manufacturer ? item.manufacturer.id : null,
       model: item.tyre_model ? item.tyre_model.id : null,
       rate:item.amount,
       total:item.total,
       note:item.note,
       thread_type: item.thread_type ? item.thread_type.id : null,
       tyre: item.tyre
      })
      this.patchingInitailDropdown(item,'label','manufacturer','manufacturer',true);
      this.patchingInitailDropdown(item,'name','model','tyre_model',true);
      this.patchingInitailDropdown(item,'label','threadType','thread_type',true);
      this.patchModels(item);
     });
      this.patchingInitailDropdown(inventoryDetails,'name','adjustmentAccount','adjustment_account',false);

     setTimeout(() => {
       this.buildTyre(itemdata);
       this.patchCalculations(inventoryDetails);
       this.onCalcuationsChanged();
     }, 1000);
     }
     else{
     setTimeout(() => {
      this.buildTyre([{}]);
      this.itemsDisable.push(false);
    }, 100);
     }
  }

  patchModels(item){
    this.tyreModel = [];
    if(item.manufacturer){
      const makeId = item.manufacturer.id;
      this._vehicleService.getModel(makeId).subscribe(data => {
        this.tyreModel.push(data.result);
      })
    }
  }

  patchCalculations(inventoryDetails){
   let formObject = {
     discount_type: ["discount_type", "index"],
     discount: "discount",
     adjustment_choice: ["adjustment_choice", "index"],
     adjustment: "adjustment",
     adjustment_account:["adjustment_account", "id"],
     hsn_code:"hsn_code",
     };
     const form = this.editNewTyreForm as UntypedFormGroup;
        for (const key in formObject) {
          if (Object.prototype.hasOwnProperty.call(formObject, key)) {
            const element = formObject[key];
             let isArray = Array.isArray(element);
             if(isArray){

              if(!inventoryDetails[element[0]]) {
                continue
              }
              form.get(key).setValue(inventoryDetails[element[0]][element[1]]);
             }else{
              form.get(key).setValue(inventoryDetails[element]);
             }
          }
        }
  }

  patchingInitailDropdown(data,displayType,itemFor,itemName,isArray){
     if(isValidValue(data[itemName])){
       if(isArray){
         this.initialValues[itemFor].push({
           label:data[itemName][displayType],
           value:data[itemName].id
       })
       }
       else{
         this.initialValues[itemFor]={
           label:data[itemName][displayType],
           value:data[itemName].id
         }
       }
     }else{
       this.initialValues[itemFor]=getBlankOption();
     }
   }


  buildNewTyre(item: any) {
		return this._fb.group({
      id : [item.id || null],
			rate:  [
        item.rate || 0, [Validators.min(0.01)]
			],
      total: [item.total||0],
      manufacturer: [
				item.manufacturer || null,
      ],
      thread_type: [
				item.thread_type || null,
      ],
      model: [
        item.model || null,
      ],
      unique_number:[
        item.unique_number || '',
        Validators.required
      ],
      tyre: [
        item.tyre || null
      ],
      unique_number_status:[true],
      additionalDetails: [
				this.showCustomFieldsByDefault
      ],
      note:[''||item.note]
		});
	}


  buildTyre(items: any = []) {
    const newTyre = this.editNewTyreForm.controls['new_tyre'] as UntypedFormArray;
    items.forEach((item) => {
      newTyre.push(this.buildNewTyre(item));
      });
  }


  getExpenseAccountsAndSetAccount() {
    this._revenueService.getAccounts('Expense,Other Expense,Cost of Services / COGS').subscribe((response) => {
      if (response !== undefined) {
        this.expenseAccountList = response.result;
        this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
        this.editNewTyreForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
      }
    });
  }

  addParamsToNewSpareItem($event) {
		this.newTyreItemPerms = {
			name: $event
		};
  }




  onCalcuationsChanged() {
		let otherItems = this.editNewTyreForm.controls['new_tyre'] as UntypedFormArray;
    this.newTryeTotal.subtotal_challan = 0;
		this.newTryeTotal.subtotal_others = 0;
    this.newTryeTotal.subtotal = 0;
		this.newTryeTotal.total = 0;
    this.newTryeTotal.taxTotal = 0;


			otherItems.controls.forEach((others) => {
				let amountWithoutTax = Number(others.get('rate').value);

          others.get('total').setValue(Number(amountWithoutTax));
					this.newTryeTotal.subtotal_others = (Number(this.newTryeTotal.subtotal_others) +
						Number(amountWithoutTax)).toFixed(3);
					this.newTryeTotal.subtotal = (Number(this.newTryeTotal.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.newTryeTotal.total = (Number(this.newTryeTotal.total) + Number(amountWithoutTax)).toFixed(3);


			});

		this.calculateTotals();
	}



	calculateTotals() {
		const form = this.editNewTyreForm;
		const discountAmount = form.get('discount').value;
		const adjustmentAmount = form.get('adjustment').value;

		if (isValidValue(discountAmount)) {
			this.newTryeTotal.discountTotal =
				form.get('discount_type').value == 0
					? (discountAmount / 100 * this.newTryeTotal.subtotal).toFixed(3)
					: discountAmount;
		} else {
			this.newTryeTotal.discountTotal = 0;
		}
		this.editNewTyreForm.controls.sub_total_without_tax.setValue(this.newTryeTotal.subtotal);


		if (isValidValue(adjustmentAmount)) {
			this.newTryeTotal.adjustmentAmount =
				form.get('adjustment_choice').value == 0
					? ((Number(this.newTryeTotal.subtotal) -
						Number(this.newTryeTotal.discountTotal) +
						Number(this.newTryeTotal.taxTotal) -
						Number(this.newTryeTotal.discountAfterTaxTotal)) *
						Number(adjustmentAmount) /
						100).toFixed(3)
					: adjustmentAmount;
		}

		this.newTryeTotal.total = (this.newTryeTotal.total -
			Number(this.newTryeTotal.discountTotal)  +
			Number(this.newTryeTotal.adjustmentAmount)).toFixed(3);

		this.newTryeTotal.balance = (Number(this.newTryeTotal.total)).toFixed(3);
   let outPutdata={
    newTryeTotal:this.newTryeTotal,
    form:form

   }
   if(this.checkUnqueNumberUnique()){
     this.newTyreData.emit(outPutdata);
      this.isFormValid.subscribe(data=>{
        if(!data){
          this.setAsTouched(form)
        }
    })
   }
  }

  removeOtherItem(index){
    const otherItems = this.editNewTyreForm.controls['new_tyre'] as UntypedFormArray;
		this.initialValues.model.splice(index, 1);
		this.initialValues.manufacturer.splice(index, 1);
		this.initialValues.threadType.splice(index, 1);
		otherItems.removeAt(index);
    this.onCalcuationsChanged();
    this.itemsDisable.splice(index, 1);
  }


  addMoreOtherItem(){
    this.itemsDisable.push(false);
    this.buildTyre(['']);
    this.initialValues.manufacturer.push(this.makePlaceholderOption);
    this.initialValues.model.push(this.modelPlaceholderOption);
    this.initialValues.threadType.push(this.typePlaceholderOption);
  }


  clearAllOtherItems(){
    const otherItems = this.editNewTyreForm.controls['new_tyre'] as UntypedFormArray;
		this.emptyOtherItems();
		otherItems.reset();
		otherItems.controls = [];
		this.addMoreOtherItem();
    this.onCalcuationsChanged();
    this.itemsDisable=[];
  }

	emptyOtherItems(){
		this.initialValues.manufacturer = [];
    this.initialValues.model= [];
    this.initialValues.threadType= [];
  }



  addNewManufacturer(event) {
		this.manufacturerParams = {
			key: 'tyre-manufacturer',
			label: event,
			value: 0
		};
  }


	getNewManufacturer(event, index) {
		if (event) {
			this.staticOptions.tyreManufacturer = [];
			this.initialValues.manufacturer[index] = {};
			this._commonService
			.getStaticOptions('tyre-manufacturer')
			.subscribe((response) => {
				this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
				this.initialValues.manufacturer[index] = {value: event.id, label: event.label};
				this.editNewTyreForm.controls['new_tyre']['controls'][index].controls.manufacturer.setValue(event.id);
			});
		}
	}

	addNewThreadTYpe(event) {
		if (event) {
			const val = trimExtraSpaceBtwWords(event);
			this.threadTypeParams = {
				key: 'tyre-thread-type',
				label: val,
				value: 0
			};
		}
  }

  getThreadTYpe(event, index) {
		if (event) {
			this.staticOptions.threadType = [];
			this.initialValues.threadType[index] = {}
			this._commonService
				.getStaticOptions('tyre-thread-type')
				.subscribe((response) => {
					this.staticOptions.threadType = response.result['tyre-thread-type'];
					this.initialValues.threadType[index] = {value: event.id, label: event.label};
					this.editNewTyreForm.controls['new_tyre']['controls'][index].controls.thread_type.setValue(event.id);
				});
		}
	}

  updateModelForAllVehicles(index){
    const newTyre = this.editNewTyreForm.controls['new_tyre'] as UntypedFormArray;
    let makeId = newTyre.at(index).get('manufacturer').value
    this._vehicleService.getModel(makeId).subscribe(data => {

      newTyre.controls.forEach((element, index) => {
        if(element.get('manufacturer').value == makeId) {
          this.tyreModel[index] = data.result;
        }
      });
    })
  }

  getNewModel(data, index) {
    if (isValidValue(data)) {
      this.updateModelForAllVehicles(index);
    }
  }

  addNewModel($event) {
    this.modelParams = { name: $event };
  }

  onMakeChange(form, index) {
    this._vehicleService.getModel(form.get("manufacturer").value).subscribe(data => {
      this.modelApi = 'vehicle/tyre/manufacturer/' + form.get("manufacturer").value + '/model/'
      this.tyreModel[index] = data.result
    })
  }

  checkUnqueNumberUnique() {
    let uniqueNumberArray = [];
    let unique = true;
    const newTyre = this.editNewTyreForm.controls['new_tyre'] as UntypedFormArray;
    for (const items of newTyre['controls']) {
      if (items['controls'].unique_number.value != '' && items['controls'].unique_number.value != null) {
        uniqueNumberArray.push(items['controls'].unique_number.value)
      }
    }
    let valuesAlreadySeen = [];
    for (let i = 0; i < uniqueNumberArray.length; i++) {
      let value = uniqueNumberArray[i]
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        unique = false
      }
      valuesAlreadySeen.push(value)
    }

    if (unique) {
      return true
    } else {
      return false
    }
  }

  checkUnique(otherItem){
    let uniqueNumber = otherItem.get('unique_number').value;
    let tyreId = otherItem.get('tyre').value;
    if (uniqueNumber != '') {
      if(!this.checkUnqueNumberUnique()){
        otherItem.get('unique_number_status').setValue(false);
        this.setNotUniqueError();
      }else{
       this._operationActivityService.getUniqueNumber(uniqueNumber, tyreId).subscribe(data => {
         if (data.result.exists) {
           otherItem.get('unique_number_status').setValue(false);
         } else {
           otherItem.get('unique_number_status').setValue(true);
         }
         this.setNotUniqueError();
       })
      }
    } else {
      otherItem.get('unique_number_status').setValue(true);
      this.setNotUniqueError();
    }
  }

  setNotUniqueError(){
    let otherItems = this.editNewTyreForm.get('new_tyre') as UntypedFormArray;
    let flag = true;
    otherItems.controls.forEach((element) => {
      if(element.get('unique_number_status').value == false) {
        flag = false;
      }
    })
    this.isUniqueNumber = flag;
  }

  clearData(i){
      this.editNewTyreForm.controls['new_tyre']['controls'][i].get('note').setValue('')
    }


    setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
      group.markAsTouched();
      for (let i in group.controls) {
        if (group.controls[i] instanceof UntypedFormControl) {
          group.controls[i].markAsTouched();
        } else {
          this.setAsTouched(group.controls[i]);
        }
      }
    }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  cloneTyreItem(form :UntypedFormGroup){

    const tyreItems =  this.editNewTyreForm.controls['new_tyre']as UntypedFormArray;
    let itemsValue=form.value;
    itemsValue['unique_number']='';
    tyreItems.push(this.buildNewTyre(itemsValue))
    const itemId = form.get('manufacturer').value;
    if(itemId){
      let itemvalue=this.staticOptions.tyreManufacturer.filter(item => item.id==itemId);
      this.initialValues.manufacturer.push({label:itemvalue[0].label,value:itemvalue[0].id});
    }else{
      this.initialValues.manufacturer.push(this.makePlaceholderOption);
    }
    const  model =form.get('model').value;
    if(model){
      let modelValue=this.tyreModel[this.tyreModel.length-1].filter(item => item.id==model);
     this.initialValues.model.push({label:modelValue[0].name,value:modelValue[0].id});
    }else{
      this.initialValues.model.push(this.modelPlaceholderOption);
    }
    this.tyreModel.push(this.tyreModel[this.tyreModel.length-1]);
    const  thread_type = form.get('thread_type').value;
    if(thread_type){
      let thread_typeValue=this.staticOptions.threadType.filter(item => item.id==thread_type);
      this.initialValues.threadType.push({label:thread_typeValue[0].label,value:thread_typeValue[0].id})
    }else{
      this.initialValues.threadType.push(this.typePlaceholderOption);
    }
    this.onCalcuationsChanged();
  }
}
