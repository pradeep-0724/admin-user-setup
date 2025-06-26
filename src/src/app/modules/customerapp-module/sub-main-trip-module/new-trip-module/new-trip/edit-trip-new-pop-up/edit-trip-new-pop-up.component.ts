import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { NewTripDataService } from '../new-trip-data.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { filterDriver, filterHelper } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-utils';
import { getBlankOption, getObjectFromListByKey } from 'src/app/shared-module/utilities/helper-utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { showPopUpMsgForWorkOrderQuantity } from '../../../../revenue-module/utils';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { popupTripArray } from '../../pop-up-constants';
import { cloneDeep } from 'lodash';
import { NewTripV2Service } from '../../../../api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
export interface outputdata {
  allData: Array<[]>,
  isFormValid: boolean
}
@Component({
  selector: 'app-edit-trip-new-pop-up',
  templateUrl: './edit-trip-new-pop-up.component.html',
  styleUrls: ['./edit-trip-new-pop-up.component.scss']
})
export class EditTripNewPopUpComponent implements OnInit {
  partyListVendor = [];
  tripEmployeeTypeList = [];
  expenseTypeList = [];
  chargedAddBillType = [];
  chargedReducedBillType = [];
  employeeList = [];
  driverList = [];
  helperList = [];
  expenseAccountList = [];
  accountList = [];
  advanceClientAccountList = [];
  vendorList = [];
  materialOptionsList = [];
  materialList = [];
  selectedDropdown: any;
  clientFreightsType = ''
  clientFreightType: any = getBlankOption();
  vehicleFreightType: any = getBlankOption();
  selectionType = '';
  workOrderList = [];
  workOrderDetails = {};
  @Input() isDriver: boolean = true;
  @Input() showEditPopup;
  @Input() returnData: boolean = false;
  @Input() isTransporter: boolean = false;
  @Input() isAddExpense: boolean = true;
  @Input() updateCharges: boolean = false;
  @Input() isZeroAmountAccepted: boolean = true;

  @Output() dataFromEdit = new EventEmitter<any>()
  dropdownType = [{
    name: 'tonnes',
    value: '1',
    label: 'Tonnes'
  },
  {
    name: 'kgs',
    value: '2',
    label: 'KGS'
  },
  {
    name: 'kms',
    value: '3',
    label: 'KMS'
  },
  {
    name: 'litres',
    value: '4',
    label: 'Litres'
  },
  {
    name: 'hour',
    value: '5',
    label: 'Hours'
  },
  {
    name: 'days',
    value: '6',
    label: 'Days'
  },
  {
    name: 'fixed',
    value: '7',
    label: 'Fixed'
  },
  ]
  isFormValid = true;
  payloadData = [];
  showError = false;
  selectedTab = ''
  isSingleEntry: boolean = false;
  accountType = new ValidationConstants().accountType.join(',');
  isClientFrightValid = new BehaviorSubject(true);
  isVehileFreightValid = new BehaviorSubject(true);
  isSelfFuelValid = new BehaviorSubject(true);
  isSelfDriverFormValid = new BehaviorSubject(true);
  isOtherExpenseFormValid = new BehaviorSubject(true);
  isPartyAdvanceFuelFormValid = new BehaviorSubject(true);
  isPartyAdvanceFormValid = new BehaviorSubject(true);
  isVehicleAdvanceFormValid = new BehaviorSubject(true);
  isChargeAddToBillFormValid = new BehaviorSubject(true);
  isChargeReduceToBillFormValid = new BehaviorSubject(true);
  isVehicleAddToBillFormValid = new BehaviorSubject(true);
  isVehicleReduceToBillFormValid = new BehaviorSubject(true);
  workOrndeName = ''

  popupWorkOrderInputData = {
    'msg': '',
    'type': 'warning-work-order',
    'show': false,
  }

  workOrderClientFrightData: Subject<any> = new Subject();
  deFaultWorkOrderFreight = {
    freight_amount: 0.000,
    freight_type: 1,
    rate: 0.000,
    total_units: 0.000,
  }
  isDisableBillingTypes = true;
  customerId = '';
  billingTypeList = new NewTripV2Constants().billingTypeList;
  billingList : any[] = [
    {
      label : 'Quantity',
      value : 14
    },
    {
      label : 'Jobs',
      value : 10
    }
  ];
  showUnitsAndRateFields : boolean = true;
  constructor(private _companyTripGetApiService: CompanyTripGetApiService,  private _dataService: NewTripDataService, private newTripService: NewTripService, private _popupBodyScrollService: popupOverflowService, private _newTripService: NewTripV2Service,) { }

