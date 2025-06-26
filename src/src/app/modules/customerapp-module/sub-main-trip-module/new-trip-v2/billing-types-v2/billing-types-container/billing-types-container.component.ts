import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { addErrorClass, setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { BillingTypes } from '../../../sub-main-trip-utils/billing-types-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { MultipleDestionDataService } from '../../multiple-destination/multiple-destination-dataservice.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { NewTripV2DataService } from '../../new-trip-v2-dataservice';
type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
  job_type:number|string
}

@Component({
  selector: 'app-billing-types-container',
  templateUrl: './billing-types-container.component.html',
  styleUrls: ['./billing-types-container.component.scss']
})
export class BillingTypesContainerComponent implements OnInit,OnDestroy,OnChanges{
  @Input() parentForm?:FormGroup
  @Input() jobType?:any
  @Input() momentType?:any
  @Input() scopeOfWork?:any
  billingForm: FormGroup;
  initialValues = {
    billingType: getBlankOption(),
    jobType:getBlankOption()
  }
  billingType: BillingTypes = new BillingTypes();
  billingTypeSelected = '';
  billingTypeSelected2 = '';
  currency_type;
  @Input()formType='billing';
  @Input() isLooseCargo:boolean=false;
  @Input()isDisableBillingTypes: boolean = false;
  @Input()customerId=''
  constantsTripV2 = new NewTripV2Constants()
  @Input() isRateAndUnitsMandatory : boolean = false;
  @Input() billingTypeList =[{
    label:'Jobs',
    value:'10'
  },
  {
    label:'Containers',
    value:'11'
  },]
  destinationList=[]
  isEdit=false;
  @Input() defaultBillingType: number = 10;
  @Input() isFormValid: Observable<boolean>;
  @Input() workOrderClientFrightData?: Observable<workOrderFrightDataType>;
  @Input() isWorkorderContainer : boolean = false;
  @Output() emitCommonRateCardValues = new EventEmitter();
  billingTypesToolTip: ToolTipInfo;
  billingTypeLabels = new NewTripV2Constants().billingTypeLabels;
  $subScriptionList :  Subscription[] = [];
  jobRateCardData={}
  rateCardOptions: Record<string, string> = {
    '1': 'pullout',
    '3': 'deposit',
    '4': 'pullout_deposit',
    '2': 'live_loading'
  };
  handlingTypeOptions={
    '0':'regular',
    '1':'couple',
    '2':'boggy',
    '3':'sideLoader',
    '4':'lowBed'
  }
  containerChangesCount = 0;
  containerDestinatinChangeCount = 0;
  containerParams= {
    zone:'',
    pd_zone:'',
    billing_type: '',
    vehicle_category: ''
  }
  constructor(private _currency:CurrencyService, private _multipleDestionDataService: MultipleDestionDataService,private _rateCardService: RateCardService,private _tripDataService:NewTripV2DataService) {

  }

  ngOnDestroy(): void {

    if(this.parentForm){
      this.parentForm.removeControl(this.formType);
      this.$subScriptionList.forEach((ele)=>{
        ele.unsubscribe();
      })
    }
   
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.isEdit=this._tripDataService.isEditTrip
    this.containerChangesCount+=1;
    if (this.isEdit && this.containerChangesCount<3) return;
    const billingType = Number(this.billingForm?.get('billing_type')?.value);
    const shouldTriggerBillingTypeChange = billingType !== 10;
    if (changes['momentType'] && !changes['momentType'].firstChange) {
      if (this.momentType === 3 || this.momentType === 4) {
        this.jobRateCardData = {};
      }
      this.getRateCardData();
      if (shouldTriggerBillingTypeChange) {
        this.makeDefaultBillingType()
        this.patchRateCardOnBillingTypeChange()
      }
    }

    if (changes['scopeOfWork'] && !changes['scopeOfWork'].firstChange && shouldTriggerBillingTypeChange) {
      this.makeDefaultBillingType()
      this.patchRateCardOnBillingTypeChange()
    }
    if (changes['jobType'] && !changes['jobType'].firstChange && shouldTriggerBillingTypeChange) {
      this.makeDefaultBillingType()
      this.patchRateCardOnBillingTypeChange()
    }
  }


