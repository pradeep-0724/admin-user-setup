import { Component, OnInit, Output,EventEmitter, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, AbstractControl,UntypedFormControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { isValidValue, getBlankOption } from 'src/app/shared-module/utilities/helper-utils';
import { TSAPIRoutes } from 'src/app/core/constants/api-urls.constants';
import { VehicleService } from 'src/app/modules/customerapp-module/api-services/master-module-services/vehicle-services/vehicle.service';
import { BehaviorSubject } from 'rxjs';
import { OperationsActivityService } from 'src/app/modules/customerapp-module/api-services/operation-module-service/operations-activity.service';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { changeDateToServerFormat } from 'src/app/shared-module/utilities/date-utilis';
import { CurrencyService } from 'src/app/core/services/currency.service';

@Component({
  selector: 'app-tyre-spare',
  templateUrl: './edit-tyre-adjustment.component.html',
  styleUrls: ['./edit-tyre-adjustment.component.scss']
})
export class EditTyreAdjustmentComponent implements OnInit {
  editTyreForm: UntypedFormGroup;
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
    isDisable=true;
    itemsDisable: any=[];
    count=0;
  @Output() addTyreData =new EventEmitter<any>();
  @Input () tyreData=new BehaviorSubject([]);
  isUniqueNumber: boolean = true;
  tyreSelectionError: boolean = false;
  makePlaceholderOption: any = { label: 'MAKE', value: null }
  modelPlaceholderOption: any = { label: 'MODEL', value: null }
  typePlaceholderOption: any = { label: 'TYPE', value: null };
  actionType = [{ label: 'Add', value: 'add' },{ label: 'Remove', value: 'remove' }]
  inventoryTyreList: any = [];
  @Input() inventoryData = new BehaviorSubject({});
  @Input() isFormValid = new BehaviorSubject({});
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
   this.tyreData.subscribe(data=>{
     this.editTyreForm.get('hsn_code').setValue(data['tyre_hsn_code']);
     this.patcForm(data['tyres'])
   });
   this.inventoryData.subscribe(data=>{
    this.stockDate = data['stockDate'];
    });
  }


    patcForm(data){
      if(data.length > 0){
        let form = this.editTyreForm;
        let newTyreForm = form.get('new_tyre') as UntypedFormArray;
        newTyreForm.reset();
        newTyreForm.controls=[];
        data.forEach((item,index) => {
          this.buildNewTyre(['']);
          this.itemsDisable.push(item.disabled);
          newTyreForm.controls[index].patchValue({
            id: item.id,
            total:item.total,
            unique_number: item.tyre.unique_no,
            manufacturer: item.manufacturer ? item.manufacturer.id : null,
            actionOption: item.is_add ? {label:'Add',value:'add'} : {label:'Remove',value:'remove'},
            tyreOption: {value: item.tyre.id, label: item.tyre.unique_no},
            action: item.is_add ? 'add' : 'remove',
            manufacturer_option: isValidValue(item.manufacturer)?{label:item.manufacturer.label,value:item.manufacturer.id}:getBlankOption(),
            model: item.tyre_model ? item.tyre_model.id : null,
            tyre: item.tyre.id,
            model_option: isValidValue(item.tyre_model)?{label:item.tyre_model.name,value:item.tyre_model.id}:getBlankOption(),
            thread_type: item.thread_type ? item.thread_type.id : null,
            thread_type_option:isValidValue(item.thread_type)?{label:item.thread_type.label,value:item.thread_type.id}:getBlankOption(),
          });
        });
    }
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
      const tyreChangeVehicles = this.editTyreForm.get('new_tyre') as UntypedFormArray;
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

    addErrorClass(controlName: AbstractControl) {
      return TransportValidator.addErrorClass(controlName);
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

    onChanges(): void {
      this.editTyreForm.get('new_tyre').valueChanges.subscribe(val => {
        this.emitData();
      });
    }

    buildForm() {
      this.editTyreForm = this._fb.group({
       new_tyre:this._fb.array([]),
      hsn_code:[''],
      });
      return this.editTyreForm;
    }

  buildNewTyres(item: any) {
		return this._fb.group({
      total: [0],
      id: [item.id || null],
      manufacturer: [
				item.manufacturer || null,
				Validators.required
      ],
      manufacturer_option:this.makePlaceholderOption,
      model_option:this.modelPlaceholderOption,
      thread_type_option:this.typePlaceholderOption,
      thread_type: [
				item.thread_type || null,
				Validators.required
      ],
      model: [
        item.model || null,
        Validators.required
      ],
      action:[
        item.action || 'add',
        Validators.required
      ],
      unique_number:[
        item.unique_number || '',
        Validators.required
      ],
      actionOption: {value: "add", label: "Add"},
      unique_number_status:[true],
      tyreOption: item.tyre_option || getBlankOption(),
      additionalDetails: [
				this.showCustomFieldsByDefault
      ],
      note:[''],
      tyre: [
        item.tyre || null
      ],
      tyre_selection_error:[false]
		});
	}


  buildNewTyre(items: any = []) {
    const newTyre = this.editTyreForm.controls['new_tyre'] as UntypedFormArray;
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
    const otherItems = this.editTyreForm.controls['new_tyre'] as UntypedFormArray;
    otherItems.removeAt(index);
    this.itemsDisable.splice(index,1);
  }

  addMoreOtherItem(){
    this.buildNewTyre(['']);
    this.emitData();
    if(this.count>0){
      this.itemsDisable.push(false);
      this.count++;
    }
  }

  clearAllOtherItems(){
    const otherItems = this.editTyreForm.controls['new_tyre'] as UntypedFormArray;
		otherItems.reset();
		otherItems.controls = [];
    this.addMoreOtherItem();
    this.itemsDisable=[];
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
        this.editTyreForm.controls['new_tyre']['controls'][index].controls.manufacturer.setValue(event.id);
        this.editTyreForm.controls['new_tyre']['controls'][index].controls.manufacturer_option.setValue({value: event.id, label: event.label});
			});
		}
	}

  updateModelForAllVehicles(index){
    const newTyre = this.editTyreForm.controls['new_tyre'] as UntypedFormArray;
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

  calculateItemAmount(index){
    const newSpareItems = this.editTyreForm.controls['new_tyre']  as UntypedFormArray;
    let rate = newSpareItems.at(index).get('rate').value;
    let setTotal = newSpareItems.at(index).get('total');
    const  total = ((Number(rate))).toFixed(3);
    setTotal.setValue(total);
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
    const newTyre = this.editTyreForm.controls['new_tyre'] as UntypedFormArray;
    let uniqueStatus = true;
    newTyre.controls.forEach(ele => {
      if (!ele.get('unique_number_status')) uniqueStatus = false;
    })
    if (!uniqueStatus) this.isUniqueNumber = false;
  }

  checkUnqueNumberUnique() {
    let uniqueNumberArray = [];
    let unique = true;
    const newTyre = this.editTyreForm.controls['new_tyre'] as UntypedFormArray;
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

  checkUnique(otherItem){
    let uniqueNumber = otherItem.get('unique_number').value;
    let tyreId = otherItem.get('tyre').value;
    if (uniqueNumber != '') {
      if(!this.checkUnqueNumberUnique()){
        otherItem.get('unique_number_status').setValue(false);
        this.actionAddCheckError();
      }else{
       this._operationActivityService.getUniqueNumber(uniqueNumber, tyreId).subscribe(data => {
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
      this.editTyreForm.controls['new_tyre']['controls'][i].get('note').setValue('');
    }

  emitData(){
    let form = this.editTyreForm;
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

}
