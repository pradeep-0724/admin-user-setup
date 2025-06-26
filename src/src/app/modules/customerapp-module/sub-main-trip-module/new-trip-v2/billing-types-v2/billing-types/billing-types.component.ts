import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { addErrorClass, setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { NewTripV2Constants } from '../../new-trip-v2-constants/new-trip-v2-constants';
import { ToolTipInfo } from '../../new-trip-v2-utils/new-trip-v2-utils';
import { BillingTypes } from '../../../sub-main-trip-utils/billing-types-utils';
import { cloneDeep } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { CurrencyService } from 'src/app/core/services/currency.service';
type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
}
@Component({
  selector: 'app-billing-types',
  templateUrl: './billing-types.component.html',
  styleUrls: ['./billing-types.component.scss']
})
export class BillingTypesComponent implements OnInit ,OnDestroy,OnChanges{
  @Input() parentForm?:FormGroup
  billingForm: FormGroup;
  initialValues = {
    billingType: getBlankOption()
  }
  billingType: BillingTypes = new BillingTypes();
  billingTypeSelected = '';
  billingTypeSelected2 = '';
  currency_type;
  @Input()formType='billing';
  @Input() isLooseCargo:boolean=false;
  @Input()isDisableBillingTypes: boolean = false;
  constantsTripV2 = new NewTripV2Constants()
  @Input() billingTypeList = new NewTripV2Constants().billingTypeList;
  @Input() defaultBillingType: number = 10;
  @Input() isMandatory: boolean = false;
  @Input() isFormValid: Observable<boolean>;
  @Output() dataFromBilling = new EventEmitter<any>()
  @Input() workOrderClientFrightData?: Observable<workOrderFrightDataType>;
  @Input() billingFrieightChanged ?: Observable<any>;
  @Input() isAllMandatory : boolean = false;
  @Input() showUnitsAndRateFields : boolean = true;
  @Input() totalContainer=0
  billingTypesToolTip: ToolTipInfo;
  billingTypeLabels = new NewTripV2Constants().billingTypeLabels;
  $subScriptionList :  Subscription[] = [];
  @Input() isWorkorderContainer=false;
  constructor(private _currency:CurrencyService) {

  }

  ngOnDestroy(): void {

    if(this.parentForm){
      this.parentForm.removeControl(this.formType);
      this.$subScriptionList.forEach((ele)=>{
        ele.unsubscribe();
      })
    }
   
  }


  ngOnInit() {
    this.currency_type=this._currency.getCurrency()

    this.billingForm = this.billingType.buildForm(this.defaultBillingType);
    if (this.isMandatory) {
      this.billingType.makeAllFieldRequired(this.defaultBillingType);
    }
    this.billingTypesToolTip = {
      content: this.constantsTripV2.toolTipMessages.BILLING_TYPES.CONTENT
    }
    this.getSelectedBillingType(this.defaultBillingType)
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
    this.dataFromBilling.emit({
      isFormValid: this.billingForm.valid,
      value: this.billingForm.value,
    })
    this.billingForm.valueChanges.pipe(debounceTime(100)).subscribe(data => {
      this.dataFromBilling.emit({
        isFormValid: this.billingForm.valid,
        value: cloneDeep(data)
      });
    });
    if(this.parentForm){
      this.parentForm.addControl(this.formType,this.billingForm);      
    }
    if(this.billingFrieightChanged){
      this.$subScriptionList.push(
        this.billingFrieightChanged?.subscribe((defaultBillingType)=>{
          this.defaultBillingType = defaultBillingType
          this.isMandatory = Number(defaultBillingType)>0;
          this.billingForm.get('freight_type').setValue(defaultBillingType);
          if(this.isMandatory || (this.isAllMandatory && this.billingForm.get('freight_type').value)){
            this.billingType.makeAllFieldRequired(this.billingForm.get('freight_type').value);    
            if(this.isAllMandatory && this.billingForm.get('freight_type').value ==10){
              setUnsetValidators(this.billingForm,'freight_amount',[Validators.required,Validators.min(0.01)])
              setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
              setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator])
            }      
          } 
          this.getSelectedBillingType(defaultBillingType)
        })
      )
    }
    
   
  }

  ngOnChanges(changes: SimpleChanges): void {
     if('totalContainer' in changes){
      this.patchContainerTotal()
     }
  }


  patchContainerTotal(){

    if(this.isWorkorderContainer && this.billingForm?.value){
      this.totalContainer=this.totalContainer
      if(Number(this.billingForm.get('freight_type').value)==11){
        this.billingForm.get('total_units').setValue(this.totalContainer)
      }else{
        if(!this.isDisableBillingTypes)
        this.billingForm.get('total_units').setValue(0.00)
      }
      this.onChangeCalulation()
     }
  }

  onChangeCalulation() {    
    if (this.isMandatory || this.isAllMandatory) {
      this.billingType.makeAllFieldRequired(this.billingForm.get('freight_type').value);
      this.billingType.onChangeCalulation();
      if(this.isAllMandatory && this.billingForm.get('freight_type').value ==14){
        this.billingType.makeAllFieldRequired(this.billingForm.get('freight_type').value);
      }
      if(this.isAllMandatory && this.billingForm.get('freight_type').value ==10){
        setUnsetValidators(this.billingForm,'freight_amount',[Validators.required,Validators.min(0.01)])
        setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
        setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator])
      }
    }
    else{
      this.billingType.onChangeCalculationsForTrips()
    }
  }

  onChangeBillingType() {
    let billingType = this.billingForm.get('freight_type').value;
    this.getSelectedBillingType(billingType)
    if (this.isMandatory || this.isAllMandatory) {
      this.billingType.makeAllFieldRequired(billingType);
    }
    this.billingType.onChangeBillingType();
    if(this.isAllMandatory && this.billingForm.get('freight_type').value ==14){
      this.billingType.makeAllFieldRequired(billingType);
    }
    if(this.isAllMandatory && this.billingForm.get('freight_type').value ==10){
      setUnsetValidators(this.billingForm,'freight_amount',[Validators.required,Validators.min(0.01)])
      setUnsetValidators(this.billingForm,'rate',[Validators.nullValidator])
      setUnsetValidators(this.billingForm,'total_units',[Validators.nullValidator])
    }
    this.patchContainerTotal()

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
      freight_amount: data.freight_amount
    }
    this.getSelectedBillingType(data.freight_type)
    this.billingType.patchBillingTypes(billingData);
    if (this.isMandatory) {
      this.billingType.makeAllFieldRequired(data.freight_type);
    }
    this.dataFromBilling.emit({
      isFormValid: this.billingForm.valid,
      value: this.billingForm.value,
    })
  }

}
