import { TSAPIRoutes } from "src/app/core/constants/api-urls.constants";
import { getBlankOption, getNonTaxableOption } from "src/app/shared-module/utilities/helper-utils";
import { Component, EventEmitter, Input, OnInit, Output, } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl, } from "@angular/forms";
import { TransportValidator } from "src/app/shared-module/components/validators/validators";
import { PartyService } from "src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service";
import { PartyType, ValidationConstants, VendorType } from "src/app/core/constants/constant";
import { CompanyTripGetApiService } from "../../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service";
import { setUnsetValidators } from "src/app/shared-module/utilities/form-utils";
import { Observable } from "rxjs";
import { NewTripV2Constants } from "../../../new-trip-v2-constants/new-trip-v2-constants";
import { dateWithTimeZone } from "src/app/core/services/time-zone.service";
import { TaxService } from "src/app/core/services/tax.service";
import { TaxModuleServiceService } from "src/app/tax-module/tax-module-service.service";
import { EmployeeService } from "src/app/modules/customerapp-module/api-services/master-module-services/employee-service/employee-service";
import { AddAdditionalChargePopupComponent } from "src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component";
import { Dialog } from "@angular/cdk/dialog";
import { RateCardService } from "src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service";
import { CurrencyService } from "src/app/core/services/currency.service";
import { NewTripV2Service } from "src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service";

