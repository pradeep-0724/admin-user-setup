import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { MultipleDestionDataService } from '../../multiple-destination/multiple-destination-dataservice.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
}
@Component({
  selector: 'app-so-billing-types',
  templateUrl: './so-billing-types.component.html',
  styleUrls: ['./so-billing-types.component.scss']
})
export class SoBillingTypesComponent implements OnInit, OnChanges {
  @Input() parentForm?: FormGroup;
  @Input() momentType = 0;
  @Input() scopeOfWork = 0;
  @Input() isFormValid: Observable<boolean>;
  @Input()  customerId=''
  @Input() workOrderClientFrightData?: Observable<workOrderFrightDataType>;
  @Input() isDisableBillingTypes: boolean = false;
  locationToolTip: any = {
    content: [`<div>
    <p><b>Job-wise:</b> Each job (Pullout, Deposit, Live Loading) is invoiced individually.</p>
    <p><b>Container-wise:</b> All jobs linked to a container are grouped and invoiced as a single line item under the container number.</p>
    </div>`]
  }
  containerJobType = new NewTripV2Constants().containerJobType
  billingForm: FormGroup;
  formType = 'billing'
  formGropuslist = ['job', 'regular', 'couple', 'boggy', 'sideLoader', 'lowBed'];
  currency_type;
  billingTypes = [
    {
      label: 'Job-wise',
      value: '10'
    },
    {
      label: 'Container-wise',
      value: '11'
    },
  ]
  initialValues = {
    billingType: getBlankOption(),
    jobType: getBlankOption(),
  }
  $subScriptionList: Subscription[] = [];
  isEdit = false;
  salesOrderRateCardData = {};
  @Output() emitCommonRateCardValues = new EventEmitter();
  destinationList = []
  defaultdata = {
    "boggy": "0.000",
    "couple": "0.000",
    "lowBed": "0.000",
    "regular": "0.000",
    "sideLoader": "0.000"
  }
  rateCardOptions: Record<string, string> = {
    '1': 'pullout',
    '3': 'deposit',
    '4': 'pullout_deposit',
    '2': 'live_loading'
  };
  destinationCount = 0;
   containerParams = {
    zone: '',
    pd_zone: '',
    billing_type: '',
    vehicle_category: ''
  }

  constructor(private _fb: FormBuilder, private _currency: CurrencyService, private _multipleDestionDataService: MultipleDestionDataService, private _rateCardService: RateCardService) { }

  ngOnInit(): void {
    this.currency_type = this._currency.getCurrency()
    this.billingForm = this._fb.group({
      billing_type: '10',
      job_type: null,
    })
    this.formGropuslist.forEach((key) => {
      this.builtFormGroup(key);
    })
    this.initialValues.billingType = this.billingTypes[0]
    if (this.parentForm) {
      this.parentForm.addControl(this.formType, this.billingForm);
    }
    this.isFormValid.subscribe(valid => {
      if (!valid) {
        setAsTouched(this.billingForm)
      }
    });
    if (this.workOrderClientFrightData) {
      this.workOrderClientFrightData.subscribe(resp => {
        this.isEdit = true;
        this.patchBilling(resp);
        if (resp['freight_type'] == 10) {
          this.makeRequired('job');
        } else {
          const handlingType = ['regular', 'couple', 'boggy', 'sideLoader', 'lowBed'];
          handlingType.forEach((key) => {
            this.makeRequired(key);
          });
        }
      });
    } else {
      this.makeRequired('job');
      this.isEdit = false;
    }
    this.$subScriptionList.push(this._multipleDestionDataService.newUpdatedZone.subscribe((destinations: any) => {
      this.destinationList = destinations
      if (!this.isEdit) {
        this.getRateCardData();
        if (Number(this.billingForm.get('billing_type').value) != 10) {
          this.makeDefaultInvoiceMode();
        }
      } else {
        this.destinationCount+=1
        this.getRateCardData()
        if(this.destinationCount>1){
          this.onInvoiceModeChange();
        }
      }

    }))

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isEdit) return;
    const billingType = this.billingForm?.get('billing_type')?.value ? Number(this.billingForm.get('billing_type')?.value) : 10;
    const shouldTriggerInvoiceModeChange = billingType !== 10;
    if (changes['momentType'] && !changes['momentType'].firstChange) {
      if (this.momentType === 3 || this.momentType === 4) {
        this.salesOrderRateCardData = {};
      }
      this.getRateCardData();
      if (shouldTriggerInvoiceModeChange) {
        this.makeDefaultInvoiceMode();
      }
    }

