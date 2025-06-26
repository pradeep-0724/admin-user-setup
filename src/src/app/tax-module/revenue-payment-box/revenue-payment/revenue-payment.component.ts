import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormArray, UntypedFormControl, AbstractControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { CurrencyService } from 'src/app/core/services/currency.service';

import { TransportValidator } from 'src/app/shared-module/components/validators/validators';

@Component({
  selector: 'app-revenue-payment',
  templateUrl: './revenue-payment.component.html',
  styleUrls: ['./revenue-payment.component.scss']
})
export class RevenuePaymentComponent implements OnInit,AfterViewInit {
  revenuePaymentForm: UntypedFormGroup;
  deductAmountDisabled: boolean = true;
  @Input() paymentPatch :Observable<any>;
  @Output () revenuePayementHeader = new EventEmitter<any>();
  currency_type:any;

	constructor(
		private _fb: UntypedFormBuilder,private currency: CurrencyService
	) { }

  ngOnInit() {
    this.buildForm();
    this.currency_type = this.currency.getCurrency();
    this.revenuePaymentForm.valueChanges.subscribe(data=>{
       let taxData={
         isFormValid :this.revenuePaymentForm.valid,
         payementDetails :this.revenuePaymentForm.value
       }
       this.revenuePayementHeader.emit(taxData)
    })

  }

  ngAfterViewInit(){
    this.paymentPatch.subscribe(data=>{
        if(data['id']){
           this.revenuePaymentForm.patchValue(data);
           this.taxCheck();
        }
    })
  }

  buildForm() {
		this.revenuePaymentForm = this._fb.group({
      is_tax_deducted: [false],
      deduction_amount: [0, Validators.required],
		});
    return this.revenuePaymentForm;
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

    taxCheck() {
      this.deductAmountDisabled = false;
      if (this.revenuePaymentForm.controls['is_tax_deducted'].value == false) {
        this.revenuePaymentForm.controls['deduction_amount'].patchValue(0);
        this.deductAmountDisabled = true;
      } else {
        this.deductAmountDisabled = false;
      }
    }

}
