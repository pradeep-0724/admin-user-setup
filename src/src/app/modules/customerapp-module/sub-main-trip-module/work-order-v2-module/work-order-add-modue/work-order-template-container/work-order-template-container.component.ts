import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TaxService } from 'src/app/core/services/tax.service';
import { RateCardService } from 'src/app/modules/customerapp-module/api-services/master-module-services/rate-card-service/rate-card.service';
import { QuotationV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/quotation-service/quotation-service-v2';
import { NewTripV2Service } from 'src/app/modules/customerapp-module/api-services/trip-module-services/trip-service/new-trip-v2.service';
import { AddAdditionalChargePopupComponent } from 'src/app/modules/customerapp-module/master-module/party-module/rate-card-module/add-additional-charge-popup/add-additional-charge-popup.component';
import { setAsTouched, setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { NewTripV2DataService } from '../../../new-trip-v2/new-trip-v2-dataservice';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { CommonService } from 'src/app/core/services/common.service';
type workOrderFrightDataType = {
  freight_amount: number | string,
  freight_type: number | string,
  rate: number | string,
  total_units: number | string,
  job_type: number | string,
  estimations:any
}
@Component({
  selector: 'app-work-order-template-container',
  templateUrl: './work-order-template-container.component.html',
  styleUrls: ['./work-order-template-container.component.scss']
})
export class WorkOrderTemplateContainerComponent implements OnInit {
  @Input() workOrderForm: FormGroup;
  @Input() formType = 'container';
  @Input() workOrderDetails?:any
  @Input() quotationDetails:any;
  @Input()isFormValid:Observable<boolean>
  @Input() routeCodeBdp?='';
  @Input() contactPersonList = [];
  @Output() selectedJobStartDate = new EventEmitter<any>();
  @Output() locationSelectedEmitter = new EventEmitter<any>();
  @Output() commonRateCardValuesEmitter = new EventEmitter<any>();
  workOrderClientFrightData: Subject<workOrderFrightDataType> = new Subject();
  materialFreightEditDetails  = new BehaviorSubject(null);
  billingTypeList =[{
    label:'Jobs',
    value:'10'
  },
  {
    label:'Containers',
    value:'11'
  }]
  isDisableBillingTypes = false
  routeCodeList = [];
  routeId = new Subject();
  customerId = new Subject();
  allFieldsValid = new Subject();
  routeDestinations = new Subject();
  isFormValidclientFright=new Subject();
  ismultipleDestinationFormValid=new Subject();
  scopeOfWork=0;
  addWorkOrder: FormGroup;
  isAddChargesTabError=false;
  isFreightTabError=false;
  additionalCharges : any[] =[];
  taxOptions = [];
  isTax=true;
  initialDetails = {
    additionalTax : [],
    unit : [],
    route_code: getBlankOption(),
    
  }
  momentType=0;
  isDisabledDestinationAdd=false;
  showBasiceContainer=true;
  defaultBillingType=10
  totalContainer=1
  deFaultRouteCodeList=[]
  currency_type:any;
  unitOfMeasurementList=[]
  customer=''

  constructor(
    private _fb:FormBuilder,
    private dialog:Dialog,
    private _quotationV2Service:QuotationV2Service,
    private _isTax:TaxService,
    private _newTripService: NewTripV2Service,
    private _newTripDataService: NewTripV2DataService,
    private _rateCard:RateCardService,
    private currency: CurrencyService,
    private _commonService:CommonService,
  ) { }

  ngOnDestroy(): void {
    this.workOrderForm.removeControl(this.formType);
  }

  ngOnInit(): void {
    this.buildWorkOrderForm();
    this.getRouteCodeList();
    this.currency_type = this.currency.getCurrency();
    this.getUnitsOfMeasurement();
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
    this.momentType=Number(this.workOrderForm.get('type_of_movement').value)
    if(this.momentType<=2){
      this.showBasiceContainer = false;
    }else{
      this.showBasiceContainer = true;
    }
    this.workOrderForm.get('type_of_movement').valueChanges.subscribe(momentType=>{
      this.momentType=Number(momentType)
      if(this.momentType<=2){
        this.showBasiceContainer = false;
      }else{
        this.showBasiceContainer = true;
      }
      setTimeout(() => {
        this.addWorkOrder.get('route_code').setValue('');
        this.initialDetails.route_code = getBlankOption();
        this.routeId.next('');
        this.routeCodeListFilter(this.momentType,this.scopeOfWork)
        let customer = this.workOrderForm.get('customer').value;
        this.customerId.next(customer);
      }, 100);
 

    })
    this.workOrderForm.get('movement_sow').valueChanges.subscribe(scopeOfWork=>{
      this.scopeOfWork=Number(scopeOfWork)
      if(this.scopeOfWork==4){
        this.isDisabledDestinationAdd=true;
      }else{
        this.isDisabledDestinationAdd=false;
      }
      this.addWorkOrder.get('route_code').setValue('');
      this.initialDetails.route_code = getBlankOption();
      this.routeId.next('')
      this.routeCodeListFilter(this.momentType,this.scopeOfWork)
    });
    this.workOrderForm.get('no_of_containers').valueChanges.subscribe(val=>{
     this.totalContainer=val
    })
    this.workOrderForm.addControl(this.formType, this.addWorkOrder);
    this.getTaxDetails();
    this.isTax = this._isTax.getTax();
    this.isFormValid.subscribe(vaild => {
      if (!vaild) {
        setAsTouched(this.addWorkOrder);
        this.isAddChargesTabError = this.addWorkOrder.get('additional_charge').invalid
        this.isFreightTabError =this.addWorkOrder?.get('billing')?.invalid;
        this.isFormValidclientFright.next(this.addWorkOrder?.get('billing')?.valid)
        this.ismultipleDestinationFormValid.next(this.addWorkOrder?.get('destinations')?.valid)
      }
    })
    if(this.workOrderDetails){  
    this.patchWorkOrderContainer(this.workOrderDetails)
    }
    else{
      this.getAdditionalCharge();
    }
    this.customer=this.workOrderForm.get('customer').value;
  }

  patchWorkOrderContainer(data){
    let customer = this.workOrderForm.get('customer').value;
    this.addWorkOrder.get('update_route').setValue(false)
    this.initialDetails.route_code={label:data[this.formType]['route_code'],value:data[this.formType]['route_code']}
    this.isDisableBillingTypes=true;
    this.patchAdditionalCharge(data)
    if(Number(data['type_of_movement'])<=2){
      setTimeout(() => {
        this.scopeOfWork=data['movement_sow']
      },100)
      this.showBasiceContainer = false;
    }else{
      this.showBasiceContainer = true;
    }
    if(Number(data['movement_sow'])==4){
      this.isDisabledDestinationAdd=true;
    }else{
      this.isDisabledDestinationAdd=false;
    }
    setTimeout(() => {
      this.customerId.next(customer);
      this.addWorkOrder.get('route_code').setValue(data[this.formType]['route_code'])
      this.routeId.next(this.addWorkOrder.get('route_code').value)
      this.workOrderClientFrightData.next({
        freight_amount: data[this.formType]['freights'][0]['freight_amount'],
        freight_type:data[this.formType]['freights'][0]['freight_type']['index'],
        rate:data[this.formType]['freights'][0]['rate'] ,
        total_units:data[this.formType]['freights'][0]['total_units'] ,
        job_type:data[this.formType]['freights'][0]['job_type'],
        estimations:data[this.formType]['freights'][0]['estimations']
      })
      this._newTripService.getAllRoutes(customer).subscribe(resp => {
        this.deFaultRouteCodeList= resp['result']
        this.routeCodeListFilter(Number(data['type_of_movement']),Number(data['movement_sow']))
      });
      this.routeDestinations.next(data[this.formType]['path']);
      this.materialFreightEditDetails.next(data[this.formType]['materials'])
    }, 1000);

  }

  buildWorkOrderForm() {
    this.addWorkOrder = this._fb.group({
      route_code: '',
      update_route: false,
      freights: [[]],
      path: [[]],
      material:[[]],
      additional_charge : this._fb.array([])
    })
  }

  getUnitsOfMeasurement() {
    this._commonService.getStaticOptions('item-unit').subscribe((response) => {
      this.unitOfMeasurementList = response.result['item-unit'];
    });
  }

  addCharges() {
    const dialogRef = this.dialog.open(AddAdditionalChargePopupComponent, {
      width: '1000px',
      maxWidth: '90%',
      data: {
        data : this.workOrderForm.get('vehicle_category').value,
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

  getRouteCodeList() {
    let customer = this.workOrderForm.get('customer').value;
    if (customer)
      this._newTripService.getAllRoutes(customer).subscribe(resp => {
        this.deFaultRouteCodeList= resp['result']
        this.routeCodeListFilter(this.momentType,this.scopeOfWork)
        this.customerId.next(customer);
        if(this.routeCodeBdp){
          this.addWorkOrder.get('route_code').setValue(this.routeCodeBdp);
          this.initialDetails.route_code = { label: this.routeCodeBdp, value: this.routeCodeBdp }
          setTimeout(() => {
           this.routeSelected()
          }, 1000);
        }
      });
  }

  routeSelected() {
    this.routeId.next(this.addWorkOrder.get('route_code').value)
    let routeInfo=this.routeCodeList.find(route => route.name == this.addWorkOrder.get('route_code').value)
    if(routeInfo){
      routeInfo.paths.forEach(path => {
        path['time']=null
      });
      this.routeDestinations.next(routeInfo.paths);
    }

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

  locationSelected(e){
    this.locationSelectedEmitter.emit(e)
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
  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }
  patchAdditionalCharge(data) {
    let params = {
      vehicle_category: this.workOrderForm.get('vehicle_category').value
    }
    let customer = this.workOrderForm.get('customer').value;
    this._rateCard.getCustomerAdditionalCharge(customer, params).subscribe((response: any) => {      
      this.additionalCharges = response.result;
      if (data[this.formType]['additional_charge'].length > 0) {
        this.additionalCharges.forEach(charges => {
          let isMatchfound : boolean = false;
          data[this.formType]['additional_charge'].forEach(selectedCharges => {
            if (selectedCharges['name'].id === charges['name'].id) {
              charges['is_checked'] = true;
              charges['quantity'] = selectedCharges['quantity']
              charges['unit_cost'] = selectedCharges['unit_cost']
              charges['unit_of_measurement'] = selectedCharges['unit_of_measurement'];
              charges['tax'] = selectedCharges['tax'];
              charges['total'] = selectedCharges['total'];
              isMatchfound = true;
            }else{
              if(!isMatchfound){
                charges['unit_cost'] = charges['rate'];
                charges['is_checked'] = false
              }
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
        if(item?.is_checked){
          setUnsetValidators(additional_charge, 'unit_cost', [Validators.required, Validators.min(0.1)])
          setUnsetValidators(additional_charge, 'quantity', [Validators.required, Validators.min(0.1)])
          setUnsetValidators(additional_charge, 'unit_of_measurement', [Validators.required])
        }
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
  getAdditionalChargeFormGroupInEdit(item) {
    return this._fb.group({
      is_checked: [item.is_checked],
      name: [item.name],
      unit_of_measurement: [item.unit_of_measurement],
      quantity: [item.quantity || 0],
      unit_cost: [ item.unit_cost|| 0],
      rate: [item.rate || 0],
      total: [item.total ||0],
      tax:[item.tax.id]
    })
  }

  dateTimeChanged(e){
    this.selectedJobStartDate.emit(e);
  } 

  routeCodeListFilter(momentType,scopeOfWork){
    this.routeCodeList = this.deFaultRouteCodeList.filter(routeCode=>routeCode.category==4&& routeCode.type_of_movement==momentType && routeCode.movement_sow==scopeOfWork )

  }

  emitCommonRateCardValues(event){
    this.commonRateCardValuesEmitter.emit(event)
  }

}
