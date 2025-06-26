import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { RateCardBillingBasedOn, ValidationConstants } from 'src/app/core/constants/constant';
import { getBlankOption, getNonTaxableOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { ToolTipInfo } from '../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { addErrorClass, setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CommonService } from 'src/app/core/services/common.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { PhoneCodesFlagService } from 'src/app/core/services/phone-code_flag.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { cloneDeep } from 'lodash';
import { CurrencyService } from 'src/app/core/services/currency.service';
import moment from 'moment';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { LpoService } from 'src/app/modules/customerapp-module/api-services/trip-module-services/lpo-services/lpo.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
@Component({
  selector: 'app-work-order-template-crane',
  templateUrl: './work-order-template-crane.component.html',
  styleUrls: ['./work-order-template-crane.component.scss']
})
export class WorkOrderTemplateCraneComponent implements OnInit, OnDestroy, OnChanges {
  @Input() workOrderForm: FormGroup;
  @Input() formType = 'crane';
  @Input() contactPersonList = [];
  @Input() workOrderDetails?: {}
  @Input() quotationDetails?: {}
  @Input() isFormValid: Observable<boolean>
  @Input() startDate: any;
  @Input() endDate: any;
  saleorderBasedOn: 'hour' | 'day' = 'hour'
  @Output() rateCardQuotationPreviousValues = new EventEmitter<any>();
  @Output() isCustomerRateCardExisted = new EventEmitter<boolean[]>();
  customerRateCardsExisted : boolean[]= [false];
  craneFormGroup: FormGroup;
  taxOption = getNonTaxableOption();
  defaultTax = new ValidationConstants().defaultTax;
  locationToolTip: ToolTipInfo;
  customfield_Info: ToolTipInfo
  tripTaskToolTip: ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants();
  isLocationValid = new BehaviorSubject(true)
  isFormValidCustomField = new BehaviorSubject(true)
  customFieldData = new Subject();
  @Input() iseditQuotationPresent = new Observable()
  vechileSpecifications = [];
  shiftType = [
    {
      value: 1,
      label: 'Single Shift'
    },
    {
      value: 2,
      label: 'Double Shift'
    }
  ]

  fuelType = [
    {
      value: 1,
      label: 'With Fuel'
    },
    {
      value: 2,
      label: 'Without Fuel'
    }
  ]
  durationType = [
    {
      value: 'daily',
      label: 'Daily'
    },
    {
      value: 'weekly',
      label: 'Weekly'
    },
    {
      value: 'monthly',
      label: 'Monthly'
    }

  ]

  initialValues = {
    specifications: [],
    vehicleProvider: [],
    lpo: [],
    unit: [],
    vehicle: [],
    vehicleList: [],
    lpoList: [],
    additionalTax: [],
    shifType: {},
    fuelType: {},
    zone: {},
    tax: {},
    area: getBlankOption(),
    contactName: {},
    countryCode: {},
    working: {},
    billingUnit: { label: 'Hours', value: 'hour' }

  }
  zonesList = [];
  zoom = 10;
  center: google.maps.LatLngLiteral = { lat: 25.20584515715115, lng: 55.29476642979386, };
  markerOptions: google.maps.MarkerOptions = {
    icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  marker: any;
  additionalCharges = [];
  unitOfMeasurementList = [];
  countryPhoneCodeList = [];
  taxOptions = [];
  defaultPhoneFlag = {
    code: '',
    flag: ''
  }
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  isTax = false;
  previousShift = 1;
  calculations = this.getDefaultCalculations();
  totalSalesHours = '';
  dailyHours = 0;
  weeklyHours = 0;
  monthlyHours = 0;
  durationTotal = 1;
  isAddChargesTabError = false;
  isRentalChargesTabError = false;
  iscustomFieldTabError = false;
  currency_type: any
  quotationAndRateCardDataForSpecification = {}
  fuelProvision;
  billingUnitType;
  workingDuration;
  areaList = [];
  partyListVendor = [];
  isMarketVehicle = false;
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour = this.rateCardBilling.hour
  rateCardBillingDays = this.rateCardBilling.day;
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};
  @Output() selectedvehicleAndJobDate = new EventEmitter<any>();
  @Output() locationSelectedEmitter = new EventEmitter<any>();


  constructor(private _fb: FormBuilder, public dialog: Dialog, private _rateCard: RateCardService, private _companyModuleService: CompanyModuleServices, private _vehicleService: VehicleService, private _partyService: PartyService,
    private _commonService: CommonService, private _quotationV2Service: QuotationV2Service, private _lpoService: LpoService,private _party:PartyService,
    private _phone_codes_flag_service: PhoneCodesFlagService, private _isTax: TaxService, private currency: CurrencyService) { }

  ngOnInit(): void {
    this.defaultPhoneFlag = this._phone_codes_flag_service.phoneCodesFlag;
    this.initialValues.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.buildRentalCharges([{}]);
    this.getUnitsOfMeasurement();
    this.getTaxDetails();
    this.getPhoneCountryCode();
    this.getVehicleSpecifications();
    this.getVendorList();
    this.getZonesList();
    this.initialValues.tax = this.taxOption
    this.isTax = this._isTax.getTax();
    this.initialValues.shifType = this.shiftType[0];
    this.initialValues.fuelType = this.fuelType[1];
    this.initialValues.working = this.durationType[0];
    this.locationToolTip = {
      content: this.constantsTripV2.toolTipMessages.LOCATION.CONTENT
    }
    this.tripTaskToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    }
    this.customfield_Info = {
      content: this.constantsTripV2.toolTipMessages.CUSTOM_FIELD_SO.CONTENT

    }
    this.workOrderForm.addControl(this.formType, this.craneFormGroup);
    this.craneFormGroup.addControl(this.formType + '_calculations', new FormControl(null))
    this.craneFormGroup.get(this.formType + '_calculations').setValue(this.calculations)
    this.onBillingUnitChange();
    if (this.workOrderDetails) {
      this.patchCrane(cloneDeep(this.workOrderDetails))

    } else if (this.quotationDetails) {
      this.patchDataFromQuotation(cloneDeep(this.quotationDetails))
    }
    else {
      this.getAdditionalCharge();
      this.getSetBillingPreferences()
    }

    this.isFormValid.subscribe(vaild => {
      if (!vaild) {
        this.isAddChargesTabError = this.craneFormGroup.get('additional_charge').invalid
        this.isRentalChargesTabError = this.craneFormGroup.get('rental_charge').invalid;
        this.iscustomFieldTabError = this.craneFormGroup?.get('other_details')?.invalid;
        this.isFormValidCustomField.next(this.craneFormGroup?.get('other_details')?.valid)
        setAsTouched(this.craneFormGroup);
      }
    })
    this.iseditQuotationPresent.subscribe((data) => {
      this.previousValuesFromQuotationInEdit(data)
    })
    this.getAreaList()
  }

  ngOnDestroy(): void {
    this.workOrderForm.removeControl(this.formType);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.startDate = this.startDate
    this.endDate = this.endDate
  }
  buildForm() {
    this.craneFormGroup = this._fb.group({
      tax: this.defaultTax,
      rental_charge: this._fb.group({
        no_of_shifts: 1,
        billing_unit:'hour',
        fuel_type: 2,
        working_duration: this._fb.group({
          duration: [1, [Validators.min(1)]],
          working: 'daily'
        }),
        rental_charges: this._fb.array([])
      }),
      additional_charge: this._fb.array([]),
      location_details: this._fb.group({
        show_in_invoice : [true],
        zone: '',
        checklist: [[]],
        contact_name: '',
        contact_no: this._fb.group({
          flag: this.defaultPhoneFlag.flag,
          code: this.defaultPhoneFlag.code,
          number: ''
        }),
        location: this._fb.group({
          name: '',
          lng: '',
          lat: '',
          alias: ''
        }),
        area: ['',[Validators.required]],
      }),
      price_validation_details: [[]]
    })
    this.craneFormGroup.get('rental_charge').valueChanges.subscribe((res) => {
      let fuelProvision = Number(this.craneFormGroup.get('rental_charge').get('fuel_type').value);
      let billingType = this.craneFormGroup.get('rental_charge').get('billing_unit').value;
      this.workingDuration = this.craneFormGroup.get('rental_charge').get('working_duration').get('working').value;
      if (fuelProvision == 1) {
        this.fuelProvision = 'with_fuel'
      } else {
        this.fuelProvision = 'without_fuel';
      }
      this.billingUnitType = billingType;
      this.quotationAndRateCardDataForSpecification['working_duration'] = this.workingDuration;
      this.quotationAndRateCardDataForSpecification['fuelProvision'] = this.fuelProvision;
      this.quotationAndRateCardDataForSpecification['billing_type'] = this.billingUnitType;
      this.rateCardQuotationPreviousValues.emit(this.quotationAndRateCardDataForSpecification)
    });
  }

  getUnitsOfMeasurement() {
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.unitOfMeasurementList = response.result['item-unit'];
    });
  }

  getVehicleSpecifications() {
    this._vehicleService.getVehicleSpecifications(this.workOrderForm.get('vehicle_category').value).subscribe((response: any) => {
      this.vechileSpecifications = response.result;
    });
  }

  getVehicleList(form: FormGroup, index) {
    this.initialValues.vehicle[index] = getBlankOption();
    form.get('vehicle_no').setValue(null)
    this._vehicleService.getVehicleListByCatagory(this.workOrderForm.get('vehicle_category').value, form.get('specification').value).subscribe((response: any) => {
      this.initialValues.vehicleList[index] = response.result['veh'];
    });
  }

  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }


  onZoneChange() {
    this.craneFormGroup.get('price_validation_details').setValue([])
    this.resetCharges();
    this.getAdditionalCharge();
  }

  onBillingUnitChange(){
    let billingUnit = this.craneFormGroup.get('rental_charge').get('billing_unit').value
    this.setBillingUnitType(billingUnit);
    this.getAllnewSpecificationDataAccordingToBillingUnit();
    this.onChangeWorkingDuration();
  }

  setBillingUnitType(billingUnit) {
    this.saleorderBasedOn = billingUnit;
    if(billingUnit == 'hour'){
      this.dailyHours =this.rateCardBillingHour.day;
      this.weeklyHours =this.rateCardBillingHour.week;
      this.monthlyHours =this.rateCardBillingHour.month;
    }
    if(billingUnit == 'day'){
      this.dailyHours =this.rateCardBillingDays.day;
      this.weeklyHours =this.rateCardBillingDays.week;
      this.monthlyHours =this.rateCardBillingDays.month;
    }
  }

  getAllnewSpecificationDataAccordingToBillingUnit(){
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    rentalChargesItem.controls.forEach((form, index) => {
      this.getRateCard(form as FormGroup,index)
    });
  }

  locationSelected(e) {
    this.craneFormGroup.get('location_details').get('location').patchValue(e['value'])
    if (e['value']['lat']) {
      this.center = { lat: e['value'].lat, lng: e['value'].lng }
      this.markerPositions = [{ lat: e['value'].lat, lng: e['value'].lng }]
    } else {
      this.markerPositions = [];
    }
    this.locationSelectedEmitter.emit(e['value'])
  }


  selectedCheckList(e, form) {
    let checklist = form.get('checklist') as FormArray;
    form.get('checklist').setValue([]);
    if (e.length) {
      e.forEach(element => {
        checklist.value.push(element)
      });
    }
  }
  buildRentalCharges(items = []) {
    this.initialValues.specifications = [];
    this.initialValues.vehicle = [];
    this.initialValues.vehicleList = [];
    this.initialValues.lpoList = [];
    this.initialValues.lpo = [];
    this.initialValues.vehicleProvider = []
    let rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    rentalChargesItem.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        this.initialValues.specifications.push(getBlankOption());
        this.initialValues.vehicle.push(getBlankOption());
        this.initialValues.vehicleList.push([]);
        this.initialValues.lpoList.push([]);
        this.initialValues.vehicleProvider.push([]);
        this.initialValues.lpo.push([]);
        let rental_charge = this.getRentalChargeFormGroup(item)
        rentalChargesItem.push(rental_charge)
      });
    } else {
      this.addMoreRentalChargeItem()
    }

  }
  addMoreRentalChargeItem() {
    this.customerRateCardsExisted.length==0  && this.customerRateCardsExisted.push(false)
    this.customerRateCardsExisted.push(this.customerRateCardsExisted[this.customerRateCardsExisted.length-1])
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    this.initialValues.specifications.push(getBlankOption());
    this.initialValues.vehicle.push(getBlankOption());
    this.initialValues.vehicleList.push([]);
    this.initialValues.lpoList.push([]);
    this.initialValues.vehicleProvider.push(getBlankOption());
    this.initialValues.lpo.push(getBlankOption());
    rentalChargesItem.push(this.getRentalChargeFormGroup({}));
  }

  getRentalChargeFormGroup(item) {
    return this._fb.group({
      id: [item?.id || null],
      specification: [item?.specification || null, [Validators.required]],
      rental_charge: [item?.rental_charge || 0.000],
      total_amount: [item?.total_amount || 0.000],
      extra_hours: [item?.extra_hours || 0.000],
      vehicle_no: [item?.vehicle_no || null],
      rate_card_data: [item?.rate_card_data || null],
      job_start_date: [item?.job_start_date || new Date(dateWithTimeZone())],
      job_end_date: [item?.job_end_date || new Date(dateWithTimeZone())],
      is_transporter: [item?.is_transporter || false],
      vehicle_provider: [item?.vehicle_provider || null],
      lpo: [item?.lpo || null],
    })
  }
  removeRentalChareItem(index) {
    this.customerRateCardsExisted.splice(index,1);
    this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    this.initialValues.specifications.splice(index, 1);
    this.initialValues.vehicle.splice(index, 1);
    this.initialValues.vehicleProvider.splice(index, 1);
    this.initialValues.lpo.splice(index, 1);
    rentalChargesItem.removeAt(index);
    this.initialValues.vehicleList.splice(index, 1);
    this.initialValues.lpoList.splice(index, 1);
    this.onCalculationChange();

  }

  getAdditionalCharge() {
    let params = {
      vehicle_category: this.workOrderForm.get('vehicle_category').value
    }
    if (this.workOrderForm.get('customer').value)
      this._rateCard.getCustomerAdditionalCharge(this.workOrderForm.get('customer').value, params).subscribe((response: any) => {
        this.additionalCharges = response.result;
        this.buildAdditionalCharges(this.additionalCharges)
      });
  }


  getRateCard(form: FormGroup,index : number) {
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    const working = this.craneFormGroup.get('rental_charge.working_duration').value['working'];
    const fuel_type = this.craneFormGroup.get('rental_charge').get('fuel_type').value
    const customer = this.workOrderForm.get('customer').value;
    const zone = this.craneFormGroup.get('location_details').get('zone').value;
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value
    let params = {
      specification: form.get('specification').value,
      zone: zone,
      vehicle_category: this.workOrderForm.get('vehicle_category').value,
      billing_unit:billingUnit

    }
    if (customer && zone && form.get('specification').value) {
      let validationDetails: any[] = this.craneFormGroup.get('price_validation_details').value;
      this._rateCard.getRentalCharges(customer, params).subscribe(resp => {
        this.customerRateCardsExisted[index] = resp['result']?.is_from_customer ? resp['result'].is_from_customer : false;
        this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
        form.get('extra_hours').setValue('0.000')
        form.get('rental_charge').setValue('0.000')
        if (resp['result']) {
          this.addDeletequotationAndRateCardDataForSpecification(form.get('specification').value,billingUnit+'_rate_card', resp['result'])
          let isQuotationData = this.quotationAndRateCardDataForSpecification[form.get('specification').value].hasOwnProperty(billingUnit+'_quotation_rate_card')
          if (isQuotationData) {
            this.patchRateCardValues(form, billingUnit+'_quotation_rate_card');
          } else {
            const withFuel = Number(resp['result'][working]['with_fuel'])
            const withoutFuel = Number(resp['result'][working]['without_fuel'])
            form.get('extra_hours').setValue(resp['result'][working]['additional_hours'])
            if (fuel_type == 1) {
              form.get('rental_charge').setValue(withFuel * Number(shift))
            }
            if (fuel_type == 2) {
              form.get('rental_charge').setValue(withoutFuel * Number(shift))
            }
          }

          let data = {
            specification: form.get('specification').value,
            prefilledRentalValue: form.get('rental_charge').value,
          }

          validationDetails.push(data);
        } else {
          if (this.quotationAndRateCardDataForSpecification[form.get('specification').value]) {
            this.addDeletequotationAndRateCardDataForSpecification(form.get('specification').value,billingUnit+'_rate_card', resp['result'], 'remove')
            let isQuotationData = this.quotationAndRateCardDataForSpecification[form.get('specification').value].hasOwnProperty(billingUnit+'_quotation_rate_card')
            if (isQuotationData) {
              this.patchRateCardValues(form, billingUnit+'_quotation_rate_card')
            }
          }


        }
        this.craneFormGroup.get('price_validation_details').setValue(validationDetails)
        this.onCalculationChange();
      })
    }

  }

  buildAdditionalCharges(items = []) {
    this.initialValues.unit = [];
    this.initialValues.additionalTax = [];
    let additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let additional_charge = this.getAdditionalChargeFormGroup(item)
        additionalCharge.push(additional_charge)
        this.initialValues.unit.push(item['unit_of_measurement']);
        this.initialValues.additionalTax.push(item['tax']);
      });
    } else {
      this.addMoreAdditionalChargeItem()
    }
  }

  getAdditionalChargeFormGroup(item) {
    return this._fb.group({
      is_checked: [item?.is_checked ? true : false],
      name: [item.name],
      unit_of_measurement: [item.unit_of_measurement],
      quantity: [item.quantity || 0],
      unit_cost: [item.rate || 0],
      rate: [item.rate || 0],
      total: 0,
      tax: [item.tax?.id]
    })
  }

  addMoreAdditionalChargeItem() {
    const additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.push(this.getAdditionalChargeFormGroup({}));
    this.initialValues.unit.push()
    this.initialValues.additionalTax.push()


  }

  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }

  onShiftChange() {
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    if (this.previousShift != shift) {
      this.previousShift = shift
      const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
      rentalChargesItems.controls.forEach(form => {
        const rental_charge = form.get('rental_charge')
        if (this.previousShift == 1) {
          rental_charge.setValue((Number(rental_charge.value) / 2).toFixed(3));
        } else {
          rental_charge.setValue((Number(rental_charge.value) * 2).toFixed(3));
        }
      });
    }
    this.onChangeWorkingDuration();
    this.onCalculationChange();
  }

  getAndSetRentalCharge() {
    this.craneFormGroup.get('price_validation_details').setValue([])
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value
    const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    rentalChargesItems.controls.forEach(form => {
      form.get('extra_hours').setValue('0.000')
      form.get('rental_charge').setValue('0.000')
      if (this.quotationAndRateCardDataForSpecification[form.get('specification').value]) {
        let isRateCard = this.quotationAndRateCardDataForSpecification[form.get('specification').value].hasOwnProperty(billingUnit+'_rate_card')
        let isQuotationData = this.quotationAndRateCardDataForSpecification[form.get('specification').value].hasOwnProperty(billingUnit+'_quotation_rate_card')
        if (!isRateCard) {
          if (isQuotationData) {
            this.patchRateCardValues(form, billingUnit+'_quotation_rate_card')
          }
        }
        if (!isQuotationData) {
          if (isRateCard) {
            this.patchRateCardValues(form, billingUnit+'_rate_card')
          }
        }

        if (isRateCard && isQuotationData) {
          if (isQuotationData) {
            this.patchRateCardValues(form, billingUnit+'_quotation_rate_card')
          }
        }
      }

    })
    this.onCalculationChange();
  }


  patchRateCardValues(form: AbstractControl, key) {
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    const billingUnit = this.craneFormGroup.get('rental_charge').get('billing_unit').value
    const working = this.craneFormGroup.get('rental_charge.working_duration').value['working'];
    const fuel_type = this.craneFormGroup.get('rental_charge').get('fuel_type').value
    let rateCard = this.quotationAndRateCardDataForSpecification[form.get('specification').value][key];
    let isRateCard = this.quotationAndRateCardDataForSpecification[form.get('specification').value].hasOwnProperty('rate_card')
    const withFuel = Number(rateCard[working]['with_fuel'])
    const withoutFuel = Number(rateCard[working]['without_fuel'])
    const additionalHours = rateCard[working]['additional_hours']
    let additionalHourRate=0
    let ratecardWithFuel = 0;
    let rateCardWithoutFuel = 0;
    if (key == billingUnit+'_quotation_rate_card') {
      if (isRateCard) {
        rateCard = this.quotationAndRateCardDataForSpecification[form.get('specification').value]['rate_card'];
        ratecardWithFuel = Number(rateCard[working]['with_fuel'])
        rateCardWithoutFuel = Number(rateCard[working]['without_fuel'])
        additionalHourRate=Number(rateCard[working]['additional_hours'])
      }
    }
    if (fuel_type == 1) {
      if (withFuel == 0) {
        form.get('rental_charge').setValue(ratecardWithFuel * Number(shift))
      } else {
        form.get('rental_charge').setValue(withFuel * Number(shift))
      }
    }
    if (fuel_type == 2) {
      if (withoutFuel == 0) {
        form.get('rental_charge').setValue(rateCardWithoutFuel * Number(shift))
      } else {
        form.get('rental_charge').setValue(withoutFuel * Number(shift))
      }

    }
    if(additionalHours==0){
      form.get('extra_hours').setValue(additionalHourRate)
    }else{
      form.get('extra_hours').setValue(additionalHours)
    }

    let data = {
      key: key,
      specification: form.get('specification').value,
      prefilledRentalValue: form.get('rental_charge').value,
    }

    let validationDetails: any[] = this.craneFormGroup.get('price_validation_details').value;
    validationDetails.push(data);

    this.craneFormGroup.get('price_validation_details').setValue(validationDetails)

    this.rateCardQuotationPreviousValues.emit(this.quotationAndRateCardDataForSpecification);
  }

  onChangeAdditionalChargeCheckBox(form: FormGroup) {
    let formValue = form.value
    if (formValue['is_checked']) {
      setUnsetValidators(form, 'unit_cost', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'quantity', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.required])
    } else {
      form.get('unit_cost').setValue(form.get('rate').value)
      form.get('quantity').setValue('0.000')
      setUnsetValidators(form, 'unit_cost', [Validators.nullValidator])
      setUnsetValidators(form, 'quantity', [Validators.nullValidator])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.nullValidator])
    }

    this.onCalculationChange();
  }

  onCountryCodeSelection(form: AbstractControl) {
    let contact_no = form.get('contact_no')
    let flag = this.countryPhoneCodeList.filter(codeFlag => codeFlag.phone_code == contact_no.value['code'])[0].flag_url
    contact_no.get('flag').setValue(flag)
    this.initialValues.countryCode = { label: contact_no.value['code'], value: contact_no.value['code'] }
  }

  setContactPerson(contactPerson: string) {
    let contact_no = this.craneFormGroup.get('location_details.contact_no') as AbstractControl;
    if (contactPerson.trim()) {
      this.craneFormGroup.get('location_details.contact_name').setValue(contactPerson);
      setUnsetValidators(contact_no, 'number', [Validators.required, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
      this.initialValues.contactName = new Object({ label: contactPerson, value: contactPerson });
    } else {
      setUnsetValidators(contact_no, 'number', [Validators.nullValidator, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
      contact_no.get('code').setValue(this.defaultPhoneFlag.code)
      contact_no.get('number').setValue('');
      this.craneFormGroup.get('location_details.contact_name').setValue('')
      this.initialValues.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
      this.initialValues.contactName = new Object({ label: '', value: '' });
    }

  }

  onContactPersonSelection(contactPerson: string) {

    let contact_no = this.craneFormGroup.get('location_details.contact_no') as AbstractControl;
    if (contactPerson.trim()) {
      setUnsetValidators(contact_no, 'number', [Validators.required]);
    } else {
      setUnsetValidators(contact_no, 'number', [Validators.nullValidator, Validators.pattern(this.pattern.PHONE_NUMBER_NULL_10)]);
    }
    let contactDetails = this.contactPersonList.filter(contact => contact.name == contactPerson)[0];
    this.initialValues.contactName = { label: contactPerson, value: contactPerson }
    this.initialValues.countryCode = { label: contactDetails.country_code, value: contactDetails.country_code }
    contact_no.get('code').setValue(contactDetails.country_code);
    contact_no.get('number').setValue(contactDetails.contact_number);
    let flag = this.countryPhoneCodeList.filter(codeFlag => codeFlag.phone_code == contact_no.value['code'])[0].flag_url
    contact_no.get('flag').setValue(flag)
  }

  getPhoneCountryCode() {
    this._companyModuleService.getPhoneCode().subscribe(result => {
      this.countryPhoneCodeList = result['results'];
    });
  }

  onchangeRentalCharge() {
    this.onCalculationChange();
  }


  addCharges() {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        data: this.workOrderForm.get('vehicle_category').value,
        sales: true,
        purchase: false,
        vehicleCategory: true,
        isDisableSeletAll: true
      },
      closeOnNavigation: true,
      disableClose: true,
      autoFocus: false
    });
    let dialogRefSub = dialogRef.closed.subscribe((result) => {
      if (result) {
        const additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
        additionalCharge.push(this.getAdditionalChargeFormGroup(result));
        this.initialValues.unit.push(result['unit_of_measurement'])
        this.initialValues.additionalTax.push(result['tax'])
        let form = additionalCharge.controls[additionalCharge.length - 1] as FormGroup
        form.get('is_checked').setValue(true);
        this.onChangeAdditionalChargeCheckBox(form)
      }
      dialogRefSub.unsubscribe()

    });
  }

  onChangeWorkingDuration() {
    this.durationTotal = 1
    const working_duration = this.craneFormGroup.get('rental_charge.working_duration');
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    let totalHours = 0;
    let singleShifttime = 0;
    let shiftHours = 0;
    let durationLabel = '';
    if (working_duration.value['working'] == 'daily') {
      durationLabel = working_duration.value['duration'] == 1 ? 'day' : 'days';
      totalHours = this.dailyHours * Number(working_duration.value['duration']) * shift
      singleShifttime = this.dailyHours * Number(working_duration.value['duration'])
      shiftHours = this.dailyHours * shift
      this.durationTotal = Math.ceil(Number(singleShifttime / this.dailyHours))
    }
    if (working_duration.value['working'] == 'weekly') {
      durationLabel = working_duration.value['duration'] == 1 ? 'week' : 'weeks';
      totalHours = this.weeklyHours * Number(working_duration.value['duration']) * shift
      shiftHours = this.weeklyHours * shift
      singleShifttime = this.weeklyHours * Number(working_duration.value['duration'])
      this.durationTotal = Math.ceil(Number(singleShifttime / this.weeklyHours))
    }
    if (working_duration.value['working'] == 'monthly') {
      durationLabel = working_duration.value['duration'] == 1 ? 'month' : 'months';
      totalHours = this.monthlyHours * Number(working_duration.value['duration']) * shift
      shiftHours = this.monthlyHours * shift
      singleShifttime = this.monthlyHours * Number(working_duration.value['duration'])
      this.durationTotal = Math.ceil(Number(singleShifttime / this.monthlyHours))
    }
    if (this.saleorderBasedOn == 'hour') {
      this.totalSalesHours = `${working_duration.value['duration']} ${durationLabel} X ${shiftHours} hours = ${totalHours} hours`;
    }
    if (this.saleorderBasedOn == 'day') {
      let shiftDays = (shiftHours / shift) / this.dailyHours;
      let totalDays = (totalHours / shift) / this.dailyHours;
      this.totalSalesHours = `${working_duration.value['duration']} ${durationLabel} X ${shiftDays} Days = ${totalDays} Days`;
    }
    this.onCalculationChange();
  }

  resetCharges() {
    this.initialValues.shifType = new Object({ label: 'Single Shift', value: '1' });
    this.initialValues.fuelType = new Object({ label: 'Without Fuel', value: '1' });
    this.initialValues.working = new Object({ label: 'Daily', value: 'daily' });
    this.craneFormGroup.get('rental_charge').patchValue({
      no_of_shifts: 1,
      fuel_type: 2,
    });
    this.craneFormGroup.get('rental_charge.working_duration').patchValue({
      duration: 1,
      working: 'daily'
    })
    this.buildRentalCharges([{}]);
    this.getAdditionalCharge();
  }


  getDefaultCalculations() {
    return {
      rental_charges: '0.000',
      additional_charges: '0.000',
      VAT_amount: '0.000',
      total_amount: '0.000'
    }
  }

  onCalculationChange() {
    this.calculations = this.getDefaultCalculations();
    let additionalChargesTaxTotal = 0;
    const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    const additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.controls.forEach(form => {
      form.get('total').setValue((Number(form.get('quantity').value) * Number(form.get('unit_cost').value)).toFixed(3))
      if (form.value['is_checked']) {
        this.calculations.additional_charges = (Number(this.calculations.additional_charges) + Number(form.value['total'])).toFixed(3)
      }
    })
    rentalChargesItems.controls.forEach(form => {
      form.get('total_amount').setValue(Number(form.get('rental_charge').value * Number(this.durationTotal)))
      this.calculations.rental_charges = (Number(this.calculations.rental_charges) + (Number(form.get('total_amount').value))).toFixed(3)
    })
    this.taxOptions.forEach((tax) => {
      additionalCharge.controls.forEach(form => {
        if (form.value['is_checked']) {
          if (form.value['tax'] == tax.id) {
            let amountWithoutTax = Number(form.get('total').value)
            let amountWithTax = Number(tax.value / 100 * amountWithoutTax)
            additionalChargesTaxTotal = additionalChargesTaxTotal + amountWithTax
          }
        }
      })
    })
    this.taxOptions.forEach((tax) => {
      if (this.craneFormGroup.get('tax').value == tax.id) {
        let amountWithoutTax = Number(this.calculations.additional_charges) + Number(this.calculations.rental_charges)
        this.calculations.VAT_amount = Number(tax.value / 100 * Number(this.calculations.rental_charges) + Number(additionalChargesTaxTotal)).toFixed(3);
        this.calculations.total_amount = (Number(this.calculations.VAT_amount) + Number(amountWithoutTax)).toFixed(3)

      }
    })

    this.craneFormGroup.get(this.formType + '_calculations').setValue(this.calculations)
  }

  patchCrane(workOrderDetails) {
    this.patchLocationDetails(workOrderDetails[this.formType]['location_details'])
    this.patchRentalCharge(workOrderDetails[this.formType]['rental_charge'])
    this.patchAdditionalCharge(workOrderDetails)
    this.patchBalance(workOrderDetails[this.formType])
    setTimeout(() => {
      this.customFieldData.next(workOrderDetails[this.formType]['other_details'])
      this.onChangeWorkingDuration();
    }, 1000);
  }

  patchLocationDetails(data) {
    let location_details = this.craneFormGroup.get('location_details') as FormGroup;
    location_details.patchValue({
      checklist: data['checklist'],
      contact_name: data['contact_name'],
      zone: data['zone'] ? data['zone']['id'] : null,
      location: data['location'],
      area: data['area']['id'],
      show_in_invoice : data['show_in_invoice'],
    })
    let contact_no = this.craneFormGroup.get('location_details.contact_no') as FormGroup;
    contact_no.patchValue(data['contact_no'])
    this.initialValues.contactName = { label: data['contact_name'], value: data['contact_name'] }
    this.initialValues.countryCode = { label: data['contact_no']['code'], value: data['contact_no']['code'] };
    this.initialValues.zone = { label: data['zone'] ? data['zone']['name'] : '', value: data['zone'] ? data['zone']['id'] : '' }
    this.initialValues.area = { label: data['area'] ? data['area']['name'] : '', value: data['area'] ? data['area']['id'] : '' }

  }

  patchAdditionalCharge(data) {
    let params = {
      vehicle_category: data['vehicle_category']
    }
    this._rateCard.getCustomerAdditionalCharge(data['customer']['id'], params).subscribe((response: any) => {
      this.additionalCharges = response.result;
      if (data[this.formType]['additional_charge'].length > 0) {
        this.additionalCharges.forEach(charges => {
          let isMatchFound: boolean = false;
          data[this.formType]['additional_charge'].forEach(selectedCharges => {
            if (selectedCharges['name'].id == charges['name'].id) {
              charges['is_checked'] = true;
              charges['quantity'] = selectedCharges['quantity']
              charges['unit_cost'] = selectedCharges['unit_cost']
              charges['unit_of_measurement'] = selectedCharges['unit_of_measurement']
              charges['tax'] = selectedCharges['tax']
              charges['total'] = selectedCharges['total'];
              isMatchFound = true;
            } else {
              if (!isMatchFound) {
                charges['unit_cost'] = charges['rate'];
              }
            }
          });
        })
      }
      this.buildAdditionalChargesInEdit(this.additionalCharges)
      this.onCalculationChange();
    });
  }
  buildAdditionalChargesInEdit(items = []) {
    this.initialValues.unit = [];
    this.initialValues.additionalTax = [];
    let additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let additional_charge = this.getAdditionalChargeFormGroupInEdit(item)
        if(item?.is_checked){
          setUnsetValidators(additional_charge, 'unit_cost', [Validators.required, Validators.min(0.1)])
          setUnsetValidators(additional_charge, 'quantity', [Validators.required, Validators.min(0.1)])
          setUnsetValidators(additional_charge, 'unit_of_measurement', [Validators.required])
        }
        additionalCharge.push(additional_charge)
        this.initialValues.unit.push(item['unit_of_measurement']);
        this.initialValues.additionalTax.push(item['tax']);
      });
    } else {
      this.addMoreAdditionalChargeItem()
    }
  }

  getAdditionalChargeFormGroupInEdit(item) {
    return this._fb.group({
      is_checked: [item?.is_checked ? true : false],
      name: [item.name],
      unit_of_measurement: [item.unit_of_measurement],
      quantity: [item.quantity || 0],
      unit_cost: [item.unit_cost || 0],
      rate: [item.rate || 0],
      total: 0,
      tax: [item.tax.id]
    })
  }



  patchRentalCharge(data) {
    this.initialValues.fuelType = this.fuelType[data['fuel_type']]
    this.initialValues.shifType = this.shiftType[data['no_of_shifts']]
    this.initialValues.billingUnit=this.rateCardBillingList.find(item=>item.value==data['billing_unit'])
    if (data['working_duration']['working']) {
      this.initialValues.working = this.durationType.find(item => item.value == data['working_duration']['working'])
    }
    this.setBillingUnitType(data['billing_unit'])
    data['no_of_shifts'] = Number(data['no_of_shifts']) + 1
    data['fuel_type'] = Number(data['fuel_type']) + 1
    this.previousShift = data['no_of_shifts'];
    this.craneFormGroup.get('rental_charge').patchValue(data)
    let rental_charges = []
    rental_charges = cloneDeep(data['rental_charges'])
    rental_charges.forEach((charges,index) => {
      if (charges['specification']) {
        charges['specification'] = charges['specification'].id;
        this.getPreviousSpecValues(charges['specification'], charges['rental_charge'],index)
      }
      if (charges['vehicle_no']) {
        charges['vehicle_no'] = charges['vehicle_no'].id
      }
      if (charges['vehicle_provider']) {
        charges['vehicle_provider'] = charges['vehicle_provider'].id
      }
      if (charges['lpo']) {
        charges['lpo'] = charges['lpo'].id
      }
    })

    this.buildRentalCharges(rental_charges);
    data['rental_charges'].forEach((charges, index) => {
      if (charges['specification']) {
        this.initialValues.specifications[index] = { label: charges['specification'].specification, value: charges['specification'].id }
      }
      if (charges['vehicle_no']) {
        this.initialValues.vehicle[index] = { label: charges['vehicle_no'].reg_no, value: charges['vehicle_no'].id }
      }
      if (charges['vehicle_provider']) {
        this.initialValues.vehicleProvider[index] = { label: charges['vehicle_provider'].name, value: charges['vehicle_provider'].id }
      }
      if (charges['lpo']) {
        this.initialValues.lpo[index] = { label: charges['lpo'].name, value: charges['lpo'].id }
      }
    })

    setTimeout(() => {
      const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
      rentalChargesItems.controls.forEach((form, index) => {
        if (form.get('specification').value) {
          this._vehicleService.getVehicleListByCatagory(this.workOrderForm.get('vehicle_category').value, form.get('specification').value).subscribe((response: any) => {
            this.initialValues.vehicleList[index] = response.result['veh'];
          });
          this.getRateCardForSpectifiaction(form,index)
        }
        if (form.get('vehicle_provider').value) {
          this.getLpoList(form.get('vehicle_provider').value, index)
        }
      });
      this.checkIsMarketVehicle();
    }, 1000);
  }

  getPreviousSpecValues(specification, charge,index:number) {
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    const working = this.craneFormGroup.get('rental_charge.working_duration').value['working'];
    const fuel_type = this.craneFormGroup.get('rental_charge').get('fuel_type').value
    const customer = this.workOrderForm.get('customer').value;
    const zone = this.craneFormGroup.get('location_details').get('zone').value;
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value

    let params = {
      specification: specification,
      zone: zone,
      vehicle_category: this.workOrderForm.get('vehicle_category').value,
      billing_unit:billingUnit
    }
    if (customer && zone && specification) {
      this._rateCard.getRentalCharges(customer, params).subscribe(resp => {
        this.customerRateCardsExisted[index] = resp['result']?.is_from_customer ? resp['result'].is_from_customer : false;
        this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
        if (resp['result']) {
          let rate = 0;
          const withFuel = Number(resp['result'][working]['with_fuel'])
          const withoutFuel = Number(resp['result'][working]['without_fuel'])
          if (fuel_type == 1) {
            rate = withFuel * Number(shift)
          }
          if (fuel_type == 2) {
            rate = withoutFuel * Number(shift)
          }
          let data = {
            specification: specification,
            prefilledRentalValue: rate
          }
          let validationDetails: any[] = this.craneFormGroup.get('price_validation_details').value;
          const specificationValue = specification;
          const existingIndex = validationDetails.findIndex((ele) => ele.specification === specificationValue);
          if (existingIndex !== -1) {
            validationDetails[existingIndex] = data;
          } else {
            validationDetails.push(data);
          }
          this.craneFormGroup.get('price_validation_details').setValue(validationDetails)
        }
      })

    }

  }

  patchBalance(data) {
    this.initialValues.tax = data['tax']
    this.craneFormGroup.get('tax').setValue(data['tax'].id)
  }

  patchDataFromQuotation(data) {
    this.craneFormGroup.get('price_validation_details').setValue([])
    let craneData = data[this.formType];
    let locationDetails = craneData['location_details']
    this.initialValues.tax = craneData['tax']
    this.craneFormGroup.get('tax').setValue(craneData['tax'].id)
    let rental_charges = [];
    let workingDurationType = 'daily'
    let fuelType = 1
    let location_details = this.craneFormGroup.get('location_details') as FormGroup;
    location_details.patchValue({
      zone: locationDetails['zone'] ? locationDetails['zone']['id'] : null,
      location: locationDetails['location'],
      area: locationDetails['area']['id'],
      show_in_invoice : true
      
    })    
    this.initialValues.area = { label: locationDetails['area'] ? locationDetails['area']['label'] : '', value: locationDetails['area'] ? locationDetails['area']['id'] : '' }
    this.initialValues.zone = { label: locationDetails['zone'] ? locationDetails['zone']['name'] : '', value: locationDetails['zone'] ? locationDetails['zone']['id'] : '' }
    let workingDuration = craneData['working_duration'];
    let rentalCharge = craneData['rental_charge']
    this.initialValues.shifType = this.shiftType[rentalCharge['no_of_shifts']]
    this.initialValues.billingUnit=this.rateCardBillingList.find(item=>item.value==rentalCharge['billing_unit'])
    this.setBillingUnitType(rentalCharge['billing_unit']);
    let rental_charge = this.craneFormGroup.get('rental_charge')
    this.previousShift = Number(rentalCharge['no_of_shifts']) + 1
    rental_charge.patchValue({
      no_of_shifts: this.previousShift,
      billing_unit:rentalCharge['billing_unit']
    })
    this.billingUnitType = rentalCharge['billing_unit'];
    if (workingDuration['working']) {
      workingDurationType = workingDuration['working']
      this.initialValues.working = this.durationType.find(item => item.value == workingDurationType)
      rental_charge.get('working_duration').patchValue(workingDuration)
      let withoutFuel = workingDurationType + '_wo_fuel';
      let withFuel = workingDurationType + '_wth_fuel';
      if (rentalCharge[withFuel]) {
        fuelType = 0
      }
      if (rentalCharge[withoutFuel]) {
        fuelType = 1
      }
      this.initialValues.fuelType = this.fuelType[fuelType]
      rental_charge.patchValue({
        fuel_type: fuelType + 1
      })
    }
    rental_charges = cloneDeep(rentalCharge['rental_charges'])
    rental_charges.forEach(charges => {
      if (charges['specification']) {
        charges['specification'] = charges['specification'].id
        let data = {
          daily: charges['daily'],
          weekly: charges['weekly'],
          monthly: charges['monthly'],
        }
        this.addDeletequotationAndRateCardDataForSpecification(charges['specification'], rentalCharge['billing_unit']+'_quotation_rate_card', data)
      }

      if (fuelType == 0) {
        charges['rental_charge'] = charges[workingDurationType]['with_fuel']
      }
      if (fuelType == 1) {
        charges['rental_charge'] = charges[workingDurationType]['without_fuel']
      }
      charges['extra_hours'] = charges[workingDurationType]['additional_hours']
    })
    this.buildRentalCharges(rental_charges);
    this.patchAdditionalCharge(data);
    rentalCharge['rental_charges'].forEach((charges, index) => {
      if (charges['specification']) {
        this.initialValues.specifications[index] = { label: charges['specification'].name, value: charges['specification'].id }
      }
    })

    setTimeout(() => {
      const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
      rentalChargesItems.controls.forEach((form, index) => {
        let data = {
          specification: form.get('specification').value,
          prefilledRentalValue: Number(form.get('rental_charge').value),
        }
        let validationDetails: any[] = this.craneFormGroup.get('price_validation_details').value;
        validationDetails.push(data);
        this.craneFormGroup.get('price_validation_details').setValue(validationDetails)
        if (form.get('specification').value) {
          this._vehicleService.getVehicleListByCatagory(this.workOrderForm.get('vehicle_category').value, form.get('specification').value).subscribe((response: any) => {
            this.initialValues.vehicleList[index] = response.result['veh'];
          });
        }
        this.getRateCardForSpectifiaction(form,index)
      });
      this.onChangeWorkingDuration();
    }, 1000);

  }

  previousValuesFromQuotationInEdit(data) {
    let validationDetails: any[] = this.craneFormGroup.get('price_validation_details').value;
    this.craneFormGroup.get('price_validation_details').setValue([])
    let craneData = data[this.formType];
    let rental_charges = [];
    let workingDurationType = craneData['working_duration']['duration']
    let fuelType = 1
    let workingDuration = craneData['working_duration'];
    let rentalCharge = craneData['rental_charge']
    if (workingDuration['working']) {
      workingDurationType = workingDuration['working']
      let withoutFuel = workingDurationType + '_wo_fuel';
      let withFuel = workingDurationType + '_wth_fuel';
      if (withoutFuel) {
        fuelType = 1
      }
      if (withFuel) {
        fuelType = 0
      }
    }
    rental_charges = cloneDeep(rentalCharge['rental_charges'])
    rental_charges.forEach(charges => {
      if (charges['specification']) {
        charges['specification'] = charges['specification'].id
        let data = {
          daily: charges['daily'],
          weekly: charges['weekly'],
          monthly: charges['monthly'],
        }
        this.addDeletequotationAndRateCardDataForSpecification(charges['specification'],craneData['rental_charge']['billing_unit']+'_quotation_rate_card', data)
      }
      if (fuelType == 0) {
        charges['rental_charge'] = charges[workingDurationType]['with_fuel']
      }
      if (fuelType == 1) {
        charges['rental_charge'] = charges[workingDurationType]['without_fuel']
      }
      let data = {
        specification: charges['specification']?.id,
        prefilledRentalValue: Number(charges['rental_charge']),
      }
      validationDetails.push(data);
      this.craneFormGroup.get('price_validation_details').setValue(validationDetails)
    })
  }

  getRateCardForSpectifiaction(form,index:number) {
    const customer = this.workOrderForm.get('customer').value;
    const zone = this.craneFormGroup.get('location_details').get('zone').value;
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value
    let params = {
      specification: form.get('specification').value,
      zone: zone,
      vehicle_category: this.workOrderForm.get('vehicle_category').value,
      billing_unit:billingUnit
    }
    if (customer && zone) {
      this._rateCard.getRentalCharges(customer, params).subscribe(resp => {
        this.customerRateCardsExisted[index] = resp['result']?.is_from_customer ? resp['result'].is_from_customer : false;
        this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
        if (resp['result']) {
          this.addDeletequotationAndRateCardDataForSpecification(form.get('specification').value, billingUnit+'_rate_card', resp['result'])
        }
      })
    }
  }

  addDeletequotationAndRateCardDataForSpecification(specification: string, key: string, data: any, type: string = 'add') {
    if (type == 'add') {
      if (this.quotationAndRateCardDataForSpecification[specification]) {
        this.quotationAndRateCardDataForSpecification[specification][key] = data
      } else {
        this.quotationAndRateCardDataForSpecification[specification] = {}
        this.quotationAndRateCardDataForSpecification[specification][key] = data
      }
      this.quotationAndRateCardDataForSpecification['working_duration'] = this.workingDuration;
      this.quotationAndRateCardDataForSpecification['fuelProvision'] = this.fuelProvision;
      this.quotationAndRateCardDataForSpecification['billing_type'] = this.billingUnitType;
      this.rateCardQuotationPreviousValues.emit(this.quotationAndRateCardDataForSpecification);
    } else {
      if (this.quotationAndRateCardDataForSpecification[specification]) {
        if (this.quotationAndRateCardDataForSpecification[specification].hasOwnProperty(key))
          delete this.quotationAndRateCardDataForSpecification[specification][key]

      }
    }

  }

  vehicelAndDateChanged() {
    let rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    let vehicles: any[] = []
    rentalChargesItem.controls.forEach((control: FormGroup) => {
      let vehicleId = control.get('vehicle_no').value;
      let jobStartDate = moment(control.get('job_start_date').value).format('YYYY-MM-DD');
      if (isValidValue(vehicleId)) {
        vehicles.push({
          date: jobStartDate,
          id: vehicleId
        })
      }
    });
    this.selectedvehicleAndJobDate.emit(vehicles)
  }

  onVehicleSelection(form: FormGroup, index) {
    const vehicleObj = this.initialValues.vehicleList[index].find(vehicle => vehicle.id == form.get('vehicle_no').value)
    if (vehicleObj) {
      form.get('is_transporter').setValue(vehicleObj['is_transporter'])
    }
    form.get('vehicle_provider').setValue(null)
    form.get('lpo').setValue(null)
    this.checkIsMarketVehicle();
  }

  getVendorList() {
    this._partyService.getPartyListV2().subscribe(resp => {
      this.partyListVendor = resp['result']['vendors']
    })
  }

  onVehicleProviderChange(form: FormGroup, index) {
    const vehicleProvider = form.get('vehicle_provider').value
    this.getLpoList(vehicleProvider, index)
  }

  getLpoList(id, index) {
    this._lpoService.getLopListByVendor(id).subscribe(resp => {
      this.initialValues.lpoList[index] = resp['result']['lpo']
    })
  }

  checkIsMarketVehicle() {
    let rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    this.isMarketVehicle = rentalChargesItem.value.some(rentalcharge => rentalcharge.is_transporter == true);
  }

  getSetBillingPreferences() {
    let partyId = this.workOrderForm.get('customer').value
    let vehicleCategory =Number (this.workOrderForm.get('vehicle_category').value) ==1?'crane':'awp'
    this.onBillingUnitChange();
    if(partyId)
    this._party.getBillingPreference(partyId,vehicleCategory).subscribe((response: any) => {
      this.craneFormGroup.get('rental_charge').get('billing_unit').setValue(response.result)
    this.initialValues.billingUnit = this.rateCardBillingList.find(type=>type.value==response.result)
    this.onBillingUnitChange();
   })
  }

  getAreaList(){
    this._commonService.getStaticOptions('area').subscribe((response) => {
      this.areaList = response.result['area'];
    });
  }

  addNewArea(event) {
    this.areaParams = {
      key: 'area',
      label: event,
      value: 0
    };
  }
  getNewArea(event) {
    if (event) {
      this._commonService
      .getStaticOptions('area')
      .subscribe((response) => {
        let form = this.craneFormGroup.get('location_details') as UntypedFormGroup ;
        form.get('area').setValue(event.id);
        this.initialValues.area.label = event.label;
        this.initialValues.area.value = event.id;
        this.areaList = response.result['area'];

      });
    }
  }



}