@Component({
  selector: "app-add-edit-reduce-from-invoice",
  templateUrl: "./add-edit-reduce-from-invoice.component.html",
  styleUrls: ["./add-edit-reduce-from-invoice.component.scss"],
})
export class AddEditReduceFromInvoiceComponent implements OnInit {
  reduceBillForm: UntypedFormGroup;
  defaultTax = new ValidationConstants().defaultTax;
  taxOption = getNonTaxableOption();
  initialDetails = {
    chargeType: getBlankOption(),
    expenseAccount: getBlankOption(),
    vendor: getBlankOption(),
    paymentStatus: getBlankOption(),
    expenseType: getBlankOption(),
    advanceClientAccount: getBlankOption(),
    employee: getBlankOption(),
    tax: this.taxOption,
    expenseTax: this.taxOption

  };
  addExpenseType = {};
  coaDropdownIndex: number = -1;
  showAddCoaPopup: any = { name: "", status: false };
  showAddPartyPopup: any = { name: "", status: false };
  partyNamePopup: string = "";
  vendorList = [];
  paymentStatusList = new NewTripV2Constants().paymentStatusList;
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  expenseApi = TSAPIRoutes.static_options;
  policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
  expenseTypeList: [];
  advanceClientAccountList = [];
  maxDate = new Date(dateWithTimeZone());
  @Input() chargeReduceValidSubject: Observable<boolean>;
  @Input() tripStratDate: string = ''
  @Input() editData: any
  @Input() isAddExpense = true;
  @Output() reduceChargeFormData: EventEmitter<any> = new EventEmitter();
  @Input() is_Driver_Added: boolean = true;
  @Input() is_Transporter: boolean = true;
  @Input() vehicleCategory;
  @Input() customerId = '';
  @Input() tripId = '';
  taxOptions = [];
  isTax = true;
  driverList=[];
  uploadedDocs=[];
  currency_type:any;
  containersList = [];
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 1,
    enableCheckAll: true,
    allowSearchFilter: true
  };
  constructor(
    private _fb: UntypedFormBuilder,
    private _companyTripGetApiService: CompanyTripGetApiService,
    private _partyService: PartyService,
    private _taxModuleService: TaxModuleServiceService,
    private _taxService: TaxService,
    private _employeeService: EmployeeService,
    private dialog: Dialog,
    private _rateCardService: RateCardService,
    private currency: CurrencyService,private _newTripV2Service: NewTripV2Service
  ) { }
  ngOnInit() {
    this.currency_type = this.currency.getCurrency();
    this.maxDate = new Date(this.tripStratDate);
    this.buildForm({});
    if (this.editData.hasOwnProperty('id')) {
      this.patchForm(this.editData);
      this.emitData();
    }
    setTimeout(() => {
      if (this.isAddExpense) this.getVendorDetails();
      this.getContainersOfJob();
      this.getAdditionalCharges()
      this.getPaymentModeList();
      this.emitData();
      this.getTaxDetails();
      this.getAssignedDriversList();
      this.isTax = this._taxService.getTax();
    }, 10);

    this.reduceBillForm.valueChanges.subscribe(emitval => {
      this.emitData();
    });
    this.chargeReduceValidSubject.subscribe(isValid => {
      if (!isValid) this.setAsTouched(this.reduceBillForm)
    })
  }

  emitData() {
    this.reduceChargeFormData.emit({
      isValid: this.reduceBillForm.valid,
      value: this.reduceBillForm.value
    })
  }


  buildForm(item) {
    this.reduceBillForm = this._fb.group({
      id: [item.id || null],
      type: [item.type || null],
      amount: [item.amount || 0.0],
      containers : [[]],
      date: [item.date || this.maxDate],
      expense_account: [item.expense_account || null],
      expense_amount: [item.expense_amount || 0.0],
      expense_amount_before_tax: [item.expense_amount_before_tax || 0.000],
      expense_tax: [item.expense_tax || this.defaultTax],
      expense_payment_mode: [item.expense_payment_mode || null],
      expense_bill_no: [item.expense_bill_no || "", [Validators.pattern(this.policyNumber)]],
      expense_bill_date: [item.expense_bill_date || null],
      expense_party: [item.expense_party || null],
      expense_status: [item.expense_status || "1"],
      is_expense: [item.is_expense || false],
      is_driver_paid:[item.is_driver_paid || false],
      expense_type:[item.expense_type||1],
      employee : [item?.selected_driver || null],
      tax:[item.tax||this.defaultTax],
      amount_before_tax:[item.amount_before_tax||0.000],
      document_no:[''],
      documents:[[]]
    });
  }
  paymentmodeChanged() {
    let value = this.reduceBillForm.get('expense_payment_mode').value;
    if (value === 'paid_By_Driver') {
      setUnsetValidators(this.reduceBillForm, 'employee', [Validators.required]);
      this.reduceBillForm.get('is_driver_paid').setValue(true)
    } else {
      setUnsetValidators(this.reduceBillForm, 'employee', [Validators.nullValidator]);
      this.reduceBillForm.get('employee').setValue(null)
      this.reduceBillForm.get('is_driver_paid').setValue(false)
    }
  }


  onAmountChange() {
    const form = this.reduceBillForm;
    if (Number(form.get('amount_before_tax').value > 0)) {
      setUnsetValidators(form, 'type', [Validators.required]);
      setUnsetValidators(form, "date", [Validators.required]);
    } else {
      setUnsetValidators(form, 'type', [Validators.nullValidator]);
      setUnsetValidators(form, "date", [Validators.nullValidator]);
      setUnsetValidators(form, "amount_before_tax", [Validators.nullValidator]);
    }
    this.onCalculationChange();
  }

  onCalculationChange() {
    let form = this.reduceBillForm;
    this.taxOptions.forEach(tax => {
      if (form.get('tax').value == tax.id) {
        let amountWithoutTax = Number(form.get('amount_before_tax').value);
        let amountWithTax = (Number(tax.value / 100 * amountWithoutTax) + Number(amountWithoutTax)).toFixed(3);
        form.get('amount').setValue(amountWithTax)
      }
    })
  }

  getPaymentModeList() {
    this._companyTripGetApiService.getClientExpenseAccounts(accountListObjCb => {
      this.advanceClientAccountList = accountListObjCb.advanceClientAccountList;

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


  openAddPartyModal($event) {
    if ($event)
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
  }

  addValueToPartyPopup(event) {
    if (event) {

      this.partyNamePopup = event;
    }
  }

  addPartyToOption($event) {
    if ($event.status) {
      this.getVendorDetails();
      this.initialDetails.vendor = {
        value: $event.id,
        label: $event.label,
      }
    }
    this.reduceBillForm.controls.expense_party.setValue($event.id)
  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  changePaymentStatus() {
    let form = this.reduceBillForm
    const paymentType = form.get('expense_status').value;
    if (paymentType == '3') {
      setUnsetValidators(form, 'expense_payment_mode', [Validators.required]);
      setUnsetValidators(form, 'expense_bill_no', [Validators.required, Validators.pattern(this.policyNumber)]);
      form.get('expense_bill_date').setValue(form.get('date').value);
    }
    if (paymentType == '1') {
      setUnsetValidators(form, 'expense_payment_mode', [Validators.nullValidator]);
      setUnsetValidators(form, 'expense_bill_no', [Validators.nullValidator]);
      setUnsetValidators(form, 'employee', [Validators.nullValidator]);
      form.get('expense_payment_mode').setValue(null);
      form.get('expense_bill_date').setValue(null);
      form.get('employee').setValue(null);
      form.get('expense_bill_no').setValue('');
      this.initialDetails.advanceClientAccount = getBlankOption();
      this.initialDetails.employee = getBlankOption();
    }

  }

  chargeSelection(){
    let form = this.reduceBillForm
    const chargeId=form.get('type').value;
    const expenseType = Number(form.get('expense_type').value);
    const chargeObj:any= this.expenseTypeList.find(charge=>charge['name']['id']==chargeId)
    if(chargeObj){
      form.get('tax').setValue(this.defaultTax);
      form.get('amount_before_tax').setValue(chargeObj['rate'])
      this.initialDetails.tax = {label:chargeObj['tax']['label'],value:''};
      this.onCalculationChange();
    }
    if( expenseType==2|| expenseType==3){
      form.get('expense_amount_before_tax').setValue(chargeObj?.purchase_amount ? chargeObj?.purchase_amount : 0)
      this.onExpesneCalculationChange();
    }
  }

  addExpense() {
    let form = this.reduceBillForm
    const expenseType = Number(form.get('expense_type').value);
    this.initialDetails.paymentStatus = { label: 'Unpaid', value: '1' };
    form.get('expense_status').setValue('1');
    this.makeAllFieldsNonMandatory();
    const chargeId=form.get('type').value;
    const chargeObj :any = this.expenseTypeList.find(charge=>charge['name']['id']==chargeId);
    if (expenseType == 2) {
      form.get('expense_bill_date').setValue(form.get('date').value);
      setUnsetValidators(form, 'expense_party', [Validators.required]);
      setUnsetValidators(form, 'type', [Validators.required]);
      setUnsetValidators(form, 'amount_before_tax', [Validators.required, Validators.min(0.01)]);
      setUnsetValidators(form, 'expense_amount_before_tax', [Validators.required, Validators.min(0.01)]);
      form.get('expense_amount_before_tax').setValue(chargeObj?.purchase_amount ? chargeObj?.purchase_amount : 0)
    } else if (expenseType == 3) {
      setUnsetValidators(form, 'expense_amount_before_tax', [Validators.required, Validators.min(0.01)]);
      form.get('expense_bill_date').setValue(form.get('date').value);
      setUnsetValidators(form, 'expense_payment_mode', [Validators.required]);
      setUnsetValidators(form, 'type', [Validators.required]);
      setUnsetValidators(form, 'amount_before_tax', [Validators.required, Validators.min(0.01)]);
      form.get('expense_amount_before_tax').setValue(chargeObj?.purchase_amount ? chargeObj?.purchase_amount : 0)
    }
    this.onExpesneCalculationChange(); 
  }

  makeAllFieldsNonMandatory() {
    let form = this.reduceBillForm
    let keys = ['expense_party', 'expense_amount_before_tax', 'expense_payment_mode', 'expense_bill_no', 'employee', 'expense_bill_date', 'type', 'amount_before_tax'];
    keys.forEach(key => {
      setUnsetValidators(form, key, [Validators.nullValidator]);
    })
    this.initialDetails.vendor = getBlankOption();
    this.initialDetails.employee = getBlankOption();
    this.initialDetails.advanceClientAccount = getBlankOption();
    this.initialDetails.expenseTax = this.taxOption;
    form.get('expense_amount').setValue(0.000);
    form.get('employee').setValue(null);
    form.get('expense_party').setValue(null);
    form.get('expense_payment_mode').setValue(null);
    form.get('expense_bill_no').setValue("");
    form.get('expense_bill_date').setValue(null);
    form.get('expense_amount_before_tax').setValue(0.000);
    form.get('expense_tax').setValue(this.defaultTax);

  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: "", status: false };
  }

  patchForm(data) {
    this.reduceBillForm.patchValue({
      type: data.type ? data.type.id : null,
      amount: data.amount,
      date: data.date,
      id: data.id,
      containers : data.containers,
      expense_amount: data.expense_amount,
      expense_party: data.party ? data.party?.id : null,
      expense_payment_mode: data.expense_payment_mode ? data.expense_payment_mode.id : null,
      expense_bill_no: data.expense_bill_no,
      expense_amount_before_tax: data?.expense_amount_before_tax,
      expense_tax: data?.expense_tax?.id,
      expense_status: data.expense_status,
      is_expense: data.is_expense,
      expense_bill_date:data.expense_bill_date,
      expense_type:data.expense_type,
      is_driver_paid:data.is_driver_paid,
      tax:data.tax?.id,
      employee : data?.employee_id?data?.employee_id:null,
      amount_before_tax:data.amount_before_tax,
      document_no:data?.document_no
    });
    if(data.documents?.length >0){
      let documents=this.reduceBillForm.get('documents').value;
      data.documents.forEach(element => {
      documents.push(element.id);
      this.uploadedDocs.push(element)
    });
    }
    this.initialDetails.employee={label :data?.employee_name,value:data?.employee_id};
    if (data.expense_payment_mode) this.initialDetails.advanceClientAccount = { label: data.expense_payment_mode.name, value: data.expense_payment_mode.id };
    if (data.party) this.initialDetails.vendor = { label: data.party.display_name, value: data.party.id };
    if (data.type) this.initialDetails.chargeType = { label: data.type.label, value: data.type.id };
    if (data.expense_tax) this.initialDetails.expenseTax = { label: data?.expense_tax.label, value: data?.expense_tax.id };
    if (data.tax) this.initialDetails.tax = { label: data.tax.label, value: data.tax.id };
    if (data.expense_status == 1) this.initialDetails.paymentStatus = { label: 'Unpaid', value: '1' };
    if (data.expense_status == 3) this.initialDetails.paymentStatus = { label: 'Paid', value: '3' };
    if (data.is_driver_paid) {
      this.initialDetails.advanceClientAccount = { label: 'Paid By Employee', value: '' };
      this.reduceBillForm.get('expense_payment_mode').setValue('paid_By_Driver')
      this.paymentmodeChanged()
    }
  }

  getTaxDetails() {
    this._taxModuleService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }

  getAssignedDriversList() {
    this._employeeService.getEmployeesListV2().subscribe((response) => {
      this.driverList = response['result'];
    });
  }

  onExpesneCalculationChange() {
    let form = this.reduceBillForm;
    this.taxOptions.forEach(tax => {
      if (form.get('expense_tax').value == tax.id) {
        let amountWithoutTax = Number(form.get('expense_amount_before_tax').value);
        let amountWithTax = (Number(tax.value / 100 * amountWithoutTax) + Number(amountWithoutTax)).toFixed(3);
        form.get('expense_amount').setValue(amountWithTax)
      }
    })
  }
  fileUploader(e){
    let documents=this.reduceBillForm.get('documents').value;
    e.forEach(element => {
      documents.push(element.id);
      element['presigned_url']=element['url']
      this.uploadedDocs.push(element)
    });
    this.emitData();
  }
  fileDeleted(id){
    this.uploadedDocs =  this.uploadedDocs.filter(doc=>doc.id !=id);
    let documents=this.reduceBillForm.get('documents').value;
    documents=documents.filter(doc=>doc.id !=id)
    this.emitData();
  }


  addNewAdditionalCharge(event) {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data: {
        data: this.vehicleCategory.toString(),
        isEdit: false,
        charge_name: event,
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
        let form = this.reduceBillForm
        form.get('type').setValue(item?.name?.id);
        let params = {
          vehicle_category: this.vehicleCategory
        }
        this._rateCardService.getCustomerAdditionalCharge(this.customerId, params).subscribe((response: any) => {
          this.expenseTypeList = response.result;
          this.chargeSelection();
        });
        this.initialDetails.chargeType = { label: item?.name?.name, value: '' };
      }
      dialogRefSub.unsubscribe();
    })
  }

  getAdditionalCharges() {
    let params = {
      vehicle_category: this.vehicleCategory
    }
    this._rateCardService.getCustomerAdditionalCharge(this.customerId, params).subscribe((response: any) => {
      this.expenseTypeList = response.result;
    });
  }

  getContainersOfJob(){
    this._newTripV2Service.getContainersListFromTheJob(this.tripId).subscribe((response)=>{
      this.containersList= response['result'];
    })
  }
}