  ngOnInit() {
    this.currency_type=this._currency.getCurrency()
    this.billingForm = this.billingType.buildForm(this.defaultBillingType);
    let billingType = this.billingForm.get('freight_type').value;
    if(Number(billingType)==11 && this.isRateAndUnitsMandatory){
      setUnsetValidators(this.billingForm,'rate',[Validators.min(0.01)])
      setUnsetValidators(this.billingForm,'total_units',[Validators.min(0.01)])
    }else{
      setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
      setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator]);
      setUnsetValidators(this.billingForm,'freight_amount',[Validators.nullValidator]);
    }
    this.getSelectedBillingType(this.defaultBillingType)
    this.billingTypesToolTip = {
      content: this.constantsTripV2.toolTipMessages.BILLING_TYPES.CONTENT
    }
 
    this.isFormValid.subscribe(valid => {
      if (!valid) {
        setAsTouched(this.billingForm)
      }
    });
    if (this.workOrderClientFrightData) {
      this.workOrderClientFrightData.subscribe(resp => {
        this.patchBilling(resp);
      });
    }
    if(this.parentForm){
      this.parentForm.addControl(this.formType,this.billingForm);      
    }
    this.$subScriptionList.push(this._multipleDestionDataService.newUpdatedZone.subscribe((destinations: any) => {
      this.destinationList = destinations
      this.containerDestinatinChangeCount+=1;
      if (!this.isEdit) {
        this.getRateCardData();
        this.makeDefaultBillingType();
      } else {
        this.getRateCardData()
      }

    }))
  }

  makeDefaultBillingType(){
    let billingData = {
      id: null,
      freight_type:'10',
      rate:0.000,
      total_units:0.000,
      freight_amount:0.000,
    }
    this.getSelectedBillingType('10')
    this.billingType.patchBillingTypes(billingData);
    setTimeout(() => {
        setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
        setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator]);
        setUnsetValidators(this.billingForm,'freight_amount',[Validators.nullValidator]);
      this.billingForm.updateValueAndValidity()
    }, 1000);
  }


  onChangeCalulation() {   
    this.billingType.onChangeCalulation(); 
    let billingType = this.billingForm.get('freight_type').value;    
    if(Number(billingType)==11 && this.isRateAndUnitsMandatory){
      setUnsetValidators(this.billingForm,'rate',[Validators.min(0.01)])
      setUnsetValidators(this.billingForm,'total_units',[Validators.min(0.01)])
    }else{
      setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
      setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator]);
      this.isRateAndUnitsMandatory && setUnsetValidators(this.billingForm,'freight_amount',[Validators.min(0.01)]);
    }
  }

  onChangeBillingType() {
    let billingType = this.billingForm.get('freight_type').value;    
    this.getSelectedBillingType(billingType);
    this.billingType.onChangeBillingType();
    if(Number(billingType)==11 && this.isRateAndUnitsMandatory){
      setUnsetValidators(this.billingForm,'rate',[Validators.min(0.01)])
      setUnsetValidators(this.billingForm,'total_units',[Validators.min(0.01)])
    }else{
      setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
      setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator]);
      this.isRateAndUnitsMandatory && setUnsetValidators(this.billingForm,'freight_amount',[Validators.min(0.01)]);
    }
    this.patchRateCardOnBillingTypeChange()
  }

  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName)
  }

  getSelectedBillingType(billingType) {    
    if(billingType !=0){
      let selectedBilling = this.billingTypeList.filter(item => item.value == billingType)[0]
      this.initialValues.billingType = selectedBilling;
      this.billingTypeSelected = this.billingTypeLabels.filter(item => item.value == billingType)[0]?.label
      this.billingTypeSelected2 = this.billingTypeLabels.filter(item => item.value == billingType)[0]?.label2

    }
  }


  patchBilling(data: workOrderFrightDataType) {        
    let billingData = {
      id: null,
      freight_type: data.freight_type,
      rate: data.rate,
      total_units: data.total_units,
      freight_amount: data.freight_amount,
    }
    this.getSelectedBillingType(data.freight_type)
    this.billingType.patchBillingTypes(billingData);
    setTimeout(() => {
      this.billingForm.updateValueAndValidity()
    }, 1000);
  }

  getRateCardData() {
    if (this.destinationList.length == 0) return
    let pullOut = this.destinationList.find(item => item.destination_type === 1)?.zone
    let deposit = this.destinationList.find(item => item.destination_type === 2)?.zone
    let customerLocation = this.destinationList.find(item => item.destination_type === 3)?.zone
    this.jobRateCardData = {}
    if (this.isEdit && this.containerDestinatinChangeCount>=2){
      this.patchRateCardOnBillingTypeChange();
     }
    if(this.scopeOfWork==2 || this.scopeOfWork==4){
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
    if(this.scopeOfWork==1){
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
    if(this.scopeOfWork==3){
      if (deposit && customerLocation) {
        this.containerParams = {
          zone: customerLocation,
          pd_zone: deposit,
          billing_type: 'container',
          vehicle_category: '4'
        }
        this.getDefaultRatecard()
      } 
    }
  
  }

  patchRateCardOnBillingTypeChange(){
    const billingType = Number(this.billingForm.get('freight_type')?.value);
    const isContainerSelected = billingType === 11;
    if(isContainerSelected){
      if (this.jobRateCardData.hasOwnProperty('rateCard')) {
        this.billingForm.get('rate').setValue(this.jobRateCardData['rateCard'][this.rateCardOptions[this.scopeOfWork]][this.handlingTypeOptions[this.jobType]])
        this.onChangeCalulation()
      }else{
        this.billingForm.get('rate').setValue(0.000)
        this.onChangeCalulation()
      }
    }
    this.billingForm.markAsTouched()
  }

  getDefaultRatecard(){
    this._rateCardService.getDefaultRateCardBySpecZoneBillCate(this.customerId,this.containerParams).subscribe(resp => {
      if(resp['result']){
        if(this.formType=='vehicle_freights') return
        this.jobRateCardData['rateCard'] = resp['result']
      }else{
        this.jobRateCardData={};
      }
      if (this.isEdit && this.containerDestinatinChangeCount>=2){
        this.patchRateCardOnBillingTypeChange();
       }
      this.emitCommonRateCardValues.emit(this.jobRateCardData)
    })
  }



}
