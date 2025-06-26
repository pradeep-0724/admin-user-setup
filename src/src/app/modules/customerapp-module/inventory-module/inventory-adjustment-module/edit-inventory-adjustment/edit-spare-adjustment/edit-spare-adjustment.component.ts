import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray,UntypedFormControl,AbstractControl} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/core/services/common.service';
import { OperationsActivityService } from 'src/app/modules/customerapp-module/api-services/operation-module-service/operations-activity.service';
import { isValidValue, getObjectFromList,  getBlankOption} from 'src/app/shared-module/utilities/helper-utils';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { InventoryService } from '../../../../api-services/inventory-service/inventory.service';


@Component({
  selector: 'app-edit-spare',
  templateUrl: './edit-spare-adjustment.component.html',
  styleUrls: ['./edit-spare-adjustment.component.scss']
})
export class EditSpareAdjustmentComponent implements OnInit {
  editSpareForm: UntypedFormGroup;
  materialList: any = [];
  showAddExpenseItemPopup: any = {name: '', status: false};
  expenseItemDropdownIndex: number = -1;
  staticOptions: any = {};
  newSparesItemParams: any = {
		name: '',
    };
  showCustomFieldsByDefault: boolean = false;
  isDisable=false;
  itemsDisable: any=[];
  count=0;
  stockDate: string = "";
  currency_type;
  @Input() inventoryData = new BehaviorSubject({});
  @Output() addSpareData =new EventEmitter<any>();
  @Input () spareData=new BehaviorSubject([]);
  @Input() isFormValid=new BehaviorSubject({});

  constructor(
    private _fb: UntypedFormBuilder,
    private _operationsActivityService: OperationsActivityService,
    private _commonService: CommonService,
    private currency:CurrencyService,
    private _inventoryService: InventoryService,
  ) { }

  ngOnInit() {
     setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.getAllInitialRequirement();
    this.spareData.subscribe(data=>{
      this.patcForm(data);
    })
  }

  getStockDate() {
    return changeDateToServerFormat(this.stockDate)
  }

  setItemStockQuantity(item, index) {
      const stockDate = this.getStockDate();
      const itemId = item.get('item_name').value;
      if (!itemId || !stockDate) {
        return
      }

      this._inventoryService.getInventoryItemStockByDate(itemId, stockDate).subscribe((response: any) => {
          const itemQuantity = (response.result.stock).toFixed(3);
          item.get('quantity').setValue(itemQuantity);
          this.onQuantityChange(index);
      })
  }

  patcForm(data){
    if(data.length>0){
      let form = this.editSpareForm;
      let newSpareForm = form.get('new_spares') as UntypedFormArray;
      newSpareForm.reset();
      newSpareForm.controls=[];
      data.forEach((item,index) => {
      this.buildSpares(['']);
      this.itemsDisable.push(this.isDisable);
        newSpareForm.controls[index].patchValue({
          item_name:item.item.id,
          item_name_option:isValidValue(item.item)?{label:item.item.name,value:item.item.id}:getBlankOption(),
          total:item.total,
          newquantity:item.new_quantity,
          adjustment:item.adjustment,
          quantity:item.quantity_available,
          rate:item.rate,
          hsn_code:item.hsn_code,
          note:item.note
        })
      });
    }
  }

