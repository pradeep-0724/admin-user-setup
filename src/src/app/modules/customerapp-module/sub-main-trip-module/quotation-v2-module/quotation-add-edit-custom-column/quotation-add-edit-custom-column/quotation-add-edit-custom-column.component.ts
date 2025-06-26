import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomFieldServiceV2 } from 'src/app/modules/orgainzation-setting-module/setting-module/custom-field-v2/customfield-v2.service';
import { NewTripV2Constants } from '../../../new-trip-v2/new-trip-v2-constants/new-trip-v2-constants';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { getBlankOption, getNonTaxableOption } from 'src/app/shared-module/utilities/helper-utils';
import { cloneDeep } from 'lodash';
import { QuotationV2Service } from '../../../../api-services/trip-module-services/quotation-service/quotation-service-v2';
import { TaxService } from 'src/app/core/services/tax.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { debounceTime } from 'rxjs/operators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-quotation-add-edit-custom-column',
  templateUrl: './quotation-add-edit-custom-column.component.html',
  styleUrls: ['./quotation-add-edit-custom-column.component.scss']
})
export class QuotationAddEditCustomColumnComponent implements OnInit, AfterViewInit {
  @Output() quotationFormControl = new EventEmitter()
  @Input() isShowRefresh = false;
  @Input() isShowRedirect = false;
  @Input() isEdit = false;
  @Input() vehicleCatagory='0'
  @Input() editData
  customFieldUrl = 'quotation/cf/freight/'
  quotationCustomForm: FormGroup;
  visibleColumsList = []
  taxOptions = [];
  billingTypeList = new NewTripV2Constants().WorkOrderbillingTypeList;
  vehicleMake = [];
  vehicleModel = [];
  vehicleMakeParam: any = {};
  vehicleModelParam: any = {};
  vehicleMakeUrl = TSAPIRoutes.vehicle_make;
  vehicleModelUrl = TSAPIRoutes.vehicle_model;
  vehicleApi = TSAPIRoutes.static_options;
  vechileTypeList = [];
  addVehicle: any = {};
  initialDetails = {
    make: [],
    model: [],
    billing: [],
    specification: [],
    tax: getBlankOption()
  }
  modelList = [];
  optionList = []
  taxOption = getNonTaxableOption();
  defaultTax = new ValidationConstants().defaultTax;
  isTax = false
  prefixUrl = getPrefix();
  deFaultBillingType = {
    label: 'Jobs',
    value: '10'
  };
  currency_type:any;
  
  constructor(private _fb: FormBuilder, private _customFieldServiceV2: CustomFieldServiceV2, private _vehicleService: VehicleService,
    private _quotationV2Service: QuotationV2Service, private _isTax: TaxService,private currency: CurrencyService) { }

  ngOnInit(): void {    
    this.initialDetails.tax = this.taxOption
    this.isTax = this._isTax.getTax();
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    if (!this.isEdit) {
      this.getCustomFieldList();
    } else {
      this.visibleColumsList = this.editData.customizations.fields;
      this.quotationCustomForm.get('freight_fields').setValue(this.visibleColumsList)
      this.patchQuotationClientFreights()
    }


    this.quotationCustomForm.valueChanges.pipe(debounceTime(300)).subscribe(resp => {
      this.quotationFormControl.emit(this.quotationCustomForm)
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getVehicleMake();
      this.getVehicleTypeList();
      this.getTaxDetails();
    }, 0);
  }
  buildForm() {
    this.quotationCustomForm = this._fb.group({
      tax: [this.defaultTax],
      freights: this._fb.array([]),
      hide_pdf_empty_columns:[false],
      freight_fields: [[]]
    })
  }

  getCustomFieldList() {
    this._customFieldServiceV2.getCustomFieldList(this.customFieldUrl).subscribe(resp => {
      this.visibleColumsList = resp['result'].fields.filter(columns => columns.display <= 2);
      this.quotationCustomForm.get('freight_fields').setValue(this.visibleColumsList)
      this.quotationCustomForm.get('hide_pdf_empty_columns').setValue(resp['result']['hide_pdf_empty_columns'])
      this.buildClientFreight([{}])
    })
  }

  buildClientFreight(items = []) {
    this.initialDetails.billing = [];
    this.initialDetails.make = [];
    this.initialDetails.model = [];
    this.initialDetails.specification = [];
    this.modelList = [];
    const freights = this.quotationCustomForm.get('freights') as FormArray
    freights.controls = [];
    if (items.length > 0) {
      items.forEach(item => {
        const freightForm = this.generateFormGroup();
        freights.push(freightForm);
        this.initialDetails.billing.push(this.deFaultBillingType);
        this.initialDetails.make.push(getBlankOption());
        this.initialDetails.model.push(getBlankOption());
        this.initialDetails.specification.push(getBlankOption());
        this.modelList.push([]);
      })
    } else {
      this.addNewClientFreight()
    }
  }

