import { BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl, FormGroup } from '@angular/forms';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-trip-tonnes',
  templateUrl: './trip-tonnes.component.html',
  styleUrls: ['./trip-tonnes.component.scss']
})
export class TripTonnesComponent implements OnInit {

  tonnesForm: UntypedFormGroup;
  total = {
    weight: '0.00',
    freight: '0.00'
  }
  selectedMaterialList = [];
  @Input() materialOptionsList = [];
  @Input() isEdit = false;
  @Input() showUnloading = false;
  @Input() showTotal = true;
  @Input() showMaterial = true;
  @Input() editData = []
  @Output() dataFromBilling = new EventEmitter<any>();
  @Input() isAddScreen = false;
  @Input() storageRate=0;
  @Input() isFormValid = new BehaviorSubject(true);
  @Input() isTripCode=false;

  showAddItemPopup= {name: '', status: false};
  unitDetails=[];
  materialIndex=-1;
  constructor(private _fb: UntypedFormBuilder,private _commonService: CommonService,) { }
  ngOnInit() {
    this.buildForm();
    this._commonService.getStaticOptions('item-unit').subscribe((resp:any)=>{
      this.unitDetails= resp.result['item-unit']
      });
    this.checkIfDataContails();
    this.prepareRequest();
    this.isFormValid.subscribe(valid => {
      if (!valid) {
        this.setAsTouched(this.tonnesForm);
      }
    })

  }

  buildForm() {
    this.tonnesForm = this._fb.group({
      tonnes: this._fb.array([])
    })
    if (this.isEdit) {
      this.addItem(this.editData);
      this.prepareRequest();
      this.calculateTotal();
      const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
      itemarray.controls.forEach((form, i) => {
        this.calculateFreightAmount(form);
        this.changedMaterial(form.value['material'], i)
      });
    } else {
      this.addItem([{}]);
    }
  }

  addMoreItem() {
    const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
    const arrayItem = this.buildItem({});
    itemarray.push(arrayItem);
    this.selectedMaterialList.push([]);
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.storageRate=this.storageRate;
    if('materialOptionsList' in changes)
    if( changes.materialOptionsList.currentValue){
      setTimeout(() => {
        const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
        itemarray.controls.forEach((form, i) => {
        this.changedMaterial(form.value['material'], i)
      });
      }, 1000);
      }
    if(this.storageRate){
      setTimeout(() => {
        const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
        itemarray.controls.forEach((form, i) => {
        itemarray.controls[i].get('extra_or_shortage_rate').setValue( this.storageRate)});
      }, 1000);
    }
  }

  removeItem(i) {
    const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
    itemarray.removeAt(i);
    this.calculateTotal();
    this.selectedMaterialList.splice(i, 1);
  }


  clearAllClient() {
    const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
    itemarray.controls = [];
    itemarray.reset();
    this.addItem([{}]);
    this.calculateTotal();
    this.selectedMaterialList = [];
  }

