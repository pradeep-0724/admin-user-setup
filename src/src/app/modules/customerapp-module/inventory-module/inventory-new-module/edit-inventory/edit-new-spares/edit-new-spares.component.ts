import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { isValidValue, getObjectFromList, getBlankOption} from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { BehaviorSubject } from 'rxjs';
import { OperationsActivityService } from '../../../../api-services/operation-module-service/operations-activity.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CurrencyService } from 'src/app/core/services/currency.service';


@Component({
  selector: 'app-edit-new-spares',
  templateUrl: './edit-new-spares.component.html',
  styleUrls: ['./edit-new-spares.component.scss']
})
export class EditNewSparesComponent implements OnInit {
  editNewSpareForm: UntypedFormGroup;
  materialList: any = [];
  showAddExpenseItemPopup: any = {name: '', status: false};
  expenseItemDropdownIndex: number = -1;
  staticOptions: any = {};
  defaultTax = new ValidationConstants().defaultTax;
	afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
  expenseAccountList: any = [];
  newSparesTotal: any = {
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
  newSparesItemParams: any = {
		name: '',
    };
  	initialValues: any = {
      units: [],
      expenseAccount: [],
      item: [],
      adjustmentAccount: getBlankOption(),
      tds:getBlankOption(),
    };
    is_transaction_includes_tax:boolean;
    disableTax:boolean;
    companyRegistered:boolean;
    showCustomFieldsByDefault: boolean = false;
    isDisable=true;
    itemsDisable: any=[];
    currency_type;
    unit={
      label:'UNIT',
      value:''
    }
    @Input() inventoryDetails:any;


  @Input() inventorydata =new BehaviorSubject({});
  @Output() newSpareData =new EventEmitter<any>();
  @Input() isFormValid=new BehaviorSubject({});

  inventorydataObject={
   companyRegistered:'',
  }
  constructor(
    private _fb: UntypedFormBuilder,
    private _revenueService: RevenueService,
    private _operationsActivityService: OperationsActivityService,
    private _commonService: CommonService,
    private currency:CurrencyService
  ) { }

  ngOnInit() {
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.buildForm();
    this.getMaterials();
    this.getExpenseAccountsAndSetAccount();
    this.inventorydata.subscribe(data=>{

      if(this.inventorydataObject['companyRegistered'] !==data['companyRegistered']){
        this.companyRegistered=data['companyRegistered'];
      }

      this.onCalcuationsChanged();
      this.initialiseDataObject(data);
    })
    this._commonService
    .getStaticOptions(
      'billing-payment-method,gst-treatment,payment-term,tax,tds,item-unit'
    )
    .subscribe((response) => {
      this.staticOptions.paymentMethods = response.result['billing-payment-method'];
      this.staticOptions.gstPercent = response.result['tax'];
      this.staticOptions.itemUnits = response.result['item-unit'];
      this.staticOptions.tds = response.result['tds'];
      this.newSparesTotal.taxes= this.staticOptions.gstPercent
    });

  }
  ngOnChanges(): void {
    this.patchForm(this.inventoryDetails);
  }
  buildForm() {
		this.editNewSpareForm = this._fb.group({
     new_spares:this._fb.array([]),
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
		});
    return this.editNewSpareForm;
  }


  initialiseDataObject(data){
    for (const key in data ) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        this.inventorydataObject[key]=data[key];
      }
    }
  }


 patchForm(inventoryDetails){
   if(isValidValue(inventoryDetails)){
     if(inventoryDetails.is_spares){
       let  itemdata=[];
       inventoryDetails['spares'].forEach(item=>{
         this.itemsDisable.push(false);
         itemdata.push({
          hsn_code:item.hsn_code,
          item_name:item.item.id,
          quantity:item.quantity,
          total:item.total,
          quantity_type:item.unit ? item.unit.id : '',
          unit_cost:item.unit_cost,
          note:item.note,
          amount:item.total_before_tax
         })
         this.patchingInitailDropdown(item,'name','item','item',true);
         this.patchingInitailDropdown(item,'label','units','unit',true);
        });
        setTimeout(() => {
          this.buildSpares(itemdata);
          this.patchingInitailDropdown(inventoryDetails,'name','adjustmentAccount','adjustment_account',false);
          this.patchCalculations(inventoryDetails);
          this.onCalcuationsChanged();
        }, 100);
      }else{
        setTimeout(() => {
         this.buildSpares([{}]);
         this.itemsDisable.push(false);
      }, 100);
      }
     }
   }

   patchCalculations(inventoryDetails){
    let formObject = {

      discount_type: ["discount_type", "index"],
      discount: "discount",
      adjustment_choice: ["adjustment_choice", "index"],
      adjustment: "adjustment",
      adjustment_account:["adjustment_account", "id"],
      };
      const form = this.editNewSpareForm as UntypedFormGroup;
         for (const key in formObject) {
           if (Object.prototype.hasOwnProperty.call(formObject, key)) {
             const element = formObject[key];
              let isArray=Array.isArray(element);
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

  buildNewSpares(item: any) {
		return this._fb.group({
			item_name: [
        item.item_name || null,
        Validators.required,
			],
			quantity: [
        item.quantity || 0, [Validators.min(0.001)]
      ],
      quantity_type: [
        item.quantity_type || null,
			],
			unit_cost:  [
        item.unit_cost || 0,
			],
      total: [item.total || 0,  [Validators.min(0.01)]],
      additionalDetails: [
				this.showCustomFieldsByDefault
      ],
      note:[''],
      hsn_code:[null],
      isChangeHsn:[false],
      amount:[item.amount||0]
		});
	}


  buildSpares(items: any = []) {
    const newSpares = this.editNewSpareForm.controls['new_spares'] as UntypedFormArray;
    items.forEach((item) => {
      newSpares.push(this.buildNewSpares(item));
      });
  }

  getMaterials(){
    this._operationsActivityService.getSpareItems().subscribe((response) => {
			if (response !== undefined) {
				this.materialList = response.result;
			}
		});
  }
  getExpenseAccountsAndSetAccount() {
    this._revenueService.getAccounts('Expense,Other Expense,Cost of Services / COGS').subscribe((response) => {
      if (response !== undefined) {
        this.expenseAccountList = response.result;
        this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
        this.editNewSpareForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
      }
    });
  }

	openAddExpenseItemModal($event, index) {
		if ($event)
		  this.expenseItemDropdownIndex = index;
		  this.showAddExpenseItemPopup = {name: this.newSparesItemParams.name, status: true};
		}

    onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
      const newSpares = this.editNewSpareForm.controls['new_spares'] as UntypedFormArray;
      const newSpareExpanse = newSpares.at(index);
      const itemId = newSpareExpanse.get('item_name').value;
      let itemvalue=this.materialList.filter(item => item.id==itemId)
      newSpareExpanse.get('hsn_code').setValue(itemvalue[0].hsn_code)
      this.resetOtherExpenseExceptItem(itemExpenseControl, index);
      this.onChangeOtherExpenseItem(index);
      }


      resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index){
        formGroup.patchValue({unit: null, unit_cost: 0,  total: 0, quantity: 0, total_before_tax: 0, expense_account: null});
        this.initialValues.units[index] =this.unit;
        this.initialValues.expenseAccount[index] = getBlankOption();
      }

      onChangeOtherExpenseItem(index) {
        const newSpares = this.editNewSpareForm.controls['new_spares'] as UntypedFormArray;
        const newSpareExpanse = newSpares.at(index);
        const itemId = newSpareExpanse.get('item_name').value;
        if (itemId) {
          const expenseItem = getObjectFromList(itemId,this.materialList);
          if (expenseItem) {
            if (expenseItem.unit){
            newSpareExpanse.get('quantity_type').setValue(expenseItem.unit.id);
            this.initialValues.units[index] = {label: expenseItem.unit.label, value: expenseItem.unit.id}
            }
            else {
              newSpareExpanse.get('quantity_type').setValue(null);
            this.initialValues.units[index] = this.unit;
            }
            newSpareExpanse.get('unit_cost').setValue(expenseItem.rate_per_unit);
          }
        }
        this.onCalcuationsChanged();
        }

  addParamsToNewSpareItem($event) {
		this.newSparesItemParams = {
			name: $event
		};
  }


  closeNewSparesItemPopup(){
    this.showAddExpenseItemPopup = {name: '', status: false};
  }

  addDropDownNewSapre($event) {
		if ($event) {
		  this._operationsActivityService.getSpareItems().subscribe((response) => {
			if (response && response.result && response.result.length > 0) {
				this.materialList = response.result;
			  if (this.expenseItemDropdownIndex != -1){
				this.initialValues.item[this.expenseItemDropdownIndex] = {value: $event.id, label: $event.label};
				let other_expense = this.editNewSpareForm.controls['new_spares'] as UntypedFormArray;
				  other_expense.at(this.expenseItemDropdownIndex).get('item_name').setValue($event.id);
				  let itemExpenseControl = other_expense.at(this.expenseItemDropdownIndex) as UntypedFormGroup;
				  this.resetOtherExpenseExceptItem(itemExpenseControl, this.expenseItemDropdownIndex);
				  this.onChangeOtherExpenseItem(this.expenseItemDropdownIndex);
				  this.expenseItemDropdownIndex = -1;
			  }
			}
		  });
		}
  }



  onCalcuationsChanged() {
		let otherItems = this.editNewSpareForm.controls['new_spares'] as UntypedFormArray;
    	this.newSparesTotal.subtotal_challan = 0;
		this.newSparesTotal.subtotal_others = 0;
    	this.newSparesTotal.subtotal = 0;
		this.newSparesTotal.total = 0;
    this.newSparesTotal.taxTotal = 0;


			otherItems.controls.forEach((others) => {
				let amountWithoutTax = Number(others.get('total').value);


					this.newSparesTotal.subtotal_others = (Number(this.newSparesTotal.subtotal_others) +
						Number(amountWithoutTax)).toFixed(3);
					this.newSparesTotal.subtotal = (Number(this.newSparesTotal.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.newSparesTotal.total = (Number(this.newSparesTotal.total) + Number(amountWithoutTax)).toFixed(3);


			});

		this.calculateTotals();
	}

  calculateItemAmount(index){
    const newSpareItems = this.editNewSpareForm.controls['new_spares']  as UntypedFormArray;
    let quantity = newSpareItems.at(index).get('quantity').value;
    let unit_cost = newSpareItems.at(index).get('unit_cost').value;
    let setamount = newSpareItems.at(index).get('total');
    const  amount = (quantity * unit_cost).toFixed(3);
    setamount.setValue(amount);
    this.onCalcuationsChanged();
  }

	calculateTotals() {
		const form = this.editNewSpareForm;
		const discountAmount = form.get('discount').value;
		const adjustmentAmount = form.get('adjustment').value;

		if (isValidValue(discountAmount)) {
			this.newSparesTotal.discountTotal =
				form.get('discount_type').value == 0
					? (discountAmount / 100 * this.newSparesTotal.subtotal).toFixed(3)
					: discountAmount;
		} else {
			this.newSparesTotal.discountTotal = 0;
		}
    this.editNewSpareForm.controls.sub_total_without_tax.setValue(this.newSparesTotal.subtotal);



		if (isValidValue(adjustmentAmount)) {
			this.newSparesTotal.adjustmentAmount =
				form.get('adjustment_choice').value == 0
					? ((Number(this.newSparesTotal.subtotal) -
						Number(this.newSparesTotal.discountTotal)) *
						Number(adjustmentAmount) /
						100).toFixed(3)
					: adjustmentAmount;
		}

		this.newSparesTotal.total = (this.newSparesTotal.total -
			Number(this.newSparesTotal.discountTotal)  +
			Number(this.newSparesTotal.adjustmentAmount)).toFixed(3);


    this.newSparesTotal.balance = (Number(this.newSparesTotal.total)).toFixed(3);

   let outPutdata={
    newSparesTotal:this.newSparesTotal,
    form:form

   }
   this.newSpareData.emit(outPutdata);

   this.isFormValid.subscribe(data=>{
    if(!data){
      this.setAsTouched(form)
    }
})
  }

  removeOtherItem(index){
    const otherItems = this.editNewSpareForm.controls['new_spares'] as UntypedFormArray;
		this.initialValues.expenseAccount.splice(index, 1);
		this.initialValues.item.splice(index, 1);
		this.initialValues.units.splice(index, 1);
		otherItems.removeAt(index);
    this.onCalcuationsChanged();
    this.itemsDisable.splice(index, 1);
  }


  addMoreOtherItem(){
    this.itemsDisable.push(false);
    this.buildSpares(['']);
		this.initialValues.item.push(getBlankOption());
		this.initialValues.units.push(this.unit);
  }


  clearAllOtherItems(){
    const otherItems = this.editNewSpareForm.controls['new_spares'] as UntypedFormArray;
		this.emptyOtherItems();
		otherItems.reset();
		otherItems.controls = [];
		this.addMoreOtherItem();
		this.onCalcuationsChanged();
  }

	emptyOtherItems(){
		this.initialValues.units = [];
		this.initialValues.item = [];
  }


  clearData(i){
    this.editNewSpareForm.controls['new_spares']['controls'][i].get('note').setValue('')
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

  cloneSpareItem(form: UntypedFormGroup){

    const spareItems =  this.editNewSpareForm.controls['new_spares']as UntypedFormArray;
        spareItems.push(this.buildNewSpares(form.value))
        const itemId = form.get('item_name').value;
        if(itemId){
          let itemvalue=this.materialList.filter(item => item.id==itemId);
          this.initialValues.item.push({label:itemvalue[0].name,value:itemvalue[0].id});
        }else{
          this.initialValues.item.push(getBlankOption())
        }
        const  quantity_type =form.get('quantity_type').value;
        if(quantity_type){
          let itemvquantity_typeValue=this.staticOptions.itemUnits.filter(item => item.id==quantity_type);
          this.initialValues.units.push({label:itemvquantity_typeValue[0].label,value:itemvquantity_typeValue[0].id});
        }else{
          this.initialValues.units.push(this.unit);
        }
    this.onCalcuationsChanged();
  }

}