  ngOnInit() {
    this.customerId = this.showEditPopup['extras']['customerId']
    this._companyTripGetApiService.getStaticOptions(staticOptionObject => {
      this.tripEmployeeTypeList = staticOptionObject.tripEmployeeTypeList;
      this.expenseTypeList = staticOptionObject.expenseType;
      this.chargedReducedBillType = staticOptionObject.chargedReducedBillType
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(Number(this.showEditPopup.data['vehicle_category']) ==3){
      this.billingTypeList = this.billingList
    } 
    this.showUnitsAndRateFields = Number(this.showEditPopup.data['vehicle_category']) ==1 || Number(this.showEditPopup.data['vehicle_category']) ==2;
    this.selectedType(changes['showEditPopup'].currentValue.type)

  }

  clientBilling(data) {
    this.isFormValid = data.isFormValid;
    this.payloadData = cloneDeep(data.value);
  }

  setOtherExpenses() {
    this.selectedTab = 'other-expenses'
    let otherexpensesdata = this.showEditPopup.data['other_expenses'];
    const id = this.showEditPopup.extras.id;
    otherexpensesdata = [getObjectFromListByKey('id', id, otherexpensesdata)]
    this._dataService.otherExpenseData = otherexpensesdata;
    this._companyTripGetApiService.getexpenseAccountList(expenseAccountList => { this.expenseAccountList = expenseAccountList });
    this._companyTripGetApiService.getAccounts(this.accountType, accountList => { this.accountList = accountList });
  }

  setPartyChargeBill() {
    let chargesdata = [];
    let chargeDataToSave = []
    chargesdata = this.showEditPopup.data['party_add_bill_charges'];
    const id = this.showEditPopup.extras.id;
    chargesdata = [getObjectFromListByKey('id', id, chargesdata)]
    if (chargesdata.length > 0) {
      chargesdata.forEach(item => {
        if (item) {
          chargeDataToSave.push({
            amount: item.amount,
            amount_before_tax:item.amount_before_tax,
            date: item.date,
            id: item.id,
            type: item['type'].id,
            unit_of_measurement :item.unit_of_measurement? item.unit_of_measurement.id:null,
            quantity : item.quantity,
            unit_cost : item.unit_cost,
            expense_account: item['expense_account'] ? item['expense_account'].id : null,
            expense_party: item['party'] ? item['party'].id : null,
            expense_payment_mode: item['expense_payment_mode'] ? item['expense_payment_mode'].id : null,
            expense_type: item['expense_type'] ? item['expense_type']: 1,
            expense_tax: item['expense_tax'] ? item['expense_tax']['id']: null,
            is_expense: item['is_expense'],
            is_driver_paid:item['is_driver_paid']?true:false,
            expense_status: item['expense_status'],
            expense_payment_amount: item['expense_payment_amount'],
            expense_bill_no: item['expense_bill_no'],
            expense_bill_date: item['expense_bill_date'],
            expense_amount: item['expense_amount'],
            expense_amount_before_tax: item['expense_amount_before_tax'],
            bill_created: item['bill_created'] ? item['bill_created'] : false,
            employee:item['employee_id']?item['employee_id']:null,
            tax:item['tax']?item['tax']['id']:null
          })
        }
      });
    }
    this._dataService.partychargeData = chargeDataToSave;
    setTimeout(() => {
      this.selectedTab = 'party-charge-bill';
    }, 100);
  }

  setVpChargeBill() {
    let chargesdata = [];
    let chargeDataToSave = []
    chargesdata = this.showEditPopup.data['vp_add_bill_charges'];
    const id = this.showEditPopup.extras.id;
    chargesdata = [getObjectFromListByKey('id', id, chargesdata)]
    if (chargesdata.length > 0) {
      chargesdata.forEach(item => {
        if (item) {
          chargeDataToSave.push({
            amount: item.amount,
            date: item.date,
            id: item.id,
            unit_of_measurement :item.unit_of_measurement? item.unit_of_measurement.id:null,
            quantity : item.quantity,
            unit_cost : item.unit_cost,
            type: item['type'].id,
            amount_before_tax:item.amount_before_tax,
            tax:item['tax']?item['tax']['id']:null,
          })
        }
      });
    }
    this._dataService.chargeData = chargeDataToSave;
    this._companyTripGetApiService.getStaticOptions(staticOptionObject => {
      this.chargedAddBillType = staticOptionObject.chargedAddBillType
      this.selectedTab = 'vp-charge-bill';
    });
  }

  setVpReduceBill() {
    let chargesdata = [];
    let chargeDataToSave = [];
    chargesdata = this.showEditPopup.data['vp_reduce_bill_charges'];
    const id = this.showEditPopup.extras.id;
    chargesdata = [getObjectFromListByKey('id', id, chargesdata)]
    if (chargesdata.length > 0) {
      chargesdata.forEach(item => {
        if (item) {
          chargeDataToSave.push({
            amount: item.amount,
            date: item.date,
            amount_before_tax:item.amount_before_tax,
            id: item.id,
            type: item['type'].id,
            expense_account: item['expense_account'] ? item['expense_account'].id : null,
            expense_party: item['party'] ? item['party'].id : null,
            expense_tax: item['expense_tax'] ? item['expense_tax']['id']: null,
            expense_amount_before_tax: item['expense_amount_before_tax'],
            expense_payment_mode: item['expense_payment_mode'] ? item['expense_payment_mode'].id : null,
            expense_type: item['expense_type'] ? item['expense_type'] : 1,
            is_driver_paid:item['is_driver_paid']?true:false,
            is_expense: item['is_expense'],
            expense_status: item['expense_status'],
            expense_payment_amount: item['expense_payment_amount'],
            expense_bill_no: item['expense_bill_no'],
            expense_bill_date: item['expense_bill_date'],
            expense_amount: item['expense_amount'],
            bill_created: item['bill_created'] ? item['bill_created'] : false,
            employee:item['employee_id']?item['employee_id']:null,
            tax:item['tax']?item['tax']['id']:null

          })
        }
      });
    }
    this._dataService.transporterreduceChargeData = chargeDataToSave;
    setTimeout(() => {
      this.selectedTab = 'vp-charge-reduce-bill';
    }, 100);
  }

  setPartyReduceBill() {
    let chargesdata = [];
    let chargeDataToSave = [];
    chargesdata = this.showEditPopup.data['party_reduce_bill_charges'];
    const id = this.showEditPopup.extras.id;
    chargesdata = [getObjectFromListByKey('id', id, chargesdata)]
    if (chargesdata.length > 0) {
      chargesdata.forEach(item => {
        if (item) {
          chargeDataToSave.push({
            amount: item.amount,
            date: item.date,
            amount_before_tax:item.amount_before_tax,
            tax:item['tax']?item['tax']['id']:null,
            id: item.id,
            type: item['type'].id
          })
        }
      });
    }
    this._dataService.reduceChargeData = chargeDataToSave;
    this._companyTripGetApiService.getStaticOptions(staticOptionObject => {
      this.chargedReducedBillType = staticOptionObject.chargedReducedBillType
      this.selectedTab = 'party-charge-reduce-bill';
    });
  }

  setDriverAdvance() {
    this._dataService.partyAdvanceDataDeriver = this.showEditPopup.data['customer_driver_allowance']
    this.selectedTab = 'driver-advance'
  }

  setFuelAdvance() {
    this._dataService.partyAdvanceFuelData = this.showEditPopup.data['fuel_advances']
    this.selectedTab = 'fuel-advance'
  }

  setFuelParty() {
    this.isSingleEntry = this.showEditPopup.extras.id ? true : false;
    if (this.isSingleEntry) {
      this._dataService.selfFuelData = [getObjectFromListByKey('id', this.showEditPopup.extras.id, this.showEditPopup.data['fuel_self'])]
    } else {
      this._dataService.selfFuelData = this.showEditPopup.data['fuel_self']
    }
    this._companyTripGetApiService.getClientExpenseAccounts(accountListObjCb => { this.advanceClientAccountList = accountListObjCb.advanceClientAccountList; });
    this.selectedTab = 'fuel-bill'
  }

  setPartyAdvance() {
    this._dataService.advanceData = this.showEditPopup.data['party_advances']
    this._companyTripGetApiService.getClientExpenseAccounts(accountListObjCb => { this.advanceClientAccountList = accountListObjCb.advanceClientAccountList; });
    this.selectedTab = 'party-advance'
  }

  setVpAdvance() {
    this._dataService.vehicleProvideradvanceData = this.showEditPopup.data['vp_advances']
    this._companyTripGetApiService.getClientExpenseAccounts(accountListObjCb => { this.advanceClientAccountList = accountListObjCb.advanceClientAccountList; });
    this.selectedTab = 'vp-advance'
  }

  setDriverAllowance() {
    this._dataService.selfDriverData = this.showEditPopup.data['driver_allowances']
    this._companyTripGetApiService.getAccounts(this.accountType, accountList => { this.accountList = accountList });
    this._companyTripGetApiService.getEmployeeList(employeeList => {
      this.employeeList = employeeList;
      this.driverList = filterDriver(this.employeeList);
      this.helperList = filterHelper(this.employeeList);
    });
    this.selectedTab = 'driver-allowance'
  }

  selectedType(type) {
    let popup = [];
    popup = popupTripArray.filter(item => item.value == type);
    if (popup.length) {
      this.selectionType = popup[0].label;
    } else {
      this.selectionType = type;
    }
    switch (type) {

      case 'client-vehicle-freights':
        this.selectedTab = 'client-vehicle-freights';
        this.showEditPopup.extras.showClientFreights = true;
        this.showEditPopup.extras.showVehicleFreights = true;
        this.showEditPopup.extras.showEndTripInputs = true;
        break;

      case 'client-freights':
        this.selectedTab = 'client-freights';
        this.workOrndeName = cloneDeep(this.showEditPopup.extras.id);
        if (this.workOrndeName) {
          this.getWorkorderDropDownList(this.showEditPopup.data['customerId'])
        }
        setTimeout(() => {
          this.workOrderClientFrightData.next(this.showEditPopup.data['revenue']['client_freight'][0])
          this.isDisableBillingTypes = this.showEditPopup.data['revenue']['client_freight'][0].is_billing_editable
        }, 100);
        this.showEditPopup.extras = { showClientFreights: true }
        break;

      case 'vehicle-freights':
        this.selectedTab = 'vehicle-freights';
        setTimeout(() => {
          this.workOrderClientFrightData.next(this.showEditPopup.data['expense']['vehicle_freight'][0])
        }, 100);
        this.showEditPopup.extras = { showVehicleFreights: true }
        break;

      case 'other-expenses':
        this.setOtherExpenses();
        break;

      case 'party-charge-bill':
        this.setPartyChargeBill()
        break;

      case 'vp-charge-bill':
        this.setVpChargeBill()
        break;

      case 'vp-charge-reduce-bill':
        this.setVpReduceBill();
        break;

      case 'party-charge-reduce-bill':
        this.setPartyReduceBill();
        break;

      case 'driver-advance':
        this.setDriverAdvance();
        break;

      case 'fuel-advance':
        this.setFuelAdvance();
        break;

      case 'fuel-bill':
        this.setFuelParty();
        break;

      case 'party-advance':
        this.setPartyAdvance();
        break;

      case 'vp-advance':
        this.setVpAdvance();
        break;

      case 'driver-allowance':
        this.setDriverAllowance();
        break;

      case 'upload-pod':
        this.selectedTab = 'upload-pod'
        break;

      default:
        break;
    }

  }

  // party add to bill charges
  addDataFromChild(data: outputdata, type) {
    this.payloadData = cloneDeep(data.allData);
    this.isFormValid = data.isFormValid;
    if (type == "selfDriver") {
      if (this.payloadData.length > 0) {
        let selfDriver = [];
        selfDriver = this.payloadData
        selfDriver.forEach(ele => {
          if (ele['account'] == "paid_by_driver") {
            ele['is_driver_paid'] = true;
            ele['account'] = null;
          } else {
            ele['is_driver_paid'] = false;
          }
        });
        this.payloadData = selfDriver;
      }

    }

    if (type == "charge") {
      if (this.payloadData.length > 0) {
        let chargeData = [];
        chargeData = this.payloadData
        chargeData.forEach(ele => {
          if (ele['expense_payment_mode'] == "paid_By_Driver") {
            ele['is_driver_paid'] = true;
            ele['expense_payment_mode'] = null;
          } else {
            ele['is_driver_paid'] = false;
          }
        });
        this.payloadData = chargeData;
      }

    }

    if (type == "otherExpense") {
      if (data.allData.length > 0) {
        let otherExpense = [];
        otherExpense = cloneDeep(data.allData);
        otherExpense.forEach(ele => {
          if (ele['payment_mode'] == "paid_By_Driver") {
            ele['is_driver_paid'] = true;
            ele['payment_mode'] = null;
          } else {
            ele['is_driver_paid'] = false;
          }
        });
        this.payloadData = otherExpense
      }
    }
    if (type == "selfFuel") {
      if (data.allData.length > 0) {
        let selfFuel = cloneDeep(data.allData)
        selfFuel.forEach(ele => {
          if (ele['payment_mode'] == "paid_By_Driver") {
            ele['is_driver_paid'] = true;
            ele['payment_mode'] = null;
          } else {
            ele['is_driver_paid'] = false;
          }
        });
        this.payloadData = selfFuel
      }
    }

  }

  allDataServiceClaer() {
    this._dataService.partychargeData = [];
    this._dataService.otherExpenseData = [];
    this._dataService.selfFuelData = [];
    this._dataService.partyAdvanceFuelData = [];
    this._dataService.partyAdvanceDataDeriver = ''
    this._dataService.chargeData = [];
    this._dataService.reduceChargeData = [];
    this._dataService.transporterreduceChargeData = [];
    this._dataService.advanceData = [];
  }

  onClickCancel() {
    this._popupBodyScrollService.popupHide();
    this.allDataServiceClaer();
    this.clearValidations();
    this.dataFromEdit.emit(false);
    this.showEditPopup.show = false;
  }

  clearValidations() {
    this.isFormValid = true;
    this.payloadData = [];
    this.showError = false;
    this.selectedTab = '';
    this.isSingleEntry = false;
  }

  onClickSave(forceSave: boolean = false) {
    this._popupBodyScrollService.popupHide();
    setTimeout(() => {
      switch (this.selectedTab) {
        case 'party-charge-bill':
          this.showError = !this.isFormValid;
          this.isChargeAddToBillFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              party_add_bill_charges: this.payloadData[0],
            }

            if (this.returnData) {
              this.dataFromEdit.emit({
                party_add_bill_charges: this.payloadData,
              })
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            } else {

              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, this.updateCharges ? 'onlycharges' : 'charges').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
                this.allDataServiceClaer();
                this.clearValidations();
              })

            }

          }
          break;

        case 'vp-charge-reduce-bill':
          this.showError = !this.isFormValid;
          this.isVehicleReduceToBillFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              vp_reduce_bill_charges: this.payloadData[0],
            }
            if (this.returnData) {
              this.dataFromEdit.emit({
                vp_reduce_bill_charges: this.payloadData,
              })
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            } else {

              
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, this.updateCharges ? 'onlycharges' : 'charges').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
                this.allDataServiceClaer();
                this.clearValidations();
              })
            }
          }
          break;

        case 'party-charge-reduce-bill':
          this.showError = !this.isFormValid;
          this.isChargeReduceToBillFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              party_reduce_bill_charges: this.payloadData[0],
            }
            if (this.returnData) {
              this.dataFromEdit.emit({
                party_reduce_bill_charges: this.payloadData,
              })
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            } else {

              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, this.updateCharges ? 'onlycharges' : 'charges').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
                this.allDataServiceClaer();
                this.clearValidations();
              })

            }

          }
          break;

        case 'fuel-bill':
          this.showError = !this.isFormValid;
          this.isSelfFuelValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              fuel_self: this.payloadData,
              is_single_entry: this.isSingleEntry
            }
            if (this.returnData) {
              this.dataFromEdit.emit(payload)
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            } else {

              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'self_fuels').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
                this.allDataServiceClaer();
                this.clearValidations();
              })
            }

          }
          break;

        case 'vp-charge-bill':
          this.showError = !this.isFormValid
          this.isVehicleAddToBillFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              vp_add_bill_charges: this.payloadData[0],
            }
            if (this.returnData) {
              this.dataFromEdit.emit({
                vp_add_bill_charges: this.payloadData,
              })
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            } else {
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, this.updateCharges ? 'onlycharges' : 'charges').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
                this.allDataServiceClaer();
                this.clearValidations();
              })
            }
          }
          break;

        case 'client-freights':
          this.showError = !this.isFormValid;
          this.isClientFrightValid.next(this.isFormValid);
          if (this.isFormValid) {
            const status = this.validateFreightWithWorkOrderQuantity(this.payloadData, forceSave)
            if (status) {
              let payload = {}
              payload['client_freights'] = [this.payloadData];
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'freights').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
                this.allDataServiceClaer();
                this.clearValidations();
              })
            }

          }
          break;

        case 'client-vehicle-freights':
          this.showError = !this.isFormValid;
          this.isClientFrightValid.next(this.isFormValid);
          if (this.isFormValid) {
            const status = this.validateFreightWithWorkOrderQuantity(this.payloadData, forceSave)
            if (status) {
              let payload = this.payloadData
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'freights').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
                this.allDataServiceClaer();
                this.clearValidations();
              })
            }
          }
          break;

        case 'vehicle-freights':
          this.showError = !this.isFormValid;
          this.isClientFrightValid.next(this.isFormValid);
          if (this.isFormValid) {
            let payload = {}
            payload['vehicle_freights'] = [this.payloadData];
            this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'freights').subscribe(response => {
              this.dataFromEdit.emit(true)
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            })
          }
          break;

        case 'driver-advance':
          this.showError = !this.isFormValid;
          this.isSelfDriverFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = this.payloadData[0]
            if (this.returnData) {
              this.dataFromEdit.emit(payload)
              this.showEditPopup.show = false;
            } else {
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'allowances').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
              })
            }
          }
          break;

        case 'driver-allowance':
          this.showError = !this.isFormValid
          if (this.isFormValid) {
            let payload = { driver_allowances: this.payloadData }
            this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'allowances').subscribe(response => {
              this.dataFromEdit.emit(true)
              this.showEditPopup.show = false;
            })
          }
          break;

        case 'fuel-advance':
          this.showError = !this.isFormValid;
          this.isPartyAdvanceFuelFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              fuel_advances: this.payloadData,
            }

            if (this.returnData) {
              this.dataFromEdit.emit(payload)
              this.showEditPopup.show = false;
            } else {
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'advance_fuels').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
              })
            }
          }
          break;

        case 'party-advance':
          this.showError = !this.isFormValid;
          this.isPartyAdvanceFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              party_advances: this.payloadData,
            }

            if (this.returnData) {
              this.dataFromEdit.emit(payload)
              this.showEditPopup.show = false;
            } else {
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'party_advances').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
              })
            }
          }
          break;


        case 'vp-advance':
          this.showError = !this.isFormValid;
          this.isVehicleAdvanceFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              vp_advances: this.payloadData,
            }
            if (this.returnData) {
              this.dataFromEdit.emit(payload)
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            } else {
              this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'vp_advances').subscribe(response => {
                this.dataFromEdit.emit(true)
                this.showEditPopup.show = false;
              })
            }
          }
          break;

        case 'other-expenses':
          this.showError = !this.isFormValid;
          this.isOtherExpenseFormValid.next(this.isFormValid)
          if (this.isFormValid) {
            let payload = {
              other_expenses: this.payloadData,
            }
            this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'expenses').subscribe(response => {
              this.dataFromEdit.emit(true)
              this.showEditPopup.show = false;
              this.allDataServiceClaer();
              this.clearValidations();
            })
          }
          break;

        case 'upload-pod':
          this.showError = !this.isFormValid
          if (this.isFormValid) {
            let payload = this.payloadData
            this.newTripService.putNewTripAdd(this.showEditPopup.data['id'], payload, 'pod_upload').subscribe(response => {
              this.dataFromEdit.emit(true)
              this.showEditPopup.show = false;
              this.clearValidations();
            })
          }
          break;

        default:
          break;
      }
    }, 100);

  }

  confirmWorkOrderButton($event) {
    if (!$event) return
    this.onClickSave(true);
  }

  validateFreightWithWorkOrderQuantity(data, forceSave) {
    if (forceSave) return true
    if (this.workOrndeName && !this.workOrderDetails['is_trip']) {
      const remainingBalance = this.workOrderDetails['total_units'] - this.workOrderDetails['utilized_units']
      const postTotalUnits = data.total_units;
      const status = showPopUpMsgForWorkOrderQuantity(remainingBalance, postTotalUnits)
      if (status) {
        this.popupWorkOrderInputData = status;
        return false
      }
    }
    return true
  }

  getWorkorderDropDownList(id) {
    this._newTripService.getWorkorderDropDown(id).subscribe(resp => {
      this.workOrderList = resp['result'];
      this.workOrderDetails = this.workOrderList.filter(workorder => workorder.workorder_no == this.workOrndeName)[0]
    });
  }
}
