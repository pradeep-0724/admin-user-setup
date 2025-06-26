
import { UntypedFormGroup, UntypedFormArray, FormGroup } from '@angular/forms';
import { roundOffToCeilFloor } from 'src/app/shared-module/utilities/currency-utils';
import { isValidValue, } from 'src/app/shared-module/utilities/helper-utils';




export class InvoiceClass {

	addInvoiceForm: UntypedFormGroup;
	totals: any = {
		subtotal: 0.00,
		advance_amount: 0.00,
		adjustment: 0.00,
		total: 0.00,
		roundOffAmount: 0.00,
		craneTimesheet: {
			billingHoursTotal: 0.00,
			extraHoursTotal: 0.00,
			billingHoursAmountTotal:0.00,
			extraHoursAmountTotal:0.00,
			timeSheetTaxTotal: 0.00,
			timeSheetSubTotal: 0.00,
		},
		awpTimesheet: {
			billingHoursTotal: 0.00,
			extraHoursTotal: 0.00,
			billingHoursAmountTotal:0.00,
			extraHoursAmountTotal:0.00,
			timeSheetTaxTotal: 0.00,
			timeSheetSubTotal: 0.00,
			deductionTotal: 0.00,
		},
		others: {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			deduction:0.00,
			totaltax: 0.00,
			totalAmount: 0.00
		},
		container: {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			deduction:0.00,
			totaltax: 0.00,
			totalAmount: 0.00
		},
		itemOther: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		craneAdditionalCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		awpAdditionalCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		containerAdditionalCharges: {
			units : 0,
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},

		craneCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		awpCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		containerCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},

		craneDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		awpDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			discountTotal: 0.00
		},
		containerDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			discountTotal: 0.00
		},
		othersAdditionalCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},

		taxes: []
	};
	challansList: any = [];
	tripChallansList: any = [];
	taxAmount: any = 0;



	calculationsChanged() {
		const otherItems = this.addInvoiceForm.controls['item_others'] as UntypedFormArray;
		
		const crane = this.addInvoiceForm.controls['crane'] as FormGroup;
		const craneTimeSheet = crane.get('timesheets') as UntypedFormArray;
		const craneDeductions = crane.get('deductions') as UntypedFormArray;
		const craneAdditionalCharge = crane.get('additional_charges') as UntypedFormArray;
		const craneCharge = crane.get('charges') as UntypedFormArray;

		const awp = this.addInvoiceForm.controls['awp'] as FormGroup;
		const awpTimeSheet = awp.get('timesheets') as UntypedFormArray;
		const awpDeductions = awp.get('deductions') as UntypedFormArray;
		const awpAdditionalCharge = awp.get('additional_charges') as UntypedFormArray;
		const awpCharge = awp.get('charges') as UntypedFormArray;

		const others = this.addInvoiceForm.controls['others'] as FormGroup;
		const tripChallans = others.get('trip_challan') as UntypedFormArray;
		const othersAdditionalCharge = others.get('additional_charges') as UntypedFormArray;

		const container = this.addInvoiceForm.controls['container'] as FormGroup;
		const containerDeductions = container.get('deductions') as UntypedFormArray;
		const containerAdditionalCharge = container.get('additional_charges') as UntypedFormArray;
		const containerCharge = container.get('charges') as UntypedFormArray;
		const tripChallansForContainer = this.addInvoiceForm.controls['container'].get('trip_challan') as UntypedFormArray;

		this.totals.subtotal = 0.00;
		this.totals.total = 0.00;
		this.totals.taxTotal = 0.00;
		this.totals.itemOther={
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.craneDeduction= {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.craneCharges={
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.craneAdditionalCharges= {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}

		this.totals.craneTimesheet={
			billingHoursTotal: 0.00,
			extraHoursTotal: 0.00,
			billingHoursAmountTotal:0.00,
			extraHoursAmountTotal:0.00,
			timeSheetTaxTotal: 0.00,
			timeSheetSubTotal: 0.00,
		}
		this.totals.others= {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			totaltax: 0.00,
			deduction:0.00,
			totalAmount: 0.00
		}
		this.totals.container= {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			totaltax: 0.00,
			deduction:0.00,
			totalAmount: 0.00
		}

		this.totals.awpDeduction= {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.awpCharges={
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.awpAdditionalCharges= {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.containerDeduction = {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.containerCharges = {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.containerAdditionalCharges= {
			units : 0,
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.othersAdditionalCharges= {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00,
			totalUnits : 0
		}

		this.totals.awpTimesheet={
			billingHoursTotal: 0.00,
			extraHoursTotal: 0.00,
			billingHoursAmountTotal:0.00,
			extraHoursAmountTotal:0.00,
			timeSheetTaxTotal: 0.00,
			timeSheetSubTotal: 0.00,
		}

		this.totals.taxes.forEach((tax) => {
			tripChallans.controls.forEach((challan, index) => {
				if (challan.get('tax').value == tax.id) {
					let amountWithoutTax = Number(challan.value.freights)
					let rate = amountWithoutTax;
					let freightTax = 0
					let amountWithTax;
					if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
						freightTax = (Number(((rate * Number(tax.value)) / (100 + Number(tax.value)))));
					}
					else {
						tax.total = Number(Number(tax.total) + Number(amountWithoutTax));
						freightTax = (Number(tax.value / 100 * Number(amountWithoutTax)));
					}
					this.totals.others.freightTotal=(Number(this.totals.others.freightTotal) + Number(challan.value.freights)).toFixed(3)
					this.totals.others.chargesWttax=(Number(this.totals.others.chargesWttax) + Number(challan.value.charges_wt_tax)).toFixed(3)
					this.totals.others.chargesWotax=(Number(this.totals.others.chargesWotax) + Number(challan.value.charges_wo_tax)).toFixed(3)
					this.totals.others.deduction=(Number(this.totals.others.deduction) + Number(challan.value.deductions_wo_tax)).toFixed(3)

					challan.get('freights_tax').setValue(freightTax.toFixed(3));
					let taxAmount = Number(freightTax) + Number(challan.get('charges_tax').value) - Number(challan.get('deductions_tax').value)
					challan.get('tax_amount').setValue(Number(taxAmount).toFixed(3));
					const totalAmount = Number(amountWithoutTax) + Number(challan.get('charges').value) - Number(challan.get('deductions').value) + Number(freightTax)
					challan.get('total_amount').setValue(Number(totalAmount).toFixed(3));
					amountWithTax = Number(totalAmount)
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(Number(totalAmount) - Number(challan.get('tax_amount').value))).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(taxAmount)).toFixed(3);
					this.totals.others.totaltax=(Number(this.totals.others.totaltax) + Number(taxAmount)).toFixed(3)
					this.totals.others.totalAmount=(Number(this.totals.others.totalAmount) + Number(amountWithTax)).toFixed(3)
				}

			});
			craneTimeSheet.controls.forEach((sheet, index) => {

				if (crane.get('timesheet_tax').value == tax.id) {
					let amountWithoutTax = Number(sheet.value.billing_amount) + Number(sheet.value.extra_amount)
					sheet.get('amount_before_tax').setValue(amountWithoutTax)
					let sheetTax = 0
					if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
						sheetTax = (Number(((amountWithoutTax * Number(tax.value)) / (100 + Number(tax.value)))));
					}
					else {
						tax.total = Number(Number(tax.total) + Number(amountWithoutTax));
						sheetTax = (Number(tax.value / 100 * Number(amountWithoutTax)));
					}
					sheet.get('tax_amount').setValue(sheetTax.toFixed(3));
					const totalAmount = Number(amountWithoutTax) + Number(sheetTax)
					sheet.get('amount').setValue(Number(totalAmount).toFixed(3));
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(totalAmount)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(sheetTax)).toFixed(3);
					this.totals.craneTimesheet.billingHoursTotal=(Number(this.totals.craneTimesheet.billingHoursTotal) + Number(sheet.value.billing_hours)).toFixed(3)
					this.totals.craneTimesheet.extraHoursTotal=(Number(this.totals.craneTimesheet.extraHoursTotal) + Number(sheet.value.extra_hours)).toFixed(3)
					this.totals.craneTimesheet.billingHoursAmountTotal=(Number(this.totals.craneTimesheet.billingHoursAmountTotal) + Number(sheet.value.billing_amount)).toFixed(3)
					this.totals.craneTimesheet.extraHoursAmountTotal=(Number(this.totals.craneTimesheet.extraHoursAmountTotal) + Number(sheet.value.extra_amount)).toFixed(3)
					this.totals.craneTimesheet.timeSheetTaxTotal=(Number(this.totals.craneTimesheet.timeSheetTaxTotal) + Number(sheetTax)).toFixed(3)
					this.totals.craneTimesheet.timeSheetSubTotal=(Number(this.totals.craneTimesheet.timeSheetSubTotal) + Number(totalAmount)).toFixed(3)

				}

			});

			craneAdditionalCharge.controls.forEach((additionalCharges, index) => {
				additionalCharges.get('amount').setValue(Number(additionalCharges.value['quantity']) * Number(additionalCharges.value['unit_cost']) )
				if (additionalCharges.get('tax').value == tax.id) {
					let amountWithoutTax = Number(additionalCharges.value['amount']) - Number(additionalCharges.value['discount']);
					let amountWithTax;
					let additionalChargesTax=0.00
					this.totals.craneAdditionalCharges.amountTotal=(Number(this.totals.craneAdditionalCharges.amountTotal) + Number(additionalCharges.value['amount'])).toFixed(3)
					this.totals.craneAdditionalCharges.discountTotal=(Number(this.totals.craneAdditionalCharges.discountTotal) + Number(additionalCharges.value['discount'])).toFixed(3)

					additionalCharges.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							additionalChargesTax= Number(((amountWithoutTax * Number(tax.value)) / (100 + Number(tax.value))));
						}
						else {
							additionalChargesTax =  Number(tax.value / 100 * Number(amountWithoutTax));
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						additionalCharges.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(additionalChargesTax)).toFixed(3);
						this.totals.craneAdditionalCharges.taxTotal=(Number(this.totals.craneAdditionalCharges.taxTotal) + Number(additionalChargesTax)).toFixed(3)
						this.totals.craneAdditionalCharges.total=(Number(this.totals.craneAdditionalCharges.total) + Number(amountWithTax)).toFixed(3)
					}
				}

			});
			craneCharge.controls.forEach((charge, index) => {
				if (charge.get('tax').value == tax.id) {
					let amountWithoutTax = Number(charge.value['amount']) - Number(charge.value['discount']);
					let rate = amountWithoutTax;
					let amountWithTax;
					let chargeTax=0.00
					this.totals.craneCharges.amountTotal= (Number(this.totals.craneCharges.amountTotal) + Number(charge.value['amount'])).toFixed(3)
					this.totals.craneCharges.discountTotal= (Number(this.totals.craneCharges.discountTotal) + Number(charge.value['discount'])).toFixed(3)
					charge.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							amountWithTax = rate.toFixed(3);
							chargeTax=Number(((rate * Number(tax.value)) / (100 + Number(tax.value))));
						}
						else {
							chargeTax=Number(tax.value / 100 * Number(amountWithoutTax));
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						charge.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(chargeTax)).toFixed(3);
						this.totals.craneCharges.total= (Number(this.totals.craneCharges.total) + Number(amountWithTax)).toFixed(3)
						this.totals.craneCharges.taxTotal= (Number(this.totals.craneCharges.taxTotal) + Number(chargeTax)).toFixed(3)

					}
				}

			});




			awpTimeSheet.controls.forEach((sheet, index) => {
				if (awp.get('timesheet_tax').value == tax.id) {
					let amountWithoutTax = Number(sheet.value.billing_amount) + Number(sheet.value.extra_amount)
					sheet.get('amount_before_tax').setValue(amountWithoutTax)
					let sheetTax = 0
					if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
						sheetTax = (Number(((amountWithoutTax * Number(tax.value)) / (100 + Number(tax.value)))));
					}
					else {
						tax.total = Number(Number(tax.total) + Number(amountWithoutTax));
						sheetTax = (Number(tax.value / 100 * Number(amountWithoutTax)));
					}
					sheet.get('tax_amount').setValue(sheetTax.toFixed(3));
					const totalAmount = Number(amountWithoutTax) + Number(sheetTax)
					sheet.get('amount').setValue(Number(totalAmount).toFixed(3));
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(totalAmount)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(sheetTax)).toFixed(3);
					this.totals.awpTimesheet.billingHoursTotal=(Number(this.totals.awpTimesheet.billingHoursTotal) + Number(sheet.value.billing_hours)).toFixed(3)
					this.totals.awpTimesheet.extraHoursTotal=(Number(this.totals.awpTimesheet.extraHoursTotal) + Number(sheet.value.extra_hours)).toFixed(3)
					this.totals.awpTimesheet.billingHoursAmountTotal=(Number(this.totals.awpTimesheet.billingHoursAmountTotal) + Number(sheet.value.billing_amount)).toFixed(3)
					this.totals.awpTimesheet.extraHoursAmountTotal=(Number(this.totals.awpTimesheet.extraHoursAmountTotal) + Number(sheet.value.extra_amount)).toFixed(3)
					this.totals.awpTimesheet.timeSheetTaxTotal=(Number(this.totals.awpTimesheet.timeSheetTaxTotal) + Number(sheetTax)).toFixed(3)
					this.totals.awpTimesheet.timeSheetSubTotal=(Number(this.totals.awpTimesheet.timeSheetSubTotal) + Number(totalAmount)).toFixed(3)

				}

			});

			awpAdditionalCharge.controls.forEach((additionalCharges, index) => {
				additionalCharges.get('amount').setValue(Number(additionalCharges.value['quantity']) * Number(additionalCharges.value['unit_cost']) )
				if (additionalCharges.get('tax').value == tax.id) {
					let amountWithoutTax = Number(additionalCharges.value['amount']) - Number(additionalCharges.value['discount']);
					let amountWithTax;
					let additionalChargesTax=0.00
					this.totals.awpAdditionalCharges.amountTotal=(Number(this.totals.awpAdditionalCharges.amountTotal) + Number(additionalCharges.value['amount'])).toFixed(3)
					this.totals.awpAdditionalCharges.discountTotal=(Number(this.totals.awpAdditionalCharges.discountTotal) + Number(additionalCharges.value['discount'])).toFixed(3)

					additionalCharges.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							additionalChargesTax= Number(((amountWithoutTax * Number(tax.value)) / (100 + Number(tax.value))));
						}
						else {
							additionalChargesTax =  Number(tax.value / 100 * Number(amountWithoutTax));
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						additionalCharges.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(additionalChargesTax)).toFixed(3);
						this.totals.awpAdditionalCharges.taxTotal=(Number(this.totals.awpAdditionalCharges.taxTotal) + Number(additionalChargesTax)).toFixed(3)
						this.totals.awpAdditionalCharges.total=(Number(this.totals.awpAdditionalCharges.total) + Number(amountWithTax)).toFixed(3)
					}
				}

			});
			awpCharge.controls.forEach((charge, index) => {
				if (charge.get('tax').value == tax.id) {
					let amountWithoutTax = Number(charge.value['amount']) - Number(charge.value['discount']);
					let rate = amountWithoutTax;
					let amountWithTax;
					let chargeTax=0.00
					this.totals.awpCharges.amountTotal= (Number(this.totals.awpCharges.amountTotal) + Number(charge.value['amount'])).toFixed(3)
					this.totals.awpCharges.discountTotal= (Number(this.totals.awpCharges.discountTotal) + Number(charge.value['discount'])).toFixed(3)
					charge.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							amountWithTax = rate.toFixed(3);
							chargeTax=Number(((rate * Number(tax.value)) / (100 + Number(tax.value))));
						}
						else {
							chargeTax=Number(tax.value / 100 * Number(amountWithoutTax));
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						charge.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(chargeTax)).toFixed(3);
						this.totals.awpCharges.total= (Number(this.totals.awpCharges.total) + Number(amountWithTax)).toFixed(3)
						this.totals.awpCharges.taxTotal= (Number(this.totals.awpCharges.taxTotal) + Number(chargeTax)).toFixed(3)

					}
				}

			});

		
			
		
			
			othersAdditionalCharge.controls.forEach((additionalCharges, index) => {
				additionalCharges.get('amount').setValue(Number(additionalCharges.value['quantity']) * Number(additionalCharges.value['unit_cost']) )
				if (additionalCharges.get('tax').value == tax.id) {
					let amountWithoutTax = Number(additionalCharges.value['amount']) - Number(additionalCharges.value['discount']);
					let amountWithTax;
					let additionalChargesTax=0.00
					this.totals.othersAdditionalCharges.amountTotal=(Number(this.totals.othersAdditionalCharges.amountTotal) + Number(additionalCharges.value['amount'])).toFixed(3)
					this.totals.othersAdditionalCharges.discountTotal=(Number(this.totals.othersAdditionalCharges.discountTotal) + Number(additionalCharges.value['discount'])).toFixed(3);
					this.totals.othersAdditionalCharges.totalUnits = this.totals.othersAdditionalCharges.totalUnits + Number(additionalCharges.value['quantity'])

					additionalCharges.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							additionalChargesTax= Number(((amountWithoutTax * Number(tax.value)) / (100 + Number(tax.value))));
						}
						else {
							additionalChargesTax =  Number(tax.value / 100 * Number(amountWithoutTax));
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						additionalCharges.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(additionalChargesTax)).toFixed(3);
						this.totals.othersAdditionalCharges.taxTotal=(Number(this.totals.othersAdditionalCharges.taxTotal) + Number(additionalChargesTax)).toFixed(3)
						this.totals.othersAdditionalCharges.total=(Number(this.totals.othersAdditionalCharges.total) + Number(amountWithTax)).toFixed(3)
					}
				}

			});


			otherItems.controls.forEach((others) => {
				let amountWithoutTax = Number(others.get('amount').value) - Number(others.get('discount').value);
				let amountWithTax;
				let othersTax=0.00
				if (others.get('tax').value == tax.id) {
					if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
						others.get('total_amount').setValue(amountWithoutTax);
						amountWithTax = amountWithoutTax.toFixed(3);
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
						othersTax =  Number(((amountWithoutTax * Number(tax.value)) / (100 + Number(tax.value))));
					}
					else {
						othersTax = Number(tax.value / 100 * amountWithoutTax);
						amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
						others.get('total_amount').setValue(amountWithTax);
					}

					this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(othersTax)).toFixed(3);
					this.totals.itemOther.total=(Number(this.totals.itemOther.total) + Number(amountWithTax)).toFixed(3);
					this.totals.itemOther.taxTotal=(Number(this.totals.itemOther.taxTotal)+ Number(othersTax)).toFixed(3) ;
					this.totals.itemOther.amountTotal=(Number(this.totals.itemOther.amountTotal) +  Number(others.get('amount').value)).toFixed(3);
					this.totals.itemOther.discountTotal=(Number(this.totals.itemOther.discountTotal) + Number(others.get('discount').value)).toFixed(3) ;
				}
			});

			tripChallansForContainer.controls.forEach((challan, index) => {
				
				if (challan.get('tax').value == tax.id) {
					let amountWithoutTax = Number(challan.value.freights)
					let rate = amountWithoutTax;
					let freightTax = 0
					let amountWithTax;
					if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
						freightTax = (Number(((rate * Number(tax.value)) / (100 + Number(tax.value)))));
					}
					else {
						tax.total = Number(Number(tax.total) + Number(amountWithoutTax));
						freightTax = (Number(tax.value / 100 * Number(amountWithoutTax)));
					}
					this.totals.container.freightTotal=(Number(this.totals.container.freightTotal) + Number(challan.value.freights)).toFixed(3)
					this.totals.container.chargesWttax=(Number(this.totals.container.chargesWttax) + Number(challan.value.charges_wt_tax)).toFixed(3)
					this.totals.container.chargesWotax=(Number(this.totals.container.chargesWotax) + Number(challan.value.charges_wo_tax)).toFixed(3)
					this.totals.container.deduction=(Number(this.totals.container.deduction) + Number(challan.value.deductions_wo_tax)).toFixed(3)

					challan.get('freights_tax').setValue(freightTax.toFixed(3));
					let taxAmount = Number(freightTax) 
					challan.get('tax_amount').setValue(Number(taxAmount).toFixed(3));
					const totalAmount = Number(amountWithoutTax) + Number(freightTax)
					challan.get('total_amount').setValue(Number(totalAmount).toFixed(3));
					amountWithTax = Number(totalAmount)
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(Number(totalAmount) - Number(challan.get('tax_amount').value))).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(taxAmount)).toFixed(3);
					this.totals.container.totaltax=(Number(this.totals.container.totaltax) + Number(taxAmount)).toFixed(3)
					this.totals.container.totalAmount=(Number(this.totals.container.totalAmount) + Number(amountWithTax)).toFixed(3)
				}

			});
            containerCharge.controls.forEach((charge, index) => {				
				if (charge.get('tax').value == tax.id) {
					let amountWithoutTax = Number(charge.value['amount']) - Number(charge.value['discount']);
					let rate = amountWithoutTax;
					let amountWithTax;
					let chargeTax=0.00
					this.totals.containerCharges.amountTotal= (Number(this.totals.containerCharges.amountTotal) + Number(charge.value['amount'])).toFixed(3)
					this.totals.containerCharges.discountTotal= (Number(this.totals.containerCharges.discountTotal) + Number(charge.value['discount'])).toFixed(3)
					charge.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							amountWithTax = rate.toFixed(3);
							chargeTax=Number(((rate * Number(tax.value)) / (100 + Number(tax.value))));
						}
						else {
							chargeTax=Number(tax.value / 100 * Number(amountWithoutTax));
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						charge.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(chargeTax)).toFixed(3);
						this.totals.containerCharges.total= (Number(this.totals.containerCharges.total) + Number(amountWithTax)).toFixed(3)
						this.totals.containerCharges.taxTotal= (Number(this.totals.containerCharges.taxTotal) + Number(chargeTax)).toFixed(3)

					}
				}

			});
			containerAdditionalCharge.controls.forEach((additionalCharges, index) => {				
				additionalCharges.get('amount').setValue(Number(additionalCharges.value['quantity']) * Number(additionalCharges.value['unit_cost']) )
				if (additionalCharges.get('tax').value == tax.id) {
					let amountWithoutTax = Number(additionalCharges.value['amount']) - Number(additionalCharges.value['discount']);
					let amountWithTax;
					let additionalChargesTax=0.00
					this.totals.containerAdditionalCharges.amountTotal=(Number(this.totals.containerAdditionalCharges.amountTotal) + Number(additionalCharges.value['amount'])).toFixed(3)
					this.totals.containerAdditionalCharges.discountTotal=(Number(this.totals.containerAdditionalCharges.discountTotal) + Number(additionalCharges.value['discount'])).toFixed(3)
					this.totals.containerAdditionalCharges.units= (Number(this.totals.containerAdditionalCharges.units) + Number(additionalCharges.value['quantity'])).toFixed(3)

					additionalCharges.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if (this.addInvoiceForm.controls['is_transaction_includes_tax'].value) {
							amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							additionalChargesTax= Number(((amountWithoutTax * Number(tax.value)) / (100 + Number(tax.value))));
						}
						else {
							additionalChargesTax =  Number(tax.value / 100 * Number(amountWithoutTax));
							amountWithTax = (Number(tax.value / 100 * amountWithoutTax) +
								Number(amountWithoutTax)).toFixed(3);
						}
						additionalCharges.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(additionalChargesTax)).toFixed(3);
						this.totals.containerAdditionalCharges.taxTotal=(Number(this.totals.containerAdditionalCharges.taxTotal) + Number(additionalChargesTax)).toFixed(3)
						this.totals.containerAdditionalCharges.total=(Number(this.totals.containerAdditionalCharges.total) + Number(amountWithTax)).toFixed(3)
					}
				}

			});
		});

		craneDeductions.controls.forEach((deductions, index) => {
			let totalAmount = Number(deductions.value['amount']) - Number(deductions.value['discount'])
			deductions.get('total').setValue(totalAmount.toFixed(3))
			this.totals.subtotal = (Number(this.totals.subtotal) - Number(totalAmount)).toFixed(3);
			this.totals.total = (Number(this.totals.total) - Number(totalAmount)).toFixed(3);
			this.totals.craneDeduction.discountTotal=(Number(this.totals.craneDeduction.discountTotal) + Number(deductions.value['discount'])).toFixed(3)
			this.totals.craneDeduction.amountTotal=(Number(this.totals.craneDeduction.amountTotal) +  Number(deductions.value['amount'])).toFixed(3)
			this.totals.craneDeduction.total=(Number(this.totals.craneDeduction.total)+ Number(totalAmount)).toFixed(3)
		});

		awpDeductions.controls.forEach((deductions, index) => {
			let totalAmount = Number(deductions.value['amount']) - Number(deductions.value['discount'])
			deductions.get('total').setValue(totalAmount.toFixed(3))
			this.totals.subtotal = (Number(this.totals.subtotal) - Number(totalAmount)).toFixed(3);
			this.totals.total = (Number(this.totals.total) - Number(totalAmount)).toFixed(3);
			this.totals.awpDeduction.discountTotal=(Number(this.totals.awpDeduction.discountTotal) + Number(deductions.value['discount'])).toFixed(3)
			this.totals.awpDeduction.amountTotal=(Number(this.totals.awpDeduction.amountTotal) +  Number(deductions.value['amount'])).toFixed(3)
			this.totals.awpDeduction.total=(Number(this.totals.awpDeduction.total)+ Number(totalAmount)).toFixed(3)
		});
		
		containerDeductions.controls.forEach((deductions, index) => {
			let totalAmount = Number(deductions.value['amount']) - Number(deductions.value['discount'])
			deductions.get('total').setValue(totalAmount.toFixed(3))
			this.totals.subtotal = (Number(this.totals.subtotal) - Number(totalAmount)).toFixed(3);
			this.totals.total = (Number(this.totals.total) - Number(totalAmount)).toFixed(3);
			this.totals.containerDeduction.discountTotal=(Number(this.totals.containerDeduction.discountTotal) + Number(deductions.value['discount'])).toFixed(3)
			this.totals.containerDeduction.amountTotal=(Number(this.totals.containerDeduction.amountTotal) +  Number(deductions.value['amount'])).toFixed(3)
			this.totals.containerDeduction.total=(Number(this.totals.containerDeduction.total)+ Number(totalAmount)).toFixed(3)
		});
		
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