    if (changes['scopeOfWork'] && !changes['scopeOfWork'].firstChange && shouldTriggerInvoiceModeChange) {
      this.makeDefaultInvoiceMode();
    }
  }


  ngOnDestroy(): void {

    if (this.parentForm) {
      this.parentForm.removeControl(this.formType);
      this.$subScriptionList.forEach((ele) => {
        ele.unsubscribe();
      })
    }

  }

  builtFormGroup(key) {
    this.billingForm.addControl(key, this._fb.group({
      is_selected: true,
      rate: 0,
      est_jobs: 0,
      est_total: 0,
      pullout_consideration: 0.00,
      deposit_consideration: 0.00,
      liveLoading_consideration: 0.00,
      local_consideration: 0.00
    }))
  }

  onInvoiceModeChange() {
    const billingType =Number(this.billingForm.get('billing_type')?.value);
    const isJobSelected = billingType === 10;
    const otherSelected = !isJobSelected;
    this.billingForm.get('job')?.patchValue({
      is_selected: isJobSelected,
      rate: 0,
      est_jobs: 0,
      est_total: 0,
      pullout_consideration: 0.00,
      deposit_consideration: 0.00,
      liveLoading_consideration: 0.00,
      local_consideration: 0.00
    });
    const handlingType = ['regular', 'couple', 'boggy', 'sideLoader', 'lowBed'];
    handlingType.forEach((key) => {
      this.billingForm.get(key)?.patchValue({
        is_selected: otherSelected,
        rate: 0,
        est_jobs: 0,
        est_total: 0,
        pullout_consideration: 0.00,
        deposit_consideration: 0.00,
        liveLoading_consideration: 0.00,
        local_consideration: 0.00
      });
    });
    this.initialValues.jobType = getBlankOption();
    this.billingForm.get('job_type')?.patchValue(null);
    if(!isJobSelected){
      this.formGropuslist.forEach((key) => this.makeRequired(key));
      if (this.salesOrderRateCardData.hasOwnProperty('rateCard') && isValidValue(this.salesOrderRateCardData['rateCard'])) {
        const handlingType = ['regular', 'couple', 'boggy', 'sideLoader', 'lowBed'];
        handlingType.forEach((key) => {
          this.billingForm.get(key)?.patchValue({
            rate: this.salesOrderRateCardData['rateCard'][this.rateCardOptions[this.scopeOfWork]][key],
          });
        })
      }
    }
   
  }

  makeDefaultInvoiceMode() {
    this.billingForm.get('billing_type')?.patchValue('10');
    this.initialValues.billingType = { label: 'Job-wise', value: '' }
    this.initialValues.jobType = getBlankOption();
    this.billingForm.get('job_type')?.patchValue(null);
    this.billingForm.get('job')?.patchValue({
      is_selected: true,
      rate: 0.000,
      est_jobs: 0.000,
      est_total: 0.00,
      pullout_consideration: 0.00,
      deposit_consideration: 0.00,
      liveLoading_consideration: 0.00,
      local_consideration: 0.00
    });
  }

  oncheckBoxChange(key) {
    const control = this.billingForm.get(key);
    if (!control) return;

    const isSelected = control.value?.is_selected;
    const defaultRate = this.defaultdata[key];

    let rate = defaultRate;
    let est_jobs = 0.000
    let est_total = 0.000
    let pullout_consideration = 0.00;
    let deposit_consideration = 0.00;
    let liveLoading_consideration = 0.00;
    let local_consideration = 0.00;

    if (isSelected && isValidValue(this.salesOrderRateCardData['rateCard'])) {
      const rateCardKey = this.rateCardOptions[this.scopeOfWork];
      rate = this.salesOrderRateCardData['rateCard'][rateCardKey]?.[key] ?? defaultRate;
    }
    control.patchValue({ rate, est_jobs, est_total,pullout_consideration,deposit_consideration ,liveLoading_consideration,local_consideration});
  }
  onCalculationChange() {
    this.formGropuslist.forEach((key) => {
      let rate = this.billingForm.get(key)?.get('rate')?.value
      let est_jobs = this.billingForm.get(key)?.get('est_jobs')?.value
      let est_total = (Number(rate) * Number(est_jobs)).toFixed(3)
      this.billingForm.get(key)?.get('est_total')?.setValue(est_total)
    })
  }

  makeRequired(key) {
    if (this.billingForm.get(key).get('is_selected')?.value) {
      setUnsetValidators(this.billingForm.get(key), 'est_jobs', [Validators.min(0.01)])
      setUnsetValidators(this.billingForm.get(key), 'rate', [Validators.min(0.01)])
    } else {
      setUnsetValidators(this.billingForm.get(key), 'est_jobs', [Validators.nullValidator])
      setUnsetValidators(this.billingForm.get(key), 'rate', [Validators.nullValidator])
    }
  }


  patchBilling(data) {
    this.billingForm.get('billing_type')?.patchValue(data['freight_type']);
    this.initialValues.billingType = this.billingTypes.filter(item => item.value == data['freight_type'])[0]
    if (data['freight_type'] == 10) {
      if (isValidValue(data['job_type'])) {
        this.initialValues.jobType = { label: this.containerJobType.filter(item => item.id == data['job_type'])[0].label, value: '' }
        this.billingForm.get('job_type')?.patchValue(data['job_type']);
      }
      this.billingForm.get('job')?.patchValue({
        is_selected: true,
        rate: data['rate'],
        est_jobs: data['total_units'],
        est_total: data['freight_amount']
      });
    } else {
      const handlingType = ['regular', 'couple', 'boggy', 'sideLoader', 'lowBed'];
      handlingType.forEach((key) => {
        this.billingForm.get(key)?.patchValue({
          is_selected: data['estimations'][key]['is_selected'],
          rate: data['estimations'][key]['rate'],
          est_jobs: data['estimations'][key]['est_jobs'],
          est_total: data['estimations'][key]['est_total'],
          pullout_consideration :data['estimations'][key]['pullout_consideration'],
          deposit_consideration :data['estimations'][key]['deposit_consideration'],
          liveLoading_consideration :data['estimations'][key]['liveLoading_consideration'],
          local_consideration :data['estimations'][key]['local_consideration'],
        });
      });
    }
  }

  getRateCardData() {
    if (this.destinationList.length == 0) return
    let pullOut = this.destinationList.find(item => item.destination_type === 1)?.zone
    let deposit = this.destinationList.find(item => item.destination_type === 2)?.zone
    let customerLocation = this.destinationList.find(item => item.destination_type === 3)?.zone
    this.salesOrderRateCardData = {}
    if (this.scopeOfWork == 2 || this.scopeOfWork == 4) {
      if (pullOut && deposit && customerLocation && pullOut === deposit) {
        this.containerParams = {
          zone: customerLocation,
          pd_zone: pullOut,
          billing_type: 'container',
          vehicle_category: '4'
        }
        this.getDefaultRatecard()
      }
    }
    if (this.scopeOfWork == 1) {
      if (pullOut && customerLocation) {
        this.containerParams = {
          zone: customerLocation,
          pd_zone: pullOut,
          billing_type: 'container',
          vehicle_category: '4'
        }
        this.getDefaultRatecard()
      }
    }
    if (this.scopeOfWork == 3) {
      if (deposit && customerLocation) {
        this.containerParams= {
          zone: customerLocation,
          pd_zone: deposit,
          billing_type: 'container',
          vehicle_category: '4'
        }
        this.getDefaultRatecard()
      }
    }

  }

  getDefaultRatecard() {
    this._rateCardService.getDefaultRateCardBySpecZoneBillCate(this.customerId,this.containerParams).subscribe(resp => {
      if (resp['result']) {
        this.salesOrderRateCardData['rateCard'] = resp['result']
      } else {
        this.salesOrderRateCardData = {}
      }
      if(this.isEdit&& this.destinationCount>1){
        this.onInvoiceModeChange();
      }
      this.emitCommonRateCardValues.emit(this.salesOrderRateCardData);
    })
  }

}


