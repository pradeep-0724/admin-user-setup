import { UntypedFormGroup, UntypedFormArray} from '@angular/forms';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';


export class DebitNoteClass{

    addDebitNote : UntypedFormGroup;

    totals: any = {
		subtotal: 0.0,
		total: 0.0,
		roundOffAmount: 0.00,
        taxes:[]
	};


    calculateItemOthersAmount(index) {
		const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
    	let quantity = otherItems.at(index).get('quantity').value;
		let rate = otherItems.at(index).get('unit_cost').value;
		let setamount = otherItems.at(index).get('amount');
		const amount = (quantity * rate).toFixed(3);
    setamount.setValue(amount);
    this.calculateOtherFinalAmount(index);
  }

  calculateOtherFinalAmount(index) {
    const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
    let amount = Number(otherItems.at(index).get('amount').value);
    let discount = Number(otherItems.at(index).get('discount').value);
    let totalAmountControl = otherItems.at(index).get('total');
    const totalAmount = (Number(amount) - Number(discount)).toFixed(3);
    totalAmountControl.setValue(totalAmount);
    this.calculationsChanged();
  }

  calculationsChanged() {
    const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
    this.totals.subtotal = 0;
    this.totals.total = 0;
    this.totals.taxTotal = 0;
    this.totals.taxes.forEach((tax) => {
        tax.total = 0;
        tax.taxAmount = 0;


        otherItems.controls.forEach((others) => {
            let amountWithoutTax = Number(others.get('amount').value) - Number(others.get('discount').value);
            let amountWithTax;
            let rate = amountWithoutTax;
            if (others.get('tax').value == tax.id) {

                if (this.addDebitNote.controls['is_transaction_includes_tax'].value) {
                others.get('total').setValue(amountWithoutTax);

                amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
                tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
                tax.taxAmount = (Number(tax.taxAmount) + Number(((rate *  Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
                amountWithTax = rate.toFixed(3)
                }
                else {
                tax.total = (Number(tax.total) +Number(amountWithoutTax)).toFixed(3);
                tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
                amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
                others.get('total').setValue(amountWithTax);
                }

                this.totals.subtotal_others = (Number(this.totals.subtotal_others) + Number(amountWithoutTax)).toFixed(3);
                this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
                this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
                this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
                }
        });
    });
}
    roundOffTotalAmount() {
        if (this.addDebitNote.get('is_roundoff').value) {
            const roundOffAmounts = roundOffToCeilFloor(this.totals.total);
            this.totals.roundOffAmount = roundOffAmounts.roundOffAmount;
            this.totals.total = Number(roundOffAmounts.roundedOffAmount).toFixed(3);
        } else {
            this.totals.roundOffAmount = 0.000;
        }
    }

    calculateItemOther(index) {
        const otherItems = this.addDebitNote.controls['others'] as UntypedFormArray;
        let quantity = otherItems.at(index).get('quantity');
        let rate = otherItems.at(index).get('unit_cost');
        let amount = Number(otherItems.at(index).get('amount').value);

        if (amount == 0) {
        rate.setValue(0.000)
        quantity.setValue(0.000);
        }

        if (rate.value == 0 && quantity.value == 0) {
        this.calculateOtherFinalAmount(index);
        return;
        }

        if (quantity.value == 0 && rate.value != 0) {
        const setFuelQuantity = (amount / rate.value).toFixed(3);
         quantity.setValue(setFuelQuantity);
         this.calculateOtherFinalAmount(index);
        return;
    }

        const setRate = (amount / quantity.value).toFixed(3);
    rate.setValue(setRate);
    this.calculateOtherFinalAmount(index);
    }


    /* For checking the round off boolean status on onChange event handler and to calculate the round off value */
    onRoundOffEvent($event) {
        if ($event.checked) {
            const roundOffAmounts = roundOffToCeilFloor(this.totals.total);
            this.totals.roundOffAmount = roundOffAmounts.roundOffAmount;
            this.totals.total =Number(roundOffAmounts.roundedOffAmount).toFixed(3);
        } else {
            this.totals.roundOffAmount = 0.000;
            this.calculationsChanged();
        }
    }






}
