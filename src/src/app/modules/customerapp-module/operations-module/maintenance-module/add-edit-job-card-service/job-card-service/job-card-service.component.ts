import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getNonTaxableOption, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { MaintenanceService } from '../../operations-maintenance.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { Subject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';

@Component({
  selector: 'app-job-card-service',
  templateUrl: './job-card-service.component.html',
  styleUrls: ['./job-card-service.component.scss']
})
export class JobCardServiceComponent implements OnInit {
  addServiceForm: UntypedFormGroup;
  serviceEditData: any
   initialValues = {
    serviceType: [],
    tax: getNonTaxableOption(),
  }
  addServiceTotal: any = {
    taxes: [],
  };
  companyRegistered: boolean = true;
  taxOptions = [];
  defaultTax = new ValidationConstants().defaultTax;
  currency_type: any;
  terminology: any;
  isTax = true;
  maintenancePermission = Permission.maintenance.toString().split(',');
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  activeEmpList = [];
  preFixUrl = getPrefix();
  isServiceListOpen: boolean = false;
  jobCardId='';
  jobCardServiceId='';
  vehicleId='';
  paymentEditData=new Subject();
  isTotalGreaterThenZero=true;
  constructor(private _fb: UntypedFormBuilder,
    private _taxService: TaxModuleServiceService, private _router: ActivatedRoute,private route:Router,private _scrollToTop:ScrollToTop,
    private currency: CurrencyService, private _maintenanceService: MaintenanceService, private _analytics: AnalyticsService,private apiHandler:ApiHandlerService,
    private _terminologiesService: TerminologiesService, private _tax: TaxService,) {
    this.currency_type = this.currency.getCurrency();
    this.terminology = this._terminologiesService.terminologie;
    this.isTax = this._tax.getTax();
  }
  
