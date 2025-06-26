import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { CompanyTripGetApiService } from 'src/app/modules/customerapp-module/revenue-module/trip-module/company-vehicle-module/company-trip-class/company-trip-service.service';
import { ValidityDateCalculator, changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption, getObjectFromList, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { WorkOrderV2Service } from '../../../../api-services/trip-module-services/work-order-service/work-order-v2.service';
import { addErrorClass, setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScreenConstants, ScreenType, OperationConstants } from 'src/app/core/constants/data-analytics.constants';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { cloneDeep } from 'lodash';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { BehaviorSubject, Subject } from 'rxjs';
import { WorkOrderValidationsPopupComponent } from '../work-order-validations-popup/work-order-validations-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { SiteInspectionServiceService } from '../../../../api-services/trip-module-services/site-inspection-service/site-inspection-service.service';
import moment from 'moment';
import { CompanyServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-services.service';
import { getEmployeeObject } from 'src/app/modules/customerapp-module/master-module/employee-module/employee-utils';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { DeleteAlertComponent } from 'src/app/shared-module/delete-alert-module/delete-alert/delete-alert.component';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { PhoneCodesFlagService } from 'src/app/core/services/phone-code_flag.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-work-order-v2',
  templateUrl: './work-order-v2.component.html',
  styleUrls: ['./work-order-v2.component.scss']
})
export class WorkOrderV2Component implements OnInit, AfterViewInit, OnDestroy {
  addWorkOrder: FormGroup;
  apiError: string = '';
  partyList = [];
  gstin: string = '';
  showAddPartyPopup: any = { name: '', status: false };
  addDriverParams: any = {};
  partyNamePopup: string = '';
  vendor = false;
  billingParty = "Billing Party";
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  addInspecParams: any = {}
  partyType: any;
  initialDetails = {
    customer: getBlankOption(),
    expectedTenure: getBlankOption(),
    quotation: getBlankOption(),
    site_inspection_no: getBlankOption(),
    employee_in_charge: getBlankOption(),
    typeOfMovement: getBlankOption(),
    inspectionRequired: getBlankOption(),
    inspectionType: getBlankOption(),
    sow: getBlankOption(),
    contactName: {},
    countryCode: {},
    poc : getBlankOption(),
  }

  preFixUrl = '';
  expectedTenures = [];
  quotationsList = [];
  siteInspectionList = [];
  goThroughDetais = {
    show: false,
    url: "https://demo.arcade.software/jtCKag5YglEuHVFcLmd5?embed%22"
  }

  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  analyticsType = OperationConstants;
  customerDetails: any;
  isCustomerChanged = false;
  currency_type;
  isCatagorySelected = false;
  contactPersonList = [];
  workOrderId = ''
  workOrderDetails: any = null
  quotationDetails: any = null
  isFormValid = new BehaviorSubject(true);
  validationDetailsList: any[] = [];
  isApprovalConfigured: boolean;
  heading_text: string = '';
  is_Submit: boolean;
  type_of_save: any;
  areCertificatesExpired: boolean;
  gracePeriodExpired: any;
  creditLimit: any
  dataForSubmission: any;
  failedValidations = []
  totalValue: number=0;
  isSiteInspectionSelected: boolean = false;
  isQuotationSelected: boolean = false;
  isVehiclePermitExpired: boolean = false;
  isPermitNotFound: boolean = false;
  isVehicleDocExpired: boolean = false;
  isVehicleTyreExpired: boolean = false;
  isVehicleSubAssetExpired: boolean = false;
  rentalChargesArray;
  isZoneSelected: boolean = false;
  price_validationDetails: any;
  checkCreditLimit: boolean = true;
  iseditQuotationPresent = new Subject()
  rateCardQuotationApiValues: {};
  quotationExpiryDate: boolean;
  countryPhoneCodeList = [];
  vehicleCategiriesObj = {
    hasMultipleCategories: false,
    categories: []
  };
  vehicleAndDriverData: any = {
    vehicle: [],
    driver: [],
    customer: [],
    location: []
  };
  selectedVehiclesAndJobdates = [];
  documentExpiryData = new Subject();
  employeeList: any = [];
  workorderUnitStatus = {
    billing_type: 0,
    total_units: 0,
    utilized_units: 0,
    total_job_units: 0,
  }
  popupInputData = {
    'msg': '',
    'type': 'error',
    'show': false,
  };
  billingType = new NewTripV2Constants().WorkOrderbillingTypeList;
  locations = [];
  movementTypes = [
    {
      label: 'Import',
      value: '1'
    },
    {
      label: 'Export',
      value: '2'
    }, {
      label: 'Local',
      value: '3'
    },
    {
      label: 'Cross Border',
      value: '4'
    },
  ];
  inspectionRequired = [
    {
      label: 'No',
      value: 0
    },
    {
      label: 'Yes',
      value: 1
    }
  ];
  sowList = [
    {
      label: 'Pullout',
      value: 1,
      key : 'pullout'
    },
    {
      label: 'Deposit',
      value: 3,
      key : 'deposit'

    },
    {
      label: 'Pullout & Deposit',
      value: 4,
      key : 'pullout_deposit'

    },
    {
      label: 'Live Loading',
      value: 2,
      key : 'live_loading'

    }
  ]
  defaultPhoneFlag = {
    code: '',
    flag: ''
  }
  addInspectionApi = 'optionvalues/?key=inspection-type';
  isLocationValid = new Subject();
  isLocationChanged = true;
  isToMAndSoWEditable: boolean = true;
  inspectionType = [];
  isCustomerRateCardExisted: boolean;
  isPartyApproverRequired = false;
  isPartyApproverAvailable: boolean = true;
  partyApproverErrorMesg = {
    validation: 'Party Approver',
    message: 'Please add a Party Approver before proceeding',
    action_key: 'stop_so_create',
  }
  isLinkedClicked = false;
  commonRateCardvalues = {};
  pointOfContactsList = [];
  pocURL = '';
  pocParam = {};
  

  constructor(private _fb: FormBuilder,
    private _partyService: PartyService,
    private _companyTripGetApiService: CompanyTripGetApiService,
    private _commonservice: CommonService,
    private _workOrderV2Service: WorkOrderV2Service,
    private _route: Router,
    private route: ActivatedRoute,
    private _scrollToTop: ScrollToTop,
    private _analytics: AnalyticsService,
    private commonloaderservice: CommonLoaderService,
    private _quotationV2Service: QuotationV2Service,
    private _siteInspectionService: SiteInspectionServiceService,
    private dialog: Dialog,
    private _companyService: CompanyServices,
    private _phoneCodesFlagService: PhoneCodesFlagService,
    private apiHandler: ApiHandlerService,


  ) { }
  ngOnDestroy(): void {
    this.commonloaderservice.getShow()
  }

