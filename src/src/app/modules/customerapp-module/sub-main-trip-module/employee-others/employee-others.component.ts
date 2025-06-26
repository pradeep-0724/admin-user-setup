import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { ErrorList } from 'src/app/core/constants/error-list';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { UntypedFormBuilder, Validators, UntypedFormGroup, AbstractControl, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { OperationsActivityService } from '../../api-services/operation-module-service/operations-activity.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { EmployeeOthersClass } from './employee-others-class/employee-others.class';
import { EmployeeOthersClassService } from './employee-others-class/employee-others.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { RevenueService } from '../../api-services/revenue-module-service/revenue-service/revenue.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { getEmployeeObject } from '../../master-module/employee-module/employee-utils';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-edit-employee-others',
  templateUrl: './employee-others.component.html',
  styleUrls: ['./employee-others.component.scss'],
 
})
export class EmployeeOthersComponent extends EmployeeOthersClass implements OnInit,OnDestroy {
  accountList: any = [];
  selectPaymentMode: any;
  employeeList: any = [];
  employeeOthersForm: UntypedFormGroup;
  initialValues: any = {
    paymentMode: getBlankOption(),
    employee: getBlankOption(),
    employees: [],
    expenseType: [],
    adjustmentAccount: getBlankOption(),
  };
  expenseTypeData: any = [];
  employeeOtherTotals = {
    subtotal: 0.00,
    total: 0.00,
    adjustmentAmount: 0.00
  }
  expenseAccountList: any = [];
  afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;
  employeeValidatorSub: Subscription;
  apiError: string = '';
  addExpenseTypeUrl = TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.expense_type;
  expenseTypeParams = {};
  employeeId = '';
  employeeOthersDetails = [];
  currency_type;
  documentPatchData: any = [];
  patchFileUrls = new BehaviorSubject([]);
  prefixUrl: string;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/2LBh6yAcdJu1HkQhPhIS?embed%22"
  }

  constructor(
    private _fb: UntypedFormBuilder,
    private _operationActivityService: OperationsActivityService,
    private _route: Router,
    private _activateRoute: ActivatedRoute,
    private currency: CurrencyService,
    private _employeeOthersClassService: EmployeeOthersClassService,
    private _prefixUrl: PrefixUrlService,
    private _analytics: AnalyticsService,
    private _scrollToTop: ScrollToTop,
    private _revenueService: RevenueService,
    private commonloadersrive :CommonLoaderService,
    private apiHandler: ApiHandlerService,

  ) { super() }
  ngOnDestroy(): void {
    this.commonloadersrive.getShow()
  }

  ngOnInit() {
    this.commonloadersrive.getHide();
    setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this._activateRoute.params.subscribe((params) => {
      this.employeeId = params.id;
    })
    this.buildForm();
    this.getPaymentModes();
    this.getEmployeeData();
    this.getExpenseTypeData();
    this.addEmployeeRow();
    this.getExpenseAccountsAndSetAccount();
    this.setOtherValidators();
    this.getDefaultBank();
    this.employeeOthersForm.get('transaction_date').setValue(new Date(dateWithTimeZone()));
    this.employeeOthersForm.get('date').setValue(new Date(dateWithTimeZone()));
  }
  handleEmployeeChange(){
    let empId=this.employeeOthersForm.get('employee').value;
    let empObj=getEmployeeObject(this.employeeList,empId);
    this.initialValues.employee={label:empObj?.display_name,value:empId}

  }
  handleEmployeesChange(index){
    const employeesFormArray=this.employeeOthersForm.get('employees') as UntypedFormArray;
    let empId=employeesFormArray.at(index).get('employee').value
    let empObj=getEmployeeObject(this.employeeList,empId);
    this.initialValues.employees[index]={label:empObj?.display_name,value:empId}

  }



  getDefaultBank() {
    this._revenueService.getTenantBank().subscribe((data) => {
      this.initialValues.paymentMode = getBlankOption();
      if(data['result']){
        this.employeeOthersForm.get('payment_mode').setValue(data['result'].id);
        this.initialValues.paymentMode['label'] = data['result'].name
      }
     
    })
  }

  ngAfterViewInit() {
    if (this.employeeId) {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEEOTHERBILL, this.screenType.EDIT, "Navigated");
      setTimeout(() => {
        this.getFormValues();
      }, 1000);
    } else {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEEOTHERBILL, this.screenType.ADD, "Navigated");
    }
  }

  /* To get all the form values */
  getFormValues() {
    this._operationActivityService.getEmployeeOthersDetails(this.employeeId).subscribe((response) => {
      this.employeeOthersDetails = response['result'];
      this.patchFormValues(response['result']);
    })
  }
  openGothrough() {
    this.goThroughDetais.show = true;
  }

  /* To patch the form values */
  patchFormValues(Othersdata) {
    let employee = {
      label: Othersdata.employee ? Othersdata.employee.display_name : '',
      value: Othersdata.employee ? Othersdata.employee.id : null
    }

    let paymentDetails = {
      label: Othersdata.payment_mode ? Othersdata.payment_mode.name : '',
      value: Othersdata.payment_mode ? Othersdata.payment_mode.id : null
    }

    let adjustmentDetails = {
      label: Othersdata.adjustment_account ? Othersdata.adjustment_account.name : '',
      value: Othersdata.adjustment_account ? Othersdata.adjustment_account.id : null
    }

    this.initialValues.employee = employee;
    this.initialValues.paymentMode = paymentDetails;
    this.initialValues.adjustmentAccount = adjustmentDetails;

    Othersdata.employee = Othersdata.employee ? Othersdata.employee.id : null;
    // Othersdata.payment_mode = Othersdata.payment_mode ? Othersdata.payment_mode.id : null;
    Othersdata.adjustment_account = Othersdata.adjustment_account ? Othersdata.adjustment_account.id : null;

    this.employeeOtherTotals.subtotal = Othersdata.subtotal;
    this.employeeOtherTotals.total = Othersdata.total;
    this.employeeOtherTotals.adjustmentAmount = Othersdata.adjustment_amount;
    
    this.employeeOthersForm.patchValue(Othersdata);
    this.patchEmployeeData(Othersdata.employees);
     this.patchDocuments(Othersdata); 
    if (Othersdata.payment_mode.name === 'Paid By Driver') {      
      this.initialValues.paymentMode['label'] = 'Paid By Employee';
      this.employeeOthersForm.get('payment_mode').setValue('paid_By_Driver');
      this.employeeOthersForm.get('payment_mode').updateValueAndValidity()
    }
    else{
      this.employeeOthersForm.get('payment_mode').setValue(Othersdata.payment_mode.id)
    }
  }

  fileUploader(filesUploaded) {
    let documents = this.employeeOthersForm.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
    });
  }
  fileDeleted(deletedFileIndex) {
    let documents = this.employeeOthersForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }

  patchDocuments(data) {
    if (data.documents.length > 0) {
      let documentsArray = this.employeeOthersForm.get('documents') as UntypedFormControl;
      documentsArray.setValue([]);
      const documents = data.documents;
      let pathUrl = [];
      documents.forEach(element => {
        documentsArray.value.push(element.id);
        pathUrl.push(element);
      });
      this.patchFileUrls.next(pathUrl);
    }
  }

  /* To patch the data of employee section */
  patchEmployeeData(items) {
    const item_other = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
    item_other.controls.length = 0;
    items.forEach((item) => {
      item_other.push(this.itemEmployee(item));

      if (isValidValue(item.employee)) {
        this.initialValues.employees.push({ value: item.employee.id, label: item.employee.display_name })
      }
      else {
        this.initialValues.employees.push(getBlankOption());
      }

      if (isValidValue(item.expense_type)) {
        this.initialValues.expenseType.push({ value: item.expense_type.id, label: item.expense_type.name })
      }
      else {
        this.initialValues.expenseType.push(getBlankOption());
      }
    });
  }


  /* For creating the structure of the form */
  buildForm() {
    this.employeeOthersForm = this._fb.group({
      date: ['', Validators.required],
      payment_mode: [null],
      employee: [null],
      transaction_date: [''],
      reference_no: [''],
      adjustment_account: [null],
      adjustment_choice: [0],
      adjustment: [0],
      comments: [''],
      subtotal: [0],
      total: [0],
      adjustment_amount: [0],
      documents: [[]],
      employees: this._fb.array([]),
    });
  }

  /*  To get all the available expense types */
  getExpenseTypeData() {
    this._employeeOthersClassService.getExpenseAccountsList(expenseTypeData => {
      if (expenseTypeData && expenseTypeData.length > 0) {
        this.expenseTypeData = expenseTypeData;
      }
    })
  }

  paymentModeChanged() {
    let payment_mode = this.employeeOthersForm.get('payment_mode').value;
    if (payment_mode === 'paid_By_Driver') {
      this.employeeOthersForm.get('employee').setValidators([Validators.required]);
      this.employeeOthersForm.get('employee').updateValueAndValidity()
    } else {
      this.employeeOthersForm.get('employee').setValidators([Validators.nullValidator]);
      this.employeeOthersForm.get('employee').updateValueAndValidity()
      this.employeeOthersForm.get('employee').setValue(null);
      this.initialValues.employee = getBlankOption();
    }
  }

  /* Checking validations and adding error class */
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  /* To get all the available payment modes */
  getPaymentModes() {
    this._employeeOthersClassService.getPaymentAccountsList(paymentAccountList => {
      if (paymentAccountList && paymentAccountList.length > 0) {
        this.accountList = paymentAccountList;
      }
    })
  }

  /* To get all the employee details  */
  getEmployeeData() {
    this._employeeOthersClassService.getEmployeeList(employeeList => {
      if (employeeList && employeeList.length > 0) {
        this.employeeList = employeeList;
      }
    })
  }

  /* To get the list of all the adjustment accounts */
  getExpenseAccountsAndSetAccount() {

    this._employeeOthersClassService.getExpenseAccountsAndSetAccountList(expenseAccountList => {
      if (expenseAccountList && expenseAccountList.length > 0) {
        this.expenseAccountList = expenseAccountList;
        this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
        this.employeeOthersForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
      }
    })
  }

  addEmployeeRow() {
    const employeeData = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
    employeeData.push(this.itemEmployee({}));
  }


  /* Creating the structure of item expense section */
  itemEmployee(data: any) {
    return this._fb.group({
      employee: [
        data.employee || null
      ],
      expense_type: [
        data.expense_type || null
      ],
      description: [
        data.description || ''
      ],
      amount: [
        data.amount || 0.00
      ]
    })

  }

  /* For resetting an employee row at a given index */
  resetItemEmployee(formGroup, index) {
    const singleUse = this.itemEmployee({});
    formGroup.patchValue(singleUse.value);
    this.initialValues.expenseType[index] = getBlankOption();
    this.initialValues.employees[index] = getBlankOption();
    this.onCalcuationsChanged();
  }

  /* For deleting the employee section at a given index */
  removeItemEmployee(index) {
    const advance = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
    advance.removeAt(index);
    this.onCalcuationsChanged();
  }

  /* For clearing all the cells */
  clearAllCells() {
    const itemEmployees = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
    itemEmployees.reset();
    itemEmployees.controls = [];
    this.initialValues.expenseType = [];
    this.initialValues.employees = [];
    this.initialValues.expenseType.push(getBlankOption());
    this.initialValues.employees.push(getBlankOption());
    this.addEmployeeRow();
    this.onCalcuationsChanged();
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

  /* To display all the errors globally */
  setFormGlobalErrors() {
    this.globalFormErrorList = [];
    let errorIds = Object.keys(this.possibleErrors);
    for (let prop of errorIds) {
      const error = this.possibleErrors[prop];
      if (error.status == true) {
        this.globalFormErrorList.push(error.message);
      }
    }
  }

  /* Setting the validations for item expense */
  setOtherValidators() {
    const item_other = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
    this.employeeValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
      items.forEach((key, index) => {
        const employee = item_other.at(index).get('employee');
        const expense_type = item_other.at(index).get('expense_type');
        const amount = item_other.at(index).get('amount');

        employee.setValidators(Validators.required);
        expense_type.setValidators(Validators.required);
        amount.setValidators(Validators.min(0.01));
        if (items.length == 1) {
          if (!employee.value && !Number(amount.value)) {
            employee.clearValidators();
            expense_type.clearValidators();
            amount.clearValidators();
          }
        }
        employee.updateValueAndValidity({ emitEvent: true });
        expense_type.updateValueAndValidity({ emitEvent: true });
        amount.updateValueAndValidity({ emitEvent: true });
      });
    });
  }

  toggleItemOtherFilled(enable: Boolean = false) {
    const otherItems = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
    otherItems.controls.forEach(ele => {
      if (enable) {
        ele.enable();
      } else {
        if (ele.value.employee == null && ele.value.amount == 0) {
          ele.disable();
        }
      }
    });
  }

  addExpenseType(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.expenseTypeParams = {
        expensetype: word_joined
      };
    }
  }

  getExpenseType(event, index) {
    if (event) {
      this.getExpenseTypeData();
      const item_other = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
      item_other.at(index).get('expense_type').setValue(event.id);
    }
  }

  updateExpense() {
    this.toggleItemOtherFilled();
    this.patchEmployeeDetails();
    let form = this.employeeOthersForm;
    this.apiError = '';
    if (this.employeeOtherTotals.total <= 0) {
      this.apiError = 'Please check detail, Total amount should be greater than zero'
      form.setErrors({ 'invalid': true });
      this._scrollToTop.scrollToTop();
      window.scrollTo(0, 0);
    }
    if (form.valid) {
      let payment_mode = this.employeeOthersForm.get('payment_mode').value;
      if (payment_mode === 'paid_By_Driver') {
        this.employeeOthersForm.get('payment_mode').setValue(null);
        this.employeeOthersForm.get('payment_mode').updateValueAndValidity();
      }
      else {
        this.employeeOthersForm.get('employee').setValue(null);
        this.employeeOthersForm.get('employee').updateValueAndValidity();
      }
      this.apiHandler.handleRequest(this._operationActivityService.postEmployeeOthersDetails(this.employeeId, this.prepareRequestForSubmit(form)),'Employee Expense updated successfully!').subscribe((response) => {
        this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.EMPLOYEEOTHERBILL)
        this._route.navigate([this.prefixUrl + '/trip/employee-others/list'],  { queryParams: { pdfViewId:this.employeeId } });
      })
    }
    else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
      this.setFormGlobalErrors();
    }
    this.toggleItemOtherFilled(true);
  }


  patchEmployeeDetails() {
    const item_other = this.employeeOthersForm.controls['employees'] as UntypedFormArray;
    item_other.controls.forEach((controls, index) => {

      const amount = Number(controls.get('amount').value)
      const expense_type = controls.get('expense_type')
      const employee = controls.get('employee')

      if (typeof expense_type.value === 'object' && isValidValue(expense_type.value)) expense_type.setValue(expense_type.value.id);
      if (typeof employee.value === 'object' && isValidValue(employee.value)) employee.setValue(employee.value.id);

      if (!amount && !expense_type.value && !employee.value) {
        controls.disable()
      }
    });
  }

  /* Mutating the format of form values */
  prepareRequestForSubmit(form) {
    form.patchValue({
      date: changeDateToServerFormat(form.controls.date.value),
      transaction_date: changeDateToServerFormat(form.controls.transaction_date.value),
      adjustment_amount: this.employeeOtherTotals.adjustmentAmount,
      subtotal: this.employeeOtherTotals.subtotal,
      total: this.employeeOtherTotals.total
    })
    return form.value;
  }

  /* For submitting the form */
  saveExpense() {
    this.toggleItemOtherFilled();
    let form = this.employeeOthersForm;
    this.apiError = '';
    if (this.employeeOtherTotals.total <= 0) {
      this.apiError = 'Please check detail, Total amount should be greater than zero'
      form.setErrors({ 'invalid': true });
      this._scrollToTop.scrollToTop();
      window.scrollTo(0, 0);
    }
    if (form.valid) {

      let payment_mode = this.employeeOthersForm.get('payment_mode').value;
      if (payment_mode === 'paid_By_Driver') {
        this.employeeOthersForm.get('payment_mode').setValue(null)
      }
      this.apiHandler.handleRequest(this._operationActivityService.postEmployeeOthers(this.prepareRequestForSubmit(form)),'Employee Expense added successfully!').subscribe((response) => {
        this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.EMPLOYEEOTHERBILL)
        this._route.navigate([this.prefixUrl + '/trip/employee-others/list']);
      })
    }
    else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
      this.setFormGlobalErrors();
    }
    this.toggleItemOtherFilled(true);
  }

}
