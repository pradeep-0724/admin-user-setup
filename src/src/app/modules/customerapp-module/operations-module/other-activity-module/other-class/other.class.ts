
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import {  isValidValue } from 'src/app/shared-module/utilities/helper-utils';




export class OthersClass{

    newExpenseTotals: any = {
		subtotal: 0,
		discountTotal: 0,
		taxes: [],
		discountAfterTaxTotal: 0,
		tdsAmount: 0,
		adjustmentAmount: 0,
		total: 0,
		balance: 0.0
	};
    otherActivityForm: UntypedFormGroup;
    isTransactionIncludesTax=false;



    onCalcuationsChanged() {
		let newItemExpenses = this.otherActivityForm.controls['item_expenses'] as UntypedFormArray;
		this.newExpenseTotals.subtotal = 0;
		this.newExpenseTotals.total = 0;
		this.newExpenseTotals.taxTotal = 0;
		this.newExpenseTotals.taxes.forEach((tax) => {
			tax.total = 0;
			tax.taxAmount = 0;
			newItemExpenses.controls.forEach((newMaintainanceContol) => {
				if (tax.id === newMaintainanceContol.get('tax').value) {
					let amountWithoutTax = Number(newMaintainanceContol.get('total_before_tax').value)
          			let rate = amountWithoutTax;
					if (isValidValue(amountWithoutTax) && !this.isTransactionIncludesTax) {
						tax.total = (Number(tax.total) + Number(amountWithoutTax)).toFixed(3);
						tax.taxAmount = (Number(tax.value) / 100 * Number(amountWithoutTax)).toFixed(3);
						const amountWithTax = (Number((tax.value) / 100 * Number(amountWithoutTax)) + Number(amountWithoutTax)).toFixed(3);
						newMaintainanceContol.get('total').setValue(amountWithTax);
						this.newExpenseTotals.subtotal = (Number(this.newExpenseTotals.subtotal) +
							Number(amountWithoutTax)).toFixed(3);
						this.newExpenseTotals.total = (Number(this.newExpenseTotals.total) +
							Number(amountWithTax)).toFixed(3);
						this.newExpenseTotals.taxTotal = (Number(this.newExpenseTotals.taxTotal) +
							Number(tax.taxAmount)).toFixed(3);
					}
					else if (isValidValue(amountWithoutTax) && this.isTransactionIncludesTax) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							tax.total = rate.toFixed(3);
							tax.taxAmount = ((rate *  Number(tax.value)) / (100 + Number(tax.value))).toFixed(3);
							const amountWithTax = rate.toFixed(3);
							newMaintainanceContol.get('total').setValue(amountWithTax);
							this.newExpenseTotals.subtotal = (Number(this.newExpenseTotals.subtotal) +
								Number(amountWithoutTax)).toFixed(3);
							this.newExpenseTotals.total = (Number(this.newExpenseTotals.total) +
								Number(amountWithTax)).toFixed(3);
							this.newExpenseTotals.taxTotal = (Number(this.newExpenseTotals.taxTotal) +
								Number(tax.taxAmount)).toFixed(3);
					}
				}
			});
		});
		this.calculateTotals();
	}


	calculateTotals() {
		const form = this.otherActivityForm;
		const discountAmount = form.get('discount').value;
		const discountAfterTaxAmount = form.get('discount_after_tax').value;
		const adjustmentAmount = form.get('adjustment').value;
		const tds = Number(form.get('tds').value);

		if (isValidValue(discountAmount)) {
			this.newExpenseTotals.discountTotal =
				form.get('discount_type').value == 0
					? (Number(discountAmount) / 100 * Number(this.newExpenseTotals.subtotal)).toFixed(3)
					: discountAmount;
		} else {
			this.newExpenseTotals.discountTotal = 0;
		}
		this.otherActivityForm.controls.sub_total_without_tax.setValue(this.newExpenseTotals.subtotal);
		if (isValidValue(discountAfterTaxAmount)) {
			this.newExpenseTotals.discountAfterTaxTotal =
				form.get('discount_after_tax_type').value == 0
					? (Number(discountAfterTaxAmount) /
						100 *
						(Number(this.newExpenseTotals.total) -
							Number(this.newExpenseTotals.discountTotal))).toFixed(3)
					: discountAfterTaxAmount;
		} else {
			this.newExpenseTotals.discountAfterTaxTotal = 0;
		}

		if (isValidValue(adjustmentAmount)) {
			this.newExpenseTotals.adjustmentAmount =
				form.get('adjustment_choice').value == 0
					? (((Number(this.newExpenseTotals.subtotal) -
						Number(this.newExpenseTotals.discountTotal) +
						Number(this.newExpenseTotals.taxTotal) -
						Number(this.newExpenseTotals.discountAfterTaxTotal)) * Number(adjustmentAmount)) / 100).toFixed(3)
					: adjustmentAmount;
		} else {
			this.newExpenseTotals.adjustmentAmount = 0;
		}

		this.newExpenseTotals.total = (this.newExpenseTotals.total -
      Number(this.newExpenseTotals.discountTotal) -
      Number(this.newExpenseTotals.discountAfterTaxTotal) +
	  Number(this.newExpenseTotals.adjustmentAmount)).toFixed(3);
    const deductTdsAmount = Number(this.newExpenseTotals.subtotal) - Number(this.newExpenseTotals.discountTotal);
	  this.newExpenseTotals.tdsAmount = (deductTdsAmount * tds / 100).toFixed(3);
	  this.newExpenseTotals.balance = (Number(this.newExpenseTotals.total) - Number(this.newExpenseTotals.tdsAmount)).toFixed(3);
  }



	// auto calulate rate or amount or quantity if any two value is entered
	calculateItemOther(index) {
		const otherItems = this.otherActivityForm.controls['item_expenses']  as UntypedFormArray;
		let fuel_quantity = otherItems.at(index).get('quantity');
		let rate = otherItems.at(index).get('rate_per_unit');
		let amount = otherItems.at(index).get('total').value;

		if (amount == 0) {
			rate.setValue(0.00)
			fuel_quantity.setValue(0.000);
		  }
		if (rate.value == 0 && fuel_quantity.value == 0) {
			} else
		if (fuel_quantity.value == 0 && rate.value != 0) {
			const setFuelQuantity = (amount / rate.value).toFixed(3);
			fuel_quantity.setValue(setFuelQuantity);
			} else {
			const setRate = (amount / fuel_quantity.value).toFixed(3);
			rate.setValue(setRate);
		}
		this.onCalcuationsChanged();
		}

    calculateItemOthersAmount(index) {
      const otherItems = this.otherActivityForm.controls['item_expenses']  as UntypedFormArray;
      let quantity = otherItems.at(index).get('quantity').value;
      let unit_cost = otherItems.at(index).get('rate_per_unit').value;
      let setamount = otherItems.at(index).get('total_before_tax');
      const  amount = (quantity * unit_cost ).toFixed(3);
      setamount.setValue(amount);
      this.onCalcuationsChanged();
    }




}