  ngOnInit(): void {
    this.defaultPhoneFlag = this._phoneCodesFlagService.phoneCodesFlag;
    this.initialDetails.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
    this._quotationV2Service.getEmployeeList(employeeList => {
      if (employeeList && employeeList.length > 0) {
        this.employeeList = employeeList;
      }
    })
    this.commonloaderservice.getHide();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.WORKORDER, this.screenType.ADD, "Navigated");
    this.buildTripForm();
    this.preFixUrl = getPrefix();
    this.getStaticValues();
    this.getValidationDetils();
    this.getPartyTripDetails();
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
  }


  ngAfterViewInit(): void {
    this.route.params.subscribe(pram => {
      if (pram['work_order_id']) {
        this.workOrderId = pram['work_order_id'];
        this.getWorkOrderDetails();
        this.getWorkorderUnits(this.workOrderId)
        this._commonservice.getVehicleCatagoryType().subscribe(resp => {
          this.vehicleCategiriesObj.categories = resp['result']['categories']
          this.vehicleCategiriesObj.hasMultipleCategories = resp['result']['has_multiple_categories']
          if ([0, 3].some(value => this.vehicleCategiriesObj.categories.includes(value))) {
            this.vehicleCategiriesObj.hasMultipleCategories = true
          }
        })
      } else {
        this.getWorkOrderNo();
        this.route.queryParamMap.subscribe((paramMap: ParamMap) => {
          this._commonservice.getVehicleCatagoryType().subscribe(resp => {
            this.vehicleCategiriesObj.hasMultipleCategories = resp['result']['has_multiple_categories']
            this.vehicleCategiriesObj.categories = resp['result']['categories']
            if ([0, 3].some(value => this.vehicleCategiriesObj.categories.includes(value))) {
              this.vehicleCategiriesObj.hasMultipleCategories = true
            }
            if (paramMap.keys.length) {
              if (paramMap.has('quotationData')) {
                this._commonservice.getVehicleCatagoryType().subscribe(resp => {
                  this.vehicleCategiriesObj.hasMultipleCategories = resp['result']['has_multiple_categories']
                  this.vehicleCategiriesObj.categories = resp['result']['categories']
                  if ([0, 3].some(value => this.vehicleCategiriesObj.categories.includes(value))) {
                    this.vehicleCategiriesObj.hasMultipleCategories = true
                  }
                  this.convertQuotationToSalesOrder(paramMap.get('quotationData'))
                })
              }
            } else {
              if (this.vehicleCategiriesObj.categories.includes(1)) {
                this.addWorkOrder.get('vehicle_category').setValue('1')
                this.getApprovalLevelDetails('', 1)
                this.isCatagorySelected = true;
                return
              }
              if (this.vehicleCategiriesObj.categories.includes(2)) {
                this.addWorkOrder.get('vehicle_category').setValue('2')
                this.getApprovalLevelDetails('', 2)
                this.isCatagorySelected = true;
                return
              }
              if (this.vehicleCategiriesObj.categories.includes(3) || this.vehicleCategiriesObj.categories.includes(0)) {
                this.addWorkOrder.get('vehicle_category').setValue('0')
                this.getApprovalLevelDetails('', 0);
                this.isCatagorySelected = true;
                return
              }
            }

          })

        })

      }
    })
  }

  handleEmployeeChange() {
    let empId = this.addWorkOrder.get('employee_in_charge').value;
    let empObj = getEmployeeObject(this.employeeList, empId);
    this.initialDetails.employee_in_charge = { label: empObj?.display_name, value: empId }

  }


  employeePatch(editSO) {
    if (editSO.employee_in_charge) {
      this.initialDetails.employee_in_charge['value'] = editSO.employee_in_charge.id;
      this.initialDetails.employee_in_charge['label'] = editSO.employee_in_charge.display_name;
      this.addWorkOrder.get('employee_in_charge').setValue(editSO.employee_in_charge.id);
    } else {
      this.initialDetails.employee_in_charge = getBlankOption();
    }
  }

  buildTripForm() {
    this.addWorkOrder = this._fb.group({
      customer: [null, [Validators.required]],
      workorder_no: ['', Validators.required],
      workorder_date: [new Date(dateWithTimeZone()), Validators.required],
      workstart_date: [new Date(dateWithTimeZone()), Validators.required],
      workend_date: [null, Validators.required],
      expected_tenure: [null, Validators.required],
      quotation: null,
      site_inspection_no: null,
      enquiry_no: '',
      vehicle_category: '',
      employee_in_charge: null,
      movement_expiry_cutoff_date: null,
      type_of_movement: null,
      no: '',
      date: null,
      no_of_containers: 0,
      is_inspection_required: 0,
      type_of_inspection: null,
      inspection_type: [],
      movement_sow: null,
      movement_contact_no: this._fb.group({
        flag: this.defaultPhoneFlag.flag,
        code: this.defaultPhoneFlag.code,
        number: ''
      }),
      movement_location: this._fb.group({
        lng: '',
        lat: '',
        name: '',
        alias: ''
      }),
      poc : null,
      movement_contact_name: "",

    })
  }

  getValidationDetils() {
    this._workOrderV2Service.getValidationDetails().subscribe((res) => {
      this.validationDetailsList = res['result'];
    })
  }

  getApprovalLevelDetails(latestBy: string = "", category) {
    this._workOrderV2Service.getApprovalLevelDetails(latestBy, category).subscribe((res) => {
      this.isApprovalConfigured = res['result'].is_approval_configured
      if (res['result'].approvals.find(ele => ele.id == "party_approver")) {
        this.isPartyApproverRequired = true
      }

    })
  }

  openGothrough() {
    this.goThroughDetais.show = true;
  }

  quotationSelected(id) {
    this.isCustomerChanged = true;
    this.isQuotationSelected = true;
    this.workOrderDetails = null;
    this.getQuotationDetails(id)
  }

  convertQuotationToSalesOrder(data) {
    let quotationDetails = JSON.parse(data)
    this.addWorkOrder.patchValue({
      customer: quotationDetails['customer']['id'],
      quotation: quotationDetails['quotation']['id'],
      vehicle_category: quotationDetails['vehicleCategory'],
    })
    this.getApprovalLevelDetails('', quotationDetails['vehicleCategory'])
    this.isCatagorySelected = true;
    this.quotationSelected(quotationDetails['quotation']['id'])
    this.initialDetails.customer = quotationDetails['customer']
    this.initialDetails.quotation = quotationDetails['quotation']
    this.getQuotationsList();
    this.getSiteInspectionList();
    this._commonservice.getStaticOptions('work-order-tenure').subscribe((response) => {
      this.expectedTenures = response.result['work-order-tenure']
      var in30Days = this.expectedTenures.filter((_) => _['label'] == "In 30 Days")[0]
      if (in30Days) {
        this.initialDetails.expectedTenure = { "label": in30Days['label'], "value": in30Days['id'] }
        this.addWorkOrder.get('expected_tenure').setValue(in30Days['id'])
        this.setWorkEndDate()
      }
    });
    this.getDocsExpiryLIst();
    this.getpartyDetails(quotationDetails['customer']['id'])
    if (quotationDetails['customer']['id']) {
      setTimeout(() => {
        let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == quotationDetails['customer']['id']))
        if (contactPersonList.length) {
          this.contactPersonList = contactPersonList[0].contacts
        }
      }, 1500);
    }
  }

  getpartyDetails(customer) {
    this._partyService.getPartyAdressDetails(customer).subscribe((response) => {
      if (isValidValue(response['result']?.party_approver)) {
        this.isPartyApproverAvailable = true
      } else {
        this.isPartyApproverAvailable = false
      }
    });
  }

  siteInspectionSelected(id) {
    this.isSiteInspectionSelected = true;
  }

  getQuotationDetails(id) {
    this._workOrderV2Service.getQuotationWorkorderDetails(id).subscribe(resp => {      
      this.quotationDetails = resp['result'];
      this.addWorkOrder.get('inspection_type').setValue([]);
      this.addWorkOrder.get('poc').setValue(resp['result']?.poc?.id);
      this.initialDetails.poc = { label : resp['result']?.poc?.display_name, value : resp['result']?.poc?.id };
      this.quotationExpiryDate = resp['result']?.is_validity_expired;
      this.addWorkOrder.get('enquiry_no').setValue(this.quotationDetails['ref_no'])
      this.isCustomerChanged = false;
      let typeMatched = this.movementTypes.find(ele => ele.label == this.quotationDetails['type_of_movement']);
      if (typeMatched) {
        this.initialDetails.typeOfMovement = typeMatched;
        this.addWorkOrder.get('type_of_movement').setValue(typeMatched?.value)
      }
      let employeematched = this.employeeList.find(ele => ele.id == this.quotationDetails['employee_in_charge']);
      if (employeematched) {
        this.initialDetails.employee_in_charge = { label: employeematched?.display_name, value: this.quotationDetails['employee_in_charge'] };
        this.addWorkOrder.get('employee_in_charge').setValue(this.quotationDetails['employee_in_charge'])
      }
      this.selectedVehiclesAndJobdates = [];
      this.getDocsExpiryLIst();
      this._workOrderV2Service.getPointOfContactsList(this.addWorkOrder.get('customer').value).subscribe((response) => {
        this.pointOfContactsList = response['result'];
       })
    });
  }




  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }

  openAddPartyModal($event, type) {
    if ($event) {
      if (type == 'client') {
        this.vendor = false;
      } else {
        this.vendor = true;
      }
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }
    else {
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true }
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
    this.vendor = false;

  }

  addPartyToOption($event) {
    if ($event.status && this.partyType == this.billingParty) {
      this.initialDetails.customer = { value: $event.id, label: $event.label };
      this.addWorkOrder.get('customer').setValue($event.id);
      this.getPartyTripDetails();
    }

  }


  getPartyTripDetails() {
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients']
    });
  }

  onvendorSelected() {
    this.quotationDetails = null;
    this.isCustomerChanged = true;
    this.isLinkedClicked = false;
    let customer = this.addWorkOrder.get('customer').value;
    this._partyService.getPartyAdressDetails(customer).subscribe((response) => {
      this.customerDetails = response['result']
      if (isValidValue(this.customerDetails?.party_approver)) {
        this.isPartyApproverAvailable = true
      } else {
        this.isPartyApproverAvailable = false
      }
      if (this.customerDetails.sales_person_name?.id) {
        this.addWorkOrder.get('employee_in_charge').patchValue(this.customerDetails.sales_person_name?.id);
        this.initialDetails.employee_in_charge = { label: this.customerDetails.sales_person_name?.name, value: this.customerDetails.sales_person_name?.id }

      }
    });
    if (customer) {
      let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == customer))
      if (contactPersonList.length) {
        this.contactPersonList = contactPersonList[0].contacts
      }

    }
    this.getQuotationsList();
    this.getSiteInspectionList();
    this.resetOnCustomerChange();
    setUnsetValidators(this.addWorkOrder, 'movement_sow', [Validators.nullValidator])
    if (Number(this.addWorkOrder.get('vehicle_category').value) == 4) {
      this.initialDetails.typeOfMovement = this.movementTypes[0]
      this.addWorkOrder.get('type_of_movement').setValue('1')
      this.addWorkOrder.get('no_of_containers').setValue(1)
      const typeOfMovement = this.addWorkOrder.get('type_of_movement').value
      if (Number(typeOfMovement) == 1 || typeOfMovement == 2) {
        setTimeout(() => {
          this.addWorkOrder.get('movement_sow').setValue(2);
          this.initialDetails.sow = this.sowList[3];
        }, 1000)
      }
    }
    if (Number(this.addWorkOrder.get('vehicle_category').value) == 0) {
      this.initialDetails.typeOfMovement = this.movementTypes[0]
      this.addWorkOrder.get('type_of_movement').setValue('1')
    }
    setTimeout(() => {
      this.isCustomerChanged = false;
    }, 100);
    this.selectedVehiclesAndJobdates = [];
    this.getDocsExpiryLIst();
    this.getPointOfContactsList(this.addWorkOrder.get('customer').value)
  }



  getQuotationsList() {
    let customer = this.addWorkOrder.get('customer').value;
    this._quotationV2Service.getQuotationListByPartyAndVehicleCatagory(customer, this.addWorkOrder.get('vehicle_category').value).subscribe((data) => {
      this.quotationsList = data.result['qos']
    })
  }

  getSiteInspectionList() {
    let customer = this.addWorkOrder.get('customer').value;
    this._siteInspectionService.getApprovedSiteInspection(customer, this.addWorkOrder.get('vehicle_category').value).subscribe((data) => {
      this.siteInspectionList = data.result
    })
  }

  addValueToPartyPopup(event, partyType) {
    if (event) {
      this.partyNamePopup = event;
      this.partyType = partyType;
    }
  }

  vehicleCatagoryChange(value) {
    this.quotationDetails = null
    this.isPartyApproverRequired=false;
    this.isPartyApproverAvailable = true;
    this.addWorkOrder.get('vehicle_category').setValue(value)
    this.isCatagorySelected = true;
    this.resetOnCatagoryChange();
    this.getApprovalLevelDetails('', value)
  }

  saveWorkOrder(type: string, heading, isSubmit) {
    let form = this.addWorkOrder;
    form.value['saving_as'] = type;
    this.heading_text = heading;
    this.is_Submit = isSubmit;
    form.value['workorder_date'] = changeDateToServerFormat(form.value['workorder_date'])
    form.value['workstart_date'] = changeDateToServerFormat(form.value['workstart_date'])
    form.value['workend_date'] = changeDateToServerFormat(form.value['workend_date'])
    if (Number(form.value['vehicle_category']) >= 0) {
      if (form.valid) {
        if (Number(form.value['vehicle_category']) === 0) {
          if (this.workOrderId) {
            let unitType = this.billingType.find(type => type.value == form.value['others']['billing'].freight_type).label
            if (form.value['others']['billing']['total_units'] < this.workorderUnitStatus.total_job_units) {
              this.popupInputData.show = true;
              this.popupInputData.msg = `Cannot reduce the Total ${unitType} as Jobs have been created for ${this.workorderUnitStatus.total_job_units} ${unitType}.`
            }
            else if (form.value['others']['billing']['total_units'] > this.workorderUnitStatus.total_units && this.workorderUnitStatus.total_units == this.workorderUnitStatus.total_job_units) {
              let unitType = this.billingType.find(type => type.value == form.value['others']['billing'].freight_type).label

              let message = ''
              message = `Your Sales Order of ${this.workorderUnitStatus.total_units} ${unitType} has been fulfilled. Are you sure you want to proceed?`
              const dialogRef = this.dialog.open(DeleteAlertComponent, {
                minWidth: '25%',
                data: {
                  message: message
                },
                closeOnNavigation: true,
                disableClose: true,
                autoFocus: false
              });
              let dialogRefSub = dialogRef.closed.subscribe((result: boolean) => {
                if (result) {
                  this.vehicleCatagoryOthers(cloneDeep(form.value))
                  this.checkingForvalidation();

                }
                dialogRefSub.unsubscribe();
              });


            } else {
              this.vehicleCatagoryOthers(cloneDeep(form.value))
              this.checkingForvalidation();
            }
          } else {
            this.vehicleCatagoryOthers(cloneDeep(form.value))
            this.checkingForvalidation();
          }

        }
        if (Number(form.value['vehicle_category']) === 1) {
          this.vehicleCatagoryCrane(cloneDeep(form.value))
          this.checkingForvalidation();
        }
        if (Number(form.value['vehicle_category']) === 2) {
          this.vehicleCatagoryAWP(cloneDeep(form.value))
          this.checkingForvalidation();
        }
        if (Number(form.value['vehicle_category']) === 4) {
          this.vehiclecategoryContainer(cloneDeep(form.value))
          this.checkingForvalidation();
        }
      } else {
        setAsTouched(form);
        this.isFormValid.next(form.valid)
        this._scrollToTop.scrollToTop();
        console.log(form)
      }
    }

  }

  confirmButton(e) {
  }

  saveApi(payload) {
    if (this.workOrderId) {
      this.apiHandler.handleRequest(this._workOrderV2Service.putWorkOrder(this.workOrderId, payload), 'Sales Order updated successfully!').subscribe(
        {
          next: (resp) => {
            this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.WORKORDER, this.screenType.EDIT, "workOrder Edited");
            this._route.navigate([this.preFixUrl + '/trip/work-order/details', resp.result])
          },
          error: () => {
            this.popupInputData['show'] = false;
            this.apiError = 'Failed to update Sales Order!';
            setTimeout(() => (this.apiError = ''), 3000);
          },
        }
      )
    } else {
      this.apiHandler.handleRequest(this._workOrderV2Service.postWorkOrder(payload), 'Sales Order added successfully!').subscribe(
        {
          next: (resp) => {
            this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.WORKORDER, this.screenType.ADD, "New workOrder Added");
            this._route.navigate([this.preFixUrl + '/trip/work-order/details', resp.result])
          },
          error: () => {
            this.popupInputData['show'] = false;
            this.apiError = 'Failed to add Sales Order!';
            setTimeout(() => (this.apiError = ''), 3000);
          },
        }
      );


    }

  }

  rateCardQuotationPreviousValues(event) {
    this.rateCardQuotationApiValues = event;
  }

  checkingForvalidation() {
    this.failedValidations = [];
    let stoppedValidations = [];
    let category = Number(this.addWorkOrder.get('vehicle_category').value);
    if (this.isApprovalConfigured) {
      let quotation = this.addWorkOrder.get('quotation').value;
      this.isQuotationSelected = isValidValue(quotation);
      this.validationDetailsList.forEach((data) => {
        if (data.validation_key.includes('customer_credit_limit')) {
          if (this.checkCreditLimit && Number(this.creditLimit) < Number(this.totalValue)) {
            this.failedValidations.push(data);
          }
          if (this.checkCreditLimit && Number(this.creditLimit) < Number(this.totalValue) && data.action_key === 'stop_so_create') {
            stoppedValidations.push(true)
          }
        }
        if (data.validation_key.includes('customer_document')) {
          if (this.areCertificatesExpired) {
            this.failedValidations.push(data);
          } if (this.areCertificatesExpired && data.action_key === 'stop_so_create') {
            stoppedValidations.push(true)
          }
        }
        if (data.validation_key.includes('customer_grace_period')) {
          if (this.gracePeriodExpired) {
            this.failedValidations.push(data);
          } if (this.gracePeriodExpired && data.action_key === 'stop_so_create') {
            stoppedValidations.push(true)
          }
        }
        if (data.validation_key.includes('quotation_no')) {
          if (!this.isQuotationSelected) {
            this.failedValidations.push(data);
          } if (!this.isQuotationSelected && data.action_key === 'stop_so_create') {
            stoppedValidations.push(true)
          }
        }
        if (data.validation_key.includes('quotation_validity')) {
          if (this.quotationExpiryDate) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_so_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_sub_assets')) {
          if (this.isVehicleSubAssetExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_tyre')) {
          if (this.isVehicleTyreExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_certificate')) {
          if (this.isVehicleDocExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_job_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if (data.validation_key.includes('vehicle_permit')) {
          if (data.condition_key === 'is_expired' && this.isVehiclePermitExpired) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_so_create') {
              stoppedValidations.push(true)
            }
          }
          if (data.condition_key === 'is_restricted' && this.isPermitNotFound) {
            this.failedValidations.push(data);
            if (data.action_key === 'stop_so_create') {
              stoppedValidations.push(true)
            }
          }
        }
        if ((category == 1 || category == 2) && data.validation_key.includes('customer_rate_card')) {
          if (!this.isCustomerRateCardExisted) {
            this.failedValidations.push(data);
          } if (!this.isCustomerRateCardExisted && data.action_key === 'stop_so_create') {
            stoppedValidations.push(true)
          }
        }
        if (data.validation_key.includes('site_inspection_no') && (category === 1 || category === 2)) {
          let site_inspection = this.addWorkOrder.get('site_inspection_no').value;
          if (isValidValue(site_inspection)) {
            this.isSiteInspectionSelected = true;
          } else {
            this.isSiteInspectionSelected = false;
          }
          if (!this.isSiteInspectionSelected) {
            this.failedValidations.push(data);
          } if (!this.isSiteInspectionSelected && data.action_key === 'stop_so_create') {
            stoppedValidations.push(true)
          }
        }
        if (data.validation_key.includes('price') && category != 0 && !(category > 2)) {
          if (data.value === 'Rate Card' && this.isZoneSelected) {
            this.rentalChargesArray.forEach(item => {

              if (Object.keys(this.rateCardQuotationApiValues).some(key => key === item.specification)) {
                let typeOfRateCard = this.rateCardQuotationApiValues['billing_type'] + '_rate_card';
                if (Object.keys(this.rateCardQuotationApiValues?.[item.specification]).includes(typeOfRateCard)) {
                  let fuel_Provision = this.rateCardQuotationApiValues['fuelProvision'];
                  let working_duration = this.rateCardQuotationApiValues['working_duration'];
                  let rateValue = this.rateCardQuotationApiValues[item.specification][typeOfRateCard][working_duration][fuel_Provision];
                  let additional_hours = this.rateCardQuotationApiValues[item.specification][typeOfRateCard][working_duration]['additional_hours'];
                  if (Number(item.rental_charge) < Number(rateValue) || Number(item.extra_hours) < Number(additional_hours) && !this.failedValidations.some(ele => ele.id === data.id)) {
                    this.failedValidations.push(data);
                    if (data.action_key === 'stop_so_create') {
                      stoppedValidations.push(true);
                    }
                  }
                }
              }
            });
          }
          if (data.value === 'Quotation' && category != 0 && !(category > 2) && this.isQuotationSelected) {
            this.rentalChargesArray.forEach(item => {
              if (Object.keys(this.rateCardQuotationApiValues).some(key => key === item.specification)) {
                let typeOfRateCard = this.rateCardQuotationApiValues['billing_type'] + '_quotation_rate_card';
                if (Object.keys(this.rateCardQuotationApiValues?.[item.specification]).includes(typeOfRateCard)) {
                  let fuel_Provision = this.rateCardQuotationApiValues['fuelProvision'];
                  let working_duration = this.rateCardQuotationApiValues['working_duration'];
                  let rateValue = this.rateCardQuotationApiValues[item.specification][typeOfRateCard][working_duration][fuel_Provision];
                  let additional_hours = this.rateCardQuotationApiValues[item.specification][typeOfRateCard][working_duration]['additional_hours'];
                  if (Number(item.rental_charge) < Number(rateValue) || Number(item.extra_hours) < Number(additional_hours) && !this.failedValidations.some(ele => ele.id === data.id)) {
                    this.failedValidations.push(data);
                    if (data.action_key === 'stop_so_create') {
                      stoppedValidations.push(true);
                    }
                  }
                }
              }
            });
          }
        }
        if (data.validation_key.includes('price') && data.value === 'Rate Card' && category == 4) {
          const handlingType = ['regular', 'couple', 'boggy', 'sideLoader', 'lowBed'];
          let freightData = this.dataForSubmission['container']['freights'][0]
          if(Number(freightData['freight_type']) == 11 && isValidValue(this.commonRateCardvalues) && (Number(this.dataForSubmission['type_of_movement'])==1 || Number(this.dataForSubmission['type_of_movement'])==2)){
            let scopeOfWork = this.sowList.find(ele => ele.value == Number(this.dataForSubmission['movement_sow'])).key
            handlingType.forEach((item) => {
              if (freightData.estimations[item]?.is_selected) {
                if (Number(freightData.estimations[item].rate) < Number(this.commonRateCardvalues[scopeOfWork][item]) && !this.failedValidations.some(ele => ele.id === data.id)) {
                  this.failedValidations.push(data);                  
                  if (data.action_key === 'stop_so_create') {
                    stoppedValidations.push(true);
                  }
                }
              }
            })
          }
        }
      })
      if (this.isPartyApproverRequired && !this.isPartyApproverAvailable) {
        this.failedValidations.push(this.partyApproverErrorMesg)
        stoppedValidations.push(true);
      }
      if (this.failedValidations.length > 0 && stoppedValidations.length > 0) {
        this.is_Submit = false;
        this.heading_text = 'Validation Failed';
        this.openValidationPopup(this.dataForSubmission)
      } else if (this.failedValidations.length > 0 && stoppedValidations.length == 0) {
        this.is_Submit = true;
        this.heading_text = 'Send Approval';
        this.dataForSubmission['saving_as'] = 'send_for_approval';
        this.openValidationPopup(this.dataForSubmission)
      } else if (this.failedValidations.length == 0 && this.is_Submit) {
        this.openValidationPopup(this.dataForSubmission)
      }
      else {
        this.dataForSubmission['approval_remark'] = ''
        this.saveApi(this.dataForSubmission)
      }
    } else {
      this.dataForSubmission['approval_remark'] = ''
      this.saveApi(this.dataForSubmission)
    }
  }

  openValidationPopup(formdata) {
    const dialogRef = this.dialog.open(WorkOrderValidationsPopupComponent, {
      data: {
        data: this.failedValidations,
        heading: this.heading_text,
        is_Submit: this.is_Submit
      },
      width: '500px',
      maxWidth: '90%',
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((item: any) => {
      if (isValidValue(item) && item.is_approved) {
        formdata['approval_remark'] = item.remarkValue
        this.saveApi(formdata)
      }
      dialogRefSub.unsubscribe();
    });
  }

  prepareRequest() {
    let form = this.addWorkOrder;

    return form.value
  }






  setWorkEndDate() {

    const expectedTenure = this.addWorkOrder.get('expected_tenure').value
    if (!expectedTenure) return
    let item = getObjectFromList(expectedTenure, this.expectedTenures);
    const workStartDate = this.addWorkOrder.get('workstart_date').value;
    if (!workStartDate) return

    this.addWorkOrder.get('workend_date').setValue(null);
    let da = ValidityDateCalculator(workStartDate, item.value);
    this.addWorkOrder.get('workend_date').setValue(da);
  }

  onWorkEndDateChange() {
    let item = this.expectedTenures.filter((item: any) => item.label == 'Custom')[0]
    this.initialDetails.expectedTenure = { label: item.label, value: item.id };
    this.addWorkOrder.get('expected_tenure').setValue(item.id)
  }

  getStaticValues() {
    this._commonservice.getStaticOptions('work-order-tenure').subscribe((response) => { this.expectedTenures = response.result['work-order-tenure'] });
  }

  getWorkOrderNo() {
    this._workOrderV2Service.getWorkOrderNo().subscribe((response) => {
      this.addWorkOrder.get('workorder_no').setValue(response.result.workorder)
    });
  }

  inspectionRequiredSelected() {
    let value = this.addWorkOrder.get('is_inspection_required').value
    this.addWorkOrder.get('inspection_type').setValue([]);
    this.addRemoveValidators(this.addWorkOrder, 'inspection_type', Number(value) == 1 ? [Validators.required] : [Validators.nullValidator]);
  }

  movementTypeChanged() {
    this.isLocationChanged = false;
    this.addWorkOrder.patchValue({
      no: '',
      date: null,
      no_of_containers: 0,
      is_inspection_required: 0,
      type_of_inspection: null,
      movement_sow: null,
      inspection_type: [],
      movement_expiry_cutoff_date: null,
    });
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
    this.addWorkOrder.get('movement_contact_no').patchValue({
      number: '',
      flag: this.defaultPhoneFlag.flag,
      code: this.defaultPhoneFlag.code,
    });
    this.initialDetails.sow = getBlankOption();
    this.initialDetails.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
    this.addWorkOrder.get('movement_location').reset();
    this.initialDetails.contactName = getBlankOption();
    this.addRemoveValidators(this.addWorkOrder, 'type_of_inspection', [Validators.nullValidator]);
    this.addRemoveValidators(this.addWorkOrder, 'inspection_type', [Validators.nullValidator]);
    this.inspectionRequiredSelected();
    setTimeout(() => {
      this.isLocationChanged = true;
    }, 100);
    const typeOfMovement = this.addWorkOrder.get('type_of_movement').value
    if (Number(this.addWorkOrder.get('vehicle_category').value) == 4) {
      this.addWorkOrder.get('no_of_containers').setValue(1)
      this.addWorkOrder.get('movement_expiry_cutoff_date').setValue(new Date(dateWithTimeZone()))
      if (Number(typeOfMovement) == 1 || typeOfMovement == 2) {
        setUnsetValidators(this.addWorkOrder, 'movement_sow', [Validators.required])
      } else {
        setUnsetValidators(this.addWorkOrder, 'movement_sow', [Validators.nullValidator])
      }
    } else {
      this.addWorkOrder.get('movement_expiry_cutoff_date').setValue(null)
    }

  }

  getInspectionTypesList() {
    this._commonservice.getUpdatedDropDownValues(this.addInspectionApi).subscribe((ele) => {
      this.inspectionType = ele['result']['inspection-type'];
    })
  }

  portLocation(e) {
    this.addWorkOrder.get('movement_location').setValue(e['value'])
  }



  resetOnCatagoryChange() {
    let category = Number(this.addWorkOrder.get('vehicle_category').value);
    this.addWorkOrder.patchValue({
      customer: null,
      workorder_date: new Date(dateWithTimeZone()),
      workstart_date: new Date(dateWithTimeZone()),
      workend_date: null,
      expected_tenure: null,
      quotation: null,
      site_inspection_no: null,
      enquiry_no: '',
      type_of_movement: category == 0 || category == 4 ? null : 0,
      no: '',
      date: null,
      no_of_containers: 0,
      is_inspection_required: 0,
      inspection_type: [],
      employee_in_charge: null,
      movement_expiry_cutoff_date: null,
      poc : null,
    });
    this.initialDetails.employee_in_charge = getBlankOption()
    this.initialDetails.customer = getBlankOption();
    this.initialDetails.expectedTenure = getBlankOption();
    this.initialDetails.quotation = getBlankOption();
    this.initialDetails.site_inspection_no = getBlankOption();
    this.initialDetails.typeOfMovement = getBlankOption();
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
    this.initialDetails.poc = getBlankOption();
    this.pointOfContactsList = [];
    var in30Days = this.expectedTenures.filter((_) => _['label'] == "In 30 Days")[0];
    if (in30Days) {
      this.initialDetails.expectedTenure = { "label": in30Days['label'], "value": in30Days['id'] }
      this.addWorkOrder.get('expected_tenure').setValue(in30Days['id'])
      this.setWorkEndDate()
    }
    this.vehicleAndDriverData = {
      vehicle: [],
      driver: [],
      customer: [],
      location: []
    };
    this.isSiteInspectionSelected = false;
    this.isQuotationSelected = false;
    this.getDocsExpiryLIst();
    this.addRemoveValidators(this.addWorkOrder, 'type_of_movement', Number(category) == 0 || Number(category) == 4 ? [Validators.required] : [Validators.nullValidator])
    this.movementTypeChanged();
  }

  addRemoveValidators(form: AbstractControl, key: string, ValidatorsList: Array<any>) {
    form.get(key).setValidators(ValidatorsList);
    form.get(key).updateValueAndValidity();
  }


  resetOnCustomerChange() {
    this.addWorkOrder.patchValue({
      workorder_date: new Date(dateWithTimeZone()),
      workstart_date: new Date(dateWithTimeZone()),
      workend_date: null,
      expected_tenure: null,
      quotation: null,
      enquiry_no: '',
      site_inspection_no: null,
      employee_in_charge: null,
      contact_name : '',
      contact_no: {
        flag: this.defaultPhoneFlag.flag,
        code: this.defaultPhoneFlag.code,
        number: ''
      },
    });
    this.initialDetails.expectedTenure = getBlankOption();
    this.initialDetails.quotation = getBlankOption();
    this.initialDetails.site_inspection_no = getBlankOption();
    this.initialDetails.employee_in_charge = getBlankOption();
    this.initialDetails.contactName = {};
    this.initialDetails.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
    var in30Days = this.expectedTenures.filter((_) => _['label'] == "In 30 Days")[0]
    if (in30Days) {
      this.initialDetails.expectedTenure = { "label": in30Days['label'], "value": in30Days['id'] }
      this.addWorkOrder.get('expected_tenure').setValue(in30Days['id'])
      this.setWorkEndDate()
    }
    this.movementTypeChanged();
  }


  vehicleCatagoryOthers(formValue) {
    delete formValue['movement_sow'];
    formValue['others']['freights'] = [formValue['others']['billing']]
    formValue['others']['other_details'] = this.processCutsomFieldData(formValue['others']['other_details']['other_details'])
    formValue['others']['path'] = this.processMultipleDestinationFormData(formValue['others']['destinations']['start_end_destination']);
    formValue['others']['additional_charge'] = formValue['others']['additional_charge'].filter(item => item.is_checked == true)
    formValue['others']['additional_charge'].forEach(item => {
      item['name'] = item['name'].id;
      item['unit_of_measurement'] = item['unit_of_measurement'] ? item['unit_of_measurement'].id : null;
    })
    formValue['is_inspection_required'] = Number(formValue['is_inspection_required']);
    formValue['inspection_type'] = formValue['inspection_type'].map(item => item.id);
    formValue['date'] = changeDateToServerFormat(formValue['date'])
    delete formValue['others']['billing']
    delete formValue['others']['destinations'];
    formValue['others']['materials'] = formValue['others']['materials']['materials']
    this.totalValue = Number(formValue['others']['freights'][0]['freight_amount']);
    delete formValue['others']['materials']['materials'];
    this.dataForSubmission = formValue
  }

  vehicleCatagoryCrane(formValue) {
    delete formValue['movement_sow'];
    formValue['crane']['rental_charge']['no_of_shifts'] = Number(formValue['crane']['rental_charge']['no_of_shifts']) == 1 ? 0 : 1
    formValue['crane']['rental_charge']['fuel_type'] = Number(formValue['crane']['rental_charge']['fuel_type']) == 1 ? 0 : 1
    formValue['crane']['additional_charge'] = formValue['crane']['additional_charge'].filter(item => item.is_checked == true)
    formValue['crane']['additional_charge'].forEach(item => {
      item['name'] = item['name'].id;
      item['unit_of_measurement'] = item['unit_of_measurement'] ? item['unit_of_measurement'].id : null;
    })
    formValue['crane']['other_details'] = this.processCutsomFieldData(formValue['crane']['other_details']['other_details'])
    formValue['crane']['rental_charge']['rental_charges'].forEach(item => {
      item['job_end_date'] = changeDateToServerFormat(item['job_end_date'])
      item['job_start_date'] = changeDateToServerFormat(item['job_start_date'])
    })
    formValue['crane']['location_details']['checklist'].forEach(checkListItem => {
      if (typeof checkListItem['field_type'] != 'string') {
        checkListItem['field_type'] = checkListItem['field_type']['data_type']
      }
    });
    delete formValue['type_of_movement'];
    this.totalValue = Number(formValue['crane']['crane_calculations']['total_amount']);
    this.dataForSubmission = formValue;
    this.rentalChargesArray = formValue['crane']['rental_charge']['rental_charges'];
    if (isValidValue(formValue['crane']['location_details']['zone'])) {
      this.isZoneSelected = true;
    } else {
      this.isZoneSelected = false;
    }
    this.price_validationDetails = formValue['crane']['price_validation_details'];




  }

  vehicleCatagoryAWP(formValue) {
    delete formValue['movement_sow'];
    formValue['awp']['rental_charge']['no_of_shifts'] = Number(formValue['awp']['rental_charge']['no_of_shifts']) == 1 ? 0 : 1
    formValue['awp']['rental_charge']['fuel_type'] = Number(formValue['awp']['rental_charge']['fuel_type']) == 1 ? 0 : 1
    formValue['awp']['additional_charge'] = formValue['awp']['additional_charge'].filter(item => item.is_checked == true)
    formValue['awp']['additional_charge'].forEach(item => {
      item['name'] = item['name'].id;
      item['unit_of_measurement'] = item['unit_of_measurement'] ? item['unit_of_measurement'].id : null;
    })
    formValue['awp']['other_details'] = this.processCutsomFieldData(formValue['awp']['other_details']['other_details'])
    formValue['awp']['rental_charge']['rental_charges'].forEach(item => {
      item['job_end_date'] = changeDateToServerFormat(item['job_end_date'])
      item['job_start_date'] = changeDateToServerFormat(item['job_start_date'])
    })
    formValue['awp']['location_details']['checklist'].forEach(checkListItem => {
      if (typeof checkListItem['field_type'] != 'string') {
        checkListItem['field_type'] = checkListItem['field_type']['data_type']
      }
    });
    this.totalValue = Number(formValue['awp']['awp_calculations']['total_amount']);
    delete formValue['type_of_movement'];
    this.dataForSubmission = formValue;
    this.rentalChargesArray = formValue['awp']['rental_charge']['rental_charges'];
    if (isValidValue(formValue['awp']['location_details']['zone'])) {
      this.isZoneSelected = true;
    } else {
      this.isZoneSelected = false;
    }
    this.price_validationDetails = formValue['awp']['price_validation_details'];
  }

  vehiclecategoryContainer(formValue) {
    formValue['date'] = changeDateToServerFormat(formValue['date'])
    formValue['movement_expiry_cutoff_date'] = changeDateToServerFormat(formValue['movement_expiry_cutoff_date'])
    if (formValue['movement_sow'] == null) {
      formValue['movement_sow'] = 0;
    }
    let containerObj={
      "freight_amount":0,
      "freight_type": 0,
      "rate":0,
      "total_units":0,
      "job_type": null,
      "estimations":null
     }
    if(formValue['container']['billing']['billing_type'] == '10') {
      containerObj={
        "freight_amount":formValue['container']['billing']['job']['est_total'],
        "freight_type":formValue['container']['billing']['billing_type'],
        "rate":formValue['container']['billing']['job']['rate'],
        "total_units":formValue['container']['billing']['job']['est_jobs'],
        "job_type":formValue['container']['billing']['job_type'],
        "estimations":this.defaultContainerestimations()
       }
    }else{
      containerObj={
        "freight_amount":0.00,
        "freight_type":formValue['container']['billing']['billing_type'],
        "rate":0.000,
        "total_units":0.000,
        "job_type": null,
        "estimations":formValue['container']['billing']
       }
       delete containerObj['estimations']['job']
       delete containerObj['estimations']['billing_type']
    }
    formValue['container']['freights'] = [containerObj]
    this.calculateContainerTotal(formValue['container']['billing']);
    formValue['container']['materials'] = formValue['container']['materials']['materials'].filter(item => {
      let values = Object.values(item);
      return values.some(ele => {
        if (typeof ele === 'string') {
          return ele.length > 0;
        } else if (typeof ele === 'number') {
          return ele !== 0;
        } else {
          return ele != null;
        }
      });
    })
    formValue['container']['path'] = this.processMultipleDestinationFormData(formValue['container']['destinations']['start_end_destination']);
    formValue['container']['additional_charge'] = formValue['container']['additional_charge'].filter(item => item.is_checked == true);
    formValue['container']['additional_charge'].forEach(item => {
      item['name'] = item['name'].id;
      item['unit_of_measurement'] = item['unit_of_measurement'] ? item['unit_of_measurement'].id : null;
    })
    delete formValue['container']['billing']
    delete formValue['container']['destinations'];
    delete formValue['inspection_type']
    this.dataForSubmission = formValue;
  }

  processCutsomFieldData(customFieldData) {
    customFieldData.forEach((item) => {
      if (item['field_type'] == "checkbox") {
        if (item.value == "false" || item.value == false) {
          item['value'] = ''
        }
      }
      if (item['field_type'] == "date") {
        item['value'] = changeDateToServerFormat(item['value'])
      }
      if (item['field_type'] != "datetime") {
        item['value'] = (item['value'].toString())
      }
    });

    return customFieldData
  }

  processMultipleDestinationFormData(data) {
    let destinations = [];
    destinations = cloneDeep(data)
    if (destinations.length > 0) {
      destinations.forEach((destination, index) => {
        delete destination.reach_time
        delete destination.time
        if (destination['checklist'].length > 0) {
          destination['checklist'].forEach(checkListItem => {
            if (typeof checkListItem['field_type'] != 'string')
              checkListItem['field_type'] = checkListItem['field_type']['data_type']
          });
        }
        if (destination.hasOwnProperty('inspection_type') && destination['inspection_type'].length > 0) {
          destination['inspection_type'] = destination['inspection_type'].map(inspection => inspection.id)
        }
      })
    }
    return destinations
  }




  getWorkOrderDetails() {
    this._workOrderV2Service.getWorkOrderDetailsById(this.workOrderId).subscribe(resp => {
      this.workOrderDetails = resp['result'];
      let vehicle_category = resp['result']['vehicle_category'];
      this.isToMAndSoWEditable = resp['result']?.container?.is_sow_tom_editable;
      if (vehicle_category == 1 || vehicle_category == 2) {
        let rental_charges;
        if (vehicle_category == 1) {
          rental_charges = resp['result']['crane']['rental_charge']['rental_charges'];
        } else {
          rental_charges = resp['result']['awp']['rental_charge']['rental_charges'];
        }
        rental_charges.forEach(element => {
          if (isValidValue(element.vehicle_no)) {
            this.selectedVehiclesAndJobdates.push({
              date: element.job_start_date,
              id: element.vehicle_no.id
            })
          }
        });
      }
      this.getApprovalLevelDetails(this.workOrderDetails.created_at, vehicle_category);
      this.patchWorkoredrHeader();
      this.employeePatch(this.workOrderDetails)
      this.getQuotationsList();
      this.getSiteInspectionList();
      this.getDocsExpiryLIst();
      if (vehicle_category == 4) {
        setUnsetValidators(this.addWorkOrder, 'no_of_containers', [Validators.min(this.workOrderDetails['container']['min_no'])])
      }
    })
  }


  patchWorkoredrHeader() {
    this.isCatagorySelected = true;
    this.addWorkOrder.patchValue({
      vehicle_category: this.workOrderDetails['vehicle_category'],
      customer: this.workOrderDetails['customer'] ? this.workOrderDetails['customer']['id'] : null,
      workorder_date: this.workOrderDetails['workorder_date'],
      workorder_no: this.workOrderDetails['workorder_no'],
      workstart_date: this.workOrderDetails['workstart_date'],
      workend_date: this.workOrderDetails['workend_date'],
      enquiry_no: this.workOrderDetails['enquiry_no'],
      expected_tenure: this.workOrderDetails['expected_tenure'] ? this.workOrderDetails['expected_tenure']['id'] : null,
      quotation: this.workOrderDetails['quotation'] ? this.workOrderDetails['quotation']['id'] : null,
      site_inspection_no: this.workOrderDetails['site_inspection_no'] ? this.workOrderDetails['site_inspection_no']['id'] : null,
      type_of_movement: this.workOrderDetails['type_of_movement'],
      no: this.workOrderDetails['no'],
      date: this.workOrderDetails['date'],
      movement_expiry_cutoff_date: this.workOrderDetails['movement_expiry_cutoff_date'],
      no_of_containers: this.workOrderDetails['no_of_containers'],
      inspection_type: this.workOrderDetails['inspection_type'] ? this.workOrderDetails['inspection_type'] : [],
      is_inspection_required: this.workOrderDetails['is_inspection_required'] ? 1 : 0,
      poc : this.workOrderDetails?.poc?.id
    });
    this.initialDetails.customer = { label: this.workOrderDetails['customer'] ? this.workOrderDetails['customer']['name'] : null, value: this.workOrderDetails['customer'] ? this.workOrderDetails['customer']['id'] : null }
    this.initialDetails.expectedTenure = { label: this.workOrderDetails['expected_tenure'] ? this.workOrderDetails['expected_tenure']['label'] : null, value: this.workOrderDetails['expected_tenure'] ? this.workOrderDetails['expected_tenure']['id'] : null }
    this.initialDetails.quotation = { label: this.workOrderDetails['quotation'] ? this.workOrderDetails['quotation']['quotation_no'] : null, value: this.workOrderDetails['quotation'] ? this.workOrderDetails['quotation']['id'] : null }
    this.initialDetails.site_inspection_no = { label: this.workOrderDetails['site_inspection_no'] ? this.workOrderDetails['site_inspection_no']['site_inspection_no'] : null, value: this.workOrderDetails['site_inspection_no'] ? this.workOrderDetails['site_inspection_no']['id'] : null }
    if (this.workOrderDetails['is_inspection_required']) {
      this.initialDetails.inspectionRequired = this.inspectionRequired[1];
    } else {
      this.initialDetails.inspectionRequired = this.inspectionRequired[0];
    }
    this.initialDetails.poc  = { label : this.workOrderDetails?.poc?.display_name, value : this.workOrderDetails?.poc?.id }
    this.addRemoveValidators(this.addWorkOrder, 'inspection_type', Number(this.workOrderDetails['is_inspection_required']) == 1 ? [Validators.required] : [Validators.nullValidator]);
    let customer = this.addWorkOrder.get('customer').value;
    let typeMatched = this.movementTypes.find(ele => ele.value == this.workOrderDetails['type_of_movement']);
    this.initialDetails.typeOfMovement = typeMatched
    if (Number(this.workOrderDetails['vehicle_category']) == 4) {
      this.addWorkOrder.get('movement_contact_no').patchValue(this.workOrderDetails['movement_contact_no'])
      this.addWorkOrder.get('movement_contact_name').patchValue(this.workOrderDetails['movement_contact_name'])
      this.initialDetails.countryCode = { label: this.workOrderDetails['movement_contact_no']['code'], value: '' }
      this.initialDetails.contactName = { label: this.workOrderDetails['movement_contact_name'], value: '' }
      this.addWorkOrder.get('movement_location').patchValue(this.workOrderDetails['movement_location'])
      this.addWorkOrder.get('movement_sow').patchValue(this.workOrderDetails['movement_sow'])
      if (this.workOrderDetails['movement_sow']) {
        this.initialDetails.sow = this.sowList.find(list => list.value == this.workOrderDetails['movement_sow'])
      }
      setUnsetValidators(this.addWorkOrder, 'workstart_date', [Validators.nullValidator])
      setUnsetValidators(this.addWorkOrder, 'expected_tenure', [Validators.nullValidator])
      setUnsetValidators(this.addWorkOrder, 'workend_date', [Validators.nullValidator])


    }
    this._companyTripGetApiService.getPartyTripDetailsV2(partyList => {
      this.partyList = partyList['clients']
      if (customer) {
        let contactPersonList = cloneDeep(this.partyList.filter(party => party.id == customer))
        if (contactPersonList.length) {
          this.contactPersonList = contactPersonList[0].contacts
        }

      }
    });
    this._quotationV2Service.getPointOfContactsList(this.workOrderDetails['customer']['id']).subscribe((response) => {
      this.pointOfContactsList = response['result'];
     })

    if (isValidValue(this.workOrderDetails['quotation']) && Number(this.workOrderDetails['vehicle_category']) != 0) {
      this._workOrderV2Service.getQuotationWorkorderDetails(this.workOrderDetails['quotation'].id).subscribe(resp => {
        this.quotationDetails = resp['result'];
        this.quotationExpiryDate = resp['result']?.is_validity_expired;
        this.iseditQuotationPresent.next(resp['result'])
      });
    }
    this.getQuotationsList();
  }

  selectedvehicleAndJobDate(e) {
    this.selectedVehiclesAndJobdates = e;
    this.getDocsExpiryLIst();
  }

  getDocsExpiryLIst() {
    let customer = this.addWorkOrder.get('customer').value;
    let salesOrderStartDate = this.addWorkOrder.get('workstart_date').value;
    salesOrderStartDate = moment(salesOrderStartDate).format('YYYY-MM-DD')
    let type = ''
    if (Number(this.addWorkOrder.get('vehicle_category').value) == 1) {
      type = 'crane'
    }
    if (Number(this.addWorkOrder.get('vehicle_category').value) == 2) {
      type = 'awp'
    }
    this.locations = [];
    if (isValidValue(customer)) {
      this.vehicleAndDriverData.customer = [{ date: salesOrderStartDate, id: customer }]
      this.vehicleAndDriverData.vehicle = this.selectedVehiclesAndJobdates
      if (Number(this.addWorkOrder.get('vehicle_category').value) > 0) {
        if (this.addWorkOrder.value[type]) {
          this.vehicleAndDriverData.location = [this.addWorkOrder.value[type]['location_details']['location']];
        }
      };
      this.vehicleAndDriverData.location.forEach(ele => {
        if (isValidValue(ele.name) && (!ele.lat || !ele.lng))
          this.locations.push(ele)
      });
      this._companyService.getExpiryDocs(this.vehicleAndDriverData).subscribe((res) => {
        this.areCertificatesExpired = res['result']['customer'].expired_count > 0;
        this.gracePeriodExpired = res['result']['customer'].grace_period_expired;
        this.creditLimit = res['result']['customer'].credit_remaining;
        this.checkCreditLimit = res['result']['customer'].check_credit_limit;
        this.isVehiclePermitExpired = res['result']['vehicle_permit']?.expired > 0 ? true : false;
        this.isPermitNotFound = res['result']['vehicle_permit']?.not_found.length > 0;
        this.isVehicleDocExpired = res['result'].vehicle.expired_count > 0;
        this.isVehicleSubAssetExpired = res['result'].vehicle_subasset.expired_count > 0;
        this.isVehicleTyreExpired = res['result'].vehicle_tyre.expired_count > 0;
        this.documentExpiryData.next(res)
      })
    } else {
      this.documentExpiryData.next(null)
    }
  }

  locationSelected(e) {
    this.getDocsExpiryLIst();

  }

  getWorkorderUnits(id) {
    this._workOrderV2Service.getWorkOrderUnitsStatus(id).subscribe(resp => {
      this.workorderUnitStatus = resp['result']
    })
  }

  getNewInspectionTypes(e) {
    this.getInspectionTypesList();
    this.addWorkOrder.get('type_of_inspection').setValue(e.id);
    this.initialDetails.inspectionType = { label: e.label, value: e.id };
  }

  addNewInspectionTypes(e) {
    this.addInspecParams = {
      label: e,
      key: 'inspection-type'
    }

  }

  scopeOfWork() {
    this.initialDetails.inspectionType = getBlankOption();
    this.initialDetails.inspectionRequired = { label: 'No', value: 0 };
    this.addWorkOrder.patchValue({
      is_inspection_required: 0,
      type_of_inspection: null,
    });
    this.addRemoveValidators(this.addWorkOrder, 'inspection_type', [Validators.nullValidator]);
    this.addRemoveValidators(this.addWorkOrder, 'type_of_inspection', [Validators.nullValidator]);
  }

  customerRateCardExisted(rateCards: boolean[]) {
    this.isCustomerRateCardExisted = rateCards.every(ratecard => ratecard === true);
  }

  linkClicked() {
    this.isLinkedClicked = true;
  }

  defaultContainerestimations() {
  return {
      "regular": {
        "is_selected":false,
        "rate":0.000,
        "est_jobs":0.000,
        "est_total":0.000
      },
      "couple": {
        "is_selected":false,
        "rate":0.000,
        "est_jobs":0.000,
        "est_total":0.000
      },
      "boggy": {
        "is_selected": false,
        "rate":0.000,
        "est_jobs":0.000,
        "est_total":0.000
      },
      "sideLoader": {
        "is_selected": false,
        "rate":0.000,
        "est_jobs":0.000,
        "est_total":0.000
      },
      "lowBed": {
        "is_selected": false,
        "rate":0.00,
        "est_jobs":0.00,
        "est_total":0.00
      }
    }
  }

  calculateContainerTotal(data){
    this.totalValue = 0 ;
    if(data['billing_type']=='10'){
      this.totalValue = Number(data['job']['est_total']);
    }else{
      if(data['boggy']['is_selected']){
        this.totalValue += Number(data['boggy']['est_total']); 
      }
      if(data['couple']['is_selected']){
        this.totalValue += Number(data['couple']['est_total']); 
      }
      if(data['lowBed']['is_selected']){
        this.totalValue += Number(data['lowBed']['est_total']); 
      }
      if(data['regular']['is_selected']){
        this.totalValue += Number(data['regular']['est_total']); 
      }
      if(data['sideLoader']['is_selected']){
        this.totalValue += Number(data['sideLoader']['est_total']); 
      }
    }
  }

  commonRateCardValuesEmitter(event){
      this.commonRateCardvalues = event['rateCard'];
  }

  getAddedPoC(event) {    
    if (event) {
      this.pointOfContactsList = [];
      this.addWorkOrder.get('poc').setValue(null);
      this.initialDetails.poc = getBlankOption();
      this._workOrderV2Service.getPointOfContactsList(this.addWorkOrder.get('customer').value).subscribe((response) => {
        this.addWorkOrder.get('poc').setValue(event.id);
        this.pointOfContactsList = response.result;
        this.initialDetails.poc = {
          label: event.label,
          value: event.id
        };
      });
    }
  }

  addNewPoC(event) {
    this.pocURL = `report/party/poc/${this.addWorkOrder.get('customer').value}/`;
    this.pocParam = {
      name: event
    }; 
  }

  getPointOfContactsList(id) {
    this._workOrderV2Service.getPointOfContactsList(id).subscribe((response) => {
      this.pointOfContactsList = response['result'];
      let defaultPOC = this.pointOfContactsList.find(poc=>poc.default==true)
      this.addWorkOrder.get('poc').setValue(defaultPOC?.id);
      this.initialDetails.poc = {
        label : defaultPOC?.display_name,
        value : defaultPOC?.id
      }
    })
  }


}
