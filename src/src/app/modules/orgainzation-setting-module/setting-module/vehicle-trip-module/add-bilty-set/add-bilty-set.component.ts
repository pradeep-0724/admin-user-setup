import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingSeviceService } from 'src/app/modules/customerapp-module/api-services/orgainzation-setting-module-services/setting-service/setting-sevice.service';
import { ValidationConstants } from 'src/app/core/constants/constant';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-add-bilty-set',
  templateUrl: './add-bilty-set.component.html',
  styleUrls: ['./add-bilty-set.component.scss']
})
export class AddBiltySetComponent implements OnInit {
  successMsg:any;
  updateText:any= "Update";
  biltySetForm: UntypedFormGroup;
  @Output() isEnabledBiltySet = new EventEmitter();
  pattern = new ValidationConstants().VALIDATION_PATTERN;
  biltySetType = [
    {
      id: '0',
      label: 'Single Set'
    }, {
      id: '1',
      label: 'Multi Set'
    }
  ];
  isBiltySet = false;
  popupInputData = {
    'msg': 'Please Note: Once a bilty is created using the Bilty Set Schema, then we cannot switch back to the Previous Bilty Schema',
    'type': 'warning',
    'show': false
  }

  serialNumber = '001';
  apiError = ''

  constructor(private _fb: UntypedFormBuilder, private _biltySet: SettingSeviceService) { }
  ngOnInit() {
    this.gitInitialBiltySet();
    this.buildForm();
    this.addMoreItem();
    this.addStartEndSet([{ is_editable: true }], 0);
    this.makeAllStartValueMinimumToSerialNo(this.serialNumber);

  }

  buildForm() {
    this.biltySetForm = this._fb.group({
      builty_set_settings: this._fb.group({
        enable: false,
        is_editable: true,
        id: null,
        prefix: ['', [Validators.required, Validators.pattern(this.pattern.ALPHABET), Validators.maxLength(5)]],
        serial_no: ['001', [Validators.required, Validators.pattern(this.pattern.NUMBER_ONLY), Validators.maxLength(10)]],
      }),
      builty_sets: this._fb.array([])
    })

  }
  changeSerialNumber(number) {
    this.serialNumber = number;
    this.makeAllStartValueMinimumToSerialNo(this.serialNumber);
  }

  addMoreItem() {
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    const arrayItem = this.buildItem({ is_editable: true,is_type_editable:true });
    itemarray.push(arrayItem);
  }



  removeRangeItem(parentIndex, childIndex) {
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    const setEndArray = itemarray.controls[parentIndex].get('builty_set_list') as UntypedFormArray;
    setEndArray.removeAt(childIndex);
  }

  clearRange(startEnd: UntypedFormGroup) {
    startEnd.reset();
    startEnd.get('is_new_range').setValue(true);
    startEnd.get('is_editable').setValue(true);
    startEnd.get('end_no').setValidators([Validators.min(parseInt(this.serialNumber) + 1), Validators.required, Validators.maxLength(10)]);
    startEnd.get('end_no').updateValueAndValidity();

  }


  clearAllClient() {
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    itemarray.controls = [];
    itemarray.reset();
    this.addItem([{ is_editable: true }]);
    this.addStartEndSet([{ is_editable: true }], 0);
  }

