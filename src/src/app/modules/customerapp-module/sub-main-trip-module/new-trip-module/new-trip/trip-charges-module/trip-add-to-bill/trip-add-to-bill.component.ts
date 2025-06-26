import { ValidationConstants } from 'src/app/core/constants/constant';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { NewTripDataService } from '../../new-trip-data.service';
import { CommonService } from '../../../../../../../core/services/common.service';
import { getBlankOption, getNonTaxableOption, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, UntypedFormControl, AbstractControl, FormGroup, FormControl } from '@angular/forms';

import { BehaviorSubject, forkJoin } from 'rxjs';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { CompanyTripGetApiService } from '../../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { debounceTime } from 'rxjs/operators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { EmployeeService } from 'src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { TripService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/trip-services/trip.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';

@Component({
  selector: 'app-trip-add-to-bill',
  templateUrl: './trip-add-to-bill.component.html',
  styleUrls: ['./trip-add-to-bill.component.scss'],
})
export class TripAddToBillComponent implements OnInit {
  addChargeForm: UntypedFormGroup;
  defaultTax = new ValidationConstants().defaultTax;
  taxOption = getNonTaxableOption();
  chargeData = [];
  initialDetails = {
    chargeType: [],
    expenseAccount: [],
    vendor: [],
    paymentStatus: [],
    expenseType: [],
    advanceClientAccount: [],
    employee: [],
    tax: [],
    expenseTax: [],
    units: []
  }
  coaDropdownIndex: number = -1;
  showAddCoaPopup: any = { name: '', status: false };
  coaParams: any = {
    name: '',
  };
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  isPaymentStatusTrue = [];
  vendorList = [];
  unpaidStatus = { label: 'Unpaid', Value: '' };
  vendorIndex = -1;
  @Input() isAddExpense = false;
  paymentStatusList = [{
    label: 'Unpaid',
    id: '1'
  }, {
    label: 'Paid',
    id: '3'
  }]
  pattern = new ValidationConstants().VALIDATION_PATTERN
  expenseTypeList: [] = [];
  @Input() typeOfScreen: any
  @Input() singleEntry: boolean = false;
  @Input() isTripCode = false;
  @Input() isFormValid = new BehaviorSubject(true);
  @Input() customerId = '';
  expenseAccountList = [];
  advanceClientAccountList = [];
  @Input() editTripData: any
  @Input() isZeroAmountAccepted: boolean = true;
  isDisableExpenses = false;
  driverList = [];
  monthsDropdownValues: any = [];
  policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
  isTax = true;
  taxOptions = [];
  staticOptions: any = {};
  isVendorAddTobill = false;
  @Output() dataFromAddToBill = new EventEmitter<any>();
  constructor(private _fb: UntypedFormBuilder, private _newTripFuelService: NewTripDataService, private _partyService: PartyService, private _employeeService: EmployeeService, private _tripService: TripService,
    private _commonService: CommonService, private _companyTripGetApiService: CompanyTripGetApiService, private commonloaderservice: CommonLoaderService, private _taxModuleService: TaxModuleServiceService, private _taxService: TaxService,
    private _rateCardService: RateCardService, private dialog: Dialog, private _revenueService: RevenueService,) { }
  ngOnInit() {
    this.commonloaderservice.getShow()
    this.buildForm();
    this.prepareRequest();
    this.isTax = this._taxService.getTax();
    let params = {
      vehicle_category: 0
    }
    const obs1 = this._tripService.getAccounts(new ValidationConstants().expense)
    const obs2 = this._rateCardService.getCustomerAdditionalCharge(this.customerId, params);
    const obs3 = this._partyService.getPartyList('0', '1')
    const obs4 = this._employeeService.getEmployeesListV2()
    const obs5 = this._taxModuleService.getTaxDetails()
    const obs6 = this._tripService.getClientExpenseAccounts()
    const obs7 = this._commonService.getStaticOptions('gst-treatment,tax,item-unit,payment-term')
    const obs8 = this._revenueService.getExpense()
    if (this.typeOfScreen == "partyBill") {
      this.chargeData = this._newTripFuelService.partychargeData;
    } else {
      this.chargeData = this._newTripFuelService.chargeData;
      this.isVendorAddTobill = true;
    }

    const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
    forkJoin([obs1, obs2, obs3, obs4, obs5, obs6, obs7, obs8]).subscribe(
      ([expenseAccountList, response, res, driver, taxOptions, expenseType, units, vendorEspenseList]: any) => {
        this.expenseAccountList = expenseAccountList.result;
        if (this.isVendorAddTobill) {
          this.expenseTypeList = vendorEspenseList.result;
        } else {
          this.expenseTypeList = response.result;
        }
        this.vendorList = res.result;
        this.driverList = driver['result']
        this.taxOptions = taxOptions.result['tax'];
        this.staticOptions.itemUnits = units.result['item-unit'];
        this.advanceClientAccountList = expenseType['result'].bank_accounts
        if (this.chargeData.length > 0) {
          if (this.editTripData.data.hasOwnProperty('party_add_bill_charges')) {
            this.initialDetails.chargeType[0] = { label: this.editTripData.data?.party_add_bill_charges[this.editTripData.index]?.type['label'] };
          }
          if (this.editTripData.data.hasOwnProperty('vp_add_bill_charges')) {
            this.initialDetails.chargeType[0] = { label: this.editTripData.data?.vp_add_bill_charges[this.editTripData.index]?.type['label'] }
          }
          this.addItem(this.chargeData);
          setTimeout(() => {
            itemarray.controls.forEach((item: FormControl, index) => {
              this.patchFormData(item, index);
            });
          }, 100);

          this.enableDisableChargesAndExpenses();
        } else {
          this.addItem([{}]);
        }

        this.commonloaderservice.getHide()

      },
      (error) => {
        console.error('Error:', error);
      }
    );




    this.addChargeForm.valueChanges.subscribe(data => {
      if (this.typeOfScreen == "partyBill") {
        this._newTripFuelService.partychargeData = data['charge_array'];
      } else {
        this._newTripFuelService.chargeData = data['charge_array'];
      }
    });
    this.isFormValid.subscribe(valid => { if (!valid) { this.setAsTouched(this.addChargeForm) } });
  }

