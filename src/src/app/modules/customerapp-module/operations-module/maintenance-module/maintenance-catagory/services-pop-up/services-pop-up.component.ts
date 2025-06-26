import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { PartyType, ValidationConstants, VendorType } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CommonService } from 'src/app/core/services/common.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption, getNonTaxableOption, getObjectFromList, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { MaintenanceService } from '../../operations-maintenance.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-services-pop-up',
  templateUrl: './services-pop-up.component.html',
  styleUrls: ['./services-pop-up.component.scss']
})
export class ServicesPopUpComponent implements OnInit {
  @Input() addServices;
  @Input() jobCardDetails;
  @Input() isServiceEdit: boolean = false;
  @Input() serviceEditId = ''
  @Output() dataFormAddServices = new EventEmitter(false)
  addServiceForm: UntypedFormGroup;
  serviceEditData: any
  vendorList = [];
  tyreManufacturer = [];
  staticOptions = {
    threadType: [],
    tyreManufacturer: [],
  }
  modelParams = {
    name: ''
  };
  modelApi = [];
  modelList = [];
  showAddPartyPopup: any = { name: '', status: false };
  partyNamePopup: string = '';
  initialValues = {
    vendor: {},
    make: [],
    model: [],
    position: [],
    serviceType: [],
    vehicleTyrePositions: [],
    paymentMode: {},
    errorMessage: {
      position: false,
      unique_no: false,
      position_no: false,
      isTotalGreaterThenZero: true,
      position_selection: false
    },
    tax: getNonTaxableOption(),
    paid_employee: getBlankOption()
  }
  addServiceTotal: any = {
    taxes: [],
  };
  companyRegistered: boolean = true;
  taxOptions = [];
  isTotalGreaterThenZero = false;
  defaultTax = new ValidationConstants().defaultTax;
  paymentTypes = [{
    label: 'Paid',
    id: 1
  },
  {
    label: 'Pay Later',
    id: 2
  },
    // {
    //   label:'Bill Later',
    //   id:3
    // }
  ];
  is_driver_paid = false;
  vendorId = '';
  paymentModeList = [];
  currency_type: any;
  vehicleMakeParam: any = {};
  manufacturerApi = TSAPIRoutes.static_options;
  terminology: any;
  isTax = true;
  maintenancePermission = Permission.maintenance.toString().split(',');
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  isVehiclePosition = true;
  defaultThreadType = '806a7278-c95d-4452-b6f8-4dd5285bec3c';
  activeEmpList = [];
  constructor(private _fb: UntypedFormBuilder, private _partyService: PartyService,
    private _vehicleService: VehicleService, private _commonService: CommonService,
    private _taxService: TaxModuleServiceService, private _revenueService: RevenueService,
    private currency: CurrencyService, private _maintenanceService: MaintenanceService, private _analytics: AnalyticsService,
    private _terminologiesService: TerminologiesService, private _tax: TaxService,) {
    this.currency_type = this.currency.getCurrency();
    this.terminology = this._terminologiesService.terminologie;
    this.isTax = this._tax.getTax();
  }
  isServiceListOpen: boolean = false
  ngOnInit(): void {
    this.buildForm();
    this.getVendorDetails();
    this.getTaxDetails();
    this.getPaymentModeList();
    this.getActiveEmpList();
    if (this.isServiceEdit) {
      this._maintenanceService.getJobCardNewService(this.serviceEditId).subscribe(resp => {
        this.serviceEditData = resp.result;
        this.patchService();
      })

    }
  }

