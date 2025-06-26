import {  AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ToolTipInfo } from '../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { Subject } from 'rxjs/internal/Subject';
import { cloneDeep } from 'lodash';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { getBlankOption, getNonTaxableOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { QuotationConstants } from '../../constant';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2DataService } from '../../../new-trip-v2/new-trip-v2-dataservice';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-quotation-template-truck',
  templateUrl: './quotation-template-truck.component.html',
  styleUrls: ['./quotation-template-truck.component.scss']
})
export class QuotationTemplateTruckComponent implements OnInit, OnDestroy,AfterViewInit {
  @Input() quotationForm: FormGroup;
  @Input() isFormValid = new Subject();
  @Input() quotationDetails?: any
  truckFormGroup: FormGroup;
  quotationClientFreight: FormGroup
  otherCharges: FormGroup
  routeToolTip: ToolTipInfo;
  T_AND_C_Tooltip: ToolTipInfo;
  signatureToolTip: ToolTipInfo;
  routeCodeList = [];
  deFaultRouteCodeList = [];
  momentType=0

  initialValues = {
    tax: {},
    route_code: {},
    clientApprovalStatus: {},
    signature: {},
    termsAndCondition: {},

  }
  isAllFormValid = {
    clientFright: true,
    multipleDestination: true,

  }
  @Output() quotationFinalValues = new EventEmitter<any>();
  materialFreightEditDetails = new BehaviorSubject(null);
  quotationTotals: any = {
    subtotal: 0,
    subtotal_freights: 0.0,
    subtotal_others: 0.0,
    roundOffAmount: 0,
    total: 0,
    taxes: [],
    balance: 0.0
  };
  constantsTripV2 = new NewTripV2Constants();
  taxOption = getNonTaxableOption();
  quotationApprovalStatus = new QuotationConstants().quotationApprovalStatus;
  ismultipleDestinationFormValid = new Subject();
  isFormValidclientFright= new Subject();
  routeId = new Subject();
  routeDestinations = new Subject();

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
  isFreightVaild=true;
  isOtherChargesValid=true;

  constructor(private _fb: FormBuilder, private currency: CurrencyService, private _terminologiesService: TerminologiesService,
    private _quotationV2Service: QuotationV2Service, private _isTax: TaxService, private _newTripService: NewTripV2Service, private _newTripDataService: NewTripV2DataService,) { }