  buildForm() {
    this.addChargeForm = this._fb.group({
      charge_array: this._fb.array([])
    })
  }

  enableDisableChargesAndExpenses() {
    this.isDisableExpenses = false;
    if (this.isAddExpense) {
      const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
      this.isDisableExpenses = itemarray.controls[0].get('bill_created').value;
    }

  }

  onCalculationChange() {
    const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
    this.taxOptions.forEach(tax => {
      itemarray.controls.forEach(form => {
        if (form.get('tax').value == tax.id) {
          let quantity = Number(form.get('quantity').value);
          let unitCost = Number(form.get('unit_cost').value);
          form.get('amount_before_tax').setValue(quantity * unitCost);
          let amountWithoutTax = form.get('amount_before_tax').value
          let amountWithTax = (Number(tax.value / 100 * amountWithoutTax) + Number(amountWithoutTax)).toFixed(3);
          form.get('amount').setValue(amountWithTax)
        }
      });

    })
  }


  addMoreItem() {
    const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.initialDetails.chargeType.push(getBlankOption());
    this.initialDetails.expenseAccount.push(getBlankOption());
    this.initialDetails.vendor.push(getBlankOption());
    this.initialDetails.expenseType.push(getBlankOption());
    this.initialDetails.advanceClientAccount.push(getBlankOption());
    this.initialDetails.employee.push(getBlankOption());
    this.initialDetails.tax.push(this.taxOption)
    this.initialDetails.paymentStatus.push(this.unpaidStatus);
    this.initialDetails.expenseTax.push(this.taxOption);
    this.initialDetails.units.push({ label: 'Units (UNT)' });


  }

