
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { isValidValue, } from 'src/app/shared-module/utilities/helper-utils';




export class PerformaInvoiceClass {

	addInvoiceForm: UntypedFormGroup;
	totals: any = {
		subtotal_challan: 0.00,
		subtotal_others: 0.00,
		subtotal: 0.00,
		advance_amount: 0.00,
		adjustment: 0.00,
		invoiceBalance: 0.0,
		total: 0.00,
		roundOffAmount: 0.00,
		allAdvanceTotal: 0.00,
		taxes: []
	};
	challansList: any = [];
	tripChallansList: any = [];



	calculationsChanged() {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		const tripChallans = this.addInvoiceForm.controls['trip_challan'] as UntypedFormArray;
		this.totals.subtotal_challan = 0.00;
		this.totals.subtotal_others = 0.00;
		this.totals.subtotal = 0.00;
		this.totals.total = 0.00;
		this.totals.invoiceBalance = 0;
		this.totals.allAdvanceTotal = 0;
		this.totals.taxTotal = 0.00;
		this.totals.taxes.forEach((tax) => {
			tax.total = 0.00;
			tax.taxAmount = 0.00;
			tripChallans.controls.forEach((challan, index) => {
				if (challan.get('tax').value == tax.id) {
					let amountWithoutTax =
						Number(challan.value.charges) +
						Number(challan.value.freights) -
						Number(challan.value.deductions) +
						Number(challan.get('adjustment').value);
					let rate = amountWithoutTax;
					let amountWithTax;
					challan.get('total_amount').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
							tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
							amountWithTax = rate.toFixed(3);
						}
						else {
							tax.total = Number(Number(tax.total) + Number(amountWithoutTax)).toFixed(3);
							tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * Number(amountWithoutTax))).toFixed(3);
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						challan.get('total_amount').setValue(amountWithTax);
						this.totals.subtotal_challan = (Number(this.totals.subtotal_challan) +
							Number(amountWithoutTax)).toFixed(3);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
						this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
						challan.get('balance').setValue(Number(challan.get('total_amount').value) - Number(challan.get('advance').value))
						this.totals.allAdvanceTotal = (Number(this.totals.allAdvanceTotal) + Number(challan.get('advance').value)).toFixed(3);
					}
				}

			});

			otherItems.controls.forEach((others) => {
				let amountWithoutTax = Number(others.get('amount').value) - Number(others.get('discount').value);
				let amountWithTax;
				let rate = amountWithoutTax;
				if (others.get('tax').value == tax.id) {
					if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
						others.get('total_amount').setValue(amountWithoutTax);
						amountWithTax = amountWithoutTax.toFixed(3);
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
						tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
						tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
						amountWithTax = rate.toFixed(3);
					}
					else {
						tax.total = Number((Number(tax.total) + Number(amountWithoutTax))).toFixed(3);
						tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
						amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
						others.get('total_amount').setValue(amountWithTax);
					}

					this.totals.subtotal_others = (Number(this.totals.subtotal_others) +
						Number(amountWithoutTax)).toFixed(3);
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
				}
			});
		});

		this.calculateTotals();
	}

	calculateTotals() {
		let adjestmentAmount = 0.00;
		if (this.addInvoiceForm.controls['adjustment_choice'].value == 0) {
			adjestmentAmount = this.totals.total * this.addInvoiceForm.controls['adjustment_amount'].value / 100;
		} else {
			adjestmentAmount = this.addInvoiceForm.controls['adjustment_amount'].value;
		}

		this.totals.adjustment = Number(adjestmentAmount).toFixed(3);
		this.totals.total = (Number(this.totals.total) + Number(adjestmentAmount)).toFixed(3);
		this.roundOffTotalAmount();
		this.totals.invoiceBalance = (Number(this.totals.total) - Number(this.totals.allAdvanceTotal)).toFixed(3);


	}

	itemValueChanged(form: UntypedFormGroup, index) {
		const quantity = form.get('final_weight').value;
		const rate = form.get('rate_per_unit').value;
		const totalAmount = Number(quantity) * Number(rate);
		form.get('net_receiveable_amount').setValue(totalAmount.toFixed(3))
		this.challansList[index].net_receiveable_amount = totalAmount.toFixed(3)
		this.calculationsChanged();
	}

	onRoundOffEvent($event) {
		if ($event.checked) {
			const roundOffAmounts = roundOffToCeilFloor(this.totals.total);
			this.totals.roundOffAmount = roundOffAmounts.roundOffAmount;
			this.totals.total = roundOffAmounts.roundedOffAmount;
		} else {
			this.totals.roundOffAmount = 0;
		}
		this.calculationsChanged();
	}

	roundOffTotalAmount() {
		if (this.addInvoiceForm.get('is_roundoff').value) {
			const roundOffAmounts = roundOffToCeilFloor(this.totals.total);
			this.totals.roundOffAmount = roundOffAmounts.roundOffAmount;
			this.totals.total = roundOffAmounts.roundedOffAmount;
		} else {
			this.totals.roundOffAmount = 0;
		}
	}

	challansAdvanceAmount(ele) {
		this.totals.advance_amount = ele;
	}

}
