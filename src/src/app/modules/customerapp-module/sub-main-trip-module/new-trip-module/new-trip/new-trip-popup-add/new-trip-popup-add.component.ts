import { NewTripDataService } from '../new-trip-data.service';
import { NewTripService } from '../../../../api-services/trip-module-services/trip-service/new-trip-service';
import { CompanyTripGetApiService } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { filterDriver, filterHelper } from '../../../../revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-utils';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { BehaviorSubject } from 'rxjs';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { popupOverflowService } from 'src/app/modules/customerapp-module/api-services/auth-and-general-services/popup-overflow.service';
import { cloneDeep } from 'lodash';
export interface outputdata {
  allData: Array<[]>,
  isFormValid: boolean
}

@Component({
  selector: 'app-new-trip-popup-add',
  templateUrl: './new-trip-popup-add.component.html',
  styleUrls: ['./new-trip-popup-add.component.scss']
})
export class NewTripPopupAddComponent implements OnInit {
  activeTab = 1;
  activeAdvanceTab = 1;
  chargeAddToBillAdndReduceTab = 1;
  activeFuelTab = 1;
  activeFuelTabDriver = 1;
  vehicleproviderAddToBillAdndReduceTab = 1;
  chargeActiveTab = 1;
  isTransporterTrip = false;
  partyListVendor = [];
  advanceClientAccountList = [];
  isFuelSelfValid = true;
  allData = {};
  allFormValid = {}
  fuelSelfData = [];
  tripEmployeeTypeList = [];
  driverList = [];
  helperList = [];
  accountList = [];
  employeeList = [];
  expenseAccountList = [];
  expenseTypeList = [];
  chargedAddBillType = [];
  chargedReducedBillType = [];
  vendorList=[];
  KEY = 'vehicle_trip';
  companyAdvance = {
    cash_op: false,
    cash_view: false,
    fuel_op: false,
    fuel_view: false,
    batta_op: false,
    batta_view: false,
    fuel_rc_op: false,
    fuel_rc_view: false,
    cash_rc_op: false,
    cash_rc_view: false,
  }
  showError = {};
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
  accountType = new ValidationConstants().accountType.join(',');
  displayDriverAdvance: boolean = true;
  hidePartyBillCharge: boolean = false;
  hideVPBillCharge: boolean = false;
  driverId ='';
  employeeType =new ValidationConstants().EMPLOYEETYPEDRIVERID;
  popupInputDataAssignDriver = {
    'msg': '',
    'type': 'warning-driver-allowance',
    'show': false,
  }
  @Input()  showAddPopup;
  @Input()  isMarketVehicleSlip:boolean = false;
  @Input() isClientSectionDisabled: boolean = false;
  @Input() isFreightSectionDisable: boolean = false;
  @Input() isDriver: boolean = true;
  @Input() returnData: boolean = false;
  @Input() isAddExpense : boolean = true;
  @Output() outPutData = new EventEmitter<any>()
  constructor(private _companyTripGetApiService: CompanyTripGetApiService, private _dataService: NewTripDataService
    , private newTripService: NewTripService, private _advances: SettingSeviceService,private _partyService:PartyService,
    private _popupBodyScrollService:popupOverflowService
  ) { }

