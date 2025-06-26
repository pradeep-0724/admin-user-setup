import { UntypedFormArray } from "@angular/forms";
import { UntypedFormGroup } from "@angular/forms";
import { isValidValue } from "src/app/shared-module/utilities/helper-utils";



export class FuelClass {

  addFuelForm: UntypedFormGroup;

  totals: any = {
    subtotal_challan: 0.0,
    subtotal_others: 0.0,
    subtotal: 0.0,
    discountAfterTaxTotal: 0,
    tdsAmount: 0,
    adjustmentAmount: 0,
    discountTotal: 0,
    advance_amount: 0.0,
    adjustment: 0.0,
    total: 0.0,
    tax: [],
    taxTotal: 0.0,
    taxes: [],
    balance: 0.0,
    totalItemQuantity:0.00,
    totalFuelQuantity:0.00
  };

  itemOthersTotal = {
    totalQuantity: 0,
    totalAmount: 0,
    total: 0
  }
  vehicleDetailsTotal = {
    totalQuantity: 0,
    totalAmount: 0,
    total: 0
  }
  unpaidFuelDetailsTotal = {
    totalQuantity: 0,
    totalAmount: 0,
    total: 0
  }

  calculateTotals() {
    const form = this.addFuelForm;
    const discountAmount = form.get('discount').value;
    const discountAfterTaxAmount = form.get('discount_after_tax').value;
    const adjustmentAmount = form.get('adjustment').value;
    const tds = Number(form.get('tds').value);

    if (isValidValue(discountAmount)) {
      this.totals.discountTotal =
        form.get('discount_type').value == 0
          ? (discountAmount / 100 * this.totals.subtotal).toFixed(3)
          : discountAmount;
    } else {
      this.totals.discountTotal = 0;
    }
    this.addFuelForm.controls.sub_total_without_tax.setValue(this.totals.subtotal);
    if (isValidValue(discountAfterTaxAmount)) {
      this.totals.discountAfterTaxTotal =
        form.get('discount_after_tax_type').value == 0
          ? (Number(discountAfterTaxAmount) /
            100 *
            (Number(this.totals.total) -
              Number(this.totals.discountTotal))).toFixed(3)
          : discountAfterTaxAmount;
    } else {
      this.totals.discountAfterTaxTotal = 0;
    }

    if (isValidValue(adjustmentAmount)) {
      this.totals.adjustmentAmount =
        form.get('adjustment_choice').value == 0
          ? ((Number(this.totals.subtotal) -
            Number(this.totals.discountTotal) +
            Number(this.totals.taxTotal) -
            Number(this.totals.discountAfterTaxTotal)) *
            Number(adjustmentAmount) /
            100).toFixed(3)
          : adjustmentAmount;
    } else {
      this.totals.adjustmentAmount = 0;
    }

    this.totals.total = (this.totals.total -
      Number(this.totals.discountTotal) -
      Number(this.totals.discountAfterTaxTotal) +
      Number(this.totals.adjustmentAmount)).toFixed(3);
    const deductTdsAmount = Number(this.totals.subtotal) - Number(this.totals.discountTotal);
    this.totals.tdsAmount = (deductTdsAmount * tds / 100).toFixed(3);
    this.totals.balance = (Number(this.totals.total) - Number(this.totals.tdsAmount)).toFixed(3);
    this.totals.totalFuelQuantity =this.vehicleDetailsTotal.totalQuantity + this.unpaidFuelDetailsTotal.totalQuantity
    this.totals.totalItemQuantity =this.itemOthersTotal.totalQuantity
  }


