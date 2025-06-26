import { Dialog } from '@angular/cdk/dialog';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl, Validators, UntypedFormGroup } from '@angular/forms';
import { cloneDeep, isArray } from 'lodash';
import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { RateCardBillingBasedOn, ValidationConstants } from 'src/app/core/constants/constant';
import { PhoneCodesFlagService } from 'src/app/core/services/phone-code_flag.service';
import { CompanyModuleServices } from 'src/app/modules/customerapp-module/api-services/company-service/company-module-service.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { setAsTouched, addErrorClass, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import moment from 'moment';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { CommonService } from 'src/app/core/services/common.service';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';

@Component({
  selector: 'app-add-job-template-crane',
  templateUrl: './add-job-template-crane.component.html',
  styleUrls: ['./add-job-template-crane.component.scss']
})
export class AddJobTemplateCraneComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() parentForm: FormGroup;
  @Input() formType = 'crane';
  jobBasedOn:'hour'|'day'='hour'
  @Input() contactPersonList = [];
  @Input() workOrderDetails?: Observable<any>
  @Input() specificationChange: Observable<any>
  @Input() quotationDetails?: Observable<any>
  @Input() tripDetails?: Observable<any>
  @Input() driverId: Observable<any>
  @Input() isFormValid: Observable<boolean>;
  @Input() prevRentalCharge : Observable<any>;
  @Output() rateCardQuotationPreviousValues = new EventEmitter<any>();
  @Output() selectedJobStartDate = new EventEmitter<any>();
  @Output() locationSelectedEmitter = new EventEmitter<any>();
  @Input() isMarketVehicleSelected? : Observable<any>;
  @Output() isCustomerRateCardExisted = new EventEmitter<boolean[]>();
  customerRateCardsExisted : boolean[]= [];
  craneFormGroup: FormGroup;
  locationToolTip: ToolTipInfo;
  tripTaskToolTip: ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants();
  isLocationValid = new BehaviorSubject(true)
  isFormValidCustomField = new BehaviorSubject(true)
  isFormValidDriverAllowanceField = new BehaviorSubject(true)
  customFieldData = new Subject()
  driverAllowanceEdit = new Subject()
  isPaidByDriver = true;

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
    shifType: {},
    fuelType: {},
    zone: {},
    area:getBlankOption(),
    contactName: {},
    countryCode: {},
    working: {},
    shifTypeFrMarket: {},
    fuelTypeFrMarket: {},
    workingFrMarket : {},
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
  previousShift = 1;
  previousShiftFrMarket = 1;
  totalJobsHours = '';
  dailyHours = 1;
  weeklyHours = 0;
  monthlyHours = 0;
  durationTotal = 1;
  totalHours=1;
  isDriverAllowanceTabError = false;
  isRentalChargesTabError = false;
  isMarketRentalChargesTabError = false;
  iscustomFieldTabError = false;
  isLocationChanged = false;
  isStartDateChanged=false;
  $subscriptionList: Array<Subscription> = []
  isEdit : boolean = false;
  specificationRentalCharge = {}
  fuelProvision ;
  workingDuration;  areaList=[];
  isRentalEditable:boolean=true;
  isMarketRentakEditable:boolean=true;
  specificationRentalChargeFrMarket = {}
  fuelProvisionFrMarket ;
  workingDurationFrMarket;  
  areaListFrMarket=[];
  isRentalEditableFrMarket:boolean=true;
  displayMarketRentalCharges : boolean = false;
  currency_type:any;
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour = this.rateCardBilling.hour
  rateCardBillingDays = this.rateCardBilling.day 
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};
  
  constructor(private _fb: FormBuilder, public dialog: Dialog, private _rateCard: RateCardService, private _companyModuleService: CompanyModuleServices,
    private _phone_codes_flag_service: PhoneCodesFlagService, private _newTripService: NewTripV2Service,private _party:PartyService,
    private currency: CurrencyService,private _commonService : CommonService) { }

  ngOnInit(): void {
    this.defaultPhoneFlag = this._phone_codes_flag_service.phoneCodesFlag;
    this.initialValues.countryCode = { label: this.defaultPhoneFlag.code, value: this.defaultPhoneFlag.code }
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.buildRentalCharges([{}]);
    this.getZonesList();
    this.getPhoneCountryCode();

    this.initialValues.shifType = this.shiftType[0];
    this.initialValues.fuelType = this.fuelType[1];
    this.initialValues.working = this.durationType[0];
    this.initialValues.shifTypeFrMarket = this.shiftType[0];
    this.initialValues.fuelTypeFrMarket = this.fuelType[1];
    this.initialValues.workingFrMarket = this.durationType[0];
    this.locationToolTip = {
      content: this.constantsTripV2.toolTipMessages.LOCATION.CONTENT
    }
    this.tripTaskToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_TASK.CONTENT
    }
    this.parentForm.addControl(this.formType, this.craneFormGroup);
    this.onBillingUnitChange();
    this.$subscriptionList.push(this.isFormValid.subscribe(vaild => {
      if (!vaild) {
        this.isRentalChargesTabError = this.craneFormGroup.get('rental_charge').invalid;
        this.isMarketRentalChargesTabError = this.craneFormGroup.get('market_rental_charge').invalid;
        this.iscustomFieldTabError = this.craneFormGroup?.get('other_details')?.invalid;
        this.isDriverAllowanceTabError = this.craneFormGroup?.get('driver_allowances')?.invalid;
        this.isFormValidCustomField.next(this.craneFormGroup?.get('other_details')?.valid)
        this.isFormValidDriverAllowanceField.next(this.craneFormGroup?.get('driver_allowances')?.valid)
        this.isLocationValid.next(this.craneFormGroup.get('location_details.location').valid)
        setAsTouched(this.craneFormGroup);
      }
    }))
    this.$subscriptionList.push(this.specificationChange.subscribe(val => {
      if (val)
        this.getRateCardForSpectifiaction()
    }));
    this.getAreaList();
  }

  ngAfterViewInit(): void {

    if (this.workOrderDetails) {
      this.$subscriptionList.push(this.workOrderDetails.subscribe(val => {
        if (val)
          this.patchWorkOrderDetails(cloneDeep(val))
      }));
    } 
    if (this.quotationDetails) {
      this.$subscriptionList.push(this.quotationDetails.subscribe(val => {
        if (val)
          this.patchDataFromQuotation(cloneDeep(val))
      }))

    }
    if (this.tripDetails) {
    this.$subscriptionList.push(this.tripDetails.subscribe(val => {
     if(!val){
       this.getSetBillingPreferences()
     }
     if (val)
          this.patchTripEdit(val)
      }))
    }
    this.prevRentalCharge.subscribe((data)=>{      
      this.craneFormGroup.get('price_validation_details').setValue(data);
    })
    this.isMarketVehicleSelected.subscribe((selected)=>{
      if(selected){
        this.displayMarketRentalCharges = true;
        this.buildRentalChargesForMarketVehicle([{}])
      }else{
        this.displayMarketRentalCharges = false;
        let charges = this.craneFormGroup.get('market_rental_charge').get('market_rental_charges') as FormArray;
        charges.controls = [];
        this.resetChargesFrMarket();
      }
    })
  }

  ngOnDestroy(): void {
    this.parentForm.removeControl(this.formType);
    this.$subscriptionList.forEach(sub => [
      sub.unsubscribe()
    ])
  }

  buildForm() {
    this.craneFormGroup = this._fb.group({
      documents: [[]],
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
      market_rental_charge : this._fb.group({
        market_rental_charges: this._fb.array([])
      }),
      location_details: this._fb.group({
        show_in_invoice: [true],
        zone: '',
        job_start_date: [moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')],
        job_end_date: [moment(moment(new Date()).tz(localStorage.getItem('timezone'))).startOf('day')], 
        checklist: [[]],
        contact_name: '',
        contact_no: this._fb.group({
          flag: this.defaultPhoneFlag.flag,
          code: this.defaultPhoneFlag.code,
          number: ''
        }),
        location: this._fb.group({
          name: [''],
          lng: '',
          lat: '',
          alias: ''
        }),
        area: ['',[Validators.required]],
      }),
      price_validation_details : [0]
    })
    this.craneFormGroup.get('rental_charge').valueChanges.subscribe((res)=>{
      let fuel_Provision = Number(this.craneFormGroup.get('rental_charge').get('fuel_type').value);
      this.workingDuration  = this.craneFormGroup.get('rental_charge').get('working_duration').get('working').value;
      if(fuel_Provision==1){
        this.fuelProvision = 'with_fuel'
      }else{
        this.fuelProvision = 'without_fuel';
      }
      this.specificationRentalCharge['working_duration'] = this.workingDuration;
      this.specificationRentalCharge['fuelProvision'] = this.fuelProvision;
      this.specificationRentalCharge['billing_type'] = this.craneFormGroup.get('rental_charge').get('billing_unit').value
      this.rateCardQuotationPreviousValues.emit(this.specificationRentalCharge)
    })
  }

  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  onZoneChange() {
    this.resetCharges();
    this.resetChargesFrMarket()
    this.getRateCardForSpectifiaction();
  }

  dateTimeSelected(e){
    let date = moment(e.value).format('YYYY-MM-DD')
    this.selectedJobStartDate.emit(date)
  }

  locationSelected(e) {
    this.craneFormGroup.get('location_details').get('location').patchValue(e['value'])
    if (e['value']['lat']) {
      this.center = { lat: e['value'].lat, lng: e['value'].lng }
      this.markerPositions = [{ lat: e['value'].lat, lng: e['value'].lng }]
    } else {
      this.markerPositions = [];
    }
    this.locationSelectedEmitter.emit(e)
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
    let rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    rentalChargesItem.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let rental_charge = this.getRentalChargeFormGroup(item)
        rentalChargesItem.push(rental_charge)
      });
    } else {
      this.addMoreRentalChargeItem()
    }

  }
  addMoreRentalChargeItem() {
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    rentalChargesItem.push(this.getRentalChargeFormGroup({}));
  }

  getRentalChargeFormGroup(item) {
    return this._fb.group({
      id: [item?.id || null],
      rental_charge: [item?.rental_charge || 0.000],
      rental_rate:[item?.rental_rate || 0.000],
      total_amount: [item?.total_amount || 0.000],
      extra_hours: [item?.extra_hours || 0.000],
    })
  }
  removeRentalChareItem(index) {
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    rentalChargesItem.removeAt(index);
    this.onCalculationChange();
    this.onCalculationChangeFrMarket();
  }


  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }

  onBillingUnitChange(){
    let billingUnit = this.craneFormGroup.get('rental_charge').get('billing_unit').value
    this.setBillingUnit(billingUnit);
    this.getRateCardForSpectifiaction();
    this.onChangeWorkingDuration();
  }

  setBillingUnit(billingUnit){
    this.jobBasedOn = billingUnit;
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
    this.totalHours=this.dailyHours;
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
      const rentalChargesItemsForMarketVehicle = (this.craneFormGroup.controls['market_rental_charge'].get('market_rental_charges')) as FormArray;
      rentalChargesItemsForMarketVehicle.controls.forEach(form => {
        const rental_charge = form.get('market_rental_charge')
        if (this.previousShift == 1) {
          rental_charge.setValue((Number(rental_charge.value) / 2).toFixed(3));
        } else {
          rental_charge.setValue((Number(rental_charge.value) * 2).toFixed(3));
        }
      });
    }
    this.onChangeWorkingDuration();
    this.onCalculationChange();
    this.onCalculationChangeFrMarket();
  }

  getAndSetRentalCharge() {
    let specification = this.parentForm.get('specification').value
    let billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value
    let isRateCard = false;
    let isQuotationData = false;
    let isSalesOrderData = false;
    if (specification && this.specificationRentalCharge[specification]) {
      isRateCard = this.specificationRentalCharge[specification].hasOwnProperty(billingUnit+'_rate_card')
      isQuotationData = this.specificationRentalCharge[specification].hasOwnProperty(billingUnit+'_quotation_rate_card')
      isSalesOrderData = this.specificationRentalCharge[specification].hasOwnProperty(billingUnit+'_sales_order_rate_card')
    }
    const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    rentalChargesItems.controls.forEach(form => {
      form.get('extra_hours').setValue('0.000')
      form.get('rental_charge').setValue('0.000')
      if (!isRateCard) {
        if (isQuotationData) {
          this.patchRateCardValues(form, billingUnit+'_quotation_rate_card')
        } else if (isSalesOrderData) {
          this.patchRateCardValues(form,  billingUnit+'_sales_order_rate_card')
        }
      }
      if (!isQuotationData && !isSalesOrderData) {
        if (isRateCard) {
          this.patchRateCardValues(form, billingUnit+'_rate_card');
        }
      }

      if (isQuotationData && isRateCard) {
        if (isQuotationData) {
          this.patchRateCardValues(form, billingUnit+'_quotation_rate_card')
        }
      }

      if (isRateCard && isSalesOrderData) {
        if (isSalesOrderData) {
          this.patchRateCardValues(form, billingUnit+'_sales_order_rate_card');
        } 
      }
    })
    this.onCalculationChange();
    this.onCalculationChangeFrMarket();
  }


  patchRateCardValues(form: AbstractControl, key) {
    let specification = this.parentForm.get('specification').value
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    const billingUnit = this.craneFormGroup.get('rental_charge').get('billing_unit').value
    const working = this.craneFormGroup.get('rental_charge.working_duration').value['working'];
    const fuel_type = this.craneFormGroup.get('rental_charge').get('fuel_type').value
    let rateCard = this.specificationRentalCharge[specification][key];
    let isRateCard = this.specificationRentalCharge[specification].hasOwnProperty(billingUnit+'_rate_card');
    let ratecardWithFuel = 0;
    let rateCardWithoutFuel = 0;
    let additionalHours=0;
    const withFuel = Number(rateCard[working]['with_fuel'])
    const withoutFuel = Number(rateCard[working]['without_fuel'])
    const additionalHoursRate = Number(rateCard[working]['additional_hours'])
    if (key != billingUnit+'_rate_card') {
      if (isRateCard) {
        rateCard = this.specificationRentalCharge[specification][billingUnit+'_rate_card'];
        ratecardWithFuel = Number(rateCard[working]['with_fuel'])
        rateCardWithoutFuel = Number(rateCard[working]['without_fuel'])
        additionalHours = Number(rateCard[working]['additional_hours'])
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
    if(additionalHoursRate==0){
      form.get('extra_hours').setValue(additionalHours);
    }else{
      form.get('extra_hours').setValue(additionalHoursRate);
    }
    this.craneFormGroup.get('price_validation_details').setValue(form.get('rental_charge').value);
    this.rateCardQuotationPreviousValues.emit(this.specificationRentalCharge);

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
      this.totalHours=shiftHours
    }
    if (working_duration.value['working'] == 'weekly') {
      durationLabel = working_duration.value['duration'] == 1 ? 'week' : 'weeks';
      totalHours = this.weeklyHours * Number(working_duration.value['duration']) * shift
      shiftHours = this.weeklyHours * shift
      singleShifttime = this.weeklyHours * Number(working_duration.value['duration'])
      this.durationTotal = Math.ceil(Number(singleShifttime / this.weeklyHours))
      this.totalHours=shiftHours
    }
    if (working_duration.value['working'] == 'monthly') {
      durationLabel = working_duration.value['duration'] == 1 ? 'month' : 'months';
      totalHours = this.monthlyHours * Number(working_duration.value['duration']) * shift
      shiftHours = this.monthlyHours * shift
      singleShifttime = this.monthlyHours * Number(working_duration.value['duration'])
      this.durationTotal = Math.ceil(Number(singleShifttime / this.monthlyHours))
      this.totalHours=shiftHours
    }
    if(this.jobBasedOn=='hour'){
      this.totalJobsHours = `${working_duration.value['duration']} ${durationLabel} X ${shiftHours} hours = ${totalHours} hours`;
    }
    if(this.jobBasedOn=='day'){
      let shiftDays=(shiftHours/shift)/this.dailyHours;
      let totalDays=(totalHours/shift)/this.dailyHours;
      this.totalJobsHours = `${working_duration.value['duration']} ${durationLabel} X ${shiftDays} Days = ${totalDays} Days`;
    }
    this.onCalculationChange();
    this.onCalculationChangeFrMarket();
  }

  resetCharges() {
    this.initialValues.shifType = new Object({ label: 'Single Shift', value: '1' });
    this.initialValues.fuelType = new Object({ label: 'Without Fuel', value: '1' });
    this.initialValues.working = new Object({ label: 'Daily', value: 'daily' });
    this.craneFormGroup.get('rental_charge').patchValue({
      no_of_shifts: 1,
      fuel_type: 2,
    });
    this.buildRentalCharges([{}]);
  }




  onCalculationChange() {
    const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    rentalChargesItems.controls.forEach(form => {
      form.get('total_amount').setValue(Number(form.get('rental_charge').value * Number(this.durationTotal)))
      form.get('rental_rate').setValue((Number(form.get('rental_charge').value) / Number(this.totalHours)).toFixed(3))
    })
  }

  patchWorkOrderDetails(workOrderDetails) {
    this.patchLocationDetails(workOrderDetails)
    this.patchRentalChargeForSalseOrder(workOrderDetails)
    }

  patchLocationDetails(data) {
    this.isLocationChanged = true;
    let location_details = this.craneFormGroup.get('location_details') as FormGroup;
    location_details.patchValue({
      checklist: data['checklist'],
      contact_name: data['contact_name'],
      zone: data['zone'] ? data['zone']['id'] : null,
      location: data['location'],
      area:data['area']?.id,
      show_in_invoice : data['show_in_invoice'],
    })
    let contact_no = this.craneFormGroup.get('location_details.contact_no') as FormGroup;
    contact_no.patchValue(data['contact_no'])
    this.initialValues.contactName = { label: data['contact_name'], value: data['contact_name'] }
    this.initialValues.countryCode = { label: data['contact_no']['code'], value: data['contact_no']['code'] };
    this.initialValues.zone = { label: data['zone'] ? data['zone']['name'] : '', value: data['zone'] ? data['zone']['id'] : '' }
    this.initialValues.area = { label: data['area'] ? data['area']['label'] : '', value: data['area'] ? data['area']['id'] : '' }
    setTimeout(() => {
      this.getRateCardForSpectifiaction(false)
      this.isLocationChanged = false;
    }, 500);
  }




  patchRentalCharge(data) {
    this.initialValues.fuelType = this.fuelType[data['fuel_type']]
    this.initialValues.shifType = this.shiftType[data['no_of_shifts']]
    this.initialValues.billingUnit=this.rateCardBillingList.find(item=>item.value==data['billing_unit'])
    this.setBillingUnit(data['billing_unit']);  
    if (data['working_duration']['working']) {
      this.initialValues.working = this.durationType.find(item => item.value == data['working_duration']['working'])
    }
    data['no_of_shifts'] = Number(data['no_of_shifts']) + 1
    data['fuel_type'] = Number(data['fuel_type']) + 1
    this.craneFormGroup.get('rental_charge').patchValue(data)
    this.previousShift = data['no_of_shifts'];
    this.craneFormGroup.get('price_validation_details').setValue(data['rental_charges'][0].rental_charge);
    this.buildRentalCharges([data['rental_charges'][0]]);
    this.onChangeWorkingDuration();    
  }

  patchRentalChargeForSalseOrder(data) {
    this.initialValues.fuelType = this.fuelType[data['fuel_type']]
    this.initialValues.shifType = this.shiftType[data['no_of_shifts']]
    this.initialValues.billingUnit=this.rateCardBillingList.find(item=>item.value==data['billing_unit'])
    if (data['working_duration']['working']) {
      this.initialValues.working = this.durationType.find(item => item.value == data['working_duration']['working'])
    }
    this.setBillingUnit(data['billing_unit']);
    data['no_of_shifts'] = Number(data['no_of_shifts']) + 1
    data['fuel_type'] = Number(data['fuel_type']) + 1
    this.craneFormGroup.get('rental_charge').patchValue(data)
    let salesOrderRentalCharge = data['rental_charges'][0]
    this.previousShift = data['no_of_shifts'];
    this.craneFormGroup.get('location_details.job_end_date').setValue(salesOrderRentalCharge['job_end_date'])
    this.craneFormGroup.get('location_details.job_start_date').setValue(salesOrderRentalCharge['job_start_date'])
    let sData = this.formatSalesOrderData(data, salesOrderRentalCharge)
    if (salesOrderRentalCharge['specification']) {
      this.addDeleteSpecificationRetaltedCharges(salesOrderRentalCharge['specification']['id'],data['billing_unit']+'_sales_order_rate_card', sData)
    }
    this.buildRentalCharges([salesOrderRentalCharge]);
    this.onChangeWorkingDuration();
  }



  patchDataFromQuotation(data) {
    let craneData = data
    let locationDetails = data
    let rentalCharge = data
    let rental_charges = [];
    let workingDurationType = 'daily'
    let fuelType = 1
    let location_details = this.craneFormGroup.get('location_details') as FormGroup;
    location_details.patchValue({
      zone: locationDetails['zone'] ? locationDetails['zone']['id'] : null,
      location: locationDetails['location'],
      area:locationDetails['area']?.id
    })
    this.initialValues.area = { label: locationDetails['area'] ? locationDetails['area']['label'] : '', value: locationDetails['area'] ? locationDetails['area']['id'] : '' }
    this.initialValues.zone = { label: locationDetails['zone'] ? locationDetails['zone']['name'] : '', value: locationDetails['zone'] ? locationDetails['zone']['id'] : '' }
    let workingDuration = craneData['working_duration'];
    this.initialValues.shifType = this.shiftType[rentalCharge['no_of_shifts']]
    let rental_charge = this.craneFormGroup.get('rental_charge')
    this.previousShift = Number(rentalCharge['no_of_shifts']) + 1
    this.initialValues.billingUnit=this.rateCardBillingList.find(item=>item.value==rentalCharge['billing_unit'])
    this.setBillingUnit(rentalCharge['billing_unit']);  
    rental_charge.patchValue({
      no_of_shifts: this.previousShift,
      billing_unit:rentalCharge['billing_unit']
    })
    if (workingDuration['working']) {
      workingDurationType = workingDuration['working']
      this.initialValues.fuelType = this.fuelType[craneData['fuel_type']]
      this.initialValues.working = this.durationType.find(item => item.value == workingDurationType)
      rental_charge.get('working_duration').patchValue(workingDuration)
      let withoutFuel = workingDurationType + '_wo_fuel';
      let withFuel = workingDurationType + '_wth_fuel';
      if (withFuel) {
        fuelType = 0
      }
      if (withoutFuel) {
        fuelType = 1
      }
      this.initialValues.fuelType = this.fuelType[fuelType]
      rental_charge.patchValue({
        fuel_type: fuelType + 1
      })
    }
    rental_charges = cloneDeep([rentalCharge['rental_charges'][0]])
    rental_charges.forEach((charges, index) => {
      if (charges['specification']) {
        let qData = {
          daily: charges['daily'],
          weekly: charges['weekly'],
          monthly: charges['monthly'],
        }
        this.addDeleteSpecificationRetaltedCharges(charges['specification']['id'],rentalCharge['billing_unit']+'_quotation_rate_card', qData)
      }

      if (fuelType == 0) {
        charges['rental_charge'] = charges[workingDurationType]['with_fuel']
      }
      if (fuelType == 1) {
        charges['rental_charge'] = charges[workingDurationType]['without_fuel']
      }
      charges['extra_hours'] = charges[workingDurationType]['additional_hours'];
      this.craneFormGroup.get('price_validation_details').setValue(charges['rental_charge']);
    });   
    this.isLocationChanged = true
    setTimeout(() => {
      this.getRateCardForSpectifiaction(false);
      this.isLocationChanged = false
    }, 500);    
    this.buildRentalCharges(rental_charges);
    this.onChangeWorkingDuration();
  

  }

  patchTripEdit(data) {
    if(data['is_transporter']){
      this.displayMarketRentalCharges = true;
    }
    const formSpecificData = data[this.formType];
    this.isRentalEditable=data[this.formType].is_rental_editable;
    if(data[this.formType]['market_rental_charge']){
      this.isMarketRentakEditable=data[this.formType]['market_rental_charge'].is_market_rental_editable
    }
    this.isPaidByDriver = true;
    this.patchRentalCharge(formSpecificData['rental_charge'])
    this.patchMarketRentalCharge(formSpecificData['market_rental_charge']);
    this.patchLocationDetails(formSpecificData['location_details'])
    let location_details = this.craneFormGroup.get('location_details') as FormGroup;
    this.isStartDateChanged=true;
    location_details.patchValue({
      job_start_date: moment.tz(formSpecificData['location_details']['start_date'],localStorage.getItem('timezone')),
      job_end_date: moment.tz(formSpecificData['location_details']['end_date'],localStorage.getItem('timezone')),
    })
    this.craneFormGroup.get('documents').setValue(formSpecificData['documents'])
    setTimeout(() => {
      this.isStartDateChanged=false;
      this.driverAllowanceEdit.next(formSpecificData['driver_allowances'])
    }, 500);
    this.getPreviousFromValues(data['job_from']['type'], data['job_from']['id'])

  }

  getRateCardForSpectifiaction(isPatchRateCard=true) {
    const specification = this.parentForm.get('specification').value;
    const customer = this.parentForm.get('customer').value;
    const zone = this.craneFormGroup.get('location_details').get('zone').value;
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value
    let params = {
      specification: this.parentForm.get('specification').value,
      zone: zone,
      vehicle_category : this.parentForm.get('vehicle_category').value,
      billing_unit: billingUnit
    }
    if (customer && zone && specification) {
      const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
      rentalChargesItems.controls.forEach(form => {
        this._rateCard.getRentalCharges(customer, params).subscribe(resp => {
          this.customerRateCardsExisted.push(resp['result']?.is_from_customer ? resp['result'].is_from_customer : false)
          this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
          if (resp['result']) {
              this.addDeleteSpecificationRetaltedCharges(this.parentForm.get('specification').value, billingUnit+'_rate_card', resp['result']);
          } else {
            this.addDeleteSpecificationRetaltedCharges(this.parentForm.get('specification').value, billingUnit+'_rate_card', resp['result'], 'remove')
          }
          if(isPatchRateCard){
            this.getAndSetRentalCharge();
          }
        
        })
      })

    }else{
      this.addDeleteSpecificationRetaltedCharges(specification, billingUnit+'_rate_card','', 'remove');
    }
  }





  fileUploader(e) {
    let files = [];
    let fileValue = [];
    if (e.length) {
      e.forEach(element => {
        element['presigned_url'] = element['url']
        files.push(element);
      });
    }
    fileValue = this.craneFormGroup.get('documents').value
    if (isArray(fileValue)) {
      this.craneFormGroup.get('documents').setValue(fileValue.concat(files));
    }
  }

  fileDeleted(id) {
    let value = this.craneFormGroup.get('documents').value;
    this.craneFormGroup.get('documents').setValue(value.filter(item => item.id !== id));
  }

  addDeleteSpecificationRetaltedCharges(specification: string, key: string, data: any, type: string = 'add') {
    if (type == 'add') {
      if (this.specificationRentalCharge[specification]) {
        this.specificationRentalCharge[specification][key] = data
      } else {
        this.specificationRentalCharge[specification] = {}
        this.specificationRentalCharge[specification][key] = data
      }
    } else {
      if (this.specificationRentalCharge[specification]) {
        if (this.specificationRentalCharge[specification].hasOwnProperty(key))
          delete this.specificationRentalCharge[specification][key]

      }
    }    
    this.rateCardQuotationPreviousValues.emit(this.specificationRentalCharge);

  }

  getPreviousFromValues(type, id) {
    let screen = ''
    if (Number(type) == 0) {
      screen = 'quotation'
      this._newTripService.getWOAndQOdetails(id, screen).subscribe(resp => {
        let rental_charges = resp['result'];
        rental_charges = cloneDeep([rental_charges['rental_charges'][0]])
        rental_charges.forEach((charges, index) => {
          if (charges['specification']) {
            let qData = {
              daily: charges['daily'],
              weekly: charges['weekly'],
              monthly: charges['monthly'],
            }
            this.addDeleteSpecificationRetaltedCharges(charges['specification']['id'], rental_charges['billing_unit']+'_quotation_rate_card', qData)
          }
        })

      })
    } else if (Number(type) == 1) {
      screen = 'workorder'
      let data = {};
      this._newTripService.getWOAndQOdetails(id, screen).subscribe(resp => {        
        data = resp['result']
        data['fuel_type'] = Number(data['fuel_type']) + 1
        let salesOrderRentalCharge = data['rental_charges'][0]
        let sData = this.formatSalesOrderData(data, salesOrderRentalCharge)
        if (salesOrderRentalCharge['specification']) {          
          this.addDeleteSpecificationRetaltedCharges(salesOrderRentalCharge['specification']['id'], data['billing_unit']+'_sales_order_rate_card', sData)
        }
      })
    } else {
      screen = ''
    }
  }

  formatSalesOrderData(data, salesOrderRentalCharge) {
    let dailyDefault = {
      additional_hours: 0,
      with_fuel: 0,
      without_fuel: 0
    }
      , weeklyDefault = {
        additional_hours: 0,
        with_fuel: 0,
        without_fuel: 0
      }, monthlyDefault = {
        additional_hours: 0,
        with_fuel: 0,
        without_fuel: 0
      }
    if (data['working_duration']['working'] == 'daily') {
      dailyDefault.additional_hours = salesOrderRentalCharge['extra_hours']
      if (data['fuel_type'] == 1) {
        dailyDefault.with_fuel = salesOrderRentalCharge['rental_charge']
      } else {
        dailyDefault.without_fuel = salesOrderRentalCharge['rental_charge']
      }
    }
    if (data['working_duration']['working'] == 'weekly') {
      weeklyDefault.additional_hours = salesOrderRentalCharge['extra_hours']
      if (data['fuel_type'] == 1) {
        weeklyDefault.with_fuel = salesOrderRentalCharge['rental_charge']
      } else {
        weeklyDefault.without_fuel = salesOrderRentalCharge['rental_charge']
      }
    }
    if (data['working_duration']['working'] == 'monthly') {
      monthlyDefault.additional_hours = salesOrderRentalCharge['extra_hours']
      if (data['fuel_type'] == 1) {
        monthlyDefault.with_fuel = salesOrderRentalCharge['rental_charge']
      } else {
        monthlyDefault.without_fuel = salesOrderRentalCharge['rental_charge']
      }
    }
    let sData = {
      daily: dailyDefault,
      weekly: weeklyDefault,
      monthly: monthlyDefault,
    }

    return sData
  }


  buildRentalChargesForMarketVehicle(items = []) {
    let rentalChargesItem = (this.craneFormGroup.controls['market_rental_charge'].get('market_rental_charges')) as FormArray
    rentalChargesItem.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let rental_charge = this.getMarketRentalChargeFormGroup(item)
        rentalChargesItem.push(rental_charge)
      });
    } else {
      this.addMoreMarketRentalChargeItem()
    }

  }
  addMoreMarketRentalChargeItem() {
    const rentalChargesItem = (this.craneFormGroup.controls['market_rental_charge'].get('market_rental_charges')) as FormArray
    rentalChargesItem.push(this.getMarketRentalChargeFormGroup({}));
  }

  getMarketRentalChargeFormGroup(item) {
    return this._fb.group({
      id: [item?.id || null],
      market_rental_charge: [item?. market_rental_charge || 0.000],
      market_rental_rate:[item?. market_rental_rate || 0.000],
      market_total_amount: [item?. market_total_amount || 0.000],
      market_extra_hours: [item?. market_extra_hours || 0.000],
    })
  }

