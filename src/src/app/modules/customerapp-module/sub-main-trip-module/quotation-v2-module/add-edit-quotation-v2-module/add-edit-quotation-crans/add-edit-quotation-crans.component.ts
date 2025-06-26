import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ToolTipInfo } from '../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { getBlankOption, getNonTaxableOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { Dialog } from '@angular/cdk/dialog';
import { RateCardBillingBasedOn, ValidationConstants } from 'src/app/core/constants/constant';
import { TaxService } from 'src/app/core/services/tax.service';
import { CommonService } from 'src/app/core/services/common.service';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { cloneDeep } from 'lodash';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { PartyService } from 'src/app/modules/customerapp-module/api-services/master-module-services/party-service/party.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';

@Component({
  selector: 'app-quotation-template-crane',
  templateUrl: './add-edit-quotation-crans.component.html',
  styleUrls: ['./add-edit-quotation-crans.component.scss']
})
export class AddEditQuotationCransComponent implements OnInit, OnDestroy {
  @Input() quotationForm: FormGroup;
  @Input() formType = 'crane';
  @Input() isFormValid: Observable<boolean>;
  @Input() quotationDetails?: any;
  @Output() isCustomerRateCardExisted = new EventEmitter<any[]>();
  customerRateCardsExisted : boolean[]= [false];
  craneFormGroup: FormGroup;
  locationToolTip: ToolTipInfo;
  constantsTripV2 = new NewTripV2Constants();
  isLocationValid = new BehaviorSubject(true)
  initialValues = {
    specifications: [],
    unit: [],
    additionalTax: [],
    shifType: {},
    zone: {},
    area: getBlankOption(),
    tax: {},
    termsAndCondition: {},
    signature: {},
    working: {},
    billingUnit: { label: 'Hours', value: 'hour' }
  }
  isAddChargesTabError = false;
  dailyWeeklyMonthlyHours = this.getDefaultHours()
  dayWeekMonthDuration = this.getDefaultDurations();
  quotationCraneTotal = this.getDefaultCalculations();
  zoom = 10;
  center: google.maps.LatLngLiteral = { lat: 25.20584515715115, lng: 55.29476642979386, };
  markerOptions: google.maps.MarkerOptions = {
    icon: 'https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_red.png'
  };
  markerPositions: google.maps.LatLngLiteral[] = [];
  marker: any;
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
  tersmAndConditions = [];
  digitalSignature = [];
  vechileSpecifications = [];
  zonesList = [];
  taxOption = getNonTaxableOption();
  defaultTax = new ValidationConstants().defaultTax;
  taxOptions = [];
  unitOfMeasurementList = [];
  isTax = true;
  totalQuotationHours = ''
  previousShift = 1;
  dailyHours = 0;
  weeklyHours = 0;
  monthlyHours = 0;
  dailyHoursNow = 0;
  weeklyHoursNow = 0;
  monthlyHoursNow = 0;
  additionalCharges = [];
  areaList = [];
  partyRateCardValues = {
    rental_charges: {},
    additional_charges: {}
  };
  rateCardBilling = new RateCardBillingBasedOn();
  rateCardBillingList = this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour = this.rateCardBilling.hour
  rateCardBillingDays = this.rateCardBilling.day
  @Output() partyPrefilledRateCardValues = new EventEmitter<any>();
  currency_type: any;
  rentalChargeTableLabel={
    daily:'',
    weekly:'',
    monthly:''
  }
  balanceChargeTableLabel={
    daily:'',
    weekly:'',
    monthly:''
  };
  areaApi = TSAPIRoutes.static_options;
  areaParams: any = {};

  constructor(private _fb: FormBuilder, private _quotationV2Service: QuotationV2Service, private _vehicleService: VehicleService,private _party:PartyService,
    private _rateCard: RateCardService, public dialog: Dialog, private _isTax: TaxService, private _commonService: CommonService, private currency: CurrencyService) { }

  ngOnInit(): void {
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.buildRentalCharges([{}])
    this.getTersmAndConditionList();
    this.getDigitalSignatureList();
    this.getVehicleSpecifications();
    this.getTaxDetails();
    this.getUnitsOfMeasurement();
    this.getAreaList();
    this.dailyWeeklyMonthlyHours = this.getDefaultHours()
    this.dayWeekMonthDuration = this.getDefaultDurations();
    this.quotationCraneTotal = this.getDefaultCalculations();
    this.initialValues.tax = this.taxOption
    this.isTax = this._isTax.getTax();
    this.initialValues.shifType = this.shiftType[0]
    this.initialValues.working = this.durationType[0];
    this.locationToolTip = {
      content: this.constantsTripV2.toolTipMessages.LOCATION.CONTENT
    }
    this.quotationForm.addControl(this.formType, this.craneFormGroup);
    this.craneFormGroup.addControl(this.formType + '_calculations', new FormControl(null))
    if (this.quotationDetails) {
      this.patchQuotationTemplate(cloneDeep(this.quotationDetails))
    } else {
      this.getAdditionalCharge();
      this.getZonesList();
      this.getSetBillingPreferences();
    }
    this.isFormValid.subscribe(vaild => {
      setAsTouched(this.craneFormGroup);
      this.isAddChargesTabError = this.craneFormGroup.get('additional_charge').invalid
    })
    this.craneFormGroup.get(this.formType + '_calculations').setValue({
      quotation_total: this.quotationCraneTotal,
      daily_weekly_monthly_hours: this.dailyWeeklyMonthlyHours,
      day_week_month_duration: this.dayWeekMonthDuration,
    })

  }


