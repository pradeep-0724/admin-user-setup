import { Component, OnInit, Output,EventEmitter,Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray ,UntypedFormControl,AbstractControl} from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { isValidValue } from 'src/app/shared-module/utilities/helper-utils';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { OperationsActivityService } from 'src/app/modules/customerapp-module/api-services/operation-module-service/operations-activity.service';
import { BehaviorSubject } from 'rxjs';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';
import { ValidationConstants } from 'src/app/core/constants/constant';


@Component({
  selector: 'app-add-tyre',
  templateUrl: './add-tyre-adjustment.component.html',
  styleUrls: ['./add-tyre-adjustment.component.scss']
})
export class AddTyreAdjustmentComponent implements OnInit {
  addTyreForm: UntypedFormGroup;
  staticOptions: any = {};
  modelApi = '';
  newTyreItemPerms: any = {
		name: '',
    };
    modelParams = {
      name: ''
    };
    manufacturerApi = TSAPIRoutes.static_options;
    manufacturerParams: any = {};
    tyreModel = [];
    showCustomFieldsByDefault: boolean = false;
  @Output() addTyreData =new EventEmitter<any>();
  @Input() isFormValid=new BehaviorSubject({});
  isUniqueNumber:boolean=true;
  tyreSelectionError: boolean = false;
  makePlaceholderOption: any = { label: 'MAKE', value: null }
  modelPlaceholderOption: any = { label: 'MODEL', value: null }
  typePlaceholderOption: any = { label: 'TYPE', value: null };
  actionType = [{ label: 'Add', value: 'add' },{ label: 'Remove', value: 'remove' }]
  inventoryTyreList: any = [];
  alphaNumericPattern= new ValidationConstants().VALIDATION_PATTERN.ALPHA_NUMERIC2;
  @Input() inventoryData = new BehaviorSubject({});
  stockDate: string = "";
  currency_type;