  addItem(items: any) {
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildItem(item);
      itemarray.push(arrayItem);
    });
  }

  addStartEndSet(items, i) {
    const biltysetArray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    const startEndSet = biltysetArray.controls[i].get('builty_set_list') as UntypedFormArray;
    items.forEach((item) => {
      const arrayItem = this.buildStartEndSet(item);
      startEndSet.push(arrayItem);
    });
  }

  buildItem(item) {
    return this._fb.group({
      name: [item.name || '', [Validators.required, Validators.pattern(this.pattern.ALPHA_NUMERIC2)]],
      type: [item.type ? '1' : '0' || '1'],
      id: [item.id || null],
      is_name_unique: true,
      is_editable: [item.is_editable ? item.is_editable : false],
      is_type_editable:[item.is_type_editable ? item.is_type_editable : false],
      builty_set_list: this._fb.array([])
    });
  }

  buildStartEndSet(item) {
    return this._fb.group({
      is_editable: [item.is_editable ? item.is_editable : false],
      id: [item.id || null],
      start_no: [item.start_no || '', [Validators.required, Validators.pattern(this.pattern.NUMBER_ONLY), Validators.maxLength(10), Validators.min(parseInt(this.serialNumber))]],
      end_no: [item.end_no || '', [Validators.required, Validators.pattern(this.pattern.NUMBER_ONLY), Validators.maxLength(10)]],
      is_new_range: true
    });
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

  setEndNoValue(startEnd: UntypedFormGroup, parentIndex, ChildIndex) {
    let form = startEnd;
    const startno = form.get('start_no').value;
    form.get('end_no').setValue('')
    form.get('end_no').setValidators([Validators.min(parseInt(startno) + 1), Validators.required, Validators.maxLength(10)])
    form.get('end_no').updateValueAndValidity();
    form.get('is_new_range').setValue(true);
    form.get('is_new_range').setErrors(null);
    this.checkForAllStartEndValue(startno, parentIndex, ChildIndex);
  }

  checkNumberIsNewInRange(start, end, number) {
    if (parseInt(start) <= parseInt(number) && parseInt(end) >= parseInt(number)) {
      return false;
    } else {
      return true;
    }
  }


  checkForAllStartEndValue(number, parentIndex, ChildIndex) {
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    itemarray.controls.forEach((biltySet, pIndex) => {
      const startEndSet = biltySet.get('builty_set_list') as UntypedFormArray;
      startEndSet.controls.forEach((startEnd, cIndex) => {
        const setErrors = itemarray.controls[parentIndex].get('builty_set_list') as UntypedFormArray;
        if (!this.checkNumberIsNewInRange(startEnd.get('start_no').value, startEnd.get('end_no').value, number)) {
          setErrors.controls[ChildIndex].get('is_new_range').setValue(false);
          setErrors.controls[ChildIndex].get('is_new_range').setErrors({ 'incorrect': true })
          return
        }
      })
    })
  }

  addNewBiltySet() {
    this.addMoreItem();
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    this.addStartEndSet([{ is_editable: true }], itemarray.controls.length - 1);

  }

  removeBiltySet(index) {
    const biltysetArray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    biltysetArray.removeAt(index)
  }

  changeInBiltySetType(form: UntypedFormGroup, index, is_editable = true) {
    const itemarray = form.get('builty_set_list') as UntypedFormArray;
    if (form.value['id']) {
      if (form.get('type').value == '0') {
        itemarray.controls.forEach((item, setarrayIndex) => {
          if (setarrayIndex != 0) {
            itemarray.removeAt(setarrayIndex)
          }
        })
      } else {
        this.addStartEndSet([{ is_editable: is_editable }], index);
      }
    } else {
      if (form.get('type').value == '0') {
        if (!(itemarray.controls.length == 1)) {
          itemarray.controls = [];
          itemarray.reset();
          this.addStartEndSet([{ is_editable: is_editable }], index);
        }
      }
    }



  }

  isbiltyNameUnique(form, index) {
    let name = form.get('name').value;
    form.get('is_name_unique').setValue(true);
    if (name) {
      const biltysetArray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
      biltysetArray.controls.forEach((pform, pindex) => {
        if (pindex != index) {
          if (name.trim() == pform.get('name').value.trim()) {
            biltysetArray.controls[index].get('is_name_unique').setValue(false);
            return
          }
        }
      })
    }
  }

  makeAllStartValueMinimumToSerialNo(SerialNumber) {
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    itemarray.controls.forEach((biltySet, pIndex) => {
      const startEndSet = biltySet.get('builty_set_list') as UntypedFormArray;
      startEndSet.controls.forEach((startEnd) => {
        startEnd.get('start_no').setValidators([Validators.required, Validators.pattern(this.pattern.NUMBER_ONLY), Validators.maxLength(10), Validators.min(parseInt(SerialNumber))]);
        startEnd.get('start_no').updateValueAndValidity();
      })
    })
    this.setAsTouched(this.biltySetForm);
  }
  enableChange() {

    if (this.biltySetForm.controls.builty_set_settings.get('enable').value.toString() == 'true') {
      this.popupInputData.show = true;
    } else {
      this._biltySet.postBiltySet(this.biltySetForm.value).subscribe(data => {
        this.gitInitialBiltySet();
        this.apiError = '';
      }, err => {
        console.log(err)
        this.apiError = err.error.message
      })
    }
  }
  confirmButton(e) {
    if (e) {
    } else {
      this.biltySetForm.controls.builty_set_settings.get('enable').setValue(false)
    }
  }

  update() {
    if (this.biltySetForm.valid) {
      this._biltySet.postBiltySet(this.biltySetForm.value).subscribe(data => {

        this.successMsg = " ";

      this.updateText = "Update";
      setTimeout(() => {
        this.successMsg = "";
        this.updateText = " Update ";

      }, 5000);

        this.gitInitialBiltySet();
        this.apiError = '';
      }, err => {
        console.log(err)
        this.apiError = err.error.message
      })
    } else {
      this.apiError = '';
      this.setAsTouched(this.biltySetForm);
    }

  }

  gitInitialBiltySet() {
    this._biltySet.getBiltySet().subscribe(data => {
      this.isEnabledBiltySet.emit(data.result.builty_set_settings.enable)
      this.patchBiltySets(data.result)
    })
  }

  patchBiltySets(data) {
    if (!data.builty_set_settings['id']) {
      data.builty_set_settings['id'] = null
    }
    this.biltySetForm.controls.builty_set_settings.setValue(data.builty_set_settings);
    if(data.builty_set_settings){
      this.serialNumber = data.builty_set_settings.serial_no.toString();
    }
    this.patchBiltyParentItem(data.builty_sets)
  }
  patchBiltyParentItem(data) {
    if (data.length) {
      const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
      itemarray.controls = [];
      itemarray.reset();
      this.addItem(data);
      data.forEach((setRange, index) => {
        this.addStartEndSet(setRange.builty_set_list, index);
      });
    }
  }


  checkSetOverLap(form: UntypedFormGroup) {
    form.get('is_new_range').setErrors(null);
    form.get('is_new_range').setValue(true);
    let startAndEnd = [];
    const itemarray = this.biltySetForm.controls['builty_sets'] as UntypedFormArray;
    itemarray.controls.forEach((biltySet) => {
      const startEndSet = biltySet.get('builty_set_list') as UntypedFormArray;
      startEndSet.controls.forEach((startEnd) => {
        let startNo = startEnd.get('start_no').value;
        let endNo = startEnd.get('end_no').value
        if (startNo && endNo) {
          startAndEnd.push({
            start: startNo,
            end: endNo
          })
        }
      })
    });
    if (startAndEnd.length > 0) {
      startAndEnd.sort(function (a, b) {
        var startA = a.start,
          startB = b.start;
        if (startA < startB) return -1;
        if (startA > startB) return 1;
        return 0;
      });
      for (let index = 0; index < startAndEnd.length; index++) {
        for (let index2 = index + 1; index2 < startAndEnd.length; index2++) {
          if (startAndEnd[index].end >= startAndEnd[index2].start) {
            form.get('is_new_range').setValue(false);
            form.get('is_new_range').setErrors({ 'incorrect': true })
            return

          }

        }

      }

    }


  }
}