  ngOnInit(): void {
    this.buildForm();
    this.getTaxDetails();
    this._router.queryParamMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('add_new_service')) {
        this.jobCardId = paramMap.get('add_new_service')
        this.vehicleId=paramMap.get('vehicleId')
      }
      if (paramMap.has('job_card_id') && paramMap.has('service_id') ) {
        this.jobCardId = paramMap.get('job_card_id');
        this.jobCardServiceId =paramMap.get('service_id');
        this.vehicleId=paramMap.get('vehicleId')
        this._maintenanceService.getJobCardNewService(this.jobCardServiceId).subscribe(resp => {
          this.serviceEditData = resp.result;
          setTimeout(() => {
            this.patchService();
          }, 1000);
         
        })
      }
    });
  }

  saveService() {
    let form = this.addServiceForm
    this.isTotalGreaterThenZero =Number(form.value['total_amount']) >0 ?true:false
    if (form.valid && this.isTotalGreaterThenZero) {
      if (form.get('payment_mode').value === 'paid_By_Driver') {
        form.value['payment_mode'] = null
      }
      else {
        form.value['paid_employee'] = null
      }
      if (form.value['payment_type'] == 2) {
        form.value['payment_mode'] = null
      }
      form.value['jobcard'] = this.jobCardId
      form.value['bill_date'] = changeDateToServerFormat(form.value['bill_date']);
      form.value['due_date'] = changeDateToServerFormat(form.value['due_date']);
      form.value['service_date'] = changeDateToServerFormat(form.value['service_date']);
      if (this.jobCardServiceId) {
        this.apiHandler.handleRequest(this._maintenanceService.putJobCardNewService(this.serviceEditData.id, form.value),'Service updated successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.JOBCARDSERVICE);
          this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.JOBCARD);
          this.route.navigate([this.preFixUrl+'/expense/maintenance/view/',this.jobCardId])
              },
              error: (err) => {
                console.log(err)

              },
          }
        )
      } else {
        this.apiHandler.handleRequest(this._maintenanceService.postJobCardNewService(form.value),'Service added successfully!').subscribe(
          {
            next: (resp) => {
              this._analytics.addEvent(this.analyticsType.CREATED, this.analyticsScreen.JOBCARDSERVICE);
              this._analytics.addEvent(this.analyticsType.UPDATED, this.analyticsScreen.JOBCARD);
              this.route.navigate([this.preFixUrl+'/expense/maintenance/view/',this.jobCardId])
              },
              error: (err) => {
                console.log(err)

              },
          }
        )
        
      }

    } else {
      this.setAsTouched(form)
      console.log(form)
      this._scrollToTop.scrollToTop();
    }

  }

  cancel(){
    this.route.navigate([this.preFixUrl+'/expense/maintenance/view/',this.jobCardId])
  }

  serviceDetails(e) {
    if ('id' in e.data) {
      this.initialValues.serviceType.push({ label: e.data.service_name })
      let serviceDetials = {
        service_type: e.data.id,
        service_amount: Number(e.data.service_amount),
        labour_amount: Number(e.data.labour_amount),
        total_amount: Number(e.data.service_amount) + Number(e.data.labour_amount)
      }
      this.addServiceItem([serviceDetials]);
      this.onCalculationChange();
    }
  }

  buildForm() {
    this.addServiceForm = this._fb.group({
      services: this._fb.array([]),
      jobcard: '',
      vendor: [null],
      service_total: 0.00,
      labour_total: 0.00,
      tyre_change_total: 0.00,
      subtotal: 0.00,
      adjustment_before_tax: 0.00,
      adjustment_after_tax: 0.00,
      adjustment_before_tax_amount: 0.00,
      is_roundoff: true,
      roundoff_amount: 0.00,
      total_amount: 0.00,
      payment_type: -1,
      bill_number: '',
      discount: 0,
      discount_choice: [0],
      discount_choice_value: 0,
      service_date:new Date(dateWithTimeZone()),
      payment_mode: null,
      paid_employee: [null],
      bill_date:new Date(dateWithTimeZone()),
      due_date:new Date(dateWithTimeZone()),
      notes: '',
      is_tax_included: false,
      tax: this.defaultTax
    })
  }


  taxValueChange() {
    const taxId = this.addServiceForm.controls['tax'].value;
    const taxDetails = this.taxOptions.filter(item => item.id == taxId)[0];
    this.initialValues.tax = { label: taxDetails.label, value: '' };
  }



  removeService(i) {
    const servicearray = this.addServiceForm.controls['services'] as UntypedFormArray;
    servicearray.removeAt(i);
    this.initialValues.serviceType.splice(i, 1);
    this.onCalculationChange();
  }


  addServiceItem(service: Array<any>) {
    if (service.length == 0) {
      this.addServiceItem([{}])
    }
    const servicearray = this.addServiceForm.controls['services'] as UntypedFormArray;
    service.forEach((item) => {
      const arrayItem = this.buildService(item);
      servicearray.push(arrayItem);
    });
  }

  buildService(item) {
    return this._fb.group({
      id: [item.id || null],
      service_type: [item.service_type || null],
      service_amount: [item.service_amount || 0.00],
      labour_amount: [item.labour_amount || 0.00],
      total_amount: [item.total_amount || 0.00, [Validators.min(0.9999)]]
    });
  }


  getTaxDetails() {
    this._taxService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
      this.addServiceTotal.taxes = result.result['tax'];
      this.companyRegistered = result.result['registration_status'];
    })
  }

  serviceTotalCalculation(item: FormGroup) {
    const serviceAmount = Number(item.get('service_amount').value);
    const labourAmount = Number(item.get('labour_amount').value);
    let totalAmount = (serviceAmount + labourAmount).toFixed(3);
    item.get('total_amount').setValue(totalAmount);
    this.onCalculationChange();
  }



  setUnsetValidators(formName: FormGroup, formControlName: string, validatorsList: Array<any>) {
    formName.get(formControlName).setValidators(validatorsList);
    formName.get(formControlName).updateValueAndValidity();
  }

  onRoundOffEvent(e) {
    this.onCalculationChange()
  }

  onCalculationChange() {
    const services = this.addServiceForm.controls['services'] as UntypedFormArray;
    let totalServiceAmount = 0;
    let totalLabourAmount = 0;
    let subTotal = 0;
    let adjustmentAfterTax = 0;
    let discountTotal = 0
    let form = this.addServiceForm;
    services.controls.forEach((service, index) => {
      let serviceAmount = Number(service.get('service_amount').value);
      let labourAmount = Number(service.get('labour_amount').value);
      totalServiceAmount = Number(serviceAmount) + Number(totalServiceAmount)
      totalLabourAmount = Number(labourAmount) + Number(totalLabourAmount)
      if (form.get('is_tax_included').value == true) {
        this.addServiceTotal.taxes.forEach((tax) => {
          if (form.get('tax').value == tax.id) {
            form.get('service_total').setValue((Number(totalServiceAmount) / (((Number(tax.value)) + 100) / 100)).toFixed(3))
            form.get('labour_total').setValue((Number(totalLabourAmount) / (((Number(tax.value)) + 100) / 100)).toFixed(3))
            subTotal = Number(form.get('service_total').value) + Number(form.get('labour_total').value),
              form.get('subtotal').setValue(subTotal.toFixed(3))
          }
        })
      }
    });

    if (form.get('is_tax_included').value == false) {
      form.get('service_total').setValue(totalServiceAmount.toFixed(3))
      form.get('labour_total').setValue(totalLabourAmount.toFixed(3));
      subTotal = Number(totalServiceAmount) + Number(totalLabourAmount)
      form.get('subtotal').setValue(subTotal.toFixed(3));
    }

    let amountWithoutTax = 0
    let totalAmountWithTax = 0

    const discountAmount = form.get('discount').value;
    if (isValidValue(discountAmount)) {
      discountTotal =
        form.get('discount_choice').value == 0
          ? (discountAmount / 100 * subTotal).toFixed(3)
          : discountAmount;
    } else {
      discountTotal = 0;
    }
    form.get('discount_choice_value').setValue(discountTotal)

    amountWithoutTax = subTotal - Number(form.get('discount_choice_value').value);
    this.addServiceTotal.taxes.forEach((tax) => {
      tax.total = 0;
      tax.taxAmount = 0;
      let rate = amountWithoutTax;
      if (form.get('tax').value == tax.id) {
          tax.total = (Number(amountWithoutTax)).toFixed(3);
          tax.taxAmount = (Number(((rate * Number(tax.value)) / (100)))).toFixed(3);
          totalAmountWithTax = Number(amountWithoutTax) + Number(tax.taxAmount)
      }
    });
    adjustmentAfterTax = Number(totalAmountWithTax) + Number(form.get('adjustment_after_tax').value);
    if (form.get('is_roundoff').value) {
      const roundOffAmounts = roundOffToCeilFloor(adjustmentAfterTax);
      form.get('roundoff_amount').setValue(Number(roundOffAmounts.roundOffAmount).toFixed(3));
      form.get('total_amount').setValue(Number(roundOffAmounts.roundedOffAmount).toFixed(3));
    } else {
      form.get('roundoff_amount').setValue(Number(0).toFixed(3));
      form.get('total_amount').setValue(Number(adjustmentAfterTax).toFixed(3));
    }

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

  patchService() {
    this.patchTax();
    this.addServiceForm.patchValue(this.serviceEditData);
    setTimeout(() => {
      this.paymentEditData.next(cloneDeep(this.serviceEditData))
    }, 10);
    if (this.serviceEditData['services'].length) {
      const services = this.addServiceForm.controls['services'] as UntypedFormArray;
      services.controls = [];
      this.initialValues.serviceType = [];
      this.serviceEditData['services'].forEach(serviceData => {
        this.patchAddService(serviceData);
      });
      this.onCalculationChange();
    }
  }

  patchTax() {
    this.initialValues.tax = { label: this.serviceEditData.tax.label, value: '' };
    this.serviceEditData.tax = this.serviceEditData.tax.id
  }

  patchAddService(data) {
    this.initialValues.serviceType.push({ label: data.service_type.label })
    let serviceDetials = {
      service_type: data.service_type.id,
      service_amount: Number(data.service_amount),
      labour_amount: Number(data.labour_amount),
      total_amount: Number(data.total_amount)
    }
    this.addServiceItem([serviceDetials]);
    this.onCalculationChange();
  }

}
