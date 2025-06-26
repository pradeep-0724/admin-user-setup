import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { setAsTouched } from 'src/app/shared-module/utilities/form-utils';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { RateCardBillingBasedOn } from 'src/app/core/constants/constant';

@Component({
  selector: 'app-rate-card',
  templateUrl: './rate-card.component.html',
  styleUrls: ['./rate-card.component.scss']
})
export class RateCardComponent implements OnInit, OnDestroy {
  rateCardForm: FormGroup;
  preFixUrl = getPrefix();
  initialValues = {
    zone: getBlankOption(),
    vehicle_category: [],
    specification: [],
    billingUnit:{label:'Hours',value:'hour'}
  }
  currency_type;
  specificationList = [];
  partyId = '';
  rateCardId = '';
  rateCardDetails;
  vehicleTypeList = [
    {
      label: "Crane",
      value: 1,
    },
    {
      label: "AWP",
      value: 2,
    }
  ];
  zonesList = []
  rateCardBilling=new RateCardBillingBasedOn();
  rateCardBillingList=this.rateCardBilling.RateCardbillingUnitsList
  rateCardBillingHour=this.rateCardBilling.hour
  rateCardTableLabel={
    daily:'',
    weekly:'',
    monthly:''
  }

  constructor(private _fb: FormBuilder, private currency: CurrencyService, private commonloaderservice: CommonLoaderService,
    private _rateCard: RateCardService, private activatedRoute: ActivatedRoute, private _route: Router, private _vehicleService: VehicleService) { }