  calculationsChanged() {
    const vehicleDetails = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    const unpaidexpenses = this.addFuelForm.controls['unpaid_fuel_details'] as UntypedFormArray;
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    this.totals.subtotal_challan = 0;
    this.totals.subtotal_others = 0;
    this.totals.subtotal = 0;
    this.totals.total = 0;
    this.totals.taxTotal = 0;
    this.itemOthersTotal = {
      totalQuantity: 0,
      totalAmount: 0,
      total: 0
    }
    this.vehicleDetailsTotal = {
      totalQuantity: 0,
      totalAmount: 0,
      total: 0
    }
    this.unpaidFuelDetailsTotal = {
      totalQuantity: 0,
      totalAmount: 0,
      total: 0
    }

    this.totals.taxes.forEach((tax) => {
      tax.total = 0;
      tax.taxAmount = 0;

      otherItems.controls.forEach((others) => {
        let amountWithoutTax = Number(others.get('total_before_tax').value);
        let rate = amountWithoutTax;
        let amountWithTax;
        if (others.get('tax').value == tax.id) {
          if (isValidValue(amountWithoutTax)) {
            if (this.addFuelForm.controls['is_transaction_includes_tax'].value) {
              amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
              tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
              tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
              amountWithTax = rate.toFixed(3);
            }
            else {
              tax.total = tax.total + amountWithoutTax;
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
              amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
            }
            others.get('total').setValue(amountWithTax);
            this.totals.subtotal_others = (Number(this.totals.subtotal_others) +
              Number(amountWithoutTax)).toFixed(3);
            this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
            this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
          }
          this.itemOthersTotal.total = Number(this.itemOthersTotal.total) + Number(others.get('total').value)
          this.itemOthersTotal.totalAmount = Number(this.itemOthersTotal.totalAmount) + Number(others.get('total_before_tax').value)
          this.itemOthersTotal.totalQuantity = Number(this.itemOthersTotal.totalQuantity) + Number(others.get('quantity').value)
        }

      });

      vehicleDetails.controls.forEach((challan, index) => {
        let amountWithoutTax = Number(challan.get('total_before_tax').value);
        let rate = amountWithoutTax;
        let amountWithTax;
        if (challan.get('tax').value == tax.id) {
          if (isValidValue(amountWithoutTax)) {
            if (this.addFuelForm.controls['is_transaction_includes_tax'].value) {
              amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
              tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
              tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
              amountWithTax = rate.toFixed(3);
            }
            else {
              tax.total = tax.total + amountWithoutTax;
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
              amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
            }
            challan.get('total').setValue(amountWithTax);
            this.totals.subtotal_challan = (Number(this.totals.subtotal_challan) +
              Number(amountWithoutTax)).toFixed(3);
            this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
            this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
          }
          this.vehicleDetailsTotal.total = Number(this.vehicleDetailsTotal.total) + Number(challan.get('total').value)
          this.vehicleDetailsTotal.totalAmount = Number(this.vehicleDetailsTotal.totalAmount) + Number(challan.get('total_before_tax').value)
          this.vehicleDetailsTotal.totalQuantity = Number(this.vehicleDetailsTotal.totalQuantity) + Number(challan.get('quantity').value)
        }
      });

      unpaidexpenses.controls.forEach((challan, index) => {
        let amountWithoutTax = Number(challan.get('total_before_tax').value);
        let rate = amountWithoutTax;
        let amountWithTax;
        if (challan.get('tax').value == tax.id) {
          if (isValidValue(amountWithoutTax)) {
            if (this.addFuelForm.controls['is_transaction_includes_tax'].value) {
              amountWithoutTax = Number((amountWithoutTax * 100 / (100 + Number(tax.value))).toFixed(3));
              tax.total = Number((Number(tax.total) + Number(amountWithoutTax)).toFixed(3));
              tax.taxAmount = (Number(tax.taxAmount) + Number(((rate * Number(tax.value)) / (100 + Number(tax.value))))).toFixed(3);
              amountWithTax = rate.toFixed(3);
            }
            else {
              tax.total = tax.total + amountWithoutTax;
              tax.taxAmount = (Number(tax.taxAmount) + Number(tax.value / 100 * amountWithoutTax)).toFixed(3);
              amountWithTax = (tax.value / 100 * amountWithoutTax + amountWithoutTax).toFixed(3);
            }
            challan.get('total').setValue(amountWithTax);
            this.totals.subtotal_challan = (Number(this.totals.subtotal_challan) +
              Number(amountWithoutTax)).toFixed(3);
            this.totals.subtotal = (Number(this.totals.subtotal) + Number(amountWithoutTax)).toFixed(3);
            this.totals.total = (Number(this.totals.total) + Number(amountWithTax)).toFixed(3);
          }
          this.unpaidFuelDetailsTotal.total = Number(this.unpaidFuelDetailsTotal.total) + Number(challan.get('total').value)
          this.unpaidFuelDetailsTotal.totalAmount = Number(this.unpaidFuelDetailsTotal.totalAmount) + Number(challan.get('total_before_tax').value)
          this.unpaidFuelDetailsTotal.totalQuantity = Number(this.unpaidFuelDetailsTotal.totalQuantity) + Number(challan.get('quantity').value)
        }
      });
      this.totals.taxTotal = (Number(this.totals.taxTotal) + Number(tax.taxAmount)).toFixed(3);
    });
    this.calculateTotals();
  }

  // auto calulate rate or amount or quantity if any two value is entered
  calculateItemOther(index) {
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    let fuel_quantity = otherItems.at(index).get('quantity');
    let rate = otherItems.at(index).get('unit_cost');
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
    this.calculationsChanged();
  }

  calculateItemOthersAmount(index) {
    const otherItems = this.addFuelForm.controls['other_expenses'] as UntypedFormArray;
    let quantity = otherItems.at(index).get('quantity').value;
    let unit_cost = otherItems.at(index).get('unit_cost').value;
    let setamount = otherItems.at(index).get('total_before_tax');
    const amount = (quantity * unit_cost).toFixed(3);
    setamount.setValue(amount);
    this.calculationsChanged();
  }

  calculateVehicleDetailsAmount(index) {
    const otherItems = this.addFuelForm.controls['vehicle_details'] as UntypedFormArray;
    let quantity = otherItems.at(index).get('quantity').value;
    let unit_cost = otherItems.at(index).get('unit_cost').value;
    let setamount = otherItems.at(index).get('total_before_tax');
    const amount = (quantity * unit_cost).toFixed(3);
    setamount.setValue(amount);
    this.calculationsChanged();
  }

}
