import { Component, Input, OnInit } from '@angular/core';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { ToolTipInfo } from '../../../new-trip-v2/new-trip-v2-utils/new-trip-v2-utils';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { NewTripV2DataService } from '../../../new-trip-v2/new-trip-v2-dataservice';
import { addErrorClass, setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { cloneDeep } from 'lodash';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { Dialog } from '@angular/cdk/dialog';
import { TaxService } from 'src/app/core/services/tax.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { CommonService } from 'src/app/core/services/common.service';
type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
}
@Component({
  selector: 'app-work-order-template-others',
  templateUrl: './work-order-template-others.component.html',
  styleUrls: ['./work-order-template-others.component.scss']
})
export class WorkOrderTemplateOthersComponent implements OnInit {
  @Input() workOrderForm: FormGroup;
  @Input() formType = 'others';
  @Input()contactPersonList = [];
  @Input()isFormValid:Observable<boolean>
  @Input() workOrderDetails?:any
  @Input() quotationDetails:any
  unitOfMeasurementList = [];
  constantsTripV2 = new NewTripV2Constants()
  addWorkOrder: FormGroup;
  ismultipleDestinationFormValid = new Subject();
  routeId = new Subject();
  initialDetails = {
    additionalTax : [],
    unit : [],
    route_code: getBlankOption(),
  }
  isFormValidclientFright = new Subject();
  isFormValidCustomField = new Subject();
  customFieldData = new Subject()
  routeDestinations = new Subject();
  customerId = new Subject();
  routeCodeList = [];
  deFaultRouteCodeList = [];
  momentType=0;
  customfield_Info: ToolTipInfo;
  tripToolTip: ToolTipInfo;
  routeToolTip: ToolTipInfo;
  billingTypeList = new NewTripV2Constants().WorkOrderbillingTypeList;
  defaultBillingType: number = 10;
  workOrderClientFrightData: Subject<workOrderFrightDataType> = new Subject();
  isDisableBillingTypes: boolean = false;
  iscustomFieldTabError=false;
  isFreightTabError=false;
  isTax : boolean = false;
  taxOptions = [];
  isAddChargesTabError = false;
  additionalCharges = [];
  currency_type:any;
  materialFreightEditDetails  = new BehaviorSubject(null);
  constructor(
    private _fb: FormBuilder,
    private _newTripService: NewTripV2Service,
    private _newTripDataService: NewTripV2DataService,private dialog : Dialog,private _isTax : TaxService,
    private _quotationV2Service: QuotationV2Service,private _rateCard: RateCardService,private currency: CurrencyService,private _commonService:CommonService
  ) { }