  ngOnDestroy(): void {
    this.quotationForm.removeControl(this.formType);
  }

  buildForm() {
    this.craneFormGroup = this._fb.group({
      tax: this.defaultTax,
      terms_and_condition: [''],
      narration: [''],
      signature: [''],
      location_details: this._fb.group({
        zone: '',
        location: this._fb.group({
          name: '',
          lng: '',
          lat: '',
          alias: ''
        }),
        area: ['',[Validators.required]],
      }),
      rental_charge: this._fb.group({
        daily_wo_fuel: true,
        daily_wth_fuel: true,
        weekly_wo_fuel: true,
        weekly_wth_fuel: true,
        monthly_wo_fuel: true,
        monthly_wth_fuel: true,
        no_of_shifts: 1,
        billing_unit: ['hour', Validators.required],
        rental_charges: this._fb.array([])
      }),
      additional_charge: this._fb.array([]),
      working_duration: this._fb.group({
        duration: [1, Validators.min(1)],
        working: 'daily'
      })

    })
  }

  locationSelected(e) {
    this.craneFormGroup.get('location_details').get('location').patchValue(e['value'])
    if (e['value']['lat']) {
      this.center = { lat: e['value'].lat, lng: e['value'].lng }
      this.markerPositions = [{ lat: e['value'].lat, lng: e['value'].lng }]
    } else {
      this.markerPositions = [];
    }
  }

  getVehicleSpecifications() {
    this._vehicleService.getVehicleSpecifications(this.quotationForm.get('vehicle_category').value).subscribe((response: any) => {
      this.vechileSpecifications = response.result;
    });
  }

  getAdditionalCharge() {
    let params = {
      vehicle_category: this.quotationForm.get('vehicle_category').value
    }
    if (this.quotationForm.get('customer').value)
      this._rateCard.getCustomerAdditionalCharge(this.quotationForm.get('customer').value, params).subscribe((response: any) => {
        this.additionalCharges = response.result;
        this.buildAdditionalCharges(this.additionalCharges)
      });
  }