  constructor(
    private _fb: UntypedFormBuilder,
    private _commonService: CommonService,
    private _vehicleService: VehicleService,
    private _operationActivityService: OperationsActivityService,
    private currency:CurrencyService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.currency_type = this.currency.getCurrency();
    }, 1000);
   this.getInitialValues();
   this.inventoryData.subscribe(data=>{
      this.stockDate = data['stockDate'];
      this.onDateSelection();
  })
  }


  getInitialValues(){
    this.buildForm();
    this.addMoreOtherItem();
    this.onChanges();
    this.getInventoryTyres();
    this._commonService
    .getStaticOptions(
      'tyre-manufacturer,tyre-thread-type,'
    )
    .subscribe((response) => {
      this.staticOptions.threadType = response.result['tyre-thread-type'];
      this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
    });
  }

  onChanges(): void {
    this.addTyreForm.get('new_tyre').valueChanges.subscribe(val => {
      this.emitData();
    });
  }

  getInventoryTyres(){
    this._operationActivityService.getInventoryTyres().subscribe((res: any) => {
      this.inventoryTyreList = res.result;
    })
  }

  onInventoryTyreSelection($event, newTyre: UntypedFormGroup, index) {
    this.inventoryTyreList.filter((data) => {
      if ($event.target.value === data.id) {
        newTyre.get('unique_number').setValue(data.unique_no);
          if (data.manufacturer) {
            newTyre.get('manufacturer').setValue(data.manufacturer.id);
            newTyre.get('manufacturer_option').setValue({label: data.manufacturer.label, value: data.manufacturer.id});
          } else {
            newTyre.get('manufacturer').setValue(null);
            newTyre.get('manufacturer_option').setValue(this.makePlaceholderOption);
          }

          if (data.model) {
            newTyre.get('model').setValue(data.model.id);
            newTyre.get('model_option').setValue({label: data.model.name, value: data.model.id});
          } else {
            newTyre.get('model').setValue(null);
            newTyre.get('model_option').setValue(this.modelPlaceholderOption);
          }

          if (data.thread_type) {
            newTyre.get('thread_type').setValue(data.thread_type.id);
            newTyre.get('thread_type_option').setValue({label: data.thread_type.label, value: data.thread_type.id});
          } else {
            newTyre.get('thread_type').setValue(null);
            newTyre.get('thread_type_option').setValue(this.typePlaceholderOption);
          }
          this.checkUniqueForTyreSelection(newTyre, index);
      }
    });
  }

  onDateSelection() {
    const tyreChangeVehicles = this.addTyreForm.controls['new_tyre'] as UntypedFormArray;
    tyreChangeVehicles.controls.forEach((temp) => {
         this.validateTyreChangeSelection(temp);
    })
  }

  validateTyreChangeSelection(newTyre) {
    const date = changeDateToServerFormat(this.stockDate);
    const itemId = newTyre.get('tyre').value;

    if (date && itemId) {
      this._operationActivityService.validateInventoryTyrePresent(date, itemId).subscribe(res => {
          newTyre.get('tyre_selection_error').setValue(false);
          this.checkToShowChangedTyreErrorMessage();
      }, err => {
        newTyre.get('tyre_selection_error').setValue(true);
          this.checkToShowChangedTyreErrorMessage();
      });
    }
  }

  checkToShowChangedTyreErrorMessage(){
    const tyreChangeVehicles = this.addTyreForm.get('new_tyre') as UntypedFormArray;
    let show = false;
    tyreChangeVehicles.controls.forEach(ele => {
      if (ele.get('tyre_selection_error').value) {
       show = true;
      }
    });

    if (show) {
      this.tyreSelectionError = true;
    } else {
      this.tyreSelectionError = false;
    }
  }


  tyreErrorCss(newTyre: UntypedFormGroup) {
    const tyreValidatorError = this.addErrorClass(newTyre.controls.tyre);
    const uniqueValidatorError = this.addErrorClass(newTyre.controls.unique_number);

    const positionUsedError = newTyre.controls.unique_number_status.value === false;
    const selectionError = newTyre.controls.tyre_selection_error.value === true;
    const controlPositionUsedError = newTyre.hasError("uniqueNumbererror");
    const controlSelectionError = newTyre.hasError("selectionError");

    let controlErrors = newTyre.controls.tyre.errors;
    let controlErrors2 = newTyre.controls.tyre.errors;
    if (!controlErrors){
      if (!controlErrors2) controlErrors = {}
      else controlErrors = controlErrors2;
    }


    const error = {
      error: tyreValidatorError.error || uniqueValidatorError.error || positionUsedError || selectionError
    }

    if (positionUsedError) {
      controlErrors.uniqueNumbererror = true;
      if (controlPositionUsedError) {
        delete newTyre.errors['uniqueNumbererror']
      }
    }

    if (selectionError) {
      controlErrors.selectionError = true;
      if (controlSelectionError) {
        delete newTyre.errors['selectionError']
      }
    }

    newTyre.controls.tyre.setErrors(controlErrors);
    newTyre.controls.unique_number.setErrors(controlErrors);
    newTyre.controls.tyre.updateValueAndValidity();
    newTyre.controls.unique_number.updateValueAndValidity();
    return error;
  }

  buildForm() {
    this.addTyreForm = this._fb.group({
      new_tyre:this._fb.array([]),
      hsn_code:['',[Validators.pattern(this.alphaNumericPattern)]],
    });
    return this.addTyreForm;
  }

  buildNewTyres(item: any) {
		return this._fb.group({
      total: [0],
      manufacturer: [
				item.manufacturer || null,
      ],
      manufacturer_option:this.makePlaceholderOption,
      model_option:this.modelPlaceholderOption,
      thread_type_option:this.typePlaceholderOption,
      thread_type: [
				item.thread_type || null,
      ],
      model: [
        item.model || null,
      ],
      tyre: [
        null
      ],
      unique_number:[
        item.unique_number || '',
        Validators.required
      ],
      action:[
        item.action || 'add',
        Validators.required
      ],
      unique_number_status:[true],
      tyre_selection_error:[false],
      additionalDetails: [
				this.showCustomFieldsByDefault
      ],
      note:['']
		});
	}

  buildNewTyre(items: any = []) {
    const newTyre = this.addTyreForm.controls['new_tyre'] as UntypedFormArray;
    items.forEach((item) => {
      newTyre.push(this.buildNewTyres(item));
      });
  }

  addParamsToNewSpareItem($event) {
		this.newTyreItemPerms = {
			name: $event
		};
  }

  removeOtherItem(index){
    const otherItems = this.addTyreForm.controls['new_tyre'] as UntypedFormArray;
    otherItems.removeAt(index);
  }

  addMoreOtherItem(){
    this.buildNewTyre(['']);
    this.emitData();
  }

  clearAllOtherItems(){
    const otherItems = this.addTyreForm.controls['new_tyre'] as UntypedFormArray;
		otherItems.reset();
		otherItems.controls = [];
    this.addMoreOtherItem();
  }

  addNewManufacturer(event) {
		this.manufacturerParams = {
			key: 'tyre-manufacturer',
			label: event,
			value: 0
		};
  }

	getNewManufacturer(event, index) {
		if (event) {
			this.staticOptions.tyreManufacturer = [];
			this._commonService
			.getStaticOptions('tyre-manufacturer')
			.subscribe((response) => {
				this.staticOptions.tyreManufacturer = response.result['tyre-manufacturer'];
        this.addTyreForm.controls['new_tyre']['controls'][index].controls.manufacturer.setValue(event.id);
        this.addTyreForm.controls['new_tyre']['controls'][index].controls.manufacturer_option.setValue({value: event.id, label: event.label});
			});
		}
	}

  updateModelForAllVehicles(index){
    const newTyre = this.addTyreForm.controls['new_tyre'] as UntypedFormArray;
    let makeId = newTyre.at(index).get('manufacturer').value
    this._vehicleService.getModel(makeId).subscribe(data => {
      newTyre.controls.forEach((element, index) => {
        if(element.get('manufacturer').value == makeId) {
          this.tyreModel[index] = data.result;
        }
      });
    })
  }

  getNewModel(data, index) {
    if (isValidValue(data)) {
      this.updateModelForAllVehicles(index);
    }
  }

  addNewModel($event) {
    this.modelParams = { name: $event };
  }

  onMakeChange(form, index) {
    this._vehicleService.getModel(form.get("manufacturer").value).subscribe(data => {
      this.modelApi = 'vehicle/tyre/manufacturer/' + form.get("manufacturer").value + '/model/'
      this.tyreModel[index] = data.result
    })
  }

  onActionTyreChange(otherItem){
    const actionAdd = otherItem.get('action').value == 'add';
    otherItem.get('unique_number').setValidators(null);
    otherItem.get('unique_number_status').setValue(true);

    if (actionAdd) {
      otherItem.get('tyre').setValidators(null);
      otherItem.get('tyre').setValue(null);
      otherItem.get('tyre_selection_error').setValue(false);
      otherItem.get('unique_number').setValidators(Validators.required);
    } else {
      otherItem.get('tyre').setValidators([RxwebValidators.unique(), Validators.required]);
      otherItem.get('unique_number').setValue('')
    }

    otherItem.get('tyre').updateValueAndValidity();
    otherItem.get('unique_number').updateValueAndValidity();
  }

  checkUnqueNumberUnique() {
    let uniqueNumberArray = [];
    let unique = true;
    const newTyre = this.addTyreForm.controls['new_tyre'] as UntypedFormArray;
    for (const items of newTyre['controls']) {
      if (items['controls'].unique_number.value != '' && items['controls'].unique_number.value != null) {
        uniqueNumberArray.push(items['controls'].unique_number.value)
      }
    }
    let valuesAlreadySeen = [];
    for (let i = 0; i < uniqueNumberArray.length; i++) {
      let value = uniqueNumberArray[i]
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

  checkUniqueForTyreSelection(newTyre, index){
    if(!this.checkUnqueNumberUnique()){
      newTyre.get('unique_number_status').setValue(false);
    } else {
      newTyre.get('unique_number_status').setValue(true);
    }
    this.actionAddCheckError();
    if (this.isUniqueNumber) {
      this.validateTyreChangeSelection(newTyre);
    }
  }

  actionAddCheckError(){
    const newTyre = this.addTyreForm.controls['new_tyre'] as UntypedFormArray;
    let uniqueStatus = true;
    newTyre.controls.forEach(ele => {
      if (!ele.get('unique_number_status')) uniqueStatus = false;
    })
    if (!uniqueStatus) this.isUniqueNumber = false;
  }

  checkUnique(otherItem){
    let uniqueNumber = otherItem.get('unique_number').value;
    if (uniqueNumber != '') {
      if(!this.checkUnqueNumberUnique()){
        otherItem.get('unique_number_status').setValue(false);
        this.actionAddCheckError();
      }else{
       this._operationActivityService.getUniqueNumber(uniqueNumber).subscribe(data => {
         if (data.result.exists) {
           otherItem.get('unique_number_status').setValue(false);
           this.actionAddCheckError();
         } else {
           otherItem.get('unique_number_status').setValue(true);
           this.actionAddCheckError();
         }
       })
      }
    } else {
      otherItem.get('unique_number_status').setValue(true);
      this.actionAddCheckError();
    }
  }

  clearData(i){
      this.addTyreForm.controls['new_tyre']['controls'][i].get('note').setValue('');
    }

  emitData(){
    let form = this.addTyreForm;
    this.addTyreData.emit(form);
    this.isFormValid.subscribe(data=>{
      if(!data){
        this.setAsTouched(form)
      }
    })
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
  addErrorClass(controlName: AbstractControl) {
    return TransportValidator.addErrorClass(controlName);
  }
}
