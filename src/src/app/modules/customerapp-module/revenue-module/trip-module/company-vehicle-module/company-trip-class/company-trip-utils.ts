import { UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { defaultZero } from 'src/app/shared-module/utilities/currency-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';


export function  filterDriver(employeeListArray:Array<any>):Array<any>{
  const employeeList = employeeListArray;
  let driverList = employeeList.filter((employee) =>  employee.designation=== 'Driver & Helper');
  return driverList;
}



export function  filterHelper(employeeListArray:Array<any>):Array<any>{
  const employeeList = employeeListArray;
  let helperList = employeeList.filter((employee) => employee.designation === 'Driver & Helper');
  return helperList;
}

export function emptyAdvanceFuelBattaClient(addTripForm :UntypedFormGroup) {
 emptyFuel(addTripForm)
 emptyAdvance(addTripForm)
 emptyBatta(addTripForm)
}

export function emptyFuel(addTripForm :UntypedFormGroup){
  const fuelClient = addTripForm.controls['fuel_client'] as UntypedFormArray;
  fuelClient.patchValue([]);
  fuelClient.controls = [];
}
export function emptyAdvance(addTripForm :UntypedFormGroup){
  const advanceClient = addTripForm.controls['advance_client'] as UntypedFormArray;
  advanceClient.patchValue([]);
  advanceClient.controls = [];
}
export function emptyBatta(addTripForm :UntypedFormGroup){
  const battaClient = addTripForm.controls['batta_client'] as UntypedFormArray;
  battaClient.patchValue([]);
  battaClient.controls = [];
}

export function calExpenseTotal(i:number,addTripForm:UntypedFormGroup) {
  const estimate = (addTripForm.controls['estimates'] as UntypedFormArray).at(i);
  if (
    estimate.get('final_weight_amount').value !== '' &&
    estimate.get('shortage_weight_amount').value !== '' &&
    estimate.get('adjustment_amount').value !== ''
  ) {
    estimate.get('net_receiveable_amount').setValue(
      (defaultZero(estimate.get('final_weight_amount').value) -
      defaultZero(estimate.get('shortage_weight_amount').value)
      + defaultZero(estimate.get('adjustment_amount').value)).toFixed(3)
    );
  }
}

export function  calculateExpenseAmounts(i:number,addTripForm:UntypedFormGroup) {
  const estimate = (addTripForm.controls['estimates'] as UntypedFormArray).at(i);
  if (estimate.get('rate_per_unit').value !== '' && estimate.get('destination_weight').value !== '') {
    estimate.get('final_weight_amount').setValue((Number(estimate.get('destination_weight').value) * Number(estimate.get('rate_per_unit').value)).toFixed(3));
  }
  if (estimate.get('shortage_per_unit').value !== '' && estimate.get('deduction_weight').value !== '') {
    estimate.get('shortage_weight_amount').setValue((Number(estimate.get('deduction_weight').value) * Number(estimate.get('shortage_per_unit').value)).toFixed(3));
  }
  calExpenseTotal(i,addTripForm)
}


export function   estimateWeightCalc(index: number,addTripForm:UntypedFormGroup) {
  const estimate = (addTripForm.controls['estimates'] as UntypedFormArray).at(index);
  let pickup_weight = Number(estimate.get('pickup_weight').value);
  let dest_weight = Number(estimate.get('destination_weight').value);
  if(pickup_weight >= dest_weight ){
  var shortage_weight = 0;
  if (pickup_weight > dest_weight) {
    shortage_weight = pickup_weight - dest_weight;
  }
  estimate.get('shortage_weight').setValue(shortage_weight.toFixed(3));

  let acceptable_shortage = Number(estimate.get('acceptable_shortage').value)


  if(shortage_weight-acceptable_shortage>0){
    estimate.get('deduction_weight').setValue((shortage_weight - acceptable_shortage).toFixed(3));
    }
    else{
      estimate.get('deduction_weight').setValue((0).toFixed(3));
    }
   calculateExpenseAmounts(index,addTripForm);
  estimate.get('destination_weight').clearValidators();

  }
  else{
    estimate.get('destination_weight').setValidators(Validators.max(pickup_weight));
    estimate.get('destination_weight').updateValueAndValidity();
  }
}


export function setOtherExpenseValidatorUtil(items:Array<any>,addTripForm:UntypedFormGroup){
  const expenses = addTripForm.controls['expenses'].get('other') as UntypedFormArray;
  items.forEach((key, index) => {
    const item = expenses.at(index).get('title');
    const expense_account = expenses.at(index).get('expense_account');
    const amount = expenses.at(index).get('amount');
    const account = expenses.at(index).get('account');
    amount.setValidators(Validators.min(0.01));
    account.setValidators(Validators.required);
    expense_account.setValidators(Validators.required);
    item.setValidators(Validators.required);
    if (items.length == 1) {
      if (!amount.value && !item.value && !account.value && !expense_account.value) {
        amount.clearValidators();
        account.clearValidators();
        expense_account.clearValidators();
        item.clearValidators();

      }
    }
    account.updateValueAndValidity({emitEvent: false});
    amount.updateValueAndValidity({emitEvent: false});
    expense_account.updateValueAndValidity({emitEvent: false});
    item.updateValueAndValidity({emitEvent: false});
  });
}

export function setEstimateValidatorsUtil(items:Array<any>,addTripForm:UntypedFormGroup){
  items.forEach((key, index) => {
    const estimates = addTripForm.controls['estimates'] as UntypedFormArray;
    const material_type = estimates.at(index).get('material_type');
    const net_receiveable_amount = estimates.at(index).get('net_receiveable_amount');
    material_type.setValidators(Validators.required)
    net_receiveable_amount.setValidators(Validators.min(0.01));
    material_type.updateValueAndValidity({emitEvent: false});
    net_receiveable_amount.updateValueAndValidity({emitEvent: false});
  });

}


export function setDriverExpensePaidValidatorsUtil(items:Array<any>,addTripForm:UntypedFormGroup) {
  const driverExpenses = addTripForm.controls['expenses'].get('driver_helper') as UntypedFormArray;
    items.forEach((item, index) => {
      const batta = driverExpenses.at(index).get('batta');
      const account = driverExpenses.at(index).get('account');
      batta.setValidators(Validators.min(0.01));
      account.setValidators(Validators.required);
      if (items.length == 1) {
        if (Number(batta.value) == 0 && account.value == null) {
            batta.clearValidators();
            account.clearValidators();
        }
      }
      batta.updateValueAndValidity({emitEvent: false});
      account.updateValueAndValidity({emitEvent: false});
  });
}

export function  mandatoryCheckbox(addTripForm:UntypedFormGroup){
  const custom_field = addTripForm.get('custom_details') as UntypedFormArray;
  custom_field.controls.forEach((item) => {
    if(item.get('field_type').value=="checkbox"){
      if(item.get('value').value ==""||item.get('value').value =="false"||item.get('value').value ==false){
        item.get('value').setValue('')
      }
    }
  });
}

export function   patchValueUtil(addTripForm:UntypedFormGroup) {
  let form = addTripForm;
  if (typeof (form.controls['vehicle'].value) === 'object') {
    if (Object.keys(form.controls['vehicle'].value).length) {
      form.controls['vehicle'].setValue(form.controls['vehicle'].value.id);
    }
  }
  const expense = addTripForm.controls['expenses'].get('driver_helper') as UntypedFormArray;
  const estimate = addTripForm.controls['estimates'] as UntypedFormArray;
  estimate.controls.forEach((controls, index) => {
    controls.get('pickup_weight').setValue(defaultZero(controls.get('pickup_weight').value, false));
    controls.get('destination_weight').setValue(defaultZero(controls.get('destination_weight').value, false));
    controls.get('shortage_weight').setValue(defaultZero(controls.get('shortage_weight').value, false));
    controls.get('rate_per_unit').setValue(defaultZero(controls.get('rate_per_unit').value));
    controls.get('shortage_per_unit').setValue(defaultZero(controls.get('shortage_per_unit').value));
    controls.get('final_weight_amount').setValue(defaultZero(controls.get('final_weight_amount').value));
    controls.get('shortage_weight_amount').setValue(defaultZero(controls.get('shortage_weight_amount').value));
    controls.get('adjustment_amount').setValue(defaultZero(controls.get('adjustment_amount').value));

    controls.get('party_summary_amount').setValue(defaultZero(controls.get('party_summary_amount').value));
    controls.get('material_type').value ? controls.get('material_type').value : controls.get('material_type').setValue(null);
    controls.get('unit').value ? controls.get('unit').value : controls.get('unit').setValue(null);
    if (typeof controls.get('material_type').value === 'object' && isValidValue(controls.get('material_type').value))
      controls.get('material_type').setValue(controls.get('material_type').value.id);
    if (typeof controls.get('unit').value === 'object' && isValidValue(controls.get('unit').value))
      controls.get('unit').setValue(controls.get('unit').value.id);
  });
  expense.controls.forEach(controls => {
    controls.get('banking_charges').setValue(defaultZero(controls.get('banking_charges').value));
    controls.get('batta').setValue(defaultZero(controls.get('batta').value));
    controls.get('paid').setValue(defaultZero(controls.get('paid').value));
    controls.get('batta').setValue(defaultZero(controls.get('batta').value));
    controls.get('employee_type').value ? controls.get('employee_type').value : controls.get('employee_type').setValue(null);
    controls.get('month').value ? controls.get('month').value : controls.get('month').setValue(0);
    controls.get('name').value ? controls.get('name').value : controls.get('name').setValue(null);
    controls.get('payment_status').value ? controls.get('payment_status').value : controls.get('payment_status').setValue(null);
    controls.get('transaction_date').value ? controls.get('transaction_date').setValue(changeDateToServerFormat(controls.get('transaction_date').value))
      : controls.get('transaction_date').setValue(null);
    controls.get('account').value ? controls.get('account').value : controls.get('account').setValue(null);
  });
  const custom_details = addTripForm.controls['custom_details'] as UntypedFormArray;
  if(custom_details.controls.length>0){
    custom_details.controls.forEach(item=>{
    let value= item.get('value').value
    item.get('value').setValue(value.toString())
    })
  }
 mandatoryCheckbox(addTripForm);
}


export function prepareRequest(form: UntypedFormGroup,tripId:string) {

  form.controls['date'].setValue(changeDateToServerFormat(form.controls['date'].value));
  form.controls['trip_start_date'].setValue(changeDateToServerFormat(form.controls['trip_start_date'].value));
  form.controls['trip_end_date'].setValue(changeDateToServerFormat(form.controls['trip_end_date'].value));
  const estimate = form.controls['estimates'] as UntypedFormArray;
  estimate.controls.forEach((est) => {
    setDefaultZero(est, 'net_receiveable_amount');
  })

  const batta_client = form.controls['batta_client'] as UntypedFormArray;
  batta_client.controls.forEach(element => {
    if (typeof element.value.account != 'string' && isValidValue(element.get('account').value))
    element.get('account').patchValue(element.get('account').value.id);
  });

  const fuel_client = form.controls['fuel_client'] as UntypedFormArray;
  fuel_client.controls.forEach(element => {
    if (typeof element.value.account != 'string' && isValidValue(element.get('account').value))
    element.get('account').patchValue(element.get('account').value.id);
  });


  const advance_client = form.controls['advance_client'] as UntypedFormArray;
  advance_client.controls.forEach(element => {
    if (typeof element.value.account != 'string' && isValidValue(element.get('account').value))
    element.get('account').patchValue(element.get('account').value.id);
  });


  const driver_helper_expense = form.controls['expenses'].get('driver_helper') as UntypedFormArray;
  driver_helper_expense.controls.forEach((expense) => {
    if (typeof expense.value.employee_type != 'string' && isValidValue(expense.get('employee_type').value))
    expense.get('employee_type').patchValue(expense.get('employee_type').value.id);
    if (typeof expense.value.name != 'string' && isValidValue(expense.get('name').value))
    expense.get('name').patchValue(expense.get('name').value.id);
    if (typeof expense.value.account != 'string' && isValidValue(expense.get('account').value))
    expense.get('account').patchValue(expense.get('account').value.id);
    if (typeof expense.value.payment_status != 'string' && isValidValue(expense.get('payment_status').value))
    expense.get('payment_status').patchValue(expense.get('payment_status').value.index);
    setDefaultZero(expense, 'batta');
    const paidValue=expense.get('batta').value;
    expense.get('paid').setValue(paidValue);
    expense.get('payment_status').setValue('111dea48-be94-4ef5-b29b-bc0185f7e1d7');
    // setDefaultZero(expense, 'paid');
    setDefaultZero(expense, 'banking_charges');
    if (typeof expense.value.month != 'string' && isValidValue(expense.get('month').value)){
    expense.get('month').patchValue(expense.get('month').value.id);}
    expense.get('transaction_date').setValue(changeDateToServerFormat(expense.get('transaction_date').value));
    if(expense.get('account').value == 'monthly'){
      expense.get('account').setValue(null);
    }
  });

  const fuel_expense = form.controls['expenses'].get('fuel') as UntypedFormArray;
  fuel_expense.controls.forEach((expense) => {
    if (typeof expense.value.pump_party != 'string' && isValidValue(expense.get('pump_party').value))
    expense.get('pump_party').patchValue(expense.get('pump_party').value.id);
    setDefaultZero(expense, 'amount');
    setDefaultZero(expense, 'fuel_quantity');
    setDefaultZero(expense, 'rate');
  });

  const others_expense = form.controls['expenses'].get('other') as UntypedFormArray;
  others_expense.controls.forEach((expense) => {
    setDefaultZero(expense, 'banking_charges');
    setDefaultZero(expense, 'amount');
    expense.get('transaction_date').setValue(changeDateToServerFormat(expense.get('transaction_date').value));
    if (typeof expense.value.expense_account != 'string' && isValidValue(expense.get('expense_account').value)) {
      expense.get('expense_account').patchValue(expense.get('expense_account').value.id);
    }
    if (typeof expense.value.title != 'string' && isValidValue(expense.get('title').value)) {
      expense.get('title').patchValue(expense.get('title').value.id);
    if (typeof expense.value.account != 'string' && isValidValue(expense.get('account').value)) {
        expense.get('account').patchValue(expense.get('account').value.id);
      }
    }
  });
  form.controls['tp_no'].value ? form.controls['tp_no'].value : form.controls['tp_no'].setValue('');
  form.controls['waybill_no'].value ? form.controls['waybill_no'].value : form.controls['waybill_no'].setValue('');
  form.controls['driver'].value ? form.controls['driver'].value : form.controls['driver'].setValue(null);
  form.controls['party'].value ? form.controls['party'].value : form.controls['party'].setValue(null);
  form.controls['is_mode_edit'].patchValue(true);
  patchValueUtil(form);
  let startPeriod = form.get('trip_start_date_time').get('period').value;
  if(startPeriod != 'PM'){
    form.get('trip_start_date_time').get('period').setValue('AM');
  }

  let endPeriod = form.get('trip_end_date_time').get('period').value;
  if(endPeriod != 'PM'){
    form.get('trip_end_date_time').get('period').setValue('AM');
  }

  if(!tripId){
    if (typeof (form.controls['vehicle'].value) === 'object') {
      if (Object.keys(form.controls['vehicle'].value).length) {
        form.controls['vehicle'].setValue(form.controls['vehicle'].value.id);
      }
    }

    let documentsData = form.controls['documents'].value
    if(!documentsData){
    form.controls['documents'].patchValue([]);
    }

    form.controls['is_mode_edit'].patchValue(false);

  }

  return form.value;
}

export function  setDefaultZero(item, formControlName) {
  if (!item.get(formControlName).value || item.get(formControlName).value == '')
    item.get(formControlName).patchValue(0);
}

export function setAdvancePaidValidatorsUtil(items:Array<any>,addTripForm:UntypedFormGroup) {
  const advances = addTripForm.controls['advance_client'] as UntypedFormArray;
  items.forEach((key, index) => {
    const bankAccount = advances.at(index).get('account');
    const amount = advances.at(index).get('amount');

    amount.setValidators(Validators.min(0.01));
    bankAccount.setValidators(Validators.required);

    if (items.length == 1) {
      if (Number(amount.value) == 0 && bankAccount.value == null) {
        amount.clearValidators();
        bankAccount.clearValidators();
      }
    }
    bankAccount.updateValueAndValidity({emitEvent: false});
    amount.updateValueAndValidity({emitEvent: false});

  });
}

export function setFuelExpensePaidValidatorsUtil(items:Array<any>,addTripForm:UntypedFormGroup) {
  const fuels = addTripForm.controls['expenses'].get('fuel') as UntypedFormArray;
  items.forEach((ket, index) => {
    const amount = fuels.at(index).get('amount');
    amount.setValidators(Validators.min(0.01));
      if (items.length == 1) {
        if (Number(amount.value) == 0) {
          amount.clearValidators();
        }
    }

    amount.updateValueAndValidity({emitEvent: false});
    });
}

export function  setFuelReceivedValidatorsUtil(items:Array<any>,addTripForm:UntypedFormGroup) {
  const fuels = addTripForm.controls['fuel_client'] as UntypedFormArray;
  items.forEach((key, index) => {
    const amount = fuels.at(index).get('amount');

    amount.setValidators(Validators.min(0.01));

    if (items.length == 1) {
      if (Number(amount.value) == 0) {
        amount.clearValidators();

      }
    }
    amount.updateValueAndValidity({emitEvent: false});
  });
}

export function emptyDriverOthersFuelEstimate(addTripForm:UntypedFormGroup) {

  const estimate = addTripForm.controls['estimates'] as UntypedFormArray;
  estimate.patchValue([]);
  estimate.controls = [];
  const driverExpense = addTripForm.controls['expenses'].get('driver_helper') as UntypedFormArray;
  driverExpense.patchValue([]);
  driverExpense.controls = [];
  const otherExpense = addTripForm.controls['expenses'].get('other') as UntypedFormArray;
  otherExpense.patchValue([]);
  otherExpense.controls = [];
  const fuelArray = addTripForm.controls['expenses'].get('fuel') as UntypedFormArray;
  fuelArray.patchValue([]);
  fuelArray.controls = [];

}

export function toggleExpenseEstimateAdvanceFuelBata(form: UntypedFormGroup, enable: Boolean = false) {

  const expenses = form.controls['expenses'] as UntypedFormArray;
  if (enable) {
    expenses.get("driver_helper").enable();
    expenses.get("fuel").enable();
    expenses.get("other").enable();
  } else {
    const dh = expenses.get("driver_helper") as UntypedFormArray;
    const ot = expenses.get("other") as UntypedFormArray;
    dh.controls.forEach(ele => {
      if (!isValidValue(ele.value.account)) {
        ele.disable();
      }
    });
    ot.controls.forEach(ele => {
      if (!isValidValue(ele.value.title)) {
        ele.disable();
      }
    });
  }

  const estimates = form.controls['estimates'] as UntypedFormArray;
  if (enable) {
    estimates.enable();
  } else {
    estimates.controls.forEach(ele => {
      if (!isValidValue(ele.value.material_type)) {
        ele.disable();
      }
    });
  }

  const advance = form.controls['advance_client'] as UntypedFormArray;
  if (enable) {
    advance.enable();
  } else {
    advance.controls.forEach(ele => {
      if (!isValidValue(ele.value.account)) {
        ele.disable();
      }
    });
  }

  const fuel = form.controls['fuel_client'] as UntypedFormArray;
  if (enable) {
    fuel.enable();
  } else {
    fuel.controls.forEach(ele => {
      if (Number(ele.value.amount) == 0) {
        ele.disable();
      }
    });
  }

  const batta = form.controls['batta_client'] as UntypedFormArray;
  if (enable) {
    batta.enable();
  } else {
    batta.controls.forEach(ele => {
      if (Number(ele.value.amount) == 0) {
        ele.disable();
      }
    });
  }
}

export function calcFuelExpenseUtil(index:number,addTripForm:UntypedFormGroup) {

  const fuelArray = addTripForm.controls['expenses'].get('fuel') as UntypedFormArray;
    let fuel_quantity = fuelArray.at(index).get('fuel_quantity');
    let rate = fuelArray.at(index).get('rate');
    let amount = fuelArray.at(index).get('amount').value;

    if (amount == 0) {
      rate.setValue(0.00)
      fuel_quantity.setValue(0.000);
    }

    if (rate.value == 0 && fuel_quantity.value == 0) {
      return;
    }

    if (fuel_quantity.value == 0 && rate.value != 0) {
      const setFuelQuantity = (amount / rate.value).toFixed(3);
      fuel_quantity.setValue(setFuelQuantity);
      return;
    }
    const setRate = (amount / fuel_quantity.value).toFixed(3);
    rate.setValue(setRate);
}

export function calcFuelExpenseTotalAmountUtil(index:number,addTripForm:UntypedFormGroup) {

  const fuelArray = addTripForm.controls['expenses'].get('fuel') as UntypedFormArray;
  let fuel_quantity = fuelArray.at(index).get('fuel_quantity').value;
  let rate = fuelArray.at(index).get('rate').value;
  let setamount = fuelArray.at(index).get('amount');
  const  amount = (fuel_quantity * rate).toFixed(3);
  setamount.setValue(amount);
  }

  export function calcFuelClientUtil(index :number,addTripForm:UntypedFormGroup) {
    const fuelArray = addTripForm.get('fuel_client') as UntypedFormArray;
    let fuel_quantity = fuelArray.at(index).get('quantity');
    let rate = fuelArray.at(index).get('rate');
    let amount = fuelArray.at(index).get('amount').value;

    if (amount == 0) {
      rate.setValue(0.00)
      fuel_quantity.setValue(0.000);
    }

    if (rate.value == 0 && fuel_quantity.value == 0) {
      return;
    }

    if (fuel_quantity.value == 0 && rate.value != 0) {
      const setFuelQuantity = (amount / rate.value).toFixed(3);
      fuel_quantity.setValue(setFuelQuantity);
      return;
    }
    const setRate = (amount / fuel_quantity.value).toFixed(3);
    rate.setValue(setRate);

  }

  export function calcFuelClientTotalAmountUtil(index:number,addTripForm:UntypedFormGroup) {
    const fuelArray = addTripForm.get('fuel_client') as UntypedFormArray;
    let fuel_quantity = fuelArray.at(index).get('quantity').value;
    let rate = fuelArray.at(index).get('rate').value;
    let setamount = fuelArray.at(index).get('amount');
    const  amount = (fuel_quantity * rate).toFixed(3);
    setamount.setValue(amount);
    }

    export function gettotalAdvanceAmountAndtotalEstimateAmount(addTripForm:UntypedFormGroup) {
      let totalData = {
        totalEstimateAmount:0,
        totalAdvanceAmount:0

      }
      const estimates = addTripForm.get('estimates') as UntypedFormArray;
      const battaClient = addTripForm.get('batta_client') as UntypedFormArray;
      const fuelClient = addTripForm.get('fuel_client') as UntypedFormArray;
      const advanceClient = addTripForm.get('advance_client') as UntypedFormArray;
      estimates.controls.forEach((ele) => {
        totalData.totalEstimateAmount += defaultZero(ele.get('net_receiveable_amount').value);
      });

      battaClient.controls.forEach((ele) => {
        totalData.totalAdvanceAmount += defaultZero(ele.get('amount').value);
      });

      fuelClient.controls.forEach((ele) => {
        totalData.totalAdvanceAmount += defaultZero(ele.get('amount').value);
      });

      advanceClient.controls.forEach((ele) => {
        totalData.totalAdvanceAmount += defaultZero(ele.get('amount').value);
      });
      return totalData
    }

  export function fileUploaderUtil(filesUploaded:Array<any>,addTripForm:UntypedFormGroup) {
    let documents = addTripForm.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
    });
  }

  export function fileDeletedUtil(deletedFileIndex:number,addTripForm:UntypedFormGroup) {
    let documents =addTripForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }
  export function monthEnableDisable(enable:boolean=false,addTripForm:UntypedFormGroup,index) {
    if(enable){
      addTripForm.controls.expenses['controls'].driver_helper.at(index).get('month').enable();
      addTripForm.controls.expenses['controls'].driver_helper.at(index).get('month').setValidators(Validators.required);
      addTripForm.controls.expenses['controls'].driver_helper.at(index).get('month').updateValueAndValidity({emitEvent: true});
    }else{
      addTripForm.controls.expenses['controls'].driver_helper.at(index).get('month').setValue(0);
      addTripForm.controls.expenses['controls'].driver_helper.at(index).get('month').disable();
      addTripForm.controls.expenses['controls'].driver_helper.at(index).get('month').clearValidators();
    }

  }

  export function calculateFuelClientUtil(index :number,addTripForm:UntypedFormGroup) {
    const fuelClientArray = addTripForm.controls['fuel_client'] as UntypedFormArray;
    let quantity = fuelClientArray.at(index).get('quantity').value;
    let rate = fuelClientArray.at(index).get('rate').value;
    let amount = (rate * quantity).toFixed(3);
    fuelClientArray.at(index).get('amount').setValue(amount);
  }

  export function setKmsError(form:UntypedFormGroup) {
    let kmsValue=form.get('end_kms').value;
    if(Number(form.get('start_kms').value)>Number(kmsValue)){
      form.get('end_kms').setErrors({ error: { message: 'End KMS cannot be Less than Start KMS)' }});
    }
  }