  getAllInitialRequirement(){
    this.buildForm();
    this.addMoreOtherItem();
    this.getMaterials();
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.staticOptions.itemUnits = response.result['item-unit'];
    });
    this.inventoryData.subscribe(data => {
      this.stockDate = data['stockDate'];
    });
    this.onChanges();
  }

  buildForm() {
		this.editSpareForm = this._fb.group({
     new_spares:this._fb.array([]),
		});
    return this.editSpareForm;
  }


  onChanges(): void {
    this.editSpareForm.get('new_spares').valueChanges.subscribe(val => {
      this.emitData();
    });
  }

  buildNewSpares(item: any) {
		return this._fb.group({
      id: [
        item.id || null
      ],
			item_name: [
        item.item_name || null,
        Validators.required,
      ],
      item_name_option:getBlankOption(),
      quantity: [
        item.quantity || 0,
        Validators.required,
      ],
      rate: [
        item.rate||0,
        Validators.required,
			],
			adjustment:  [
        item.adjustment || 0,
        Validators.required,
      ],
      adjustment_negative:[false],
      total: [item.total ||0],
      newquantity:[ item.newquantity||0],
      additionalDetails: [
				this.showCustomFieldsByDefault
      ],
      note:[''],
      hsn_code:[null],
      isChangeHsn:[false],
		});
	}


  buildSpares(items: any = []) {
    const newSpares = this.editSpareForm.controls['new_spares'] as UntypedFormArray;
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

	openAddExpenseItemModal($event, index) {
		if ($event)
		  this.expenseItemDropdownIndex = index;
		  this.showAddExpenseItemPopup = {name: this.newSparesItemParams.name, status: true};
	}

  onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
    const itemId = itemExpenseControl.get('item_name').value;
    const itemOption = itemExpenseControl.get('item_name_option');
    let itemvalue = this.materialList.filter(item => item.id == itemId)
    itemExpenseControl.get('hsn_code').setValue(itemvalue[0].hsn_code)
    if (itemOption.value.value != itemId){
      this.resetOtherExpenseExceptItem(itemExpenseControl, index);
      this.setItemStockQuantity(itemExpenseControl, index);
    }
    itemOption.setValue({label: itemvalue[0].name, value: itemvalue[0].id})
  }


  resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index){
    formGroup.patchValue(
      {
        quantity: 0,
        total: 0,
        adjustment: 0,
        rate: 0,
        newquantity:0
        });
  }

  onChangeOtherExpenseItem(index) {
    const newSpares = this.editSpareForm.controls['new_spares'] as UntypedFormArray;
    const newSpareExpanse = newSpares.at(index);
    const itemId = newSpareExpanse.get('item_name').value;
    if (itemId) {
      const expenseItem = getObjectFromList(itemId,this.materialList);
      if (expenseItem) {
        newSpareExpanse.get('hsn_code').setValue(expenseItem.hsn_code);
      }
    }
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
				let other_expense = this.editSpareForm.controls['new_spares'] as UntypedFormArray;
          other_expense.at(this.expenseItemDropdownIndex).get('item_name').setValue($event.id);
          other_expense.at(this.expenseItemDropdownIndex).get('item_name_option').setValue({value: $event.id, label: $event.label});
				  let itemExpenseControl = other_expense.at(this.expenseItemDropdownIndex) as UntypedFormGroup;
				  this.resetOtherExpenseExceptItem(itemExpenseControl, this.expenseItemDropdownIndex);
				  this.onChangeOtherExpenseItem(this.expenseItemDropdownIndex);
				  this.expenseItemDropdownIndex = -1;
			  }
			}
		  });
		}
  }


  changeRateNegativity(index){
    const newSpareItems = this.editSpareForm.controls['new_spares']  as UntypedFormArray;
    let setNewQuantity = newSpareItems.at(index).get('newquantity');
    let adjustment= newSpareItems.at(index).get('adjustment');
    let rate = newSpareItems.at(index).get('rate');

    if (Number(adjustment.value) <= 0) {
      rate.setValue(0);
      newSpareItems.at(index).get('adjustment_negative').setValue(true);
    } else {
      newSpareItems.at(index).get('adjustment_negative').setValue(false);
    }

    if (Number(setNewQuantity.value) < 0) {
      setNewQuantity.setValue(0);
      rate.setValue(0);
    }
  }

  onQuantityChange(index){
    const newSpareItems = this.editSpareForm.controls['new_spares']  as UntypedFormArray;
    let quantity = newSpareItems.at(index).get('quantity').value;
    let newquantity= newSpareItems.at(index).get('newquantity').value;
    let setAdjustment= newSpareItems.at(index).get('adjustment');
    const adjustment=(Number(newquantity) - Number(quantity)).toFixed(3);
    setAdjustment.setValue(adjustment);

    this.changeRateNegativity(index);
    this.calculateItemAmount(index);
  }

  calculateItemAmount(index) {
    const newSpareItems = this.editSpareForm.controls['new_spares']  as UntypedFormArray;
    let newquantity= newSpareItems.at(index).get('newquantity').value;
    let rate = newSpareItems.at(index).get('rate').value;
    let setamount = newSpareItems.at(index).get('total');
    const  amount = ((Number(rate) * Number(newquantity))).toFixed(3);
    setamount.setValue(amount);
  }

  onAdjustmentChange(index){
    const newSpareItems = this.editSpareForm.controls['new_spares']  as UntypedFormArray;
    let quantity = newSpareItems.at(index).get('quantity').value;
    let setNewQuantity = newSpareItems.at(index).get('newquantity');
    let adjustment= newSpareItems.at(index).get('adjustment');
    const quantity_adjustment = Number(quantity) + Number(adjustment.value);
    setNewQuantity.setValue(quantity_adjustment.toFixed(3));

    this.changeRateNegativity(index);
    this.calculateItemAmount(index);
  }

  removeItem(index){
    const otherItems = this.editSpareForm.controls['new_spares'] as UntypedFormArray;
    otherItems.removeAt(index);
    this.itemsDisable.splice(index,1);

  }

  addMoreOtherItem(){
    this.buildSpares(['']);
    this.emitData();
    if(this.count>0){
      this.itemsDisable.push(false);
      this.count++;
    }
  }

  clearAllOtherItems(){
    const otherItems = this.editSpareForm.controls['new_spares'] as UntypedFormArray;
		otherItems.reset();
		otherItems.controls = [];
    this.addMoreOtherItem();
    this.itemsDisable=[];
  }

  clearData(i){
    this.editSpareForm.controls['new_spares']['controls'][i].get('note').setValue('')
  }

emitData(){
  let form = this.editSpareForm;
  this.addSpareData.emit(form);
  this.isFormValid.subscribe(data=>{
    if(!data){
      this.setAsTouched(form)
    }
  })
}

addErrorClass(controlName: AbstractControl) {
  return TransportValidator.addErrorClass(controlName);
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


}
