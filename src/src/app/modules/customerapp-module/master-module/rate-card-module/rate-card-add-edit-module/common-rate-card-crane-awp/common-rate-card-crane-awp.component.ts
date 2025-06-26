import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { Router } from '@angular/router';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { RateCardServiceService } from '../../rate-card-service.service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-common-rate-card-crane-awp',
  templateUrl: './common-rate-card-crane-awp.component.html',
  styleUrls: ['./common-rate-card-crane-awp.component.scss']
})
export class CommonRateCardCraneAwpComponent implements OnInit {
  @Input() rateCardId = '';
  @Input() rateCardDetails;
  @Input() vehicleCategory=''
  rateCardForm: FormGroup;
  preFixUrl = getPrefix();
  initialValues = {
    zone: [],
    specification: [],
    billingUnit:{label:'Hours',value:'hour'}
  }
  currency_type;
  specificationList = [];
  zonesList = []
  vehicleCategiriesObj={
    hasMultipleCategories:false,
    categories:[]
  };
	analyticsType = OperationConstants;
	analyticsScreen = ScreenConstants;
	screenType = ScreenType;
  apiError=''
  nameError=''
  rateCardBilling=new RateCardBillingBasedOn();
  rateCardBillingList=this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour=this.rateCardBilling.hour
  rateCardTableLabel={
    daily:'',
    weekly:'',
    monthly:''
  }

  constructor(private _fb: FormBuilder, private currency: CurrencyService, private commonloaderservice: CommonLoaderService,private _scrollToTop: ScrollToTop,
  
    private _rateCard: RateCardServiceService, private _route: Router, private _vehicleService: VehicleService,
    private _analytics: AnalyticsService,private apiHandler: ApiHandlerService ) { }