  ngOnDestroy(): void {
    this.workOrderForm.removeControl(this.formType);
  }
  getUnitsOfMeasurement() {
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.unitOfMeasurementList = response.result['item-unit'];
    });
  }
  ngOnInit(): void {
    this.isTax = this._isTax.getTax();
    this.getTaxDetails();
    this.buildTripForm();
    this.getUnitsOfMeasurement();
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
      content: this.constantsTripV2.toolTipMessages.CUSTOM_FIELD_SO.CONTENT

    }
    this.tripToolTip = {
      content: this.constantsTripV2.toolTipMessages.TRIP_NUMBER.CONTENT
    }
    this.routeToolTip = {
      content: this.constantsTripV2.toolTipMessages.ROUTE.CONTENT
    }
    this.workOrderForm.addControl(this.formType, this.addWorkOrder);
    this.isFormValid.subscribe(vaild => {
      this.isAddChargesTabError = this.addWorkOrder.get('additional_charge').invalid
      this.iscustomFieldTabError = this.addWorkOrder?.get('other_details')?.invalid;
      this.isFormValidCustomField.next(this.addWorkOrder?.get('other_details')?.valid)
      this.isFreightTabError =this.addWorkOrder?.get('billing')?.invalid;
      this.isFormValidclientFright.next(this.addWorkOrder?.get('billing')?.valid)
      this.ismultipleDestinationFormValid.next(this.addWorkOrder?.get('destinations')?.valid)
      setAsTouched(this.addWorkOrder);
    });
    this.momentType=Number(this.workOrderForm.get('type_of_movement').value)
    this.workOrderForm.get('type_of_movement').valueChanges.subscribe(momentType=>{      
      this.momentType=Number(momentType)
      setTimeout(() => {
        this.addWorkOrder.get('route_code').setValue('');
        this.initialDetails.route_code = getBlankOption();
        this.routeId.next('');
        this.routeCodeListFilter(this.momentType)
        let customer = this.workOrderForm.get('customer').value;
        this.customerId.next(customer);
      }, 100);
    })
    if(this.workOrderDetails){
      this.patchOthers(cloneDeep(this.workOrderDetails[this.formType]))
    }
    else if (this.quotationDetails) {      
      this.patchDataFromQuotation(cloneDeep(this.quotationDetails['truck']))
    }else{
      this.getAdditionalCharge();
    }

    this.momentType=Number( this.workOrderForm.get('type_of_movement').value)
    this.workOrderForm.get('type_of_movement').valueChanges.subscribe((value)=>{
      this.momentType=Number(value)
      this.addWorkOrder.get('route_code').setValue('');
      this.initialDetails.route_code = getBlankOption();
      this.routeId.next('')
      this.routeCodeListFilter(this.momentType)
    })
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
      this.deFaultRouteCodeList = resp['result'];
      this.routeCodeListFilter(this.momentType)
      this.customerId.next(customer);
    });
  }

  routeSelected() {
    this.routeId.next(this.addWorkOrder.get('route_code').value)
    this.routeDestinations.next(this.routeCodeList.filter(route => route.name == this.addWorkOrder.get('route_code').value)[0].paths)
  }

  routeCodeListFilter(momentType:number){    
    this.routeCodeList = this.deFaultRouteCodeList.filter(routeCode=>routeCode.category==0 && routeCode.type_of_movement==momentType);

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
      this.workOrderClientFrightData.next({
        freight_amount: data['freights'][0]['freight_amount'],
        freight_type:data['freights'][0]['freight_type']['index'],
        rate:data['freights'][0]['rate'] ,
        total_units:data['freights'][0]['total_units'] ,
      })
      this.customFieldData.next(data['other_details'])
      this.materialFreightEditDetails.next(data['materials'])
    }, 1000);
    this.patchAdditionalCharge(this.workOrderDetails)
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
      this.workOrderClientFrightData.next({
        freight_amount: data['freights']['freights'][0]['total_before_tax'],
        freight_type:data['freights']['freights'][0]['billing']['index'],
        rate:data['freights']['freights'][0]['rate'] ,
        total_units:data['freights']['freights'][0]['quantity'] ,
      })
      this.materialFreightEditDetails.next(data['materials'])
    }, 1000);
    this.patchAdditionalCharge(this.quotationDetails);
  }

  addCharges() {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        data: this.workOrderForm.get('vehicle_category').value,
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
        this.initialDetails.unit.push(result['unit_of_measurement'])
        this.initialDetails.additionalTax.push(result['tax'])
        let form = additionalCharge.controls[additionalCharge.length - 1] as FormGroup
        form.get('is_checked').setValue(true);
        this.onChangeAdditionalChargeCheckBox(form)
      }
      dialogRefSub.unsubscribe()

    });
  }

  getAdditionalCharge() {
    let params = {
      vehicle_category: this.workOrderForm.get('vehicle_category').value
    }
    if (this.workOrderForm.get('customer').value)
      this._rateCard.getCustomerAdditionalCharge(this.workOrderForm.get('customer').value, params).subscribe((response: any) => {
        this.additionalCharges = response.result;
        this.buildAdditionalCharges(this.additionalCharges)
      });
  }

  buildAdditionalCharges(items = []) {
    this.initialDetails.unit = [];
    this.initialDetails.additionalTax = [];
    let additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
    additionalCharge.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let additional_charge = this.getAdditionalChargeFormGroup(item)
        additionalCharge.push(additional_charge)
        this.initialDetails.unit.push(item['unit_of_measurement']);
        this.initialDetails.additionalTax.push(item['tax']);
      });
    } else {
      this.addMoreAdditionalChargeItem()
    }
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

  addMoreAdditionalChargeItem() {
    const additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
    additionalCharge.push(this.getAdditionalChargeFormGroup({}));
    this.initialDetails.unit.push()
    this.initialDetails.additionalTax.push()
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
    this.onCalculationChange();
  }
  
  additionalChargeCalculations(){
    const additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray;
    additionalCharge.controls.forEach(form => {
      form.get('total').setValue((Number(form.get('quantity').value) * Number(form.get('unit_cost').value)).toFixed(3))
    })
    this.taxOptions.forEach((tax) => {
      additionalCharge.controls.forEach(form => {
        if (form.value['is_checked']) {
          if(form.value['tax']==tax.id){
            let amountWithoutTax = Number(form.get('total').value)
            let amountWithTax= Number(tax.value / 100 * amountWithoutTax)
            form.get('total').setValue(amountWithTax+amountWithoutTax);
          }
        }
      })
    })
  }

  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }

  onCalculationChange(){
    this.additionalChargeCalculations();
  }

  patchAdditionalCharge(data) {    
    let params = {
      vehicle_category: '0'
    }
    this._rateCard.getCustomerAdditionalCharge(data['customer']['id'], params).subscribe((response: any) => {
      this.additionalCharges = response.result;      
      if (data[this.formType]['additional_charge'].length > 0) {
        this.additionalCharges.forEach(charges => {
          data[this.formType]['additional_charge'].forEach(selectedCharges => {
            if (selectedCharges['name']?.id == charges['name']?.id) {
              charges['is_checked'] = true;
              charges['quantity'] = selectedCharges['quantity']
              charges['unit_cost'] = selectedCharges['unit_cost']
              charges['unit_of_measurement'] = selectedCharges['unit_of_measurement']
              charges['tax'] = selectedCharges['tax']
              charges['total'] = selectedCharges['total'];
            }
          });
        })
      }
      this.buildAdditionalChargesInEdit(this.additionalCharges)
      this.onCalculationChange();
    });
  }
  buildAdditionalChargesInEdit(items = []) {
    this.initialDetails.unit = [];
    this.initialDetails.additionalTax = [];
    let additionalCharge = (this.addWorkOrder.controls['additional_charge']) as FormArray
    additionalCharge.controls = [];
    if (items.length > 0) {
      items.forEach((item) => {
        let additional_charge = this.getAdditionalChargeFormGroupInEdit(item);
      if(item?.is_checked){
        setUnsetValidators(additional_charge, 'unit_cost', [Validators.required, Validators.min(0.1)])
        setUnsetValidators(additional_charge, 'quantity', [Validators.required, Validators.min(0.1)])
        setUnsetValidators(additional_charge, 'unit_of_measurement', [Validators.required])
      }
        additionalCharge.push(additional_charge)
        this.initialDetails.unit.push(item['unit_of_measurement']);
        this.initialDetails.additionalTax.push(item['tax']);
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
      total: 0,
      tax:[item.tax.id]
    })
  }

}