  removeItem(i) {
    const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.initialDetails.chargeType.splice(i, 1);
    this.initialDetails.expenseAccount.splice(i, 1);
    this.initialDetails.vendor.splice(i, 1);
    this.initialDetails.expenseType.splice(i, 1);
    this.initialDetails.paymentStatus.splice(i, 1);
    this.initialDetails.advanceClientAccount.splice(i, 1);
    this.initialDetails.employee.splice(i, 1);
    this.initialDetails.tax.splice(i, 1);
    this.initialDetails.expenseTax.splice(i, 1);
    this.initialDetails.units.splice(i, 1);


  }


  clearAllClient() {
    const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
    itemarray.controls = [];
    itemarray.reset();
    this.initialDetails.chargeType = [];
    this.initialDetails.expenseAccount = [];
    this.initialDetails.vendor = [];
    this.initialDetails.expenseType = [];
    this.initialDetails.paymentStatus = [];
    this.initialDetails.advanceClientAccount = [];
    this.initialDetails.tax = [];
    this.initialDetails.expenseTax = [];
    this.initialDetails.units = [];
    this.addItem([{}]);
  }

  addItem(items: any) {
    const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.initialDetails.chargeType.push(getBlankOption());
      this.initialDetails.expenseAccount.push(getBlankOption());
      this.initialDetails.vendor.push(getBlankOption());
      this.initialDetails.expenseType.push(getBlankOption());
      this.initialDetails.advanceClientAccount.push(getBlankOption());
      this.initialDetails.employee.push(getBlankOption());
      this.initialDetails.tax.push(this.taxOption)
      this.initialDetails.paymentStatus.push(this.unpaidStatus);
      this.initialDetails.expenseTax.push(this.taxOption);
      this.initialDetails.units.push({ label: 'Units (UNT)' });
    });
  }

  buildItem(item) {
    return this._fb.group({
      type: [item.type || null, [Validators.required]],
      amount: [item.amount || 0.00, [Validators.required, Validators.min(0.01)]],
      amount_before_tax: [item.amount_before_tax, [Validators.required, Validators.min(0.01)]],
      tax: [item.tax || this.defaultTax],
      date: [item.date || new Date(dateWithTimeZone())],
      id: [item.id || null],
      unit_of_measurement: [item.unit_of_measurement || '1218e7ed-e703-4e2d-bdd6-768eb4223e10'],
      quantity: [item.quantity || 1],
      unit_cost: [item.unit_cost || 0],
      expense_type: [item.expense_type || 1],
      expense_account: [item.expense_account || null],
      expense_amount_before_tax: [item.expense_amount_before_tax || 0.000],
      expense_amount: [item.expense_amount || 0.000],
      expense_tax: [item.expense_tax || this.defaultTax],
      expense_payment_amount: [item.expense_payment_amount || 0.00],
      expense_payment_mode: [item.expense_payment_mode || null],
      expense_bill_no: [item.expense_bill_no || '', [Validators.pattern(this.policyNumber)]],
      expense_bill_date: [item.expense_bill_date || null],
      expense_party: [item.expense_party || null],
      expense_status: [item.expense_status || '1'],
      is_expense: [item.is_expense || false],
      employee: [item.employee || null],
      is_driver_paid: [item.is_driver_paid || false],
      bill_created: [item.bill_created != undefined ? item.bill_created : false]
    });
  }

  setValidatorsUnset(form, controlName, validators) {
    form.get(controlName).setValidators(validators);
    form.get(controlName).updateValueAndValidity()
  }

  onMaterialSelected(form: FormGroup, event, index) {
    let itemSelected
    if(this.isVendorAddTobill){
       itemSelected = this.expenseTypeList.filter((item) => item['id'] === event.target.value)[0];
      form.get('unit_cost').setValue(itemSelected.rate_per_unit);
    }else{
       itemSelected= this.expenseTypeList.filter((item) => item['name']['id'] === event.target.value)[0];
      form.get('unit_cost').setValue(itemSelected.rate);
    }
   
    if (itemSelected['unit_of_measurement']) {
      form.get('unit_of_measurement').setValue(itemSelected.unit_of_measurement?.id);
      form.get('tax').setValue(itemSelected.tax?.id);
      this.initialDetails.tax[index] = { label: itemSelected.tax?.label, value: itemSelected.tax?.id }
      this.initialDetails.units[index] = { label: itemSelected.unit_of_measurement.label, value: itemSelected.unit_of_measurement.id }
    }
  }


  addNewAdditionalCharge(event, i) {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data: {
        data: '0',
        charge_name: event,
        isEdit: false,
        sales: this.isVendorAddTobill?false:true,
        purchase: this.isVendorAddTobill,
        vehicleCategory: this.isVendorAddTobill?false:true,
        isDisableSeletAll: this.isVendorAddTobill?false:true,
      },
      width: '1000px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if (item) {
        const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
        this.getAdditionalCharges();
        itemarray.controls[i].get('type').setValue(item?.name?.id);
        itemarray.controls[i].get('unit_of_measurement').setValue(item?.unit_of_measurement?.id);
        itemarray.controls[i].get('tax').setValue(item?.tax?.id);
        if(this.isVendorAddTobill){
          itemarray.controls[i].get('unit_cost').setValue(item?.purchase_unit_cost);
        }else{
          itemarray.controls[i].get('unit_cost').setValue(item?.rate);
        }
        this.initialDetails.chargeType[i] = { label: item?.name?.name };
        this.initialDetails.units[i] = { label: item?.unit_of_measurement?.label };
        this.initialDetails.tax[i] = { label: item?.tax?.label };
        this.onCalculationChange();
      }

      dialogRefSub.unsubscribe();
    })
  }

  getAdditionalCharges() {
    if(this.isVendorAddTobill){
      this._revenueService.getExpense().subscribe((response) => {
        this.expenseTypeList=response['result']
      })
    }else{
      let params = {
        vehicle_category: 0
      }
      this._rateCardService.getCustomerAdditionalCharge(this.customerId, params).subscribe((response: any) => {
        this.staticOptions.itemUnits = response.result;
      });
    }
  }

  getExpenseAccountList() {
    this._companyTripGetApiService.getexpenseAccountList(expenseAccountList => { this.expenseAccountList = expenseAccountList });
  }

  patchFormData(form: FormControl, index) {
    if (form.value['type']) {
      if (this.isVendorAddTobill) {
        const expenseLabel = this.expenseTypeList.filter(item => item['id'] == form.value['type']);
        this.initialDetails.chargeType[index] = { label: expenseLabel[0]['name'] }
      } else {
        const expenseLabel = this.expenseTypeList.filter(item => item['name']['id'] == form.value['type']);
        this.initialDetails.chargeType[index] = { label: expenseLabel[0]['name']['name'] }
      }
    }
    if (form.value['unit_of_measurement']) {
      const expenseLabel = this.staticOptions.itemUnits.filter(item => item['id'] == form.value['unit_of_measurement']);
      this.initialDetails.units[index] = { label: expenseLabel[0]['label'] }
    }

    if (form.value['expense_account']) {
      const expenseLabel = this.expenseAccountList.filter(item => item['id'] == form.value['expense_account']);
      this.initialDetails.expenseAccount[index] = { label: expenseLabel[0]['name'] }
    }

    if (form.value['expense_status']) {
      const expenseLabel = this.paymentStatusList.filter(item => item['id'] == form.value['expense_status']);
      this.initialDetails.paymentStatus[index] = expenseLabel[0];
    } else {
      this.initialDetails.paymentStatus[index] = this.unpaidStatus;
    }

    if (form.value['expense_payment_mode']) {
      const expenseLabel = this.advanceClientAccountList.filter(item => item['id'] == form.value['expense_payment_mode']);
      this.initialDetails.advanceClientAccount[index] = { label: expenseLabel[0]['name'] }
    }
    if (!form.value['expense_payment_mode']) {
      if (form.value['is_driver_paid']) {
        form.get('expense_payment_mode').setValue('paid_By_Driver')
        this.initialDetails.advanceClientAccount[index] = { label: 'Paid By Employee' }
      }
    }
    if (form.value['expense_party']) {
      const expenseLabel = this.vendorList.filter(item => item['id'] == form.value['expense_party']);
      this.initialDetails.vendor[index] = { label: expenseLabel[0]['party_display_name'] }
    }

    if (form.value['tax']) {
      const taxLabel = this.taxOptions.find(item => item['id'] == form.value['tax']);
      this.initialDetails.tax[index] = { label: taxLabel['label'] }
    }

    if (form.value['expense_tax']) {
      const taxLabel = this.taxOptions.find(item => item['id'] == form.value['expense_tax']);
      this.initialDetails.expenseTax[index] = { label: taxLabel['label'] }
    }

    if (form.value['employee']) {
      const employee = this.driverList.find(item => item['id'] == form.value['employee']);
      this.initialDetails.employee[index] = { label: employee['first_name'] }
    }
  }

  prepareRequest() {
    this.addChargeForm.valueChanges.pipe(
      debounceTime(100),
    ).subscribe(data => {
      let outPutData = {
        isFormValid: this.addChargeForm.valid,
        allData: []
      }
      if (this.addChargeForm.valid) {
        outPutData = {
          isFormValid: this.addChargeForm.valid,
          allData: this.getAllValues(data['charge_array'])
        }
      } else {
        outPutData = {
          isFormValid: this.addChargeForm.valid,
          allData: []
        }
      }
      this.dataFromAddToBill.emit(outPutData)
    });
    this.addChargeForm.updateValueAndValidity();
  }

  getAllValues(data) {
    let dataWithValid = [];
    data.forEach(element => {
      element['date'] = changeDateToServerFormat(element['date']);
      if (element['expense_bill_date']) {
        element['expense_bill_date'] = changeDateToServerFormat(element['expense_bill_date'])
      }
      dataWithValid.push(element)
    });
    return dataWithValid
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

  addParamsCoaItem($event) {
    this.coaParams = {
      name: $event
    };
  }

  openAddCoaModal($event, index) {
    if ($event)
      this.coaDropdownIndex = index;
    this.showAddCoaPopup = { name: this.coaParams.name, status: true };
  }

  closeCoaPopup() {
    this.showAddCoaPopup = { name: '', status: false };
  }

  addExpenseToOption($event) {
    if ($event) {
      this.getExpenseAccountList();
      if (this.coaDropdownIndex != -1) {
        this.initialDetails.expenseAccount[this.coaDropdownIndex] = { value: $event.id, label: $event.label };
        let form = (this.addChargeForm.controls.charge_array as UntypedFormArray).at(this.coaDropdownIndex)
        form.get('expense_account').setValue($event.id);
        this.coaDropdownIndex = -1;
      }
    }
  }

  openAddPartyModal($event, index) {
    if ($event)
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    this.vendorIndex = index
  }

  addValueToPartyPopup(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.partyNamePopup = word_joined;
    }
  }

  addPartyToOption($event) {
    if ($event.status) {
      this.getVendorDetails();
      if (this.vendorIndex != -1) {
        this.initialDetails.vendor[this.vendorIndex] = { value: $event.id, label: $event.label };
        let form = (this.addChargeForm.controls.charge_array as UntypedFormArray).at(this.vendorIndex)
        form.get('expense_party').setValue($event.id);
        this.vendorIndex = -1;
      }
    }
  }

  getVendorDetails() {
    this._partyService.getPartyList('0', '1').subscribe((response) => {
      this.vendorList = response.result;
    });

  }



  changePaymentAmount(item, i) {
    const paymentType = item.get('expense_status').value;
    if (paymentType == '3') {
      setUnsetValidators(item, 'expense_payment_mode', [Validators.required]);
      setUnsetValidators(item, 'expense_bill_no', [Validators.required, Validators.pattern(this.policyNumber)]);
      item.get('expense_bill_date').setValue(item.get('date').value);
    }
    if (paymentType == '1') {
      setUnsetValidators(item, 'expense_payment_mode', [Validators.nullValidator]);
      setUnsetValidators(item, 'expense_bill_no', [Validators.nullValidator]);
      item.get('expense_payment_mode').setValue(null);
      item.get('expense_bill_no').setValue('');
      item.get('expense_bill_date').setValue(null);
      this.initialDetails.advanceClientAccount[i] = getBlankOption();
    }
    this.paymentmodeChanged(item)
  }

  addExpense(form: UntypedFormGroup, i: number) {
    this.initialDetails.employee[i] = getBlankOption();
    const expenseType = form.get('expense_type').value;
    this.initialDetails.paymentStatus[i] = this.unpaidStatus;
    this.initialDetails.vendor[i] = getBlankOption();
    this.initialDetails.expenseTax[i] = this.taxOption;
    form.get('expense_status').setValue('1');
    if (expenseType == 2 && this.isAddExpense) {
      form.get('expense_payment_mode').setValue(null);
      form.get('expense_amount_before_tax').setValue(0.000);
      form.get('expense_amount').setValue(0.000);
      form.get('expense_tax').setValue(this.defaultTax);
      setUnsetValidators(form, 'type', [Validators.required]);
      setUnsetValidators(form, 'expense_party', [Validators.required]);
      setUnsetValidators(form, 'expense_amount_before_tax', [Validators.required, Validators.min(0.01)]);
    } else if (expenseType == 3 && this.isAddExpense) {
      form.get('expense_payment_mode').setValue(null);
      form.get('expense_bill_no').setValue('');
      form.get('expense_party').setValue(null);
      form.get('expense_amount_before_tax').setValue(0.000);
      form.get('expense_amount').setValue(0.000);
      form.get('expense_tax').setValue(this.defaultTax);
      setUnsetValidators(form, 'expense_party', [Validators.nullValidator]);
      setUnsetValidators(form, 'expense_payment_mode', [Validators.required]);
      setUnsetValidators(form, 'expense_amount_before_tax', [Validators.required, Validators.min(0.01)]);
      form.get('expense_bill_date').setValue(form.get('date').value);
    } else {
      form.get('expense_amount_before_tax').setValue(0.000);
      this.initialDetails.expenseType[i] = getBlankOption();
      this.initialDetails.expenseAccount[i] = getBlankOption();
      this.initialDetails.advanceClientAccount[i] = getBlankOption();
      this.initialDetails.expenseTax[i] = this.taxOption;
      form.get('expense_amount').setValue(0.000);
      form.get('expense_tax').setValue(this.defaultTax);
      form.get('expense_payment_mode').setValue(null);
      form.get('expense_party').setValue(null);
      form.get('expense_bill_no').setValue('');
      form.get('expense_bill_date').setValue(null);
      setUnsetValidators(form, 'expense_payment_mode', [Validators.nullValidator]);
      setUnsetValidators(form, 'expense_party', [Validators.nullValidator]);
      setUnsetValidators(form, 'expense_account', [Validators.nullValidator]);
      setUnsetValidators(form, 'expense_amount_before_tax', [Validators.nullValidator]);
      setUnsetValidators(form, 'expense_bill_no', [Validators.nullValidator]);
    }
    this.paymentmodeChanged(form)
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  paymentmodeChanged(form: FormGroup) {
    let value = form.get('expense_payment_mode').value;
    if (value === 'paid_By_Driver') {
      form.get('employee').setValidators(Validators.required)
      form.get('is_driver_paid').setValue(true)
    } else {
      form.get('employee').setValue('')
      form.get('employee').setValidators(Validators.nullValidator)
      form.get('is_driver_paid').setValue(false)
    }
    form.get('employee').updateValueAndValidity()
  }

  onExpenseCalculationChange() {
    const itemarray = this.addChargeForm.controls['charge_array'] as UntypedFormArray;
    this.taxOptions.forEach(tax => {
      itemarray.controls.forEach(form => {
        if (form.get('expense_tax').value == tax.id) {
          let amountWithoutTax = Number(form.get('expense_amount_before_tax').value);
          let amountWithTax = (Number(tax.value / 100 * amountWithoutTax) + Number(amountWithoutTax)).toFixed(3);
          form.get('expense_amount').setValue(amountWithTax)
        }
      });

    })
  }
}
