import { EmployeeSalaryModuleService } from '../../../api-services/employee-salary-service/employee-salary-module-service.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { EmployeeSalaryClass } from '../employee-salary-class/employee-salary.class';
import { EmployeeSalaryClassService } from '../employee-salary-class/employee-salary.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { RevenueService } from '../../../api-services/revenue-module-service/revenue-service/revenue.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { getEmployeeObject } from '../../../master-module/employee-module/employee-utils';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-add-edit-employee-salary',
  templateUrl: './add-edit-employee-salary.component.html',
  styleUrls: ['./add-edit-employee-salary.component.scss']
})
export class AddEditEmployeeSalaryComponent extends EmployeeSalaryClass implements OnInit {
  employeeSalaryForm: UntypedFormGroup;
  employeeList: any = [];
  vendorList: any = [];
  accountList: any = [];
  apiError: string;
  current_date: Date = new Date(dateWithTimeZone());
  paymentAccountList: any = [];
  initialValues: any = {
    paymentMode: getBlankOption(),
    units: [],
    vehicle: getBlankOption(),
    serviceType: getBlankOption(),
    expenseAccount: [],
    item: [],
    paymentStatus: new ValidationConstants().unPaidOption,
    adjustmentAccount: getBlankOption(),
    vendor: {}
  };