  ngOnInit() {
    this.setAllError();
    this.clearDataService();
    this.getPrefrences();
    this._partyService.getPartyList('0', '1').subscribe((response) => {
			this.vendorList = response.result;
		});
    this._companyTripGetApiService.getPartyTripDetails('0,1','1',partyList=>{this.partyListVendor =partyList});
    this._companyTripGetApiService.getClientExpenseAccounts(accountListObjCb => { this.advanceClientAccountList = accountListObjCb.advanceClientAccountList; });
    this._companyTripGetApiService.getStaticOptions(staticOptionObject => {
      // this.unitOptionList=staticOptionObject.unitOptionList;
      this.tripEmployeeTypeList = staticOptionObject.tripEmployeeTypeList;
      // this.paymentStatus =staticOptionObject.paymentStatus;
      this.expenseTypeList = staticOptionObject.expenseType;
      this.chargedAddBillType = staticOptionObject.chargedAddBillType
      this.chargedReducedBillType = staticOptionObject.chargedReducedBillType
    });
    this._companyTripGetApiService.getEmployeeList(employeeList => {
      this.employeeList = employeeList;
      this.driverList = filterDriver(this.employeeList);
      this.helperList = filterHelper(this.employeeList);
    });
    this._companyTripGetApiService.getexpenseAccountList(expenseAccountList => { this.expenseAccountList = expenseAccountList });
    this._companyTripGetApiService.getAccounts(this.accountType, accountList => { this.accountList = accountList });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setActiveTab(changes['showAddPopup']['currentValue']['type']);
    this.isTransporterTrip = changes['showAddPopup']['currentValue']['data'].is_transporter
    this.displayDriverAdvance = changes['showAddPopup']['currentValue']['data'].customer_driver_allowance == 0
    this.chargeTab();
  }

