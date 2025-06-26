import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToolTipInfo } from '../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { getBlankOption, getNonTaxableOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { QuotationConstants } from '../../constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { TaxService } from 'src/app/core/services/tax.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2DataService } from '../../../new-trip-v2/new-trip-v2-dataservice';
import { cloneDeep } from 'lodash';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-quotation-template-trailer',
  templateUrl: './quotation-template-trailer.component.html',
  styleUrls: ['./quotation-template-trailer.component.scss']
})
export class QuotationTemplateTrailerComponent implements OnInit {

  @Input() quotationForm: FormGroup;
  @Input() isFormValid = new Subject();
  @Input() quotationDetails?: any;
  @Input() formType = 'loose_cargo';
  materialFreightEditDetails = new BehaviorSubject(null);
  truckFormGroup: FormGroup;
  quotationClientFreight: FormGroup
  otherCharges: FormGroup
  routeToolTip: ToolTipInfo;
  T_AND_C_Tooltip: ToolTipInfo;
  signatureToolTip: ToolTipInfo;
  routeCodeList = [];
  initialValues = {
    tax: {},
    route_code: {},
    clientApprovalStatus: {},
    signature: {},
    termsAndCondition: {},
    additionalTax : [],
    unit : []
  }
  isAllFormValid = {
    clientFright: true,
    multipleDestination: true,

  }
  @Output() quotationFinalValues = new EventEmitter<any>();

  quotationTotals: any = {
    subtotal: 0,
    subtotal_freights: 0.0,
    subtotal_others: 0.0,
    discountTotal: 0,
    roundOffAmount: 0,
    total: 0,
    taxes: [],
    discountAfterTaxTotal: 0.00,
    balance: 0.0
  };
  constantsTripV2 = new NewTripV2Constants();
  taxOption = getNonTaxableOption();
  quotationApprovalStatus = new QuotationConstants().quotationApprovalStatus;
  ismultipleDestinationFormValid = new Subject();
  routeId = new Subject();
  routeDestinations = new Subject();
  isSubFormValid = new Subject();

  customerId = new Subject();
  totalFreightAmount = 0;
  currency_type;
  tersmAndConditions = [];
  digitalSignature = [];
  isTax = true;
  taxTerms: object = {
    label: '',
    taxValue: 0,
    itemRateIncluded: false
  };
  terminology: any;
  clientFreightData
  otherChargesData;
  isEdit = false;

  defaultTax = new ValidationConstants().defaultTax;
  taxOptions = [];
  unitOfMeasurementList = [];
  additionalCharges : any[] =[];
  isAddChargesTabError : boolean = false;
  isClientFreightError : boolean = false;
  constructor(private _fb: FormBuilder, private currency: CurrencyService, private _terminologiesService: TerminologiesService,
    private _quotationV2Service: QuotationV2Service, private _isTax: TaxService, private _newTripService: NewTripV2Service, private _newTripDataService: NewTripV2DataService,
    private _rateCard: RateCardService, public dialog: Dialog,private _commonService: CommonService) { }


  ngOnDestroy(): void {
    this.quotationForm.removeControl('loose_cargo');
  }
  ngOnInit(): void {
    this.buildForm();
    this.initialValues.clientApprovalStatus = this.quotationApprovalStatus[0];
    this.routeToolTip = {
      content: this.constantsTripV2.toolTipMessages.ROUTE.CONTENT
    }
    this.T_AND_C_Tooltip = {
      content: this.constantsTripV2.toolTipMessages.T_AND_C.CONTENT
    }
    this.signatureToolTip = {
      content: this.constantsTripV2.toolTipMessages.SIGNATURE.CONTENT
    }
    this.currency_type = this.currency.getCurrency();
    this.getTersmAndConditionList();
    this.getDigitalSignatureList();
    this.getTaxDetails();
    this.isTax = this._isTax.getTax();
    this.taxTerms['label'] = this.taxOption.label;
    this.terminology = this._terminologiesService.terminologie;
    this.isFormValid.subscribe((isValid:boolean) => {
      this.ismultipleDestinationFormValid.next(isValid)
      this.isSubFormValid.next(isValid);
      this.isClientFreightError = this.truckFormGroup.get('materials').invalid ;
      this.isAddChargesTabError = this.truckFormGroup.get('additional_charge').invalid;
    })
    this._newTripDataService.newRouteName.subscribe((routeName: string) => {
      if (routeName) {
        this.truckFormGroup.get('route_code').setValue(routeName);
        this.initialValues.route_code = { label: routeName, value: routeName };
        this.routeId.next(routeName)
      }
    });
    this._newTripDataService.newUpdateRoute.subscribe((update: boolean) => {
      if (update) {
        this.truckFormGroup.get('update_route').setValue(update);
      }
    });
    this.getUnitsOfMeasurement();
   
    if (this.quotationDetails) {    
      this.materialFreightEditDetails.next(this.quotationDetails)
      this.patchQuotationTemplateTruck(cloneDeep(this.quotationDetails))
    }else{
      this.getAdditionalCharge();
    }
  }