  ngOnInit(): void {

    this.commonloaderservice.getHide();
    this.activatedRoute.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('partyId')) {
        this.partyId = paramMap.get('partyId')
      }
      if (paramMap.has('rateCardId')) {
        this.rateCardId = paramMap.get('rateCardId')
        this.getRateCardDetails();
      }
    });
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.buildRateCard([{}]);
    this.getZonesList()
    this.onBillingUnitChange();
  }

  getZonesList() {
    this._rateCard.getZonesList().subscribe((res) => {
      this.zonesList = res['result'].zone
    })
  }

  buildForm() {
    this.rateCardForm = this._fb.group({
      party: this.partyId,
      billing_unit:['hour',Validators.required],
      date: [new Date(dateWithTimeZone())],
      zone: [null, [Validators.required]],
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

  getdefaultRateCards(){
   let rateCardList=this.rateCardForm.controls.ratecardmeta as FormArray;
   rateCardList.controls.forEach((element,index) => {
    this.prefillRowBySpecification(index);
   })
  }


  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  buildRateCard(items: any) {
    this.initialValues.vehicle_category = [];
    this.initialValues.specification = [];
    this.specificationList = [];
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    rateCard.controls = [];
    items.forEach(item => {
      const rateCardForm = this.getRateCard(item);
      rateCard.push(rateCardForm);
      this.initialValues.vehicle_category.push(getBlankOption());
      this.initialValues.specification.push(getBlankOption());
      this.specificationList.push([])
    });
  }


  getRateCard(item) {
    return this._fb.group({
      vehicle_category: [item?.vehicle_category || null, [Validators.required]],
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
    this.initialValues.vehicle_category.push(getBlankOption());
    this.initialValues.specification.push(getBlankOption());
    this.specificationList.push([])
  }

  removeRateCard(index) {
    let rateCard = this.rateCardForm.get('ratecardmeta') as FormArray;
    rateCard.removeAt(index)
    this.initialValues.vehicle_category.splice(index, 1);
    this.initialValues.specification.splice(index, 1);
    this.specificationList.splice(index, 1);
  }

  getVehicleSpecificationList(form: FormGroup, index) {
    this._vehicleService.getVehicleSpecifications(form.get('vehicle_category').value).subscribe((response: any) => {
      this.specificationList[index] = response.result;
      this.initialValues.specification[index] = getBlankOption();
      form.get('specification').setValue(null)
      let item2 = {
        daily: {
          with_fuel: 0,
          without_fuel: 0,
          additional_hours: 0
        },
        weekly: {
          with_fuel: 0,
          without_fuel: 0,
          additional_hours: 0
        },
        monthly: {
          with_fuel: 0,
          without_fuel: 0,
          additional_hours: 0
        }
      }
      form.patchValue(item2);
    });
  }


  navigateToDetails() {
    let queryParams = {
      openClientTab: 4,
      chargesTab: 1
    }
    this._route.navigate([getPrefix() + '/onboarding/party/details/client/' + this.partyId], { queryParams })

  }

  getRateCardDetails() {
    this._rateCard.getRentalRateCard(this.partyId, this.rateCardId).subscribe(resp => {
      this.rateCardDetails = resp['result'];
      this.patchRateCard();
    })
  }

  patchRateCard() {
    let ratecardmeta = [];
    if (this.rateCardDetails['zone']) {
      this.initialValues.zone.label = this.rateCardDetails.zone?.name;
      this.rateCardDetails.zone = this.rateCardDetails.zone.id
    }
    this.initialValues.billingUnit=this.rateCardBillingList.find(type=>type.value==this.rateCardDetails.billing_unit)
    this.rateCardForm.patchValue(this.rateCardDetails)
    this.rateCardDetails.ratecardmeta.forEach((meta, index) => {
      ratecardmeta.push(
        {
          vehicle_category: meta['vehicle_category'],
          specification: meta['specification'] ? meta['specification'].id : null,
          daily: meta['daily_rate'],
          weekly: meta['weeky_rate'],
          monthly: meta['monthly_rate'],
        }
      )
    });
    this.buildRateCard(ratecardmeta);
    this.rateCardDetails.ratecardmeta.forEach((meta, index) => {
      this._vehicleService.getVehicleSpecifications(meta['vehicle_category']).subscribe((response: any) => {
        this.specificationList[index] = response.result;
      });
      let ind = this.vehicleTypeList.find(item => item.value === meta['vehicle_category']);
      this.initialValues.vehicle_category[index] = { label: ind?.['label'] };
      if (meta['specification']) this.initialValues.specification[index] = { label: meta['specification']?.name };
    });
    this.onBillingUnitChange();
  }


  prefillRowBySpecification(i) {
    let ratecardmeta = (this.rateCardForm.controls.ratecardmeta as FormArray).at(i);
    let params={
      specification:ratecardmeta.value['specification'],
      zone:this.rateCardForm.value['zone'],
      vehicle_category:ratecardmeta.value['vehicle_category'],
      billing_unit:this.rateCardForm.value['billing_unit']
    }
    let item2 = {
      daily: {
        with_fuel: 0,
        without_fuel: 0,
        additional_hours: 0
      },
      weekly: {
        with_fuel: 0,
        without_fuel: 0,
        additional_hours: 0
      },
      monthly: {
        with_fuel: 0,
        without_fuel: 0,
        additional_hours: 0
      }
    }
    ratecardmeta.patchValue(item2);
    if(ratecardmeta.value['vehicle_category'] && ratecardmeta.value['specification'] && this.rateCardForm.value['zone']){
      this._rateCard.getDefaultCommonRateCardBySpecZoneBillCate(params).subscribe((res) => {
        let item = res['result'];
        if (isValidValue(item)) {
          ratecardmeta.patchValue({
            daily: item?.daily,
            weekly: item?.weekly,
            monthly: item?.monthly
          })
        }
  
      })
    }
   
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
    form.value['party'] = this.partyId
    if (form.valid) {
      if (this.rateCardId) {
        this._rateCard.putRentalRateCard(this.rateCardId, form.value).subscribe(resp => {
          this.navigateToDetails()
        })
      } else {
        this._rateCard.postRentalRateCard(form.value).subscribe(resp => {
          this.navigateToDetails()
        })
      }
    } else {
      setAsTouched(form);
    }
  }


}