  onOkButtonClick() {
    this._popupBodyScrollService.popupHide();
    setTimeout(() => {
      switch (this.showAddPopup.type) {
        case 'fuel':
          this.showError['isFuelSelfValid'] = this.allFormValid['isFuelSelfValid']
          this.showError['isFuelAdvanceValid'] = this.allFormValid['isFuelAdvanceValid']
          this.isSelfFuelValid.next(this.allFormValid['isFuelSelfValid']);
          this.isPartyAdvanceFuelFormValid.next(this.allFormValid['isFuelAdvanceValid'])
          if (this.allFormValid['isFuelSelfValid'] && this.allFormValid['isFuelAdvanceValid']) {
            let payload = {
              fuel_advances: this.allData['fuelAdvanceData'],
              fuel_self: this.allData['fuelSelfData'],
            }
            this.newTripService.postTripType(this.showAddPopup.data['id'], payload, 'fuels').subscribe(response => {
              this.allFormValid = {};
              this.showError = {}
              this.outPutData.emit(true)
              this.showAddPopup.show = false;
              this.clearDataService();
            })
          }
          break;

        case 'allowance':
          this.showError['isselfDriver'] = this.allFormValid['isselfDriver'];
          this.isSelfDriverFormValid.next(this.allFormValid['isselfDriver']);
          if (this.allFormValid['isselfDriver']) {
            let payload = {
              driver_allowances: this.allData['selfDriver']
            }
            if (this.allData['dataFromDriverAdvance']) {
              payload['customer_driver_allowance'] = this.allData['dataFromDriverAdvance'][0].customer_driver_allowance
            }

            if(!this.showAddPopup.data['c_driver']){
              this.checkDriverAllowances(this.allData['selfDriver'])
            }else{
              this.driverAllowancesAPI(payload)
            }
          }
          break;

        case 'others':
          this.showError['isFromTripOthersValid'] = this.allFormValid['isFromTripOthersValid']
          this.isOtherExpenseFormValid.next(this.allFormValid['isFromTripOthersValid'])
          if (this.allFormValid['isFromTripOthersValid']) {
            let payload = {
              other_expenses: this.allData['dataFromTripOthers'],
            }
            this.newTripService.putNewTripAdd(this.showAddPopup.data['id'], payload, 'expenses').subscribe(response => {
              this.allFormValid = {};
              this.showError = {}
              this.outPutData.emit(true)
              this.showAddPopup.show = false;
              this.clearDataService();
            })
          }
          break;

        case 'advance':
          this.showError['ispartyAdvanceDetailsValid'] = this.allFormValid['ispartyAdvanceDetailsValid'];
          this.showError['isvehicleAdvanceValid'] = this.allFormValid['isvehicleAdvanceValid'];
          this.isPartyAdvanceFormValid.next(this.allFormValid['ispartyAdvanceDetailsValid']);
          this.isVehicleAdvanceFormValid.next(this.allFormValid['isvehicleAdvanceValid']);
          if (this.allFormValid['ispartyAdvanceDetailsValid'] && this.allFormValid['isvehicleAdvanceValid']) {
            let payload = {
              vp_advances: this.allData['vehicleAdvance'],
              party_advances: this.allData['partyAdvanceDetails'],
            }
            this.newTripService.postTripType(this.showAddPopup.data['id'], payload, 'advances').subscribe(response => {
              this.allFormValid = {};
              this.showError = {}
              this.outPutData.emit(true)
              this.showAddPopup.show = false;
              this.clearDataService();
            })
          }
          break;

        case 'charge':
          this.showError['ispartyAddToBillValid'] = this.allFormValid['ispartyAddToBillValid']
          this.showError['ispartyReduceBillValid'] = this.allFormValid['ispartyReduceBillValid']
          this.showError['isVehicleProviderBillChargeValid'] = this.allFormValid['isVehicleProviderBillChargeValid']
          this.showError['isvendorReduceBillValid'] = this.allFormValid['isvendorReduceBillValid']
          this.isChargeAddToBillFormValid.next(this.allFormValid['ispartyAddToBillValid']);
          this.isChargeReduceToBillFormValid.next(this.allFormValid['ispartyReduceBillValid']);
          this.isVehicleAddToBillFormValid.next(this.allFormValid['isVehicleProviderBillChargeValid']);
          this.isVehicleReduceToBillFormValid.next(this.allFormValid['isvendorReduceBillValid']);

          if (this.allFormValid['ispartyAddToBillValid'] && this.allFormValid['ispartyReduceBillValid'] && this.allFormValid['isVehicleProviderBillChargeValid'] && this.allFormValid['isvendorReduceBillValid']) {
            let payload = {
              party_add_bill_charges: this.allData['partyAddToBill'],
              party_reduce_bill_charges: this.allData['partyReduceBill'],
              vp_add_bill_charges: this.allData['vehicleProviderAddToBill'],
              vp_reduce_bill_charges: this.allData['vendorReduceBill'],
            }

            if (this.returnData) {
              this.allFormValid = {};
              this.showError = {}
              this.outPutData.emit(payload)
              this.showAddPopup.show = false;
              this.clearDataService();
            } else {
              this.newTripService.putNewTripAdd(this.showAddPopup.data['id'], payload, 'charges').subscribe(response => {
                this.allFormValid = {};
                this.showError = {}
                this.outPutData.emit(true)
                this.showAddPopup.show = false;
                this.clearDataService();
              })
            }


          }
          break;

        case 'pod':
          let payload = this.allData['uploadAttachment']
          payload['is_pod'] = true;
          this.newTripService.putNewTripAdd(this.showAddPopup.data['id'], payload, 'document_upload').subscribe(response => {
            this.allFormValid = {};
            this.showError = {}
            this.outPutData.emit(true)
            this.showAddPopup.show = false;
            this.clearDataService();
          })
          break;

        default:
          break;
      }
    }, 100);


  }

  cancelButtonClick() {
    this.outPutData.emit(false);
    this.showAddPopup.show = false;
    this.clearDataService();
    this._popupBodyScrollService.popupHide()
  }
  clearDataService() {
    this._dataService.selfDriverData = [];
    this._dataService.partyAdvanceDataDeriver = '';
    this._dataService.selfFuelData = [];
    this._dataService.partyAdvanceFuelData = [];
    this._dataService.otherExpenseData = [];
    this._dataService.advanceData = [];
    this._dataService.vehicleProvideradvanceData = [];
    this._dataService.chargeData = [];
    this._dataService.partychargeData = [];
    this._dataService.reduceChargeData = [];
    this._dataService.transporterreduceChargeData = [];
  }