  ngAfterViewInit(): void {
    let customer = this.quotationForm.get('customer').value
    if(customer){
      this.getRouteList(customer)
      this.truckFormGroup.get('route_code').setValue(null);      
      this.routeId.next('');
      this.customerId.next(customer);
    }
  }
  

  buildForm() {
    this.truckFormGroup = this._fb.group({
      discount_value: [0],
      route_code: [''],
      path: [[]],
      discount_choice: [0],
      discount_value_after_tax: [0.00],
      discount_choice_after_tax: [0],
      is_roundoff: [false],
      terms_and_condition: [''],
      narration: [''],
      signature: [''],
      status: ['1'],
      is_freight_vaild: true,
      is_other_charges_valid: true,
      freights: {},
      others: {},
      start_end_destination: this._fb.array([]),
      update_route: false,
      additional_charge : this._fb.array([])

    })
    this.quotationForm.addControl('loose_cargo', this.truckFormGroup);
  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  routeSelected() {
    this.routeId.next(this.truckFormGroup.get('route_code').value)
    this.routeDestinations.next(this.routeCodeList.filter(route => route.name == this.truckFormGroup.get('route_code').value)[0].paths)
  }

  multipleDestinationFormData(e) {
    let destinations = [];
    this.isAllFormValid.multipleDestination = e.isFormValid
    destinations = cloneDeep(e.formData)
    if (e.isFormValid) {
      this.truckFormGroup.get('path').setValue(destinations)
    }
  }

  materailsFormValue(e) {    
    this.onCalculationsChange();
  }

  onCalculationsChange() {    
    const freight = this.quotationForm.value['loose_cargo']['materials']
    this.quotationTotals.subtotal_freights = 0;
    this.quotationTotals.subtotal_others = 0;
    this.quotationTotals.subtotal = 0;
    this.quotationTotals.total = 0;
    this.quotationTotals.taxTotal = 0;
    this.totalFreightAmount = 0
    if (freight ) {
      this.quotationTotals.taxes.forEach((tax) => {
        tax.total = 0;
        tax.taxAmount = 0;
        let rate = Number(freight['rate']);
        let quantity = Number(freight['quantity']);
        let amountWithoutTax = rate * quantity;
        let amountWithTax = ''
          if (freight['tax'] == tax.id) {
            if (isValidValue(amountWithoutTax)) {
              tax.total = tax.total + amountWithoutTax;
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
              amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
              this.quotationTotals.subtotal_freights = (Number(this.quotationTotals.subtotal_freights) + Number(amountWithoutTax)).toFixed(3);
              this.quotationTotals.subtotal = (Number(this.quotationTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
              this.quotationTotals.total = (Number(this.quotationTotals.total) + Number(amountWithTax)).toFixed(3);
              this.totalFreightAmount = this.totalFreightAmount + Number(amountWithTax)
            }
          }
          let additionalChargeTaxTotal :number = 0;
          const additionalCharge = (this.truckFormGroup.controls['additional_charge']) as FormArray
          additionalCharge.controls.forEach(form => {
            form.get('total').setValue((Number(form.get('quantity').value) * Number(form.get('unit_cost').value)).toFixed(3))
          })
          additionalCharge.controls.forEach(form => {
            if (form.value['is_checked']) {
             if(form.get('tax').value==tax.id){              
              let amountWithoutTax: number = Number(form.get('total').value)
              let amountWithTax :number = 0;
              amountWithTax = Number(tax.value / 100 * amountWithoutTax);
              additionalChargeTaxTotal = additionalChargeTaxTotal+amountWithTax;
              if (isValidValue(amountWithoutTax)) {                
                  tax.total = tax.total + amountWithoutTax;
                  tax.taxAmount = Number(Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
                  amountWithTax = Number(tax.value / 100 * amountWithoutTax + amountWithoutTax);
                  this.quotationTotals.subtotal_others = (Number(this.quotationTotals.subtotal_others) + Number(amountWithoutTax)).toFixed(3);
                  this.quotationTotals.subtotal = (Number(this.quotationTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
                  this.quotationTotals.total = (Number(this.quotationTotals.total) + Number(amountWithTax)).toFixed(3);
                }
             }
            }
          })
        this.quotationTotals.taxTotal = (Number(this.quotationTotals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
      });
      this.calculateTotals();
    }

  }

  calculateTotals() {
    const form = this.truckFormGroup;
    const discountAmount = form.get('discount_value').value;
    const discountAfterTaxAmount = form.get('discount_value_after_tax').value;
    const freightAmountAfterTax = Number(this.quotationTotals.total)

    if (isValidValue(discountAmount)) {
      this.quotationTotals.discountTotal = form.get('discount_choice').value == '0' ? (Number(discountAmount) / 100 * Number(this.quotationTotals.subtotal)).toFixed(3) : discountAmount;
    } else {
      this.quotationTotals.discountTotal = 0;
    }

    if (isValidValue(discountAfterTaxAmount)) {
      this.quotationTotals.discountAfterTaxTotal = form.get('discount_choice_after_tax').value == 0 ? (Number(discountAfterTaxAmount) / 100 * (Number(freightAmountAfterTax) - Number(this.quotationTotals.discountTotal))).toFixed(3) : discountAfterTaxAmount;
    } else {
      this.quotationTotals.discountAfterTaxTotal = 0;
    }
    this.quotationTotals.total = (Number(this.quotationTotals.subtotal) - Number(this.quotationTotals.discountTotal) + Number(this.quotationTotals.taxTotal) - Number(this.quotationTotals.discountAfterTaxTotal)).toFixed(3);
    this.roundOffTotalAmount();
  }

  roundOffTotalAmount() {
    if (this.truckFormGroup.get('is_roundoff').value) {
      const roundOffAmounts = roundOffToCeilFloor(this.quotationTotals.total);
      this.quotationTotals.roundOffAmount = roundOffAmounts.roundOffAmount;
      this.quotationTotals.total = roundOffAmounts.roundedOffAmount;
    } else {
      this.quotationTotals.roundOffAmount = 0;
    }
    this.quotationFinalValues.emit(this.quotationTotals)
  }

  onRoundOffEvent($event) {
    if ($event.checked) {
      const roundOffAmounts = roundOffToCeilFloor(this.quotationTotals.total);
      this.quotationTotals.roundOffAmount = roundOffAmounts.roundOffAmount;
      this.quotationTotals.total = roundOffAmounts.roundedOffAmount;
    } else {
      this.quotationTotals.roundOffAmount = 0;
      this.onCalculationsChange();
    }
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

  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.quotationTotals.taxes = result.result['tax'];
      this.taxOptions = result.result['tax'];
    })
  }

  getPartyTCandSignature(id) {
    this._quotationV2Service.getPartyTCandSignature(id).subscribe(resp => {
      if (resp['result'].signature) {
        this.truckFormGroup.get('signature').setValue(resp['result'].signature.id)
        this.initialValues.signature = { value: resp['result'].signature.id, label: resp['result'].signature.name };
      }
      if (resp['result'].tnc) {
        this.truckFormGroup.get('terms_and_condition').setValue(resp['result'].tnc.id)
        this.initialValues.termsAndCondition = { value: resp['result'].tnc.id, label: resp['result'].tnc.name };
      }
    })
  }

  getRouteList(customer) {
    this._newTripService.getAllRoutes(customer).subscribe(resp => {
      this.routeCodeList = resp['result']
    });
  }

  patchQuotationTemplateTruck(data) {
    this.patchAdditionalCharge(data)
    data = data['loose_cargo'];
    if (data.terms_and_condition) {
      this.initialValues.termsAndCondition = { label: data.terms_and_condition.name, value: '' };
      data.terms_and_condition = data.terms_and_condition.id
    }
    if (data.signature) {
      this.initialValues.signature = { label: data.signature.name, value: '' };
      data.signature = data.signature.id
    }
    if (data.status) {
      this.initialValues.clientApprovalStatus = { label: data.status.label, value: '' };
      data.status = data.status ? data.status.index : null
    }
    this.initialValues.route_code = { label: data['route_code'], value: '' };
    this.truckFormGroup.patchValue(data)
    this.clientFreightData = data.freights
    this.isEdit = true;
    setTimeout(() => {
      this.customerId.next(this.quotationForm.get('customer').value)
      this.routeDestinations.next(data['path'])
      this.routeId.next(data['route_code']);
      this.onCalculationsChange();
    }, 1500);

  }

  onChangeAdditionalChargeCheckBox(form: FormGroup) {
    let formValue = form.value    
    if (formValue['is_checked']) {
      // this.partyRateCardValues['additional_charges'][formValue.name.id] = formValue['rate']
      setUnsetValidators(form, 'unit_cost', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'quantity', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.required])
    } else {
      // delete this.partyRateCardValues['additional_charges'][formValue.name.id];
      form.get('unit_cost').setValue(form.get('rate').value)
      form.get('quantity').setValue('0.000')
      setUnsetValidators(form, 'unit_cost', [Validators.nullValidator])
      setUnsetValidators(form, 'quantity', [Validators.nullValidator])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.nullValidator])
    }
    // this.partyPrefilledRateCardValues.emit(this.partyRateCardValues);
    this.onCalculationsChange();
  }

  onChangeAdditionalCharge() {
    this.onCalculationsChange();
  }

  addCharges() {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        data : this.quotationForm.get('vehicle_category').value,
        sales: true,
        isEdit:false,
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
        const additionalCharge = (this.truckFormGroup.controls['additional_charge']) as FormArray
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
  patchAdditionalCharge(data) {
    let params = {
      vehicle_category: data['vehicle_category']
    }
    this._rateCard.getCustomerAdditionalCharge(data['customer'], params).subscribe((response: any) => {      
      this.additionalCharges = response.result;
      if (data[this.formType]['additional_charge'].length > 0) {
        this.additionalCharges.forEach(charges => {
          data[this.formType]['additional_charge'].forEach(selectedCharges => {
            if (selectedCharges['name'].id === charges['name'].id) {
              charges['is_checked'] = true;
              charges['quantity'] = selectedCharges['quantity']
              charges['unit_cost'] = selectedCharges['unit_cost']
              charges['unit_of_measurement'] = selectedCharges['unit_of_measurement'];
              charges['tax'] = selectedCharges['tax'];
              charges['total'] = selectedCharges['total'];
            }
          });
        })
      } 
      this.buildAdditionalChargesInEdit(this.additionalCharges)
    });
  }

  buildAdditionalChargesInEdit(items = []) {
    this.initialValues.unit=[];
    this.initialValues.additionalTax = [];
    let additionalCharge = (this.truckFormGroup.controls['additional_charge']) as FormArray
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
  addMoreAdditionalChargeItem() {
    const additionalCharge = (this.truckFormGroup.controls['additional_charge']) as FormArray
    additionalCharge.push(this.getAdditionalChargeFormGroup({}));
    this.initialValues.unit.push();
    this.initialValues.additionalTax.push(getBlankOption());


  }
  getAdditionalChargeFormGroup(item) {        
    return this._fb.group({
      is_checked: [item?.is_checked ? true : false],
      name: [item.name],
      unit_of_measurement: [item.unit_of_measurement],
      quantity: [item.quantity || 0],
      unit_cost: [ item.rate|| 0],
      rate: [item.rate || 0],
      total: 0,
      tax:[item.tax?.id]
    })
  }

  buildAdditionalCharges(items = []) {
    this.initialValues.unit=[];
    this.initialValues.additionalTax = [];
    let additionalCharge = (this.truckFormGroup.controls['additional_charge']) as FormArray
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
  getAdditionalChargeFormGroupInEdit(item) {
    return this._fb.group({
      is_checked: [item?.is_checked ? true : false],
      name: [item.name],
      unit_of_measurement: [item.unit_of_measurement],
      quantity: [item.quantity || 0],
      unit_cost: [ item?.is_checked ? item.unit_cost : item.rate],
      rate: [item.rate || 0],
      total: [item.total ||0],
      tax:[item.tax.id]
    })
  }

  getAdditionalCharge() {
    let params = {
      vehicle_category: this.quotationForm.get('vehicle_category').value
    }
    if(this.quotationForm.get('customer').value)
    this._rateCard.getCustomerAdditionalCharge(this.quotationForm.get('customer').value, params).subscribe((response: any) => {
      this.additionalCharges = response.result;
      this.buildAdditionalCharges(this.additionalCharges)
    });
  }

  getUnitsOfMeasurement() {
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.unitOfMeasurementList = response.result['item-unit'];
    });
  }
}

