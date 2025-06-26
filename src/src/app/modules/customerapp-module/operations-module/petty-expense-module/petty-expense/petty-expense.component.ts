import { Component, OnInit } from '@angular/core';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { AbstractControl, UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl } from '@angular/forms';
import { RevenueService } from '../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { getBlankOption, getObjectFromList, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { PettyExpenseService } from '../petty-expense.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { ErrorList } from 'src/app/core/constants/error-list';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { PettyExpenseClass } from './petty-expense-class/petty-expense.class';
import { PettyClassService } from './petty-expense-class/petty-expense.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { Dialog } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupComponent } from '../../../master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-edit-petty-expense',
  templateUrl: './petty-expense.component.html',
  styleUrls: ['./petty-expense.component.scss'],

})
export class PettyExpenseComponent extends PettyExpenseClass implements OnInit {
  employeeDetails = []
  editPettyExpense: UntypedFormGroup;
  materialList: any;
  staticOptions: any = {};
  accountList: any;
  paymentAccountList: any;
  bankingChargeRequired: Boolean = false;
  itemExpenseTotals = {
    subtotal: 0.00,
    total: 0.00,
    discountTotal: 0.00,
    adjustmentAmount: 0.00
  }
  expenseAccountList: any;
  afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption;
  alphaNumericPattern = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  initialValues: any = {
    paymentMode: getBlankOption(),
    units: [],
    serviceType: getBlankOption(),
    expenseAccount: [],
    item: [],
    adjustmentAccount: getBlankOption(),
    employee: getBlankOption(),
    paid_employee: getBlankOption()
  };
  expenseItemDropdownIndex: number = -1;
  expenseID: any;
  pettyExpensesDetails: any;
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;
  otherExpenseValidatorSub: Subscription;
  apiError: string;
  currency_type;
  documentPatchData: any = [];
  patchFileUrls = new BehaviorSubject([]);