  selfFuelData(data: outputdata) {
    this.allFormValid['isFuelSelfValid'] = data.isFormValid;
    this.allData['fuelSelfData'] =cloneDeep(data.allData);
    if (this.allData['fuelSelfData'].length > 0) {
      this.allData['fuelSelfData'].forEach(ele => {
        if (ele['payment_mode'] == "paid_By_Driver") {
          ele['is_driver_paid'] = true;
          ele['payment_mode'] = null;
        }
      });
    }
  }

  partyAdvance(data: outputdata) {
    this.allFormValid['isFuelAdvanceValid'] = data.isFormValid
    this.allData['fuelAdvanceData'] = data.allData
  }

  setAllError() {
    this.allFormValid['isFuelSelfValid'] = true;
    this.allFormValid['isFuelAdvanceValid'] = true;
    this.allFormValid['isselfDriver'] = true;
    this.allFormValid['isdataFromDriverAdvance'] = true;
    this.allFormValid['isFromTripOthersValid'] = true;
    this.allFormValid['ispartyAdvanceDetailsValid'] = true;
    this.allFormValid['isvehicleAdvanceValid'] = true;
    this.allFormValid['ispartyAddToBillValid'] = true;
    this.allFormValid['ispartyReduceBillValid'] = true;
    this.allFormValid['isVehicleProviderBillChargeValid'] = true;
    this.allFormValid['isvendorReduceBillValid'] = true;
    this.setDisplayError();
  }

  setDisplayError() {
    this.showError['isFuelSelfValid'] = true;
    this.showError['isFuelAdvanceValid'] = true;
    this.showError['isselfDriver'] = true;
    this.showError['isdataFromDriverAdvance'] = true;
    this.showError['isFromTripOthersValid'] = true;
    this.showError['ispartyAdvanceDetailsValid'] = true;
    this.showError['isvehicleAdvanceValid'] = true;
    this.showError['ispartyAddToBillValid'] = true;
    this.showError['ispartyReduceBillValid'] = true;
    this.showError['isVehicleProviderBillChargeValid'] = true;
    this.showError['isvendorReduceBillValid'] = true;
  }

  selfDriver(data: outputdata) {
    this.allFormValid['isselfDriver'] = data.isFormValid
    this.allData['selfDriver'] =cloneDeep(data.allData);
    if (this.allData['selfDriver'].length > 0) {
      this.allData['selfDriver'].forEach(ele => {
        if (ele['account'] == "paid_by_driver") {
          ele['is_driver_paid'] = true;
          ele['account'] = null;
        }
      });
    }
  }

  dataFromTripOthers(data: outputdata) {
    this.allFormValid['isFromTripOthersValid'] = data.isFormValid
    this.allData['dataFromTripOthers'] = cloneDeep(data.allData);
    if (this.allData['dataFromTripOthers'].length > 0) {
      this.allData['dataFromTripOthers'].forEach(ele => {
        if (ele['payment_mode'] == "paid_By_Driver") {
          ele['is_driver_paid'] = true;
          ele['payment_mode'] = null;
        }
      });
    }
  }
  partyAdvanceDetails(data: outputdata) {
    this.allFormValid['ispartyAdvanceDetailsValid'] = data.isFormValid
    this.allData['partyAdvanceDetails'] = data.allData
  }
  vehicleAdvance(data: outputdata) {
    this.allFormValid['isvehicleAdvanceValid'] = data.isFormValid
    this.allData['vehicleAdvance'] = data.allData
  }

  partyAddToBill(data: outputdata) {
    this.allFormValid['ispartyAddToBillValid'] = data.isFormValid
    this.allData['partyAddToBill'] = data.allData
  }

  partyReduceBill(data: outputdata) {
    this.allFormValid['ispartyReduceBillValid'] = data.isFormValid
    this.allData['partyReduceBill'] = data.allData
  }

  vehicleProviderAddToBill(data: outputdata) {
    this.allFormValid['isVehicleProviderBillChargeValid'] = data.isFormValid
    this.allData['vehicleProviderAddToBill'] = data.allData
  }

  vendorReduceBill(data: outputdata) {
    this.allFormValid['isvendorReduceBillValid'] = data.isFormValid
    this.allData['vendorReduceBill'] = data.allData
  }