  ngOnInit(): void {
    this.commonloaderservice.getHide();
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.getZonesList();
    this.buildRateCard([{}]);
    this.onBillingUnitChange();
    this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.RATECARD, this.screenType.ADD, "Navigated");
    if(this.rateCardId && this.rateCardDetails){
       this.patchRateCard();
    }else{
       this.vehicleCatagoryChange(this.vehicleCategory)
    }
  }

  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  buildForm() {
    this.rateCardForm = this._fb.group({
      name : ['',Validators.required],
      date: [new Date(dateWithTimeZone())],
      billing_unit:['hour',Validators.required],
      vehicle_category : [null,Validators.required],
      ratecardmeta: this._fb.array([])
    })
  }

  ngOnDestroy(): void {
    this.commonloaderservice.getShow();
  }

  onBillingUnitChange(){
    const billingUnit=this.rateCardForm.value['billing_unit']
    if(billingUnit=='hour'){
      this.rateCardTableLabel={
        daily:`DAILY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.day} Hours)`,
        weekly:`WEEKLY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.week} Hours)`,
        monthly:`MONTHLY (${this.currency_type?.symbol}) (${this.rateCardBillingHour.month} Hours)`,
      }
    }else{
      this.rateCardTableLabel={
        daily:`DAILY (${this.currency_type?.symbol})`,
        weekly:`WEEKLY (${this.currency_type?.symbol})`,
        monthly:`MONTHLY (${this.currency_type?.symbol})`,
      }
    }

  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  buildRateCard(items: any) {
    this.initialValues.zone = [];
    this.initialValues.specification = [];
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    rateCard.controls = [];
    items.forEach(item => {
      const rateCardForm = this.getRateCard(item);
      rateCard.push(rateCardForm);
      this.initialValues.specification.push(getBlankOption());
      this.initialValues.zone.push(getBlankOption());
    });
  }


  getRateCard(item) {
    return this._fb.group({
      zone: [item.zone || null, [Validators.required]],
      specification: [item?.specification || null, [Validators.required]],
      daily: this._fb.group({
        with_fuel: [item?.daily?.with_fuel || 0],
        without_fuel: [item?.daily?.without_fuel || 0],
        additional_hours: [item?.daily?.additional_hours || 0]
      }),
      weekly: this._fb.group({
        with_fuel: [item?.weekly?.with_fuel || 0],
        without_fuel: [item?.weekly?.without_fuel || 0],
        additional_hours: [item?.weekly?.additional_hours || 0]
      }),
      monthly: this._fb.group({
        with_fuel: [item?.monthly?.with_fuel || 0],
        without_fuel: [item?.monthly?.without_fuel || 0],
        additional_hours: [item?.monthly?.additional_hours || 0]
      }),
    })
  }

  addRateCard() {
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    const rateCardForm = this.getRateCard({});
    rateCard.push(rateCardForm)
    this.initialValues.zone.push(getBlankOption());
    this.initialValues.specification.push(getBlankOption());
  }

  removeRateCard(index) {
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    rateCard.removeAt(index)
    this.initialValues.zone.splice(index, 1);
    this.initialValues.specification.splice(index, 1);
  }


  navigateToList() {
    this._route.navigate([getPrefix() + '/onboarding/rate-card/list'])

  }



  patchRateCard() {
    let ratecardmeta = [];
    this.rateCardForm.patchValue({
      name : this.rateCardDetails.name,
      date : this.rateCardDetails.date,
      billing_unit:this.rateCardDetails.billing_unit,
      vehicle_category : this.rateCardDetails.vehicle_category
    })
    this.initialValues.billingUnit=this.rateCardBillingList.find(type=>type.value==this.rateCardDetails.billing_unit)
    this.getVehicleSpecificationList(this.rateCardDetails.vehicle_category)
    this.rateCardDetails.ratecardmeta.forEach((meta, index) => {
      ratecardmeta.push(
        {
          zone: meta['zone']['id'] ? meta['zone']['id'] : null,
          specification: meta['specification'] ? meta['specification'].id : null,
          daily: meta['daily'],
          weekly: meta['weekly'],
          monthly: meta['monthly'],
        }
      )
    });
    this.buildRateCard(ratecardmeta);
    this.rateCardDetails.ratecardmeta.forEach((meta, index) => {
      this.initialValues.zone[index] = { label: meta['zone']?.name ,value : meta['zone']?.id};
      if (meta['specification']) this.initialValues.specification[index] = { label: meta['specification']?.name };
    });
    this.onBillingUnitChange();
  }

  checkisZero() {
    let ratecardmeta = this.rateCardForm.controls.ratecardmeta as FormArray;
    ratecardmeta.controls.forEach(element => {
      let daily = Number(element.get('daily').value['with_fuel']) + Number(element.get('daily').value['without_fuel']) + Number(element.get('daily').value['additional_hours']);
      let weekly = Number(element.get('weekly').value['with_fuel']) + Number(element.get('weekly').value['without_fuel']) + Number(element.get('weekly').value['additional_hours'])
      let monthly = Number(element.get('monthly').value['with_fuel']) + Number(element.get('monthly').value['without_fuel']) + Number(element.get('monthly').value['additional_hours'])
      if (daily == 0 && weekly == 0 && monthly == 0) {
        element.get('daily').get('with_fuel').setValidators([Validators.required, Validators.min(0.01), Validators.minLength(2)]);
        element.get('daily').get('with_fuel').updateValueAndValidity();
      } else {
        element.get('daily').get('with_fuel').setValidators([Validators.nullValidator]);
        element.get('daily').get('with_fuel').updateValueAndValidity();
      }
    });

  }
  saveRateCard() {
    let form = this.rateCardForm;
    this.checkisZero()
    form.value['date'] = changeDateToServerFormat(form.value['date'])
    if (form.valid) {
      form.value['ratecardmeta'].forEach((ratecard,index) => {
        ratecard['order_no'] = index;
      });
      if (this.rateCardId) {
        this.apiHandler.handleRequest(this._rateCard.putRentalRateCard(this.rateCardId, form.value), 'Ratecard details updated successfully!').subscribe(
          {
            next: () => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.RATECARD)
              this._route.navigate([this.preFixUrl + '/onboarding/rate-card/details/', this.rateCardId])
            },
            error: (error) => {
              if (error?.error?.message) {
                this.apiError = error?.error?.message
                if (this.apiError.includes('Rate card name already exists. Please enter a unique name')) {
                  this.nameError = "Rate card name already exists."
                }
                this._scrollToTop.scrollToTop()
                setTimeout(() => {
                  this.apiError = ''
                }, 3000)
              }
            }
          }
        )
      } else {
        this.apiHandler.handleRequest(this._rateCard.postRentalRateCard(form.value), 'Ratecard details added successfully!').subscribe(
          {
            next: (response) => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.RATECARD)
              this._route.navigate([this.preFixUrl + '/onboarding/rate-card/details/', response['result']])
            },
            error: (error) => {
              if (error?.error?.message) {
                this.apiError = error?.error?.message
                if (this.apiError.includes('Rate card name already exists. Please enter a unique name')) {
                  this.nameError = "Rate card name already exists."
                }
                this._scrollToTop.scrollToTop()
                setTimeout(() => {
                  this.apiError = ''
                }, 3000)
              }
            }
          }
        )
      }
    } else {
      setAsTouched(form);
    }
  }

  vehicleCatagoryChange(val) {
    this.rateCardForm.get('vehicle_category').setValue(val)
    this.getVehicleSpecificationList(val)
  }

  getVehicleSpecificationList(category) {
    this._vehicleService.getVehicleSpecifications(category).subscribe((response: any) => {
      this.specificationList = response.result;
    });
  }


}
