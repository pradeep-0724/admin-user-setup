import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormArray, AbstractControl, UntypedFormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TransportValidator } from 'src/app/shared-module/components/validators/validators';
import { setUnsetValidators } from 'src/app/shared-module/utilities/form-utils';
@Component({
  selector: 'app-trip-fixed',
  templateUrl: './trip-fixed.component.html',
  styleUrls: ['./trip-fixed.component.scss']
})
export class TripFixedComponent implements OnInit {
  fixedForm: UntypedFormGroup;
  @Output() dataFromBilling = new EventEmitter<any>();
  @Input() isEdit = false;
  @Input() editData = []
  @Input() showUnloading = false;
  @Input() isFormValid = new BehaviorSubject(true);
  @Input() isAddScreen = false;
  @Input() isTripCode=false;


  constructor(private _fb: UntypedFormBuilder) { }
  ngOnInit() {
    this.buildForm();

    this.checkIfDataContails();
    this.prepareRequest();
    this.isFormValid.subscribe(valid => {
      if (!valid) {
        this.setAsTouched(this.fixedForm);
      }
    })
  }

  buildForm() {
    this.fixedForm = this._fb.group({
      id: [null],
      freight_amount: [0.00, [Validators.required, Validators.min(0.01)]],
      adjustment_amount: [0.00],
      net_receivable: [0.00]
    })
    if (this.isEdit && this.editData[0]) {
      this.fixedForm.get('freight_amount').setValue(this.editData[0]['freight_amount'])
      this.fixedForm.get('id').setValue(this.editData[0]['id'])
      this.fixedForm.get('adjustment_amount').setValue(this.editData[0]['adjustment_amount']);
      this.fixedForm.get('net_receivable').setValue(this.editData[0]['net_receivable']);
      setTimeout(() => {
        this.calculateFreightAmount();
      }, 1000);

    }
  }

  calculateFreightAmount() {
    const amount = Number(this.fixedForm.get('freight_amount').value)
    const adjusment = Number(this.fixedForm.get('adjustment_amount').value ? this.fixedForm.get('adjustment_amount').value : 0)
    const finalAmount = (amount + adjusment).toFixed(3);
    this.fixedForm.get('net_receivable').setValue(finalAmount);

    this.checkIfDataContails();
  }

  prepareRequest() {
    if (!this.fixedForm.valid) {
      this.dataFromBilling.emit({
        isFormValid: this.fixedForm.valid,
        allData: []
      });
    }
    this.fixedForm.valueChanges.pipe(debounceTime(100)).subscribe(data => {
      this.calculateFreightAmount()
      this.checkIfDataContails();
      if (this.fixedForm.valid) {
        this.dataFromBilling.emit({
          isFormValid: this.fixedForm.valid,
          allData: [this.fixedForm.value]
        })
      } else {
        this.dataFromBilling.emit({
          isFormValid: this.fixedForm.valid,
          allData: []
        })
      }
    })
  }

  checkIfDataContails() {
    if (this.isAddScreen || this.isTripCode) {
      if (+this.fixedForm.get('freight_amount').value > 0) {
        setUnsetValidators(this.fixedForm, 'freight_amount',[Validators.required, Validators.min(0.01)]);
      } else {
        setUnsetValidators(this.fixedForm, 'freight_amount',[Validators.nullValidator]);
      }
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

}