  dataFromAtt(data: outputdata) {
    this.allData['uploadAttachment'] = data.allData
  }

  dataFromDriverAdvance(data: outputdata) {
    this.allFormValid['isdataFromDriverAdvance'] = data.isFormValid
    this.allData['dataFromDriverAdvance'] = [];
    this.allData['dataFromDriverAdvance'] = data.allData
  }

  setActiveTab(key) {
    switch (key) {
      case 'fuel':
        this.activeTab = 1;
        break;
      case 'allowance':
        this.activeTab = 2;
        break;
      case 'others':
        this.activeTab = 3;
        break;
      case 'charge':
      this.activeTab =4;
      if(this.isMarketVehicleSlip){
        this.chargeActiveTab = 2;
      }
      break;
      case 'advance':
        this.activeTab = 5;
        break;
      case 'pod':
        this.activeTab = 6;
        break;

      default:
        break;
    }
  }

  getPrefrences() {
    this._advances.getAdvances(this.KEY).subscribe(data => {
      this.companyAdvance = data['result'];
      this.tabSetting();
    })
  }


  tabSetting() {

    if ((!this.companyAdvance.fuel_op||this.isFreightSectionDisable) && this.isTransporterTrip) {
      this.activeFuelTab = 2;
    }

    if (!this.companyAdvance.cash_rc_op && this.isTransporterTrip) {
      this.activeAdvanceTab = 2;
    }
  }

  chargeTab() {
    if (this.isTransporterTrip && !this.isFreightSectionDisable && this.isClientSectionDisabled) {
      this.chargeActiveTab = 2;
    }

    const tripDetails = this.showAddPopup.data;
    this.hidePartyBillCharge = tripDetails['status'] >= 4;
    this.hideVPBillCharge = tripDetails['fl_status'] >= 6;
    if (!this.hideVPBillCharge) this.chargeActiveTab = 2;
    if (!this.hidePartyBillCharge) this.chargeActiveTab = 1;
    if(this.isMarketVehicleSlip){
      this.chargeActiveTab = 2;
    }
  }

  checkDriverAllowances(driverAllowances){
    let driverList=[];
    driverList =driverAllowances.filter(item=>item.employee_type ==this.employeeType);
    if(driverList.length){
      let driverDetails =  this.driverList.filter(item=>item.id ==driverList[0].employee)
      if(driverDetails.length){
        this.driverId = driverList[0].employee;
        let driverName=driverDetails[0].display_name
        this.popupInputDataAssignDriver.msg=`Please Note: ${driverName} is not assigned to this Trip.Do you want to Assign ${driverName} to this Trip ?`
        this.popupInputDataAssignDriver.show=true;
      }else{
        let payload = {
          driver_allowances: this.allData['selfDriver'],
          customer_driver_allowance: 0,
          to_add_driver_to_trip: false,
          driver_to_trip_id:''
        }
        this.driverAllowancesAPI(payload)
      }
    }else{
      let payload = {
        driver_allowances: this.allData['selfDriver'],
        customer_driver_allowance: 0,
        to_add_driver_to_trip: false,
        driver_to_trip_id:''
      }
      this.driverAllowancesAPI(payload)
    }
 }


 driverAllowancesAPI(payload){
  this.newTripService.postTripType(this.showAddPopup.data['id'], payload, 'allowances').subscribe(response => {
      this.allFormValid = {};
      this.showError = {}
      this.outPutData.emit(true)
      this.showAddPopup.show = false;
      this.clearDataService();
    })
 }

 assignDriver(isTrue:boolean){
  let payload = {
    driver_allowances: this.allData['selfDriver'],
    customer_driver_allowance: 0,
    to_add_driver_to_trip: true,
    driver_to_trip_id:this.driverId
  }
  if(!isTrue){
    payload.to_add_driver_to_trip=false;
    payload.driver_to_trip_id=''
  }
  this.driverAllowancesAPI(payload)
 }
}
