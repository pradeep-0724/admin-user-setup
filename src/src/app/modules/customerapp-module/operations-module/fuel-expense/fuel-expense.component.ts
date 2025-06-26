import { TaxService } from 'src/app/core/services/tax.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isValidValue, getObjectFromList, getMinOrMaxDate, getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { bankChargeRequired } from 'src/app/shared-module/utilities/payment-utils';
import { changeDateToServerFormat, PaymentDueDateCalculator } from 'src/app/shared-module/utilities/date-utilis';

import { OperationsActivityService } from '../../api-services/operation-module-service/operations-activity.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { PartyType, ValidationConstants, VendorType } from 'src/app/core/constants/constant';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ErrorList } from 'src/app/core/constants/error-list';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { BehaviorSubject } from 'rxjs';
import { TripService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/trip-services/trip.service';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { FuelClass } from './fuel-class/fuel.class';
import { FuelClassService } from './fuel-class/fuel.service';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import moment from 'moment';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { getEmployeeObject } from '../../master-module/employee-module/employee-utils';
import { Dialog } from '@angular/cdk/dialog';
import { AddAdditionalChargePopupComponent } from '../../master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { cloneDeep } from 'lodash';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-edit-fuel-expense',
  templateUrl: './fuel-expense.component.html',
  styleUrls: ['./fuel-expense.component.scss'],
 
})
export class FuelExpenseComponent extends FuelClass implements OnInit, OnDestroy {
  terminology: any;
  addFuelForm: UntypedFormGroup;
  expenseItemDropdownIndex: number = -1;
  presentPositionTyres: any = [];
  employeeList: any = [];
  vehicleList: any = [];
  staticOptions: any = {};
  vendorList: any = [];
  accountList: any = [];
  bankingChargeRequired: Boolean = false;
  vendorSelected: any = {};
  selectedPaymentTerm: any;
  BillDate: any;
  materialList: any = [];
  serviceList: any = [];
  current_date: Date = new Date(dateWithTimeZone());
  paymentAccountList: any = [];
  initialValues: any = {
    vendor: getBlankOption(),
    paymentTerm: getBlankOption(),
    units: [getBlankOption()],
    vehicle: [getBlankOption()],
    serviceType: [getBlankOption()],
    expenseAccount: [getBlankOption()],
    items: [getBlankOption()],
    material: getBlankOption(),
    employee: getBlankOption(),
    adjustmentChoice: getBlankOption(),
    discountType: getBlankOption(),
    adjustmentAccount: getBlankOption(),
    tax: [getNonTaxableOption()],
    tripTax: [getNonTaxableOption()],
    fuelTax: [getNonTaxableOption()],
    umpaidFuelChallanTax: [getNonTaxableOption()],
    mainTaxSelection: getNonTaxableOption()
  };
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  itemDropdownPostApi = TSAPIRoutes.operation + TSAPIRoutes.expense;
  serviceTypePostApi = TSAPIRoutes.operation + TSAPIRoutes.service_type;
  mechanicExpensesItemParams: any = {};
  serviceTypeParams: any = {};
  vendorId:string;
  minDate: Date;
  i;
  currency_type;
  documentPatchData: any = [];
  isDueDateRequired = false;
  gstin = '';
  apiError: string;
  partyList: any = [];
  treatmentList: any = [];
  paymentTermList: any = [];
  partyId: string
  selectedParty: any;
  saveButton: boolean = false;
  unpaidChallanList: any = [];
  challanMessage: string = '';
  totals: any = {
    subtotal_challan: 0.0,
    subtotal_others: 0.0,
    subtotal: 0.0,
    discountAfterTaxTotal: 0,
    tdsAmount: 0,
    adjustmentAmount: 0,
    discountTotal: 0,
    advance_amount: 0.0,
    adjustment: 0.0,
    total: 0.0,
    tax: [],
    taxTotal: 0.0,
    taxes: [],
    balance: 0.0,
  };
  isDomReady: Boolean = false;
  inv_date: any;
  fuelActivityId: any;
  materialApiCall: string = TSAPIRoutes.get_and_post_material;
  materialParams = {};
  hsn_code = new ValidationConstants().HSN_CODE;
  alphaNumericPattern = new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  additionalDetails: any;
  showAddItemPopup: boolean = false;
  mechanicActivityData: any;
  companyRegistered: boolean = true;
  afterTaxAdjustmentAccount = new ValidationConstants().defaultAdjustmentAccountOption
  expenseAccountList: any = [];
  otherExpenseValidatorSub: Subscription;
  vehicleExpenseValidatorSub: Subscription;
  adjustmentValidatorSub: Subscription;
  discountAfterTaxSub: Subscription;
  discountSub: Subscription;
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;
  isAdd: boolean = false;
  isTPEmpty: boolean = false;
  patchFileUrls = new BehaviorSubject([]);
  vendorDetails;
  inlineAdd: boolean = true;
  showAddCoaPopup: any = { name: '', status: false };
  coaParams: any = {
    name: '',
  };
  coaDropdownIndex: number = -1;
  partyDetailsData = {
    isPartyRegistered: true,
    taxDeatils: {},
    placeOfSupply: [],
    companyRegistered: true
  };
  isTransactionIncludesTax = false;
  isTransactionUnderReverse = false;
  lastSectiondata = {
    data: []
  }
  partyTaxDetails = new BehaviorSubject<any>(this.partyDetailsData);
  lastSectionTaxDetails = new BehaviorSubject<any>(this.lastSectiondata);
  isTax = false;
  placeOfSupply = [];
  taxOptions = [];
  tdsOptions = [];
  editData = new BehaviorSubject<any>({});
  lastSectionEditData = new BehaviorSubject<any>({});
  taxFormValid = new BehaviorSubject<any>(true);
  disableTax: boolean = false;
  defaultTax = new ValidationConstants().defaultTax;
  taxDetails;
  prefixUrl: string;
  unpaidChallanModelInline: Boolean = true;
  isTdsDecleration = false;
  policyNumber = new ValidationConstants().VALIDATION_PATTERN.POLICY_NUMBER;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  doChallanExists: boolean = false;
  doUnpaidChallanExists: boolean = false;
  isTds = false;
  isPaymentstatusValid = true;
  $paymentStatusValid = new BehaviorSubject(true);
  selectedTax = getNonTaxableOption();
  selectedTaxId = this.defaultTax;
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/oQEi6SRW8DvJj8ZAOKaf?embed%22"
  }
  paymentTermCustom=new ValidationConstants().paymentTermCustom;


  constructor(
    private _terminologiesService: TerminologiesService,
    private _fb: UntypedFormBuilder,
    private _commonService: CommonService,
    private _partyService: PartyService,
    private _operationsActivityService: OperationsActivityService,
    private _revenueService: RevenueService,
    private _route: Router,
    private _activateRoute: ActivatedRoute,
    private currency: CurrencyService,
    private _tripService: TripService,
    private _taxService: TaxModuleServiceService,
    private _tax: TaxService,
    private _fuelClassService: FuelClassService,
    private _prefixUrl: PrefixUrlService,
    private _analytics: AnalyticsService,
    private _scrollToTop:ScrollToTop,
    private dialog : Dialog,
    private apiHandler:ApiHandlerService

  ) {
    super();
    this.isTax = this._tax.getTax();
    this.isTds = this._tax.getVat();
    this.getTaxDetails();
    this.terminology = this._terminologiesService.terminologie;
  }

  ngOnDestroy() {
    this.otherExpenseValidatorSub.unsubscribe();
    this.adjustmentValidatorSub.unsubscribe();
    this.discountSub.unsubscribe();
    this.vehicleExpenseValidatorSub.unsubscribe();
    let removeLoader = document.getElementsByTagName("body")[0];
    removeLoader.classList.remove("removeLoader");
  }


  ngOnInit() {    
    this.isAdd = true;
    setTimeout(() => {
      this.prefixUrl = this._prefixUrl.getprefixUrl();
      this.currency_type = this.currency.getCurrency();
    }, 1000);
    this.buildForm();
    this.addFuelForm.controls['bill_date'].setValue(new Date(dateWithTimeZone()));
    this.minDate=new Date(dateWithTimeZone())
    this.addFuelForm.controls['reminder'].setValue(new Date(dateWithTimeZone()))
    this._activateRoute.params.subscribe((response: any) => {
      this.fuelActivityId = response.id;
      this.unpaidChallanModelInline = this.fuelActivityId ? true : false;
      this.addFuelForm.controls['id'].setValue(this.fuelActivityId);

      this._fuelClassService.getEmployeeList(employeeList => {
        if (employeeList && employeeList.length > 0) {
          this.employeeList = employeeList;
        }
      })

      this._fuelClassService.getVehicleList(vehicleList => {
        if (vehicleList && vehicleList.length > 0) {
          this.vehicleList = vehicleList;
        }
      })

      this._fuelClassService.getAccountsList(accountList => {
        if (accountList && accountList.length > 0) {
          this.accountList = accountList;
        }
      })

      this._fuelClassService.getPaymentAccountsList(paymentAccountList => {
        if (paymentAccountList && paymentAccountList.length > 0) {
          this.paymentAccountList = paymentAccountList;
        }
      })

      this._commonService
        .getStaticOptions(
          'billing-payment-method,gst-treatment,payment-term,tax,tds,item-unit'
        )
        .subscribe((response) => {
          this.staticOptions.paymentMethods = response.result['billing-payment-method'];
          this.staticOptions.paymentTermList = response.result['payment-term'];
          this.initialValues.paymentTerm=cloneDeep(this.staticOptions.paymentTermList[0]);
          this.addFuelForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0].id)
          this.onpaymentTermSelected(this.staticOptions.paymentTermList[0].id)
          this.staticOptions.itemUnits = response.result['item-unit'];
        });


      this.getVendorDetails()
      this.getServiceList();
      this.getExpenseAccountsAndSetAccount();
      this._commonService
        .getStaticOptions('gst-treatment,tax,item-unit,payment-term')
        .subscribe((response) => {
          this.paymentTermList = response.result['payment-term'];
          this.staticOptions.itemUnits = response.result['item-unit'];
        });


      this._revenueService.getExpense().subscribe((response) => {
        if (response !== undefined) {
          this.staticOptions.materialList = response.result;
        }
      });

      if (!this.fuelActivityId) {
        this.addMoreOtherItem();
        this.addMoreVehicleDetails();
      }

    });
  }
  handleEmployeeChange(){
    let empId=this.addFuelForm.get('employee').value;
    let empObj=getEmployeeObject(this.employeeList,empId);
    this.initialValues.employee={label:empObj?.display_name,value:empId}

  }



  openGothrough(){
    this.goThroughDetais.show=true;
}

  ngAfterViewInit() {
    if (this.fuelActivityId) {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.FUELBILL, this.screenType.EDIT, "Navigated");
      setTimeout(() => {
        this.isAdd = false;
        this.getFormValues();
        this.isDomReady = true;
      }, 1);
    } else {
      this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.FUELBILL, this.screenType.ADD, "Navigated");
    }
  }

  onWorkEndDateChange() {
		let item = this.staticOptions.paymentTermList.filter((item: any) => item.label == 'Custom')[0]		
		this.initialValues.paymentTerm = { label: item.label, value: item.id };
		this.addFuelForm.get('payment_term').setValue(item.id)
	} 

  getExpenseAccountsAndSetAccount() {

    this._fuelClassService.getExpenseAccountsAndSetAccountList(expenseAccountList => {
      if (expenseAccountList && expenseAccountList.length > 0) {
        this.expenseAccountList = expenseAccountList;
        this.initialValues.adjustmentAccount = this.afterTaxAdjustmentAccount;
        this.addFuelForm.get('adjustment_account').setValue(this.afterTaxAdjustmentAccount.value);
      }
    })
  }

  checkUnpaidChallanExist(value) {
    this.doUnpaidChallanExists = value
  }

  getFormValues() {
    this._operationsActivityService.getFuelExpenseData(this.fuelActivityId).subscribe((data: any) => {
      this.taxDetails = data.result;
      this.mechanicActivityData = data.result;
      this.vendorId = this.mechanicActivityData.vendor?.id;
      this._revenueService.sendPartyIntime(this.vendorId);
      this.minDate=getMinOrMaxDate(data.result.bill_date)
      if(this.vendorId){
        this._partyService.getPartyAdressDetails(this.vendorId).subscribe(
          res => {
            this.vendorSelected = res.result;
          });
      }
      this.initialValues.employee['label'] = isValidValue(this.mechanicActivityData.employee) ? this.mechanicActivityData.employee.name : '';
      this.mechanicActivityData.employee = isValidValue(this.mechanicActivityData.employee) ? this.mechanicActivityData.employee.id : null;
      this.initialValues.paymentTerm['label'] = isValidValue(this.mechanicActivityData.payment_term) ? this.mechanicActivityData.payment_term.label : '';
      this.mechanicActivityData.payment_term = isValidValue(this.mechanicActivityData.payment_term) ? this.mechanicActivityData.payment_term.id : null;
      this.initialValues.adjustmentChoice['label'] = isValidValue(this.mechanicActivityData.adjustment_choice) ? this.mechanicActivityData.adjustment_choice.label : '';
      this.mechanicActivityData.adjustment_choice = isValidValue(this.mechanicActivityData.adjustment_choice) ? this.mechanicActivityData.adjustment_choice.index : null;
      this.initialValues.discountType['label'] = isValidValue(this.mechanicActivityData.discount_type) ? this.mechanicActivityData.discount_type.label : '';
      this.mechanicActivityData.discount_type = isValidValue(this.mechanicActivityData.discount_type) ? this.mechanicActivityData.discount_type.index : null;
      this.initialValues.adjustmentAccount['value'] = isValidValue(this.mechanicActivityData.adjustment_account) ? this.mechanicActivityData.adjustment_account.id : this.afterTaxAdjustmentAccount.value;
      this.initialValues.adjustmentAccount['label'] = isValidValue(this.mechanicActivityData.adjustment_account) ? this.mechanicActivityData.adjustment_account.name : this.afterTaxAdjustmentAccount.label;
      this.mechanicActivityData.adjustment_account = isValidValue(this.mechanicActivityData.adjustment_account) ? this.mechanicActivityData.adjustment_account.id : this.afterTaxAdjustmentAccount.value;
      this.initialValues.mainTaxSelection = { label: this.mechanicActivityData.tax.label, value: this.mechanicActivityData.tax.id };
      this.mechanicActivityData.tax = isValidValue(this.mechanicActivityData.tax) ? this.mechanicActivityData.tax.id : this.defaultTax;

      const unpaid_fuel_details = this.addFuelForm.controls['unpaid_fuel_details'] as UntypedFormArray;
      unpaid_fuel_details.controls = [];
      this.unpaidChallanList = [];
      if (data.result.unpaid_fuel_details.length > 0) {
        this.unpaidChallanModelInline = true;
        data.result.unpaid_fuel_details.forEach((challan) => {
          challan['id'] = challan.unpaid_fuel_challan;
        });
        this.buildUnpaidChallans(data.result.unpaid_fuel_details);
        this.mechanicActivityData.unpaid_fuel_details.forEach((unpaidFuel, index) => {
          let tax = new Object();
          if (unpaidFuel.tax) {
            tax = {
              label: unpaidFuel.tax.label,
              value: unpaidFuel.tax.id
            }
          } else {
            tax = getNonTaxableOption();
          }
          if (unpaidFuel.tax) {
            this.initialValues.umpaidFuelChallanTax[index] = tax;
            unpaidFuel.tax = isValidValue(unpaidFuel.tax) ? unpaidFuel.tax.id : this.defaultTax;
          }
        })
      } else {
        this.unpaidChallanModelInline = false;
      }

      if (this.mechanicActivityData.vehicle_details.length > 0) {
        this.buildVehicleDetailsItems(this.mechanicActivityData.vehicle_details);
        this.mechanicActivityData.vehicle_details.forEach((vehicleFuel, index) => {

          let vehicleNo = new Object();
          let tax = new Object();
          vehicleNo = {
            label: vehicleFuel.vehicle ? vehicleFuel.vehicle.reg_number : '',
            value: vehicleFuel.vehicle ? vehicleFuel.vehicle.id : null
          }
          if (vehicleFuel.tax) {
            tax = {
              label: vehicleFuel.tax.label,
              value: vehicleFuel.tax.id
            }
          } else {
            tax = getNonTaxableOption();
          }

          if (vehicleFuel.vehicle) {
            this.initialValues.vehicle[index] = vehicleNo;
            vehicleFuel.vehicle = isValidValue(vehicleFuel.vehicle) ? vehicleFuel.vehicle.id : null;
          }
          if (vehicleFuel.tax) {
            this.initialValues.fuelTax[index] = tax;
            vehicleFuel.tax = isValidValue(vehicleFuel.tax) ? vehicleFuel.tax.id : this.defaultTax;
          }


        });
      } else {
        this.addMoreVehicleDetails();
      }
      if (isValidValue(this.mechanicActivityData['discount_after_tax_type'])) {
        this.mechanicActivityData['discount_after_tax_type'] = this.mechanicActivityData['discount_after_tax_type']['index']
      }
      this.addFuelForm.patchValue(this.mechanicActivityData);
      if (isValidValue(this.mechanicActivityData['vendor'])) {
        this.initialValues.vendor['label'] = isValidValue(this.mechanicActivityData.vendor) ? this.mechanicActivityData.vendor.display_name : '';
        this.addFuelForm.controls['vendor'].setValue(this.mechanicActivityData.vendor.id);
      }
      if (this.isTax) {
        this.onVendorId()
        this.lastSectionEditData.next({
          patchData: this.taxDetails,
          lastSectionData: this.lastSectiondata.data
        })
      }

      if (!this.isTax) {
        this.patchOtherItems();
      }
      this.addFuelForm.controls['due_date'].setValue(this.mechanicActivityData.due_date);
      this.initialValues.material.label = this.mechanicActivityData.material ? this.mechanicActivityData.material : '';
      if (this.mechanicActivityData.transaction_date) {
        this.addFuelForm.controls['transaction_date'].setValue(this.mechanicActivityData.transaction_date);
      }
      this.patchDocuments(this.mechanicActivityData);
      setTimeout(() => {
        this.calculationsChanged();

      }, 1500);
    });
  }

  fileUploader(filesUploaded) {
    let documents = this.addFuelForm.get('documents').value;
    filesUploaded.forEach((element) => {
      documents.push(element.id);
    });
  }
  fileDeleted(deletedFileIndex) {
    let documents = this.addFuelForm.get('documents').value;
    documents.splice(deletedFileIndex, 1);
  }

  clearAllVehicleDetails() {
    const vehicleDetailsItems = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    this.emptyVehicleDetailsItems();
    vehicleDetailsItems.reset();
    vehicleDetailsItems.controls = [];
    this.addMoreVehicleDetails();
    this.calculationsChanged();
  }

  emptyVehicleDetailsItems() {
    this.initialValues.vehicle = [];
  }

  patchDocuments(data) {
    if (data.documents.length > 0) {
      let documentsArray = this.addFuelForm.get('documents') as UntypedFormControl;
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

  /* For  Opening the Party Modal */
  openAddPartyModal($event) {
    if ($event)
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
  }

  /* Adding the entered value to the list */
  addValueToPartyPopup(event) {
    if (event) {
      this.partyNamePopup = event;
    }
  }

  /* For Displaying the party name in the subfield  */
  addPartyToOption($event) {
    if ($event.status) {
      this.getVendorDetails();
      this.initialValues.vendor = { value: $event.id, label: $event.label };
      this.addFuelForm.get('vendor').setValue($event.id);
      this.onVendorSelected($event.id);
    }
  }

  /* To get all the Vendor Details */

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  /* After closing the party modal to clear all the values */
  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  buildForm() {
    this.addFuelForm = this._fb.group({
      id: [''],
      bill_date: [
        null, Validators.required
      ],
      bill_number: [
        '', [Validators.required, Validators.pattern(this.policyNumber)]
      ],
      material: [''],
      vendor: [
        null, Validators.required
      ],
      place_of_supply: [''],
      employee: [
        null
      ],
      payment_term: [
        null
      ],
      due_date: [
        moment().format('YYYY-MM-DD')
      ],
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
      is_transaction_includes_tax: [
        false
      ],
      is_transaction_under_reverse: [
        false
      ],
      discount_after_tax_type: [
        0
      ],
      discount_after_tax: [
        0
      ],
      tds_type: [
        null
      ],
      tds: [
        0.0, [Validators.min(0), Validators.max(100)]
      ],
      tds_amount: [
        0
      ],
      expense: this._fb.array([]),
      unpaid_fuel_details: this._fb.array([]),
      other_expense: this._fb.array([]),
      vehicle_details: this._fb.array([]),
      payment_status: [
        1
      ],
      amount_paid: [
        0
      ],
      paid_employee:[],
      payment_mode: [
        null
      ],
      transaction_date: [
        null
      ],
      bank_charges: [
        0
      ],
      reminder: [
        null
      ],
      comments: [
        ''
      ],
      documents: [
        []
      ],

      hsn_code: ['', [Validators.pattern(this.alphaNumericPattern)]],
      tax: [this.defaultTax],
      optional_comments: [
        ''
      ],
      terms_and_condition: [
        ''
      ],
      other_expenses: this._fb.array([]),
    });
    this.setFormValidators();
    this.calculationsChanged();
    return this.addFuelForm;
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
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
        let other_expense = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
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


  onVendorSelected(e) {
    if (e === '') {
      this.vendorSelected = null;
      this.vendorId = null;
      return;
    }
    if (isValidValue(e)) {
      this.vendorId = e;
      this.resetChallanFormArray();
      this.clearAllOtherItems();
      this.unpaidChallanModelInline = false;
      this._revenueService.sendPartyIntime(this.vendorId);
      this._partyService.getPartyAdressDetails(e).subscribe(
        res => {
          this.vendorSelected = res.result;
          this.gstin = this.vendorSelected.tax_details.gstin;
          this.isTdsDecleration = res.result.tax_details.tds_declaration;
          if (this.gstin == 'Unregistered') {
            this.partyDetailsData = {
              isPartyRegistered: false,
              taxDeatils: this.vendorSelected.tax_details,
              placeOfSupply: this.placeOfSupply,
              companyRegistered: this.companyRegistered
            }
            this.partyTaxDetails.next(this.partyDetailsData)
          } else {
            this.partyDetailsData = {
              isPartyRegistered: true,
              taxDeatils: this.vendorSelected.tax_details,
              placeOfSupply: this.placeOfSupply,
              companyRegistered: this.companyRegistered
            }
            this.partyTaxDetails.next(this.partyDetailsData)
          }
          this.initialValues.paymentTerm = getBlankOption()
          this.addFuelForm.controls['payment_term'].setValue('');
          this.addFuelForm.controls['due_date'].setValue(null);
          if (this.vendorSelected.terms?.id) {
            this.onpaymentTermSelected(this.vendorSelected.terms ? this.vendorSelected.terms.id : null);
            this.initialValues.paymentTerm = {
              label: this.vendorSelected.terms && this.vendorSelected.terms.label ? this.vendorSelected.terms.label : '',
              value: this.vendorSelected.terms ? this.vendorSelected.terms.id : ''
            }
            this.addFuelForm.controls['payment_term'].setValue(
              this.vendorSelected.terms.id);
          }
          else{
            this.addFuelForm.get('due_date').setValue(moment().format('YYYY-MM-DD'))
            this.initialValues.paymentTerm=cloneDeep(this.staticOptions.paymentTermList[0]);
            this.addFuelForm.get('payment_term').setValue(this.staticOptions.paymentTermList[0].id)
          }
        });
    }
    else {
      this.vendorSelected = null;
    }
  }
  onpaymentTermSelected(termId) {
    if (termId) {
      this.selectedPaymentTerm = getObjectFromList(termId, this.staticOptions.paymentTermList);
      this.BillDate = this.addFuelForm.controls['bill_date'].value;
      if(termId==this.paymentTermCustom){
        this.addFuelForm.controls['due_date'].setValue(
          PaymentDueDateCalculator(this.BillDate, this.vendorSelected['terms_days'] ));
      }else{
        this.addFuelForm.controls['due_date'].setValue(
          PaymentDueDateCalculator(this.BillDate, this.selectedPaymentTerm ? this.selectedPaymentTerm.value : null));
      }
     
    }

    if (termId) {
      this.addFuelForm.controls['due_date'].setValidators([Validators.required]);
      this.addFuelForm.controls['due_date'].updateValueAndValidity();
      this.isDueDateRequired = true;
    } else {
      this.isDueDateRequired = false;
      this.addFuelForm.controls['due_date'].setValidators(null);
      this.addFuelForm.controls['due_date'].updateValueAndValidity();
    }

  }

  onCalendarChangePTerm(billDate) {
    if (billDate) {
      if (this.addFuelForm.controls['payment_status'].value != 1) {
        this.addFuelForm.controls['transaction_date'].patchValue(billDate);
      }
      this.addFuelForm.controls['due_date'].patchValue(null);
      this.minDate = getMinOrMaxDate(billDate);

    }
    let existingTerm = this.addFuelForm.controls['payment_term'].value;
    if (existingTerm)
      this.onpaymentTermSelected(existingTerm);
  }



  onPaymentModeSelected() {
    let bank = this.addFuelForm.controls['payment_mode'].value
    this.bankingChargeRequired = bankChargeRequired(bank, this.addFuelForm.get('bank_charges'), this.paymentAccountList);
  }



  toggleItemOtherFilled(enable: Boolean = false) {
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    otherItems.controls.forEach(ele => {
      if (enable) {
        ele.enable();
      } else {
        if (Number(ele.value.total) == 0 && !Number(ele.value.unit_cost) && !ele.value.item && !Number(ele.value.expense_account) && !Number(ele.value.quantity) && !ele.value.unit) {
          ele.disable();
        }
      }
    });
    const unpaidFuelDetails = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    unpaidFuelDetails.controls.forEach(ele => {
      if (enable) {
        ele.enable();
      } else {
        if (Number(ele.value.total) == 0 && !Number(ele.value.unit_cost) && !ele.value.vehicle && !Number(ele.value.quantity)) {
          ele.disable();
        }
      }
    });


  }

  populateFuelRate(index) {
    const fuelArray = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    let fuelDate = this.addFuelForm.get('bill_date').value;
    if (fuelDate) {
      let params = {
        date: changeDateToServerFormat(fuelDate)
      }

      this._tripService.getFuelPrice(params).subscribe((res) => {
        fuelArray.at(index).get('unit_cost').setValue(res.result.fuel_rate);
        this.calculateVehicleDetailsAmount(index);
      })
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

  saveExpense() {
    this.toggleItemOtherFilled();
    let form = this.addFuelForm;
    this.$paymentStatusValid.next(this.isPaymentstatusValid);
    this.apiError = '';
    if (Number(this.totals.total) <= 0) {
      this.apiError = 'Please check detail, Total amount should be greater than zero'
      form.setErrors({ 'invalid': true });
      this._scrollToTop.scrollToTop();
      window.scrollTo(0, 0);
    }
    if (Number(this.totals.subtotal_challan) + Number(this.totals.subtotal_others) <= 0) {
      this.apiError = 'Please check either fuel purchase or item others should be greater than zero';
      form.setErrors({ 'invalid': true });
      this._scrollToTop.scrollToTop();
      window.scrollTo(0, 0);
    }
    if (form.valid&& this.isPaymentstatusValid) {
      this.apiError = '';
      this.addFuelForm.controls['payment_mode'].enable();
      if (this.fuelActivityId) {
        this.apiHandler.handleRequest(this._operationsActivityService.editFuelExpense(this.fuelActivityId, this.prepareRequest(form)),'Fuel Bill updated successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.FUELBILL)
          this._route.navigate([this.prefixUrl + '/expense/fuel_expense/list'] ,  { queryParams: { pdfViewId:this.fuelActivityId } });
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
      else {
        this.apiHandler.handleRequest(this._operationsActivityService.saveFuelExpenses(this.prepareRequest(form)),'Fuel Bill added successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.FUELBILL)
          this._route.navigateByUrl(this.prefixUrl + '/expense/fuel_expense/list');
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
      this.taxFormValid.next(form.valid);
    }
    this.toggleItemOtherFilled(true);
  }

  prepareRequest(form: UntypedFormGroup) {
    form.patchValue({
      bill_date: changeDateToServerFormat(form.controls['bill_date'].value),
      transaction_date: changeDateToServerFormat(form.controls['transaction_date'].value),
      reminder: changeDateToServerFormat(form.controls['reminder'].value),
      due_date: changeDateToServerFormat(form.controls['due_date'].value)
    });

    const vehicle_details = this.addFuelForm.get('vehicle_details') as UntypedFormArray;
    vehicle_details.controls.forEach((expense) => {
      expense.get('date').setValue(changeDateToServerFormat(expense.get('date').value));
    });
    const unpaid_fuel_details = this.addFuelForm.get('unpaid_fuel_details') as UntypedFormArray;
    unpaid_fuel_details.controls.forEach((expense) => {
      expense.get('date').setValue(changeDateToServerFormat(expense.get('date').value));
      expense.get('vehicle').setValue(expense.get('vehicle').value.id);
    });
    form.value['other_expense_before_tax'] = this.totals.subtotal_others;
    form.value['total'] = this.totals.total;
    form.value['subtotal_expense'] = this.totals.subtotal_challan;
    form.value['other_expense_before_tax'] = this.totals.subtotal_others;
    return form.value;
  }

  getServiceList() {
    this._revenueService.getServiceList().subscribe((response) => {
      if (response !== undefined) {
        this.serviceList = response.result;
      }
    });
  }

  buildOtherItems(items: any = []) {
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    items.forEach((i, item) => {
      otherItems.push(this.addOtherItem(i));
    });
  }

  buildVehicleDetailsItems(items: any = []) {
    this.initialValues.fuelTax = [];
    const otherItems = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    items.forEach((i, item) => {
      otherItems.push(this.addVehicleDetails(i));
      this.initialValues.fuelTax.push(this.selectedTax);
    });
  }

  onMaterialSelected(itemExpenseControl: UntypedFormGroup, index: number) {
    this.resetOtherExpenseExceptItem(itemExpenseControl, index);
    this.onChangeOtherExpenseItem(index);
  }

  addOtherItem(item) {
    const form = this._fb.group({
      id: [
        item.id || ''
      ],
      expense_account: [item.expense_account || null],
      item: [
        item.item || null
      ],
      quantity: [
        item.quantity || 0
      ],
      unit: [
        item.unit || null
      ],
      total_before_tax: [item.total_before_tax || 0],
      unit_cost: [
        item.unit_cost || 0
      ],
      tax: [item.tax || this.defaultTax],
      total: [
        item.total || 0
      ]
    });
    return form;
  }

  resetOtherItem(formGroup: UntypedFormGroup, index) {
    const singleUse = this.addOtherItem({});
    formGroup.patchValue(singleUse.value);
    this.initialValues.expenseAccount[index] = getBlankOption();
    this.initialValues.units[index] = getBlankOption();
    this.initialValues.items[index] = getBlankOption();
    this.calculationsChanged();
  }

  removeOtherItem(index) {
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    this.initialValues.units.splice(index, 1);
    this.initialValues.items.splice(index, 1);
    this.initialValues.expenseAccount.splice(index, 1);
    this.initialValues.tax.splice(index, 1);
    otherItems.removeAt(index);
    this.calculationsChanged();
  }

  addMoreOtherItem() {
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    this.initialValues.units.push(getBlankOption());
    this.initialValues.items.push(getBlankOption());
    this.initialValues.expenseAccount.push(getBlankOption());
    this.initialValues.tax.push(getNonTaxableOption());
    otherItems.push(this.addOtherItem({}));
  }

  resetOtherExpenseExceptItem(formGroup: UntypedFormGroup, index) {
    formGroup.patchValue({ unit: null, unit_cost: 0, total: 0, quantity: 0, total_before_tax: 0, expense_account: null });
    this.initialValues.units[index] = getBlankOption();
    this.initialValues.expenseAccount[index] = getBlankOption();
    this.initialValues.tax[index] = getNonTaxableOption();
  }

  addMoreVehicleDetails() {
    const vehicleDetails = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    this.initialValues.vehicle.push(getBlankOption());
    vehicleDetails.push(this.addVehicleDetails({}));
    this.initialValues.fuelTax.push(this.selectedTax);
  }

  setDefaultDateToDateField(){

  }

  removeVehicleDetail(index) {
    const vehicleDetails = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    this.initialValues.vehicle.splice(index, 1);
    this.initialValues.fuelTax.splice(index, 1);
    vehicleDetails.removeAt(index);
    this.calculationsChanged();
  }

  resetVehicleDetail(formGroup: UntypedFormGroup, index) {
    const singleUse = this.addVehicleDetails({});
    formGroup.patchValue(singleUse.value);
    this.initialValues.vehicle[index] = getBlankOption();
    this.initialValues.fuelTax[index] = this.selectedTax;
    this.calculationsChanged();
  }

  addDefaultDateToNewRow(formGroup: UntypedFormGroup, index){
    const vehicleDetails = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    vehicleDetails.controls[index].get('date').setValue(new Date());
  }

  addVehicleDetails(item) {
    const form = this._fb.group({
      vehicle: [
        null
      ],
      quantity: [
        item.quantity || 0.000
      ],
      unit_cost: [item.unit_cost || 0.00
      ],
      total: [
        item.total || 0.00
      ],
      total_before_tax: [item.total_before_tax || 0.00],
      tax: [item.tax || this.selectedTaxId],
      document_no: [
        item.document_no || ''
      ],
      date: [
        item.data || null
      ]
    });
    return form;
  }


  resetChallanFormArray() {
    const unpaidChallans = this.addFuelForm.controls['unpaid_fuel_details'] as UntypedFormArray;
    unpaidChallans.controls = [];
    unpaidChallans.setValue([]);
    this.unpaidChallanList = [];
  }
  stopLoaderClasstoBody() {
    let removeLoader = document.getElementsByTagName("body")[0];
    removeLoader.classList.add("removeLoader");
  }
  
  clearAllOtherItems() {
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    this.emptyOtherItems();
    otherItems.reset();
    otherItems.controls = [];
    this.addMoreOtherItem();
    this.calculationsChanged();
  }

  emptyOtherItems() {
    this.initialValues.units = [];
    this.initialValues.expenseAccount = [];
    this.initialValues.item = [];
    this.initialValues.tax = [];
  }

  challansAdvanceAmount(ele) {
    this.totals.advance_amount = ele;
  }

  changeKeyNames(form, oldKey, newKey) {
    if (oldKey === newKey) {
      return;
    }
    if (form.hasOwnProperty(oldKey)) {
      oldKey = newKey;
      return form;
    }
  }
 

  onChangeOtherExpenseItem(index) {
    const otherExpenses = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
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

        if (expenseItem.tax) {
					otherExpense.get('tax').setValue(expenseItem.tax.id);
					this.initialValues.tax[index] = { label: expenseItem.tax.label, value: expenseItem.tax.id }
				}

        if (expenseItem.unit) {
          otherExpense.get('unit').setValue(expenseItem.unit.id);
          this.initialValues.units[index] = { label: expenseItem.unit.label, value: expenseItem.unit.id }
        }
        else {
          otherExpense.get('unit').setValue(null);
          this.initialValues.units[index] = getBlankOption();
        }

        otherExpense.get('unit_cost').setValue(expenseItem.rate_per_unit);
      }
    }
    this.calculationsChanged();
  }


  setFormValidators() {
    const item_other = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    this.otherExpenseValidatorSub = item_other.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
      items.forEach((key, index) => {
        const item = item_other.at(index).get('item');
        const unit_cost = item_other.at(index).get('unit_cost');
        const unit = item_other.at(index).get('unit');
        const quantity = item_other.at(index).get('quantity');
        const expense_account = item_other.at(index).get('expense_account');

        item.setValidators(Validators.required);
        unit.setValidators(Validators.required);
        unit_cost.setValidators(Validators.min(0.01));
        quantity.setValidators(Validators.min(0.01));
        expense_account.setValidators(Validators.required);
        if (items.length == 1) {
          if (!Number(unit_cost.value) && !item.value && !Number(expense_account.value) && !Number(quantity.value) && !unit.value) {
            item.clearValidators();
            expense_account.clearValidators();
            unit.clearValidators();
            unit_cost.clearValidators();
            quantity.clearValidators();
          }
        }
        item.updateValueAndValidity({ emitEvent: true });
        expense_account.updateValueAndValidity({ emitEvent: true });
        unit.updateValueAndValidity({ emitEvent: true });
        unit_cost.updateValueAndValidity({ emitEvent: true });
        quantity.updateValueAndValidity({ emitEvent: true });
      });
    });

    const vehicle_details = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    this.vehicleExpenseValidatorSub = vehicle_details.valueChanges.pipe(debounceTime(500)).subscribe((items) => {
      items.forEach((key, index) => {
        const unit_cost = vehicle_details.at(index).get('unit_cost');
        const vehicle = vehicle_details.at(index).get('vehicle');
        const quantity = vehicle_details.at(index).get('quantity');
        vehicle.setValidators(Validators.required);
        unit_cost.setValidators(Validators.min(0.01));
        quantity.setValidators(Validators.min(0.01));
        if (items.length == 1) {
          if (!Number(unit_cost.value) && !vehicle.value && !Number(quantity.value)) {
            vehicle.clearValidators();
            unit_cost.clearValidators();
            quantity.clearValidators();
          }
        }
        vehicle.updateValueAndValidity({ emitEvent: true });
        unit_cost.updateValueAndValidity({ emitEvent: true });
        quantity.updateValueAndValidity({ emitEvent: true });
      });
    });

    let adjustmentAmount = this.addFuelForm.get('adjustment');
    this.adjustmentValidatorSub = adjustmentAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

      const adjustmentAmount = this.addFuelForm.get('adjustment');
      const adjustmentChoice = this.addFuelForm.get('adjustment_choice');
      const adjustmentAfterSubtotal = this.totals.adjustmentAmount;
      const totalAmount = this.totals.total;
      let validators: any = [];

      if (adjustmentAfterSubtotal < 0 && totalAmount < 0) {
        validators.push(TransportValidator.createPositiveValidator(totalAmount))
      }

      if (adjustmentChoice.value == 0) {
        validators.push(Validators.max(100));
        validators.push(Validators.min(-100));
      }
      adjustmentAmount.setValidators(validators);
      adjustmentAmount.updateValueAndValidity({ emitEvent: true })

    });

    let discountBeforeAmount = this.addFuelForm.get('discount');
    this.discountSub = discountBeforeAmount.valueChanges.pipe(debounceTime(500)).subscribe((amount) => {

      const adjustmentAmount = this.addFuelForm.get('discount');
      const adjustmentChoice = this.addFuelForm.get('discount_type');
      let validators: any = [];

      if (adjustmentChoice.value == 0) {
        validators.push(Validators.max(100));
        validators.push(Validators.min(-100));
      }
      adjustmentAmount.setValidators(validators);
      adjustmentAmount.updateValueAndValidity({ emitEvent: true })
    });
  }

  headerTaxDetails(data) {
    if (this.isTax) {
      this.isTransactionIncludesTax = this.addFuelForm.get('is_transaction_includes_tax').value
      this.isTransactionUnderReverse =this.addFuelForm.get('is_transaction_under_reverse').value
      if (this.companyRegistered || this.isTransactionUnderReverse) {
        this.disableTax = false;
      }
      if (!this.partyDetailsData.isPartyRegistered && !this.isTransactionUnderReverse) {
        this.setAllTaxAsNonTaxable();
        this.disableTax = true;
      }
      this.calculationsChanged();
    }
  }

  getTaxDetails() {
    this._taxService.getTaxDetails().subscribe(result => {
      this.placeOfSupply = result.result['pos'];
      this.taxOptions = result.result['tax'];
      this.totals.taxes = result.result['tax'];
      this.tdsOptions = result.result['tds'];
      this.lastSectiondata.data = this.tdsOptions;
      this.lastSectionTaxDetails.next(this.lastSectiondata)
      this.companyRegistered = result.result['registration_status'];
    })
  }

  setAllTaxAsNonTaxable() {
    this.initialValues.tax.fill(getNonTaxableOption());
    this.initialValues.mainTaxSelection = getNonTaxableOption();
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    otherItems.controls.forEach((controls) => {
      controls.get('tax').setValue(this.defaultTax);
    });
    this.initialValues.tripTax.fill(getNonTaxableOption());
    this.initialValues.fuelTax.fill(getNonTaxableOption());
    this.initialValues.umpaidFuelChallanTax.fill(getNonTaxableOption());
    const upiaidChallan = this.addFuelForm.get('unpaid_fuel_details') as UntypedFormArray;
    upiaidChallan.controls.forEach(element => {
      element.get('tax').setValue(this.defaultTax);
    });
    const fuelChallan = this.addFuelForm.get('vehicle_details') as UntypedFormArray;
    fuelChallan.controls.forEach(element => {
      element.get('tax').setValue(this.defaultTax);
    });
    this.addFuelForm.get('tax').setValue(this.defaultTax);
    this.addFuelForm.get('discount_after_tax').setValue(0);


  }

  lastSectionOutPut(data) {
    const form = this.addFuelForm;
    form.get('tds_type').setValue(data['tds_type']);
    form.get('tds').setValue(data['tds']);
    this.calculationsChanged();
  }

  onVendorId() {
    if (this.taxDetails['vendor'].tax_details['gstin'] == 'Unregistered') {
      this.partyDetailsData = {
        isPartyRegistered: false,
        taxDeatils: this.taxDetails['vendor'].tax_details,
        placeOfSupply: this.placeOfSupply,
        companyRegistered: this.companyRegistered
      }
      this.partyTaxDetails.next(this.partyDetailsData)
    } else {
      this.partyDetailsData = {
        isPartyRegistered: true,
        taxDeatils: this.taxDetails['vendor'].tax_details,
        placeOfSupply: this.placeOfSupply,
        companyRegistered: this.companyRegistered
      }
      this.partyTaxDetails.next(this.partyDetailsData)
    }
    this.gstin = this.taxDetails['vendor'].tax_details['gstin'];
    this.isTdsDecleration = this.taxDetails['vendor'].tax_details['tds_declaration'];
    this.editData.next(
      {
        patchData: this.taxDetails
      });
    this.patchOtherItems();
  }

  patchOtherItems() {
    this.addFuelForm.get('discount_after_tax').setValue(this.mechanicActivityData.discount_after_tax);
    if (this.mechanicActivityData.other_expenses.length > 0) {
      this.initialValues.expenseAccount = [];
      this.initialValues.items = [];
      this.initialValues.units = [];
      this.initialValues.tax = [];
      this.mechanicActivityData.other_expenses.forEach((otherexpense, index) => {
        otherexpense.id = isValidValue(otherexpense.id) ? otherexpense.id : '';
        this.initialValues.expenseAccount.push({ label: isValidValue(otherexpense.expense_account) ? otherexpense.expense_account.name : '' });
        otherexpense.expense_account = isValidValue(otherexpense.expense_account) ? otherexpense.expense_account.id : null;
        this.initialValues.items.push({ label: isValidValue(otherexpense.item) ? otherexpense.item.name : '' });
        otherexpense.item = isValidValue(otherexpense.item) ? otherexpense.item.id : null;
        this.initialValues.tax.push({ label: isValidValue(otherexpense.tax) ? otherexpense.tax.label : '' });
        otherexpense.tax = isValidValue(otherexpense.tax) ? otherexpense.tax.id : null;
        this.initialValues.units.push({ label: isValidValue(otherexpense.unit) ? otherexpense.unit.label : '' });
        otherexpense.unit = isValidValue(otherexpense.unit) ? otherexpense.unit.id : null;
      });
      this.buildOtherItems(this.mechanicActivityData.other_expenses);
    } else {
      this.addMoreOtherItem();
    }
  }

  challansSelectedVehicleFuel(ele) {
    this.apiError = '';
    if (ele.length == 0)
      this.unpaidChallanModelInline = false;
    else
      this.unpaidChallanModelInline = true;
    ele.forEach((challan) => {
      challan['total_before_tax'] = challan.total
      if (challan.unpaid_fuel_challan == undefined) {
        challan.unpaid_fuel_challan = challan.id;
      }
    });

    this.buildUnpaidChallans(ele);
    this.calculationsChanged();
  }

  calculateUnpaidTotal(form) {
    let fuelQuantity = Number(form.get('quantity').value)
    let fuelCost = Number(form.get('unit_cost').value)
    let total = (Number(fuelCost * fuelQuantity)).toFixed(3)
    form.get('total_before_tax').setValue(total)
    this.calculationsChanged();

  }

  buildUnpaidChallans(items: any = []) {
    const unpaidChallans = this.addFuelForm.controls['unpaid_fuel_details'] as UntypedFormArray;
    unpaidChallans.controls = [];
    unpaidChallans.setValue([]);
    this.unpaidChallanList = [];
    this.initialValues.umpaidFuelChallanTax = [];
    items.forEach((item) => {
      unpaidChallans.push(this.addUnpaidChallan(item));
      this.unpaidChallanList.push(item);
      this.initialValues.umpaidFuelChallanTax.push(this.selectedTax)
    });
  }

  addUnpaidChallan(item) {
    return this._fb.group({
      id: [
        item.id || null
      ],
      unpaid_fuel_challan: [item.unpaid_fuel_challan || null],
      document_no: [
        item.document_no || ""
      ],
      vehicle: [item.vehicle || null],
      date: [
        item.date || null
      ],
      unit_cost: [
        item.unit_cost || 0.00, [Validators.min(0.01)]
      ],
      quantity: [
        item.quantity || 0.00, [Validators.min(0.01)]
      ],
      tax: [item.tax || this.selectedTaxId],
      total_before_tax: [item.total_before_tax || 0.000],
      status: [
        item.status || ''
      ],
      total: [
        item.total || 0.00
      ],
    });
  }

  paymentStatusData(data: { data: any, valid: boolean }) {
    this.addFuelForm.patchValue({
      amount_paid: data.data.amount_paid,
      bank_charges: data.data.bank_charges,
      payment_mode: data.data.payment_mode,
      payment_status: data.data.payment_status,
      paid_employee:data.data.paid_employee,
      transaction_date: changeDateToServerFormat(data.data.transaction_date)
    })
    this.isPaymentstatusValid = data.valid;
  }

  onSelectPopulateTax($event) {
    if ($event.target.value) {
      const tax = getObjectFromList($event.target.value, this.taxOptions);
      if (tax) {
        this.selectedTax = { label: tax.label, value: tax.id };
        this.selectedTaxId = tax.id;
        this.initialValues.tripTax.fill(this.selectedTax);
        this.initialValues.fuelTax.fill(this.selectedTax);
        this.initialValues.umpaidFuelChallanTax.fill(this.selectedTax);
        const upiaidChallan = this.addFuelForm.get('unpaid_fuel_details') as UntypedFormArray;
        upiaidChallan.controls.forEach(element => {
          element.get('tax').setValue(tax.id);
        });
        const fuelChallan = this.addFuelForm.get('vehicle_details') as UntypedFormArray;
        fuelChallan.controls.forEach(element => {
          element.get('tax').setValue(tax.id);
        });
        this.calculationsChanged();
      }
    }
  }

  addNewAdditionalCharge(event,i) {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      data : {
			isEdit : false,
			charge_name : event,
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
      if(item){
        this.expenseItemDropdownIndex =i
        this._revenueService.getExpense().subscribe((response) => {
          if (response && response.result && response.result.length > 0) {
            this.staticOptions.materialList = response.result;
            if (this.expenseItemDropdownIndex != -1) {
              this.initialValues.items[this.expenseItemDropdownIndex] = { value: item.name.id, label: item.name.name };
              let other_expense = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
              other_expense.at(this.expenseItemDropdownIndex).get('item').setValue(item.name.id)
  
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