  getRentalChargeFormGroup(item) {
    return this._fb.group({
      specification: [item?.specification || ''],
      rate_card_data: null,
      daily: this._fb.group({
        with_fuel: item?.daily?.with_fuel || 0,
        without_fuel: item?.daily?.without_fuel || 0,
        additional_hours: item?.daily?.additional_hours || 0,
      }),
      weekly: this._fb.group({
        with_fuel: item?.weekly?.with_fuel || 0,
        without_fuel: item?.weekly?.without_fuel || 0,
        additional_hours: item?.weekly?.additional_hours || 0,
      }),
      monthly: this._fb.group({
        with_fuel: item?.monthly?.with_fuel || 0,
        without_fuel: item?.monthly?.without_fuel || 0,
        additional_hours: item?.monthly?.additional_hours || 0,
      })
    })
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


  buildRentalCharges(items = []) {
    this.initialValues.specifications = [];
    let rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    rentalChargesItem.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        this.initialValues.specifications.push(getBlankOption());
        let rental_charge = this.getRentalChargeFormGroup(item)
        rentalChargesItem.push(rental_charge)
      });
    } else {
      this.addMoreRentalChargeItem()
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
        this.initialValues.unit.push(item['unit_of_measurement'])
        this.initialValues.additionalTax.push(item['tax']);
      });
    } else {
      this.addMoreAdditionalChargeItem()
    }

  }



  addMoreRentalChargeItem() {    
    this.customerRateCardsExisted.length==0  && this.customerRateCardsExisted.push(false)
    this.customerRateCardsExisted.push(this.customerRateCardsExisted[this.customerRateCardsExisted.length-1])
    this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    this.initialValues.specifications.push(getBlankOption());
    rentalChargesItem.push(this.getRentalChargeFormGroup({}));
  }

  addMoreAdditionalChargeItem() {
    const additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.push(this.getAdditionalChargeFormGroup({}));
    this.initialValues.unit.push();
    this.initialValues.additionalTax.push(getBlankOption());


  }

  removeRentalChareItem(index) {    
    this.customerRateCardsExisted.splice(index,1);
    this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray
    this.initialValues.specifications.splice(index, 1);
    rentalChargesItem.removeAt(index);
    this.onCalculationChange();
  }

  removeAdditionalChareItem(index) {
    const additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.removeAt(index);
  }

  cloneRentalChareItem(form: FormGroup, index) {
    this.addMoreRentalChargeItem();
    const rentalChargesItem = (this.craneFormGroup.controls['rental_charge'].get('rental_charges') as FormArray).at(index + 1);
    rentalChargesItem.patchValue(form.value)
    if (form.value['specification']) {
      let specificationValue = []
      specificationValue = this.vechileSpecifications.filter(item => item.id == form.value['specification'])
      if (specificationValue.length) this.initialValues.specifications[index + 1] = { label: specificationValue[0].specification, value: specificationValue[0].id }
    }
    this.onCalculationChange();
  }

  getTersmAndConditionList() {
    this._quotationV2Service.getTersmAndConditionList().subscribe((response: any) => {
      this.tersmAndConditions = response.result['tc_content'];
    });
  }

  getDigitalSignatureList() {
    this._quotationV2Service.getDigitalSignatureList().subscribe(data => {
      this.digitalSignature = data['result']['data']
    })
  }

  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  getRateCard(form: FormGroup,index:number) {
    const paths = [
      'daily.without_fuel',
      'daily.with_fuel',
      'weekly.without_fuel',
      'weekly.with_fuel',
      'monthly.without_fuel',
      'monthly.with_fuel',
    ];
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    let defaultData = {
      additional_hours: 0,
      with_fuel: 0,
      without_fuel: 0
    }
    const customer = this.quotationForm.get('customer').value;
    const zone = this.craneFormGroup.get('location_details').get('zone').value;
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value
    let params = {
      specification: form.get('specification').value,
      zone: zone,
      vehicle_category: this.quotationForm.get('vehicle_category').value,
      billing_unit:billingUnit
    }
    if (customer && zone && form.get('specification').value) {
      this._rateCard.getRentalCharges(customer, params).subscribe(resp => {
        this.customerRateCardsExisted[index] = resp['result']?.is_from_customer ? resp['result'].is_from_customer : false;
        this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
        if (resp['result']) {
          let specification = form.get('specification').value;
          this.partyRateCardValues.rental_charges[specification] = resp['result'];
          this.partyPrefilledRateCardValues.emit(this.partyRateCardValues);
          form.get('daily').patchValue(resp['result']['daily'])
          form.get('weekly').patchValue(resp['result']['weekly'])
          form.get('monthly').patchValue(resp['result']['monthly'])
          form.get('rate_card_data').setValue(resp['result'])
          this.updateValues(form, paths, '*', shift);
        } else {
          form.get('rate_card_data').setValue(null)
          form.get('daily').patchValue(defaultData)
          form.get('weekly').patchValue(defaultData)
          form.get('monthly').patchValue(defaultData)
        }
        this.onCalculationChange();
      })
    }
    this.onCalculationChange();

  }

  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }

  addCharges() {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        data: this.quotationForm.get('vehicle_category').value,
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
        this.initialValues.unit.push(result['unit_of_measurement']);
        this.initialValues.additionalTax.push(result['tax'])
        let form = additionalCharge.controls[additionalCharge.length - 1] as FormGroup
        form.get('is_checked').setValue(true);
        this.onChangeAdditionalChargeCheckBox(form)
      }
      dialogRefSub.unsubscribe()

    });
  }

  getUnitsOfMeasurement() {
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.unitOfMeasurementList = response.result['item-unit'];
    });
  }

  getAreaList(){
    this._commonService.getStaticOptions('area').subscribe((response) => {
      this.areaList = response.result['area'];
    });
  }

  onZoneChange() {
    this.buildRentalCharges([{}])
    this.onCalculationChange();
  }

  onChangeRentalChargeCheckBox(sectionType: string, fieldType: string, keyType: string) {
    const rental_charge = this.craneFormGroup.get('rental_charge') as FormGroup
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    rentalChargesItems.controls.forEach(form => {
      if (rental_charge.get(fieldType).value) {
        if (form.get('rate_card_data').value) {
          let data = {
            additional_hours: Number(form.get('rate_card_data').value[sectionType]['additional_hours']).toFixed(3),
            with_fuel: (Number(form.get('rate_card_data').value[sectionType]['with_fuel']) * Number(shift)).toFixed(3),
            without_fuel: (Number(form.get('rate_card_data').value[sectionType]['without_fuel']) * Number(shift)).toFixed(3)
          }
          form.get(sectionType).get('additional_hours').setValue(data['additional_hours'])
          form.get(sectionType).get(keyType).setValue(data[keyType])
        }
      } else {
        form.get(sectionType).get(keyType).setValue('0.000')
      }
    });
    this.onCalculationChange();
  }

  onChangeAdditionalChargeCheckBox(form: FormGroup) {
    let formValue = form.value
    if (formValue['is_checked']) {
      this.partyRateCardValues['additional_charges'][formValue.name.id] = formValue['rate']
      setUnsetValidators(form, 'unit_cost', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'quantity', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.required])
    } else {
      delete this.partyRateCardValues['additional_charges'][formValue.name.id];
      form.get('unit_cost').setValue(form.get('rate').value)
      form.get('quantity').setValue('0.000')
      setUnsetValidators(form, 'unit_cost', [Validators.nullValidator])
      setUnsetValidators(form, 'quantity', [Validators.nullValidator])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.nullValidator])
    }
    this.partyPrefilledRateCardValues.emit(this.partyRateCardValues);
    this.onCalculationChange();
  }

  onchangeRentalCharge() {
    this.onCalculationChange();
  }

  onChangeTax() {
    this.onCalculationChange();
  }

  onChangeAdditionalCharge() {
    this.onCalculationChange();
  }

  onBillingUnitChange() {
    const billingUnit = this.craneFormGroup.get('rental_charge').get('billing_unit').value
    this.setBillingHours(billingUnit);
    this.getAllrateCardWithSpecifications();
    this.onChangeWorkingDuration();
  }

  getAllrateCardWithSpecifications() {
    const rentalChargesItem = this.craneFormGroup.controls['rental_charge'].get('rental_charges') as FormArray
    rentalChargesItem.controls.forEach((form, index) => {
      this.getRateCard(form as FormGroup,index)
    });
  }

  setBillingHours(billingUnit){
    if (billingUnit == 'hour') {
      this.dailyHours = this.rateCardBillingHour.day
      this.weeklyHours = this.rateCardBillingHour.week
      this.monthlyHours = this.rateCardBillingHour.month

      this.dailyHoursNow = this.rateCardBillingHour.day
      this.weeklyHoursNow = this.rateCardBillingHour.week
      this.monthlyHoursNow = this.rateCardBillingHour.month
    }
    if (billingUnit == 'day') {
      this.dailyHours = this.rateCardBillingDays.day
      this.weeklyHours = this.rateCardBillingDays.week
      this.monthlyHours = this.rateCardBillingDays.month

      this.dailyHoursNow = this.rateCardBillingDays.day
      this.weeklyHoursNow = this.rateCardBillingDays.week
      this.monthlyHoursNow = this.rateCardBillingDays.month
    }
  }

  makeLabelForRentalAndBalance(){
    const billingUnit = this.craneFormGroup.get('rental_charge').get('billing_unit').value
    if(billingUnit=='hour'){
      this.rentalChargeTableLabel={
        daily:`Daily (${this.currency_type?.symbol}) (${this.dailyHoursNow} Hours)`,
        weekly:`Weekly (${this.currency_type?.symbol}) (${this.weeklyHoursNow} Hours)`,
        monthly:`Monthly (${this.currency_type?.symbol}) (${this.monthlyHoursNow} Hours)`,
      }
      this.balanceChargeTableLabel={
        daily:`(${this.currency_type?.symbol}) (${this.dailyWeeklyMonthlyHours.daily} Hours)`,
        weekly:`(${this.currency_type?.symbol}) (${this.dailyWeeklyMonthlyHours.weekly} Hours)`,
        monthly:`(${this.currency_type?.symbol}) (${this.dailyWeeklyMonthlyHours.monthly} Hours)`,
      }
    }else{
      this.rentalChargeTableLabel={
        daily:`Daily (${this.currency_type?.symbol})`,
        weekly:`Weekly (${this.currency_type?.symbol})`,
        monthly:`Monthly (${this.currency_type?.symbol})`,
      }
      this.balanceChargeTableLabel={
        daily:`(${this.currency_type?.symbol})`,
        weekly:`(${this.currency_type?.symbol})`,
        monthly:`(${this.currency_type?.symbol})`,
      }
    }

  }

  onChangeWorkingDuration() {
    this.dayWeekMonthDuration = this.getDefaultDurations()
    const working_duration = this.craneFormGroup.get('working_duration');
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value

    let totalHours = 0;
    let singleShifttime = 0;
    let shiftHours = 0;
    let durationLabel = '';
    if (working_duration.value['working'] == 'daily') {
      durationLabel = working_duration.value['duration'] == 1 ? 'day' : 'days';
      totalHours = this.dailyHours * Number(working_duration.value['duration']) * shift
      singleShifttime = this.dailyHours * Number(working_duration.value['duration'])
      shiftHours = this.dailyHours * shift
    }
    if (working_duration.value['working'] == 'weekly') {
      durationLabel = working_duration.value['duration'] == 1 ? 'week' : 'weeks';
      totalHours = this.weeklyHours * Number(working_duration.value['duration']) * shift
      shiftHours = this.weeklyHours * shift
      singleShifttime = this.weeklyHours * Number(working_duration.value['duration'])
    }
    if (working_duration.value['working'] == 'monthly') {
      durationLabel = working_duration.value['duration'] == 1 ? 'month' : 'months';
      totalHours = this.monthlyHours * Number(working_duration.value['duration']) * shift
      shiftHours = this.monthlyHours * shift
      singleShifttime = this.monthlyHours * Number(working_duration.value['duration'])
    }
    this.dayWeekMonthDuration = {
      day: Math.ceil(Number(singleShifttime / this.dailyHours)),
      week: Math.ceil(Number(singleShifttime / this.weeklyHours)),
      month: Math.ceil(Number(singleShifttime / this.monthlyHours))
    }
    this.dailyWeeklyMonthlyHours.daily = this.dailyHoursNow * this.dayWeekMonthDuration.day
    this.dailyWeeklyMonthlyHours.weekly = this.weeklyHoursNow * this.dayWeekMonthDuration.week
    this.dailyWeeklyMonthlyHours.monthly = this.monthlyHoursNow * this.dayWeekMonthDuration.month
    if (billingUnit == 'day') {
      let shiftDays = (shiftHours / this.dailyHours) / shift
      let totalDays = (totalHours / this.dailyHours) / shift
      this.totalQuotationHours = `${working_duration.value['duration']} ${durationLabel} X ${shiftDays} Days = ${totalDays} Days`;
    }
    if (billingUnit == 'hour') {
      this.totalQuotationHours = `${working_duration.value['duration']} ${durationLabel} X ${shiftHours} hours = ${totalHours} hours`;
    }
    this.makeLabelForRentalAndBalance()
    this.onCalculationChange();
  }

  onShiftChange() {
    const paths = [
      'daily.without_fuel',
      'daily.with_fuel',
      'weekly.without_fuel',
      'weekly.with_fuel',
      'monthly.without_fuel',
      'monthly.with_fuel'
    ];
    const shift = this.craneFormGroup.get('rental_charge').get('no_of_shifts').value
    if (this.previousShift != shift) {
      this.previousShift = shift
      const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
      rentalChargesItems.controls.forEach(form => {
        if (this.previousShift == 1) {
          this.dailyHoursNow = this.dailyHoursNow / 2
          this.weeklyHoursNow = this.weeklyHoursNow / 2
          this.monthlyHoursNow = this.monthlyHoursNow / 2

          this.updateValues(form, paths, '/', 2);
        } else {
          this.updateValues(form, paths, '*', 2);
          this.dailyHoursNow = this.dailyHoursNow * 2
          this.weeklyHoursNow = this.weeklyHoursNow * 2
          this.monthlyHoursNow = this.monthlyHoursNow * 2
        }

      });
      this.dailyWeeklyMonthlyHours.daily = this.dailyHoursNow
      this.dailyWeeklyMonthlyHours.weekly = this.weeklyHoursNow
      this.dailyWeeklyMonthlyHours.monthly = this.monthlyHoursNow
      this.onChangeWorkingDuration()
      this.onCalculationChange()
    }
  }

  updateValues(form, paths: string[], operator: string, operand: number) {
    paths.forEach(path => {
      const control = form.get(path);
      if (control) {
        if (operator === '*') {
          control.setValue((Number(control.value) * operand).toFixed(3));
        } else if (operator === '/') {
          control.setValue((Number(control.value) / operand).toFixed(3));
        }
      }
    });
  }


  onCalculationChange() {

    // no_of_shifts
    this.quotationCraneTotal = this.getDefaultCalculations();
    let additionalChargeTaxTotal = 0;
    const rental_charge = this.craneFormGroup.controls['rental_charge'].value
    const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
    const additionalCharge = (this.craneFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.controls.forEach(form => {
      form.get('total').setValue((Number(form.get('quantity').value) * Number(form.get('unit_cost').value)).toFixed(3))
      if (form.value['is_checked']) {
        this.quotationCraneTotal.additional_charge_total = (Number(this.quotationCraneTotal.additional_charge_total) + Number(form.value['total'])).toFixed(3)
      }
    })

    this.taxOptions.forEach((tax) => {
      additionalCharge.controls.forEach(form => {
        if (form.value['is_checked']) {
          if (form.get('tax').value == tax.id) {
            let amountWithoutTax = Number(form.get('total').value)
            let amountWithTax = 0;
            amountWithTax = Number(tax.value / 100 * amountWithoutTax);
            additionalChargeTaxTotal = additionalChargeTaxTotal + amountWithTax
          }
        }
      })
    })
    this.taxOptions.forEach((tax) => {
      rentalChargesItems.controls.forEach(form => {
        if (this.craneFormGroup.get('tax').value == tax.id) {
          if (form.value['daily']) {
            if (rental_charge['daily_wth_fuel']) {
              this.quotationCraneTotal.daily_with_fuel_total = (Number(this.quotationCraneTotal.daily_with_fuel_total) + (Number(form.value['daily'].with_fuel) * Number(this.dayWeekMonthDuration.day))).toFixed(3);
              this.quotationCraneTotal.daily_with_fuel_additional_charge_total = Number(this.quotationCraneTotal.additional_charge_total).toFixed(3)
              let amountWithoutTax = Number(this.quotationCraneTotal.daily_with_fuel_total)
              this.quotationCraneTotal.vat_daily_with_fuel_total = (Number(tax.value / 100 * amountWithoutTax) + Number(additionalChargeTaxTotal)).toFixed(3);
              this.quotationCraneTotal.daily_with_fuel_total_with_vat = (Number(this.quotationCraneTotal.vat_daily_with_fuel_total) + Number(this.quotationCraneTotal.daily_with_fuel_additional_charge_total) + Number(amountWithoutTax)).toFixed(3)
            }
            if (rental_charge['daily_wo_fuel']) {
              this.quotationCraneTotal.daily_without_fuel_total = (Number(this.quotationCraneTotal.daily_without_fuel_total) + (Number(form.value['daily'].without_fuel) * Number(this.dayWeekMonthDuration.day))).toFixed(3)
              this.quotationCraneTotal.daily_without_fuel_additional_charge_total = Number(this.quotationCraneTotal.additional_charge_total).toFixed(3);
              let amountWithoutTax = Number(this.quotationCraneTotal.daily_without_fuel_total)
              this.quotationCraneTotal.vat_daily_without_fuel_total = (Number(tax.value / 100 * amountWithoutTax) + Number(additionalChargeTaxTotal)).toFixed(3);
              this.quotationCraneTotal.daily_without_fuel_total_with_vat = (Number(this.quotationCraneTotal.vat_daily_without_fuel_total) + Number(amountWithoutTax) + Number(this.quotationCraneTotal.daily_without_fuel_additional_charge_total)).toFixed(3)
            }
            if (!rental_charge['daily_wth_fuel'] && !rental_charge['daily_wo_fuel']) {
              form.get('daily').get('additional_hours').setValue('0.000')
            }
          }
          if (form.value['weekly']) {
            if (rental_charge['weekly_wth_fuel']) {
              this.quotationCraneTotal.weekly_with_fuel_additional_charge_total = Number(this.quotationCraneTotal.additional_charge_total).toFixed(3)
              this.quotationCraneTotal.weekly_with_fuel_total = (Number(this.quotationCraneTotal.weekly_with_fuel_total) + (Number(form.value['weekly'].with_fuel) * Number(this.dayWeekMonthDuration.week))).toFixed(3);
              let amountWithoutTax = Number(this.quotationCraneTotal.weekly_with_fuel_total)
              this.quotationCraneTotal.vat_weekly_with_fuel_total = (Number(tax.value / 100 * amountWithoutTax) + Number(additionalChargeTaxTotal)).toFixed(3);
              this.quotationCraneTotal.weekly_with_fuel_total_with_vat = (Number(this.quotationCraneTotal.vat_weekly_with_fuel_total) + Number(amountWithoutTax) + Number(this.quotationCraneTotal.weekly_with_fuel_additional_charge_total)).toFixed(3)

            }
            if (rental_charge['weekly_wo_fuel']) {
              this.quotationCraneTotal.weekly_without_fuel_additional_charge_total = Number(this.quotationCraneTotal.additional_charge_total).toFixed(3)
              this.quotationCraneTotal.weekly_without_fuel_total = (Number(this.quotationCraneTotal.weekly_without_fuel_total) + (Number(form.value['weekly'].without_fuel) * Number(this.dayWeekMonthDuration.week))).toFixed(3)
              let amountWithoutTax = Number(this.quotationCraneTotal.weekly_without_fuel_total)
              this.quotationCraneTotal.vat_weekly_without_fuel_total = (Number(tax.value / 100 * amountWithoutTax) + Number(additionalChargeTaxTotal)).toFixed(3);
              this.quotationCraneTotal.weekly_without_fuel_total_with_vat = (Number(this.quotationCraneTotal.vat_weekly_without_fuel_total) + Number(amountWithoutTax) + Number(this.quotationCraneTotal.weekly_without_fuel_additional_charge_total)).toFixed(3)
            }
            if (!rental_charge['weekly_wth_fuel'] && !rental_charge['weekly_wo_fuel']) {
              form.get('weekly').get('additional_hours').setValue('0.000')
            }
          }
          if (form.value['monthly']) {
            if (rental_charge['monthly_wth_fuel']) {
              this.quotationCraneTotal.monthly_with_fuel_additional_charge_total = Number(this.quotationCraneTotal.additional_charge_total).toFixed(3)
              this.quotationCraneTotal.monthly_with_fuel_total = (Number(this.quotationCraneTotal.monthly_with_fuel_total) + (Number(form.value['monthly'].with_fuel) * Number(this.dayWeekMonthDuration.month))).toFixed(3)
              let amountWithoutTax = Number(this.quotationCraneTotal.monthly_with_fuel_total)
              this.quotationCraneTotal.vat_monthly_with_fuel_total = (Number(tax.value / 100 * amountWithoutTax) + Number(additionalChargeTaxTotal)).toFixed(3);
              this.quotationCraneTotal.monthly_with_fuel_total_with_vat = (Number(this.quotationCraneTotal.vat_monthly_with_fuel_total) + Number(amountWithoutTax) + Number(this.quotationCraneTotal.monthly_with_fuel_additional_charge_total)).toFixed(3)

            }
            if (rental_charge['monthly_wo_fuel']) {
              this.quotationCraneTotal.monthly_without_fuel_additional_charge_total = Number(this.quotationCraneTotal.additional_charge_total).toFixed(3)
              this.quotationCraneTotal.monthly_without_fuel_total = (Number(this.quotationCraneTotal.monthly_without_fuel_total) + (Number(form.value['monthly'].without_fuel) * Number(this.dayWeekMonthDuration.month))).toFixed(3)
              let amountWithoutTax = Number(this.quotationCraneTotal.monthly_without_fuel_total)
              this.quotationCraneTotal.vat_monthly_without_fuel_total = (Number(tax.value / 100 * amountWithoutTax) + Number(additionalChargeTaxTotal)).toFixed(3);
              this.quotationCraneTotal.monthly_without_fuel_total_with_vat = (Number(this.quotationCraneTotal.vat_monthly_without_fuel_total) + Number(amountWithoutTax) + Number(this.quotationCraneTotal.monthly_without_fuel_additional_charge_total)).toFixed(3)

            }

            if (!rental_charge['monthly_wth_fuel'] && !rental_charge['monthly_wo_fuel']) {
              form.get('monthly').get('additional_hours').setValue('0.000')
            }
          }
        }



      })




    })

    this.craneFormGroup.get(this.formType + '_calculations').setValue({
      quotation_total: this.quotationCraneTotal,
      daily_weekly_monthly_hours: this.dailyWeeklyMonthlyHours,
      day_week_month_duration: this.dayWeekMonthDuration,
    })
  }


  getDefaultHours() {
    return {
      daily: this.dailyHours,
      weekly: this.weeklyHours,
      monthly: this.monthlyHours
    }
  }

  getDefaultDurations() {
    return {
      day: 1,
      week: 1,
      month: 1
    }
  }

  getDefaultCalculations() {
    return {
      daily_with_fuel_total: '0.000',
      daily_without_fuel_total: '0.000',
      weekly_with_fuel_total: '0.000',
      weekly_without_fuel_total: '0.000',
      monthly_with_fuel_total: '0.000',
      monthly_without_fuel_total: '0.000',
      additional_charge_total: '0.000',
      vat_daily_with_fuel_total: '0.000',
      vat_daily_without_fuel_total: '0.000',
      vat_weekly_with_fuel_total: '0.000',
      vat_weekly_without_fuel_total: '0.000',
      vat_monthly_with_fuel_total: '0.000',
      vat_monthly_without_fuel_total: '0.000',
      daily_with_fuel_total_with_vat: '0.000',
      daily_without_fuel_total_with_vat: '0.000',
      weekly_with_fuel_total_with_vat: '0.000',
      weekly_without_fuel_total_with_vat: '0.000',
      monthly_with_fuel_total_with_vat: '0.000',
      monthly_without_fuel_total_with_vat: '0.000',
      daily_with_fuel_additional_charge_total: '0.000',
      daily_without_fuel_additional_charge_total: '0.000',
      weekly_with_fuel_additional_charge_total: '0.000',
      weekly_without_fuel_additional_charge_total: '0.000',
      monthly_with_fuel_additional_charge_total: '0.000',
      monthly_without_fuel_additional_charge_total: '0.000',
    }
  }

  patchQuotationTemplate(data) {
    this.patchLocationDetails(data[this.formType]['location_details'])
    this.patchAdditionalCharge(data)
    this.patchRentalCharge(data[this.formType]['rental_charge'])
    this.patchApproval(data[this.formType])
    this.patchBalance(data[this.formType])
    setTimeout(() => {
      this.onChangeWorkingDuration()
    }, 1000);
  }


  patchLocationDetails(data) {
    const location_details = this.craneFormGroup.get('location_details') as FormGroup
    location_details.get('location').patchValue(data['location'])
    if (data['zone']) {
      location_details.get('zone').setValue(data['zone'].id)
      this.initialValues.zone = { label: data['zone'].name, value: '' }
    }
    if (isValidValue(data['area'])) {
      location_details.get('area').setValue(data['area']['id'])
      this.initialValues.area = { label: data['area'].label, value: data['area'].id }
    }
  }

  patchAdditionalCharge(data) {
    let params = {
      vehicle_category: data['vehicle_category']
    }
    this._rateCard.getCustomerAdditionalCharge(data['customer'], params).subscribe((response: any) => {
      this.additionalCharges = response.result;
      if (data[this.formType]['additional_charge'].length > 0) {
        this.additionalCharges.forEach(charges => {
          let isMatchfound: boolean = false;
          data[this.formType]['additional_charge'].forEach(selectedCharges => {
            if (selectedCharges['name'].id === charges['name'].id) {
              this.partyRateCardValues['additional_charges'][selectedCharges['name'].id] = charges['rate'];
              this.partyPrefilledRateCardValues.emit(this.partyRateCardValues)
              charges['is_checked'] = true;
              charges['quantity'] = selectedCharges['quantity']
              charges['unit_cost'] = selectedCharges['unit_cost']
              charges['unit_of_measurement'] = selectedCharges['unit_of_measurement'];
              charges['tax'] = selectedCharges['tax'];
              charges['total'] = selectedCharges['total'];
              isMatchfound = true;
            } else {
              if (!isMatchfound) {
                charges['unit_cost'] = charges['rate']
              }
            }
          });
        })
      }
      this.buildAdditionalChargesInEdit(this.additionalCharges)
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
        additionalCharge.push(additional_charge)
        this.initialValues.unit.push(item['unit_of_measurement'])
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
      total: [item.total || 0],
      tax: [item.tax.id]
    })
  }

  patchApproval(data) {
    if (data.terms_and_condition) {
      this.initialValues.termsAndCondition = { label: data.terms_and_condition.name, value: '' };
      this.craneFormGroup.get('terms_and_condition').setValue(data.terms_and_condition.id);
    }
    if (data.signature) {
      this.initialValues.signature = { label: data.signature.name, value: '' };
      this.craneFormGroup.get('signature').setValue(data.signature.id);
    }
    this.craneFormGroup.get('narration').setValue(data.narration);
  }


  patchRentalCharge(data) {
    this.initialValues.shifType = this.shiftType[data['no_of_shifts']]
    this.initialValues.billingUnit = this.rateCardBillingList.find(type=>type.value==data['billing_unit'])
    data['no_of_shifts'] = Number(data['no_of_shifts']) + 1
    this.craneFormGroup.get('rental_charge').patchValue(data)
    this.setBillingHours(data['billing_unit']);
    this.previousShift = data['no_of_shifts'];
    this.dailyHoursNow = this.dailyHoursNow * data['no_of_shifts']
    this.weeklyHoursNow = this.weeklyHoursNow * data['no_of_shifts']
    this.monthlyHoursNow = this.monthlyHoursNow * data['no_of_shifts']
    this.dailyWeeklyMonthlyHours.daily = this.dailyHoursNow
    this.dailyWeeklyMonthlyHours.weekly = this.weeklyHoursNow
    this.dailyWeeklyMonthlyHours.monthly = this.monthlyHoursNow

    let rental_charges = []
    rental_charges = cloneDeep(data['rental_charges'])
    rental_charges.forEach(charges => {
      if (charges['specification']) {
        charges['specification'] = charges['specification'].id
      }
    })
    this.buildRentalCharges(rental_charges);
    data['rental_charges'].forEach((charges, index) => {
      if (charges['specification']) {
        this.initialValues.specifications[index] = { label: charges['specification'].name, value: charges['specification'].id }
      }
    })

    setTimeout(() => {
      const rentalChargesItems = (this.craneFormGroup.controls['rental_charge'].get('rental_charges')) as FormArray;
      rentalChargesItems.controls.forEach((form,index) => {
        this.getRateCardForSpectifiaction(form,index)
      });
    }, 2000);


  }

  patchBalance(data) {
    this.initialValues.tax = data['tax']
    this.craneFormGroup.get('tax').setValue(data['tax'].id)
    if (data['working_duration']['working']) {
      this.initialValues.working = this.durationType.find(item => item.value == data['working_duration']['working'])
    }
    this.craneFormGroup.get('working_duration').patchValue(data['working_duration'])
  }


  getRateCardForSpectifiaction(form,index:number) {
    const customer = this.quotationForm.get('customer').value;
    const zone = this.craneFormGroup.get('location_details').get('zone').value;
    const billingUnit=this.craneFormGroup.get('rental_charge').get('billing_unit').value
    let params = {
      specification: form.get('specification').value,
      zone: zone,
      vehicle_category: this.quotationForm.get('vehicle_category').value,
      billing_unit:billingUnit

    }
    if (customer && zone) {
      this._rateCard.getRentalCharges(customer, params).subscribe(resp => {
        this.customerRateCardsExisted[index] = resp['result']?.is_from_customer ? resp['result'].is_from_customer : false;
        this.isCustomerRateCardExisted.emit(this.customerRateCardsExisted)
        if (resp['result']) {
          let specification = form.get('specification').value;
          if (!this.partyRateCardValues['rental_charges'].hasOwnProperty(specification)) {
            this.partyRateCardValues.rental_charges[specification] = resp['result'];
          }
          this.partyPrefilledRateCardValues.emit(this.partyRateCardValues);
          form.get('rate_card_data').setValue(resp['result'])
        } else {
          form.get('rate_card_data').setValue(null)
        }
      })
    }
  }

  getSetBillingPreferences() {
    let partyId = this.quotationForm.get('customer').value
    let vehicleCategory =Number (this.quotationForm.get('vehicle_category').value) ==1?'crane':'awp'
    this.onBillingUnitChange();
    if(partyId)
    this._party.getBillingPreference(partyId,vehicleCategory).subscribe((response: any) => {
    this.craneFormGroup.get('rental_charge').get('billing_unit').setValue(response.result)
    this.initialValues.billingUnit = this.rateCardBillingList.find(type=>type.value==response.result)
    this.onBillingUnitChange();
   })
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
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