  getActiveEmpList() {
    this._revenueService.getActiveEmployeeList().subscribe((data) => {
      this.activeEmpList = data['result']
    })
  }
  onClickCancel() {
    this.addServices.show = false
  }
  saveMaintenance() {
    let form = this.addServiceForm
    this.initialValues.errorMessage.isTotalGreaterThenZero = this.isTotalGreaterThenZero
    if (form.valid && this.isTotalGreaterThenZero) {
      if (form.get('payment_mode').value === 'paid_By_Driver') {
        form.value['payment_mode']= null
      }
      else {
        form.value['paid_employee']= null
      }
      if(form.value['payment_type']==2){
        form.value['payment_mode']= null
      }
      form.value['jobcard'] = this.jobCardDetails.id
      form.value['due_date'] = changeDateToServerFormat(form.value['due_date']);
      form.value['bill_date'] = changeDateToServerFormat(form.value['bill_date']);
      if (this.isServiceEdit) {

        this._maintenanceService.putJobCardNewService(this.serviceEditData.id, form.value).subscribe(data => {
          this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.JOBCARDSERVICE);
          this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.JOBCARD);
          this.dataFormAddServices.next(true);
          this.addServices.show = false
        }, err => {
          console.log(err)
        });
      } else {
        this._maintenanceService.postJobCardNewService(form.value).subscribe(data => {
          this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.JOBCARDSERVICE);
          this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.JOBCARD);
          this.dataFormAddServices.next(true);
          this.addServices.show = false
        }, err => {
          console.log(err)
        });
      }

    } else {
      this.setAsTouched(form)
      console.log(form)
    }

  }

  openAddService() {
    this.isServiceListOpen = true
  }
  paymentModeChanged() {
    let value = this.addServiceForm.get('payment_mode').value;
    if (value === 'paid_By_Driver') {
      this.is_driver_paid = true;
      setUnsetValidators(this.addServiceForm, 'paid_employee', [Validators.required])
    }
    else {
      this.is_driver_paid = false;
      this.addServiceForm.get('paid_employee').setValue(null)
      this.initialValues.paid_employee = getBlankOption();
      setUnsetValidators(this.addServiceForm, 'paid_employee', [Validators.nullValidator])
    }
  }

  vendorSelected(id) {
    this.vendorId = id;
    let params = {
      is_account: 'True',
      is_tenant: 'False',
      remove_cash_account:'False'
    }
    this._revenueService.getDefaultBank(this.vendorId, params).subscribe((data) => {
      this.initialValues.paymentMode = getBlankOption();
      if(data['result']){
        this.addServiceForm.get('payment_mode').setValue(data['result'].id);
        this.initialValues.paymentMode['label'] = data['result'].name;
        this.paymentModeChanged();
      }
    })
  }

  serviceDetails(e) {
    if ('id' in e.data) {
      this.initialValues.serviceType.push({ label: e.data.service_name })
      let serviceDetials = {
        service_type: e.data.id,
        service_amount: Number(e.data.service_amount),
        labour_amount: Number(e.data.labour_amount),
        total_amount: Number(e.data.service_amount) + Number(e.data.labour_amount)
      }
      this.addServiceItem([serviceDetials]);
      this.onCalculationChange();
    }
    this.isServiceListOpen = false
  }

  buildForm() {
    this.addServiceForm = this._fb.group({
      services: this._fb.array([]),
      tyre_change: this._fb.array([]),
      tyre_rotation: this._fb.array([]),
      jobcard: '',
      vendor: [null],
      service_total: 0.00,
      labour_total: 0.00,
      tyre_change_total: 0.00,
      subtotal: 0.00,
      adjustment_before_tax: 0.00,
      adjustment_after_tax: 0.00,
      adjustment_before_tax_amount: 0.00,
      is_roundoff: true,
      roundoff_amount: 0.00,
      total_amount: 0.00,
      payment_type: 0,
      bill_number: '',
      due_date: null,
      payment_mode: null,
      paid_employee: [null],
      bill_date: null,
      notes: '',
      is_tax_included: false,
      tax: this.defaultTax
    })
  }


  taxValueChange() {
    const taxId = this.addServiceForm.controls['tax'].value;
    const taxDetails = this.taxOptions.filter(item => item.id == taxId)[0];
    this.initialValues.tax = { label: taxDetails.label, value: '' };
  }

  removeTyreChange(i) {
    const tyreChangearray = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
    tyreChangearray.removeAt(i);
    this.modelList.splice(i, 1);
    this.modelApi.splice(i, 1);
    this.onCalculationChange();
  }

  addTyreChangeItem(tyre: Array<any>) {
    if (tyre.length == 0) {
      this.addServiceItem([{}])
      this.modelList.push([]);
      this.modelApi.push('');
    }
    const tyreChangearray = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
    tyre.forEach((item) => {
      const arrayItem = this.buildTyreChange(item);
      tyreChangearray.push(arrayItem);
      this.modelList.push([]);
      this.modelApi.push('');
    });
  }

  removeService(i) {
    const servicearray = this.addServiceForm.controls['services'] as UntypedFormArray;
    servicearray.removeAt(i);
    this.initialValues.serviceType.splice(i, 1);
    this.onCalculationChange();
  }


  addServiceItem(service: Array<any>) {
    if (service.length == 0) {
      this.addServiceItem([{}])
    }
    const servicearray = this.addServiceForm.controls['services'] as UntypedFormArray;
    service.forEach((item) => {
      const arrayItem = this.buildService(item);
      servicearray.push(arrayItem);
    });
  }

  buildService(item) {
    return this._fb.group({
      id: [item.id || null],
      service_type: [item.service_type || null],
      service_amount: [item.service_amount || 0.00],
      labour_amount: [item.labour_amount || 0.00],
      total_amount: [item.total_amount || 0.00, [Validators.min(0.9999)]]
    });
  }

  buildTyreChange(item) {
    return this._fb.group({
      id: [
        item.id || null
      ],
      changed_tyre: [
        item.changed_tyre || null
      ],
      present_tyre: [
        item.present_tyre || null
      ],
      tyre_model: [
        item.tyre_model || null, [Validators.required]
      ],
      position: [
        item.position || null],
      manufacturer: [
        item.manufacturer || null, [Validators.required]
      ],
      thread_type: [
        item.thread_type || this.defaultThreadType],
      changed_unique_no: [
        item.changed_unique_no || '', [RxwebValidators.unique(), Validators.pattern('^[a-zA-Z0-9_]*$')]
      ],
      present_unique_no: [item.present_unique_no || ""],
      position_used: [false],
      unique_no_status: [false],
      present_unique_no_status: [false],
      present_unique_no_edit: [false],
      position_selection_error: [false],
      total: [item.total || 0, [Validators.min(0.01)]],
    });
  }

  openAddPartyModal($event) {
    if ($event)
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
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
      this.initialValues.vendor = { value: $event.id, label: $event.label };
      this.addServiceForm.get('vendor').setValue($event.id);
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  getVendorDetails() {
    this._partyService.getPartyList(VendorType.Othres, PartyType.Vendor).subscribe((response) => {
      this.vendorList = response.result;
    });
  }

  getTaxDetails() {
    this._taxService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
      this.addServiceTotal.taxes = result.result['tax'];
      this.companyRegistered = result.result['registration_status'];
    })
  }

  serviceTotalCalculation(item: FormGroup) {
    const serviceAmount = Number(item.get('service_amount').value);
    const labourAmount = Number(item.get('labour_amount').value);
    let totalAmount = (serviceAmount + labourAmount).toFixed(3);
    item.get('total_amount').setValue(totalAmount);
    this.onCalculationChange();
  }

  getPaymentModeList() {
    this._revenueService.getAccounts().subscribe((response) => {
      this.paymentModeList = response.result
    });
  }

  onChangePaymentOptions() {
    let form = this.addServiceForm;
    const selectedOption = form.get('payment_type').value;
    form.get('bill_number').setValue('')
    if (selectedOption) {
      if (selectedOption == 1) {
        this.setUnsetValidators(form, 'payment_mode', [Validators.required]);
        this.setUnsetValidators(form, 'due_date', [Validators.nullValidator]);
        this.setUnsetValidators(form, 'bill_date', [Validators.nullValidator]);
        this.setUnsetValidators(form, 'vendor', [Validators.nullValidator]);
        form.get('due_date').setValue(null);
        form.get('bill_date').setValue(new Date(dateWithTimeZone()));
      } else if (selectedOption == 2) {
        this.setUnsetValidators(form, 'due_date', [Validators.required]);
        this.setUnsetValidators(form, 'bill_date', [Validators.required]);
        this.setUnsetValidators(form, 'vendor', [Validators.required]);
        this.setUnsetValidators(form, 'payment_mode', [Validators.nullValidator]);
        this.setUnsetValidators(form, 'paid_employee', [Validators.nullValidator]);
        form.get('due_date').setValue(new Date(dateWithTimeZone()));
        form.get('bill_date').setValue(new Date(dateWithTimeZone()));
        form.get('payment_mode').setValue(null);
        form.get('paid_employee').setValue(null);
        this.is_driver_paid = false;
        this.initialValues.paymentMode = getBlankOption();
        this.initialValues.paid_employee = getBlankOption();
      } else {
        this.setUnsetValidators(form, 'payment_mode', [Validators.nullValidator]);
        this.setUnsetValidators(form, 'due_date', [Validators.nullValidator]);
        form.get('payment_mode').setValue(null);
        form.get('due_date').setValue(null);
        form.get('bill_date').setValue(null);
      }
    }
  }


  setUnsetValidators(formName: FormGroup, formControlName: string, validatorsList: Array<any>) {
    formName.get(formControlName).setValidators(validatorsList);
    formName.get(formControlName).updateValueAndValidity();
  }

  onRoundOffEvent(e) {
    this.onCalculationChange()
  }

  onCalculationChange() {
    const services = this.addServiceForm.controls['services'] as UntypedFormArray;
    const tyre_change = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
    let totalServiceAmount = 0;
    let totalLabourAmount = 0;
    let totalTyreChange = 0;
    let subTotal = 0;
    let adjustmentBeforeTaxAmount = 0;
    let adjustmentAfterTax = 0;
    let form = this.addServiceForm;
    services.controls.forEach((service, index) => {
      let serviceAmount = Number(service.get('service_amount').value);
      let labourAmount = Number(service.get('labour_amount').value);
      totalServiceAmount = Number(serviceAmount) + Number(totalServiceAmount)
      totalLabourAmount = Number(labourAmount) + Number(totalLabourAmount)
      if(form.get('is_tax_included').value==true){
        this.addServiceTotal.taxes.forEach((tax) => {
          if (form.get('tax').value == tax.id) {
            form.get('service_total').setValue((Number(serviceAmount)/(((Number(tax.value))+100)/100)).toFixed(3))
            form.get('labour_total').setValue((Number(labourAmount)/(((Number(tax.value))+100)/100)).toFixed(3))
            subTotal = Number(form.get('service_total').value) + Number(form.get('labour_total').value),
            form.get('subtotal').setValue(subTotal)
          }
        })
      }
    });
    tyre_change.controls.forEach((tyreChange, index) => {
      let amount = Number(tyreChange.get('total').value);
      totalTyreChange = Number(amount) + Number(totalTyreChange)
      if(form.get('is_tax_included').value==true){
        this.addServiceTotal.taxes.forEach((tax) => {
          if (form.get('tax').value == tax.id) {
            form.get('tyre_change_total').setValue((Number(amount)/(((Number(tax.value))+100)/100)).toFixed(3))
            subTotal = Number(form.get('subtotal').value) + Number(form.get('tyre_change_total').value),
            form.get('subtotal').setValue(subTotal)
          }
        })
      }
    });
    subTotal = Number(totalServiceAmount) + Number(totalLabourAmount) + Number(totalTyreChange)
    if(form.get('is_tax_included').value==false){
      form.get('service_total').setValue(totalServiceAmount.toFixed(3))
      form.get('labour_total').setValue(totalLabourAmount.toFixed(3))
      form.get('tyre_change_total').setValue(totalTyreChange.toFixed(3))
      form.get('subtotal').setValue(subTotal.toFixed(3));}
    adjustmentBeforeTaxAmount = Number(subTotal) + Number(form.get('adjustment_before_tax').value),
      form.get('adjustment_before_tax_amount').setValue(adjustmentBeforeTaxAmount)
    let amountWithoutTax = 0
    let totalAmountWithTax = 0
    amountWithoutTax = Number(form.get('adjustment_before_tax_amount').value);
    this.addServiceTotal.taxes.forEach((tax) => {
      tax.total = 0;
      tax.taxAmount = 0;
      let rate = amountWithoutTax;
      if (form.get('tax').value == tax.id) {
        if (form.get('is_tax_included').value) {
          amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
          tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
          tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
          totalAmountWithTax = rate;
        } else {
          tax.total = (Number(amountWithoutTax)).toFixed(3);
          tax.taxAmount = (Number(((rate * Number(tax.value)) / (100)))).toFixed(3);
          totalAmountWithTax = Number(amountWithoutTax) + Number(tax.taxAmount)
        }
      }
    });
    adjustmentAfterTax = Number(totalAmountWithTax) + Number(form.get('adjustment_after_tax').value);
    if (form.get('is_roundoff').value) {
      const roundOffAmounts = roundOffToCeilFloor(adjustmentAfterTax);
      form.get('roundoff_amount').setValue(Number(roundOffAmounts.roundOffAmount).toFixed(3));
      form.get('total_amount').setValue(Number(roundOffAmounts.roundedOffAmount).toFixed(3));
    } else {
      form.get('roundoff_amount').setValue(Number(0).toFixed(3));
      form.get('total_amount').setValue(Number(adjustmentAfterTax).toFixed(3));
    }
    let totalAmount = Number(form.get('total_amount').value);
    if (totalAmount > 0) {
      if (form.get('payment_type').value == 0) {
        form.get('payment_type').setValue(1);
        this.onChangePaymentOptions()
        this.isTotalGreaterThenZero = true;
      }
    } else {
      form.get('payment_type').setValue(0);
      this.onChangePaymentOptions()
      this.isTotalGreaterThenZero = false;

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

  addTyreChange() {
    if (this.jobCardDetails.vehicle) {
      this.getTyrePositions(this.jobCardDetails.vehicle.id)
    }

  }

  getTyrePositions(vehicleId) {
    this._vehicleService.getVehicleTyres(vehicleId).subscribe((response) => {
      this.initialValues.vehicleTyrePositions = response.result;
      this.initialValues.errorMessage.position = false;
      this.getTyreChangeDetails();
      this.addTyreChangeItem([{}]);
      if (response.result.length == 0) {
        this.isVehiclePosition = false;
      } else {
        this.isVehiclePosition = true;

      }
    });
  }


  getTyreChangeDetails() {

    this._commonService.getStaticOptions('tyre-manufacturer').subscribe((response) => {
      this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
      this.tyreManufacturer = response.result['tyre-manufacturer'];
    });
  }

  onMakeChange(form, index) {
    this._vehicleService.getModel(form.get("manufacturer").value).subscribe(data => {
      this.modelApi[index] = 'vehicle/tyre/manufacturer/' + form.get("manufacturer").value + '/model/'
      this.modelList[index] = data.result;
    });
  }


  changeUniqueNo(form) {
    let uniqueNumber = form.get('changed_unique_no').value;
    let tyreId = form.get('changed_tyre').value;
    if (uniqueNumber != '') {
      if (this.checkUnqueNumberUnique()) {
        this._maintenanceService.getUniqueNumber(uniqueNumber, tyreId).subscribe(data => {
          if (data.result.exists) {
            form.get('unique_no_status').setValue(true);
            this.initialValues.errorMessage.unique_no = true;
          } else {
            form.get('unique_no_status').setValue(false);
            this.initialValues.errorMessage.unique_no = false;
          }
        })
      } else {
        form.get('unique_no_status').setValue(true);
        this.initialValues.errorMessage.unique_no = true;
      }
    } else {
      form.get('unique_no_status').setValue(false);
      this.initialValues.errorMessage.unique_no = false;
    }

  }

  getNewModel(data, index, tyreChange: UntypedFormGroup) {
    if (isValidValue(data)) {
      tyreChange.get('tyre_model').setValue(data.id);
      this.onMakeChange(tyreChange, index)
    }
  }

  addNewModel($event) {
    this.modelParams = { name: $event };
  }

  checkUnqueNumberUnique() {
    let vehicleTyres = [];
    let unique = true;
    const tyre_change = this.addServiceForm.get('tyre_change') as UntypedFormArray;
    for (const items of tyre_change['controls']) {
      if (items['controls'].changed_unique_no.value != '' && items['controls'].changed_unique_no.value != null) {
        vehicleTyres.push(items['controls'].changed_unique_no.value)
      }
      if (items['controls'].present_unique_no.value != '' && items['controls'].present_unique_no.value != null) {
        vehicleTyres.push(items['controls'].present_unique_no.value)
      }
    }
    let valuesAlreadySeen = [];
    for (let i = 0; i < vehicleTyres.length; i++) {
      let value = vehicleTyres[i]
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        unique = false
      }
      valuesAlreadySeen.push(value)
    }

    if (unique) {
      return true
    } else {
      return false
    }
  }

  onTyreSelect(tyreChange) {
    for (let i = 0; i < this.initialValues.vehicleTyrePositions.length; i++) {
      this.initialValues.vehicleTyrePositions.filter((data) => {
        if (tyreChange.get('position').value === data.id) {
          tyreChange.get('present_unique_no').setValue(data.unique_no);
          this.changeOldUniqueNo(tyreChange);
        }
      });
    }

    if (!this.checkPositionUniqeueness()) {
      tyreChange.get('position_used').setValue(true)
      this.initialValues.errorMessage.position_no = true;

    } else {
      tyreChange.get('position_used').setValue(false)
      this.initialValues.errorMessage.position_no = false;
    }
  }

  changeOldUniqueNo(tyreChange) {
    const tyreId = this.getTyreIdFromPosition(tyreChange);
    let uniqueNumber = tyreChange.get('present_unique_no').value;
    let position = tyreChange.get('position').value
    if (uniqueNumber != '') {
      if (this.checkUnqueNumberUnique()) {
        if (position) {
          this._maintenanceService.getUniqueNumber(uniqueNumber, tyreId).subscribe(data => {
            if (data.result.exists) {
              tyreChange.get('present_unique_no_status').setValue(true);
              this.initialValues.errorMessage.unique_no = true;
            } else {
              tyreChange.get('present_unique_no_status').setValue(false);
              this.initialValues.errorMessage.unique_no = false;
            }
          })
        }
      } else {
        tyreChange.get('present_unique_no_status').setValue(true);
        this.initialValues.errorMessage.unique_no = true;
      }
    } else {
      tyreChange.get('present_unique_no_status').setValue(false);
      this.initialValues.errorMessage.unique_no = false;
    }
  }

  getTyreIdFromPosition(tyreChange) {
    let position = { tyre_id: "" }
    const positionId = tyreChange.get('position').value;
    const id = tyreChange.get('id').value;
    if (id) {
      return tyreChange.get('present_tyre').value;
    } else {
      position = getObjectFromList(positionId, this.initialValues.vehicleTyrePositions);
      if (isValidValue(position)) {
        return position.tyre_id;
      } else {
        return ''
      }
    }
  }

  checkPositionUniqeueness() {
    let positionList = []
    let unique = true;
    const tyre_change = this.addServiceForm.get('tyre_change') as UntypedFormArray;
    for (const items of tyre_change['controls']) {
      if (items['controls'].position.value != ' ' && items['controls'].position.value != null) {
        let value = items['controls'].position.value.trim()
        positionList.push(value)
      }
    }
    for (let i = 0; i < positionList.length; i++) {
      for (let j = i + 1; j < positionList.length; j++) {
        if (JSON.stringify(positionList[i]) == JSON.stringify(positionList[j])) {
          unique = false;
        }
      }
    }

    if (unique) {
      return true
    } else {
      return false
    }
  }

  getNewVehicleMake(event, index, tyreChange) {
    if (event) {
      this._commonService.getStaticOptions('tyre-manufacturer').subscribe((response) => {
        this.tyreManufacturer = response.result['tyre-manufacturer'];
        tyreChange.get('manufacturer').setValue(event.id);
        this.modelApi[index] = 'vehicle/tyre/manufacturer/' + tyreChange.get("manufacturer").value + '/model/'
        this.modelList[index] = [];
      });
    }
  }

  addNewVehicleMake(event) {
    if (event) {
      const arrStr = event.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.vehicleMakeParam = {
        key: 'tyre-manufacturer',
        label: word_joined,
        value: 0
      };
    }
  }

  patchService() {
    this.addServiceForm.get('payment_type').setValue(this.serviceEditData.payment_type.id)
    this.serviceEditData.payment_type = this.serviceEditData.payment_type.id;
    this.onChangePaymentOptions()
    this.isTotalGreaterThenZero = true;
    this.patchVendor();
    this.patchTax();
    this.addServiceForm.patchValue(this.serviceEditData)
    this.patchPaymentType();
    if (this.serviceEditData['services'].length) {
      const services = this.addServiceForm.controls['services'] as UntypedFormArray;
      services.controls = [];
      this.initialValues.serviceType = [];
      this.serviceEditData['services'].forEach(serviceData => {
        this.patchAddService(serviceData);
      });
    }
    if (this.serviceEditData['tyre_change'].length) {
      this.getTyreChangeDetails();
      const tyre_change = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
      tyre_change.controls = [];
      this.serviceEditData['tyre_change'].forEach(tyreChangeData => {
        this.patchTyreChange(tyreChangeData)
      });
      tyre_change.controls.forEach((item, index) => {
        this.onMakeChange(item, index);
      });
    }

    setTimeout(() => {
      this.onCalculationChange();
    }, 2000);


  }

  patchVendor() {
    if (this.serviceEditData.vendor) {
      this.initialValues.vendor = { label: this.serviceEditData.vendor.label };
      this.serviceEditData.vendor = this.serviceEditData.vendor.id
    }

  }

  patchTax() {
    this.initialValues.tax = { label: this.serviceEditData.tax.label, value: '' };
    this.serviceEditData.tax = this.serviceEditData.tax.id
  }

  patchPaymentType() {
    if (this.serviceEditData.payment_type == 1) {
      if (this.serviceEditData.payment_mode == null) {
        this.addServiceForm.get('payment_mode').setValue('paid_By_Driver');
        this.initialValues.paymentMode['label'] = 'Paid By Employee';
        this.is_driver_paid = true;
        this.addServiceForm.get('paid_employee').setValue(this.serviceEditData.paid_employee.id);
        this.initialValues.paid_employee['label'] = this.serviceEditData?.paid_employee?.display_name;
        this.initialValues.paid_employee['value'] = this.serviceEditData?.paid_employee?.id;
      }
      else {
        this.is_driver_paid = false;
        this.addServiceForm.get('payment_mode').setValue(this.serviceEditData.payment_mode.id);
        this.initialValues.paymentMode['label'] = this.serviceEditData?.payment_mode?.name;
        this.initialValues.paymentMode['value'] = this.serviceEditData?.payment_mode?.id;
      }
    }


  }


  patchAddService(data) {
    this.initialValues.serviceType.push({ label: data.service_type.label })
    let serviceDetials = {
      service_type: data.service_type.id,
      service_amount: Number(data.service_amount),
      labour_amount: Number(data.labour_amount),
      total_amount: Number(data.total_amount)
    }
    this.addServiceItem([serviceDetials]);
  }

  patchTyreChange(data) {
    let tyreDetails = {
      changed_tyre: data.changed_tyre,
      changed_unique_no: data.changed_unique_no,
      disabled: data.disabled,
      id: data.id,
      manufacturer: data.manufacturer.id,
      position: data.position ? data.position.id : null,
      present_tyre: data.present_tyre,
      present_unique_no: data.present_unique_no,
      thread_type: data.thread_type.id,
      total: data.total,
      tyre_model: data.tyre_model.id,
      tyre_sent_for: data.tyre_sent_for.id
    }
    this.initialValues.make.push({ label: data.manufacturer.label });
    this.initialValues.model.push({ label: data.tyre_model.name });
    data.position ? this.initialValues.position.push({ label: data.position.label }) : this.initialValues.position.push({ label: '' })
    this.addTyreChangeItem([tyreDetails]);
    if (this.jobCardDetails.vehicle) {
      this._vehicleService.getVehicleTyres(this.jobCardDetails.vehicle.id).subscribe((response) => {
        this.initialValues.vehicleTyrePositions = response.result;
        if (response.result.length == 0) {
          this.isVehiclePosition = false;
        } else {
          this.isVehiclePosition = true;
        }
      });
    }


  }



}
