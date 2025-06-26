import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { cloneDeep } from 'lodash';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { ToolTipInfo } from '../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2DataService } from '../../../new-trip-v2/new-trip-v2-dataservice';
import { addErrorClass, setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { CommonService } from 'src/app/core/services/common.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { TaxService } from 'src/app/core/services/tax.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
}
@Component({
  selector: 'app-work-order-v2-template-trailer-loose-cargo',
  templateUrl: './work-order-v2-template-trailer-loose-cargo.component.html',
  styleUrls: ['./work-order-v2-template-trailer-loose-cargo.component.scss']
})
export class WorkOrderV2TemplateTrailerLooseCargoComponent implements OnInit {
  @Input() workOrderForm: FormGroup;
  @Input() formType = 'loose_cargo';
  @Input()contactPersonList = [];
  @Input()isFormValid:Observable<boolean>
  @Input() workOrderDetails?:any
  @Input() quotationDetails:any
  materialFreightEditDetails = new BehaviorSubject(null);
  constantsTripV2 = new NewTripV2Constants()
  addWorkOrder: FormGroup;
  ismultipleDestinationFormValid = new Subject();
  routeId = new Subject();
  initialDetails = {
    route_code: getBlankOption(),
    additionalTax : [],
    unit : [],
    tax : {}
  }
  isFormValidclientFright = new Subject();
  isFormValidCustomField = new Subject();
  customFieldData = new Subject()
  routeDestinations = new Subject();
  customerId = new Subject();
  routeCodeList = [];
  customfield_Info: ToolTipInfo;
  tripToolTip: ToolTipInfo;
  routeToolTip: ToolTipInfo;
  billingTypeList = new NewTripV2Constants().WorkOrderbillingTypeList;
  defaultBillingType: number = 10;
  workOrderClientFrightData: Subject<workOrderFrightDataType> = new Subject();
  isDisableBillingTypes: boolean = false;
  iscustomFieldTabError=false;
  isFreightTabError=false;

  defaultTax = new ValidationConstants().defaultTax;
  taxOptions = [];
  unitOfMeasurementList = [];
  additionalCharges : any[] =[];
  isAddChargesTabError : boolean = false;
  isClientFreightError : boolean = false;
  isSubFormValid = new Subject();
  isTax = true;
  disableBilling : boolean = false;
  currency_type:any;
  
  constructor(
    private _fb: FormBuilder,
    private _newTripService: NewTripV2Service,
    private _newTripDataService: NewTripV2DataService,private _isTax: TaxService,
    private _rateCard: RateCardService, public dialog: Dialog,private _commonService: CommonService,private _quotationV2Service: QuotationV2Service,
    private currency: CurrencyService
  ) { }