  generateFormGroup() {
    let formControl = {}
    this.visibleColumsList.forEach(item => {
      if (item.key == "make_model") {
        formControl['make'] = null
        formControl['model'] = null
      } else if (item.key == "billing") {
        formControl[item.key] = this.deFaultBillingType.value
      } else {
        formControl[item.key] = this.getFieldValue(item.field_type)
      }
    })
    return this._fb.group(formControl)
  }

  getFieldValue(type) {
    if (type == 'string') return ''
    if (type == 'date') return null
    if (type == 'select_option') return null
    if (type == 'decimal') return 0.000
  }

  onCalculationsChange() {
    this.onTaxChanges()
  }

  getNewVehicle(event, form: FormGroup, index) {
    if (event) {
      this.vechileTypeList = [];
      this.initialDetails.specification[index] = { label: event.label, value: event.id }
      form.get('specification').setValue(event.id);
      this.getVehicleTypeList();
    }
  }

  addNewVehicle(event) {
    if (event) {
      this.addVehicle = {
        key: 'vehicle-type',
        label: event,
        value: 0
      };

    }
  }

  addNewVehicleMake(event) {
    this.vehicleMakeParam = {
      make_name: event
    };
  }

  getNewVehicleMake(event, form: FormGroup, index) {
    if (event) {
      this.vehicleMake = [];
      this.initialDetails.make[index] = { label: event.label, value: event.id }
      this.initialDetails.model[index] = getBlankOption();
      this._vehicleService.getVehicleMake().subscribe((response) => {
        form.get('make').setValue(event.id);
        form.get('model').setValue(null);
        this.vehicleMake = response.result;
        this.modelList[index] = []
      });
    }
  }

  addNewClientFreight() {
    const freights = this.quotationCustomForm.get('freights') as FormArray
    const freightForm = this.generateFormGroup();
    freights.push(freightForm);
    this.initialDetails.billing.push(this.deFaultBillingType);
    this.initialDetails.make.push(getBlankOption());
    this.initialDetails.model.push(getBlankOption());
    this.initialDetails.specification.push(getBlankOption());
    this.modelList.push([]);
    this.onCalculationsChange()
  }

  removeClientFreight(index) {
    const freights = this.quotationCustomForm.get('freights') as FormArray;
    freights.removeAt(index);
    this.initialDetails.billing.splice(index, 1);
    this.initialDetails.make.splice(index, 1);
    this.initialDetails.model.splice(index, 1);
    this.initialDetails.specification.splice(index, 1);
    this.modelList.splice(index, 1);
    this.onCalculationsChange()
  }

  cloneClientFreight(form: FormGroup, index) {
    this.addNewClientFreight()
    const freights = this.quotationCustomForm.get('freights') as FormArray
    freights.at(index + 1).patchValue(cloneDeep(form.value));
    let formValue = form.value
    if (formValue['make']) {
      let makeItem = [];
      this.modelList[index + 1] = cloneDeep(this.modelList[index])
      makeItem = this.vehicleMake.filter(make => make.id == formValue['make'])
      if (makeItem.length) {
        this.initialDetails.make[index + 1] = { label: makeItem[0].make_name, value: makeItem[0].id }
      }
    }
    if (formValue['model']) {
      let modelItem = [];
      this.modelList[index + 1] = cloneDeep(this.modelList[index])

      modelItem = this.modelList[index].filter(model => model.id == formValue['model'])
      if (modelItem.length) {
        this.initialDetails.model[index + 1] = { label: modelItem[0].model_name, value: modelItem[0].id }
      }
    }
    if (formValue['billing']) {
      let billingItem = [];
      billingItem = this.billingTypeList.filter(billing => billing.value == formValue['billing'])
      if (billingItem.length) {
        this.initialDetails.billing[index + 1] = { label: billingItem[0].label, value: billingItem[0].value }
      }
    }
    if (formValue['specification']) {
      let specificationItem = [];
      specificationItem = this.vechileTypeList.filter(specification => specification.id == formValue['specification'])
      if (specificationItem.length) {
        this.initialDetails.specification[index + 1] = { label: specificationItem[0].specification, value: specificationItem[0].id }
      }
    }
    this.onCalculationsChange()
  }

  addNewVehicleModel(event, form: FormGroup) {
    this.vehicleModelParam = {
      vehicle_make: form.get('make').value ? form.get('make').value : "",
      model_name: event
    };
  }

  getNewVehicleModel(event, form: FormGroup, index) {
    if (event) {
      this.vehicleModel = [];
      this.initialDetails.model[index] = { label: event.label, value: event.id }
      this._vehicleService.getVehicleModel(form.get('make').value).subscribe((response) => {
        form.get('model').setValue(event.id);
        this.modelList[index] = response.result;
      });
    }
  }

  getVehicleMake() {
    this._vehicleService.getVehicleMake().subscribe((response) => {
      this.vehicleMake = response.result;
    });
  }

  onMakeSelected(ele, index) {
    if (ele.target.value != '') {
      let freights = this.quotationCustomForm.get('freights') as FormArray;
      freights.controls[index].get('model').setValue(null);
      this.initialDetails.model[index]=getBlankOption()
      this._vehicleService.getVehicleModel(ele.target.value).subscribe((response) => {
        this.modelList[index] = response.result;
      });
    }
  }

