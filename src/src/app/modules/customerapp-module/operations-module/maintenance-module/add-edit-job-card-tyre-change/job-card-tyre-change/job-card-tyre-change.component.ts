import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { OperationConstants, ScreenConstants } from 'src/app/core/constants/data-analytics.constants';
import { Permission } from 'src/app/core/constants/permissionConstants';
import { AnalyticsService } from 'src/app/core/services/analytics.service';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { TaxService } from 'src/app/core/services/tax.service';
import { TerminologiesService } from 'src/app/core/services/terminologies.service';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { RevenueService } from 'src/app/modules/customerapp-module/api-services/revenue-module-service/revenue-service/revenue.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { getBlankOption, getNonTaxableOption, getObjectFromList, isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TaxModuleServiceService } from 'src/app/tax-module/tax-module-service.service';
import { MaintenanceService } from '../../operations-maintenance.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { getPrefix } from 'src/app/core/services/prefixurl.service';
import { dateWithTimeZone } from 'src/app/core/services/time-zone.service';
import { ScrollToTop } from 'src/app/core/services/scrollToTopService.service';
import { Subject } from 'rxjs';
import { cloneDeep } from 'lodash';
import { TyreMasterAddEditService } from 'src/app/modules/customerapp-module/api-services/master-module-services/tyre-master-service/tyre-master-add-edit-service.service';
import { ApiHandlerService } from 'src/app/core/services/api-handler.service';
import { OwnVehicleReportService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/own-vehicle-report.service';
import { AssetsDetailsService } from 'src/app/modules/customerapp-module/api-services/master-module-services/assets-service/assets-details.service';

@Component({
  selector: 'app-job-card-tyre-change',
  templateUrl: './job-card-tyre-change.component.html',
  styleUrls: ['./job-card-tyre-change.component.scss']
})
export class JobCardTyreChangeComponent implements OnInit {
  addServiceForm: UntypedFormGroup;
  serviceEditData:any
  vendorList = [];
  tyreManufacturer = [];
  staticOptions = {
    threadType: [],
    tyreManufacturer: [],
  }
  modelParams = {
    name: ''
  };
  modelApi = [];
  modelList = [];
  initialValues = {
    vendor: {},
    make: [],
    model: [],
    position: [],
    serviceType: [],
    vehicleTyrePositions: [],
    paymentMode: {},
    errorMessage: {
      position: false,
      unique_no: false,
      position_no: false,
      position_selection: false
    },
    tax: getNonTaxableOption(),
    paid_employee: getBlankOption()
  }
  addServiceTotal: any = {
    taxes: [],
  };
  companyRegistered: boolean = true;
  taxOptions = [];
  defaultTax = new ValidationConstants().defaultTax;
  vendorId = '';
  paymentModeList = [];
  currency_type: any;
  vehicleMakeParam: any = {};
  manufacturerApi = TSAPIRoutes.tyre_brand; 
  terminology: any;
  isTax = true;
  maintenancePermission = Permission.maintenance.toString().split(',');
  analyticsType = OperationConstants;
  analyticsScreen = ScreenConstants;
  isVehiclePosition = true;
  defaultThreadType = '806a7278-c95d-4452-b6f8-4dd5285bec3c';
  activeEmpList = [];
  jobCardId='';
  vehicleId='';
  tyreChangeId='';
  preFixUrl =getPrefix();
  isTotalGreaterThenZero=true;
  paymentEditData=new Subject();
  tyreMasterDetails:any;
  vehcileInfo:any;
  noLayoutErr:boolean=false;
  selectedTyres:Array<{[key:string]:string}>=[];
  isAsset:boolean=false;
  constructor(private _ownVehicleReportService:OwnVehicleReportService,private apiHandler:ApiHandlerService,private _fb: UntypedFormBuilder,private _router: ActivatedRoute,private route:Router,
    private _vehicleService: VehicleService,private _scrollToTop:ScrollToTop,
    private _taxService: TaxModuleServiceService, private _revenueService: RevenueService,
    private currency: CurrencyService, private _maintenanceService: MaintenanceService, private _analytics: AnalyticsService,
    private _terminologiesService: TerminologiesService, private _tax: TaxService, private _tyreMaster:TyreMasterAddEditService,private _ownAssetService:AssetsDetailsService) {
    this.currency_type = this.currency.getCurrency();
   
    this.terminology = this._terminologiesService.terminologie;
    this.isTax = this._tax.getTax();
  }
  ngOnInit(): void {
    this.buildForm();
    this.getTaxDetails();
    this.getActiveEmpList();
    this._router.queryParamMap.subscribe((paramMap: ParamMap) => {
      this.jobCardId = paramMap.get('add_tyre_change');
      this.vehicleId = paramMap.get('vehicleId');
      this.isAsset = paramMap.get('isAsset')=='true';
      this.getVehicleInfo();
      this.getTyreMaster(this.vehicleId);
      if (paramMap.has('tyre_change_id')) {
        this.tyreChangeId =paramMap.get('tyre_change_id')
        this._maintenanceService.getJobCardNewService(this.tyreChangeId).subscribe(resp => {
        this.serviceEditData = resp.result;
        setTimeout(() => {
          this.patchService();
        }, 1000);
      })

      }else
       {
        this.getTyrePositions(this.vehicleId)
      }
    });
 
  }
  getVehicleInfo(){
    if(this.isAsset){
      this._ownAssetService.getAssetsView(this.vehicleId).subscribe(resp=>{
        this.vehcileInfo = resp['result'];
      })
    }else{
      this._ownVehicleReportService.getVehicleInfo(this.vehicleId).subscribe(resp=>{
        this.vehcileInfo = resp['result'];
       });

    }
    
  }
  onTyreClick(p,i){
    const tyreChangeArray = this.addServiceForm.get('tyre_change') as FormArray;
    const specificControl = tyreChangeArray.at(i);
    if(!!specificControl.get('position_name').value){
      delete this.selectedTyres[specificControl.get('position_name').value]
    }
    specificControl.get('position_name').setValue(p);
    this.selectedTyres[p]=i;
  }
  getTyreMaster(id){
    if(this.isAsset){
      this._ownAssetService.getAssetsTyreDetails(this.vehicleId).subscribe(resp=>{
        this.tyreMasterDetails=resp['result'];
        if(this.tyreMasterDetails?.tyres_info?.length==0){
          this.noLayoutErr=true
        }
      })
    }else{
      this._ownVehicleReportService.getVehicleTyreDetails(id).subscribe(resp=>{
        this.tyreMasterDetails=resp['result'];
        if(this.tyreMasterDetails?.tyres_info?.length==0){
          this.noLayoutErr=true
        }
      })

    }
   
    
  }

  getActiveEmpList() {
    this._revenueService.getActiveEmployeeList().subscribe((data) => {
      this.activeEmpList = data['result']
    })
  }

  
 
  saveTyreChange() {
    let form = this.addServiceForm
    this.isTotalGreaterThenZero =Number(form.value['total_amount']) >0 ?true:false
    if (form.valid && this.isTotalGreaterThenZero) {
      if (form.get('payment_mode').value === 'paid_By_Driver') {
        form.value['payment_mode']= null
      }
      else {
        form.value['paid_employee']= null
      }
      if(form.value['payment_type']==2){
        form.value['payment_mode']= null
      }
      form.value['jobcard'] = this.jobCardId
      form.value['bill_date'] = changeDateToServerFormat(form.value['bill_date']);
      form.value['due_date'] = changeDateToServerFormat(form.value['due_date']);
      form.value['service_date'] = changeDateToServerFormat(form.value['service_date']);
      let tyresArrey=form.value['tyre_change'];
      tyresArrey.forEach(c=>{
        c['installation_date']=changeDateToServerFormat(c['installation_date']);
        c['permitted_date']=changeDateToServerFormat(c['permitted_date'])
      })
      if (this.tyreChangeId) {
        this.apiHandler.handleRequest(this._maintenanceService.putJobCardNewService(this.tyreChangeId, form.value),'Tyre Change Service updated successfully!').subscribe(
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
        this.apiHandler.handleRequest( this._maintenanceService.postJobCardNewService(form.value),'Tyre Change Service added successfully!').subscribe(
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
      this.setAsTouched(form);
      this._scrollToTop.scrollToTop()
    }

  }
  createTyreMaster(): void {
    this.noLayoutErr = false;
  
    const make = this.vehcileInfo?.make_id;
    const model = this.vehcileInfo?.model_id;
    const url = `${this.preFixUrl}/onboarding/vehicle/tyremaster/add?make=${make}&model=${model}`;
  
    // Open in a new tab
    window.open(url, '_blank');
  }

  cancel(){
    this.route.navigate([this.preFixUrl+'/expense/maintenance/view/',this.jobCardId])
  }

  buildForm() {
    this.addServiceForm = this._fb.group({
      tyre_change: this._fb.array([]),
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

  removeTyreChange(i) {
    const tyreChangearray = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
    tyreChangearray.removeAt(i);
    this.modelList.splice(i, 1);
    this.modelApi.splice(i, 1);
    this.onCalculationChange();
  }

  addTyreChangeItem(tyre: Array<any>) {
    const tyreChangearray = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
    tyre.forEach((item) => {
      const arrayItem = this.buildTyreChange(item);
      tyreChangearray.push(arrayItem);
      this.modelList.push([]);
      this.modelApi.push('');
    });
  }


  buildTyreChange(item) {
    return this._fb.group({
      position_name:[
        item.position_name || '' ,[Validators.required] 
      ],
      installation_date:[
        item.installation_date || new Date(dateWithTimeZone())
      ],
      permitted_date:[
        item.permitted_date || null
      ],
      thread_depth:[
        item.thread_depth || ''
      ],
      id: [
        item.id || null
      ],
      changed_tyre: [
        item.changed_tyre || null
      ],
      present_tyre: [
        item.present_tyre || null
      ],
      model: [
        item.model || null, [Validators.required]
      ],
      position: [
        item.position || null],
      brand: [
        item.brand || null, [Validators.required]
      ],
      thread_type: [
        item.thread_type || this.defaultThreadType],
      tyre_number: [
        item.tyre_number || '', [RxwebValidators.unique(), Validators.pattern('^[a-zA-Z0-9_]*$')]
      ],
      present_unique_no: [item.present_unique_no || ""],
      position_used: [false],
      unique_no_status: [false],
      present_unique_no_status: [false],
      present_unique_no_edit: [false],
      position_selection_error: [false],
      tyre_amount: [item.tyre_amount || 0],
      labour_amount: [item.labour_amount || 0],
      total: [item.total || 0, [Validators.min(0.01)]],
    });
  }


  getTaxDetails() {
    this._taxService.getTaxDetails().subscribe(result => {
      this.taxOptions = result.result['tax'];
      this.addServiceTotal.taxes = result.result['tax'];
      this.companyRegistered = result.result['registration_status'];
    })
  }


  calculateTotalAmount(tyreChange:FormGroup){
   const tyreAmount=Number(tyreChange.get('tyre_amount').value);
   const labourAmount =Number(tyreChange.get('labour_amount').value);
   tyreChange.get('total').setValue(tyreAmount+labourAmount)
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
    const services = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
    let totalServiceAmount = 0;
    let totalLabourAmount = 0;
    let subTotal = 0;
    let adjustmentAfterTax = 0;
    let discountTotal = 0
    let form = this.addServiceForm;
    services.controls.forEach((service, index) => {
      let serviceAmount = Number(service.get('tyre_amount').value);
      let labourAmount = Number(service.get('labour_amount').value);
      totalServiceAmount = Number(serviceAmount) + Number(totalServiceAmount)
      totalLabourAmount = Number(labourAmount) + Number(totalLabourAmount)
      if (form.get('is_tax_included').value == true) {
        this.addServiceTotal.taxes.forEach((tax) => {
          if (form.get('tax').value == tax.id) {
            form.get('service_total').setValue((Number(totalServiceAmount) / (((Number(tax.value)) + 100) / 100)).toFixed(3))
            form.get('labour_total').setValue((Number(totalLabourAmount) / (((Number(tax.value)) + 100) / 100)).toFixed(3))
            subTotal = Number(form.get('service_total').value) + Number(form.get('labour_total').value);
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

  getTyrePositions(vehicleId) {
    this.addTyreChangeItem([{}]);
    this.getTyreChangeDetails();
     return
    this._vehicleService.getVehicleTyres(vehicleId).subscribe((response) => {
      this.initialValues.vehicleTyrePositions = response.result;
      this.initialValues.errorMessage.position = false;
      this.addTyreChangeItem([{}]);
      if (response.result.length == 0) {
        this.isVehiclePosition = false;
      } else {
        this.isVehiclePosition = true;

      }
    });
  }


  getTyreChangeDetails() {
    this._tyreMaster.getTyreBrand().subscribe((response) => {
      this.tyreManufacturer = response['result']
    });
  }

  onMakeChange(form, index) {
    let makeValue=this.tyreManufacturer.find(manu=>manu.name==form.get("brand").value)
    form.get('model').setValue(null);
    this.initialValues.model[index]=[];
    if(makeValue){
      this._tyreMaster.getTyreModel(makeValue.name).subscribe((response) => {
        this.modelApi[index] = this.manufacturerApi + makeValue.name + '/model/'
        this.modelList[index] = response.result;  
      });
    }
  }
  getModelListInEditFromMake(form, index){
    let makeValue=this.tyreManufacturer.find(manu=>manu.name==form.get("brand").value)
    if(makeValue){
      this._tyreMaster.getTyreModel(makeValue.name).subscribe((response) => {
        this.modelApi[index] = this.manufacturerApi + makeValue.name + '/model/'
        this.modelList[index] = response.result;  
      });
    }
  }
 
  onModelChange(form:FormGroup,index){
    const modelName=form.get('model').value;
    let model=[]
    model= this.modelList[index].filter(models=>models.name==modelName)
    if(model.length){
      form.get('labour_amount').setValue(model[0].labour_amount);
      form.get('tyre_amount').setValue(model[0].tyre_amount);
      this.calculateTotalAmount(form)
    }
    
  }


  changeUniqueNo(form) {
    let uniqueNumber = form.get('tyre_number').value;
    let tyreId = form.get('changed_tyre').value;
    if (uniqueNumber != '') {
      if (this.checkUnqueNumberUnique()) {
        this._maintenanceService.getUniqueNumber(uniqueNumber, tyreId).subscribe(data => {
          if (data.result.exists) {
            form.get('unique_no_status').setValue(true);
            this.initialValues.errorMessage.unique_no = true;
          } else {
            form.get('unique_no_status').setValue(false);
            this.initialValues.errorMessage.unique_no = false;
          }
        })
      } else {
        form.get('unique_no_status').setValue(true);
        this.initialValues.errorMessage.unique_no = true;
      }
    } else {
      form.get('unique_no_status').setValue(false);
      this.initialValues.errorMessage.unique_no = false;
    }

  }

  getNewModel(data, index, tyreChange: UntypedFormGroup) {
    if (isValidValue(data)) {
      tyreChange.get('model').setValue(data.label);
      this._tyreMaster.getTyreModel(tyreChange.get('brand').value).subscribe((response) => {
        this.modelList[index] = response.result
      });
    
    }
  }

  addNewModel($event) {
    this.modelParams = { name: $event };
  }

  checkUnqueNumberUnique() {
    let vehicleTyres = [];
    let unique = true;
    const tyre_change = this.addServiceForm.get('tyre_change') as UntypedFormArray;
    for (const items of tyre_change['controls']) {
      if (items['controls'].tyre_number.value != '' && items['controls'].tyre_number.value != null) {
        vehicleTyres.push(items['controls'].tyre_number.value)
      }
      if (items['controls'].present_unique_no.value != '' && items['controls'].present_unique_no.value != null) {
        vehicleTyres.push(items['controls'].present_unique_no.value)
      }
    }
    let valuesAlreadySeen = [];
    for (let i = 0; i < vehicleTyres.length; i++) {
      let value = vehicleTyres[i]
      if (valuesAlreadySeen.indexOf(value) !== -1) {
        unique = false
      }
      valuesAlreadySeen.push(value)
    }

    if (unique) {
      return true
    } else {
      return false
    }
  }

  onTyreSelect(tyreChange) {
    for (let i = 0; i < this.initialValues.vehicleTyrePositions.length; i++) {
      this.initialValues.vehicleTyrePositions.filter((data) => {
        if (tyreChange.get('position').value === data.id) {
          tyreChange.get('present_unique_no').setValue(data.unique_no);
          this.changeOldUniqueNo(tyreChange);
        }
      });
    }

    if (!this.checkPositionUniqeueness()) {
      tyreChange.get('position_used').setValue(true)
      this.initialValues.errorMessage.position_no = true;

    } else {
      tyreChange.get('position_used').setValue(false)
      this.initialValues.errorMessage.position_no = false;
    }
  }

  changeOldUniqueNo(tyreChange) {
    const tyreId = this.getTyreIdFromPosition(tyreChange);
    let uniqueNumber = tyreChange.get('present_unique_no').value;
    let position = tyreChange.get('position').value
    if (uniqueNumber != '') {
      if (this.checkUnqueNumberUnique()) {
        if (position) {
          this._maintenanceService.getUniqueNumber(uniqueNumber, tyreId).subscribe(data => {
            if (data.result.exists) {
              tyreChange.get('present_unique_no_status').setValue(true);
              this.initialValues.errorMessage.unique_no = true;
            } else {
              tyreChange.get('present_unique_no_status').setValue(false);
              this.initialValues.errorMessage.unique_no = false;
            }
          })
        }
      } else {
        tyreChange.get('present_unique_no_status').setValue(true);
        this.initialValues.errorMessage.unique_no = true;
      }
    } else {
      tyreChange.get('present_unique_no_status').setValue(false);
      this.initialValues.errorMessage.unique_no = false;
    }
  }

  getTyreIdFromPosition(tyreChange) {
    let position = { tyre_id: "" }
    const positionId = tyreChange.get('position').value;
    const id = tyreChange.get('id').value;
    if (id) {
      return tyreChange.get('present_tyre').value;
    } else {
      position = getObjectFromList(positionId, this.initialValues.vehicleTyrePositions);
      if (isValidValue(position)) {
        return position.tyre_id;
      } else {
        return ''
      }
    }
  }

  checkPositionUniqeueness() {
    let positionList = []
    let unique = true;
    const tyre_change = this.addServiceForm.get('tyre_change') as UntypedFormArray;
    for (const items of tyre_change['controls']) {
      if (items['controls'].position.value != ' ' && items['controls'].position.value != null) {
        let value = items['controls'].position.value.trim()
        positionList.push(value)
      }
    }
    for (let i = 0; i < positionList.length; i++) {
      for (let j = i + 1; j < positionList.length; j++) {
        if (JSON.stringify(positionList[i]) == JSON.stringify(positionList[j])) {
          unique = false;
        }
      }
    }

    if (unique) {
      return true
    } else {
      return false
    }
  }

  getNewVehicleMake(event, index, tyreChange) {
    if (event) {
      this._tyreMaster.getTyreBrand().subscribe((response) => {
        this.tyreManufacturer = response['result']
        tyreChange.get('brand').setValue(event.label);
        tyreChange.get('model').setValue(null);
        this.initialValues.model[index]=getBlankOption();
        let brandObj=this.tyreManufacturer.find(manu=>manu.name==tyreChange.get("brand").value)
        this.modelApi[index] = this.manufacturerApi +  brandObj?.name + '/model/'
        this.modelList[index] = [];
      })
    }
  }

  addNewVehicleMake(event) {
    if (event) {
      this.vehicleMakeParam = {
        key: 'tyre-manufacturer',
        name: event,
        value: 0
      };
    }
  }

  patchService() {
    this.patchTax();
    this.addServiceForm.patchValue(this.serviceEditData);
    this.serviceEditData?.tyre_change.forEach((tc,o)=>{
      if (!!tc?.position_name){
        this.selectedTyres[tc?.position_name]=o
      }
    })
    setTimeout(() => {
      this.paymentEditData.next(cloneDeep(this.serviceEditData))
    }, 100);
    if (this.serviceEditData['tyre_change'].length) {
      this._tyreMaster.getTyreBrand().subscribe((response) => {
        this.tyreManufacturer = response['result'];
        const tyre_change = this.addServiceForm.controls['tyre_change'] as UntypedFormArray;
        tyre_change.controls = [];
        this.serviceEditData['tyre_change'].forEach(tyreChangeData => {
          this.patchTyreChange(tyreChangeData)
        });
        tyre_change.controls.forEach((item, index) => {
          this.getModelListInEditFromMake(item, index);
        });
      });
    }
    setTimeout(() => {
      this.onCalculationChange();
    }, 1000);
  }


  patchTax() {
    this.initialValues.tax = { label: this.serviceEditData.tax.label, value: '' };
    this.serviceEditData.tax = this.serviceEditData.tax.id
  }

 

  patchTyreChange(data) {
    let tyreDetails = {
      changed_tyre: data.changed_tyre,
      tyre_number: data.tyre_number,
      disabled: data.disabled,
      id: data.id,
      brand: data.brand,
      position: data.position ? data.position.id : null,
      position_name:data?.position_name,
      present_tyre: data.present_tyre,
      present_unique_no: data.present_unique_no,
      thread_type: data.thread_type.id,
      total: data.total,
      tyre_amount:data.tyre_amount,
      labour_amount:data.labour_amount,
      model: data.model,
      tyre_sent_for: data.tyre_sent_for.id,
      installation_date:data?.installation_date,
      permitted_date:data?.permitted_date,
      thread_depth:data?.thread_depth
    }
    this.initialValues.make.push({ label: data.brand });
    this.initialValues.model.push({ label: data.model });
    data.position ? this.initialValues.position.push({ label: data.position.label }) : this.initialValues.position.push({ label: '' })
    this.addTyreChangeItem([tyreDetails]);
    if (false) {
      this._vehicleService.getVehicleTyres(this.serviceEditData.vehicle.id).subscribe((response) => {
        this.initialValues.vehicleTyrePositions = response.result;
        if (response.result.length == 0) {
          this.isVehiclePosition = false;
        } else {
          this.isVehiclePosition = true;
        }
      });
    }


  }



}