onchangeRentalChargeFrMarket() {
    this.onCalculationChangeFrMarket();
  }





onCalculationChangeFrMarket() {
    const rentalChargesItems = (this.craneFormGroup.controls['market_rental_charge'].get('market_rental_charges')) as FormArray;
    rentalChargesItems.controls.forEach(form => {
      form.get('market_total_amount').setValue(Number(form.get('market_rental_charge').value * Number(this.durationTotal)))
      form.get('market_rental_rate').setValue((Number(form.get('market_rental_charge').value) / Number(this.totalHours)).toFixed(3))
    })
  }

resetChargesFrMarket() {
    this.buildRentalChargesForMarketVehicle([{}]);
  }

patchMarketRentalCharge(data) {
    this.craneFormGroup.get('market_rental_charge').patchValue(data)
    this.craneFormGroup.get('price_validation_details').setValue(data['market_rental_charges'][0]. market_rental_charge);
    this.buildRentalChargesForMarketVehicle([data['market_rental_charges'][0]]);
    this.onChangeWorkingDuration();    
  }

  getSetBillingPreferences() {
    let partyId = this.parentForm.get('customer').value
    let vehicleCategory =Number (this.parentForm.get('vehicle_category').value) ==1?'crane':'awp'
    this.onBillingUnitChange();
    if(partyId)
    this._party.getBillingPreference(partyId,vehicleCategory).subscribe((response: any) => {
    this.craneFormGroup.get('rental_charge').get('billing_unit').setValue(response.result)
    this.initialValues.billingUnit = this.rateCardBillingList.find(type=>type.value==response.result)
    this.onBillingUnitChange();
   })
  }

  getAreaList() {
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
          let form = this.craneFormGroup.get('location_details') as UntypedFormGroup;
          form.get('area').setValue(event.id);
          this.initialValues.area.label = event.label;
          this.initialValues.area.value = event.id;
          this.areaList = response.result['area'];

        });
    }
  }

}