  showAddCoaPopup: any = { name: '', status: false };
  coaParams: any = {
    name: '',
  };
  coaDropdownIndex: number = -1;
  prefixUrl: string;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/FSMV1KXZFcXw4uHxjgI3?embed%22"
  };
  activeEmpList = [];



  constructor(
    private fb: UntypedFormBuilder,
    private _revenueService: RevenueService,
    private _pettyExpenseService: PettyExpenseService,
    private _route: Router,
    private _activatedroute: ActivatedRoute,
    private currency: CurrencyService,
    private _commonService: CommonService,
    private _prefixUrl: PrefixUrlService,
    private _analytics: AnalyticsService,
    private dialog: Dialog,
    private _pettyClassService: PettyClassService,
    private _scrollToTop: ScrollToTop,
    private apiHandler:ApiHandlerService
  ) { super() }

  /*    ngOnDestroy() {
          this.otherExpenseValidatorSub.unsubscribe();
        } */

  ngOnInit() {
    setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this._activatedroute.params.subscribe((params) => {
      this.expenseID = params.expense_id;
    })

    this.buildform();
    this.getEmployeeDetails();
    this.editPettyExpense.get('bill_date').setValue(new Date(dateWithTimeZone()));
    this.editPettyExpense.get('transaction_date').setValue(new Date(dateWithTimeZone()));
    if (!this.expenseID) {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PETTYEXPENSE, this.screenType.ADD, "Navigated");
      this.addItemExpenses();
    } else {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.PETTYEXPENSE, this.screenType.EDIT, "Navigated");
    }
    this.getMaterials();
    this.getAccountList();
    this.getPaymentAccountList();
    this.getExpenseAccountsAndSetAccount();
    this.setOtherValidators();
    this.getActiveEmpList();
    this.getenantBank();
  }

  getenantBank() {
    this._revenueService.getTenantBank().subscribe((data) => {
      if (data['result']) {
        this.editPettyExpense.get('payment_mode').setValue(data['result'].id);
        this.initialValues.paymentMode['label'] = data['result'].name
        this.onPaymentModeSelected()
      }
    })
  }

  getActiveEmpList() {
    this._revenueService.getActiveEmployeeList().subscribe((data) => {
      this.activeEmpList = data['result']
    })
  }

  ngAfterViewInit() {
    if (this.expenseID) {
      setTimeout(() => {
        this.getFormValues();
      }, 1500);
    }
  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }

  getFormValues() {
    this._pettyExpenseService.getPettyExpenseDetail(this.expenseID).subscribe((response) => {
      this.pettyExpensesDetails = response.result;
      this.patchFormValues(response.result);


    })
  }

  patchFormValues(expenseData) {
    let employee = {
      label: expenseData.employee ? expenseData.employee.display_name : '',
      value: expenseData.employee ? expenseData.employee.id : null
    }

    let paymentDetails = {
      label: expenseData.payment_mode ? expenseData.payment_mode.name : '',
      value: expenseData.payment_mode ? expenseData.payment_mode.id : null
    }

    let adjustmentDetails = {
      label: expenseData.adjustment_account ? expenseData.adjustment_account.name : '',
      value: expenseData.adjustment_account ? expenseData.adjustment_account.id : null

    }
    this.initialValues.employee = employee;
    this.initialValues.paymentMode = paymentDetails;
    this.initialValues.adjustmentAccount = adjustmentDetails;

    expenseData.employee = expenseData.employee ? expenseData.employee.id : null;
    expenseData.payment_mode = expenseData.payment_mode ? expenseData.payment_mode.id : 'Paid By Driver';
    expenseData.adjustment_account = expenseData.adjustment_account ? expenseData.adjustment_account.id : null;
    this.itemExpenseTotals.subtotal = expenseData.subtotal_expense;
    this.itemExpenseTotals.total = expenseData.total;
    this.itemExpenseTotals.discountTotal = expenseData.discount_amount;
    this.itemExpenseTotals.adjustmentAmount = expenseData.adjustment_amount;
    this.patchItemExpenses(expenseData.expense_item);
    this.editPettyExpense.patchValue(expenseData);
    this.patchDocuments(expenseData);
    if (expenseData.payment_mode === '') {
      this.editPettyExpense.get('payment_mode').setValue('paid_By_Driver');
      this.editPettyExpense.get('payment_mode').updateValueAndValidity();
      this.initialValues.paymentMode['label'] = 'Paid By Employee';

    }
    this.editPettyExpense.get('paid_employee').setValue(expenseData.paid_employee?.id)
    this.initialValues.paid_employee['label'] = expenseData.paid_employee?.display_name;
    this.initialValues.paid_employee['value'] = expenseData.paid_employee?.id;
  }

  addExpenseToOption($event) {
    if ($event) {
      this._revenueService.getAccounts('Expense').subscribe((response) => {
        if (response !== undefined) {
          this.accountList = response.result;
        }
      });
      if (this.coaDropdownIndex != -1) {
        this.initialValues.expenseAccount[this.coaDropdownIndex] = { value: $event.id, label: $event.label };

        let other_expense = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
        other_expense.at(this.coaDropdownIndex).get('expense_account').setValue($event.id);
        this.coaDropdownIndex = -1;
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

  fileUploader(filesUploaded) {
    let documents = this.editPettyExpense.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
    });
  }
  fileDeleted(deletedFileIndex) {
    let documents = this.editPettyExpense.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }

  patchDocuments(data) {
    if (data.documents.length > 0) {
      let documentsArray = this.editPettyExpense.get('documents') as UntypedFormControl;
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

  patchItemExpenses(items) {
    let materialItems = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
    materialItems.controls.length = 0;
    items.forEach((item) => {
      materialItems.push(this.itemExpense(item));

      if (isValidValue(item.item)) {
        this.initialValues.item.push({ value: item.item.id, label: item.item.name })
      }
      else {
        this.initialValues.item.push(getBlankOption());
      }

      if (isValidValue(item.expense_account)) {
        this.initialValues.expenseAccount.push({ value: item.expense_account.id, label: item.expense_account.name })
      }
      else {
        this.initialValues.expenseAccount.push(getBlankOption());
      }
    });
  }

  buildform() {
    this.editPettyExpense = this.fb.group({
      bill_date: [null, Validators.required],
      employee: [null],
      expense_items: this.fb.array([]),
      comments: [''],
      payment_mode: [null, Validators.required],
      paid_employee: [null],
      bank_charges: [0.00],
      transaction_date: null,
      discount: [0.00],
      discount_type: [0],
      adjustment_account: [null],
      adjustment: [0],
      adjustment_type: [0],
      documents: [[]]
    })
  }

  /* To get all the employee Details */
  getEmployeeDetails() {

    this._pettyClassService.getEmployeeList(employeeDetails => {
      if (employeeDetails && employeeDetails.length > 0) {
        this.employeeDetails = employeeDetails;
      }
    })
  }

  addItemExpenses() {
    const expense = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
    expense.push(this.itemExpense({}))
  }

  itemExpense(data: any) {
    return this.fb.group({
      item: [
        data.item || null
      ],
      unit_cost: [
        data.unit_cost || 0.00
      ],
      quantity: [
        data.quantity || 0.00
      ],
      description: [
        data.description || ''
      ],
      expense_account: [
        data.expense_account || null
      ],
      total: [
        data.total || 0.00
      ],
      hsn_code: [
        data.hsn_code || '', [Validators.pattern(this.alphaNumericPattern)]
      ],
      additionalDetails: [
        true
      ],
      isEditable: [
        false
      ]
    })

  }

  /* Getting all the material and items */
  getMaterials() {
    this._pettyClassService.getMaterialsList(materialList => {
      if (materialList && materialList.length > 0) {
        this.staticOptions.materialList = materialList;
      }
    })

    this._commonService.getStaticOptions('item-unit')
      .subscribe((response) => {
        this.staticOptions.itemUnits = response.result['item-unit'];
      });
  }

  /* To Get all the accounts */
  getAccountList() {
    this._pettyClassService.getAccountsList(accountList => {
      if (accountList && accountList.length > 0) {
        this.accountList = accountList;
      }
    })
  }

  getPaymentAccountList() {
    this._pettyClassService.getPaymentAccountsList(paymentAccountList => {
      if (paymentAccountList && paymentAccountList.length > 0) {
        this.paymentAccountList = paymentAccountList;
      }
    })
  }

  getExpenseAccountsAndSetAccount() {
    this._revenueService.getAccounts('Expense,Other Expense,Cost of Services / COGS').subscribe((response) => {
      if (response !== undefined) {
        this.expenseAccountList = response.result;
        this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
        this.editPettyExpense.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
      }
    });
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  onPaymentModeSelected() {
    let bank = this.editPettyExpense.controls['payment_mode'].value;
    if (bank === 'paid_By_Driver') {
      setUnsetValidators(this.editPettyExpense, 'paid_employee', [Validators.required])
    } else {
      this.editPettyExpense.controls['paid_employee'].setValue(null);
      this.initialValues.paid_employee = getBlankOption();
      setUnsetValidators(this.editPettyExpense, 'paid_employee', [Validators.nullValidator])
    }
    this.bankingChargeRequired = bankChargeRequired(bank, this.editPettyExpense.get('bank_charges'), this.paymentAccountList);
  }

  resetItemExpense(formGroup, index) {
    const singleUse = this.itemExpense({});
    formGroup.patchValue(singleUse.value);
    this.initialValues.expenseAccount[index] = getBlankOption();
    this.initialValues.item[index] = getBlankOption();
    this.onCalcuationsChanged();

  }

  removeItemExpense(index) {
    const advance = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
    this.initialValues.expenseAccount.splice(index, 1);
    this.initialValues.item.splice(index, 1);
    advance.removeAt(index);
    this.onCalcuationsChanged();
  }

  /* Clearing all the data of item expense section */
  clearAllItemExpense() {
    const itemExpenses = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
    itemExpenses.reset();
    itemExpenses.controls = [];
    this.addItemExpenses();
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



  resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index) {
    formGroup.patchValue({ unit_cost: 0, total: 0, quantity: 0, expense_account: null });
    this.initialValues.expenseAccount[index] = getBlankOption();
  }

  onChangeOtherExpenseItem(index) {
    const otherExpenses = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
    const otherExpense = otherExpenses.at(index);
    const itemId = otherExpense.get('item').value;
    if (itemId) {
      const expenseItem = getObjectFromList(itemId, this.staticOptions.materialList);
      if (expenseItem) {
        if (expenseItem.account) {
          otherExpense.get('expense_account').setValue(expenseItem.account.id);
          this.initialValues.expenseAccount[index] = { label: expenseItem.account.name, value: expenseItem.account.id }
        }
        else {
          otherExpense.get('expense_account').setValue(null);
          this.initialValues.expenseAccount[index] = getBlankOption();
        }
        otherExpense.get('unit_cost').setValue(expenseItem.rate_per_unit);
        otherExpense.get('hsn_code').setValue(expenseItem.hsn_code);

      }
    }
    this.onCalcuationsChanged();
  }


  /* Saving the form */
  saveExpense() {
    this.toggleItemOtherFilled();
    let form = this.editPettyExpense;
    this.apiError = '';
    if (this.itemExpenseTotals.total <= 0) {
      this.apiError = 'Please check detail, Total amount should be greater than zero'
      form.setErrors({ 'invalid': true });
      this._scrollToTop.scrollToTop();
    }
    if (form.valid) {

      this.apiHandler.handleRequest(this._pettyExpenseService.postPettyExpense(this.prepareRequestForSubmit(form)),'Petty Expense added successfully!').subscribe(
        {
          next: (resp) => {
            this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.PETTYEXPENSE)
        this._route.navigateByUrl(this.prefixUrl + '/expense/petty-expense/list');
            },
            error: (error) => {
              this.apiError = error["error"]["message"];
              setTimeout(() => {
                this.apiError = "";
              }, 10000);
            },
        }
      )
    }
    else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
      this.setFormGlobalErrors();
    }
    this.toggleItemOtherFilled(true);
  }

  /* Mutating the format of form values */
  prepareRequestForSubmit(form) {
    form.patchValue({
      bill_date: changeDateToServerFormat(form.controls.bill_date.value),
      transaction_date: changeDateToServerFormat(form.controls.transaction_date.value),
    });
    if (form.value['payment_mode'] == 'paid_By_Driver') form.value['payment_mode'] = null
    return form.value;
  }


  updateExpense() {
    this.toggleItemOtherFilled();
    this.patchItemExpensesValues();
    let form = this.editPettyExpense;
    this.apiError = '';
    if (this.itemExpenseTotals.total <= 0) {
      this.apiError = 'Please check detail, Total amount should be greater than zero'
      form.setErrors({ 'invalid': true });
      this._scrollToTop.scrollToTop();
      window.scrollTo(0, 0);
    }
    if (form.valid) {
      if (form.get('payment_mode').value === 'paid_By_Driver') {
        form.get('payment_mode').setValue(null);
        form.get('payment_mode').updateValueAndValidity()
      }
      else {
        form.get('paid_employee').setValue(null)
        form.get('paid_employee').updateValueAndValidity()
      }
      this.apiHandler.handleRequest(this._pettyExpenseService.updatePettyExpense(this.prepareRequestForSubmit(form), this.expenseID),'Petty Expense updated successfully!').subscribe(
        {
          next: (resp) => {
            this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.PETTYEXPENSE)
            this._route.navigate([this.prefixUrl + '/expense/petty-expense/list'], { queryParams: { pdfViewId: this.expenseID } });
            },
            error: (error) => {
              this.apiError = error["error"]["message"];
              setTimeout(() => {
                this.apiError = "";
              }, 10000);
            },
        }
      )
     
    }
    else {
      this.toggleItemOtherFilled(true)
      this._scrollToTop.scrollToTop();
      this.setAsTouched(form);
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

  patchItemExpensesValues() {
    const item_expenses = this.editPettyExpense.get('expense_items') as UntypedFormArray;
    item_expenses.controls.forEach((controls, index) => {
      const total = Number(controls.get('total').value)
      const unit_cost = Number(controls.get('unit_cost').value)
      const quantity = Number(controls.get('quantity').value)
      const expense_account = controls.get('expense_account')
      const item = controls.get('item')
      if (typeof expense_account.value === 'object' && isValidValue(expense_account.value)) expense_account.setValue(expense_account.value.id);
      if (typeof item.value === 'object' && isValidValue(item.value)) item.setValue(item.value.id);
      if (!total && !unit_cost && !quantity && !expense_account.value && !item.value) {
        controls.disable()
      }
    });
  }

  /* Setting the validations for item expense */
  setOtherValidators() {
    const item_other = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
    this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
      items.forEach((key, index) => {
        const item = item_other.at(index).get('item');
        const expense_account = item_other.at(index).get('expense_account');
        const quantity = item_other.at(index).get('quantity');
        const total = item_other.at(index).get('total');

        item.setValidators(Validators.required);
        expense_account.setValidators(Validators.required);
        total.setValidators(Validators.min(0.01));
        if (items.length == 1) {
          if (!expense_account.value && !item.value && !Number(quantity.value) && !Number(total.value)) {
            item.clearValidators();
            expense_account.clearValidators();
            total.clearValidators();
          }
        }
        item.updateValueAndValidity({ emitEvent: true });
        expense_account.updateValueAndValidity({ emitEvent: true });
        total.updateValueAndValidity({ emitEvent: true });
      });
    });
  }

  toggleItemOtherFilled(enable: Boolean = false) {
    const otherItems = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
    otherItems.controls.forEach(ele => {
      if (enable) {
        ele.enable();
      } else {
        if (ele.value.item == null && ele.value.total == 0 && ele.value.expense_account == null
          && ele.value.quantity == 0) {
          ele.disable();
        }
      }
    });
  }

  onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
    this.resetOtherExpenseExceptItem(itemExpenseControl, index);
    this.onChangeOtherExpenseItem(index);
  }

  addNewAdditionalCharge(event, i) {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data: {
        isEdit: false,
        charge_name: event,
        sales: false,
        purchase: true,
        vehicleCategory: false,
        isDisableSeletAll: false
      },
      width: '1000px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if (item) {
        this.expenseItemDropdownIndex = i
        this._revenueService.getExpense().subscribe((response) => {
          if (response && response.result && response.result.length > 0) {
            this.staticOptions.materialList = response.result;
            if (this.expenseItemDropdownIndex != -1) {
              this.initialValues.item[this.expenseItemDropdownIndex] = { value: item.name.id, label: item.name.name };
              let other_expense = this.editPettyExpense.controls['expense_items'] as UntypedFormArray;
              other_expense.at(this.expenseItemDropdownIndex).get('item').setValue(item.name.id);
              let itemExpenseControl = other_expense.at(this.expenseItemDropdownIndex) as UntypedFormGroup;
              this.resetOtherExpenseExceptItem(itemExpenseControl, this.expenseItemDropdownIndex);
              this.onChangeOtherExpenseItem(this.expenseItemDropdownIndex);
              this.expenseItemDropdownIndex = -1;
            }
          }
        });
      }
      dialogRefSub.unsubscribe();
    })
  }

}