  i;
  companyRegistered: boolean = true;
  discountAfterTaxSub: Subscription;
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;
  challanModelInline: Boolean = false;
  addExpenseTypeUrl = TSAPIRoutes.operation + TSAPIRoutes.employee_list + TSAPIRoutes.expense_type;
  currency_type;
  salaryMonthLabel = "Salary Month";
  isRequired = true;
  allowanceMonthLabel = "Allowance Month"
  ii;
  allEmployeeList = [];
  employeeIds: any = [];
  salaryMonthdate = '';
  allowanceMonthdate = new Date(dateWithTimeZone());
  editId;
  patchFileUrls = new BehaviorSubject([]);
  selectedEmployee = [];
  isEdit = false;
  salarymonthdate;
  total = 0;
  expenseTypeParams = {};
  expenseTypeData: any = [];
  prefixUrl: string;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;

  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/JeuDeZTbyrJNEN0Da6fp?embed%22"
  }

  constructor(
    private _fb: UntypedFormBuilder,
    private _route: Router,
    private currency: CurrencyService,
    private _employe_salary: EmployeeSalaryModuleService,
    private _activatedRoute: ActivatedRoute,
    private _analytics: AnalyticsService,
    private _employeeSalaryClassService: EmployeeSalaryClassService,
    private _prefixUrl: PrefixUrlService,
    private _scrollToTop:ScrollToTop,
    private _revenuservice:RevenueService,
    private apiHandler:ApiHandlerService
  ) { super() }


  ngOnInit() {
    this.prefixUrl = this._prefixUrl.getprefixUrl();
    this._activatedRoute.params.subscribe((response: any) => {
      this.editId = response['editid']
      if (this.editId) {
        this.isEdit = true;
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEESALARYBILL, this.screenType.EDIT, "Navigated");
        this._employe_salary.getEmployeeSalaryDetails(this.editId).subscribe(data => {
          this.patchForm(data['result'])
        })
      } else {
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.EMPLOYEESALARYBILL, this.screenType.ADD, "Navigated");
      }
    })
    this.buildForm();
    this.getenantBank()
    this.getInitialData();
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
  }
  getenantBank(){
    this._revenuservice.getTenantBank().subscribe((data)=>{
      if(data['result']){
        this.employeeSalaryForm.get('payment_mode').setValue(data['result'].id);
        this.initialValues.paymentMode['label']=data['result'].name
      }
    })
  }
  handleOtherEmployeeChange(index){
    const employeesFormArray=this.employeeSalaryForm.get('other_expenses') as UntypedFormArray;
    let empId=employeesFormArray.at(index).get('employee_name').value
    let empObj=getEmployeeObject(this.employeeList,empId);
    employeesFormArray.at(index).get('employeeOption').setValue({label:empObj?.display_name,value:empId})

  }

  buildForm() {
    this.employeeSalaryForm = this._fb.group({
      date: [
        null, Validators.required
      ],
      reference_no: [''],
      transaction_date: [null],
      salary_year_month: [null],
      allowance_year_month: [null],
      salary_details: this._fb.array([]),
      other_expenses: this._fb.array([]),
      payment_mode: [null, Validators.required],
      reminder: [null],
      comments: [''],
      documents: [[]],
      total: ''
    });
    this.employeeSalaryForm.controls['date'].setValue(this.current_date);
    this.buildOtherersSalary([''])
  }
  openGothrough(){
    this.goThroughDetais.show=true;
}



  buildNewSalaryDetailsForm(item: any) {
    if (this.editId) {
      return this._fb.group({
        name: [item.employee.display_name || ''],
        trips: [item.trips || 0],
        salary_paid: [item.salary_paid || 0],
        allowance_paid: [item.allowance_paid || 0],
        id: [item.employee.id || null],
        total: [item.total || 0, [Validators.min(0.01)]],
        description: [''],
        additionalDetails: [false]
      });
    } else {
      return this._fb.group({
        name: [item.name || ''],
        trips: [item.trips || 0],
        salary_paid: [item.salary_paid || 0],
        allowance_paid: [item.allowance_paid || 0],
        id: [item.id || null],
        total: [item.total || 0, [Validators.min(0.01)]],
        description: [''],
        additionalDetails: [false]
      });
    }
  }

  bulidSallary(items: any = []) {
    const employeeSalary = this.employeeSalaryForm.controls['salary_details'] as UntypedFormArray;
    employeeSalary.controls = [];
    this.employeeIds = [];
    items.forEach((item) => {
      const employeeSalaryFG = this.buildNewSalaryDetailsForm(item);
      employeeSalary.push(employeeSalaryFG);
      this.employeeIds.push(employeeSalaryFG.get('id').value);
    });
  }

  buildOtherersSalary(items: any = []) {
    const otherExpenses = this.employeeSalaryForm.controls['other_expenses'] as UntypedFormArray;
    items.forEach((item) => {
      otherExpenses.push(this.addOthersSalary(item));

    });
  }

  addOthersSalary(item) {
    return this._fb.group({
      employee_name: [isValidValue(item.employee) ? item.employee.id : '' || ''],
      expense_type: [isValidValue(item.expense_type) ? item.expense_type.id : '' || ''],
      amount_paid: [item.amount_paid || 0.000],
      description: [item.description || ''],
      employeeOption: { label: isValidValue(item.employee) ? item.employee.display_name : '', value: isValidValue(item.employee) ? item.employee.id : '' },
      expenseTypeOption: { label: isValidValue(item.expense_type) ? item.expense_type.name : '', value: isValidValue(item.expense_type) ? item.expense_type.id : '' }
    });
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


  saveExpense() {
    let form = this.employeeSalaryForm;
    this.validateOtherExpense();
    if (form.valid) {
      if (this.editId) {
        this.apiHandler.handleRequest(this._employe_salary.putEmployeeSalary(this.getPayload(), this.editId),'Salary updated successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.EMPLOYEEOTHERBILL)
          this._route.navigate([this.prefixUrl + '/expense/salary_expense/list'] , { queryParams: { pdfViewId:this.editId } })
              },
              error: (error) => {
                this.apiError = error['error']['message'];
                setTimeout(() => {
                  this.apiError = '';
                }, 10000);
              },
          }
        )
      } else {
        this.apiHandler.handleRequest(this._employe_salary.postEmployeeSalary(this.getPayload()),'Salary added successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.EMPLOYEEOTHERBILL)
          this._route.navigateByUrl(this.prefixUrl + '/expense/salary_expense/list')
              },
              error: (error) => {
                this.apiError = error['error']['message'];
                setTimeout(() => {
                  this.apiError = '';
                }, 10000);
              },
          }
        )
      }
    } else {
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop();
      this.setFormGlobalErrors();
    }
  }

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

  salarymonth(e) {
    let form = this.employeeSalaryForm;
    form.get('salary_year_month').patchValue(changeDateToServerFormat(e))
    this.salarymonthdate = form.get('salary_year_month').value
  }

  allowanceMonth(e) {
    let form = this.employeeSalaryForm;
    form.get('allowance_year_month').patchValue(changeDateToServerFormat(e))
  }
  removeOtherItem(index) {
    let form = this.employeeSalaryForm.controls['other_expenses'] as UntypedFormArray;
    form.removeAt(index);
    this.claculateTotal()
  }

  clearAllCells() {
    let form = this.employeeSalaryForm.controls['other_expenses'] as UntypedFormArray;
    form.reset();
    form.controls = [];
    this.buildOtherersSalary(['']);
    form.controls.forEach(element => {
      this.onAmountChange(element);
    });
  }

  idSelected(employeeIds) {
    let form = this.employeeSalaryForm;
    if (employeeIds.length <= 0) {
      this.selectedEmployee = [];
      this.allEmployeeList = []

    } else {
      let payload = {
        "get_salary_date": form.get('salary_year_month').value,
        "get_allowance_date": form.get('allowance_year_month').value,
        employees: employeeIds
      }
      this._employe_salary.getEmployeeMeta(payload).subscribe(data => {
        this.allEmployeeList = data['result']
        if (this.allEmployeeList.length > 0) {this.allEmployeeList.forEach((employee)=>{
          this.employeeList.forEach(selectedEmp => {
            if(employee.id == selectedEmp.id){
              employee['salary_paid'] = selectedEmp.salary;
            }
          });
        })
          this.patchSalary(this.allEmployeeList);
        }
      })
    }
  }

  getSelectedEmployeeStats(e) {
    
  }

  getSelectedEmployeeAllowance(e) {
    const allowanceYearMonth = changeDateToServerFormat(e)
    if (!allowanceYearMonth) {
      return
    }
    let payload = {
      "get_allowance_date": allowanceYearMonth,
      employees: this.employeeIds
    }
    this._employe_salary.getEmployeeMeta(payload).subscribe(data => {
      const getEmployeeStats = data['result'];
      const employeeSalary = this.employeeSalaryForm.get('salary_details') as UntypedFormArray;
      employeeSalary.controls.forEach((es: any) => {
        getEmployeeStats.forEach(ea => {
          const employeeId = es.get('id').value;
          if (employeeId == ea.id) {
            es.get('allowance_paid').setValue(ea.allowance_paid);
            es.get('trips').setValue(ea.trips);
          }
        });
      });
      this.calculateAllEmployeeSalary();
    })
  }

  getInitialData() {
    this._employeeSalaryClassService.getPaymentAccountsList(paymentAccountList => {
      if (paymentAccountList && paymentAccountList.length > 0) {
        this.paymentAccountList = paymentAccountList;
      }
    })


    this._employeeSalaryClassService.getEmployeeList(employeeList => {
      if (employeeList && employeeList.length > 0) {
        this.employeeList = employeeList;
      }
    })
    this.getExpenseTypeData();
  }

  getPayload() {
    let form = this.employeeSalaryForm;
    let Payload = {
      "salary": getSalaryPayload(form.value['salary_details']),
      "other": getOthersPayload(form.value['other_expenses']),
      "transaction_date": changeDateToServerFormat(form.value['transaction_date']),
      "date": changeDateToServerFormat(form.value['date']),
      "salary_year_month": form.value['salary_year_month'],
      "allowance_year_month": form.value['allowance_year_month'],
      "reference_no": form.value['reference_no'],
      "employee": form.value['employee'],
      "payment_mode": form.value['payment_mode'],
      "reminder": changeDateToServerFormat(form.value['reminder']),
      "comments": form.value['comments'],
      "total": this.total,
      "documents": form.value['documents']
    }
    function getOthersPayload(data) {
      let othersEmployee = [];
      data.forEach(element => {
        othersEmployee.push(
          {
            "employee": element.employee_name,
            "amount_paid": Number(element.amount_paid),
            "description": element.description ? element.description : '',
            "expense_type": element.expense_type
          }
        )
      });
      return othersEmployee
    }
    function getSalaryPayload(data) {
      let salaryEmployee = [];
      data.forEach(element => {
        salaryEmployee.push(
          {
            "employee": element.id,
            "allowance_paid": Number(element.allowance_paid),
            "salary_paid": Number(element.salary_paid),
            "total": Number(element.total),
            "description": element.description ? element.description : ''
          }
        )
      });
      return salaryEmployee
    }
    return Payload
  }

  fileUploader(filesUploaded) {
    let documents = this.employeeSalaryForm.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
    });
  }
  fileDeleted(deletedFileIndex) {
    let documents = this.employeeSalaryForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }


  patchForm(data) {
    let form = this.employeeSalaryForm;
    form.patchValue(data);
    this.total = data['total'];
    this.salaryMonthdate = form.get('salary_year_month').value;
    this.allowanceMonthdate = form.get('allowance_year_month').value;
    if (isValidValue(data['payment_mode'])) {
      let name = data['payment_mode'].name;
      let id = data['payment_mode'].id;
      this.initialValues.paymentMode['value'] = id;
      this.initialValues.paymentMode['label'] = name;
      form.get('payment_mode').patchValue(id)
    } else {
      this.initialValues.paymentMode = getBlankOption();
    }
    this.bulidSallary(data['salary']);
    this.selectedEmployee = data['salary'];
    this.patchOthers(data['other'])
    this.patchDocuments(data);
    this.claculateTotal();
  }

  patchOthers(othersData) {
    let form = this.employeeSalaryForm.controls['other_expenses'] as UntypedFormArray;
    form.reset();
    form.controls = [];
    this.buildOtherersSalary(othersData)
  }

  validateOtherExpense() {
    let form = this.employeeSalaryForm.controls['other_expenses'] as UntypedFormArray;
    let salaryForm = this.employeeSalaryForm.controls.salary_details['controls'];

    form.controls.forEach(ele => {
      const employee_name = ele.get('employee_name').value;
      const expense_type = ele.get('expense_type').value;
      const amount_paid = ele.get('amount_paid').value;
      if (employee_name || expense_type || Number(amount_paid) > 0) {
        setUnsetValidators(ele, 'employee_name', [Validators.required]);
        setUnsetValidators(ele, 'expense_type', [Validators.required]);
        setUnsetValidators(ele, 'amount_paid', [Validators.min(0.01)]);
      } else {
        setUnsetValidators(ele, 'employee_name', [Validators.nullValidator]);
        setUnsetValidators(ele, 'expense_type', [Validators.nullValidator]);
        setUnsetValidators(ele, 'amount_paid', [Validators.nullValidator]);
      }
      if (salaryForm.length <= 0 && this.total <= 0) {
        setUnsetValidators(ele, 'employee_name', [Validators.required]);
        setUnsetValidators(ele, 'expense_type', [Validators.required]);
        setUnsetValidators(ele, 'amount_paid', [Validators.min(0.01)]);
      }

    })


  }



  patchDocuments(data) {
    if (data.documents.length > 0) {
      let documentsArray = this.employeeSalaryForm.get('documents') as UntypedFormControl;
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

  patchSalary(data) {
    const employeeSalary = this.employeeSalaryForm.controls['salary_details'] as UntypedFormArray;
    let employeeSalaryValues = []
    employeeSalaryValues = employeeSalary.value;
    let formpatchvalue = [];
    let selectedpatchvalue = []
    let filteredItem = []
    data.forEach(element => {
      employeeSalaryValues.forEach(item => {
        if (item.id == element.id) {
          filteredItem.push(item);
        }
      }
      )
    });

    if (filteredItem.length > 0) {
      filteredItem.forEach(item => {
        formpatchvalue.push(
          {
            allowance_paid: item.allowance_paid,
            description: item.description,
            employee: { display_name: item.name, id: item.id },
            salary_paid: item.salary_paid,
            total: item.total,
            trips: item.trips
          })
      })
    }

    if (data.length > 0) {
      data.forEach(item => {
        selectedpatchvalue.push(
          {
            absent: item.absent,
            allowance_paid: item.allowance_paid,
            description: item.description,
            employee: { display_name: item.name, id: item.id },
            salary_paid: item.salary_paid,
            total: 0,
            trips: item.trips
          })
      });
    }

    selectedpatchvalue.forEach(item => {
      if (formpatchvalue.length > 0) {
        formpatchvalue.forEach(element => {
          if (item.employee.id == element.employee.id) {
            item['allowance_paid'] = element.allowance_paid;
            item['salary_paid'] = element.salary_paid;
            item['total'] = element.total;
            item['description'] = element.description;
          }
        })

      }
    })

    if (this.editId) {
      this.selectedEmployee = selectedpatchvalue;
      this.bulidSallary(selectedpatchvalue);
    } else {
      this.bulidSallary(data)

    }

    setTimeout(() => {
      this.calculateAllEmployeeSalary();
    }, 1000);
  }

  getExpenseTypeData() {
    this._employeeSalaryClassService.getExpenseAccountsList(expenseTypeData => {
      if (expenseTypeData && expenseTypeData.length > 0) {
        this.expenseTypeData = expenseTypeData;
      }
    })
  }

  addExpenseType(event) {
    if (event) {
      this.expenseTypeParams = {
        expensetype: event
      };
    }
  }

  getExpenseType(event, index) {
    if (event) {
      this.getExpenseTypeData();
      const item_other = this.employeeSalaryForm.controls['other_expenses'] as UntypedFormArray;
      item_other.at(index).get('expense_type').setValue(event.id);
    }
  }
}

