import { FormGroup, UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import { ValidationConstants } from "src/app/core/constants/constant";
import { getBlankOption, getNonTaxableOption, isValidValue } from "src/app/shared-module/utilities/helper-utils";



export class FleetOwnerClass{

    mechanicActivityForm: UntypedFormGroup;
    isTransactionIncludesTax=false;
	isTransactionUnderReverse=false;
    defaultTax = new ValidationConstants().defaultTax;

    initialValues: any = {
		vendor: getBlankOption(),
		gstTreatment: getBlankOption(),
		placeOfSupply: getBlankOption(),
		paymentTerm: getBlankOption(),
		paymentMode: getBlankOption(),
		units: [],
		vehicle: [getBlankOption()],
		serviceType: [getBlankOption()],
		tax: [],
		expenseAccount: [],
		item: [],
		taxPercent: [],
		employee: getBlankOption(),
		paymentStatus: getBlankOption(),
		adjustmentChoice: getBlankOption(),
		discountAfterTaxType: getBlankOption(),
		tdsType: getBlankOption(),
		discountType: getBlankOption(),
		adjustmentAccount: getBlankOption()
	};


	totals: any = {
		discountTotal: 0,
		discountAfterTaxTotal: 0,
		tdsAmount: 0,
		balance: 0.0,
		subtotal: 0.00,
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
		itemOther: {
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
		containerCharges: {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		},
		containerDeduction: {
			total: 0.00,
			amountTotal: 0.00,
			discountTotal: 0.00
		},	
		

		taxes: []
	};

    onCalcuationsChanged() {
		
		let otherItems = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
		let others = this.mechanicActivityForm.controls['others'] as UntypedFormArray;
		const tripExpenses = others.get('trip_challan') as UntypedFormArray;
        const crane = this.mechanicActivityForm.controls['crane'] as FormGroup;
		const craneTimeSheet = crane.get('timesheets') as UntypedFormArray;
		const craneDeductions = crane.get('deductions') as UntypedFormArray;
		const craneCharge = crane.get('charges') as UntypedFormArray;		
		const awp = this.mechanicActivityForm.controls['awp'] as FormGroup;
		const awpTimeSheet = awp.get('timesheets') as UntypedFormArray;
		const awpDeductions = awp.get('deductions') as UntypedFormArray;
		const awpCharge = awp.get('charges') as UntypedFormArray;

		const looseCargo = this.mechanicActivityForm.controls['cargo'] as FormGroup;
		const looseCargoDeductions = looseCargo.get('deductions') as UntypedFormArray;
		const looseCargoCharge = looseCargo.get('charges') as UntypedFormArray;

		const container = this.mechanicActivityForm.controls['container'] as FormGroup;
		const containerDeductions = container.get('deductions') as UntypedFormArray;
		const containerCharge = container.get('charges') as UntypedFormArray;

		const tripChallansForLooseCargo = this.mechanicActivityForm.controls['cargo'].get('trip_challan') as UntypedFormArray;
		const tripChallansForContainer = this.mechanicActivityForm.controls['container'].get('trip_challan') as UntypedFormArray;

		

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

		this.totals.awpTimesheet={
			billingHoursTotal: 0.00,
			extraHoursTotal: 0.00,
			billingHoursAmountTotal:0.00,
			extraHoursAmountTotal:0.00,
			timeSheetTaxTotal: 0.00,
			timeSheetSubTotal: 0.00,
		}
		this.totals.looseCargoDeduction = {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.looseCargoCharges={
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.looseCargo= {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			totaltax: 0.00,
			deduction:0.00,
			totalAmount: 0.00
		}
		this.totals.containerDeduction = {
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.containerCharges={
			total: 0.00,
			amountTotal: 0.00,
			taxTotal: 0.00,
			discountTotal: 0.00
		}
		this.totals.container= {
			freightTotal: 0.00,
			chargesWttax: 0.00,
			chargesWotax: 0.00,
			totaltax: 0.00,
			deduction:0.00,
			totalAmount: 0.00
		}

		this.totals.taxes.forEach((tax) => {
			tripExpenses.controls.forEach((challan, index) => {
				if (challan.get('tax').value == tax.id) {
					let amountWithoutTax = Number(challan.value.freights)
					let rate = amountWithoutTax;
					let freightTax = 0
					let amountWithTax;
					if (this.isTransactionIncludesTax) {
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
					this.totals.others.deduction=(Number(this.totals.others.deduction) + Number(challan.value.deductions)).toFixed(3)

					challan.get('freights_tax').setValue(freightTax.toFixed(3));
					let taxAmount = Number(freightTax) + Number(challan.get('charges_tax').value);
					challan.get('tax_amount').setValue(Number(taxAmount).toFixed(3));
					const totalAmount = Number(amountWithoutTax) + Number(challan.get('charges').value) - Number(challan.get('deductions').value) + Number(freightTax)
					challan.get('total').setValue(Number(totalAmount).toFixed(3));
					amountWithTax = Number(totalAmount)
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(Number(totalAmount) - Number(challan.get('tax_amount').value))).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(taxAmount)).toFixed(3);
					this.totals.others.totaltax=(Number(this.totals.others.totaltax) + Number(taxAmount)).toFixed(3)
					this.totals.others.totalAmount=(Number(this.totals.others.totalAmount) + Number(amountWithTax)).toFixed(3)
				}

			});
			tripChallansForLooseCargo.controls.forEach((challan, index) => {				
				if (challan.get('tax').value == tax.id) {					
					let amountWithoutTax = Number(challan.value.freights)
					let freightTax = 0;
					let rate=amountWithoutTax
					let amountWithTax;
					tax.total = Number(Number(tax.total) + Number(amountWithoutTax));
					this.totals.looseCargo.freightTotal=(Number(this.totals.looseCargo.freightTotal) + Number(challan.value.freights)).toFixed(3)
					this.totals.looseCargo.chargesWttax=(Number(this.totals.looseCargo.chargesWttax) + Number(challan.value.charges_wt_tax)).toFixed(3)
					this.totals.looseCargo.chargesWotax=(Number(this.totals.looseCargo.chargesWotax) + Number(challan.value.charges_wo_tax)).toFixed(3)
					this.totals.looseCargo.deduction=(Number(this.totals.looseCargo.deduction) + Number(challan.value.deductions_wo_tax)).toFixed(3)
					if (this.isTransactionIncludesTax) {
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
						freightTax = (Number(((rate * Number(tax.value)) / (100 + Number(tax.value)))))
						amountWithTax = rate;
					} else {
						freightTax = (Number(tax.value / 100 * amountWithoutTax))
						amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
					}
					challan.get('freights_tax').setValue(freightTax.toFixed(3));
					let taxAmount = Number(freightTax) 
					challan.get('tax_amount').setValue(Number(taxAmount).toFixed(3));
					challan.get('total_amount').setValue(Number(amountWithTax).toFixed(3));
					challan.get('total').setValue(Number(amountWithTax).toFixed(3));
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(Number(amountWithTax) - Number(challan.get('tax_amount').value))).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(taxAmount)).toFixed(3);
					this.totals.looseCargo.totaltax=(Number(this.totals.looseCargo.totaltax) + Number(taxAmount)).toFixed(3)
					this.totals.looseCargo.totalAmount=(Number(this.totals.looseCargo.totalAmount) + Number(amountWithTax)).toFixed(3)
				}

			});
			

			craneTimeSheet.controls.forEach((sheet, index) => {

				if (crane.get('timesheet_tax').value == tax.id) {
					let amountWithoutTax = Number(sheet.value.billing_amount) + Number(sheet.value.extra_amount)
					let sheetTax = 0
					let rate=amountWithoutTax
				    let amountWithTax;
					if (this.isTransactionIncludesTax) {
						amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
						sheetTax = (Number(((rate * Number(tax.value)) / (100 + Number(tax.value)))))
						tax.total = Number(Number(tax.total) + Number(amountWithTax));
						amountWithTax = rate;
					} else {
						tax.total = Number(Number(tax.total) + Number(amountWithoutTax));
						amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
						sheetTax = (Number(tax.value / 100 * amountWithoutTax))
					}
					sheet.get('tax_amount').setValue(sheetTax.toFixed(3));
					sheet.get('amount').setValue(Number(amountWithTax).toFixed(3));
					sheet.get('amount_before_tax').setValue(amountWithoutTax)
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(sheetTax)).toFixed(3);
					this.totals.craneTimesheet.billingHoursTotal=(Number(this.totals.craneTimesheet.billingHoursTotal) + Number(sheet.value.billing_hours)).toFixed(3)
					this.totals.craneTimesheet.extraHoursTotal=(Number(this.totals.craneTimesheet.extraHoursTotal) + Number(sheet.value.extra_hours)).toFixed(3)
					this.totals.craneTimesheet.billingHoursAmountTotal=(Number(this.totals.craneTimesheet.billingHoursAmountTotal) + Number(sheet.value.billing_amount)).toFixed(3)
					this.totals.craneTimesheet.extraHoursAmountTotal=(Number(this.totals.craneTimesheet.extraHoursAmountTotal) + Number(sheet.value.extra_amount)).toFixed(3)
					this.totals.craneTimesheet.timeSheetTaxTotal=(Number(this.totals.craneTimesheet.timeSheetTaxTotal) + Number(sheetTax)).toFixed(3)
					this.totals.craneTimesheet.timeSheetSubTotal=(Number(this.totals.craneTimesheet.timeSheetSubTotal) + Number(amountWithTax)).toFixed(3)

				}

			});
			
			craneCharge.controls.forEach((charge, index) => {
				if (charge.get('tax').value == tax.id) {
					let amountWithoutTax = Number(charge.value['amount']) - Number(charge.value['discount']);
					let amountWithTax;
					let rate=amountWithoutTax
					let chargeTax=0.00
					this.totals.craneCharges.amountTotal= (Number(this.totals.craneCharges.amountTotal) + Number(charge.value['amount'])).toFixed(3)
					this.totals.craneCharges.discountTotal= (Number(this.totals.craneCharges.discountTotal) + Number(charge.value['discount'])).toFixed(3)
					charge.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if(this.isTransactionIncludesTax){
						    amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
							chargeTax =(Number(((rate *  Number(tax.value)) / (100 + Number(tax.value)))))
							amountWithTax=rate;
						}else{
							chargeTax=(Number(tax.value / 100 * amountWithoutTax))
							amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
						}
					    charge.get('amount_before_tax').setValue(amountWithoutTax);
						charge.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(chargeTax)).toFixed(3);
						this.totals.craneCharges.total= (Number(this.totals.craneCharges.total) + Number(amountWithTax)).toFixed(3)
						this.totals.craneCharges.taxTotal= (Number(this.totals.craneCharges.taxTotal) + Number(chargeTax)).toFixed(3)

					}
				}

			});
			looseCargoCharge.controls.forEach((charge, index) => {				
				if (charge.get('tax').value == tax.id) {
					let amountWithoutTax = Number(charge.value['amount']) - Number(charge.value['discount']);
					let rate=amountWithoutTax
					let amountWithTax;
					let chargeTax=0.00
					this.totals.looseCargoCharges.amountTotal= (Number(this.totals.looseCargoCharges.amountTotal) + Number(charge.value['amount'])).toFixed(3)
					this.totals.looseCargoCharges.discountTotal= (Number(this.totals.looseCargoCharges.discountTotal) + Number(charge.value['discount'])).toFixed(3)
					charge.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if(this.isTransactionIncludesTax){
							amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
							chargeTax =(Number(((rate *  Number(tax.value)) / (100 + Number(tax.value)))))
							amountWithTax=rate;
						}else{
							chargeTax=(Number(tax.value / 100 * amountWithoutTax))
							amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
						}
						charge.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(chargeTax)).toFixed(3);
						this.totals.looseCargoCharges.total= (Number(this.totals.looseCargoCharges.total) + Number(amountWithTax)).toFixed(3)
						this.totals.looseCargoCharges.taxTotal= (Number(this.totals.looseCargoCharges.taxTotal) + Number(chargeTax)).toFixed(3)

					}
				}

			});

			awpTimeSheet.controls.forEach((sheet, index) => {
				if (awp.get('timesheet_tax').value == tax.id) {
					let amountWithoutTax = Number(sheet.value.billing_amount) + Number(sheet.value.extra_amount)
					let sheetTax = 0
					let rate=amountWithoutTax
				    let amountWithTax;
					if(this.isTransactionIncludesTax){
					   amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
					   sheetTax = (Number(((rate *  Number(tax.value)) / (100 + Number(tax.value)))))
					   tax.total= Number(Number(tax.total) + Number(amountWithTax));
					   amountWithTax=rate;
					}else{
					    tax.total= Number(Number(tax.total) + Number(amountWithoutTax));
					    amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
					    sheetTax = (Number(tax.value / 100 * amountWithoutTax))
					}
					sheet.get('tax_amount').setValue(sheetTax.toFixed(3));
					sheet.get('amount').setValue(Number(amountWithTax).toFixed(3));
					sheet.get('amount_before_tax').setValue(amountWithoutTax)
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(sheetTax)).toFixed(3);
					this.totals.awpTimesheet.billingHoursTotal=(Number(this.totals.awpTimesheet.billingHoursTotal) + Number(sheet.value.billing_hours)).toFixed(3)
					this.totals.awpTimesheet.extraHoursTotal=(Number(this.totals.awpTimesheet.extraHoursTotal) + Number(sheet.value.extra_hours)).toFixed(3)
					this.totals.awpTimesheet.billingHoursAmountTotal=(Number(this.totals.awpTimesheet.billingHoursAmountTotal) + Number(sheet.value.billing_amount)).toFixed(3)
					this.totals.awpTimesheet.extraHoursAmountTotal=(Number(this.totals.awpTimesheet.extraHoursAmountTotal) + Number(sheet.value.extra_amount)).toFixed(3)
					this.totals.awpTimesheet.timeSheetTaxTotal=(Number(this.totals.awpTimesheet.timeSheetTaxTotal) + Number(sheetTax)).toFixed(3)
					this.totals.awpTimesheet.timeSheetSubTotal=(Number(this.totals.awpTimesheet.timeSheetSubTotal) + Number(amountWithTax)).toFixed(3)

				}

			});

			awpCharge.controls.forEach((charge, index) => {
				if (charge.get('tax').value == tax.id) {
					let amountWithoutTax = Number(charge.value['amount']) - Number(charge.value['discount']);
					let amountWithTax;
					let rate=amountWithoutTax
					let chargeTax=0.00
					this.totals.awpCharges.amountTotal= (Number(this.totals.awpCharges.amountTotal) + Number(charge.value['amount'])).toFixed(3)
					this.totals.awpCharges.discountTotal= (Number(this.totals.awpCharges.discountTotal) + Number(charge.value['discount'])).toFixed(3)
					if (isValidValue(amountWithoutTax)) {
					    if(this.isTransactionIncludesTax){
						    amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
							chargeTax =(Number(((rate *  Number(tax.value)) / (100 + Number(tax.value)))))
							amountWithTax=rate;
						}else{
							chargeTax=(Number(tax.value / 100 * amountWithoutTax))
							amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
						}
					    charge.get('amount_before_tax').setValue(amountWithoutTax);
						charge.get('total').setValue(amountWithTax);
						this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
					    this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
						this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(chargeTax)).toFixed(3);
						this.totals.awpCharges.total= (Number(this.totals.awpCharges.total) + Number(amountWithTax)).toFixed(3)
						this.totals.awpCharges.taxTotal= (Number(this.totals.awpCharges.taxTotal) + Number(chargeTax)).toFixed(3)

					}
				}

			});

			otherItems.controls.forEach((others) => {
				let amountWithoutTax = Number(others.get('total_before_tax').value);
				let rate=amountWithoutTax
				let amountWithTax;
				let othersTax=0.00
				if (others.get('tax').value == tax.id) {
					if (isValidValue(amountWithoutTax)){
						if(this.isTransactionIncludesTax){
							amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
							othersTax =(Number(((rate *  Number(tax.value)) / (100 + Number(tax.value)))))
							amountWithTax=rate;
						  }else{
							othersTax=(Number(tax.value / 100 * amountWithoutTax))
							amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
						  }
							others.get('total').setValue(amountWithTax.toFixed(3));
							this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
							this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
							this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(othersTax)).toFixed(3);
							this.totals.itemOther.total=(Number(this.totals.itemOther.total) + Number(amountWithTax)).toFixed(3);
							this.totals.itemOther.taxTotal=(Number(this.totals.itemOther.taxTotal)+ Number(othersTax)).toFixed(3) ;
							this.totals.itemOther.amountTotal=(Number(this.totals.itemOther.amountTotal) +  Number(others.get('total_before_tax').value)).toFixed(3);
					}
				
				}
			});


			containerCharge.controls.forEach((charge, index) => {				
				if (charge.get('tax').value == tax.id) {
					let amountWithoutTax = Number(charge.value['amount']) - Number(charge.value['discount']);
					let amountWithTax;
					let rate=amountWithoutTax;
					let chargeTax=0.00
					this.totals.containerCharges.amountTotal= (Number(this.totals.containerCharges.amountTotal) + Number(charge.value['amount'])).toFixed(3)
					this.totals.containerCharges.discountTotal= (Number(this.totals.containerCharges.discountTotal) + Number(charge.value['discount'])).toFixed(3)
					charge.get('amount_before_tax').setValue(amountWithoutTax);
					if (isValidValue(amountWithoutTax)) {
						if(this.isTransactionIncludesTax){
							amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
							chargeTax =(Number(((rate *  Number(tax.value)) / (100 + Number(tax.value)))))
							amountWithTax=rate;
						}else{
							chargeTax=(Number(tax.value / 100 * amountWithoutTax))
							amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
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
			tripChallansForContainer.controls.forEach((challan, index) => {				
				if (challan.get('tax').value == tax.id) {					
					let amountWithoutTax = Number(challan.value.freights)
					let freightTax = 0
					let amountWithTax;
					let rate=amountWithoutTax
					tax.total = Number(Number(tax.total) + Number(amountWithoutTax));
					this.totals.container.freightTotal=(Number(this.totals.container.freightTotal) + Number(challan.value.freights)).toFixed(3)
					this.totals.container.chargesWttax=(Number(this.totals.container.chargesWttax) + Number(challan.value.charges_wt_tax)).toFixed(3)
					this.totals.container.chargesWotax=(Number(this.totals.container.chargesWotax) + Number(challan.value.charges_wo_tax)).toFixed(3)
					this.totals.container.deduction=(Number(this.totals.container.deduction) + Number(challan.value.deductions_wo_tax)).toFixed(3)
					if(this.isTransactionIncludesTax){
						amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))));
						freightTax =(Number(((rate *  Number(tax.value)) / (100 + Number(tax.value)))))
						amountWithTax=rate;
					}else{
						freightTax=(Number(tax.value / 100 * amountWithoutTax))
						amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax);
					}
					challan.get('freights_tax').setValue(freightTax.toFixed(3));
					let taxAmount = Number(freightTax) 
					challan.get('tax_amount').setValue(Number(taxAmount).toFixed(3));
					challan.get('total_amount').setValue(Number(amountWithTax).toFixed(3));
					challan.get('total').setValue(Number(amountWithTax).toFixed(3));
					this.totals.subtotal = (Number(this.totals.subtotal) + Number(Number(amountWithTax) - Number(challan.get('tax_amount').value))).toFixed(3);
					this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
					this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(taxAmount)).toFixed(3);
					this.totals.container.totaltax=(Number(this.totals.container.totaltax) + Number(taxAmount)).toFixed(3)
					this.totals.container.totalAmount=(Number(this.totals.container.totalAmount) + Number(amountWithTax)).toFixed(3)
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
		looseCargoDeductions.controls.forEach((deductions, index) => {
			let totalAmount = Number(deductions.value['amount']) - Number(deductions.value['discount'])
			deductions.get('total').setValue(totalAmount.toFixed(3))
			this.totals.subtotal = (Number(this.totals.subtotal) - Number(totalAmount)).toFixed(3);
			this.totals.total = (Number(this.totals.total) - Number(totalAmount)).toFixed(3);
			this.totals.looseCargoDeduction.discountTotal=(Number(this.totals.looseCargoDeduction.discountTotal) + Number(deductions.value['discount'])).toFixed(3)
			this.totals.looseCargoDeduction.amountTotal=(Number(this.totals.looseCargoDeduction.amountTotal) +  Number(deductions.value['amount'])).toFixed(3)
			this.totals.looseCargoDeduction.total=(Number(this.totals.looseCargoDeduction.total)+ Number(totalAmount)).toFixed(3)
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
		
		

		this.calculateTotals();
	}

	calculateTotals() {
		const form = this.mechanicActivityForm;
		const discountAmount = form.get('discount').value;
		const discountAfterTaxAmount = form.get('discount_after_tax').value;
		const tds = Number(form.get('tds').value);

		if (isValidValue(discountAmount)) {
			this.totals.discountTotal =
				form.get('discount_type').value == 0
					? (discountAmount / 100 * this.totals.subtotal).toFixed(3)
					: discountAmount;
		} else {
			this.totals.discountTotal = 0.000;
		}
		this.mechanicActivityForm.controls.subtotal_before_tax.setValue(this.totals.subtotal);
		if (isValidValue(discountAfterTaxAmount)) {
			this.totals.discountAfterTaxTotal =
				form.get('discount_after_tax_type').value == 0
					? (Number(discountAfterTaxAmount) /
						100 *
						(Number(this.totals.total) -
							Number(this.totals.discountTotal))).toFixed(3)
					: discountAfterTaxAmount;
		} else {
			this.totals.discountAfterTaxTotal = 0.000;
		}

		form.get('discount_after_tax_amount').setValue(this.totals.discountAfterTaxTotal)
		this.totals.total = (this.totals.total -
			Number(this.totals.discountTotal) -
			Number(this.totals.discountAfterTaxTotal)).toFixed(3);

		const deductTdsAmount = Number(this.totals.subtotal) - Number(this.totals.discountTotal);
		this.totals.tdsAmount = (deductTdsAmount * tds / 100).toFixed(3);
		this.totals.balance = (Number(this.totals.total) -
										  Number(this.totals.tdsAmount)).toFixed(3);
			
        this.mechanicActivityForm.controls.total.setValue(this.totals.balance);
        this.mechanicActivityForm.controls.tax_amount.setValue(this.totals.taxTotal);
		form.get('tds_amount').setValue(this.totals.tdsAmount)
		
  }

	calculateItemOther(index) {
		const otherItems = this.mechanicActivityForm.controls['other_expenses']  as UntypedFormArray;
		let fuel_quantity = otherItems.at(index).get('quantity');
		let rate = otherItems.at(index).get('unit_cost');
		let amount = otherItems.at(index).get('total_before_tax').value;

		if (amount == 0) {
		  rate.setValue(0.000)
		  fuel_quantity.setValue(0.000);
		}
		if (rate.value == 0 && fuel_quantity.value == 0) {
		} else
		if (fuel_quantity.value == 0 && rate.value != 0) {
		  const setFuelQuantity = (Number(amount) / Number(rate.value)).toFixed(3);
		  fuel_quantity.setValue(setFuelQuantity);
		} else {
			const setRate = (Number(amount) / Number(fuel_quantity.value)).toFixed(3);
			rate.setValue(setRate);
		}
		this.onCalcuationsChanged();
	  }

  calculateItemOthersAmount(index) {
    const otherItems = this.mechanicActivityForm.controls['other_expenses']  as UntypedFormArray;
    let quantity = otherItems.at(index).get('quantity').value;
    let unit_cost = otherItems.at(index).get('unit_cost').value;
    let setamount = otherItems.at(index).get('total_before_tax');
    const  amount = (Number(quantity) *Number(unit_cost)).toFixed(3);
    setamount.setValue(amount);
    this.onCalcuationsChanged();
    }


      setAllTaxAsNonTaxable(){
        this.initialValues.tax.fill(getNonTaxableOption());
        this.initialValues.taxPercent.fill(getNonTaxableOption());
		this.initialValues.tripChallanTax.fill(getNonTaxableOption());
        const challans = this.mechanicActivityForm.controls['other_expenses'] as UntypedFormArray;
		// const jobExpense= this.mechanicActivityForm.get('trip_expenses') as UntypedFormArray;
        challans.controls.forEach((controls) => {
          controls.get('tax').setValue(this.defaultTax);
        });
		// jobExpense.controls.forEach((controls) => {
		// 	controls.get('tax').setValue(this.defaultTax);
		//   });
        this.mechanicActivityForm.get('discount_after_tax').setValue(0);
       }

       lastSectionOutPut(data){
        const form = this.mechanicActivityForm;
        form.get('tds_type').setValue(data['tds_type']);
        form.get('tds').setValue(data['tds']);
        this.onCalcuationsChanged();
      }

}

