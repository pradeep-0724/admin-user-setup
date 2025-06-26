import { CommonService } from '../../../../../../core/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormArray, Validators, AbstractControl, UntypedFormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { getNonTaxableOption, getObjectFromList, isValidValue, trimExtraSpaceBtwWords } from 'src/app/shared-module/utilities/helper-utils';
import { TripConstants } from '../../../new-trip-module/constant';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { TaxService } from 'src/app/core/services/tax.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { ErrorList } from 'src/app/core/constants/error-list';
import { changeDateToServerFormat, ValidityDateCalculator } from 'src/app/shared-module/utilities/date-utilis';
import { PrefixUrlService } from 'src/app/core/services/prefixurl.service';
import { QuotationConstants } from '../../constant';
import { QuotationService } from '../../../../api-services/trip-module-services/quotation-service/quotation-service';
import { OperationConstants, ScreenConstants, ScreenType } from 'src/app/core/constants/data-analytics.constants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { BehaviorSubject } from 'rxjs';
import { CommonLoaderService } from 'src/app/core/services/common_loader_service.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent implements OnInit, OnDestroy {
  apiError = '';
  globalFormErrorList: any = [];
  possibleErrors = new ErrorList().possibleErrors;
  errorHeaderMessage = new ErrorList().headerMessage;
  quotationForm: UntypedFormGroup;
  partyNamePopup: string = '';
  customerNameList = [];
  bankList = [];
  billingTypes = new TripConstants().billingTypes;
  showAddPartyPopup: any = { name: '', status: false };
  initialValues = {
    customer: {},
    bank: {},
    billingTypes: [],
    from: [],
    to: [],
    tax: [],
    tax2: [],
    items: [],
    placeOfSupply: {},
    validityTerm: {},
    clientApprovalStatus: {},
    payementTerms: {},
    termsAndConditions: {},
    digitalSignature: {}
  }
  vendor = false;
  showAddItemPopup: any = { name: '', status: false };
  payementTermUrl = TSAPIRoutes.quotation + 'payment-term/'
  payementTermsParms = {}
  taxOptions = [];
  companyRegistered: boolean = true;
  quotationTotals: any = {
    subtotal: 0,
    subtotal_challan: 0.0,
    subtotal_others: 0.0,
    discountTotal: 0,
    taxes: [],
    roundOffAmount: 0,
    total: 0,
    discountAfterTaxTotal: 0.00,
    balance: 0.0
  };
  defaultTax = new ValidationConstants().defaultTax;
  taxOption = getNonTaxableOption();
  itemList = [];
  materialParams = {
    name: '',
    unit: null,
    rate_per_unit: 0.00,
  };
  ItemDropdownIndex: number = -1;
  unitList = [];
  currency_type;
  placeOfSupply = [];
  isTax = true;
  disableTax = false;
  gstin = '';
  validityTerms = [];
  preFixUrl = '';
  quotationId = null;
  payementTermList = [];
  tersmAndConditions = [];
  digitalSignature = [];
  isValidityDateRequired = false;
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  screenType = ScreenType;
  terminology: any;
  fromData = [];
  toData = [];
  isFromValid = [];
  isToValid = [];
  isFromToRequired = [];
  defaultFromTo = {
    name: '',
    lng: null,
    lat: null,
  }
  isFromToInvalid = new BehaviorSubject(true);
  quotationApprovalStatus = new QuotationConstants().quotationApprovalStatus;
  isPlaceOfSupply: boolean = false;
  defaultPaymentTerm = {
    id: "be259357-4be7-424a-8cf2-5e225c37ca73",
    label: "Due on receipt",
    value: 0
  }


  constructor(private _fb: UntypedFormBuilder, private currency: CurrencyService, private _route: Router, private _activatedRoute: ActivatedRoute, private _commonService: CommonService,
    private _quotationService: QuotationService, private _isTax: TaxService, private _prefix: PrefixUrlService, private _analytics: AnalyticsService, private _terminologiesService: TerminologiesService,
    private _commonloaderservice: CommonLoaderService,
  ) { }

  ngOnDestroy(): void {
    this._commonloaderservice.getShow();
  }

  ngOnInit() {

    this.isTax = this._isTax.getTax();
    this.isPlaceOfSupply = this._isTax.isPlaceOfSupply();
    this.preFixUrl = this._prefix.getprefixUrl();
    this.terminology = this._terminologiesService.terminologie;
    this.buildForm();
    this.initialValues.payementTerms = this.defaultPaymentTerm;
    this.quotationForm.get('payment_term').setValue(this.defaultPaymentTerm.id)
    this._activatedRoute.params.subscribe((pramas) => {
      this._commonloaderservice.getHide();
      if (pramas.quotationId) {
        this.quotationId = pramas.quotationId;
        this.getFormValues();
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.QUOTATION, this.screenType.EDIT, "Navigated");
      } else {
        this._analytics.addEvent(this.analyticsType.IN, this.analyticsScreen.QUOTATION, this.screenType.ADD, "Navigated");
        this.addMoreFreightGroupItem();
        this.addMoreOthersItem();
        this._commonService.getSuggestedIds('quotation').subscribe((response) => {
          this.quotationForm.controls['quotation_no'].setValue(response.result['quotation']);
        });
      }
    })
    this.getPartyTripDetails();
    this.getBank();
    this.getTaxDetails();
    this.getStaticOptions();
    this.getMaterial();
    this.getPayementTermList();
    this.getTersmAndConditionList();
    this.getDigitalSignatureList();
    this.currency_type = this.currency.getCurrency();
    this.initialValues.clientApprovalStatus = this.quotationApprovalStatus[0];
    if (!this.isPlaceOfSupply) {
      this.addRemoveValidators(this.quotationForm, 'place_of_supply', [Validators.nullValidator])
    }
  }

  buildForm() {
    this.quotationForm = this._fb.group({
      id: [null],
      customer: ['', [Validators.required]],
      quotation_no: [''],
      quote_date: [new Date(dateWithTimeZone())],
      validity_term: [null],
      validity_date: [null],
      payment_term: [null],
      bank_account: [null],
      discount_value: [0],
      discount_choice: [0],
      discount_value_after_tax: [0.00],
      discount_choice_after_tax: [0],
      is_roundoff: [false],
      terms_and_condition: [''],
      narration: [''],
      signature: [''],
      place_of_supply: [
        '', Validators.required
      ],
      is_transaction_includes_tax: [false],
      is_transaction_under_reverse: [false],
      status: ['1'],
      item_freight: this._fb.array([]),
      item_others: this._fb.array([])

    })
  }

  clearAllItemFrieght(i) {
    const itemarray = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    itemarray.reset();
    itemarray.controls = [];
    this.fromData[i] = [];
    this.toData[i] = [];
    this.isFromToRequired[i] = [];
    this.addMoreFreightGroupItem()
    this.onCalculationsChange()
  }
  removeFreightGroupItem(i) {
    const itemarray = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.isFromValid.splice(i, 1);
    this.isFromToRequired.slice(i, 1);
    this.fromData.splice(i, 1);
    this.toData.splice(i, 1)
    this.isToValid.splice(i, 1);
    this.initialValues.tax.splice(i, 1);
    this.initialValues.billingTypes.splice(i, 1);
    this.onCalculationsChange();
  }

  removeFreightItem(pIndex, cIndex) {
    const item_freight = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    const itemarray = item_freight.controls[pIndex].get('item_freight_meta') as UntypedFormArray;
    itemarray.removeAt(cIndex);
    this.isFromValid[pIndex].splice(cIndex, 1);
    this.isFromToRequired[pIndex].slice(cIndex, 1);
    this.fromData[pIndex].slice(cIndex, 1);
    this.toData[pIndex].slice(cIndex, 1);
    this.isToValid[pIndex].splice(cIndex, 1);
    this.initialValues.tax[pIndex].splice(cIndex, 1);
    this.onCalculationsChange();
  }

  addMoreFreightItem(index) {
    const item_freight = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    const itemarray = item_freight.controls[index].get('item_freight_meta') as UntypedFormArray;
    const arrayItem = this.buildFreightItem({});
    itemarray.push(arrayItem);
    this.isFromToRequired[index].push(false);
    this.fromData[index].push(this.defaultFromTo);
    this.toData[index].push(this.defaultFromTo);
    this.isFromValid[index].push(true)
    this.isToValid[index].push(true)
    this.initialValues.tax[index].push(this.taxOption)
  }

  addMoreFreightGroupItem() {
    const itemarray = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    const arrayItem = this.buildFreightGroupItem({});
    itemarray.push(arrayItem);
    this.isFromValid.push([]);
    this.isToValid.push([]);
    this.isFromToRequired.push([]);
    this.fromData.push([]);
    this.toData.push([])
    this.initialValues.tax.push([]);
    this.initialValues.billingTypes.push(this.billingTypes[0]);
    this.addMoreFreightItem(itemarray.controls.length - 1);

  }


  addFreightGroupItem(items: any) {
    if (items.length == 0) {
      this.addFreightGroupItem([{}])
    }
    const itemarray = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    items.forEach((item, index) => {
      const arrayItem = this.buildFreightGroupItem(item);
      itemarray.push(arrayItem);
      this.isFromValid.push([]);
      this.isToValid.push([]);
      this.isFromToRequired.push([]);
      this.fromData.push([]);
      this.toData.push([]);
      this.initialValues.tax.push([]);
      this.initialValues.billingTypes.push(this.billingTypes[0]);
      this.addMoreFreightItem(index)
    });
  }

  buildFreightGroupItem(item) {
    return this._fb.group({
      id: [item.id || null],
      item_freight_meta: this._fb.array([]),
      billing_type: [item.billing_type || '1'],
    });
  }

  buildFreightItem(item) {
    return this._fb.group({
      id: [item.id || null],
      from_loc: [item.from_loc || null],
      to_loc: [item.to_loc || null],
      unit_cost: [item.unit_cost || 0.00],
      quantity: [item.quantity || 0.000],
      freight_amount_before_tax: [item.freight_amount_before_tax || 0.00],
      tax: [item.tax || this.defaultTax],
      total_amount: [item.total_amount || 0.00],
      description: [item.description || ''],
      is_discription: false
    });
  }

  clearAllOtherItems() {
    const itemarray = this.quotationForm.controls['item_others'] as UntypedFormArray;
    itemarray.reset();
    itemarray.controls = [];
    this.initialValues.items = [];
    this.addMoreOthersItem();
    this.onCalculationsChange()
  }

  removeOthersItem(i) {
    const itemarray = this.quotationForm.controls['item_others'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.initialValues.tax2.splice(i, 1);
    this.initialValues.items.splice(i, 1);
    this.onCalculationsChange();
  }

  setValidators(form, pIndex, cIndex) {
    let from = form.get('from_loc').value;
    let to = form.get('to_loc').value;
    let unit_cost = form.get('to_loc').value;
    let quantity = form.get('to_loc').value
    if (from || to || Number(unit_cost) > 0 || Number(quantity)) {
      this.isFromToRequired[pIndex][cIndex] = true;
      this.addRemoveValidators(form, 'from_loc', [Validators.required]);
      this.addRemoveValidators(form, 'to_loc', [Validators.required]);
      this.addRemoveValidators(form, 'freight_amount_before_tax', [Validators.required, Validators.min(0.01)]);
    } else {
      this.isFromToRequired[pIndex][cIndex] = false;
      this.addRemoveValidators(form, 'from_loc', [Validators.nullValidator]);
      this.addRemoveValidators(form, 'to_loc', [Validators.nullValidator]);
      this.addRemoveValidators(form, 'freight_amount_before_tax', [Validators.nullValidator]);
    }

  }

  addMoreOthersItem() {
    const itemarray = this.quotationForm.controls['item_others'] as UntypedFormArray;
    const arrayItem = this.buildOthersItem({});
    itemarray.push(arrayItem);
    this.initialValues.tax2.push(this.taxOption);
    this.initialValues.items.push({})
  }

  buildOthersItem(item) {
    return this._fb.group({
      id: [item.id || null],
      item: [item.item || null],
      unit_cost: [item.unit_cost || 0.00],
      quantity: [item.quantity || 0.00,],
      other_amount_before_tax: [item.other_amount_before_tax || 0.00],
      tax: [item.tax || this.defaultTax],
      total_amount: [item.total_amount || 0.00],
      is_discription: false,
      description: [item.description || ''],
    });
  }

  addOthersItem(items: any) {
    if (items.length == 0) {
      this.addOthersItem([{}])
    }
    const itemarray = this.quotationForm.controls['item_others'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildOthersItem(item);
      itemarray.push(arrayItem);
      this.initialValues.tax2.push(this.taxOption);
      this.initialValues.items.push({})
    });
  }

  onvendorSelected(e) {
    this._commonloaderservice.getHide();
    this._quotationService.getPartyAdressDetails(e).subscribe((response) => {
      this.initialValues.payementTerms = {};
      this.quotationForm.get('payment_term').setValue('');
      this.initialValues.payementTerms = response.result.terms
      this.quotationForm.get('payment_term').setValue(response.result.terms?.id ? response.result.terms.id : "")
      let taxDetails = response['result'].tax_details;
      if (isValidValue(response['result'].tax_details)) {
        this.gstin = response.result.tax_details.gstin;
        if (this.isPlaceOfSupply) {
          this.quotationForm.controls['place_of_supply'].setValue(taxDetails.place_of_supply)
          this.initialValues.placeOfSupply = { label: taxDetails.place_of_supply, value: '' }
        }

      }
    });
  }

  openAddPartyModal($event) {
    if ($event) {
      this.showAddPartyPopup = { name: this.partyNamePopup, status: true };
    }

  }

  addValueToPartyPopup(event) {
    if (event) {
      this.partyNamePopup = event;
    }
  }

  closePartyPopup() {
    this.showAddPartyPopup = { name: '', status: false };
  }

  addPartyToOption($event) {
    if ($event.status) {
      this.initialValues.customer = { value: $event.id, label: $event.label };
      this.quotationForm.get('customer').setValue($event.id);
      this.getPartyTripDetails();
    }

  }

  getPartyTripDetails() {
    this._quotationService.getCustomerList().subscribe(data => {
      this.customerNameList = data['result'];
    })
  }

  getStaticOptions() {
    this._quotationService.getStaticOptions('item-unit,quotation-validity-term').subscribe((response: any) => {
      this.unitList = response.result['item-unit'];
      this.validityTerms = response.result['quotation-validity-term'];
    });
  }

  getBank() {
    this._quotationService.getBankDropDownList().subscribe((response: any) => {
      this.bankList = response.result;
    });
  }

  getTersmAndConditionList() {
    this._quotationService.getTersmAndConditionList().subscribe((response: any) => {
      this.tersmAndConditions = response.result['tc_content'];
    });
  }

  addPayementTerm(event) {
    if (event) {
      const val = trimExtraSpaceBtwWords(event);
      const arrStr = val.toLowerCase().split(' ');
      const titleCaseArr: string[] = [];
      for (const str of arrStr) {
        titleCaseArr.push(str.charAt(0).toUpperCase() + str.slice(1));
      }
      const word_joined = titleCaseArr.join(' ');
      this.payementTermsParms = {
        name: word_joined
      };
    }
  }

  getPayementTerm(event) {
    if (event) {
      this.getPayementTermList();
      this.quotationForm.controls['payment_term'].setValue(event.id)
    }
  }

  getPayementTermList() {
    this._commonService.getStaticOptions('payment-term').subscribe((response) => {
      this.payementTermList = response.result['payment-term'];
    });
  }


  getTaxDetails() {
    this._quotationService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
      this.quotationTotals.taxes = result.result['tax'];
      this.placeOfSupply = result.result['pos'];
      this.companyRegistered = result.result['registration_status'];
    })
  }

  openAddItemModal($event, index) {
    if ($event) {
      this.ItemDropdownIndex = index;
      this.showAddItemPopup = { name: this.materialParams.name, status: true };
    }
  }

  addValueToMaterial($event) {
    this.materialParams = {
      name: $event,
      unit: null,
      rate_per_unit: 0.00,
    };
  }

  onMaterialSelected(event, itemExpenseControl: UntypedFormGroup, index: number) {
    this.resetOtherExceptItem(itemExpenseControl, index);
    if (event.target.value) {
      const itemSelected = getObjectFromList(event.target.value, this.itemList);
      itemExpenseControl.get('unit_cost').setValue(itemSelected.rate_per_unit);
      this.addRemoveValidators(itemExpenseControl, 'unit_cost', [Validators.required, Validators.min(0.01)])
      this.addRemoveValidators(itemExpenseControl, 'quantity', [Validators.required, Validators.min(0.01)])

    }
  }

  resetOtherExceptItem(formGroup: UntypedFormGroup, index) {
    formGroup.patchValue({ unit_cost: 0.00, total_amount: 0.00, other_amount_before_tax: 0.00 });
    this.initialValues.tax2[index] = getNonTaxableOption();
  }

  getMaterial() {
    this._quotationService.getMaterials().subscribe(data => {
      this.itemList = data.result;
    })
  }


  getDigitalSignatureList() {
    this._quotationService.getDigitalSignatureList().subscribe(data => {
      this.digitalSignature = data['result']['data']
    })
  }

  addDropDownMaterial($event) {
    if ($event.status)
      this._quotationService.getMaterials().subscribe(data => {
        this.itemList = data.result;
        if (this.ItemDropdownIndex != -1) {
          this.initialValues.items[this.ItemDropdownIndex] = { value: $event.id, label: $event.label };
          const itemarray = this.quotationForm.controls['item_others'] as UntypedFormArray;
          itemarray.at(this.ItemDropdownIndex).get('item').setValue($event.id);
          let otherForm = itemarray.at(this.ItemDropdownIndex) as UntypedFormGroup;
          this.addRemoveValidators(otherForm, 'unit_cost', [Validators.required, Validators.min(0.01)])
          this.addRemoveValidators(otherForm, 'quantity', [Validators.required, Validators.min(0.01)])
          this.ItemDropdownIndex = -1;
        }
      })
  }

  closeItemPopup() {
    this.showAddItemPopup = { name: '', status: false };
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

  roundOffTotalAmount() {
    if (this.quotationForm.get('is_roundoff').value) {
      const roundOffAmounts = roundOffToCeilFloor(this.quotationTotals.total);
      this.quotationTotals.roundOffAmount = roundOffAmounts.roundOffAmount;
      this.quotationTotals.total = roundOffAmounts.roundedOffAmount;
    } else {
      this.quotationTotals.roundOffAmount = 0;
    }
  }

  calculateFeightAmount(item) {
    let quantity = Number(item.get('quantity').value);
    let unit_cost = Number(item.get('unit_cost').value);
    let freight_amount_before_tax = (quantity * unit_cost).toFixed(3);
    item.get('freight_amount_before_tax').setValue(freight_amount_before_tax);
    this.onCalculationsChange();

  }

  calculateOtherAmount(item) {
    let quantity = Number(item.get('quantity').value);
    let unit_cost = Number(item.get('unit_cost').value);
    let other_amount_before_tax = (quantity * unit_cost).toFixed(3);
    item.get('other_amount_before_tax').setValue(other_amount_before_tax);
    this.onCalculationsChange();

  }

  onCalculationsChange() {
    let item_freight = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    let item_others = this.quotationForm.controls['item_others'] as UntypedFormArray;
    this.quotationTotals.subtotal_challan = 0;
    this.quotationTotals.subtotal_others = 0;
    this.quotationTotals.subtotal = 0;
    this.quotationTotals.total = 0;
    this.quotationTotals.taxTotal = 0;
    this.quotationTotals.taxes.forEach((tax) => {
      tax.total = 0;
      tax.taxAmount = 0;
      item_freight.controls.forEach((frights, index) => {
        let frights_item = frights.get('item_freight_meta') as UntypedFormArray;
        frights_item.controls.forEach((item, index) => {
          if (item.get('tax').value == tax.id) {
            let amountWithoutTax = Number(item.get('freight_amount_before_tax').value);
            let amountWithTax;
            let rate = amountWithoutTax;
            item.get('total_amount').setValue(amountWithoutTax);
            if (isValidValue(amountWithoutTax)) {
              if (this.quotationForm.controls['is_transaction_includes_tax'].value) {
                amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
                tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
                tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
                amountWithTax = rate.toFixed(3);
              }
              else {
                tax.total = Number(tax.total) + Number(amountWithoutTax);
                tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * Number(amountWithoutTax))).toFixed(3);
                amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
                  Number(amountWithoutTax)).toFixed(3);
              }
              item.get('total_amount').setValue(amountWithTax);
              this.quotationTotals.subtotal_challan = (Number(this.quotationTotals.subtotal_challan) + Number(amountWithoutTax)).toFixed(3);
              this.quotationTotals.subtotal = (Number(this.quotationTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
              this.quotationTotals.total = (Number(this.quotationTotals.total) + Number(amountWithTax)).toFixed(3);
            }
          }

        })
      });
      item_others.controls.forEach((item, index) => {
        if (item.get('tax').value == tax.id) {
          let amountWithoutTax = Number(item.get('other_amount_before_tax').value);
          let amountWithTax;
          let rate = amountWithoutTax;
          item.get('total_amount').setValue(amountWithoutTax);
          if (isValidValue(amountWithoutTax)) {
            if (this.quotationForm.controls['is_transaction_includes_tax'].value) {
              amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
              tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
              tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
              amountWithTax = rate.toFixed(3);
            }
            else {
              tax.total = Number(tax.total) + Number(amountWithoutTax);
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * Number(amountWithoutTax))).toFixed(3);
              amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
                Number(amountWithoutTax)).toFixed(3);
            }
            item.get('total_amount').setValue(amountWithTax);
            this.quotationTotals.subtotal_others = (Number(this.quotationTotals.subtotal_others) +
              Number(amountWithoutTax)).toFixed(3);
            this.quotationTotals.subtotal = (Number(this.quotationTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
            this.quotationTotals.total = (Number(this.quotationTotals.total) + Number(amountWithTax)).toFixed(3);
            this.quotationTotals.taxTotal = (Number(this.quotationTotals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
          }
        }

      });

    });
    this.calculateTotals();
  }

  calculateTotals() {
    const form = this.quotationForm;
    const discountAmount = form.get('discount_value').value;
    const discountAfterTaxAmount = form.get('discount_value_after_tax').value;
    if (isValidValue(discountAmount)) {
      this.quotationTotals.discountTotal = form.get('discount_choice').value == '0' ? (Number(discountAmount) / 100 * Number(this.quotationTotals.subtotal)).toFixed(3) : discountAmount;
    } else {
      this.quotationTotals.discountTotal = 0;
    }
    if (isValidValue(discountAfterTaxAmount)) {
      this.quotationTotals.discountAfterTaxTotal =
        form.get('discount_choice_after_tax').value == 0
          ? (Number(discountAfterTaxAmount) /
            100 *
            (Number(this.quotationTotals.total) -
              Number(this.quotationTotals.discountTotal))).toFixed(3)
          : discountAfterTaxAmount;
    } else {
      this.quotationTotals.discountAfterTaxTotal = 0;
    }
    this.quotationTotals.total = (Number(this.quotationTotals.total) - Number(this.quotationTotals.discountTotal) - Number(this.quotationTotals.discountAfterTaxTotal)).toFixed(3);
    this.roundOffTotalAmount();
  }

  onReverseMechanismChange() {
    const isReverseMechanism = this.quotationForm.get('is_transaction_under_reverse').value
    if (isReverseMechanism) {
      this.disableTax = true;
      this.setAllTaxAsNonTaxable();
    } else {
      this.disableTax = false;
    }
    this.onCalculationsChange()

  }

  setAllTaxAsNonTaxable() {
    this.initialValues.tax2.fill(getNonTaxableOption());
    const otherItems = this.quotationForm.controls['item_others'] as UntypedFormArray;
    otherItems.controls.forEach((controls) => {
      controls.get('tax').setValue(this.defaultTax);
    });
    let item_freight = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    item_freight.controls.forEach((frights, index) => {
      this.initialValues.tax[index].fill(getNonTaxableOption());
      const item_freight_meta = frights.get('item_freight_meta') as UntypedFormArray;
      item_freight_meta.controls.forEach((controls) => {
        controls.get('tax').setValue(this.defaultTax);
      });
    })


  }

  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }

  setAsTouched(group: UntypedFormGroup | UntypedFormArray) {
    group.markAsTouched();
    for (let i in group.controls) {
      if (group.controls[i] instanceof UntypedFormControl) {
        group.controls[i].markAsTouched();
      } else {
        this.setAsTouched(group.controls[i]);
      }
    }
  }

  setFormGlobalErrors() {
    this.globalFormErrorList = [];
    let errorIds = Object.keys(this.possibleErrors);
    for (let prop of errorIds) {
      const error = this.possibleErrors[prop];
      if (error.status == true) {
        this.globalFormErrorList.push(error.message);
      }
    }
  }

  addRemoveValidators(form: AbstractControl, key: string, ValidatorsList: Array<any>) {
    form.get(key).setValidators(ValidatorsList);
    form.get(key).updateValueAndValidity();
  }

  billingTypeChange(form: UntypedFormGroup) {
    if (form.get('billing_type').value == '7') {
      let freight = form.get('item_freight_meta') as UntypedFormArray;
      freight.controls.forEach(freightForm => {
        freightForm.get('unit_cost').setValue(0.00);
        freightForm.get('quantity').setValue(0.00);
        this.addRemoveValidators(freightForm, 'unit_cost', [Validators.nullValidator]);
        this.addRemoveValidators(freightForm, 'quantity', [Validators.nullValidator]);
      });
    } else {
      let freight = form.get('item_freight_meta') as UntypedFormArray;
      freight.controls.forEach(freightForm => {
        this.addRemoveValidators(freightForm, 'unit_cost', [Validators.required, Validators.min(0.01)]);
        this.addRemoveValidators(freightForm, 'quantity', [Validators.required, Validators.min(0.01)]);
      });
    }
  }


  setValidityDate() {
    const validity_term = this.quotationForm.get('validity_term').value;
    let item = getObjectFromList(validity_term, this.validityTerms);
    if (item['label'] == 'Custom') {
      this.isValidityDateRequired = true;
      this.addRemoveValidators(this.quotationForm, 'validity_date', [Validators.required]);
    }
    let da = ValidityDateCalculator(new Date(dateWithTimeZone()), item.value);
    this.quotationForm.get('validity_date').setValue(da);
  }

  onValidityDateChange() {
    let item = this.validityTerms.filter((item: any) => item.label == 'Custom')[0]
    this.initialValues.validityTerm = { label: item.label, value: item.id };
    this.quotationForm.get('validity_term').setValue(item.id)
  }

  saveQuotation() {
    this._commonloaderservice.getHide();
    let form = this.quotationForm;
    this.toggleItemOtherFilled();
    this.toggleFreightFilled();
    this.prepareRequest(form);
    if (form.valid && (form.value['item_freight'].length > 0 || form.value['item_others'].length > 0)) {
      if (this.quotationId) {
        this._quotationService.putQuotation(this.quotationId, form.value).subscribe(data => {
          this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.QUOTATION)
          this._route.navigateByUrl(this.preFixUrl + "/trip/quotation/list")
        })
      } else {
        this._quotationService.postQuotation(form.value).subscribe(data => {
          this._route.navigateByUrl(this.preFixUrl + "/trip/quotation/list");
          this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.QUOTATION)
        })
      }

    } else {
      this.setAsTouched(form);
      this.setFormGlobalErrors();
      this.toggleItemOtherFilled(true);
      this.toggleFreightFilled(true);
      this.isFromToInvalid.next(false);

    }
  }

  prepareRequest(form) {
    form.get('quote_date').setValue(changeDateToServerFormat(form.get('quote_date').value));
    form.get('validity_date').setValue(changeDateToServerFormat(form.get('validity_date').value));
    let item_freight = [];
    let item_others = [];
    form.value['item_freight'].forEach(element => {
      if (element['item_freight_meta']) {
        item_freight.push(element)
      }
    });
    form.value['item_freight'] = item_freight;
    if (form.value['item_others']) {
      form.value['item_others'] = form.value['item_others'];
    } else {
      form.value['item_others'] = item_others;
    }
  }



  toggleItemOtherFilled(enable: Boolean = false) {
    const otherItems = this.quotationForm.controls['item_others'] as UntypedFormArray;
    otherItems.controls.forEach(ele => {
      if (enable) {
        ele.enable();
      } else {
        if (ele.value.item == null && ele.value.quantity == 0 && ele.value.other_amount_before_tax == 0
          && ele.value.unit_cost == 0) {
          ele.disable();
        }
      }
    });
  }


  toggleFreightFilled(enable: Boolean = false) {
    const item_freight = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    item_freight.controls.forEach(freight => {
      const otherItems = freight.get('item_freight_meta') as UntypedFormArray;
      otherItems.controls.forEach((ele, index) => {
        if (enable) {
          ele.enable();
        } else {
          if (ele.value.from_loc == null && ele.value.freight_amount_before_tax == 0 && ele.value.to_loc == null
            && ele.value.total_amount == 0) {
            ele.disable();
          }
        }
      });
    })

  }
  getFormValues() {
    this._quotationService.postQuotationDetails(this.quotationId).subscribe(resp => {
      let quotationdata = JSON.parse(JSON.stringify(resp.result));
      setTimeout(() => {
        this.patchDetails(quotationdata);
        this.patchDropDowns(resp.result)
      }, 1000);

    })
  }

  patchDetails(data) {
    data['customer'] = data['customer'].id;
    data['terms_and_condition'] = data['terms_and_condition'] ? data['terms_and_condition'].id : null;
    data['signature'] = data['signature'] ? data['signature'].id : null;
    data['status'] = data['status'].index;
    data['bank_account'] = data['bank_account'] ? data['bank_account'].id : null;
    data['payment_term'] = data['payment_term'] ? data['payment_term'].id : null;
    data['validity_term'] = data['validity_term'] ? data['validity_term'].id : null;
    this.quotationForm.patchValue(data);
    if (data['quatation_freight'].length > 0) {
      data['quatation_freight'].forEach(quotation => {
        quotation['billing_type'] = quotation['billing_type'].index;
        if (quotation['quatation_freight_meta'].length > 0) {
          quotation['quatation_freight_meta'].forEach(freight => {
            freight['from_loc'] = freight['from_loc'];
            freight['to_loc'] = freight['to_loc'];
            freight['tax'] = freight['tax'] ? freight['tax'].id : this.defaultTax;
          });
        }

      });
    }
    if (data['quatation_others'].length > 0) {
      data['quatation_others'].forEach(others => {
        others['item'] = others['item'] ? others['item'].id : null;
        others['tax'] = others['tax'] ? others['tax'].id : this.defaultTax
      });
    }
    if (data['quatation_freight'].length > 0) {
      this.addFreightGroupItem(data['quatation_freight']);
    } else {
      this.addMoreFreightGroupItem();
    }

    data['quatation_freight'].forEach((item, index) => {
      this.patchFreights(item['quatation_freight_meta'], index)
    });
    if (data['quatation_others'].length > 0) {
      this.addOthersItem(data['quatation_others'])
    } else {
      this.addOthersItem([{}])
    }


  }

  patchFreights(items, index) {
    const item_freight = this.quotationForm.controls['item_freight'] as UntypedFormArray;
    const itemarray = item_freight.controls[index].get('item_freight_meta') as UntypedFormArray;
    itemarray.controls = [];
    items.forEach((item) => {
      const arrayItem = this.buildFreightItem(item);
      itemarray.push(arrayItem);
      this.isFromValid.push(true);
      this.isToValid.push(true);
      this.initialValues.tax.push(this.taxOption)

    });
  }

  patchDropDowns(data) {
    this.initialValues.customer = { label: data['customer'].display_name, value: data['customer'] };
    this.initialValues.placeOfSupply = { label: data['place_of_supply'], value: data['place_of_supply'] };
    this.initialValues.digitalSignature = { label: data['signature'] ? data['signature'].name : '', value: data['signature'] ? data['signature'].id : null };
    this.initialValues.payementTerms = { label: data['payment_term'] ? data['payment_term'].label : '', value: data['payment_term'] ? data['payment_term'].id : null };
    this.initialValues.termsAndConditions = { label: data['terms_and_condition'] ? data['terms_and_condition'].name : '', value: data['terms_and_condition'] ? data['terms_and_condition'].id : null };
    this.initialValues.validityTerm = { label: data['validity_term'] ? data['validity_term'].label : '', value: data['validity_term'] ? data['validity_term'].id : '' };
    this.initialValues.bank = { label: data['bank_account'] ? data['bank_account'].name : '', value: data['bank_account'] ? data['bank_account'].id : '' };
    this.initialValues.clientApprovalStatus = { label: data['status'].label, value: data['status'].index };

    if (data.quatation_freight.length > 0) {
      this.initialValues.billingTypes = [];
      this.isToValid = [];
      this.isFromValid = [];
      this.isFromToRequired = []
      this.initialValues.tax = [];
      this.fromData = [];
      this.toData = [];
      data.quatation_freight.forEach((freight, pIndex) => {
        this.initialValues.billingTypes.push([]);
        this.isToValid.push([]);
        this.isFromValid.push([]);
        this.isFromToRequired.push([]);
        this.initialValues.tax.push([]);
        this.toData.push([]);
        this.fromData.push([]);
        this.initialValues.billingTypes[pIndex] = { label: freight['billing_type'].label, value: freight['billing_type'] };
        freight['quatation_freight_meta'].forEach((item, cIndex) => {
          this.isFromValid[pIndex].push([]);
          this.isToValid[pIndex].push([]);
          this.isFromToRequired[pIndex].push([]);
          this.initialValues.tax[pIndex].push([]);
          this.isFromValid[pIndex][cIndex] = true;
          this.isToValid[pIndex][cIndex] = true;
          this.isFromToRequired[pIndex][cIndex] = true;
          this.toData[pIndex][cIndex] = item.to_loc;
          this.fromData[pIndex][cIndex] = item.from_loc
          this.initialValues.tax[pIndex][cIndex] = { label: item['tax'].label, value: item['tax'].id };
        });
      });
    }

    if (data['quatation_others'].length > 0) {
      data['quatation_others'].forEach((item, Index) => {
        this.initialValues.items[Index] = { label: item['item'] ? item['item'].name : '', value: item['item'] ? item['item'].id : '' };
        this.initialValues.tax2[Index] = { label: item['tax'].label, value: item['tax'].id };
      });
    }

    setTimeout(() => {
      this.onReverseMechanismChange();
      this.onCalculationsChange();
    }, 1000);

  }

  fromAdressData(data, pIndex, cIndex, form) {
    if (data.value['name']) {
      this.setValidators(form, pIndex, cIndex)
    }
    this.isFromValid[pIndex][cIndex] = data.valid;
    if (this.isFromToRequired[pIndex][cIndex]) {
      if (data.valid) {
        form.get('from_loc').setValue(data.value);
      } else {
        form.get('from_loc').setValue('');
      }
    } else {
      form.get('from_loc').setValue(data.value)
    }

  }

  toAdressData(data, pIndex, cIndex, form) {
    if (data.value['name']) {
      this.setValidators(form, pIndex, cIndex)
    }
    this.isToValid[pIndex][cIndex] = data.valid;
    if (this.isFromToRequired[pIndex][cIndex]) {
      if (data.valid) {
        form.get('to_loc').setValue(data.value)
      } else {
        form.get('to_loc').setValue('');
      }
    } else {
      form.get('to_loc').setValue(data.value)
    }

  }
}