  getVehicleTypeList() {
  this._vehicleService.getVehicleSpecifications('0,3').subscribe((response: any) => {
      this.vechileTypeList = response.result;
    });
  }

  getTaxDetails() {
    this._quotationV2Service.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
    })
  }

  onTaxChanges() {
    const freights = this.quotationCustomForm.get('freights') as FormArray
    freights.controls.forEach(freight => {
      let rate = Number(freight.get('rate').value);
      let quantity = Number(freight.get('quantity').value);
      let amountbeforeTax = rate * quantity;
      freight.get('total').setValue((amountbeforeTax).toFixed(3))
    })
  }

  dateFormatChange(index, key) {
    const form = (this.quotationCustomForm.get('freights') as FormArray).at(index) as FormGroup;
    form.get(key).setValue(changeDateToServerFormat(form.get(key).value))
    form.updateValueAndValidity();
  }

  addNewOption(event, fieldObject, form: FormGroup) {
    if (event) {
      let payLoad = { "field_id": fieldObject.id, "option": event }
      this._customFieldServiceV2.putCustomField(this.customFieldUrl + 'option/', payLoad).subscribe(resp => {
        fieldObject['option_list'].push(event)
        form.get(fieldObject.key).setValue(event)
      })

    }

  }

  refresh() {
    if(this.isEdit){
      this.visibleColumsList = this.editData.customizations.fields;
      this.quotationCustomForm.get('freight_fields').setValue(this.visibleColumsList)
      this.buildClientFreight([{}])
    }else{
      this.getCustomFieldList();
    }
   
  }

  makeUnitandUnitCostMandatory() {
    let mandatoryIndex = []
    this.quotationCustomForm.value.freights.forEach((fright, index) => {
      let makeMandatory = false;
      for (const key in fright) {
        if (Object.prototype.hasOwnProperty.call(fright, key)) {
          const element = fright[key];
          if (key != 'billing') {
            if (element) {
              if (typeof element == 'string') {
                if (element != '0.000' && element.trim()) {
                  makeMandatory = true;
                }
              }
              if (typeof element == 'number') {
                if (element > 0) {
                  makeMandatory = true;
                }
              }
            }
          }
        }
      }
      if (makeMandatory) {
        mandatoryIndex.push(index)
      }

    });
    this.quotationCustomForm.value.freights.forEach((fright, index) => {
      const form = (this.quotationCustomForm.get('freights') as FormArray).at(index) as FormGroup;
      if (mandatoryIndex.includes(index)) {
        setUnsetValidators(form, 'rate', [Validators.min(0.01)])
        setUnsetValidators(form, 'quantity', [Validators.min(0.01)])
      } else {
        setUnsetValidators(form, 'rate', [Validators.nullValidator])
        setUnsetValidators(form, 'quantity', [Validators.nullValidator])
      }
    })
  }

  patchQuotationClientFreights() {
    if (this.editData['tax']) {
      this.initialDetails.tax = this.editData['tax']
      this.quotationCustomForm.get('tax').setValue(this.editData['tax'].id)
    }
    let freightsList = []
    this.buildClientFreight(this.editData.freights)
    freightsList = this.editData.freights
    freightsList.forEach((freight, index) => {
      if (freight['billing']) {
        this.initialDetails.billing[index] = { label: freight['billing'].label, value: freight['billing'].index }
        freight['billing'] = freight['billing'].index
      }
      if (freight['specification']) {
        this.initialDetails.specification[index] = { label: freight['specification'].label, value: freight['specification'].id }
        freight['specification'] = freight['specification'].id
      }

      if (freight.hasOwnProperty('make_model')) {

        if (freight['make_model']['make']) {
          this.initialDetails.make[index] = { label: freight['make_model']['make'].name, value: freight['make_model']['make'].id }
          freight['make'] = freight['make_model']['make'].id
        }
        if (freight['make_model']['model']) {
          this.initialDetails.model[index] = { label: freight['make_model']['model'].name, value: freight['make_model']['model'].id }
          freight['model'] = freight['make_model']['model'].id
        }
        delete freight['make_model']
      }
    })
    freightsList.forEach((freight, index) => {
      const form = (this.quotationCustomForm.get('freights') as FormArray).at(index) as FormGroup;
      form.patchValue(freight)
    })
    this.getModelList();
    setTimeout(() => {
      this.quotationFormControl.emit(this.quotationCustomForm)
    }, 500);
  }

  getModelList() {
    let freightList = []
    freightList = (this.quotationCustomForm.get('freights') as FormArray).value;
    freightList.forEach((freight, index) => {
      if (freight.hasOwnProperty('make')) {
        if (freight['make']) {
          if (freight['make']) {
            this._vehicleService.getVehicleModel(freight['make']).subscribe((response) => {
              this.modelList[index] = response.result;
            });
          }
        }
      }
    })

  }




}