  ngOnDestroy(): void {
    this.quotationForm.removeControl('truck');
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
    this.isFormValid.subscribe(isValid => {
      this.ismultipleDestinationFormValid.next(isValid)
      this.quotationClientFreight?.markAllAsTouched()
      this.otherCharges?.markAllAsTouched()
      this.isFreightVaild=this.quotationClientFreight?.valid;
      this.isOtherChargesValid=this.otherCharges?.valid;
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
   
    if (this.quotationDetails) {      
      this.patchQuotationTemplateTruck(cloneDeep(this.quotationDetails['truck']))
    }

    this.momentType=Number( this.quotationForm.get('type_of_movement').value)
    this.quotationForm.get('type_of_movement').valueChanges.subscribe((value)=>{
      this.momentType=Number(value)
      this.truckFormGroup.get('route_code').setValue('');
      this.initialValues.route_code = getBlankOption();
      this.routeId.next('')
      let customer = this.quotationForm.get('customer').value
      this.customerId.next(customer);
      this.routeCodeListFilter(this.momentType)
    })
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
      route_code: [''],
      path: [[]],
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
      update_route: false

    })
    this.quotationForm.addControl('truck', this.truckFormGroup);
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

  quotationFormControl(e) {
    this.quotationClientFreight = e
    this.onCalculationsChange();
    this.prepareCustomerFreight()
    this.truckFormGroup.get('is_freight_vaild').setValue(this.quotationClientFreight.valid)
  }

  onCalculationsChange() {
    const freights = this.quotationClientFreight?.get('freights') as FormArray
    const other_charges = this.otherCharges?.get('other_items') as FormArray
    this.quotationTotals.subtotal_freights = 0;
    this.quotationTotals.subtotal_others = 0;
    this.quotationTotals.subtotal = 0;
    this.quotationTotals.total = 0;
    this.quotationTotals.taxTotal = 0;
    this.totalFreightAmount = 0
    if (freights && other_charges) {
      this.quotationTotals.taxes.forEach((tax) => {
        tax.total = 0;
        tax.taxAmount = 0;
        freights.controls.forEach((freight) => {
          let rate = Number(freight.get('rate').value);
          let quantity = Number(freight.get('quantity').value);
          let amountWithoutTax = rate * quantity;
          let amountWithTax = ''
          if (this.quotationClientFreight.get('tax').value == tax.id) {
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

        });
        other_charges.controls.forEach((others) => {
          let rate = Number(others.get('unit_cost').value);
          let quantity = Number(others.get('quantity').value);
          let amountWithoutTax = rate * quantity;
          let amountWithTax = ''
          if (others.get('tax').value == tax.id) {
            if (isValidValue(amountWithoutTax)) {
              tax.total = tax.total + amountWithoutTax;
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
              amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
              this.quotationTotals.subtotal_others = (Number(this.quotationTotals.subtotal_others) + Number(amountWithoutTax)).toFixed(3);
              this.quotationTotals.subtotal = (Number(this.quotationTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
              this.quotationTotals.total = (Number(this.quotationTotals.total) + Number(amountWithTax)).toFixed(3);
            }
          }

        });
        this.quotationTotals.taxTotal = (Number(this.quotationTotals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
      });
    }

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
  itemOthersFormControl(e) {
    this.otherCharges = e;
    let otherItemWithData = [];
    this.truckFormGroup.get('is_other_charges_valid').setValue(this.otherCharges.valid)
    this.otherCharges.value['other_items'].forEach(freight => {
      if (Number(freight['total_amount'] > 0)) {
        otherItemWithData.push(freight)
      }
    });
    this.truckFormGroup.get('others').setValue({
      tax: this.otherCharges.value['tax'],
      others: otherItemWithData.length == 0 ? [this.otherCharges.value['other_items'][0]] : otherItemWithData,
    });
    this.onCalculationsChange();
  }

  prepareCustomerFreight() {
    let freights = cloneDeep(this.quotationClientFreight.value['freights']);
    let freightsWithData = [];
    freights.forEach(freight => {
      if (freight.hasOwnProperty('make')) {
        freight['make_model'] = {
          make: freight['make'],
          model: freight['model'],
        }
        delete freight['make']
        delete freight['model']
      }
    });

    freights.forEach(freight => {
      if (Number(freight['total'] > 0)) {
        freightsWithData.push(freight)
      }
    });
    this.truckFormGroup.get('freights').setValue({
      tax: this.quotationClientFreight.value['tax'],
      freights: freightsWithData.length == 0 ? [freights[0]] : freightsWithData,
      customizations: {
        fields: this.quotationClientFreight.value['freight_fields'],
        hide_pdf_empty_columns: this.quotationClientFreight.value['hide_pdf_empty_columns'],
      }
    });
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
      this.deFaultRouteCodeList = resp['result']
      this.routeCodeListFilter(this.momentType)
    });
  }

  patchQuotationTemplateTruck(data) {
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
    this.otherChargesData = data.others
    this.isEdit = true;
    setTimeout(() => {
      this.customerId.next(this.quotationForm.get('customer').value)
      this.routeDestinations.next(data['path'])
      this.routeId.next(data['route_code']);
      this.materialFreightEditDetails.next(data['materials'])
      this.onCalculationsChange();
    }, 1500);

  }

  routeCodeListFilter(momentType){    
    this.routeCodeList = this.deFaultRouteCodeList.filter(routeCode=>routeCode.category==0&& routeCode.type_of_movement==momentType)
  }

}
