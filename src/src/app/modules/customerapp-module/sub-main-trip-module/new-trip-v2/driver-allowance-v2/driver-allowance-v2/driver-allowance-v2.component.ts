import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, AbstractControl, UntypedFormControl, Validators, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-driver-allowance-v2',
  templateUrl: './driver-allowance-v2.component.html',
  styleUrls: ['./driver-allowance-v2.component.scss'],

})
export class DriverAllowanceV2Component implements OnInit, OnDestroy {
  selfDriverForm: UntypedFormGroup;
  initialDetails = {
    driverName: [],
    driverAccount: [],
    paidEmployee : [],
    month: [],
    isMonthlyPaymentModeSelected: [],
    reason: []
  }
  tripEmployeeTypeList: [];
  @Input() driverId = new Subject()
  @Input() isFormValid = new BehaviorSubject(true);
  @Input() parentForm: FormGroup;
  @Input() driverAllowanceEdit?: Observable<any>
  @Input() formType = 'driver_allowances';
  months = new ValidationConstants().month
  monthsDropdownValues: any = [];
  employeeList = [];
  accountList = [];
  @Input() isPaidByDriver: boolean = false;
  accountType = new ValidationConstants().accountType.join(',');
  manufacturerApi = TSAPIRoutes.static_options;
  manufacturerParams: any = {};
  staticOptions: any = {};
  currency_type:any;
  
  constructor(private _fb: UntypedFormBuilder, private _companyTripGetApiService: CompanyTripGetApiService, private _commonService: CommonService,
    private currency: CurrencyService) { }