  addItem(items: any) {
    if (items.length == 0) {
      this.addItem([{}])
    }
    const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
      this.selectedMaterialList.push([]);
    });
  }

  buildItem(item) {
    return this._fb.group({
      id: [item.id || null],
      rate: [item.rate || 0, [Validators.required, Validators.min(0.01)]],
      total_units: [item.total_units || 0, [this.showTotal ? Validators.required : Validators.nullValidator, this.showTotal ? Validators.min(0.01) : Validators.nullValidator]],
      charged_units: [item.charged_units || 0, [Validators.required, Validators.min(0.01)]],
      freight_amount: [item.freight_amount || 0, [Validators.required, Validators.min(0.01)]],
      unloading_units: [item.unloading_units || 0.000],
      extra_or_shortage_units: [item.extra_or_shortage_units || 0.000],
      extra_or_shortage_rate: [item.extra_or_shortage_rate || 0.00],
      extra_or_shortage_amount: [item.extra_or_shortage_amount || 0.00],
      adjustment_amount: [item.adjustment_amount || 0.00],
      net_receivable: [item.net_receivable || 0.00],
      material: [item.material || []],
      is_editable: true
    });
  }

  onChangeLoadingWeight(form) {
    const loadingweight = Number(form.get('total_units').value);
    form.get('charged_units').setValue(loadingweight.toFixed(3));
    this.calculateFreightAmount(form)
  }

  calculateFreightAmount(form) {
    const loadingweight = Number(form.get('total_units').value);
    const chargedWeight = Number(form.get('charged_units').value);
    const unloadingweight = Number(form.get('unloading_units').value);
    const ratePerTonne = Number(form.get('rate').value);
    const shortageRate = Number(form.get('extra_or_shortage_rate').value);
    const adjustmentAmount = Number(form.get('adjustment_amount').value);
    const shortageUnits = (loadingweight - unloadingweight).toFixed(3)
    const freightAmount = (Number(chargedWeight) * Number(ratePerTonne)).toFixed(3);
    const shortageAmount = (Number(shortageRate) * Number(shortageUnits)).toFixed(3);
    const netAmount = (Number(freightAmount) - Number(shortageAmount) + adjustmentAmount).toFixed(3);
    form.get('freight_amount').setValue(freightAmount)
    form.get('extra_or_shortage_units').setValue(shortageUnits)
    form.get('extra_or_shortage_amount').setValue(shortageAmount)
    form.get('net_receivable').setValue(netAmount)
    this.calculateTotal();
  }

  calculateOnShortageChange(form) {
    const chargedWeight = Number(form.get('charged_units').value);
    const shortageUnits = Number(form.get('extra_or_shortage_units').value);
    const ratePerTonne = Number(form.get('rate').value);
    const shortageRate = Number(form.get('extra_or_shortage_rate').value);
    const adjustmentAmount = Number(form.get('adjustment_amount').value);
    const freightAmount = (Number(chargedWeight) * Number(ratePerTonne)).toFixed(3);
    const shortageAmount = (Number(shortageRate) * Number(shortageUnits)).toFixed(3);
    const netAmount = (Number(freightAmount) - Number(shortageAmount) + adjustmentAmount).toFixed(3);
    form.get('extra_or_shortage_amount').setValue(shortageAmount)
    form.get('net_receivable').setValue(netAmount)
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = {
      weight: '0.00',
      freight: '0.00'
    }
    const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
    itemarray.controls.forEach(item => {
      item.get('charged_units').value
      item.get('net_receivable').value
      this.total.freight = (Number(this.total.freight) + Number(item.get('net_receivable').value)).toFixed(3);
      this.total.weight = (Number(this.total.weight) + Number(item.get('charged_units').value)).toFixed(3);
    })
    this.checkIfDataContails();

  }

  changedMaterial(event, i) {
    this.selectedMaterialList[i] = [];
    if (event.length > 0) {
      let idArray = [];
      idArray = event;
      let selectedItem = [];
      idArray.forEach(id => {
        this.materialOptionsList.forEach(item => {
          if (item.value == id) {
            selectedItem.push(item)
          }
        })
      })
      this.selectedMaterialList[i] = selectedItem;
    }
  }

  prepareRequest() {
    this.tonnesForm.valueChanges.pipe(debounceTime(300)).subscribe(data => {
      let outPutData = {
        isFormValid: this.tonnesForm.valid,
        allData: []
      }
      if (this.tonnesForm.valid) {
        outPutData = {
          isFormValid: this.tonnesForm.valid,
          allData: data['tonnes']

        }
      } else {
        outPutData = {
          isFormValid: this.tonnesForm.valid,
          allData: []
        }
      }
      this.dataFromBilling.emit(outPutData)
    });

  }



  checkIfDataContails() {
    const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
    if (this.isAddScreen) {
      itemarray.controls.forEach(item => {
        if (+item['value'].rate > 0 || +item['value'].total_units > 0 || +item['value'].charged_units > 0 || +item['value'].freight_amount > 0) {
          this.setUnsetValidators(item, 'rate', true);
          this.setUnsetValidators(item, 'total_units', true);
          this.setUnsetValidators(item, 'charged_units', true);
          this.setUnsetValidators(item, 'freight_amount', true);
        } else {
          this.setUnsetValidators(item, 'rate', false);
          this.setUnsetValidators(item, 'total_units', false);
          this.setUnsetValidators(item, 'charged_units', false);
          this.setUnsetValidators(item, 'freight_amount', false);
        }
      })
    }
    if ( this.isTripCode) {
      itemarray.controls.forEach(item => {
        if (+item['value'].rate > 0 || +item['value'].charged_units > 0 || +item['value'].freight_amount > 0) {
          this.setUnsetValidators(item, 'rate', true);
          this.setUnsetValidators(item, 'charged_units', true);
          this.setUnsetValidators(item, 'freight_amount', true);
        } else {
          this.setUnsetValidators(item, 'rate', false);
          this.setUnsetValidators(item, 'total_units', false);
          this.setUnsetValidators(item, 'charged_units', false);
          this.setUnsetValidators(item, 'freight_amount', false);
        }
      })
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


  setUnsetValidators(form: AbstractControl, formcontrolName: string, isSetValidators: boolean) {
    if (isSetValidators) {
      form.get(formcontrolName).setValidators([Validators.required, Validators.min(0.01)])
    } else {
      form.get(formcontrolName).setValidators(null)
    }
    form.get(formcontrolName).updateValueAndValidity();
  }

  addTotalUnitsToChargedAndUnloading(form:FormGroup){
    let totalUnits=form.get('total_units').value;
    let chargedUnits=form.get('charged_units');
    let unloadingUnits=form.get('unloading_units');
    chargedUnits.setValue(totalUnits);
    unloadingUnits.setValue(totalUnits);

  }
  closeItemPopup(){
    this.showAddItemPopup.status= false;
 }

 addDropDownMaterial(e){
   if(e.id && this.materialIndex>=0){
     this.materialOptionsList.push({display:e.label,value:e.id})
     this.selectedMaterialList[this.materialIndex].push({display:e.label,value:e.id})
     const itemarray = this.tonnesForm.controls['tonnes'] as UntypedFormArray;
     let material=[];
     material=itemarray.controls[this.materialIndex].get('material').value;
     material.push(e.id)
     itemarray.controls[this.materialIndex].get('material').setValue(material);
   }
   this.showAddItemPopup.status=false;
   this.materialIndex =-1;
 }
 addNewMaterial(index){
   this.materialIndex =index;
   this.showAddItemPopup.status=true
 }

}