  ngOnDestroy(): void {
    this.workOrderForm.removeControl(this.formType);
  }
  ngOnInit(): void {
    this.isTax = this._isTax.getTax();
    this.buildTripForm();
    this.currency_type = this.currency.getCurrency();
    this.getRouteCodeList();
    this._newTripDataService.newRouteName.subscribe((routeName: string) => {
      if (routeName) {
        this.addWorkOrder.get('route_code').setValue(routeName);
        this.initialDetails.route_code = { label: routeName, value: routeName };
        this.routeId.next(routeName)
      }
    });
    this._newTripDataService.newUpdateRoute.subscribe((update: boolean) => {
      if (update) {
        this.addWorkOrder.get('update_route').setValue(update);
      }
    });
    this.customfield_Info = {
      content: this.constantsTripV2.toolTipMessages.CUSTOM_FIELD.CONTENT

    }
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_NUMBER.CONTENT
    }
    this.routeToolTip = {
      content: this.constantsTripV2.toolTipMessages.ROUTE.CONTENT
    }
    this.workOrderForm.addControl(this.formType, this.addWorkOrder);
    this.isFormValid.subscribe(vaild => {
      setAsTouched(this.addWorkOrder);
      this.iscustomFieldTabError = this.addWorkOrder?.get('other_details')?.invalid;
      this.isFormValidCustomField.next(this.addWorkOrder?.get('other_details')?.valid)
      this.isFreightTabError =this.addWorkOrder?.get('billing')?.invalid;
      this.isFormValidclientFright.next(this.addWorkOrder?.get('billing')?.valid)
      this.ismultipleDestinationFormValid.next(this.addWorkOrder?.get('destinations')?.valid);
      this.isAddChargesTabError = this.addWorkOrder.get('additional_charge').invalid;
      setTimeout(() => {
        this.isClientFreightError = this.addWorkOrder?.get('materials').invalid && this.addWorkOrder?.get('materials').touched ;
      }, 500);      
      this.isSubFormValid.next(true);
    });
    this.getUnitsOfMeasurement();
    this.getTaxDetails();
    if(this.workOrderDetails){            
      this.patchOthers(cloneDeep(this.workOrderDetails[this.formType]));      
      this.patchAdditionalCharge(this.workOrderDetails);
      this.materialFreightEditDetails.next(this.workOrderDetails)
    }
    else if (this.quotationDetails) {      
      this.disableBilling = true;
      this.materialFreightEditDetails.next(this.quotationDetails)
      this.patchDataFromQuotation(cloneDeep(this.quotationDetails[this.formType]));
      this.patchAdditionalCharge(this.quotationDetails)
    }
    else{
      this.getAdditionalCharge();
    }
  }

  buildTripForm() {
    this.addWorkOrder = this._fb.group({
      route_code: '',
      update_route: false,
      freights: [[]],
      path: [[]],
      additional_charge : this._fb.array([])
    })
  }
 
  addErrorClass(controlName: AbstractControl) {
    return addErrorClass(controlName);
  }


  getRouteCodeList(){
    let customer = this.workOrderForm.get('customer').value;
    if(customer)
    this._newTripService.getAllRoutes(customer).subscribe(resp => {
      this.routeCodeList = resp['result']
      this.customerId.next(customer);
    });
  }

  routeSelected() {
    this.routeId.next(this.addWorkOrder.get('route_code').value)
    this.routeDestinations.next(this.routeCodeList.filter(route => route.name == this.addWorkOrder.get('route_code').value)[0].paths)
  }

  patchOthers(data){
    let customer = this.workOrderForm.get('customer').value;
    this.customerId.next(customer);
    this.addWorkOrder.patchValue(data)
    this.addWorkOrder.get('update_route').setValue(false)
    this.initialDetails.route_code={label:data['route_code'],value:data['route_code']}
    this.isDisableBillingTypes=true;
    setTimeout(() => {
      this.routeId.next(this.addWorkOrder.get('route_code').value)
      this.routeDestinations.next(data['path'])
      this.customFieldData.next(data['other_details'])
    }, 1000);
  }

  patchDataFromQuotation(data){
    let customer = this.workOrderForm.get('customer').value;
    this.customerId.next(customer);
    this.addWorkOrder.patchValue(data)
    this.addWorkOrder.get('update_route').setValue(false)
    this.initialDetails.route_code={label:data['route_code'],value:data['route_code']}
    this.isDisableBillingTypes=true;
    setTimeout(() => {
      this.routeId.next(this.addWorkOrder.get('route_code').value)
      this.routeDestinations.next(data['path'])
    }, 1000);
  }

  onChangeAdditionalChargeCheckBox(form: FormGroup) {
    let formValue = form.value    
    if (formValue['is_checked']) {
      setUnsetValidators(form, 'unit_cost', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'quantity', [Validators.required, Validators.min(0.1)])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.required])
    } else {
      form.get('unit_cost').setValue(form.get('rate').value)
      form.get('quantity').setValue('0.000')
      setUnsetValidators(form, 'unit_cost', [Validators.nullValidator])
      setUnsetValidators(form, 'quantity', [Validators.nullValidator])
      setUnsetValidators(form, 'unit_of_measurement', [Validators.nullValidator])
    }
    this.onCalculationsChange();
    this.onChangeAdditionalCharge();
  }

  onChangeAdditionalCharge() {
    this.onCalculationsChange();
  }

  onCalculationsChange(){
    const additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
    additionalCharge.controls.forEach(form => {
      form.get('total').setValue((Number(form.get('quantity').value) * Number(form.get('unit_cost').value)).toFixed(3))
    })
    this.taxOptions.forEach((tax)=>{
      additionalCharge.controls.forEach(form => {
        if (form.value['is_checked']) {
         if(form.get('tax').value==tax.id){              
          let amountWithoutTax: number = Number(form.get('total').value)
          let amountWithTax :number = 0;
          amountWithTax = Number(tax.value / 100 * amountWithoutTax+amountWithoutTax);
          form.get('total').setValue(amountWithTax);
         }
      }})
    })
  }


  addCharges() {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        data : this.workOrderForm.get('vehicle_category').value,
        isEdit : false,
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
        const additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
        additionalCharge.push(this.getAdditionalChargeFormGroup(result));
        this.initialDetails.unit.push(result['unit_of_measurement']);
        this.initialDetails.additionalTax.push(result['tax'])
        let form = additionalCharge.controls[additionalCharge.length - 1] as FormGroup
        form.get('is_checked').setValue(true);
        this.onChangeAdditionalChargeCheckBox(form)
      }
      dialogRefSub.unsubscribe()

    });
  }
  patchAdditionalCharge(data) {
    let params = {
      vehicle_category: this.workOrderForm.get('vehicle_category').value
    }
    let customer = this.workOrderForm.get('customer').value;
    this._rateCard.getCustomerAdditionalCharge(customer, params).subscribe((response: any) => {      
      this.additionalCharges = response.result;
      if (data[this.formType]?.['additional_charge'].length > 0) {
        this.additionalCharges.forEach(charges => {
          data[this.formType]['additional_charge'].forEach(selectedCharges => {
            if (selectedCharges['name'].id === charges['name'].id) {
              // this.partyRateCardValues['additional_charges'][selectedCharges['name'].id] = charges['rate'];
              // this.partyPrefilledRateCardValues.emit(this.partyRateCardValues)
              charges['is_checked'] = true;
              charges['quantity'] = selectedCharges['quantity']
              charges['unit_cost'] = selectedCharges['unit_cost']
              charges['unit_of_measurement'] = selectedCharges['unit_of_measurement'];
              charges['tax'] = selectedCharges['tax'];
              charges['total'] = selectedCharges['total'];
            }else{
            }
          });
        })
      } 
      this.buildAdditionalChargesInEdit(this.additionalCharges)
    });
  }

  buildAdditionalChargesInEdit(items = []) {
    this.initialDetails.unit=[];
    this.initialDetails.additionalTax = [];
    let additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
    additionalCharge.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let additional_charge = this.getAdditionalChargeFormGroupInEdit(item)
        additionalCharge.push(additional_charge)
        this.initialDetails.unit.push(item['unit_of_measurement'])
        this.initialDetails.additionalTax.push(item['tax']);
      });
    } else {
      this.addMoreAdditionalChargeItem()
    }

  }
  addMoreAdditionalChargeItem() {
    const additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
    additionalCharge.push(this.getAdditionalChargeFormGroup({}));
    this.initialDetails.unit.push();
    this.initialDetails.additionalTax.push(getBlankOption());


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
    this.initialDetails.unit=[];
    this.initialDetails.additionalTax = [];
    let additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
    additionalCharge.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let additional_charge = this.getAdditionalChargeFormGroup(item)
        additionalCharge.push(additional_charge)
        this.initialDetails.unit.push(item['unit_of_measurement'])
        this.initialDetails.additionalTax.push(item['tax']);
      });
    } else {
      this.addMoreAdditionalChargeItem()
    }

  }
  getAdditionalChargeFormGroupInEdit(item) {
    return this._fb.group({
      is_checked: [item.is_checked],
      name: [item.name],
      unit_of_measurement: [item.unit_of_measurement],
      quantity: [item.quantity || 0],
      unit_cost: [ item.is_checked ? item.unit_cost :  item.rate],
      rate: [item.rate || 0],
      total: [item.total ||0],
      tax:[item.tax.id]
    })
  }

  getAdditionalCharge() {
    let params = {
      vehicle_category: this.workOrderForm.get('vehicle_category').value
    }
    if(this.workOrderForm.get('customer').value)
    this._rateCard.getCustomerAdditionalCharge(this.workOrderForm.get('customer').value, params).subscribe((response: any) => {
      this.additionalCharges = response.result;
      this.buildAdditionalCharges(this.additionalCharges)
    });
  }

  getUnitsOfMeasurement() {
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.unitOfMeasurementList = response.result['item-unit'];
    });
  }
  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }
  materailsFormValue(e){

  }
}

