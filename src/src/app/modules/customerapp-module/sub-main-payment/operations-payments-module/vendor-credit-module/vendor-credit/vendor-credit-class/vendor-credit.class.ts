import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import { isValidValue } from "src/app/shared-module/utilities/helper-utils";
import { groupBy } from 'lodash';







export class VendorCreditClass{

    editVendorCredit:UntypedFormGroup;
    isTransactionIncludesTax=false;


    vendorCreditTotals: any = {
		subtotal: 0,
		discountTotal: 0,
		taxes: [],
		discountAfterTaxTotal: 0,
		adjustmentAmount: 0,
		total: 0
	};

    onCalcuationsChanged() {
		let newItemExpenses = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
		this.vendorCreditTotals.subtotal = 0;
		this.vendorCreditTotals.total = 0;
		this.vendorCreditTotals.taxTotal = 0;
		this.vendorCreditTotals.taxes.forEach((tax) => {
			tax.total = 0;
			tax.taxAmount = 0;
			newItemExpenses.controls.forEach((newMaintainanceContol) => {
			if (tax.id === newMaintainanceContol.get('tax').value) {
					let amountWithoutTax = Number(newMaintainanceContol.get('total_before_tax').value);
					let rate = amountWithoutTax;
					if (isValidValue(amountWithoutTax)) {
						let amountWithTax;
						if (this.isTransactionIncludesTax) {
							amountWithoutTax =  Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
							amountWithTax = rate.toFixed(3);
						}
						else {
							amountWithTax = (((Number(tax.value) / 100) * Number(amountWithoutTax)) + Number(amountWithoutTax)).toFixed(3);
						}
						newMaintainanceContol.get('amount').setValue(amountWithTax);
						tax.total = (Number(tax.total) + Number(amountWithoutTax)).toFixed(3);
						tax.taxAmount = (Number(tax.taxAmount) + (Number(tax.value) / 100) * Number(rate)).toFixed(3);
						newMaintainanceContol.get('amount').setValue(amountWithTax);
						this.vendorCreditTotals.subtotal = (Number(this.vendorCreditTotals.subtotal) + Number(amountWithoutTax)).toFixed(3);
						this.vendorCreditTotals.total = (Number(this.vendorCreditTotals.total) + Number(amountWithTax)).toFixed(3);
						this.vendorCreditTotals.taxTotal = (Number(this.vendorCreditTotals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
					}

				}
			});
		});

		this.onCalcuationsCess();
	}


	calculateTotals() {
		const form = this.editVendorCredit;
		const discountAmount = form.get('discount').value;
		const discountAfterTaxAmount = form.get('discount_after_tax').value;
		const adjustmentAmount = form.get('adjustment').value;

		if (isValidValue(discountAmount)) {
			this.vendorCreditTotals.discountTotal =
				form.get('discount_type').value == 0
					? (Number(discountAmount) / 100 * Number(this.vendorCreditTotals.subtotal)).toFixed(3)
					: discountAmount;
		} else {
			this.vendorCreditTotals.discountTotal = 0;
    }
		this.editVendorCredit.controls.sub_total_without_tax.setValue(this.vendorCreditTotals.subtotal);
		if (isValidValue(discountAfterTaxAmount)) {
			this.vendorCreditTotals.discountAfterTaxTotal =
				form.get('discount_after_tax_type').value == 0
					? (Number(discountAfterTaxAmount) /
						100 *
						(Number(this.vendorCreditTotals.total) -
						Number(this.vendorCreditTotals.discountTotal))).toFixed(3)
					: discountAfterTaxAmount;
		} else {
			this.vendorCreditTotals.discountAfterTaxTotal = 0;
		}

		if (isValidValue(adjustmentAmount)) {
			this.vendorCreditTotals.adjustmentAmount =
				form.get('adjustment_choice').value == 0
					? ((Number(this.vendorCreditTotals.subtotal) -
					Number(this.vendorCreditTotals.discountTotal) +
					Number(this.vendorCreditTotals.taxTotal) -
					Number(this.vendorCreditTotals.discountAfterTaxTotal)) *
					Number(adjustmentAmount) /
					100).toFixed(3)
					: adjustmentAmount;
		} else {
			this.vendorCreditTotals.adjustmentAmount = 0;
		}

      this.vendorCreditTotals.total = (this.vendorCreditTotals.total -
        Number(this.vendorCreditTotals.discountTotal) -
        Number(this.vendorCreditTotals.discountAfterTaxTotal) +
		Number(this.vendorCreditTotals.adjustmentAmount)).toFixed(3);
	}

	calculateItemOther(index) {
		const otherItems = this.editVendorCredit.controls['vendor_items']  as UntypedFormArray;
		let fuel_quantity = otherItems.at(index).get('quantity');
		let rate = otherItems.at(index).get('rate');
		let amount = otherItems.at(index).get('amount').value;

		if (amount == 0) {
		  rate.setValue(0.00)
		  fuel_quantity.setValue(0.000);
		}

		if (rate.value == 0 && fuel_quantity.value == 0) {
		  return;
		}

		if (fuel_quantity.value == 0 && rate.value != 0) {
		  const setFuelQuantity = (amount / rate.value).toFixed(3);
		  fuel_quantity.setValue(setFuelQuantity);
		  return;
		}
		const setRate = (amount / fuel_quantity.value).toFixed(3);
		rate.setValue(setRate);
		this.onCalcuationsChanged();
	  }

    calculateItemOthersAmount(index) {
      const otherItems = this.editVendorCredit.controls['vendor_items']  as UntypedFormArray;
      let quantity = otherItems.at(index).get('quantity').value;
      let unit_cost = otherItems.at(index).get('rate').value;
      let setamount = otherItems.at(index).get('total_before_tax');
      const  amount = (quantity * unit_cost).toFixed(3);
      setamount.setValue(amount);
      this.onCalcuationsChanged();
    }

    onCalcuationsCess() {
        const newItemExpenses = this.editVendorCredit.controls['vendor_items'] as UntypedFormArray;
        this.vendorCreditTotals.cess = [];
        const groupedCess = groupBy(newItemExpenses.value, 'cess');
        for (const key in groupedCess) {
          const val = groupedCess[key];
          const obj = {
            cessPercent: val[0].cess,
            total: 0,
            cessValue: ''
          }
          for (const cessObj of val) {
            obj.total += Number(cessObj.amount);
          };
          obj.cessValue = ((Number(obj.cessPercent) / 100) * Number(obj.total)).toFixed(3);
          this.vendorCreditTotals.cess.push(obj);
        }
        this.calculateTotals();
      }



}