  ngOnInit() {
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.initialDetail();
    this.addItem([{}]);
    this.driverId.subscribe(driverid => {
      if (driverid) {
        this.isPaidByDriver = true;
        this.prefillDriverName(driverid)
      }
    })
    this.isFormValid.subscribe(valid => {
      if (!valid) {
        this.setAsTouched(this.selfDriverForm);
      }
    })
    this.parentForm.addControl(this.formType, this.selfDriverForm);
    if (this.driverAllowanceEdit) {
      this.driverAllowanceEdit.subscribe(data => {
        this.patchDriverAllowance(data)
      })
    }
    this._commonService.getStaticOptions('reason').subscribe((response) => {
      this.staticOptions.tyreManufacturer = response.result['reason'];
    });

  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.formType);
  }

  buildForm() {
    this.selfDriverForm = this._fb.group({
      self_driver: this._fb.array([])
    })
  }

  addMoreItem() {
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.initialDetails.isMonthlyPaymentModeSelected.push(false);
    this.initialDetails.month.push(getBlankOption());
    this.initialDetails.driverName.push(getBlankOption());
    this.initialDetails.driverAccount.push(getBlankOption())
    this.initialDetails.paidEmployee.push(getBlankOption())
    this.initialDetails.reason.push(getBlankOption())
  }

  removeItem(i) {
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.initialDetails.isMonthlyPaymentModeSelected.splice(i, 1);
    this.initialDetails.month.splice(i, 1);
    this.initialDetails.driverName.splice(i, 1);
    this.initialDetails.driverAccount.splice(i, 1);
    this.initialDetails.paidEmployee.splice(i, 1);
    this.initialDetails.reason.splice(i, 1);
  }


  clearAllClient() {
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    itemarray.controls = [];
    itemarray.reset();
    this.initialDetails.isMonthlyPaymentModeSelected = [];
    this.initialDetails.month = [];
    this.initialDetails.driverName = [];
    this.initialDetails.driverAccount = [];
    this.initialDetails.paidEmployee = [];
    this.initialDetails.reason = [];
    this.addItem([{}]);
  }

  addItem(items: any) {
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    itemarray.controls = []
    this.initialDetails.isMonthlyPaymentModeSelected = [];
    this.initialDetails.month = [];
    this.initialDetails.driverName = [];
    this.initialDetails.driverAccount = [];
    this.initialDetails.paidEmployee = [];
    this.initialDetails.reason = [];
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.initialDetails.isMonthlyPaymentModeSelected.push(false);
      this.initialDetails.month.push(getBlankOption());
      this.initialDetails.driverName.push(getBlankOption());
      this.initialDetails.driverAccount.push(getBlankOption())
      this.initialDetails.paidEmployee.push(getBlankOption())
      this.initialDetails.reason.push(getBlankOption())
    });
  }

  buildItem(item) {    
    return this._fb.group({
      id: [item.id || null],
      employee: [item.employee || null],
      month: [item.month || 0],
      account: [item.account || null],
      designation: [item.designation || ''],
      paid: [item.paid || 0.00],
      paid_employee : [ item.paid_employee || null],
      paid_designation : [item.paid_designation || null],
      transaction_date: [item.transaction_date || null],
      is_driver_paid: [item.is_driver_paid || false],
      reason: [item.reason || null,]
    });
  }

  onDriverHelperPaymentModeSelected(ele: any, index) {
    const formGroup = (this.selfDriverForm.controls['self_driver'] as UntypedFormArray).at(index);
    if (ele == 'monthly') {
      this.populateMonthsDropdown(new Date(dateWithTimeZone()));
      this.initialDetails.isMonthlyPaymentModeSelected[index] = true;
      this.monthEnableDisable(true, formGroup);
      formGroup.get('transaction_date').setValue(null);
    }
    else {
      if(formGroup.get('account').value ==='paid_by_driver'){
        formGroup.get('paid_employee').setValue(formGroup.get('employee').value);
        this.initialDetails.paidEmployee[index] = getBlankOption();
        this.initialDetails.paidEmployee[index].label =  this.employeeList.find(emp=>emp.id == formGroup.get('employee').value)?.first_name 
        formGroup.get('paid_designation').setValue(this.employeeList.find(emp=>emp.id == formGroup.get('paid_employee').value)?.designation)
        setUnsetValidators(formGroup,'paid_employee',[Validators.required])
      }else{
        this.initialDetails.paidEmployee[index] = getBlankOption();
        formGroup.get('paid_employee').setValue(null);
        setUnsetValidators(formGroup,'paid_employee',[Validators.nullValidator])
      }
      this.initialDetails.isMonthlyPaymentModeSelected[index] = false;
      this.initialDetails.month[index] = getBlankOption();
      this.monthEnableDisable(false, formGroup);
    }
    this.onemployeeChange(formGroup,index)
  }

  monthEnableDisable(enable: boolean = false, form: AbstractControl) {
    if (enable) {
      form.get('month').enable();
      setUnsetValidators(form, 'month', [Validators.required, Validators.min(0.01)])
    } else {
      form.get('month').setValue(0);
      form.get('month').disable();
      setUnsetValidators(form, 'month', [Validators.nullValidator])
    }
  }

  populateMonthsDropdown(value) {
    let month = value.getMonth();
    if (month == 11) {
      this.monthsDropdownValues = [{ id: 12, name: 'December' }, { id: 1, name: 'January' }, { id: 2, name: 'Febuary' }]
    }
    else if (month == 10) {
      this.monthsDropdownValues = [{ id: 11, name: 'November' }, { id: 12, name: 'December' }, { id: 1, name: 'January' }]
    }
    else {
      this.monthsDropdownValues = this.months.slice(month, month + 3);
    }
  }

  addRemoveValidatorsFortheForm(form,index){
    const ischanged = Number(form.value['month']) > 0 || form.value['account'] || Number(form.value['paid']) > 0;
    if (ischanged) {
      setUnsetValidators(form, 'employee', [Validators.required]);
      setUnsetValidators(form, 'account', [Validators.required]);
      setUnsetValidators(form, 'paid', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(form, 'month', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(form, 'reason', [Validators.required,]);
    } else {
      setUnsetValidators(form, 'month', [Validators.nullValidator]);
      setUnsetValidators(form, 'account', [Validators.nullValidator]);
      setUnsetValidators(form, 'paid', [Validators.nullValidator]);
      setUnsetValidators(form, 'employee', [Validators.nullValidator]);
      setUnsetValidators(form, 'reason', [Validators.nullValidator,]);
    }
  }

  onemployeeChange(form,index) {
    if (form.value['employee']) {
      let drivername = this.employeeList.filter(driver => driver.id == form.value['employee'])[0];
      form.get('designation').setValue(drivername.designation)
    }
    const formGroup = (this.selfDriverForm.controls['self_driver'] as UntypedFormArray).at(index);
    this.addRemoveValidatorsFortheForm(formGroup,index)
    if(formGroup.get('account').value ==='paid_by_driver'){
      formGroup.get('paid_employee').setValue(formGroup.get('employee').value);
      this.initialDetails.paidEmployee[index] = getBlankOption();
      this.initialDetails.paidEmployee[index].label =  this.employeeList.find(emp=>emp.id == formGroup.get('employee').value)?.first_name 
      formGroup.get('paid_designation').setValue(this.employeeList.find(emp=>emp.id == formGroup.get('paid_employee').value)?.designation)
      setUnsetValidators(formGroup,'paid_employee',[Validators.required])
    }else{
      formGroup.get('paid_employee').setValue(null);
      setUnsetValidators(formGroup,'paid_employee',[Validators.nullValidator])
    }

  }

  getMonth(id) {
    let month = []
    month = this.months.filter(item => item['id'] == id);
    return month[0]
  }

  getPaymentOption(id) {
    let allpayment = []
    if (id == 'monthly') {
      allpayment.push({
        name: 'monthly'
      })
      return allpayment[0]
    } else {
      allpayment = this.accountList.filter(item => item['id'] == id);
      return allpayment[0]
    }


  }


  patchDriverHelperPaymentModeSelected(id, index) {
    const formGroup = (this.selfDriverForm.controls['self_driver'] as UntypedFormArray).at(index);
    if (id == 'monthly') {
      this.initialDetails.isMonthlyPaymentModeSelected[index] = true;
      this.monthEnableDisable(true, formGroup);
    }
    else {
      this.initialDetails.isMonthlyPaymentModeSelected[index] = false;
      this.monthEnableDisable(false, formGroup);
    }
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

  initialDetail() {
    this._companyTripGetApiService.getAll(employeeList => {
      this.employeeList = employeeList;
    });
    this._companyTripGetApiService.getAccountsV2(this.accountType, accountList => { this.accountList = accountList });

  }

  prefillDriverName(driverid) {
    let drivername = this.employeeList.filter(driver => driver.id == driverid)[0];
    const selfDrivers = this.selfDriverForm.get('self_driver') as UntypedFormArray;
    selfDrivers.controls.forEach((item, index) => {
      item.get('employee').setValue(drivername?.id);
      item.get('designation').setValue(drivername?.designation)
      this.initialDetails.driverName[index] = { label: drivername?.first_name, value: '' }
    })
  }

  patchForm(data, form: AbstractControl, index) {
    form.patchValue({
      id: data.id,
      employee: data.employee ? data.employee.id : null,
      paid: data.paid,
      transaction_date: data.transaction_date,
      designation: data.employee ? data.employee.designation : null,
      paid_employee : data.paid_employee ? data.paid_employee.id : null,
      reason: data.reason?.id ? data.reason.id : null,
    })

    if (data.employee) this.initialDetails.driverName[index].label = data.employee.display_name;
    if (data.reason) this.initialDetails.reason[index].label = data.reason.label;
    if (data.account) {
      if (data.account['id']) {
        this.initialDetails.driverAccount[index].label = data.account.name;
        form.get('account').setValue(data.account.id)
      } else {
        if (data.is_driver_paid) {
          this.initialDetails.driverAccount[index].label = "Paid By Employee";
          form.get('account').setValue('paid_by_driver')
        }
      }
    } else {
      form.get('account').setValue('monthly')
      this.initialDetails.driverAccount[index].label = "Monthly";
      form.get('month').setValue(data.month.id);
      this.initialDetails.month[index].label = data.month.name
    }
    if(isValidValue(data.paid_employee)){
      this.initialDetails.paidEmployee[index].label = data.paid_employee.display_name;
    }
    this.changeMonths(form, false, index);
    let drivername = this.employeeList.filter(driver => driver.id == form.value['employee'])[0];
    form.get('designation').setValue(drivername.designation)
    this.paidEmployeeSelected(form)
  }

  changeMonths(form, isSettripStartDate = true, index) {
    let account = form.get('account').value
    if (account == 'monthly') {
      this.populateMonthsDropdown(new Date(dateWithTimeZone()));
      this.initialDetails.isMonthlyPaymentModeSelected[index] = true;
      this.monthEnableDisable(true, form);
      form.get('transaction_date').setValue(null);
    }
    else {
      this.initialDetails.isMonthlyPaymentModeSelected[index] = false;
      this.initialDetails.month[index] = getBlankOption();
      if (isSettripStartDate) {
        form.get('transaction_date').setValue(new Date(dateWithTimeZone()));
      }

      this.monthEnableDisable(false, form);
    }
  }

  patchDriverAllowance(data = []) {
    const itemarray = this.selfDriverForm.controls['self_driver'] as UntypedFormArray;
    if (data.length) {
      this.addItem(data);
      data.forEach((item, index) => {
        let form = itemarray.at(index) as AbstractControl
        this.patchForm(item, form, index)
      })
    }

  }
  addNewManufacturer(event) {
    this.manufacturerParams = {
      key: 'reason',
      label: event,
      value: 0
    };
  }
  getNewManufacturer(event, index) {
		if (event) {
			this._commonService
			.getStaticOptions('reason')
			.subscribe((response) => {
        let form = this.selfDriverForm.get('self_driver') as UntypedFormArray;
        form.at(index).get('reason').setValue(event.id);
        this.initialDetails.reason[index].label = event.label;
        this.initialDetails.reason[index].value = event.id;
				this.staticOptions.tyreManufacturer = response.result['reason'];

			});
		}
	}

  paidEmployeeSelected(form){
    form.get('paid_designation').setValue(this.employeeList.find(emp=>emp.id == form.get('paid_employee').value)?.designation)
  }

}
